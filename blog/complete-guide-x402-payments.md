# Complete Guide to x402 Payments for AI Agents

## Introduction

x402 is revolutionizing how AI agents interact with paid APIs. Instead of traditional subscription models, APIs can now request payment on-demand using the x402 Payment Required protocol. This guide will show you everything you need to know about implementing x402 payments in your AI agents.

## What is x402?

x402 is a payment protocol that allows APIs to request payment before serving content. When an API needs payment, it returns a `402 Payment Required` HTTP status code along with payment details:

```json
{
  "accepts": [
    {
      "scheme": "solana",
      "token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "amount": "1000000",
      "network": "mainnet"
    }
  ]
}
```

## The Challenge for AI Agents

When an AI agent receives a 402 response, it needs to:
1. Parse the payment requirements
2. Check if it has the required token
3. Swap tokens if needed (e.g., SOL → USDC)
4. Make the payment
5. Retry the original request

This is complex and error-prone if done manually.

## Solution: MoltyDEX

MoltyDEX is a DEX aggregator built specifically for x402 payments. It handles all of the above automatically:

```python
from moltydex import X402PaymentHandler

handler = X402PaymentHandler("wallet.json")
response = requests.get("https://api.example.com/data")

if response.status_code == 402:
    # Automatically handles everything
    paid_response = handler.handle_402_response(response, url)
    data = paid_response.json()
```

## Step-by-Step Implementation

### 1. Install MoltyDEX

```bash
pip install moltydex
```

### 2. Initialize Handler

```python
from moltydex import X402PaymentHandler

handler = X402PaymentHandler(
    wallet_path="wallet.json",
    api_url="https://api.moltydex.com"
)
```

### 3. Make Requests

```python
import requests

def make_request_with_payment(url):
    response = requests.get(url)
    
    if response.status_code == 402:
        # Automatically handle payment
        return handler.handle_402_response(response, url)
    
    return response
```

### 4. Handle Errors

```python
try:
    response = make_request_with_payment(url)
    data = response.json()
except Exception as e:
    print(f"Payment failed: {e}")
    # Handle error appropriately
```

## Integration Examples

### LangChain Integration

```python
from langchain.agents import AgentExecutor
from moltydex.langchain import X402PaymentMiddleware

middleware = X402PaymentMiddleware(moltydex_tool)
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    middleware=[middleware]
)
```

### AutoGPT Integration

```python
# In your AutoGPT configuration
plugins:
  - moltydex_plugin
```

## Best Practices

1. **Always check balances first** - Avoid unnecessary swaps
2. **Handle errors gracefully** - Payment failures shouldn't crash your agent
3. **Cache payment info** - Avoid repeated payments for same content
4. **Monitor costs** - Track how much you're spending on API calls
5. **Use appropriate slippage** - Balance speed vs. price

## Common Token Addresses

- **SOL**: `So11111111111111111111111111111111111111112`
- **USDC**: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
- **USDT**: `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB`

## Troubleshooting

### "Insufficient balance" error
- Check your wallet balance
- Ensure you have enough SOL for fees
- Verify token addresses are correct

### "Swap failed" error
- Check network connectivity
- Verify token pair is supported
- Check slippage settings

### "Payment not accepted" error
- Verify payment amount matches requirements
- Check transaction was confirmed
- Ensure you're using the correct network

## Resources

- **MoltyDEX**: https://www.moltydex.com
- **x402 Protocol**: https://github.com/coinbase/x402
- **Examples**: https://github.com/Djtrixuk/moltydex-x402-example
- **Documentation**: https://www.moltydex.com/developers

## Conclusion

x402 payments are the future of API monetization, and MoltyDEX makes it easy for AI agents to handle them automatically. With just a few lines of code, your agents can seamlessly pay for API access without manual intervention.

Get started today: https://www.moltydex.com
