# Jupiter API Key Setup Guide

## Step 1: Get Your Free Jupiter API Key

1. Go to **https://portal.jup.ag**
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **"Create API Key"** or **"Generate Key"**
5. Copy your API key (it will look like: `abc123def456...`)

**Note:** Free tier provides 60 requests per minute - perfect for MoltyDEX!

---

## Step 2: Add API Key to Vercel

### Option A: Using Vercel CLI (Recommended)

Run this command in your terminal:

```bash
cd api
vercel env add JUPITER_API_KEY production
```

When prompted:
- **Value:** Paste your API key from Step 1
- **Environment:** Select `production` (and optionally `preview`)

Then redeploy:
```bash
vercel --prod
```

### Option B: Using Vercel Dashboard

1. Go to **https://vercel.com/agentdex/moltydex-api/settings/environment-variables**
2. Click **"Add New"**
3. Fill in:
   - **Key:** `JUPITER_API_KEY`
   - **Value:** (paste your API key)
   - **Environment:** Select `Production` (and `Preview` if you want)
4. Click **"Save"**
5. Go to **Deployments** tab → Click **"⋯"** on latest deployment → **"Redeploy"**

---

## Step 3: Verify It Works

After adding the key and redeploying, test:

```bash
curl https://api.moltydex.com/api/health
```

You should see `"jupiter_api_key_set": true` in the response.

Or test a quote:
```bash
curl "https://api.moltydex.com/api/quote?input_mint=So11111111111111111111111111111111111111112&output_mint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=1000000000&slippage_bps=50"
```

You should get a quote response, not a 401 error.

---

## Troubleshooting

**If you get 401 Unauthorized:**
- Double-check the API key is correct (no extra spaces)
- Make sure you selected `production` environment
- Redeploy after adding the variable

**If you get "API key not set" warning:**
- The environment variable might not be deployed yet
- Wait 1-2 minutes after adding, then redeploy

**Need help?**
- Check Vercel logs: `vercel logs`
- Check Jupiter status: https://status.jup.ag
