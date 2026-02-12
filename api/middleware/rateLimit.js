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
    // Only skip the global limiter for health checks (they have no side effects)
    // Quote and swap endpoints get their own dedicated limiters applied at the route level
    const fullPath = (req.originalUrl || req.url || '').split('?')[0].toLowerCase();
    return fullPath.includes('/health');
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
