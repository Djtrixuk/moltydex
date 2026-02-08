/**
 * MoltyDEX Whitepaper
 * Comprehensive documentation of the protocol
 */

import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';

export default function Whitepaper() {
  return (
    <>
      <Head>
        <title>MoltyDEX Whitepaper - x402 Token Aggregator Documentation</title>
        <meta name="description" content="Comprehensive documentation of MoltyDEX - x402 Token Aggregator for AI Agents on Solana. Learn about architecture, API design, x402 integration, and agent-specific features." />
        <meta property="og:title" content="MoltyDEX Whitepaper - x402 Token Aggregator Documentation" />
        <meta property="og:description" content="Comprehensive documentation of MoltyDEX - x402 Token Aggregator for AI Agents on Solana." />
        <meta property="og:url" content="https://moltydex.com/whitepaper" />
        <meta property="twitter:title" content="MoltyDEX Whitepaper - x402 Token Aggregator Documentation" />
        <meta property="twitter:description" content="Comprehensive documentation of MoltyDEX - x402 Token Aggregator for AI Agents on Solana." />
        <link rel="canonical" href="https://moltydex.com/whitepaper" />
      </Head>
      <PageHeader />
      <main className="min-h-screen bg-gray-950 text-white">
        <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Header */}
          <header className="mb-10 md:mb-12 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              MoltyDEX Whitepaper
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive documentation of MoltyDEX - x402 Token Aggregator for AI Agents on Solana
            </p>
          </header>

          {/* Content */}
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-8 md:p-12 border border-gray-700/50 space-y-8">
          
          {/* Executive Summary */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">Executive Summary</h2>
            <p className="text-lg leading-relaxed">
              MoltyDEX is a decentralized exchange (DEX) aggregator specifically designed for AI agents operating on the Solana blockchain. 
              Built on top of the Jupiter aggregator, MoltyDEX provides a seamless, programmatic interface for AI agents to swap tokens, 
              make payments via the x402 protocol, and manage their token portfolios. The platform combines best-price routing across multiple 
              DEXes with agent-specific features including webhook notifications, enhanced error handling, intelligent token recommendations, 
              and comprehensive transaction tracking.
            </p>
          </section>

          {/* Table of Contents */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-4">Table of Contents</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><a href="#overview" className="text-gray-300 hover:text-white underline">1. Overview</a></li>
              <li><a href="#architecture" className="text-gray-300 hover:text-white underline">2. Architecture</a></li>
              <li><a href="#x402-integration" className="text-gray-300 hover:text-white underline">3. x402 Protocol Integration</a></li>
              <li><a href="#agent-features" className="text-gray-300 hover:text-white underline">4. Agent-Specific Features</a></li>
              <li><a href="#api-design" className="text-gray-300 hover:text-white underline">5. API Design</a></li>
              <li><a href="#security" className="text-gray-300 hover:text-white underline">6. Security & Trust</a></li>
              <li><a href="#use-cases" className="text-gray-300 hover:text-white underline">7. Use Cases</a></li>
              <li><a href="#future" className="text-gray-300 hover:text-white underline">8. Future Development</a></li>
            </ul>
          </section>

          {/* 1. Overview */}
          <section id="overview">
            <h2 className="text-3xl font-bold text-white mb-4">1. Overview</h2>
            
            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">1.1 What is MoltyDEX?</h3>
            <p className="leading-relaxed mb-4">
              MoltyDEX is a DEX aggregator that routes token swaps through Jupiter, which in turn finds the best prices across 
              multiple Solana DEXes including Raydium, Orca, Meteora, and others. Unlike traditional DEX interfaces designed for humans, 
              MoltyDEX is built from the ground up for programmatic access by AI agents.
            </p>

            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">1.2 Core Value Proposition</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>Best Prices:</strong> Routes through Jupiter to find optimal swap routes across all major Solana DEXes</li>
              <li><strong>Zero Fees:</strong> 0% platform fees - completely free swaps</li>
              <li><strong>Agent-Optimized:</strong> RESTful API designed for programmatic access</li>
              <li><strong>x402 Ready:</strong> Native support for x402 payment protocol</li>
              <li><strong>Zero Deployment:</strong> No smart contracts required, just an API server</li>
              <li><strong>Secure:</strong> Client-side transaction signing (private keys never leave agent's system)</li>
            </ul>

            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">1.3 Key Differentiators</h3>
            <div className="bg-gray-950/50 rounded-lg p-4 mb-4 border border-gray-800/50">
              <p className="mb-2 font-semibold text-white"><strong>vs. Direct Jupiter API:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-300 text-sm">
                <li>Agent-specific features (webhooks, recommendations, enhanced errors)</li>
                <li>x402 protocol integration</li>
                <li>Transaction status tracking</li>
                <li>Batch operations for efficiency</li>
              </ul>
            </div>
            <div className="bg-gray-950/50 rounded-lg p-4 mb-4 border border-gray-800/50">
              <p className="mb-2 font-semibold text-white"><strong>vs. Traditional DEX Interfaces:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-gray-300 text-sm">
                <li>Programmatic API access (no UI required)</li>
                <li>Structured error responses with actionable guidance</li>
                <li>Real-time webhook notifications</li>
                <li>Intelligent token recommendations</li>
              </ul>
            </div>
          </section>

          {/* 2. Architecture */}
          <section id="architecture">
            <h2 className="text-3xl font-bold text-white mb-4">2. Architecture</h2>
            
            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">2.1 System Components</h3>
            <div className="bg-gray-950/50 rounded-lg p-4 mb-4 border border-gray-800/50">
              <p className="mb-2 font-semibold text-white">API Layer (Express.js)</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm text-gray-300">
                <li>RESTful API endpoints</li>
                <li>Rate limiting and security</li>
                <li>Request validation</li>
                <li>Error handling</li>
              </ul>
            </div>
            <div className="bg-gray-950/50 border border-gray-800/50 rounded-lg p-4 mb-4">
              <p className="mb-2 font-semibold">Jupiter Integration</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Quote fetching from multiple Jupiter endpoints</li>
                <li>Transaction building using Jupiter's official client</li>
                <li>Fallback endpoints for reliability</li>
              </ul>
            </div>
            <div className="bg-gray-950/50 border border-gray-800/50 rounded-lg p-4 mb-4">
              <p className="mb-2 font-semibold">Solana RPC</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li>Balance checking</li>
                <li>Transaction status tracking</li>
                <li>Transaction history</li>
                <li>Account information</li>
              </ul>
            </div>

            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">2.2 Request Flow</h3>
            <div className="bg-gray-950/50 border border-gray-800/50 rounded-lg p-4 mb-4 font-mono text-sm">
              <p>1. Agent requests quote → MoltyDEX API</p>
              <p>2. MoltyDEX → Jupiter API (multiple endpoints)</p>
              <p>3. Jupiter → Multiple DEXes (finds best route)</p>
              <p>4. MoltyDEX adds fee calculation</p>
              <p>5. Agent builds transaction (client-side)</p>
              <p>6. Agent signs transaction (private key stays local)</p>
              <p>7. Agent sends signed transaction → Solana network</p>
              <p>8. MoltyDEX tracks status and notifies webhooks</p>
            </div>
          </section>

          {/* 3. x402 Integration */}
          <section id="x402-integration">
            <h2 className="text-3xl font-bold text-white mb-4">3. x402 Protocol Integration</h2>
            
            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">3.1 What is x402?</h3>
            <p className="leading-relaxed mb-4">
              x402 is a payment protocol that enables API providers to request payment before serving content. 
              When an API returns a 402 Payment Required response, it includes payment requirements specifying 
              the amount, token, and network needed.
            </p>

            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">3.2 MoltyDEX x402 Features</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong>Parse Payment Requirements:</strong> Extract payment details from 402 responses</li>
              <li><strong>Balance Checking:</strong> Verify if agent has sufficient tokens</li>
              <li><strong>Automatic Swapping:</strong> Swap to required token if needed</li>
              <li><strong>Payment Preparation:</strong> Build and sign payment transactions</li>
              <li><strong>Auto-Pay Flow:</strong> Complete end-to-end payment handling</li>
              <li><strong>Token Recommendations:</strong> Suggest optimal payment tokens</li>
            </ul>

            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">3.3 x402 Workflow</h3>
            <div className="bg-gray-950/50 border border-gray-800/50 rounded-lg p-4 mb-4">
              <ol className="list-decimal list-inside space-y-2">
                <li>Agent receives 402 Payment Required response</li>
                <li>Agent calls <code className="bg-black/30 px-1 rounded">POST /api/x402/parse-payment</code> to extract requirements</li>
                <li>Agent calls <code className="bg-black/30 px-1 rounded">POST /api/x402/prepare-payment</code> to check balance</li>
                <li>If insufficient balance, MoltyDEX provides swap quote</li>
                <li>Agent executes swap (if needed) and payment</li>
                <li>Agent retries original API request with payment proof</li>
              </ol>
            </div>
          </section>

          {/* 4. Agent-Specific Features */}
          <section id="agent-features">
            <h2 className="text-3xl font-bold text-white mb-4">4. Agent-Specific Features</h2>
            
            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">4.1 Webhook Notifications</h3>
            <p className="leading-relaxed mb-4">
              Agents can register webhooks to receive real-time notifications when transactions are confirmed or fail. 
              This eliminates the need for polling and enables event-driven architectures.
            </p>
            <div className="bg-gray-950/50 border border-gray-800/50 rounded-lg p-4 mb-4">
              <p className="font-mono text-sm">
                POST /api/transaction/webhook<br/>
                {`{ "signature": "...", "callback_url": "https://..." }`}
              </p>
            </div>

            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">4.2 Enhanced Error Responses</h3>
            <p className="leading-relaxed mb-4">
              All errors include structured information with error codes, detailed context, and actionable suggestions. 
              Agents can programmatically handle errors and retry with correct actions.
            </p>
            <div className="bg-gray-950/50 border border-gray-800/50 rounded-lg p-4 mb-4">
              <p className="font-mono text-sm">
                {`{`}<br/>
                {`  "error": "Insufficient balance",`}<br/>
                {`  "code": "INSUFFICIENT_BALANCE",`}<br/>
                {`  "details": { "required": "...", "available": "..." },`}<br/>
                {`  "suggestions": ["Swap SOL to USDC", "Check balance"]`}<br/>
                {`}`}
              </p>
            </div>

            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">4.3 Token Recommendations</h3>
            <p className="leading-relaxed mb-4">
              Intelligent token recommendations based on use case (payment, swap, liquidity), agent-friendliness, 
              and liquidity scores. Helps agents discover optimal tokens for their needs.
            </p>

            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">4.4 Batch Operations</h3>
            <p className="leading-relaxed mb-4">
              Check multiple balances, get multiple quotes, or fetch multiple token metadata in a single API call. 
              Reduces API calls and improves efficiency.
            </p>

            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">4.5 Rate Limit Management</h3>
            <p className="leading-relaxed mb-4">
              Dedicated endpoints for checking rate limit status. Agents can proactively manage their API usage 
              and implement backoff strategies.
            </p>

            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">4.6 Cost Transparency</h3>
            <p className="leading-relaxed mb-4">
              All quotes include detailed fee breakdowns showing aggregator fees, network fees, priority fees, 
              and total cost estimates. Agents can make informed decisions about swap costs.
            </p>
          </section>

          {/* 5. API Design */}
          <section id="api-design">
            <h2 className="text-3xl font-bold text-white mb-4">5. API Design</h2>
            
            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">5.1 Core Endpoints</h3>
            <div className="bg-gray-950/50 border border-gray-800/50 rounded-lg p-4 mb-4 space-y-2">
              <p><strong>Quotes:</strong> <code className="bg-black/30 px-1 rounded">GET /api/quote</code></p>
              <p><strong>Swap Building:</strong> <code className="bg-black/30 px-1 rounded">POST /api/swap/build</code></p>
              <p><strong>Balance:</strong> <code className="bg-black/30 px-1 rounded">GET /api/balance</code></p>
              <p><strong>Token Metadata:</strong> <code className="bg-black/30 px-1 rounded">GET /api/token</code></p>
              <p><strong>Transaction Status:</strong> <code className="bg-black/30 px-1 rounded">GET /api/transaction/status/:signature</code></p>
            </div>

            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">5.2 x402 Endpoints</h3>
            <div className="bg-gray-950/50 border border-gray-800/50 rounded-lg p-4 mb-4 space-y-2">
              <p><strong>Parse Payment:</strong> <code className="bg-black/30 px-1 rounded">POST /api/x402/parse-payment</code></p>
              <p><strong>Prepare Payment:</strong> <code className="bg-black/30 px-1 rounded">POST /api/x402/prepare-payment</code></p>
              <p><strong>Auto-Pay:</strong> <code className="bg-black/30 px-1 rounded">POST /api/x402/auto-pay</code></p>
            </div>

            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">5.3 Agent Features</h3>
            <div className="bg-gray-950/50 border border-gray-800/50 rounded-lg p-4 mb-4 space-y-2">
              <p><strong>Webhooks:</strong> <code className="bg-black/30 px-1 rounded">POST /api/transaction/webhook</code></p>
              <p><strong>Recommendations:</strong> <code className="bg-black/30 px-1 rounded">GET /api/tokens/recommend</code></p>
              <p><strong>Rate Limits:</strong> <code className="bg-black/30 px-1 rounded">GET /api/rate-limit/status</code></p>
              <p><strong>Batch Operations:</strong> <code className="bg-black/30 px-1 rounded">POST /api/batch/*</code></p>
            </div>

            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">5.4 Response Format</h3>
            <p className="leading-relaxed mb-4">
              All responses follow a consistent JSON format. Success responses include data, error responses include 
              error code, details, and suggestions. Rate limit headers are included in all responses.
            </p>
          </section>

          {/* 6. Security */}
          <section id="security">
            <h2 className="text-3xl font-bold text-white mb-4">6. Security & Trust</h2>
            
            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">6.1 Client-Side Signing</h3>
            <p className="leading-relaxed mb-4">
              <strong>Critical:</strong> Private keys never leave the agent's system. Transactions are built server-side 
              but signed client-side. The API only receives already-signed transactions for broadcasting.
            </p>

            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">6.2 Rate Limiting</h3>
            <p className="leading-relaxed mb-4">
              Rate limits prevent abuse and ensure fair usage. Different limits apply to different endpoint types 
              (general API: 100/15min, swaps: 10/min, quotes: 30/min).
            </p>

            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">6.3 Input Validation</h3>
            <p className="leading-relaxed mb-4">
              All inputs are validated using Joi schemas. Invalid requests are rejected with clear error messages 
              before processing.
            </p>

            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">6.4 Error Handling</h3>
            <p className="leading-relaxed mb-4">
              Comprehensive error handling prevents information leakage while providing useful debugging information 
              to agents.
            </p>
          </section>

          {/* 7. Use Cases */}
          <section id="use-cases">
            <h2 className="text-3xl font-bold text-white mb-4">7. Use Cases</h2>
            
            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">7.1 x402 Payment Automation</h3>
            <p className="leading-relaxed mb-4">
              AI agents can automatically handle x402 payment requirements by parsing payment requests, checking balances, 
              swapping tokens if needed, and making payments—all programmatically.
            </p>

            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">7.2 Token Portfolio Management</h3>
            <p className="leading-relaxed mb-4">
              Agents can check balances across multiple tokens, swap between tokens to optimize portfolios, and track 
              transaction history.
            </p>

            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">7.3 Arbitrage & Trading</h3>
            <p className="leading-relaxed mb-4">
              Trading bots can use MoltyDEX to find best prices, execute swaps, and track transaction status in real-time 
              via webhooks.
            </p>

            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">7.4 Payment Processing</h3>
            <p className="leading-relaxed mb-4">
              Services can integrate MoltyDEX to accept payments in any Solana token, automatically swapping to preferred 
              tokens if needed.
            </p>
          </section>

          {/* 8. Future Development */}
          <section id="future">
            <h2 className="text-3xl font-bold text-white mb-4">8. Future Development</h2>
            
            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">8.1 Planned Features</h3>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Webhook signature verification</li>
              <li>Persistent webhook storage (Redis/database)</li>
              <li>Transaction simulation endpoint</li>
              <li>Multi-token balance endpoint</li>
              <li>Quote caching for performance</li>
              <li>Agent usage analytics</li>
              <li>TypeScript SDK</li>
              <li>OpenAPI/Swagger documentation</li>
            </ul>

            <h3 className="text-2xl font-semibold text-white mt-6 mb-3">8.2 Scalability</h3>
            <p className="leading-relaxed mb-4">
              The current architecture is designed to scale horizontally. Future improvements include connection pooling, 
              response caching, and distributed rate limiting.
            </p>
          </section>

          {/* Conclusion */}
          <section className="mt-12 pt-8 border-t border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">Conclusion</h2>
            <p className="leading-relaxed mb-4">
              MoltyDEX bridges the gap between traditional DEX interfaces and the needs of AI agents. By combining 
              Jupiter's best-price routing with agent-specific features, MoltyDEX enables a new class of automated 
              financial applications on Solana. The platform's focus on security, transparency, and agent-friendly 
              design makes it the ideal choice for AI agents needing reliable token swap capabilities.
            </p>
            <p className="leading-relaxed">
              For technical documentation, API reference, and integration guides, visit the{' '}
              <Link href="/api-docs" className="text-gray-300 hover:text-white underline">
                API documentation
              </Link>.
            </p>
          </section>
        </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-white/20 text-center text-gray-400 text-sm">
            <p>
              MoltyDEX • Built for AI Agents • Powered by{' '}
              <a href="https://jup.ag" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white underline">
                Jupiter
              </a>
              {' '}•{' '}
              <a href="https://x402.org" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white underline">
                x402 Protocol
              </a>
            </p>
          </footer>
        </article>
      </main>
    </>
  );
}
