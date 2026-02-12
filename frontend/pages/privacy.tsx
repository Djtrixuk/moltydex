import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - MoltyDEX | Your Privacy Matters</title>
        <meta name="description" content="MoltyDEX Privacy Policy. We respect your privacy. Client-side signing means your private keys never leave your device. No personal data collection, no tracking of wallet addresses." />
        <meta name="keywords" content="moltydex privacy policy, data protection, client-side signing, blockchain privacy" />
        <link rel="canonical" href="https://moltydex.com/privacy" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://moltydex.com/privacy" />
        <meta property="og:title" content="Privacy Policy - MoltyDEX" />
        <meta property="og:description" content="We respect your privacy. Client-side signing means your private keys never leave your device." />
        <meta property="og:image" content="https://moltydex.com/moltydex-logo-full.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://moltydex.com/privacy" />
        <meta name="twitter:title" content="Privacy Policy - MoltyDEX" />
        <meta name="twitter:description" content="We respect your privacy. Client-side signing means your private keys never leave your device." />
      </Head>
      <PageHeader />
      <main className="min-h-screen bg-gray-950 text-white">
        <div className="container mx-auto px-4 py-6 md:py-12 max-w-4xl">
          
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">Privacy Policy</h1>
            <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Last updated: February 6, 2026
            </p>
          </div>

          {/* Content */}
          <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800 space-y-6 md:space-y-8">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                MoltyDEX ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our decentralized exchange aggregator service.
              </p>
              <p className="text-gray-300 leading-relaxed">
                <strong className="text-white">Important:</strong> MoltyDEX is a non-custodial service. We do not hold, store, or have access to your funds, private keys, or wallet credentials. All transactions are signed client-side on your device.
              </p>
            </section>

            {/* What We Don't Collect */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">2. What We Don't Collect</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We do <strong className="text-white">not</strong> collect, store, or have access to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
                <li>Your private keys or seed phrases</li>
                <li>Your wallet addresses (unless you explicitly share them via API)</li>
                <li>Your transaction history</li>
                <li>Your personal identification information</li>
                <li>Your email address or contact information (unless you provide it)</li>
                <li>Your IP address (we use privacy-focused analytics)</li>
              </ul>
            </section>

            {/* Client-Side Signing */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">3. Client-Side Signing</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong className="text-white">Critical Privacy Feature:</strong> All transaction signing happens on your device using your wallet. We only receive already-signed transactions for broadcasting to the Solana network.
              </p>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                <p className="text-green-300 text-sm">
                  ✅ Your private keys never leave your device<br/>
                  ✅ We cannot access your funds<br/>
                  ✅ We cannot initiate transactions on your behalf<br/>
                  ✅ You maintain full control
                </p>
              </div>
            </section>

            {/* What We May Collect */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">4. What We May Collect</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                When you use MoltyDEX, we may collect:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
                <li><strong className="text-white">Public blockchain data:</strong> Transaction signatures and public wallet addresses are visible on the Solana blockchain (this is inherent to blockchain technology)</li>
                <li><strong className="text-white">Usage analytics:</strong> Aggregated, anonymized usage statistics (e.g., number of swaps, popular token pairs) via privacy-focused analytics</li>
                <li><strong className="text-white">API usage:</strong> If you use our API, we may log API requests for rate limiting and service improvement (no personal data)</li>
                <li><strong className="text-white">Error logs:</strong> Technical error information to improve service reliability (no personal data)</li>
              </ul>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">5. Third-Party Services</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                MoltyDEX integrates with the following services:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
                <li><strong className="text-white">Jupiter Aggregator:</strong> We route swap requests through Jupiter to find best prices. Jupiter's privacy policy applies to their service.</li>
                <li><strong className="text-white">Solana Network:</strong> Transactions are broadcast to the public Solana blockchain. Blockchain data is public by design.</li>
                <li><strong className="text-white">Wallet Providers:</strong> When you connect a wallet (Phantom, Solflare, etc.), you interact directly with their services. Their privacy policies apply.</li>
                <li><strong className="text-white">Analytics:</strong> We may use privacy-focused analytics services (e.g., Plausible Analytics) that do not track personal information or use cookies.</li>
              </ul>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">6. Cookies and Tracking</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use minimal, essential cookies for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
                <li>Maintaining your session preferences</li>
                <li>Remembering your slippage tolerance settings</li>
                <li>Storing developer mode preferences (if enabled)</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                We do <strong className="text-white">not</strong> use tracking cookies, advertising cookies, or third-party tracking scripts.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">7. Data Security</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We implement security measures to protect any data we may collect:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
                <li>HTTPS encryption for all communications</li>
                <li>Secure API endpoints with rate limiting</li>
                <li>No storage of sensitive user data</li>
                <li>Regular security audits and updates</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                However, remember that blockchain transactions are public by nature. Always verify transaction details before signing.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">8. Your Rights</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
                <li>Use MoltyDEX without providing any personal information</li>
                <li>Disconnect your wallet at any time</li>
                <li>Clear your browser's local storage to remove preferences</li>
                <li>Use our API anonymously (no account required)</li>
                <li>Review this privacy policy at any time</li>
              </ul>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">9. Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                MoltyDEX is not intended for users under the age of 18. We do not knowingly collect information from children. If you believe we have inadvertently collected information from a child, please contact us.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify users of any material changes by updating the "Last updated" date at the top of this page. Your continued use of MoltyDEX after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">11. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
                <li><strong className="text-white">X (Twitter):</strong> <a href="https://x.com/MoltyDEX" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">@MoltyDEX</a></li>
                <li><strong className="text-white">Website:</strong> <a href="https://moltydex.com" className="text-blue-400 hover:text-blue-300 underline">moltydex.com</a></li>
              </ul>
            </section>

            {/* Disclaimer */}
            <section className="pt-6 border-t border-gray-700">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">12. Disclaimer</h2>
              <p className="text-gray-300 leading-relaxed">
                MoltyDEX is a decentralized service. While we implement privacy best practices, blockchain transactions are inherently public. Always verify transaction details, use reputable wallets, and never share your private keys or seed phrases with anyone, including us.
              </p>
            </section>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-gray-300 hover:text-white underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
