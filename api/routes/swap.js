/**
 * Swap routes
 */

const express = require('express');
const router = express.Router();
const { Transaction, VersionedTransaction } = require('@solana/web3.js');
const { fetchJupiterQuote } = require('../utils/jupiter');
const { DEFAULTS, TOKENS } = require('../config/constants');
const { jupiterUnavailableError, invalidInputError } = require('../utils/errorHandler');
const { validate } = require('../middleware/validation');
const { swapLimiter } = require('../middleware/rateLimit');
const analyticsRouter = require('./analytics');
const trackEvent = analyticsRouter.trackEvent;
const swapTracker = require('../utils/swapTracker');

/**
 * POST /api/swap/build
 * Build unsigned swap transaction (client signs securely)
 */
router.post('/build', swapLimiter, validate('swapBuild'), async (req, res) => {
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
      
      // Track failed swap (don't let tracking errors break error handling)
      try {
        await trackEvent('swap', {
          success: false,
          input_mint,
          output_mint,
          wallet_address,
          error: swapError.message,
        });
        await trackEvent('api_call', { endpoint: '/api/swap/build' });
      } catch (trackErr) {
        console.error('[SWAP] Tracking error (non-fatal):', trackErr.message);
      }
      
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

    // Validate transaction size (Solana max is 1232 bytes)
    const MAX_TX_SIZE = 1232;
    if (swapTransactionBuf.length > MAX_TX_SIZE) {
      return res.status(422).json({
        error: 'Transaction too large',
        error_code: 'TRANSACTION_TOO_LARGE',
        details: {
          size: swapTransactionBuf.length,
          max: MAX_TX_SIZE,
        },
        suggestion: 'Try a simpler route (set onlyDirectRoutes=true) or reduce the swap amount.',
      });
    }

    // Serialize transaction
    let serializedTransaction;
    if (isVersioned) {
      const serialized = transaction.serialize();
      serializedTransaction = Buffer.from(serialized).toString('base64');
    } else {
      serializedTransaction = transaction.serialize({ requireAllSignatures: false }).toString('base64');
    }

    // Estimate USD volume for stablecoin swaps (USDC/USDT have 6 decimals)
    let volumeUsd = null;
    if (input_mint === TOKENS.USDC || input_mint === TOKENS.USDT) {
      volumeUsd = (parseFloat(amount) / 1e6).toFixed(2);
    } else if (output_mint === TOKENS.USDC || output_mint === TOKENS.USDT) {
      volumeUsd = (parseFloat(outAmount) / 1e6).toFixed(2);
    }

    // Track swap in both analytics and swap tracker (don't let tracking break swaps)
    let trackedSwap = null;
    try {
      await trackEvent('swap', {
        success: true,
        input_mint,
        output_mint,
        wallet_address,
        volume_usd: volumeUsd,
      });
      await trackEvent('api_call', { endpoint: '/api/swap/build' });

      // Persist swap record for history and points
      trackedSwap = await swapTracker.trackSwap({
        wallet_address,
        input_mint,
        output_mint,
        input_amount: amount,
        output_amount: outputAmount.toString(),
        fee_amount: feeAmount.toString(),
        fee_bps: 0,
        slippage_bps,
      });

      // Award points
      if (trackedSwap) {
        await swapTracker.awardPoints(wallet_address, {
          output_amount: outputAmount.toString(),
        });
      }
    } catch (trackErr) {
      console.error('[SWAP] Tracking error (non-fatal):', trackErr.message);
    }
    
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
      swap_id: trackedSwap?.id || null,
    });
  } catch (err) {
    console.error('[SWAP] Error:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    });
    
    // Track failed swap (don't let tracking errors break error handling)
    try {
      await trackEvent('swap', {
        success: false,
        input_mint: req.body?.input_mint,
        output_mint: req.body?.output_mint,
        wallet_address: req.body?.wallet_address,
        error: err.message,
      });
      await trackEvent('api_call', { endpoint: '/api/swap/build' });
    } catch (trackErr) {
      console.error('[SWAP] Tracking error (non-fatal):', trackErr.message);
    }
    
    res.status(500).json({
      error: err.response?.data?.error || err.message,
      details: err.response?.data || { message: err.message },
    });
  }
});

module.exports = router;
