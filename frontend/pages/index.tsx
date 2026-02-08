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
        <title>MoltyDEX - Fast, Cheap Token Swaps for Humans & AI Agents | Best Price Solana DEX</title>
        <meta name="description" content="Swap any SPL token on Solana with best prices across all DEXes. 0% fees - completely free swaps. Fast, secure swaps for humans (web interface) and AI agents (automatic x402 payments). Free Solana token swap, best price DEX aggregator, x402 payment swap, AI agent payments." />
        <meta name="keywords" content="Solana DEX, token swap Solana, best price swap, x402 protocol, AI agent payments, Jupiter aggregator, DeFi Solana, SPL token swap, decentralized exchange Solana, token aggregator, Solana trading, Raydium swap, Orca swap, Meteora swap, x402 payments, AI agent swap, automatic token swap, pay-per-use API, micropayments Solana, free token swap, zero fee DEX, Solana token exchange, best price Solana, swap SOL to USDC, swap USDC to SOL" />
        <link rel="canonical" href="https://moltydex.com/" />
        <link rel="alternate" type="application/rss+xml" title="MoltyDEX" href="https://moltydex.com/sitemap.xml" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://moltydex.com/" />
        <meta property="og:title" content="MoltyDEX - Fast, Cheap Token Swaps for Humans & AI Agents" />
        <meta property="og:description" content="Swap any SPL token on Solana with best prices across all DEXes. 0% fees - completely free swaps. Fast, secure swaps for humans and AI agents." />
        <meta property="og:image" content="https://moltydex.com/moltydex-logo-full.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="MoltyDEX - Fast, Cheap Token Swaps for Humans & AI Agents" />
        <meta property="og:site_name" content="MoltyDEX" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://moltydex.com/" />
        <meta name="twitter:title" content="MoltyDEX - Fast, Cheap Token Swaps for Humans & AI Agents" />
        <meta name="twitter:description" content="Swap any SPL token on Solana with best prices across all DEXes. 0% fees - completely free swaps." />
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
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">MoltyDEX</h1>
                <h2 className="text-lg md:text-xl text-cyan-400 font-semibold mb-3 md:mb-4 px-4">
                  Fast, Cheap Token Swaps for Humans & AI Agents
                </h2>
                <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto mb-4 px-4">
                  Swap any SPL token on Solana with <strong className="text-white">best prices</strong> across all DEXes. 
                  <strong className="text-white"> 0% fees</strong> - completely free swaps. 
                  Fast, secure, and works for both <strong className="text-white">humans</strong> (web interface) and 
                  <strong className="text-white"> AI agents</strong> (automatic x402 payments).
                </p>
                <div className="flex justify-center gap-2 mb-4 md:mb-6 flex-wrap px-4">
                  <span className="px-2 py-1 bg-white/5 text-gray-400 rounded-full text-xs border border-white/5">
                    Best Prices
                  </span>
                  <span className="px-2 py-1 bg-white/5 text-gray-400 rounded-full text-xs border border-white/5">
                    Zero Fees (0%)
                  </span>
                  <span className="px-2 py-1 bg-white/5 text-gray-400 rounded-full text-xs border border-white/5">
                    For Humans & Agents
                  </span>
                  <span className="px-2 py-1 bg-white/5 text-gray-400 rounded-full text-xs border border-white/5">
                    x402 Native
                  </span>
                  <span className="px-2 py-1 bg-white/5 text-gray-400 rounded-full text-xs border border-white/5">
                    Auto Token Swap
                  </span>
                  <span className="px-2 py-1 bg-white/5 text-gray-400 rounded-full text-xs border border-white/5">
                    Fast & Cheap
                  </span>
                </div>
                <div className="flex justify-center mt-4 px-4">
                  <ClientOnlyWalletButton />
                </div>
              </header>

              {/* Main Swap Interface */}
              <section aria-label="Token Swap Interface">
                <EnhancedSwapInterface />
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
