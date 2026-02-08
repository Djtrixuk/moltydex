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
        <div className="container mx-auto px-4 py-6 md:py-12">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">Use Cases</h1>
            <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Real-world scenarios where MoltyDEX enables seamless x402 payments for AI agents
            </p>
          </div>

          {/* Use Cases */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
            {/* Use Case 1 */}
            <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
              <div className="text-3xl md:text-4xl mb-3 md:mb-4">💾</div>
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Premium API Access</h2>
              <p className="text-gray-300 mb-4">
                An agent needs to call a premium data API that charges 1 USDC per request. The agent has SOL but no USDC.
              </p>
              <div className="bg-gray-800 rounded p-4 mb-4">
                <p className="text-sm text-gray-400 mb-2">Without MoltyDEX:</p>
                <p className="text-red-400">❌ Payment fails → Manual swap needed → Automation broken</p>
              </div>
              <div className="bg-gray-800 rounded p-4">
                <p className="text-sm text-gray-400 mb-2">With MoltyDEX:</p>
                <p className="text-green-400">✅ Automatic SOL → USDC swap → Payment succeeds → Data received</p>
              </div>
            </div>

            {/* Use Case 2 */}
            <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
              <div className="text-3xl md:text-4xl mb-3 md:mb-4">📊</div>
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Automated Data Collection</h2>
              <p className="text-gray-300 mb-4">
                An agent runs hourly to collect market data from multiple paid APIs. Each API might want different tokens (USDC, USDT, SOL).
              </p>
              <div className="bg-gray-800 rounded p-4 mb-4">
                <p className="text-sm text-gray-400 mb-2">Without MoltyDEX:</p>
                <p className="text-red-400">❌ Maintain balances in multiple tokens → Complex management → Higher costs</p>
              </div>
              <div className="bg-gray-800 rounded p-4">
                <p className="text-sm text-gray-400 mb-2">With MoltyDEX:</p>
                <p className="text-green-400">✅ Keep SOL → Auto-swap to any token → Focus on data collection</p>
              </div>
            </div>

            {/* Use Case 3 */}
            <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
              <div className="text-3xl md:text-4xl mb-3 md:mb-4">🤖</div>
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Pay-Per-Use AI Services</h2>
              <p className="text-gray-300 mb-4">
                An agent uses multiple AI APIs that charge per request. Some want SOL, others want USDC.
              </p>
              <div className="bg-gray-800 rounded p-4 mb-4">
                <p className="text-sm text-gray-400 mb-2">Without MoltyDEX:</p>
                <p className="text-red-400">❌ Pre-swap tokens → Maintain multiple balances → Manual management</p>
              </div>
              <div className="bg-gray-800 rounded p-4">
                <p className="text-sm text-gray-400 mb-2">With MoltyDEX:</p>
                <p className="text-green-400">✅ Keep SOL → Swap on-demand → Pay automatically → Zero friction</p>
              </div>
            </div>

            {/* Use Case 4 */}
            <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
              <div className="text-3xl md:text-4xl mb-3 md:mb-4">🔗</div>
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">x402 Protocol Integration</h2>
              <p className="text-gray-300 mb-4">
                For API providers using x402, MoltyDEX ensures agents can actually pay. No more "agent has wrong token" errors.
              </p>
              <div className="bg-gray-800 rounded p-4 mb-4">
                <p className="text-sm text-gray-400 mb-2">Without MoltyDEX:</p>
                <p className="text-red-400">❌ Low conversion → Failed payments → Lost revenue</p>
              </div>
              <div className="bg-gray-800 rounded p-4">
                <p className="text-sm text-gray-400 mb-2">With MoltyDEX:</p>
                <p className="text-green-400">✅ Higher conversion → Instant payments → Zero manual processing</p>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800 mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">Key Benefits</h2>
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2">🔄 Automatic</h3>
                <p className="text-gray-300">Zero manual intervention. Agents focus on their core logic.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">💰 Best Prices</h3>
                <p className="text-gray-300">Routes through all Solana DEXes to find optimal prices.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">🔒 Secure</h3>
                <p className="text-gray-300">Client-side signing. Private keys never leave your system.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">⚡ Fast</h3>
                <p className="text-gray-300">Instant swaps. No waiting for manual approval.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">📈 Scalable</h3>
                <p className="text-gray-300">Handles high-volume, automated workflows seamlessly.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">🎯 Reliable</h3>
                <p className="text-gray-300">Handles edge cases, retries, and error recovery.</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Ready to Get Started?</h2>
            <p className="text-sm md:text-base text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
              See how easy it is to integrate MoltyDEX into your agent. Check out our developer documentation and examples.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <Link href="/developers" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition text-center touch-manipulation min-h-[44px] flex items-center justify-center">
                View Documentation
              </Link>
              <Link href="/" className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition text-center touch-manipulation min-h-[44px] flex items-center justify-center">
                Try Swap Interface
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
