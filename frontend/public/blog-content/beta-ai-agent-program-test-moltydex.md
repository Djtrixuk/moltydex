---
title: "Beta AI Agent Program: How to Create an Agent and Test MoltyDEX"
description: "Step-by-step guide to creating an AI agent and testing MoltyDEX for the beta program. Learn how to set up your agent, command it to test swaps, and understand how we track beta program participants."
keywords: ["beta program", "AI agent", "create agent", "test MoltyDEX", "agent instructions", "beta tracking", "x402 payments", "Solana agents"]
author: "MoltyDEX Team"
date: "2026-02-09"
category: "Tutorial"
tags: ["beta", "tutorial", "agents", "x402", "testing"]
canonical: "https://moltydex.com/blog/beta-ai-agent-program-test-moltydex"
---

# Beta AI Agent Program: How to Create an Agent and Test MoltyDEX

**Complete guide to creating an AI agent and testing MoltyDEX for the beta program. Early testers automatically qualify for $MDEX token airdrops.**

This guide walks you through creating an AI agent, setting it up to use MoltyDEX, and commanding it to test our platform. When your agent completes swaps through MoltyDEX, you'll automatically be added to our beta program list for $MDEX token airdrops.

## What You'll Learn

- How to create a Solana wallet for your agent
- How to set up MoltyDEX SDK
- How to command your agent to test MoltyDEX
- How we track beta program participants
- How to verify your agent qualifies

---

## Step 1: Create a Solana Wallet for Your Agent

### Python Method

```python
from solana.keypair import Keypair
import json

# Generate a new wallet
wallet = Keypair.generate()

# Save the secret key securely
secret_key = list(wallet.secret_key)
with open('agent_wallet.json', 'w') as f:
    json.dump(secret_key, f)

print(f"Agent Wallet Address: {wallet.public_key}")
print("⚠️  Keep agent_wallet.json secure - never share it!")
```

**Output:**
```
Agent Wallet Address: ABC123...XYZ
⚠️  Keep agent_wallet.json secure - never share it!
```

### TypeScript Method

```typescript
import { Keypair } from '@solana/web3.js';
import * as fs from 'fs';

// Generate a new wallet
const wallet = Keypair.generate();

// Save the secret key securely
const secretKey = Array.from(wallet.secretKey);
fs.writeFileSync('agent_wallet.json', JSON.stringify(secretKey));

console.log("Agent Wallet Address:", wallet.publicKey.toBase58());
console.log("⚠️  Keep agent_wallet.json secure - never share it!");
```

---

## Step 2: Fund Your Agent Wallet

Send SOL to your agent's wallet address:

- **Minimum**: 0.1 SOL (for testing)
- **Recommended**: 0.5-1 SOL (for multiple tests)

**Funding Options:**
- Phantom/Solflare wallet transfer
- Centralized exchange withdrawal
- Solana faucet (devnet for testing)

**Your wallet address**: Use the address printed in Step 1

---

## Step 3: Install MoltyDEX SDK

### Python Installation

```bash
pip install requests solana
```

**Download the SDK:**
```bash
# Download agentdex.py from:
# https://github.com/moltydex/moltydex/blob/main/sdk/agentdex.py
```

### TypeScript Installation

```bash
npm install @solana/web3.js axios
```

---

## Step 4: Initialize MoltyDEX in Your Agent

### Python Setup

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

print(f"✅ MoltyDEX initialized for wallet: {wallet.public_key}")
```

### TypeScript Setup

```typescript
import { Keypair } from '@solana/web3.js';
import * as fs from 'fs';
import { MoltyDEX } from './moltydex'; // Your MoltyDEX client

// Load your agent's wallet
const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync('agent_wallet.json', 'utf8')));
const wallet = Keypair.fromSecretKey(secretKey);

// Initialize MoltyDEX
const dex = new MoltyDEX({
  apiUrl: 'https://api.moltydex.com',
  wallet: wallet,
  rpcUrl: 'https://api.mainnet-beta.solana.com'
});

console.log(`✅ MoltyDEX initialized for wallet: ${wallet.publicKey.toBase58()}`);
```

---

## Step 5: Command Your Agent to Test MoltyDEX

### Test 1: Simple Token Swap

**Command to give your agent:**

```
Test MoltyDEX by swapping 0.01 SOL to USDC. Use the swap function with:
- Input token: So11111111111111111111111111111111111111112 (SOL)
- Output token: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v (USDC)
- Amount: 10,000,000 lamports (0.01 SOL)
- Slippage: 50 basis points (0.5%)
```

**Python Code:**

```python
# Swap 0.01 SOL to USDC
result = dex.swap(
    token_in="So11111111111111111111111111111111111111112",  # SOL
    token_out="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",  # USDC
    amount_in=10_000_000,  # 0.01 SOL (in lamports)
    slippage_bps=50  # 0.5% slippage tolerance
)

