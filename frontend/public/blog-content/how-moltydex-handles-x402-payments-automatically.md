---
title: "How MoltyDEX Handles x402 Payments Automatically: Complete Technical Guide"
description: "Learn exactly how MoltyDEX handles x402 Payment Required responses automatically. Step-by-step guide to automatic token swapping, payment processing, and request retry logic for AI agents."
keywords: ["x402 payments", "automatic payment handling", "x402 protocol", "token swapping", "agent automation", "Solana payments", "x402 flow"]
author: "MoltyDEX Team"
date: "2026-02-08"
category: "Technical"
tags: ["x402", "payments", "automation", "Solana", "agents"]
canonical: "https://moltydex.com/blog/how-moltydex-handles-x402-payments-automatically"
---

# How MoltyDEX Handles x402 Payments Automatically: Complete Technical Guide

**A detailed technical walkthrough of how MoltyDEX automatically handles x402 Payment Required responses for AI agents.**

The [x402 payment protocol](https://x402.dev) enables APIs to request payment on-demand, but handling these payments manually is complex. [MoltyDEX](https://www.moltydex.com) automates the entire process, from detecting 402 responses to making payments and retrying requests. In this comprehensive guide, we'll walk through exactly how MoltyDEX handles x402 payments automatically.

## Understanding x402 Payment Flow

### What Happens Without MoltyDEX

When an AI agent encounters a 402 response without automatic handling:

```
1. Agent calls API
2. API returns 402 Payment Required
3. Agent must:
   - Parse payment details
   - Check token balance
   - Swap tokens if needed
   - Build payment transaction
   - Sign and send payment
   - Wait for confirmation
   - Retry original request
4. Many steps can fail → Manual intervention needed
```

**Result**: Complex, error-prone, breaks automation

### What Happens With MoltyDEX

With MoltyDEX, the same flow becomes:

```
1. Agent calls API
2. API returns 402 Payment Required
3. MoltyDEX automatically:
   - Detects 402 response
   - Parses payment details
   - Checks balance
   - Swaps tokens if needed
   - Makes payment
   - Retries request
4. Agent receives data → Continues working
```

**Result**: Fully automated, zero manual intervention

## Step-by-Step: How MoltyDEX Handles x402 Payments

### Step 1: Detect 402 Response

When your agent makes an API call, MoltyDEX intercepts the response:

```typescript
// Agent makes request
const response = await fetch('https://api.example.com/data');

// MoltyDEX HTTPInterceptor checks status
if (response.status === 402) {
  // Automatically handles payment
  return await handle402Response(response, url);
}
```

**What MoltyDEX Does:**
- Monitors all HTTP responses
- Detects 402 status codes automatically
- Intercepts before agent sees failure
- Triggers automatic payment handling

**Key Features:**
- ✅ Automatic detection
- ✅ No code changes needed
- ✅ Works with any HTTP client
- ✅ Transparent to agent logic

### Step 2: Parse Payment Requirements

MoltyDEX parses the 402 response to extract payment details:

**402 Response Format:**
```json
{
  "accepts": [
    {
      "scheme": "solana",
      "token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "amount": "1000000",
      "network": "mainnet",
      "payTo": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
    }
  ]
}
```

**MoltyDEX Parsing:**
```typescript
function parse402Response(response) {
  const data = await response.json();
  const paymentOption = data.accepts[0]; // Select first option
  
  return {
    scheme: paymentOption.scheme,        // "solana"
    token: paymentOption.token,          // USDC address
    amount: BigInt(paymentOption.amount), // 1000000 (1 USDC)
    network: paymentOption.network,      // "mainnet"
    payTo: paymentOption.payTo           // Payment address
  };
}
```

**What MoltyDEX Extracts:**
- Required token (USDC, USDT, SOL, etc.)
- Payment amount
- Payment address
- Network (mainnet/testnet)
- Payment scheme

### Step 3: Check Token Balance

MoltyDEX checks if the agent has enough of the required token:

```typescript
async function checkBalance(wallet, requiredToken, requiredAmount) {
  // Get token balance from wallet
  const balance = await getTokenBalance(wallet, requiredToken);
  
  // Check if sufficient
  if (balance >= requiredAmount) {
    return { hasEnough: true, balance };
  }
  
  return { hasEnough: false, balance };
}
```

**Balance Check Logic:**
- Queries wallet for token balance
- Compares with required amount
- Determines if swap is needed
- Handles native SOL vs SPL tokens

**If Balance Sufficient:**
- Skip to Step 5 (Make Payment)
- No swap needed

**If Balance Insufficient:**
- Proceed to Step 4 (Swap Tokens)

### Step 4: Swap Tokens (If Needed)

If the agent doesn't have enough of the required token, MoltyDEX automatically swaps:

#### 4a. Get Swap Quote

MoltyDEX requests a quote from Jupiter Aggregator:

```typescript
async function getSwapQuote(inputMint, outputMint, amount) {
  const response = await fetch(
    `https://api.moltydex.com/api/quote?` +
    `inputMint=${inputMint}&` +
    `outputMint=${outputMint}&` +
    `amount=${amount}&` +
    `slippageBps=50` // 0.5% slippage
  );
  
  return await response.json();
}
```

**Quote Response:**
```json
{
  "inputMint": "So11111111111111111111111111111111111111112",
  "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "inAmount": "1000000000",
  "outAmount": "985000000",
  "priceImpactPct": 0.15,
  "route": {
    "marketInfos": [...]
  }
}
```

**What MoltyDEX Gets:**
- Input amount needed
- Output amount received
- Price impact percentage
- Optimal swap route
- Best price across all DEXes

#### 4b. Build Swap Transaction

MoltyDEX builds the swap transaction:

```typescript
async function buildSwapTransaction(quote, wallet) {
  const response = await fetch('https://api.moltydex.com/api/swap/build', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      quote: quote,
      userPublicKey: wallet.publicKey.toString(),
      wrapUnwrapSOL: true,
      dynamicComputeUnitLimit: true,
      prioritizationFeeLamports: 1000
    })
  });
  
  return await response.json();
}
```

**Transaction Response:**
```json
{
  "swapTransaction": "base64-encoded-transaction",
  "lastValidBlockHeight": 12345678,
  "prioritizationFee": 1000
}
```

**What MoltyDEX Builds:**
- Complete swap transaction
- Includes all necessary instructions
- Optimized for gas costs
- Ready to sign and send

#### 4c. Sign and Send Swap

MoltyDEX signs and sends the swap transaction:

```typescript
async function executeSwap(swapTransaction, wallet) {
  // Decode transaction
  const transaction = Transaction.from(
    Buffer.from(swapTransaction.swapTransaction, 'base64')
  );
  
  // Sign with wallet
  transaction.sign(wallet);
  
  // Send to network
  const signature = await connection.sendRawTransaction(
    transaction.serialize(),
    { skipPreflight: false }
  );
  
  // Wait for confirmation
  await connection.confirmTransaction(signature, 'confirmed');
  
  return signature;
}
```

**Swap Execution:**
- Signs transaction with wallet
- Sends to Solana network
- Waits for confirmation
- Handles errors automatically

### Step 5: Make Payment

After swapping (or if balance was sufficient), MoltyDEX makes the payment:

```typescript
async function makePayment(paymentDetails, wallet) {
  // Build payment transaction
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: new PublicKey(paymentDetails.payTo),
      lamports: paymentDetails.amount
    })
  );
  
  // For SPL tokens, use token transfer
  if (paymentDetails.token !== 'SOL') {
    transaction.add(
      createTransferInstruction(
        wallet.publicKey,
        paymentDetails.payTo,
        paymentDetails.token,
        paymentDetails.amount
      )
    );
  }
  
  // Sign and send
  transaction.sign(wallet);
  const signature = await connection.sendRawTransaction(
    transaction.serialize()
  );
  
  // Wait for confirmation
  await connection.confirmTransaction(signature);
  
  return signature;
}
```

**Payment Handling:**
- Builds payment transaction
- Handles SOL and SPL tokens
- Signs with wallet
- Sends to payment address
- Waits for confirmation

### Step 6: Retry Original Request

After payment is confirmed, MoltyDEX retries the original request:

```typescript
async function retryRequest(originalUrl, paymentSignature) {
  // Retry original request with payment header
  const response = await fetch(originalUrl, {
    headers: {
      'X-Payment': paymentSignature,
      'X-Payment-Token': paymentDetails.token,
      'X-Payment-Amount': paymentDetails.amount.toString()
    }
  });
  
  // Should now return 200 OK with data
  return response;
}
```

**Retry Logic:**
- Includes payment signature in headers
- API verifies payment
- Returns requested data
- Agent receives data seamlessly

## Complete Flow Diagram

```
┌─────────────┐
│ Agent Calls │
│    API      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ API Returns │
│  402 Error  │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ MoltyDEX Detects   │
│   402 Response     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Parse Payment       │
│   Requirements      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Check Token Balance │
└──────┬──────────────┘
       │
       ├─── Has Enough? ──YES──┐
       │                       │
       NO                      │
       │                       │
       ▼                       │
