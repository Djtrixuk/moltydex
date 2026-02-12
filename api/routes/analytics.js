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
    volumeUsd: 0,
    volumeUsdByDate: {},
  },
  x402Payments: {
    total: 0,
    successful: 0,
    failed: 0,
    byAction: {},
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
  try {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Get current stats
    let stats;
    if (useRedis) {
      stats = await getStats();
    } else {
      // For in-memory, work directly with usageStats to avoid shallow copy issues
      stats = usageStats;
    }
    
    // Convert uniqueWallets array back to Set for manipulation if needed
    if (Array.isArray(stats.uniqueWallets)) {
      stats.uniqueWallets = new Set(stats.uniqueWallets);
    }
    
    // Ensure x402Payments object exists (for backwards compat with old Redis data)
    if (!stats.x402Payments) {
      stats.x402Payments = { total: 0, successful: 0, failed: 0, byAction: {}, byDate: {} };
    }
    if (!stats.swaps.volumeUsd) stats.swaps.volumeUsd = 0;
    if (!stats.swaps.volumeUsdByDate) stats.swaps.volumeUsdByDate = {};

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

        // Track USD volume if provided
        if (data.volume_usd && !isNaN(parseFloat(data.volume_usd))) {
          const usdAmount = parseFloat(data.volume_usd);
          stats.swaps.volumeUsd = (stats.swaps.volumeUsd || 0) + usdAmount;
          stats.swaps.volumeUsdByDate[date] = (stats.swaps.volumeUsdByDate[date] || 0) + usdAmount;
        }
        
        // Log swap for debugging with more details
        const logDetails = {
          success: data.success ? 'SUCCESS' : 'FAILED',
          pair,
          wallet: data.wallet_address?.substring(0, 8) || 'no wallet',
          error: data.error || 'none',
          hasInputMint: !!data.input_mint,
          hasOutputMint: !!data.output_mint,
          volumeUsd: data.volume_usd || 'not tracked',
        };
        console.log(`[analytics] Swap tracked:`, logDetails);
        break;

      case 'x402_payment':
        stats.x402Payments.total++;
        if (data.success) {
          stats.x402Payments.successful++;
        } else {
          stats.x402Payments.failed++;
        }
        
        const action = data.action || 'unknown';
        stats.x402Payments.byAction[action] = (stats.x402Payments.byAction[action] || 0) + 1;
        stats.x402Payments.byDate[date] = (stats.x402Payments.byDate[date] || 0) + 1;
        
        if (data.wallet_address) {
          stats.uniqueWallets.add(data.wallet_address);
        }
        
        console.log(`[analytics] x402 payment tracked:`, {
          action,
          success: data.success ? 'SUCCESS' : 'FAILED',
          wallet: data.wallet_address?.substring(0, 8) || 'no wallet',
          swap_needed: data.swap_needed || false,
        });
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
    }
    // For in-memory, stats is already a reference to usageStats, so changes are already applied
  } catch (err) {
    console.error('[analytics] Error tracking event:', {
      type,
      error: err.message,
      stack: err.stack,
    });
    // Don't throw - tracking failures shouldn't break the main functionality
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
    
    const x402Stats = stats.x402Payments || { total: 0, successful: 0, failed: 0, byAction: {}, byDate: {} };

    const response = {
      overview: {
        totalSwaps: stats.swaps?.total || 0,
        successfulSwaps: stats.swaps?.successful || 0,
        failedSwaps: stats.swaps?.failed || 0,
        totalQuotes: stats.quotes?.total || 0,
        totalBalanceChecks: stats.balances?.total || 0,
        totalApiCalls: stats.apiCalls?.total || 0,
        totalX402Payments: x402Stats.total,
        uniqueWallets: uniqueWalletsSet.size,
        totalVolumeUsd: stats.swaps?.volumeUsd || 0,
        uptimeSince: stats.startTime || new Date().toISOString(),
        storage: useRedis ? 'redis' : 'memory',
      },
      swaps: {
        byTokenPair: stats.swaps?.byTokenPair || {},
        byDate: stats.swaps?.byDate || {},
        volumeUsdByDate: stats.swaps?.volumeUsdByDate || {},
        successRate: stats.swaps?.total > 0 
          ? ((stats.swaps.successful / stats.swaps.total) * 100).toFixed(2) + '%'
          : '0%',
      },
      x402Payments: {
        total: x402Stats.total,
        successful: x402Stats.successful,
        failed: x402Stats.failed,
        byAction: x402Stats.byAction,
        byDate: x402Stats.byDate,
        successRate: x402Stats.total > 0
          ? ((x402Stats.successful / x402Stats.total) * 100).toFixed(2) + '%'
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

/**
 * GET /api/analytics/debug
 * Debug endpoint to check Redis configuration
 */
router.get('/debug', (req, res) => {
  res.json({
    redisConfigured: useRedis,
    hasRedisClient: !!redis,
    envVars: {
      hasUrl: !!process.env.UPSTASH_REDIS_REST_URL,
      hasToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
      urlPrefix: process.env.UPSTASH_REDIS_REST_URL?.substring(0, 20) + '...' || 'not set',
    },
    storage: useRedis ? 'redis' : 'memory',
  });
});

module.exports = router;
