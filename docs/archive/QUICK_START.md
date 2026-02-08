# ⚡ Quick Start - Get Running in 5 Minutes

Fastest way to get AgentDEX running locally for testing.

---

## 🚀 Quick Commands

### Terminal 1: Start API

```bash
cd /Users/danielstephenson/agentdex/api
npm install
cp .env.example .env
# Edit .env and set FEE_WALLET=your_wallet_address
npm start
```

**Keep this terminal open!**

### Terminal 2: Start Frontend

```bash
cd /Users/danielstephenson/agentdex/frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
npm run dev
```

**Open browser:** `http://localhost:3000`

---

## ✅ Verify It Works

1. **API Health Check:**
   ```bash
   curl http://localhost:3001/api/health
   ```

2. **Frontend:**
   - Open `http://localhost:3000`
   - Accept beta disclaimer
   - Connect wallet
   - Try a swap!

---

## 📝 Before You Start

Make sure you have:
- ✅ Node.js 18+ (`node --version`)
- ✅ npm installed (`npm --version`)
- ✅ Phantom or Solflare wallet extension installed

---

## 🆘 Troubleshooting

**API won't start?**
- Check `.env` file exists and has `FEE_WALLET` set
- Make sure port 3001 is not in use

**Frontend won't start?**
- Make sure API is running first
- Check `.env.local` has correct API URL

**Can't connect wallet?**
- Make sure browser extension is installed
- Refresh the page

---

**For detailed deployment instructions, see `BUILD_AND_DEPLOY.md`**
