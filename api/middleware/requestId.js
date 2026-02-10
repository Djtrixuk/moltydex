/**
 * Middleware to add Request ID to all API responses
 * Critical for agent-to-agent debugging and tracing failures across distributed systems
 */

const { randomUUID } = require('crypto');

module.exports = function requestIdMiddleware(req, res, next) {
  // Generate unique request ID
  const requestId = randomUUID();
  
  // Store in request object for potential logging
  req.requestId = requestId;
  
  // Add to response headers
  res.set('X-Request-ID', requestId);
  
  next();
};
