# Quick Start Tutorial: Get Your Agent Swapping Tokens in 5 Minutes

**Goal:** Make your first automatic token swap with MoltyDEX  
**Time:** 5 minutes  
**Difficulty:** Beginner

---

## Step 1: Install MoltyDEX SDK (1 minute)

### Python
```bash
pip install moltydex
```

### TypeScript/JavaScript
```bash
npm install @moltydex/agent
```

---

## Step 2: Get a Quote (1 minute)

### Python
```python
from moltydex import MoltyDEX

dex = MoltyDEX(api_url="https://api.moltydex.com")

# Get quote for swapping 1 SOL to USDC
quote = dex.quote(
    input_mint="So11111111111111111111111111111111111111112",  # SOL
    output_mint="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",  # USDC
    amount=1_000_000_000  # 1 SOL in lamports
)

print(f"You'll get {quote['output_amount']} USDC")
```

### TypeScript
```typescript
import { MoltyDEX } from '@moltydex/agent';

const dex = new MoltyDEX({ apiUrl: 'https://api.moltydex.com' });

const quote = await dex.quote(
  'So11111111111111111111111111111111111111112', // SOL
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  1_000_000_000 // 1 SOL in lamports
);

console.log(`You'll get ${quote.outputAmount} USDC`);
```

---

## Step 3: Execute Swap (2 minutes)

### Python
```python
# Execute the swap
result = dex.swap(
    input_mint="So11111111111111111111111111111111111111112",  # SOL
    output_mint="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",  # USDC
    amount=1_000_000_000  # 1 SOL
)

print(f"Swap successful! TX: {result['signature']}")
```

### TypeScript
```typescript
const result = await dex.swap(
  'So11111111111111111111111111111111111111112', // SOL
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  1_000_000_000 // 1 SOL
);

console.log(`Swap successful! TX: ${result.signature}`);
```

---

## Step 4: Handle x402 Payments Automatically (1 minute)

### Python
```python
from moltydex import HTTPInterceptor
import requests

# Setup interceptor
interceptor = HTTPInterceptor(
    api_url="https://api.moltydex.com",
    wallet_path="wallet.json"
)

# Now all requests handle 402 automatically!
response = requests.get("https://premium-api.com/data")
data = response.json()  # Works seamlessly!
```

### TypeScript
```typescript
import { HTTPInterceptor } from '@moltydex/agent';

const interceptor = new HTTPInterceptor({
  apiUrl: 'https://api.moltydex.com',
  walletSecretKey: process.env.WALLET_SECRET_KEY,
  autoSwap: true,
});

// Now all fetch() calls handle 402 automatically!
const response = await fetch('https://premium-api.com/data');
const data = await response.json(); // Works seamlessly!
```

---

## That's It! 🎉

Your agent can now:
- ✅ Get swap quotes
- ✅ Execute swaps
- ✅ Handle x402 payments automatically

---

## Next Steps

1. **Read the full docs:** https://www.moltydex.com/developers
2. **Join Discord:** Get help and share your use case
3. **Test with real APIs:** Try with actual x402-protected APIs
4. **Get rewarded:** Join our Beta Tester Program

---

## Common Issues

### "Insufficient Balance"
Make sure your wallet has enough SOL for fees (~0.00001 SOL per transaction).

### "Token Not Found"
Verify the token mint address is correct. Use our token search: `/api/tokens/search`

### "Transaction Failed"
Check Solana network status. Sometimes the network is congested.

---

**Questions?** Join our Discord or check the docs: https://www.moltydex.com/developers

**Ready to build?** Start integrating MoltyDEX into your agent! 🚀
