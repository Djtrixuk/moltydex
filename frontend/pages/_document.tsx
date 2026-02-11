import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://api.moltydex.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.jup.ag" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.moltydex.com" />
        <link rel="dns-prefetch" href="https://api.jup.ag" />
        
        {/* Preload site logo used in header/nav for faster LCP */}
        <link rel="preload" href="/moltydex-icon.png" as="image" type="image/png" />
        
        {/* Additional meta tags that should be in document */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
