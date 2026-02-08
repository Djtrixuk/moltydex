# MoltyDEX API

Solana token swap aggregator API that routes through Jupiter with fee collection and x402 protocol support.

## Architecture

```
api/
├── config/
│   └── constants.js      # Application constants and configuration
├── middleware/
│   ├── rateLimit.js      # Rate limiting middleware
│   └── validation.js     # Request validation (if needed)
├── routes/
│   ├── quote.js          # Quote endpoints
│   ├── swap.js           # Swap transaction building
│   ├── balance.js        # Balance checking
│   ├── token.js          # Token metadata
│   ├── transaction.js    # Transaction sending & webhooks
│   ├── x402.js           # x402 payment protocol
│   ├── batch.js          # Batch operations
│   ├── rateLimit.js      # Rate limit status
│   ├── recommendations.js # Token recommendations
│   └── health.js         # Health checks
├── utils/
│   ├── solana.js         # Solana utility functions
│   ├── jupiter.js        # Jupiter API utilities
│   ├── tokenMetadata.js  # Token metadata fetching
│   ├── balance.js        # Balance fetching utilities
│   ├── agentMetadata.js  # Agent metadata utilities
│   ├── errorHandler.js   # Enhanced error handling
│   └── webhooks.js       # Webhook management
└── index.js              # Main application entry point
```

## API Endpoints

### Quote
- `GET /api/quote` - Get swap quote from Jupiter

### Swap
- `POST /api/swap/build` - Build unsigned swap transaction (client signs)

### Balance
- `GET /api/balance` - Get token balance for a wallet

### Token
- `GET /api/token` - Get token metadata (decimals, symbol, name, logo)
- `GET /api/tokens/search` - Search tokens by symbol, name, or address
- `GET /api/tokens/by-symbol` - Get token by symbol (exact match)
- `GET /api/tokens/popular` - Get popular tokens (optionally filtered by category)
- `GET /api/tokens/recommend` - Get intelligent token recommendations based on use case

### Transaction
- `POST /api/transaction/send` - Send signed transaction via API RPC
- `GET /api/transaction/status/:signature` - Get transaction status and confirmation details
- `GET /api/transaction/history/:wallet_address` - Get transaction history for a wallet
- `POST /api/transaction/webhook` - Register webhook for transaction status notifications
- `GET /api/transaction/webhook/:webhook_id` - Get webhook status

### Batch Operations
- `POST /api/batch/balances` - Get multiple token balances in one request
- `POST /api/batch/quotes` - Get multiple swap quotes in one request
- `POST /api/batch/token-metadata` - Get metadata for multiple tokens in one request

### x402 Protocol
- `POST /api/x402/parse-payment` - Parse x402 Payment Required response
- `POST /api/x402/prepare-payment` - Check balance and prepare swap
- `POST /api/x402/auto-pay` - Complete x402 payment flow (parse, check, swap if needed)
- `GET /api/x402/recommended-tokens` - Get recommended tokens for payments

### Rate Limits
- `GET /api/rate-limit/status` - Get general API rate limit status
- `GET /api/rate-limit/status/swap` - Get swap-specific rate limit status
- `GET /api/rate-limit/status/quote` - Get quote-specific rate limit status
- `GET /api/rate-limit/status/all` - Get all rate limit statuses

### Health
- `GET /api/health` - Health check endpoint

## Agent-Specific Features

### Cost Transparency
All quote responses include a complete `fee_breakdown` showing:
- Aggregator fee (MoltyDEX fee)
- Network fee (Solana transaction fee estimate)
- Priority fee (optional)
- Total cost estimate
- Minimum output with slippage

### Rate Limit Headers
All responses include rate limit information:
- `X-RateLimit-Limit`: Maximum requests per window
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: When the limit resets (ISO timestamp)

### Agent-Friendly Metadata
Token responses include `agent_metadata` with:
- `agent_friendly`: Boolean indicating if token is good for agents
- `commonly_accepted`: Boolean for x402 payment acceptance
- `x402_compatible`: Always true for SPL tokens
- `liquidity_score`: Score from 0-100
- `swap_fee_estimate`: Expected swap fee percentage

### Enhanced Error Responses
All error responses now include:
- `error`: Human-readable error message
- `code`: Machine-readable error code (e.g., `INSUFFICIENT_BALANCE`, `INVALID_TOKEN`)
- `details`: Additional context about the error
- `suggestions`: Actionable suggestions for the agent
- `timestamp`: ISO timestamp of the error

### Webhooks
Register webhooks to receive real-time transaction status notifications:
- Webhooks are automatically notified when transactions are confirmed or fail
- Webhook payload includes transaction status, confirmation details, and metadata
- Webhooks are cleaned up after 24 hours automatically

### Token Recommendations
Intelligent token recommendations based on:
- Use case (payment, swap, liquidity)
- Minimum liquidity score
- Category (stablecoin, agent-token, all)
- Real-time scoring algorithm considering agent-friendliness and liquidity

## Environment Variables

```bash
JUPITER_API_KEY=your_key_here          # Get from https://portal.jup.ag
SOLANA_RPC_URL=https://...             # Your Solana RPC endpoint
FEE_BPS=10                              # Fee in basis points (default: 10 = 0.1%)
FEE_WALLET=your_wallet_address          # Wallet to collect fees
DEMO_MODE=0                             # Enable demo mode (0 or 1)
PORT=3001                               # Server port
HOST=127.0.0.1                          # Server host
```

## Development

```bash
npm install
npm run dev  # Uses nodemon for auto-reload
```

## Deployment

Deploy to Vercel, Railway, or any Node.js host. Make sure to set environment variables in your hosting platform.
