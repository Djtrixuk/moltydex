/**
 * API Providers Page
 * Showcases MoltyDEX for API providers wanting to charge per-use
 */

import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';

export default function APIProviders() {
  return (
    <>
      <Head>
        <title>For API Providers - MoltyDEX | Accept x402 Payments for Your API</title>
        <meta name="description" content="Get paid automatically for your API with x402 protocol. AI agents handle payments seamlessly, including automatic token swapping. Higher conversion, instant payments, zero manual processing. Start charging per-use today." />
        <meta name="keywords" content="x402 API payments, pay-per-use API, API monetization, x402 protocol integration, accept crypto payments API, micropayments API, AI agent payments, Solana API payments" />
        <link rel="canonical" href="https://moltydex.com/api-providers" />
        
        {/* Open Graph */}
        <meta property="og:title" content="For API Providers - MoltyDEX | Accept x402 Payments" />
        <meta property="og:description" content="Get paid automatically for your API with x402 protocol. Higher conversion, instant payments, zero manual processing." />
        <meta property="og:url" content="https://moltydex.com/api-providers" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:title" content="For API Providers - MoltyDEX | Accept x402 Payments" />
        <meta name="twitter:description" content="Get paid automatically for your API with x402 protocol. Higher conversion, instant payments, zero manual processing." />
      </Head>
      <PageHeader />
      <main className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Header */}
          <div className="text-center mb-10 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              For API Providers
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Get paid automatically for your API with x402 protocol. Higher conversion, instant payments, zero manual processing.
            </p>
          </div>

          {/* Value Proposition */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white">Why x402 + MoltyDEX?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: '💰', title: 'Automatic Payments', desc: 'Agents pay automatically. No manual payment processing needed.' },
                { icon: '🔄', title: 'Any Token', desc: 'Accept any Solana token. Agents swap automatically if needed.' },
                { icon: '⚡', title: 'Seamless Integration', desc: 'Just return 402 with payment requirements. That\'s it.' },
                { icon: '📈', title: 'Higher Adoption', desc: 'Agents can use your API without manual payment steps.' }
              ].map((item, idx) => (
                <div key={idx} className="group bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white">How It Works</h2>
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 md:p-8 border border-gray-700/50">
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Agent calls your API', desc: 'Request for data/service' },
                  { step: '2', title: 'You return 402 Payment Required', desc: 'With payment requirements' },
                  { step: '3', title: 'Agent automatically pays', desc: 'Using MoltyDEX auto-pay agent' },
                  { step: '4', title: 'Agent retries request', desc: 'With payment proof' },
                  { step: '5', title: 'You serve the request', desc: 'Payment verified, data returned' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {item.step}
                    </div>
                    <div className="flex-1 pt-1">
                      <strong className="text-white">{item.title}</strong>
                      <span className="text-gray-400"> → {item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Implementation */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white">Implementation</h2>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold mb-4 text-white">Step 1: Return 402 Response</h3>
                <pre className="bg-gray-950/80 p-4 rounded-lg overflow-x-auto text-sm text-gray-300 border border-gray-800/50">
{`// Your API endpoint
app.get('/api/data', (req, res) => {
  // Check if payment required
  if (!hasPayment(req)) {
    return res.status(402).json({
      accepts: [{
        network: 'solana',
        asset: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
        amount: '1000000', // 1 USDC (6 decimals)
        address: 'YOUR_PAYMENT_ADDRESS'
      }]
    });
  }
  
  // Payment verified, return data
  res.json({ data: '...' });
});`}
                </pre>
              </div>

              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold mb-4 text-white">Step 2: Verify Payment</h3>
                <pre className="bg-gray-950/80 p-4 rounded-lg overflow-x-auto text-sm text-gray-300 border border-gray-800/50">
{`// Verify payment from X-Payment header
function verifyPayment(req) {
  const paymentSignature = req.headers['x-payment'];
  // Verify signature on Solana blockchain
  // Check amount, token, recipient match
  return isValid;
}`}
                </pre>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white">Benefits</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: '🚀', title: 'Higher Conversion', desc: 'Agents pay automatically with zero friction. No manual payment steps means more API usage and higher revenue.' },
                { icon: '💰', title: 'Instant Payments', desc: 'Payments settle on-chain instantly. No waiting periods, chargebacks, or manual processing delays.' },
                { icon: '🔄', title: 'Accept Any Token', desc: 'Agents automatically swap to your required token via MoltyDEX. Accept USDC, SOL, or any Solana token seamlessly.' },
                { icon: '🌐', title: 'Global & 24/7', desc: 'Accept payments from anywhere in the world, anytime. Solana operates globally without borders or banking hours.' },
                { icon: '🔒', title: 'Secure & Transparent', desc: 'All payments are on-chain, verifiable, and immutable. No chargebacks, no disputes—just secure transactions.' },
                { icon: '📈', title: 'Scalable Revenue', desc: 'Charge per-request, per-call, or per-operation. Perfect for APIs with variable usage patterns. Scale revenue with usage.' }
              ].map((item, idx) => (
                <div key={idx} className="group bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-white">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Resources */}
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-white">Resources</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/whitepaper"
                className="group bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="text-2xl mb-3">📄</div>
                <h3 className="text-xl font-bold mb-2 text-white">Whitepaper</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Learn about x402 protocol and MoltyDEX integration
                </p>
              </Link>
              <Link
                href="/api-docs"
                className="group bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="text-2xl mb-3">📚</div>
                <h3 className="text-xl font-bold mb-2 text-white">API Documentation</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Complete API reference and integration guide
                </p>
              </Link>
            </div>
          </section>

          {/* Get Started */}
          <section className="bg-gradient-to-r from-blue-950/40 via-purple-950/40 to-indigo-950/40 rounded-2xl p-8 md:p-10 border border-blue-500/20 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Ready to Start Charging?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Integrate x402 payments into your API. Get started in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/whitepaper"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
              >
                Read Whitepaper
              </Link>
              <Link
                href="/api-docs"
                className="px-8 py-3 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-xl font-semibold transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50 hover:scale-105"
              >
                View API Docs
              </Link>
              <a
                href="https://x.com/MoltyDEX"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-xl font-semibold transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50 hover:scale-105"
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