┌─────────────────────┐       │
│ Get Swap Quote      │       │
│  (Jupiter)          │       │
└──────┬──────────────┘       │
       │                       │
       ▼                       │
┌─────────────────────┐       │
│ Build Swap          │       │
│ Transaction         │       │
└──────┬──────────────┘       │
       │                       │
       ▼                       │
┌─────────────────────┐       │
│ Execute Swap        │       │
└──────┬──────────────┘       │
       │                       │
       ▼                       │
┌─────────────────────┐       │
│ Make Payment        │◄──────┘
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Retry Original      │
│     Request         │
└──────┬──────────────┘
       │
       ▼
┌─────────────┐
│ Agent Gets  │
│    Data     │
└─────────────┘
```

## Error Handling

MoltyDEX includes robust error handling:

### Swap Failures

```typescript
try {
  await executeSwap(swapTransaction, wallet);
} catch (error) {
  if (error.type === 'SLIPPAGE_ERROR') {
    // Retry with higher slippage
    return await retryWithHigherSlippage();
  } else if (error.type === 'INSUFFICIENT_BALANCE') {
    // Check if we have enough input token
    return await checkInputBalance();
  } else {
    // Retry swap
    return await retrySwap();
  }
}
```

### Payment Failures

```typescript
try {
  await makePayment(paymentDetails, wallet);
} catch (error) {
  // Verify payment wasn't already made
  const paymentStatus = await checkPaymentStatus();
  if (!paymentStatus.confirmed) {
    // Retry payment
    return await retryPayment();
  }
}
```

### Network Errors

```typescript
try {
  const response = await retryRequest(originalUrl);
} catch (error) {
  // Retry with exponential backoff
  return await retryWithBackoff(originalUrl, {
    maxRetries: 3,
    backoffMs: 1000
  });
}
```

## Performance Optimizations

### Caching

MoltyDEX caches:
- Token balances (short TTL)
- Swap quotes (very short TTL)
- Payment status (for verification)

### Parallel Processing

MoltyDEX can:
- Check balance while parsing response
- Get quote while building transaction
- Optimize transaction building

### Transaction Batching

For multiple payments:
- Batch transactions when possible
- Reduce network calls
- Lower gas costs

## Integration Example

Here's a complete example of using MoltyDEX:

```typescript
import { HTTPInterceptor } from 'moltydex';

