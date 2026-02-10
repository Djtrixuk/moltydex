/**
 * Enhanced Error Response Utility
 * Provides structured error responses with codes, categories, and suggestions
 * Critical for agent debugging and better developer experience
 */

/**
 * Error categories for better error handling
 */
const ERROR_CATEGORIES = {
  VALIDATION: 'validation',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  NOT_FOUND: 'not_found',
  RATE_LIMIT: 'rate_limit',
  NETWORK: 'network',
  QUOTE: 'quote',
  TRANSACTION: 'transaction',
  BALANCE: 'balance',
  INTERNAL: 'internal',
};

/**
 * Error codes mapping
 */
const ERROR_CODES = {
  // Validation errors (400)
  MISSING_PARAMETERS: 'MISSING_PARAMETERS',
  INVALID_PARAMETERS: 'INVALID_PARAMETERS',
  INVALID_PAYMENT_REQUIREMENTS: 'INVALID_PAYMENT_REQUIREMENTS',
  INVALID_TOKEN_ADDRESS: 'INVALID_TOKEN_ADDRESS',
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  
  // Authentication/Authorization (401, 403)
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  
  // Not Found (404)
  TOKEN_NOT_FOUND: 'TOKEN_NOT_FOUND',
  TRANSACTION_NOT_FOUND: 'TRANSACTION_NOT_FOUND',
  
  // Rate Limit (429)
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  RPC_RATE_LIMIT_EXCEEDED: 'RPC_RATE_LIMIT_EXCEEDED',
  
  // Network errors (500, 502, 503)
  NETWORK_ERROR: 'NETWORK_ERROR',
  RPC_ERROR: 'RPC_ERROR',
  JUPITER_API_ERROR: 'JUPITER_API_ERROR',
  
  // Quote errors
  QUOTE_FAILED: 'QUOTE_FAILED',
  QUOTE_STALE: 'QUOTE_STALE',
  INSUFFICIENT_LIQUIDITY: 'INSUFFICIENT_LIQUIDITY',
  
  // Transaction errors
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  TRANSACTION_REJECTED: 'TRANSACTION_REJECTED',
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  
  // Balance errors
  BALANCE_CHECK_FAILED: 'BALANCE_CHECK_FAILED',
  
  // Internal errors (500)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SIMULATION_FAILED: 'SIMULATION_FAILED',
};

/**
 * Error suggestions for common issues
 */
const ERROR_SUGGESTIONS = {
  MISSING_PARAMETERS: 'Check that all required parameters are included in the request body.',
  INVALID_PARAMETERS: 'Verify parameter types and formats match the API specification.',
  INVALID_PAYMENT_REQUIREMENTS: 'Ensure payment_requirements includes asset and amount fields.',
  RATE_LIMIT_EXCEEDED: 'Wait before retrying or use batch endpoints to reduce request count.',
  RPC_RATE_LIMIT_EXCEEDED: 'Consider using a dedicated RPC provider for production use.',
  QUOTE_FAILED: 'Try again with a different amount or token pair. Check token addresses are valid.',
  QUOTE_STALE: 'Refetch the quote before executing the swap.',
  INSUFFICIENT_BALANCE: 'Check wallet balance and ensure sufficient funds for swap + fees.',
  BALANCE_CHECK_FAILED: 'Verify wallet address and token mint are correct. Retry the request.',
  NETWORK_ERROR: 'Check your internet connection and try again.',
  RPC_ERROR: 'Solana RPC may be experiencing issues. Retry the request.',
  JUPITER_API_ERROR: 'Jupiter aggregator may be temporarily unavailable. Try again later.',
};

/**
 * Create enhanced error response
 * @param {string} errorCode - Error code from ERROR_CODES
 * @param {string} message - Human-readable error message
 * @param {Object} details - Additional error details
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Enhanced error response object
 */
function createErrorResponse(errorCode, message, details = {}, statusCode = 500) {
  const category = getErrorCategory(errorCode);
  const suggestion = ERROR_SUGGESTIONS[errorCode] || null;
  
  return {
    error: message,
    error_code: errorCode,
    error_category: category,
    ...(suggestion && { suggestion }),
    ...(Object.keys(details).length > 0 && { details }),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get error category from error code
 * @param {string} errorCode - Error code
 * @returns {string} Error category
 */
function getErrorCategory(errorCode) {
  if (errorCode.startsWith('MISSING_') || errorCode.startsWith('INVALID_')) {
    return ERROR_CATEGORIES.VALIDATION;
  }
  if (errorCode.includes('RATE_LIMIT')) {
    return ERROR_CATEGORIES.RATE_LIMIT;
  }
  if (errorCode.includes('NETWORK') || errorCode.includes('RPC') || errorCode.includes('JUPITER')) {
    return ERROR_CATEGORIES.NETWORK;
  }
  if (errorCode.includes('QUOTE')) {
    return ERROR_CATEGORIES.QUOTE;
  }
  if (errorCode.includes('TRANSACTION')) {
    return ERROR_CATEGORIES.TRANSACTION;
  }
  if (errorCode.includes('BALANCE')) {
    return ERROR_CATEGORIES.BALANCE;
  }
  if (errorCode.includes('NOT_FOUND')) {
    return ERROR_CATEGORIES.NOT_FOUND;
  }
  return ERROR_CATEGORIES.INTERNAL;
}

/**
 * Send enhanced error response
 * @param {Object} res - Express response object
 * @param {string} errorCode - Error code
 * @param {string} message - Error message
 * @param {Object} details - Additional details
 * @param {number} statusCode - HTTP status code
 */
function sendErrorResponse(res, errorCode, message, details = {}, statusCode = 500) {
  const errorResponse = createErrorResponse(errorCode, message, details, statusCode);
  res.status(statusCode).json(errorResponse);
}

module.exports = {
  ERROR_CATEGORIES,
  ERROR_CODES,
  ERROR_SUGGESTIONS,
  createErrorResponse,
  getErrorCategory,
  sendErrorResponse,
};
