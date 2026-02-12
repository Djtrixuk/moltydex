# Vercel Root Directory - Alternative Solutions

## The Issue

The Root Directory setting isn't visible in General settings. This is common in newer Vercel interfaces - it may be:
1. In "Build and Deployment" section
2. Hidden/not available (relying on vercel.json instead)
3. Only visible after certain conditions

## Solution 1: Check Build and Deployment Section

1. Click **"Build and Deployment"** in the left sidebar
2. Look for:
   - **Root Directory** setting
   - **Project Root** setting
   - **Base Directory** setting
3. If you find it, set it to: `frontend`

## Solution 2: Use vercel.json (Already Done!)

I've already created a `vercel.json` file in your repo root with:
```json
{
  "rootDirectory": "frontend"
}
```

This should work! But Vercel might need:
1. A fresh deployment to pick it up
2. The file to be in the correct location

## Solution 3: Verify vercel.json is Correct

The `vercel.json` I created should be at:
- `/Users/danielstephenson/agentdex/vercel.json`

It contains:
- `rootDirectory: "frontend"`
- Build commands pointing to frontend directory
- Framework set to Next.js

## Solution 4: Manual Deployment Trigger

Since the setting might not be visible, let's force Vercel to use the vercel.json:

1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment (or "Redeploy" button)
3. Select **"Redeploy"**
4. Choose **"Rebuild"** (not "Use existing Build Cache")
5. This will force Vercel to re-read vercel.json

## Solution 5: Check if Project Needs Re-linking

Sometimes Vercel projects need to be re-linked to GitHub:

1. Go to **Settings** → **Git**
2. Check if repo shows: `Djtrixuk/moltydex`
3. If not connected, click **"Connect Git Repository"**
4. Select `Djtrixuk/moltydex`
5. This will trigger a fresh deployment with vercel.json

## What to Do Right Now

**Step 1**: Check "Build and Deployment" section
- Click it in the sidebar
- Look for Root Directory there

**Step 2**: If not found, trigger a manual redeploy
- Go to Deployments tab
- Redeploy with "Rebuild" option
- This should pick up vercel.json

**Step 3**: Check deployment logs
- After redeploy starts, click on it
- Check build logs
- Look for errors about "root directory" or "cannot find package.json"

---

**Most Likely**: The vercel.json file should work. Just need to trigger a fresh deployment to pick it up!
