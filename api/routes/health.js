/**
 * Health check routes
 */

const express = require('express');
const router = express.Router();
const { JUPITER_ENDPOINTS } = require('../config/constants');

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
 *                   example: 10
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
  const FEE_BPS = parseInt(process.env.FEE_BPS || '10');
  const FEE_WALLET = process.env.FEE_WALLET || null;
  const JUPITER_API_KEY = process.env.JUPITER_API_KEY || '';
  const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

  res.json({
    status: 'ok',
    fee_bps: FEE_BPS,
    fee_wallet_configured: !!FEE_WALLET,
    fee_method: FEE_WALLET ? 'Jupiter native fees (platformFeeBps)' : 'No fees configured',
    jupiter_endpoints: JUPITER_ENDPOINTS,
    jupiter_api_key_set: !!JUPITER_API_KEY,
    rpc: RPC_URL,
    features: {
      secure_signing: true,
      fee_collection: !!FEE_WALLET,
      fee_collection_method: FEE_WALLET ? 'Jupiter native fees' : 'None',
      x402_integration: true,
      balance_checking: true,
      swap_tracking: false, // Temporarily disabled - needs database
      points_program: false, // Temporarily disabled - needs database
    },
  });
});

module.exports = router;
