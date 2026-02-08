# Production Readiness Guide - AgentDEX

Complete checklist and implementation guide to move AgentDEX from beta to production.

---

## 🎯 Production Readiness Checklist

### Phase 1: Core Functionality ✅
- [x] Fee collection working
- [x] Secure client-side signing
- [x] x402 integration
- [x] Balance checking
- [ ] **Comprehensive error handling**
- [ ] **Input validation & sanitization**
- [ ] **Rate limiting**
- [ ] **Transaction retry logic**

### Phase 2: Security & Reliability 🔒
- [ ] **Security audit**
- [ ] **Rate limiting per IP/API key**
- [ ] **API authentication (API keys)**
- [ ] **Input validation on all endpoints**
- [ ] **SQL injection prevention** (if adding DB)
- [ ] **DDoS protection**
- [ ] **HTTPS enforcement**
- [ ] **CORS configuration**
- [ ] **Error message sanitization**

### Phase 3: Infrastructure 🏗️
- [ ] **Production RPC endpoint** (Helius/QuickNode)
- [ ] **Monitoring & alerting** (Sentry, Datadog)
- [ ] **Logging system** (structured logs)
- [ ] **Error tracking**
- [ ] **Uptime monitoring** (Pingdom, UptimeRobot)
- [ ] **Backup strategy**
- [ ] **CI/CD pipeline**
- [ ] **Environment management**

### Phase 4: Testing 🧪
- [ ] **Unit tests** (API endpoints)
- [ ] **Integration tests** (Jupiter API)
- [ ] **End-to-end tests** (full swap flow)
- [ ] **Load testing** (k6, Artillery)
- [ ] **Security testing**
- [ ] **Edge case testing**

### Phase 5: Documentation 📚
- [ ] **API documentation** (OpenAPI/Swagger)
- [ ] **SDK documentation**
- [ ] **Integration guides**
- [ ] **Troubleshooting guide**
- [ ] **FAQ**
- [ ] **Rate limits documentation**

### Phase 6: Legal & Compliance ⚖️
- [ ] **Terms of Service**
- [ ] **Privacy Policy**
- [ ] **Disclaimer**
- [ ] **Regulatory compliance** (if needed)
- [ ] **GDPR compliance** (if EU users)

### Phase 7: Operations 🚀
- [ ] **Support system** (Discord, email, tickets)
- [ ] **Status page** (status.agentdex.com)
- [ ] **Incident response plan**
- [ ] **On-call rotation**
- [ ] **Backup & recovery plan**

### Phase 8: Features & Polish ✨
- [ ] **Admin dashboard**
- [ ] **Usage analytics**
- [ ] **Transaction history**
- [ ] **Fee tracking**
- [ ] **User accounts** (optional)
- [ ] **Email notifications**

---

## 🔧 Implementation Guide

### 1. Enhanced Error Handling

**File:** `api/index.js`

```javascript
// Add comprehensive error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Don't leak internal errors
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(err.status || 500).json({
    error: message,
    request_id: req.id, // Add request ID tracking
    timestamp: new Date().toISOString(),
  });
});

// Add request ID middleware
const { v4: uuidv4 } = require('uuid');
app.use((req, res, next) => {
  req.id = uuidv4();
  next();
});
```

### 2. Rate Limiting

**Install:** `npm install express-rate-limit`

```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply to all API routes
app.use('/api/', apiLimiter);

// Stricter limit for swap endpoint
const swapLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 swaps per minute
});
app.post('/api/swap/build', swapLimiter);
```

### 3. Input Validation

**Install:** `npm install joi`

```javascript
const Joi = require('joi');

const swapSchema = Joi.object({
  wallet_address: Joi.string().required(),
  input_mint: Joi.string().length(44).required(),
  output_mint: Joi.string().length(44).required(),
  amount: Joi.string().pattern(/^\d+$/).required(),
  slippage_bps: Joi.number().min(1).max(1000).default(50),
});

app.post('/api/swap/build', async (req, res, next) => {
  try {
    const { error, value } = swapSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    // Use validated value
    req.body = value;
    next();
  } catch (err) {
    next(err);
  }
}, async (req, res) => {
  // Swap logic here
});
```

### 4. API Authentication

**File:** `api/middleware/auth.js`

```javascript
const API_KEYS = new Map(); // In production, use database

// Simple API key middleware
function authenticateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }
  
  // Check API key (in production, validate against database)
  if (!API_KEYS.has(apiKey)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  req.apiKey = apiKey;
  req.user = API_KEYS.get(apiKey); // User info
  next();
}

// Apply to protected routes
app.post('/api/swap/build', authenticateApiKey, ...);
```

