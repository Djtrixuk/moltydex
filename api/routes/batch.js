/**
 * Batch operations routes
 * Allow agents to check multiple balances/quotes/metadata in one call
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const { validate } = require('../middleware/validation');
const { fetchJupiterQuote } = require('../utils/jupiter');
const { DEFAULTS } = require('../config/constants');
const analyticsRouter = require('./analytics');
const trackEvent = analyticsRouter.trackEvent;

/**
 * POST /api/batch/balance
 * Get multiple token balances in one request (optimized - single RPC call)
 * Uses getParsedTokenAccountsByOwner once, then filters client-side
 */
router.post('/balance', validate('batchBalance'), async (req, res) => {
  try {
    const { wallet_address, token_mints } = req.body;

    if (!wallet_address) {
      return res.status(400).json({ error: 'Missing wallet_address' });
    }

    if (!token_mints || !Array.isArray(token_mints) || token_mints.length === 0) {
      return res.status(400).json({ error: 'Missing token_mints array' });
    }

    if (token_mints.length > 100) {
      return res.status(400).json({ error: 'Maximum 100 token mints per batch' });
    }

    const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
    const { TOKEN_PROGRAM_ID, TOKENS } = require('../config/constants');
    // Use faster commitment level and add timeout
    const connection = new Connection(RPC_URL, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 30000,
      httpHeaders: {
        'Content-Type': 'application/json',
      },
    });

    const walletPubkey = new PublicKey(wallet_address);
    const tokenMintSet = new Set(token_mints.map(m => m.toLowerCase()));

    // Get SOL balance and token accounts in parallel for faster response
    const [solBalance, response] = await Promise.all([
      connection.getBalance(walletPubkey, 'confirmed'),
      connection.getParsedTokenAccountsByOwner(
        walletPubkey,
        { programId: TOKEN_PROGRAM_ID },
        'confirmed'
      ).catch(err => {
        console.error('[batch] Error fetching token accounts:', err.message);
        return { value: [] }; // Return empty on error
      }),
    ]);
    
    const solBalanceData = {
      wallet_address,
      token_mint: TOKENS.SOL,
      balance: solBalance.toString(),
      balance_sol: (solBalance / LAMPORTS_PER_SOL).toFixed(9),
      decimals: 9,
      has_balance: solBalance > 0n,
    };

    const allTokenAccounts = response.value || [];
    
    // Create a map of mint -> balance data
    const balanceMap = new Map();
    
    // Initialize all requested tokens with zero balance
    token_mints.forEach(mint => {
      balanceMap.set(mint.toLowerCase(), {
        wallet_address,
        token_mint: mint,
        balance: '0',
        decimals: 9,
        has_balance: false,
      });
    });

    // Process token accounts and match to requested mints
    for (const account of allTokenAccounts) {
      const parsedInfo = account.account?.data?.parsed?.info;
      if (!parsedInfo) continue;

      const mint = parsedInfo.mint?.toLowerCase();
      if (!mint || !tokenMintSet.has(mint)) continue;

      const tokenAmount = parsedInfo.tokenAmount;
      const amount = BigInt(tokenAmount.amount || '0');
      const decimals = tokenAmount.decimals || 9;

      const existing = balanceMap.get(mint);
      if (existing) {
        // Sum balances if multiple accounts for same mint
        const currentBalance = BigInt(existing.balance || '0');
        balanceMap.set(mint, {
          wallet_address,
          token_mint: parsedInfo.mint, // Use original case
          balance: (currentBalance + amount).toString(),
          decimals,
          has_balance: true,
        });
      } else {
        balanceMap.set(mint, {
          wallet_address,
          token_mint: parsedInfo.mint,
          balance: amount.toString(),
          decimals,
          has_balance: amount > 0n,
        });
      }
    }

    // Build results array in the same order as token_mints
    const results = token_mints.map(mint => {
      const mintLower = mint.toLowerCase();
      if (mintLower === TOKENS.SOL.toLowerCase()) {
        return {
          token_mint: mint,
          success: true,
          data: solBalanceData,
        };
      }
      
      const balanceData = balanceMap.get(mintLower);
      if (balanceData) {
        return {
          token_mint: mint,
          success: true,
          data: balanceData,
        };
      }
      
      return {
        token_mint: mint,
        success: false,
        error: 'Token mint not found in wallet accounts',
      };
    });

    // Track batch balance request
    await trackEvent('balance', { batch: true, token_count: token_mints.length });
    await trackEvent('api_call', { endpoint: '/api/batch/balance' });
    
    res.json({
      wallet_address,
      results,
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
    });
  } catch (err) {
    console.error('Batch balance error:', err.message);
    res.status(500).json({
      error: 'Failed to process batch balance request',
      message: err.message,
    });
  }
});

