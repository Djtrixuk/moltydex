# MoltyDEX API Reference

**Complete API documentation**

---

## Base URL

```
https://api.moltydex.com
```

---

## Authentication

Currently no authentication required. Rate limits apply.

---

## Endpoints

### GET /api/quote

Get a swap quote.

**Parameters:**
- `input_mint` (required): Input token mint address
- `output_mint` (required): Output token mint address
- `amount` (required): Amount in lamports
- `slippage_bps` (optional): Slippage tolerance in basis points (default: 50)

**Example:**
```bash
GET /api/quote?input_mint=So11111111111111111111111111111111111111112&output_mint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=1000000000
```

**Response:**
```json
{
  "input_mint": "So11111111111111111111111111111111111111112",
  "output_mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "input_amount": "1000000000",
  "output_amount": "250000000",
  "output_after_fee": "250000000",
  "fee_amount": "0",
  "fee_bps": 0,
  "price_impact": "0.1%"
}
```

---

### POST /api/swap/build

Build unsigned swap transaction.

**Body:**
```json
{
  "wallet_address": "YOUR_WALLET_ADDRESS",
  "input_mint": "So11111111111111111111111111111111111111112",
  "output_mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "amount": "1000000000",
  "slippage_bps": 50
}
```

**Response:**
```json
{
  "transaction": "BASE64_ENCODED_TRANSACTION",
  "fee_amount": "0",
  "output_amount": "250000000",
  "output_after_fee": "250000000",
  "fee_bps": 0,
  "is_versioned": true
}
```

---

### GET /api/balance

Check token balance.

**Parameters:**
- `wallet_address` (required): Wallet address
- `token_mint` (optional): Token mint address (omit for SOL)

**Example:**
```bash
GET /api/balance?wallet_address=YOUR_ADDRESS&token_mint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
```

**Response:**
```json
{
  "wallet_address": "YOUR_ADDRESS",
  "token_mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "balance": "1000000",
  "decimals": 6,
  "has_balance": true
}
```

---

### POST /api/batch/balance

Check multiple balances at once.

**Body:**
```json
{
  "wallet_address": "YOUR_WALLET_ADDRESS",
  "token_mints": [
    "So11111111111111111111111111111111111111112",
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
  ]
}
```

**Response:**
```json
{
  "wallet_address": "YOUR_WALLET_ADDRESS",
  "results": [
    {
      "token_mint": "So11111111111111111111111111111111111111112",
      "success": true,
      "data": {
        "balance": "1000000000",
        "decimals": 9,
        "has_balance": true
      }
    }
  ]
}
```

---

### GET /api/token

Get token metadata.

**Parameters:**
- `mint` (required): Token mint address

**Example:**
```bash
GET /api/token?mint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
```

**Response:**
```json
{
  "mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "symbol": "USDC",
  "name": "USD Coin",
  "decimals": 6,
  "logo": "https://..."
}
```

---

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "jupiter_api_key_set": true,
  "timestamp": "2026-02-07T18:00:00Z"
}
```

---

### GET /api/analytics/stats

Get usage statistics.

**Response:**
```json
{
  "overview": {
    "totalSwaps": 10,
    "successfulSwaps": 8,
    "failedSwaps": 2,
    "totalQuotes": 45,
    "totalBalanceChecks": 120,
    "totalApiCalls": 175,
    "uniqueWallets": 5
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "details": "Additional details",
  "code": "ERROR_CODE"
}
```

**Common Error Codes:**
- `INVALID_INPUT`: Invalid parameters
- `INSUFFICIENT_BALANCE`: Not enough tokens
- `NO_ROUTE`: No swap route found
- `RATE_LIMIT`: Rate limit exceeded
- `SERVICE_UNAVAILABLE`: Service temporarily unavailable

---

## Rate Limits

- Quote endpoints: No limit
- Balance endpoints: No limit
- Swap endpoints: Reasonable limits to prevent abuse

---

## SDKs

- **Python:** `pip install moltydex`
- **TypeScript:** `npm install @moltydex/agent`

---

**Full documentation:** https://www.moltydex.com/developers
