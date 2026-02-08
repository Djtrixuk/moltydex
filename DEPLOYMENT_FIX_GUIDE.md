# Deployment Fix Guide

## Issue
Vercel is trying to use path `~/agentdex/frontend/frontend` which doesn't exist. This suggests the root directory setting in Vercel dashboard might be incorrect.

## Solution

### Option 1: Fix Root Directory in Vercel Dashboard (Recommended)

1. Go to https://vercel.com/agentdex/moltydex-frontend/settings
2. Navigate to **Build and Deployment Settings**
3. Find **Root Directory** setting
4. Set it to: `frontend` (not `frontend/frontend`)
5. Save settings
6. Redeploy from dashboard or run: `cd frontend && vercel --prod`

### Option 2: Deploy from Root Directory

If the root directory is already set correctly in dashboard but CLI is having issues:

```bash
cd /Users/danielstephenson/agentdex
vercel --prod
```

Then when prompted, select the frontend project and ensure root directory is `frontend`.

### Option 3: Use GitHub Integration

If you have GitHub integration enabled:
1. Push changes to GitHub: `git push origin master`
2. Vercel will auto-deploy
3. Ensure root directory is set to `frontend` in dashboard

## Verify Deployment

After deployment, verify:
1. Blog posts are live: https://www.moltydex.com/blog
2. x402 hub page: https://www.moltydex.com/x402-payments
3. Individual blog posts load correctly
4. Schema markup is present (check page source)

## Current Status

- ✅ All files committed (commit 7c53a9d)
- ✅ Build successful (`npm run build` works)
- ✅ All blog posts exist in `frontend/public/blog-content/`
- ✅ x402-payments.tsx page exists
- ⚠️ Need to fix Vercel root directory setting
- ⏳ Deploy to production
