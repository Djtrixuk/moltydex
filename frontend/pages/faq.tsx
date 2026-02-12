import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';
import Breadcrumbs from '../components/Breadcrumbs';
import FAQAccordion from '../components/FAQAccordion';
import { FAQPageStructuredData } from '../components/StructuredData';

export default function FAQ() {
  const faqs = [
    {
      question: "What is MoltyDEX?",
      answer: "MoltyDEX is the only x402 payment handler with automatic token swapping for AI agents on Solana. It enables AI agents to automatically pay for APIs using any token, with zero platform fees and best prices via Jupiter aggregator. MoltyDEX handles the entire payment flow from detection to token swapping to payment confirmation automatically."
    },
    {
      question: "What is x402 payment handler?",
      answer: "An x402 payment handler is a service that automatically processes HTTP 402 Payment Required responses. MoltyDEX is the only x402 payment handler that includes automatic token swapping, allowing AI agents to pay for APIs even when they don't have the exact token required. It handles token conversion, payment processing, and request retries seamlessly."
    },
    {
      question: "How does automatic x402 payment work?",
      answer: "When an AI agent makes an API call and receives a 402 Payment Required response, MoltyDEX automatically intercepts it, parses the payment requirements, checks the agent's token balance, swaps tokens if needed using Jupiter aggregator, makes the payment on Solana blockchain, and retries the original API request. All of this happens automatically without any manual intervention."
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
    },
    {
      question: "What is x402 protocol?",
      answer: "x402 is a payment protocol for Solana that enables pay-per-use API payments. When an API requires payment, it returns HTTP 402 Payment Required with payment details. MoltyDEX is the only x402 payment handler that automatically handles token swapping, making it seamless for AI agents to pay for APIs using any token."
    },
    {
      question: "How do AI agents pay for APIs?",
      answer: "AI agents pay for APIs using the x402 protocol on Solana. When an API requires payment, it returns HTTP 402 Payment Required. MoltyDEX automatically intercepts this response, swaps tokens if needed, makes the payment, and retries the API call. This enables AI agents to automatically pay for premium APIs without manual token management."
    },
    {
      question: "What is automatic x402 payment automation?",
      answer: "Automatic x402 payment automation is the process of handling x402 Payment Required responses without manual intervention. MoltyDEX provides the only fully automated x402 payment handler that includes automatic token swapping, payment processing, and request retries. This enables AI agents to seamlessly pay for APIs using any token."
    },
    {
      question: "How to integrate x402 payments?",
      answer: "To integrate x402 payments, install the MoltyDEX SDK (@moltydex/agent), configure the HTTPInterceptor with your Solana wallet, and enable autoSwap. Once configured, all API calls automatically handle 402 responses. The integration takes less than 5 minutes and requires zero manual payment handling code."
    }
  ];

  const lastUpdated = "2026-02-08";

  return (
    <>
      <Head>
        <title>FAQ - MoltyDEX | Frequently Asked Questions</title>
        <meta name="description" content="Frequently asked questions about MoltyDEX, x402 payments, automatic token swapping, fees, security, and integration. Get answers to common questions." />
        <meta name="keywords" content="moltydex FAQ, x402 FAQ, token swap FAQ, Solana DEX FAQ, AI agent payments FAQ" />
        <link rel="canonical" href="https://moltydex.com/faq" />
        <meta name="dateModified" content={lastUpdated} />
      </Head>

      <FAQPageStructuredData faqs={faqs} />
      <PageHeader />
      <main className="min-h-screen bg-gray-950 text-white">
        <div className="container mx-auto px-4 py-6 md:py-12">
          <Breadcrumbs items={[{ name: 'FAQ', href: '/faq' }]} />
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 text-white">Frequently Asked Questions</h1>
            <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Everything you need to know about MoltyDEX and x402 payments
            </p>
          </div>

          {/* FAQs */}
          <div className="max-w-4xl mx-auto mb-8 md:mb-12">
            <FAQAccordion faqs={faqs} />
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

          {/* Last Updated */}
          <div className="text-center text-sm text-gray-500 mt-8">
            <time dateTime={lastUpdated}>Last updated: {new Date(lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>
        </div>
      </main>
    </>
  );
}
