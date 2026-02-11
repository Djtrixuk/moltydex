/**
 * MoltyDEX Aggregator API
 * 
 * x402 Token Swaps - Routes swaps through Jupiter Aggregator + adds small fee
 * Secure client-side signing, proper fee collection, x402 integration
 * 
 * Run: node index.js
 * Deploy: Vercel, Railway, or any Node.js host
 */

require('dotenv').config();
const express = require('express');
const { apiLimiter } = require('./middleware/rateLimit');

// Route modules
const quoteRoutes = require('./routes/quote');
const swapRoutes = require('./routes/swap');
const balanceRoutes = require('./routes/balance');
const tokenRoutes = require('./routes/token');
const transactionRoutes = require('./routes/transaction');
const x402Routes = require('./routes/x402');
const healthRoutes = require('./routes/health');

const app = express();

// Trust proxy headers from Vercel (required for express-rate-limit to work correctly)
app.set('trust proxy', true);

// CORS middleware
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Compression middleware
const compression = require('compression');
app.use(compression());

// Body parsing and rate limiting
app.use(express.json());
app.use(require('./middleware/requestId')); // Add Request ID to all responses
app.use(require('./middleware/rateLimitHeaders'));
app.use(apiLimiter);

// Swagger/OpenAPI documentation
if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
  try {
    const swaggerUi = require('swagger-ui-express');
    const swaggerSpec = require('./config/swagger');
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'MoltyDEX API Documentation',
    }));
  } catch (err) {
    console.warn('[swagger] Swagger UI not available:', err.message);
  }
}

// API routes
app.use('/api', quoteRoutes);
app.use('/api/swap', swapRoutes);
app.use('/api', balanceRoutes);
app.use('/api', tokenRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/x402', x402Routes);
app.use('/api/ultra', require('./routes/ultra'));
app.use('/api/batch', require('./routes/batch'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/rate-limit', require('./routes/rateLimit'));
app.use('/api/tokens', require('./routes/recommendations')); // Mounted at /api/tokens/recommend
app.use('/api/analytics', require('./routes/analytics')); // Analytics tracking
app.use('/api', healthRoutes);

// Legacy tokens endpoint (for backward compatibility)
app.get('/api/tokens', async (req, res) => {
  try {
    const axios = require('axios');
    const response = await axios.get('https://token.jup.ag/all');
    const tokens = response.data
      .filter((t) => t.chainId === 101 || t.chainId === 103)
      .slice(0, 100);
    res.json({ tokens });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server startup
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '127.0.0.1';

const server = app.listen(PORT, HOST, () => {
  const FEE_BPS = parseInt(process.env.FEE_BPS || '10');
  const FEE_WALLET = process.env.FEE_WALLET || null;
  const JUPITER_API_KEY = process.env.JUPITER_API_KEY || '';
  const DEMO_MODE = process.env.DEMO_MODE === '1' || process.env.DEMO_MODE === 'true';
  const { JUPITER_ENDPOINTS } = require('./config/constants');

  console.log(`MoltyDEX Aggregator API running on http://${HOST}:${PORT}`);
  console.log(`Fee: ${FEE_BPS / 100}%`);
  console.log(`Jupiter: ${JUPITER_ENDPOINTS[0]}${JUPITER_API_KEY ? ' (API key set)' : ' (no JUPITER_API_KEY - get one at https://portal.jup.ag)'}`);
  console.log(`Fee wallet: ${FEE_WALLET || 'NOT CONFIGURED'}`);
  if (DEMO_MODE) console.log('DEMO_MODE: ON (mock quotes when Jupiter unreachable)');
  console.log(`\nEndpoints:`);
  console.log(`  GET  /api/health - Health check`);
  console.log(`  GET  /api/quote - Get swap quote`);
  console.log(`  POST /api/swap/build - Build unsigned transaction (SECURE)`);
  console.log(`  GET  /api/balance - Check token balance`);
  console.log(`  GET  /api/token - Get token metadata`);
  console.log(`  GET  /api/tokens/search - Search tokens by symbol/name/address`);
  console.log(`  GET  /api/tokens/by-symbol - Get token by symbol (exact match)`);
  console.log(`  GET  /api/tokens/popular - Get popular tokens`);
  console.log(`  POST /api/transaction/send - Send signed transaction`);
  console.log(`  GET  /api/transaction/status/:signature - Get transaction status`);
  console.log(`  GET  /api/transaction/history/:wallet - Get transaction history`);
  console.log(`  POST /api/batch/balances - Batch balance checks`);
  console.log(`  POST /api/batch/quotes - Batch quote requests`);
  console.log(`  POST /api/batch/token-metadata - Batch token metadata`);
  console.log(`  POST /api/x402/parse-payment - Parse 402 response`);
  console.log(`  POST /api/x402/prepare-payment - Prepare payment`);
  console.log(`  POST /api/x402/simulate-payment - Simulate payment (no execution)`);
  console.log(`  POST /api/x402/auto-pay - Complete x402 auto-pay flow`);
  console.log(`  GET  /api/x402/recommended-tokens - Get recommended tokens`);
  console.log(`  POST /api/transaction/webhook - Register webhook for transaction status`);
  console.log(`  GET  /api/transaction/webhook/:id - Get webhook status`);
  console.log(`  GET  /api/rate-limit/status - Get rate limit status`);
  console.log(`  GET  /api/tokens/recommend - Get token recommendations`);
});

server.on('error', (err) => {
  if (err.code === 'EPERM' || err.code === 'EACCES') {
    console.error(`\nCannot bind to ${HOST}:${PORT}: ${err.message}`);
    console.error('Try: add PORT=3002 to api/.env and restart, or close whatever is using this port.');
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
