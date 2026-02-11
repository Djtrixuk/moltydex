# The Complete Guide to x402 Payments on Solana

**Everything you need to know about implementing x402 payments for AI agents on Solana.**

---

## What is x402?

x402 is an HTTP status code extension that enables **pay-per-use APIs**. When an API requires payment, it returns a `402 Payment Required` response with payment instructions.

**Standard HTTP status codes:**
- `200 OK` - Success
- `401 Unauthorized` - Authentication required
- `402 Payment Required` - **Payment required** (x402)
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found

---

## x402 on Solana

On Solana, x402 payments are made via **SPL token transfers**. The challenge: agents need the exact token the API wants.

**Common tokens:**
- SOL (native Solana)
- USDC (most common stablecoin)
- USDT (alternative stablecoin)
- Other SPL tokens

**The problem:** Agents can't predict which token will be needed.

---

## The x402 Response Format

### Standard Format

```json
{
  "accepts": [
    {
      "network": "solana",
      "asset": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "amount": "1000000",
      "address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
    }
  ]
}
```

### Fields Explained

- **network:** Blockchain (e.g., "solana")
- **asset:** Token mint address (e.g., USDC)
- **amount:** Amount in smallest unit (e.g., 1 USDC = 1,000,000 micro-USDC)
- **address:** Payment address

---

## The Payment Flow

### Step 1: API Returns 402

```http
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "accepts": [{
    "network": "solana",
    "asset": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "amount": "1000000",
    "address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
  }]
}
```

### Step 2: Parse Payment Requirements

```typescript
const payment = await response.json();
const requirement = payment.accepts[0];
// requirement.asset = USDC mint address
// requirement.amount = "1000000" (1 USDC)
// requirement.address = payment address
```

### Step 3: Check Balance

```typescript
const balance = await getBalance(walletAddress, requirement.asset);
if (balance < requirement.amount) {
  // Need to swap tokens
}
```

### Step 4: Swap Tokens (If Needed)

```typescript
// Swap SOL → USDC
const swapResult = await moltydex.swap(
  SOL_MINT,
  requirement.asset,
  swapAmount
);
```

### Step 5: Make Payment

```typescript
const paymentTx = await createTransferInstruction(
  fromAccount,
  requirement.address,
  requirement.amount
);
await sendTransaction(paymentTx);
```

### Step 6: Retry Original Request

```typescript
const retryResponse = await fetch(originalUrl);
const data = await retryResponse.json();
```

---

## Common Challenges

### Challenge 1: Token Mismatch

**Problem:** Agent has SOL, API wants USDC  
**Solution:** Automatic token swapping (MoltyDEX)

### Challenge 2: Balance Management

**Problem:** Maintaining balances in multiple tokens  
**Solution:** Keep SOL, swap when needed

### Challenge 3: Payment Failures

**Problem:** Payment fails if wrong token  
**Solution:** Automatic detection and swapping

### Challenge 4: Complex Logic

**Problem:** Manual payment handling is complex  
**Solution:** Use MoltyDEX auto-pay agent

---

## Implementation Options

### Option 1: Manual Implementation

**Pros:**
- Full control
- Custom logic

**Cons:**
- Complex
- Error-prone
- Time-consuming

### Option 2: MoltyDEX (Recommended)

**Pros:**
- Automatic handling
- Production-ready
- Secure
- Open source

**Cons:**
- Small fee (0.1%)

---

## Using MoltyDEX

### TypeScript/JavaScript

```typescript
import { HTTPInterceptor } from 'moltydex';

const interceptor = new HTTPInterceptor({
  apiUrl: 'https://api.moltydex.com',
  walletSecretKey: process.env.WALLET_SECRET_KEY,
  autoSwap: true,
});

// All 402 responses handled automatically!
const response = await fetch('https://premium-api.com/data');
const data = await response.json();
```

### Python

```python
from moltydex import MoltyDEX

dex = MoltyDEX(
    wallet_path="wallet.json",
    api_url="https://api.moltydex.com"
)

response = requests.get('https://premium-api.com/data')

if response.status_code == 402:
    payment_result = dex.handle_402_payment(response)
    if payment_result['success']:
        response = requests.get('https://premium-api.com/data')
```

---

## Best Practices

### 1. Use Automatic Swapping
- Don't handle manually
- Use MoltyDEX or similar

### 2. Keep SOL as Primary Balance
- Most liquid
- Easiest to swap

### 3. Monitor Balance
- Check before making calls
- Refill when needed

### 4. Handle Errors Gracefully
- Retry logic
- Fallback strategies
- Error logging

### 5. Test Thoroughly
- Test with small amounts
- Test error cases
- Test edge cases

---

## Security Considerations

### Client-Side Signing

**Always sign transactions locally:**
- Private keys never leave your system
- Maximum security
- Your control

### Payment Verification

**Always verify payments:**
- Check transaction signatures
- Verify amounts
- Confirm addresses

---

## Common Token Addresses (Solana)

- **SOL:** `So11111111111111111111111111111111111111112`
- **USDC:** `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
- **USDT:** `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB`

---

## Conclusion

x402 payments on Solana enable pay-per-use APIs, but require proper implementation. Use MoltyDEX for automatic handling, or implement manually with proper security.

**Key Takeaways:**
- x402 enables pay-per-use APIs
- Solana uses SPL token transfers
- Token mismatch is the main challenge
- Automatic swapping solves it
- Security is critical

**Get Started:** https://www.moltydex.com/developers

---

**Questions?** [@MoltyDEX](https://x.com/MoltyDEX)
