/**
 * Token routes
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const { PublicKey } = require('@solana/web3.js');
const { fetchTokenMetadata } = require('../utils/tokenMetadata');
const { getAgentMetadata } = require('../utils/agentMetadata');
const { EXTERNAL_APIS, TOKENS } = require('../config/constants');
const { createCacheMiddleware } = require('../middleware/cache');

// Cache token metadata for 1 hour (3600 seconds)
const tokenCache = createCacheMiddleware(3600, (req) => `token:${req.query.mint}`);

/**
 * GET /api/token
 * Get token metadata (decimals, symbol, name, logo)
 */
router.get('/token', tokenCache, async (req, res) => {
  try {
    const { mint } = req.query;

    if (!mint || typeof mint !== 'string') {
      return res.status(400).json({ error: 'Missing mint (token address)' });
    }

    // Special handling for native SOL
    if (mint.toLowerCase() === TOKENS.SOL.toLowerCase()) {
      return res.json({
        address: TOKENS.SOL,
        decimals: 9,
        symbol: 'SOL',
        name: 'Solana',
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
        agent_metadata: getAgentMetadata(TOKENS.SOL),
      });
    }

    const mintPubkey = new PublicKey(mint);
    const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    const { Connection } = require('@solana/web3.js');
    const connection = new Connection(RPC_URL, 'confirmed');

    let decimals = 9; // Default to 9 (SOL standard)
    let accountInfo = null;

    // Get decimals from on-chain mint account with shorter timeout (5 seconds)
    // Vercel functions have limited execution time, so we need to be fast
    try {
      accountInfo = await Promise.race([
        connection.getAccountInfo(mintPubkey),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('RPC timeout')), 5000)
        )
      ]);
      
      if (accountInfo) {
        // Mint account data: decimals is at offset 44
        decimals = accountInfo.data.readUInt8(44);
      }
    } catch (rpcErr) {
      // RPC failed or timed out - continue with default decimals
      console.warn(`RPC error for ${mint}:`, rpcErr.message);
    }

    // Fetch metadata from multiple sources with longer timeout for well-known tokens
    // Jupiter's token list should have most tokens, so we can afford a longer timeout
    let symbol = 'Custom';
    let name = `${mint.slice(0, 4)}...${mint.slice(-4)}`;
    let logo = undefined;
    
    try {
      // Use a longer timeout for metadata fetch (10 seconds) to ensure Jupiter's list loads
      const metadata = await Promise.race([
        fetchTokenMetadata(connection, mint),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Metadata fetch timeout')), 10000)
        )
      ]);
      symbol = metadata.symbol || symbol;
      name = metadata.name || name;
      logo = metadata.logo;
      
      // Log successful metadata fetch for debugging
      if (symbol !== 'Custom' && !name.includes('...')) {
        console.log(`[token.js] ✅ Successfully fetched metadata for ${mint}: ${symbol} (${name})`);
      }
    } catch (metadataErr) {
      // Metadata fetch failed or timed out - use defaults
      console.warn(`[token.js] Metadata fetch error for ${mint}:`, metadataErr.message);
    }

    // Return token info even if some sources failed
    // This allows the frontend to proceed with basic token info

    // Get agent metadata using centralized utility
    const agentMetadata = getAgentMetadata(mint);

    res.json({
      address: mint,
      decimals,
      symbol,
      name,
      logo,
      agent_metadata: agentMetadata,
    });
  } catch (err) {
    console.error('Token metadata error:', err.message, err.stack);
    
    // Handle PublicKey validation errors
    if (err.message && err.message.includes('Invalid public key')) {
      return res.status(400).json({
        error: 'Invalid token address',
        message: 'The provided mint address is not a valid Solana address',
        mint: req.query.mint,
      });
    }
    
    res.status(500).json({
      error: 'Failed to fetch token metadata',
      message: err.message || String(err),
      mint: req.query.mint,
    });
  }
});

