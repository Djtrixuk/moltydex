/**
 * Balance Cache Context
 * Fetches all token balances in a single batch request to avoid rate limiting
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getBatchBalances, type BatchBalanceResponse } from '../services/api';
import { POPULAR_TOKENS } from '../utils/tokens';
import { formatAmount } from '../utils/tokens';

interface BalanceCache {
  [tokenMint: string]: {
    balance: string;
    decimals: number;
    loading: boolean;
    error: string | null;
    fetchedAt: number;
  };
}

interface BalanceCacheContextValue {
  balances: BalanceCache;
  refreshBalances: () => Promise<void>;
  getBalance: (tokenMint: string) => string | null;
  isLoading: boolean;
}

const BalanceCacheContext = createContext<BalanceCacheContextValue | null>(null);

export function BalanceCacheProvider({ children }: { children: React.ReactNode }) {
  const { publicKey, connected } = useWallet();
  const [balances, setBalances] = useState<BalanceCache>({});
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<number>(0);

  // Get all token addresses from popular tokens
  const allTokenMints = POPULAR_TOKENS.map(t => t.address);

  const refreshBalances = useCallback(async () => {
    if (!publicKey || !connected) {
      setBalances({});
      return;
    }

    setIsLoading(true);
    
    // Initialize all tokens as loading
    const loadingBalances: BalanceCache = {};
    allTokenMints.forEach(mint => {
      loadingBalances[mint] = {
        balance: '0',
        decimals: 9,
        loading: true,
        error: null,
        fetchedAt: Date.now(),
      };
    });
    setBalances(loadingBalances);

    try {
      console.log('[BalanceCache] Fetching batch balances for', allTokenMints.length, 'tokens');
      const batchResponse = await getBatchBalances(publicKey.toString(), allTokenMints);
      
      const newBalances: BalanceCache = {};
      
      batchResponse.results.forEach(result => {
        if (result.success && result.data) {
          const data = result.data;
          const decimals = data.decimals ?? 9;
          const rawBalance = data.balance || '0';
          const formattedBalance = formatAmount(rawBalance, decimals);
          
          newBalances[result.token_mint] = {
            balance: formattedBalance,
            decimals,
            loading: false,
            error: null,
            fetchedAt: Date.now(),
          };
        } else {
          newBalances[result.token_mint] = {
            balance: '0',
            decimals: 9,
            loading: false,
            error: result.error || 'Failed to fetch balance',
            fetchedAt: Date.now(),
          };
        }
      });
      
      setBalances(newBalances);
      setLastFetch(Date.now());
      console.log('[BalanceCache] ✅ Batch balances fetched:', {
        successful: batchResponse.successful,
        failed: batchResponse.failed,
      });
    } catch (err) {
      console.error('[BalanceCache] ❌ Batch balance fetch failed:', err);
      // Set all balances to error state
      const errorBalances: BalanceCache = {};
      allTokenMints.forEach(mint => {
        errorBalances[mint] = {
          balance: '0',
          decimals: 9,
          loading: false,
          error: err instanceof Error ? err.message : 'Failed to fetch balances',
          fetchedAt: Date.now(),
        };
      });
      setBalances(errorBalances);
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, connected, allTokenMints.join(',')]);

  // Fetch balances on mount and when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      refreshBalances();
    } else {
      setBalances({});
    }
  }, [connected, publicKey, refreshBalances]);

  // Refresh balances every 30 seconds if connected
  useEffect(() => {
    if (!connected || !publicKey) return;

    const interval = setInterval(() => {
      const timeSinceLastFetch = Date.now() - lastFetch;
      // Only refresh if it's been more than 30 seconds
      if (timeSinceLastFetch > 30000) {
        refreshBalances();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [connected, publicKey, lastFetch, refreshBalances]);

  const getBalance = useCallback((tokenMint: string): string | null => {
    const balance = balances[tokenMint];
    if (!balance) return null;
    if (balance.error) return null;
    return balance.balance;
  }, [balances]);

  return (
    <BalanceCacheContext.Provider value={{ balances, refreshBalances, getBalance, isLoading }}>
      {children}
    </BalanceCacheContext.Provider>
  );
}

export function useBalanceCache() {
  const context = useContext(BalanceCacheContext);
  if (!context) {
    throw new Error('useBalanceCache must be used within BalanceCacheProvider');
  }
  return context;
}
