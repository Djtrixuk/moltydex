/**
 * Middleware to add rate limit headers to all responses
 * Makes rate limit info available even when not hitting limits
 */

module.exports = function rateLimitHeaders(req, res, next) {
  // Add rate limit info to response headers
  if (req.rateLimit) {
    res.set({
      'X-RateLimit-Limit': req.rateLimit.limit.toString(),
      'X-RateLimit-Remaining': req.rateLimit.remaining.toString(),
      'X-RateLimit-Reset': new Date(req.rateLimit.resetTime).toISOString(),
    });
  }
  next();
};
