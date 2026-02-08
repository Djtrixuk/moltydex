# MoltyDEX Quick Start Guide

Get started with MoltyDEX in 5 minutes!

## What is MoltyDEX?

MoltyDEX is a DEX aggregator built specifically for x402 payments. It automatically swaps tokens when making x402 payments, making it seamless for AI agents.

## Quick Start

### 1. Get a Quote

```bash
curl "https://api.moltydex.com/api/quote?input_mint=So11111111111111111111111111111111111111112&output_mint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=1000000000"
```

**Response:**
```json
{
  "input_amount": "1000000000",
  "output_amount": "145234567",
  "fee_amount": "1000000",
  "price_impact": "0.01"
}
```

### 2. Build Swap Transaction

```bash
curl -X POST https://api.moltydex.com/api/swap/build \
  -H "Content-Type: application/json" \
  -d '{
    "wallet_address": "YOUR_WALLET_ADDRESS",
    "input_mint": "So11111111111111111111111111111111111111112",
    "output_mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "amount": "1000000000",
    "slippage_bps": "50"
  }'
```

**Response:**
```json
{
  "transaction": "base64_encoded_transaction",
  "fee_amount": "1000000"
}
```

### 3. Sign and Send

```javascript
// Using Solana web3.js
import { Transaction } from '@solana/web3.js';

const txBase64 = response.transaction;
const txBytes = Buffer.from(txBase64, 'base64');
const transaction = Transaction.from(txBytes);

// Sign with your wallet
const signed = await wallet.signTransaction(transaction);

// Send to Solana
const signature = await connection.sendRawTransaction(signed.serialize());
```

## Python Example

```python
from moltydex import MoltyDEX

dex = MoltyDEX(
    wallet_path="wallet.json",
    api_url="https://api.moltydex.com"
)

# Get quote
quote = dex.quote(
    "So11111111111111111111111111111111111111112",  # SOL
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",  # USDC
    1_000_000_000  # 1 SOL
)

print(f"Output: {quote['output_amount']} USDC")
print(f"Fee: {quote['fee_amount']}")

# Execute swap
result = dex.swap(
    "So11111111111111111111111111111111111111112",
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    1_000_000_000
)

print(f"Swap tx: {result['signature']}")
```

## x402 Integration

```python
import requests
from moltydex import X402PaymentHandler

handler = X402PaymentHandler("wallet.json")

# Make request to x402-protected API
response = requests.get("https://api.example.com/data")

if response.status_code == 402:
    # Automatically handle payment
    paid_response = handler.handle_402_response(
        response,
        "https://api.example.com/data"
    )
    data = paid_response.json()
```

## Web Interface

Visit https://www.moltydex.com to use the web interface:

1. Connect your wallet (Phantom/Solflare)
2. Select tokens
3. Enter amount
4. Click swap
5. Confirm in wallet

## Common Token Addresses

- **SOL**: `So11111111111111111111111111111111111111112`
- **USDC**: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
- **USDT**: `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB`
- **BONK**: `DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263`

## Next Steps

- **Full Documentation**: https://www.moltydex.com/developers
- **API Reference**: https://www.moltydex.com/api-docs
- **Examples**: See `/examples` directory
- **Support**: Open an issue on GitHub

## Why MoltyDEX?

✅ **Built for x402** - Automatic token swapping for 402 responses  
✅ **Best Prices** - Routes through all major Solana DEXes  
✅ **Simple API** - REST API or Python SDK  
✅ **Secure** - Client-side signing, keys never leave your system  
✅ **Low Fees** - 0.1% per swap  

Get started today: https://www.moltydex.com
