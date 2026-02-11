# moltydex

Official Python SDK for [MoltyDEX](https://moltydex.com) — the x402 token aggregator for AI agents on Solana.

- **Zero fees** on all swaps
- **Best prices** via Jupiter aggregator
- **Automatic x402 payment handling** — your agent pays for APIs automatically
- **Token swaps** — swap any SPL token with one function call

## Install

```bash
pip install moltydex
```

## Quick Start

```python
from moltydex import MoltyDEX

dex = MoltyDEX(
    api_url="https://api.moltydex.com",
    wallet_path="~/.config/solana/id.json",
)

# Get a swap quote
quote = dex.quote(
    token_in="So11111111111111111111111111111111111111112",   # SOL
    token_out="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", # USDC
    amount_in=100_000_000,  # 0.1 SOL in lamports
)
print(f"Output: {quote['output_after_fee']} USDC")
```

## Execute a Swap

```python
result = dex.swap(
    token_in="So11111111111111111111111111111111111111112",
    token_out="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    amount_in=100_000_000,
    wait_for_confirmation=True,
)
print(f"Swap signature: {result['signature']}")
```

## Handle x402 Payments

```python
# When your agent gets a 402 Payment Required response:
result = dex.handle_x402_payment(payment_402_response_body)

if result['ready']:
    print("Payment ready — sufficient balance")
else:
    print(f"Swap completed: {result['swap_result']['signature']}")
```

## One-Call Auto-Pay

```python
result = dex.x402_auto_pay(
    payment_response_body=response_402_body,
    auto_swap=True,
)
print(result)
```

## API Reference

| Method | Description |
|--------|-------------|
| `quote(token_in, token_out, amount_in)` | Get swap quote |
| `swap(token_in, token_out, amount_in)` | Execute swap (build, sign, send) |
| `swap_build(token_in, token_out, amount_in)` | Build unsigned transaction |
| `get_balance(token_mint)` | Check token balance |
| `parse_x402_payment(body)` | Parse 402 response |
| `prepare_x402_payment(requirements)` | Prepare x402 payment |
| `handle_x402_payment(body)` | Full x402 payment flow |
| `x402_auto_pay(body)` | One-call auto-pay |
| `search_tokens(query)` | Search tokens |
| `get_token_by_symbol(symbol)` | Get token by symbol |
| `get_popular_tokens()` | List popular tokens |
| `batch_balances(requests)` | Batch balance checks |
| `batch_quotes(requests)` | Batch swap quotes |
| `get_transaction_status(signature)` | Check transaction status |
| `get_transaction_history()` | Get transaction history |

## Wallet Configuration

```python
# From file
dex = MoltyDEX(wallet_path="./wallet.json")

# From secret key bytes
dex = MoltyDEX(wallet_secret_key=[1, 2, 3, ...])

# From existing Keypair
from solana.keypair import Keypair
kp = Keypair()
dex = MoltyDEX(wallet_keypair=kp)
```

## Common Token Addresses

| Token | Mint Address |
|-------|-------------|
| SOL | `So11111111111111111111111111111111111111112` |
| USDC | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |
| USDT | `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB` |

## Links

- **Website:** [moltydex.com](https://moltydex.com)
- **API Docs:** [moltydex.com/developers](https://moltydex.com/developers)
- **GitHub:** [github.com/Djtrixuk/moltydex](https://github.com/Djtrixuk/moltydex)
- **TypeScript SDK:** `npm install moltydex`
- **Twitter/X:** [@MoltyDEX](https://x.com/MoltyDEX)

## License

MIT
