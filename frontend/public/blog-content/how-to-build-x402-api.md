# How to Build an x402-Compatible API

## Introduction

x402 is a payment protocol that allows APIs to request payment before serving content. This guide will show you how to build an API that uses x402 to monetize your services.

## What is x402?

x402 extends HTTP with a `402 Payment Required` status code. When your API needs payment, it returns 402 with payment details:

```json
{
  "accepts": [
    {
      "scheme": "solana",
      "token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "amount": "1000000",
      "network": "mainnet",
      "payTo": "YourWalletAddress"
    }
  ]
}
```

## Basic Implementation

### Node.js/Express Example

```javascript
const express = require('express');
const app = express();

app.get('/api/data', async (req, res) => {
  // Check for payment proof
  const paymentProof = req.headers['x-payment'];
  
  if (!paymentProof || !await verifyPayment(paymentProof)) {
    // Return 402 Payment Required
    return res.status(402).json({
      accepts: [
        {
          scheme: 'solana',
          token: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
          amount: '1000000', // 1 USDC (6 decimals)
          network: 'mainnet',
          payTo: process.env.PAYMENT_WALLET
        }
      ]
    });
  }
  
  // Payment verified, serve content
  res.json({ data: 'Your protected content here' });
});

async function verifyPayment(paymentProof) {
  // Verify the payment transaction on Solana
  // Check that payment was made to your wallet
  // Verify amount matches requirements
  return true; // Simplified
}
```

### Python/Flask Example

```python
from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

@app.route('/api/data')
def get_data():
    payment_proof = request.headers.get('X-Payment')
    
    if not payment_proof or not verify_payment(payment_proof):
        return jsonify({
            'accepts': [{
                'scheme': 'solana',
                'token': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
                'amount': '1000000',
                'network': 'mainnet',
                'payTo': os.getenv('PAYMENT_WALLET')
            }]
        }), 402
    
    return jsonify({'data': 'Your protected content here'})

def verify_payment(payment_proof):
    # Verify payment on Solana
    return True  # Simplified
```

## Payment Verification

### Verify Solana Transaction

```javascript
const { Connection, PublicKey } = require('@solana/web3.js');

async function verifyPayment(paymentProof, requiredAmount, tokenMint) {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  
  // Parse payment proof (transaction signature)
  const signature = paymentProof;
  
  // Get transaction
  const tx = await connection.getTransaction(signature);
  
  if (!tx) return false;
  
  // Verify transaction includes payment to your wallet
  // Verify amount matches
  // Verify token matches
  
  return true;
}
```

## Best Practices

1. **Set Clear Pricing** - Make payment amounts obvious
2. **Support Multiple Tokens** - Accept SOL, USDC, USDT
3. **Verify Payments** - Always verify on-chain
4. **Handle Idempotency** - Same payment shouldn't charge twice
5. **Provide Good Errors** - Clear error messages help agents

## Integration with MoltyDEX

Agents using MoltyDEX can automatically handle your 402 responses:

```python
from moltydex import X402PaymentHandler

handler = X402PaymentHandler("wallet.json")
response = requests.get("https://your-api.com/data")

if response.status_code == 402:
    # Automatically pays and retries
    paid_response = handler.handle_402_response(response, url)
```

## Common Token Addresses

- **SOL**: `So11111111111111111111111111111111111111112`
- **USDC**: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
- **USDT**: `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB`

## Resources

- **x402 Protocol**: https://github.com/coinbase/x402
- **MoltyDEX**: https://www.moltydex.com
- **Solana Docs**: https://docs.solana.com

## Conclusion

Building x402-compatible APIs is straightforward and opens up new monetization opportunities. With tools like MoltyDEX, agents can automatically handle payments, making your API accessible to AI agents.

Get started: https://www.moltydex.com
