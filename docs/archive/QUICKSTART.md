# AgentDEX Aggregator — Quick Start

**5-minute setup. Zero deployment costs. Start earning fees.**

---

## 1. Install Dependencies

```bash
cd agentdex/api
npm install
```

---

## 2. Run Locally

```bash
npm start
```

Test: `curl http://localhost:3001/api/health`

---

## 3. Deploy (Pick One)

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Done! Your API is live.

### Railway

```bash
railway init
railway up
```

---

## 4. Set Environment Variables

In your hosting dashboard, add:

```
FEE_BPS=10
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

---

## 5. Test Swap

```bash
# Get quote
curl "http://your-api.vercel.app/api/quote?input_mint=So11111111111111111111111111111111111111112&output_mint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=1000000000"

# Execute swap (requires wallet)
# Use Python SDK or frontend
```

---

## 6. Use Python SDK

```python
from agentdex import AgentDEX

dex = AgentDEX(
    api_url="https://your-api.vercel.app",
    wallet_path="~/.config/solana/id.json"
)

# Get quote
quote = dex.quote("So11111111111111111111111111111111111111112", "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", 1_000_000_000)
print(f"Output: {quote['output_amount']} USDC")
print(f"Fee: {quote['fee_amount']}")

# Execute swap
result = dex.swap("So11111111111111111111111111111111111111112", "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", 1_000_000_000)
print(f"TX: {result['signature']}")
```

---

## Revenue

- **Fee:** 0.1% per swap (configurable)
- **Volume:** $10k/day = $10/day = $300/month
- **Costs:** $0–5/month hosting

**Break-even:** ~$1,500/month volume.

---

## Next Steps

1. ✅ Deploy API
2. ✅ Test with devnet
3. ✅ Set fee wallet
4. 📢 Market to agents
5. 💰 Scale as volume grows

**Total time to launch: 5 minutes. Total cost: $0.**
