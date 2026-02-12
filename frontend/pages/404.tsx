import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | MoltyDEX</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-6xl font-bold text-blue-500 mb-4">404</p>
          <h1 className="text-2xl font-semibold text-white mb-3">Page Not Found</h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Go to Swap
            </Link>
            <Link
              href="/docs"
              className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-colors border border-gray-700"
            >
              API Docs
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
