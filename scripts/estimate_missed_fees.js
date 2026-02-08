/**
 * Estimate Missed Fees Calculator
 * 
 * This script attempts to estimate fees that were missed due to FEE_WALLET not being configured.
 * 
 * Since swaps aren't tracked in a database, we need to:
 * 1. Check Vercel logs (if accessible)
 * 2. Query Solana for Jupiter swap transactions
 * 3. Estimate based on API usage patterns
 */

// Try to load from api/node_modules first, then root
const path = require('path');
const fs = require('fs');

let axios;
try {
  // Try api/node_modules first
  const apiAxiosPath = path.join(__dirname, '../api/node_modules/axios');
  if (fs.existsSync(apiAxiosPath)) {
    axios = require(apiAxiosPath);
  } else {
    axios = require('axios');
  }
} catch (e) {
  // Fallback to fetch
  axios = {
    get: async (url, config) => {
      const response = await fetch(url, { ...config });
      return { data: await response.json(), status: response.status };
    }
  };
}

let Connection, PublicKey;
try {
  const apiSolanaPath = path.join(__dirname, '../api/node_modules/@solana/web3.js');
  if (fs.existsSync(apiSolanaPath)) {
    const solana = require(apiSolanaPath);
    Connection = solana.Connection;
    PublicKey = solana.PublicKey;
  } else {
    const solana = require('@solana/web3.js');
    Connection = solana.Connection;
    PublicKey = solana.PublicKey;
  }
} catch (e) {
  // Solana SDK not available - skip Solana queries
  Connection = null;
  PublicKey = null;
}

const FEE_BPS = 10; // 0.1%
const FEE_WALLET = 'ATYWjod5jkQm5RxrC65irY8e97UUY42LFM45ZGuNK3JL';
const API_URL = process.env.API_URL || 'https://api.moltydex.com';
const SOLANA_RPC = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

/**
 * Method 1: Check API health for usage stats (if available)
 */
async function checkApiUsage() {
  try {
    console.log('📊 Checking API usage statistics...\n');
    const response = await axios.get(`${API_URL}/api/health`);
    
    if (response.data.usage_stats) {
      console.log('✅ Found usage statistics:');
      console.log(JSON.stringify(response.data.usage_stats, null, 2));
      return response.data.usage_stats;
    }
    
    console.log('ℹ️  No usage statistics available in health endpoint\n');
    return null;
  } catch (error) {
    console.log('⚠️  Could not fetch API usage stats:', error.message);
    return null;
  }
}

/**
 * Method 2: Estimate based on fee wallet transactions
 * If any transactions exist on the fee wallet, they might be fee transfers
 */
async function checkFeeWalletTransactions() {
  try {
    console.log('🔍 Checking fee wallet transaction history...\n');
    const response = await axios.get(`${API_URL}/api/transaction/history/${FEE_WALLET}`, {
      params: { limit: 100 }
    });
    
    const transactions = response.data.transactions || [];
    const confirmedTxs = transactions.filter(tx => tx.confirmed && !tx.error);
    
    console.log(`📈 Found ${confirmedTxs.length} confirmed transactions on fee wallet`);
    
    if (confirmedTxs.length === 0) {
      console.log('   → No fee collections detected (expected if FEE_WALLET was not configured)\n');
      return { count: 0, totalFees: 0 };
    }
    
    // Calculate total fees collected
    // Note: This is approximate - actual fee amounts would be in token transfers
    let totalFees = 0;
    confirmedTxs.forEach(tx => {
      if (tx.fee) {
        totalFees += tx.fee; // Transaction fees, not swap fees
      }
    });
    
    console.log(`   → Total transaction fees: ${totalFees / 1e9} SOL\n`);
    return { count: confirmedTxs.length, totalFees };
  } catch (error) {
    console.log('⚠️  Could not fetch fee wallet transactions:', error.message);
    return null;
  }
}

/**
 * Method 3: Query Solana for Jupiter swap transactions
 * This is complex and may not be accurate, but we can try to identify patterns
 */
async function estimateJupiterSwaps() {
  try {
    console.log('🔍 Attempting to identify Jupiter swap transactions...\n');
    console.log('⚠️  Note: This method is approximate and may not capture all swaps\n');
    
    // Jupiter program ID
    const JUPITER_PROGRAM_ID = 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4'; // Jupiter v6
    
    const connection = new Connection(SOLANA_RPC, 'confirmed');
    const programId = new PublicKey(JUPITER_PROGRAM_ID);
    
    // Get recent signatures for Jupiter program
    // Note: This requires a lot of RPC calls and may hit rate limits
    console.log('   → Querying Solana for Jupiter program transactions...');
    console.log('   → This may take a while and may not be accurate...\n');
    
    // For now, we'll skip this as it's resource-intensive
    // In production, you'd want to use a service like Helius or QuickNode
    // that provides transaction history APIs
    
    return null;
  } catch (error) {
    console.log('⚠️  Could not query Jupiter swaps:', error.message);
    return null;
  }
}

/**
 * Calculate estimated missed fees
 */
function calculateMissedFees(swapVolume, feeBps = FEE_BPS) {
  if (!swapVolume || swapVolume === 0) return 0;
  return (swapVolume * feeBps) / 10000;
}

/**
 * Main estimation function
 */
async function estimateMissedFees() {
  console.log('💰 MoltyDEX Missed Fees Estimator\n');
  console.log('=' .repeat(60));
  console.log(`Fee Rate: ${FEE_BPS} bps (${FEE_BPS / 100}%)`);
  console.log(`Fee Wallet: ${FEE_WALLET}`);
  console.log('=' .repeat(60) + '\n');
  
  // Method 1: Check API usage stats
  const usageStats = await checkApiUsage();
  
  // Method 2: Check fee wallet transactions
  const feeWalletData = await checkFeeWalletTransactions();
  
  // Method 3: Jupiter swaps (skipped for now)
  // const jupiterSwaps = await estimateJupiterSwaps();
  
  console.log('\n📊 ESTIMATION SUMMARY\n');
  console.log('=' .repeat(60));
  
  if (usageStats) {
    console.log('✅ API Usage Statistics Available');
    console.log(`   Total Quotes: ${usageStats.total_quotes || 'N/A'}`);
    console.log(`   Total Swaps: ${usageStats.total_swaps || 'N/A'}`);
    console.log(`   Total Volume: ${usageStats.total_volume || 'N/A'}`);
    
    if (usageStats.total_volume) {
      const missedFees = calculateMissedFees(usageStats.total_volume);
      console.log(`\n   💸 Estimated Missed Fees: ${missedFees} (in output token units)`);
    }
  } else {
    console.log('⚠️  No usage statistics available');
    console.log('   → Consider adding analytics/logging to track swaps');
  }
  
  if (feeWalletData && feeWalletData.count === 0) {
    console.log('\n✅ Fee Wallet Status:');
    console.log('   → No fees collected (expected - FEE_WALLET was not configured)');
    console.log('   → All swaps executed without fee collection');
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('\n💡 RECOMMENDATIONS:\n');
  console.log('1. Set FEE_WALLET in Vercel to start collecting fees');
  console.log('2. Add swap tracking/logging to API for accurate analytics');
  console.log('3. Consider using a service like Helius or QuickNode for transaction history');
  console.log('4. Implement analytics endpoint to track swap volume\n');
  
  console.log('📝 Note: Without swap tracking, it\'s difficult to accurately calculate');
  console.log('   missed fees. The above estimates are approximate.\n');
}

// Run estimation
if (require.main === module) {
  estimateMissedFees().catch(console.error);
}

module.exports = { estimateMissedFees, calculateMissedFees };
