/**
 * All Blog Posts Metadata
 * Includes both SEO-optimized and original posts
 * Centralized data for all blog posts
 * 
 * IMPORTANT: When adding new posts:
 * 1. Ensure the date is newer than existing posts (check the most recent date)
 * 2. Add new posts at the END of the array (they will be sorted by date descending)
 * 3. Use format: date: 'YYYY-MM-DD' (e.g., '2026-02-11')
 * 4. The blog page sorts posts by date descending (newest first)
 * 5. If multiple posts have the same date, they maintain array order (stable sort)
 */

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  author: string;
  date: string;
  dateModified?: string; // Optional last modified date for SEO
  category: string;
  tags: string[];
  canonical: string;
  content: string; // Will be loaded from markdown files
  optimized?: boolean; // Whether this is SEO-optimized version
}

export const blogPosts: BlogPost[] = [
  // SEO-Optimized Posts (6 from Moltbook)
  {
    slug: 'token-mismatch-problem-breaking-agent-automation',
    title: 'Why Your Agent Keeps Failing: The Token Mismatch Problem in x402 Payments',
    description: 'Discover why AI agents fail when making x402 payments and how automatic token swapping solves the token mismatch problem. Learn how MoltyDEX enables seamless SOL to USDC swaps for agent automation.',
    keywords: ['token mismatch', 'x402 payments', 'agent automation', 'automatic token swapping', 'SOL to USDC swap', 'x402 protocol', 'Solana DEX', 'agent payments'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Agent Automation',
    tags: ['x402', 'swaps', 'automation', 'Solana', 'agents'],
    canonical: 'https://moltydex.com/blog/token-mismatch-problem-breaking-agent-automation',
    content: '', // Will be loaded from markdown files
    optimized: true,
  },
  {
    slug: 'real-world-use-cases-moltydex-x402-payments',
    title: 'Real-World Use Cases: How AI Agents Use MoltyDEX for x402 Payments',
    description: 'Explore real-world scenarios where MoltyDEX enables AI agents to handle x402 payments automatically. Learn how automatic token swapping solves production challenges in data collection, multi-service agents, and long-running automation.',
    keywords: ['x402 payments', 'agent use cases', 'automatic token swapping', 'AI agents', 'Solana swaps', 'agent automation', 'x402 protocol'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Use Cases',
    tags: ['x402', 'agents', 'automation', 'Solana', 'swaps'],
    canonical: 'https://moltydex.com/blog/real-world-use-cases-moltydex-x402-payments',
    content: '', // Will be loaded from markdown files
    optimized: true,
  },
  {
    slug: 'why-moltydex-beats-manual-swapping-for-agents',
    title: 'Why MoltyDEX is Better Than Manual Token Swapping for AI Agents',
    description: 'Compare manual token swapping vs MoltyDEX for AI agents. Learn why automatic token swapping with Jupiter aggregation provides better prices, simpler code, and zero manual intervention for x402 payments.',
    keywords: ['manual token swapping', 'automatic token swapping', 'Jupiter aggregator', 'Solana DEX', 'x402 payments', 'agent automation', 'best prices'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Technical',
    tags: ['x402', 'swaps', 'Jupiter', 'Solana', 'agents'],
    canonical: 'https://moltydex.com/blog/why-moltydex-beats-manual-swapping-for-agents',
    content: '', // Will be loaded from markdown files
    optimized: true,
  },
  {
    slug: 'how-moltydex-handles-x402-payments-automatically',
    title: 'How MoltyDEX Handles x402 Payments Automatically: Complete Technical Guide',
    description: 'Learn exactly how MoltyDEX handles x402 Payment Required responses automatically. Step-by-step guide to automatic token swapping, payment processing, and request retry logic for AI agents.',
    keywords: ['x402 payments', 'automatic payment handling', 'x402 protocol', 'token swapping', 'agent automation', 'Solana payments', 'x402 flow'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Technical',
    tags: ['x402', 'payments', 'automation', 'Solana', 'agents'],
    canonical: 'https://moltydex.com/blog/how-moltydex-handles-x402-payments-automatically',
    content: '', // Will be loaded from markdown files
    optimized: true,
  },
  {
    slug: 'beta-tester-program-moltydex-rewards',
    title: 'MoltyDEX Beta Tester Program: Earn Rewards While Testing Automatic Token Swapping',
    description: 'Join the MoltyDEX beta tester program for AI agents. Test automatic token swapping for x402 payments and earn rewards up to $50 USDC. Help shape the future of agent payments.',
    keywords: ['beta testing', 'beta tester program', 'agent testing', 'x402 payments', 'token swapping', 'earn rewards', 'Solana agents'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Community',
    tags: ['beta', 'testing', 'rewards', 'x402', 'agents'],
    canonical: 'https://moltydex.com/blog/beta-tester-program-moltydex-rewards',
    content: '', // Will be loaded from markdown files
    optimized: true,
  },
  {
    slug: 'beta-ai-agent-program-test-moltydex',
    title: 'Beta AI Agent Program: How to Create an Agent and Test MoltyDEX',
    description: 'Step-by-step guide to creating an AI agent and testing MoltyDEX for the beta program. Learn how to set up your agent, command it to test swaps, and understand how we track beta program participants.',
    keywords: ['beta program', 'AI agent', 'create agent', 'test MoltyDEX', 'agent instructions', 'beta tracking', 'x402 payments', 'Solana agents'],
    author: 'MoltyDEX Team',
    date: '2026-02-09',
    category: 'Tutorial',
    tags: ['beta', 'tutorial', 'agents', 'x402', 'testing'],
    canonical: 'https://moltydex.com/blog/beta-ai-agent-program-test-moltydex',
    content: '', // Will be loaded from markdown files
    optimized: true,
  },
  {
    slug: 'moltydex-beta-program-early-ai-agents-mdex-airdrop',
    title: 'MoltyDEX Beta Program: $MDEX Airdrop for Early AI Agents',
    description: 'Join the MoltyDEX beta program for AI agents. Early testers who use MoltyDEX for x402 payments will be added to a list for $MDEX token airdrops. Get started with automatic token swapping today.',
    keywords: ['beta program', 'MDEX airdrop', 'AI agents', 'x402 payments', 'token swapping', 'Solana agents', 'early adopters', 'beta testing'],
    author: 'MoltyDEX Team',
    date: '2026-02-05',
    category: 'Community',
    tags: ['beta', 'airdrop', 'MDEX', 'x402', 'agents', 'rewards'],
    canonical: 'https://moltydex.com/blog/moltydex-beta-program-early-ai-agents-mdex-airdrop',
    content: '', // Will be loaded from markdown files
    optimized: true,
  },
  {
    slug: 'why-moltydex-offers-zero-platform-fees',
    title: 'Why MoltyDEX Offers 0% Platform Fees: Building the Future of Agent Payments',
    description: 'Learn why MoltyDEX offers 0% platform fees for automatic token swapping. Understand our strategy, future pricing plans, and how early adopters can benefit from grandfathered rates.',
    keywords: ['0% fees', 'free token swapping', 'platform fees', 'Solana DEX', 'agent payments', 'x402 payments', 'free swaps'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Business',
    tags: ['pricing', 'fees', 'x402', 'agents', 'Solana'],
    canonical: 'https://moltydex.com/blog/why-moltydex-offers-zero-platform-fees',
    content: '', // Will be loaded from markdown files
    optimized: true,
  },
  
  // New SEO-Optimized Posts
  {
    slug: 'getting-started-moltydex-5-minutes-complete-guide',
    title: 'Getting Started with MoltyDEX in 5 Minutes: Complete Guide to x402 Payments on Solana',
    description: 'Learn how to integrate MoltyDEX for automatic x402 payment handling in your AI agents. Complete setup guide for TypeScript, JavaScript, and Python with Solana blockchain integration.',
    keywords: ['MoltyDEX setup', 'x402 payments Solana', 'automatic token swapping', 'AI agent payments', 'Solana DEX integration', 'cryptocurrency payments', 'fintech automation', 'Solana development'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Getting Started',
    tags: ['x402', 'Solana', 'getting-started', 'integration', 'cryptocurrency'],
    canonical: 'https://moltydex.com/blog/getting-started-moltydex-5-minutes-complete-guide',
    content: '', // Will be loaded from markdown files
    optimized: true,
  },
  {
    slug: 'how-to-integrate-moltydex-ai-agent-complete-guide',
    title: 'How to Integrate MoltyDEX with Your AI Agent: Complete Integration Guide for Solana x402 Payments',
    description: 'Step-by-step guide to integrating MoltyDEX for automatic token swapping in AI agents. Learn TypeScript, Python, LangChain, and AutoGPT integrations for cryptocurrency payments on Solana.',
    keywords: ['MoltyDEX integration', 'AI agent integration', 'x402 payments integration', 'Solana agent development', 'cryptocurrency automation', 'fintech integration', 'token swapping API'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Integration',
    tags: ['x402', 'integration', 'Solana', 'agents', 'cryptocurrency'],
    canonical: 'https://moltydex.com/blog/how-to-integrate-moltydex-ai-agent-complete-guide',
    content: '', // Will be loaded from markdown files
    optimized: true,
  },
  {
    slug: 'comparing-moltydex-other-dex-aggregators-complete-guide',
    title: 'Comparing MoltyDEX to Other DEX Aggregators: Complete Guide for Solana Traders and Developers',
    description: 'Comprehensive comparison of MoltyDEX vs other Solana DEX aggregators. Learn why MoltyDEX offers best prices, lowest fees, and unique x402 payment support for cryptocurrency trading and AI agents.',
    keywords: ['DEX aggregator comparison', 'Solana DEX aggregator', 'best DEX aggregator', 'Jupiter vs MoltyDEX', 'Solana trading', 'cryptocurrency trading', 'DeFi aggregator', 'token swap comparison'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Comparison',
    tags: ['DEX', 'aggregator', 'Solana', 'trading', 'cryptocurrency', 'x402', 'agents'],
    canonical: 'https://moltydex.com/blog/comparing-moltydex-other-dex-aggregators-complete-guide',
    content: '', // Will be loaded from markdown files
    optimized: true,
  },
  
  // Original Posts (to be optimized)
  {
    slug: 'how-to-build-x402-agent',
    title: 'How to Build an AI Agent That Pays for APIs Automatically',
    description: 'Complete guide to building AI agents that handle x402 payments with automatic token swapping.',
    keywords: ['x402', 'AI agent', 'automatic payments', 'Solana'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Tutorial',
    tags: ['x402', 'agents'],
    canonical: 'https://moltydex.com/blog/how-to-build-x402-agent',
    content: '', // Will be loaded from markdown files
    optimized: false,
  },
  {
    slug: 'building-x402-enabled-apis',
    title: 'Building x402-Enabled APIs: A Complete Guide',
    description: 'How to build APIs that accept x402 payments and work seamlessly with MoltyDEX.',
    keywords: ['x402', 'API development', 'pay-per-use', 'Solana'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Tutorial',
    tags: ['x402', 'API'],
    canonical: 'https://moltydex.com/blog/building-x402-enabled-apis',
    content: '', // Will be loaded from markdown files
    optimized: false,
  },
  {
    slug: 'comparing-moltydex-to-other-dex-aggregators',
    title: 'MoltyDEX vs Other DEX Aggregators: What Makes Us Different',
    description: 'Why MoltyDEX is built specifically for AI agents and x402 payments.',
    keywords: ['DEX aggregator', 'comparison', 'MoltyDEX'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Comparison',
    tags: ['DEX', 'comparison', 'x402', 'agents'],
    canonical: 'https://moltydex.com/blog/comparing-moltydex-to-other-dex-aggregators',
    content: '', // Will be loaded from markdown files
    optimized: false,
  },
  {
    slug: 'how-to-choose-a-dex-aggregator-for-agents',
    title: 'How to Choose a DEX Aggregator for AI Agents',
    description: 'Key factors to consider when selecting a DEX aggregator for your AI agent.',
    keywords: ['DEX aggregator', 'AI agents', 'selection'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Guide',
    tags: ['DEX', 'agents', 'x402'],
    canonical: 'https://moltydex.com/blog/how-to-choose-a-dex-aggregator-for-agents',
    content: '', // Will be loaded from markdown files
    optimized: false,
  },
  {
    slug: 'the-complete-guide-to-x402-payments-on-solana',
    title: 'The Complete Guide to x402 Payments on Solana',
    description: 'Everything you need to know about implementing x402 payments for AI agents on Solana.',
    keywords: ['x402', 'Solana', 'complete guide', 'payments'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Guide',
    tags: ['x402', 'Solana'],
    canonical: 'https://moltydex.com/blog/the-complete-guide-to-x402-payments-on-solana',
    content: '', // Will be loaded from markdown files
    optimized: false,
  },
  {
    slug: 'why-we-built-moltydex',
    title: 'Why We Built MoltyDEX',
    description: 'The story behind building the first DEX aggregator specifically for AI agents and x402 payments.',
    keywords: ['MoltyDEX', 'story', 'why', 'x402'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Company',
    tags: ['company', 'x402', 'agents'],
    canonical: 'https://moltydex.com/blog/why-we-built-moltydex',
    content: '', // Will be loaded from markdown files
    optimized: false,
  },
  {
    slug: 'why-moltydex-is-different',
    title: 'Why MoltyDEX is Different: Built for x402, Not Just Trading',
    description: 'Understanding what makes MoltyDEX unique in the DEX aggregator space.',
    keywords: ['MoltyDEX', 'different', 'unique', 'x402'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Company',
    tags: ['company', 'x402'],
    canonical: 'https://moltydex.com/blog/why-moltydex-is-different',
    content: '', // Will be loaded from markdown files
    optimized: false,
  },
  {
    slug: 'why-moltydex-is-secure',
    title: 'Why MoltyDEX is Secure: Client-Side Signing Explained',
    description: 'Understanding how MoltyDEX protects your private keys and funds.',
    keywords: ['security', 'MoltyDEX', 'client-side signing'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Security',
    tags: ['security'],
    canonical: 'https://moltydex.com/blog/why-moltydex-is-secure',
    content: '', // Will be loaded from markdown files
    optimized: false,
  },
  {
    slug: 'why-moltydex-is-the-best-dex-aggregator-for-traders',
    title: 'Why MoltyDEX is the Best DEX Aggregator for Traders',
    description: 'Fast, cheap token swaps on Solana. Best prices, lowest fees, maximum security.',
    keywords: ['DEX aggregator', 'traders', 'best', 'Solana'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Trading',
    tags: ['trading', 'DEX'],
    canonical: 'https://moltydex.com/blog/why-moltydex-is-the-best-dex-aggregator-for-traders',
    content: '', // Will be loaded from markdown files
    optimized: false,
  },
  {
    slug: '5-ways-moltydex-improves-agent-automation',
    title: '5 Ways MoltyDEX Improves Agent Automation',
    description: 'Real improvements that make agents more reliable, scalable, and autonomous.',
    keywords: ['automation', 'agents', 'improvements'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Automation',
    tags: ['automation', 'x402', 'agents'],
    canonical: 'https://moltydex.com/blog/5-ways-moltydex-improves-agent-automation',
    content: '', // Will be loaded from markdown files
    optimized: false,
  },
  {
    slug: 'moltydex-vs-manual-token-management',
    title: 'MoltyDEX vs Manual Token Management: The Real Cost Comparison',
    description: 'Why automatic token swapping saves time, money, and prevents failures.',
    keywords: ['manual', 'automatic', 'cost comparison'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Comparison',
    tags: ['comparison'],
    canonical: 'https://moltydex.com/blog/moltydex-vs-manual-token-management',
    content: '', // Will be loaded from markdown files
    optimized: false,
  },
  {
    slug: 'x402-payment-guide',
    title: 'x402 Payment Guide',
    description: 'Guide to x402 payments for AI agents.',
    keywords: ['x402', 'payment', 'guide'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Guide',
    tags: ['x402'],
    canonical: 'https://moltydex.com/blog/x402-payment-guide',
    content: '', // Will be loaded from markdown files
    optimized: false,
  },
  // New x402-focused SEO posts
  {
    slug: 'complete-guide-x402-payment-handler',
    title: 'Complete Guide to x402 Payment Handler: Automatic x402 Payments for Solana AI Agents',
    description: 'Comprehensive guide to x402 payment handler implementation. Learn how to build automatic x402 payment processing with token swapping for AI agents on Solana. Complete technical guide with code examples.',
    keywords: ['x402 payment handler', 'x402 payments', 'automatic x402 payments', 'x402 protocol', 'x402 Solana', 'x402 auto-pay agent', 'x402 payment automation', 'Solana payment protocol', 'pay-per-use API', 'x402 integration guide'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Technical Guide',
    tags: ['x402', 'payments', 'Solana', 'agents', 'automation', 'technical'],
    canonical: 'https://moltydex.com/blog/complete-guide-x402-payment-handler',
    content: '',
    optimized: true,
  },
  {
    slug: 'understanding-x402-protocol-for-developers',
    title: 'Understanding x402 Protocol for Developers: Complete Technical Guide to x402 Payment Required',
    description: 'Complete technical guide to x402 Payment Required protocol for developers. Learn how x402 works, implementation details, payment flows, and best practices for Solana x402 payments.',
    keywords: ['x402 protocol', 'x402 Payment Required', 'x402 specification', 'x402 implementation', 'x402 developer guide', 'x402 Solana', 'pay-per-use API', 'x402 technical guide', 'HTTP 402', 'x402 payment protocol'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Technical Guide',
    tags: ['x402', 'payments', 'protocol', 'Solana', 'technical', 'developers'],
    canonical: 'https://moltydex.com/blog/understanding-x402-protocol-for-developers',
    content: '',
    optimized: true,
  },
  {
    slug: 'solana-x402-payment-best-practices',
    title: 'Solana x402 Payment Best Practices: Complete Guide for Developers and API Providers',
    description: 'Best practices for implementing x402 payments on Solana. Learn security, performance, pricing, and integration best practices for x402 payment handlers and API providers.',
    keywords: ['x402 best practices', 'Solana x402', 'x402 payment security', 'x402 implementation guide', 'x402 API provider', 'x402 payment optimization', 'Solana payment best practices', 'x402 security', 'x402 performance'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Best Practices',
    tags: ['x402', 'payments', 'Solana', 'best practices', 'security', 'performance'],
    canonical: 'https://moltydex.com/blog/solana-x402-payment-best-practices',
    content: '',
    optimized: true,
  },
  {
    slug: 'x402-vs-subscription-pricing-complete-comparison',
    title: 'x402 vs Subscription Pricing: Complete Comparison for API Providers',
    description: 'Complete comparison of x402 pay-per-use pricing vs subscription models for API providers. Learn when to use x402 payments, benefits, drawbacks, and implementation strategies.',
    keywords: ['x402 vs subscription', 'pay-per-use pricing', 'x402 pricing model', 'API monetization', 'x402 benefits', 'subscription vs usage-based', 'x402 for API providers', 'pay-per-use API', 'x402 pricing strategy'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Business Strategy',
    tags: ['x402', 'pricing', 'business', 'API providers', 'monetization'],
    canonical: 'https://moltydex.com/blog/x402-vs-subscription-pricing-complete-comparison',
    content: '',
    optimized: true,
  },
  {
    slug: 'the-future-of-agent-payments-x402-and-automation',
    title: 'The Future of Agent Payments: x402 and the Autonomous Agent Economy',
    description: 'Explore the future of agent payments with x402 protocol. Learn how x402 enables autonomous agent economy, agent-to-agent payments, and true agent automation on Solana.',
    keywords: ['agent payments', 'autonomous agents', 'agent economy', 'x402 agents', 'agent-to-agent payments', 'AI agent payments', 'agent automation', 'Solana agents', 'x402 automation', 'future of agents'],
    author: 'MoltyDEX Team',
    date: '2026-02-08',
    category: 'Future Trends',
    tags: ['x402', 'agents', 'automation', 'future', 'AI', 'Solana'],
    canonical: 'https://moltydex.com/blog/the-future-of-agent-payments-x402-and-automation',
    content: '',
    optimized: true,
  },
  {
    slug: 'complete-guide-x402-communities-where-to-join',
    title: 'Complete Guide to x402 Communities: Where to Join, Learn, and Build',
    description: 'Discover the best x402 communities, Discord servers, forums, and resources for developers building with x402 payments. Connect with the x402 ecosystem, learn from experts, and find collaboration opportunities.',
    keywords: ['x402 communities', 'x402 Discord', 'x402 forums', 'x402 developer communities', 'x402 ecosystem', 'x402 resources', 'x402 learning', 'Solana x402', 'x402 developer network', 'x402 community'],
    author: 'MoltyDEX Team',
    date: '2026-02-10',
    category: 'Community',
    tags: ['x402', 'community', 'Discord', 'forums', 'resources', 'Solana', 'developers'],
    canonical: 'https://moltydex.com/blog/complete-guide-x402-communities-where-to-join',
    content: '',
    optimized: true,
  },
  {
    slug: 'moltydex-functionality-audit-february-2026',
    title: 'MoltyDEX Functionality Audit: 50+ Safe Improvements Identified',
    description: 'Comprehensive audit of MoltyDEX website and functionality covering human swap interface and agent tools. Identified 50+ safe, non-breaking improvements for UX, API, documentation, performance, and developer experience.',
    keywords: ['MoltyDEX audit', 'functionality review', 'UX improvements', 'API enhancements', 'developer experience', 'Solana DEX', 'x402 improvements', 'web3 development', 'DEX optimization'],
    author: 'MoltyDEX Team',
    date: '2026-02-11',
    category: 'Development',
    tags: ['audit', 'improvements', 'UX', 'API', 'development', 'x402', 'Solana'],
    canonical: 'https://moltydex.com/blog/moltydex-functionality-audit-february-2026',
    content: '',
    optimized: true,
  },
  {
    slug: 'moltydex-progress-update-february-2026',
    title: 'MoltyDEX Progress Update & Roadmap: February 2026',
    description: 'Latest updates on MoltyDEX development: blog system enhancements, SEO improvements, x402 communities research, and roadmap for the next 7-14 days. Learn about recent fixes, new features, and upcoming plans.',
    keywords: ['MoltyDEX progress', 'MoltyDEX roadmap', 'x402 development', 'Solana DEX updates', 'blog improvements', 'SEO optimization', 'x402 communities', 'MoltyDEX roadmap 2026', 'development updates'],
    author: 'MoltyDEX Team',
    date: '2026-02-11',
    category: 'Updates',
    tags: ['updates', 'roadmap', 'progress', 'x402', 'Solana', 'development'],
    canonical: 'https://moltydex.com/blog/moltydex-progress-update-february-2026',
    content: '',
    optimized: true,
  },
  {
    slug: 'phase-3-ux-improvements-february-2026',
    title: 'Phase 3 UX Improvements: Enhanced Token Discovery, Swap History & More',
    description: 'Five powerful new features: token categories, swap history, enhanced transaction status, error prevention, and keyboard shortcuts.',
    keywords: ['MoltyDEX updates', 'UX improvements', 'token categories', 'swap history', 'transaction status', 'error prevention', 'keyboard shortcuts', 'Solana DEX', 'user experience'],
    author: 'MoltyDEX Team',
    date: '2026-02-12',
    category: 'Product Updates',
    tags: ['updates', 'UX', 'features', 'improvements', 'Solana', 'DEX'],
    canonical: 'https://moltydex.com/blog/phase-3-ux-improvements-february-2026',
    content: '',
    optimized: false,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter(post => post.category === category);
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post => post.tags.includes(tag));
}

export function getAllCategories(): string[] {
  return Array.from(new Set(blogPosts.map(post => post.category)));
}

export function getAllTags(): string[] {
  return Array.from(new Set(blogPosts.flatMap(post => post.tags)));
}

export function getOptimizedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.optimized === true);
}

export function getUnoptimizedPosts(): BlogPost[] {
  return blogPosts.filter(post => post.optimized !== true);
}
