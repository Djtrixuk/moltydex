# How to Integrate MoltyDEX with Your AI Agent

Complete guide to integrating MoltyDEX for automatic token swapping in your AI agent.

## Why Integrate MoltyDEX?

When your agent receives a 402 Payment Required response, it often doesn't have the exact token needed. MoltyDEX automatically swaps tokens, making x402 payments seamless.

## Quick Integration (5 Minutes)

### Python

```python
from moltydex import X402PaymentHandler
import requests

# Initialize handler
handler = X402PaymentHandler("wallet.json")

# Make request to x402-protected API
response = requests.get("https://api.example.com/data")

# Automatically handle 402 responses
if response.status_code == 402:
    paid_response = handler.handle_402_response(
        response,
        "https://api.example.com/data"
    )
    data = paid_response.json()
else:
    data = response.json()
```

### TypeScript/JavaScript

```typescript
import { HTTPInterceptor } from '@moltydex/agent';

// Setup once - handles all 402 responses
const interceptor = new HTTPInterceptor({
  apiUrl: 'https://api.moltydex.com',
  walletSecretKey: process.env.WALLET_SECRET_KEY,
  autoSwap: true,
});

// Now all fetch() calls handle 402 automatically!
const response = await fetch('https://premium-api.com/data');
const data = await response.json(); // Works seamlessly!
```

## Step-by-Step Integration

### Step 1: Install SDK

**Python:**
```bash
pip install moltydex
```

**Node.js:**
```bash
npm install @moltydex/agent
```

### Step 2: Configure Wallet

Create a wallet file or use environment variables:

```python
# wallet.json
{
  "secret_key": "your_base58_encoded_secret_key"
}
```

### Step 3: Initialize Handler

```python
from moltydex import X402PaymentHandler

handler = X402PaymentHandler(
    wallet_path="wallet.json",
    api_url="https://api.moltydex.com"
)
```

### Step 4: Use in Your Agent

```python
def make_api_request(url):
    response = requests.get(url)
    
    if response.status_code == 402:
        # Automatically handle payment
        return handler.handle_402_response(response, url)
    
    return response
```

## Advanced Usage

### Custom Token Preferences

```python
handler = X402PaymentHandler(
    wallet_path="wallet.json",
    preferred_tokens=["SOL", "USDC"],  # Prefer these tokens
    auto_swap=True
)
```

### Manual Swap Control

```python
# Get quote first
quote = handler.get_quote(
    input_token="SOL",
    output_token="USDC",
    amount=1_000_000_000  # 1 SOL
)

# Check if swap is worth it
if quote['price_impact'] < 0.01:  # Less than 1% impact
    result = handler.swap(
        input_token="SOL",
        output_token="USDC",
        amount=1_000_000_000
    )
```

### Error Handling

```python
try:
    response = handler.handle_402_response(payment_response, url)
except InsufficientBalance:
    # Handle insufficient balance
    print("Need more tokens")
except SwapFailed:
    # Handle swap failure
    print("Swap failed, retrying...")
except Exception as e:
    # Handle other errors
    print(f"Error: {e}")
```

## Framework Integrations

### LangChain

```python
from langchain.agents import Agent
from moltydex import X402PaymentHandler

class MoltyDEXAgent(Agent):
    def __init__(self):
        super().__init__()
        self.payment_handler = X402PaymentHandler("wallet.json")
    
    def execute(self, action):
        response = self.http_client.get(action.url)
        if response.status_code == 402:
            response = self.payment_handler.handle_402_response(
                response, action.url
            )
        return response.json()
```

### AutoGPT

```python
# Add to AutoGPT config
MOLTYDEX_ENABLED = True
MOLTYDEX_WALLET_PATH = "wallet.json"
MOLTYDEX_API_URL = "https://api.moltydex.com"
```

## Best Practices

1. **Cache Quotes:** Don't fetch quotes for every request
2. **Monitor Balance:** Check balance before attempting swaps
3. **Handle Errors:** Always have fallback logic
4. **Log Everything:** Track swaps for debugging
5. **Set Limits:** Prevent excessive swapping

## Troubleshooting

**Issue:** "Insufficient balance"
- **Solution:** Ensure wallet has enough SOL for fees

**Issue:** "Swap failed"
- **Solution:** Check token liquidity, try different route

**Issue:** "402 still returned"
- **Solution:** Verify payment transaction was confirmed

## Next Steps

- Read full documentation: https://www.moltydex.com/developers
- See more examples: https://github.com/moltydex/examples
- Join community: Discord/Slack

---

**Ready to integrate?** Start with the quick integration above - it's just 5 minutes!
