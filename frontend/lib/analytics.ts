/**
 * Analytics helper for tracking user events
 * Lightweight, privacy-focused event tracking
 */

type EventName = 
  | 'wallet_connect'
  | 'wallet_disconnect'
  | 'swap_initiated'
  | 'swap_success'
  | 'swap_error'
  | 'docs_link_clicked'
  | 'api_docs_viewed'
  | 'example_code_copied'
  | 'token_selected'
  | 'slippage_changed'
  | 'developer_mode_toggled';

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Track an event (can be extended with Plausible, GA4, or custom analytics)
 */
export function trackEvent(eventName: EventName, properties?: EventProperties) {
  // Only track in production or when explicitly enabled
  if (typeof window === 'undefined') return;
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', eventName, properties);
  }

  // Plausible Analytics (privacy-focused, GDPR compliant)
  if (typeof window !== 'undefined' && (window as any).plausible) {
    (window as any).plausible(eventName, { props: properties });
  }

  // Google Analytics 4 (if configured)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties);
  }

  // Custom analytics endpoint - send to our API
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.moltydex.com';
  fetch(`${API_URL}/api/analytics/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      type: eventName === 'swap_success' ? 'swap' : eventName === 'swap_error' ? 'swap' : 'api_call',
      data: {
        ...properties,
        endpoint: eventName,
        timestamp: new Date().toISOString(),
      },
    }),
  }).catch(() => {
    // Silently fail - analytics should never break the app
  });
}

/**
 * Track page view (for SPA navigation)
 */
export function trackPageView(path: string) {
  if (typeof window === 'undefined') return;

  // Plausible
  if ((window as any).plausible) {
    (window as any).plausible('pageview', { url: path });
  }

  // GA4
  if ((window as any).gtag) {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: path,
    });
  }
}
