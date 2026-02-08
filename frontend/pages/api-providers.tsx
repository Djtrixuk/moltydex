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
        <div className="container mx-auto px-4 py-6 md:py-12 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">For API Providers</h1>
            <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Get paid automatically for your API with x402 protocol. Higher conversion, instant payments, zero manual processing.
            </p>
          </div>

          {/* Value Proposition */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Why x402 + MoltyDEX?</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">💰 Automatic Payments</h3>
                <p className="text-gray-300">
                  Agents pay automatically. No manual payment processing needed.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">🔄 Any Token</h3>
                <p className="text-gray-300">
                  Accept any Solana token. Agents swap automatically if needed.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">⚡ Seamless Integration</h3>
                <p className="text-gray-300">
                  Just return 402 with payment requirements. That's it.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">📈 Higher Adoption</h3>
                <p className="text-gray-300">
                  Agents can use your API without manual payment steps.
                </p>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <div className="bg-white/5 rounded-lg p-6 mb-6">
              <ol className="list-decimal list-inside space-y-4 text-gray-300">
                <li>
                  <strong className="text-white">Agent calls your API</strong> → Request for data/service
                </li>
                <li>
                  <strong className="text-white">You return 402 Payment Required</strong> → With payment requirements
                </li>
                <li>
                  <strong className="text-white">Agent automatically pays</strong> → Using MoltyDEX auto-pay agent
                </li>
                <li>
                  <strong className="text-white">Agent retries request</strong> → With payment proof
                </li>
                <li>
                  <strong className="text-white">You serve the request</strong> → Payment verified, data returned
                </li>
              </ol>
            </div>
          </section>

          {/* Implementation */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Implementation</h2>
            <div className="bg-white/5 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Step 1: Return 402 Response</h3>
              <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto text-sm mb-4">
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

            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Step 2: Verify Payment</h3>
              <pre className="bg-black/30 p-4 rounded-lg overflow-x-auto text-sm">
{`// Verify payment from X-Payment header
function verifyPayment(req) {
  const paymentSignature = req.headers['x-payment'];
  // Verify signature on Solana blockchain
  // Check amount, token, recipient match
  return isValid;
}`}
              </pre>
            </div>
          </section>

          {/* Benefits */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Benefits</h2>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">🚀 Higher Conversion</h3>
                <p className="text-gray-300">
                  Agents pay automatically with zero friction. No manual payment steps means more API usage and higher revenue.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">💰 Instant Payments</h3>
                <p className="text-gray-300">
                  Payments settle on-chain instantly. No waiting periods, chargebacks, or manual processing delays.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">🔄 Accept Any Token</h3>
                <p className="text-gray-300">
                  Agents automatically swap to your required token via MoltyDEX. Accept USDC, SOL, or any Solana token seamlessly.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">🌐 Global & 24/7</h3>
                <p className="text-gray-300">
                  Accept payments from anywhere in the world, anytime. Solana operates globally without borders or banking hours.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">🔒 Secure & Transparent</h3>
                <p className="text-gray-300">
                  All payments are on-chain, verifiable, and immutable. No chargebacks, no disputes—just secure transactions.
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">📈 Scalable Revenue</h3>
                <p className="text-gray-300">
                  Charge per-request, per-call, or per-operation. Perfect for APIs with variable usage patterns. Scale revenue with usage.
                </p>
              </div>
            </div>
          </section>

          {/* Resources */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Resources</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/whitepaper"
                className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-2">📄 Whitepaper</h3>
                <p className="text-gray-300">
                  Learn about x402 protocol and MoltyDEX integration
                </p>
              </Link>
              <Link
                href="/api-docs"
                className="bg-white/5 rounded-lg p-6 hover:bg-white/10 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-2">📚 API Documentation</h3>
                <p className="text-gray-300">
                  Complete API reference and integration guide
                </p>
              </Link>
            </div>
          </section>

          {/* Get Started */}
          <section className="bg-white/5 rounded-lg p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Charging?</h2>
            <p className="text-gray-300 mb-6">
              Integrate x402 payments into your API. Get started in minutes.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/whitepaper"
                className="px-6 py-3 bg-white text-gray-950 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Read Whitepaper
              </Link>
              <Link
                href="/api-docs"
                className="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
              >
                View API Docs
              </Link>
              <a
                href="https://x.com/MoltyDEX"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
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
