/**
 * Token Selector Component
 * Custom dropdown matching Jupiter's style with search and add token option
 */

import { useState, useRef, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { type Token, POPULAR_TOKENS, formatDisplayNumber } from '../utils/tokens';
import { useTokenBalance } from '../hooks/useTokenBalance';
import TokenLogo from './TokenLogo';

// Component to display individual token balance in the dropdown
// Uses batch balance fetching to avoid rate limiting
function TokenBalanceDisplay({ 
  token, 
  balanceCache,
  walletTokenBalance 
}: { 
  token: Token; 
  balanceCache?: { [key: string]: string | null };
  walletTokenBalance?: string; // Balance from wallet tokens API
}) {
  const { publicKey, connected } = useWallet();
  
  if (!connected || !publicKey) {
    return null;
  }
  
  // Priority: walletTokenBalance > balanceCache > individual fetch
  if (walletTokenBalance !== undefined) {
    return (
      <div className="text-right flex-shrink-0">
        <div className="text-white text-sm font-medium">
          {formatDisplayNumber(walletTokenBalance) || '0'}
        </div>
      </div>
    );
  }
  
  // Use cached balance if available
  const cachedBalance = balanceCache?.[token.address];
  
  if (cachedBalance !== undefined) {
    return (
      <div className="text-right flex-shrink-0">
        <div className="text-white text-sm font-medium">
          {formatDisplayNumber(cachedBalance) || '0'}
        </div>
      </div>
    );
  }
  
  // Fallback to individual fetch if cache not available
  const tokenBalance = useTokenBalance(token.address, token.decimals);
  
  // Don't show balance if there's an error (to avoid showing wrong data)
  if (tokenBalance.error) {
    return (
      <div className="text-right flex-shrink-0">
        <div className="text-gray-500 text-sm">—</div>
      </div>
    );
  }
  
  return (
    <div className="text-right flex-shrink-0">
      <div className="text-white text-sm font-medium">
        {tokenBalance.loading ? '…' : formatDisplayNumber(tokenBalance.balance) || '0'}
      </div>
    </div>
  );
}

interface TokenSelectorProps {
  tokens: Token[];
  selectedToken: Token;
  onSelect: (token: Token) => void;
  onAddCustomToken?: (token: Token) => void;
  balance?: string | null;
  balanceLoading?: boolean;
  balanceCache?: { [key: string]: string | null }; // Batch-fetched balances
  walletTokenBalances?: { [key: string]: string }; // Balances from wallet tokens API
}

export default function TokenSelector({
  tokens,
  selectedToken,
  onSelect,
  onAddCustomToken,
  balance,
  balanceLoading,
  balanceCache,
  walletTokenBalances,
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddToken, setShowAddToken] = useState(false);
  const [customAddressInput, setCustomAddressInput] = useState('');
  const [customTokenLoading, setCustomTokenLoading] = useState(false);
  const [customTokenError, setCustomTokenError] = useState<string | null>(null);
  const [favoritesUpdateTrigger, setFavoritesUpdateTrigger] = useState(0); // Force re-render when favorites change
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setShowAddToken(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Determine token category
  const getTokenCategory = (token: Token): 'stablecoin' | 'popular' | 'wallet' | 'custom' => {
    // Stablecoins
    const stablecoinAddresses = [
      'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
      'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
    ];
    if (stablecoinAddresses.includes(token.address)) {
      return 'stablecoin';
    }
    
    // Check if token is in popular tokens
    if (POPULAR_TOKENS.some((t: Token) => t.address === token.address)) {
      return 'popular';
    }
    
    // Check if token is from wallet (has balance in walletTokenBalances)
    if (walletTokenBalances && walletTokenBalances[token.address] !== undefined) {
      return 'wallet';
    }
    
    // Default to custom
    return 'custom';
  };

  // Get category label and styling
  const getCategoryTag = (category: 'stablecoin' | 'popular' | 'wallet' | 'custom') => {
    switch (category) {
      case 'stablecoin':
        return { label: 'Stablecoin', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      case 'popular':
        return { label: 'Popular', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
      case 'wallet':
        return { label: 'Your Tokens', className: 'bg-green-500/20 text-green-400 border-green-500/30' };
      default:
        return null;
    }
  };

  // Filter tokens based on search
  const filteredTokens = tokens.filter((token) => {
    const query = searchQuery.toLowerCase();
    return (
      token.symbol.toLowerCase().includes(query) ||
      token.name.toLowerCase().includes(query) ||
      token.address.toLowerCase().includes(query)
    );
  });

  // Recent tokens functionality
  const RECENT_TOKENS_KEY = 'moltydex_recent_tokens';
  const MAX_RECENT_TOKENS = 8;

  const getRecentTokens = (): Token[] => {
    try {
      const stored = localStorage.getItem(RECENT_TOKENS_KEY);
      if (!stored) return [];
      const addresses = JSON.parse(stored) as string[];
      // Find tokens from the provided tokens list that match recent addresses
      return addresses
        .map(addr => tokens.find(t => t.address.toLowerCase() === addr.toLowerCase()))
        .filter((t): t is Token => t !== undefined)
        .slice(0, MAX_RECENT_TOKENS);
    } catch {
      return [];
    }
  };

  const addToRecentTokens = (token: Token) => {
    try {
      const stored = localStorage.getItem(RECENT_TOKENS_KEY);
      const addresses = stored ? JSON.parse(stored) as string[] : [];
      // Remove if already exists
      const filtered = addresses.filter(addr => addr.toLowerCase() !== token.address.toLowerCase());
      // Add to front
      const updated = [token.address.toLowerCase(), ...filtered].slice(0, MAX_RECENT_TOKENS);
      localStorage.setItem(RECENT_TOKENS_KEY, JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  };

  // Favorites functionality
  const FAVORITES_KEY = 'moltydex_favorite_tokens';

  const getFavoriteTokens = (): Token[] => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (!stored) return [];
      const addresses = JSON.parse(stored) as string[];
      // Find tokens from the provided tokens list that match favorite addresses
      return addresses
        .map(addr => tokens.find(t => t.address.toLowerCase() === addr.toLowerCase()))
        .filter((t): t is Token => t !== undefined);
    } catch {
      return [];
    }
  };

  const isFavorite = (token: Token): boolean => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (!stored) return false;
      const addresses = JSON.parse(stored) as string[];
      return addresses.some(addr => addr.toLowerCase() === token.address.toLowerCase());
    } catch {
      return false;
    }
  };

  const toggleFavorite = (token: Token, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent token selection when clicking star
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      const addresses = stored ? JSON.parse(stored) as string[] : [];
      const tokenAddr = token.address.toLowerCase();
      const isCurrentlyFavorite = addresses.some(addr => addr.toLowerCase() === tokenAddr);
      
      if (isCurrentlyFavorite) {
        // Remove from favorites
        const updated = addresses.filter(addr => addr.toLowerCase() !== tokenAddr);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      } else {
        // Add to favorites
        const updated = [...addresses, tokenAddr];
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      }
      // Force re-render by updating state
      setFavoritesUpdateTrigger(prev => prev + 1);
    } catch {
      // Ignore localStorage errors
    }
  };

  const recentTokens = getRecentTokens();
  const recentTokenAddresses = new Set(recentTokens.map(t => t.address.toLowerCase()));
  const favoriteTokens = getFavoriteTokens();
  const favoriteTokenAddresses = new Set(favoriteTokens.map(t => t.address.toLowerCase()));

  const handleSelect = (token: Token) => {
    addToRecentTokens(token);
    onSelect(token);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleAddToken = async () => {
    const mint = searchQuery.trim();
    if (!mint) return;

    // Basic validation - Solana addresses are 32-44 characters
    if (mint.length < 32 || mint.length > 44) {
      setCustomTokenError('Invalid token address. Solana addresses are 32-44 characters.');
      return;
    }

    setCustomTokenError(null);
    setCustomTokenLoading(true);

    try {
      const { getTokenMetadata } = await import('../services/api');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.moltydex.com';
      const url = `${API_URL}/api/token?mint=${encodeURIComponent(mint)}`;
      
      const response = await fetch(url, {
        signal: AbortSignal.timeout(15000), // 15 second timeout
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(errorData.error || errorData.message || `API error: ${response.status}`);
      }

      const data = await response.json();

      const newToken: Token = {
        address: data.address || mint,
        decimals: data.decimals ?? 9, // Default to 9 if not provided
        symbol: data.symbol ?? 'Custom',
        name: data.name ?? `${mint.slice(0, 4)}...${mint.slice(-4)}`,
        logo: data.logo,
      };

      // Add to parent's token list if callback provided
      if (onAddCustomToken) {
        onAddCustomToken(newToken);
      }

      // Select the new token
      handleSelect(newToken);
      setCustomAddressInput('');
      setSearchQuery('');
      setShowAddToken(false);
    } catch (err) {
      let errorMessage = 'Failed to add token';
      if (err instanceof Error) {
        if (err.name === 'AbortError' || err.message.includes('timeout')) {
          errorMessage = 'Request timed out. The token might be valid but the API is slow. Try again.';
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          errorMessage = 'Network error. Check your connection and try again.';
        } else {
          errorMessage = err.message;
        }
      }
      setCustomTokenError(errorMessage);
      console.error('Token fetch error:', err);
    } finally {
      setCustomTokenLoading(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Token Selector Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-16 px-3 pr-8 bg-white/10 hover:bg-white/15 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30 text-base font-semibold transition-colors cursor-pointer min-w-[120px] max-w-[140px] flex items-center gap-2"
      >
        <TokenLogo token={selectedToken} size={32} />
        <span className="flex-1 text-left">{selectedToken.symbol}</span>
        <svg
          className="w-4 h-4 text-gray-400 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-[calc(100vw-2rem)] md:w-[448px] max-w-[448px] bg-gray-900 rounded-2xl border border-white/20 shadow-2xl z-[9999] max-h-[min(600px,calc(100vh-200px))] flex flex-col">
          {/* Search Bar */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowAddToken(e.target.value.length > 0);
                }}
                placeholder="Search token or paste address"
                className="w-full h-10 px-4 pl-10 bg-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                autoFocus
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setShowAddToken(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs"
                >
                  Esc
                </button>
              )}
            </div>
          </div>

          {/* Favorites Section (only when not searching) */}
          {!searchQuery && favoriteTokens.length > 0 && (
            <div className="p-3 border-b border-white/10">
              <div className="text-xs text-gray-400 mb-2 px-1">Favorites</div>
              <div className="space-y-1">
                {favoriteTokens.map((token) => {
                  const isSelected = token.address === selectedToken.address;
                  return (
                    <button
                      key={token.address}
                      type="button"
                      onClick={() => handleSelect(token)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-white/20 hover:bg-white/30 border border-white/20'
                          : 'hover:bg-white/10'
                      }`}
                    >
                      <TokenLogo token={token} size={24} />
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-medium text-sm">{token.symbol}</span>
                          {(() => {
                            const category = getTokenCategory(token);
                            const tag = getCategoryTag(category);
                            return tag ? (
                              <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded border ${tag.className}`}>
                                {tag.label}
                              </span>
                            ) : null;
                          })()}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(token, e)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title="Remove from favorites"
                      >
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                      {isSelected && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Tokens Section (only when not searching) */}
          {!searchQuery && recentTokens.length > 0 && (
            <div className="p-3 border-b border-white/10">
              <div className="text-xs text-gray-400 mb-2 px-1">Recent</div>
              <div className="space-y-1">
                {recentTokens
                  .filter(token => !favoriteTokenAddresses.has(token.address.toLowerCase())) // Exclude favorites from recent
                  .map((token) => {
                    const isSelected = token.address === selectedToken.address;
                    return (
                      <button
                        key={token.address}
                        type="button"
                        onClick={() => handleSelect(token)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isSelected
                            ? 'bg-white/20 hover:bg-white/30 border border-white/20'
                            : 'hover:bg-white/10'
                        }`}
                      >
                        <TokenLogo token={token} size={24} />
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white font-medium text-sm">{token.symbol}</span>
                            {(() => {
                              const category = getTokenCategory(token);
                              const tag = getCategoryTag(category);
                              return tag ? (
                                <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded border ${tag.className}`}>
                                  {tag.label}
                                </span>
                              ) : null;
                            })()}
                          </div>
                        </div>
                        {isSelected && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Add Custom Token Option (at top when searching) */}
          {showAddToken && searchQuery && (
            <div className="p-3 border-b border-white/10 bg-white/5">
              <button
                type="button"
                onClick={handleAddToken}
                disabled={customTokenLoading || !searchQuery.trim()}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 border-2 border-dashed border-white/30">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <div className="text-white font-medium text-sm">Add Custom Token</div>
                  <div className="text-gray-400 text-xs truncate">{searchQuery}</div>
                </div>
                {customTokenLoading && (
                  <div className="text-gray-400 text-xs">Loading...</div>
                )}
              </button>
              {customTokenError && (
                <p className="mt-2 text-xs text-red-400 px-3">{customTokenError}</p>
              )}
            </div>
          )}

          {/* Token List */}
          <div className="flex-1 overflow-y-auto">
            {filteredTokens.length === 0 && !showAddToken ? (
              <div className="p-4 text-center text-gray-400 text-sm">No tokens found</div>
            ) : (
              <div className="p-2">
                {filteredTokens
                  .filter(token => 
                    !recentTokenAddresses.has(token.address.toLowerCase()) && 
                    !favoriteTokenAddresses.has(token.address.toLowerCase()) // Exclude recent and favorites from main list
                  )
                  .map((token) => {
                    const isSelected = token.address === selectedToken.address;
                    const tokenIsFavorite = isFavorite(token);
                    return (
                      <button
                        key={token.address}
                        type="button"
                        onClick={() => handleSelect(token)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                          isSelected
                            ? 'bg-white/20 hover:bg-white/30 border border-white/20'
                            : 'hover:bg-white/10'
                        }`}
                      >
                        {/* Token Logo */}
                        <TokenLogo token={token} size={32} />

                        {/* Token Info */}
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white font-semibold text-sm">{token.symbol}</span>
                            {(() => {
                              const category = getTokenCategory(token);
                              const tag = getCategoryTag(category);
                              return tag ? (
                                <span className={`px-1.5 py-0.5 text-[9px] font-medium rounded border ${tag.className}`}>
                                  {tag.label}
                                </span>
                              ) : null;
                            })()}
                            {isSelected && (
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-gray-400 text-xs truncate">
                              {token.name} · {token.address.slice(0, 4)}...{token.address.slice(-4)}
                            </span>
                            <button
                              type="button"
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  await navigator.clipboard.writeText(token.address);
                                  const btn = e.currentTarget;
                                  const originalHTML = btn.innerHTML;
                                  btn.innerHTML = '<svg class="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>';
                                  setTimeout(() => {
                                    btn.innerHTML = originalHTML;
                                  }, 2000);
                                } catch (err) {
                                  console.error('Failed to copy:', err);
                                }
                              }}
                              className="p-0.5 hover:bg-white/10 rounded transition-colors flex-shrink-0"
                              title="Copy token address"
                            >
                              <svg className="w-3 h-3 text-gray-500 hover:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Favorite Star */}
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(token, e)}
                          className="p-1 hover:bg-white/10 rounded transition-colors flex-shrink-0"
                          title={tokenIsFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                          <svg 
                            className={`w-4 h-4 transition-colors ${
                              tokenIsFavorite ? 'text-yellow-400 fill-current' : 'text-gray-400'
                            }`} 
                            fill={tokenIsFavorite ? "currentColor" : "none"} 
                            stroke="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>

                        {/* Balance - use wallet balance, cached balance, or individual fetch */}
                        <TokenBalanceDisplay 
                          token={token} 
                          balanceCache={balanceCache}
                          walletTokenBalance={walletTokenBalances?.[token.address]}
                        />
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
