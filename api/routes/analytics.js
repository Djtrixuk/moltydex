/**
 * Analytics routes
 * Track and view usage statistics
 * Uses Upstash Redis for persistent storage (works with Vercel serverless)
 */

const express = require('express');
const router = express.Router();

// Try to use Upstash Redis for persistent storage
let redis = null;
let useRedis = false;

try {
  // Upstash Redis (works with Vercel serverless)
  const { Redis } = require('@upstash/redis');
  
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    useRedis = true;
    console.log('[analytics] Using Upstash Redis for persistent storage');
  } else {
    console.log('[analytics] Upstash Redis not configured, using in-memory storage (data resets on restart)');
  }
} catch (err) {
  console.warn('[analytics] Redis not available, using in-memory storage:', err.message);
}

// In-memory storage (fallback if Redis not available)
// This will reset on each deployment, but gives basic tracking
const usageStats = {
  swaps: {
    total: 0,
    successful: 0,
    failed: 0,
    byTokenPair: {},
    byDate: {},
  },
  quotes: {
    total: 0,
    byDate: {},
  },
  balances: {
    total: 0,
    byDate: {},
  },
  apiCalls: {
    total: 0,
    byEndpoint: {},
    byDate: {},
  },
  uniqueWallets: new Set(),
  startTime: new Date().toISOString(),
};

// Redis key prefix
const REDIS_PREFIX = 'moltydex:analytics:';

/**
 * Get stats from Redis or memory
 */
async function getStats() {
  if (useRedis && redis) {
    try {
      const stats = await redis.get(`${REDIS_PREFIX}stats`);
      if (stats) {
        // Convert Set back from array
        if (stats.uniqueWallets && Array.isArray(stats.uniqueWallets)) {
          stats.uniqueWallets = new Set(stats.uniqueWallets);
        }
        return stats;
      }
    } catch (err) {
      console.error('[analytics] Error reading from Redis:', err.message);
    }
  }
  
  // Return in-memory stats
  return {
    ...usageStats,
    uniqueWallets: Array.from(usageStats.uniqueWallets),
  };
}

/**
 * Save stats to Redis
 */
async function saveStats(stats) {
  if (useRedis && redis) {
    try {
      // Convert Set to array for Redis storage
      const statsToSave = {
        ...stats,
        uniqueWallets: Array.from(stats.uniqueWallets),
      };
      await redis.set(`${REDIS_PREFIX}stats`, statsToSave);
      return true;
    } catch (err) {
      console.error('[analytics] Error saving to Redis:', err.message);
      return false;
    }
  }
  return false;
}

/**
 * Track an event
 */
async function trackEvent(type, data = {}) {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  // Get current stats
  const stats = useRedis ? await getStats() : {
    ...usageStats,
    uniqueWallets: Array.from(usageStats.uniqueWallets),
  };
  
  // Convert uniqueWallets array back to Set for manipulation
  if (Array.isArray(stats.uniqueWallets)) {
    stats.uniqueWallets = new Set(stats.uniqueWallets);
  }
  
  switch (type) {
    case 'swap':
      stats.swaps.total++;
      if (data.success) {
        stats.swaps.successful++;
      } else {
        stats.swaps.failed++;
      }
      
      const pair = `${data.input_mint || 'unknown'}_${data.output_mint || 'unknown'}`;
      stats.swaps.byTokenPair[pair] = (stats.swaps.byTokenPair[pair] || 0) + 1;
      
      stats.swaps.byDate[date] = (stats.swaps.byDate[date] || 0) + 1;
      
      if (data.wallet_address) {
        stats.uniqueWallets.add(data.wallet_address);
      }
      
      // Log swap for debugging
      console.log(`[analytics] Swap tracked: ${data.success ? 'SUCCESS' : 'FAILED'} - ${pair} - wallet: ${data.wallet_address?.substring(0, 8)}...`);
      break;
      
    case 'quote':
      stats.quotes.total++;
      stats.quotes.byDate[date] = (stats.quotes.byDate[date] || 0) + 1;
      break;
      
    case 'balance':
      stats.balances.total++;
      stats.balances.byDate[date] = (stats.balances.byDate[date] || 0) + 1;
      break;
      
    case 'api_call':
      stats.apiCalls.total++;
      const endpoint = data.endpoint || 'unknown';
      stats.apiCalls.byEndpoint[endpoint] = (stats.apiCalls.byEndpoint[endpoint] || 0) + 1;
      stats.apiCalls.byDate[date] = (stats.apiCalls.byDate[date] || 0) + 1;
      break;
  }
  
  // Save back to Redis or update in-memory
  if (useRedis) {
    await saveStats(stats);
  } else {
    // Update in-memory stats
    Object.assign(usageStats, stats);
    usageStats.uniqueWallets = stats.uniqueWallets;
  }
}

