/**
 * Test Fee Collection
 * Verifies that fees are being collected correctly
 */

const https = require('https');

const API_URL = 'https://api.moltydex.com';

async function checkFeeWallet() {
  return new Promise((resolve, reject) => {
    https.get(`${API_URL}/api/health`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const health = JSON.parse(data);
          resolve(health);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

async function testFeeInQuote() {
  // Test a quote to see if fees are calculated
  const quoteUrl = `${API_URL}/api/quote?input_mint=So11111111111111111111111111111111111111112&output_mint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=1000000000`;
  
  return new Promise((resolve, reject) => {
    https.get(quoteUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const quote = JSON.parse(data);
          resolve(quote);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('\n🔍 Checking Fee Collection Configuration...\n');
  
  try {
    // Check health endpoint
    const health = await checkFeeWallet();
    console.log('📊 API Health Check:');
    console.log(`   Fee BPS: ${health.fee_bps} (${health.fee_bps / 100}%)`);
    console.log(`   Fee Wallet Configured: ${health.fee_wallet_configured ? '✅ YES' : '❌ NO'}`);
    console.log(`   Fee Collection: ${health.features.fee_collection ? '✅ ENABLED' : '❌ DISABLED'}`);
    
    if (!health.fee_wallet_configured) {
      console.log('\n⚠️  WARNING: Fee wallet is NOT configured!');
      console.log('   Fees are being calculated but NOT collected.');
      console.log('   To enable fee collection:');
      console.log('   1. Set FEE_WALLET environment variable in Vercel');
      console.log('   2. Redeploy the API');
      console.log('   3. Fees will be automatically transferred to your wallet\n');
    }
    
    // Test quote to see fee calculation
    console.log('\n💰 Testing Fee Calculation...\n');
    const quote = await testFeeInQuote();
    
    if (quote.fee_amount) {
      console.log('✅ Fees are being calculated:');
      console.log(`   Input: ${quote.input_amount} lamports`);
      console.log(`   Output: ${quote.output_amount} lamports`);
      console.log(`   Fee Amount: ${quote.fee_amount} lamports`);
      console.log(`   Output After Fee: ${quote.output_after_fee} lamports`);
      
      const feePercent = (BigInt(quote.fee_amount) * 10000n) / BigInt(quote.output_amount);
      console.log(`   Fee Percentage: ${Number(feePercent) / 100}%`);
      
      if (!health.fee_wallet_configured) {
        console.log('\n⚠️  NOTE: Fees are calculated but NOT collected because FEE_WALLET is not set.');
      }
    } else {
      console.log('❌ Fee amount not found in quote response');
    }
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

main();
