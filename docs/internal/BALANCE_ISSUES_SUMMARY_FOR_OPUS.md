# Balance Fetching Issues - Quick Summary for Opus

## TL;DR

Balance API works correctly, but frontend doesn't consistently display balances for non-SOL tokens. BONK always fails, USDC works sometimes. Need to understand why API response isn't reaching the UI.

---

## The Problem

**Symptoms:**
- ✅ SOL balances: Always work
- ⚠️ USDC balances: Work sometimes
- ❌ BONK balances: Always fail ("Error loading balance")

**Evidence:**
- Direct API test: ✅ Returns correct balance
- Frontend display: ❌ Doesn't show balance
- Console logs: Show API calls, but balance not displayed

---

## What We're Trying To Do

Display token balances in swap interface so users can:
1. See available balance
2. Use MAX button
3. Validate swap amounts

---

## Current Flow

1. **Frontend Hook** (`useTokenBalance.ts`)
   - Calls API: `/api/balance?wallet_address={addr}&token_mint={mint}`
   - Formats balance using decimals
   - Updates React state

2. **API Endpoint** (`/api/balance`)
   - Fetches from Solana RPC
   - Returns: `{ balance, decimals, has_balance }`

3. **Display** (`EnhancedSwapInterface.tsx`)
   - Shows balance or "Error loading balance"

---

## What We've Tried

1. ✅ Added debugging/logging
2. ✅ Added cache busting
3. ✅ Improved error handling
4. ✅ Reset balance on token change
5. ❌ Still inconsistent

---

## Key Questions

1. **Why does API work but frontend doesn't display?**
   - API returns correct data
   - Hook receives data (logs show)
   - But UI doesn't update

2. **Why do some tokens work but others don't?**
   - SOL: Always works
   - USDC: Sometimes works
   - BONK: Never works

3. **Is it a React state issue?**
   - Race condition?
   - State update timing?
   - Cancellation issue?

4. **Is it a network/RPC issue?**
   - Rate limiting?
   - Timeouts?
   - CORS?

---

## Code Locations

- `frontend/hooks/useTokenBalance.ts` - Balance hook
- `frontend/services/api.ts` - API calls
- `api/routes/balance.js` - Balance endpoint
- `api/utils/balance.js` - Balance utilities

---

## Test Results

**API Test (USDC):**
```bash
curl "https://api.moltydex.com/api/balance?wallet_address=...&token_mint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
# Returns: { "balance": "34129969", "decimals": 6, "has_balance": true } ✅
```

**Frontend:**
- Shows "Error loading balance" for BONK ❌
- Sometimes shows USDC balance, sometimes doesn't ⚠️

---

## What We Need

**Opus, please help:**
1. Identify root cause of inconsistent balance display
2. Determine if it's frontend, backend, or network issue
3. Suggest best fix approach
4. Recommend improvements

**Goal:** Reliable balance display for all tokens

---

**Full Details**: See `BALANCE_FETCHING_ISSUES_FOR_OPUS.md`
