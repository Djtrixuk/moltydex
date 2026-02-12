/**
 * Quote routes
 */

const express = require('express');
const router = express.Router();
const { fetchJupiterQuote } = require('../utils/jupiter');
const { TOKENS, DEFAULTS } = require('../config/constants');
const analyticsRouter = require('./analytics');
const trackEvent = analyticsRouter.trackEvent;

/**
 * @swagger
 * /api/quote:
 *   get:
 *     summary: Get swap quote
 *     description: Get a quote for swapping tokens through Jupiter aggregator
 *     tags: [Quote]
 *     parameters:
 *       - in: query
 *         name: input_mint
 *         required: true
 *         schema:
 *           type: string
 *         description: Input token mint address (e.g., SOL)
 *       - in: query
 *         name: output_mint
 *         required: true
 *         schema:
 *           type: string
 *         description: Output token mint address (e.g., USDC)
 *       - in: query
 *         name: amount
 *         required: true
 *         schema:
 *           type: string
 *         description: Input amount in lamports
 *       - in: query
 *         name: slippage_bps
 *         schema:
 *           type: number
 *           default: 50
 *         description: Slippage tolerance in basis points (50 = 0.5%)
 *     responses:
 *       200:
 *         description: Quote retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quote'
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/quote', async (req, res) => {
  try {
    const { input_mint, output_mint, amount, slippage_bps = DEFAULTS.SLIPPAGE_BPS } = req.query;

    if (!input_mint || !output_mint || !amount) {
      return res.status(400).json({ error: 'Missing input_mint, output_mint, or amount' });
    }

    const JUPITER_API_KEY = process.env.JUPITER_API_KEY || '';
    const DEMO_MODE = process.env.DEMO_MODE === '1' || process.env.DEMO_MODE === 'true';
    const FEE_BPS = 0; // Fees disabled - set to 0

    const result = await fetchJupiterQuote(
      {
        input_mint,
        output_mint,
        amount,
        slippage_bps: Number(slippage_bps) || DEFAULTS.SLIPPAGE_BPS,
      },
      JUPITER_API_KEY
    );

    if (!result || result.errors) {
      const firstError = result?.errors?.[0];
      const isInvalidToken = firstError?.status === 400 || firstError?.status === 404;
      const jupiterErrorMsg = firstError?.message || firstError?.data?.error || firstError?.data?.message;

      // Demo mode fallback
      if (DEMO_MODE) {
        const amountNum = BigInt(amount);
        const isSolToUsdc = input_mint === TOKENS.SOL && output_mint === TOKENS.USDC;
        const isUsdcToSol = input_mint === TOKENS.USDC && output_mint === TOKENS.SOL;
        let estimatedOut = amountNum;
        if (isSolToUsdc) estimatedOut = (amountNum * 250n * 1000000n) / 1000000000n;
        if (isUsdcToSol) estimatedOut = (amountNum * 1000000000n) / (250n * 1000000n);
        const outputAmount = estimatedOut > 0n ? estimatedOut : amountNum;
        const feeAmount = (outputAmount * BigInt(FEE_BPS)) / 10000n;
        const outputAfterFee = outputAmount - feeAmount;
        // Track quote request (demo mode)
        await trackEvent('quote', { input_mint, output_mint, demo: true });
        await trackEvent('api_call', { endpoint: '/api/quote' });
        
        return res.json({
          input_mint,
          output_mint,
          input_amount: amount,
          output_amount: outputAmount.toString(),
          output_after_fee: outputAfterFee.toString(),
          price_impact: '0',
          route_plan: [],
          fee_bps: FEE_BPS,
          fee_amount: feeAmount.toString(),
          _demo: true,
        });
      }

      // Invalid token error
      if (isInvalidToken) {
        return res.status(400).json({
          error: jupiterErrorMsg || 'Token not found or no swap route available',
          details: 'Jupiter cannot find a swap route for this token pair.',
          suggestion: 'Verify the token mint address is correct and that the token has liquidity.',
          jupiter_error: jupiterErrorMsg,
          input_mint,
          output_mint,
        });
      }

      // Service unavailable
      const errorDetails = firstError?.data || {};
      const isUnauthorized = firstError?.status === 401;
      
      // Special handling for 401 Unauthorized - Jupiter now requires API key
      if (isUnauthorized) {
        return res.status(401).json({
          error: 'Jupiter API requires authentication',
          details: 'Jupiter API now requires an API key for all requests (even free tier)',
          suggestion: JUPITER_API_KEY
            ? 'Your JUPITER_API_KEY appears to be invalid or expired. Get a new one at https://portal.jup.ag'
            : 'Set JUPITER_API_KEY environment variable. Get a free API key at https://portal.jup.ag (60 requests/min free tier)',
          action_required: 'Add JUPITER_API_KEY to your Vercel environment variables',
          portal_url: 'https://portal.jup.ag',
          has_api_key: !!JUPITER_API_KEY,
          jupiter_error: {
            status: 401,
            message: 'Unauthorized - API key required',
          },
        });
      }
      
      return res.status(503).json({
        error: 'Jupiter API unavailable. All endpoints failed.',
        details: 'All Jupiter endpoints failed',
        suggestion: JUPITER_API_KEY
          ? 'Check Jupiter status: https://status.jup.ag. Verify JUPITER_API_KEY is correct.'
          : 'Set JUPITER_API_KEY in env (https://portal.jup.ag).',
        tried_endpoints: require('../config/constants').JUPITER_ENDPOINTS.map(e => `${e}/quote`),
        has_api_key: !!JUPITER_API_KEY,
        jupiter_errors: result?.errors,
        input_mint,
        output_mint,
        amount,
        // Include first error details for debugging
        first_error: firstError ? {
          endpoint: firstError.endpoint,
          status: firstError.status,
          message: firstError.message,
          data: errorDetails,
        } : null,
      });
    }

    // Calculate fees - handle both v6 and v1 response formats
    // v6 uses outAmount, v1 also uses outAmount, but check both just in case
    const outAmount = result.data.outAmount || result.data.outAmountWithSlippage || result.data.outAmountWithoutSlippage;
    if (!outAmount) {
      throw new Error('Invalid quote response: missing outAmount field');
    }
    
    const outputAmount = BigInt(outAmount);
    const aggregatorFeeAmount = 0n; // Fees disabled - no fee calculation
    const outputAfterFee = outputAmount; // No fees deducted
    
    // Estimate network fee (Solana base transaction fee ~5000 lamports = 0.000005 SOL)
    // For token swaps, typically 2-3 transactions, so ~0.00001-0.000015 SOL
    const estimatedNetworkFeeLamports = 10000n; // ~0.00001 SOL
    const isSolOutput = output_mint.toLowerCase() === TOKENS.SOL.toLowerCase();
    const networkFeeAmount = isSolOutput ? estimatedNetworkFeeLamports : 0n; // Only relevant if output is SOL
    
    // Calculate minimum output with slippage
    // Must do multiplication before division to avoid BigInt truncation to zero
    const slippageBps = Number(slippage_bps) || DEFAULTS.SLIPPAGE_BPS;
    const minimumOutput = (outputAfterFee * (10000n - BigInt(slippageBps))) / 10000n;

    // Track quote request
    await trackEvent('quote', { input_mint, output_mint });
    await trackEvent('api_call', { endpoint: '/api/quote' });
    
    res.json({
      input_mint,
      output_mint,
      input_amount: amount,
      output_amount: outputAmount.toString(),
      output_after_fee: outputAfterFee.toString(),
      minimum_output: minimumOutput.toString(),
      price_impact: result.data.priceImpactPct || result.data.priceImpact || '0',
      route_plan: result.data.routePlan || result.data.routes || [],
      fee_amount: aggregatorFeeAmount.toString(), // Add top-level fee_amount for frontend compatibility
      fee_bps: FEE_BPS, // Add top-level fee_bps for frontend compatibility
      fee_breakdown: {
        aggregator_fee: {
          bps: FEE_BPS,
          percentage: (FEE_BPS / 100).toFixed(2) + '%',
          amount: aggregatorFeeAmount.toString(),
          description: 'MoltyDEX aggregator fee',
        },
        network_fee: {
          estimated_lamports: estimatedNetworkFeeLamports.toString(),
          estimated_sol: (Number(estimatedNetworkFeeLamports) / 1e9).toFixed(9),
          description: 'Solana network transaction fee (estimated)',
          note: 'Actual network fee may vary. Only applies if output token is SOL.',
        },
        priority_fee: {
          amount: '0',
          description: 'Optional priority fee (can be added when building transaction)',
        },
      },
      total_cost_estimate: {
        aggregator_fee: aggregatorFeeAmount.toString(),
        network_fee: networkFeeAmount.toString(),
        total_fees: (aggregatorFeeAmount + networkFeeAmount).toString(),
      },
      slippage_tolerance: {
        bps: slippageBps,
        percentage: (slippageBps / 100).toFixed(2) + '%',
        minimum_output: minimumOutput.toString(),
      },
    });
  } catch (err) {
    console.error('Quote error:', err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data?.error || err.message });
  }
});

module.exports = router;
