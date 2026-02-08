# Critical Fix: $MOONER Token Swap Issue

**Date**: February 6, 2026  
**Issue**: Swaps for $MOONER token (DAu24iE5snKMc46QHVa7uHtEtjZ25Np1PcU8gop9pump) failing on MoltyDEX but working on Jupiter  
**Status**: ✅ Fixed

---

## Problem

Users reported that swaps for custom tokens (specifically $MOONER) work fine on Jupiter's interface but fail on MoltyDEX with "No routes found" error.

## Root Cause

1. **Wrong endpoint priority**: MoltyDEX was trying `/swap/v1` first, which may not support all tokens (especially pump.fun tokens)
2. **Incorrect quote parameters**: `asLegacyTransaction` was being sent in quote requests (only needed for swap, not quote)
3. **Response format handling**: Code assumed single response format, but Jupiter v6 uses slightly different field names

## Solution

### 1. Updated Endpoint Priority
Changed to try Jupiter v6 API first (most comprehensive, supports pump.fun tokens):
```javascript
// Before:
['https://api.jup.ag/swap/v1', 'https://quote-api.jup.ag/v6', ...]

// After:
['https://quote-api.jup.ag/v6', 'https://api.jup.ag/swap/v1', ...]
```

### 2. Fixed Quote Parameters
Removed `asLegacyTransaction` from quote requests (only needed for swap transaction building):
```javascript
// v6 endpoint - no asLegacyTransaction needed for quote
// swap/v1 endpoint - add asLegacyTransaction for compatibility
```

### 3. Improved Response Handling
Made code handle both v6 and v1 response formats:
```javascript
const outAmount = result.data.outAmount || 
                  result.data.outAmountWithSlippage || 
                  result.data.outAmountWithoutSlippage;
```

### 4. Better Error Logging
Added token addresses to error logs for easier debugging:
```javascript
console.warn(`Jupiter ${endpoint} failed:`, {
  input_mint,
  output_mint,
  // ... other details
});
```

## Files Modified

1. `api/config/constants.js` - Updated endpoint priority order
2. `api/utils/jupiter.js` - Fixed quote parameters, improved error handling
3. `api/routes/quote.js` - Improved response format handling
4. `api/routes/swap.js` - Improved quote response handling for swap building

## Testing

To test the fix:
1. Try swapping SOL → $MOONER (DAu24iE5snKMc46QHVa7uHtEtjZ25Np1PcU8gop9pump)
2. Should now get a valid quote
3. Swap should execute successfully

## Deployment

**API needs to be redeployed** for changes to take effect:
```bash
cd api
vercel --prod
```

---

## Why This Fixes It

- **Jupiter v6** is the latest API version and has better support for custom tokens, including pump.fun tokens
- Removing `asLegacyTransaction` from quotes ensures compatibility with v6
- Better response handling ensures we can process quotes from any Jupiter endpoint version
- Trying v6 first means we get the most comprehensive routing before falling back to older endpoints

The token works on Jupiter's UI because they use v6 API internally. Now MoltyDEX does too.
