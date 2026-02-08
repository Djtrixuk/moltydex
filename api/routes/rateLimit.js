/**
 * Rate limit status routes
 * Provides agents with rate limit information
 */

const express = require('express');
const router = express.Router();
const { apiLimiter, swapLimiter, quoteLimiter } = require('../middleware/rateLimit');

/**
 * GET /api/rate-limit/status
 * Get current rate limit status for the requesting IP
 */
router.get('/status', apiLimiter, (req, res) => {
  const rateLimit = req.rateLimit || {};
  
  // Calculate reset time
  const resetTime = rateLimit.resetTime 
    ? new Date(rateLimit.resetTime).toISOString()
    : new Date(Date.now() + 15 * 60 * 1000).toISOString(); // Default 15 minutes

  res.json({
    limit: rateLimit.limit || 100,
    remaining: rateLimit.remaining !== undefined ? rateLimit.remaining : 100,
    reset_at: resetTime,
    window_seconds: 15 * 60, // 15 minutes
    endpoint: 'general_api',
    message: 'Rate limits apply per IP address',
  });
});

/**
 * GET /api/rate-limit/status/swap
 * Get swap-specific rate limit status
 */
router.get('/status/swap', swapLimiter, (req, res) => {
  const rateLimit = req.rateLimit || {};
  const resetTime = rateLimit.resetTime 
    ? new Date(rateLimit.resetTime).toISOString()
    : new Date(Date.now() + 60 * 1000).toISOString(); // Default 1 minute

  res.json({
    limit: rateLimit.limit || 10,
    remaining: rateLimit.remaining !== undefined ? rateLimit.remaining : 10,
    reset_at: resetTime,
    window_seconds: 60, // 1 minute
    endpoint: 'swap',
    message: 'Stricter rate limit for swap operations',
  });
});

/**
 * GET /api/rate-limit/status/quote
 * Get quote-specific rate limit status
 */
router.get('/status/quote', quoteLimiter, (req, res) => {
  const rateLimit = req.rateLimit || {};
  const resetTime = rateLimit.resetTime 
    ? new Date(rateLimit.resetTime).toISOString()
    : new Date(Date.now() + 60 * 1000).toISOString(); // Default 1 minute

  res.json({
    limit: rateLimit.limit || 30,
    remaining: rateLimit.remaining !== undefined ? rateLimit.remaining : 30,
    reset_at: resetTime,
    window_seconds: 60, // 1 minute
    endpoint: 'quote',
    message: 'Rate limit for quote requests',
  });
});

/**
 * GET /api/rate-limit/status/all
 * Get all rate limit statuses
 */
router.get('/status/all', apiLimiter, (req, res) => {
  const generalLimit = req.rateLimit || {};
  const generalReset = generalLimit.resetTime 
    ? new Date(generalLimit.resetTime).toISOString()
    : new Date(Date.now() + 15 * 60 * 1000).toISOString();

  res.json({
    general_api: {
      limit: generalLimit.limit || 100,
      remaining: generalLimit.remaining !== undefined ? generalLimit.remaining : 100,
      reset_at: generalReset,
      window_seconds: 15 * 60,
    },
    swap: {
      limit: 10,
      remaining: 10, // Approximate, actual depends on swap limiter
      reset_at: new Date(Date.now() + 60 * 1000).toISOString(),
      window_seconds: 60,
      note: 'Check /api/rate-limit/status/swap for accurate remaining count',
    },
    quote: {
      limit: 30,
      remaining: 30, // Approximate, actual depends on quote limiter
      reset_at: new Date(Date.now() + 60 * 1000).toISOString(),
      window_seconds: 60,
      note: 'Check /api/rate-limit/status/quote for accurate remaining count',
    },
    message: 'Rate limits are per IP address. Use batch operations to reduce API calls.',
  });
});

module.exports = router;
