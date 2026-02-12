# Pluggable Wallet Architecture: TransactionSigner Interface

**MoltyDEX SDK v1.1 introduces the `TransactionSigner` interface — a clean abstraction that makes the SDK wallet-agnostic. Bring your own MPC wallet, hardware wallet, or custom signing logic.**

---

## Why This Matters

Until now, the MoltyDEX SDK was tightly coupled to local Solana keypairs. If you wanted to use an MPC wallet like Turnkey, a custodial solution like Crossmint, or a hardware wallet like Ledger, you were out of luck — the SDK assumed it could read a private key from a file.

With v1.1, we've extracted a `TransactionSigner` interface that separates **what gets signed** from **how it gets signed**. The SDK no longer cares where your private key lives.

---

## The Interface

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

Three methods. Two required, one optional. That's it.

---

## How to Use It

### Existing users: Nothing changes

If you're already using `walletPath` or `walletSecretKey`, everything works exactly as before. The built-in `WalletManager` class now implements `TransactionSigner` under the hood.

```typescript
import { HTTPInterceptor } from 'moltydex';

// This still works — WalletManager is created automatically
const interceptor = new HTTPInterceptor({
  apiUrl: 'https://api.moltydex.com',
  walletPath: '~/.config/solana/id.json',
  autoSwap: true,
});
```

### New: Pass a custom signer

```typescript
import { X402AutoPayAgent, TransactionSigner } from 'moltydex';

// Example: Turnkey MPC signer
const turnkeySigner: TransactionSigner = {
  getAddress: () => turnkeyWallet.address,
  signTransaction: async (txBase64) => {
    const signed = await turnkeyClient.signTransaction({
      walletId: turnkeyWallet.id,
      transaction: txBase64,
    });
    return signed.signedTransaction;
  },
};

const agent = new X402AutoPayAgent({
  apiUrl: 'https://api.moltydex.com',
  signer: turnkeySigner,
});
```

### New: Pass via AgentConfig

```typescript
const config: AgentConfig = {
  apiUrl: 'https://api.moltydex.com',
  signer: myCustomSigner,     // Option A: custom signer
  // walletPath: './key.json', // Option B: local key (backwards-compatible)
  autoSwap: true,
};
```

---

## What You Can Build With This

| Wallet Backend | Use Case |
|---------------|----------|
| **Turnkey MPC** | Non-custodial agent wallets with policy controls |
| **Crossmint** | Custodial wallets with email/social login |
| **Privy** | Embedded wallets in web apps |
| **Lit Protocol** | Distributed key management across nodes |
| **Ledger/Trezor** | Hardware wallet signing for high-value agents |
| **Server-side keypair** | Simple programmatic wallets for testing |
| **Multi-sig** | Require multiple approvals before signing |

---

## Architecture

The refactoring is minimal but impactful:

```
Before v1.1:
  X402AutoPayAgent → WalletManager (local keypair only)

After v1.1:
  X402AutoPayAgent → TransactionSigner (interface)
                        ├── WalletManager (local keypair — built-in)
                        ├── TurnkeyMPCSigner (your implementation)
                        ├── CrossmintSigner (your implementation)
                        └── AnythingElse (your implementation)
```

The `X402AutoPayAgent` and `HTTPInterceptor` don't know or care how transactions get signed. They just call `getAddress()` and `signTransaction()`.

---

## Install

```bash
npm install moltydex
```

```bash
pip install moltydex
```

---

## What's Next

This interface is the foundation for:

1. **Server-side wallet creation** — programmatic wallets for agents that don't have their own keys
2. **Spending limits** — per-wallet daily/transaction caps enforced at the signer level
3. **Full MPC integration** — Turnkey or similar provider as a first-party `TransactionSigner` implementation

We're shipping incrementally. The interface ships now; implementations follow as demand proves out.

---

## Links

- [npm package](https://www.npmjs.com/package/moltydex)
- [PyPI package](https://pypi.org/project/moltydex/)
- [GitHub](https://github.com/Djtrixuk/moltydex)
- [Developer docs](https://moltydex.com/developers)

*Published February 11, 2026 by the MoltyDEX Team*
