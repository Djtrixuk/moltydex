/**
 * Analytics routes
 * Track and view usage statistics
 */

const express = require('express');
const router = express.Router();

// In-memory storage (for serverless - use database in production)
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

/**
 * Track an event
 */
function trackEvent(type, data = {}) {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  switch (type) {
    case 'swap':
      usageStats.swaps.total++;
      if (data.success) {
        usageStats.swaps.successful++;
      } else {
        usageStats.swaps.failed++;
      }
      
      const pair = `${data.input_mint || 'unknown'}_${data.output_mint || 'unknown'}`;
      usageStats.swaps.byTokenPair[pair] = (usageStats.swaps.byTokenPair[pair] || 0) + 1;
      
      usageStats.swaps.byDate[date] = (usageStats.swaps.byDate[date] || 0) + 1;
      
      if (data.wallet_address) {
        usageStats.uniqueWallets.add(data.wallet_address);
      }
      break;
      
    case 'quote':
      usageStats.quotes.total++;
      usageStats.quotes.byDate[date] = (usageStats.quotes.byDate[date] || 0) + 1;
      break;
      
    case 'balance':
      usageStats.balances.total++;
      usageStats.balances.byDate[date] = (usageStats.balances.byDate[date] || 0) + 1;
      break;
      
    case 'api_call':
      usageStats.apiCalls.total++;
      const endpoint = data.endpoint || 'unknown';
      usageStats.apiCalls.byEndpoint[endpoint] = (usageStats.apiCalls.byEndpoint[endpoint] || 0) + 1;
      usageStats.apiCalls.byDate[date] = (usageStats.apiCalls.byDate[date] || 0) + 1;
      break;
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
router.get('/stats', (req, res) => {
  try {
    const stats = {
      overview: {
        totalSwaps: usageStats.swaps.total,
        successfulSwaps: usageStats.swaps.successful,
        failedSwaps: usageStats.swaps.failed,
        totalQuotes: usageStats.quotes.total,
        totalBalanceChecks: usageStats.balances.total,
        totalApiCalls: usageStats.apiCalls.total,
        uniqueWallets: usageStats.uniqueWallets.size,
        uptimeSince: usageStats.startTime,
      },
      swaps: {
        byTokenPair: usageStats.swaps.byTokenPair,
        byDate: usageStats.swaps.byDate,
        successRate: usageStats.swaps.total > 0 
          ? ((usageStats.swaps.successful / usageStats.swaps.total) * 100).toFixed(2) + '%'
          : '0%',
      },
      apiUsage: {
        byEndpoint: usageStats.apiCalls.byEndpoint,
        byDate: usageStats.apiCalls.byDate,
      },
      quotes: {
        byDate: usageStats.quotes.byDate,
      },
      balances: {
        byDate: usageStats.balances.byDate,
      },
    };
    
    res.json(stats);
  } catch (err) {
    console.error('[analytics] Error getting stats:', err);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

/**
 * POST /api/analytics/track
 * Track an event (internal use)
 */
router.post('/track', (req, res) => {
  try {
    const { type, data } = req.body;
    
    if (!type) {
      return res.status(400).json({ error: 'Missing type' });
    }
    
    trackEvent(type, data);
    
    res.json({ success: true });
  } catch (err) {
    console.error('[analytics] Error tracking event:', err);
    res.status(500).json({ error: 'Failed to track event' });
  }
});

// Export trackEvent for use in other routes
router.trackEvent = trackEvent;

module.exports = router;
