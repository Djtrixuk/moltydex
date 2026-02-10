import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';
import Breadcrumbs from '../components/Breadcrumbs';
import FAQAccordion from '../components/FAQAccordion';
import { FAQPageStructuredData, ProductStructuredData, AggregateRatingStructuredData } from '../components/StructuredData';

export default function ForTraders() {
  const traderFaqs = [
    {
      question: "What is MoltyDEX for traders?",
      answer: "MoltyDEX is a decentralized exchange aggregator for Solana that provides traders with the best prices across all Solana DEXes via Jupiter aggregator. It offers 0% platform fees, secure client-side signing, and instant token swaps for all SPL tokens."
    },
    {
      question: "How much are the trading fees?",
      answer: "MoltyDEX charges 0% platform fees - completely free token swaps. No platform fees, no hidden costs. You only pay Solana network fees (paid in SOL separately). This makes MoltyDEX one of the cheapest ways to swap tokens on Solana."
    },
    {
      question: "How does MoltyDEX get the best prices?",
      answer: "MoltyDEX routes trades through Jupiter aggregator, which searches across all major Solana DEXes including Raydium, Orca, Meteora, and others to find the best prices. This ensures you always get optimal rates for your token swaps."
    },
    {
      question: "Is MoltyDEX secure for trading?",
      answer: "Yes! MoltyDEX is highly secure. All transaction signing happens client-side - your private keys never leave your wallet. MoltyDEX only builds unsigned transactions that you sign locally before sending to Solana. This ensures maximum security for your funds."
    },
    {
      question: "What tokens can I swap?",
      answer: "MoltyDEX supports all SPL tokens on Solana, including SOL, USDC, USDT, and any custom token. You can swap between any SPL tokens instantly with best prices and zero platform fees."
    },
    {
      question: "How fast are token swaps?",
      answer: "Token swaps on MoltyDEX are instant. Once you sign the transaction, it's sent to Solana and typically confirms within seconds. The entire process from quote to confirmation takes less than a minute in most cases."
    },
    {
      question: "What makes MoltyDEX better than other DEX aggregators?",
      answer: "MoltyDEX offers several advantages: 0% platform fees (most aggregators charge 0.1-0.5%), best price routing via Jupiter, secure client-side signing, and support for all SPL tokens. Additionally, MoltyDEX is optimized for both human traders and AI agents, providing flexibility for various use cases."
    },
    {
      question: "Do I need to create an account?",
      answer: "No! MoltyDEX doesn't require account creation. Simply connect your Solana wallet (Phantom, Solflare, etc.) and start swapping. All transactions are on-chain and don't require any registration or KYC."
    },
    {
      question: "What happens if a swap fails?",
      answer: "If a swap fails, MoltyDEX provides clear error messages explaining the issue. Common causes include insufficient balance, network congestion, or slippage tolerance exceeded. You can adjust your swap parameters and try again. Failed transactions don't incur any fees."
    },
    {
      question: "Can I use MoltyDEX on mobile?",
      answer: "Yes! MoltyDEX is fully responsive and works on mobile devices. You can connect your mobile wallet (like Phantom mobile) and swap tokens directly from your phone. The interface is optimized for touch interactions and smaller screens."
    }
  ];

  const lastUpdated = "2026-02-08";

  return (
    <>
      <Head>
        <title>For Traders - MoltyDEX | Fast, Cheap Token Swaps on Solana</title>
        <meta name="description" content="MoltyDEX for traders: Fast, cheap token swaps on Solana. 0% fees - completely free. Best prices via Jupiter aggregator. Swap any SPL token instantly with secure client-side signing." />
        <meta name="keywords" content="Solana DEX, token swap, best price swap, cheap swap fees, Solana trading, SPL token swap, decentralized exchange" />
        <link rel="canonical" href="https://www.moltydex.com/for-traders" />
        <meta name="dateModified" content={lastUpdated} />
      </Head>
      <ProductStructuredData />
      <AggregateRatingStructuredData itemName="MoltyDEX Token Swap Service" />
      <FAQPageStructuredData faqs={traderFaqs} />
      <PageHeader />
      <main className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <Breadcrumbs items={[{ name: 'For Traders', href: '/for-traders' }]} />
          {/* Header */}
          <div className="text-center mb-10 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              For Traders
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Fast, cheap token swaps on Solana. Best prices, lowest fees, instant execution.
            </p>
          </div>

          {/* What is MoltyDEX for Traders? Section - AI Tool Optimization */}
          <section className="mb-8 md:mb-12">
            <div className="bg-gray-900/60 rounded-lg p-6 md:p-8 border border-gray-800/50">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">What is MoltyDEX for Traders?</h2>
              <p className="text-lg text-gray-300 mb-4">
                MoltyDEX is a decentralized exchange aggregator for Solana that provides traders with the best prices across all Solana DEXes. 
                It routes trades through Jupiter aggregator to find optimal prices from Raydium, Orca, Meteora, and other major Solana DEXes.
              </p>
              <p className="text-lg text-gray-300">
                With 0% platform fees, secure client-side signing, and instant execution, MoltyDEX offers traders the cheapest and most secure way to swap tokens on Solana. 
                All SPL tokens are supported, and swaps execute instantly with best prices guaranteed.
              </p>
            </div>
          </section>

          {/* Key Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="group bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2 text-white">Zero Fees</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                <strong className="text-white">0% fees</strong> - completely free swaps. No platform fees, no hidden costs.
              </p>
            </div>
            <div className="group bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2 text-white">Best Prices</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Routes through <strong className="text-white">Jupiter aggregator</strong> to find optimal prices across all Solana DEXes.
              </p>
            </div>
            <div className="group bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold mb-2 text-white">Secure</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                <strong className="text-white">Client-side signing</strong> - your private keys never leave your wallet.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white">How It Works</h2>
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 md:p-8 border border-gray-700/50">
              <div className="grid md:grid-cols-5 gap-4">
                {[
                  { num: '1', title: 'Connect Wallet', desc: 'Use Phantom, Solflare, or any Solana wallet' },
                  { num: '2', title: 'Select Tokens', desc: 'Choose any SPL token pair' },
                  { num: '3', title: 'Enter Amount', desc: 'Enter the amount you want to swap' },
                  { num: '4', title: 'Get Quote', desc: 'See exactly what you\'ll receive' },
                  { num: '5', title: 'Swap', desc: 'Sign transaction, swap executes instantly' }
                ].map((step, idx) => (
                  <div key={idx} className="text-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-3">
                      {step.num}
                    </div>
                    <h3 className="font-semibold text-white mb-1 text-sm">{step.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white">Why Choose MoltyDEX?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: '💰', title: 'Zero Fees', desc: '0% fees - completely free swaps. No platform fees, no hidden costs.', detail: 'No subscriptions, no hidden costs. What you see is what you pay.' },
                { icon: '📊', title: 'Best Prices', desc: 'Routes through Jupiter aggregator to scan all Solana DEXes', detail: 'Finds optimal routes across Raydium, Orca, Meteora, and more.' },
                { icon: '⚡', title: 'Fast Execution', desc: 'Instant quotes and fast transaction execution', detail: 'No waiting, no delays. Get your tokens immediately.' },
                { icon: '🔒', title: 'Maximum Security', desc: 'Client-side signing - private keys never leave your wallet', detail: 'Open source, auditable code. Your keys, your control.' },
                { icon: '🌐', title: 'All SPL Tokens', desc: 'Swap any SPL token on Solana', detail: 'SOL, USDC, USDT, and thousands of other tokens supported.' },
                { icon: '📱', title: 'Easy to Use', desc: 'Simple web interface - no complex setup', detail: 'Connect wallet, select tokens, swap. That\'s it.' }
              ].map((feature, idx) => (
                <div key={idx} className="group bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                  <div className="text-2xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-400 text-sm mb-2 leading-relaxed">
                    <strong className="text-white">{feature.desc.split(' - ')[0]}</strong>
                    {feature.desc.includes(' - ') && ` - ${feature.desc.split(' - ')[1]}`}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">{feature.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white">How We Compare</h2>
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 border border-gray-700/50 overflow-x-auto">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[300px]">
                  <thead>
                    <tr className="border-b border-gray-700/50">
                      <th className="text-left py-3 text-sm font-semibold text-gray-300">Feature</th>
                      <th className="text-center py-3 text-sm font-semibold text-gray-300">Other Aggregators</th>
                      <th className="text-center py-3 text-sm font-semibold text-white">MoltyDEX</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-400 text-sm">
                    {[
                      { feature: 'Fee', other: '0.1-0.5%', moltydex: '0%', highlight: true },
                      { feature: 'Best Prices', other: '✅', moltydex: '✅', highlight: false },
                      { feature: 'Client-Side Signing', other: '⚠️ Sometimes', moltydex: '✅ Always', highlight: false },
                      { feature: 'Open Source', other: '⚠️ Sometimes', moltydex: '✅ Yes', highlight: false },
                      { feature: 'Subscription', other: '⚠️ Sometimes', moltydex: '❌ Never', highlight: false },
                      { feature: 'x402 Support', other: '❌', moltydex: '✅ Bonus', highlight: false }
                    ].map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-800/50 last:border-0">
                        <td className="py-3 text-gray-300">{row.feature}</td>
                        <td className="text-center py-3">{row.other}</td>
                        <td className={`text-center py-3 ${row.highlight ? 'text-green-400 font-bold' : 'text-green-400'}`}>
                          {row.moltydex}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* FAQ Section - AI Tool Optimization */}
          <section className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-white">Frequently Asked Questions</h2>
            <FAQAccordion faqs={traderFaqs} />
            <div className="text-center mt-6 md:mt-8">
              <Link
                href="/faq"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                View All FAQs →
              </Link>
            </div>
          </section>

          {/* Last Updated */}
          <div className="text-center text-sm text-gray-500 mb-6">
            <time dateTime={lastUpdated}>Last updated: {new Date(lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-950/40 via-purple-950/40 to-indigo-950/40 rounded-2xl p-8 md:p-10 border border-blue-500/20 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Ready to Start Swapping?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect your wallet and start swapping tokens with the best prices and lowest fees on Solana.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/" 
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
              >
                Start Swapping
              </Link>
              <Link 
                href="/pricing" 
                className="px-8 py-3 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-xl font-semibold transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50 hover:scale-105"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
