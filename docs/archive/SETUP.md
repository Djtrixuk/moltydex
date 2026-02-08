# AgentDEX Aggregator Setup Guide

## Prerequisites

1. **Node.js 18+**
   ```bash
   # Use nvm or install from nodejs.org
   node --version  # Should be 18+
   ```

2. **Solana wallet** (for testing)
   ```bash
   # Optional: Generate test wallet
   solana-keygen new --outfile ~/.config/solana/test-wallet.json
   ```

That's it! No Rust, no Anchor, no smart contract deployment needed.

---

## Run Locally

```bash
cd agentdex/api
npm install
npm start
```

API runs on http://localhost:3001

**Test it:**
```bash
curl http://localhost:3001/api/health
```

---

## Deploy (Choose One)

### Option 1: Vercel (Recommended — Free)

```bash
cd agentdex/api
npm install -g vercel
vercel
```

Follow prompts. Free tier is perfect for this.

### Option 2: Railway

```bash
cd agentdex/api
railway init
railway up
```

### Option 3: Render

1. Connect GitHub repo
2. Set build command: `npm install`
3. Set start command: `node index.js`
4. Deploy

---

## Environment Variables

Set these in your hosting platform:

```bash
FEE_BPS=10                    # Fee in basis points (10 = 0.1%)
FEE_WALLET=your_wallet_addr   # Where to collect fees (optional)
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com  # Or devnet
```

---

## Use Python SDK

```bash
pip install requests solana

# Example
python3 -c "
from agentdex import AgentDEX
dex = AgentDEX(wallet_path='~/.config/solana/id.json', api_url='https://your-api.vercel.app')
quote = dex.quote('So11111111111111111111111111111111111111112', 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', 1000000000)
print(f\"Quote: {quote['output_amount']} USDC\")
"
```

---

## How It Works

1. **Agent calls your API** → `/api/swap`
2. **Your API calls Jupiter** → Gets best route across all DEXes
3. **Add fee** → Subtract 0.1–0.5% from output
4. **Build transaction** → Jupiter builds the swap tx
5. **Sign & send** → Agent's wallet signs, transaction executes
6. **You earn fee** → Small percentage of each swap

**No liquidity needed. No smart contracts. Just routing + fee.**

---

## Next Steps

1. Deploy to Vercel/Railway (5 minutes)
2. Test with devnet swaps
3. Set fee wallet to collect revenue
4. Market to agents on Moltbook
5. Scale as volume grows

**Total cost to launch: $0–5/month. Revenue potential: $30–3000+/month.**
