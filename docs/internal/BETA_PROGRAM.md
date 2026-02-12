# MoltyDEX Beta User Program 🚀

**Rewarding Early AI Agents Who Test MoltyDEX for x402 Payments**

---

## 🎯 Program Overview

MoltyDEX is launching a beta program to encourage AI agents to test our x402 payment infrastructure. Early testers who complete swaps through MoltyDEX will receive **$MDEX token airdrops** as a reward for helping us improve the platform.

### What You Get
- **$MDEX Token Airdrop** - Early AI agents who use MoltyDEX will be added to a list for $MDEX token airdrops
- **Early Access** - Be among the first to use automated x402 token swapping
- **Best Prices** - Access to Jupiter's aggregation across all Solana DEXes
- **Zero Platform Fees** - Completely free swaps (you only pay Solana network fees)

### Program Duration
- **Start Date**: February 2026
- **End Date**: TBD (or until beta program capacity is reached)
- **Reward Distribution**: Weekly airdrops to qualifying wallets

---

## 🤖 For AI Agent Developers

### What is MoltyDEX?

MoltyDEX is a DEX aggregator built specifically for AI agents making x402 payments. When your agent encounters a "402 Payment Required" response, MoltyDEX automatically:

1. **Parses** the payment requirements
2. **Checks** your agent's token balance
3. **Swaps** tokens automatically if needed (e.g., SOL → USDC)
4. **Prepares** the payment transaction
5. **Handles** retries and error cases

**The Problem We Solve:** Your agent has SOL, but the API wants USDC. Without MoltyDEX, your agent fails. With MoltyDEX, it works automatically.

---

## 📋 Setup Instructions

### Step 1: Install the MoltyDEX SDK

**Python (Recommended for AI Agents):**

```bash
pip install requests solana
```

Download the SDK:
```bash
# Clone or download agentdex.py from:
# https://github.com/your-repo/moltydex/blob/main/sdk/agentdex.py
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

---

## 🧪 Testing MoltyDEX

### Test 1: Simple Token Swap

Test that your agent can swap tokens:

**Python:**
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

**TypeScript:**
```typescript
// Swap 0.01 SOL to USDC
const result = await dex.swap({
  tokenIn: 'So11111111111111111111111111111111111111112',  // SOL
  tokenOut: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',  // USDC
  amountIn: 10_000_000,  // 0.01 SOL (in lamports)
  slippageBps: 50  // 0.5% slippage tolerance
});

console.log('Swap successful! Signature:', result.signature);
```

### Test 2: x402 Auto-Pay Flow

Test the complete x402 payment flow:

**Python:**
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
if result.get('swap_needed'):
    print(f"Swap transaction: {result['swap_needed']}")
```

**TypeScript:**
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

console.log('Payment prepared! Swap needed:', !result.hasSufficientBalance);
if (result.swapNeeded) {
  console.log('Swap transaction:', result.swapNeeded);
}
```

### Test 3: Integrate with Your Agent's HTTP Client

**Python Example:**
```python
import requests
from agentdex import MoltyDEX

# Initialize MoltyDEX
dex = MoltyDEX(wallet_keypair=wallet)

def make_request_with_auto_pay(url, **kwargs):
    """Make HTTP request with automatic x402 payment handling"""
    response = requests.get(url, **kwargs)
    
    # If 402 Payment Required, handle it automatically
    if response.status_code == 402:
        payment_result = dex.x402_auto_pay(
            payment_response_body=response.json(),
            auto_swap=True
        )
        
        # Build and send swap if needed
        if payment_result.get('swap_needed'):
            swap_result = dex.swap(
                token_in=payment_result['swap_needed']['input_token'],
                token_out=payment_result['swap_needed']['output_token'],
                amount_in=payment_result['swap_needed']['input_amount'],
            )
            print(f"Swapped tokens: {swap_result['signature']}")
        
        # Retry the original request
        response = requests.get(url, **kwargs)
    
    return response

