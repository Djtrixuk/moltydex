/**
 * Blog Index Page
 * Lists all blog posts with filtering and search
 */

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useMemo } from 'react';
import { blogPosts, getAllCategories, getAllTags, getBlogPostsByCategory, getBlogPostsByTag } from '../../lib/blog-posts';
import PageHeader from '../../components/PageHeader';
import { BreadcrumbStructuredData } from '../../components/StructuredData';

export default function BlogIndex() {
  const router = useRouter();
  const categories = getAllCategories();
  const tags = getAllTags();
  
  // Get category from URL query params
  const categoryFromQuery = router.query.category as string | undefined;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categoryFromQuery || null
  );

  // Update state when URL query changes
  useEffect(() => {
    if (categoryFromQuery) {
      setSelectedCategory(categoryFromQuery);
    } else {
      setSelectedCategory(null);
    }
  }, [categoryFromQuery]);

  // Filter posts based on selected category or tag
  const filteredPosts = useMemo(() => {
    let posts;
    if (!selectedCategory) {
      posts = blogPosts;
    } else if (selectedCategory === 'x402') {
      // Special handling for "x402" - filter by tag instead of category
      posts = getBlogPostsByTag('x402');
    } else {
      posts = getBlogPostsByCategory(selectedCategory);
    }
    // Sort by date descending (newest first)
    return [...posts].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }, [selectedCategory]);

  // Combine categories with special tag-based filters
  const filterOptions = useMemo(() => {
    const categoryList = [...categories];
    // Add "x402" as a special filter option at the beginning
    if (!categoryList.includes('x402')) {
      categoryList.unshift('x402');
    }
    return categoryList;
  }, [categories]);

  // Handle category/tag click
  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      // Deselect if clicking the same category
      setSelectedCategory(null);
      router.push('/blog', undefined, { shallow: true });
    } else {
      // Select new category
      setSelectedCategory(category);
      router.push(`/blog?category=${encodeURIComponent(category)}`, undefined, { shallow: true });
    }
  };

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

      <main className="min-h-screen bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Categories */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Categories</h2>
              {selectedCategory && (
                <button
                  onClick={() => handleCategoryClick(selectedCategory)}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                >
                  Clear filter
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {filterOptions.map(category => {
                const isActive = selectedCategory === category;
                const isX402 = category === 'x402';
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white border-2 border-blue-500 shadow-lg shadow-blue-500/30'
                        : isX402
                        ? 'bg-purple-800/60 hover:bg-purple-800 border border-purple-700/50 text-purple-300 hover:text-purple-200 hover:border-purple-600'
                        : 'bg-gray-800/60 hover:bg-gray-800 border border-gray-700/50 text-gray-300 hover:text-white hover:border-gray-600'
                    }`}
                  >
                    {category === 'x402' ? 'x402' : category}
                    {isActive && (
                      <span className="ml-2 text-xs">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
            {selectedCategory && (
              <div className="mt-4 text-sm text-gray-400">
                Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} 
                {selectedCategory === 'x402' ? ' tagged with' : ' in'} <span className="text-blue-400 font-semibold">{selectedCategory}</span>
              </div>
            )}
          </div>

          {/* Featured Articles */}
          {!selectedCategory && (
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Featured Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...blogPosts].sort((a, b) => {
                  const dateA = new Date(a.date).getTime();
                  const dateB = new Date(b.date).getTime();
                  return dateB - dateA;
                }).slice(0, 3).map(post => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block p-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <div className="text-xs text-gray-400 mb-3 font-medium">
                    {post.category} • {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-400 transition-colors leading-tight line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3">
                    {post.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-blue-500/20 text-blue-400 rounded-md text-xs font-medium border border-blue-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Articles */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              {selectedCategory ? `${selectedCategory} Articles` : 'All Articles'}
            </h2>
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-4">No posts found in this category.</p>
                <button
                  onClick={() => handleCategoryClick(selectedCategory!)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Clear filter to see all posts
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block p-6 bg-gradient-to-br from-gray-900/60 to-gray-800/60 rounded-xl border border-gray-700/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-gray-400 font-medium">
                          {post.category}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="text-xs text-gray-400">
                          {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-base text-gray-400 leading-relaxed mb-4">
                        {post.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 bg-gray-800/60 text-gray-300 rounded-md text-xs font-medium border border-gray-700/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center text-blue-400 group-hover:text-blue-300 font-semibold text-sm transition-colors whitespace-nowrap">
                      Read more
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </Link>
                ))}
              </div>
            )}
          </div>

          {/* Topics Section */}
          <div className="mt-16 pt-12 border-t border-gray-800">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">Explore Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 bg-gray-900/40 rounded-xl border border-gray-800/50">
                <h3 className="font-bold text-white mb-2 text-lg">x402 Protocol</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Learn about the x402 payment protocol and how to implement it.
                </p>
              </div>
              <div className="p-5 bg-gray-900/40 rounded-xl border border-gray-800/50">
                <h3 className="font-bold text-white mb-2 text-lg">Token Swapping</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Discover automatic token swapping and why it's essential.
                </p>
              </div>
              <div className="p-5 bg-gray-900/40 rounded-xl border border-gray-800/50">
                <h3 className="font-bold text-white mb-2 text-lg">Agent Automation</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Learn how to build reliable AI agents that handle payments automatically.
                </p>
              </div>
              <div className="p-5 bg-gray-900/40 rounded-xl border border-gray-800/50">
                <h3 className="font-bold text-white mb-2 text-lg">Solana & DeFi</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Explore Solana blockchain and DeFi concepts relevant to agent payments.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 md:p-10 bg-gradient-to-r from-blue-950/40 via-purple-950/40 to-indigo-950/40 rounded-2xl border border-blue-500/20 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Start Building</h2>
            <p className="text-base text-gray-300 mb-8 max-w-2xl mx-auto">
              Ready to implement automatic token swapping in your agents?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/developers"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
              >
                Get Started
              </Link>
              <Link
                href="/examples"
                className="px-6 py-3 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-xl font-semibold transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50 hover:scale-105"
              >
                View Examples
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
