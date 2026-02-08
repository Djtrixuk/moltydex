# GitHub Token Quick Start - 5 Minutes

## 🚀 Quick Setup (Copy-Paste Ready)

### Step 1: Create Token (2 minutes)

1. **Go to:** https://github.com/settings/tokens
2. **Click:** "Generate new token (classic)"
3. **Name:** "MoltyDEX Automation"
4. **Expiration:** "90 days" (or "No expiration")
5. **Scopes:** Check these ✅:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `public_repo` (Access public repositories)  
   - ✅ `write:discussion` (Write access to discussions)
6. **Click:** "Generate token"
7. **Copy the token** (starts with `ghp_...`)

### Step 2: Add to .env.local (1 minute)

```bash
cd /Users/danielstephenson/agentdex
echo "GITHUB_TOKEN=ghp_your_token_here" >> .env.local
```

**Or edit manually:**
```bash
nano .env.local
# Add: GITHUB_TOKEN=ghp_your_token_here
# Save: Ctrl+X, then Y, then Enter
```

### Step 3: Test It (1 minute)

```bash
cd /Users/danielstephenson/agentdex
node scripts/test-github-token.js
```

**Expected Output:**
```
✅ Token is valid!
Username: your-username
✅ Ready to automate GitHub activities!
```

### Step 4: Let Me Know! (1 minute)

Once the test passes, just say "GitHub token is ready" and I'll start:
- Creating example repos
- Commenting on relevant projects
- Engaging with x402/agent communities
- Building developer relationships

## ✅ That's It!

**Total Time:** ~5 minutes  
**Security:** Token is in `.env.local` (already in `.gitignore`)  
**What I'll Do:** Automate GitHub activities to increase MoltyDEX visibility

---

**Need Help?** See `GITHUB_TOKEN_SETUP.md` for detailed instructions.
