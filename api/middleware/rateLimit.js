/**
 * Rate limiting middleware
 */
const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: true, // Enable `X-RateLimit-*` headers for agent compatibility
  skip: (req) => {
    // Skip rate limiting for health checks, balance endpoints, and quote endpoints
    // These are read-only, cheap, and necessary for UI functionality
    // Check both full path and path without /api prefix (Express path behavior)
    const path = req.path || '';
    const originalUrl = req.originalUrl || req.url || '';
    const baseUrl = req.baseUrl || '';
    
    // Combine all possible path variations - check multiple formats
    const fullPath = originalUrl.split('?')[0].toLowerCase(); // Remove query params and normalize
    const relativePath = path.toLowerCase();
    const urlPath = (req.url || '').split('?')[0].toLowerCase();
    
    // Check various path combinations - be very permissive for balance endpoints
    const isHealth = fullPath.includes('/health') || relativePath.includes('/health') || urlPath.includes('/health');
    const isBalance = fullPath.includes('/balance') || relativePath.includes('/balance') || urlPath.includes('/balance');
    const isQuote = fullPath.includes('/quote') || relativePath.includes('/quote') || urlPath.includes('/quote');
    const isBatchBalance = fullPath.includes('/batch/balance') || relativePath.includes('/batch/balance') || urlPath.includes('/batch/balance');
    const isTokenMetadata = (fullPath.includes('/token') && !fullPath.includes('/tokens/')) || 
                           (relativePath.includes('/token') && !relativePath.includes('/tokens/')) ||
                           (urlPath.includes('/token') && !urlPath.includes('/tokens/'));
    const isWalletTokens = fullPath.includes('/wallet/tokens') || relativePath.includes('/wallet/tokens') || urlPath.includes('/wallet/tokens');
    
    const shouldSkip = isHealth || isBalance || isQuote || isBatchBalance || isTokenMetadata || isWalletTokens;
    
    if (shouldSkip) {
      console.log('[rateLimit] ✅ Skipping rate limit for:', { 
        path, 
        originalUrl, 
        fullPath, 
        relativePath,
        urlPath,
        reason: isHealth ? 'health' : isBalance ? 'balance' : isQuote ? 'quote' : isBatchBalance ? 'batch-balance' : isTokenMetadata ? 'token-metadata' : 'wallet-tokens'
      });
    } else {
      console.log('[rateLimit] ⚠️ Rate limiting:', { 
        path, 
        originalUrl, 
        fullPath, 
        relativePath,
        urlPath
      });
    }
    
    return shouldSkip;
  },
  // Custom handler to add rate limit info to response
  handler: (req, res) => {
    const rateLimitInfo = {
      limit: req.rateLimit.limit,
      remaining: req.rateLimit.remaining,
      reset: new Date(Date.now() + req.rateLimit.resetTime - Date.now()).toISOString(),
    };
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: '15 minutes',
      rateLimit: rateLimitInfo,
    });
  },
});

// Stricter limit for swap operations
const swapLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 swaps per minute per IP
  message: {
    error: 'Too many swap requests, please try again later.',
    retryAfter: '1 minute',
  },
  standardHeaders: true,
  legacyHeaders: true,
  handler: (req, res) => {
    const rateLimitInfo = {
      limit: req.rateLimit.limit,
      remaining: req.rateLimit.remaining,
      reset: new Date(Date.now() + req.rateLimit.resetTime - Date.now()).toISOString(),
    };
    res.status(429).json({
      error: 'Too many swap requests, please try again later.',
      retryAfter: '1 minute',
      rateLimit: rateLimitInfo,
    });
  },
});

// Very strict limit for quote requests (can be expensive)
const quoteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 quotes per minute
  message: {
    error: 'Too many quote requests, please try again later.',
    retryAfter: '1 minute',
  },
  standardHeaders: true,
  legacyHeaders: true,
  handler: (req, res) => {
    const rateLimitInfo = {
      limit: req.rateLimit.limit,
      remaining: req.rateLimit.remaining,
      reset: new Date(Date.now() + req.rateLimit.resetTime - Date.now()).toISOString(),
    };
    res.status(429).json({
      error: 'Too many quote requests, please try again later.',
      retryAfter: '1 minute',
      rateLimit: rateLimitInfo,
    });
  },
});

module.exports = {
  apiLimiter,
  swapLimiter,
  quoteLimiter,
};
