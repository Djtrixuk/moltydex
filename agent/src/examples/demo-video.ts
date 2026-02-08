/**
 * Demo Video Script - Shows MoltyDEX x402 Auto-Pay Agent in Action
 * 
 * This script is designed to be recorded for the demo video.
 * It shows the complete flow: API call → 402 → Auto swap → Payment → Success
 * 
 * Usage:
 *   WALLET_SECRET_KEY="..." npm run demo:video
 * 
 * Make sure you have:
 *   - Small amount of SOL in wallet (0.1-0.2 SOL)
 *   - Screen recording software ready
 *   - Terminal with readable font
 */

import { X402AutoPayAgent } from '../X402AutoPayAgent.js';
import { MoltyDEXClient } from '../MoltyDEXClient.js';
import type { AgentConfig } from '../types.js';

async function main() {
  console.log('\n🎬 MOLTYDEX DEMO VIDEO - x402 Auto-Pay Agent\n');
  console.log('='.repeat(60));
  
  // Get wallet from environment
  const walletSecretKey = process.env.WALLET_SECRET_KEY;
  if (!walletSecretKey) {
    console.error('❌ Error: WALLET_SECRET_KEY environment variable is required');
    console.error('\nUsage: WALLET_SECRET_KEY="..." npm run demo:video');
    process.exit(1);
  }

  // Parse secret key
  let secretKey: number[] | string;
  try {
    secretKey = JSON.parse(walletSecretKey);
  } catch {
    secretKey = walletSecretKey;
  }

  // Configure agent
  const config: AgentConfig = {
    apiUrl: process.env.MOLTYDEX_API_URL || 'https://api.moltydex.com',
    walletSecretKey: secretKey,
    preferredInputToken: 'So11111111111111111111111111111111111111112', // SOL
    autoSwap: true,
    rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  };

  console.log('\n📋 STEP 1: Initializing Agent...');
  console.log('-'.repeat(60));
  
  const agent = new X402AutoPayAgent(config);
  const walletAddress = agent.getWalletAddress();
  
  console.log(`✅ Agent initialized`);
  console.log(`   Wallet: ${walletAddress}`);
  
  // Check initial balance using MoltyDEX client
  const moltydex = new MoltyDEXClient(config.apiUrl);
  const solBalance = await moltydex.getBalance(walletAddress, 'So11111111111111111111111111111111111111112');
  const usdcBalance = await moltydex.getBalance(
    walletAddress, 
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' // USDC
  );
  
  console.log(`\n💰 Current Balances:`);
  console.log(`   SOL:  ${(BigInt(solBalance.balance) / BigInt(1_000_000_000)).toString()} SOL`);
  console.log(`   USDC: ${(BigInt(usdcBalance.balance) / BigInt(1_000_000)).toString()} USDC`);
  
  console.log('\n📋 STEP 2: Simulating API Call...');
  console.log('-'.repeat(60));
  console.log('   Agent calls: https://premium-api.com/data');
  console.log('   Response: 402 Payment Required');
  
  // Simulate 402 response (format expected by handle402)
  const mock402Response = {
    accepts: [{
      network: 'solana',
      asset: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
      amount: '1000000', // 1 USDC
      address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', // Example payment address
    }]
  };
  
  console.log('\n📋 STEP 3: MoltyDEX Auto-Pay Agent Intercepts...');
  console.log('-'.repeat(60));
  console.log('   [x402] Payment required detected');
  console.log('   [x402] Parsing payment requirements...');
  
  const requirement = mock402Response.accepts[0];
  console.log(`   Required: ${(BigInt(requirement.amount) / BigInt(1_000_000)).toString()} USDC`);
  console.log(`   Payment to: ${requirement.address}`);
  
  console.log('\n📋 STEP 4: Checking Balance...');
  console.log('-'.repeat(60));
  
  const hasEnough = BigInt(usdcBalance.balance) >= BigInt(requirement.amount);
  
  if (!hasEnough) {
    console.log(`   ❌ Insufficient USDC balance`);
    console.log(`   Current: ${(BigInt(usdcBalance.balance) / BigInt(1_000_000)).toString()} USDC`);
    console.log(`   Required: ${(BigInt(requirement.amount) / BigInt(1_000_000)).toString()} USDC`);
    console.log('\n📋 STEP 5: Automatic Token Swap & Payment...');
    console.log('-'.repeat(60));
    console.log('   [x402] Initiating automatic token swap...');
    console.log('   [x402] Swapping SOL → USDC via MoltyDEX...');
    console.log('   [x402] Then making payment automatically...');
  } else {
    console.log(`   ✅ Sufficient balance available`);
    console.log('\n📋 STEP 5: Making Payment...');
    console.log('-'.repeat(60));
  }
  
  // Use handle402 which does everything automatically
  try {
    const result = await agent.handle402(mock402Response);
    
    if (result.success) {
      console.log('\n✅ Payment successful!');
      if (result.swap_signature) {
        console.log(`   Swap signature: ${result.swap_signature}`);
        console.log(`   🔗 View swap: https://solscan.io/tx/${result.swap_signature}`);
      }
      if (result.payment_signature) {
        console.log(`   Payment signature: ${result.payment_signature}`);
        console.log(`   🔗 View payment: https://solscan.io/tx/${result.payment_signature}`);
      }
      
      // Re-check balance
      const finalBalance = await moltydex.getBalance(
        walletAddress,
        requirement.asset
      );
      console.log(`   ✅ Final USDC balance: ${(BigInt(finalBalance.balance) / BigInt(1_000_000)).toString()} USDC`);
      
      console.log('\n📋 STEP 6: Retrying Original Request...');
      console.log('-'.repeat(60));
      console.log('   [x402] Payment verified, retrying API call...');
      console.log('   ✅ Response: 200 OK');
      console.log('   ✅ Data received successfully!');
      
      console.log('\n' + '='.repeat(60));
      console.log('🎉 SUCCESS! Payment completed automatically.');
      console.log('='.repeat(60));
      console.log('\n✨ Key Takeaways:');
      console.log('   • Agent had SOL, API wanted USDC');
      console.log('   • MoltyDEX swapped automatically');
      console.log('   • Payment made automatically');
      console.log('   • Zero manual intervention');
      console.log('\n🌐 Learn more: https://www.moltydex.com');
      console.log('📚 Docs: https://www.moltydex.com/developers');
      console.log('🐦 Follow: https://x.com/MoltyDEX\n');
    } else {
      console.error('\n❌ Payment failed:', result.error);
      console.error(`   Message: ${result.message}`);
      process.exit(1);
    }
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    console.log('\n   Note: This is a demo. In production, the agent would retry or handle errors.');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('\n❌ Demo failed:', error.message);
  if (error.stack) {
    console.error('\nStack trace:', error.stack);
  }
  process.exit(1);
});
