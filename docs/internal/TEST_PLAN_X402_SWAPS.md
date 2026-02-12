# x402 Agent Swap Testing Plan

## Overview
This document outlines comprehensive testing for MoltyDEX x402 payment handler with automatic token swapping functionality.

## Test Environment Setup

### Prerequisites
1. **API Endpoint**: `https://api.moltydex.com` (or local: `http://localhost:3000`)
2. **Test Wallet**: A Solana wallet with some SOL for testing
3. **Jupiter API Key**: Required for real swaps (get at https://portal.jup.ag)
4. **Test Tokens**: SOL, USDC, USDT addresses

### Test Wallet Requirements
- At least 0.1 SOL for network fees
- Some USDC or USDT (optional, for balance tests)

## Test Scenarios

### 1. x402 Payment Parsing
**Endpoint**: `POST /api/x402/parse-payment`

**Test Cases**:
- ✅ Valid x402 payment response with Solana options
- ✅ Invalid payment response (missing fields)
- ✅ Non-Solana payment (should filter out)
- ✅ Multiple payment options (should return recommended)

**Expected Behavior**:
- Returns `payment_requirements` array
- Returns `recommended` payment option
- Filters to only Solana payments

### 2. Balance Checking
**Endpoint**: `GET /api/balance`

**Test Cases**:
- ✅ Check SOL balance
- ✅ Check USDC balance
- ✅ Check USDT balance
- ✅ Invalid token address
- ✅ Wallet with zero balance

**Expected Behavior**:
- Returns balance in smallest unit (lamports for SOL, decimals for tokens)
- Handles missing balances gracefully

### 3. Swap Quote Generation
**Endpoint**: `GET /api/quote`

**Test Cases**:
- ✅ SOL → USDC quote
- ✅ USDC → SOL quote
- ✅ SOL → USDT quote
- ✅ Invalid token pair
- ✅ Very small amount
- ✅ Large amount
- ✅ With slippage tolerance

**Expected Behavior**:
- Returns `output_amount` and `output_after_fee`
- Calculates price impact
- Returns route plan
- Handles errors gracefully

### 4. Swap Transaction Building
**Endpoint**: `POST /api/swap/build`

**Test Cases**:
- ✅ Build SOL → USDC swap transaction
- ✅ Build USDC → SOL swap transaction
- ✅ Missing required fields
- ✅ Invalid token addresses
- ✅ Insufficient balance (should still build transaction)

**Expected Behavior**:
- Returns unsigned transaction (base64)
- Returns `is_versioned` flag
- Returns `output_amount` and `fee_amount`
- Transaction can be signed client-side

### 5. x402 Payment Preparation
**Endpoint**: `POST /api/x402/prepare-payment`

**Test Cases**:
- ✅ Sufficient balance (no swap needed)
- ✅ Insufficient balance (swap needed)
- ✅ Multiple payment options
- ✅ Invalid payment requirements

**Expected Behavior**:
- Returns `ready: true` if balance sufficient
- Returns `swap_needed` object if swap required
- Includes swap quote information

### 6. Complete x402 Auto-Pay Flow
**Endpoint**: `POST /api/x402/auto-pay`

**Test Cases**:
- ✅ Sufficient balance (ready to pay)
- ✅ Insufficient balance (swap needed, auto_swap=false)
- ✅ Insufficient balance (swap needed, auto_swap=true)
- ✅ Invalid payment response
- ✅ Network errors

**Expected Behavior**:
- Returns complete payment status
- Includes swap transaction if `auto_swap=true`
- Provides clear next steps
- Handles all error cases

## Test Script

See `test-x402-swaps.js` for automated test script.

## Manual Testing Checklist

### Basic Flow Test
- [ ] Parse x402 payment response
- [ ] Check wallet balance for required token
- [ ] If insufficient, get swap quote
- [ ] Build swap transaction
- [ ] Verify transaction structure
- [ ] Sign and send transaction (manual)
- [ ] Verify swap completed
- [ ] Make x402 payment (manual)
- [ ] Verify payment received

### Edge Cases
- [ ] Payment requires token agent doesn't have
- [ ] Payment requires SOL (agent has USDC)
- [ ] Payment requires USDC (agent has SOL)
- [ ] Very small payment amounts
- [ ] Large payment amounts
- [ ] Multiple payment options in x402 response
- [ ] Invalid token addresses
- [ ] Network errors during swap
- [ ] Jupiter API unavailable

### Integration Test
- [ ] Complete end-to-end flow:
  1. Agent receives 402 Payment Required
  2. Agent calls `/api/x402/auto-pay`
  3. System detects insufficient balance
  4. System gets swap quote
  5. System builds swap transaction
  6. Agent signs and sends swap
  7. Swap confirms
  8. Agent retries original request with payment

## Success Criteria

✅ **All endpoints respond correctly**
✅ **Swap quotes are accurate**
✅ **Transactions build successfully**
✅ **Error handling is robust**
✅ **x402 flow works end-to-end**
✅ **Zero platform fees (fee_amount = 0)**
✅ **Best prices via Jupiter aggregator**

## Known Limitations

1. **Jupiter API Key Required**: Real swaps require Jupiter API key
2. **Test Mode**: Can test with demo mode (no real swaps)
3. **Network Fees**: Solana network fees still apply (~0.00001 SOL per transaction)
4. **Transaction Signing**: Must be done client-side (not tested in API)

## Next Steps

1. Run automated test script
2. Perform manual testing
3. Test with real wallet and small amounts
4. Verify analytics tracking
5. Document any issues found
