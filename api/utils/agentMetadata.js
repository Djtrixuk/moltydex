/**
 * Agent metadata utilities
 * Centralized logic for determining agent-friendly token properties
 */

const { AGENT_FRIENDLY_TOKENS, COMMONLY_ACCEPTED_TOKENS, TOKENS } = require('../config/constants');

/**
 * Check if a token is agent-friendly
 * @param {string} mintAddress - Token mint address
 * @returns {boolean} True if token is agent-friendly
 */
function isAgentFriendly(mintAddress) {
  if (!mintAddress) return false;
  return AGENT_FRIENDLY_TOKENS.some(
    (addr) => addr.toLowerCase() === mintAddress.toLowerCase()
  );
}

/**
 * Check if a token is commonly accepted for x402 payments
 * @param {string} mintAddress - Token mint address
 * @returns {boolean} True if token is commonly accepted
 */
function isCommonlyAccepted(mintAddress) {
  if (!mintAddress) return false;
  return COMMONLY_ACCEPTED_TOKENS.some(
    (addr) => addr.toLowerCase() === mintAddress.toLowerCase()
  );
}

/**
 * Calculate liquidity score for a token
 * @param {string} mintAddress - Token mint address
 * @returns {number} Liquidity score (0-100)
 */
function calculateLiquidityScore(mintAddress) {
  if (isCommonlyAccepted(mintAddress)) {
    return 95; // High liquidity for stablecoins/SOL
  }
  if (isAgentFriendly(mintAddress)) {
    return 75; // Medium-high liquidity for agent tokens
  }
  return 50; // Default/unknown liquidity
}

/**
 * Generate agent metadata for a token
 * @param {string} mintAddress - Token mint address
 * @param {number} customLiquidityScore - Optional custom liquidity score (overrides calculation)
 * @returns {Object} Agent metadata object
 */
function getAgentMetadata(mintAddress, customLiquidityScore = null) {
  const agentFriendly = isAgentFriendly(mintAddress);
  const commonlyAccepted = isCommonlyAccepted(mintAddress);
  const liquidityScore = customLiquidityScore ?? calculateLiquidityScore(mintAddress);

  return {
    agent_friendly: agentFriendly,
    commonly_accepted: commonlyAccepted,
    x402_compatible: true, // All SPL tokens are x402 compatible
    liquidity_score: liquidityScore,
    swap_fee_estimate: '0.1%', // MoltyDEX fee
  };
}

module.exports = {
  isAgentFriendly,
  isCommonlyAccepted,
  calculateLiquidityScore,
  getAgentMetadata,
  AGENT_FRIENDLY_TOKENS,
  COMMONLY_ACCEPTED_TOKENS,
};
