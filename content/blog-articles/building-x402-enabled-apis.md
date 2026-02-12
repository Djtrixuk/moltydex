# Building x402-Enabled APIs: A Complete Guide

How to build APIs that accept x402 payments and work seamlessly with MoltyDEX.

## Why x402?

x402 enables pay-per-use APIs without subscriptions or API keys. Users pay only for what they use, and agents can pay automatically.

## Basic x402 Implementation

### Node.js/Express Example

```javascript
const express = require('express');
const app = express();

app.get('/api/data', async (req, res) => {
  // Check for payment
  const paymentHeader = req.headers['x-payment'];
  
  if (!paymentHeader) {
    // Return 402 Payment Required
    return res.status(402).json({
      accepts: [{
        scheme: 'solana',
        token: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
        amount: '1000000', // 1 USDC (6 decimals)
        network: 'mainnet'
      }],
      description: 'Data API - 1 USDC per request'
    });
  }
  
  // Verify payment (simplified - in production, verify on-chain)
  const paymentVerified = await verifyPayment(paymentHeader);
  
  if (!paymentVerified) {
    return res.status(402).json({
      error: 'Payment verification failed'
    });
  }
  
  // Return data
  res.json({
    data: 'Your requested data here',
    timestamp: Date.now()
  });
});
```

### Python/Flask Example

```python
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route('/api/data', methods=['GET'])
def get_data():
    payment_header = request.headers.get('X-Payment')
    
    if not payment_header:
        # Return 402 Payment Required
        return jsonify({
            'accepts': [{
                'scheme': 'solana',
                'token': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',  # USDC
                'amount': '1000000',  # 1 USDC
                'network': 'mainnet'
            }],
            'description': 'Data API - 1 USDC per request'
        }), 402
    
    # Verify payment
    if not verify_payment(payment_header):
        return jsonify({'error': 'Payment verification failed'}), 402
    
    # Return data
    return jsonify({
        'data': 'Your requested data here',
        'timestamp': int(time.time())
    })
```

## Payment Verification

### Verify On-Chain

```javascript
const { Connection, PublicKey } = require('@solana/web3.js');

async function verifyPayment(signature) {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  
  try {
    const tx = await connection.getTransaction(signature, {
      commitment: 'confirmed'
    });
    
    if (!tx) return false;
    
    // Check transaction details
    // Verify amount, recipient, token, etc.
    
    return true;
  } catch (error) {
    return false;
  }
}
```

## Working with MoltyDEX

### Why MoltyDEX Helps

When you return a 402 response:
1. Agent receives 402
2. Agent might not have USDC (has SOL instead)
3. **MoltyDEX automatically swaps SOL → USDC**
4. Agent pays with USDC
5. Your API receives payment
6. Agent gets data

**Without MoltyDEX:** Agent can't pay, automation breaks  
**With MoltyDEX:** Seamless payment, automation works

## Best Practices

### 1. Clear Payment Requirements

```json
{
  "accepts": [
    {
      "scheme": "solana",
      "token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "amount": "1000000",
      "network": "mainnet",
      "description": "1 USDC per API call"
    }
  ],
  "description": "Premium data API"
}
```

### 2. Multiple Token Options

```json
{
  "accepts": [
    {
      "scheme": "solana",
      "token": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "amount": "1000000"
    },
    {
      "scheme": "solana",
      "token": "So11111111111111111111111111111111111111112",
      "amount": "100000000"  // Equivalent in SOL
    }
  ]
}
```

### 3. Payment Verification

Always verify payments on-chain before providing service.

### 4. Rate Limiting

Implement rate limiting to prevent abuse.

### 5. Documentation

Document your payment requirements clearly.

## Example: Complete x402 API

```javascript
const express = require('express');
const { verifyPayment } = require('./payment-verifier');

const app = express();

// Pricing configuration
const PRICING = {
  '/api/data': {
    token: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    amount: '1000000', // 1 USDC
  },
  '/api/premium': {
    token: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    amount: '5000000', // 5 USDC
  }
};

app.get('/api/*', async (req, res) => {
  const path = req.path;
  const pricing = PRICING[path];
  
  if (!pricing) {
    return res.status(404).json({ error: 'Not found' });
  }
  
  const paymentHeader = req.headers['x-payment'];
  
  if (!paymentHeader) {
    return res.status(402).json({
      accepts: [{
        scheme: 'solana',
        token: pricing.token,
        amount: pricing.amount,
        network: 'mainnet'
      }],
      description: `Payment required for ${path}`
    });
  }
  
  // Verify payment
  const verified = await verifyPayment(paymentHeader, pricing);
  
  if (!verified) {
    return res.status(402).json({
      error: 'Payment verification failed'
    });
  }
  
  // Provide service
  res.json({
    data: `Data from ${path}`,
    timestamp: Date.now()
  });
});

app.listen(3000);
```

## Testing with MoltyDEX

```python
from moltydex import X402PaymentHandler
import requests

handler = X402PaymentHandler("wallet.json")

# Test your x402 API
response = requests.get("https://your-api.com/api/data")

if response.status_code == 402:
    # MoltyDEX handles payment automatically
    paid_response = handler.handle_402_response(
        response,
        "https://your-api.com/api/data"
    )
    print(paid_response.json())
```

## Next Steps

1. Implement x402 in your API
2. Test with MoltyDEX
3. Document payment requirements
4. Launch!

---

**Questions?** Check out MoltyDEX docs: https://www.moltydex.com/developers
