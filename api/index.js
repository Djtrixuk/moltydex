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
const helmet = require('helmet');
const compression = require('compression');
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

// Trust exactly 1 proxy hop (Vercel). Prevents X-Forwarded-For spoofing to bypass rate limits.
app.set('trust proxy', 1);

// Security headers via Helmet
app.use(helmet({
  contentSecurityPolicy: false, // CSP managed per-deployment (frontend has its own)
  crossOriginEmbedderPolicy: false, // Allow embedding for wallet adapters
}));

// CORS middleware — restrict to known origins in production
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || 'https://moltydex.com,https://www.moltydex.com').split(',').map(s => s.trim());

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || ALLOWED_ORIGINS.includes(origin) || ALLOWED_ORIGINS.includes('*')) {
    res.set('Access-Control-Allow-Origin', origin || '*');
  }
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Payment');
  res.set('Access-Control-Max-Age', '86400');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Compression
app.use(compression());

// Body parsing with size limit (largest legitimate payload is ~5KB for batch requests)
app.use(express.json({ limit: '16kb' }));
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

// Global error handler — must be last middleware (4 args required by Express)
app.use((err, req, res, _next) => {
  const requestId = res.getHeader('X-Request-ID') || 'unknown';
  console.error(`[error] Unhandled error [${requestId}]:`, err.message);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }
  res.status(err.status || 500).json({
    error: 'Internal server error',
    error_code: 'INTERNAL_ERROR',
    request_id: requestId,
  });
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
  console.log(`  GET  /api/analytics/swaps/:wallet - Swap history for wallet`);
  console.log(`  GET  /api/analytics/points/:wallet - Points for wallet`);
  console.log(`  GET  /api/analytics/leaderboard - Points leaderboard`);
  console.log(`  GET  /api/analytics/swap-stats - Swap tracking stats`);
  console.log(`  POST /api/analytics/swap/:id/signature - Update swap signature`);
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

// Graceful shutdown
function shutdown(signal) {
  console.log(`\n[shutdown] ${signal} received, closing server...`);
  server.close(() => {
    console.log('[shutdown] Server closed.');
    process.exit(0);
  });
  // Force exit after 10s if connections don't close
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
