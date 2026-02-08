# Complete Guide: Integrating MoltyDEX with x402 Payments

**For:** AI Agent Developers  
**Difficulty:** Beginner to Intermediate  
**Time:** 15 minutes

---

## Overview

This guide shows you how to integrate MoltyDEX with your AI agent to handle x402 Payment Required responses automatically.

## Prerequisites

- AI agent that makes HTTP requests
- Solana wallet (for payments)
- Basic understanding of HTTP status codes

## Step 1: Understand x402 Protocol

x402 is a protocol for pay-per-use APIs. When an API requires payment, it returns:
- HTTP Status: `402 Payment Required`
- Headers: Payment requirements (amount, token, network, payTo)

## Step 2: Install MoltyDEX SDK

### Python
```bash
pip install moltydex
```

### TypeScript/JavaScript
```bash
npm install @moltydex/agent
```

## Step 3: Basic Integration

### Python Example

```python
from moltydex import MoltyDEX
import requests

# Initialize MoltyDEX
dex = MoltyDEX(
    wallet_path="wallet.json",
    api_url="https://api.moltydex.com"
)

# Make API request with auto-payment
def make_request_with_payment(url):
    response = requests.get(url)
    
    # Check for 402 Payment Required
    if response.status_code == 402:
        # Parse payment requirements
        payment_info = parse_402_response(response)
        
        # Check balance
        balance = dex.get_balance(payment_info['token'])
        
        # Swap if needed
        if balance < payment_info['amount']:
            swap_needed = payment_info['amount'] - balance
            dex.swap('SOL', payment_info['token'], swap_needed)
        
        # Make payment
        dex.make_payment(payment_info)
        
        # Retry original request
        response = requests.get(url, headers={
            'X-Payment-Signature': payment_signature
        })
    
    return response.json()
```

### TypeScript Example

```typescript
import { HTTPInterceptor } from '@moltydex/agent';

// Setup once - handles all 402 responses automatically
const interceptor = new HTTPInterceptor({
  apiUrl: 'https://api.moltydex.com',
  walletSecretKey: process.env.WALLET_SECRET_KEY,
  autoSwap: true,
});

// Now all fetch() calls handle 402 automatically!
const response = await fetch('https://premium-api.com/data');
const data = await response.json(); // Works seamlessly!
```

## Step 4: Advanced: Custom Error Handling

```python
def handle_402_with_retry(url, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = requests.get(url)
            
            if response.status_code == 402:
                # Handle payment
                handle_payment(response)
                # Retry
                continue
            else:
                return response.json()
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            time.sleep(2 ** attempt)  # Exponential backoff
```

## Step 5: Testing

1. **Test with a real x402 API**
2. **Verify payment is made**
3. **Verify request succeeds after payment**
4. **Test with insufficient balance (should auto-swap)**

## Common Issues

### Issue: "Insufficient Balance"
**Solution:** Enable auto-swap in MoltyDEX configuration

### Issue: "Token Not Found"
**Solution:** Verify token mint address is correct

### Issue: "Transaction Failed"
**Solution:** Check Solana network status, verify wallet has SOL for fees

## Best Practices

1. **Always check balance first** - Avoid unnecessary swaps
2. **Cache payment info** - Don't re-parse 402 responses
3. **Handle errors gracefully** - Retry with exponential backoff
4. **Log all payments** - For debugging and accounting

## Next Steps

- Read API documentation: https://www.moltydex.com/developers
- Join Discord: [Link]
- Check examples: [GitHub repo]

---

**Your agent is now ready to handle x402 payments automatically!** 🚀
