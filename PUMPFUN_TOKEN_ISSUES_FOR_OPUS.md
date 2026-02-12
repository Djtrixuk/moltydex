# Pumpfun Token Swap Issues - Summary for Opus

## Overview

MoltyDEX has encountered persistent issues with swapping smaller/newer pumpfun tokens. While major tokens (SOL, USDC, BONK, etc.) work reliably, pumpfun tokens (especially newly launched ones) often fail with "No routes found" errors or other routing failures.

---

## Problem Statement

### Primary Issues

1. **"No routes found" errors** for pumpfun tokens that work fine on Jupiter's UI
2. **Newer tokens not immediately tradeable** - tokens just launched may not be indexed yet
3. **Low liquidity tokens failing** - smaller pumpfun tokens with limited liquidity often fail to route
4. **Transaction size issues** - pumpfun AMM routing requires more accounts (42 accounts), pushing transactions closer to size limits

### User Impact

- Users report swaps work on Jupiter but fail on MoltyDEX
- Specific example: $MOONER token (`DAu24iE5snKMc46QHVa7uHtEtjZ25Np1PcU8gop9pump`) failed with "No routes found" before fixes
- Users frustrated when they can't trade newly launched tokens immediately

---

## Technical Details

### Current Architecture

**Token Discovery:**
- Primary: Jupiter token list (`token.jup.ag/all`)
- Fallback: Metaplex metadata for tokens not in Jupiter's list
- **Removed**: Pump.fun API and SolanaFM API (unreliable - 302 redirects, 502 errors)

**Routing:**
- Uses Jupiter aggregator API (`quote-api.jup.ag/v6` preferred, falls back to `api.jup.ag/swap/v1`)
- Special handling for pumpfun tokens (detected by addresses ending in "pump")

### Special Handling for Pumpfun Tokens

**File**: `api/utils/jupiter.js`

```javascript
// Detect pumpfun tokens
const isPumpFunToken = output_mint.toLowerCase().endsWith('pump') || 
                       input_mint.toLowerCase().endsWith('pump');

// For pumpfun tokens:
// 1. Don't restrict intermediate tokens (allows routing through pump.fun AMM)
if (!isPumpFunToken) {
  query.restrictIntermediateTokens = true; // Only for non-pumpfun tokens
}

// 2. Increase maxAccounts to allow Pump.fun AMM routing (requires 42 accounts)
if (isPumpFunToken) {
  query.maxAccounts = 64; // Pump.fun AMM needs 42 + routing overhead
}
```

### Previous Fixes Applied

**Fix 1: Endpoint Priority** (`CRITICAL_FIX_MOONER_TOKEN.md`)
- Changed to try Jupiter v6 API first (better pump.fun support)
- Before: `['https://api.jup.ag/swap/v1', 'https://quote-api.jup.ag/v6', ...]`
- After: `['https://quote-api.jup.ag/v6', 'https://api.jup.ag/swap/v1', ...]`

**Fix 2: Quote Parameters**
- Removed `asLegacyTransaction` from quote requests (only needed for swap building)
- Improved response format handling for both v6 and v1 endpoints

**Fix 3: Pumpfun Detection**
- Added detection for pumpfun tokens (addresses ending in "pump")
- Special routing parameters for pumpfun tokens (no intermediate token restrictions, higher maxAccounts)

---

## Remaining Issues

### Issue 1: New Token Indexing Delay

**Problem:**
- Very new tokens (just launched) may not be immediately tradeable
- Must wait for Jupiter to index them in their token list
- Users miss early trading opportunities

**Current Workaround:**
- Users can manually add custom token addresses
- Falls back to Metaplex metadata if token not in Jupiter list
- But routing may still fail if Jupiter hasn't indexed the token yet

**Impact:**
- High for users wanting to trade brand new tokens
- Low for x402 payment use case (uses stable tokens)

### Issue 2: Low Liquidity Routing Failures

**Problem:**
- Smaller pumpfun tokens with low liquidity often fail to route
- Jupiter may not find viable routes even if token is indexed
- Error: "No routes found" or "Insufficient liquidity"

**Current Behavior:**
- Returns error to user
- No fallback routing strategy

**Impact:**
- Medium - affects users trading smaller tokens
- Not critical for x402 payments (uses major tokens)

### Issue 3: Transaction Size Constraints

**Problem:**
- Pump.fun AMM routing requires 42 accounts
- Combined with fee collection and other instructions, transactions can approach size limits
- May cause "Transaction too large" errors

**Current Handling:**
- Increased `maxAccounts` to 64 for pumpfun tokens
- But still constrained by Solana's transaction size limits (1232 bytes legacy, 1280 bytes v0)

**Impact:**
- Low-Medium - affects complex swaps with pumpfun tokens
- Mitigated by using Jupiter native fees (reduces transaction size)

### Issue 4: Token Metadata Reliability

**Problem:**
- Removed Pump.fun API and SolanaFM API due to reliability issues (302 redirects, 502 errors)
- Now relies solely on Jupiter token list and Metaplex
- May miss some token metadata for newer tokens

