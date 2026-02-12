/**
 * Hook for fetching token balance
 */

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getBalance } from '../services/api';
import { formatAmount } from '../utils/tokens';

interface UseTokenBalanceResult {
  balance: string | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Hook to fetch and manage token balance.
 * Call `refresh()` to force a re-fetch (e.g. after a swap).
 */
export function useTokenBalance(tokenAddress: string, decimals: number): UseTokenBalanceResult {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey(k => k + 1);

  useEffect(() => {
    if (!publicKey || !connected) {
      setBalance(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    const fetchBalance = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check window cache first (set by wallet tokens fetch / post-swap refresh)
        const walletBalances = (window as any).__walletTokenBalances;
        if (walletBalances && walletBalances[tokenAddress.toLowerCase()] !== undefined) {
          const cachedBalance = walletBalances[tokenAddress.toLowerCase()];
          if (!cancelled) {
            setBalance(cachedBalance);
            setLoading(false);
            return;
          }
        }
        
        // Otherwise fetch individually
        const data = await getBalance(publicKey.toString(), tokenAddress);
        
        if (cancelled) return;
        
        // Use decimals from API response (most accurate), fallback to prop
        const actualDecimals = data.decimals ?? decimals;
        
        let formattedBalance: string;
        if (data.balance_sol) {
          formattedBalance = parseFloat(data.balance_sol).toFixed(9).replace(/\.?0+$/, '');
        } else {
          const rawBalance = data.balance || '0';
          formattedBalance = formatAmount(rawBalance, actualDecimals);
        }
        
        if (!cancelled) {
          setBalance(formattedBalance);
        }
      } catch (err) {
        if (cancelled) return;
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch balance';
        console.error('[useTokenBalance] Error:', tokenAddress, errorMessage);
        setError(errorMessage);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBalance();
    
    return () => {
      cancelled = true;
    };
  }, [publicKey, connected, tokenAddress, decimals, refreshKey]);

  return { balance, loading, error, refresh };
}
