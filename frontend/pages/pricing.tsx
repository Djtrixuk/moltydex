import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';

export default function Pricing() {
  return (
    <>
      <Head>
        <title>Pricing - MoltyDEX | Transparent x402 Payment Fees</title>
        <meta name="description" content="MoltyDEX pricing: 0% fees - completely free swaps. Transparent pricing for AI agents making x402 payments. No hidden fees, no subscriptions." />
        <meta name="keywords" content="moltydex pricing, x402 fees, token swap fees, Solana DEX fees, agent payment costs" />
        <link rel="canonical" href="https://www.moltydex.com/pricing" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://moltydex.com/pricing" />
        <meta property="og:title" content="Pricing - MoltyDEX | Transparent x402 Payment Fees" />
        <meta property="og:description" content="MoltyDEX pricing: 0% fees - completely free swaps. Transparent pricing. No hidden fees, no subscriptions." />
        <meta property="og:image" content="https://moltydex.com/moltydex-logo-full.png" />
        <meta property="og:image:alt" content="MoltyDEX Pricing" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://moltydex.com/pricing" />
        <meta name="twitter:title" content="Pricing - MoltyDEX" />
        <meta name="twitter:description" content="0% fees - completely free swaps. Transparent pricing. No hidden fees." />
        <meta name="twitter:image" content="https://moltydex.com/moltydex-logo-full.png" />
      </Head>
      <PageHeader />
      <main className="min-h-screen bg-gray-950 text-white">
        <div className="container mx-auto px-4 py-6 md:py-12">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">Pricing</h1>
            <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Simple, transparent pricing. No subscriptions, no hidden fees.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800 mb-8 md:mb-12">
            <div className="text-center mb-6 md:mb-8">
              <div className="text-4xl md:text-5xl font-bold mb-2">0%</div>
              <div className="text-gray-400 text-base md:text-lg">completely free</div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✅</span>
                <div>
                  <strong>No subscription fees</strong>
                  <p className="text-gray-400 text-sm">Pay only when you swap</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✅</span>
                <div>
                  <strong>No hidden fees</strong>
                  <p className="text-gray-400 text-sm">What you see is what you pay</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✅</span>
                <div>
                  <strong>Best prices</strong>
                  <p className="text-gray-400 text-sm">Routes through all Solana DEXes</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✅</span>
                <div>
                  <strong>Automatic token swapping</strong>
                  <p className="text-gray-400 text-sm">Handles x402 payments seamlessly</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✅</span>
                <div>
                  <strong>Secure client-side signing</strong>
                  <p className="text-gray-400 text-sm">Your keys, your control</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Examples */}
          <div className="max-w-4xl mx-auto mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">Cost Examples</h2>
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-4">Small Volume</h3>
                <div className="text-3xl font-bold mb-2">$1,000/day</div>
                <div className="text-gray-400 mb-4">~10 swaps</div>
                <div className="text-lg">Fee: <strong>$1/day</strong></div>
                <div className="text-sm text-gray-400 mt-2">~$30/month</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-4">Medium Volume</h3>
                <div className="text-3xl font-bold mb-2">$10,000/day</div>
                <div className="text-gray-400 mb-4">~100 swaps</div>
                <div className="text-lg">Fee: <strong>$10/day</strong></div>
                <div className="text-sm text-gray-400 mt-2">~$300/month</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-4">High Volume</h3>
                <div className="text-3xl font-bold mb-2">$50,000/day</div>
                <div className="text-gray-400 mb-4">~500 swaps</div>
                <div className="text-lg">Fee: <strong>$50/day</strong></div>
                <div className="text-sm text-gray-400 mt-2">~$1,500/month</div>
              </div>
            </div>
          </div>

          {/* Additional Costs */}
          <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg p-8 border border-gray-800 mb-12">
            <h2 className="text-2xl font-bold mb-4">Additional Costs</h2>
            <div className="space-y-4">
              <div>
                <strong>Solana Network Fee:</strong>
                <p className="text-gray-400">~0.00001 SOL per transaction (~$0.00002)</p>
              </div>
              <div>
                <strong>Priority Fee (Optional):</strong>
                <p className="text-gray-400">Can add priority fee for faster confirmation</p>
              </div>
              <div>
                <strong>No Setup Fees:</strong>
                <p className="text-gray-400">No cost to get started, no minimums</p>
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="max-w-4xl mx-auto mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">How We Compare</h2>
            <div className="bg-gray-900 rounded-lg p-4 md:p-6 border border-gray-800 overflow-x-auto">
              <table className="w-full min-w-[300px]">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-2 md:py-3 text-sm md:text-base">Feature</th>
                    <th className="text-center py-2 md:py-3 text-sm md:text-base">Other Aggregators</th>
                    <th className="text-center py-2 md:py-3 text-sm md:text-base">MoltyDEX</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300 text-sm md:text-base">
                  <tr className="border-b border-gray-800">
                    <td className="py-2 md:py-3">Fee</td>
                    <td className="text-center py-2 md:py-3">0.1-0.5%</td>
                    <td className="text-center py-2 md:py-3 text-green-400">0%</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 md:py-3">x402 Support</td>
                    <td className="text-center py-2 md:py-3">❌</td>
                    <td className="text-center py-2 md:py-3 text-green-400">✅</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 md:py-3">Automatic Swapping</td>
                    <td className="text-center py-2 md:py-3">❌</td>
                    <td className="text-center py-2 md:py-3 text-green-400">✅</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 md:py-3">Subscription</td>
                    <td className="text-center py-2 md:py-3">Sometimes</td>
                    <td className="text-center py-2 md:py-3 text-green-400">Never</td>
                  </tr>
                  <tr>
                    <td className="py-2 md:py-3">Setup Fee</td>
                    <td className="text-center py-2 md:py-3">Sometimes</td>
                    <td className="text-center py-2 md:py-3 text-green-400">Never</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Ready to Get Started?</h2>
            <p className="text-sm md:text-base text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
              No setup fees, no subscriptions. Completely free swaps (0% fees). Start using MoltyDEX today.
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
