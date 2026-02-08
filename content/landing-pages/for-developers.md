# MoltyDEX for Developers

**Build agents that handle payments automatically.**

---

## Why Developers Choose MoltyDEX

### Simple Integration
```python
from moltydex import HTTPInterceptor

interceptor = HTTPInterceptor(
    api_url="https://api.moltydex.com",
    wallet_path="wallet.json",
    auto_swap=True
)

# That's it! Your agent now handles 402 payments automatically.
```

### Powerful API
- **Quote:** Get best prices instantly
- **Swap:** Execute swaps with one call
- **Balance:** Check any token balance
- **Batch:** Multiple operations at once

### Built for Agents
- Automatic token swapping
- x402 protocol support
- Error handling built-in
- Best prices guaranteed

---

## Quick Start

### 1. Install SDK
```bash
pip install moltydex
# or
npm install @moltydex/agent
```

### 2. Get a Quote
```python
from moltydex import MoltyDEX

dex = MoltyDEX(api_url="https://api.moltydex.com")
quote = dex.quote("SOL", "USDC", 1_000_000_000)
```

### 3. Execute Swap
```python
result = dex.swap("SOL", "USDC", 1_000_000_000)
print(f"TX: {result['signature']}")
```

### 4. Handle x402 Automatically
```python
from moltydex import HTTPInterceptor

interceptor = HTTPInterceptor(
    api_url="https://api.moltydex.com",
    wallet_path="wallet.json"
)

# All requests now handle 402 automatically!
response = requests.get("https://premium-api.com/data")
```

---

## Features

### ✅ Automatic Token Swapping
Detects when your agent needs a different token and swaps automatically.

### ✅ Best Prices
Routes through Jupiter to find the best price across all DEXes.

### ✅ Simple API
Two API calls: `/api/quote` and `/api/swap/build`. That's it.

### ✅ Error Handling
Built-in retries, error recovery, and edge case handling.

### ✅ Free (for now)
0% platform fees. You only pay Solana network fees.

---

## Documentation

- **API Reference:** https://www.moltydex.com/developers
- **Integration Guide:** [Link]
- **Examples:** [Link]
- **FAQ:** [Link]

---

## SDKs Available

- **Python:** `pip install moltydex`
- **TypeScript/JavaScript:** `npm install @moltydex/agent`
- **REST API:** Direct HTTP calls

---

## Community

- **Discord:** [Link]
- **GitHub:** [Link]
- **Twitter:** @MoltyDEX

---

## Beta Tester Program

Test MoltyDEX and earn rewards:
- $10 USDC for early testers
- $5 USDC per bug report
- $25 USDC for use case stories
- $50 USDC for full integration

**Join:** [Discord Link]

---

## Get Started Now

**Try it:** https://www.moltydex.com  
**Docs:** https://www.moltydex.com/developers  
**Support:** [Discord Link]

---

**Stop building infrastructure. Start building your agent.** 🚀
