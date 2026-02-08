/**
 * Response caching middleware
 * Caches responses for specified duration
 */

const cache = new Map();

/**
 * Create cache middleware
 * @param {number} ttl - Time to live in seconds
 * @param {Function} keyGenerator - Function to generate cache key from request
 */
function createCacheMiddleware(ttl = 60, keyGenerator = null) {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key
    const key = keyGenerator 
      ? keyGenerator(req)
      : `${req.method}:${req.originalUrl}`;

    // Check cache
    const cached = cache.get(key);
    if (cached && cached.expires > Date.now()) {
      res.set('X-Cache', 'HIT');
      return res.json(cached.data);
    }

    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to cache response
    res.json = function(data) {
      // Cache successful responses
      if (res.statusCode === 200) {
        cache.set(key, {
          data,
          expires: Date.now() + (ttl * 1000),
        });
      }
      res.set('X-Cache', 'MISS');
      return originalJson(data);
    };

    next();
  };
}

/**
 * Clear cache
 */
function clearCache() {
  cache.clear();
}

/**
 * Clear expired entries
 */
function cleanCache() {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (value.expires <= now) {
      cache.delete(key);
    }
  }
}

// Clean cache every 5 minutes
setInterval(cleanCache, 5 * 60 * 1000);

module.exports = {
  createCacheMiddleware,
  clearCache,
  cleanCache,
};
