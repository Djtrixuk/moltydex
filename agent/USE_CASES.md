# x402 Auto-Pay Agent - Use Cases & Examples

## What Just Happened? (Test Transaction Explained)

### The Test Flow:
1. **Mock 402 Response**: The example created a fake 402 payment requirement
2. **Agent Detected**: "You need to pay 1 USDC"
3. **Checked Balance**: You had 0.696 USDC, needed 1.0 USDC
4. **Swapped Tokens**: Agent swapped 0.01 SOL → 0.778 USDC (via MoltyDEX)
5. **Made Payment**: Sent 1 USDC to test address `7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU`
6. **Confirmed**: Transaction confirmed on-chain

### Did You Profit?
**No** - This was a **test/demonstration**. You actually:
- **Spent** ~0.01 SOL (for the swap)
- **Spent** 1 USDC (sent to test address)
- **Paid** network fees (~0.00001 SOL)
- **Paid** MoltyDEX fee (~0.1% on swap)

**Total cost**: ~$0.15-0.20 for the test

### Why Test?
To prove the agent works! Now you can use it with **real APIs** that return 402.

---

## Real Use Cases

### 1. **Premium API Access**
```typescript
// Your agent needs to call a premium API
const response = await fetch('https://premium-gpt-api.com/chat', {
  method: 'POST',
  body: JSON.stringify({ prompt: 'Hello' })
});

// If API returns 402, agent automatically:
// - Parses payment requirements
// - Swaps tokens if needed
// - Makes payment
// - Retries request
// - Returns the data!

const data = await response.json(); // Works seamlessly!
```

### 2. **Automated Data Collection**
```typescript
// Collect data from multiple paid APIs
const apis = [
  'https://api1.com/data',
  'https://api2.com/data',
  'https://api3.com/data',
];

// Agent handles all payments automatically
const results = await Promise.all(
  apis.map(url => fetch(url).then(r => r.json()))
);
```

### 3. **AI Agent Payments**
```typescript
// Your AI agent needs to pay for services
class MyAgent {
  async callService(url: string) {
    // Agent automatically handles 402 payments
    const response = await fetch(url);
    return response.json();
  }
}
```

### 4. **x402 Protocol Integration**
```typescript
// Integrate with any x402-compatible API
// The agent handles the entire payment flow automatically
const agent = new X402AutoPayAgent(config);

// Use HTTP interceptor for automatic handling
const interceptor = new HTTPInterceptor(config);

// Now all fetch() calls handle 402 automatically!
```

---

## How to Use with Real APIs

### Step 1: Setup Agent
```bash
export WALLET_SECRET_KEY='your-private-key'
export WALLET_ADDRESS='your-wallet-address'
```

### Step 2: Initialize Interceptor
```typescript
import { HTTPInterceptor } from './agent/src/HTTPInterceptor.js';

const interceptor = new HTTPInterceptor({
  apiUrl: 'https://api.moltydex.com',
  walletSecretKey: process.env.WALLET_SECRET_KEY,
  autoSwap: true,
});
```

### Step 3: Use fetch() Normally
```typescript
// Just call APIs normally - agent handles 402 automatically!
const response = await fetch('https://premium-api.com/data');
const data = await response.json();
```

---

## Profit Opportunities

### For API Providers:
- **Get paid automatically** - No manual payment processing
- **Works with any Solana token** - Agent swaps automatically
- **Seamless integration** - Just return 402 with payment requirements

### For Agents:
- **Automated payments** - No manual intervention needed
- **Token flexibility** - Works with any token (agent swaps if needed)
- **Event-driven** - Uses webhooks instead of polling

### For MoltyDEX:
- **Swap fees** - Earns 0.1% on each swap
- **Volume** - More agents = more swaps = more revenue
- **Unique value** - Only platform with x402 auto-pay agent

---

## Next Steps

1. **Test with Real APIs**: Find APIs that return 402 and test the agent
2. **Integrate into Your Agent**: Add the interceptor to your existing agent code
3. **Monitor Usage**: Track payments and swaps made automatically
4. **Scale**: Use with multiple APIs/services

---

## Cost Breakdown

**Per 402 Payment:**
- Swap fee: ~0.1% (if swap needed)
- Network fees: ~0.000005 SOL per transaction
- Total: ~$0.01-0.02 per payment (depending on swap)

**Example:**
- 100 API calls requiring payment = ~$1-2 in fees
- Much cheaper than manual payment processing!

---

## Questions?

- **"Can I use this with my API?"** - Yes! Just return 402 with payment requirements
- **"How much does it cost?"** - ~$0.01-0.02 per payment (mostly network fees)
- **"Does it work with any token?"** - Yes! Agent swaps automatically
- **"Can I customize it?"** - Yes! Check the source code in `src/`