print(f"✅ Swap successful! Signature: {result['signature']}")
```

**TypeScript Code:**

```typescript
// Swap 0.01 SOL to USDC
const result = await dex.swap({
  tokenIn: 'So11111111111111111111111111111111111111112',  // SOL
  tokenOut: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',  // USDC
  amountIn: 10_000_000,  // 0.01 SOL (in lamports)
  slippageBps: 50  // 0.5% slippage tolerance
});

console.log('✅ Swap successful! Signature:', result.signature);
```

### Test 2: x402 Auto-Pay Flow

**Command to give your agent:**

```
Test MoltyDEX x402 payment flow. Simulate a 402 Payment Required response requiring 1 USDC, then use the x402_auto_pay function to handle it automatically.
```

**Python Code:**

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

if result.get('swap_needed'):
    print("✅ Swap needed - MoltyDEX will handle it automatically")
    print(f"Swap details: {result['swap_needed']}")
else:
    print("✅ Sufficient balance - no swap needed")
```

**TypeScript Code:**

```typescript
// Simulate a 402 Payment Required response
const paymentResponseBody = {
  accepts: [
    {
      network: 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp',
      asset: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',  // USDC
      amount: '1000000'  // 1 USDC (6 decimals)
    }
  ]
};

// MoltyDEX handles everything automatically
const result = await dex.x402AutoPay({
  paymentResponseBody: paymentResponseBody,
  preferredInputToken: 'So11111111111111111111111111111111111111112',  // Start with SOL
  autoSwap: true  // Automatically swap if needed
});

if (result.swapNeeded) {
  console.log('✅ Swap needed - MoltyDEX will handle it automatically');
  console.log('Swap details:', result.swapNeeded);
} else {
  console.log('✅ Sufficient balance - no swap needed');
}
```

---

## Step 6: Agent Instructions (System Prompt)

### For Claude/OpenAI Agents

Add this to your agent's system prompt:

```
You are an AI agent that uses MoltyDEX for automated token swaps when making x402 payments.

**MoltyDEX Integration:**
- API URL: https://api.moltydex.com
- Your wallet address: [YOUR_AGENT_WALLET_ADDRESS]
- SDK initialized: Yes

**Testing Task:**
Complete at least one swap through MoltyDEX to qualify for the beta program reward.

**Instructions:**
1. Test a simple swap: Swap 0.01 SOL to USDC using the swap function
2. Test x402 flow: Use x402_auto_pay with a sample payment requirement
3. Report the transaction signatures after completing swaps

**Token Addresses:**
- SOL: So11111111111111111111111111111111111111112
- USDC: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
- MDEX: HndwegC6q7UGn5MErjvdH6BeQzcWQtjZf1nJX6rhpump

**Documentation:**
- API Docs: https://www.moltydex.com/api-docs
- SDK: https://github.com/moltydex/moltydex/tree/main/sdk
```

### For LangChain/AutoGPT Agents

Add this to your agent's instructions:

```
When you encounter a 402 Payment Required response:
1. Use MoltyDEX (https://api.moltydex.com) to handle the payment automatically
2. Call /api/x402/auto-pay endpoint with the payment response body
3. If a swap is needed, MoltyDEX will provide swap details
4. Complete the swap transaction
5. Retry the original request

To test MoltyDEX for beta program:
- Make a test swap: Swap 0.01 SOL to USDC
- Test x402 flow: Use /api/x402/auto-pay with a sample payment requirement
- Verify your wallet balance after swaps

Early testers of MoltyDEX will receive $MDEX token rewards.
```

---

## How We Track Beta Program Participants

### Automatic Tracking System

MoltyDEX automatically tracks all agent activity through our analytics system. **No registration required** - your wallet address is automatically recorded when you use our APIs.

### What Gets Tracked

**1. Wallet Addresses**
- Automatically recorded when you call any MoltyDEX API endpoint
- Stored securely in our Redis database
- Used to identify beta program participants

**2. Swap Transactions**
- Every swap via `/api/swap/build` is tracked
- Records: wallet address, token pairs, amounts, timestamps
- Transaction signatures stored for verification

**3. x402 Endpoint Usage**
- Calls to `/api/x402/auto-pay` are tracked
- Calls to `/api/x402/prepare-payment` are tracked
- These endpoints are agent-specific (identifies AI agents)

**4. Transaction Signatures**
- On-chain transaction signatures are recorded
- Used to verify swaps on Solana blockchain
- Ensures accurate tracking

### Tracking Endpoints

**When you call these endpoints, your wallet is automatically tracked:**

```python
# These calls automatically track your wallet:
dex.swap(...)                    # Tracks via /api/swap/build
dex.x402_auto_pay(...)          # Tracks via /api/x402/auto-pay
dex.x402_prepare_payment(...)   # Tracks via /api/x402/prepare-payment
dex.quote(...)                  # Tracks via /api/quote
```

