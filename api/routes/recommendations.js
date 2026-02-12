/**
 * Token recommendation routes
 * Provides intelligent token recommendations for agents
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getAgentMetadata, AGENT_FRIENDLY_TOKENS, COMMONLY_ACCEPTED_TOKENS } = require('../utils/agentMetadata');
const { EXTERNAL_APIS, TOKENS } = require('../config/constants');
const { getJupiterTokenList } = require('../utils/tokenCache');

/**
 * GET /api/tokens (legacy — backward compatibility)
 * Returns first 100 tokens from cached Jupiter list
 */
router.get('/', async (req, res) => {
  try {
    const tokens = (await getJupiterTokenList()).slice(0, 100);
    res.json({ tokens });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/tokens/recommend
 * Get token recommendations based on use case
 * 
 * Query parameters:
 * - use_case: 'payment' | 'swap' | 'liquidity' (default: 'payment')
 * - min_liquidity: Minimum liquidity score (0-100, default: 50)
 * - limit: Maximum number of recommendations (default: 10, max: 50)
 * - category: 'stablecoin' | 'agent-token' | 'all' (default: 'all')
 */
router.get('/recommend', async (req, res) => {
  try {
    const { 
      use_case = 'payment',
      min_liquidity = 50,
      limit = 10,
      category = 'all',
    } = req.query;

    const minLiquidityScore = Math.max(0, Math.min(100, parseInt(min_liquidity) || 50));
    const maxLimit = Math.min(parseInt(limit) || 10, 50);

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
        code: 'EXTERNAL_API_ERROR',
        suggestions: [
          'Retry the request after a few seconds',
          'Check Jupiter API status',
        ],
      });
    }

    // Filter by category
    let filteredTokens = jupiterTokens;
    if (category === 'stablecoin') {
      filteredTokens = jupiterTokens.filter((t) =>
        ['USDC', 'USDT', 'USD1'].includes(t.symbol)
      );
    } else if (category === 'agent-token') {
      // Filter to agent-friendly tokens
      filteredTokens = jupiterTokens.filter((t) =>
        AGENT_FRIENDLY_TOKENS.some((addr) => addr.toLowerCase() === t.address.toLowerCase())
      );
    }

    // Score tokens based on use case
    const scoredTokens = filteredTokens.map((token) => {
      const agentMetadata = getAgentMetadata(token.address);
      let score = agentMetadata.liquidity_score;

      // Adjust score based on use case
      if (use_case === 'payment') {
        // Prioritize commonly accepted tokens for payments
        if (agentMetadata.commonly_accepted) {
          score += 20; // Boost for commonly accepted
        }
        if (agentMetadata.agent_friendly) {
          score += 10; // Boost for agent-friendly
        }
      } else if (use_case === 'swap') {
        // For swaps, prioritize liquidity
        score = agentMetadata.liquidity_score;
      } else if (use_case === 'liquidity') {
        // For liquidity, prioritize high liquidity tokens
        if (agentMetadata.liquidity_score >= 90) {
          score += 15;
        }
      }

      return {
        ...token,
        agent_metadata: agentMetadata,
        recommendation_score: Math.min(100, score),
      };
    });

    // Filter by minimum liquidity and sort by score
    const recommendations = scoredTokens
      .filter((t) => t.agent_metadata.liquidity_score >= minLiquidityScore)
      .sort((a, b) => b.recommendation_score - a.recommendation_score)
      .slice(0, maxLimit)
      .map((token) => ({
        symbol: token.symbol,
        name: token.name,
        address: token.address,
        decimals: token.decimals,
        logo: token.logoURI,
        agent_metadata: token.agent_metadata,
        recommendation_score: token.recommendation_score,
        recommendation_reason: getRecommendationReason(token, use_case),
      }));

    res.json({
      use_case,
      min_liquidity: minLiquidityScore,
      recommendations,
      count: recommendations.length,
      criteria: {
        use_case,
        min_liquidity_score: minLiquidityScore,
        category,
      },
    });
  } catch (err) {
    console.error('Token recommendation error:', err.message);
    res.status(500).json({
      error: 'Failed to get token recommendations',
      message: err.message,
      code: 'INTERNAL_ERROR',
    });
  }
});

/**
 * Get recommendation reason for a token
 */
function getRecommendationReason(token, useCase) {
  const reasons = [];

  if (token.agent_metadata.commonly_accepted) {
    reasons.push('commonly accepted for x402 payments');
  }
  if (token.agent_metadata.agent_friendly) {
    reasons.push('agent-friendly token');
  }
  if (token.agent_metadata.liquidity_score >= 90) {
    reasons.push('high liquidity');
  } else if (token.agent_metadata.liquidity_score >= 75) {
    reasons.push('good liquidity');
  }

  if (useCase === 'payment' && token.agent_metadata.commonly_accepted) {
    reasons.push('ideal for payments');
  }

  return reasons.length > 0 ? reasons.join(', ') : 'available for trading';
}

module.exports = router;