### 5. Monitoring & Logging

**Install:** `npm install winston @sentry/node`

```javascript
const winston = require('winston');
const Sentry = require('@sentry/node');

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Use in routes
app.post('/api/swap/build', async (req, res) => {
  logger.info('Swap request', { 
    wallet: req.body.wallet_address,
    request_id: req.id 
  });
  
  try {
    // Swap logic
  } catch (error) {
    logger.error('Swap failed', { error, request_id: req.id });
    Sentry.captureException(error);
    throw error;
  }
});
```

### 6. Production RPC Configuration

**File:** `.env`

```bash
# Use reliable RPC provider
SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
# Or QuickNode
# SOLANA_RPC_URL=https://YOUR_ENDPOINT.solana-mainnet.quiknode.pro/YOUR_KEY

# Fallback RPC
SOLANA_RPC_FALLBACK=https://api.mainnet-beta.solana.com
```

**Add RPC fallback logic:**

```javascript
let currentRpc = RPC_URL;

async function executeWithFallback(fn) {
  try {
    return await fn(connection);
  } catch (error) {
    if (error.message.includes('429') || error.message.includes('rate limit')) {
      // Switch to fallback
      currentRpc = process.env.SOLANA_RPC_FALLBACK;
      connection = new Connection(currentRpc, 'confirmed');
      return await fn(connection);
    }
    throw error;
  }
}
```

### 7. Transaction Retry Logic

```javascript
async function sendTransactionWithRetry(transaction, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const signature = await connection.sendRawTransaction(
        transaction.serialize(),
        {
          skipPreflight: false,
          maxRetries: 0, // We handle retries ourselves
        }
      );
      
      await connection.confirmTransaction(signature, 'confirmed');
      return signature;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
}
```

### 8. Health Check Enhancement

```javascript
app.get('/api/health', async (req, res) => {
  const checks = {
    api: 'ok',
    jupiter: 'unknown',
    rpc: 'unknown',
    fee_wallet: 'unknown',
  };
  
  // Check Jupiter API
  try {
    await axios.get(`${JUPITER_API}/quote`, {
      params: {
        inputMint: TOKENS.SOL,
        outputMint: TOKENS.USDC,
        amount: '1000000',
      },
      timeout: 5000,
    });
    checks.jupiter = 'ok';
  } catch (error) {
    checks.jupiter = 'error';
  }
  
  // Check RPC
  try {
    await connection.getSlot();
    checks.rpc = 'ok';
  } catch (error) {
    checks.rpc = 'error';
  }
  
  // Check fee wallet
  if (FEE_WALLET) {
    try {
      const pubkey = new PublicKey(FEE_WALLET);
      await connection.getBalance(pubkey);
      checks.fee_wallet = 'ok';
    } catch (error) {
      checks.fee_wallet = 'error';
    }
  }
  
  const allOk = Object.values(checks).every(v => v === 'ok');
  
  res.status(allOk ? 200 : 503).json({
    status: allOk ? 'ok' : 'degraded',
    checks,
    timestamp: new Date().toISOString(),
  });
});
```

### 9. API Documentation (OpenAPI)

**Install:** `npm install swagger-ui-express swagger-jsdoc`

```javascript
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AgentDEX API',
      version: '1.0.0',
      description: 'x402 Token Aggregator for AI Agents',
    },
    servers: [
      { url: 'https://api.agentdex.com', description: 'Production' },
    ],
  },
  apis: ['./api/index.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

### 10. Database for Analytics (Optional)

**Install:** `npm install pg` (PostgreSQL) or use a service like Supabase

```javascript
// Track swaps for analytics
async function trackSwap(data) {
  await db.query(
    'INSERT INTO swaps (wallet_address, input_mint, output_mint, amount, fee, signature, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())',
    [data.wallet, data.input_mint, data.output_mint, data.amount, data.fee, data.signature]
  );
}
```

---

## 📊 Production Infrastructure Setup

### Option 1: Vercel (Recommended for Serverless)

**Pros:**
- Free tier available
- Auto-scaling
- Built-in CDN
- Easy deployment

**Setup:**
```bash
# vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Option 2: Railway/Render (Traditional Hosting)

**Pros:**
- More control
- Persistent connections
- Better for WebSocket (if needed)

**Setup:**
- Set environment variables
- Configure build command: `npm install`
- Set start command: `node api/index.js`

### Option 3: AWS/GCP (Enterprise)

**Pros:**
- Full control
- Advanced features
- Better for high scale

**Setup:**
- Use AWS Lambda + API Gateway
- Or GCP Cloud Functions
- Or EC2/Compute Engine for traditional hosting

