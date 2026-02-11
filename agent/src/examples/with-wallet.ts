/**
 * Example: Using x402 Auto-Pay Agent with existing wallet
 * 
 * Usage:
 *   WALLET_SECRET_KEY="[1,2,3,...]" npm run example:wallet
 *   or
 *   WALLET_ADDRESS="..." WALLET_SECRET_KEY="..." npm run example:wallet
 */

import { X402AutoPayAgent } from '../X402AutoPayAgent.js';
import type { AgentConfig } from '../types.js';

async function main() {
  // Get wallet from environment variables
  const walletSecretKey = process.env.WALLET_SECRET_KEY;
  const walletAddress = process.env.WALLET_ADDRESS;
  const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

  if (!walletSecretKey) {
    console.error('❌ Error: WALLET_SECRET_KEY environment variable is required');
    console.error('\nUsage:');
    console.error('  WALLET_SECRET_KEY="[1,2,3,...]" npm run example:wallet');
    console.error('  or');
    console.error('  WALLET_SECRET_KEY="base58string" npm run example:wallet');
    console.error('\nTo get your secret key:');
    console.error('  - From Solana CLI: solana-keygen pubkey wallet.json (then use the secret key array)');
    console.error('  - From Phantom: Settings → Show Private Key → Copy');
    process.exit(1);
  }

  // Parse secret key (supports both JSON array and base58 string)
  let secretKey: number[] | string;
  try {
    // Try parsing as JSON array first
    secretKey = JSON.parse(walletSecretKey);
  } catch {
    // If not JSON, assume it's a base58 string
    secretKey = walletSecretKey;
  }

  // Configure the agent
  const config: AgentConfig = {
    apiUrl: process.env.MOLTYDEX_API_URL || 'https://api.moltydex.com',
    walletSecretKey: secretKey,
    walletAddress: walletAddress, // Optional: for verification
    preferredInputToken: 'So11111111111111111111111111111111111111112', // SOL
    autoSwap: true,
    rpcUrl: rpcUrl,
    webhookUrl: process.env.WEBHOOK_URL, // Optional: for transaction status updates
  };

  // Initialize agent
  const agent = new X402AutoPayAgent(config);
  const address = agent.getWalletAddress();
  console.log(`\n✅ [Agent] Initialized with wallet: ${address}`);
  
  // Check SOL balance
  try {
    const balance = await (agent.wallet as import('../WalletManager.js').WalletManager).getSOLBalance();
    const solBalance = Number(balance) / 1e9;
    console.log(`   Balance: ${solBalance.toFixed(4)} SOL`);
    
    if (solBalance < 0.01) {
      console.warn(`   ⚠️  Warning: Low balance. Recommended: at least 0.01 SOL for testing`);
    }
  } catch (error: any) {
    console.warn(`   ⚠️  Could not check balance: ${error.message}`);
  }

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
  console.log(`   Required: 1 USDC`);
  console.log(`   Payment address: ${mock402Response.accepts[0].address}`);
  
  // Handle payment
  const result = await agent.handle402(mock402Response);

  if (result.success) {
    console.log('\n✅ Payment successful!');
    console.log(`   Payment signature: ${result.payment_signature}`);
    if (result.swap_signature) {
      console.log(`   Swap signature: ${result.swap_signature}`);
    }
    console.log(`   Payment proof: ${result.payment_proof}`);
    console.log(`\n   View on Solscan:`);
    if (result.payment_signature) {
      console.log(`   https://solscan.io/tx/${result.payment_signature}`);
    }
  } else {
    console.error('\n❌ Payment failed:', result.error);
    console.error(`   Message: ${result.message}`);
  }
}

// Run example
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
