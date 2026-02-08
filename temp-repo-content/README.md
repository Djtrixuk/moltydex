# MoltyDEX x402 Integration Example

Complete example demonstrating how to integrate MoltyDEX with x402 Payment Required responses for seamless token swapping.

## What is x402?

x402 is a payment protocol that allows APIs to request payment before serving content. When an API returns a `402 Payment Required` status, it includes payment details (token, amount, network) in the response.

## What is MoltyDEX?

MoltyDEX is a DEX aggregator built specifically for x402 payments. It automatically swaps tokens when agents receive 402 responses, making x402 adoption seamless for AI agents and automated systems.

## Features

✅ **Automatic Token Swapping** - Swaps tokens automatically when needed  
✅ **x402 Response Handling** - Parses and handles 402 Payment Required responses  
✅ **Balance Checking** - Checks token balances before payment  
✅ **Transaction Building** - Builds and signs Solana transactions  
✅ **Error Handling** - Comprehensive error handling and retry logic  

## Quick Start

### Installation

```bash
pip install requests solana
```

### Basic Usage

```python
from x402_handler import X402PaymentHandler

# Initialize handler with your wallet
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
    print(f"Got data: {data}")
```

## How It Works

1. **Make Request** - Your agent makes a request to an x402-protected API
2. **Receive 402** - API returns `402 Payment Required` with payment details
3. **Check Balance** - Handler checks if you have the required token
4. **Swap if Needed** - If balance is insufficient, automatically swaps tokens via MoltyDEX
5. **Make Payment** - Creates and sends payment transaction
6. **Retry Request** - Retries original request with payment proof

## Example: Complete Integration

See `example.py` for a complete working example.

## API Reference

### X402PaymentHandler

#### `__init__(wallet_path: str)`
Initialize handler with wallet file path.

#### `handle_402_response(response: Response, original_url: str) -> Response`
Handle a 402 Payment Required response. Returns the response after payment is made.

#### `_parse_402_response(response: Response) -> dict`
Parse payment requirements from 402 response.

#### `_check_balance(token_address: str) -> int`
Check token balance for the wallet.

#### `_swap_tokens(input_token: str, output_token: str, amount: int) -> bool`
Swap tokens using MoltyDEX API.

## MoltyDEX API

MoltyDEX provides a simple REST API:

- **Get Quote**: `GET /api/quote?input_mint=...&output_mint=...&amount=...`
- **Build Swap**: `POST /api/swap/build`
- **Check Balance**: `GET /api/balance?wallet_address=...&token_mint=...`

Full API docs: https://www.moltydex.com/api-docs

## Web Interface

Try MoltyDEX in your browser: https://www.moltydex.com

## Common Token Addresses

- **SOL**: `So11111111111111111111111111111111111111112`
- **USDC**: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
- **USDT**: `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB`
- **BONK**: `DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263`

## Resources

- **MoltyDEX Website**: https://www.moltydex.com
- **Documentation**: https://www.moltydex.com/developers
- **x402 Protocol**: https://github.com/coinbase/x402
- **Solana Docs**: https://docs.solana.com

## License

MIT

## Contributing

Contributions welcome! Open an issue or submit a PR.

---

Built with ❤️ for the x402 and AI agent communities
