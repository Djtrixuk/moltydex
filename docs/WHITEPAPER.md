# MoltyDEX Whitepaper

**x402 Token Aggregator for AI Agents on Solana**

Version 1.0 • February 2026

---

## Executive Summary

MoltyDEX is a decentralized exchange (DEX) aggregator specifically designed for AI agents operating on the Solana blockchain. Built on top of the Jupiter aggregator, MoltyDEX provides a seamless, programmatic interface for AI agents to swap tokens, make payments via the x402 protocol, and manage their token portfolios. The platform combines best-price routing across multiple DEXes with agent-specific features including webhook notifications, enhanced error handling, intelligent token recommendations, and comprehensive transaction tracking.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [x402 Protocol Integration](#3-x402-protocol-integration)
4. [Agent-Specific Features](#4-agent-specific-features)
5. [API Design](#5-api-design)
6. [Security & Trust](#6-security--trust)
7. [Use Cases](#7-use-cases)
8. [Future Development](#8-future-development)

---

## 1. Overview

### 1.1 What is MoltyDEX?

MoltyDEX is a DEX aggregator that routes token swaps through Jupiter, which in turn finds the best prices across multiple Solana DEXes including Raydium, Orca, Meteora, and others. Unlike traditional DEX interfaces designed for humans, MoltyDEX is built from the ground up for programmatic access by AI agents.

### 1.2 Core Value Proposition

- **Best Prices:** Routes through Jupiter to find optimal swap routes across all major Solana DEXes
- **Low Fees:** Competitive 0.1% aggregator fee (configurable)
- **Agent-Optimized:** RESTful API designed for programmatic access
- **x402 Ready:** Native support for x402 payment protocol
- **Zero Deployment:** No smart contracts required, just an API server
- **Secure:** Client-side transaction signing (private keys never leave agent's system)

### 1.3 Key Differentiators

**vs. Direct Jupiter API:**
- Agent-specific features (webhooks, recommendations, enhanced errors)
- x402 protocol integration
- Transaction status tracking
- Batch operations for efficiency

**vs. Traditional DEX Interfaces:**
- Programmatic API access (no UI required)
- Structured error responses with actionable guidance
- Real-time webhook notifications
- Intelligent token recommendations

---

## 2. Architecture

### 2.1 System Components

**API Layer (Express.js)**
- RESTful API endpoints
- Rate limiting and security
- Request validation
- Error handling

**Jupiter Integration**
- Quote fetching from multiple Jupiter endpoints
- Transaction building using Jupiter's official client
- Fallback endpoints for reliability

**Solana RPC**
- Balance checking
- Transaction status tracking
- Transaction history
- Account information

### 2.2 Request Flow

1. Agent requests quote → MoltyDEX API
2. MoltyDEX → Jupiter API (multiple endpoints)
3. Jupiter → Multiple DEXes (finds best route)
4. MoltyDEX adds fee calculation
5. Agent builds transaction (client-side)
6. Agent signs transaction (private key stays local)
7. Agent sends signed transaction → Solana network
8. MoltyDEX tracks status and notifies webhooks

---

## 3. x402 Protocol Integration

### 3.1 What is x402?

x402 is a payment protocol that enables API providers to request payment before serving content. When an API returns a 402 Payment Required response, it includes payment requirements specifying the amount, token, and network needed.

### 3.2 MoltyDEX x402 Features

- **Parse Payment Requirements:** Extract payment details from 402 responses
- **Balance Checking:** Verify if agent has sufficient tokens
- **Automatic Swapping:** Swap to required token if needed
- **Payment Preparation:** Build and sign payment transactions
- **Auto-Pay Flow:** Complete end-to-end payment handling
- **Token Recommendations:** Suggest optimal payment tokens

### 3.3 x402 Workflow

1. Agent receives 402 Payment Required response
2. Agent calls `POST /api/x402/parse-payment` to extract requirements
3. Agent calls `POST /api/x402/prepare-payment` to check balance
4. If insufficient balance, MoltyDEX provides swap quote
5. Agent executes swap (if needed) and payment
6. Agent retries original API request with payment proof

---

## 4. Agent-Specific Features

### 4.1 Webhook Notifications

Agents can register webhooks to receive real-time notifications when transactions are confirmed or fail. This eliminates the need for polling and enables event-driven architectures.

**Endpoint:** `POST /api/transaction/webhook`

```json
{
  "signature": "transaction_signature",
  "callback_url": "https://agent.example.com/webhook",
  "metadata": { "agent_id": "123" }
}
```

### 4.2 Enhanced Error Responses

All errors include structured information with error codes, detailed context, and actionable suggestions. Agents can programmatically handle errors and retry with correct actions.

**Example:**
```json
{
  "error": "Insufficient balance for this operation",
  "code": "INSUFFICIENT_BALANCE",
  "details": {
    "required": "1000000",
    "available": "500000",
    "shortfall": "500000",
    "token_mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
  },
  "suggestions": [
    "Swap SOL to the required token using POST /api/swap/build",
    "Check your current balance at GET /api/balance",
    "Consider using a different input token if available"
  ],
  "timestamp": "2026-02-05T12:00:00.000Z"
}
```

**Error Codes:**
- `INSUFFICIENT_BALANCE` - Not enough tokens for operation
- `INVALID_TOKEN` - Token not found or invalid
- `JUPITER_UNAVAILABLE` - Jupiter API is down
- `TRANSACTION_FAILED` - Transaction failed on-chain
- `RATE_LIMIT_EXCEEDED` - Rate limit hit
- `INVALID_INPUT` - Invalid request parameters
- `QUOTE_EXPIRED` - Quote is too old

### 4.3 Token Recommendations

Intelligent token recommendations based on use case (payment, swap, liquidity), agent-friendliness, and liquidity scores. Helps agents discover optimal tokens for their needs.

**Endpoint:** `GET /api/tokens/recommend?use_case=payment&min_liquidity=75&limit=5`

### 4.4 Batch Operations

Check multiple balances, get multiple quotes, or fetch multiple token metadata in a single API call. Reduces API calls and improves efficiency.

**Endpoints:**
- `POST /api/batch/balances`
- `POST /api/batch/quotes`
- `POST /api/batch/token-metadata`

### 4.5 Rate Limit Management

Dedicated endpoints for checking rate limit status. Agents can proactively manage their API usage and implement backoff strategies.

**Endpoints:**
- `GET /api/rate-limit/status` - General API limits
- `GET /api/rate-limit/status/swap` - Swap-specific limits
- `GET /api/rate-limit/status/quote` - Quote-specific limits
- `GET /api/rate-limit/status/all` - All limits

### 4.6 Cost Transparency

All quotes include detailed fee breakdowns showing aggregator fees, network fees, priority fees, and total cost estimates. Agents can make informed decisions about swap costs.

---

## 5. API Design

### 5.1 Core Endpoints

- **Quotes:** `GET /api/quote` - Get swap quote from Jupiter
- **Swap Building:** `POST /api/swap/build` - Build unsigned swap transaction
- **Balance:** `GET /api/balance` - Get token balance for a wallet
- **Token Metadata:** `GET /api/token` - Get token metadata (decimals, symbol, name, logo)
- **Transaction Status:** `GET /api/transaction/status/:signature` - Get transaction status
- **Transaction History:** `GET /api/transaction/history/:wallet_address` - Get transaction history

### 5.2 x402 Endpoints

- **Parse Payment:** `POST /api/x402/parse-payment` - Parse 402 response
- **Prepare Payment:** `POST /api/x402/prepare-payment` - Check balance and prepare swap
- **Auto-Pay:** `POST /api/x402/auto-pay` - Complete x402 payment flow

### 5.3 Agent Features

- **Webhooks:** `POST /api/transaction/webhook` - Register webhook
- **Recommendations:** `GET /api/tokens/recommend` - Get token recommendations
- **Rate Limits:** `GET /api/rate-limit/status` - Get rate limit status
- **Batch Operations:** `POST /api/batch/*` - Batch requests

### 5.4 Response Format

All responses follow a consistent JSON format. Success responses include data, error responses include error code, details, and suggestions. Rate limit headers are included in all responses.

---

## 6. Security & Trust

### 6.1 Client-Side Signing

**Critical:** Private keys never leave the agent's system. Transactions are built server-side but signed client-side. The API only receives already-signed transactions for broadcasting.

### 6.2 Rate Limiting

Rate limits prevent abuse and ensure fair usage. Different limits apply to different endpoint types:
- General API: 100 requests per 15 minutes
- Swaps: 10 requests per minute
- Quotes: 30 requests per minute

### 6.3 Input Validation

All inputs are validated using Joi schemas. Invalid requests are rejected with clear error messages before processing.

### 6.4 Error Handling

Comprehensive error handling prevents information leakage while providing useful debugging information to agents.

---

## 7. Use Cases

### 7.1 x402 Payment Automation

AI agents can automatically handle x402 payment requirements by parsing payment requests, checking balances, swapping tokens if needed, and making payments—all programmatically.

### 7.2 Token Portfolio Management

Agents can check balances across multiple tokens, swap between tokens to optimize portfolios, and track transaction history.

### 7.3 Arbitrage & Trading

Trading bots can use MoltyDEX to find best prices, execute swaps, and track transaction status in real-time via webhooks.

### 7.4 Payment Processing

Services can integrate MoltyDEX to accept payments in any Solana token, automatically swapping to preferred tokens if needed.

---

## 8. Future Development

### 8.1 Planned Features

- Webhook signature verification
- Persistent webhook storage (Redis/database)
- Transaction simulation endpoint
- Multi-token balance endpoint
- Quote caching for performance
- Agent usage analytics
- TypeScript SDK
- OpenAPI/Swagger documentation

### 8.2 Scalability

The current architecture is designed to scale horizontally. Future improvements include connection pooling, response caching, and distributed rate limiting.

---

## Conclusion

MoltyDEX bridges the gap between traditional DEX interfaces and the needs of AI agents. By combining Jupiter's best-price routing with agent-specific features, MoltyDEX enables a new class of automated financial applications on Solana. The platform's focus on security, transparency, and agent-friendly design makes it the ideal choice for AI agents needing reliable token swap capabilities.

---

## Additional Resources

- **API Documentation:** See `api/README.md` for complete API reference
- **High Priority Features:** See `docs/HIGH_PRIORITY_FEATURES.md` for detailed feature documentation
- **Implementation Summary:** See `IMPLEMENTATION_SUMMARY.md` for technical implementation details

---

**MoltyDEX • Built for AI Agents • Powered by Jupiter • x402 Protocol**
