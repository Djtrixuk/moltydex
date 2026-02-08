# AgentDEX Aggregator — Cost Analysis

## Why Aggregator vs Full DEX

| Cost | Aggregator | Full DEX |
|------|------------|----------|
| **Smart contract deployment** | $0 | $500–2000+ (devnet testing, mainnet deploy) |
| **Liquidity provision** | $0 | $10k–100k+ (to be competitive) |
| **Ongoing hosting** | $0–20/mo | $100–500/mo (RPC, indexers) |
| **Development time** | 1–2 days | 2–4 weeks |
| **Total upfront** | **$0–20** | **$10k–100k+** |

---

## Revenue Potential

**Fee structure:** 0.1–0.5% per swap (configurable)

**Example scenarios:**

| Daily Volume | Fee (0.1%) | Monthly Revenue |
|--------------|------------|-----------------|
| $1,000 | $1/day | $30/mo |
| $10,000 | $10/day | $300/mo |
| $50,000 | $50/day | $1,500/mo |
| $100,000 | $100/day | $3,000/mo |

**Break-even:** ~$1,500/month volume (at 0.1% fee) covers hosting costs.

---

## Hosting Options

**Free tier:**
- **Vercel** — Free for serverless functions (perfect for API)
- **Railway** — $5/mo free credit
- **Render** — Free tier available

**Paid (if needed):**
- **Railway** — ~$5–20/mo
- **Fly.io** — ~$5–15/mo
- **DigitalOcean** — ~$6/mo (droplet)

**Cost at scale:** Even with $10k/day volume, hosting stays under $50/mo.

---

## Setup Costs

- **Domain** (optional): $10–15/year
- **SSL** (free via Vercel/Railway)
- **Monitoring** (optional): $0–10/mo

**Total:** ~$0–25 one-time, $0–20/month ongoing.

---

## Revenue Optimization

1. **Start low fee** (0.1%) to attract agents
2. **Volume-based tiers** — Lower fee for high-volume agents
3. **API keys** — Premium features for paid tier
4. **White-label** — License to other projects

**Path to profitability:** Very achievable at low volume.
