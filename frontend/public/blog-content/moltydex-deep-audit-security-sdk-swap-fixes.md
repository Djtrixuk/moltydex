# MoltyDEX Deep Audit: 30+ Fixes Across Security, SDK, and Swap Flow

**Published:** February 12, 2026
**Author:** MoltyDEX Team
**Category:** Engineering

---

## Overview

After our [initial production hardening sprint](/blog/moltydex-progress-update-february-2026) (RPC configuration, Redis swap tracking, Joi validation, and a 63-test agent suite), we ran a comprehensive line-by-line audit of the entire MoltyDEX platform: the Express.js API, the Next.js frontend, the TypeScript x402 auto-pay agent, and both Python SDKs.

The audit uncovered **96 issues** across 4 severity levels — 15 critical, 25 high, 30 medium, and 26 low. Every critical and high issue has been resolved. Here is the full breakdown of what we shipped.

---

## Sprint 1: Security Hardening

The first sprint focused on locking down the API and frontend against real-world attack vectors.

### API Security

- **Helmet + CSP** — Enabled Helmet middleware with a tightened Content Security Policy. Script sources restricted to self, Google Analytics, and Alchemy domains only.
- **CORS Restriction** — Replaced wildcard `*` CORS with an explicit allowlist of production origins. Non-allowed origins no longer receive CORS headers.
- **Trust Proxy** — Fixed `trust proxy` configuration so rate limiting uses the real client IP behind Vercel's proxy, not the proxy's IP.
- **Body Size Limits** — Added `express.json({ limit: '1mb' })` to prevent oversized request payloads from consuming memory.
- **Global Error Handler** — Added centralized error handling middleware so unhandled exceptions return a clean 500 instead of leaking stack traces.
- **Analytics Lockdown** — Secured the `/analytics/track` endpoint with API key authentication and restricted the `/analytics/debug` endpoint in production.
- **SSRF Protection** — Added URL validation on webhook callback registration to block requests to localhost, private IPs, and internal networks.
- **Validation Hardening** — Fixed the Joi validation middleware to return a 500 `MISSING_SCHEMA` error when a schema name is not found, instead of silently passing the request through unvalidated.

### Agent Security

- **HTTPInterceptor Fix** — Fixed a critical bug where `result.payment_proof` was referenced before the `result` variable was assigned, causing the x402 payment retry to crash.
- **Max Payment Guard** — Added a configurable `maxPaymentAmount` to the agent config. Payments exceeding this threshold are rejected before any transaction is built.
- **BigInt Safety** — Added a `MAX_SOL_LAMPORTS` check in `WalletManager` to prevent silent precision loss when converting `BigInt` to `Number` for SOL transfers above 100 SOL.

### Frontend Security

- **RPC Key Protection** — Moved the Alchemy RPC API key from the frontend `NEXT_PUBLIC_` env var to a server-side-only variable. Created a new `/api/rpc` proxy route that whitelists read-only Solana RPC methods and keeps the key server-side.
- **XSS Mitigation** — Replaced `dangerouslySetInnerHTML` for Google Analytics with `next/script` components. The GA measurement ID is now sanitized against injection.
- **CSP Tightening** — Updated `next.config.js` security headers with specific domain allowlists for scripts, styles, and connections.

---

## Sprint 2: Agent Reliability

### TypeScript Agent

- **Retry Logic** — Implemented exponential backoff with jitter in `MoltyDEXClient`. Retries on 408, 429, 500, 502, 503, 504 status codes. Non-retryable 4xx errors fail immediately. `sendTransaction` is excluded from retry to prevent double-sends.
- **Config Wiring** — The `maxRetries` and `retryDelay` fields in `AgentConfig` were declared but never passed to the client. Now `X402AutoPayAgent` passes them through to `MoltyDEXClient` at construction time.
- **Duplicate Retry Removal** — Removed the double-retry logic in `HTTPInterceptor` that was causing the original request to be retried twice after a successful 402 payment.

### Python SDK

- **VersionedTransaction Support** — Added `solders.transaction.VersionedTransaction` import with graceful fallback for environments without `solders >= 0.18`.
- **Error Response Standardization** — Aligned all API error responses to use a consistent `error_code` field instead of mixing `code` and `error_code`.

### SEO & Data Integrity

- **Fabricated Ratings Removed** — Removed `AggregateRatingStructuredData` components that were outputting fake "5/5 stars, 100 reviews" JSON-LD. This was a Google penalty risk.
- **Fee Consistency** — Changed `DEFAULTS.FEE_BPS` from 10 (0.1%) to 0 to match the actual zero-fee policy. Updated all metadata and structured data to reflect zero fees.

---

## Sprint 3: Frontend Security & Stability

- **Error Boundary** — Created a React `ErrorBoundary` component that catches render errors and displays a branded fallback UI with a retry button.
- **Google Analytics Sanitization** — GA injection now uses `next/script` strategy="afterInteractive" with a sanitized measurement ID.
- **Canonical URL Standardization** — Standardized all page canonical URLs from `https://www.moltydex.com` to `https://moltydex.com` (removed www prefix) across 10+ pages.
- **Custom Error Pages** — Added branded 404 (Not Found) and 500 (Server Error) pages with navigation back to the homepage.

---

## Infrastructure & Developer Experience

