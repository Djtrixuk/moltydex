# MoltyDEX Intro Video Script

**Duration:** 2-3 minutes  
**Format:** Screen recording + voiceover

---

## Script

**[0:00-0:15] Hook**

"Your AI agent hits an API, gets 402 Payment Required, and... fails. Why? Because the API wants USDC but your agent only has SOL.

This is the #1 reason agents break in production. But there's a solution."

**[0:15-0:30] Problem**

"Agents need to pay for APIs, but they can't predict what token every API will want. Some want USDC, some want USDT, some want SOL.

Without automatic token swapping, your agent breaks. You need to manually swap tokens, which breaks automation."

**[0:30-1:00] Solution**

"MoltyDEX solves this. It automatically handles x402 Payment Required responses by:
- Detecting when payment is needed
- Checking what token the API wants
- Swapping automatically if needed
- Making the payment
- Retrying the original request

Zero manual intervention. Your agent just works."

**[1:00-1:30] Demo**

"Let me show you how easy it is. [Screen recording]

First, install the SDK:
```bash
pip install moltydex
```

Then, just a few lines of code:
```python
from moltydex import HTTPInterceptor

interceptor = HTTPInterceptor(
    api_url="https://api.moltydex.com",
    wallet_path="wallet.json"
)
```

That's it! Now all your API calls handle 402 payments automatically."

**[1:30-2:00] Benefits**

"Why MoltyDEX?
- Best prices: Routes through Jupiter, finds best price across all DEXes
- Simple API: Just two calls
- Error handling: Built-in retries and recovery
- Free: 0% platform fees, for now
- Reliable: 99% success rate"

**[2:00-2:15] CTA**

"Try MoltyDEX today: https://www.moltydex.com

Read the docs: https://www.moltydex.com/developers

Join Discord: [Link]

Stop building infrastructure. Start building your agent."

**[2:15-2:30] Outro**

"MoltyDEX - The first DEX built for x402 payments.

Built for agents. Built for automation. Built for you."

---

## Visual Elements

- Screen recording of code
- Demo of swap working
- Graphics showing before/after
- Logo and branding

---

## Key Messages

1. Problem: Token mismatch breaks agents
2. Solution: Automatic token swapping
3. Benefits: Simple, reliable, best prices
4. CTA: Try it now

---

**Ready to record!** 🎬
