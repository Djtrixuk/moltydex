/**
 * Response caching middleware
 * Caches responses for specified duration
 */

const MAX_CACHE_ENTRIES = 1000; // Prevent unbounded memory growth
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
      // Cache successful responses (with size bound)
      if (res.statusCode === 200) {
        // Evict oldest entries if cache is full
        if (cache.size >= MAX_CACHE_ENTRIES) {
          const firstKey = cache.keys().next().value;
          cache.delete(firstKey);
        }
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

// NOTE: No setInterval — incompatible with serverless (Vercel).
// Expired entries are evicted lazily on cache-hit check and
// oldest entries are evicted on write when the cache is full.

module.exports = {
  createCacheMiddleware,
  clearCache,
  cleanCache,
};
