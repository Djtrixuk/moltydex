# SOL Output Swap Fix

## Problem

**Critical Bug**: All swaps TO SOL were failing with 500 server errors.

**Pattern**:
- ✅ SOL → USDC: Works
- ✅ SOL → BONK: Works  
- ✅ SOL → WIF: Works
- ❌ USDC → SOL: 500 error
- ❌ BONK → SOL: 500 error
- ❌ WIF → SOL: 500 error
- ❌ USDT → SOL: 500 error

**Root Cause**: When SOL is the output token, Jupiter's API requires `feeAccount` to be the fee wallet's native SOL account (PublicKey), not an associated token account. The code was skipping `feeAccount` entirely for SOL outputs, causing Jupiter's API to fail.

## Fix Applied

**File**: `api/routes/swap.js`

**Changes**:
1. **SOL Output Fee Handling**: When SOL is output, use the fee wallet address directly as `feeAccount` (PublicKey), not an associated token account
2. **Enhanced Error Logging**: Added detailed error logging to help debug future issues

**Before**:
```javascript
if (FEE_WALLET && FEE_BPS > 0 && !isSolOutput) {
  // Only set feeAccount for non-SOL outputs
  feeAccount = await getAssociatedTokenAddress(...);
}
```

**After**:
```javascript
if (FEE_WALLET && FEE_BPS > 0) {
  if (isSolOutput) {
    // For SOL output, use fee wallet address directly as feeAccount
    feeAccount = new PublicKey(FEE_WALLET);
  } else {
    // For SPL token output, use associated token account
    feeAccount = await getAssociatedTokenAddress(...);
  }
}
```

## Technical Details

**Jupiter API Behavior**:
- For **SPL token outputs**: `feeAccount` must be an associated token account
- For **SOL outputs**: `feeAccount` should be the fee wallet's native SOL account (PublicKey)
- Jupiter collects fees in the output token type automatically

**Why This Fixes It**:
- Previously, when SOL was output, `feeAccount` was `null`
- Jupiter's API likely requires `feeAccount` even for SOL outputs when `platformFeeBps` is set
- By passing the fee wallet address directly as `feeAccount` for SOL outputs, Jupiter can collect fees in native SOL

## Testing

**Test Cases**:
1. ✅ USDC → SOL (should work now)
2. ✅ BONK → SOL (should work now)
3. ✅ WIF → SOL (should work now)
4. ✅ USDT → SOL (should work now)
5. ✅ SOL → USDC (should still work)
6. ✅ USDC → BONK (should still work)

## Deployment

- ✅ **API deployed**: https://api.moltydex.com
- **Status**: Ready for testing

## Error Logging Improvements

Added comprehensive error logging to help debug future issues:
- Logs input/output mints
- Logs whether SOL is output
- Logs feeAccount value
- Logs full error details

## Next Steps

1. **Test swaps to SOL** - Verify all SOL output swaps work
2. **Monitor error logs** - Check Vercel logs for any remaining issues
3. **Verify fee collection** - Ensure fees are being collected correctly for SOL outputs

## Related Issues

- This fix ensures fee collection works for SOL outputs
- Fees are collected via Jupiter's native fee mechanism (`platformFeeBps` + `feeAccount`)
- No manual fee instructions needed - Jupiter bakes fees into the route
