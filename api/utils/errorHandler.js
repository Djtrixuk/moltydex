/**
 * Enhanced error handling utilities
 * Provides structured, actionable error responses for agents
 */

/**
 * Create an enhanced error response with actionable guidance
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @param {Object} details - Additional error details
 * @param {Array<string>} suggestions - Actionable suggestions for the agent
 * @returns {Object} Structured error response
 */
function createErrorResponse(code, message, details = {}, suggestions = []) {
  return {
    error: message,
    error_code: code,
    ...(Object.keys(details).length > 0 && { details }),
    ...(suggestions.length > 0 && { suggestions }),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Error codes and their corresponding suggestions
 */
const ERROR_SUGGESTIONS = {
  INSUFFICIENT_BALANCE: [
    'Swap SOL to the required token using POST /api/swap/build',
    'Check your current balance at GET /api/balance',
    'Consider using a different input token if available',
  ],
  INVALID_TOKEN: [
    'Verify the token mint address is correct',
    'Search for tokens using GET /api/tokens/search?q=...',
    'Check token metadata at GET /api/token?mint=...',
  ],
  JUPITER_UNAVAILABLE: [
    'Retry the request after a few seconds',
    'Check Jupiter API status at https://status.jup.ag',
    'Use batch operations to reduce API calls',
  ],
  TRANSACTION_FAILED: [
    'Check transaction status at GET /api/transaction/status/:signature',
    'Verify you have sufficient SOL for transaction fees',
    'Ensure the transaction was signed correctly',
    'Check if the quote is still valid (quotes expire after ~30 seconds)',
  ],
  RATE_LIMIT_EXCEEDED: [
    'Wait for the rate limit window to reset',
    'Check rate limit status at GET /api/rate-limit/status',
    'Use batch operations to reduce API calls',
    'Consider implementing exponential backoff',
  ],
  INVALID_INPUT: [
    'Verify all required fields are provided',
    'Check that amounts are positive integers',
    'Ensure addresses are valid Solana addresses (44 characters)',
  ],
  QUOTE_EXPIRED: [
    'Get a new quote using GET /api/quote',
    'Quotes are valid for ~30 seconds',
    'Build and send the transaction immediately after getting a quote',
  ],
};

/**
 * Create error response for insufficient balance
 */
function insufficientBalanceError(required, available, tokenMint) {
  const shortfall = BigInt(required) - BigInt(available || '0');
  return createErrorResponse(
    'INSUFFICIENT_BALANCE',
    'Insufficient balance for this operation',
    {
      required: required.toString(),
      available: (available || '0').toString(),
      shortfall: shortfall.toString(),
      token_mint: tokenMint,
    },
    ERROR_SUGGESTIONS.INSUFFICIENT_BALANCE
  );
}

/**
 * Create error response for invalid token
 */
function invalidTokenError(tokenMint, reason = 'Token not found') {
  return createErrorResponse(
    'INVALID_TOKEN',
    `Invalid token: ${reason}`,
    { token_mint: tokenMint },
    ERROR_SUGGESTIONS.INVALID_TOKEN
  );
}

/**
 * Create error response for Jupiter API unavailability
 */
function jupiterUnavailableError() {
  return createErrorResponse(
    'JUPITER_UNAVAILABLE',
    'Jupiter API is currently unavailable',
    {},
    ERROR_SUGGESTIONS.JUPITER_UNAVAILABLE
  );
}

/**
 * Create error response for transaction failure
 */
function transactionFailedError(signature, reason) {
  return createErrorResponse(
    'TRANSACTION_FAILED',
    'Transaction failed',
    {
      signature,
      reason: reason || 'Unknown error',
    },
    ERROR_SUGGESTIONS.TRANSACTION_FAILED
  );
}

/**
 * Create error response for rate limit
 */
function rateLimitError(limit, remaining, resetAt) {
  return createErrorResponse(
    'RATE_LIMIT_EXCEEDED',
    'Rate limit exceeded',
    {
      limit,
      remaining,
      reset_at: resetAt,
    },
    ERROR_SUGGESTIONS.RATE_LIMIT_EXCEEDED
  );
}

/**
 * Create error response for invalid input
 */
function invalidInputError(field, reason) {
  return createErrorResponse(
    'INVALID_INPUT',
    `Invalid input: ${field}`,
    { field, reason },
    ERROR_SUGGESTIONS.INVALID_INPUT
  );
}

/**
 * Create error response for expired quote
 */
function quoteExpiredError() {
  return createErrorResponse(
    'QUOTE_EXPIRED',
    'Quote has expired. Get a new quote before building transaction.',
    {},
    ERROR_SUGGESTIONS.QUOTE_EXPIRED
  );
}

module.exports = {
  createErrorResponse,
  insufficientBalanceError,
  invalidTokenError,
  jupiterUnavailableError,
  transactionFailedError,
  rateLimitError,
  invalidInputError,
  quoteExpiredError,
  ERROR_SUGGESTIONS,
};
