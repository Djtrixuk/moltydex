/**
 * x402 Auto-Pay Agent
 * Automatically handles 402 Payment Required responses
 */

import { MoltyDEXClient } from './MoltyDEXClient.js';
import { WalletManager } from './WalletManager.js';
import type {
  AgentConfig,
  PaymentResponse,
  AutoPayResult,
  PaymentRequirement,
} from './types.js';

const SOL_MINT = 'So11111111111111111111111111111111111111112';

export class X402AutoPayAgent {
  private moltydex: MoltyDEXClient;
  public wallet: WalletManager; // Made public for balance checking in examples
  private config: AgentConfig;
  private pendingTransactions: Map<string, Promise<AutoPayResult>> = new Map();

  constructor(config: AgentConfig) {
    this.config = {
      preferredInputToken: SOL_MINT,
      autoSwap: true,
      maxRetries: 3,
      retryDelay: 2000,
      ...config,
    };

    this.moltydex = new MoltyDEXClient(this.config.apiUrl);
    this.wallet = new WalletManager(this.config);
  }

  /**
   * Handle 402 Payment Required response
   * Main entry point for auto-pay functionality
   */
  async handle402(
    paymentResponse: PaymentResponse | any,
    retryOriginalRequest?: () => Promise<Response>
  ): Promise<AutoPayResult> {
    try {
      // Step 1: Parse payment requirements
      const parsed = await this.moltydex.parsePayment(paymentResponse);
      const requirement = parsed.recommended;

      console.log(`[x402] Payment required: ${requirement.amount} of token ${requirement.asset}`);

      // Step 2: Check balance
      const balance = await this.moltydex.getBalance(
        this.wallet.getAddress(),
        requirement.asset
      );

      const requiredAmount = BigInt(requirement.amount);
      const currentBalance = BigInt(balance.balance || '0');
      const hasEnough = currentBalance >= requiredAmount;

      let swapSignature: string | undefined;

      // Step 3: Swap if needed
      if (!hasEnough) {
        const shortfall = requiredAmount - currentBalance;
        console.log(`[x402] Insufficient balance. Current: ${currentBalance}, Required: ${requiredAmount}, Shortfall: ${shortfall}`);
        console.log(`[x402] Initiating swap...`);
        
        // Swap for the shortfall plus a small buffer (10% to account for fees/slippage)
        const swapAmount = (shortfall * BigInt(110)) / BigInt(100); // Add 10% buffer
        
        swapSignature = await this.swapToRequiredToken(
          requirement.asset,
          swapAmount.toString()
        );

        // Wait for swap confirmation
        await this.waitForConfirmation(swapSignature);
        console.log(`[x402] Swap confirmed: ${swapSignature}`);
        
        // Re-check balance after swap to ensure we have enough
        const newBalance = await this.moltydex.getBalance(
          this.wallet.getAddress(),
          requirement.asset
        );
        const newBalanceBigInt = BigInt(newBalance.balance || '0');
        console.log(`[x402] Balance after swap: ${newBalanceBigInt}`);
        
        if (newBalanceBigInt < requiredAmount) {
          throw new Error(
            `Insufficient balance after swap. Have: ${newBalanceBigInt}, Need: ${requiredAmount}. ` +
            `Swap may have failed or received less than expected.`
          );
        }
      }

      // Step 4: Make payment
      console.log(`[x402] Building payment transaction...`);
      console.log(`[x402] Recipient: ${requirement.address || requirement.token_mint}`);
      console.log(`[x402] Token: ${requirement.asset}`);
      console.log(`[x402] Amount: ${requirement.amount}`);
      
      const paymentSignature = await this.makePayment(requirement);
      console.log(`[x402] Payment sent: ${paymentSignature}`);

      // Step 5: Wait for payment confirmation
      await this.waitForConfirmation(paymentSignature);
      console.log(`[x402] Payment confirmed: ${paymentSignature}`);

      // Step 6: Retry original request if provided
      if (retryOriginalRequest) {
        console.log(`[x402] Retrying original request...`);
        const retryResponse = await retryOriginalRequest();
        console.log(`[x402] Original request completed with status: ${retryResponse.status}`);
      }

      return {
        success: true,
        payment_signature: paymentSignature,
        swap_signature: swapSignature,
        payment_proof: paymentSignature,
        message: 'Payment completed successfully',
      };
    } catch (error: any) {
      console.error(`[x402] Error handling payment:`, error);
      return {
        success: false,
        error: error.message || 'Unknown error',
        message: `Failed to process payment: ${error.message}`,
      };
    }
  }

