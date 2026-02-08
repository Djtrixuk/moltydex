/**
 * Balance routes
 */

const express = require('express');
const router = express.Router();
const { getBalance } = require('../utils/balance');
const { insufficientBalanceError, invalidInputError } = require('../utils/errorHandler');
const analyticsRouter = require('./analytics');
const trackEvent = analyticsRouter.trackEvent;

/**
 * GET /api/balance
 * Get token balance for a wallet address
 */
router.get('/balance', async (req, res) => {
  try {
    const { wallet_address, token_mint } = req.query;

    if (!wallet_address) {
      return res.status(400).json(
        invalidInputError('wallet_address', 'Missing required parameter')
      );
    }

    // Debug logging for USDC and JUP balance issues
    const isUSDC = token_mint === 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
    const isJUP = token_mint && token_mint.toLowerCase() === 'jupyiwryjfskupiha7hker8vutaefosybkedznsdvcn';
    if (isUSDC || isJUP) {
      console.log(`[balance.js] ${isUSDC ? 'USDC' : 'JUP'} balance request:`, {
        wallet_address,
        token_mint,
      });
    }

    const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    const { Connection } = require('@solana/web3.js');
    // Use faster commitment level and longer timeout for pump.fun tokens
    const connection = new Connection(RPC_URL, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 30000, // Increased to 30 seconds for pump.fun tokens
      httpHeaders: {
        'Content-Type': 'application/json',
      },
    });

    const balance = await getBalance(connection, wallet_address, token_mint || null);

    // Debug logging for USDC and JUP balance response
    if (isUSDC || isJUP) {
      console.log(`[balance.js] ${isUSDC ? 'USDC' : 'JUP'} balance response:`, {
        balance: balance.balance,
        decimals: balance.decimals,
        has_balance: balance.has_balance,
        fullResponse: balance,
      });
    }

    // Track balance check
    trackEvent('balance', { token_mint: token_mint || 'SOL', wallet_address });
    trackEvent('api_call', { endpoint: '/api/balance' });

    if (balance.balance === '0' && !token_mint) {
      return res.json(balance);
    }

    res.json(balance);
  } catch (err) {
    console.error('Balance error:', {
      message: err.message,
      wallet_address: req.query.wallet_address,
      token_mint: req.query.token_mint,
      stack: err.stack,
    });

    if (err.statusCode === 429) {
      const { rateLimitError } = require('../utils/errorHandler');
      return res.status(429).json(
        rateLimitError(
          100, 
          0, 
          new Date(Date.now() + (err.retryAfter || 60) * 1000).toISOString()
        )
      );
    }

    res.status(500).json({
      error: 'Failed to fetch balance',
      code: 'BALANCE_FETCH_ERROR',
      message: err.message,
      suggestions: [
        'Verify the wallet address is correct',
        'Check if the token mint address is valid',
        'Retry after a few seconds',
      ],
    });
  }
});

module.exports = router;
