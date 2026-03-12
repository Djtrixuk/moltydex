# Parasol: AI Trading Agents for Solana — Explainer and Links

**Parasol** ([parasol.so](https://parasol.so)) is an AI trading engine for Solana memecoins. It is the first product built on top of the MoltyDEX ecosystem: autonomous agents that scan, filter, score, and execute trades so you don’t have to. This post explains what Parasol is, how it works, where it fits with MoltyDEX, and where to find everything on the site.

---

## What Is Parasol?

Parasol is a **trading engine** and **agent platform** for Solana. It gives you:

- **AI trading agents** — Named agents (Yuki, Ricky, Claudia, James, Dex, Luna, Victor, Sienna) with distinct strategies: momentum, scalping, diamond hands, quality filters, fresh tokens, post-migration, and a meta-learner that watches the others.
- **Paper and live trading** — Paper mode runs the full pipeline with zero risk; live mode uses non-custodial Turnkey MPC wallets so your keys never leave your control.
- **Manipulation protection** — A 6-layer filter targets holder concentration, sniping, wash trading, liquidity traps, and other patterns. The team cites research that a large majority of high-return memecoins show signs of manipulation; Parasol is built to avoid the worst of that.
- **Pump.fun and beyond** — Agents trade bonding-curve and graduated pump.fun tokens and can pull from multiple data sources (e.g. DexScreener, CoinGecko) for broader coverage.

You don’t place every trade yourself. You choose risk profiles and agents; Parasol runs the pipeline: **scan → filter → score → execute → protect**.

---

## How It Fits With MoltyDEX

MoltyDEX is the **swap and payment layer** for Solana: x402 auto-pay for AI agents, Jupiter-powered swaps, zero platform fees, and SDKs for developers. Parasol is a **product built on that layer**.

- **Shared infrastructure** — When Parasol agents execute live trades, they use the same swap and execution infrastructure that MoltyDEX provides. Manual swaps on Parasol’s ParasolDEX interface route through Jupiter, same as MoltyDEX.
- **Ecosystem expansion** — Parasol is the first major product in the MoltyDEX ecosystem. It proves that real trading volume and real users can run on top of MoltyDEX’s infrastructure.
- **Different focus** — MoltyDEX is for developers and agents that need automatic token swapping and x402 payments. Parasol is for traders and users who want autonomous AI agents handling memecoin trading.

So: **MoltyDEX = the plumbing. Parasol = a full product that uses that plumbing.**

---

## Security and Wallets

Parasol uses **Turnkey** for live trading: institutional-grade MPC (multi-party computation) wallets. No single party holds your full private key; Parasol never sees or stores it. You can export your wallet from the [profile page](https://parasol.so) at any time.

Important points from Parasol’s own [Security & Safety](https://parasol.so/blog/security-and-safety) post:

- Your wallet is **non-custodial** — Parasol cannot move funds without a trade instruction.
- Agents run **in your browser** — When the tab is closed, trading stops but open positions remain. Don’t leave live trading unattended; treat it as early beta.
- **Best practices** — Keep the tab open while agents trade, start with paper trading, use small amounts (e.g. 0.5–2 SOL) when going live, and monitor the agent log.

For the full picture, read **[Security & Safety: How Parasol Protects Your Funds](https://parasol.so/blog/security-and-safety)** on the Parasol blog.

---

## Fees and Costs

Parasol charges **0% platform fee** on trades. You pay:

- **Solana network fees** — Base fee per transaction (e.g. ~0.000005 SOL).
- **Priority fees** — Optional tiers (normal, fast, turbo) so your transactions land when the chain is busy. Turbo uses higher fees and Jito bundles for MEV protection.
- **Jupiter / DEX fees** — When swapping (e.g. manual ParasolDEX swaps), you pay Jupiter’s fee (e.g. 0.02%–0.50% depending on pair). Parasol does not add a platform fee on top.
- **1% loyalty buyback** — On live agent trades, 1% of the trade’s SOL value is used to buy back that agent’s token (e.g. $YUKI, $RICKY). That goes to the agent token, not to Parasol.

Paper trading is **free** — no wallet, no deposit, no fees.

For the full breakdown, read **[Parasol Fees Explained: What You Actually Pay](https://parasol.so/blog/parasol-fees-explained)** on the Parasol blog.

---

## Where to Go on parasol.so

| What you want | Link |
|---------------|------|
| **Homepage and main app** | [parasol.so](https://parasol.so) |
| **Blog (security, fees, updates)** | [parasol.so/blog](https://parasol.so/blog) |
| **Security & Safety** | [parasol.so/blog/security-and-safety](https://parasol.so/blog/security-and-safety) |
| **Parasol Fees Explained** | [parasol.so/blog/parasol-fees-explained](https://parasol.so/blog/parasol-fees-explained) |
| **Product updates (late Feb – Mar 2026)** | [parasol.so/blog/product-updates-late-february-2026](https://parasol.so/blog/product-updates-late-february-2026), [March 1](https://parasol.so/blog/product-updates-march-1-2026), [March 2](https://parasol.so/blog/product-updates-march-2-2026), [March 3](https://parasol.so/blog/product-updates-march-3-2026), [March 4](https://parasol.so/blog/product-updates-march-4-2026), [March 4 evening](https://parasol.so/blog/product-updates-march-4-evening-2026) |
| **How Parasol detects manipulation** | [parasol.so/blog](https://parasol.so/blog) (search for “manipulation”) |
| **Tools and access** | [parasol.so](https://parasol.so) (nav: Tools, Get access) |

Parasol’s blog is the best place for deep dives on safety, fees, strategies, and product updates.

---

## Paper vs Live Trading

- **Paper trading** — Simulates the full pipeline (scan, filter, score, execute) with no real money. Free, no wallet required. Use it to see how agents behave before going live.
- **Live trading** — Real SOL, real tokens. Requires a Parasol (Turnkey) wallet, and you should only use amounts you can afford to lose. Early beta: bugs and losses are possible; don’t leave it unattended.

Start with paper. When you’re comfortable, connect a wallet and go live with small size.

---

## Why It Matters for MoltyDEX

Parasol is proof that the MoltyDEX stack can support a full, user-facing product:

1. **Real volume** — Every Parasol live trade that goes through the swap layer is real volume on MoltyDEX’s infrastructure.
2. **Real users** — Traders using Parasol are users of the same swap and execution layer that MoltyDEX offers to developers and agents.
3. **Ecosystem story** — One platform (MoltyDEX) for agents and developers; another (Parasol) for autonomous memecoin trading. Same foundation, different use case.

If you’re building an agent or integrating x402 payments, you use [MoltyDEX](https://moltydex.com) and the [developer docs](https://moltydex.com/developers). If you want AI agents to trade Solana memecoins for you, you use [Parasol](https://parasol.so).

---

## Summary

| Topic | Takeaway |
|-------|----------|
| **What is Parasol?** | AI trading engine for Solana memecoins; autonomous agents that scan, filter, score, and execute. |
| **Relation to MoltyDEX** | First major product on top of MoltyDEX; uses the same swap/infrastructure layer. |
| **Security** | Non-custodial Turnkey MPC wallets; you can export your wallet anytime. [Read Security & Safety.](https://parasol.so/blog/security-and-safety) |
| **Fees** | 0% Parasol platform fee; you pay network, priority, DEX, and 1% agent buyback. [Read Parasol Fees Explained.](https://parasol.so/blog/parasol-fees-explained) |
| **Where to start** | [parasol.so](https://parasol.so) for the app; [parasol.so/blog](https://parasol.so/blog) for explainers and updates. |
| **MoltyDEX** | [moltydex.com](https://moltydex.com) — swap layer, x402, and developer docs. |

For the full experience — agents, paper and live trading, and all the explainers — start at **[parasol.so](https://parasol.so)** and explore the [blog](https://parasol.so/blog) for security, fees, and product updates.
