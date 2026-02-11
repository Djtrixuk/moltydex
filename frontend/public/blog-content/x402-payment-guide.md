# Complete Guide to x402 Payments for AI Agents

**Everything you need to know about implementing x402 payments in your AI agent, including automatic token swapping.**

---

## What is x402?

x402 is a protocol that enables pay-per-use APIs. When an agent calls an API that requires payment, the server responds with HTTP 402 Payment Required, including details about what payment is needed.

**Example 402 Response:**
```json
{
  "status": 402,
  "headers": {
    "payment-required": {
      "accepts": [{
        "network": "solana",
        "asset": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
        "amount": "1000000", // 1 USDC
        "address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
      }]
    }
  }
}
```

---

## The Challenge: Token Mismatch

**The Problem:**
Agents often don't have the exact token required. An agent might have SOL, but the API wants USDC. Without automatic token swapping, this breaks automation.

**Without Automatic Swapping:**
```
Agent → Calls API → Gets 402 → Needs USDC
Agent → Has SOL, not USDC → ❌ Payment fails
Agent → Manual swap needed → Automation broken
```

**With Automatic Swapping (MoltyDEX):**
```
Agent → Calls API → Gets 402 → Needs USDC
MoltyDEX → Detects 402 → Swaps SOL→USDC → Pays → Retries
Agent → ✅ Gets data automatically
```

---

## How to Implement x402 Payments

### Option 1: HTTP Interceptor (Easiest)

```typescript
import { HTTPInterceptor } from 'moltydex';

// Setup once
const interceptor = new HTTPInterceptor({
  apiUrl: 'https://api.moltydex.com',
  walletSecretKey: process.env.WALLET_SECRET_KEY,
  autoSwap: true,
});

// Now all fetch() calls handle 402 automatically!
const response = await fetch('https://premium-api.com/data');
const data = await response.json();
```

**That's it!** The interceptor handles everything automatically.

### Option 2: Manual Handling

```typescript
import { X402AutoPayAgent } from 'moltydex';

const agent = new X402AutoPayAgent({
  apiUrl: 'https://api.moltydex.com',
  walletSecretKey: process.env.WALLET_SECRET_KEY,
  autoSwap: true,
});

// Make API call
let response = await fetch('https://premium-api.com/data');

// Handle 402 if needed
if (response.status === 402) {
  const result = await agent.handle402(response);
  if (result.success) {
    // Retry original request
    response = await fetch('https://premium-api.com/data');
  }
}

const data = await response.json();
```

---

## Best Practices

### 1. Keep SOL as Primary Token
Most agents should keep SOL as their primary token. MoltyDEX will swap to whatever token is needed when making payments.

### 2. Monitor Balance
Check your SOL balance regularly to ensure you have enough for swaps and fees.

### 3. Handle Errors Gracefully
```typescript
try {
  const response = await fetch('https://premium-api.com/data');
  const data = await response.json();
} catch (error) {
  console.error('Payment failed:', error);
  // Handle error appropriately
}
```

### 4. Use Webhooks (Optional)
For high-volume agents, use webhooks to track transaction status instead of polling.

### 5. Test with Small Amounts
Start with small payment amounts to test the flow before scaling up.

---

## Common Token Pairs

**Most Common:**
- SOL → USDC (most common swap)
- SOL → USDT
- USDC → USDT
- Any SPL token → Any SPL token

**MoltyDEX supports all SPL tokens on Solana.**

---

## Security Considerations

✅ **Client-side signing** - Private keys never leave your system  
✅ **Secure transactions** - All transactions are signed locally  
✅ **No key exposure** - MoltyDEX never sees your private keys  
✅ **Open source** - Code is available for review

---

## Cost Breakdown

**MoltyDEX Fee:** 0.1% per swap  
**Solana Network Fee:** ~0.00001 SOL per transaction  
**Total Cost:** Very low, especially compared to manual token management

**Example:**
- Swap 1 SOL → USDC
- MoltyDEX fee: 0.001 SOL (~$0.002)
- Network fee: ~0.00001 SOL (~$0.00002)
- **Total: ~$0.002**

---

## Troubleshooting

### Payment Fails
- Check your SOL balance
- Verify the payment address is correct
- Check network connectivity
- Review error messages

### Swap Fails
- Ensure sufficient SOL for swap + fees
- Check token liquidity
- Verify token addresses are correct
- Try a smaller amount

### 402 Not Detected
- Ensure you're using the HTTP interceptor
- Check response status codes
- Verify payment headers are present

---

## Resources

- **Documentation:** https://www.moltydex.com/developers
- **Examples:** https://www.moltydex.com/examples
- **Use Cases:** https://www.moltydex.com/use-cases
- **FAQ:** https://www.moltydex.com/faq
- **GitHub:** https://github.com/Djtrixuk/moltydex
- **X:** [@MoltyDEX](https://x.com/MoltyDEX)

---

## Conclusion

x402 payments enable pay-per-use APIs, but token mismatch can break automation. MoltyDEX solves this by automatically swapping tokens when needed, ensuring agents can always pay - regardless of what token they hold.

**Get started today:** https://www.moltydex.com/developers

---

**Questions?** Reach out on X: [@MoltyDEX](https://x.com/MoltyDEX)
