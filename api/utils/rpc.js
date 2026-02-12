/**
 * RPC connection utilities with retry and fallback support
 */

const { Connection } = require('@solana/web3.js');

// RPC configuration — never fall back to public RPC in production
const PUBLIC_RPC = 'https://api.mainnet-beta.solana.com';
const PRIMARY_RPC = process.env.SOLANA_RPC_URL || PUBLIC_RPC;
const FALLBACK_RPC = process.env.SOLANA_RPC_FALLBACK || process.env.SOLANA_RPC_URL || PUBLIC_RPC;

if (PRIMARY_RPC === PUBLIC_RPC && process.env.NODE_ENV === 'production') {
  console.warn('[RPC] WARNING: Using public Solana RPC in production. Set SOLANA_RPC_URL to a dedicated provider (Helius, Alchemy, etc.)');
}
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000; // 1 second base delay

/**
 * Check if an error is a rate limit error
 */
function isRateLimitError(error) {
  const errorMsg = error?.message || String(error) || '';
  return (
    errorMsg.includes('429') ||
    errorMsg.includes('Too Many Requests') ||
    errorMsg.includes('rate limit') ||
    errorMsg.includes('RPC rate limit') ||
    error?.statusCode === 429
  );
}

/**
 * Check if an error is retryable
 */
function isRetryableError(error) {
  if (!error) return false;
  
  const errorMsg = error?.message || String(error) || '';
  
  // Rate limit errors are retryable
  if (isRateLimitError(error)) return true;
  
  // Network errors are retryable
  if (
    errorMsg.includes('ECONNRESET') ||
    errorMsg.includes('ETIMEDOUT') ||
    errorMsg.includes('ENOTFOUND') ||
    errorMsg.includes('timeout')
  ) {
    return true;
  }
  
  // 503 Service Unavailable is retryable
  if (error?.statusCode === 503 || errorMsg.includes('503')) {
    return true;
  }
  
  return false;
}

/**
 * Create a Solana Connection with proper configuration
 */
function createConnection(rpcUrl) {
  return new Connection(rpcUrl, {
    commitment: 'confirmed',
    confirmTransactionInitialTimeout: 30000,
    httpHeaders: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Execute an RPC operation with retry and fallback logic
 * @param {Function} operation - Async function that takes a Connection and returns a result
 * @param {Object} options - Options for retry behavior
 * @returns {Promise<any>} - Result of the operation
 */
async function executeWithRetry(operation, options = {}) {
  const {
    maxRetries = MAX_RETRIES,
    retryDelayBase = RETRY_DELAY_BASE,
    useFallback = true,
    rpcUrl = PRIMARY_RPC,
    fallbackRpcUrl = FALLBACK_RPC,
  } = options;

  let lastError = null;
  let currentRpc = rpcUrl;
  let connection = createConnection(currentRpc);

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await operation(connection);
      return result;
    } catch (error) {
      lastError = error;
      
      // If not retryable, fail immediately
      if (!isRetryableError(error)) {
        throw error;
      }

      // If rate limited and we have a fallback, try switching RPC
      if (isRateLimitError(error) && useFallback && attempt === 0 && currentRpc === rpcUrl && fallbackRpcUrl !== rpcUrl) {
        console.log(`[RPC] Rate limit detected, switching to fallback RPC: ${fallbackRpcUrl}`);
        currentRpc = fallbackRpcUrl;
        connection = createConnection(currentRpc);
        continue; // Retry immediately with fallback
      }

      // If this is the last attempt, throw
      if (attempt === maxRetries - 1) {
        break;
      }

      // Exponential backoff
      const waitTime = Math.pow(2, attempt) * retryDelayBase;
      console.log(`[RPC] Retry attempt ${attempt + 1}/${maxRetries} after ${waitTime}ms. Error: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  // If we got here, all retries failed
  if (isRateLimitError(lastError)) {
    const rateLimitError = new Error('RPC rate limit exceeded. Please try again in a moment.');
    rateLimitError.statusCode = 429;
    rateLimitError.retryAfter = 60;
    rateLimitError.originalError = lastError;
    throw rateLimitError;
  }

  throw lastError || new Error('RPC operation failed');
}

/**
 * Get the current RPC URL being used
 */
function getCurrentRpcUrl() {
  return PRIMARY_RPC;
}

/**
 * Get the fallback RPC URL
 */
function getFallbackRpcUrl() {
  return FALLBACK_RPC;
}

/**
 * Get a shared Connection instance (lazy singleton per RPC URL).
 * Avoids creating a new Connection object on every request.
 */
let _sharedConnection = null;
let _sharedRpcUrl = null;

function getConnection() {
  const rpcUrl = getCurrentRpcUrl();
  if (!_sharedConnection || _sharedRpcUrl !== rpcUrl) {
    _sharedConnection = createConnection(rpcUrl);
    _sharedRpcUrl = rpcUrl;
  }
  return _sharedConnection;
}

module.exports = {
  createConnection,
  getConnection,
  executeWithRetry,
  isRateLimitError,
  isRetryableError,
  getCurrentRpcUrl,
  getFallbackRpcUrl,
  PRIMARY_RPC,
  FALLBACK_RPC,
};
