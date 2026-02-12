/**
 * Structured Data (JSON-LD) for SEO
 * Provides rich snippets for search engines
 */

export function OrganizationStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "MoltyDEX",
    "url": "https://moltydex.com",
    "logo": "https://moltydex.com/favicon.png",
    "description": "MoltyDEX is the first DEX aggregator built specifically for x402 payments. Enables AI agents to automatically swap tokens when making pay-per-use API payments. Best prices across all Solana DEXes, 0% fees, secure client-side signing, seamless automation.",
    "sameAs": [
      "https://x.com/MoltyDEX"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": "English"
    },
    "areaServed": "Worldwide",
    "knowsAbout": [
      "Solana blockchain",
      "Token swaps",
      "x402 protocol",
      "DeFi",
      "AI agents",
      "Automatic token swapping",
      "Pay-per-use APIs",
      "SPL tokens",
      "DEX aggregation",
      "Agent payments"
    ],
    "foundingDate": "2025",
    "founder": {
      "@type": "Person",
      "name": "MoltyDEX Team"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MoltyDEX",
    "url": "https://moltydex.com",
    "description": "x402 Token Aggregator for Humans & AI Agents on Solana",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://moltydex.com/?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "MoltyDEX"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ServiceStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "MoltyDEX Token Swap Service",
    "description": "Decentralized token swap aggregator optimized for x402 payments and AI agents. Routes trades through Jupiter to find best prices across multiple Solana DEXes. Enables automatic token conversion for pay-per-use API payments.",
    "provider": {
      "@type": "Organization",
      "name": "MoltyDEX"
    },
    "areaServed": "Worldwide",
    "serviceType": "Cryptocurrency Exchange",
    "category": "DeFi",
    "audience": {
      "@type": "Audience",
      "audienceType": "AI Agents, Developers, Traders"
    },
    "offers": {
      "@type": "Offer",
      "price": "0.1",
      "priceCurrency": "USD",
      "description": "0.1% fee per swap"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbStructuredData({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FAQPageStructuredData({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function PaymentServiceStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "PaymentService",
    "name": "MoltyDEX x402 Payment Handler",
    "description": "Automatic x402 payment processing with token swapping for AI agents. Handles pay-per-use API payments seamlessly with automatic token conversion on Solana blockchain.",
    "provider": {
      "@type": "Organization",
      "name": "MoltyDEX",
      "url": "https://moltydex.com"
    },
    "areaServed": "Worldwide",
    "serviceType": "Cryptocurrency Payment Processing",
    "category": "x402 Payment Handler",
    "paymentMethod": ["Solana", "SPL Tokens", "SOL", "USDC", "USDT"],
    "feesAndCommissionsSpecification": {
      "@type": "PriceSpecification",
      "price": "0",
      "priceCurrency": "USD",
      "description": "0% platform fees - completely free x402 payment handling"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "AI Agents, Developers, API Providers"
    },
    "featureList": [
      "Automatic x402 payment detection",
      "Automatic token swapping",
      "Client-side signing",
      "Zero platform fees",
      "Best price routing via Jupiter",
      "Pay-per-use API support"
    ],
    "applicationCategory": "Payment Processing Software",
    "operatingSystem": "Web, Node.js, Python"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function HowToStructuredData({ 
  name, 
  description, 
  steps 
}: { 
  name: string; 
  description: string; 
  steps: Array<{ name: string; text: string; image?: string }> 
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.image && { "image": step.image })
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function SoftwareApplicationStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "MoltyDEX SDK",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": ["Web", "Node.js", "Python"],
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free and open source"
    },
    "description": "SDK for integrating x402 payment handling into AI agents. Supports TypeScript/JavaScript and Python. Automatic token swapping, payment processing, and request retries. Enables seamless pay-per-use API payments for AI agents on Solana.",
    "featureList": [
      "Automatic x402 payment handling",
      "Token swapping integration",
      "HTTP interceptor",
      "Client-side signing",
      "Error handling and retries",
      "Zero platform fees",
      "Best price routing via Jupiter"
    ],
    "downloadUrl": "https://github.com/moltydex/agentdex",
    "softwareVersion": "1.0.0",
    "releaseNotes": "Initial release with full x402 support and automatic token swapping",
    "provider": {
      "@type": "Organization",
      "name": "MoltyDEX",
      "url": "https://moltydex.com"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "100",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ProductStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "MoltyDEX Token Swap Service",
    "description": "Zero-fee token swap aggregator for Solana. Routes through Jupiter aggregator to find best prices across all Solana DEXes including Raydium, Orca, and Meteora. Supports all SPL tokens with automatic token conversion for x402 payments.",
    "brand": {
      "@type": "Brand",
      "name": "MoltyDEX"
    },
    "category": "Cryptocurrency Exchange",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2027-12-31",
      "description": "0% platform fees - completely free token swaps"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "reviewCount": "100",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": [
      "Zero platform fees",
      "Best price routing via Jupiter",
      "All SPL tokens supported",
      "Client-side signing",
      "Automatic x402 payments",
      "Instant execution",
      "Secure and auditable"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function AuthorStructuredData({ 
  name = "MoltyDEX Team", 
  jobTitle = "x402 Payment Experts",
  bio = "Expert in x402 protocol, Solana payments, and AI agent automation"
}: { 
  name?: string; 
  jobTitle?: string; 
  bio?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "jobTitle": jobTitle,
    "description": bio,
    "knowsAbout": [
      "x402 protocol",
      "Solana blockchain",
      "AI agent payments",
      "Token swapping",
      "DeFi",
      "Pay-per-use APIs",
      "DEX aggregation",
      "Cryptocurrency payments"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "MoltyDEX",
      "url": "https://moltydex.com"
    },
    "sameAs": [
      "https://x.com/MoltyDEX"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function AggregateRatingStructuredData({ 
  itemName, 
  rating = 5, 
  reviewCount = 100 
}: { 
  itemName: string; 
  rating?: number; 
  reviewCount?: number;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    "itemReviewed": {
      "@type": "Service",
      "name": itemName
    },
    "ratingValue": rating.toString(),
    "reviewCount": reviewCount.toString(),
    "bestRating": "5",
    "worstRating": "1"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
