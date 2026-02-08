/**
 * HTTP Interceptor Example
 * Automatically intercepts 402 responses in fetch calls
 */

import { HTTPInterceptor } from '../HTTPInterceptor.js';
import type { AgentConfig } from '../types.js';

async function main() {
  // Configure the agent
  const config: AgentConfig = {
    apiUrl: 'https://api.moltydex.com',
    walletPath: process.env.WALLET_PATH || './wallet.json',
    preferredInputToken: 'So11111111111111111111111111111111111111112', // SOL
    autoSwap: true,
  };

  // Initialize HTTP interceptor (this modifies global fetch)
  const interceptor = new HTTPInterceptor(config);
  console.log(`[Interceptor] Initialized. Wallet: ${interceptor.getAgent().getWalletAddress()}`);

  // Now all fetch calls will automatically handle 402 responses!
  try {
    console.log('\n[Example] Making API call that requires payment...');
    
    // This would normally return 402, but the interceptor handles it automatically
    const response = await fetch('https://premium-api.com/data');
    
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

  // Restore original fetch when done
  // interceptor.restore();
}

main().catch(console.error);
