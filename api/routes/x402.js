/**
 * x402 payment protocol routes
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Connection, PublicKey } = require('@solana/web3.js');
const { TOKENS } = require('../config/constants');
const { getBalance } = require('../utils/balance');
const { fetchJupiterQuote } = require('../utils/jupiter');
const { executeWithRetry, isRateLimitError } = require('../utils/rpc');
const { ERROR_CODES, sendErrorResponse } = require('../utils/errors');
const analyticsRouter = require('./analytics');
const trackEvent = analyticsRouter.trackEvent;

/**
 * POST /api/x402/parse-payment
 * Parse x402 Payment Required response and extract payment requirements
 */
router.post('/parse-payment', async (req, res) => {
  try {
    const { payment_response_body } = req.body;

    if (!payment_response_body) {
      return sendErrorResponse(res, ERROR_CODES.MISSING_PARAMETERS, 'Missing payment_response_body', {
        required: ['payment_response_body'],
      }, 400);
    }

    let paymentReq;
    if (typeof payment_response_body === 'string') {
      paymentReq = JSON.parse(payment_response_body);
    } else {
      paymentReq = payment_response_body;
    }

    if (!paymentReq.accepts || !Array.isArray(paymentReq.accepts) || paymentReq.accepts.length === 0) {
      return sendErrorResponse(res, ERROR_CODES.INVALID_PAYMENT_REQUIREMENTS, 'Invalid payment requirements format', {
        expected: { accepts: 'array' },
        received: paymentReq,
      }, 400);
    }

    // Filter for Solana payments
    const solanaPayments = paymentReq.accepts.filter(
      (p) => p.network && (p.network.includes('solana') || p.network.includes('5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'))
    );

    if (solanaPayments.length === 0) {
      return sendErrorResponse(res, ERROR_CODES.INVALID_PAYMENT_REQUIREMENTS, 'No Solana payment options found', {
        note: 'Payment requirements must include Solana network options',
      }, 400);
    }

    // Track x402 parse event
    try {
      await trackEvent('x402_payment', { action: 'parse', success: true, options: solanaPayments.length });
      await trackEvent('api_call', { endpoint: '/api/x402/parse-payment' });
    } catch (trackErr) {
      console.error('[x402] Tracking error (non-fatal):', trackErr.message);
    }

    res.json({
      payment_requirements: solanaPayments,
      recommended: solanaPayments[0],
      total_options: solanaPayments.length,
    });
  } catch (err) {
    console.error('Parse payment error:', err.message);
    try { await trackEvent('x402_payment', { action: 'parse', success: false, error: err.message }); } catch (_) {}
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/x402/prepare-payment
 * Check balance and prepare swap if needed for x402 payment
 */
router.post('/prepare-payment', async (req, res) => {
  try {
    const { wallet_address, payment_requirements, preferred_input_token } = req.body;

    if (!wallet_address || !payment_requirements) {
      return res.status(400).json({ error: 'Missing wallet_address or payment_requirements' });
    }

    const payment = Array.isArray(payment_requirements) ? payment_requirements[0] : payment_requirements;
    const requiredToken = payment.asset || payment.token_mint;
    const requiredAmount = BigInt(payment.amount);

    // Check current balance
    const balanceResponse = await axios.get(`${req.protocol}://${req.get('host')}/api/balance`, {
      params: { wallet_address, token_mint: requiredToken },
    });

    const currentBalance = BigInt(balanceResponse.data.balance || '0');
    const hasEnough = currentBalance >= requiredAmount;

    if (hasEnough) {
      try {
        await trackEvent('x402_payment', { action: 'prepare', success: true, swap_needed: false, wallet_address, token: requiredToken });
        await trackEvent('api_call', { endpoint: '/api/x402/prepare-payment' });
      } catch (_) {}
      return res.json({
        ready: true,
        has_sufficient_balance: true,
        current_balance: currentBalance.toString(),
        required_amount: requiredAmount.toString(),
        message: 'Sufficient balance - no swap needed',
      });
    }

    // Need to swap - get quote
    const inputToken = preferred_input_token || TOKENS.SOL;
    const swapAmount = requiredAmount - currentBalance;

    const quoteResponse = await axios.get(`${req.protocol}://${req.get('host')}/api/quote`, {
      params: {
        input_mint: inputToken,
        output_mint: requiredToken,
        amount: swapAmount.toString(),
      },
    });

    try {
      await trackEvent('x402_payment', { action: 'prepare', success: true, swap_needed: true, wallet_address, token: requiredToken, shortfall: swapAmount.toString() });
      await trackEvent('api_call', { endpoint: '/api/x402/prepare-payment' });
    } catch (_) {}

    res.json({
      ready: false,
      has_sufficient_balance: false,
      current_balance: currentBalance.toString(),
      required_amount: requiredAmount.toString(),
      shortfall: swapAmount.toString(),
      swap_needed: {
        input_token: inputToken,
        output_token: requiredToken,
        input_amount: quoteResponse.data.input_amount,
        output_amount: quoteResponse.data.output_after_fee,
        fee_amount: quoteResponse.data.fee_amount,
        price_impact: quoteResponse.data.price_impact,
      },
      swap_endpoint: '/api/swap/build',
    });
  } catch (err) {
    console.error('Prepare payment error:', err.message);
    try { await trackEvent('x402_payment', { action: 'prepare', success: false, error: err.message }); } catch (_) {}
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/x402/simulate-payment
 * Simulate payment flow without executing transactions
 * Allows agents to verify their logic (including fees) without committing funds
 * Returns complete breakdown: swap quote, fees, slippage, final amounts
 */
router.post('/simulate-payment', async (req, res) => {
  try {
    const { wallet_address, payment_requirements, preferred_input_token } = req.body;

    if (!wallet_address || !payment_requirements) {
      return sendErrorResponse(res, ERROR_CODES.MISSING_PARAMETERS, 'Missing wallet_address or payment_requirements', {
        required: ['wallet_address', 'payment_requirements'],
        received: Object.keys(req.body),
      }, 400);
    }

    const payment = Array.isArray(payment_requirements) ? payment_requirements[0] : payment_requirements;
    const requiredToken = payment.asset || payment.token_mint;
    
    // Validate payment requirements before converting to BigInt
    if (!requiredToken || !payment.amount) {
      return sendErrorResponse(res, ERROR_CODES.INVALID_PAYMENT_REQUIREMENTS, 'Invalid payment_requirements format', {
        expected: { asset: 'string', amount: 'string' },
        received: payment,
      }, 400);
    }
    
    const requiredAmount = BigInt(payment.amount);

    // Check current balance (simulation - no execution)
    let balanceResponse;
    try {
      balanceResponse = await axios.get(`${req.protocol}://${req.get('host')}/api/balance`, {
        params: { wallet_address, token_mint: requiredToken },
      });
    } catch (err) {
      return sendErrorResponse(res, ERROR_CODES.BALANCE_CHECK_FAILED, 'Failed to check balance', {
        message: err.message,
      }, 500);
    }

    const currentBalance = BigInt(balanceResponse.data.balance || '0');
    const hasEnough = currentBalance >= requiredAmount;

    // If sufficient balance, return simulation result
    if (hasEnough) {
      try {
        await trackEvent('x402_payment', { action: 'simulate', success: true, swap_needed: false, wallet_address });
        await trackEvent('api_call', { endpoint: '/api/x402/simulate-payment' });
      } catch (_) {}
      return res.json({
        simulation: true,
        ready: true,
        has_sufficient_balance: true,
        current_balance: currentBalance.toString(),
        required_amount: requiredAmount.toString(),
        swap_needed: false,
        message: 'Sufficient balance - no swap needed',
        fee_breakdown: {
          swap_fee: '0',
          network_fee_estimate: '0.000005', // Estimated Solana network fee
          total_fees: '0.000005',
        },
        final_amount_out: requiredAmount.toString(),
        price_impact: null,
        validation: {
          balance_sufficient: true,
          swap_needed: false,
          price_impact_acceptable: true,
          quote_fresh: true,
        },
      });
    }

    // Need to swap - get quote (simulation)
    const inputToken = preferred_input_token || TOKENS.SOL;
    const swapAmount = requiredAmount - currentBalance;

    let quoteResponse;
    try {
      quoteResponse = await axios.get(`${req.protocol}://${req.get('host')}/api/quote`, {
        params: {
          input_mint: inputToken,
          output_mint: requiredToken,
          amount: swapAmount.toString(),
        },
      });
    } catch (err) {
      return sendErrorResponse(res, ERROR_CODES.QUOTE_FAILED, 'Failed to get swap quote', {
        message: err.message,
      }, 500);
    }

    const quote = quoteResponse.data;

    try {
      await trackEvent('x402_payment', { action: 'simulate', success: true, swap_needed: true, wallet_address, shortfall: swapAmount.toString() });
      await trackEvent('api_call', { endpoint: '/api/x402/simulate-payment' });
    } catch (_) {}

    // Return complete simulation breakdown
    res.json({
      simulation: true,
      ready: false,
      has_sufficient_balance: false,
      current_balance: currentBalance.toString(),
      required_amount: requiredAmount.toString(),
      shortfall: swapAmount.toString(),
      swap_needed: true,
      swap_details: {
        input_token: inputToken,
        output_token: requiredToken,
        input_amount: quote.input_amount,
        output_amount: quote.output_after_fee,
        fee_amount: quote.fee_amount,
        price_impact: quote.price_impact || null,
        slippage_bps: quote.slippage_bps || 50,
      },
      fee_breakdown: {
        swap_fee: quote.fee_amount || '0',
        aggregator_fee: quote.fee_breakdown?.aggregator_fee || '0',
        network_fee_estimate: quote.fee_breakdown?.network_fee || '0.000005',
        priority_fee: quote.fee_breakdown?.priority_fee || '0',
        total_fees: quote.fee_breakdown?.total_cost || quote.fee_amount || '0',
      },
      final_amount_out: quote.output_after_fee,
      validation: {
        balance_sufficient_after_swap: BigInt(quote.output_after_fee) >= requiredAmount,
        price_impact_acceptable: !quote.price_impact || parseFloat(quote.price_impact) < 5.0,
        quote_fresh: true, // Quote is fresh since we just fetched it
      },
      next_steps: {
        to_execute: 'Call /api/x402/prepare-payment and then /api/swap/build',
        note: 'This is a simulation - no transactions were executed',
      },
    });
  } catch (err) {
    console.error('Simulate payment error:', err.message);
    try { await trackEvent('x402_payment', { action: 'simulate', success: false, error: err.message }); } catch (_) {}
    return sendErrorResponse(res, ERROR_CODES.SIMULATION_FAILED, err.message, {
      message: err.message,
    }, 500);
  }
});

/**
 * GET /api/x402/recommended-tokens
 * Get list of recommended tokens for x402 payments
 */
router.get('/recommended-tokens', async (req, res) => {
  try {
    const response = await axios.get('https://token.jup.ag/all');
    const tokens = response.data
      .filter((t) => (t.chainId === 101 || t.chainId === 103) && (t.symbol === 'USDC' || t.symbol === 'USDT' || t.symbol === 'SOL'))
      .map((t) => ({
        symbol: t.symbol,
        name: t.name,
        mint: t.address,
        decimals: t.decimals,
        logo: t.logoURI,
      }));

    try { await trackEvent('api_call', { endpoint: '/api/x402/recommended-tokens' }); } catch (_) {}

    res.json({
      recommended: tokens,
      note: 'USDC and USDT are most commonly accepted for x402 payments on Solana',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/x402/auto-pay
 * Complete x402 payment flow: parse, check balance, swap if needed, return payment status
 * This is a one-call solution for agents
 */
router.post('/auto-pay', async (req, res) => {
  try {
    const { 
      payment_response_body, 
      wallet_address, 
      preferred_input_token,
      auto_swap = false, // If true, automatically execute swap if needed
    } = req.body;

    if (!payment_response_body || !wallet_address) {
      return res.status(400).json({ 
        error: 'Missing payment_response_body or wallet_address' 
      });
    }

    // Step 1: Parse payment requirements (inline parsing to avoid HTTP call)
    let paymentReq;
    try {
      let paymentReqData;
      if (typeof payment_response_body === 'string') {
        paymentReqData = JSON.parse(payment_response_body);
      } else {
        paymentReqData = payment_response_body;
      }

      if (!paymentReqData.accepts || !Array.isArray(paymentReqData.accepts) || paymentReqData.accepts.length === 0) {
        return res.status(400).json({ error: 'Invalid payment requirements format' });
      }

      // Filter for Solana payments
      const solanaPayments = paymentReqData.accepts.filter(
        (p) => p.network && (p.network.includes('solana') || p.network.includes('5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'))
      );

      if (solanaPayments.length === 0) {
        return res.status(400).json({ error: 'No Solana payment options found' });
      }

      paymentReq = solanaPayments[0];
    } catch (err) {
      return res.status(400).json({
        error: 'Failed to parse payment requirements',
        message: err.message,
      });
    }

    const requiredToken = paymentReq.asset || paymentReq.token_mint;
    const requiredAmount = BigInt(paymentReq.amount || paymentReq.amount_required || '0');

    // Step 2: Check balance (with retry and fallback support)
    let currentBalance;
    try {
      const balanceResult = await executeWithRetry(
        async (connection) => {
          return await getBalance(connection, wallet_address, requiredToken || null);
        },
        {
          maxRetries: 3,
          retryDelayBase: 1000,
          useFallback: true,
        }
      );
      currentBalance = BigInt(balanceResult.balance || '0');
    } catch (err) {
      // Provide better error messages for rate limits
      if (isRateLimitError(err)) {
        return res.status(429).json({
          error: 'RPC rate limit exceeded',
          message: 'Solana RPC rate limit exceeded. Please try again in a moment.',
          retryAfter: 60,
          suggestion: 'Consider using a dedicated RPC provider for production use',
        });
      }
      
      return res.status(500).json({
        error: 'Failed to check balance',
        message: err.message,
      });
    }
    const hasEnough = currentBalance >= requiredAmount;

    // Step 3: If sufficient balance, return ready status
    if (hasEnough) {
      try {
        await trackEvent('x402_payment', { action: 'auto-pay', success: true, swap_needed: false, wallet_address, token: requiredToken, amount: requiredAmount.toString() });
        await trackEvent('api_call', { endpoint: '/api/x402/auto-pay' });
      } catch (_) {}
      return res.json({
        ready: true,
        payment_ready: true,
        has_sufficient_balance: true,
        current_balance: currentBalance.toString(),
        required_amount: requiredAmount.toString(),
        payment_requirements: paymentReq,
        message: 'Sufficient balance - ready to make payment',
        next_steps: [
          'Send payment transaction to the payment address',
          `Amount: ${requiredAmount.toString()} ${requiredToken}`,
        ],
      });
    }

    // Step 4: Need to swap - get quote (direct function call instead of HTTP)
    const inputToken = preferred_input_token || TOKENS.SOL;
    const shortfall = requiredAmount - currentBalance;

    let quoteData;
    try {
      const JUPITER_API_KEY = process.env.JUPITER_API_KEY || '';
      const quoteResult = await fetchJupiterQuote(
        {
          input_mint: inputToken,
          output_mint: requiredToken,
          amount: shortfall.toString(),
          slippage_bps: 50,
        },
        JUPITER_API_KEY
      );

      if (!quoteResult || quoteResult.errors) {
        return res.status(503).json({
          ready: false,
          payment_ready: false,
          has_sufficient_balance: false,
          current_balance: currentBalance.toString(),
          required_amount: requiredAmount.toString(),
          shortfall: shortfall.toString(),
          error: 'Failed to get swap quote',
          message: quoteResult?.errors?.[0]?.message || 'Jupiter API unavailable',
          suggestion: 'Try a different input token or check if swap route exists',
        });
      }

      const outAmount = quoteResult.data.outAmount || quoteResult.data.outAmountWithSlippage || quoteResult.data.outAmountWithoutSlippage;
      if (!outAmount) {
        return res.status(500).json({
          ready: false,
          payment_ready: false,
          has_sufficient_balance: false,
          current_balance: currentBalance.toString(),
          required_amount: requiredAmount.toString(),
          shortfall: shortfall.toString(),
          error: 'Invalid quote response',
          message: 'Missing outAmount in quote response',
        });
      }

      const outputAmount = BigInt(outAmount);
      const feeAmount = 0n; // Zero platform fees
      const outputAfterFee = outputAmount;

      quoteData = {
        input_amount: shortfall.toString(),
        output_amount: outputAmount.toString(),
        output_after_fee: outputAfterFee.toString(),
        fee_amount: feeAmount.toString(),
        price_impact: quoteResult.data.priceImpactPct || quoteResult.data.priceImpact || '0',
      };
    } catch (err) {
      return res.status(500).json({
        ready: false,
        payment_ready: false,
        has_sufficient_balance: false,
        current_balance: currentBalance.toString(),
        required_amount: requiredAmount.toString(),
        shortfall: shortfall.toString(),
        error: 'Failed to get swap quote',
        message: err.message,
        suggestion: 'Try a different input token or check if swap route exists',
      });
    }

    const swapInfo = {
      input_token: inputToken,
      output_token: requiredToken,
      input_amount: quoteData.input_amount,
      output_amount: quoteData.output_after_fee,
      fee_amount: quoteData.fee_amount,
      price_impact: quoteData.price_impact,
    };

    // Step 5: If auto_swap is true, build swap transaction (direct function call)
    let swapTransaction = null;
    if (auto_swap) {
      try {
        const JUPITER_API_KEY = process.env.JUPITER_API_KEY || '';
        const DEMO_MODE = process.env.DEMO_MODE === '1' || process.env.DEMO_MODE === 'true';

        // Get quote for swap building
        const swapQuoteResult = await fetchJupiterQuote(
          {
            input_mint: inputToken,
            output_mint: requiredToken,
            amount: quoteData.input_amount,
            slippage_bps: 50,
          },
          JUPITER_API_KEY
        );

        if (!swapQuoteResult || swapQuoteResult.errors) {
          if (DEMO_MODE) {
            return res.status(503).json({
              ready: false,
              payment_ready: false,
              has_sufficient_balance: false,
              swap_needed: swapInfo,
              error: 'Demo mode: real swaps require Jupiter. Deploy API to Vercel for production.',
              code: 'DEMO_MODE',
            });
          }
          return res.status(503).json({
            ready: false,
            payment_ready: false,
            has_sufficient_balance: false,
            swap_needed: swapInfo,
            error: 'Failed to get swap quote for transaction building',
            message: swapQuoteResult?.errors?.[0]?.message || 'Jupiter API unavailable',
          });
        }

        const swapQuote = swapQuoteResult.data;
        const swapOutAmount = swapQuote.outAmount || swapQuote.outAmountWithSlippage || swapQuote.outAmountWithoutSlippage;
        if (!swapOutAmount) {
          return res.status(500).json({
            ready: false,
            payment_ready: false,
            has_sufficient_balance: false,
            swap_needed: swapInfo,
            error: 'Invalid quote response',
            message: 'Missing outAmount in swap quote',
          });
        }

        // Build swap request
        const swapRequest = {
          quoteResponse: swapQuote,
          userPublicKey: wallet_address,
          wrapAndUnwrapSol: true,
          dynamicComputeUnitLimit: true,
        };

        // Call Jupiter swap API
        const JUPITER_SWAP_ENDPOINT = 'https://api.jup.ag/swap/v1/swap';
        const headers = {
          'Content-Type': 'application/json',
          ...(JUPITER_API_KEY ? { 'x-api-key': JUPITER_API_KEY } : {}),
        };

        const swapResponse = await axios.post(JUPITER_SWAP_ENDPOINT, swapRequest, {
          headers,
          timeout: 30000,
        });

        // Parse transaction
        const swapData = swapResponse.data;
        const swapTransactionBuf = Buffer.from(swapData.swapTransaction, 'base64');
        let transaction;
        let isVersioned = false;

        try {
          const { VersionedTransaction } = require('@solana/web3.js');
          transaction = VersionedTransaction.deserialize(swapTransactionBuf);
          isVersioned = true;
        } catch {
          const { Transaction } = require('@solana/web3.js');
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

        const outputAmount = BigInt(swapOutAmount);
        const feeAmount = 0n;

        swapTransaction = {
          transaction: serializedTransaction,
          fee_amount: feeAmount.toString(),
          output_amount: outputAmount.toString(),
          is_versioned: isVersioned,
        };
      } catch (err) {
        return res.status(500).json({
          ready: false,
          payment_ready: false,
          has_sufficient_balance: false,
          swap_needed: swapInfo,
          error: 'Failed to build swap transaction',
          message: err.response?.data?.error || err.message,
        });
      }
    }

    try {
      await trackEvent('x402_payment', { action: 'auto-pay', success: true, swap_needed: true, auto_swap, wallet_address, token: requiredToken, amount: requiredAmount.toString(), shortfall: shortfall.toString() });
      await trackEvent('api_call', { endpoint: '/api/x402/auto-pay' });
    } catch (_) {}

    res.json({
      ready: false,
      payment_ready: false,
      has_sufficient_balance: false,
      current_balance: currentBalance.toString(),
      required_amount: requiredAmount.toString(),
      shortfall: shortfall.toString(),
      swap_needed: swapInfo,
      swap_transaction: swapTransaction,
      payment_requirements: paymentReq,
      next_steps: swapTransaction
        ? [
            'Sign and send the swap transaction',
            'Wait for swap confirmation',
            'Then send payment transaction',
          ]
        : [
            'Call /api/swap/build to get swap transaction',
            'Sign and send swap transaction',
            'Wait for confirmation',
            'Then send payment transaction',
          ],
      swap_endpoint: '/api/swap/build',
    });
  } catch (err) {
    console.error('Auto-pay error:', err.message);
    try { await trackEvent('x402_payment', { action: 'auto-pay', success: false, wallet_address: req.body?.wallet_address, error: err.message }); } catch (_) {}
    res.status(500).json({
      error: 'Failed to process auto-pay request',
      message: err.message,
    });
  }
});

module.exports = router;
