# moltydex

Official SDK for [MoltyDEX](https://moltydex.com) — the x402 token aggregator for AI agents on Solana.

- **Zero fees** on all swaps
- **Best prices** via Jupiter aggregator
- **Automatic x402 payment handling** — your agent pays for APIs automatically
- **Token swaps** — swap any SPL token with one function call

## Install

```bash
npm install moltydex
```

## Quick Start

### API Client (no wallet needed)

```typescript
import { MoltyDEXClient } from 'moltydex';

const client = new MoltyDEXClient('https://api.moltydex.com');

// Get a swap quote
const quote = await client.getQuote(
  'So11111111111111111111111111111111111111112',  // SOL
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  '100000000', // 0.1 SOL in lamports
);

console.log(`Output: ${quote.output_after_fee} USDC`);
```

### x402 Auto-Pay Agent (with wallet)

```typescript
import { X402AutoPayAgent } from 'moltydex';

const agent = new X402AutoPayAgent({
  apiUrl: 'https://api.moltydex.com',
  walletPath: './wallet.json', // or use walletSecretKey
  autoSwap: true,
});

console.log(`Agent wallet: ${agent.getWalletAddress()}`);

// When you get a 402 Payment Required response:
const result = await agent.handle402(paymentResponseBody);

if (result.success) {
  console.log(`Paid! Signature: ${result.payment_signature}`);
}
```

### HTTP Interceptor (zero-config)

Automatically intercepts all `fetch()` calls and handles 402 responses:

```typescript
import { HTTPInterceptor } from 'moltydex';

const interceptor = new HTTPInterceptor({
  apiUrl: 'https://api.moltydex.com',
  walletPath: './wallet.json',
  autoSwap: true,
});

// All fetch() calls now auto-handle 402 Payment Required
const response = await fetch('https://some-x402-api.com/data');
// If it returns 402, the agent pays automatically and retries

// Restore original fetch when done
interceptor.restore();
```

## API Reference

### `MoltyDEXClient`

Stateless API client for MoltyDEX endpoints.

```typescript
const client = new MoltyDEXClient(apiUrl?: string);
```

| Method | Description |
|--------|-------------|
| `getQuote(inputMint, outputMint, amount, slippageBps?)` | Get swap quote |
| `buildSwapTransaction(walletAddress, inputMint, outputMint, amount, slippageBps?)` | Build unsigned swap transaction |
| `sendTransaction(signedTransaction)` | Send signed transaction |
| `getTransactionStatus(signature)` | Check transaction status |
| `getBalance(walletAddress, tokenMint)` | Check token balance |
| `parsePayment(paymentResponseBody)` | Parse x402 payment requirements |
| `autoPay(paymentResponseBody, walletAddress, preferredInputToken?, autoSwap?)` | One-call x402 auto-pay |

### `X402AutoPayAgent`

Full agent with wallet management and automatic payment handling.

```typescript
const agent = new X402AutoPayAgent(config: AgentConfig);
```

**AgentConfig:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `apiUrl` | `string` | required | MoltyDEX API URL |
| `walletPath` | `string?` | — | Path to wallet JSON file |
| `walletSecretKey` | `Uint8Array \| number[] \| string?` | — | Secret key (base58, array, or bytes) |
| `walletAddress` | `string?` | — | For verification |
| `preferredInputToken` | `string?` | SOL | Token to swap from |
| `autoSwap` | `boolean?` | `true` | Auto-swap if insufficient balance |
| `webhookUrl` | `string?` | — | Webhook for transaction updates |
| `rpcUrl` | `string?` | mainnet | Solana RPC URL |

### `WalletManager`

Low-level wallet operations.

```typescript
const wallet = new WalletManager(config: AgentConfig);

wallet.getAddress();                                    // Get public key
wallet.signTransaction(transactionBase64);              // Sign a transaction
wallet.buildPaymentTransaction(recipient, mint, amount); // Build payment tx
wallet.getSOLBalance();                                 // Get SOL balance
```

### `HTTPInterceptor`

Transparent fetch interceptor for x402.

```typescript
const interceptor = new HTTPInterceptor(config: AgentConfig);

interceptor.getAgent();  // Access the underlying agent
interceptor.restore();   // Restore original fetch
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
- **Twitter/X:** [@MoltyDEX](https://x.com/MoltyDEX)

## License

MIT
