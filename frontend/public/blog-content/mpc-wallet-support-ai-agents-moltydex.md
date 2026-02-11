---
title: "MPC Wallet Support for AI Agents: Why MoltyDEX Is Building Agent-Managed Wallets"
description: "Deep dive into MPC wallet support for AI agents on Solana. Learn why MoltyDEX is building managed wallets with spending policies, how it benefits developers and enterprises, and our complete implementation roadmap."
keywords: ["MPC wallet", "AI agent wallet", "Solana MPC", "agent managed wallet", "Turnkey wallet", "x402 payments", "agent infrastructure", "wallet creation API", "spending policies", "agent fleet management"]
author: "MoltyDEX Team"
date: "2026-02-11"
category: "Product Strategy"
tags: ["MPC", "wallets", "agents", "infrastructure", "Solana", "x402", "roadmap"]
canonical: "https://moltydex.com/blog/mpc-wallet-support-ai-agents-moltydex"
---

# MPC Wallet Support for AI Agents: Why MoltyDEX Is Building Agent-Managed Wallets

**MoltyDEX is adding MPC (Multi-Party Computation) wallet support so AI agents can create and manage their own wallets -- with spending limits, token controls, and full audit trails. No private keys to manage. Here's why, how, and what it means for the ecosystem.**

---

## The Problem: AI Agents Shouldn't Handle Raw Private Keys

Today, if you want an AI agent to make payments on Solana, you need to give it a private key. That means exporting a keypair, storing it in a config file or environment variable, and hoping nothing goes wrong.

This creates three hard problems:

**1. Security risk.** A raw private key in a config file is one leaked `.env` away from a drained wallet. AI agents run in cloud environments, CI/CD pipelines, and shared infrastructure -- all places where secrets can be exposed.

**2. No guardrails.** Once an agent has a private key, it can do anything with those funds. There's no way to say "only spend up to $50/day" or "only swap SOL and USDC" without building custom logic around the agent.

**3. Enterprise blocker.** No compliance team will approve an AI agent holding a raw private key. For any company with a security policy, this is a non-starter. It blocks adoption from the organizations that would benefit most from agent automation.

MPC wallets solve all three problems.

---

## What Are MPC Wallets?

MPC (Multi-Party Computation) wallets split a private key into multiple encrypted fragments. No single party -- not the agent, not the platform, not the user -- ever holds the complete key. When a transaction needs to be signed, the fragments are combined inside a secure enclave, the signature is produced, and the fragments are separated again.

For AI agents, this means:

- **The agent can sign transactions** without ever seeing the private key
- **The platform (MoltyDEX) can enforce policies** like spending limits before signing
- **The operator retains control** and can revoke access at any time
- **Key compromise is nearly impossible** because the full key never exists in one place

---

## Why MoltyDEX Is the Right Platform for This

MoltyDEX already handles the hardest part of agent payments: automatic token swapping and x402 payment processing. Adding managed wallets completes the stack.

Consider what an AI agent needs to operate financially:

| Capability | Without MoltyDEX | With MoltyDEX Today | With MoltyDEX + MPC |
|-----------|-----------------|--------------------|--------------------|
| **Wallet** | Manual keypair management | Manual keypair management | One API call to create |
| **Funding** | Manual token transfers | Manual token transfers | Fund with any token |
| **Swapping** | Build custom swap logic | Automatic via Jupiter | Automatic via Jupiter |
| **x402 Payments** | Build custom 402 handler | Automatic interception | Automatic interception |
| **Spending Limits** | Build custom logic | Not available | Built-in policy engine |
| **Audit Trail** | Build custom logging | Not available | Full transaction history |

With MPC wallets, MoltyDEX becomes the **complete financial infrastructure layer for AI agents on Solana**. No other platform combines all six capabilities.

---

## The Competitive Landscape

We evaluated every major option for agent wallet infrastructure on Solana:

### Turnkey (Our Recommended Provider)

Turnkey provides non-custodial MPC wallet infrastructure used by Magic Eden, Squads, and Mysten Labs. They have a dedicated `@turnkey/solana` npm package and even a Jupiter integration cookbook -- which maps directly to MoltyDEX's swap architecture.

**Why Turnkey fits MoltyDEX:**
- Production-proven with major Solana projects
- Policy engine for spending limits and token allowlists
- Sub-organizations for isolating agent wallets
- $0.01-0.10 per signature at scale (free tier for testing)

### Crossmint

Crossmint offers smart contract wallets with dual-key architecture (owner key + agent key in a TEE). More powerful for multi-agent fleets but more complex to integrate.

**Best for:** Enterprise agent fleet management in the future.

### Coinbase CDP (AgentKit)

Coinbase's AgentKit includes MPC wallets and supports Solana, but it's EVM-first and tied to the Coinbase ecosystem.

**Best for:** Teams already in the Coinbase ecosystem.

### Lit Protocol

Decentralized MPC with programmable signing conditions via "Lit Actions." Most flexible but highest integration complexity.

**Best for:** Teams that need fully decentralized, trustless signing.