  /**
   * Swap to required token
   * Note: requiredAmount is the OUTPUT amount we want to receive
   * We need to estimate how much INPUT (SOL) to swap to get that output
   */
  private async swapToRequiredToken(
    requiredToken: string,
    requiredAmount: string
  ): Promise<string> {
    const inputToken = this.config.preferredInputToken || SOL_MINT;

    // For now, we'll use a rough estimate: 1 USDC ≈ 0.007 SOL
    // Then get a quote and adjust if needed
    // Start with a conservative estimate
    const estimatedSOL = BigInt(requiredAmount) * BigInt(7000) / BigInt(1000000); // Rough estimate
    const minSOL = BigInt(10000000); // Minimum 0.01 SOL
    const inputAmount = estimatedSOL > minSOL ? estimatedSOL : minSOL;

    console.log(`[x402] Estimating swap: ${inputAmount} SOL → ~${requiredAmount} ${requiredToken}`);

    // Get quote - the API expects input amount
    const quote = await this.moltydex.getQuote(
      inputToken,
      requiredToken,
      inputAmount.toString(),
      50 // 0.5% slippage
    );

    console.log(`[x402] Swap quote: ${quote.input_amount} SOL → ${quote.output_after_fee} ${requiredToken} (fee: ${quote.fee_amount})`);

    // Check if output is enough, if not, increase input
    const outputAmount = BigInt(quote.output_after_fee);
    const requiredAmountBigInt = BigInt(requiredAmount);
    
    if (outputAmount < requiredAmountBigInt) {
      // Need more - increase input proportionally
      const ratio = (requiredAmountBigInt * BigInt(110)) / outputAmount; // Add 10% buffer
      const adjustedInput = (BigInt(quote.input_amount) * ratio) / BigInt(100);
      console.log(`[x402] Output insufficient, adjusting input to: ${adjustedInput}`);
      
      // Get new quote with adjusted amount
      const adjustedQuote = await this.moltydex.getQuote(
        inputToken,
        requiredToken,
        adjustedInput.toString(),
        50
      );
      
      console.log(`[x402] Adjusted quote: ${adjustedQuote.input_amount} SOL → ${adjustedQuote.output_after_fee} ${requiredToken}`);
      
      // Build transaction with adjusted quote
      const txData = await this.moltydex.buildSwapTransaction(
        this.wallet.getAddress(),
        inputToken,
        requiredToken,
        adjustedQuote.input_amount,
        50
      );
      
      const signedTx = await this.wallet.signTransaction(txData.transaction);
      const result = await this.moltydex.sendTransaction(signedTx);
      
      if (this.config.webhookUrl) {
        await this.moltydex.registerWebhook(
          result.signature,
          this.config.webhookUrl,
          { type: 'swap', required_token: requiredToken }
        );
      }
      
      return result.signature;
    }

    // Build transaction with original quote
    const txData = await this.moltydex.buildSwapTransaction(
      this.wallet.getAddress(),
      inputToken,
      requiredToken,
      quote.input_amount,
      50
    );

    // Sign transaction
    const signedTx = await this.wallet.signTransaction(txData.transaction);

    // Send transaction
    const result = await this.moltydex.sendTransaction(signedTx);

    // Register webhook if configured
    if (this.config.webhookUrl) {
      await this.moltydex.registerWebhook(
        result.signature,
        this.config.webhookUrl,
        { type: 'swap', required_token: requiredToken }
      );
    }

    return result.signature;
  }

