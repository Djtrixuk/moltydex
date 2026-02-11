/**
 * Jupiter Ultra API routes
 * 
 * Ultra Swap uses a two-step flow:
 * 1. GET /order - Get quote + unsigned transaction
 * 2. POST /execute - Submit signed transaction
 * 
 * Plus data endpoints: holdings, search, shield
 * 
 * Docs: https://dev.jup.ag/docs/ultra/get-started
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');

const ULTRA_BASE = 'https://api.jup.ag/ultra/v1';

/**
 * Get API key headers
 */
function getHeaders() {
  const apiKey = process.env.JUPITER_API_KEY || '';
  const headers = {};
  if (apiKey) {
    headers['x-api-key'] = apiKey;
  }
  return headers;
}

/**
 * GET /api/ultra/order
 * Get a swap quote and unsigned transaction from Jupiter Ultra
 * 
 * Query params:
 *   - inputMint (required): Input token mint address
 *   - outputMint (required): Output token mint address
 *   - amount (required): Input amount in smallest units (lamports)
 *   - taker (optional): Wallet address - if provided, returns a signable transaction
 *   - slippageBps (optional): Slippage tolerance in basis points
 */
router.get('/order', async (req, res) => {
  try {
    const { inputMint, outputMint, amount, taker, slippageBps } = req.query;

    if (!inputMint || !outputMint || !amount) {
      return res.status(400).json({
        error: 'Missing required parameters: inputMint, outputMint, amount',
      });
    }

    const params = { inputMint, outputMint, amount };
    if (taker) params.taker = taker;
    if (slippageBps) params.slippageBps = slippageBps;

    const { data } = await axios.get(`${ULTRA_BASE}/order`, {
      params,
      headers: getHeaders(),
      timeout: 15000,
    });

    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    const errorData = err.response?.data || { error: err.message };
    console.error('[Ultra /order] Error:', {
      status,
      data: errorData,
      params: req.query,
    });
    res.status(status).json(errorData);
  }
});

/**
 * POST /api/ultra/execute
 * Execute a signed Ultra swap transaction
 * 
 * Body:
 *   - signedTransaction (required): Base64-encoded signed transaction
 *   - requestId (required): Request ID from /order response
 */
router.post('/execute', async (req, res) => {
  try {
    const { signedTransaction, requestId } = req.body;

    if (!signedTransaction || !requestId) {
      return res.status(400).json({
        error: 'Missing required fields: signedTransaction, requestId',
      });
    }

    const { data } = await axios.post(
      `${ULTRA_BASE}/execute`,
      { signedTransaction, requestId },
      {
        headers: {
          ...getHeaders(),
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    const errorData = err.response?.data || { error: err.message };
    console.error('[Ultra /execute] Error:', {
      status,
      data: errorData,
    });
    res.status(status).json(errorData);
  }
});

/**
 * GET /api/ultra/holdings/:address
 * Get token holdings for a wallet address via Jupiter Ultra
 * 
 * Returns SOL balance + all SPL token balances
 */
router.get('/holdings/:address', async (req, res) => {
  try {
    const { address } = req.params;

    if (!address) {
      return res.status(400).json({ error: 'Missing wallet address' });
    }

    const { data } = await axios.get(`${ULTRA_BASE}/holdings/${address}`, {
      headers: getHeaders(),
      timeout: 15000,
    });

    // Pass through the raw Jupiter Ultra response
    // Response format: { amount, uiAmount, uiAmountString, tokens: { [mint]: [...accounts] } }
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    const errorData = err.response?.data || { error: err.message };
    console.error('[Ultra /holdings] Error:', {
      status,
      data: errorData,
      address: req.params.address,
    });
    res.status(status).json(errorData);
  }
});

/**
 * GET /api/ultra/search
 * Search for tokens by symbol, name, or mint address
 * 
 * Query params:
 *   - query (required): Search query (symbol, name, or mint address)
 */
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Missing query parameter' });
    }

    const { data } = await axios.get(`${ULTRA_BASE}/search`, {
      params: { query },
      headers: getHeaders(),
      timeout: 10000,
    });

    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    const errorData = err.response?.data || { error: err.message };
    console.error('[Ultra /search] Error:', {
      status,
      data: errorData,
      query: req.query.query,
    });
    res.status(status).json(errorData);
  }
});

/**
 * GET /api/ultra/shield
 * Get token security/audit information
 * 
 * Query params:
 *   - mints (required): Comma-separated mint addresses
 */
router.get('/shield', async (req, res) => {
  try {
    const { mints } = req.query;

    if (!mints) {
      return res.status(400).json({ error: 'Missing mints parameter' });
    }

    const { data } = await axios.get(`${ULTRA_BASE}/shield`, {
      params: { mints },
      headers: getHeaders(),
      timeout: 10000,
    });

    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    const errorData = err.response?.data || { error: err.message };
    console.error('[Ultra /shield] Error:', {
      status,
      data: errorData,
    });
    res.status(status).json(errorData);
  }
});

module.exports = router;