/**
 * GET /api/tokens/search
 * Search for tokens by symbol, name, or address
 */
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q || typeof q !== 'string' || q.length < 1) {
      return res.status(400).json({ error: 'Missing or invalid search query (q)' });
    }

    const query = q.toLowerCase().trim();
    const maxLimit = Math.min(parseInt(limit) || 20, 100);

    // Fetch Jupiter token list
    let jupiterTokens = [];
    try {
      const response = await axios.get(EXTERNAL_APIS.JUPITER_TOKEN_LIST, {
        timeout: 5000,
      });
      jupiterTokens = response.data.filter(
        (t) => t.chainId === 101 || t.chainId === 103
      );
    } catch (err) {
      console.warn('Failed to fetch Jupiter token list:', err.message);
    }

    // Search tokens
    const matches = jupiterTokens
      .filter((token) => {
        const symbol = (token.symbol || '').toLowerCase();
        const name = (token.name || '').toLowerCase();
        const address = (token.address || '').toLowerCase();
        return (
          symbol.includes(query) ||
          name.includes(query) ||
          address.includes(query) ||
          address === query
        );
      })
      .slice(0, maxLimit)
      .map((token) => ({
        symbol: token.symbol,
        name: token.name,
        address: token.address,
        decimals: token.decimals,
        logo: token.logoURI,
        chain_id: token.chainId,
      }));

    // Add agent metadata to results using centralized utility
    const resultsWithMetadata = matches.map((token) => ({
      ...token,
      agent_metadata: getAgentMetadata(token.address),
    }));

    res.json({
      query,
      results: resultsWithMetadata,
      count: resultsWithMetadata.length,
      total_available: jupiterTokens.length,
    });
  } catch (err) {
    console.error('Token search error:', err.message);
    res.status(500).json({
      error: 'Failed to search tokens',
      message: err.message,
    });
  }
});

/**
 * GET /api/tokens/by-symbol
 * Get token by symbol (exact match)
 */
router.get('/by-symbol', async (req, res) => {
  try {
    const { symbol } = req.query;

    if (!symbol || typeof symbol !== 'string') {
      return res.status(400).json({ error: 'Missing symbol parameter' });
    }

    // Fetch Jupiter token list
    let jupiterTokens = [];
    try {
      const response = await axios.get(EXTERNAL_APIS.JUPITER_TOKEN_LIST, {
        timeout: 5000,
      });
      jupiterTokens = response.data.filter(
        (t) => t.chainId === 101 || t.chainId === 103
      );
    } catch (err) {
      return res.status(503).json({
        error: 'Failed to fetch token list',
        message: err.message,
      });
    }

    // Find exact match (case-insensitive)
    const token = jupiterTokens.find(
      (t) => t.symbol && t.symbol.toLowerCase() === symbol.toLowerCase()
    );

    if (!token) {
      return res.status(404).json({
        error: 'Token not found',
        symbol,
        suggestion: 'Try using /api/tokens/search?q=... to search',
      });
    }

    res.json({
      symbol: token.symbol,
      name: token.name,
      address: token.address,
      decimals: token.decimals,
      logo: token.logoURI,
      chain_id: token.chainId,
      agent_metadata: getAgentMetadata(token.address),
    });
  } catch (err) {
    console.error('Token by symbol error:', err.message);
    res.status(500).json({
      error: 'Failed to get token by symbol',
      message: err.message,
    });
  }
});

/**
 * GET /api/tokens/popular
 * Get popular tokens, optionally filtered by category
 */
router.get('/popular', async (req, res) => {
  try {
    const { category, limit = 50 } = req.query;
    const maxLimit = Math.min(parseInt(limit) || 50, 200);

    // Fetch Jupiter token list
    let jupiterTokens = [];
    try {
      const response = await axios.get(EXTERNAL_APIS.JUPITER_TOKEN_LIST, {
        timeout: 5000,
      });
      jupiterTokens = response.data.filter(
        (t) => t.chainId === 101 || t.chainId === 103
      );
    } catch (err) {
      return res.status(503).json({
        error: 'Failed to fetch token list',
        message: err.message,
      });
    }

    // Filter by category if specified
    let filtered = jupiterTokens;
    if (category) {
      const cat = category.toLowerCase();
      if (cat === 'stablecoin') {
        filtered = jupiterTokens.filter((t) =>
          ['USDC', 'USDT', 'USD1', 'USDC', 'USDT'].includes(t.symbol)
        );
      } else if (cat === 'agent-token') {
        // Agent-focused tokens (you can customize this list)
        const agentTokens = [
          'WhiteWhale',
          'PENGUIN',
          'URA',
          'BUTT',
          'SOL',
          'USDC',
          'USDT',
        ];
        filtered = jupiterTokens.filter((t) =>
          agentTokens.some((at) => t.symbol === at || t.name?.includes(at))
        );
      }
    }

    // Sort by popularity (you could add volume/liquidity sorting here)
    const popular = filtered
      .slice(0, maxLimit)
      .map((token) => ({
        symbol: token.symbol,
        name: token.name,
        address: token.address,
        decimals: token.decimals,
        logo: token.logoURI,
        chain_id: token.chainId,
      }));

    // Add agent metadata to popular tokens using centralized utility
    const tokensWithMetadata = popular.map((token) => ({
      ...token,
      agent_metadata: getAgentMetadata(token.address),
    }));

    res.json({
      category: category || 'all',
      tokens: tokensWithMetadata,
      count: tokensWithMetadata.length,
    });
  } catch (err) {
    console.error('Popular tokens error:', err.message);
    res.status(500).json({
      error: 'Failed to get popular tokens',
      message: err.message,
    });
  }
});

module.exports = router;
