import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';

export default function Integrations() {
  const integrations = [
    {
      name: "LangChain",
      description: "Integrate MoltyDEX into LangChain agents for automatic x402 payment handling",
      language: "Python",
      example: "langchain-integration.py",
      status: "Available"
    },
    {
      name: "AutoGPT",
      description: "AutoGPT plugin that enables automatic x402 payments for AutoGPT agents",
      language: "Python",
      example: "autogpt-plugin.py",
      status: "Available"
    },
    {
      name: "TypeScript/JavaScript",
      description: "HTTP Interceptor for automatic 402 handling in any Node.js/TypeScript agent",
      language: "TypeScript",
      example: "HTTPInterceptor",
      status: "Available"
    },
    {
      name: "Python SDK",
      description: "Complete Python SDK for x402 payments and token swapping",
      language: "Python",
      example: "MoltyDEX class",
      status: "Available"
    },
    {
      name: "REST API",
      description: "Direct REST API integration for any language or framework",
      language: "Any",
      example: "REST endpoints",
      status: "Available"
    }
  ];

  return (
    <>
      <Head>
        <title>Integrations - MoltyDEX | Framework Integration Examples</title>
        <meta name="description" content="Integrate MoltyDEX into your favorite agent framework: LangChain, AutoGPT, TypeScript, Python, and more. Ready-to-use examples and code snippets." />
        <meta name="keywords" content="moltydex integrations, langchain integration, autogpt plugin, typescript x402, python x402, agent framework integration" />
        <link rel="canonical" href="https://www.moltydex.com/integrations" />
      </Head>
      <PageHeader />
      <main className="min-h-screen bg-gray-950 text-white">
        <div className="container mx-auto px-4 py-6 md:py-12">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">Integrations</h1>
            <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Integrate MoltyDEX into your favorite agent framework. Ready-to-use examples for popular platforms.
            </p>
          </div>

          {/* Integrations Grid */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
            {integrations.map((integration, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-4 md:p-6 border border-gray-800">
                <div className="flex items-start justify-between mb-3 md:mb-4 flex-wrap gap-2">
                  <h2 className="text-xl md:text-2xl font-bold">{integration.name}</h2>
                  <span className="bg-green-500/20 text-green-400 px-2 md:px-3 py-1 rounded text-xs md:text-sm">
                    {integration.status}
                  </span>
                </div>
                <p className="text-sm md:text-base text-gray-300 mb-3 md:mb-4">{integration.description}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs md:text-sm text-gray-400">
                  <span>Language: {integration.language}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>Example: {integration.example}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Start */}
          <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800 mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Quick Start</h2>
            <div className="space-y-4 md:space-y-6">
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-2">TypeScript/JavaScript (Easiest)</h3>
                <pre className="bg-gray-950 rounded p-3 md:p-4 overflow-x-auto text-xs md:text-sm">
                  <code>{`import { HTTPInterceptor } from '@moltydex/agent';

const interceptor = new HTTPInterceptor({
  apiUrl: 'https://api.moltydex.com',
  walletSecretKey: process.env.WALLET_SECRET_KEY,
  autoSwap: true,
});

// All 402 responses handled automatically!`}</code>
                </pre>
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-2">Python</h3>
                <pre className="bg-gray-950 rounded p-3 md:p-4 overflow-x-auto text-xs md:text-sm">
                  <code>{`from moltydex import MoltyDEX

dex = MoltyDEX(
    wallet_path="wallet.json",
    api_url="https://api.moltydex.com"
)

# Handle 402 payments automatically`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Examples */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-center">Integration Examples</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-2">LangChain</h3>
                <p className="text-gray-300 mb-4">See example: <code className="bg-gray-800 px-2 py-1 rounded">examples/langchain-integration.py</code></p>
                <Link href="/examples" className="text-blue-400 hover:text-blue-300 underline">
                  View Example →
                </Link>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-2">AutoGPT</h3>
                <p className="text-gray-300 mb-4">See example: <code className="bg-gray-800 px-2 py-1 rounded">examples/autogpt-plugin.py</code></p>
                <Link href="/examples" className="text-blue-400 hover:text-blue-300 underline">
                  View Example →
                </Link>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Need Help Integrating?</h2>
            <p className="text-sm md:text-base text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto">
              Check out our examples, documentation, or reach out for help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <Link href="/examples" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition text-center touch-manipulation min-h-[44px] flex items-center justify-center">
                View Examples
              </Link>
              <Link href="/developers" className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition text-center touch-manipulation min-h-[44px] flex items-center justify-center">
                Read Documentation
              </Link>
              <a href="https://x.com/MoltyDEX" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition text-center touch-manipulation min-h-[44px] flex items-center justify-center">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
