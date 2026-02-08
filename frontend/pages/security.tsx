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
      <PageHeader />
      <main className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Header */}
          <div className="text-center mb-10 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Security
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Security is our top priority. Learn how MoltyDEX protects your funds and private keys.
            </p>
          </div>

          {/* Security Features */}
          <div className="space-y-6 mb-12">
            {[
              {
                icon: (
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                iconBg: 'from-green-500/20 to-emerald-500/20',
                title: 'Client-Side Signing',
                desc: 'Your private keys never leave your system. MoltyDEX builds unsigned transactions on the server, but all signing happens locally in your browser or agent environment.',
                details: [
                  'API builds unsigned transaction',
                  'Transaction sent to your agent/browser',
                  'You sign transaction locally (private key stays with you)',
                  'Signed transaction sent to Solana network'
                ]
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                ),
                iconBg: 'from-blue-500/20 to-cyan-500/20',
                title: 'Open Source',
                desc: 'All code is open source and auditable. You can review exactly what MoltyDEX does before using it.',
                link: { text: 'View on GitHub', href: 'https://github.com/Djtrixuk/moltydex' }
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                ),
                iconBg: 'from-red-500/20 to-pink-500/20',
                title: 'No Key Storage',
                desc: 'We never store your private keys. Not on our servers, not in our database, not anywhere. Your keys remain under your control at all times.'
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                iconBg: 'from-yellow-500/20 to-orange-500/20',
                title: 'Security Best Practices',
                desc: '',
                practices: [
                  { text: 'Use Hardware Wallets: For large amounts, use hardware wallets like Ledger or Trezor' },
                  { text: 'Verify Transactions: Always verify transaction details before signing' },
                  { text: 'Start Small: Test with small amounts before larger transactions' },
                  { text: 'Keep Keys Secure: Never share your private keys with anyone' },
                  { text: 'Use Official Sources: Only use official MoltyDEX website and GitHub repository' }
                ]
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ),
                iconBg: 'from-purple-500/20 to-pink-500/20',
                title: 'Transparency',
                desc: 'We believe in transparency. All fees, code, and practices are open and auditable.',
                transparency: [
                  { title: 'Fee Transparency', desc: '0% fees - completely free swaps. No platform fees charged.' },
                  { title: 'Code Transparency', desc: 'All code open source and auditable on GitHub' }
                ]
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl p-6 md:p-8 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.iconBg} flex items-center justify-center shrink-0`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{feature.title}</h2>
                    {feature.desc && (
                      <p className="text-gray-400 leading-relaxed mb-4">{feature.desc}</p>
                    )}
                  </div>
                </div>
                
                {feature.details && (
                  <div className="bg-gray-950/50 rounded-lg p-4 border border-gray-800/50">
                    <h3 className="font-semibold mb-3 text-white">How It Works:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
                      {feature.details.map((detail, i) => (
                        <li key={i}>{detail}</li>
                      ))}
                    </ol>
                  </div>
                )}
                
                {feature.link && (
                  <div className="mt-4">
                    <a
                      href={feature.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition text-sm"
                    >
                      {feature.link.text}
                    </a>
                  </div>
                )}
                
                {feature.practices && (
                  <div className="space-y-3 mt-4">
                    {feature.practices.map((practice, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-green-400 mt-1 shrink-0">✓</span>
                        <div>
                          <strong className="text-white">{practice.text.split(':')[0]}:</strong>
                          {practice.text.includes(':') && <span className="text-gray-400"> {practice.text.split(':')[1]}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {feature.transparency && (
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    {feature.transparency.map((item, i) => (
                      <div key={i} className="bg-gray-950/50 rounded-lg p-4 border border-gray-800/50">
                        <h3 className="font-semibold mb-2 text-white">{item.title}</h3>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-blue-950/40 via-purple-950/40 to-indigo-950/40 rounded-2xl p-8 md:p-10 border border-blue-500/20 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Have Security Questions?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              We take security seriously. If you have questions or concerns, reach out to us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/Djtrixuk/moltydex/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
              >
                Report Security Issue
              </a>
              <a
                href="https://x.com/MoltyDEX"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-xl font-semibold transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50 hover:scale-105"
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
