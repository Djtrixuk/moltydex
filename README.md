# moltydex
x402 Token Aggregator for Humans &amp; AI Agents
Executive Summary
MoltyDEX is a decentralized exchange (DEX) aggregator specifically designed for AI agents operating on the Solana blockchain. Built on top of the Jupiter aggregator, MoltyDEX provides a seamless, programmatic interface for AI agents to swap tokens, make payments via the x402 protocol, and manage their token portfolios. The platform combines best-price routing across multiple DEXes with agent-specific features including webhook notifications, enhanced error handling, intelligent token recommendations, and comprehensive transaction tracking.

Table of Contents
1. Overview
2. Architecture
3. x402 Protocol Integration
4. Agent-Specific Features
5. API Design
6. Security & Trust
7. Use Cases
8. Future Development
1. Overview
1.1 What is MoltyDEX?
MoltyDEX is a DEX aggregator that routes token swaps through Jupiter, which in turn finds the best prices across multiple Solana DEXes including Raydium, Orca, Meteora, and others. Unlike traditional DEX interfaces designed for humans, MoltyDEX is built from the ground up for programmatic access by AI agents.

1.2 Core Value Proposition
Best Prices: Routes through Jupiter to find optimal swap routes across all major Solana DEXes
Low Fees: Competitive 0.1% aggregator fee (configurable)
Agent-Optimized: RESTful API designed for programmatic access
x402 Ready: Native support for x402 payment protocol
Zero Deployment: No smart contracts required, just an API server
Secure: Client-side transaction signing (private keys never leave agent's system)
1.3 Key Differentiators
vs. Direct Jupiter API:

Agent-specific features (webhooks, recommendations, enhanced errors)
x402 protocol integration
Transaction status tracking
Batch operations for efficiency
vs. Traditional DEX Interfaces:

Programmatic API access (no UI required)
Structured error responses with actionable guidance
Real-time webhook notifications
Intelligent token recommendations
2. Architecture
2.1 System Components
API Layer (Express.js)

RESTful API endpoints
Rate limiting and security
Request validation
Error handling
Jupiter Integration

Quote fetching from multiple Jupiter endpoints
Transaction building using Jupiter's official client
Fallback endpoints for reliability
Solana RPC

Balance checking
Transaction status tracking
Transaction history
Account information
2.2 Request Flow
1. Agent requests quote → MoltyDEX API

2. MoltyDEX → Jupiter API (multiple endpoints)

3. Jupiter → Multiple DEXes (finds best route)

4. MoltyDEX adds fee calculation

5. Agent builds transaction (client-side)

6. Agent signs transaction (private key stays local)

7. Agent sends signed transaction → Solana network

8. MoltyDEX tracks status and notifies webhooks

3. x402 Protocol Integration
3.1 What is x402?
x402 is a payment protocol that enables API providers to request payment before serving content. When an API returns a 402 Payment Required response, it includes payment requirements specifying the amount, token, and network needed.

3.2 MoltyDEX x402 Features
Parse Payment Requirements: Extract payment details from 402 responses
Balance Checking: Verify if agent has sufficient tokens
Automatic Swapping: Swap to required token if needed
Payment Preparation: Build and sign payment transactions
Auto-Pay Flow: Complete end-to-end payment handling
Token Recommendations: Suggest optimal payment tokens
3.3 x402 Workflow
Agent receives 402 Payment Required response
Agent calls POST /api/x402/parse-payment to extract requirements
Agent calls POST /api/x402/prepare-payment to check balance
If insufficient balance, MoltyDEX provides swap quote
Agent executes swap (if needed) and payment
Agent retries original API request with payment proof
4. Agent-Specific Features
4.1 Webhook Notifications
Agents can register webhooks to receive real-time notifications when transactions are confirmed or fail. This eliminates the need for polling and enables event-driven architectures.

POST /api/transaction/webhook
{ "signature": "...", "callback_url": "https://..." }

4.2 Enhanced Error Responses
All errors include structured information with error codes, detailed context, and actionable suggestions. Agents can programmatically handle errors and retry with correct actions.

{
"error": "Insufficient balance",
"code": "INSUFFICIENT_BALANCE",
"details": { "required": "...", "available": "..." },
"suggestions": ["Swap SOL to USDC", "Check balance"]
}

4.3 Token Recommendations
Intelligent token recommendations based on use case (payment, swap, liquidity), agent-friendliness, and liquidity scores. Helps agents discover optimal tokens for their needs.

4.4 Batch Operations
Check multiple balances, get multiple quotes, or fetch multiple token metadata in a single API call. Reduces API calls and improves efficiency.

4.5 Rate Limit Management
Dedicated endpoints for checking rate limit status. Agents can proactively manage their API usage and implement backoff strategies.

4.6 Cost Transparency
All quotes include detailed fee breakdowns showing aggregator fees, network fees, priority fees, and total cost estimates. Agents can make informed decisions about swap costs.

5. API Design
5.1 Core Endpoints
Quotes: GET /api/quote

Swap Building: POST /api/swap/build

Balance: GET /api/balance

Token Metadata: GET /api/token

Transaction Status: GET /api/transaction/status/:signature

5.2 x402 Endpoints
Parse Payment: POST /api/x402/parse-payment

Prepare Payment: POST /api/x402/prepare-payment

Auto-Pay: POST /api/x402/auto-pay

5.3 Agent Features
Webhooks: POST /api/transaction/webhook

Recommendations: GET /api/tokens/recommend

Rate Limits: GET /api/rate-limit/status

Batch Operations: POST /api/batch/*

5.4 Response Format
All responses follow a consistent JSON format. Success responses include data, error responses include error code, details, and suggestions. Rate limit headers are included in all responses.

6. Security & Trust
6.1 Client-Side Signing
Critical: Private keys never leave the agent's system. Transactions are built server-side but signed client-side. The API only receives already-signed transactions for broadcasting.

6.2 Rate Limiting
Rate limits prevent abuse and ensure fair usage. Different limits apply to different endpoint types (general API: 100/15min, swaps: 10/min, quotes: 30/min).

6.3 Input Validation
All inputs are validated using Joi schemas. Invalid requests are rejected with clear error messages before processing.

6.4 Error Handling
Comprehensive error handling prevents information leakage while providing useful debugging information to agents.

7. Use Cases
7.1 x402 Payment Automation
AI agents can automatically handle x402 payment requirements by parsing payment requests, checking balances, swapping tokens if needed, and making payments—all programmatically.

7.2 Token Portfolio Management
Agents can check balances across multiple tokens, swap between tokens to optimize portfolios, and track transaction history.

7.3 Arbitrage & Trading
Trading bots can use MoltyDEX to find best prices, execute swaps, and track transaction status in real-time via webhooks.

7.4 Payment Processing
Services can integrate MoltyDEX to accept payments in any Solana token, automatically swapping to preferred tokens if needed.

8. Future Development
8.1 Planned Features
Webhook signature verification
Persistent webhook storage (Redis/database)
Transaction simulation endpoint
Multi-token balance endpoint
Quote caching for performance
Agent usage analytics
TypeScript SDK
OpenAPI/Swagger documentation
8.2 Scalability
The current architecture is designed to scale horizontally. Future improvements include connection pooling, response caching, and distributed rate limiting.

Conclusion
MoltyDEX bridges the gap between traditional DEX interfaces and the needs of AI agents. By combining Jupiter's best-price routing with agent-specific features, MoltyDEX enables a new class of automated financial applications on Solana. The platform's focus on security, transparency, and agent-friendly design makes it the ideal choice for AI agents needing reliable token swap capabilities.

For technical documentation, API reference, and integration guides, visit the API documentation.
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
