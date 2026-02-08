# x402 Ecosystem Submission

## Project: MoltyDEX

**Website:** https://www.moltydex.com  
**Category:** Payment Infrastructure / DEX Aggregator  
**Status:** Live  

## Description

MoltyDEX is a DEX aggregator built specifically for x402 payments. It solves a critical problem for AI agents: when an agent receives a 402 Payment Required response, it often doesn't have the exact token needed. MoltyDEX automatically swaps tokens, making x402 adoption seamless.

## Problem Solved

**The Challenge:**
- AI agents receive 402 Payment Required responses
- Agents often have the wrong token (e.g., SOL instead of USDC)
- Without automatic swapping, automation breaks
- Manual intervention required

**The Solution:**
- Automatic token swapping when 402 responses are received
- Zero configuration needed
- Handles entire payment flow automatically
- Works with any x402-protected API

## Integration

**For API Providers:**
- Accept x402 payments knowing agents can automatically swap tokens
- No need to accept multiple tokens
- Seamless agent adoption

**For Agent Developers:**
- Simple REST API or Python SDK
- Automatic 402 handling
- Client-side signing (secure)

## Technical Implementation

```python
from moltydex import X402PaymentHandler

handler = X402PaymentHandler("wallet.json")

# Automatically handles 402 responses
response = requests.get("https://api.example.com/data")
if response.status_code == 402:
    paid_response = handler.handle_402_response(response, url)
```

## Links

- **Website:** https://www.moltydex.com
- **Documentation:** https://www.moltydex.com/developers
- **API:** https://api.moltydex.com
- **GitHub:** [To be added]

## Why This Matters

MoltyDEX removes a major barrier to x402 adoption. By making token swapping automatic, it enables agents to seamlessly pay for APIs without manual intervention. This is critical for the x402 ecosystem to reach its full potential.

---

**Submit to:**
- x402 Ecosystem Page: https://www.x402.org/ecosystem
- x402 GitHub: https://github.com/coinbase/x402
