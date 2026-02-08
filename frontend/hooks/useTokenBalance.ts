/**
 * Hook for fetching token balance
 */

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getBalance } from '../services/api';
import { formatAmount, parseAmount } from '../utils/tokens';

interface UseTokenBalanceResult {
  balance: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch and manage token balance
 */
export function useTokenBalance(tokenAddress: string, decimals: number): UseTokenBalanceResult {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Reset balance to null while loading to show loading state
      setBalance(null);
      
      console.log('[useTokenBalance] Starting balance fetch:', {
        tokenAddress,
        wallet: publicKey.toString(),
        connected,
      });
      
      try {
        // For pump.fun tokens, try batch balance first (faster, already fetched)
        // Check if we can get it from window cache (set by wallet tokens fetch)
        const walletBalances = (window as any).__walletTokenBalances;
        if (walletBalances && walletBalances[tokenAddress.toLowerCase()]) {
          const cachedBalance = walletBalances[tokenAddress.toLowerCase()];
          if (!cancelled) {
            setBalance(cachedBalance);
            setLoading(false);
            console.log('[useTokenBalance] ✅ Used cached wallet balance:', cachedBalance);
            return;
          }
        }
        
        // Otherwise fetch individually
        // Add cache busting to ensure fresh data
        const data = await getBalance(publicKey.toString(), tokenAddress);
        
        if (cancelled) return;
        
        // Debug logging for all non-SOL tokens
        const isSOL = tokenAddress.toLowerCase() === 'so11111111111111111111111111111111111111112';
        if (!isSOL) {
          console.log('[useTokenBalance] Token balance response:', {
            tokenAddress,
            wallet: publicKey.toString(),
            rawBalance: data.balance,
            balance_sol: data.balance_sol,
            decimals: data.decimals,
            has_balance: data.has_balance,
            fullResponse: data,
          });
        }
        
        // Use decimals from API response (most accurate), fallback to prop
        const actualDecimals = data.decimals ?? decimals;
        
        let formattedBalance: string;
        if (data.balance_sol) {
          // For SOL, use balance_sol directly
          formattedBalance = parseFloat(data.balance_sol).toFixed(9).replace(/\.?0+$/, '');
        } else {
          // For SPL tokens, use the balance with correct decimals from API
          // The balance from API is in raw units (smallest denomination)
          const rawBalance = data.balance || '0';
          formattedBalance = formatAmount(rawBalance, actualDecimals);
          
          // Debug logging for formatting
          if (!isSOL) {
            console.log('[useTokenBalance] Token balance formatting:', {
              tokenAddress,
              rawBalance,
              actualDecimals,
              formattedBalance,
            });
          }
        }
        
        if (!cancelled) {
          console.log('[useTokenBalance] ✅ Setting balance:', {
            tokenAddress,
            formattedBalance,
            rawBalance: data.balance,
            decimals: actualDecimals,
          });
          setBalance(formattedBalance);
        } else {
          console.log('[useTokenBalance] ⚠️ Cancelled - not setting balance');
        }
      } catch (err) {
        if (cancelled) {
          console.log('[useTokenBalance] Request cancelled, not setting error');
          return;
        }
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch balance';
        const errorDetails = err instanceof Error ? {
          message: err.message,
          stack: err.stack,
          name: err.name,
        } : { raw: String(err) };
        
        console.error('[useTokenBalance] ❌ Error fetching balance:', {
          tokenAddress,
          wallet: publicKey?.toString(),
          error: errorDetails,
          errorMessage,
          isNetworkError: errorMessage.includes('fetch') || errorMessage.includes('network'),
          isApiError: errorMessage.includes('API') || errorMessage.includes('500') || errorMessage.includes('429'),
        });
        setError(errorMessage);
        // Don't set balance to '0' on error - keep it null so user knows it failed
        // setBalance('0'); // Removed - let UI show error state instead
      } finally {
        if (!cancelled) {
          setLoading(false);
          console.log('[useTokenBalance] Balance fetch completed:', {
            tokenAddress,
            loading: false,
            hasBalance: balance !== null,
            hasError: error !== null,
          });
        }
      }
    };

    fetchBalance();
    
    return () => {
      cancelled = true;
    };
  }, [publicKey, connected, tokenAddress, decimals]);

  return { balance, loading, error };
}
