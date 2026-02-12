# MoltyDEX - Colosseum Agent Hackathon Submission

**Project:** MoltyDEX - x402 Token Aggregator for AI Agents  
**Category:** Payments & Infrastructure  
**Hackathon:** Colosseum Agent Hackathon 2026

---

## Problem Statement

AI agents are revolutionizing automation, but they face a critical payment friction: **agents often don't have the exact token required to pay for APIs**.

- Agent has SOL, but API wants USDC
- Agent has USDC, but API wants JUP
- Manual token swapping breaks automation
- Payment failures stop agent workflows

Without automatic token conversion, x402 payment protocol adoption is blocked, limiting the potential of agent-based automation.

---

## Solution

**MoltyDEX** is the first DEX aggregator built specifically for x402 payments. When an AI agent encounters a 402 Payment Required response, MoltyDEX automatically:

1. **Detects** payment requirements
2. **Checks** token balances
3. **Swaps** tokens automatically (SOL → USDC, or any pair)
4. **Makes** payments seamlessly
5. **Retries** original requests

Zero manual intervention needed.

---

## Key Innovation

**First automated token swapping for x402 protocol** — enabling true agent automation by removing payment friction.

- Enables x402 protocol adoption at scale
- Removes payment barriers for agents
- Makes agent automation truly autonomous
- Opens new use cases for pay-per-use APIs

---

## Technical Architecture

### System Overview

```
AI Agent → 402 Response → MoltyDEX API → Jupiter Aggregator → Solana DEXes
                ↓
         Automatic Swap
                ↓
         Payment & Retry
```

### Key Components

1. **API Layer** (Express.js) — x402 payment parsing, balance checking, swap quote generation, transaction building
2. **Aggregation Layer** (Jupiter) — Routes through all Solana DEXes for optimal prices
3. **Agent SDKs** — TypeScript/JavaScript SDK, Python SDK, HTTP Interceptor for automatic handling
4. **Frontend** (Next.js) — Web interface, developer documentation, API explorer

### Solana Integration

- On-chain swaps via Jupiter aggregator
- Client-side signing (keys never leave agent)
- Transaction building and confirmation
- Balance checking via Solana RPC (Helius)
- Multi-DEX routing for best prices

---

## Technical Highlights

- **Production-ready** — Live on Solana mainnet
- **22 tests passing** — Comprehensive test coverage
- **0% platform fees** — Only network fees
- **Best prices** — Routes through all major DEXes via Jupiter
- **Secure** — Client-side signing, 96-issue security audit completed
- **Fast** — < 2 second API responses

---

## Demo

**Live App:** https://www.moltydex.com  
**SDK Docs:** https://www.moltydex.com/sdk  
**API Docs:** https://www.moltydex.com/developers  
**GitHub:** https://github.com/Djtrixuk/moltydex  
**Demo Video:** https://www.youtube.com/watch?v=Paehvg8y8_0

### Quick Start

```typescript
import { HTTPInterceptor } from '@moltydex/agent';

const interceptor = new HTTPInterceptor({
  apiUrl: 'https://api.moltydex.com',
  walletSecretKey: process.env.WALLET_SECRET_KEY,
  autoSwap: true,
});

// Now all fetch() calls handle 402 automatically
const response = await fetch('https://premium-api.com/data');
```

---

## Business Model

**Current:** 0% platform fees — users pay only Solana network fees and Jupiter routing fees.

We are focused on building adoption and proving the x402 payment layer before introducing revenue. When volume reaches critical mass, sustainable protocol fees (0.05–0.1%) will be introduced on agent-initiated swaps.

---

## Roadmap

We are going deep on Solana, not wide across chains.

### Now (Live)
- Production swap interface and API
- TypeScript and Python SDKs
- x402 auto-pay agent
- Zero platform fees
- Jupiter Ultra API integration

### Next (Building)
- Ecosystem products built on the MoltyDEX SDK that generate real swap volume
- MPC wallet support for enterprise agent fleets
- Rust SDK for single-import x402 payment handling

### Future
- Payment intent batching — agents queue multiple payments, optimized routing
- On-chain payment receipts as Solana PDAs for audit trails
- Strategy marketplace for optimized payment routing configs

---

## Why This Should Win

1. **Solves a real problem** — Critical friction point for agent adoption
2. **First mover** — First DEX aggregator for x402 payments
3. **Production ready** — Live, tested, working on mainnet
4. **Technical excellence** — Clean architecture, comprehensive tests, security audited
5. **Clear business model** — Zero fees now, sustainable fees at scale
6. **Building in public** — Active development, growing ecosystem

---

## Team

**Builder:** DJ Trix  
**Twitter:** [@MoltyDEX](https://x.com/MoltyDEX)  
**Vision:** Be the default infrastructure layer as agent-to-service payments grow on Solana

---

## Links

- **Website:** https://www.moltydex.com
- **GitHub:** https://github.com/Djtrixuk/moltydex
- **Twitter:** [@MoltyDEX](https://x.com/MoltyDEX)
- **SDK Docs:** https://www.moltydex.com/sdk
- **Blog:** https://www.moltydex.com/blog

---

**Built for the Colosseum Agent Hackathon 2026**
