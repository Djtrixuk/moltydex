/**
 * Token Selector Component
 * Custom dropdown matching Jupiter's style with search and add token option
 */

import { useState, useRef, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { type Token } from '../utils/tokens';
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
          {walletTokenBalance || '0'}
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
          {cachedBalance || '0'}
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
        {tokenBalance.loading ? '…' : tokenBalance.balance || '0'}
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

  // Filter tokens based on search
  const filteredTokens = tokens.filter((token) => {
    const query = searchQuery.toLowerCase();
    return (
      token.symbol.toLowerCase().includes(query) ||
      token.name.toLowerCase().includes(query) ||
      token.address.toLowerCase().includes(query)
    );
  });

  const handleSelect = (token: Token) => {
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
        <div className="absolute top-full left-0 mt-3 w-[448px] bg-gray-900 rounded-2xl border border-white/20 shadow-2xl z-50 max-h-[700px] flex flex-col">
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
                {filteredTokens.map((token) => {
                  const isSelected = token.address === selectedToken.address;
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
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold text-sm">{token.symbol}</span>
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
                        <div className="text-gray-400 text-xs truncate">
                          {token.name} · {token.address.slice(0, 4)}...{token.address.slice(-4)}
                        </div>
                      </div>

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
