/**
 * Test Fee Transfer in Swap Transaction
 * 
 * This script tests if fee transfer instructions are being added to swap transactions
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'https://api.moltydex.com';
const FEE_WALLET = 'ATYWjod5jkQm5RxrC65irY8e97UUY42LFM45ZGuNK3JL';

// Test swap parameters
const testSwap = {
  wallet_address: '11111111111111111111111111111111', // Dummy address for testing
  input_mint: 'So11111111111111111111111111111111111111112', // SOL
  output_mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  amount: '1000000000', // 1 SOL
  slippage_bps: 50,
};

async function testFeeTransfer() {
  console.log('🧪 Testing Fee Transfer in Swap Transaction\n');
  console.log('='.repeat(60));
  console.log(`API URL: ${API_URL}`);
  console.log(`Fee Wallet: ${FEE_WALLET}`);
  console.log('='.repeat(60) + '\n');

  try {
    // Step 1: Check API health
    console.log('1️⃣ Checking API health...');
    const healthResponse = await axios.get(`${API_URL}/api/health`);
    console.log('   ✅ API is healthy');
    console.log(`   Fee Wallet Configured: ${healthResponse.data.fee_wallet_configured ? '✅ YES' : '❌ NO'}`);
    console.log(`   Fee BPS: ${healthResponse.data.fee_bps}\n`);

    if (!healthResponse.data.fee_wallet_configured) {
      console.log('❌ ERROR: Fee wallet is not configured!');
      return;
    }

    // Step 2: Get a quote
    console.log('2️⃣ Getting swap quote...');
    const quoteResponse = await axios.get(`${API_URL}/api/quote`, {
      params: {
        input_mint: testSwap.input_mint,
        output_mint: testSwap.output_mint,
        amount: testSwap.amount,
        slippage_bps: testSwap.slippage_bps,
      },
    });
    
    const quote = quoteResponse.data;
    console.log('   ✅ Quote received');
    console.log(`   Input: ${testSwap.amount} lamports`);
    console.log(`   Output: ${quote.output_amount} lamports`);
    console.log(`   Fee Amount: ${quote.fee_amount} lamports`);
    console.log(`   Output After Fee: ${quote.output_after_fee} lamports\n`);

    // Step 3: Build swap transaction
    console.log('3️⃣ Building swap transaction...');
    const swapResponse = await axios.post(`${API_URL}/api/swap/build`, testSwap);
    
    const swap = swapResponse.data;
    console.log('   ✅ Swap transaction built');
    console.log(`   Fee Amount: ${swap.fee_amount} lamports`);
    console.log(`   Fee Collected: ${swap.fee_collected ? '✅ YES' : '❌ NO'}`);
    console.log(`   Fee Wallet: ${swap.fee_wallet || 'NOT SET'}`);
    
    if (swap.fee_collected) {
      console.log('\n   ✅ SUCCESS: Fee transfer instruction was added to transaction!');
      console.log('   The fee will be collected when this transaction is executed.');
    } else {
      console.log('\n   ⚠️  WARNING: Fee transfer instruction was NOT added!');
      console.log('   Check Vercel logs for error details.');
    }

    // Step 4: Decode transaction to verify fee instruction
    console.log('\n4️⃣ Analyzing transaction structure...');
    const { Transaction } = require('@solana/web3.js');
    const transactionBuffer = Buffer.from(swap.transaction, 'base64');
    const transaction = Transaction.from(transactionBuffer);
    
    console.log(`   Total Instructions: ${transaction.instructions.length}`);
    
    // Check for token transfer instructions
    const tokenProgramId = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
    const tokenInstructions = transaction.instructions.filter(
      inst => inst.programId.toString() === tokenProgramId
    );
    
    console.log(`   Token Transfer Instructions: ${tokenInstructions.length}`);
    
    if (tokenInstructions.length > 0) {
      console.log('   ✅ Token transfer instructions found (may include fee transfer)');
    } else {
      console.log('   ⚠️  No token transfer instructions found');
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`Fee Wallet Configured: ${healthResponse.data.fee_wallet_configured ? '✅' : '❌'}`);
    console.log(`Fee Transfer Added: ${swap.fee_collected ? '✅' : '❌'}`);
    console.log(`Fee Amount: ${swap.fee_amount} lamports`);
    
    if (swap.fee_collected) {
      console.log('\n✅ Fee collection is working correctly!');
    } else {
      console.log('\n❌ Fee collection is NOT working. Check Vercel logs for errors.');
    }

  } catch (error) {
    console.error('\n❌ Error during test:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

if (require.main === module) {
  testFeeTransfer().catch(console.error);
}

module.exports = { testFeeTransfer };
