/**
 * Jupiter API utilities
 */

const axios = require('axios');
const { JUPITER_ENDPOINTS, DEFAULTS } = require('../config/constants');

/**
 * Fetch quote from Jupiter API with fallback endpoints
 * @param {Object} params - Quote parameters
 * @param {string} params.input_mint - Input token mint address
 * @param {string} params.output_mint - Output token mint address
 * @param {string} params.amount - Input amount (in smallest unit)
 * @param {number} params.slippage_bps - Slippage in basis points (default: 50)
 * @param {boolean} params.onlyDirectRoutes - Only direct routes (optional)
 * @param {string} apiKey - Jupiter API key (optional)
 * @returns {Promise<{data: Object, endpoint: string} | {errors: Array}>}
 */
async function fetchJupiterQuote(params, apiKey = '') {
  const { input_mint, output_mint, amount, slippage_bps = DEFAULTS.SLIPPAGE_BPS, onlyDirectRoutes } = params;
  
  // Jupiter API now requires API key - warn if missing
  if (!apiKey) {
    console.warn('JUPITER_API_KEY not set. Jupiter API requires an API key. Get one at https://portal.jup.ag');
  }
  
  const headers = apiKey ? { 'x-api-key': apiKey } : {};
  const errors = [];

  for (const endpoint of JUPITER_ENDPOINTS) {
    try {
      // Build query params for Jupiter API
      const query = {
        inputMint: input_mint,
        outputMint: output_mint,
        amount: amount.toString(), // Ensure it's a string
        slippageBps: slippage_bps,
      };
      
      // Fees disabled - no platformFeeBps
      // const FEE_BPS = parseInt(process.env.FEE_BPS || '10');
      // if (FEE_BPS > 0) {
      //   query.platformFeeBps = FEE_BPS;
      // }
      
      // Add optional parameters
      if (onlyDirectRoutes !== undefined) {
        query.onlyDirectRoutes = onlyDirectRoutes;
      }
      
      // For pump.fun tokens (addresses ending in "pump"), don't restrict intermediate tokens
      // This allows routing through pump.fun AMMs which may be needed for new/low liquidity tokens
      // Jupiter's UI doesn't restrict intermediate tokens by default, so we match that behavior
      const isPumpFunToken = output_mint.toLowerCase().endsWith('pump') || input_mint.toLowerCase().endsWith('pump');
      if (!isPumpFunToken) {
        // For regular tokens, restrict to highly liquid intermediate tokens for better stability
        query.restrictIntermediateTokens = true;
      }
      // For pump.fun tokens, we don't set restrictIntermediateTokens, allowing all routing options
      
      // Increase maxAccounts for pump.fun tokens to allow routing through Pump.fun AMM (requires 42 accounts)
      // This helps new tokens that might only be available through pump.fun
      if (isPumpFunToken) {
        query.maxAccounts = 64; // Allow enough accounts for Pump.fun AMM (42) + routing overhead
      }
      
      // Note: asLegacyTransaction is NOT needed for quote endpoint
      // It's only used when building the swap transaction

      // Jupiter API quote endpoint path
      const quotePath = '/quote';
      
      // Jupiter API requires x-api-key header (even for free tier)
      // Without it, returns 401 Unauthorized
      const requestHeaders = apiKey ? { 'x-api-key': apiKey } : {};
      
      const { data } = await axios.get(`${endpoint}${quotePath}`, {
        params: query,
        headers: requestHeaders,
        timeout: DEFAULTS.QUOTE_TIMEOUT,
      });
      
      // Validate response has required fields
      if (!data || (!data.outAmount && !data.outAmountWithSlippage && !data.outAmountWithoutSlippage)) {
        throw new Error('Invalid quote response: missing outAmount');
      }
      
      return { data, endpoint };
    } catch (err) {
      const status = err.response?.status;
      const statusText = err.response?.statusText;
      const errorData = err.response?.data;
      const errorMsg = errorData?.error || errorData?.message || err.message;
      
      errors.push({
        endpoint: `${endpoint}${quotePath}`,
        status,
        statusText,
        message: errorMsg,
        data: errorData,
        fullUrl: `${endpoint}${quotePath}?inputMint=${input_mint}&outputMint=${output_mint}&amount=${amount}&slippageBps=${slippage_bps}`,
      });
      
      console.warn(`Jupiter ${endpoint}${quotePath} failed:`, {
        status,
        statusText,
        message: err.message,
        data: errorData,
        hasApiKey: !!apiKey,
        input_mint,
        output_mint,
        amount,
        query: {
          inputMint: input_mint,
          outputMint: output_mint,
          amount: amount.toString(),
          slippageBps: slippage_bps,
        },
      });
    }
  }

  return { errors };
}

module.exports = {
  fetchJupiterQuote,
};
