import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';
import { FAQPageStructuredData } from '../components/StructuredData';

export default function FAQ() {
  const faqs = [
    {
      question: "What is MoltyDEX?",
      answer: "MoltyDEX is the first DEX aggregator built specifically for x402 payments. It enables AI agents to automatically swap tokens when making x402 payments, handling the entire flow from detection to payment to retry."
    },
    {
      question: "How does automatic token swapping work?",
      answer: "When an agent encounters a 402 Payment Required response, MoltyDEX automatically detects it, checks the agent's balance, swaps tokens if needed (e.g., SOL → USDC), makes the payment, and retries the original request. All without manual intervention."
    },
    {
      question: "What tokens are supported?",
      answer: "MoltyDEX supports all SPL tokens on Solana, including SOL, USDC, USDT, and any other SPL token. It routes through Jupiter aggregator to find the best prices across all Solana DEXes."
    },
    {
      question: "How much are the fees?",
      answer: "MoltyDEX charges 0% fees - completely free swaps. No platform fees, no hidden costs. You only pay Solana network fees (paid in SOL separately)."
    },
    {
      question: "Is it secure?",
      answer: "Yes! All signing happens client-side. Your private keys never leave your system. MoltyDEX only builds unsigned transactions - you sign them locally before sending to Solana."
    },
    {
      question: "Do I need to maintain balances in multiple tokens?",
      answer: "No! That's the whole point. You can keep SOL (or any token) as your primary balance. MoltyDEX will automatically swap to whatever token is needed when making payments."
    },
    {
      question: "What happens if a swap fails?",
      answer: "MoltyDEX includes robust error handling. If a swap fails, the agent can handle it gracefully. The x402 auto-pay agent includes retry logic and proper error reporting."
    },
    {
      question: "Can I use this for non-agent use cases?",
      answer: "Yes! While built specifically for AI agents and x402 payments, MoltyDEX can be used for any token swap on Solana. The web interface is available for manual swaps, and the API works for any programmatic use case."
    },
    {
      question: "How do I get started?",
      answer: "Check out our developer documentation at /developers. For the easiest integration, use the HTTP Interceptor which automatically handles all 402 responses. For more control, use the X402AutoPayAgent class directly."
    },
    {
      question: "What if I need help?",
      answer: "Reach out on X (@MoltyDEX), check our GitHub repository for examples, or review the documentation. We're here to help!"
    },
    {
      question: "Is MoltyDEX live on mainnet?",
      answer: "Yes! MoltyDEX is live on Solana mainnet and handling real swaps. You can try it right now at moltydex.com or integrate it into your agent."
    },
    {
      question: "How does MoltyDEX compare to other DEX aggregators?",
      answer: "MoltyDEX is specifically built for x402 payments and AI agents. While other aggregators focus on trading, MoltyDEX focuses on automated payment flows. It includes the x402 auto-pay agent, handles edge cases specific to agents, and is optimized for pay-per-use API scenarios."
    }
  ];

  return (
    <>
      <Head>
        <title>FAQ - MoltyDEX | Frequently Asked Questions</title>
        <meta name="description" content="Frequently asked questions about MoltyDEX, x402 payments, automatic token swapping, fees, security, and integration. Get answers to common questions." />
        <meta name="keywords" content="moltydex FAQ, x402 FAQ, token swap FAQ, Solana DEX FAQ, AI agent payments FAQ" />
        <link rel="canonical" href="https://www.moltydex.com/faq" />
      </Head>

      <FAQPageStructuredData faqs={faqs} />

      <main className="min-h-screen bg-gray-950 text-white">
        <div className="container mx-auto px-4 py-6 md:py-12">
          <PageHeader />
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">Frequently Asked Questions</h1>
            <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Everything you need to know about MoltyDEX and x402 payments
            </p>
          </div>

          {/* FAQs */}
          <div className="max-w-4xl mx-auto space-y-4 md:space-y-6 mb-8 md:mb-12">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-4 md:p-6 border border-gray-800">
                <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{faq.question}</h2>
                <p className="text-sm md:text-base text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>

          {/* Still Have Questions */}
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 text-center">
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Check out our documentation, examples, or reach out directly. We're here to help!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/developers" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                View Documentation
              </Link>
              <Link href="/examples" className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                See Examples
              </Link>
              <a href="https://x.com/MoltyDEX" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
