/**
 * Jupiter token list cache
 * Fetches once and caches in memory with TTL to avoid hitting Jupiter on every request.
 */

const axios = require('axios');
const { EXTERNAL_APIS } = require('../config/constants');

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_TOKENS = 20000; // Safety bound

let cachedTokens = null;
let cachedAt = 0;
let fetchPromise = null; // Dedup concurrent fetches

/**
 * Get the full Jupiter token list (cached).
 * @returns {Promise<Array>} Array of token objects
 */
async function getJupiterTokenList() {
  const now = Date.now();

  // Return cache if fresh
  if (cachedTokens && now - cachedAt < CACHE_TTL_MS) {
    return cachedTokens;
  }

  // Dedup: if a fetch is already in flight, wait for it
  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = (async () => {
    try {
      const response = await axios.get(EXTERNAL_APIS.JUPITER_TOKEN_LIST, { timeout: 15000 });
      const tokens = response.data
        .filter((t) => t.chainId === 101 || t.chainId === 103)
        .slice(0, MAX_TOKENS);

      cachedTokens = tokens;
      cachedAt = Date.now();
      return tokens;
    } catch (err) {
      console.warn('[tokenCache] Failed to refresh Jupiter token list:', err.message);
      // Return stale cache if available
      if (cachedTokens) return cachedTokens;
      return [];
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

/**
 * Lookup a single token by mint address (cached).
 * @param {string} mint - Token mint address
 * @returns {Promise<Object|null>}
 */
async function lookupToken(mint) {
  const tokens = await getJupiterTokenList();
  return tokens.find((t) => t.address === mint) || null;
}

/**
 * Search tokens by query string (cached).
 * @param {string} query - Search query (symbol, name, or address)
 * @param {number} limit - Max results
 * @returns {Promise<Array>}
 */
async function searchTokens(query, limit = 20) {
  const tokens = await getJupiterTokenList();
  const q = query.toLowerCase().trim();

  // Exact address match
  const exactAddress = tokens.find((t) => t.address === query);
  if (exactAddress) return [exactAddress];

  // Symbol/name search
  return tokens
    .filter((t) =>
      t.symbol?.toLowerCase().includes(q) ||
      t.name?.toLowerCase().includes(q) ||
      t.address?.toLowerCase().includes(q)
    )
    .slice(0, limit);
}

/**
 * Get cache stats for debugging.
 */
function getCacheStats() {
  return {
    cached: !!cachedTokens,
    tokenCount: cachedTokens?.length || 0,
    ageMs: cachedTokens ? Date.now() - cachedAt : null,
    ttlMs: CACHE_TTL_MS,
  };
}

module.exports = {
  getJupiterTokenList,
  lookupToken,
  searchTokens,
  getCacheStats,
};