# Use in your agent
result = make_request_with_auto_pay("https://api.example.com/data")
print(result.json())
```

---

## 🎁 Reward Structure

### Eligibility Criteria

To qualify for the $MDEX airdrop, your agent must:

1. ✅ **Complete at least one swap** through MoltyDEX
2. ✅ **Use x402 endpoints** (`/api/x402/auto-pay` or `/api/x402/prepare-payment`)
3. ✅ **Have a unique wallet address** (one reward per wallet)
4. ✅ **Complete swap before program end date**

### Airdrop Details

Early AI agents who use MoltyDEX for x402 payments will be automatically added to a list for $MDEX token airdrops. The airdrop amount and distribution schedule will be determined based on program participation and will be announced to qualifying wallets.

**What We Track:**
- Wallet addresses that use MoltyDEX API endpoints
- Swap transactions completed through our platform
- x402 payment flows (agents using x402 endpoints)
- Transaction signatures for verification

### How We Track Your Agent

We automatically track:
- **Wallet addresses** that use MoltyDEX API endpoints
- **Swap transactions** completed through our platform
- **x402 payment flows** (agents using x402 endpoints)
- **Transaction signatures** for verification

**We can identify agent wallets by:**
1. Wallets that call `/api/x402/*` endpoints (agent-specific)
2. Wallets that complete swaps via `/api/swap/build`
3. Transaction patterns (automated vs manual)

**Your wallet address is automatically recorded** when you:
- Call `/api/x402/auto-pay`
- Call `/api/x402/prepare-payment`
- Complete a swap via `/api/swap/build`

### Airdrop Distribution

- **Method**: Direct airdrop to qualifying wallet addresses
- **Token**: $MDEX (Contract: `HndwegC6q7UGn5MErjvdH6BeQzcWQtjZf1nJX6rhpump`)
- **Network**: Solana Mainnet
- **Timing**: Distribution schedule will be announced to qualifying wallets

---

## 📝 Instructions for Your Agent

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

---

## 🔍 Verification & Tracking

### How We Verify Agent Wallets

We use multiple methods to identify and verify agent wallets:

1. **API Endpoint Analysis**
   - Wallets calling `/api/x402/*` endpoints are flagged as agents
   - Pattern analysis of request headers and timing

2. **Transaction Pattern Analysis**
   - Automated transaction patterns (consistent timing, amounts)
   - Multiple swaps in short timeframes
   - x402 payment flows followed by retries

3. **Analytics Tracking**
   - Our analytics system (`/api/analytics/stats`) tracks:
     - Unique wallet addresses
     - Swap counts per wallet
     - x402 endpoint usage
     - Transaction signatures

### Viewing Your Agent's Activity

You can check your agent's swap history:

```bash
# Get swap stats for your wallet
curl "https://api.moltydex.com/api/analytics/stats"

# Check your wallet's unique identifier
# (Your wallet address is automatically tracked when you make swaps)
```

### Getting Your Wallet Address

**Python:**
```python
print(f"Agent Wallet: {dex.wallet.public_key}")
```

**TypeScript:**
```typescript
console.log("Agent Wallet:", wallet.publicKey.toBase58());
```

---

## 📚 Additional Resources

### Documentation
- **API Documentation**: https://www.moltydex.com/api-docs
- **Developer Guide**: https://www.moltydex.com/developers
- **x402 Protocol**: https://x402.dev

### SDK & Code Examples
- **Python SDK**: `sdk/agentdex.py`
- **TypeScript Examples**: `agent/` directory
- **API Examples**: `docs/` directory

### Support
- **Discord**: [Join our Discord](https://discord.gg/moltydex)
- **X/Twitter**: [@MoltyDEX](https://x.com/MoltyDEX)
- **Email**: support@moltydex.com

### Example Implementations
- **Simple Swap**: See `sdk/agentdex.py` examples
- **x402 Auto-Pay**: See `api/routes/x402.js` for flow details
- **Full Integration**: Check `README.md` for complete examples

---

## ⚠️ Important Notes

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

### Beta Program Terms
- **One reward per wallet address**
- **Rewards distributed weekly** to qualifying wallets
- **Program may end early** if capacity is reached
- **MoltyDEX reserves the right** to modify program terms

---

## 🚀 Getting Started Checklist

- [ ] Install MoltyDEX SDK (Python or TypeScript)
- [ ] Create a Solana wallet for your agent
- [ ] Fund wallet with SOL (minimum 0.1 SOL)
- [ ] Initialize MoltyDEX in your agent code
- [ ] Complete a test swap (SOL → USDC)
- [ ] Test x402 auto-pay flow
- [ ] Integrate with your agent's HTTP client
- [ ] Monitor your wallet for $MDEX airdrop

---

## 📞 Questions?

If you have questions about the beta program:

1. **Check the documentation** at https://www.moltydex.com/developers
2. **Join our Discord** for community support
3. **Email us** at beta@moltydex.com

**Good luck, and thank you for helping us build the future of x402 payments! 🎉**

---

*Last Updated: February 2026*
*Program Subject to Change*
