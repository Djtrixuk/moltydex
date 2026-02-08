/**
 * MoltyDEX TypeScript Example
 * 
 * Complete example showing how to use MoltyDEX in TypeScript/Node.js
 */

import axios from 'axios';

// Configuration
const MOLTYDEX_API = 'https://api.moltydex.com';
const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';

// Token addresses
const SOL = 'So11111111111111111111111111111111111111112';
const USDC = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

interface QuoteResult {
  inputAmount: string;
  outputAmount: string;
  feeAmount: string;
  priceImpact: string;
}

interface SwapResult {
  transaction: string;
  signature?: string;
  feeAmount: string;
}

class MoltyDEX {
  private apiUrl: string;

  constructor(apiUrl: string = MOLTYDEX_API) {
    this.apiUrl = apiUrl;
  }

  /**
   * Get a quote for a token swap
   */
  async quote(
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number = 50
  ): Promise<QuoteResult> {
    const response = await axios.get(`${this.apiUrl}/api/quote`, {
      params: {
        input_mint: inputMint,
        output_mint: outputMint,
        amount: amount.toString(),
        slippage_bps: slippageBps.toString(),
      },
    });

    return {
      inputAmount: response.data.input_amount,
      outputAmount: response.data.output_amount,
      feeAmount: response.data.fee_amount,
      priceImpact: response.data.price_impact,
    };
  }

  /**
   * Build a swap transaction
   */
  async buildSwap(
    walletAddress: string,
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number = 50
  ): Promise<SwapResult> {
    const response = await axios.post(`${this.apiUrl}/api/swap/build`, {
      wallet_address: walletAddress,
      input_mint: inputMint,
      output_mint: outputMint,
      amount: amount.toString(),
      slippage_bps: slippageBps.toString(),
    });

    return {
      transaction: response.data.transaction,
      feeAmount: response.data.fee_amount,
    };
  }

  /**
   * Check token balance
   */
  async balance(walletAddress: string, tokenMint: string): Promise<number> {
    const response = await axios.get(`${this.apiUrl}/api/balance`, {
      params: {
        wallet_address: walletAddress,
        token_mint: tokenMint,
      },
    });

    return parseInt(response.data.balance || '0');
  }
}

/**
 * X402 Payment Handler
 */
class X402PaymentHandler {
  private dex: MoltyDEX;
  private walletAddress: string;

  constructor(walletAddress: string, apiUrl?: string) {
    this.dex = new MoltyDEX(apiUrl);
    this.walletAddress = walletAddress;
  }

  /**
   * Handle a 402 Payment Required response
   */
  async handle402Response(
    response: Response,
    originalUrl: string
  ): Promise<Response> {
    if (response.status !== 402) {
      return response;
    }

    // Parse payment requirements
    const paymentInfo = await this.parse402Response(response);

    // Check balance
    const balance = await this.dex.balance(
      this.walletAddress,
      paymentInfo.token
    );
    const requiredAmount = parseInt(paymentInfo.amount);

    // Swap if needed
    if (balance < requiredAmount) {
      console.log('Insufficient balance, swapping tokens...');
      await this.swapTokens(SOL, paymentInfo.token, requiredAmount);
    }

    // Make payment (simplified - actual implementation would create transaction)
    const paymentSignature = await this.makePayment(paymentInfo);

    // Retry original request with payment proof
    return fetch(originalUrl, {
      headers: {
        'X-Payment': paymentSignature,
        'X-Payment-Amount': paymentInfo.amount,
        'X-Payment-Token': paymentInfo.token,
      },
    });
  }

  private async parse402Response(response: Response): Promise<{
    token: string;
    amount: string;
    network: string;
  }> {
    const data = await response.json();
    const accepts = data.accepts || [];

    // Find Solana payment option
    for (const option of accepts) {
      if (option.scheme === 'solana') {
        return {
          token: option.token,
          amount: option.amount,
          network: option.network || 'mainnet',
        };
      }
    }

    throw new Error('No Solana payment option found');
  }

  private async swapTokens(
    inputToken: string,
    outputToken: string,
    amount: number
  ): Promise<void> {
    const swap = await this.dex.buildSwap(
      this.walletAddress,
      inputToken,
      outputToken,
      amount
    );

    // Sign and send transaction (simplified)
    console.log('Swap transaction:', swap.transaction);
    // In production, you'd sign and send this transaction
  }

  private async makePayment(paymentInfo: {
    token: string;
    amount: string;
  }): Promise<string> {
    // Create and send payment transaction
    // Return transaction signature
    return 'payment_signature_here';
  }
}

// Example usage
async function main() {
  const dex = new MoltyDEX();

  // Get a quote
  const quote = await dex.quote(SOL, USDC, 1_000_000_000); // 1 SOL
  console.log(`Quote: ${quote.outputAmount} USDC`);
  console.log(`Fee: ${quote.feeAmount}`);

  // Handle x402 payment
  const handler = new X402PaymentHandler('YourWalletAddress');
  const response = await fetch('https://api.example.com/data');

  if (response.status === 402) {
    const paidResponse = await handler.handle402Response(
      response,
      'https://api.example.com/data'
    );
    const data = await paidResponse.json();
    console.log('Got data:', data);
  }
}

export { MoltyDEX, X402PaymentHandler };
