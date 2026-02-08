# MoltyDEX Architecture

High-level overview of MoltyDEX's architecture and design decisions.

## System Overview

```
┌─────────────┐
│   Clients   │
│ (Agents/UI) │
└──────┬──────┘
       │
       │ HTTPS
       ▼
┌─────────────────┐
│  MoltyDEX API   │
│   (Express.js)  │
└──────┬──────────┘
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌─────────────┐  ┌──────────────┐
│   Jupiter   │  │   Solana     │
│  Aggregator │  │     RPC      │
└─────────────┘  └──────────────┘
```

## Components

### 1. API Server (Express.js)

**Location**: `api/`

**Responsibilities**:
- Handle HTTP requests
- Route to appropriate handlers
- Rate limiting
- Error handling
- Request validation

**Key Files**:
- `api/index.js` - Main server file
- `api/routes/` - Route handlers
- `api/middleware/` - Middleware (rate limiting, caching)

### 2. Route Handlers

**Quote Routes** (`routes/quote.js`):
- Get swap quotes from Jupiter
- Calculate fees
- Return quote data

**Swap Routes** (`routes/swap.js`):
- Build swap transactions
- Return unsigned transactions
- Client signs and sends

**Balance Routes** (`routes/balance.js`):
- Check SOL balances
- Check SPL token balances
- Batch balance checks

**x402 Routes** (`routes/x402.js`):
- Parse 402 Payment Required responses
- Prepare payments
- Auto-pay flow

### 3. Utilities

**Jupiter Integration** (`utils/jupiter.js`):
- Fetch quotes from Jupiter
- Build swap transactions
- Handle Jupiter API errors

**Solana Integration** (`utils/solana.js`):
- RPC calls
- Transaction building
- Balance fetching

**Token Metadata** (`utils/tokenMetadata.js`):
- Fetch token information
- Cache metadata
- Handle multiple sources

### 4. Frontend (Next.js)

**Location**: `frontend/`

**Responsibilities**:
- User interface
- Wallet connection
- Swap interface
- Transaction signing

### 5. SDKs

**Python SDK** (`sdk/agentdex.py`):
- Python wrapper for API
- x402 payment handling
- Transaction signing

**TypeScript Agent** (`agent/`):
- x402 Auto-Pay Agent
- HTTP interceptor
- Automatic payment handling

## Data Flow

### Swap Flow

```
1. Client → GET /api/quote
   ├─ API → Jupiter API
   └─ API → Client (quote)

2. Client → POST /api/swap/build
   ├─ API → Jupiter API (build transaction)
   └─ API → Client (unsigned transaction)

3. Client → Sign transaction (client-side)
   └─ Client → Solana Network (send transaction)

4. Client → Check transaction status
   └─ Client → Solana RPC
```

### x402 Payment Flow

```
1. Agent → API (gets 402 Payment Required)
   └─ Agent → POST /api/x402/parse-payment

2. Agent → POST /api/x402/prepare-payment
   ├─ API → Check balance
   ├─ API → Get quote (if swap needed)
   └─ API → Agent (payment instructions)

3. Agent → Execute swap (if needed)
   └─ Agent → Retry original request with payment
```

## Design Decisions

### 1. Client-Side Signing

**Why**: Security - private keys never leave client
**How**: API returns unsigned transactions, client signs

### 2. Jupiter Aggregation

**Why**: Best prices across all DEXes
**How**: Route all swaps through Jupiter API

### 3. In-Memory Analytics

**Why**: Simple, no database needed
**Limitation**: Resets on deployment
**Future**: Database for persistence

### 4. Rate Limiting

**Why**: Prevent abuse, ensure fair usage
**How**: express-rate-limit middleware

### 5. Caching

**Why**: Reduce API calls, improve performance
**What**: Token metadata, popular quotes

## Security

### Client-Side Signing
- Private keys never sent to API
- Transactions signed locally
- Only unsigned transactions returned

### Rate Limiting
- Prevents abuse
- Per-IP limits
- Configurable thresholds

### Input Validation
- All inputs validated
- Type checking
- Sanitization

### Error Handling
- No sensitive data in errors
- Generic error messages
- Detailed logs server-side

## Scalability

### Current Limitations
- In-memory analytics (resets on restart)
- Single server (Vercel serverless)
- No database (stateless)

### Future Improvements
- Database for analytics
- Redis for caching
- Multiple server instances
- CDN for static assets

## Deployment

### Production
- **API**: Vercel (serverless functions)
- **Frontend**: Vercel (static hosting)
- **Domain**: moltydex.com

### Environment Variables
- `JUPITER_API_KEY` - Jupiter API key
- `FEE_WALLET` - Fee collection wallet
- `SOLANA_RPC_URL` - Solana RPC endpoint
- `NODE_ENV` - Environment (production/development)

## Monitoring

### Health Checks
- `/api/health` - Basic health check
- `/api/analytics/stats` - Usage statistics

### Logging
- Winston for structured logging
- Error tracking (Sentry)
- Performance monitoring

## Dependencies

### Core
- `express` - Web framework
- `@solana/web3.js` - Solana SDK
- `@jup-ag/api` - Jupiter SDK
- `axios` - HTTP client

### Middleware
- `express-rate-limit` - Rate limiting
- `compression` - Response compression
- `helmet` - Security headers

## Future Architecture

### Planned Improvements
1. **Database**: PostgreSQL for analytics
2. **Cache**: Redis for token metadata
3. **Queue**: Bull for async tasks
4. **Monitoring**: Prometheus + Grafana
5. **CDN**: Cloudflare for static assets

### Scalability Path
1. Add database layer
2. Implement caching layer
3. Add queue system
4. Scale horizontally
5. Add load balancing
