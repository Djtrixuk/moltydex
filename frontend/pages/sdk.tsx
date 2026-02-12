/**
 * SDK Page
 * Complete SDK documentation for developers and agents
 * Covers TypeScript, Python, and MPC wallet integration
 */

import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';
import Breadcrumbs from '../components/Breadcrumbs';
import { SoftwareApplicationStructuredData, AuthorStructuredData } from '../components/StructuredData';

export default function SDK() {
  const lastUpdated = '2026-02-12';

  return (
    <>
      <Head>
        <title>SDK Documentation - MoltyDEX | TypeScript &amp; Python SDKs for AI Agents</title>
        <meta name="description" content="Complete SDK documentation for MoltyDEX. TypeScript and Python SDKs for token swaps, x402 auto-pay, and MPC wallet integration on Solana. Get started in 5 minutes." />
        <meta name="keywords" content="MoltyDEX SDK, TypeScript SDK, Python SDK, x402 SDK, Solana SDK, AI agent SDK, MPC wallet, token swap SDK, agent payments, Jupiter aggregator" />
        <link rel="canonical" href="https://moltydex.com/sdk" />
        <meta name="dateModified" content={lastUpdated} />

        {/* Open Graph */}
        <meta property="og:title" content="SDK Documentation - MoltyDEX" />
        <meta property="og:description" content="TypeScript and Python SDKs for token swaps, x402 auto-pay, and MPC wallet integration on Solana." />
        <meta property="og:url" content="https://moltydex.com/sdk" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://moltydex.com/moltydex-logo-full.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SDK Documentation - MoltyDEX" />
        <meta name="twitter:description" content="TypeScript and Python SDKs for token swaps, x402 auto-pay, and MPC wallet integration on Solana." />
      </Head>
      <SoftwareApplicationStructuredData />
      <AuthorStructuredData />
      <PageHeader />
      <main className="min-h-screen bg-gray-950 text-white">
        <div className="container mx-auto px-4 py-6 md:py-12 max-w-4xl">
          <Breadcrumbs items={[{ name: 'SDK', href: '/sdk' }]} />

          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">SDK Documentation</h1>
            <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Everything you need to integrate MoltyDEX into your agent or application.
              TypeScript and Python SDKs with full x402 auto-pay and MPC wallet support.
            </p>
          </div>

          {/* Quick Install */}
          <section className="mb-8 md:mb-12">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="text-blue-400">TypeScript / JavaScript</span>
                </h3>
                <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-sm text-green-400">
{`npm install moltydex`}
                </pre>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="text-yellow-400">Python</span>
                </h3>
                <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-sm text-green-400">
{`pip install moltydex`}
                </pre>
              </div>
            </div>
          </section>

          {/* Table of Contents */}
          <section className="mb-8 md:mb-12">
            <div className="bg-gray-900/60 rounded-lg p-6 border border-gray-800/50">
              <h2 className="text-xl font-bold mb-4">On This Page</h2>
              <nav className="grid md:grid-cols-2 gap-2 text-sm">
                <a href="#typescript-quickstart" className="text-blue-400 hover:text-blue-300 py-1">TypeScript Quick Start</a>
                <a href="#python-quickstart" className="text-blue-400 hover:text-blue-300 py-1">Python Quick Start</a>
                <a href="#x402-autopay" className="text-blue-400 hover:text-blue-300 py-1">x402 Auto-Pay Agent</a>
                <a href="#http-interceptor" className="text-blue-400 hover:text-blue-300 py-1">HTTP Interceptor</a>
                <a href="#mpc-wallets" className="text-blue-400 hover:text-blue-300 py-1">MPC Wallet Integration</a>
                <a href="#api-reference" className="text-blue-400 hover:text-blue-300 py-1">API Reference</a>
                <a href="#wallet-config" className="text-blue-400 hover:text-blue-300 py-1">Wallet Configuration</a>
                <a href="#common-tokens" className="text-blue-400 hover:text-blue-300 py-1">Common Token Addresses</a>
              </nav>
            </div>
          </section>

          {/* ── TypeScript Quick Start ── */}
          <section id="typescript-quickstart" className="mb-8 md:mb-12 scroll-mt-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">TypeScript Quick Start</h2>

            <div className="space-y-6">
              {/* API Client */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-semibold mb-2">API Client (no wallet needed)</h3>
                <p className="text-gray-400 text-sm mb-4">Use this for read-only operations like quotes and balance checks.</p>
                <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-sm">
{`import { MoltyDEXClient } from 'moltydex';

const client = new MoltyDEXClient('https://api.moltydex.com');

// Get a swap quote
const quote = await client.getQuote(
  'So11111111111111111111111111111111111111112',   // SOL
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  '100000000', // 0.1 SOL in lamports
);

console.log(\`Output: \${quote.output_after_fee} USDC\`);`}
                </pre>
              </div>

              {/* x402 Auto-Pay Agent */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-semibold mb-2">x402 Auto-Pay Agent (with wallet)</h3>
                <p className="text-gray-400 text-sm mb-4">Full agent with wallet management and automatic 402 payment handling.</p>
                <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-sm">
{`import { X402AutoPayAgent } from 'moltydex';

const agent = new X402AutoPayAgent({
  apiUrl: 'https://api.moltydex.com',
  walletPath: './wallet.json', // or use walletSecretKey
  autoSwap: true,
});

console.log(\`Agent wallet: \${agent.getWalletAddress()}\`);

// When you get a 402 Payment Required response:
const result = await agent.handle402(paymentResponseBody);

if (result.success) {
  console.log(\`Paid! Signature: \${result.payment_signature}\`);
}`}
                </pre>
              </div>
            </div>
          </section>

          {/* ── HTTP Interceptor ── */}
          <section id="http-interceptor" className="mb-8 md:mb-12 scroll-mt-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">HTTP Interceptor (Zero-Config)</h2>
            <p className="text-gray-300 mb-4">
              The fastest way to add x402 support. Automatically intercepts all <code className="bg-black/30 px-1.5 py-0.5 rounded text-sm">fetch()</code> calls
              and handles 402 responses transparently.
            </p>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-sm">
{`import { HTTPInterceptor } from 'moltydex';

const interceptor = new HTTPInterceptor({
  apiUrl: 'https://api.moltydex.com',
  walletPath: './wallet.json',
  autoSwap: true,
});

// All fetch() calls now auto-handle 402 Payment Required
const response = await fetch('https://some-x402-api.com/data');
// If it returns 402, the agent pays automatically and retries

// Restore original fetch when done
interceptor.restore();`}
              </pre>
            </div>
          </section>

          {/* ── x402 Auto-Pay Flow ── */}
          <section id="x402-autopay" className="mb-8 md:mb-12 scroll-mt-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">x402 Auto-Pay Flow</h2>
            <p className="text-gray-300 mb-6">
              When your agent calls an API that returns HTTP 402 Payment Required, MoltyDEX handles the entire payment flow automatically:
            </p>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
              <ol className="list-decimal list-inside space-y-3 text-gray-300">
                <li><strong className="text-white">Agent calls API</strong> &rarr; Gets 402 Payment Required</li>
                <li><strong className="text-white">Interceptor parses</strong> &rarr; Extracts token, amount, recipient from 402 body</li>
                <li><strong className="text-white">Checks balance</strong> &rarr; Does agent have the required token?</li>
                <li><strong className="text-white">Auto-swaps if needed</strong> &rarr; Swaps SOL/any token to the required token via Jupiter</li>
                <li><strong className="text-white">Makes payment</strong> &rarr; Signs and sends Solana transaction</li>
                <li><strong className="text-white">Retries original request</strong> &rarr; Includes payment proof in headers</li>
              </ol>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-3">Manual x402 Handling (TypeScript)</h3>
              <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-sm">
{`import { MoltyDEXClient } from 'moltydex';

const client = new MoltyDEXClient('https://api.moltydex.com');

// Parse a 402 response body
const requirements = await client.parsePayment(response402Body);

// One-call auto-pay: checks balance, swaps if needed, pays
const result = await client.autoPay(
  response402Body,
  walletAddress,
  'So11111111111111111111111111111111111111112', // pay from SOL
  true, // autoSwap
);`}
              </pre>
            </div>
          </section>

          {/* ── Python Quick Start ── */}
          <section id="python-quickstart" className="mb-8 md:mb-12 scroll-mt-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Python Quick Start</h2>

            <div className="space-y-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-semibold mb-2">Get a Quote</h3>
                <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-sm">
{`from moltydex import MoltyDEX

dex = MoltyDEX(
    api_url="https://api.moltydex.com",
    wallet_path="~/.config/solana/id.json",
)

# Get a swap quote
quote = dex.quote(
    token_in="So11111111111111111111111111111111111111112",   # SOL
    token_out="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", # USDC
    amount_in=100_000_000,  # 0.1 SOL in lamports
)
print(f"Output: {quote['output_after_fee']} USDC")`}
                </pre>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-semibold mb-2">Execute a Swap</h3>
                <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-sm">
{`result = dex.swap(
    token_in="So11111111111111111111111111111111111111112",
    token_out="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    amount_in=100_000_000,
    wait_for_confirmation=True,
)
print(f"Swap signature: {result['signature']}")`}
                </pre>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-semibold mb-2">Handle x402 Payments</h3>
                <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-sm">
{`# When your agent gets a 402 Payment Required response:
result = dex.handle_x402_payment(payment_402_response_body)

if result['ready']:
    print("Payment ready — sufficient balance")
else:
    print(f"Swap completed: {result['swap_result']['signature']}")

# Or use the one-call auto-pay:
result = dex.x402_auto_pay(
    payment_response_body=response_402_body,
    auto_swap=True,
)`}
                </pre>
              </div>
            </div>
          </section>

          {/* ── MPC Wallets ── */}
          <section id="mpc-wallets" className="mb-8 md:mb-12 scroll-mt-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">MPC Wallet Integration</h2>
            <p className="text-gray-300 mb-6">
              MPC (Multi-Party Computation) wallets let agents sign transactions without ever holding a raw private key.
              The key is split into encrypted fragments — no single party ever sees the full key.
              MoltyDEX is building first-class MPC support so agents can create and manage wallets programmatically.
            </p>

            {/* Why MPC */}
            <div className="bg-gray-900/60 rounded-lg p-6 border border-gray-800/50 mb-6">
              <h3 className="text-xl font-semibold mb-4">Why MPC Wallets for Agents?</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold text-red-400 mb-1">Security Risk</h4>
                  <p className="text-sm text-gray-400">Raw private keys in config files are one leaked <code className="text-xs bg-black/30 px-1 rounded">.env</code> away from a drained wallet.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-1">No Guardrails</h4>
                  <p className="text-sm text-gray-400">With a raw key, an agent can do anything with those funds. No spending limits, no token restrictions.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-orange-400 mb-1">Enterprise Blocker</h4>
                  <p className="text-sm text-gray-400">No compliance team will approve an AI agent holding a raw private key. MPC removes this barrier.</p>
                </div>
              </div>
            </div>

            {/* Signer Interface */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
              <h3 className="text-xl font-semibold mb-3">TransactionSigner Interface</h3>
              <p className="text-gray-400 text-sm mb-4">
                The SDK is being refactored around a pluggable <code className="bg-black/30 px-1.5 py-0.5 rounded">TransactionSigner</code> interface.
                This means the same agent code works with a local keypair or an MPC signer — no changes needed.
              </p>
              <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-sm">
{`interface TransactionSigner {
  getAddress(): string;
  signTransaction(transactionBase64: string): Promise<string>;
}`}
              </pre>
            </div>

            {/* Turnkey Integration */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
              <h3 className="text-xl font-semibold mb-3">Turnkey MPC Integration (Coming Soon)</h3>
              <p className="text-gray-400 text-sm mb-4">
                Create an MPC wallet for your agent in one line. No private key needed. Powered by Turnkey — used by Magic Eden, Squads, and Mysten Labs.
              </p>
              <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-sm">
{`import { X402AutoPayAgent } from 'moltydex';

const agent = new X402AutoPayAgent({
  apiUrl: 'https://api.moltydex.com',
  turnkeyApiKey: 'your-turnkey-key',
  createWallet: true,  // Creates a new MPC wallet automatically
  autoSwap: true,
});

// Agent now has its own wallet — no private key needed
console.log('Agent wallet:', agent.getAddress());`}
              </pre>
            </div>

            {/* Wallet Management API */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
              <h3 className="text-xl font-semibold mb-3">Wallet Management API (Coming Soon)</h3>
              <p className="text-gray-400 text-sm mb-4">
                New REST endpoints for creating and managing MPC wallets programmatically.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <code className="bg-black/40 px-2 py-1 rounded text-sm text-green-400 whitespace-nowrap">POST</code>
                  <div>
                    <code className="text-sm text-white">/api/wallet/create</code>
                    <p className="text-xs text-gray-500 mt-0.5">Create a new MPC wallet for an agent</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <code className="bg-black/40 px-2 py-1 rounded text-sm text-blue-400 whitespace-nowrap">GET</code>
                  <div>
                    <code className="text-sm text-white">/api/wallet/:id</code>
                    <p className="text-xs text-gray-500 mt-0.5">Get wallet info and balances</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <code className="bg-black/40 px-2 py-1 rounded text-sm text-yellow-400 whitespace-nowrap">PUT</code>
                  <div>
                    <code className="text-sm text-white">/api/wallet/:id/policy</code>
                    <p className="text-xs text-gray-500 mt-0.5">Set spending limits and token allowlists</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <code className="bg-black/40 px-2 py-1 rounded text-sm text-blue-400 whitespace-nowrap">GET</code>
                  <div>
                    <code className="text-sm text-white">/api/wallet/list</code>
                    <p className="text-xs text-gray-500 mt-0.5">List all wallets in your organization</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Policy Engine */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
              <h3 className="text-xl font-semibold mb-3">Policy Engine (Coming Soon)</h3>
              <p className="text-gray-400 text-sm mb-4">
                Enterprise-grade guardrails for agent wallets. Set rules before your agent ever touches funds.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-black/20 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">Spending Limits</h4>
                  <p className="text-xs text-gray-400">Max per transaction, per day, per week</p>
                </div>
                <div className="bg-black/20 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">Token Allowlists</h4>
                  <p className="text-xs text-gray-400">Only allow specific tokens (e.g., SOL + USDC only)</p>
                </div>
                <div className="bg-black/20 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">Recipient Allowlists</h4>
                  <p className="text-xs text-gray-400">Only allow payments to approved addresses</p>
                </div>
                <div className="bg-black/20 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">Time-Based Rules</h4>
                  <p className="text-xs text-gray-400">Active hours, cooldown periods between transactions</p>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4">MPC vs Raw Keypair</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 pr-4 text-gray-400 font-medium">Capability</th>
                      <th className="text-left py-2 px-4 text-gray-400 font-medium">Raw Keypair</th>
                      <th className="text-left py-2 pl-4 text-green-400 font-medium">MPC Wallet</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-gray-800">
                      <td className="py-2 pr-4">Wallet creation</td>
                      <td className="py-2 px-4">Manual export</td>
                      <td className="py-2 pl-4 text-green-400">One API call</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-2 pr-4">Key security</td>
                      <td className="py-2 px-4">Full key in config</td>
                      <td className="py-2 pl-4 text-green-400">Key never exists in one place</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-2 pr-4">Spending limits</td>
                      <td className="py-2 px-4">Custom code</td>
                      <td className="py-2 pl-4 text-green-400">Built-in policy engine</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-2 pr-4">Audit trail</td>
                      <td className="py-2 px-4">Custom logging</td>
                      <td className="py-2 pl-4 text-green-400">Full transaction history</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-2 pr-4">Enterprise-ready</td>
                      <td className="py-2 px-4">No</td>
                      <td className="py-2 pl-4 text-green-400">SOC 2 compliant</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Fleet management</td>
                      <td className="py-2 px-4">Manual per agent</td>
                      <td className="py-2 pl-4 text-green-400">Centralized dashboard</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ── API Reference ── */}
          <section id="api-reference" className="mb-8 md:mb-12 scroll-mt-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">API Reference</h2>

            {/* TypeScript */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">TypeScript — MoltyDEXClient</h3>
              <p className="text-gray-400 text-sm mb-4">Stateless API client. No wallet needed for read-only operations.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 pr-4 text-gray-400 font-medium">Method</th>
                      <th className="text-left py-2 pl-4 text-gray-400 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-gray-800"><td className="py-2 pr-4"><code className="text-xs">getQuote(inputMint, outputMint, amount, slippageBps?)</code></td><td className="py-2 pl-4">Get swap quote</td></tr>
                    <tr className="border-b border-gray-800"><td className="py-2 pr-4"><code className="text-xs">buildSwapTransaction(wallet, inputMint, outputMint, amount)</code></td><td className="py-2 pl-4">Build unsigned swap transaction</td></tr>
                    <tr className="border-b border-gray-800"><td className="py-2 pr-4"><code className="text-xs">sendTransaction(signedTransaction)</code></td><td className="py-2 pl-4">Send signed transaction</td></tr>
                    <tr className="border-b border-gray-800"><td className="py-2 pr-4"><code className="text-xs">getTransactionStatus(signature)</code></td><td className="py-2 pl-4">Check transaction status</td></tr>
                    <tr className="border-b border-gray-800"><td className="py-2 pr-4"><code className="text-xs">getBalance(walletAddress, tokenMint)</code></td><td className="py-2 pl-4">Check token balance</td></tr>
                    <tr className="border-b border-gray-800"><td className="py-2 pr-4"><code className="text-xs">parsePayment(body)</code></td><td className="py-2 pl-4">Parse x402 payment requirements</td></tr>
                    <tr><td className="py-2 pr-4"><code className="text-xs">autoPay(body, wallet, inputToken?, autoSwap?)</code></td><td className="py-2 pl-4">One-call x402 auto-pay</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* X402AutoPayAgent Config */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">TypeScript — X402AutoPayAgent Config</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 pr-4 text-gray-400 font-medium">Field</th>
                      <th className="text-left py-2 px-4 text-gray-400 font-medium">Type</th>
                      <th className="text-left py-2 px-4 text-gray-400 font-medium">Default</th>
                      <th className="text-left py-2 pl-4 text-gray-400 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-gray-800"><td className="py-2 pr-4"><code className="text-xs">apiUrl</code></td><td className="py-2 px-4 text-xs">string</td><td className="py-2 px-4 text-xs text-red-400">required</td><td className="py-2 pl-4">MoltyDEX API URL</td></tr>
                    <tr className="border-b border-gray-800"><td className="py-2 pr-4"><code className="text-xs">walletPath</code></td><td className="py-2 px-4 text-xs">string?</td><td className="py-2 px-4 text-xs">—</td><td className="py-2 pl-4">Path to wallet JSON file</td></tr>
                    <tr className="border-b border-gray-800"><td className="py-2 pr-4"><code className="text-xs">walletSecretKey</code></td><td className="py-2 px-4 text-xs">Uint8Array | number[] | string?</td><td className="py-2 px-4 text-xs">—</td><td className="py-2 pl-4">Secret key (base58, array, or bytes)</td></tr>
                    <tr className="border-b border-gray-800"><td className="py-2 pr-4"><code className="text-xs">preferredInputToken</code></td><td className="py-2 px-4 text-xs">string?</td><td className="py-2 px-4 text-xs">SOL</td><td className="py-2 pl-4">Token to swap from</td></tr>
                    <tr className="border-b border-gray-800"><td className="py-2 pr-4"><code className="text-xs">autoSwap</code></td><td className="py-2 px-4 text-xs">boolean?</td><td className="py-2 px-4 text-xs">true</td><td className="py-2 pl-4">Auto-swap if insufficient balance</td></tr>
                    <tr className="border-b border-gray-800"><td className="py-2 pr-4"><code className="text-xs">webhookUrl</code></td><td className="py-2 px-4 text-xs">string?</td><td className="py-2 px-4 text-xs">—</td><td className="py-2 pl-4">Webhook for transaction updates</td></tr>
                    <tr><td className="py-2 pr-4"><code className="text-xs">rpcUrl</code></td><td className="py-2 px-4 text-xs">string?</td><td className="py-2 px-4 text-xs">mainnet</td><td className="py-2 pl-4">Solana RPC URL</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Python */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4 text-yellow-400">Python — MoltyDEX</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 pr-4 text-gray-400 font-medium">Method</th>
                      <th className="text-left py-2 pl-4 text-gray-400 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-gray-800"><td className="py-2 pr-4"><code className="text-xs">quote(token_in, token_out, amount_in)</code></td><td className="py-2 pl-4">Get swap quote</td></tr>
                    <tr className="border-b border-gray-800"><td className="py-2 pr-4"><code className="text-xs">swap(token_in, token_out, amount_in)</code></td><td className="py-2 pl-4">Execute swap (build, sign, send)</td></tr>
                    <tr className="border-b border-gray-800"><td className="py-2 pr-4"><code className="text-xs">swap_build(token_in, token_out, amount_in)</code></td><td className="py-2 pl-4">Build unsigned transaction</td></tr>
                    <tr className="border-b border-gray-800"><td className="py-2 pr-4"><code className="text-xs">get_balance(token_mint)</code></td><td className="py-2 pl-4">Check token balance</td></tr>
                    <tr className="border-b border-gray-800"><td className="py-2 pr-4"><code className="text-xs">parse_x402_payment(body)</code></td><td className="py-2 pl-4">Parse 402 response</td></tr>
                    <tr className="border-b border-gray-800"><td className="py-2 pr-4"><code className="text-xs">handle_x402_payment(body)</code></td><td className="py-2 pl-4">Full x402 payment flow</td></tr>
                    <tr className="border-b border-gray-800"><td className="py-2 pr-4"><code className="text-xs">x402_auto_pay(body)</code></td><td className="py-2 pl-4">One-call auto-pay</td></tr>
                    <tr className="border-b border-gray-800"><td className="py-2 pr-4"><code className="text-xs">search_tokens(query)</code></td><td className="py-2 pl-4">Search tokens</td></tr>
                    <tr className="border-b border-gray-800"><td className="py-2 pr-4"><code className="text-xs">batch_balances(requests)</code></td><td className="py-2 pl-4">Batch balance checks</td></tr>
                    <tr><td className="py-2 pr-4"><code className="text-xs">get_transaction_history()</code></td><td className="py-2 pl-4">Get transaction history</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ── Wallet Configuration ── */}
          <section id="wallet-config" className="mb-8 md:mb-12 scroll-mt-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Wallet Configuration</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-3 text-blue-400">TypeScript</h3>
                <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-sm">
{`// From file
new X402AutoPayAgent({
  walletPath: './wallet.json',
  ...
});

// From secret key
new X402AutoPayAgent({
  walletSecretKey: process.env.WALLET_KEY,
  ...
});`}
                </pre>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-3 text-yellow-400">Python</h3>
                <pre className="bg-black/40 p-4 rounded-lg overflow-x-auto text-sm">
{`# From file
dex = MoltyDEX(
    wallet_path="./wallet.json"
)

# From secret key bytes
dex = MoltyDEX(
    wallet_secret_key=[1, 2, 3, ...]
)

# From existing Keypair
from solana.keypair import Keypair
kp = Keypair()
dex = MoltyDEX(wallet_keypair=kp)`}
                </pre>
              </div>
            </div>
          </section>

          {/* ── Common Tokens ── */}
          <section id="common-tokens" className="mb-8 md:mb-12 scroll-mt-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Common Token Addresses</h2>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 pr-4 text-gray-400 font-medium">Token</th>
                      <th className="text-left py-2 pl-4 text-gray-400 font-medium">Mint Address</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-300">
                    <tr className="border-b border-gray-800">
                      <td className="py-2 pr-4 font-semibold">SOL</td>
                      <td className="py-2 pl-4"><code className="text-xs bg-black/30 px-1.5 py-0.5 rounded">So11111111111111111111111111111111111111112</code></td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-2 pr-4 font-semibold">USDC</td>
                      <td className="py-2 pl-4"><code className="text-xs bg-black/30 px-1.5 py-0.5 rounded">EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v</code></td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-semibold">USDT</td>
                      <td className="py-2 pl-4"><code className="text-xs bg-black/30 px-1.5 py-0.5 rounded">Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ── REST API Endpoints ── */}
          <section className="mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">REST API Endpoints</h2>
            <p className="text-gray-300 mb-4">
              Base URL: <code className="bg-black/30 px-1.5 py-0.5 rounded text-sm text-green-400">https://api.moltydex.com</code>
            </p>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <code className="bg-black/40 px-2 py-1 rounded text-sm text-blue-400 whitespace-nowrap">GET</code>
                  <div>
                    <code className="text-sm text-white">/api/quote?inputMint=...&amp;outputMint=...&amp;amount=...</code>
                    <p className="text-xs text-gray-500 mt-0.5">Get swap quote with price, fees, and minimum output</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <code className="bg-black/40 px-2 py-1 rounded text-sm text-green-400 whitespace-nowrap">POST</code>
                  <div>
                    <code className="text-sm text-white">/api/swap/build</code>
                    <p className="text-xs text-gray-500 mt-0.5">Build unsigned swap transaction for client-side signing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <code className="bg-black/40 px-2 py-1 rounded text-sm text-blue-400 whitespace-nowrap">GET</code>
                  <div>
                    <code className="text-sm text-white">/api/balance?wallet=...&amp;token=...</code>
                    <p className="text-xs text-gray-500 mt-0.5">Check token balance for a wallet</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <code className="bg-black/40 px-2 py-1 rounded text-sm text-green-400 whitespace-nowrap">POST</code>
                  <div>
                    <code className="text-sm text-white">/api/x402/parse-payment</code>
                    <p className="text-xs text-gray-500 mt-0.5">Parse a 402 Payment Required response body</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <code className="bg-black/40 px-2 py-1 rounded text-sm text-green-400 whitespace-nowrap">POST</code>
                  <div>
                    <code className="text-sm text-white">/api/x402/auto-pay</code>
                    <p className="text-xs text-gray-500 mt-0.5">Complete x402 payment flow: check balance, swap, pay</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <code className="bg-black/40 px-2 py-1 rounded text-sm text-blue-400 whitespace-nowrap">GET</code>
                  <div>
                    <code className="text-sm text-white">/api/ultra/order</code>
                    <p className="text-xs text-gray-500 mt-0.5">Jupiter Ultra: get quote + ready-to-sign transaction in one call</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <code className="bg-black/40 px-2 py-1 rounded text-sm text-green-400 whitespace-nowrap">POST</code>
                  <div>
                    <code className="text-sm text-white">/api/ultra/execute</code>
                    <p className="text-xs text-gray-500 mt-0.5">Jupiter Ultra: submit signed transaction for execution</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <code className="bg-black/40 px-2 py-1 rounded text-sm text-blue-400 whitespace-nowrap">GET</code>
                  <div>
                    <code className="text-sm text-white">/api/ultra/holdings?wallet=...</code>
                    <p className="text-xs text-gray-500 mt-0.5">Get wallet token balances via Jupiter Ultra</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <Link href="/api-docs" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  View Full API Documentation &rarr;
                </Link>
              </div>
            </div>
          </section>

          {/* ── Links ── */}
          <section className="mb-8 md:mb-12">
            <div className="text-center text-sm text-gray-500 mb-6">
              <time dateTime={lastUpdated}>Last updated: {new Date(lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gray-900 rounded-lg p-8 border border-gray-800 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Integrate?</h2>
            <p className="text-gray-300 mb-6">
              Get your agent connected to MoltyDEX in under 5 minutes. Zero platform fees. Best prices via Jupiter.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a
                href="https://github.com/Djtrixuk/moltydex"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                View on GitHub
              </a>
              <Link
                href="/examples"
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                See Examples
              </Link>
              <Link
                href="/api-docs"
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                API Docs
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
