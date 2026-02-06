/**
 * Token Logo Component
 * Displays token logo with fallback to initials
 */

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { type Token } from '../utils/tokens';
import { getTokenLogo } from '../utils/tokenLogos';

interface TokenLogoProps {
  token: Token;
  size?: number;
  className?: string;
}

export default function TokenLogo({ token, size = 32, className = '' }: TokenLogoProps) {
  const [imageError, setImageError] = useState(false);
  // If token has logo, start with loading false so it shows immediately
  const [imageLoading, setImageLoading] = useState(!token.logo);
  // Initialize with token.logo immediately if available
  const [logoUrl, setLogoUrl] = useState<string | undefined>(token.logo);

  // Fetch logo from backend API if not already present
  useEffect(() => {
    setImageError(false);
    
    // If token already has logo, use it immediately and show it right away
    if (token.logo) {
      setLogoUrl(token.logo);
      // Don't set loading to true - show image immediately
      // The onLoad handler will handle when it's fully loaded
      return;
    }

    // Otherwise fetch from known logos or API
    setImageLoading(true);
    getTokenLogo(token.address)
      .then((logo) => {
        if (logo) {
          setLogoUrl(logo);
          setImageLoading(false);
        } else {
          setImageLoading(false);
        }
      })
      .catch(() => {
        setImageLoading(false);
      });
  }, [token.address, token.logo]);

  // Fallback to initials if no logo or image fails to load
  const showFallback = !logoUrl || imageError;

  return (
    <div
      className={`rounded-full flex items-center justify-center flex-shrink-0 bg-white/10 relative ${className}`}
      style={{ width: size, height: size }}
    >
      {showFallback ? (
        <span
          className="text-white text-xs font-semibold"
          style={{ fontSize: size * 0.4 }}
        >
          {token.symbol.slice(0, 2).toUpperCase()}
        </span>
      ) : (
        <>
          {/* Show initials as placeholder only if image is loading AND we don't have a logo URL yet */}
          {imageLoading && !logoUrl && (
            <span
              className="text-white text-xs font-semibold absolute opacity-50"
              style={{ fontSize: size * 0.4 }}
            >
              {token.symbol.slice(0, 2).toUpperCase()}
            </span>
          )}
          {/* Show image immediately if we have a URL */}
          {logoUrl && (
            <Image
              src={logoUrl}
              alt={`${token.symbol} logo`}
              width={size}
              height={size}
              className="w-full h-full rounded-full object-cover"
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
              onLoad={() => {
                setImageLoading(false);
              }}
              unoptimized={true}
            />
          )}
        </>
      )}
    </div>
  );
}
