/**
 * Swap routes
 */

const express = require('express');
const router = express.Router();
const { Transaction, VersionedTransaction } = require('@solana/web3.js');
const { fetchJupiterQuote } = require('../utils/jupiter');
const { DEFAULTS } = require('../config/constants');
const { jupiterUnavailableError, invalidInputError } = require('../utils/errorHandler');
const analyticsRouter = require('./analytics');
const trackEvent = analyticsRouter.trackEvent;

/**
 * POST /api/swap/build
 * Build unsigned swap transaction (client signs securely)
 */
router.post('/build', async (req, res) => {
  try {
    const {
      wallet_address,
      input_mint,
      output_mint,
      amount,
      slippage_bps = DEFAULTS.SLIPPAGE_BPS,
    } = req.body;

    if (!wallet_address || !input_mint || !output_mint || !amount) {
      const missingFields = [];
      if (!wallet_address) missingFields.push('wallet_address');
      if (!input_mint) missingFields.push('input_mint');
      if (!output_mint) missingFields.push('output_mint');
      if (!amount) missingFields.push('amount');
      
      return res.status(400).json(
        invalidInputError(missingFields.join(', '), 'Missing required fields')
      );
    }

    const JUPITER_API_KEY = process.env.JUPITER_API_KEY || '';
    const DEMO_MODE = process.env.DEMO_MODE === '1' || process.env.DEMO_MODE === 'true';

    // Get quote from Jupiter
    const quoteResult = await fetchJupiterQuote(
      {
        input_mint,
        output_mint,
        amount,
        slippage_bps,
      },
      JUPITER_API_KEY
    );

    if (!quoteResult || quoteResult.errors) {
      if (DEMO_MODE) {
        return res.status(503).json({
          error: 'Demo mode: real swaps require Jupiter. Deploy API to Vercel for production.',
          code: 'DEMO_MODE',
        });
      }
      return res.status(503).json(jupiterUnavailableError());
    }

    const quote = quoteResult.data;
    const outAmount = quote.outAmount || quote.outAmountWithSlippage || quote.outAmountWithoutSlippage;
    if (!outAmount) {
      return res.status(500).json({
        error: 'Invalid quote response: missing outAmount',
      });
    }
    
    const outputAmount = BigInt(outAmount);
    // Fees disabled - no fee calculations
    const feeAmount = 0n;
    const outputAfterFee = outputAmount;

    // Build swap request - no fees, no feeAccount needed
    const swapRequest = {
      quoteResponse: quote,
      userPublicKey: wallet_address,
      wrapAndUnwrapSol: true,
      dynamicComputeUnitLimit: true,
    };
    
    // Call Jupiter swap API
    const axios = require('axios');
    const JUPITER_SWAP_ENDPOINT = 'https://api.jup.ag/swap/v1/swap';
    const headers = {
      'Content-Type': 'application/json',
      ...(JUPITER_API_KEY ? { 'x-api-key': JUPITER_API_KEY } : {}),
    };
    
    let swapResponse;
    try {
      swapResponse = await axios.post(JUPITER_SWAP_ENDPOINT, swapRequest, {
        headers,
        timeout: 30000,
      });
    } catch (swapError) {
      console.error('[SWAP] Jupiter API error:', {
        status: swapError.response?.status,
        statusText: swapError.response?.statusText,
        data: swapError.response?.data,
        message: swapError.message,
      });
      
      // Track failed swap
      trackEvent('swap', {
        success: false,
        input_mint,
        output_mint,
        wallet_address,
        error: swapError.message,
      });
      trackEvent('api_call', { endpoint: '/api/swap/build' });
      
      throw swapError;
    }

    // Parse transaction
    const swapData = swapResponse.data;
    const swapTransactionBuf = Buffer.from(swapData.swapTransaction, 'base64');
    let transaction;
    let isVersioned = false;
    
    try {
      transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      isVersioned = true;
    } catch {
      transaction = Transaction.from(swapTransactionBuf);
      isVersioned = false;
    }

    // Serialize transaction
    let serializedTransaction;
    if (isVersioned) {
      const serialized = transaction.serialize();
      serializedTransaction = Buffer.from(serialized).toString('base64');
    } else {
      serializedTransaction = transaction.serialize({ requireAllSignatures: false }).toString('base64');
    }

    // Track successful swap build
    trackEvent('swap', {
      success: true,
      input_mint,
      output_mint,
      wallet_address,
    });
    trackEvent('api_call', { endpoint: '/api/swap/build' });
    
    // Return unsigned transaction
    res.json({
      transaction: serializedTransaction,
      fee_amount: feeAmount.toString(),
      output_amount: outputAmount.toString(),
      output_after_fee: outputAfterFee.toString(),
      fee_bps: 0,
      fee_collected: false,
      fee_method: 'No fees configured',
      is_versioned: isVersioned,
    });
  } catch (err) {
    console.error('[SWAP] Error:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    });
    
    // Track failed swap
    trackEvent('swap', {
      success: false,
      input_mint: req.body?.input_mint,
      output_mint: req.body?.output_mint,
      wallet_address: req.body?.wallet_address,
      error: err.message,
    });
    trackEvent('api_call', { endpoint: '/api/swap/build' });
    
    res.status(500).json({
      error: err.response?.data?.error || err.message,
      details: err.response?.data || { message: err.message },
    });
  }
});

module.exports = router;
