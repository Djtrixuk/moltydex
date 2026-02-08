import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';

export default function ForTraders() {
  return (
    <>
      <Head>
        <title>For Traders - MoltyDEX | Fast, Cheap Token Swaps on Solana</title>
        <meta name="description" content="MoltyDEX for traders: Fast, cheap token swaps on Solana. 0% fees - completely free. Best prices via Jupiter aggregator. Swap any SPL token instantly with secure client-side signing." />
        <meta name="keywords" content="Solana DEX, token swap, best price swap, cheap swap fees, Solana trading, SPL token swap, decentralized exchange" />
        <link rel="canonical" href="https://www.moltydex.com/for-traders" />
      </Head>
      <PageHeader />
      <main className="min-h-screen bg-gray-950 text-white">
        <div className="container mx-auto px-4 py-6 md:py-12">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">For Traders</h1>
            <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Fast, cheap token swaps on Solana. Best prices, lowest fees, instant execution.
            </p>
          </div>

          {/* Why MoltyDEX for Traders */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="text-3xl mb-3">💰</div>
                <h2 className="text-xl font-bold mb-2">Zero Fees</h2>
                <p className="text-gray-300 text-sm">
                  <strong className="text-white">0% fees</strong> - completely free swaps. No platform fees, no hidden costs.
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="text-3xl mb-3">⚡</div>
                <h2 className="text-xl font-bold mb-2">Best Prices</h2>
                <p className="text-gray-300 text-sm">
                  Routes through <strong className="text-white">Jupiter aggregator</strong> to find optimal prices across all Solana DEXes.
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="text-3xl mb-3">🔒</div>
                <h2 className="text-xl font-bold mb-2">Secure</h2>
                <p className="text-gray-300 text-sm">
                  <strong className="text-white">Client-side signing</strong> - your private keys never leave your wallet.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">How It Works</h2>
            <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
              <ol className="space-y-4 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</span>
                  <div>
                    <strong className="text-white">Connect Wallet</strong> - Use Phantom, Solflare, or any Solana wallet
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</span>
                  <div>
                    <strong className="text-white">Select Tokens</strong> - Choose any SPL token pair (SOL, USDC, USDT, etc.)
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</span>
                  <div>
                    <strong className="text-white">Enter Amount</strong> - Enter the amount you want to swap
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">4</span>
                  <div>
                    <strong className="text-white">Get Quote</strong> - See exactly what you'll receive (best price automatically found)
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">5</span>
                  <div>
                    <strong className="text-white">Swap</strong> - Sign transaction in your wallet, swap executes instantly
                  </div>
                </li>
              </ol>
            </div>
          </div>

          {/* Features */}
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Why Choose MoltyDEX?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-3">💰 Zero Fees</h3>
                <p className="text-gray-300 mb-2">
                  <strong className="text-white">0% fees</strong> - completely free swaps. No platform fees, no hidden costs.
                </p>
                <p className="text-sm text-gray-400">
                  No subscriptions, no hidden costs. What you see is what you pay.
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-3">📊 Best Prices</h3>
                <p className="text-gray-300 mb-2">
                  Routes through <strong className="text-white">Jupiter aggregator</strong> to scan all Solana DEXes
                </p>
                <p className="text-sm text-gray-400">
                  Finds optimal routes across Raydium, Orca, Meteora, and more.
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-3">⚡ Fast Execution</h3>
                <p className="text-gray-300 mb-2">
                  <strong className="text-white">Instant quotes</strong> and fast transaction execution
                </p>
                <p className="text-sm text-gray-400">
                  No waiting, no delays. Get your tokens immediately.
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-3">🔒 Maximum Security</h3>
                <p className="text-gray-300 mb-2">
                  <strong className="text-white">Client-side signing</strong> - private keys never leave your wallet
                </p>
                <p className="text-sm text-gray-400">
                  Open source, auditable code. Your keys, your control.
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-3">🌐 All SPL Tokens</h3>
                <p className="text-gray-300 mb-2">
                  Swap <strong className="text-white">any SPL token</strong> on Solana
                </p>
                <p className="text-sm text-gray-400">
                  SOL, USDC, USDT, and thousands of other tokens supported.
                </p>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-3">📱 Easy to Use</h3>
                <p className="text-gray-300 mb-2">
                  <strong className="text-white">Simple web interface</strong> - no complex setup
                </p>
                <p className="text-sm text-gray-400">
                  Connect wallet, select tokens, swap. That's it.
                </p>
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">How We Compare</h2>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 overflow-x-auto">
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
                    <td className="text-center py-2 md:py-3 text-green-400 font-bold">0%</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 md:py-3">Best Prices</td>
                    <td className="text-center py-2 md:py-3">✅</td>
                    <td className="text-center py-2 md:py-3 text-green-400">✅</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 md:py-3">Client-Side Signing</td>
                    <td className="text-center py-2 md:py-3">⚠️ Sometimes</td>
                    <td className="text-center py-2 md:py-3 text-green-400">✅ Always</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 md:py-3">Open Source</td>
                    <td className="text-center py-2 md:py-3">⚠️ Sometimes</td>
                    <td className="text-center py-2 md:py-3 text-green-400">✅ Yes</td>
                  </tr>
                  <tr className="border-b border-gray-800">
                    <td className="py-2 md:py-3">Subscription</td>
                    <td className="text-center py-2 md:py-3">⚠️ Sometimes</td>
                    <td className="text-center py-2 md:py-3 text-green-400">❌ Never</td>
                  </tr>
                  <tr>
                    <td className="py-2 md:py-3">x402 Support</td>
                    <td className="text-center py-2 md:py-3">❌</td>
                    <td className="text-center py-2 md:py-3 text-green-400">✅ Bonus</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Ready to Start Swapping?</h2>
            <p className="text-sm md:text-base text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
              Connect your wallet and start swapping tokens with the best prices and lowest fees on Solana.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <Link href="/" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition text-center touch-manipulation min-h-[44px] flex items-center justify-center">
                Start Swapping
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition text-center touch-manipulation min-h-[44px] flex items-center justify-center">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