/**
 * POST /api/batch/balances (legacy - uses optimized batch endpoint internally)
 * @deprecated Use /api/batch/balance instead for better performance
 */
router.post('/balances', validate('batchBalances'), async (req, res) => {
  try {
    const { requests } = req.body;

    if (!requests || !Array.isArray(requests) || requests.length === 0) {
      return res.status(400).json({ error: 'Missing requests array' });
    }

    if (requests.length > 50) {
      return res.status(400).json({ error: 'Maximum 50 requests per batch' });
    }

    // Extract wallet_address (should be same for all) and token_mints
    const wallet_address = requests[0]?.wallet_address;
    if (!wallet_address) {
      return res.status(400).json({ error: 'Missing wallet_address in requests' });
    }

    // Verify all requests have same wallet_address
    if (!requests.every(r => r.wallet_address === wallet_address)) {
      return res.status(400).json({ error: 'All requests must have the same wallet_address' });
    }

    const token_mints = requests.map(r => r.token_mint || require('../config/constants').TOKENS.SOL);

    // Use optimized batch endpoint by calling it directly
    const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
    const { TOKEN_PROGRAM_ID, TOKENS } = require('../config/constants');
    const connection = new Connection(RPC_URL, 'confirmed');

    const walletPubkey = new PublicKey(wallet_address);
    const tokenMintSet = new Set(token_mints.map(m => m.toLowerCase()));

    // Get SOL balance
    const solBalance = await connection.getBalance(walletPubkey);
    const solBalanceData = {
      wallet_address,
      token_mint: TOKENS.SOL,
      balance: solBalance.toString(),
      balance_sol: (solBalance / LAMPORTS_PER_SOL).toFixed(9),
      decimals: 9,
      has_balance: solBalance > 0n,
    };

    // Get all token accounts in one RPC call
    const response = await connection.getParsedTokenAccountsByOwner(
      walletPubkey,
      { programId: TOKEN_PROGRAM_ID }
    );

    const allTokenAccounts = response.value || [];
    const balanceMap = new Map();
    
    token_mints.forEach(mint => {
      balanceMap.set(mint.toLowerCase(), {
        wallet_address,
        token_mint: mint,
        balance: '0',
        decimals: 9,
        has_balance: false,
      });
    });

    for (const account of allTokenAccounts) {
      const parsedInfo = account.account?.data?.parsed?.info;
      if (!parsedInfo) continue;

      const mint = parsedInfo.mint?.toLowerCase();
      if (!mint || !tokenMintSet.has(mint)) continue;

      const tokenAmount = parsedInfo.tokenAmount;
      const amount = BigInt(tokenAmount.amount || '0');
      const decimals = tokenAmount.decimals || 9;

      const existing = balanceMap.get(mint);
      if (existing) {
        const currentBalance = BigInt(existing.balance || '0');
        balanceMap.set(mint, {
          wallet_address,
          token_mint: parsedInfo.mint,
          balance: (currentBalance + amount).toString(),
          decimals,
          has_balance: true,
        });
      } else {
        balanceMap.set(mint, {
          wallet_address,
          token_mint: parsedInfo.mint,
          balance: amount.toString(),
          decimals,
          has_balance: amount > 0n,
        });
      }
    }

    // Build results in legacy format
    const results = requests.map(reqItem => {
      const mint = (reqItem.token_mint || TOKENS.SOL).toLowerCase();
      if (mint === TOKENS.SOL.toLowerCase()) {
        return {
          request: reqItem,
          success: true,
          data: solBalanceData,
        };
      }
      
      const balanceData = balanceMap.get(mint);
      if (balanceData) {
        return {
          request: reqItem,
          success: true,
          data: balanceData,
        };
      }
      
      return {
        request: reqItem,
        success: false,
        error: 'Token mint not found in wallet accounts',
      };
    });

    res.json({
      results,
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
    });
  } catch (err) {
    console.error('Batch balances (legacy) error:', err.message);
    res.status(500).json({
      error: 'Failed to process batch balance requests',
      message: err.message,
    });
  }
});

