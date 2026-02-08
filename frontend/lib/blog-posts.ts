/**
 * Blog Posts Metadata
 * Centralized data for all blog posts
 */

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  author: string;
  date: string;
  category: string;
  tags: string[];
  canonical: string;
  content: string; // Will be loaded from markdown files
}

export const blogPosts: BlogPost[] = [
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
    content: '', // Will be loaded dynamically
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
    content: '',
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
    content: '',
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
    content: '',
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
    content: '',
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
    content: '',
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
  return [...new Set(blogPosts.map(post => post.category))];
}

export function getAllTags(): string[] {
  return [...new Set(blogPosts.flatMap(post => post.tags))];
}