/**
 * @swagger
 * /api/analytics/stats:
 *   get:
 *     summary: Get usage statistics
 *     description: Returns comprehensive usage statistics including swaps, quotes, balances, and API calls
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 overview:
 *                   type: object
 *                   properties:
 *                     totalSwaps:
 *                       type: number
 *                     successfulSwaps:
 *                       type: number
 *                     failedSwaps:
 *                       type: number
 *                     totalQuotes:
 *                       type: number
 *                     totalBalanceChecks:
 *                       type: number
 *                     totalApiCalls:
 *                       type: number
 *                     uniqueWallets:
 *                       type: number
 *                     uptimeSince:
 *                       type: string
 *                 swaps:
 *                   type: object
 *                 apiUsage:
 *                   type: object
 *                 quotes:
 *                   type: object
 *                 balances:
 *                   type: object
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await getStats();
    
    // Ensure uniqueWallets is a Set for size calculation
    const uniqueWalletsSet = stats.uniqueWallets instanceof Set 
      ? stats.uniqueWallets 
      : new Set(stats.uniqueWallets || []);
    
    const response = {
      overview: {
        totalSwaps: stats.swaps?.total || 0,
        successfulSwaps: stats.swaps?.successful || 0,
        failedSwaps: stats.swaps?.failed || 0,
        totalQuotes: stats.quotes?.total || 0,
        totalBalanceChecks: stats.balances?.total || 0,
        totalApiCalls: stats.apiCalls?.total || 0,
        uniqueWallets: uniqueWalletsSet.size,
        uptimeSince: stats.startTime || new Date().toISOString(),
        storage: useRedis ? 'redis' : 'memory',
      },
      swaps: {
        byTokenPair: stats.swaps?.byTokenPair || {},
        byDate: stats.swaps?.byDate || {},
        successRate: stats.swaps?.total > 0 
          ? ((stats.swaps.successful / stats.swaps.total) * 100).toFixed(2) + '%'
          : '0%',
      },
      apiUsage: {
        byEndpoint: stats.apiCalls?.byEndpoint || {},
        byDate: stats.apiCalls?.byDate || {},
      },
      quotes: {
        byDate: stats.quotes?.byDate || {},
      },
      balances: {
        byDate: stats.balances?.byDate || {},
      },
    };
    
    res.json(response);
  } catch (err) {
    console.error('[analytics] Error getting stats:', err);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

/**
 * POST /api/analytics/track
 * Track an event (internal use)
 */
router.post('/track', async (req, res) => {
  try {
    const { type, data } = req.body;
    
    if (!type) {
      return res.status(400).json({ error: 'Missing type' });
    }
    
    await trackEvent(type, data);
    
    res.json({ success: true });
  } catch (err) {
    console.error('[analytics] Error tracking event:', err);
    res.status(500).json({ error: 'Failed to track event' });
  }
});

// Export trackEvent for use in other routes
router.trackEvent = trackEvent;

module.exports = router;
