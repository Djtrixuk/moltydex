/**
 * Developers Page
 * Showcases MoltyDEX for developers building agents
 */

import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';

export default function Developers() {
  return (
    <>
      <Head>
        <title>For Developers - MoltyDEX | x402 Auto-Pay Agent for AI Agents</title>
        <meta name="description" content="Build AI agents that automatically handle x402 payments. MoltyDEX auto-pay agent handles token swapping, payment processing, and request retries automatically. Zero integration effort, full automation. Get started in minutes." />
        <meta name="keywords" content="x402 auto-pay agent, AI agent payments, automatic x402 payments, token swap agent, Solana agent payments, x402 integration, AI agent development, pay-per-use API, micropayments AI" />
        <link rel="canonical" href="https://moltydex.com/developers" />
        
        {/* Open Graph */}
        <meta property="og:title" content="For Developers - MoltyDEX | x402 Auto-Pay Agent" />
        <meta property="og:description" content="Build AI agents that automatically handle x402 payments. Zero integration effort, full automation." />
        <meta property="og:url" content="https://moltydex.com/developers" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://moltydex.com/moltydex-logo-full.png" />
        <meta property="og:image:alt" content="MoltyDEX for Developers" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="For Developers - MoltyDEX | x402 Auto-Pay Agent" />
        <meta name="twitter:description" content="Build AI agents that automatically handle x402 payments. Zero integration effort, full automation." />
        <meta name="twitter:image" content="https://moltydex.com/moltydex-logo-full.png" />
      </Head>
      <PageHeader />
      <main className="min-h-screen bg-gray-950 text-white">
        <div className="container mx-auto px-4 py-6 md:py-12 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">For Developers</h1>
            <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Build AI agents that automatically handle x402 payments. The only fully automated solution that handles token swapping, payment processing, and request retries—all without manual intervention.
            </p>
          </div>

          {/* x402 Auto-Pay Agent */}
          <section className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">🚀 x402 Auto-Pay Agent</h2>
            <p className="text-lg text-gray-300 mb-6">
              The <strong>only</strong> fully automated x402 payment handler. Your agents can pay for APIs automatically, 
              swap tokens when needed, and retry requests—all without manual intervention. 
              <strong className="text-white"> Zero integration complexity.</strong>
            </p>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
              <h3 className="text-xl font-semibold mb-4">How It Works</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-300">
                <li>Agent calls API → Gets 402 Payment Required</li>
                <li>Auto-pay agent intercepts → Parses payment requirements</li>
                <li>Checks balance → Swaps tokens if needed (automatically)</li>
                <li>Makes payment → Confirms transaction</li>
                <li>Retries original request → Success!</li>
              </ol>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
              <h3 className="text-xl font-semibold mb-4">Quick Start</h3>
              <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto text-sm">
{`import { HTTPInterceptor } from '@moltydex/agent';

// Setup once
const interceptor = new HTTPInterceptor({
  apiUrl: 'https://api.moltydex.com',
  walletSecretKey: process.env.WALLET_SECRET_KEY,
  autoSwap: true,
});

// Now all fetch() calls handle 402 automatically!
const response = await fetch('https://premium-api.com/data');
const data = await response.json(); // Works seamlessly!`}
              </pre>
            </div>

            <div className="flex gap-4">
              <Link
                href="/api-docs"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const { trackEvent } = require('../lib/analytics');
                    trackEvent('docs_link_clicked', { source: 'developers_page' });
                  }
                }}
              >
                Read Documentation
              </Link>
            </div>
          </section>

          {/* Features */}
          <section className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Features</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-semibold mb-2">✅ Fully Automated</h3>
                <p className="text-gray-300">
                  No manual intervention needed. Agents handle payments completely automatically.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">🔄 Token Swapping</h3>
                <p className="text-gray-300">
                  Automatically swaps any token → required token. Works with SOL, USDC, USDT, and more.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">🔐 Secure</h3>
                <p className="text-gray-300">
                  Client-side signing. Private keys never leave your system.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">⚡ Event-Driven</h3>
                <p className="text-gray-300">
                  Uses webhooks instead of polling. Efficient and scalable.
                </p>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Use Cases</h2>
            <div className="space-y-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-semibold mb-2">1. Premium API Access</h3>
                <p className="text-gray-300 mb-4">
                  Your agent needs premium data or services that require payment. MoltyDEX automatically handles the entire payment flow—no manual steps required.
                </p>
                <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto text-sm">
{`// Just call APIs normally - agent handles 402 automatically!
// If payment needed: swaps tokens → pays → retries → success
const response = await fetch('https://premium-api.com/data');
const data = await response.json();`}
                </pre>
              </div>

              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">2. Multi-API Data Collection</h3>
                <p className="text-gray-300 mb-4">
                  Collect data from multiple paid APIs simultaneously. MoltyDEX handles all payments, token swaps, and retries automatically—even if each API requires different tokens.
                </p>
                <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto text-sm">
{`// Parallel API calls with automatic payment handling
const apis = ['api1.com', 'api2.com', 'api3.com'];
const results = await Promise.all(
  apis.map(url => fetch(url).then(r => r.json()))
);`}
                </pre>
              </div>

              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">3. Agent-to-Agent Payments</h3>
                <p className="text-gray-300 mb-4">
                  Enable your agents to pay other agents for specialized services. Perfect for multi-agent workflows where agents need to purchase capabilities on-demand.
                </p>
              </div>

              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">4. Dynamic Token Management</h3>
                <p className="text-gray-300 mb-4">
                  Agents automatically swap any token to the required payment token. No need to pre-fund specific tokens—agents can pay with whatever they have.
                </p>
              </div>
            </div>
          </section>

          {/* API Reference */}
          <section className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">API Reference</h2>
            <p className="text-gray-300 mb-4">
              MoltyDEX provides a simple REST API for programmatic access.
            </p>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4">Key Endpoints</h3>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <code className="bg-black/30 px-2 py-1 rounded">GET /api/quote</code> - Get swap quote
                </li>
                <li>
                  <code className="bg-black/30 px-2 py-1 rounded">POST /api/swap/build</code> - Build swap transaction
                </li>
                <li>
                  <code className="bg-black/30 px-2 py-1 rounded">GET /api/balance</code> - Check token balance
                </li>
                <li>
                  <code className="bg-black/30 px-2 py-1 rounded">POST /api/x402/parse-payment</code> - Parse 402 response
                </li>
                <li>
                  <code className="bg-black/30 px-2 py-1 rounded">POST /api/x402/auto-pay</code> - Complete payment flow
                </li>
              </ul>
              <Link
                href="/api-docs"
                className="inline-block mt-4 text-gray-300 hover:text-white underline"
              >
                View Full API Documentation →
              </Link>
            </div>
          </section>

          {/* Get Started */}
          <section className="bg-gray-900 rounded-lg p-8 border border-gray-800 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-300 mb-6">
              Build agents that handle payments automatically. Get started in minutes.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/api-docs"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Read Documentation
              </Link>
              <a
                href="https://x.com/MoltyDEX"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Follow MoltyDEX on X"
              >
                Follow on X
              </a>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
