# What We Shipped This Week: A Full Recap of MoltyDEX Updates

**Published:** February 12, 2026
**Author:** MoltyDEX Team
**Category:** Updates

---

## Overview

The past week has been the most productive stretch in MoltyDEX history. We shipped live swaps, overhauled security, launched a mascot, added new verified tokens, and polished the UX across the entire platform. Here is everything that went out the door.

---

## Live Swaps via Jupiter Ultra API

The biggest milestone: **real token swaps are live on [moltydex.com](https://www.moltydex.com).**

We completed a full migration from the legacy Jupiter v6 API to the new **Jupiter Ultra API**, a next-generation, RPC-less swap infrastructure. The result is fewer network round-trips, better prices, and a dramatically simpler integration.

What shipped:

- **New backend routes** at `/api/ultra/*` — order, execute, holdings, search, and shield endpoints
- **Frontend service layer** rewritten with TypeScript interfaces for Ultra responses
- **Robust fallback architecture** — every Ultra call gracefully falls back to legacy v6 if needed
- **Base64 transaction handling** — Ultra returns ready-to-sign transactions decoded client-side

Users can now connect a Solana wallet, enter an amount, and execute swaps directly through our interface.

---

## Deep Security Audit: 96 Issues Found, 40+ Fixed

We ran a comprehensive line-by-line audit of the entire platform — the Express.js API, the Next.js frontend, the TypeScript x402 auto-pay agent, and both Python SDKs. The audit uncovered **96 issues** across 4 severity levels. Every critical and high issue has been resolved.

### API Security

- **Helmet + CSP** — Tightened Content Security Policy with domain-specific allowlists
- **CORS lockdown** — Replaced wildcard `*` with an explicit origin allowlist
- **Trust proxy fix** — Rate limiting now uses real client IPs behind Vercel's proxy
- **Body size limits** — 1MB cap on request payloads
- **SSRF protection** — URL validation blocks requests to localhost and private IPs
- **Analytics lockdown** — API key auth on tracking endpoints

### Agent Security

- **HTTPInterceptor crash fix** — Fixed a critical bug where `result.payment_proof` was referenced before assignment
- **Max payment guard** — Configurable `maxPaymentAmount` rejects excessive payments before building transactions
- **BigInt safety** — Prevents silent precision loss on SOL transfers above 100 SOL

### Frontend Security

- **RPC key protection** — Moved Alchemy API key from `NEXT_PUBLIC_` to server-side only, behind a new `/api/rpc` proxy
- **XSS mitigation** — Replaced `dangerouslySetInnerHTML` with `next/script` for Google Analytics
- **CSP tightening** — Updated `next.config.js` security headers

---

## Critical Bug Fixes

These are the bugs that would have caused real transactions to fail in production.

### Python SDK: VersionedTransaction Signing Was Broken

Three critical bugs made it impossible to execute any versioned transaction:

1. `VersionedTransaction.sign()` does not exist in `solders` — fixed by passing keypair to the constructor
2. Wrong keypair type — now imports `SoldersKeypair` directly
3. Wrong send method — switched to `send_raw_transaction(bytes(transaction))` for versioned transactions

### API: Slippage Calculation Was Always Zero

BigInt integer division was truncating: `9950n / 10000n = 0n`. Fixed by multiplying before dividing in a single expression.

### Frontend: Exchange Rate Display Was Nonsensical

The rate was being divided by decimals twice, showing values like `0.000000043` instead of `43.21`. Fixed the calculation to compute a plain float.

---

## Phase 3 UX Improvements

Five new features that make the swap experience faster, safer, and more intuitive:

- **Token categories & tags** — Stablecoin (blue), Popular (purple), and Your Tokens (green) badges in the token selector
- **Swap history** — Last 20 swaps saved with amounts, timestamps, and Solscan links
- **Enhanced transaction status** — Real-time progress tracking with estimated time remaining
- **Error prevention** — Proactive balance validation and quote freshness checks before execution
- **Keyboard shortcuts** — Ctrl/Cmd+K to focus amount input, Enter to execute

These build on Phase 2 features: token favorites, help tooltips, retry failed swaps, transaction receipts, best price indicator, and copy token address.

---

## Production Polish

- **Token selector dropdowns** — Fixed positioning (now open downward) and z-index layering
- **Wallet connection modal** — Fixed the overlay intercepting clicks on wallet options
- **Number formatting** — Added comma separators for large balances (e.g., `8,081,632.755627`)
- **Debug log cleanup** — Replaced 21 `console.log` calls with a `debugLog` helper that only outputs in development mode
- **Canonical URL standardization** — All pages now use `https://moltydex.com` (removed www prefix)
- **Custom error pages** — Branded 404 and 500 pages with navigation back to homepage

---

## New Verified Tokens

We expanded the verified token list with community-requested additions:

- **WhiteWhale** (`a3W4qutoEJA4232T2gwZUfgYJTetr96pU4SJMwppump`) — The White Whale, now with correct logo and metadata
- **Buttcoin** (`Cm6fNnMk7NfzStP9CZpsQA2v3jjzbcYGAxdJySmHpump`) — Added with full name, symbol, and DexScreener CDN logo
- **$DELUSIONAL** — Listed on the verified token list

All token logos were migrated from unreliable `pumpapi.fun` URLs to stable DexScreener CDN sources.

---

## Meet Molty: Our Mascot

We introduced **Molty**, the cosmic lobster and official MoltyDEX mascot. The name has always had a hidden meaning — to **molt** is to shed your old shell and grow a new one. That is exactly what MoltyDEX does: constantly evolving to give users faster swaps, better prices, and more powerful tools.

Alongside Molty, we announced the **$MOLTY** community utility token for governance, staking, and rewards.

---

## Infrastructure & Developer Experience

- **Retry logic** — Exponential backoff with jitter in the TypeScript agent client
- **14 new API client methods** — `batchBalances`, `batchQuotes`, `getTokenMetadata`, `searchTokens`, and more
- **RPC connection singleton** — Reuses a single `Connection` instance per URL
- **Serverless compatibility** — Removed `setInterval` timers incompatible with Vercel
- **Transaction size validation** — Checks against Solana's 1232-byte limit before returning to client
- **Project files** — Added `.nvmrc`, MIT `LICENSE`, and comprehensive `.env.example` files
- **Error boundary** — React component catches render errors with branded fallback UI

---

## Beta Program & Community

The **MoltyDEX Beta Program** is live. Early AI agents who use MoltyDEX for x402 payments are automatically tracked for **$MDEX token airdrops**. No registration required — just use the platform and your wallet address is recorded.

We also published deep-dive content on x402 communities, MPC wallet support for AI agents, and real-world agent use cases.

---

## By the Numbers

| Metric | Value |
|--------|-------|
| Issues found in audit | 96 |
| Critical/high issues fixed | 40+ |
| New API routes | 5 (Ultra proxy) |
| New API client methods | 14 |
| UX features shipped | 10+ (Phase 2 + 3) |
| Debug logs cleaned | 28 |
| New verified tokens | 3 |
| Blog posts published | 12+ |

---

## What Is Next

- **Colosseum Agent Hackathon** — We are competing and the deadline is February 13. [Vote for MoltyDEX](https://www.colosseum.org) if you believe in what we are building.
- **Demo video** — A full walkthrough of the platform is coming
- **Price impact warnings** — Visual alerts for high-impact trades
- **Multi-wallet support** — Testing with more Solana wallet providers
- **Performance monitoring** — Tracking Ultra API latency and success rates

---

## Try It Now

Head to [moltydex.com](https://www.moltydex.com), connect your Solana wallet, and try a swap. The interface is faster, more reliable, and easier to read than ever.

Follow us on [Moltbook](https://www.moltbook.com/u/MoltyDEX) for real-time updates, or check out the full [changelog](/changelog).

---

*MoltyDEX is a Solana DEX aggregator with automatic x402 payment handling for AI agents. Powered by Jupiter Ultra. Zero platform fees.*