### Privy

Embedded wallets with server-side signing, recently acquired by Stripe. More user-facing than agent-facing.

**Best for:** Consumer-facing applications, not agent infrastructure.

---

## Our Implementation Plan

### Phase 1: Signer Interface Abstraction

The foundation. We're refactoring the SDK's `WalletManager` into a pluggable `TransactionSigner` interface:

```typescript
interface TransactionSigner {
  getAddress(): string;
  signTransaction(transactionBase64: string): Promise<string>;
}
```

This means the SDK can use either a local keypair (existing behavior) or an MPC signer (new) without changing any agent code. It's a non-breaking change -- every existing integration continues working.

### Phase 2: Turnkey Integration

Adding Turnkey as a signing backend with wallet creation:

```typescript
const agent = new X402AutoPayAgent({
  apiUrl: 'https://api.moltydex.com',
  turnkeyApiKey: 'your-turnkey-key',
  createWallet: true,  // Creates a new MPC wallet automatically
  autoSwap: true,
});

// Agent now has its own wallet -- no private key needed
console.log('Agent wallet:', agent.getAddress());
```

### Phase 3: Wallet Management API

New endpoints on `api.moltydex.com`:

- `POST /api/wallet/create` -- Create a new MPC wallet for an agent
- `GET /api/wallet/:id` -- Get wallet info and balances
- `PUT /api/wallet/:id/policy` -- Set spending limits and token allowlists
- `GET /api/wallet/list` -- List all wallets in your organization

### Phase 4: Policy Engine

The feature that makes this enterprise-ready:

- **Spending limits** -- Max per transaction, per day, per week
- **Token allowlists** -- Only allow specific tokens (e.g., SOL and USDC only)
- **Recipient allowlists** -- Only allow payments to approved addresses
- **Time-based rules** -- Active hours, cooldown periods between transactions

### Phase 5: Documentation and Developer Experience

- Updated SDK with MPC wallet examples
- New `/developers` page section on managed wallets
- Integration guides for popular agent frameworks
- This blog post (you're reading it!)

**Estimated timeline: 8-13 days for the complete implementation.**

---

## What This Means for Developers

### If You're Building an AI Agent

You'll be able to create a wallet for your agent in one API call. No more exporting keypairs, no more storing secrets, no more worrying about key compromise. Set a spending limit, fund the wallet, and let your agent handle payments autonomously.

### If You're Running an Agent Fleet

Deploy 10, 50, or 100 agents, each with isolated wallets and individual spending policies. Monitor spending across your fleet from a single dashboard. Revoke access to any agent instantly.

### If You're an Enterprise

Get the compliance features you need: spending limits, audit trails, token restrictions, and non-custodial architecture. MoltyDEX + Turnkey provides SOC 2 compliant infrastructure without your team ever touching a private key.

---

## What This Means for the x402 Ecosystem

The x402 protocol enables AI agents to pay for APIs automatically. But until now, the wallet layer has been the weakest link -- agents needed raw private keys to participate.

MPC wallets remove that barrier. When agents can create their own wallets with built-in guardrails, the entire x402 ecosystem becomes more accessible:

- **More agents** can participate (lower barrier to entry)
- **More enterprises** can adopt x402 (compliance-ready)
- **More API providers** can offer x402 endpoints (larger addressable market)
- **More transactions** flow through the ecosystem (network effects)

MoltyDEX's position as the only x402 payment handler with managed wallets means we're not just participating in this ecosystem -- we're building the infrastructure layer that makes it work.

---

## Pricing Philosophy

We believe in transparent, developer-friendly pricing:

| Plan | Wallets | Signatures/mo | Price |
|------|---------|--------------|-------|
| **Free** | 3 | 100 | $0/mo |
| **Builder** | 25 | 5,000 | $29/mo |
| **Scale** | 100 | 25,000 | $99/mo |
| **Enterprise** | Unlimited | Custom | Contact us |

The free tier lets you test MPC wallets with zero commitment. Swap fees remain at 0% across all tiers -- we're monetizing the wallet infrastructure, not the swaps.

---

## Timeline and What's Next

We're starting with Phase 1 (Signer interface abstraction) immediately. This is a non-breaking refactor that makes the SDK cleaner and prepares the foundation for MPC support.

Phases 2-3 (Turnkey integration and Wallet API) will follow within 1-2 weeks. We'll announce when the first managed wallets are live on mainnet.

**Want to be among the first to test MPC wallets?** Join our [beta program](https://moltydex.com/blog/beta-ai-agent-program-test-moltydex) and you'll get early access when managed wallets launch.

---

## Stay Updated

- **Twitter/X:** [@MoltyDEX](https://x.com/MoltyDEX)
- **GitHub:** [github.com/Djtrixuk/moltydex](https://github.com/Djtrixuk/moltydex)
- **Website:** [moltydex.com](https://moltydex.com)

---

*MoltyDEX is the only x402 payment handler with automatic token swapping for AI agents on Solana. Zero platform fees. Best prices via Jupiter. And soon -- managed wallets for agents that just work.*
