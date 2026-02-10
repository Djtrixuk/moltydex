---
title: "MoltyDEX Beta Program: $MDEX Airdrop for Early AI Agents"
description: "Join the MoltyDEX beta program for AI agents. Early testers who use MoltyDEX for x402 payments will be added to a list for $MDEX token airdrops. Get started with automatic token swapping today."
keywords: ["beta program", "MDEX airdrop", "AI agents", "x402 payments", "token swapping", "Solana agents", "early adopters", "beta testing"]
author: "MoltyDEX Team"
date: "2026-02-05"
category: "Community"
tags: ["beta", "airdrop", "MDEX", "x402", "agents", "rewards"]
canonical: "https://moltydex.com/blog/moltydex-beta-program-early-ai-agents-mdex-airdrop"
---

# MoltyDEX Beta Program: $MDEX Airdrop for Early AI Agents

**Early AI agents who use MoltyDEX for x402 payments will be automatically added to a list for $MDEX token airdrops. Start testing today and help shape the future of agent payments.**

We're excited to announce the **MoltyDEX Beta Program** for AI agents! If you're building agents that make [x402 payments](https://x402.dev) or need automatic token swapping, this is your chance to be among the first to use [MoltyDEX](https://www.moltydex.com) and earn $MDEX tokens for helping us improve the platform.

## What is the Beta Program?

The MoltyDEX Beta Program rewards early AI agents who test our x402 payment infrastructure. When your agent uses MoltyDEX to handle x402 payments and complete token swaps, you'll automatically be added to a list for **$MDEX token airdrops**.

**No registration required** - simply use MoltyDEX and your wallet address will be tracked automatically.

## Why We're Launching This Program

MoltyDEX is built specifically for AI agents making x402 payments. To make it the best solution possible, we need:

- **Real-world testing** - See how agents actually use MoltyDEX in production
- **Edge case discovery** - Find bugs and issues we haven't encountered yet
- **Feature feedback** - Understand what agents actually need
- **Use case validation** - Confirm our approach works in real agent workflows

**Your participation helps us build the best automatic token swapping solution for agents.**

## What You Get

### 🎁 $MDEX Token Airdrop

Early AI agents who use MoltyDEX will be automatically added to a list for **$MDEX token airdrops**. The airdrop amount and distribution schedule will be determined based on program participation and will be announced to qualifying wallets.

**$MDEX Token Details:**
- **Contract Address**: `HndwegC6q7UGn5MErjvdH6BeQzcWQtjZf1nJX6rhpump`
- **Network**: Solana Mainnet
- **Distribution**: Direct airdrop to qualifying wallet addresses

### 🚀 Additional Benefits

- **Early Access** - Be among the first to use automated x402 token swapping
- **Best Prices** - Access to Jupiter's aggregation across all Solana DEXes
- **Zero Platform Fees** - Completely free swaps (you only pay Solana network fees)
- **Shape the Product** - Your feedback directly influences MoltyDEX development

## How to Qualify

### Eligibility Criteria

To qualify for the $MDEX airdrop, your agent must:

1. ✅ **Complete at least one swap** through MoltyDEX
2. ✅ **Use x402 endpoints** (`/api/x402/auto-pay` or `/api/x402/prepare-payment`)
3. ✅ **Have a unique wallet address** (one reward per wallet)
4. ✅ **Complete swap before program end date**

### How We Track Your Agent

**We automatically track:**
- Wallet addresses that use MoltyDEX API endpoints
- Swap transactions completed through our platform
- x402 payment flows (agents using x402 endpoints)
- Transaction signatures for verification

**Your wallet address is automatically recorded** when you:
- Call `/api/x402/auto-pay`
- Call `/api/x402/prepare-payment`
- Complete a swap via `/api/swap/build`

**No registration or sign-up required** - just use MoltyDEX and you're automatically included!

## Quick Start Guide

### Step 1: Install the MoltyDEX SDK

**Python (Recommended for AI Agents):**

```bash
pip install requests solana
```

Download the SDK:
```bash
# Download agentdex.py from:
# https://github.com/moltydex/moltydex/blob/main/sdk/agentdex.py
```

**TypeScript/JavaScript:**

```bash
npm install @solana/web3.js axios
```

### Step 2: Create a Solana Wallet for Your Agent

**Python:**
```python
from solana.keypair import Keypair
import json

# Generate a new wallet
wallet = Keypair.generate()

# Save the secret key (keep this secure!)
secret_key = list(wallet.secret_key)
with open('agent_wallet.json', 'w') as f:
    json.dump(secret_key, f)

print(f"Agent Wallet Address: {wallet.public_key}")
```

**TypeScript:**
```typescript
import { Keypair } from '@solana/web3.js';

// Generate a new wallet
const wallet = Keypair.generate();

// Save the secret key (keep this secure!)
const secretKey = Array.from(wallet.secretKey);
console.log("Agent Wallet Address:", wallet.publicKey.toBase58());
```

### Step 3: Fund Your Agent Wallet

Send some SOL to your agent's wallet address for testing:
- **Minimum**: ~0.1 SOL (for testing small swaps)
- **Recommended**: 0.5-1 SOL (for multiple test transactions)

You can fund via:
- Phantom/Solflare wallet
- Centralized exchange withdrawal
- Solana faucet (devnet for testing)

### Step 4: Initialize MoltyDEX in Your Agent

**Python:**
```python
from agentdex import MoltyDEX
from solana.keypair import Keypair
import json

# Load your agent's wallet
with open('agent_wallet.json', 'r') as f:
    secret_key = json.load(f)
wallet = Keypair.from_secret_key(bytes(secret_key))

# Initialize MoltyDEX
dex = MoltyDEX(
    api_url="https://api.moltydex.com",
    wallet_keypair=wallet,
    rpc_url="https://api.mainnet-beta.solana.com"  # Use mainnet for real swaps
)
```

**TypeScript:**
```typescript
import { Keypair, Connection } from '@solana/web3.js';
import { MoltyDEX } from './moltydex'; // Your MoltyDEX client

// Load your agent's wallet
const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync('agent_wallet.json')));
const wallet = Keypair.fromSecretKey(secretKey);

// Initialize MoltyDEX
const dex = new MoltyDEX({
  apiUrl: 'https://api.moltydex.com',
  wallet: wallet,
  rpcUrl: 'https://api.mainnet-beta.solana.com'
});
```

### Step 5: Test MoltyDEX

**Test 1: Simple Token Swap**

```python
# Swap 0.01 SOL to USDC
result = dex.swap(
    token_in="So11111111111111111111111111111111111111112",  # SOL
    token_out="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",  # USDC
    amount_in=10_000_000,  # 0.01 SOL (in lamports)
    slippage_bps=50  # 0.5% slippage tolerance
)

print(f"Swap successful! Signature: {result['signature']}")
```

**Test 2: x402 Auto-Pay Flow**

```python
# Simulate a 402 Payment Required response
payment_response_body = {
    "accepts": [
        {
            "network": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
            "asset": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",  # USDC
            "amount": "1000000"  # 1 USDC (6 decimals)
        }
    ]
}

# MoltyDEX handles everything automatically
result = dex.x402_auto_pay(
    payment_response_body=payment_response_body,
    preferred_input_token="So11111111111111111111111111111111111111112",  # Start with SOL
    auto_swap=True  # Automatically swap if needed
)

print(f"Payment prepared! Swap needed: {not result.get('has_sufficient_balance')}")
```

## Instructions for Your Agent

### Tell Your Agent to Test MoltyDEX

Add these instructions to your agent's system prompt or instructions:

```
You are an AI agent that can make payments using the x402 protocol.

When you encounter a 402 Payment Required response:
1. Use MoltyDEX (https://api.moltydex.com) to handle the payment automatically
2. Call the /api/x402/auto-pay endpoint with the payment response body
3. If a swap is needed, MoltyDEX will provide swap details
4. Complete the swap transaction
5. Retry the original request

To test MoltyDEX:
- Make a test swap: Swap 0.01 SOL to USDC
- Test x402 flow: Use /api/x402/auto-pay with a sample payment requirement
- Verify your wallet balance after swaps

Early testers of MoltyDEX will receive $MDEX token rewards.
```

### Example Agent Instructions (Claude/OpenAI)

```
You are an AI agent that uses MoltyDEX for automated token swaps when making x402 payments.

**MoltyDEX Integration:**
- API URL: https://api.moltydex.com
- Your wallet address: [YOUR_AGENT_WALLET_ADDRESS]
- When you receive a 402 Payment Required response, use MoltyDEX to:
  1. Parse the payment requirements via POST /api/x402/parse-payment
  2. Check balance and prepare swap via POST /api/x402/prepare-payment
  3. Build swap transaction via POST /api/swap/build
  4. Sign and send the transaction
  5. Retry the original request

**Testing Task:**
Complete at least one swap through MoltyDEX to qualify for the beta program reward.
Swap 0.01 SOL to USDC as a test transaction.

**Documentation:**
- API Docs: https://www.moltydex.com/api-docs
- SDK: https://github.com/moltydex/moltydex/tree/main/sdk
```

## What We're Looking For

### Test Scenarios

**1. Token Swapping**
- Test swaps between various token pairs (SOL ↔ USDC, USDT, JUP, etc.)
- Test different swap amounts (small, medium, large)
- Test edge cases (low liquidity, high slippage)

**2. x402 Payment Handling**
- Test automatic 402 response handling
- Test payment flow end-to-end
- Test retry logic and error handling

**3. API Integration**
- Test MoltyDEX API endpoints
- Test SDK integration (TypeScript, Python)
- Test error handling and edge cases

**4. Real-World Use Cases**
- Test with actual agent workflows
- Test with multiple APIs
- Test long-running agents

## Program Details

### Program Duration

- **Start Date**: February 2026
- **End Date**: TBD (or until beta program capacity is reached)
- **Airdrop Distribution**: Schedule will be announced to qualifying wallets

### How Airdrops Work

1. **Automatic Tracking**: Your wallet address is automatically tracked when you use MoltyDEX APIs
2. **Qualification**: Complete at least one swap and use x402 endpoints
3. **List Addition**: Qualifying wallets are added to the airdrop list
4. **Distribution**: $MDEX tokens are airdropped directly to your wallet address

### Verification

**To verify your wallet qualifies:**

1. **Check if wallet used x402 endpoints:**
   - Wallets calling `/api/x402/*` endpoints are automatically tracked
   - These endpoints are agent-specific

2. **Check swap history:**
   - Wallets that complete swaps via `/api/swap/build` are tracked
   - Transaction signatures are recorded for verification

3. **Verify on-chain:**
   - Check transaction signatures from swap history
   - Verify transactions exist on Solana
   - Confirm wallet address matches

## FAQ

### How do I get started?

1. Install the MoltyDEX SDK (Python or TypeScript)
2. Create a Solana wallet for your agent
3. Fund wallet with SOL (minimum 0.1 SOL)
4. Initialize MoltyDEX in your agent code
5. Complete a test swap (SOL → USDC)
6. Test x402 auto-pay flow

### Do I need to register?

**No registration required!** Your wallet address is automatically tracked when you use MoltyDEX APIs. Just use the platform and you're automatically included.

### How are airdrops distributed?

- **Method**: Direct airdrop to qualifying wallet addresses
- **Token**: $MDEX (Contract: `HndwegC6q7UGn5MErjvdH6BeQzcWQtjZf1nJX6rhpump`)
- **Network**: Solana Mainnet
- **Timing**: Distribution schedule will be announced to qualifying wallets

### What counts as "qualifying"?

To qualify, your agent must:
- Complete at least one swap through MoltyDEX
- Use x402 endpoints (`/api/x402/auto-pay` or `/api/x402/prepare-payment`)
- Have a unique wallet address (one reward per wallet)

### Can I use multiple wallets?

Each wallet address is tracked separately. However, the program is designed to reward genuine agent usage, not multiple accounts from the same user.

### How do I know if my wallet qualifies?

Your wallet is automatically tracked when you:
- Call `/api/x402/auto-pay`
- Call `/api/x402/prepare-payment`
- Complete a swap via `/api/swap/build`

If you've completed swaps and used x402 endpoints, your wallet is on the list!

### What if I have questions?

- **Documentation**: https://www.moltydex.com/developers
- **API Docs**: https://www.moltydex.com/api-docs
- **Discord**: Join our Discord for community support
- **Email**: beta@moltydex.com

## Security & Best Practices

### Security

- **Never share your wallet's secret key**
- **Use environment variables** for sensitive data
- **Test on devnet first** before using mainnet
- **Start with small amounts** for testing

### Limitations

- **Minimum swap amounts** may apply (check Jupiter limits)
- **Network fees** are paid by you (Solana transaction fees)
- **Slippage tolerance** should be set appropriately
- **Rate limits** may apply during high usage

## Get Started Today

Ready to join the beta program and earn $MDEX tokens?

**1. Set Up Your Agent:**
- Install MoltyDEX SDK
- Create and fund a Solana wallet
- Initialize MoltyDEX in your agent

**2. Test MoltyDEX:**
- Complete a test swap (SOL → USDC)
- Test x402 auto-pay flow
- Integrate with your agent's HTTP client

**3. Get Rewarded:**
- Your wallet is automatically tracked
- Qualifying wallets added to airdrop list
- Receive $MDEX tokens when distributed

**Start testing today and help shape the future of x402 payments! 🚀**

---

## Related Articles

- [Why Agents Need Automatic Token Swapping](/blog/why-agents-need-automatic-token-swapping)
- [Complete Guide to x402 Payments](/blog/complete-guide-x402-payments)
- [How MoltyDEX Handles x402 Payments Automatically](/blog/how-moltydex-handles-x402-payments-automatically)
- [How to Integrate MoltyDEX with Your AI Agent](/blog/how-to-integrate-moltydex-ai-agent-complete-guide)

## Resources

- **MoltyDEX Documentation**: https://www.moltydex.com/developers
- **API Documentation**: https://www.moltydex.com/api-docs
- **SDK Repository**: https://github.com/moltydex/moltydex/tree/main/sdk
- **x402 Protocol**: https://x402.dev

---

*Last Updated: February 2026*
*Program Subject to Change*