  /**
   * Make payment transaction (SOL or SPL token)
   */
  private async makePayment(requirement: PaymentRequirement): Promise<string> {
    const recipientAddress = requirement.address || requirement.token_mint;
    
    if (!recipientAddress) {
      throw new Error('Payment requirement missing recipient address');
    }

    try {
      console.log(`[Payment] Building transaction for ${requirement.amount} of token ${requirement.asset}`);
      
      // WalletManager now handles both SOL and SPL token payments
      const paymentTx = await this.wallet.buildPaymentTransaction(
        recipientAddress,
        requirement.asset,
        requirement.amount
      );
      
      console.log(`[Payment] Transaction built, signing...`);
      const signedTx = await this.wallet.signTransaction(paymentTx);
      
      console.log(`[Payment] Transaction signed, sending...`);
      const result = await this.moltydex.sendTransaction(signedTx);
      
      if (!result.signature) {
        throw new Error('Transaction send failed: No signature returned');
      }
      
      console.log(`[Payment] Transaction submitted: ${result.signature}`);
      return result.signature;
    } catch (error: any) {
      console.error(`[Payment] Error creating payment:`, error);
      throw new Error(`Failed to create payment: ${error.message || JSON.stringify(error)}`);
    }
  }

  /**
   * Wait for transaction confirmation
   */
  private async waitForConfirmation(
    signature: string,
    maxWaitTime: number = 60000
  ): Promise<void> {
    const startTime = Date.now();
    const pollInterval = 2000; // 2 seconds

    while (Date.now() - startTime < maxWaitTime) {
      const status = await this.moltydex.getTransactionStatus(signature);

      if (status.confirmed) {
        console.log(`[x402] Transaction confirmed: ${signature}`);
        return;
      }

      if (status.error) {
        // Handle error object - it might be nested or a string
        let errorCode = 'UNKNOWN';
        let errorMsg = 'Transaction failed';
        
        if (typeof status.error === 'string') {
          errorMsg = status.error;
        } else if (typeof status.error === 'object') {
          // Try to extract code and message
          if (status.error.code) {
            errorCode = typeof status.error.code === 'string' 
              ? status.error.code 
              : JSON.stringify(status.error.code);
          }
          if (status.error.message) {
            errorMsg = typeof status.error.message === 'string'
              ? status.error.message
              : JSON.stringify(status.error.message);
          } else {
            // If no message, stringify the whole error
            errorMsg = JSON.stringify(status.error);
          }
        }
        
        console.error(`[x402] Transaction error: ${errorCode} - ${errorMsg}`);
        console.error(`[x402] Full status object:`, JSON.stringify(status, null, 2));
        console.error(`[x402] View transaction: https://solscan.io/tx/${signature}`);
        throw new Error(`Transaction failed: ${errorCode} - ${errorMsg}`);
      }
      
      // Check if status indicates failure (but no error object)
      if (status.status === 'failed' || status.status === 'error') {
        console.error(`[x402] Transaction status indicates failure: ${status.status}`);
        console.error(`[x402] View transaction: https://solscan.io/tx/${signature}`);
        throw new Error(`Transaction failed: Status ${status.status}`);
      }

      // Log status for debugging
      if (status.status && status.status !== 'pending') {
        console.log(`[x402] Transaction status: ${status.status}`);
      }

      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    console.error(`[x402] Transaction timeout: ${signature}`);
    console.error(`[x402] View transaction: https://solscan.io/tx/${signature}`);
    throw new Error(`Transaction confirmation timeout: ${signature}`);
  }

  /**
   * Get wallet address
   */
  getWalletAddress(): string {
    return this.wallet.getAddress();
  }
}
