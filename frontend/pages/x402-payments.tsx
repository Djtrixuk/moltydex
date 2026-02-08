/**
 * x402 Payments Hub Page
 * Comprehensive guide to x402 payments and MoltyDEX integration
 * SEO-optimized hub for all x402-related content
 */

import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';
import { BreadcrumbStructuredData, PaymentServiceStructuredData, HowToStructuredData } from '../components/StructuredData';

export default function X402Payments() {
  const integrationSteps = [
    {
      name: "Install SDK",
      text: "Install @moltydex/agent package using npm or pip. The SDK provides automatic x402 payment handling for both TypeScript/JavaScript and Python agents."
    },
    {
      name: "Configure HTTP Interceptor",
      text: "Set up the HTTPInterceptor with your Solana wallet. This automatically intercepts all HTTP responses and handles 402 Payment Required responses seamlessly."
    },
    {
      name: "Enable Automatic Token Swapping",
      text: "Configure autoSwap: true to enable automatic token conversion. MoltyDEX will automatically swap any token to the required payment token when needed."
    },
    {
      name: "Make API Calls",
      text: "Use standard fetch() or requests.get() calls. When an API returns 402, MoltyDEX automatically handles payment, token swapping, and request retry."
    },
    {
      name: "Monitor and Scale",
      text: "Track payment success rates, monitor balances, and scale your agent operations. MoltyDEX handles all payment complexity automatically."
    }
  ];

  return (
    <>
      <Head>
        <title>x402 Payment Handler - Automatic x402 Payments for Solana | MoltyDEX</title>
        <meta name="description" content="Complete guide to x402 payment handler for Solana. Automatic x402 payments with token swapping for AI agents. Zero-friction pay-per-use API payments. Best x402 payment handler for Solana." />
        <meta name="keywords" content="x402 payment handler, x402 payments, automatic x402 payments, x402 protocol, x402 Solana, x402 auto-pay agent, pay-per-use API, Solana payment protocol, x402 integration, automatic token swap x402" />
        <link rel="canonical" href="https://moltydex.com/x402-payments" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://moltydex.com/x402-payments" />
        <meta property="og:title" content="x402 Payment Handler - Automatic x402 Payments for Solana" />
        <meta property="og:description" content="Complete guide to x402 payment handler. Automatic x402 payments with token swapping for AI agents. Zero-friction pay-per-use API payments." />
        <meta property="og:image" content="https://moltydex.com/moltydex-logo-full.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="x402 Payment Handler - Automatic x402 Payments" />
        <meta name="twitter:description" content="Complete guide to x402 payment handler. Automatic x402 payments with token swapping for AI agents." />
        <meta name="twitter:image" content="https://moltydex.com/moltydex-logo-full.png" />
      </Head>

      <PaymentServiceStructuredData />
      <HowToStructuredData
        name="How to Integrate x402 Payments with MoltyDEX"
        description="Step-by-step guide to integrating automatic x402 payment handling in your AI agents"
        steps={integrationSteps}
      />
      <BreadcrumbStructuredData items={[
        { name: 'Home', url: 'https://moltydex.com' },
        { name: 'x402 Payments', url: 'https://moltydex.com/x402-payments' }
      ]} />

      <main className="min-h-screen bg-gray-950 text-white">
        <div className="container mx-auto px-4 py-6 md:py-12 max-w-6xl">
          <PageHeader />
          
          {/* Hero Section */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6">
              x402 Payment Handler
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-6 md:mb-8 max-w-4xl mx-auto">
              Automatic x402 payments with token swapping for AI agents on Solana. 
              <strong className="text-white"> Zero friction, zero fees, zero manual steps.</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/developers"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[56px] flex items-center justify-center"
              >
                Get Started with x402 Payments
              </Link>
              <Link
                href="/api-providers"
                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[56px] flex items-center justify-center"
              >
                Accept x402 Payments
              </Link>
            </div>
          </div>

          {/* What is x402 Section */}
          <section className="mb-12 md:mb-16">
            <div className="bg-gray-900 rounded-lg p-8 md:p-12 border border-gray-800">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">What is x402 Payment Handler?</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none text-gray-300 space-y-4">
                <p>
                  The <strong className="text-white">x402 payment handler</strong> is a protocol extension that enables pay-per-use APIs. 
                  When an API requires payment, it returns a <code className="bg-gray-800 px-2 py-1 rounded">402 Payment Required</code> response 
                  with payment instructions.
                </p>
                <p>
                  <strong className="text-white">MoltyDEX is the first and only x402 payment handler</strong> that automatically handles token swapping. 
                  When your AI agent encounters a 402 response, MoltyDEX:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Detects the 402 Payment Required response</li>
                  <li>Parses payment requirements (token, amount, address)</li>
                  <li>Checks your agent's balance</li>
                  <li>Automatically swaps tokens if needed (SOL → USDC, etc.)</li>
                  <li>Makes the payment on Solana blockchain</li>
                  <li>Retries the original request with payment proof</li>
                </ol>
                <p>
                  <strong className="text-white">Result:</strong> Your agent gets the data it needs automatically, without any manual intervention.
                </p>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">How x402 Payment Handler Works</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="text-4xl mb-4">1️⃣</div>
                <h3 className="text-xl font-bold mb-3">Agent Calls API</h3>
                <p className="text-gray-300">
                  Your AI agent makes a standard HTTP request to a premium API endpoint.
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="text-4xl mb-4">2️⃣</div>
                <h3 className="text-xl font-bold mb-3">API Returns 402</h3>
                <p className="text-gray-300">
                  API responds with 402 Payment Required, including payment details (token, amount, address).
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="text-4xl mb-4">3️⃣</div>
                <h3 className="text-xl font-bold mb-3">MoltyDEX Intercepts</h3>
                <p className="text-gray-300">
                  HTTPInterceptor automatically detects 402 and parses payment requirements.
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="text-4xl mb-4">4️⃣</div>
                <h3 className="text-xl font-bold mb-3">Automatic Token Swap</h3>
                <p className="text-gray-300">
                  If needed, MoltyDEX swaps tokens automatically via Jupiter aggregator (best prices).
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="text-4xl mb-4">5️⃣</div>
                <h3 className="text-xl font-bold mb-3">Payment Executed</h3>
                <p className="text-gray-300">
                  Payment transaction is built, signed client-side, and sent to Solana blockchain.
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="text-4xl mb-4">6️⃣</div>
                <h3 className="text-xl font-bold mb-3">Request Retried</h3>
                <p className="text-gray-300">
                  Original API request is retried with payment proof. API verifies and returns data.
                </p>
              </div>
            </div>
          </section>

          {/* Key Features */}
          <section className="mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Why MoltyDEX is the Best x402 Payment Handler</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-2xl font-bold mb-3 text-blue-400">✅ Automatic Token Swapping</h3>
                <p className="text-gray-300 mb-4">
                  <strong className="text-white">Only x402 payment handler with automatic token swapping.</strong> Your agent can have SOL, 
                  but the API wants USDC? MoltyDEX swaps automatically. No manual steps, no pre-swapping needed.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
                  <li>Routes through Jupiter aggregator (best prices)</li>
                  <li>Supports all SPL tokens</li>
                  <li>Handles any token pair</li>
                  <li>Zero manual intervention</li>
                </ul>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-2xl font-bold mb-3 text-green-400">💰 Zero Platform Fees</h3>
                <p className="text-gray-300 mb-4">
                  <strong className="text-white">0% fees for x402 payment handling.</strong> No platform fees, no hidden costs. 
                  You only pay Solana network fees (paid separately in SOL).
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
                  <li>No subscription fees</li>
                  <li>No per-transaction platform fees</li>
                  <li>Transparent pricing</li>
                  <li>Pay only for what you use</li>
                </ul>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-2xl font-bold mb-3 text-purple-400">🔒 Maximum Security</h3>
                <p className="text-gray-300 mb-4">
                  <strong className="text-white">Client-side signing only.</strong> Your private keys never leave your system. 
                  MoltyDEX builds unsigned transactions - you sign them locally.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
                  <li>Private keys stay with you</li>
                  <li>No key storage on servers</li>
                  <li>Open source and auditable</li>
                  <li>Production-ready security</li>
                </ul>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-2xl font-bold mb-3 text-yellow-400">⚡ Best Prices</h3>
                <p className="text-gray-300 mb-4">
                  <strong className="text-white">Routes through Jupiter aggregator</strong> to find optimal prices across all Solana DEXes. 
                  Gets you the best rates automatically.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
                  <li>Scans Raydium, Orca, Meteora, and more</li>
                  <li>Finds optimal swap routes</li>
                  <li>Splits orders across DEXes if needed</li>
                  <li>Minimizes price impact</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Integration Guide */}
          <section className="mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">How to Integrate x402 Payment Handler</h2>
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
              <div className="space-y-8">
                {integrationSteps.map((step, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{step.name}</h3>
                      <p className="text-gray-300">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-gray-800">
                <h3 className="text-xl font-bold mb-4">Quick Start Code</h3>
                <pre className="bg-black/30 p-6 rounded-lg overflow-x-auto text-sm">
{`import { HTTPInterceptor } from '@moltydex/agent';

// Setup once - handles all x402 payments automatically
const interceptor = new HTTPInterceptor({
  apiUrl: 'https://api.moltydex.com',
  walletSecretKey: process.env.WALLET_SECRET_KEY,
  autoSwap: true, // Enable automatic token swapping
});

// Now all fetch() calls handle x402 automatically!
const response = await fetch('https://premium-api.com/data');
const data = await response.json(); // Works seamlessly!`}
                </pre>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section className="mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">x402 Payment Handler Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-3">🤖 AI Agent Payments</h3>
                <p className="text-gray-300 mb-4">
                  AI agents need to pay for premium APIs automatically. x402 payment handler enables seamless, 
                  automatic payments without manual intervention.
                </p>
                <Link href="/use-cases" className="text-blue-400 hover:text-blue-300 underline">
                  View AI Agent Use Cases →
                </Link>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-3">💾 Pay-Per-Use APIs</h3>
                <p className="text-gray-300 mb-4">
                  API providers can monetize their services with x402 payments. Agents pay automatically, 
                  including automatic token swapping if needed.
                </p>
                <Link href="/api-providers" className="text-blue-400 hover:text-blue-300 underline">
                  Learn About API Monetization →
                </Link>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-3">📊 Automated Data Collection</h3>
                <p className="text-gray-300 mb-4">
                  Agents collect data from multiple paid APIs. x402 payment handler ensures seamless payments 
                  even when each API requires different tokens.
                </p>
                <Link href="/blog/real-world-use-cases-moltydex-x402-payments" className="text-blue-400 hover:text-blue-300 underline">
                  Read Case Study →
                </Link>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-3">🔄 Agent-to-Agent Payments</h3>
                <p className="text-gray-300 mb-4">
                  Enable agents to pay other agents for specialized services. x402 payment handler enables 
                  true agent-to-agent economy.
                </p>
                <Link href="/blog/the-future-of-agent-payments" className="text-blue-400 hover:text-blue-300 underline">
                  Learn About Agent Economy →
                </Link>
              </div>
            </div>
          </section>

          {/* Comparison */}
          <section className="mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">x402 Payment Handler Comparison</h2>
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-4 text-lg">Feature</th>
                    <th className="text-center py-4 text-lg">Manual Implementation</th>
                    <th className="text-center py-4 text-lg">Other Solutions</th>
                    <th className="text-center py-4 text-lg text-blue-400">MoltyDEX</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-gray-800">
                    <td className="py-4 font-semibold">Automatic x402 Detection</td>
                    <td className="text-center py-4">❌ Manual</td>
                    <td className="text-center py-4">⚠️ Partial</td>
                    <td className="text-center py-4 text-green-400 font-bold">✅ Automatic</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 font-semibold">Automatic Token Swapping</td>
                    <td className="text-center py-4">❌ Manual</td>
                    <td className="text-center py-4">❌ None</td>
                    <td className="text-center py-4 text-green-400 font-bold">✅ Automatic</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 font-semibold">Payment Processing</td>
                    <td className="text-center py-4">⚠️ Complex</td>
                    <td className="text-center py-4">⚠️ Basic</td>
                    <td className="text-center py-4 text-green-400 font-bold">✅ Complete</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 font-semibold">Request Retry Logic</td>
                    <td className="text-center py-4">⚠️ Manual</td>
                    <td className="text-center py-4">⚠️ Partial</td>
                    <td className="text-center py-4 text-green-400 font-bold">✅ Automatic</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 font-semibold">Error Handling</td>
                    <td className="text-center py-4">⚠️ Basic</td>
                    <td className="text-center py-4">⚠️ Basic</td>
                    <td className="text-center py-4 text-green-400 font-bold">✅ Robust</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-4 font-semibold">Platform Fees</td>
                    <td className="text-center py-4">N/A</td>
                    <td className="text-center py-4">0.1-0.5%</td>
                    <td className="text-center py-4 text-green-400 font-bold">0%</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-semibold">Integration Time</td>
                    <td className="text-center py-4">Days/weeks</td>
                    <td className="text-center py-4">Hours</td>
                    <td className="text-center py-4 text-green-400 font-bold">5 minutes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Related Content */}
          <section className="mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Learn More About x402 Payments</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/blog/understanding-x402-protocol-for-developers" className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-blue-500 transition-colors">
                <h3 className="text-xl font-bold mb-2">Understanding x402 Protocol</h3>
                <p className="text-gray-400 text-sm">Complete guide to x402 Payment Required protocol for developers</p>
              </Link>
              <Link href="/blog/how-moltydex-handles-x402-payments-automatically" className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-blue-500 transition-colors">
                <h3 className="text-xl font-bold mb-2">How MoltyDEX Handles x402</h3>
                <p className="text-gray-400 text-sm">Technical deep dive into automatic x402 payment processing</p>
              </Link>
              <Link href="/blog/solana-x402-payment-best-practices" className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-blue-500 transition-colors">
                <h3 className="text-xl font-bold mb-2">x402 Best Practices</h3>
                <p className="text-gray-400 text-sm">Best practices for implementing x402 payments on Solana</p>
              </Link>
              <Link href="/developers" className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-blue-500 transition-colors">
                <h3 className="text-xl font-bold mb-2">Developer Documentation</h3>
                <p className="text-gray-400 text-sm">Complete API reference and integration guides</p>
              </Link>
              <Link href="/api-providers" className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-blue-500 transition-colors">
                <h3 className="text-xl font-bold mb-2">For API Providers</h3>
                <p className="text-gray-400 text-sm">Learn how to accept x402 payments for your API</p>
              </Link>
              <Link href="/blog" className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-blue-500 transition-colors">
                <h3 className="text-xl font-bold mb-2">All Blog Posts</h3>
                <p className="text-gray-400 text-sm">Browse all x402 and payment-related content</p>
              </Link>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-8 md:p-12 border border-blue-500/30 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Handling x402 Payments?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Get started with automatic x402 payment handling in just 5 minutes. Zero fees, zero friction, zero manual steps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/developers"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[56px] flex items-center justify-center"
              >
                Get Started Now
              </Link>
              <Link
                href="/api-docs"
                className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[56px] flex items-center justify-center"
              >
                View API Documentation
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
