# Understanding x402 Protocol for Developers

**Complete guide to x402 Payment Required protocol for API developers and agent builders.**

---

## What is x402?

x402 is an HTTP status code extension that enables **pay-per-use APIs**. When an API requires payment, it returns a `402 Payment Required` response with payment instructions.

**Standard HTTP status codes:**
- `200 OK` - Success
- `401 Unauthorized` - Authentication required
- `402 Payment Required` - **Payment required** (x402)
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found

---

## How x402 Works

### 1. API Returns 402

When an API requires payment, it returns:

```http
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "accepts": [
    {
      "network": "solana",
      "asset": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "amount": "1000000",
      "address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
    }
  ]
}
```

### 2. Client Parses Payment

The client (agent) parses the payment requirements:
- **Network:** Blockchain (e.g., "solana")
- **Asset:** Token mint address (e.g., USDC)
- **Amount:** Amount in smallest unit (e.g., 1 USDC = 1,000,000 micro-USDC)
- **Address:** Payment address

### 3. Client Makes Payment

The client makes the payment:
- Checks balance
- Swaps tokens if needed (SOL → USDC)
- Sends payment transaction
- Waits for confirmation

### 4. Client Retries Request

After payment confirmation, the client retries the original request:
- Same URL, same parameters
- Payment now complete
- API returns data

---

## x402 Response Format

### Standard Format

```json
{
  "accepts": [
    {
      "network": "solana",
      "asset": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "amount": "1000000",
      "address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
    }
  ]
}
```

### Multiple Payment Options

```json
{
  "accepts": [
    {
      "network": "solana",
      "asset": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "amount": "1000000",
      "address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
    },
    {
      "network": "solana",
      "asset": "So11111111111111111111111111111111111111112",
      "amount": "100000000",
      "address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
    }
  ]
}
```

### Additional Fields

```json
{
  "accepts": [
    {
      "network": "solana",
      "asset": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "amount": "1000000",
      "address": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      "memo": "Payment for API call #12345",
      "expires_at": "2026-02-06T12:00:00Z"
    }
  ]
}
```

---

## Implementing x402 in Your API

### Node.js/Express Example

```javascript
app.get('/api/data', async (req, res) => {
  // Check if payment required
  const paymentRequired = await checkPayment(req);
  
  if (paymentRequired) {
    return res.status(402).json({
      accepts: [{
        network: 'solana',
        asset: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
        amount: '1000000', // 1 USDC
        address: process.env.PAYMENT_ADDRESS,
      }]
    });
  }
  
  // Return data
  res.json({ data: 'your data here' });
});
```

### Python/Flask Example

```python
@app.route('/api/data')
def get_data():
    if not check_payment(request):
        return jsonify({
            'accepts': [{
                'network': 'solana',
                'asset': 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
                'amount': '1000000',
                'address': os.getenv('PAYMENT_ADDRESS'),
            }]
        }), 402
    
    return jsonify({'data': 'your data here'})
```

---

## Handling x402 in Agents

### Manual Handling

```typescript
const response = await fetch('https://api.example.com/data');

if (response.status === 402) {
  const payment = await response.json();
  // Make payment
  await makePayment(payment.accepts[0]);
  // Retry request
  const retryResponse = await fetch('https://api.example.com/data');
  return retryResponse.json();
}
```

### Automatic Handling (MoltyDEX)

```typescript
import { HTTPInterceptor } from '@moltydex/agent';

const interceptor = new HTTPInterceptor({
  apiUrl: 'https://api.moltydex.com',
  walletSecretKey: process.env.WALLET_SECRET_KEY,
  autoSwap: true,
});

// All 402 responses handled automatically!
const response = await fetch('https://api.example.com/data');
const data = await response.json();
```

---

## Best Practices

### For API Providers

1. **Clear Payment Instructions**
   - Specify exact amount
   - Provide payment address
   - Include memo/identifier

2. **Multiple Payment Options**
   - Accept multiple tokens
   - Let clients choose

3. **Payment Verification**
   - Verify on-chain
   - Check transaction signatures
   - Handle confirmations

4. **Error Handling**
   - Clear error messages
   - Retry instructions
   - Support contact

### For Agent Developers

1. **Automatic Handling**
   - Use libraries like MoltyDEX
   - Don't handle manually

2. **Error Handling**
   - Handle payment failures
   - Retry logic
   - Fallback strategies

3. **Balance Management**
   - Monitor balances
   - Refill when needed
   - Optimize token usage

4. **Security**
   - Client-side signing
   - Never expose keys
   - Verify transactions

---

## Common Token Addresses (Solana)

- **SOL:** `So11111111111111111111111111111111111111112`
- **USDC:** `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
- **USDT:** `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB`

---

## Security Considerations

### Payment Verification

Always verify payments on-chain:
- Check transaction signatures
- Verify amounts
- Confirm addresses
- Handle confirmations

### Client-Side Signing

Never send private keys to APIs:
- Sign transactions locally
- Send signed transactions
- Keep keys secure

---

## Conclusion

x402 enables pay-per-use APIs, but requires proper implementation. Use libraries like MoltyDEX for automatic handling, or implement manually with proper security.

**Key Takeaways:**
- x402 enables pay-per-use APIs
- Standard format for payment instructions
- Requires proper implementation
- Use libraries for automatic handling
- Security is critical

**Get Started:** https://www.moltydex.com/developers

---

**Questions?** [@MoltyDEX](https://x.com/MoltyDEX)
