/**
 * Health check routes
 */

const express = require('express');
const router = express.Router();
const { JUPITER_ENDPOINTS, DEFAULTS } = require('../config/constants');
const swapTracker = require('../utils/swapTracker');

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns API status and configuration information
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 fee_bps:
 *                   type: number
 *                   example: 0
 *                 fee_wallet_configured:
 *                   type: boolean
 *                 jupiter_api_key_set:
 *                   type: boolean
 *                 rpc:
 *                   type: string
 *                 features:
 *                   type: object
 */
router.get('/health', async (req, res) => {
  const FEE_BPS = DEFAULTS.FEE_BPS;
  const FEE_WALLET = process.env.FEE_WALLET || null;
  const JUPITER_API_KEY = process.env.JUPITER_API_KEY || '';
  const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

  // Mask the RPC URL to avoid exposing API keys in public responses
  const maskRpcUrl = (url) => {
    try {
      const parsed = new URL(url);
      // If there's a path with an API key (e.g. /v2/xxxxx), mask it
      const pathParts = parsed.pathname.split('/');
      if (pathParts.length > 1) {
        const lastPart = pathParts[pathParts.length - 1];
        if (lastPart.length > 6) {
          pathParts[pathParts.length - 1] = lastPart.slice(0, 3) + '***' + lastPart.slice(-3);
        }
      }
      parsed.pathname = pathParts.join('/');
      return parsed.origin + parsed.pathname;
    } catch {
      return 'configured';
    }
  };

  res.json({
    status: 'ok',
    fee_bps: FEE_BPS,
    fee_wallet_configured: !!FEE_WALLET,
    fee_method: FEE_WALLET ? 'Jupiter native fees (platformFeeBps)' : 'No fees configured',
    jupiter_endpoints: JUPITER_ENDPOINTS,
    jupiter_api_key_set: !!JUPITER_API_KEY,
    rpc: maskRpcUrl(RPC_URL),
    features: {
      secure_signing: true,
      fee_collection: !!FEE_WALLET,
      fee_collection_method: FEE_WALLET ? 'Jupiter native fees' : 'None',
      x402_integration: true,
      balance_checking: true,
      swap_tracking: true,
      points_program: true,
      swap_storage: swapTracker.getStorageInfo(),
    },
  });
});

/**
 * GET /api/health/ping
 * Lightweight ping endpoint for uptime monitoring (UptimeRobot, etc.)
 * Returns minimal response for fast health checks
 */
router.get('/ping', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

module.exports = router;
