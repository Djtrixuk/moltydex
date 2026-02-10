/**
 * x402 Payments Hub Page
 * Comprehensive guide to x402 payments and MoltyDEX integration
 * SEO-optimized hub for all x402-related content
 */

import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';
import Breadcrumbs from '../components/Breadcrumbs';
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

  const lastUpdated = "2026-02-08";

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
      <PageHeader />
      <main className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <Breadcrumbs items={[{ name: 'x402 Payments', href: '/x402-payments' }]} />
          {/* Hero Section */}
          <div className="text-center mb-10 md:mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              x402 Payment Handler
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Automatic x402 payments with token swapping for AI agents on Solana. 
              <strong className="text-white"> Zero friction, zero fees, zero manual steps.</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/developers"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
              >
                Get Started with x402 Payments
              </Link>
              <Link
                href="/api-providers"
                className="px-8 py-4 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-xl font-semibold text-lg transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50 hover:scale-105"
              >
                Accept x402 Payments
              </Link>
            </div>
          </div>

          {/* What is x402 Section */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-8 md:p-12 border border-gray-700/50">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">What is x402 Payment Handler?</h2>
              <div className="space-y-4 text-gray-300">
                <p className="leading-relaxed">
                  The <strong className="text-white">x402 payment handler</strong> is a protocol extension that enables pay-per-use APIs. 
                  When an API requires payment, it returns a <code className="bg-gray-950/80 px-2 py-1 rounded text-sm border border-gray-800/50">402 Payment Required</code> response 
                  with payment instructions.
                </p>
                <p className="leading-relaxed">
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
                <p className="leading-relaxed">
                  <strong className="text-white">Result:</strong> Your agent gets the data it needs automatically, without any manual intervention.
                </p>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white">How x402 Payment Handler Works</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { num: '1️⃣', title: 'Agent Calls API', desc: 'Your AI agent makes a standard HTTP request to a premium API endpoint.' },
                { num: '2️⃣', title: 'API Returns 402', desc: 'API responds with 402 Payment Required, including payment details (token, amount, address).' },
                { num: '3️⃣', title: 'MoltyDEX Intercepts', desc: 'HTTPInterceptor automatically detects 402 and parses payment requirements.' },
                { num: '4️⃣', title: 'Automatic Token Swap', desc: 'If needed, MoltyDEX swaps tokens automatically via Jupiter aggregator (best prices).' },
                { num: '5️⃣', title: 'Payment Executed', desc: 'Payment transaction is built, signed client-side, and sent to Solana blockchain.' },
                { num: '6️⃣', title: 'Request Retried', desc: 'Original API request is retried with payment proof. API verifies and returns data.' }
              ].map((step, idx) => (
                <div key={idx} className="group bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                  <div className="text-3xl mb-4">{step.num}</div>
                  <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Key Features */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white">Why MoltyDEX is the Best x402 Payment Handler</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { 
                  title: '✅ Automatic Token Swapping', 
                  color: 'blue',
                  desc: 'Only x402 payment handler with automatic token swapping. Your agent can have SOL, but the API wants USDC? MoltyDEX swaps automatically. No manual steps, no pre-swapping needed.',
                  items: ['Routes through Jupiter aggregator (best prices)', 'Supports all SPL tokens', 'Handles any token pair', 'Zero manual intervention']
                },
                { 
                  title: '💰 Zero Platform Fees', 
                  color: 'green',
                  desc: '0% fees for x402 payment handling. No platform fees, no hidden costs. You only pay Solana network fees (paid separately in SOL).',
                  items: ['No subscription fees', 'No per-transaction platform fees', 'Transparent pricing', 'Pay only for what you use']
                },
                { 
                  title: '🔒 Maximum Security', 
                  color: 'purple',
                  desc: 'Client-side signing only. Your private keys never leave your system. MoltyDEX builds unsigned transactions - you sign them locally.',
                  items: ['Private keys stay with you', 'No key storage on servers', 'Open source and auditable', 'Production-ready security']
                },
                { 
                  title: '⚡ Best Prices', 
                  color: 'yellow',
                  desc: 'Routes through Jupiter aggregator to find optimal prices across all Solana DEXes. Gets you the best rates automatically.',
                  items: ['Scans Raydium, Orca, Meteora, and more', 'Finds optimal swap routes', 'Splits orders across DEXes if needed', 'Minimizes price impact']
                }
              ].map((feature, idx) => (
                <div key={idx} className={`group bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-gray-700/50 hover:border-${feature.color}-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-${feature.color}-500/10`}>
                  <h3 className={`text-xl font-bold mb-3 text-${feature.color}-400`}>{feature.title}</h3>
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                    <strong className="text-white">{feature.desc.split('.')[0]}.</strong> {feature.desc.split('.').slice(1).join('.')}
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-500 ml-2">
                    {feature.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Integration Guide */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white">How to Integrate x402 Payment Handler</h2>
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-8 border border-gray-700/50">
              <div className="space-y-6 mb-8">
                {integrationSteps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-lg font-bold mb-2 text-white">{step.name}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-8 border-t border-gray-700/50">
                <h3 className="text-xl font-bold mb-4 text-white">Quick Start Code</h3>
                <pre className="bg-gray-950/80 p-6 rounded-lg overflow-x-auto text-sm text-gray-300 border border-gray-800/50">
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
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white">x402 Payment Handler Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: '🤖', title: 'AI Agent Payments', desc: 'AI agents need to pay for premium APIs automatically. x402 payment handler enables seamless, automatic payments without manual intervention.', link: { href: '/use-cases', text: 'View AI Agent Use Cases →' } },
                { icon: '💾', title: 'Pay-Per-Use APIs', desc: 'API providers can monetize their services with x402 payments. Agents pay automatically, including automatic token swapping if needed.', link: { href: '/api-providers', text: 'Learn About API Monetization →' } },
                { icon: '📊', title: 'Automated Data Collection', desc: 'Agents collect data from multiple paid APIs. x402 payment handler ensures seamless payments even when each API requires different tokens.', link: { href: '/blog/real-world-use-cases-moltydex-x402-payments', text: 'Read Case Study →' } },
                { icon: '🔄', title: 'Agent-to-Agent Payments', desc: 'Enable agents to pay other agents for specialized services. x402 payment handler enables true agent-to-agent economy.', link: { href: '/blog/the-future-of-agent-payments', text: 'Learn About Agent Economy →' } }
              ].map((useCase, idx) => (
                <div key={idx} className="group bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                  <div className="text-2xl mb-3">{useCase.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-white">{useCase.title}</h3>
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed">{useCase.desc}</p>
                  <Link href={useCase.link.href} className="text-blue-400 hover:text-blue-300 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    {useCase.link.text}
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Comparison */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white">x402 Payment Handler Comparison</h2>
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-gray-700/50 overflow-x-auto">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-700/50">
                      <th className="text-left py-4 text-sm font-semibold text-gray-300">Feature</th>
                      <th className="text-center py-4 text-sm font-semibold text-gray-300">Manual Implementation</th>
                      <th className="text-center py-4 text-sm font-semibold text-gray-300">Other Solutions</th>
                      <th className="text-center py-4 text-sm font-semibold text-white">MoltyDEX</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-400 text-sm">
                    {[
                      { feature: 'Automatic x402 Detection', manual: '❌ Manual', other: '⚠️ Partial', moltydex: '✅ Automatic' },
                      { feature: 'Automatic Token Swapping', manual: '❌ Manual', other: '❌ None', moltydex: '✅ Automatic' },
                      { feature: 'Payment Processing', manual: '⚠️ Complex', other: '⚠️ Basic', moltydex: '✅ Complete' },
                      { feature: 'Request Retry Logic', manual: '⚠️ Manual', other: '⚠️ Partial', moltydex: '✅ Automatic' },
                      { feature: 'Error Handling', manual: '⚠️ Basic', other: '⚠️ Basic', moltydex: '✅ Robust' },
                      { feature: 'Platform Fees', manual: 'N/A', other: '0.1-0.5%', moltydex: '0%' },
                      { feature: 'Integration Time', manual: 'Days/weeks', other: 'Hours', moltydex: '5 minutes' }
                    ].map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-800/50 last:border-0">
                        <td className="py-4 font-semibold text-gray-300">{row.feature}</td>
                        <td className="text-center py-4">{row.manual}</td>
                        <td className="text-center py-4">{row.other}</td>
                        <td className="text-center py-4 text-green-400 font-bold">{row.moltydex}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Related Content */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white">Learn More About x402 Payments</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { href: '/blog/understanding-x402-protocol-for-developers', title: 'Understanding x402 Protocol', desc: 'Complete guide to x402 Payment Required protocol for developers' },
                { href: '/blog/how-moltydex-handles-x402-payments-automatically', title: 'How MoltyDEX Handles x402', desc: 'Technical deep dive into automatic x402 payment processing' },
                { href: '/blog/solana-x402-payment-best-practices', title: 'x402 Best Practices', desc: 'Best practices for implementing x402 payments on Solana' },
                { href: '/developers', title: 'Developer Documentation', desc: 'Complete API reference and integration guides' },
                { href: '/api-providers', title: 'For API Providers', desc: 'Learn how to accept x402 payments for your API' },
                { href: '/blog', title: 'All Blog Posts', desc: 'Browse all x402 and payment-related content' }
              ].map((item, idx) => (
                <Link 
                  key={idx}
                  href={item.href} 
                  className="group bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <h3 className="text-lg font-bold mb-2 text-white">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* Last Updated */}
          <div className="text-center text-sm text-gray-500 mb-6">
            <time dateTime={lastUpdated}>Last updated: {new Date(lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-blue-950/40 via-purple-950/40 to-indigo-950/40 rounded-2xl p-8 md:p-10 border border-blue-500/20 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Ready to Start Handling x402 Payments?</h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Get started with automatic x402 payment handling in just 5 minutes. Zero fees, zero friction, zero manual steps.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/developers"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
              >
                Get Started Now
              </Link>
              <Link
                href="/api-docs"
                className="px-8 py-4 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-xl font-semibold text-lg transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50 hover:scale-105"
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
