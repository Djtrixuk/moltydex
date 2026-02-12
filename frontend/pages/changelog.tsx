import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Changelog() {
  const lastUpdated = "2026-02-12";

  return (
    <>
      <Head>
        <title>Changelog - MoltyDEX | Production Updates & Release Notes</title>
        <meta name="description" content="MoltyDEX changelog: Full history of production updates, security fixes, SDK improvements, and platform enhancements for the x402 token aggregator on Solana." />
        <meta name="keywords" content="moltydex changelog, moltydex updates, Solana DEX updates, x402 protocol updates, release notes" />
        <link rel="canonical" href="https://moltydex.com/changelog" />
        <meta name="dateModified" content={lastUpdated} />
      </Head>
      <PageHeader />
      <main className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <Breadcrumbs items={[{ name: 'Changelog', href: '/changelog' }]} />

          {/* Header */}
          <div className="text-center mb-10 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Changelog
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Full history of MoltyDEX production updates, security fixes, and platform improvements.
            </p>
          </div>

          {/* February 12, 2026 */}
          <article className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">February 12, 2026</h2>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Latest</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mb-4">Deep Audit: 30+ Fixes Across Security, SDK, and Swap Flow</h3>
            <p className="text-gray-400 mb-6">
              Comprehensive line-by-line audit of the entire platform. Found 96 issues across 4 severity levels (15 critical, 25 high, 30 medium, 26 low). All critical and high issues resolved.
            </p>

            {/* Sprint 1 */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-4">
              <h4 className="text-lg font-semibold text-red-400 mb-3">Security Hardening</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Enabled Helmet with tightened Content Security Policy</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Restricted CORS from wildcard to explicit allowed origins</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Fixed trust proxy configuration for accurate rate limiting</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Moved Alchemy RPC key from frontend env to server-side proxy (new /api/rpc route)</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Eliminated dangerouslySetInnerHTML XSS vector in Google Analytics</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Secured analytics debug endpoint and track endpoint with API key auth</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Added SSRF protection on webhook callback URLs</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Added request body size limits and global error handler</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Fixed critical HTTPInterceptor payment_proof reference-before-assignment bug</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Added maxPaymentAmount safety guard to prevent runaway agent payments</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Added BigInt truncation safety check for SOL transfers over 100 SOL</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Fixed validation middleware to block requests when schema is missing</li>
              </ul>
            </div>

            {/* Sprint 2 */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-4">
              <h4 className="text-lg font-semibold text-yellow-400 mb-3">Agent Reliability</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Implemented exponential backoff retry logic in TypeScript MoltyDEXClient</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Added VersionedTransaction support to Python SDK (solders integration)</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Removed duplicate retry logic from HTTPInterceptor</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Standardized error response format (error_code field) across all API endpoints</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Removed fabricated aggregate ratings from structured data (Google penalty risk)</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Fixed fee configuration inconsistency (0.1% in metadata vs 0% in code)</li>
              </ul>
            </div>

            {/* Sprint 3 */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-4">
              <h4 className="text-lg font-semibold text-blue-400 mb-3">Frontend Security &amp; Stability</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Created React ErrorBoundary component for graceful UI error handling</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Sanitized Google Analytics script injection using next/script</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Standardized all canonical URLs to non-www</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Added custom branded 404 and 500 error pages</li>
              </ul>
            </div>

            {/* Infrastructure */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-4">
              <h4 className="text-lg font-semibold text-purple-400 mb-3">Infrastructure &amp; Developer Experience</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Removed legacy inline route from API index.js</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Eliminated setInterval timers incompatible with serverless (Vercel)</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Added transaction size validation (1232 byte Solana limit) on swap endpoint</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Extended TypeScript MoltyDEXClient with 14 new API methods</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Implemented getConnection() singleton factory for RPC connection reuse</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Added .nvmrc, MIT LICENSE, and comprehensive .env.example files</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Updated sitemap with missing x402-payments page</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Removed unused npm dependencies (@sentry/node, winston, @jup-ag/api)</li>
              </ul>
            </div>

            {/* Final Polish */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-4">
              <h4 className="text-lg font-semibold text-emerald-400 mb-3">Production Polish</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Stripped debug console.log from balance.js (was leaking wallet addresses)</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Replaced 21 frontend console.log calls with production-silent debugLog helper</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Fixed poll_transaction_status to surface timeout errors instead of swallowing them</li>
                <li className="flex items-start gap-2"><span className="text-green-400 mt-0.5">&#10003;</span>Wired up maxRetries/retryDelay config into MoltyDEXClient (was declared but unused)</li>
              </ul>
            </div>

            {/* Critical Bug Fixes */}
            <div className="bg-gray-900/50 border border-red-800/50 rounded-xl p-6 mb-4">
              <h4 className="text-lg font-semibold text-red-300 mb-3">Critical Bug Fixes</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#9888;</span>Fixed Python SDK VersionedTransaction signing: solders has no .sign() method &mdash; now uses constructor-based signing with SoldersKeypair</li>
                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#9888;</span>Fixed Keypair type mismatch: VersionedTransaction needs solders.keypair.Keypair, not solana.keypair.Keypair</li>
                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#9888;</span>Fixed send_transaction for versioned tx: now uses send_raw_transaction(bytes())</li>
                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#9888;</span>Fixed wallet_path tilde expansion: os.path.expanduser() resolves ~/.config/solana/id.json</li>
                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#9888;</span>Added solders&gt;=0.18.0 as explicit dependency in pyproject.toml</li>
                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#9888;</span>Fixed quotePath variable scope bug in jupiter.js: was crashing every Jupiter error handler</li>
                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#9888;</span>Fixed BigInt slippage calculation: minimum_output was always 0 due to integer division truncation</li>
                <li className="flex items-start gap-2"><span className="text-red-400 mt-0.5">&#9888;</span>Fixed exchange rate display: was double-dividing by token decimals</li>
              </ul>
            </div>

            <p className="text-gray-500 text-sm mt-4">
              Verification: TypeScript compiles clean (agent + frontend), all 63 agent tests pass, API syntax checks pass, zero lint errors.
            </p>
          </article>

          {/* Divider */}
          <div className="border-t border-gray-800 my-8" />

          {/* February 6, 2026 */}
          <article className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">February 6, 2026</h2>
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mb-4">Production Hardening Sprint: 5 Major Upgrades</h3>
            <p className="text-gray-400 mb-6">
              Initial production hardening sprint focused on reliability, persistence, validation, and testing.
            </p>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-4">
              <h4 className="text-lg font-semibold text-cyan-400 mb-3">1. Dedicated RPC Configuration</h4>
              <p className="text-gray-300 text-sm">
                Removed all fallbacks to public Solana RPC. The API, frontend, Python SDK, and x402 agent now all route through dedicated Alchemy/Helius endpoints. Public RPC rate-limits were silently degrading swap reliability in production.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-4">
              <h4 className="text-lg font-semibold text-cyan-400 mb-3">2. Python SDK Mainnet Fix</h4>
              <p className="text-gray-300 text-sm">
                The Python SDK was defaulting to devnet instead of mainnet. Any agent importing moltydex and not explicitly setting an RPC URL was hitting devnet. Corrected across both agentdex.py and moltydex/client.py.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-4">
              <h4 className="text-lg font-semibold text-cyan-400 mb-3">3. Persistent Swap Tracking with Upstash Redis</h4>
              <p className="text-gray-300 text-sm">
                Swap history, points, and leaderboard data were previously stored in-memory (lost on every serverless cold start). Rewrote swapTracker.js to use Upstash Redis with atomic pipelines. New analytics endpoints: /swaps/:wallet, /points/:wallet, /leaderboard, /swap-stats. Graceful fallback to in-memory if Redis is not configured.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-4">
              <h4 className="text-lg font-semibold text-cyan-400 mb-3">4. Input Validation with Joi</h4>
              <p className="text-gray-300 text-sm">
                Added Joi schema validation middleware across all API endpoints. Validates wallet addresses (base58), token mints, amounts, slippage bounds, and request body shapes. Rejects malformed requests before they reach business logic.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-4">
              <h4 className="text-lg font-semibold text-cyan-400 mb-3">5. TypeScript Agent Test Suite</h4>
              <p className="text-gray-300 text-sm">
                Built a comprehensive Vitest test suite for the x402 auto-pay agent: 63 tests covering WalletManager, MoltyDEXClient, HTTPInterceptor, and X402AutoPayAgent. Includes mocking for Solana web3.js, axios, and the fetch API. All tests passing.
              </p>
            </div>
          </article>

          {/* Back link */}
          <div className="text-center mt-12 mb-8">
            <Link href="/" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              &larr; Back to MoltyDEX
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
