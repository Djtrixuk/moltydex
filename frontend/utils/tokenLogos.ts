/**
 * Token logo utilities
 * Fetches logos from Jupiter's token list API and backend API
 */

import { getKnownTokenLogo } from './popularTokenLogos';

const DEFAULT_API_URL = 'https://api.moltydex.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
const JUPITER_TOKEN_LIST = 'https://token.jup.ag/all'; // Use 'all' instead of 'strict' to get more tokens including pump.fun

// Cache for individual token logos
const logoCache = new Map<string, string | null>();
const pendingFetches = new Map<string, Promise<string | undefined>>();
let jupiterTokenListCache: Map<string, string> | null = null;
let jupiterTokenListLoading: Promise<Map<string, string>> | null = null;

/**
 * Fetch Jupiter's token list and cache logo URLs
 */
async function fetchJupiterTokenList(): Promise<Map<string, string>> {
  if (jupiterTokenListCache) {
    return jupiterTokenListCache;
  }

  if (jupiterTokenListLoading) {
    return jupiterTokenListLoading;
  }

  jupiterTokenListLoading = (async () => {
    try {
      const response = await fetch(JUPITER_TOKEN_LIST, {
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const tokens = await response.json();
      const logoMap = new Map<string, string>();
      
      tokens.forEach((token: { address: string; logoURI?: string }) => {
        if (token.logoURI) {
          logoMap.set(token.address.toLowerCase(), token.logoURI);
        }
      });
      
      jupiterTokenListCache = logoMap;
      return logoMap;
    } catch (err) {
      console.warn('Failed to fetch Jupiter token list:', err);
      return new Map();
    } finally {
      jupiterTokenListLoading = null;
    }
  })();

  return jupiterTokenListLoading;
}

/**
 * Get logo URL for a token address
 */
export async function getTokenLogo(address: string): Promise<string | undefined> {
  const addressLower = address.toLowerCase();
  
  // Check known logos first (fastest)
  const knownLogo = getKnownTokenLogo(address);
  if (knownLogo) {
    logoCache.set(addressLower, knownLogo);
    return knownLogo;
  }
  
  // Return cached result (including null for tokens without logos)
  if (logoCache.has(addressLower)) {
    return logoCache.get(addressLower) || undefined;
  }

  // If already fetching, return the pending promise
  if (pendingFetches.has(addressLower)) {
    return pendingFetches.get(addressLower);
  }

  // Start fetching
  const fetchPromise = (async () => {
    try {
      // First try Jupiter's token list (most reliable for well-known tokens)
      try {
        const jupiterList = await fetchJupiterTokenList();
        const jupiterLogo = jupiterList.get(addressLower);
        if (jupiterLogo) {
          logoCache.set(addressLower, jupiterLogo);
          console.log(`[getTokenLogo] ✅ Found logo in Jupiter list for ${address.slice(0, 8)}...`);
          return jupiterLogo;
        }
      } catch (err) {
        console.warn('Failed to fetch Jupiter token list for logo:', err);
        // Continue to backend API
      }

      // Fallback to backend API (which tries Jupiter + Metaplex)
      const url = `${API_URL}/api/token?mint=${encodeURIComponent(address)}`;
      const response = await fetch(url, {
        signal: AbortSignal.timeout(5000), // 5 second timeout (increased for pump.fun tokens)
      });
      
      if (response.ok) {
        const data = await response.json();
        const logo = data.logo || null;
        if (logo) {
          logoCache.set(addressLower, logo);
          console.log(`[getTokenLogo] ✅ Found logo from backend API for ${address.slice(0, 8)}...`);
          return logo;
        }
      }
      
      // No logo found
      console.warn(`[getTokenLogo] ⚠️ No logo found for ${address.slice(0, 8)}...`);
      logoCache.set(addressLower, null);
      return undefined;
    } catch (err) {
      console.warn(`[getTokenLogo] ❌ Error fetching logo for ${address.slice(0, 8)}...:`, err);
      // Cache null to prevent repeated failed fetches
      logoCache.set(addressLower, null);
      return undefined;
    } finally {
      // Remove from pending fetches
      pendingFetches.delete(addressLower);
    }
  })();

  pendingFetches.set(addressLower, fetchPromise);
  return fetchPromise;
}

/**
 * Preload logos for popular tokens
 */
export async function preloadPopularTokenLogos(tokens: Array<{ address: string }>) {
  // Fetch logos in parallel (but limit concurrency)
  const logoPromises = tokens.slice(0, 10).map((token) => getTokenLogo(token.address));
  await Promise.allSettled(logoPromises);
  
  // Preload images for successfully fetched logos
  tokens.forEach((token) => {
    const logo = logoCache.get(token.address.toLowerCase());
    if (logo) {
      const img = new Image();
      img.src = logo;
    }
  });
}
