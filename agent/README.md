# MoltyDEX SDK

> x402 auto-pay agent and API client for Solana token swaps. Zero fees, best prices via Jupiter.

[![npm](https://img.shields.io/npm/v/moltydex)](https://www.npmjs.com/package/moltydex)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

## Features

- **Automatic 402 Handling** — Intercepts and processes x402 payment requirements
- **Token Swapping** — Automatically swaps to required tokens via Jupiter aggregator
- **Pluggable Wallet Architecture** — Bring your own signer: local keys, MPC wallets, hardware wallets, or custodial
- **HTTP Interceptor** — Drop-in `fetch` wrapper that handles payments transparently
- **TypeScript** — Fully typed with exported `TransactionSigner` interface

## Installation

```bash
npm install moltydex
```

## Quick Start

### Option 1: Local Wallet (simplest)

```typescript
import { HTTPInterceptor } from 'moltydex';

const interceptor = new HTTPInterceptor({
  apiUrl: 'https://api.moltydex.com',
  walletPath: '~/.config/solana/id.json',
  autoSwap: true,
});

// All fetch calls now handle 402 responses automatically
const response = await fetch('https://premium-api.com/data');
```

### Option 2: Bring Your Own Signer (MPC, hardware, custodial)

```typescript
import { X402AutoPayAgent, TransactionSigner } from 'moltydex';

// Implement the TransactionSigner interface with any wallet backend
const mySigner: TransactionSigner = {
  getAddress: () => '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
  signTransaction: async (txBase64: string) => {
    // Sign with your MPC provider, hardware wallet, etc.
    return signedTxBase64;
  },
};

const agent = new X402AutoPayAgent({
  apiUrl: 'https://api.moltydex.com',
  signer: mySigner,
});

const result = await agent.handle402(paymentResponse);
```

## TransactionSigner Interface

The `TransactionSigner` interface is the core abstraction that makes MoltyDEX wallet-agnostic. Any wallet backend can implement it:

```typescript
interface TransactionSigner {
  /** Returns the wallet's public key as a base58 string. */
  getAddress(): string;

  /** Signs a base64-encoded Solana transaction, returns signed base64. */
  signTransaction(transactionBase64: string): Promise<string>;

  /** Optional: builds a payment transaction (SOL or SPL token). */
  buildPaymentTransaction?(
    recipientAddress: string,
    tokenMint: string,
    amount: string,
  ): Promise<string>;
}
```

**Built-in implementations:**
- `WalletManager` — loads a local Solana keypair from file or secret key

**You can implement it for:**
- Turnkey MPC wallets
- Crossmint custodial wallets
- Privy embedded wallets
- Lit Protocol distributed keys
- Hardware wallets (Ledger)
- Any custom signing logic

## Configuration

```typescript
interface AgentConfig {
  apiUrl: string;                   // MoltyDEX API URL

  // Option A: Provide a TransactionSigner (for custom/MPC wallets)
  signer?: TransactionSigner;

  // Option B: Let WalletManager create one (backwards-compatible)
  walletPath?: string;              // Path to wallet JSON file
  walletSecretKey?: Uint8Array | number[] | string;
  walletAddress?: string;           // Optional: for verification

  preferredInputToken?: string;     // Token to swap from (default: SOL)
  autoSwap?: boolean;               // Auto-execute swaps (default: true)
  webhookUrl?: string;              // Optional webhook for status updates
  rpcUrl?: string;                  // Optional: override Solana RPC URL
  maxRetries?: number;              // Max retry attempts (default: 3)
  retryDelay?: number;              // Delay between retries in ms (default: 2000)
}
```

## How It Works

```
1. Agent makes API call
   ↓
2. API returns 402 Payment Required
   ↓
3. Auto-Pay Agent intercepts
   ↓
4. Parse payment requirements
   ↓
5. Check balance
   ↓
6. Swap tokens if needed (via Jupiter)
   ↓
7. Sign payment with TransactionSigner
   ↓
8. Wait for confirmation
   ↓
9. Retry original request
   ↓
10. Success!
```

## API Reference

### Classes

| Class | Description |
|-------|-------------|
| `X402AutoPayAgent` | Main agent — accepts `AgentConfig` with either `signer` or key material |
| `HTTPInterceptor` | Drop-in `fetch` wrapper that auto-handles 402 responses |
| `MoltyDEXClient` | Low-level API client for quotes, swaps, balances |
| `WalletManager` | Built-in `TransactionSigner` implementation using local Solana keypairs |

### Types

| Type | Description |
|------|-------------|
| `TransactionSigner` | Interface for pluggable wallet backends |
| `AgentConfig` | Configuration for agent/interceptor |
| `PaymentRequirement` | Parsed 402 payment requirement |
| `AutoPayResult` | Result of a payment attempt |

## Python SDK

Also available on PyPI:

```bash
pip install moltydex
```

See [pypi.org/project/moltydex](https://pypi.org/project/moltydex/) for Python documentation.

## License

MIT — see [LICENSE](./LICENSE)

## Links

- [Website](https://moltydex.com)
- [API Docs](https://moltydex.com/api-docs)
- [Developer Guide](https://moltydex.com/developers)
- [npm](https://www.npmjs.com/package/moltydex)
- [PyPI](https://pypi.org/project/moltydex/)
- [GitHub](https://github.com/Djtrixuk/moltydex)
