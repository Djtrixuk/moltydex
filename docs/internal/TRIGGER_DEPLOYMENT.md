# How to Trigger a New Deployment After Setting Root Directory

## The Issue

Setting Root Directory to `frontend` doesn't automatically trigger a deployment. You need to manually trigger one.

## Solution: Manual Redeploy

### Step 1: Find the Current Production Deployment

Looking at your deployments list, find the one marked **"Current"** next to "Production" (likely `8BFz7GYK7`).

### Step 2: Trigger Redeploy

1. Click on that deployment (the one marked "Current")
2. OR click the **"..."** (three dots) menu on the right side of that deployment row
3. Select **"Redeploy"** from the menu
4. Choose **"Rebuild"** (not "Use existing Build Cache")
5. Click **"Redeploy"**

### Step 3: Watch the Build

After clicking Redeploy:
- A new deployment should appear at the top of the list
- It will show status: "Building..." or "Queued"
- Click on it to watch the build logs
- It should now build from the `frontend/` directory

## Alternative: Push a Commit

If redeploy doesn't work, push a commit to trigger auto-deploy:

```bash
cd /Users/danielstephenson/agentdex
git commit --allow-empty -m "Trigger deployment after root directory change"
git push origin master
```

This will trigger a new deployment that uses the updated Root Directory setting.

## What to Look For in Build Logs

After deployment starts, check the logs for:
- ✅ "Installing dependencies from `frontend/package.json`" (good!)
- ✅ "Building from `frontend/` directory" (good!)
- ❌ "Cannot find package.json" (bad - root directory not working)
- ❌ "Build failed" (check error details)

---

**Quick Action**: Click on the "Current" production deployment → Click "Redeploy" → Choose "Rebuild" → Watch it build!
