/**
 * MoltyDEX Integration Template for TypeScript/JavaScript Agents
 * Copy this template and customize for your agent
 */

import { MoltyDEX, HTTPInterceptor } from '@moltydex/agent';

class AgentWithMoltyDEX {
  private dex: MoltyDEX;
  private interceptor: HTTPInterceptor;

  constructor(walletSecretKey: string) {
    // Initialize MoltyDEX
    this.dex = new MoltyDEX({
      apiUrl: process.env.MOLTYDEX_API_URL || 'https://api.moltydex.com',
      walletSecretKey,
    });

    // Setup HTTP interceptor for automatic 402 handling
    this.interceptor = new HTTPInterceptor({
      apiUrl: process.env.MOLTYDEX_API_URL || 'https://api.moltydex.com',
      walletSecretKey,
      autoSwap: true,
    });
  }

  /**
   * Make API request with automatic 402 handling
   */
  async makeApiRequest(
    url: string,
    options: RequestInit = {}
  ): Promise<any> {
    try {
      // HTTPInterceptor handles 402 automatically
      const response = await fetch(url, options);

      if (!response.ok) {
        if (response.status === 402) {
          // This shouldn't happen if interceptor is working
          // But handle it just in case
          console.error('402 Payment Required - should be handled by interceptor');
          return null;
        }
        console.error(`API request failed: ${response.status}`);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error(`Error making API request: ${error}`);
      return null;
    }
  }

  /**
   * Check token balance
   */
  async checkBalance(tokenMint?: string): Promise<any> {
    const walletAddress = this.dex.getWalletAddress();
    return await this.dex.getBalance(walletAddress, tokenMint);
  }

  /**
   * Execute token swap
   */
  async swapTokens(
    inputMint: string,
    outputMint: string,
    amount: number
  ): Promise<any> {
    return await this.dex.swap(inputMint, outputMint, amount);
  }

  /**
   * Get swap quote
   */
  async getQuote(
    inputMint: string,
    outputMint: string,
    amount: number
  ): Promise<any> {
    return await this.dex.quote(inputMint, outputMint, amount);
  }
}

// Example usage
async function main() {
  const walletSecretKey = process.env.WALLET_SECRET_KEY!;
  const agent = new AgentWithMoltyDEX(walletSecretKey);

  // Check balances
  const solBalance = await agent.checkBalance();
  console.log(`SOL Balance: ${solBalance.balance}`);

  // Make API request (handles 402 automatically)
  const data = await agent.makeApiRequest('https://premium-api.com/data');
  if (data) {
    console.log(`Data retrieved:`, data);
  }

  // Get quote if needed
  const quote = await agent.getQuote(
    'So11111111111111111111111111111111111111112', // SOL
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
    1_000_000_000 // 1 SOL
  );
  console.log(`Quote:`, quote);
}

main().catch(console.error);
