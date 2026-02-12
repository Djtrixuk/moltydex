# Discord Bot Setup - Step 3 Complete! Next Steps

## ✅ What You've Done
- Created Discord Application
- Created Bot
- Reached Bot Configuration Page

## 🔧 Step 3a: Enable Required Intents

**Before getting the token, enable these intents:**

1. **Scroll down to "Privileged Gateway Intents"**

2. **Enable these toggles:**
   - ✅ **Server Members Intent** - Required for bot to see server members
   - ✅ **Message Content Intent** - Required for bot to read message content
   - ❌ **Presence Intent** - Not needed (can leave disabled)

3. **Click "Save Changes"** at the bottom

**Why these are needed:**
- Server Members Intent: Bot needs to assign roles, track members
- Message Content Intent: Bot needs to read messages for bug reports, use cases, etc.

---

## 🔑 Step 3b: Get Bot Token

**Option 1: If you just created the bot:**
- The token should be visible right after creation
- Click "Copy" or "Reveal Token"
- Copy the token

**Option 2: If token is hidden:**
- Click "Reset Token" button
- Confirm "Yes, do it!"
- Copy the new token immediately (you can only see it once!)

**⚠️ Important:** 
- Token looks like: `MTIzNDU2Nzg5MDEyMzQ1Njc4OQ.ABCdef.GHIjkl-MNOpqrs-TUVwxyz123456789`
- Keep it secret! Never share publicly or commit to git.

---

## 📝 Step 3c: Give Me the Token

**Once you have the token, you can:**

**Option A: Tell me directly**
- Just paste the token here
- I'll store it securely in `.discord-bot-token` (gitignored)

**Option B: Create file yourself**
```bash
cd /Users/danielstephenson/agentdex
echo "YOUR_TOKEN_HERE" > .discord-bot-token
```

**Option C: Add to .env**
```bash
# Add to .env file
DISCORD_BOT_TOKEN=YOUR_TOKEN_HERE
```

---

## 🚀 Step 4: Invite Bot to Server

**After I have the token, we'll invite the bot:**

1. **Go to "OAuth2" → "URL Generator"** (left sidebar)

2. **Under "Scopes", select:**
   - ✅ `bot`
   - ✅ `applications.commands`

3. **Under "Bot Permissions", select:**
   - ✅ `Administrator` (easiest for setup)
   - OR specific permissions:
     - Manage Channels
     - Manage Roles
     - Send Messages
     - Read Message History
     - Manage Messages

4. **Copy the generated URL** at the bottom

5. **Open URL in browser**
   - Select your server
   - Click "Authorize"
   - Bot should appear in your server!

---

## 📋 Step 5: Get Server ID

**To run the setup script, I'll need your Server ID:**

1. **Enable Developer Mode:**
   - Discord Settings → Advanced → Enable Developer Mode

2. **Get Server ID:**
   - Right-click your server icon (left sidebar)
   - Click "Copy ID"
   - Share it with me

---

## 🎯 What Happens Next

Once I have:
- ✅ Bot token
- ✅ Server ID

I'll:
1. Store token securely
2. Install discord.js (if needed)
3. Run setup script
4. Create all channels and roles
5. Set up welcome message
6. Ready for testers!

---

**Ready?** Just paste the bot token here and I'll handle the rest! 🔑
