# How to Build an AI Agent That Pays for APIs Automatically

**Complete guide to building AI agents that handle x402 payments with automatic token swapping.**

---

## The Problem

AI agents need to pay for APIs, but there's a catch: they often don't have the exact token required. An agent might have SOL, but the API wants USDC. Without automatic token swapping, this breaks the automation that makes agents powerful.

**Example scenario:**
```
Agent → Calls Premium API → Gets 402 Payment Required
Agent → Has SOL, but API wants USDC → ❌ Payment fails
Agent → Manual intervention needed → Automation broken
```

---

## The Solution: MoltyDEX

MoltyDEX is the first DEX built specifically for x402 payments. It automatically:
- Detects 402 Payment Required responses
- Checks the agent's balance
- Swaps tokens if needed (SOL → USDC, or any token pair)
- Makes the payment automatically
- Retries the original request

**With MoltyDEX:**
```
Agent → Calls Premium API → Gets 402 Payment Required
MoltyDEX → Detects 402 → Checks balance → Swaps SOL→USDC → Pays → Retries
Agent → ✅ Gets data automatically
```

---

## Quick Start

### 1. Install the Agent

```bash
npm install @moltydex/agent
# or
pip install moltydex
```

### 2. Set Up Your Wallet

```typescript
// TypeScript/JavaScript
import { X402AutoPayAgent } from '@moltydex/agent';

const agent = new X402AutoPayAgent({
  apiUrl: 'https://api.moltydex.com',
  walletSecretKey: process.env.WALLET_SECRET_KEY,
  autoSwap: true,
});
```

```python
# Python
from moltydex import MoltyDEX

dex = MoltyDEX(
    wallet_path="wallet.json",
    api_url="https://api.moltydex.com"
)
```

### 3. Use It

```typescript
// The agent automatically handles 402 responses
const response = await fetch('https://premium-api.com/data');
const data = await response.json(); // Works seamlessly!
```

That's it! The agent handles everything automatically.

---

## Complete Example

### TypeScript/JavaScript

```typescript
import { HTTPInterceptor } from '@moltydex/agent';

// Setup once
const interceptor = new HTTPInterceptor({
  apiUrl: 'https://api.moltydex.com',
  walletSecretKey: process.env.WALLET_SECRET_KEY,
  autoSwap: true,
});

// Now all fetch() calls handle 402 automatically!
async function callPremiumAPI() {
  const response = await fetch('https://premium-api.com/data');
  
  if (response.ok) {
    const data = await response.json();
    console.log('Data received:', data);
  }
}

callPremiumAPI();
```

### Python

```python
from moltydex import MoltyDEX
import requests

# Initialize
dex = MoltyDEX(
    wallet_path="wallet.json",
    api_url="https://api.moltydex.com"
)

# Make API call with automatic payment handling
def call_premium_api():
    response = requests.get('https://premium-api.com/data')
    
    if response.status_code == 402:
        # MoltyDEX handles payment automatically
        payment_result = dex.handle_402_payment(response)
        if payment_result['success']:
            # Retry original request
            response = requests.get('https://premium-api.com/data')
    
    if response.ok:
        data = response.json()
        print('Data received:', data)

call_premium_api()
```

---

## How It Works

### Step 1: Agent Calls API
```typescript
const response = await fetch('https://premium-api.com/data');
```

### Step 2: API Returns 402 Payment Required
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

### Step 3: MoltyDEX Intercepts
- Parses payment requirements
- Checks agent's balance
- Determines if swap is needed

### Step 4: Automatic Token Swap (if needed)
- Gets quote from Jupiter aggregator
- Builds swap transaction
- Agent signs transaction (client-side)
- Swap executes on Solana

### Step 5: Automatic Payment
- Builds payment transaction
- Agent signs transaction
- Payment sent to API provider

### Step 6: Retry Original Request
- Payment verified
- Original API call retried
- Data received successfully

---

## Real-World Use Cases

### 1. Premium API Access
An agent needs to call a premium data API that charges 1 USDC per request. The agent has SOL but no USDC. With MoltyDEX, it automatically swaps SOL → USDC and pays, then gets the data.

### 2. Automated Data Collection
An agent runs hourly to collect market data from multiple paid APIs. Each API might want different tokens (USDC, USDT, SOL). MoltyDEX handles all the token conversions automatically.

### 3. Pay-Per-Use AI Services
An agent uses multiple AI APIs that charge per request. Some want SOL, others want USDC. Instead of maintaining balances in multiple tokens, the agent keeps SOL and MoltyDEX swaps as needed.

### 4. x402 Protocol Integration
For API providers using x402, MoltyDEX ensures agents can actually pay. No more "agent has wrong token" errors. Higher conversion rates, instant payments, zero manual processing.

---

## Key Features

✅ **Automatic token swapping** - Via Jupiter aggregator (best prices across all Solana DEXes)  
✅ **Zero integration complexity** - Works with standard fetch() calls  
✅ **Secure client-side signing** - Private keys stay with the agent  
✅ **0.1% fees** - Competitive pricing  
✅ **Live on Solana mainnet** - Production-ready  
✅ **Handles edge cases** - Insufficient balance, swap failures, retries

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

---

## Getting Started

1. **Visit:** https://www.moltydex.com
2. **Read docs:** https://www.moltydex.com/developers
3. **Try it:** https://www.moltydex.com (swap interface)
4. **Get help:** https://x.com/MoltyDEX

---

## Conclusion

MoltyDEX removes the biggest friction point for AI agents making x402 payments: token management. Instead of maintaining balances in multiple tokens or failing payments, agents can focus on their core logic.

**The difference:**
- **Without MoltyDEX:** Manual token swaps, payment failures, broken automation
- **With MoltyDEX:** Automatic swaps, seamless payments, true automation

Try it today and see the difference! 🚀

---

**Questions?** Reach out on X: [@MoltyDEX](https://x.com/MoltyDEX)  
**Documentation:** https://www.moltydex.com/developers  
**GitHub:** https://github.com/Djtrixuk/moltydex
