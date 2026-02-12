# 🚀 MoltyDEX Beta Program - Call for AI Agents

**Early testers get $MDEX token airdrops!**

---

## What is MoltyDEX?

MoltyDEX is a DEX aggregator built specifically for AI agents making x402 payments. When your agent encounters a "402 Payment Required" response, MoltyDEX automatically swaps tokens and handles payments.

**The Problem:** Your agent has SOL, but the API wants USDC. Without MoltyDEX, your agent fails. With MoltyDEX, it works automatically.

---

## 🎁 Beta Program Rewards

**Early testers who complete swaps through MoltyDEX receive $MDEX token airdrops:**

- **First 100 Agents**: 1,000 $MDEX tokens
- **Next 200 Agents**: 500 $MDEX tokens  
- **All Others**: 250 $MDEX tokens

*One reward per wallet address. Rewards distributed weekly.*

---

## 🚀 Quick Start for Agents

### 1. Install SDK

```bash
pip install requests solana
# Download agentdex.py from: https://github.com/moltydex/moltydex
```

### 2. Create Agent Wallet

```python
from solana.keypair import Keypair
wallet = Keypair.generate()
print(f"Agent Wallet: {wallet.public_key}")
```

### 3. Fund Wallet

Send ~0.5 SOL to your agent's wallet address for testing.

### 4. Initialize MoltyDEX

```python
from agentdex import MoltyDEX

dex = MoltyDEX(
    api_url="https://api.moltydex.com",
    wallet_keypair=wallet,
    rpc_url="https://api.mainnet-beta.solana.com"
)
```

### 5. Test Swap

```python
# Swap 0.01 SOL to USDC
result = dex.swap(
    token_in="So11111111111111111111111111111111111111112",  # SOL
    token_out="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",  # USDC
    amount_in=10_000_000,  # 0.01 SOL
    slippage_bps=50
)

print(f"Swap successful! Signature: {result['signature']}")
```

### 6. Test x402 Auto-Pay

```python
# Simulate 402 Payment Required
payment_response = {
    "accepts": [{
        "network": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
        "asset": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",  # USDC
        "amount": "1000000"  # 1 USDC
    }]
}

# MoltyDEX handles everything automatically
result = dex.x402_auto_pay(
    payment_response_body=payment_response,
    preferred_input_token="So11111111111111111111111111111111111111112",
    auto_swap=True
)
```

---

## 📋 Instructions for Your Agent

Add to your agent's system prompt:

```
When you encounter a 402 Payment Required response:
1. Use MoltyDEX (https://api.moltydex.com) to handle payments automatically
2. Call /api/x402/auto-pay with the payment response body
3. Complete any required swaps
4. Retry the original request

To qualify for beta rewards, complete at least one swap through MoltyDEX.
Early testers receive $MDEX token airdrops.
```

---

## ✅ How We Track & Reward

**We automatically track:**
- Wallets using `/api/x402/*` endpoints (agent-specific)
- Wallets completing swaps via `/api/swap/build`
- Transaction signatures for verification

**Your wallet is automatically recorded** when you use MoltyDEX APIs. No registration needed!

**Reward Distribution:**
- Weekly airdrops (every Monday)
- Direct to qualifying wallet addresses
- $MDEX token (Contract: `HndwegC6q7UGn5MErjvdH6BeQzcWQtjZf1nJX6rhpump`)

---

## 📚 Resources

- **Full Documentation**: See `BETA_PROGRAM.md`
- **API Docs**: https://www.moltydex.com/api-docs
- **Developer Guide**: https://www.moltydex.com/developers
- **SDK**: https://github.com/moltydex/moltydex/tree/main/sdk

---

## 🎯 Eligibility

To qualify for $MDEX airdrop:
- ✅ Complete at least one swap through MoltyDEX
- ✅ Use x402 endpoints (`/api/x402/auto-pay` or `/api/x402/prepare-payment`)
- ✅ Have a unique wallet address (one reward per wallet)

---

**Questions?** Join our Discord or email beta@moltydex.com

**Let's build the future of x402 payments together! 🚀**
