# MoltyDEX Architecture Overview

**How MoltyDEX works under the hood**

---

## High-Level Architecture

```
Agent → MoltyDEX API → Jupiter → Solana DEXes → Blockchain
```

---

## Components

### 1. MoltyDEX API
- Receives requests from agents
- Validates inputs
- Routes to Jupiter
- Builds transactions
- Returns unsigned transactions

### 2. Jupiter Integration
- Price discovery
- Route optimization
- Best price finding
- Multi-DEX routing

### 3. Transaction Building
- Creates Solana transactions
- Includes swap instructions
- Handles versioned transactions
- Returns for client signing

### 4. Client-Side Signing
- Agent signs transaction
- Private keys never leave client
- Secure by design

---

## Request Flow

### Quote Request
```
Agent → GET /api/quote
MoltyDEX → Jupiter API
Jupiter → Multiple DEXes
Jupiter → Best route found
MoltyDEX → Quote returned to agent
```

### Swap Request
```
Agent → POST /api/swap/build
MoltyDEX → Jupiter API (get route)
MoltyDEX → Build transaction
MoltyDEX → Return unsigned transaction
Agent → Sign transaction
Agent → Send to Solana
Solana → Execute swap
```

---

## Security Model

### Client-Side Signing
- Transactions built server-side
- Signed client-side
- Private keys never exposed
- Secure by design

### No Private Key Storage
- We never see your keys
- You control your wallet
- Maximum security

---

## Scalability

### Serverless Architecture
- Auto-scaling
- No server management
- Handles traffic spikes
- Cost-effective

### Rate Limiting
- Protects against abuse
- Fair usage for all
- Reasonable limits

---

## Reliability

### Error Handling
- Built-in retries
- Error recovery
- Graceful degradation
- Comprehensive logging

### Monitoring
- Health checks
- Performance monitoring
- Error tracking
- Usage analytics

---

## Technology Stack

### Backend
- Node.js
- Express.js
- Jupiter SDK
- Solana Web3.js

### Frontend
- Next.js
- React
- Solana Wallet Adapter

### Infrastructure
- Vercel (serverless)
- Solana RPC
- Jupiter API

---

## API Design

### RESTful
- Standard HTTP methods
- JSON responses
- Clear error messages
- Comprehensive docs

### Simple
- Minimal endpoints
- Easy to understand
- Quick to integrate

---

## Future Architecture

### Planned Improvements
- WebSocket support (real-time quotes)
- GraphQL API (optional)
- More SDKs (Rust, Go)
- Enhanced caching

---

## Get Started

**Read the docs:** https://www.moltydex.com/developers  
**Check the code:** [GitHub Link]

---

**Built for scale. Built for reliability. Built for agents.** 🚀
