import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';
import '../styles/globals.css';
import '@solana/wallet-adapter-react-ui/styles.css';
import { OrganizationStructuredData, WebSiteStructuredData, ServiceStructuredData, PaymentServiceStructuredData } from '../components/StructuredData';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        
        {/* Primary Meta Tags */}
        <title>MoltyDEX - x402 Token Aggregator for AI Agents | Solana DEX</title>
        <meta name="title" content="MoltyDEX - x402 Token Aggregator for AI Agents | Solana DEX" />
        <meta name="description" content="Fast, free token swaps for humans and AI agents on Solana. Best prices across all DEXes via Jupiter aggregator. 0% fees - completely free. Swap any SPL token instantly. For humans: simple web interface. For agents: automatic x402 payments." />
        <meta name="keywords" content="Solana DEX, token swap, x402 protocol, AI agents, Jupiter aggregator, DeFi, SPL tokens, Solana swap, decentralized exchange, token aggregator, best price swap, Solana trading, AI agent payments, x402 payments, Solana DeFi, Raydium, Orca, Meteora, token exchange Solana" />
        <meta name="author" content="MoltyDEX" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="1 days" />
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="Worldwide" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://moltydex.com/" />
        <meta property="og:title" content="MoltyDEX - x402 Token Aggregator for AI Agents | Solana DEX" />
        <meta property="og:description" content="x402 Token Aggregator for Humans & AI Agents on Solana. Best prices, 0% fees, powered by Jupiter. Swap any SPL token with the best rates." />
        <meta property="og:image" content="https://moltydex.com/favicon.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="MoltyDEX Logo" />
        <meta property="og:site_name" content="MoltyDEX" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://moltydex.com/" />
        <meta name="twitter:title" content="MoltyDEX - x402 Token Aggregator for AI Agents" />
        <meta name="twitter:description" content="x402 Token Aggregator for Humans & AI Agents on Solana. Best prices, 0% fees, powered by Jupiter." />
        <meta name="twitter:image" content="https://moltydex.com/favicon.png" />
        <meta name="twitter:image:alt" content="MoltyDEX Logo" />
        <meta name="twitter:creator" content="@MoltyDEX" />
        <meta name="twitter:site" content="@MoltyDEX" />
        <meta name="twitter:card" content="summary_large_image" />
        
        {/* Additional SEO */}
        <meta name="theme-color" content="#111827" />
        <meta name="msapplication-TileColor" content="#111827" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="MoltyDEX" />
        <meta name="application-name" content="MoltyDEX" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://moltydex.com/" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://api.moltydex.com" />
        <link rel="preconnect" href="https://api.jup.ag" />
        <link rel="dns-prefetch" href="https://api.moltydex.com" />
        <link rel="dns-prefetch" href="https://api.jup.ag" />
        
        {/* Structured Data */}
        <OrganizationStructuredData />
        <WebSiteStructuredData />
        <ServiceStructuredData />
        <PaymentServiceStructuredData />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
