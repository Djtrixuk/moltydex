/**
 * Blog Index Page
 * Lists all blog posts with filtering and search
 */

import Head from 'next/head';
import Link from 'next/link';
import { blogPosts, getAllCategories, getAllTags } from '../../lib/blog-posts';
import PageHeader from '../../components/PageHeader';
import { BreadcrumbStructuredData } from '../../components/StructuredData';

export default function BlogIndex() {
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <>
      <Head>
        <title>MoltyDEX Blog - Guides, Tutorials, and Insights on x402 Payments and Agent Automation</title>
        <meta name="description" content="Learn about x402 payments, automatic token swapping, and AI agent automation. Comprehensive guides, tutorials, and insights from the MoltyDEX team." />
        <meta name="keywords" content="x402 payments, agent automation, token swapping, Solana DEX, AI agents, x402 protocol, automatic payments" />
        <link rel="canonical" href="https://moltydex.com/blog" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://moltydex.com/blog" />
        <meta property="og:title" content="MoltyDEX Blog - Guides, Tutorials, and Insights" />
        <meta property="og:description" content="Learn about x402 payments, automatic token swapping, and AI agent automation." />
        <meta property="og:image" content="https://moltydex.com/moltydex-logo-full.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MoltyDEX Blog" />
        <meta name="twitter:description" content="Learn about x402 payments, automatic token swapping, and AI agent automation." />
        <meta name="twitter:image" content="https://moltydex.com/moltydex-logo-full.png" />
      </Head>

      <BreadcrumbStructuredData items={[
        { name: 'Home', url: 'https://moltydex.com' },
        { name: 'Blog', url: 'https://moltydex.com/blog' }
      ]} />

      <PageHeader
        title="MoltyDEX Blog"
        subtitle="Your resource for x402 payments, automatic token swapping, and AI agent automation"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <span
                key={category}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* Featured Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {post.category} • {new Date(post.date).toLocaleDateString()}
                </div>
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                  {post.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* All Articles */}
        <div>
          <h2 className="text-2xl font-bold mb-6">All Articles</h2>
          <div className="space-y-6">
            {blogPosts.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {post.category}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {post.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-blue-600 dark:text-blue-400 font-medium">
                    Read more →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Topics Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h3 className="font-semibold mb-2">x402 Protocol</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Learn about the x402 payment protocol and how to implement it.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Token Swapping</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Discover automatic token swapping and why it's essential.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Agent Automation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Learn how to build reliable AI agents that handle payments automatically.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Solana & DeFi</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Explore Solana blockchain and DeFi concepts relevant to agent payments.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Start Building</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Ready to implement automatic token swapping in your agents?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/developers"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link
              href="/examples"
              className="px-6 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              View Examples
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