### How We Identify Beta Participants

**Qualifying Criteria:**
1. ✅ Wallet address used `/api/x402/*` endpoints (agent-specific)
2. ✅ Wallet completed at least one swap via `/api/swap/build`
3. ✅ Transaction signature verified on Solana blockchain

**Identification Process:**
- Wallets calling `/api/x402/*` endpoints are flagged as agents
- These endpoints are specifically designed for automated x402 payment handling
- Regular users typically use the frontend UI, not these API endpoints

### Viewing Your Activity

**Check Analytics:**
```bash
curl https://api.moltydex.com/api/analytics/stats | python3 -m json.tool
```

**Response includes:**
- Total swaps
- Unique wallets
- API endpoint usage
- Token pair statistics

**Note:** Individual wallet addresses are not exposed in public stats for privacy. We track them internally for beta program qualification.

---

## Verification: How to Know You Qualify

### Check Your Wallet Activity

**1. Verify Swap Completed:**
- Check your Solana wallet on a block explorer (Solscan, Solana Explorer)
- Look for swap transactions
- Verify transaction signatures match your swaps

**2. Verify API Calls:**
- Your wallet address is automatically tracked when you call MoltyDEX APIs
- If you've completed swaps and used x402 endpoints, you're on the list

**3. Check Transaction Signatures:**
```python
# After a swap, save the signature
result = dex.swap(...)
signature = result['signature']
print(f"Swap signature: {signature}")

# Verify on Solscan
print(f"View on Solscan: https://solscan.io/tx/{signature}")
```

### Qualification Checklist

- [ ] Created Solana wallet for agent
- [ ] Funded wallet with SOL
- [ ] Initialized MoltyDEX SDK
- [ ] Completed at least one swap
- [ ] Used x402 endpoints (`/api/x402/auto-pay` or `/api/x402/prepare-payment`)
- [ ] Verified transaction on Solana blockchain

**If all checked:** ✅ You qualify for the beta program!

---

## Beta Program Rewards

### What You Get

- **$MDEX Token Airdrop** - Early AI agents automatically added to airdrop list
- **Token Contract**: `HndwegC6q7UGn5MErjvdH6BeQzcWQtjZf1nJX6rhpump`
- **Network**: Solana Mainnet
- **Distribution**: Direct airdrop to qualifying wallet addresses

### Airdrop Details

- **Amount**: Determined based on program participation
- **Timing**: Distribution schedule announced to qualifying wallets
- **Method**: Automatic - no registration needed
- **Verification**: On-chain transaction signatures

---

## Common Token Addresses

**For your agent's reference:**

| Token | Address | Decimals |
|-------|---------|----------|
| **SOL** | `So11111111111111111111111111111111111111112` | 9 |
| **USDC** | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` | 6 |
| **USDT** | `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB` | 6 |
| **MDEX** | `HndwegC6q7UGn5MErjvdH6BeQzcWQtjZf1nJX6rhpump` | 6 |

---

## Troubleshooting

### Agent Can't Connect to MoltyDEX

**Check:**
- API URL is correct: `https://api.moltydex.com`
- Network connectivity
- RPC URL is set to mainnet: `https://api.mainnet-beta.solana.com`

### Swap Fails

**Common Issues:**
- Insufficient balance (need SOL for fees)
- Slippage too low (try 100 bps = 1%)
- Network congestion (retry)

### Wallet Not Tracked

**Verify:**
- You're calling MoltyDEX APIs (not just frontend)
- Using `/api/x402/*` endpoints for agent identification
- Transaction completed successfully

---

## Next Steps

1. ✅ **Complete Setup** - Follow Steps 1-4
2. ✅ **Test Swaps** - Complete Step 5 tests
3. ✅ **Add Agent Instructions** - Use Step 6 prompts
4. ✅ **Verify Qualification** - Check your wallet activity
5. ✅ **Wait for Airdrop** - Qualifying wallets notified

---

## Resources

- **API Documentation**: https://www.moltydex.com/api-docs
- **Developer Guide**: https://www.moltydex.com/developers
- **SDK Repository**: https://github.com/moltydex/moltydex/tree/main/sdk
- **x402 Protocol**: https://x402.dev
- **Analytics**: https://api.moltydex.com/api/analytics/stats

---

## Summary

**Quick Checklist:**
1. Create wallet → Fund with SOL → Install SDK → Initialize MoltyDEX
2. Command agent to swap 0.01 SOL → USDC
3. Test x402 auto-pay flow
4. Your wallet automatically tracked → Qualify for $MDEX airdrop

**No registration needed** - just use MoltyDEX and you're automatically included in the beta program!

---

**Questions?** Join our Discord or email beta@moltydex.com

**Start testing today and help shape the future of x402 payments! 🚀**

---

*Last Updated: February 9, 2026*
