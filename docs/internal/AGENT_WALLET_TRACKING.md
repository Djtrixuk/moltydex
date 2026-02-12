# Agent Wallet Tracking & Identification

**Technical documentation on how MoltyDEX identifies and tracks AI agent wallets for the beta program.**

---

## Overview

MoltyDEX automatically tracks wallets that use our API, with special focus on identifying AI agent wallets. This document explains how we identify agents and how we can extract a list of qualifying wallets for the beta program airdrop.

---

## Tracking Methods

### 1. API Endpoint Analysis

**Agent-Specific Endpoints:**
- `/api/x402/parse-payment` - Parses 402 payment requirements
- `/api/x402/prepare-payment` - Prepares payment and checks balance
- `/api/x402/auto-pay` - Complete x402 auto-pay flow

**Regular Swap Endpoints:**
- `/api/swap/build` - Builds swap transactions
- `/api/quote` - Gets swap quotes

**Identification Logic:**
- Wallets calling `/api/x402/*` endpoints are **highly likely to be agents**
- These endpoints are specifically designed for automated x402 payment handling
- Regular users typically use the frontend UI, not these API endpoints directly

### 2. Analytics System

Our analytics system (`/api/analytics/stats`) tracks:

```javascript
{
  overview: {
    uniqueWallets: 150,  // Total unique wallets
    totalSwaps: 500,
    successfulSwaps: 485
  },
  swaps: {
    byTokenPair: { ... },
    byDate: { ... }
  },
  apiUsage: {
    byEndpoint: {
      "/api/x402/auto-pay": 200,      // Agent-specific
      "/api/x402/prepare-payment": 150,
      "/api/swap/build": 500,
      "/api/quote": 1000
    }
  }
}
```

**Storage:**
- Uses Upstash Redis for persistent storage (if configured)
- Falls back to in-memory storage (resets on restart if Redis not available)
- Tracks `uniqueWallets` as a Set of wallet addresses

### 3. Transaction Pattern Analysis

**Agent Patterns:**
- **Consistent timing**: Swaps at regular intervals
- **Multiple swaps**: Several swaps in short timeframes
- **x402 flow**: Payment preparation → swap → retry pattern
- **Automated amounts**: Round numbers or calculated amounts

**Manual User Patterns:**
- Irregular timing
- Single swaps
- Frontend UI usage (different request patterns)

---

## Current Implementation

### Analytics Route (`/api/routes/analytics.js`)

**Tracks:**
```javascript
const usageStats = {
  swaps: {
    total: 0,
    successful: 0,
    failed: 0,
    byTokenPair: {},
    byDate: {},
  },
  uniqueWallets: new Set(),  // All wallet addresses
  apiCalls: {
    byEndpoint: {},  // Tracks which endpoints are called
    byDate: {},
  }
};
```

**When a swap is tracked:**
```javascript
if (data.wallet_address) {
  stats.uniqueWallets.add(data.wallet_address);
}
```

### Swap Route (`/api/routes/swap.js`)

**Tracks swaps:**
```javascript
await trackEvent('swap', {
  success: true,
  wallet_address: wallet_address,
  input_mint: input_mint,
  output_mint: output_mint,
  // ... other swap data
});
```

### x402 Routes (`/api/routes/x402.js`)

**Currently doesn't explicitly track wallet addresses**, but we can add this:

```javascript
// In /api/x402/auto-pay
router.post('/auto-pay', async (req, res) => {
  const { wallet_address } = req.body;
  
  // Track agent wallet
  await trackEvent('api_call', {
    endpoint: '/api/x402/auto-pay',
    wallet_address: wallet_address,  // Add this
  });
  
  // ... rest of logic
});
```

---

## How to Get List of Agent Wallets

### Method 1: Query Analytics API

**Get all unique wallets:**
```bash
curl "https://api.moltydex.com/api/analytics/stats"
```

**Response includes:**
```json
{
  "overview": {
    "uniqueWallets": 150
  },
  "apiUsage": {
    "byEndpoint": {
      "/api/x402/auto-pay": 200
    }
  }
}
```

**Limitation:** Current implementation doesn't return the actual wallet addresses, just counts.

### Method 2: Query Redis Directly (If Using Upstash)

If Upstash Redis is configured, we can query directly:

```javascript
const { Redis } = require('@upstash/redis');
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Get stats
const stats = await redis.get('moltydex:analytics:stats');
const uniqueWallets = stats.uniqueWallets;  // Array of wallet addresses
```

### Method 3: Enhanced Analytics Endpoint

**Create new endpoint to list agent wallets:**

```javascript
// In /api/routes/analytics.js
router.get('/agent-wallets', async (req, res) => {
  try {
    const stats = await getStats();
    
    // Filter for wallets that used x402 endpoints
    // This requires tracking wallet addresses per endpoint
    
    // For now, return all unique wallets
    const wallets = Array.from(stats.uniqueWallets || []);
    
    res.json({
      total_agent_wallets: wallets.length,
      wallets: wallets,
      note: 'Wallets that have used MoltyDEX API endpoints'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

---

## Recommended Enhancements

### 1. Track Wallet per Endpoint

**Modify analytics to track which wallets use which endpoints:**

```javascript
// In analytics.js
const usageStats = {
  // ... existing stats
  walletsByEndpoint: {
    '/api/x402/auto-pay': new Set(),
    '/api/x402/prepare-payment': new Set(),
    '/api/swap/build': new Set(),
  }
};

