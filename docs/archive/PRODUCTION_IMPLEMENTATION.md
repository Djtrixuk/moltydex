# Production Implementation Steps

Quick-start guide to implement production features.

## Step 1: Install Dependencies

```bash
cd api
npm install
```

This installs:
- `express-rate-limit` - Rate limiting
- `joi` - Input validation
- `helmet` - Security headers
- `winston` - Logging
- `@sentry/node` - Error tracking
- `uuid` - Request IDs

## Step 2: Update Environment Variables

Add to `.env`:

```bash
# Existing
FEE_BPS=10
FEE_WALLET=YOUR_WALLET_ADDRESS
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
PORT=3001

# New - Production
NODE_ENV=production
SENTRY_DSN=your_sentry_dsn_here
SOLANA_RPC_FALLBACK=https://api.mainnet-beta.solana.com
LOG_LEVEL=info

# Optional - API Keys (if implementing)
API_KEYS_ENABLED=false
```

## Step 3: Integrate Middleware

Update `api/index.js` to include:

```javascript
// At the top
const helmet = require('helmet');
const { apiLimiter, swapLimiter, quoteLimiter } = require('./middleware/rateLimit');
const { validate, validateQuery } = require('./middleware/validation');
const { v4: uuidv4 } = require('uuid');

// After app creation
app.use(helmet()); // Security headers
app.use(express.json());

// Request ID middleware
app.use((req, res, next) => {
  req.id = uuidv4();
  next();
});

// Apply rate limiting
app.use('/api/', apiLimiter);

// Update routes with validation
app.get('/api/quote', validateQuery('quote'), async (req, res) => {
  // Existing quote logic
});

app.post('/api/swap/build', swapLimiter, validate('swapBuild'), async (req, res) => {
  // Existing swap logic
});

app.get('/api/balance', validateQuery('balance'), async (req, res) => {
  // Existing balance logic
});
```

## Step 4: Add Error Handling

```javascript
// Error handling middleware (at the end, before app.listen)
app.use((err, req, res, next) => {
  console.error('Error:', {
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    request_id: req.id,
    path: req.path,
  });

  // Send to Sentry in production
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    Sentry.captureException(err);
  }

  // Don't leak internal errors
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  res.status(err.status || 500).json({
    error: message,
    request_id: req.id,
    timestamp: new Date().toISOString(),
  });
});
```

## Step 5: Set Up Monitoring

### Sentry (Error Tracking)

1. Sign up at https://sentry.io
2. Create a new project (Node.js)
3. Get your DSN
4. Add to `.env`: `SENTRY_DSN=your_dsn_here`

```javascript
// At the top of index.js
const Sentry = require('@sentry/node');

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 0.1, // 10% of transactions
  });
}
```

### Uptime Monitoring

1. Sign up at https://uptimerobot.com
2. Add monitor:
   - Type: HTTP(s)
   - URL: `https://your-api.vercel.app/api/health`
   - Interval: 5 minutes

## Step 6: Production RPC Setup

### Option A: Helius (Recommended)

1. Sign up at https://helius.dev
2. Get API key
3. Update `.env`:
   ```bash
   SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
   ```

### Option B: QuickNode

1. Sign up at https://quicknode.com
2. Create Solana endpoint
3. Update `.env`:
   ```bash
   SOLANA_RPC_URL=https://YOUR_ENDPOINT.solana-mainnet.quiknode.pro/YOUR_KEY
   ```

## Step 7: Enhanced Health Check

The health check should verify:
- ✅ API is responding
- ✅ Jupiter API is accessible
- ✅ RPC connection works
- ✅ Fee wallet is valid

Already implemented in the updated `index.js`!

## Step 8: Testing

### Manual Testing

```bash
# Health check
curl https://your-api.vercel.app/api/health

# Quote (should validate input)
curl "https://your-api.vercel.app/api/quote?input_mint=So11111111111111111111111111111111111111112&output_mint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=1000000000"

# Test rate limiting (make 100+ requests quickly)
for i in {1..110}; do curl https://your-api.vercel.app/api/health; done
```

### Load Testing (Optional)

```bash
npm install -g k6
```

Create `load-test.js`:
```javascript
import http from 'k6/http';

export default function () {
  http.get('https://your-api.vercel.app/api/health');
}
```

Run: `k6 run load-test.js`

## Step 9: Documentation

### API Documentation

1. Install Swagger:
   ```bash
   npm install swagger-ui-express swagger-jsdoc
   ```

2. Add to `index.js`:
   ```javascript
   const swaggerUi = require('swagger-ui-express');
   const swaggerJsdoc = require('swagger-jsdoc');

   const swaggerOptions = {
     definition: {
       openapi: '3.0.0',
       info: {
         title: 'AgentDEX API',
         version: '1.0.0',
       },
     },
     apis: ['./index.js'],
   };

   const swaggerSpec = swaggerJsdoc(swaggerOptions);
   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
   ```

3. Access at: `https://your-api.vercel.app/api-docs`

## Step 10: Deployment

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway up

# Set environment variables
railway variables set NODE_ENV=production
railway variables set SENTRY_DSN=your_dsn
```

## Step 11: Post-Deployment

1. **Verify health check:** `curl https://your-api.vercel.app/api/health`
2. **Test a swap:** Use SDK or frontend
3. **Monitor Sentry:** Check for errors
4. **Check logs:** Verify logging works
5. **Test rate limiting:** Make many requests

## Step 12: Legal Documents

### Terms of Service Template

Create `TERMS.md`:
- Service description
- User responsibilities
- Limitation of liability
- Dispute resolution

### Privacy Policy Template

Create `PRIVACY.md`:
- Data collection
- Data usage
- Third-party services
- User rights

## Quick Checklist

- [ ] Dependencies installed
- [ ] Environment variables set
- [ ] Rate limiting enabled
- [ ] Input validation added
- [ ] Error handling improved
- [ ] Monitoring configured (Sentry)
- [ ] Production RPC configured
- [ ] Health check enhanced
- [ ] Documentation added
- [ ] Deployed to production
- [ ] Post-deployment testing done

## Timeline

**Week 1 (Must Have):**
- Day 1-2: Install dependencies, add middleware
- Day 3-4: Set up monitoring, production RPC
- Day 5: Testing, documentation
- Day 6-7: Deploy, verify

**Week 2 (Should Have):**
- API authentication (if needed)
- Enhanced logging
- Load testing
- Legal documents

**Month 1 (Nice to Have):**
- Admin dashboard
- Analytics
- User accounts
- Email notifications

---

**You're production-ready once Week 1 is complete!**
