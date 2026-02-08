/**
 * x402 payment protocol routes
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const { TOKENS } = require('../config/constants');

/**
 * POST /api/x402/parse-payment
 * Parse x402 Payment Required response and extract payment requirements
 */
router.post('/parse-payment', async (req, res) => {
  try {
    const { payment_response_body } = req.body;

    if (!payment_response_body) {
      return res.status(400).json({ error: 'Missing payment_response_body' });
    }

    let paymentReq;
    if (typeof payment_response_body === 'string') {
      paymentReq = JSON.parse(payment_response_body);
    } else {
      paymentReq = payment_response_body;
    }

    if (!paymentReq.accepts || !Array.isArray(paymentReq.accepts) || paymentReq.accepts.length === 0) {
      return res.status(400).json({ error: 'Invalid payment requirements format' });
    }

    // Filter for Solana payments
    const solanaPayments = paymentReq.accepts.filter(
      (p) => p.network && (p.network.includes('solana') || p.network.includes('5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp'))
    );

    if (solanaPayments.length === 0) {
      return res.status(400).json({ error: 'No Solana payment options found' });
    }

    res.json({
      payment_requirements: solanaPayments,
      recommended: solanaPayments[0],
      total_options: solanaPayments.length,
    });
  } catch (err) {
    console.error('Parse payment error:', err.message);
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
    res.status(500).json({ error: err.message });
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

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Step 1: Parse payment requirements
    let parsedPayment;
    try {
      const parseResponse = await axios.post(
        `${baseUrl}/api/x402/parse-payment`,
        { payment_response_body }
      );
      parsedPayment = parseResponse.data;
    } catch (err) {
      return res.status(400).json({
        error: 'Failed to parse payment requirements',
        message: err.response?.data?.error || err.message,
      });
    }

    const paymentReq = parsedPayment.recommended || parsedPayment.payment_requirements[0];
    const requiredToken = paymentReq.asset || paymentReq.token_mint;
    const requiredAmount = BigInt(paymentReq.amount || paymentReq.amount_required || '0');

    // Step 2: Check balance
    let balanceResponse;
    try {
      balanceResponse = await axios.get(`${baseUrl}/api/balance`, {
        params: { wallet_address, token_mint: requiredToken },
      });
    } catch (err) {
      return res.status(500).json({
        error: 'Failed to check balance',
        message: err.response?.data?.error || err.message,
      });
    }

    const currentBalance = BigInt(balanceResponse.data.balance || '0');
    const hasEnough = currentBalance >= requiredAmount;

    // Step 3: If sufficient balance, return ready status
    if (hasEnough) {
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

    // Step 4: Need to swap - get quote
    const inputToken = preferred_input_token || TOKENS.SOL;
    const shortfall = requiredAmount - currentBalance;

    let quoteResponse;
    try {
      quoteResponse = await axios.get(`${baseUrl}/api/quote`, {
        params: {
          input_mint: inputToken,
          output_mint: requiredToken,
          amount: shortfall.toString(),
          slippage_bps: 50,
        },
      });
    } catch (err) {
      return res.status(500).json({
        ready: false,
        payment_ready: false,
        has_sufficient_balance: false,
        current_balance: currentBalance.toString(),
        required_amount: requiredAmount.toString(),
        shortfall: shortfall.toString(),
        error: 'Failed to get swap quote',
        message: err.response?.data?.error || err.message,
        suggestion: 'Try a different input token or check if swap route exists',
      });
    }

    const swapInfo = {
      input_token: inputToken,
      output_token: requiredToken,
      input_amount: quoteResponse.data.input_amount,
      output_amount: quoteResponse.data.output_after_fee,
      fee_amount: quoteResponse.data.fee_amount,
      price_impact: quoteResponse.data.price_impact,
    };

    // Step 5: If auto_swap is true, build swap transaction
    let swapTransaction = null;
    if (auto_swap) {
      try {
        const buildResponse = await axios.post(`${baseUrl}/api/swap/build`, {
          wallet_address,
          input_mint: inputToken,
          output_mint: requiredToken,
          amount: quoteResponse.data.input_amount,
          slippage_bps: 50,
        });
        swapTransaction = {
          transaction: buildResponse.data.transaction,
          fee_amount: buildResponse.data.fee_amount,
          output_amount: buildResponse.data.output_after_fee,
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
    res.status(500).json({
      error: 'Failed to process auto-pay request',
      message: err.message,
    });
  }
});

module.exports = router;
