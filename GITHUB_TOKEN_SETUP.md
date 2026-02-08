# GitHub API Token Setup - Complete Guide

## Step-by-Step Instructions

### Step 1: Create GitHub Personal Access Token

1. **Go to GitHub Settings**
   - Visit: https://github.com/settings/tokens
   - Or: GitHub → Your Profile (top right) → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **Click "Generate new token"**
   - Click "Generate new token (classic)"
   - You may need to verify your password

3. **Configure Token**
   - **Note:** "MoltyDEX Automation" (or any name you want)
   - **Expiration:** Choose:
     - "90 days" (recommended for testing)
     - "No expiration" (if you want it permanent)
   - **Scopes:** Check these boxes:
     - ✅ **`repo`** - Full control of private repositories
     - ✅ **`public_repo`** - Access public repositories
     - ✅ **`write:discussion`** - Write access to discussions (optional but useful)

4. **Generate Token**
   - Click "Generate token" at the bottom
   - **IMPORTANT:** Copy the token immediately - you won't be able to see it again!
   - It will look like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 2: Store Token Securely

**Option A: Add to .env.local (Recommended)**

1. **Create/Edit `.env.local` file**
   ```bash
   cd /Users/danielstephenson/agentdex/frontend
   nano .env.local
   # or use your preferred editor
   ```

2. **Add the token:**
   ```
   GITHUB_TOKEN=ghp_your_token_here
   ```

3. **Save and close**

4. **Verify it's there:**
   ```bash
   cat .env.local | grep GITHUB_TOKEN
   ```

**Option B: Add to Root .env.local**

If you want to use it from the root directory:

```bash
cd /Users/danielstephenson/agentdex
nano .env.local
```

Add:
```
GITHUB_TOKEN=ghp_your_token_here
```

### Step 3: Test the Token

Run this command to test:

```bash
cd /Users/danielstephenson/agentdex
GITHUB_TOKEN=ghp_your_token_here node scripts/github-automate.js create-repo "test-repo" "Test repository"
```

Or if you added it to `.env.local`:

```bash
cd /Users/danielstephenson/agentdex
node scripts/github-automate.js create-repo "test-repo" "Test repository"
```

**Expected Result:**
```
📦 Creating repo: test-repo...

✅ Repo created!
URL: https://github.com/your-username/test-repo
```

### Step 4: Verify Token Permissions

The token should have:
- ✅ `repo` scope (for private repos)
- ✅ `public_repo` scope (for public repos)
- ✅ `write:discussion` scope (for discussions)

## What I Can Do With This Token

### 1. Create Example Repositories
```bash
node scripts/github-automate.js create-repo "moltydex-x402-example" "Complete x402 integration example"
```

### 2. Comment on Relevant Repos
```bash
node scripts/github-automate.js comment "coinbase/x402" "123" "Great project! Built MoltyDEX for x402 payments..."
```

### 3. Create Issues/PRs
```bash
node scripts/github-automate.js create-issue "coinbase/x402" "x402" "MoltyDEX Integration" "Built MoltyDEX..."
```

### 4. Engage with Community
- Comment on x402-related repos
- Create integration examples
- Engage with agent framework repos
- Build developer relationships

## Security Best Practices

1. **Never commit `.env.local` to Git**
   - It's already in `.gitignore` ✅
   - Never share the token publicly

2. **Use Token Only for Automation**
   - Don't use this token for manual Git operations
   - Use separate credentials for Git pushes

3. **Rotate if Compromised**
   - If token is exposed, revoke it immediately
   - Generate a new one

4. **Set Expiration**
   - Use 90 days for testing
   - Extend if needed

## Troubleshooting

**Error: "Bad credentials"**
- Check token is correct
- Verify token hasn't expired
- Check scopes are correct

**Error: "Resource not accessible"**
- Token might not have correct scopes
- Regenerate with all required scopes

**Error: "Repository already exists"**
- Repo name is taken
- Use a different name

## Quick Reference

**Token Creation:** https://github.com/settings/tokens  
**Required Scopes:** `repo`, `public_repo`, `write:discussion`  
**Storage:** `.env.local` file (never commit to Git)  
**Test Command:** `node scripts/github-automate.js create-repo "test" "Test"`

---

**Once you've added the token, let me know and I'll start automating GitHub activities!**
