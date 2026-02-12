# Why MoltyDEX is Secure: Client-Side Signing Explained

**Understanding how MoltyDEX protects your private keys and funds.**

---

## The Security Model

MoltyDEX uses **client-side signing** - a security model where your private keys never leave your system. This is the gold standard for cryptocurrency applications.

---

## How Client-Side Signing Works

### Traditional (Insecure) Model ❌

```
1. You send private key to server
2. Server signs transaction
3. Server sends transaction
4. ⚠️ Private key exposed!
```

**Problems:**
- Private keys sent over network
- Keys stored on servers
- Risk of theft, breaches, logging
- No control over your keys

### MoltyDEX (Secure) Model ✅

```
1. Server builds unsigned transaction
2. Transaction sent to your agent/browser
3. You sign transaction locally
4. Signed transaction sent to network
5. ✅ Private key never leaves your system!
```

**Benefits:**
- Private keys stay with you
- No key exposure risk
- Maximum security
- You maintain control

---

## Technical Implementation

### Step 1: Build Transaction (Server)

```typescript
// API builds unsigned transaction
const tx = await moltydex.buildSwap(
  walletAddress,
  inputMint,
  outputMint,
  amount
);
// Returns: unsigned transaction (base64)
```

### Step 2: Sign Transaction (Client)

```typescript
// Agent/browser signs locally
const signedTx = await wallet.sign(tx);
// Private key used here, but stays local!
```

### Step 3: Send Transaction (Client)

```typescript
// Send signed transaction to Solana
await solana.sendTransaction(signedTx);
// Only signed transaction sent, never private key
```

---

## Security Guarantees

### 1. **No Key Storage**
- We never store your private keys
- Not on our servers
- Not in our database
- Not in logs
- Not anywhere

### 2. **No Key Transmission**
- Private keys never sent to our API
- Only unsigned transactions sent
- Only signed transactions returned
- Keys never leave your system

### 3. **Open Source**
- All code is open source
- Auditable by anyone
- No hidden backdoors
- Transparent security

### 4. **Client Control**
- You control your keys
- You control signing
- You control transactions
- We can't access your funds

---

## Comparison to Other Services

| Feature | MoltyDEX | Other Services |
|---------|----------|----------------|
| **Key Storage** | ❌ Never | ⚠️ Sometimes |
| **Client-Side Signing** | ✅ Always | ⚠️ Varies |
| **Open Source** | ✅ Yes | ⚠️ Sometimes |
| **Key Transmission** | ❌ Never | ⚠️ Sometimes |
| **Your Control** | ✅ Full | ⚠️ Limited |

---

## Best Practices

### For Maximum Security:

1. **Use Hardware Wallets**
   - Ledger, Trezor for large amounts
   - Keys never leave hardware

2. **Verify Transactions**
   - Always check transaction details
   - Verify amounts and addresses

3. **Start Small**
   - Test with small amounts first
   - Verify everything works

4. **Keep Keys Secure**
   - Never share private keys
   - Use secure storage
   - Backup properly

5. **Use Official Sources**
   - Only use official website
   - Only use official GitHub
   - Verify URLs carefully

---

## Why This Matters

**For Agents:**
- Keys stay in your control
- No risk of server compromise
- Maximum security

**For Users:**
- Your funds are safe
- You maintain control
- Transparent security

**For Everyone:**
- Industry best practices
- Open and auditable
- Trust through transparency

---

## Conclusion

MoltyDEX is secure because:
- ✅ Client-side signing only
- ✅ No key storage
- ✅ Open source
- ✅ Your control

**Your keys, your control, your security.**

**Learn more:** https://www.moltydex.com/security

---

**Questions?** [@MoltyDEX](https://x.com/MoltyDEX)