---

## 🔒 Security Checklist

- [ ] **HTTPS only** (enforced)
- [ ] **API keys** for authentication
- [ ] **Rate limiting** per IP/API key
- [ ] **Input validation** on all endpoints
- [ ] **CORS** configured properly
- [ ] **Error messages** don't leak sensitive info
- [ ] **Secrets** in environment variables only
- [ ] **Dependencies** up to date (npm audit)
- [ ] **Security headers** (helmet.js)
- [ ] **SQL injection** prevention (if using DB)

---

## 📈 Monitoring Setup

### 1. Error Tracking: Sentry
```bash
npm install @sentry/node
```

### 2. Uptime Monitoring: UptimeRobot
- Free tier: 50 monitors
- Check `/api/health` every 5 minutes

### 3. Analytics: PostHog or Mixpanel
- Track API usage
- Monitor swap volume
- User behavior

### 4. Logging: Winston + Logtail
- Structured logs
- Searchable
- Alerting

---

## 🧪 Testing Strategy

### Unit Tests (Jest)
```javascript
// api/__tests__/quote.test.js
describe('GET /api/quote', () => {
  it('should return quote with fee', async () => {
    const res = await request(app)
      .get('/api/quote')
      .query({
        input_mint: TOKENS.SOL,
        output_mint: TOKENS.USDC,
        amount: '1000000000',
      });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('output_amount');
    expect(res.body).toHaveProperty('fee_amount');
  });
});
```

### Integration Tests
- Test Jupiter API integration
- Test RPC connection
- Test fee collection

### Load Testing (k6)
```javascript
// load-test.js
import http from 'k6/http';

export default function () {
  http.get('https://api.agentdex.com/api/health');
}
```

---

## 📝 Legal Documents Needed

### 1. Terms of Service
- Service description
- User responsibilities
- Limitation of liability
- Dispute resolution

### 2. Privacy Policy
- Data collection
- Data usage
- Third-party services
- User rights

### 3. Disclaimer
- Beta status (remove when production)
- Financial risks
- No warranties
- Use at own risk

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Documentation updated
- [ ] Environment variables set
- [ ] Monitoring configured
- [ ] Backup strategy in place

### Deployment
- [ ] Deploy to staging first
- [ ] Test in staging
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Verify health checks

### Post-Deployment
- [ ] Monitor logs
- [ ] Check error tracking
- [ ] Verify fee collection
- [ ] Test swap flow
- [ ] Monitor performance

---

## 📊 Success Metrics

### Technical Metrics
- **Uptime:** > 99.9%
- **Response time:** < 500ms (p95)
- **Error rate:** < 0.1%
- **API availability:** > 99.9%

### Business Metrics
- **Swap volume:** Track daily/monthly
- **Fee revenue:** Track collection
- **Active users:** Track unique wallets
- **API usage:** Track requests

---

## 🎯 Priority Order

### Must Have (Week 1)
1. ✅ Error handling
2. ✅ Rate limiting
3. ✅ Input validation
4. ✅ Production RPC
5. ✅ Monitoring (Sentry)

### Should Have (Week 2)
6. ✅ API authentication
7. ✅ Health checks
8. ✅ Logging
9. ✅ Documentation
10. ✅ Testing

### Nice to Have (Month 1)
11. ✅ Admin dashboard
12. ✅ Analytics
13. ✅ User accounts
14. ✅ Email notifications

---

## 💰 Cost Estimates

### Free Tier (Starting)
- **Hosting:** Vercel (free)
- **Monitoring:** Sentry (free tier)
- **Uptime:** UptimeRobot (free)
- **RPC:** Public Solana RPC (free, rate-limited)
- **Total:** $0/month

### Production Tier (~$50/month)
- **Hosting:** Railway ($5-20/month)
- **RPC:** Helius/QuickNode ($20-30/month)
- **Monitoring:** Sentry Pro ($26/month)
- **Analytics:** PostHog (free tier)
- **Total:** ~$50/month

### Scale Tier (~$200/month)
- **Hosting:** AWS/GCP ($50-100/month)
- **RPC:** Multiple providers ($50/month)
- **Monitoring:** Full stack ($50/month)
- **Database:** Supabase Pro ($25/month)
- **Total:** ~$200/month

---

## ✅ Ready for Production?

**Minimum Requirements:**
- ✅ Error handling
- ✅ Rate limiting
- ✅ Input validation
- ✅ Production RPC
- ✅ Monitoring
- ✅ Health checks
- ✅ Documentation

**Once these are implemented, you're production-ready!**
