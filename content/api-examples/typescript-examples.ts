/**
 * MoltyDEX TypeScript SDK Examples
 * Complete examples for common use cases
 */

import { MoltyDEX, HTTPInterceptor } from '@moltydex/agent';

// Initialize MoltyDEX
const dex = new MoltyDEX({
  apiUrl: 'https://api.moltydex.com',
  walletSecretKey: process.env.WALLET_SECRET_KEY!,
});

// Example 1: Get a Quote
async function exampleGetQuote() {
  const quote = await dex.quote(
    'So11111111111111111111111111111111111111112', // SOL
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
    1_000_000_000 // 1 SOL in lamports
  );
  
  console.log(`Input: 1 SOL`);
  console.log(`Output: ${quote.outputAmount} USDC`);
  console.log(`Price Impact: ${quote.priceImpact || 'N/A'}%`);
  
  return quote;
}

// Example 2: Execute a Swap
async function exampleExecuteSwap() {
  const result = await dex.swap(
    'So11111111111111111111111111111111111111112', // SOL
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
    1_000_000_000 // 1 SOL
  );
  
  console.log('Swap successful!');
  console.log(`Transaction: ${result.signature}`);
  console.log(`Output: ${result.outputAmount} USDC`);
  
  return result;
}

// Example 3: Check Balance
async function exampleCheckBalance() {
  const solBalance = await dex.getBalance(
    'YOUR_WALLET_ADDRESS',
    undefined // undefined for SOL
  );
  console.log(`SOL Balance: ${solBalance.balance} SOL`);
  
  const usdcBalance = await dex.getBalance(
    'YOUR_WALLET_ADDRESS',
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' // USDC
  );
  console.log(`USDC Balance: ${usdcBalance.balance} USDC`);
  
  return { solBalance, usdcBalance };
}

// Example 4: Handle x402 Payment Automatically
async function exampleX402Payment() {
  // Setup interceptor
  const interceptor = new HTTPInterceptor({
    apiUrl: 'https://api.moltydex.com',
    walletSecretKey: process.env.WALLET_SECRET_KEY!,
    autoSwap: true,
  });
  
  // Make request - handles 402 automatically
  const response = await fetch('https://premium-api.com/data');
  
  if (response.ok) {
    const data = await response.json();
    console.log('Data retrieved successfully!');
    return data;
  } else {
    console.error(`Error: ${response.status}`);
    return null;
  }
}

// Example 5: Batch Operations
async function exampleBatchOperations() {
  const balances = await dex.batchBalances(
    'YOUR_WALLET_ADDRESS',
    [
      'So11111111111111111111111111111111111111112', // SOL
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
      'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
    ]
  );
  
  balances.forEach(balance => {
    console.log(`${balance.tokenMint}: ${balance.balance}`);
  });
  
  return balances;
}

// Example 6: Error Handling
async function exampleErrorHandling() {
  try {
    const quote = await dex.quote(
      'INVALID_MINT',
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      1_000_000_000
    );
    return quote;
  } catch (error) {
    console.error(`Error getting quote: ${error}`);
    // Handle error - maybe try different token, or notify user
    return null;
  }
}

// Example 7: Custom Slippage
async function exampleCustomSlippage() {
  const quote = await dex.quote(
    'So11111111111111111111111111111111111111112',
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    1_000_000_000,
    { slippageBps: 50 } // 0.5% slippage
  );
  
  return quote;
}

// Example 8: Swap with Retry
async function exampleSwapWithRetry(maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await dex.swap(
        'So11111111111111111111111111111111111111112',
        'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        1_000_000_000
      );
      return result;
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error;
      }
      console.log(`Attempt ${attempt + 1} failed: ${error}`);
      await new Promise(resolve => setTimeout(resolve, 2 ** attempt * 1000)); // Exponential backoff
    }
  }
}

// Run examples
async function main() {
  console.log('Example 1: Get Quote');
  await exampleGetQuote();
  
  console.log('\nExample 2: Check Balance');
  await exampleCheckBalance();
  
  // Uncomment to execute swaps (requires wallet with funds)
  // console.log('\nExample 3: Execute Swap');
  // await exampleExecuteSwap();
}

main().catch(console.error);
