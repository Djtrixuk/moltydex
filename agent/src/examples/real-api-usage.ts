/**
 * Real-World Example: Using x402 Auto-Pay Agent with Actual APIs
 * 
 * This shows how to use the agent with real APIs that return 402 Payment Required
 */

import { HTTPInterceptor } from '../HTTPInterceptor.js';
import type { AgentConfig } from '../types.js';

async function main() {
  // Configure the agent
  const config: AgentConfig = {
    apiUrl: 'https://api.moltydex.com',
    walletSecretKey: process.env.WALLET_SECRET_KEY || '',
    preferredInputToken: 'So11111111111111111111111111111111111111112', // SOL
    autoSwap: true,
  };

  if (!process.env.WALLET_SECRET_KEY) {
    console.error('❌ Error: WALLET_SECRET_KEY environment variable is required');
    process.exit(1);
  }

  // Initialize HTTP interceptor
  // This modifies global fetch() to automatically handle 402 responses
  const interceptor = new HTTPInterceptor(config);
  console.log(`✅ [Agent] Initialized. Wallet: ${interceptor.getAgent().getWalletAddress()}`);
  console.log(`\n📡 [Agent] HTTP interceptor active - all fetch() calls will handle 402 automatically!\n`);

  // Example 1: Call a premium API that requires payment
  try {
    console.log('[Example 1] Calling premium API...');
    const response = await fetch('https://premium-api.example.com/data');
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API call successful!');
      console.log('   Data:', data);
    } else {
      console.error(`❌ API call failed: ${response.status}`);
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }

  // Example 2: Make multiple API calls (each might require payment)
  try {
    console.log('\n[Example 2] Making multiple API calls...');
    const urls = [
      'https://api.example.com/endpoint1',
      'https://api.example.com/endpoint2',
      'https://api.example.com/endpoint3',
    ];

    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ ${url}: Success`);
        } else {
          console.log(`⚠️  ${url}: Status ${response.status}`);
        }
      } catch (error: any) {
        console.error(`❌ ${url}: ${error.message}`);
      }
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }

  // Example 3: Use in your own agent/service
  console.log('\n[Example 3] Using in your own code...');
  console.log(`
    // The interceptor is already active, so just use fetch() normally:
    
    async function myAgentFunction() {
      // This will automatically handle 402 if the API requires payment
      const response = await fetch('https://some-api.com/data');
      const data = await response.json();
      return data;
    }
    
    // No need to manually handle 402 - the agent does it automatically!
  `);

  console.log('\n💡 Tips:');
  console.log('   - The agent automatically handles 402 responses');
  console.log('   - It swaps tokens if needed');
  console.log('   - It makes payments automatically');
  console.log('   - Your code just needs to call fetch() normally');
  console.log('   - Check your wallet balance to see payments made');
}

main().catch(console.error);
