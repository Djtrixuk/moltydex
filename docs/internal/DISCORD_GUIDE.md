# Discord Server Setup Guide

## 🎯 What I Can Do

I can create **scripts and automation** to manage your Discord server, but I need you to:

1. **Create the Discord server** (or use existing)
2. **Create a Discord bot** (I'll guide you)
3. **Give me the bot token** (I'll store it securely)
4. **I'll create all the automation**

---

## 📋 Step-by-Step Setup

### Step 1: Create Discord Server (If Needed)

1. Open Discord
2. Click "+" button (left sidebar)
3. Choose "Create My Own" → "For a club or community"
4. Name it "MoltyDEX Beta Testers"
5. Done!

### Step 2: Create Discord Bot

1. **Go to Discord Developer Portal:**
   - Visit: https://discord.com/developers/applications
   - Click "New Application"
   - Name it "MoltyDEX Bot"
   - Click "Create"

2. **Create Bot:**
   - Go to "Bot" section (left sidebar)
   - Click "Add Bot" → "Yes, do it!"
   - Under "Token", click "Reset Token" → "Yes, do it!"
   - **Copy the token** (you'll need this)
   - Scroll down to "Privileged Gateway Intents"
   - Enable:
     - ✅ Server Members Intent
     - ✅ Message Content Intent
   - Click "Save Changes"

3. **Invite Bot to Server:**
   - Go to "OAuth2" → "URL Generator" (left sidebar)
   - Under "Scopes", select:
     - ✅ `bot`
     - ✅ `applications.commands`
   - Under "Bot Permissions", select:
     - ✅ `Administrator` (or specific permissions)
   - Copy the generated URL at the bottom
   - Open URL in browser
   - Select your server → "Authorize"
   - Bot should now be in your server!

### Step 3: Get Server ID

1. **Enable Developer Mode:**
   - Discord Settings → Advanced → Enable Developer Mode

2. **Get Server ID:**
   - Right-click your server icon
   - Click "Copy ID"
   - Save this ID

### Step 4: Give Me the Token

**Option A: Create Token File (Recommended)**
```bash
# Create .discord-bot-token file (gitignored)
echo "YOUR_BOT_TOKEN_HERE" > .discord-bot-token
```

**Option B: Add to .env**
```bash
# Add to .env file
DISCORD_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
```

**Option C: Tell Me Directly**
- I can store it in `.discord-bot-token` for you
- This file is gitignored (won't be committed)

---

## 🚀 What I'll Create

Once you give me the token, I'll create:

### 1. Server Setup Script
- Creates all channels
- Creates all roles
- Sets up permissions
- Sends welcome message

### 2. Submission Tracker
- Tracks bug reports
- Tracks use cases
- Tracks integrations
- Assigns roles automatically

### 3. Reward Tracker
- Tracks who earned what
- Posts in #rewards channel
- Generates leaderboard

### 4. Welcome Bot
- Welcomes new members
- Assigns @Beta Tester role
- Sends welcome DM

### 5. Command Bot (Optional)
- `/submit-bug` - Submit bug report
- `/submit-usecase` - Submit use case
- `/check-rewards` - Check your rewards
- `/leaderboard` - View leaderboard

---

## 📝 Server Structure

### Channels:
- `#welcome` - Welcome message and rules
- `#announcements` - Important updates
- `#beta-testers` - Main discussion
- `#bug-reports` - Bug submissions
- `#use-cases` - Use case stories
- `#integrations` - Integration demos
- `#feedback` - General feedback
- `#rewards` - Reward tracking
- `#help` - Support/questions

### Roles:
- `@Beta Tester` - All testers
- `@Early Tester` - First 20 testers
- `@Bug Reporter` - Reported bugs
- `@Use Case Contributor` - Shared use cases
- `@Integration Builder` - Completed integrations
- `@Admin` - You and moderators

---

## 🔒 Security

- Bot token stored in `.discord-bot-token` (gitignored)
- Never commit token to git
- Bot has minimal necessary permissions
- All scripts use environment variables

---

## 💡 Quick Start

**Once you have bot token:**

1. **Store token:**
   ```bash
   echo "YOUR_TOKEN" > .discord-bot-token
   ```

2. **Install dependencies:**
   ```bash
   npm install discord.js
   ```

3. **Run setup:**
   ```bash
   node scripts/discord-setup.js YOUR_SERVER_ID
   ```

4. **Done!** Server is set up

---

## ❓ Questions?

**What if I don't want a bot?**
- I can create templates for manual setup
- Channel structure, welcome message, rules, etc.

**What if I want to customize?**
- All scripts are customizable
- I can modify channels, roles, messages, etc.

**What if I want different features?**
- I can add any Discord features you need
- Custom commands, moderation, analytics, etc.

---

**Ready to set up?** Just give me the bot token and server ID, and I'll handle the rest! 🚀
