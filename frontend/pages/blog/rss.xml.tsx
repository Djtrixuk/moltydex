/**
 * RSS Feed for Blog
 * Generates RSS XML feed for blog posts
 */

import { GetServerSideProps } from 'next';
import { blogPosts } from '../../lib/blog-posts';

export default function RSSFeed() {
  // This component is not rendered, GetServerSideProps handles the response
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = 'https://moltydex.com';

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MoltyDEX Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Guides, tutorials, and insights on x402 payments, automatic token swapping, and AI agent automation</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    ${blogPosts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${post.canonical}</link>
      <guid>${post.canonical}</guid>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${post.author}</author>
      <category>${post.category}</category>
      ${post.tags.map(tag => `<category>${tag}</category>`).join('')}
    </item>
    `).join('')}
  </channel>
</rss>`;

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.write(rss);
  res.end();

  return {
    props: {},
  };
};
