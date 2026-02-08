/**
 * Breadcrumb Component with Structured Data
 * Provides navigation context and SEO benefits
 */

import Link from 'next/link';
import { BreadcrumbStructuredData } from './StructuredData';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Always include home as first item
  const allItems = [
    { name: 'Home', href: '/' },
    ...items,
  ];

  // Convert href to url for structured data
  const structuredDataItems = allItems.map(item => ({
    name: item.name,
    url: `https://moltydex.com${item.href}`
  }));

  return (
    <>
      <BreadcrumbStructuredData items={structuredDataItems} />
      <nav aria-label="Breadcrumb" className="mb-4 md:mb-6">
        <ol className="flex items-center gap-2 text-sm text-gray-400 flex-wrap">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-2">
                {isLast ? (
                  <span className="text-white font-medium" aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link
                      href={item.href}
                      className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    >
                      {item.name}
                    </Link>
                    <span aria-hidden="true" className="text-gray-500">
                      /
                    </span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