**Current State:**
- Uses Jupiter token list as primary source
- Falls back to Metaplex metadata
- Custom token addresses can be added manually

**Impact:**
- Low - metadata is nice-to-have, routing is the critical part

---

## Error Patterns Observed

### Common Errors

1. **"No routes found"**
   - Token not indexed by Jupiter yet
   - Insufficient liquidity
   - Token not in Jupiter's supported list

2. **"Transaction too large"**
   - Pump.fun AMM routing requires many accounts
   - Combined with other instructions exceeds size limit

3. **"Insufficient liquidity"**
   - Token exists but liquidity too low for swap amount
   - No viable route found

4. **"Token not found"**
   - Token address invalid
   - Token not indexed yet

---

## Current Limitations

### What Works

✅ **Major tokens** (SOL, USDC, USDT, BONK, RAY, etc.) - reliable routing
✅ **Indexed pumpfun tokens** - works if token is in Jupiter's list
✅ **Custom token addresses** - can be added manually
✅ **x402 payment use case** - uses stable tokens that work perfectly

### What Doesn't Work Well

❌ **Brand new tokens** (just launched, not yet indexed) - may fail
❌ **Very low liquidity tokens** - routing often fails
❌ **Complex pumpfun swaps** - may hit transaction size limits
❌ **Immediate trading** of newly launched tokens - requires waiting for indexing

---

## Questions for Opus

1. **Is there a better way to handle pumpfun tokens?**
   - Should we query pump.fun directly for token metadata?
   - Is there a more reliable pump.fun API endpoint?
   - Should we implement direct pump.fun AMM integration?

2. **How to handle new token indexing delays?**
   - Can we query on-chain token metadata directly?
   - Should we implement a token discovery endpoint that checks on-chain?
   - Is there a way to force Jupiter to index a token faster?

3. **Transaction size optimization for pumpfun tokens?**
   - Are there ways to reduce the account count needed?
   - Should we implement versioned transactions (v0) by default for pumpfun tokens?
   - Any other optimization strategies?

4. **Routing strategy for low liquidity tokens?**
   - Should we implement multiple routing attempts with different parameters?
   - Is there a way to find partial routes or suggest alternative swaps?
   - Should we cache failed routes to avoid repeated attempts?

5. **Error handling improvements?**
   - How to better distinguish between "token not indexed" vs "insufficient liquidity"?
   - Should we provide more actionable error messages?
   - Can we suggest alternative tokens or routes?

---

## Code References

### Key Files

- `api/utils/jupiter.js` - Jupiter API integration, pumpfun detection
- `api/routes/quote.js` - Quote endpoint, error handling
- `api/routes/swap.js` - Swap transaction building
- `api/utils/tokenMetadata.js` - Token metadata fetching
- `CRITICAL_FIX_MOONER_TOKEN.md` - Previous fix documentation

### Relevant Constants

```javascript
// api/config/constants.js
const PUMPFUN_PROGRAM_ID = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');
```

### Jupiter Endpoint Priority

```javascript
// api/config/constants.js
const JUPITER_ENDPOINTS = [
  'https://quote-api.jup.ag/v6',  // Preferred - better pump.fun support
  'https://api.jup.ag/swap/v1',  // Fallback
  // ... other endpoints
];
```

---

## Testing Scenarios

### Test Cases That Fail

1. **Brand new pumpfun token** (launched < 1 hour ago)
   - Expected: May fail with "No routes found"
   - Actual: Often fails until Jupiter indexes it

2. **Low liquidity pumpfun token**
   - Expected: May fail with "Insufficient liquidity"
   - Actual: Fails as expected, but error message could be clearer

3. **Complex pumpfun swap** (large amount, many hops)
   - Expected: May hit transaction size limits
   - Actual: Can fail with "Transaction too large" error

### Test Cases That Work

1. **Established pumpfun tokens** (in Jupiter's list)
   - Expected: Works reliably
   - Actual: Works well after fixes

2. **Major tokens** (SOL, USDC, etc.)
   - Expected: Always works
   - Actual: Works perfectly

---

## Recommendations Needed

We need Opus's expertise on:

1. **Best practices for pumpfun token integration**
2. **Strategies for handling new token indexing delays**
3. **Transaction size optimization techniques**
4. **Error handling and user messaging improvements**
5. **Whether to re-implement pump.fun API integration with better error handling**

---

## Context: x402 Payment Use Case

**Important Note:** While pumpfun token issues affect general DEX users, they **don't significantly impact the x402 payment use case** because:

- x402 payments use stable tokens (SOL, USDC, USDT)
- APIs don't want to accept volatile/new tokens
- Core use case (SOL → USDC for API payments) works perfectly

However, improving pumpfun token support would:
- Expand the general DEX user base
- Allow trading of newer tokens
- Improve overall platform competitiveness

---

## Summary

**Current State:**
- Major tokens work reliably ✅
- Indexed pumpfun tokens work after fixes ✅
- Brand new tokens may fail ❌
- Low liquidity tokens often fail ❌
- Transaction size issues for complex swaps ⚠️

**Key Question:**
How can we improve support for smaller/newer pumpfun tokens while maintaining reliability and avoiding transaction size issues?
