/**
 * Individual Blog Post Page
 * Dynamic route for blog posts
 */

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getBlogPost, blogPosts } from '../../lib/blog-posts';
import PageHeader from '../../components/PageHeader';
import Breadcrumbs from '../../components/Breadcrumbs';
import { BlogPostStructuredData } from '../../components/BlogPostStructuredData';
import { AuthorStructuredData } from '../../components/StructuredData';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const post = slug ? getBlogPost(slug as string) : undefined;

  useEffect(() => {
    if (post) {
      // Load markdown content from public directory or API
      fetch(`/blog-content/${post.slug}.md`)
        .then(res => res.text())
        .then(text => {
          // Extract content after frontmatter
          const contentWithoutFrontmatter = text.replace(/^---[\s\S]*?---\n\n/, '');
          setContent(contentWithoutFrontmatter);
          setLoading(false);
        })
        .catch(() => {
          // Fallback: use description as content
          setContent(`# ${post.title}\n\n${post.description}`);
          setLoading(false);
        });
    }
  }, [post]);

  if (!post) {
    return (
      <>
        <PageHeader />
        <main className="min-h-screen bg-gray-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold mb-4 text-white">Post Not Found</h1>
            <Link href="/blog" className="text-blue-400 hover:text-blue-300 hover:underline">
              ← Back to Blog
            </Link>
          </div>
        </main>
      </>
    );
  }

  // Find related posts
  const relatedPosts = blogPosts
    .filter(p => p.slug !== post.slug && (p.category === post.category || p.tags.some(t => post.tags.includes(t))))
    .slice(0, 3);

  return (
    <>
      <Head>
        <title>{post.title} | MoltyDEX Blog</title>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={post.keywords.join(', ')} />
        <link rel="canonical" href={post.canonical} />
        
        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={post.canonical} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content="https://moltydex.com/moltydex-logo-full.png" />
        <meta property="og:site_name" content="MoltyDEX" />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={post.category} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
        <meta name="twitter:image" content="https://moltydex.com/moltydex-logo-full.png" />
      </Head>

        <BlogPostStructuredData
          title={post.title}
          description={post.description}
          url={post.canonical}
          datePublished={post.date}
          dateModified={post.dateModified || post.date}
          author={post.author}
          keywords={post.keywords}
        />
        <AuthorStructuredData name={post.author} />

      <PageHeader
        title={post.title}
        subtitle={post.description}
      />

      <main className="min-h-screen bg-gray-950 text-white">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Breadcrumbs items={[
            { name: 'Blog', href: '/blog' },
            { name: post.title, href: `/blog/${post.slug}` }
          ]} />
          {/* Post Meta */}
          <div className="mb-8 pb-8 border-b border-gray-800">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span>{post.author}</span>
              <span>•</span>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span>•</span>
              <span>{post.category}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Post Content */}
          <div className="prose prose-lg prose-invert max-w-none prose-headings:font-bold prose-headings:text-white prose-h1:text-4xl prose-h1:mt-8 prose-h1:mb-4 prose-h2:text-3xl prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-2xl prose-h3:mt-4 prose-h3:mb-2 prose-p:mb-4 prose-p:leading-relaxed prose-p:text-gray-300 prose-ul:list-disc prose-ul:list-inside prose-ul:mb-4 prose-ul:space-y-2 prose-ol:list-decimal prose-ol:list-inside prose-ol:mb-4 prose-ol:space-y-2 prose-li:ml-4 prose-li:text-gray-300 prose-code:bg-gray-800 prose-code:text-gray-200 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-a:text-blue-400 prose-a:hover:text-blue-300 prose-a:hover:underline prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:my-4 prose-blockquote:text-gray-300 prose-strong:text-white">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-800 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-800 rounded w-full mb-4"></div>
                <div className="h-4 bg-gray-800 rounded w-5/6"></div>
              </div>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-3xl font-bold mt-6 mb-3" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-2xl font-semibold mt-4 mb-2" {...props} />,
                p: ({ node, ...props }) => <p className="mb-4 leading-relaxed" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                li: ({ node, ...props }) => <li className="ml-4" {...props} />,
                code: ({ node, inline, className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline ? (
                    <code className="block bg-gray-800 text-gray-200 p-4 rounded-lg overflow-x-auto text-sm border border-gray-700" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className="bg-gray-800 text-gray-200 px-2 py-1 rounded text-sm" {...props}>
                      {children}
                    </code>
                  );
                },
                a: ({ node, ...props }: any) => (
                  <a className="text-blue-400 hover:text-blue-300 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-300" {...props} />
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-4">
                    <table className="min-w-full divide-y divide-gray-800" {...props} />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th className="px-4 py-2 bg-gray-800 font-semibold text-left text-white" {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className="px-4 py-2 border-t border-gray-800 text-gray-300" {...props} />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-white">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="block p-4 bg-gray-900/60 border border-gray-800/50 rounded-lg hover:border-blue-500/50 transition-all"
                  >
                    <h3 className="font-semibold mb-2 text-white">{relatedPost.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {relatedPost.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-800 flex justify-between">
            <Link
              href="/blog"
              className="text-blue-400 hover:text-blue-300 hover:underline"
            >
              ← Back to Blog
            </Link>
          <Link
            href="/developers"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Get Started with MoltyDEX
          </Link>
          </div>
        </article>
      </main>
    </>
  );
}
