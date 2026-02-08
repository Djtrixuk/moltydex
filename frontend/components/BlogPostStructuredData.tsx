/**
 * Blog Post Structured Data (JSON-LD) for SEO
 * Provides rich snippets for blog posts
 */

interface BlogPostStructuredDataProps {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  image?: string;
  keywords?: string[];
}

export function BlogPostStructuredData({
  title,
  description,
  url,
  datePublished,
  dateModified,
  author,
  image = 'https://moltydex.com/moltydex-logo-full.png',
  keywords = [],
}: BlogPostStructuredDataProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "url": url,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Organization",
      "name": author,
      "url": "https://moltydex.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "MoltyDEX",
      "url": "https://moltydex.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://moltydex.com/moltydex-logo-full.png",
        "width": 1200,
        "height": 630
      }
    },
    "image": {
      "@type": "ImageObject",
      "url": image,
      "width": 1200,
      "height": 630
    },
    "keywords": keywords.join(", "),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": url
    },
    "articleSection": "Technology",
    "inLanguage": "en-US"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
