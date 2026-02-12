# Fee Wallet Setup Guide

## Current Status

**❌ Fee wallet is NOT configured in production**

The API health check shows:
- `fee_wallet_configured: false`
- `fee_collection: false`

**What this means:**
- Fees are being **calculated** (0.1% per swap)
- Fees are **NOT being collected** (no wallet configured)
- Users are paying the fee, but it's not going anywhere

---

## How Fee Collection Works

### Fee Calculation
1. User requests a swap
2. API gets quote from Jupiter
3. API calculates fee: `feeAmount = (outputAmount * FEE_BPS) / 10000`
4. Fee is deducted from output amount

### Fee Collection (When Configured)
1. If `FEE_WALLET` is set, a transfer instruction is added to the transaction
2. Fee amount is transferred from user's token account to fee wallet's token account
3. Transaction includes both swap and fee transfer

### Current Code Location
- **File:** `api/routes/swap.js` (lines 117-133)
- **Logic:** Adds fee transfer instruction if `FEE_WALLET` is configured

---

## How to Set Up Fee Collection

### Step 1: Get Your Wallet Address

You need a Solana wallet address to receive fees. Options:

**Option A: Use an existing wallet**
- Use your Phantom/Solflare wallet address
- Or any Solana wallet you control

**Option B: Create a new fee collection wallet**
```bash
solana-keygen new --outfile fee-wallet.json
solana address -k fee-wallet.json
```

**⚠️ Important:** Keep this wallet secure! This is where your revenue goes.

---

### Step 2: Set Environment Variable in Vercel

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
   - Select your `moltydex-api` project

2. **Go to Settings → Environment Variables**

3. **Add New Variable:**
   - **Name:** `FEE_WALLET`
   - **Value:** Your Solana wallet address (e.g., `7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU`)
   - **Environment:** Production (and Preview if you want)

4. **Save**

---

### Step 3: Redeploy API

After setting the environment variable, redeploy:

**Option A: Redeploy from Dashboard**
- Vercel → Deployments → Latest → ⋮ → Redeploy

**Option B: Redeploy from Terminal**
```bash
cd api
vercel --prod
```

---

### Step 4: Verify Fee Collection is Enabled

Check the health endpoint:
```bash
curl https://api.moltydex.com/api/health | jq '.fee_wallet_configured, .features.fee_collection'
```

**Expected output:**
```json
true
true
```

---

## Testing Fee Collection

### Test 1: Check Health Endpoint
```bash
curl https://api.moltydex.com/api/health
```

Look for:
- `fee_wallet_configured: true`
- `features.fee_collection: true`

### Test 2: Get a Quote
```bash
curl "https://api.moltydex.com/api/quote?input_mint=So11111111111111111111111111111111111111112&output_mint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=1000000000"
```

Check for:
- `fee_amount` field (should be calculated)
- `output_after_fee` field (output minus fee)

### Test 3: Build a Swap Transaction
```bash
curl -X POST https://api.moltydex.com/api/swap/build \
  -H "Content-Type: application/json" \
  -d '{
    "wallet_address": "YOUR_WALLET_ADDRESS",
    "input_mint": "So11111111111111111111111111111111111111112",
    "output_mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "amount": "1000000000"
  }'
```

**If fee wallet is configured:**
- Response includes `fee_amount`
- Transaction includes fee transfer instruction
- Fee will be sent to your FEE_WALLET when transaction executes

**If fee wallet is NOT configured:**
- Response includes `fee_amount` (calculated)
- Transaction does NOT include fee transfer
- Fee is deducted but not collected

---

## Verifying Fees Are Being Collected

### Method 1: Check Transaction on Solscan

1. Execute a swap transaction
2. View transaction on Solscan: https://solscan.io/tx/YOUR_TX_SIGNATURE
3. Look for a transfer instruction to your fee wallet
4. Verify the amount matches the calculated fee

### Method 2: Check Fee Wallet Balance

```bash
# Check SOL balance
solana balance YOUR_FEE_WALLET_ADDRESS

# Check token balance (for SPL tokens)
spl-token balance TOKEN_MINT_ADDRESS --owner YOUR_FEE_WALLET_ADDRESS
```

### Method 3: Use Solana Explorer

1. Go to https://explorer.solana.com/address/YOUR_FEE_WALLET_ADDRESS
2. Check transaction history
3. Look for incoming transfers from swaps

---

## Fee Collection Details

### How Fees Are Transferred

1. **For SPL Tokens (USDC, USDT, etc.):**
   - Fee is transferred as SPL token
   - Requires associated token account (created automatically)
   - Transfer instruction added to swap transaction

2. **For SOL:**
   - Fee is transferred as SOL
   - Standard SOL transfer instruction
   - Added to swap transaction

### Fee Amount Calculation

```javascript
const feeAmount = (outputAmount * FEE_BPS) / 10000;
const outputAfterFee = outputAmount - feeAmount;
```

**Example:**
- Output: 1,000,000 USDC (1 USDC)
- Fee BPS: 10 (0.1%)
- Fee: (1,000,000 * 10) / 10000 = 1,000 (0.001 USDC)
- Output after fee: 999,000 (0.999 USDC)

---

## Troubleshooting

### Problem: Fees not being collected

**Check:**
1. Is `FEE_WALLET` set in Vercel environment variables?
2. Did you redeploy after setting the variable?
3. Check health endpoint: `fee_wallet_configured` should be `true`

### Problem: Fee transfer fails

**Possible causes:**
- Invalid wallet address
- Associated token account doesn't exist (should be created automatically)
- Insufficient balance for transaction fees

**Check logs:**
- Vercel → API project → Deployments → Latest → Functions → View logs
- Look for "Fee transfer setup failed" warnings

### Problem: Fees calculated but not transferred

**This is the current state!** Fees are calculated but not collected because `FEE_WALLET` is not configured.

**Solution:** Set `FEE_WALLET` in Vercel and redeploy.

---

## Security Considerations

1. **Keep fee wallet secure** - This is your revenue wallet
2. **Use a dedicated wallet** - Don't use your main wallet
3. **Monitor regularly** - Check that fees are being collected
4. **Backup wallet** - Keep a secure backup of your fee wallet

---

## Next Steps

1. ✅ **Set FEE_WALLET in Vercel** - Add your wallet address
2. ✅ **Redeploy API** - Deploy with new environment variable
3. ✅ **Verify** - Check health endpoint shows `fee_wallet_configured: true`
4. ✅ **Test** - Execute a test swap and verify fee is collected
5. ✅ **Monitor** - Check fee wallet balance regularly

---

## Current Fee Wallet Status

**Production API:** `fee_wallet_configured: false` ❌

**Action Required:** Set `FEE_WALLET` environment variable in Vercel

---

**Last Updated:** 2026-02-06
