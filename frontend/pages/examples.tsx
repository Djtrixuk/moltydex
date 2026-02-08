import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';

export default function Examples() {
  return (
    <>
      <Head>
        <title>Code Examples - MoltyDEX | x402 Agent Integration Examples</title>
        <meta name="description" content="Code examples for integrating MoltyDEX into your AI agent. TypeScript, JavaScript, Python, and REST API examples for x402 payment handling." />
        <meta name="keywords" content="moltydex examples, x402 code examples, AI agent integration, TypeScript x402, Python x402, REST API x402" />
        <link rel="canonical" href="https://www.moltydex.com/examples" />
      </Head>

      <main className="min-h-screen bg-gray-950 text-white">
        <div className="container mx-auto px-4 py-6 md:py-12">
          <PageHeader />
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">Code Examples</h1>
            <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Get started quickly with these ready-to-use code examples
            </p>
          </div>

          {/* Examples */}
          <div className="space-y-6 md:space-y-8 mb-8 md:mb-12">
            {/* Example 1: TypeScript HTTP Interceptor */}
            <div className="bg-gray-900 rounded-lg p-4 md:p-8 border border-gray-800">
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">TypeScript: HTTP Interceptor (Easiest)</h2>
              <p className="text-sm md:text-base text-gray-300 mb-3 md:mb-4">
                Automatically handles all 402 responses. Just set it up once and forget about it.
              </p>
              <pre className="bg-gray-950 rounded p-3 md:p-4 overflow-x-auto text-xs md:text-sm">
                <code>{`import { HTTPInterceptor } from '@moltydex/agent';

// Setup once
const interceptor = new HTTPInterceptor({
  apiUrl: 'https://api.moltydex.com',
  walletSecretKey: process.env.WALLET_SECRET_KEY,
  autoSwap: true,
});

// Now all fetch() calls handle 402 automatically!
const response = await fetch('https://premium-api.com/data');
const data = await response.json(); // Works seamlessly!`}</code>
              </pre>
            </div>

            {/* Example 2: TypeScript Manual */}
            <div className="bg-gray-900 rounded-lg p-4 md:p-8 border border-gray-800">
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">TypeScript: Manual x402 Handling</h2>
              <p className="text-sm md:text-base text-gray-300 mb-3 md:mb-4">
                More control over the payment flow. Handle 402 responses manually.
              </p>
              <pre className="bg-gray-950 rounded p-3 md:p-4 overflow-x-auto text-xs md:text-sm">
                <code>{`import { X402AutoPayAgent } from '@moltydex/agent';

const agent = new X402AutoPayAgent({
  apiUrl: 'https://api.moltydex.com',
  walletSecretKey: process.env.WALLET_SECRET_KEY,
  autoSwap: true,
});

// Make API call
let response = await fetch('https://premium-api.com/data');

// Handle 402 if needed
if (response.status === 402) {
  const result = await agent.handle402(response);
  if (result.success) {
    // Retry original request
    response = await fetch('https://premium-api.com/data');
  }
}

const data = await response.json();`}</code>
              </pre>
            </div>

            {/* Example 3: Python */}
            <div className="bg-gray-900 rounded-lg p-4 md:p-8 border border-gray-800">
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Python: x402 Auto-Pay</h2>
              <p className="text-sm md:text-base text-gray-300 mb-3 md:mb-4">
                Python integration for handling x402 payments automatically.
              </p>
              <pre className="bg-gray-950 rounded p-3 md:p-4 overflow-x-auto text-xs md:text-sm">
                <code>{`from moltydex import MoltyDEX
import requests

# Initialize
dex = MoltyDEX(
    wallet_path="wallet.json",
    api_url="https://api.moltydex.com"
)

# Make API call
response = requests.get('https://premium-api.com/data')

# Handle 402 if needed
if response.status_code == 402:
    payment_result = dex.handle_402_payment(response)
    if payment_result['success']:
        # Retry original request
        response = requests.get('https://premium-api.com/data')

if response.ok:
    data = response.json()
    print('Data received:', data)`}</code>
              </pre>
            </div>

            {/* Example 4: REST API */}
            <div className="bg-gray-900 rounded-lg p-4 md:p-8 border border-gray-800">
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">REST API: Get Quote</h2>
              <p className="text-sm md:text-base text-gray-300 mb-3 md:mb-4">
                Get a swap quote before executing the transaction.
              </p>
              <pre className="bg-gray-950 rounded p-3 md:p-4 overflow-x-auto text-xs md:text-sm">
                <code>{`# Get quote for swapping 1 SOL to USDC
curl "https://api.moltydex.com/api/quote?\\
  input_mint=So11111111111111111111111111111111111111112&\\
  output_mint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&\\
  amount=1000000000"

# Response includes:
# - output_amount: Amount you'll receive
# - fee_amount: MoltyDEX fee (0.1%)
# - output_after_fee: Final amount after fee`}</code>
              </pre>
            </div>

            {/* Example 5: REST API Build Swap */}
            <div className="bg-gray-900 rounded-lg p-4 md:p-8 border border-gray-800">
              <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">REST API: Build Swap Transaction</h2>
              <p className="text-sm md:text-base text-gray-300 mb-3 md:mb-4">
                Build an unsigned transaction. Sign it client-side and send it.
              </p>
              <pre className="bg-gray-950 rounded p-3 md:p-4 overflow-x-auto text-xs md:text-sm">
                <code>{`curl -X POST https://api.moltydex.com/api/swap/build \\
  -H "Content-Type: application/json" \\
  -d '{
    "wallet_address": "YOUR_WALLET_ADDRESS",
    "input_mint": "So11111111111111111111111111111111111111112",
    "output_mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "amount": "1000000000"
  }'

# Returns unsigned transaction (base64)
# Sign it with your wallet, then send via Solana RPC`}</code>
              </pre>
            </div>
          </div>

          {/* More Resources */}
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">More Resources</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2">📚 Documentation</h3>
                <p className="text-gray-300 mb-4">Complete API reference and integration guides.</p>
                <Link href="/developers" className="text-blue-400 hover:text-blue-300 underline">
                  View Full Documentation →
                </Link>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">💻 GitHub</h3>
                <p className="text-gray-300 mb-4">Working examples and source code.</p>
                <a href="https://github.com/Djtrixuk/moltydex" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">
                  View on GitHub →
                </a>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Integrate?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Start building agents that handle x402 payments automatically. Check out our developer documentation.
            </p>
            <Link href="/developers" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition inline-block">
              Get Started →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
