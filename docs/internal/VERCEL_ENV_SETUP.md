# Setting Environment Variables in Vercel

## Step-by-Step Guide

### Step 1: Navigate to Your API Project

1. Go to [vercel.com](https://vercel.com) and log in
2. Click on your **API project** (likely named something like `moltydex-api` or `agentdex-api`)
3. You should see the project dashboard

### Step 2: Open Settings

1. Click on the **"Settings"** tab at the top of the project page
2. In the left sidebar, click on **"Environment Variables"**

### Step 3: Add/Update Environment Variables

You'll see a list of existing environment variables. Here's what to add/update:

#### Required: Primary RPC URL

1. Click **"Add New"** button (or find existing `SOLANA_RPC_URL` and click to edit)
2. **Key:** `SOLANA_RPC_URL`
3. **Value:** Your Helius RPC URL (e.g., `https://mainnet.helius-rpc.com/?api-key=YOUR_KEY_HERE`)
4. **Environment:** Select all three:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
5. Click **"Save"**

#### Optional: Fallback RPC URL

1. Click **"Add New"** again
2. **Key:** `SOLANA_RPC_FALLBACK`
3. **Value:** `https://api.mainnet-beta.solana.com` (public RPC as fallback)
4. **Environment:** Select all three (Production, Preview, Development)
5. Click **"Save"**

### Step 4: Verify Existing Variables

While you're in Environment Variables, check that these are also set:

- ✅ `JUPITER_API_KEY` - Should already be set
- ✅ `FEE_BPS` - Should already be set (or will use default)
- ✅ `SOLANA_RPC_URL` - **This is what you're updating**

### Step 5: Redeploy

After setting the environment variables, you need to redeploy:

**Option A: Redeploy from Dashboard**
1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click the **"⋯"** (three dots) menu
4. Click **"Redeploy"**
5. Confirm redeployment

**Option B: Redeploy from Terminal** (Recommended)
```bash
cd api
vercel --prod
```

---

## Visual Guide

### Navigation Path:
```
Vercel Dashboard
  → Your API Project
    → Settings (top tab)
      → Environment Variables (left sidebar)
        → Add New / Edit existing
```

### Environment Variable Form:
```
┌─────────────────────────────────────┐
│ Key: SOLANA_RPC_URL                  │
│ Value: https://mainnet.helius-rpc... │
│                                      │
│ Environments:                        │
│ ☑ Production                        │
│ ☑ Preview                           │
│ ☑ Development                       │
│                                      │
│ [Save] [Cancel]                     │
└─────────────────────────────────────┘
```

---

## Getting Your Helius RPC URL

If you haven't set up Helius yet:

1. **Sign up:** Go to [helius.dev](https://helius.dev)
2. **Create account** (free tier available)
3. **Dashboard → API Keys**
4. **Create new API key** for Mainnet
5. **Copy the RPC URL** - it will look like:
   ```
   https://mainnet.helius-rpc.com/?api-key=abc123def456...
   ```
6. **Paste this URL** as the value for `SOLANA_RPC_URL` in Vercel

---

## Verification

After redeploying, verify it's working:

1. **Check health endpoint:**
   ```bash
   curl https://api.moltydex.com/api/health
   ```
   Should show your Helius RPC URL in the response.

2. **Test balance check:**
   ```bash
   curl "https://api.moltydex.com/api/balance?wallet_address=YOUR_WALLET&token_mint=So11111111111111111111111111111111111111112"
   ```
   Should work without rate limit errors.

---

## Troubleshooting

### "I don't see Environment Variables option"
- Make sure you're in the **Settings** tab
- Check you're looking at the correct project (API project, not frontend)

### "Changes aren't taking effect"
- Environment variables require a **redeploy** to take effect
- Redeploy after adding/updating variables

### "How do I know which project is the API?"
- API projects usually have names like: `moltydex-api`, `agentdex-api`, `api-moltydex`
- Frontend projects usually have names like: `moltydex`, `moltydex-frontend`
- Check the project URL - API projects typically have `/api/` in their routes

### "I can't find my project"
- Go to [vercel.com/dashboard](https://vercel.com/dashboard)
- Look for projects linked to your GitHub/account
- Check the project's "Settings → General" to see the project name

---

## Quick Checklist

- [ ] Logged into Vercel
- [ ] Found API project
- [ ] Opened Settings → Environment Variables
- [ ] Added/Updated `SOLANA_RPC_URL` with Helius URL
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Saved the variable
- [ ] Redeployed the project
- [ ] Verified health endpoint shows new RPC URL

---

## Need Help?

If you're stuck:
1. Check Vercel's official docs: [vercel.com/docs/environment-variables](https://vercel.com/docs/environment-variables)
2. Look at your project's existing environment variables for reference
3. Make sure you're editing the **API project**, not the frontend project
