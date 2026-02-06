# Set Fee Wallet in Vercel - Quick Guide

**Fee Wallet Address:** `ATYWjod5jkQm5RxrC65irY8e97UUY42LFM45ZGuNK3JL`

---

## Steps to Set Fee Wallet

### 1. Go to Vercel Dashboard
https://vercel.com/dashboard

### 2. Select API Project
- Click on `moltydex-api` project

### 3. Go to Settings
- Click **Settings** tab
- Click **Environment Variables** in left sidebar

### 4. Add Fee Wallet
- Click **Add New** or **Add** button
- **Name:** `FEE_WALLET`
- **Value:** `ATYWjod5jkQm5RxrC65irY8e97UUY42LFM45ZGuNK3JL`
- **Environment:** Select **Production** (and **Preview** if you want)
- Click **Save**

### 5. Redeploy
- Go to **Deployments** tab
- Click **⋯** (three dots) on latest deployment
- Click **Redeploy**
- Or run: `cd api && vercel --prod`

### 6. Verify
```bash
curl https://api.moltydex.com/api/health | jq '.fee_wallet_configured, .features.fee_collection'
```

**Expected output:**
```json
true
true
```

---

## Quick Command to Verify

After setting and redeploying, run:
```bash
node tests/test_fee_collection.js
```

Should show:
```
✅ Fee Wallet Configured: YES
✅ Fee Collection: ENABLED
```

---

## What Happens Next

Once `FEE_WALLET` is set and API is redeployed:

1. ✅ Fees will be calculated (already working)
2. ✅ Fee transfer instruction will be added to swap transactions
3. ✅ Fees will automatically transfer to: `ATYWjod5jkQm5RxrC65irY8e97UUY42LFM45ZGuNK3JL`
4. ✅ You can check balance on Solscan: https://solscan.io/account/ATYWjod5jkQm5RxrC65irY8e97UUY42LFM45ZGuNK3JL

---

**Fee Wallet:** `ATYWjod5jkQm5RxrC65irY8e97UUY42LFM45ZGuNK3JL`  
**Fee Rate:** 0.1% per swap  
**Status:** ⏳ Waiting for Vercel configuration
