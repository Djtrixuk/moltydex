# Vercel Setup Guide - Fix "No Production Deployment"

## Current Situation

You have 2 Vercel projects:
1. **moltydex-frontend** → `www.moltydex.com` → Connected to `Djtrixuk/moltydex`
2. **moltydex-api** → `api.moltydex.com` → Connected to `Djtrixuk/Djtrixuk`

Both show **"No Production Deployment"** - this is why your updates aren't going live.

## Fix for moltydex-frontend Project

### Step 1: Configure Root Directory

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Click on **moltydex-frontend** project
3. Go to **Settings** → **General**
4. Scroll to **Root Directory**
5. Click **Edit** and set it to: `frontend`
6. Click **Save**

### Step 2: Verify Build Settings

In the same **Settings** → **General** page, check:

- **Framework Preset**: Should be `Next.js` (auto-detected)
- **Build Command**: Should be `npm run build` (or leave default)
- **Output Directory**: Should be `.next` (or leave default)
- **Install Command**: Should be `npm ci` (or leave default)

### Step 3: Enable Auto-Deploy

1. Go to **Settings** → **Git**
2. Verify:
   - **Production Branch**: Should be `master` (or `main`)
   - **Auto Deploy**: Should be **Enabled**
3. If disabled, enable it

### Step 4: Trigger a Deployment

**Option A: Manual Redeploy (Quickest)**
1. Go to **Deployments** tab
2. Click **"..."** on any deployment (or "Redeploy" button)
3. Select **"Redeploy"**
4. Choose **"Use existing Build Cache"** or **"Rebuild"**
5. Click **Redeploy**

**Option B: Push Empty Commit (If auto-deploy is enabled)**
```bash
cd /Users/danielstephenson/agentdex
git commit --allow-empty -m "Trigger Vercel deployment"
git push origin master
```

**Option C: Check GitHub Integration**
1. Go to **Settings** → **Git**
2. Verify GitHub repo is connected: `Djtrixuk/moltydex`
3. If not connected, click **"Connect Git Repository"**
4. Select `Djtrixuk/moltydex`

### Step 5: Check Deployment Logs

After triggering deployment:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Check **Build Logs** for errors
4. Common issues:
   - ❌ "Cannot find module" → Missing dependencies
   - ❌ "Type error" → TypeScript errors
   - ❌ "Build failed" → Check build command
   - ❌ "Root directory not found" → Root directory misconfigured

## Expected Result

After fixing:
- ✅ Deployment should start automatically
- ✅ Build should complete successfully
- ✅ Blog posts should be live at `/blog`
- ✅ x402 hub page should be live at `/x402-payments`
- ✅ All SEO improvements should be live

## Troubleshooting

### If Build Still Fails

1. **Check Build Logs** in Vercel dashboard
2. **Test Build Locally**:
   ```bash
   cd /Users/danielstephenson/agentdex/frontend
   npm ci
   npm run build
   ```
3. **Fix Any Errors** that appear
4. **Commit and Push** fixes

### If Root Directory Doesn't Work

The `vercel.json` I created should help, but if Vercel dashboard settings conflict:

1. Remove `vercel.json` from root (if causing issues)
2. Use only Vercel dashboard settings
3. Set Root Directory to `frontend` in dashboard

### If Auto-Deploy Still Doesn't Work

1. Check **Settings** → **Git** → **Production Branch**
2. Verify it matches your GitHub branch (`master` or `main`)
3. Check GitHub webhook is connected
4. Try disconnecting and reconnecting GitHub repo

## Quick Checklist

- [ ] Root Directory set to `frontend` in Vercel dashboard
- [ ] Auto-deploy enabled
- [ ] Production branch set to `master` (or `main`)
- [ ] GitHub repo connected: `Djtrixuk/moltydex`
- [ ] Build settings correct (Next.js framework)
- [ ] Deployment triggered (manual or auto)
- [ ] Build logs checked for errors
- [ ] Site verified at `www.moltydex.com/blog`

---

**Most Important**: Set Root Directory to `frontend` in Vercel dashboard - this is likely the main issue!