// Initialize MoltyDEX
const interceptor = new HTTPInterceptor({
  apiUrl: 'https://api.moltydex.com',
  walletSecretKey: process.env.WALLET_SECRET_KEY,
  autoSwap: true,
  slippageBps: 50, // 0.5% slippage
});

// Agent makes API call
async function agentWorkflow() {
  try {
    // This call might return 402
    const response = await fetch('https://api.example.com/data');
    
    // MoltyDEX automatically handles 402 if it occurs
    // If 402: swaps tokens, makes payment, retries
    // If 200: returns data normally
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

## Monitoring and Debugging

### Enable Logging

```typescript
const interceptor = new HTTPInterceptor({
  // ... config
  debug: true, // Enable detailed logging
});
```

### Monitor Events

```typescript
interceptor.on('402-detected', (details) => {
  console.log('402 detected:', details);
});

interceptor.on('swap-executed', (swap) => {
  console.log('Swap executed:', swap);
});

interceptor.on('payment-made', (payment) => {
  console.log('Payment made:', payment);
});
```

## Best Practices

1. **Handle Errors Gracefully** - Payment failures shouldn't crash agents
2. **Monitor Costs** - Track swap costs and payment amounts
3. **Set Appropriate Slippage** - Balance speed vs price protection
4. **Cache Payment Info** - Avoid repeated payments for same content
5. **Test Thoroughly** - Test with various token pairs and amounts

## Conclusion

MoltyDEX automates the entire x402 payment flow, from detecting 402 responses to making payments and retrying requests. The process is:

- ✅ **Automatic** - Zero manual intervention
- ✅ **Reliable** - Robust error handling
- ✅ **Fast** - Optimized for speed
- ✅ **Cost-Effective** - Best prices through Jupiter
- ✅ **Simple** - Just works

**Ready to automate x402 payments?** [Try MoltyDEX today](https://www.moltydex.com) - it's free with 0% platform fees.

---

**Related Articles:**
- [Complete Guide to x402 Payments](/blog/complete-guide-x402-payments)
- [Why Agents Need Automatic Token Swapping](/blog/why-agents-need-automatic-token-swapping)
- [Real-World Use Cases for MoltyDEX](/blog/real-world-use-cases-moltydex-x402-payments)

**Resources:**
- [MoltyDEX API Documentation](https://www.moltydex.com/developers)
- [x402 Protocol Specification](https://x402.dev)
- [Integration Examples](https://www.moltydex.com/examples)
