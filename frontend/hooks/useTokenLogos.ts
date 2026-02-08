/**
 * Hook to fetch and cache token logos
 */

import { useState, useEffect } from 'react';
import { getTokenLogo } from '../utils/tokenLogos';
import { type Token } from '../utils/tokens';

/**
 * Hook to get logo URL for a token
 */
export function useTokenLogo(token: Token): string | undefined {
  const [logo, setLogo] = useState<string | undefined>(token.logo);

  useEffect(() => {
    // If token already has logo, use it
    if (token.logo) {
      setLogo(token.logo);
      return;
    }

    // Otherwise, fetch from Jupiter's token list
    getTokenLogo(token.address).then((logoUrl) => {
      if (logoUrl) {
        setLogo(logoUrl);
      }
    });
  }, [token.address, token.logo]);

  return logo;
}
