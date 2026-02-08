# Quick Deployment Instructions

## The Problem
Vercel root directory is incorrectly configured, causing path issues.

## Quick Fix Options

### Option 1: Fix in Vercel Dashboard (Easiest)
1. Go to: https://vercel.com/agentdex/moltydex-frontend/settings
2. Click **Build and Deployment Settings**
3. Find **Root Directory**
4. **Clear it** (set to empty/root) OR set to exactly `frontend` (no trailing slash)
5. Save
6. Go to **Deployments** tab
7. Click **Redeploy** on latest deployment

### Option 2: Deploy via Git Push (Recommended)
Since all changes are already committed:

```bash
cd /Users/danielstephenson/agentdex
git push origin master
```

Vercel will auto-deploy if GitHub integration is enabled.

### Option 3: Manual Deploy from Root
```bash
cd /Users/danielstephenson/agentdex
vercel --prod
# When asked, select moltydex-frontend project
# Ensure root directory is empty or set to "frontend"
```

## What's Already Done ✅
- ✅ All blog posts committed (5 SEO posts)
- ✅ x402-payments.tsx page committed
- ✅ All components committed
- ✅ Build successful (tested locally)
- ✅ All files in correct locations

## What Needs to Happen
- ⏳ Fix Vercel root directory setting
- ⏳ Deploy to production
- ⏳ Verify blog posts are live

## Verify After Deployment
1. https://www.moltydex.com/blog - Should show all blog posts
2. https://www.moltydex.com/x402-payments - Should show x402 hub page
3. https://www.moltydex.com/blog/complete-guide-x402-payment-handler - Should load blog post
