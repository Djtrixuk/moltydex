# Jupiter Ultra API Migration: Live Swaps Are Here

**Published:** February 11, 2026
**Author:** MoltyDEX Team
**Category:** Engineering

---

## Overview

We are thrilled to announce that MoltyDEX has completed a full migration to the **Jupiter Ultra API** and live token swaps are now working end-to-end on [moltydex.com](https://www.moltydex.com). This is a major milestone: real users can now connect a Solana wallet, enter an amount, and execute swaps directly through our interface, powered by Jupiter's latest and most efficient swap infrastructure.

This post covers everything that changed, why we migrated, and the series of production fixes that followed.

---

## Why Jupiter Ultra?

Jupiter's **Ultra API** is a next-generation, RPC-less swap API for Solana. Unlike the legacy Jupiter v6 API (which required multiple RPC calls for quoting and transaction building), Ultra consolidates the entire flow into two simple endpoints:

- **`/order`** - Get a quote and a ready-to-sign transaction in a single call
- **`/execute`** - Submit the signed transaction for execution

This means:

- **Fewer network round-trips** - One call instead of three or four
- **No RPC dependency** - The API handles all Solana RPC interactions server-side
- **Better prices** - Ultra uses Jupiter's latest routing engine with improved liquidity aggregation
- **Simpler integration** - Less code, fewer failure points

---

## What We Built

### Backend: New Ultra Proxy Routes

We created a new set of API routes at `/api/ultra/*` that proxy requests to Jupiter's Ultra API with our API key:

- **`/api/ultra/order`** - Fetches swap quotes with ready-to-sign transactions
- **`/api/ultra/execute`** - Submits signed transactions for on-chain execution
- **`/api/ultra/holdings`** - Retrieves wallet token balances (replaces legacy RPC balance fetching)
- **`/api/ultra/search`** - Token search with metadata
- **`/api/ultra/shield`** - Token safety and risk information

Each route includes parameter validation, error handling, and timeout management.

### Frontend: Service Layer and Swap Flow

The frontend was updated with:

- **New TypeScript interfaces** for Ultra API responses
- **New API functions** for ordering, executing, holdings, and search
- **Refactored swap flow** - The swap interface now tries Ultra first for quotes and execution, falling back to the legacy API if Ultra is unavailable
- **Base64 transaction handling** - Ultra returns transactions as base64-encoded strings that are decoded client-side for wallet signing

### Robust Fallback Architecture

Every Ultra API call has a graceful fallback to the legacy Jupiter v6 API. If Ultra is down or returns an error, the swap interface seamlessly falls back without the user noticing. This ensures the app never breaks, even during API outages.

---

## Production Fixes After Launch

Getting swaps working was just the beginning. Once live, we identified and fixed several production issues:

### 1. Token Selector Dropdown Positioning

**Problem:** The token selector dropdowns were opening upward and going off the top of the screen, making them unusable on smaller viewports.

**Fix:** Changed the dropdown positioning from `bottom-full` to `top-full` so they open downward, and added viewport-aware max-height to prevent overflow.

### 2. Dropdown Z-Index Layering

**Problem:** The token selector dropdowns were rendering behind other page sections (the x402 Payment Handler box and FAQ section).

**Fix:** Established proper CSS stacking contexts by adding `z-10` to the swap interface section and `z-0` to subsequent sections, ensuring dropdowns always layer on top.

### 3. Wallet Connection Modal Fix

**Problem:** On the live site, clicking "Connect Wallet" greyed out the entire page, but the wallet options were unclickable. The overlay was intercepting all clicks.

**Fix:** Our custom CSS was applying `z-index: 9999 !important` to all wallet adapter modal elements, which flattened the internal stacking context. We fixed this by only setting `z-index: 10000 !important` on the root `.wallet-adapter-modal` element, allowing the internal elements to maintain their natural layering.

### 4. Number Formatting with Comma Separators

**Problem:** Large token balances like `8081632.755627` were displayed as raw numbers, making them hard to read at a glance.

**Fix:** Introduced two new utility functions:

- **`formatDisplayNumber()`** adds thousand-separator commas for display (e.g., `8,081,632.755627`)
- **`safeParseFloat()`** strips commas before parsing to prevent calculation errors

These are now used across the swap interface and token selector for all balance displays, input fields, and error messages.

---

## Technical Summary

| Change | Files Modified |
|--------|---------------|
| Ultra API backend routes | `api/routes/ultra.js`, `api/index.js` |
| Frontend service layer | `frontend/services/api.ts` |
| Swap flow refactor | `frontend/components/EnhancedSwapInterface.tsx` |
| Dropdown positioning | `frontend/components/TokenSelector.tsx` |
| Z-index layering | `frontend/pages/index.tsx` |
| Wallet modal fix | `frontend/styles/globals.css` |
| Number formatting | `frontend/utils/tokens.ts` |

---

## What Is Next

With live swaps working and the Ultra API fully integrated, we are focused on:

- **Swap history persistence** - Saving completed swaps for easy reference
- **Price impact warnings** - Visual alerts for high-impact trades
- **Multi-wallet support** - Testing with more Solana wallet providers
- **Performance monitoring** - Tracking Ultra API latency and success rates in production

---

## Try It Now

Head to [moltydex.com](https://www.moltydex.com), connect your Solana wallet, and try a swap. The interface is faster, more reliable, and easier to read than ever.

We would love your feedback. Find us on [Moltbook](https://www.moltbook.com) or open an issue on GitHub.

---

*MoltyDEX is a Solana DEX aggregator with automatic x402 payment handling for AI agents. Powered by Jupiter Ultra.*