- **Legacy Route Cleanup** — Removed an inline `/api/tokens` route from `api/index.js` and moved it into the `recommendations.js` router as a proper handler.
- **Serverless Compatibility** — Removed `setInterval` timers from cache and webhook cleanup that are incompatible with Vercel's serverless functions. Lazy eviction (on-access expiration, LRU on write) handles cleanup instead.
- **Transaction Size Validation** — Added a check on the swap endpoint that validates the serialized transaction size against Solana's 1232-byte limit before returning it to the client. Returns a 422 `TRANSACTION_TOO_LARGE` error with suggestions.
- **API Client Expansion** — Extended the TypeScript `MoltyDEXClient` with 14 new methods: `batchBalances`, `batchQuotes`, `getTokenMetadata`, `searchTokens`, `preparePayment`, `simulatePayment`, `getUltraOrder`, `executeUltraSwap`, `getWalletTokens`, `getSwapHistory`, `getPoints`, `getLeaderboard`, `health`, and more.
- **RPC Connection Singleton** — Implemented a `getConnection()` factory in `api/utils/rpc.js` that reuses a single `Connection` instance per RPC URL, reducing connection overhead.
- **Project Files** — Added `.nvmrc` (Node.js v20), MIT `LICENSE`, and comprehensive `.env.example` files for both the API and frontend with full documentation of every environment variable.
- **Sitemap Updates** — Added entries for the `/x402-payments` and `/changelog` pages.
- **Dependency Cleanup** — Removed unused npm packages: `@sentry/node`, `winston`, `@jup-ag/api`.

---

## Production Polish

- **Debug Log Removal (API)** — Stripped 7 `console.log` statements from `balance.js` that were logging full wallet addresses and token account details for USDC and JUP lookups in production.
- **Debug Log Removal (Frontend)** — Replaced 21 `console.log` calls in `EnhancedSwapInterface.tsx` with a `debugLog` helper that only outputs in development mode. Zero debug output in production builds.
- **Transaction Polling Fix** — Fixed `poll_transaction_status` in both Python SDKs (`moltydex/client.py` and `agentdex.py`) to track the last error and return a structured `{ status: 'timeout', error: '...' }` response on timeout, instead of silently swallowing all exceptions.
- **Config Wiring** — Connected the `maxRetries` and `retryDelay` fields from `AgentConfig` through to `MoltyDEXClient`, which was previously ignoring them and using hardcoded defaults.

---

## Critical Bug Fixes

These are the bugs that would have caused real transactions to fail in production.

### Python SDK: VersionedTransaction Signing Was Completely Broken

The Python SDK's `swap()` method had **three critical bugs** that made it impossible to execute any versioned transaction (which is what Jupiter returns by default):

1. **`VersionedTransaction.sign()` does not exist** — The `solders` library's `VersionedTransaction` class has no `.sign()` method. Calling it raised `AttributeError`. The fix: extract the message from the unsigned transaction and pass the keypair to the constructor: `VersionedTransaction(unsigned_tx.message, [solders_keypair])`.

2. **Wrong Keypair type** — The constructor expects a `solders.keypair.Keypair`, not the `solana.keypair.Keypair` wrapper from solana-py. We now import `SoldersKeypair` separately and build it from the same secret key bytes during `__init__`.

3. **Wrong send method** — `rpc_client.send_transaction()` doesn't accept `VersionedTransaction` objects. Fixed by using `send_raw_transaction(bytes(transaction))` for versioned transactions.

Additional fixes:
- **Wallet path tilde expansion** — `open("~/.config/solana/id.json")` fails because Python doesn't expand `~`. Added `os.path.expanduser()`.
- **Signature type coercion** — `send_transaction().value` returns a `Signature` object, not a string. Added `str(sig)` conversion.
- **Explicit dependency** — Added `solders>=0.18.0` to `pyproject.toml` instead of relying on it as a transitive dependency.

### API: Jupiter Error Handler Was Crashing

In `api/utils/jupiter.js`, the `quotePath` variable was declared inside the `try` block but referenced in the `catch` block. Since `const` is block-scoped, every Jupiter API error (timeout, 5xx, rate limit) would throw a `ReferenceError` instead of falling through to the next endpoint. Moved the declaration before the `try` block.

### API: Slippage Minimum Output Was Always Zero

The BigInt slippage calculation in `quote.js` was:

```
const slippageMultiplier = (10000n - BigInt(slippageBps)) / 10000n;  // = 0n!
const minimumOutput = outputAfterFee * slippageMultiplier;            // = 0n!
```

BigInt integer division truncates: `9950n / 10000n = 0n`. Fixed by combining into a single expression that multiplies before dividing: `(outputAfterFee * (10000n - BigInt(slippageBps))) / 10000n`.

### Frontend: Exchange Rate Display Was Nonsensical

The exchange rate was calculated as `formatAmount(parseFloat(lamports) / parseFloat(humanAmount), decimals)`. Since `formatAmount` divides by `10^decimals` internally, the rate was being divided by decimals twice — showing values like `0.000000043` instead of `43.21`. Fixed to compute the rate as a plain float: `(lamports / 10^decimals) / humanAmount`.

---

## Verification

All changes were verified:

- TypeScript compiles clean (agent + frontend) with zero errors
- All 63 agent tests pass (WalletManager, MoltyDEXClient, HTTPInterceptor, X402AutoPayAgent)
- API syntax checks pass across all modified files
- Zero lint errors
- Python SDK files pass AST syntax validation

---

## What's Next

The platform is in significantly better shape for production. The remaining items on the audit backlog are:

- **Next.js upgrade** (14.0.0 to 15.x) — Major version upgrade, planned as a dedicated effort
- **EnhancedSwapInterface refactor** — The 2,384-line component works but should be broken into smaller pieces
- **Frontend test suite** — Unit and integration tests for the swap interface
- **ESLint/Prettier configuration** — Consistent code formatting enforcement

These are quality-of-life improvements that don't affect swap functionality. The critical path — getting a quote, building a transaction, signing, and sending — is now solid.

---

*Full changelog available at [moltydex.com/changelog](/changelog). Follow us on [Moltbook](https://www.moltbook.com/u/MoltyDEX) for real-time updates.*
