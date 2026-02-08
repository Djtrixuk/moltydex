import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';

export default function UseCases() {
  return (
    <>
      <Head>
        <title>Use Cases - MoltyDEX | x402 Payment Solutions for AI Agents</title>
        <meta name="description" content="Real-world use cases for MoltyDEX: Premium API access, automated data collection, pay-per-use AI services, and x402 protocol integration. See how AI agents use MoltyDEX for automatic token swapping." />
        <meta name="keywords" content="x402 use cases, AI agent payments, automated token swap, premium API access, pay-per-use API, x402 protocol integration, Solana agent payments" />
        <link rel="canonical" href="https://www.moltydex.com/use-cases" />
      </Head>
      <PageHeader />
      <main className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Header */}
          <div className="text-center mb-10 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Use Cases
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Real-world scenarios where MoltyDEX enables seamless x402 payments for AI agents
            </p>
          </div>

          {/* Use Cases */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              {
                icon: '💾',
                title: 'Premium API Access',
                desc: 'An agent needs to call a premium data API that charges 1 USDC per request. The agent has SOL but no USDC.',
                without: 'Payment fails → Manual swap needed → Automation broken',
                with: 'Automatic SOL → USDC swap → Payment succeeds → Data received'
              },
              {
                icon: '📊',
                title: 'Automated Data Collection',
                desc: 'An agent runs hourly to collect market data from multiple paid APIs. Each API might want different tokens (USDC, USDT, SOL).',
                without: 'Maintain balances in multiple tokens → Complex management → Higher costs',
                with: 'Keep SOL → Auto-swap to any token → Focus on data collection'
              },
              {
                icon: '🤖',
                title: 'Pay-Per-Use AI Services',
                desc: 'An agent uses multiple AI APIs that charge per request. Some want SOL, others want USDC.',
                without: 'Pre-swap tokens → Maintain multiple balances → Manual management',
                with: 'Keep SOL → Swap on-demand → Pay automatically → Zero friction'
              },
              {
                icon: '🔗',
                title: 'x402 Protocol Integration',
                desc: 'For API providers using x402, MoltyDEX ensures agents can actually pay. No more "agent has wrong token" errors.',
                without: 'Low conversion → Failed payments → Lost revenue',
                with: 'Higher conversion → Instant payments → Zero manual processing'
              }
            ].map((useCase, idx) => (
              <div key={idx} className="group bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 md:p-8 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <div className="text-3xl mb-4">{useCase.icon}</div>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-white">{useCase.title}</h2>
                <p className="text-gray-400 mb-4 leading-relaxed">{useCase.desc}</p>
                <div className="space-y-3">
                  <div className="bg-red-950/30 rounded-lg p-3 border border-red-500/20">
                    <p className="text-xs text-gray-400 mb-1">Without MoltyDEX:</p>
                    <p className="text-red-400 text-sm">❌ {useCase.without}</p>
                  </div>
                  <div className="bg-green-950/30 rounded-lg p-3 border border-green-500/20">
                    <p className="text-xs text-gray-400 mb-1">With MoltyDEX:</p>
                    <p className="text-green-400 text-sm">✅ {useCase.with}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-8 border border-gray-700/50 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white">Key Benefits</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: '🔄', title: 'Automatic', desc: 'Zero manual intervention. Agents focus on their core logic.' },
                { icon: '💰', title: 'Best Prices', desc: 'Routes through all Solana DEXes to find optimal prices.' },
                { icon: '🔒', title: 'Secure', desc: 'Client-side signing. Private keys never leave your system.' },
                { icon: '⚡', title: 'Fast', desc: 'Instant swaps. No waiting for manual approval.' },
                { icon: '📈', title: 'Scalable', desc: 'Handles high-volume, automated workflows seamlessly.' },
                { icon: '🎯', title: 'Reliable', desc: 'Handles edge cases, retries, and error recovery.' }
              ].map((benefit, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-2xl mb-3">{benefit.icon}</div>
                  <h3 className="text-lg font-bold mb-2 text-white">{benefit.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-950/40 via-purple-950/40 to-indigo-950/40 rounded-2xl p-8 md:p-10 border border-blue-500/20 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Ready to Get Started?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              See how easy it is to integrate MoltyDEX into your agent. Check out our developer documentation and examples.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/developers" 
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
              >
                View Documentation
              </Link>
              <Link 
                href="/" 
                className="px-8 py-3 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-xl font-semibold transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50 hover:scale-105"
              >
                Try Swap Interface
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
