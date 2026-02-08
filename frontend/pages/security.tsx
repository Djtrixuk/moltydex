import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';

export default function Security() {
  return (
    <>
      <Head>
        <title>Security - MoltyDEX | Client-Side Signing & Security Best Practices</title>
        <meta name="description" content="MoltyDEX security: Client-side signing, private keys never leave your system, open source, auditable code. Learn about our security practices and how we protect your funds." />
        <meta name="keywords" content="moltydex security, Solana DEX security, client-side signing, secure token swap, private key security, x402 security" />
        <link rel="canonical" href="https://www.moltydex.com/security" />
      </Head>

      <main className="min-h-screen bg-gray-950 text-white">
        <div className="container mx-auto px-4 py-6 md:py-12">
          <PageHeader />
          
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">Security</h1>
            <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Security is our top priority. Learn how MoltyDEX protects your funds and private keys.
            </p>
          </div>

          {/* Security Features */}
          <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 mb-12">
            {/* Client-Side Signing */}
            <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">Client-Side Signing</h2>
              </div>
              <p className="text-gray-300 mb-4">
                <strong className="text-white">Your private keys never leave your system.</strong> MoltyDEX builds unsigned transactions on the server, 
                but all signing happens locally in your browser or agent environment.
              </p>
              <div className="bg-gray-800 rounded-lg p-4 mt-4">
                <h3 className="font-semibold mb-2 text-white">How It Works:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
                  <li>API builds unsigned transaction</li>
                  <li>Transaction sent to your agent/browser</li>
                  <li>You sign transaction locally (private key stays with you)</li>
                  <li>Signed transaction sent to Solana network</li>
                </ol>
              </div>
            </div>

            {/* Open Source */}
            <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">Open Source</h2>
              </div>
              <p className="text-gray-300 mb-4">
                All code is open source and auditable. You can review exactly what MoltyDEX does before using it.
              </p>
              <div className="flex gap-4 mt-4">
                <a
                  href="https://github.com/Djtrixuk/moltydex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition text-sm md:text-base touch-manipulation min-h-[44px] flex items-center justify-center"
                >
                  View on GitHub
                </a>
              </div>
            </div>

            {/* No Key Storage */}
            <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">No Key Storage</h2>
              </div>
              <p className="text-gray-300 mb-4">
                <strong className="text-white">We never store your private keys.</strong> Not on our servers, not in our database, not anywhere. 
                Your keys remain under your control at all times.
              </p>
            </div>

            {/* Best Practices */}
            <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">Security Best Practices</h2>
              </div>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <div>
                    <strong className="text-white">Use Hardware Wallets:</strong> For large amounts, use hardware wallets like Ledger or Trezor
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <div>
                    <strong className="text-white">Verify Transactions:</strong> Always verify transaction details before signing
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <div>
                    <strong className="text-white">Start Small:</strong> Test with small amounts before larger transactions
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <div>
                    <strong className="text-white">Keep Keys Secure:</strong> Never share your private keys with anyone
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">✓</span>
                  <div>
                    <strong className="text-white">Use Official Sources:</strong> Only use official MoltyDEX website and GitHub repository
                  </div>
                </div>
              </div>
            </div>

            {/* Transparency */}
            <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">Transparency</h2>
              </div>
              <p className="text-gray-300 mb-4">
                We believe in transparency. All fees, code, and practices are open and auditable.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-white">Fee Transparency</h3>
                  <p className="text-sm text-gray-300">0% fees - completely free swaps. No platform fees charged.</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-white">Code Transparency</h3>
                  <p className="text-sm text-gray-300">All code open source and auditable on GitHub</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Have Security Questions?</h2>
            <p className="text-sm md:text-base text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
              We take security seriously. If you have questions or concerns, reach out to us.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <a
                href="https://github.com/Djtrixuk/moltydex/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition text-center touch-manipulation min-h-[44px] flex items-center justify-center"
              >
                Report Security Issue
              </a>
              <a
                href="https://x.com/MoltyDEX"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition text-center touch-manipulation min-h-[44px] flex items-center justify-center"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
