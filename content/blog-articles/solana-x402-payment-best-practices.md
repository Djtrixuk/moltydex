# Solana x402 Payment Best Practices for AI Agents

**Complete guide to implementing reliable x402 payments on Solana.**

---

## Understanding x402 on Solana

x402 is a protocol for pay-per-use APIs. On Solana, payments are made via SPL token transfers. The challenge: agents need the exact token the API wants.

**Common tokens:**
- SOL (native Solana)
- USDC (most common stablecoin)
- USDT (alternative stablecoin)
- Other SPL tokens

**The problem:** Agents can't predict which token will be needed.

---

## Best Practice #1: Use Automatic Token Swapping

**Why:** Manual swapping breaks automation and adds complexity.

**Solution:** Use MoltyDEX or similar service that automatically swaps tokens when needed.

**Implementation:**
```typescript
import { HTTPInterceptor } from '@moltydex/agent';

const interceptor = new HTTPInterceptor({
  apiUrl: 'https://api.moltydex.com',
  walletSecretKey: process.env.WALLET_SECRET_KEY,
  autoSwap: true,
});

// All 402 responses handled automatically
```

**Benefits:**
- Zero manual steps
- Works with any token
- Best prices (aggregator routes)
- Secure (client-side signing)

---

## Best Practice #2: Keep SOL as Primary Balance

**Why:** SOL is the most liquid and easiest to swap.

**Strategy:**
- Keep primary balance in SOL
- Let automatic swapping handle conversions
- Don't maintain multiple token balances

**Exception:** If you know you'll need a specific token frequently, you can keep some balance, but automatic swapping is usually better.

---

## Best Practice #3: Monitor Balance Regularly

**Why:** Insufficient balance causes payment failures.

**Implementation:**
```typescript
// Check balance before making calls
const balance = await agent.getBalance('SOL');
if (balance < MINIMUM_BALANCE) {
  // Alert or refill
}
```

**Minimum Balance:**
- SOL: 0.1 SOL minimum (for swaps + fees)
- Buffer: Add 20% buffer for safety
- Monitor: Check balance before each batch of calls

---

## Best Practice #4: Handle Errors Gracefully

**Why:** Network issues, insufficient balance, and other errors can occur.

**Implementation:**
```typescript
try {
  const response = await fetch('https://premium-api.com/data');
  const data = await response.json();
} catch (error) {
  // Log error
  console.error('Payment failed:', error);
  
  // Retry logic
  if (shouldRetry(error)) {
    await retryWithBackoff();
  }
  
  // Fallback
  await handleFallback();
}
```

**Error Types:**
- Insufficient balance → Refill wallet
- Network error → Retry with backoff
- Invalid token → Check token address
- Swap failure → Try different route

---

## Best Practice #5: Use Webhooks for Status Updates

**Why:** Polling is inefficient and slow.

**Implementation:**
```typescript
// Register webhook
await moltydex.registerWebhook(
  transactionSignature,
  'https://your-agent.com/webhook',
  { metadata: 'payment-for-api-call' }
);

// Webhook receives status updates
app.post('/webhook', (req, res) => {
  const { signature, status } = req.body;
  // Handle status update
});
```

**Benefits:**
- Real-time updates
- Lower API usage
- Better scalability
- More efficient

---

## Best Practice #6: Implement Retry Logic

**Why:** Temporary failures happen (network, RPC issues).

**Implementation:**
```typescript
async function callWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      
      if (response.status === 402) {
        // Handle payment
        await handlePayment(response);
        // Retry original request
        return await fetch(url);
      }
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(1000 * (i + 1)); // Exponential backoff
    }
  }
}
```

**Retry Strategy:**
- Exponential backoff
- Max retries (3-5)
- Different strategies for different errors
- Log all retries

---

## Best Practice #7: Optimize for Cost

**Why:** Fees add up over time.

**Strategies:**
1. **Batch operations** - Group multiple payments
2. **Use best prices** - Aggregator finds optimal routes
3. **Minimize swaps** - Keep balance in commonly needed token
4. **Monitor fees** - Track costs over time

**Cost Breakdown:**
- MoltyDEX fee: 0.1% per swap
- Network fee: ~0.00001 SOL per transaction
- Total: Very low, especially compared to manual management

---

## Best Practice #8: Test Thoroughly

**Why:** Payment failures in production are costly.

**Testing Checklist:**
- [ ] Test with insufficient balance
- [ ] Test with wrong token
- [ ] Test with network errors
- [ ] Test retry logic
- [ ] Test error handling
- [ ] Test with real APIs
- [ ] Test at scale

**Test Environment:**
- Use devnet for initial testing
- Use small amounts on mainnet
- Gradually increase volume
- Monitor closely

---

## Best Practice #9: Log Everything

**Why:** Debugging payment issues requires good logs.

**What to Log:**
- All API calls
- 402 responses
- Payment attempts
- Swap transactions
- Errors and retries
- Balance changes

**Implementation:**
```typescript
logger.info('API call', { url, timestamp });
logger.info('402 detected', { requirements });
logger.info('Swap initiated', { from, to, amount });
logger.info('Payment successful', { signature });
```

---

## Best Practice #10: Use Production-Ready Tools

**Why:** Building payment logic from scratch is error-prone.

**Recommended:**
- **MoltyDEX** - Automatic token swapping for x402
- **Solana Web3.js** - Official Solana library
- **@solana/spl-token** - SPL token handling

**Why MoltyDEX:**
- Production-ready
- Handles edge cases
- Secure (client-side signing)
- Best prices (Jupiter aggregator)
- Well-documented

---

## Common Mistakes to Avoid

1. **Manual token management** - Use automatic swapping
2. **Ignoring errors** - Always handle gracefully
3. **No retry logic** - Implement retries
4. **Insufficient balance** - Monitor and refill
5. **No logging** - Log everything
6. **Testing in production** - Test thoroughly first
7. **Ignoring fees** - Optimize for cost
8. **No monitoring** - Monitor balance and errors

---

## Conclusion

x402 payments on Solana are powerful, but require proper implementation. Follow these best practices to build reliable, scalable agent payment systems.

**Key Takeaways:**
- Use automatic token swapping
- Keep SOL as primary balance
- Handle errors gracefully
- Monitor and log everything
- Test thoroughly
- Use production-ready tools

**Get Started:** https://www.moltydex.com/developers

---

**Questions?** [@MoltyDEX](https://x.com/MoltyDEX)
