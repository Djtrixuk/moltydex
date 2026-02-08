/**
 * Basic Example: Using x402 Auto-Pay Agent
 */

import { X402AutoPayAgent } from '../X402AutoPayAgent.js';
import type { AgentConfig } from '../types.js';

async function main() {
  // Configure the agent
  const config: AgentConfig = {
    apiUrl: 'https://api.moltydex.com',
    walletPath: process.env.WALLET_PATH || './wallet.json',
    preferredInputToken: 'So11111111111111111111111111111111111111112', // SOL
    autoSwap: true,
    webhookUrl: process.env.WEBHOOK_URL, // Optional: for transaction status updates
  };

  // Initialize agent
  const agent = new X402AutoPayAgent(config);
  console.log(`[Agent] Initialized with wallet: ${agent.getWalletAddress()}`);

  // Example: Simulate a 402 response
  const mock402Response = {
    accepts: [
      {
        network: 'solana',
        asset: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
        amount: '1000000', // 1 USDC (6 decimals)
        address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      },
    ],
  };

  console.log('\n[Example] Handling 402 Payment Required...');
  
  // Handle payment
  const result = await agent.handle402(mock402Response);

  if (result.success) {
    console.log('\n✅ Payment successful!');
    console.log(`   Payment signature: ${result.payment_signature}`);
    if (result.swap_signature) {
      console.log(`   Swap signature: ${result.swap_signature}`);
    }
    console.log(`   Payment proof: ${result.payment_proof}`);
  } else {
    console.error('\n❌ Payment failed:', result.error);
  }
}

// Run example
main().catch(console.error);
