# Getting Started with MoltyDEX in 5 Minutes

**The fastest way to add automatic x402 payment handling to your AI agent.**

---

## Prerequisites

- Node.js 18+ (or Python 3.8+)
- Solana wallet with some SOL
- 5 minutes

---

## Quick Start: TypeScript/JavaScript

### Step 1: Install

```bash
npm install moltydex
```

### Step 2: Set Up

```typescript
import { HTTPInterceptor } from 'moltydex';

const interceptor = new HTTPInterceptor({
  apiUrl: 'https://api.moltydex.com',
  walletSecretKey: process.env.WALLET_SECRET_KEY,
  autoSwap: true,
});
```

### Step 3: Use It

```typescript
// That's it! All 402 responses handled automatically
const response = await fetch('https://premium-api.com/data');
const data = await response.json();
```

**Done!** Your agent now handles x402 payments automatically.

---

## Quick Start: Python

### Step 1: Install

```bash
pip install moltydex
```

### Step 2: Set Up

```python
from moltydex import MoltyDEX

dex = MoltyDEX(
    wallet_path="wallet.json",
    api_url="https://api.moltydex.com"
)
```

### Step 3: Use It

```python
import requests

response = requests.get('https://premium-api.com/data')

if response.status_code == 402:
    payment_result = dex.handle_402_payment(response)
    if payment_result['success']:
        response = requests.get('https://premium-api.com/data')

if response.ok:
    data = response.json()
```

**Done!** Your agent now handles x402 payments.

---

## What Happens Automatically

1. **402 Detection** - Automatically detects payment requirements
2. **Balance Check** - Checks if you have the required token
3. **Token Swap** - Swaps automatically if needed (SOL → USDC, etc.)
4. **Payment** - Makes payment automatically
5. **Retry** - Retries original request

**Zero manual steps!**

---

## Configuration Options

### Wallet Setup

**Option 1: Environment Variable**
```bash
export WALLET_SECRET_KEY="your-base58-secret-key"
```

**Option 2: File**
```typescript
walletPath: './wallet.json'
```

**Option 3: Array**
```typescript
walletSecretKey: [1, 2, 3, ...] // Secret key array
```

### API URL

```typescript
apiUrl: 'https://api.moltydex.com' // Production
// or
apiUrl: 'http://localhost:3001' // Local development
```

### Auto Swap

```typescript
autoSwap: true // Automatic token swapping (recommended)
// or
autoSwap: false // Manual swap handling
```

---

## Testing

### Test with Small Amount

```typescript
// Start with small amounts to test
const response = await fetch('https://test-api.com/data?amount=0.01');
```

### Check Balance

```typescript
const balance = await agent.getBalance('SOL');
console.log(`Balance: ${balance} SOL`);
```

### Monitor Logs

```typescript
// Enable verbose logging
const agent = new X402AutoPayAgent({
  // ... config
  verbose: true
});
```

---

## Common Issues

### "Insufficient Balance"
**Solution:** Add more SOL to your wallet

### "Swap Failed"
**Solution:** Check token liquidity, try smaller amount

### "Payment Failed"
**Solution:** Verify payment address, check network

---

## Next Steps

1. **Try it** - Make a test API call
2. **Monitor** - Check logs and balances
3. **Scale** - Increase usage gradually
4. **Optimize** - Fine-tune based on usage

---

## Resources

- **Documentation:** https://www.moltydex.com/developers
- **Examples:** https://www.moltydex.com/examples
- **FAQ:** https://www.moltydex.com/faq
- **GitHub:** https://github.com/Djtrixuk/moltydex
- **X:** [@MoltyDEX](https://x.com/MoltyDEX)

---

## Support

**Questions?** Reach out:
- X: [@MoltyDEX](https://x.com/MoltyDEX)
- GitHub: Open an issue
- Website: https://www.moltydex.com

---

**That's it! You're ready to go.** 🚀

Try it now: https://www.moltydex.com
