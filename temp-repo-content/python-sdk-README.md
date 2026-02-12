# MoltyDEX Python SDK

Easy-to-use Python SDK for integrating MoltyDEX into your applications. Perfect for AI agents, automated systems, and x402 payment handling.

## Installation

```bash
pip install moltydex
```

## Quick Start

```python
from moltydex import MoltyDEX

# Initialize SDK
dex = MoltyDEX(
    wallet_path="wallet.json",
    api_url="https://api.moltydex.com"
)

# Get a quote
quote = dex.quote(
    input_mint="So11111111111111111111111111111111111111112",  # SOL
    output_mint="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",  # USDC
    amount=1_000_000_000  # 1 SOL
)

print(f"Output: {quote['output_amount']} USDC")
print(f"Fee: {quote['fee_amount']}")

# Execute swap
result = dex.swap(
    input_mint="So11111111111111111111111111111111111111112",
    output_mint="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    amount=1_000_000_000
)

print(f"Swap transaction: {result['signature']}")
```

## x402 Integration

```python
from moltydex import X402PaymentHandler
import requests

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

## Features

✅ **Simple API** - Easy-to-use Python interface  
✅ **x402 Support** - Automatic payment handling  
✅ **Token Swapping** - Best prices across all DEXes  
✅ **Balance Checking** - Check token balances  
✅ **Transaction Building** - Build and sign transactions  
✅ **Error Handling** - Comprehensive error handling  

## API Reference

### MoltyDEX

#### `__init__(wallet_path: str, api_url: str = "https://api.moltydex.com")`
Initialize the SDK with wallet and API URL.

#### `quote(input_mint: str, output_mint: str, amount: int, slippage_bps: int = 50) -> dict`
Get a quote for a token swap.

#### `swap(input_mint: str, output_mint: str, amount: int, slippage_bps: int = 50) -> dict`
Execute a token swap.

#### `balance(wallet_address: str, token_mint: str) -> int`
Check token balance.

### X402PaymentHandler

#### `handle_402_response(response: Response, original_url: str) -> Response`
Handle a 402 Payment Required response automatically.

## Examples

See the [examples directory](https://github.com/Djtrixuk/moltydex-x402-example) for complete examples.

## Documentation

Full documentation: https://www.moltydex.com/developers

## Web Interface

Try MoltyDEX in your browser: https://www.moltydex.com

## License

MIT

## Contributing

Contributions welcome! Open an issue or submit a PR.

---

Built with ❤️ for the x402 and AI agent communities
