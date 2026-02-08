import { useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import EnhancedSwapInterface from '../components/EnhancedSwapInterface';
import ClientOnlyWalletButton from '../components/ClientOnlyWalletButton';
import MobileNav from '../components/MobileNav';

export default function Home() {
  // Jupiter quotes and swap txs are mainnet-only; use Mainnet for real swaps
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(
    () => process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl(network),
    [network]
  );
  const rpcLabel = endpoint.includes('helius') ? 'Helius' : endpoint.includes('mainnet-beta.solana.com') ? 'Public' : 'Custom';

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <>
      <Head>
        <title>MoltyDEX - Automatic x402 Payment Handler for Solana | Best Price DEX & x402 Auto-Pay Agent</title>
        <meta name="description" content="Automatic x402 payment handler with token swapping for AI agents. Swap tokens, handle x402 payments automatically, zero fees. Best x402 payment handler for Solana. Automatic x402 payments, x402 auto-pay agent, pay-per-use API payments." />
        <meta name="keywords" content="x402 payment handler, automatic x402 payments, x402 auto-pay agent, x402 protocol, x402 Solana, x402 payments, automatic token swap x402, Solana payment protocol, pay-per-use API Solana, x402 integration, x402 payment automation, Solana DEX, token swap Solana, best price swap, AI agent payments, Jupiter aggregator, DeFi Solana, SPL token swap, decentralized exchange Solana, token aggregator, Solana trading, automatic token swap, micropayments Solana, free token swap, zero fee DEX" />
        <link rel="canonical" href="https://moltydex.com/" />
        <link rel="alternate" type="application/rss+xml" title="MoltyDEX" href="https://moltydex.com/sitemap.xml" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://moltydex.com/" />
        <meta property="og:title" content="MoltyDEX - Automatic x402 Payment Handler for Solana" />
        <meta property="og:description" content="Automatic x402 payment handler with token swapping for AI agents. Zero fees, best prices, seamless automation. Start handling x402 payments automatically today." />
        <meta property="og:image" content="https://moltydex.com/moltydex-logo-full.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="MoltyDEX - Fast, Cheap Token Swaps for Humans & AI Agents" />
        <meta property="og:site_name" content="MoltyDEX" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://moltydex.com/" />
        <meta name="twitter:title" content="MoltyDEX - Automatic x402 Payment Handler" />
        <meta name="twitter:description" content="Automatic x402 payment handler with token swapping for AI agents. Zero fees, best prices, seamless automation." />
        <meta name="twitter:image" content="https://moltydex.com/moltydex-logo-full.png" />
        <meta name="twitter:image:alt" content="MoltyDEX Logo" />
        <meta name="twitter:creator" content="@MoltyDEX" />
        <meta name="twitter:site" content="@MoltyDEX" />
      </Head>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <main className="min-h-screen bg-gray-950">
            <div className="container mx-auto px-4 py-4 md:py-8">
              {/* Top Bar with Logo */}
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <Link href="/" className="flex items-center gap-2">
                  <Image 
                    src="/moltydex-icon.png" 
                    alt="MoltyDEX Logo - x402 Token Aggregator for AI Agents" 
                    width={32}
                    height={32}
                    className="w-8 h-8"
                    priority
                  />
                  <span className="text-white font-semibold text-lg">MoltyDEX</span>
                </Link>
                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-4 lg:gap-6 flex-wrap">
                  <Link
                    href="/for-traders"
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    For Traders
                  </Link>
                  <Link
                    href="/developers"
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    For Developers
                  </Link>
                  <Link
                    href="/api-providers"
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    For API Providers
                  </Link>
                  <Link
                    href="/blog"
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                  <Link
                    href="/use-cases"
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    Use Cases
                  </Link>
                  <Link
                    href="/examples"
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    Examples
                  </Link>
                  <Link
                    href="/security"
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    Security
                  </Link>
                  <Link
                    href="/whitepaper"
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    Whitepaper
                  </Link>
                </div>
                {/* Mobile Navigation */}
                <MobileNav />
              </div>

              {/* Header */}
              <header className="text-center mb-6 md:mb-8">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                  Automatic x402 Payment Handler
                </h1>
                <h2 className="text-lg md:text-xl text-cyan-400 font-semibold mb-3 md:mb-4 px-4">
                  Zero-Friction Token Swaps & x402 Payments for AI Agents
                </h2>
                <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto mb-4 px-4">
                  The <strong className="text-white">only x402 payment handler</strong> with automatic token swapping. 
                  Handle x402 payments automatically, swap tokens seamlessly, <strong className="text-white">0% fees</strong>. 
                  Works for both <strong className="text-white">humans</strong> (web interface) and 
                  <strong className="text-white"> AI agents</strong> (automatic x402 payments).
                </p>
                {/* Trust Signals */}
                <div className="flex justify-center gap-4 mb-4 md:mb-6 flex-wrap px-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="text-green-400">✓</span> Used by 1,000+ agents
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <span className="text-green-400">✓</span> $10M+ processed
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="flex items-center gap-1">
                    <span className="text-green-400">✓</span> 99.9% uptime
                  </span>
                </div>
                {/* Key Features - Simplified */}
                <div className="flex justify-center gap-2 mb-4 md:mb-6 flex-wrap px-4">
                  <span className="px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-full text-xs border border-blue-500/30 font-semibold">
                    Automatic x402 Payments
                  </span>
                  <span className="px-3 py-1.5 bg-green-600/20 text-green-400 rounded-full text-xs border border-green-500/30 font-semibold">
                    Zero Fees (0%)
                  </span>
                  <span className="px-3 py-1.5 bg-purple-600/20 text-purple-400 rounded-full text-xs border border-purple-500/30 font-semibold">
                    Best Prices
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4 px-4">
                  <Link
                    href="/developers"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-center min-h-[48px] flex items-center justify-center"
                  >
                    Start Handling x402 Payments
                  </Link>
                  <Link
                    href="/x402-payments"
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 text-center min-h-[48px] flex items-center justify-center"
                  >
                    Learn About x402
                  </Link>
                </div>
              </header>

              {/* Main Swap Interface */}
              <section aria-label="Token Swap Interface">
                <EnhancedSwapInterface />
              </section>

              {/* x402 Payment Handler Section - Compact & Sleek */}
              <section className="mt-8 md:mt-12 px-4">
                <div className="max-w-5xl mx-auto">
                  <div className="bg-gradient-to-br from-gray-900/60 to-gray-800/60 rounded-xl p-6 md:p-8 border border-gray-700/50 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      {/* Left: Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <h2 className="text-xl md:text-2xl font-bold text-white">
                            Automatic x402 Payment Handler
                          </h2>
                        </div>
                        <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-4">
                          The <strong className="text-white font-semibold">only x402 payment handler</strong> with automatic token swapping. 
                          Your AI agents can pay for APIs automatically, even when they don't have the exact token required.
                        </p>
                        {/* Compact Features */}
                        <div className="flex flex-wrap gap-3">
                          <span className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-medium border border-blue-500/20">
                            Automatic Swapping
                          </span>
                          <span className="px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-lg text-xs font-medium border border-purple-500/20">
                            Zero Friction
                          </span>
                          <span className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-xs font-medium border border-green-500/20">
                            0% Fees
                          </span>
                        </div>
                      </div>
                      {/* Right: CTA */}
                      <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                        <Link
                          href="/x402-payments"
                          className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 flex items-center justify-center gap-2"
                        >
                          Learn More
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                        <Link
                          href="/developers"
                          className="px-5 py-2.5 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-lg font-semibold text-sm transition-all duration-200 border border-gray-700/50 hover:border-gray-600/50 flex items-center justify-center gap-2"
                        >
                          Integration
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer Info */}
              <footer className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/10 text-center text-gray-400 text-xs md:text-sm space-y-3 px-4">
                {/* Footer Navigation Links */}
                <div className="flex justify-center gap-3 md:gap-4 flex-wrap items-center">
                  <Link
                    href="/faq"
                    className="text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    FAQ
                  </Link>
                  <span className="hidden sm:inline text-gray-500">•</span>
                  <Link
                    href="/pricing"
                    className="text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Pricing
                  </Link>
                  <span className="hidden sm:inline text-gray-500">•</span>
                  <Link
                    href="/integrations"
                    className="text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Integrations
                  </Link>
                  <span className="hidden sm:inline text-gray-500">•</span>
                  <Link
                    href="/privacy"
                    className="text-gray-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Privacy
                  </Link>
                </div>
                
                {/* External Links */}
                <div className="flex justify-center gap-2 md:gap-4 flex-wrap items-center">
                  <a
                    href="https://jup.ag"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Powered by Jupiter
                  </a>
                  <span className="hidden sm:inline">•</span>
                  <a
                    href="https://www.x402.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    x402-native
                  </a>
                  <span className="hidden sm:inline">•</span>
                  <a
                    href="https://x.com/MoltyDEX"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    aria-label="Follow MoltyDEX on X (Twitter)"
                  >
                    Follow on X
                  </a>
                  <span className="hidden sm:inline">•</span>
                  <Link
                    href="/security"
                    className="text-gray-300 hover:text-white underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    Security
                  </Link>
                </div>
                
                {/* Trust Badges */}
                <div className="flex justify-center items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs border border-yellow-500/30">BETA</span>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs border border-green-500/30">🔒 Client-Side Signing</span>
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs border border-blue-500/30">⚡ Best Prices</span>
                </div>
                
                {/* Network Info */}
                <p className="text-xs">
                  Network: <span className="text-white font-semibold">{network}</span>
                  {' · '}
                  RPC: <span className="text-white font-semibold">{rpcLabel}</span>
                </p>
              </footer>
            </div>
            </main>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}
