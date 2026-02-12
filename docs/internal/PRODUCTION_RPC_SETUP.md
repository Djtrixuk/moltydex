# Production RPC Setup Guide

## ⚠️ CRITICAL: You're Currently Using Public RPC

**Current Status:** Your production API is using the public Solana RPC (`api.mainnet-beta.solana.com`), which has **strict rate limits** and **will cause failures** under production load.

**Impact:**
- ❌ Users will experience "RPC rate limit exceeded" errors
- ❌ Swap transactions will fail randomly
- ❌ Balance checks will timeout
- ❌ Poor user experience and potential revenue loss

## ✅ Solution: Use a Dedicated RPC Provider

### Option 1: Helius (Recommended - Free Tier Available)

**Why Helius:**
- ✅ Free tier: 100,000 requests/day
- ✅ Fast and reliable
- ✅ Built specifically for Solana
- ✅ Easy setup

**Setup Steps:**

1. **Sign up at [helius.dev](https://helius.dev)**
   - Create a free account
   - Navigate to Dashboard → API Keys

2. **Get your API key**
   - Create a new API key for Mainnet
   - Copy the RPC URL (format: `https://mainnet.helius-rpc.com/?api-key=YOUR_KEY`)

3. **Set in Vercel:**
   - Go to Vercel Dashboard → Your API Project → Settings → Environment Variables
   - Add/Update: `SOLANA_RPC_URL` = `https://mainnet.helius-rpc.com/?api-key=YOUR_KEY`
   - (Optional) Add fallback: `SOLANA_RPC_FALLBACK` = `https://api.mainnet-beta.solana.com`

4. **Redeploy:**
   ```bash
   cd api
   vercel --prod
   ```

**Free Tier Limits:**
- 100,000 requests/day
- Usually sufficient for moderate traffic
- Upgrade to paid plan if you exceed limits

---

### Option 2: QuickNode (Free Tier Available)

**Why QuickNode:**
- ✅ Free tier: 25,000 requests/month
- ✅ Enterprise-grade reliability
- ✅ Good for testing/small projects

**Setup Steps:**

1. **Sign up at [quicknode.com](https://quicknode.com)**
   - Create account
   - Create new endpoint → Solana → Mainnet

2. **Get your endpoint URL**
   - Format: `https://YOUR_ENDPOINT.solana-mainnet.quiknode.pro/YOUR_KEY`

3. **Set in Vercel:**
   - Environment Variable: `SOLANA_RPC_URL` = Your QuickNode URL

4. **Redeploy**

---

### Option 3: Triton (Free Tier Available)

**Why Triton:**
- ✅ Free tier available
- ✅ Good performance
- ✅ Solana-focused

**Setup:**
- Sign up at [triton.one](https://triton.one)
- Get RPC URL and set as `SOLANA_RPC_URL`

---

## Configuration

### Environment Variables

Set these in **Vercel → Settings → Environment Variables**:

```bash
# Primary RPC (REQUIRED - use dedicated provider)
SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY

# Fallback RPC (OPTIONAL - defaults to public RPC)
SOLANA_RPC_FALLBACK=https://api.mainnet-beta.solana.com
```

### Current Code Behavior

The platform now includes:
- ✅ **Automatic retry logic** (3 retries with exponential backoff)
- ✅ **Fallback RPC support** (switches to fallback if primary rate limited)
- ✅ **Better error messages** (distinguishes rate limits from other errors)
- ✅ **429 status codes** for rate limits (proper HTTP semantics)

### How Retry Works

1. **First attempt:** Uses primary RPC (`SOLANA_RPC_URL`)
2. **If rate limited:** Switches to fallback RPC (`SOLANA_RPC_FALLBACK`)
3. **If still failing:** Retries with exponential backoff (1s, 2s, 4s)
4. **After 3 retries:** Returns 429 error with retry-after header

---

## Verification

After setting up your RPC provider:

1. **Check health endpoint:**
   ```bash
   curl https://api.moltydex.com/api/health
   ```
   Should show your RPC URL in the response.

2. **Test balance check:**
   ```bash
   curl "https://api.moltydex.com/api/balance?wallet_address=YOUR_WALLET&token_mint=So11111111111111111111111111111111111111112"
   ```
   Should return balance without rate limit errors.

3. **Monitor logs:**
   - Check Vercel logs for RPC errors
   - Look for `[RPC]` prefixed messages
   - Rate limit errors should be rare with dedicated RPC

---

## Cost Comparison

| Provider | Free Tier | Paid Plans | Best For |
|----------|-----------|------------|----------|
| **Helius** | 100k req/day | $99/mo (1M req) | Most projects |
| **QuickNode** | 25k req/month | $49/mo (500k req) | Small projects |
| **Triton** | Varies | Custom | Enterprise |
| **Public RPC** | Unlimited* | N/A | ❌ Not for production |

*Unlimited but rate-limited and unreliable

---

## Monitoring

### What to Monitor:

1. **Rate limit errors** (should be near zero with dedicated RPC)
2. **RPC response times** (should be < 500ms)
3. **Error rates** (429 status codes)
4. **Fallback usage** (if fallback is used frequently, upgrade primary RPC)

### Vercel Logs:

Check for patterns like:
- `[RPC] Rate limit detected` - Should be rare
- `[RPC] Retry attempt` - Should be occasional, not frequent
- `429` status codes - Should be near zero

---

## Migration Checklist

- [ ] Sign up for dedicated RPC provider (Helius recommended)
- [ ] Get API key/RPC URL
- [ ] Set `SOLANA_RPC_URL` in Vercel environment variables
- [ ] (Optional) Set `SOLANA_RPC_FALLBACK` for redundancy
- [ ] Redeploy API: `cd api && vercel --prod`
- [ ] Verify health endpoint shows new RPC URL
- [ ] Test balance check endpoint
- [ ] Monitor logs for 24 hours
- [ ] Update team documentation

---

## Support

If you encounter issues:

1. **Check Vercel logs** for RPC errors
2. **Verify environment variables** are set correctly
3. **Test RPC URL directly** with curl
4. **Check provider dashboard** for usage/quota
5. **Contact RPC provider support** if quota exceeded

---

## Next Steps

1. **Immediate:** Set up Helius (free tier) - takes 5 minutes
2. **Short-term:** Monitor usage and upgrade if needed
3. **Long-term:** Consider multiple RPC providers for redundancy

**Remember:** The public Solana RPC is **not suitable for production**. Set up a dedicated provider today to avoid user-facing failures.
