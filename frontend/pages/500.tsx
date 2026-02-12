import Head from 'next/head';
import Link from 'next/link';

export default function Custom500() {
  return (
    <>
      <Head>
        <title>500 - Server Error | MoltyDEX</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-6xl font-bold text-red-500 mb-4">500</p>
          <h1 className="text-2xl font-semibold text-white mb-3">Server Error</h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Something went wrong on our end. Your funds are safe &mdash; this is a display issue only.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Reload Page
            </button>
            <Link
              href="/"
              className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-colors border border-gray-700"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