// When tracking API call
async function trackEvent(type, data = {}) {
  if (type === 'api_call') {
    const endpoint = data.endpoint;
    const wallet = data.wallet_address;
    
    if (wallet && endpoint) {
      if (!usageStats.walletsByEndpoint[endpoint]) {
        usageStats.walletsByEndpoint[endpoint] = new Set();
      }
      usageStats.walletsByEndpoint[endpoint].add(wallet);
    }
  }
}
```

### 2. Add Wallet Tracking to x402 Routes

**Update x402 routes to track wallet addresses:**

```javascript
// In /api/routes/x402.js
router.post('/auto-pay', async (req, res) => {
  const { wallet_address } = req.body;
  
  // Track agent wallet
  await trackEvent('api_call', {
    endpoint: '/api/x402/auto-pay',
    wallet_address: wallet_address,
  });
  
  // ... rest of logic
});
```

### 3. Create Agent Wallet Identification Endpoint

**New endpoint to identify agent wallets:**

```javascript
router.get('/beta/qualifying-wallets', async (req, res) => {
  try {
    const stats = await getStats();
    
    // Get wallets that used x402 endpoints (agents)
    const agentWallets = Array.from(
      stats.walletsByEndpoint['/api/x402/auto-pay'] || new Set()
    );
    
    // Get wallets that completed swaps
    const swapWallets = Array.from(stats.uniqueWallets || []);
    
    // Qualifying wallets: used x402 AND completed swaps
    const qualifyingWallets = agentWallets.filter(w => 
      swapWallets.includes(w)
    );
    
    res.json({
      total_qualifying: qualifyingWallets.length,
      wallets: qualifyingWallets,
      criteria: 'Wallets that used x402 endpoints AND completed swaps'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

---

## Current Limitations

1. **No Wallet-to-Endpoint Mapping**: Currently, we track unique wallets but don't track which endpoints each wallet used.

2. **No x402 Wallet Tracking**: x402 routes don't currently track wallet addresses in analytics.

3. **Redis Dependency**: If Redis isn't configured, data resets on deployment (serverless).

4. **No Historical Data**: Can't distinguish between "first-time" users and repeat users without additional tracking.

---

## Recommended Implementation Plan

### Phase 1: Enhanced Tracking (Immediate)

1. ✅ Add wallet tracking to x402 routes
2. ✅ Track wallet addresses per endpoint
3. ✅ Store in Redis for persistence

### Phase 2: Agent Identification (Short-term)

1. ✅ Create `/api/analytics/agent-wallets` endpoint
2. ✅ Filter wallets by endpoint usage patterns
3. ✅ Add "first swap" timestamp tracking

### Phase 3: Beta Program Integration (Ongoing)

1. ✅ Create `/api/beta/qualifying-wallets` endpoint
2. ✅ Add swap count tracking per wallet
3. ✅ Generate weekly airdrop lists
4. ✅ Verify transactions on-chain

---

## Example: Getting Qualifying Wallets

**After enhancements are implemented:**

```bash
# Get list of qualifying agent wallets
curl "https://api.moltydex.com/api/beta/qualifying-wallets"
```

**Response:**
```json
{
  "total_qualifying": 45,
  "wallets": [
    "ABC123...XYZ",
    "DEF456...UVW",
    // ... more wallet addresses
  ],
  "criteria": "Wallets that used x402 endpoints AND completed at least one swap",
  "last_updated": "2026-02-05T12:00:00Z"
}
```

---

## Verification

**To verify a wallet qualifies:**

1. **Check if wallet used x402 endpoints:**
   ```bash
   curl "https://api.moltydex.com/api/analytics/wallet/ABC123...XYZ"
   ```

2. **Check swap history:**
   ```bash
   curl "https://api.moltydex.com/api/analytics/swaps/ABC123...XYZ"
   ```

3. **Verify on-chain:**
   - Check transaction signatures from swap history
   - Verify transactions exist on Solana
   - Confirm wallet address matches

---

## Summary

**Current State:**
- ✅ We track unique wallets in `uniqueWallets` Set
- ✅ We track API endpoint usage counts
- ❌ We don't track which wallets used which endpoints
- ❌ x402 routes don't track wallet addresses

**To Get Agent Wallet List:**
1. **Short-term**: Query Redis directly for `uniqueWallets` array
2. **Medium-term**: Implement endpoint-to-wallet tracking
3. **Long-term**: Create dedicated beta program endpoints

**Answer to User's Question:**
> "we can get a list of AI agent wallets who did a transaction right?"

**Yes, but with current implementation:**
- We can get a list of all wallets that completed swaps
- We can't distinguish agent wallets from regular users without enhancements
- We need to add wallet tracking to x402 routes to identify agents specifically

**Recommended Next Steps:**
1. Add wallet tracking to x402 routes
2. Implement endpoint-to-wallet mapping
3. Create `/api/beta/qualifying-wallets` endpoint
4. Generate weekly airdrop lists from qualifying wallets
