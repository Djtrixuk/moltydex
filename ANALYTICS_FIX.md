# Analytics Tracking Fix

## Problem
Analytics were not persisting because:
1. **In-memory storage** - Data reset on every Vercel serverless function restart/deployment
2. **Async tracking not awaited** - `trackEvent` calls weren't being awaited, so tracking could fail silently
3. **No persistent storage** - No database or Redis to store analytics across restarts

## Solution Implemented

### 1. Added Upstash Redis Support
- Added `@upstash/redis` package for persistent storage
- Analytics now use Redis when configured, fallback to in-memory if not
- Works perfectly with Vercel serverless functions

### 2. Fixed Async Tracking
- Made `trackEvent` async
- Updated all routes to `await trackEvent()` calls:
  - `api/routes/swap.js` - All swap tracking now awaited
  - `api/routes/balance.js` - Balance tracking awaited
  - `api/routes/quote.js` - Quote tracking awaited
  - `api/routes/batch.js` - Batch tracking awaited

### 3. Added Better Logging
- Swap events now log to console for debugging
- Shows success/failure, token pair, and wallet address (truncated)

## Setup Instructions

### Option 1: Use Upstash Redis (Recommended - Persistent)

1. **Create Upstash Redis Database:**
   - Go to https://upstash.com/
   - Sign up (free tier available)
   - Create a Redis database
   - Copy the REST URL and REST Token

2. **Add to Vercel Environment Variables:**
   ```
   UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-token-here
   ```

3. **Redeploy API:**
   - Analytics will automatically use Redis
   - Data will persist across deployments

### Option 2: Use In-Memory (Current - Temporary)
- Works but resets on each deployment
- Good for testing, not for production

## Testing

After deploying, check analytics:
```bash
curl https://api.moltydex.com/api/analytics/stats
```

Look for:
- `"storage": "redis"` - Using persistent storage ✅
- `"storage": "memory"` - Using in-memory (will reset) ⚠️

## What's Tracked

- ✅ Swaps (success/failure)
- ✅ Quotes
- ✅ Balance checks
- ✅ API calls by endpoint
- ✅ Unique wallets
- ✅ Token pairs
- ✅ Daily usage statistics

## Next Steps

1. **Set up Upstash Redis** (5 minutes)
2. **Deploy API** with new code
3. **Test a swap** - Should appear in analytics immediately
4. **Check analytics** - Data should persist across deployments