/**
 * POST /api/batch/quotes
 * Get multiple swap quotes in one request
 */
router.post('/quotes', validate('batchQuotes'), async (req, res) => {
  try {
    const { requests } = req.body;

    if (!requests || !Array.isArray(requests) || requests.length === 0) {
      return res.status(400).json({ error: 'Missing requests array' });
    }

    if (requests.length > 20) {
      return res.status(400).json({ error: 'Maximum 20 requests per batch' });
    }

    const JUPITER_API_KEY = process.env.JUPITER_API_KEY || '';
    const quotePromises = requests.map(async (reqItem) => {
      try {
        const quoteResult = await fetchJupiterQuote(
          {
            input_mint: reqItem.input_mint,
            output_mint: reqItem.output_mint,
            amount: reqItem.amount,
            slippage_bps: reqItem.slippage_bps || DEFAULTS.SLIPPAGE_BPS,
          },
          JUPITER_API_KEY
        );

        if (!quoteResult || quoteResult.errors) {
          return {
            request: reqItem,
            success: false,
            error: quoteResult?.errors?.[0]?.message || 'Quote unavailable',
          };
        }

        const data = quoteResult.data;
        const outAmount = BigInt(data.outAmount || '0');
        const feeAmount = 0n; // Zero platform fees
        return {
          request: reqItem,
          success: true,
          data: {
            input_mint: reqItem.input_mint,
            output_mint: reqItem.output_mint,
            input_amount: reqItem.amount,
            output_amount: outAmount.toString(),
            output_after_fee: outAmount.toString(),
            fee_amount: feeAmount.toString(),
            fee_bps: 0,
            price_impact: data.priceImpactPct || '0',
          },
        };
      } catch (err) {
        return {
          request: reqItem,
          success: false,
          error: err.message,
        };
      }
    });

    const results = await Promise.all(quotePromises);

    res.json({
      results,
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
    });
  } catch (err) {
    console.error('Batch quotes error:', err.message);
    res.status(500).json({
      error: 'Failed to process batch quote requests',
      message: err.message,
    });
  }
});

/**
 * POST /api/batch/token-metadata
 * Get metadata for multiple tokens in one request
 */
router.post('/token-metadata', validate('batchTokenMetadata'), async (req, res) => {
  try {
    const { token_addresses } = req.body;

    if (!token_addresses || !Array.isArray(token_addresses) || token_addresses.length === 0) {
      return res.status(400).json({ error: 'Missing token_addresses array' });
    }

    if (token_addresses.length > 50) {
      return res.status(400).json({ error: 'Maximum 50 tokens per batch' });
    }

    // Fetch Jupiter token list once for all lookups (instead of N self-HTTP calls)
    const { EXTERNAL_APIS } = require('../config/constants');
    let jupiterTokenMap = new Map();
    try {
      const jupResponse = await axios.get(EXTERNAL_APIS.JUPITER_TOKEN_LIST, { timeout: 10000 });
      for (const t of jupResponse.data) {
        if (t.chainId === 101 || t.chainId === 103) {
          jupiterTokenMap.set(t.address, t);
        }
      }
    } catch (err) {
      console.warn('[batch] Failed to fetch Jupiter token list:', err.message);
    }

    const metadataPromises = token_addresses.map(async (address) => {
      try {
        const token = jupiterTokenMap.get(address);
        if (token) {
          return {
            address,
            success: true,
            data: {
              mint: token.address,
              symbol: token.symbol,
              name: token.name,
              decimals: token.decimals,
              logo: token.logoURI || null,
            },
          };
        }
        return {
          address,
          success: false,
          error: 'Token not found in Jupiter token list',
        };
      } catch (err) {
        return {
          address,
          success: false,
          error: err.message,
        };
      }
    });

    const results = await Promise.all(metadataPromises);

    res.json({
      results,
      total: results.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
    });
  } catch (err) {
    console.error('Batch token metadata error:', err.message);
    res.status(500).json({
      error: 'Failed to process batch token metadata requests',
      message: err.message,
    });
  }
});

module.exports = router;
