import Head from 'next/head';
import Link from 'next/link';
import PageHeader from '../components/PageHeader';
import Breadcrumbs from '../components/Breadcrumbs';
import { SoftwareApplicationStructuredData } from '../components/StructuredData';
import { useEffect, useState } from 'react';

export default function ApiDocs() {
  const [docsContent, setDocsContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const lastUpdated = "2026-02-08";

  useEffect(() => {
    // Fetch the markdown content
    fetch('/api-docs.md')
      .then(res => res.text())
      .then(text => {
        setDocsContent(text);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Head>
        <title>API Documentation - MoltyDEX | Complete API Reference</title>
        <meta name="description" content="Complete MoltyDEX API documentation. All endpoints, parameters, responses, and integration guides for the x402 payment aggregator." />
        <meta name="keywords" content="moltydex API, API documentation, x402 API, Solana DEX API, token swap API" />
        <link rel="canonical" href="https://moltydex.com/api-docs" />
        <meta name="dateModified" content={lastUpdated} />
      </Head>
      <SoftwareApplicationStructuredData />
      <PageHeader />
      <main className="min-h-screen bg-gray-950 text-white">
        <div className="container mx-auto px-4 py-6 md:py-12">
          <Breadcrumbs items={[{ name: 'API Documentation', href: '/api-docs' }]} />
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">API Documentation</h1>
            <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Complete API reference for MoltyDEX
            </p>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                <p className="text-gray-400 mt-4">Loading documentation...</p>
              </div>
            ) : docsContent ? (
              <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
                <pre className="whitespace-pre-wrap text-sm md:text-base text-gray-300 font-mono overflow-x-auto">
                  {docsContent}
                </pre>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
                <p className="text-gray-300 mb-4">
                  API documentation is available. Please visit the{' '}
                  <Link 
                    href="/api-docs" 
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    API documentation
                  </Link>
                  {' '}or check the{' '}
                  <Link href="/developers" className="text-blue-400 hover:text-blue-300 underline">
                    developers page
                  </Link>
                  {' '}for integration guides.
                </p>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="text-center mt-12 px-4">
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <Link href="/developers" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition text-center touch-manipulation min-h-[44px] flex items-center justify-center">
                Developer Guide
              </Link>
              <Link href="/examples" className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition text-center touch-manipulation min-h-[44px] flex items-center justify-center">
                Code Examples
              </Link>
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
