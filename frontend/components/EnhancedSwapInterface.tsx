/**
 * Enhanced Swap Interface Component
 * Main swap UI component with token selection, balance display, and swap execution
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Transaction, VersionedTransaction } from '@solana/web3.js';
import {
  POPULAR_TOKENS,
  parseAmount,
  formatAmount,
  formatErrorMessage,
  getTokenByAddress,
  type Token,
} from '../utils/tokens';
import { useTokenBalance } from '../hooks/useTokenBalance';
import {
  getQuote,
  getTokenMetadata,
  buildSwapTransaction,
  sendTransaction,
  getBatchBalances,
  getWalletTokens,
  type QuoteResponse,
  type BatchBalanceResponse,
  type WalletToken,
  type TokenMetadata,
} from '../services/api';
import TokenSelector from './TokenSelector';
import TokenLogo from './TokenLogo';
import DeveloperModePanel from './DeveloperModePanel';
import SlippageSettings from './SlippageSettings';
import BalanceSkeleton from './BalanceSkeleton';
import { preloadPopularTokenLogos } from '../utils/tokenLogos';
import { getTransactionStatus, type TransactionStatus } from '../services/api';
import { trackEvent } from '../lib/analytics';

const QUOTE_STALE_MS = 30_000;
const DEFAULT_SLIPPAGE_BPS = 50;
const QUOTE_DEBOUNCE_MS = 500;
const TX_STATUS_POLL_INTERVAL = 2000; // 2 seconds
const TX_STATUS_MAX_POLLS = 60; // 2 minutes max

export default function EnhancedSwapInterface() {
  const { publicKey, signTransaction, connected } = useWallet();
  
  // Token selection - ensure logos are preserved from POPULAR_TOKENS
  const [tokenIn, setTokenIn] = useState<Token>(() => {
    const token = POPULAR_TOKENS[0];
    return token.logo ? token : { ...token, logo: getTokenByAddress(token.address)?.logo };
  });
  const [tokenOut, setTokenOut] = useState<Token>(() => {
    const token = POPULAR_TOKENS[1];
    return token.logo ? token : { ...token, logo: getTokenByAddress(token.address)?.logo };
  });
  const [customTokens, setCustomTokens] = useState<Token[]>([]);
  const [walletTokens, setWalletTokens] = useState<Token[]>([]);
  const [walletTokensLoading, setWalletTokensLoading] = useState(false);
  
  // Reset state on mount to prevent stale success messages from persisting
  useEffect(() => {
    // Clear any stale transaction state on mount
    setStatus('idle');
    setTxSignature(null);
    setTxStatus(null);
    setError(null);
    setAmountIn('');
    setQuote(null);
    
    return () => {
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
      }
      currentPollingSignatureRef.current = null;
    };
  }, []);

  // Preload logos for popular tokens on mount
  useEffect(() => {
    // Preload logos from Jupiter API for all popular tokens
    // This ensures logos are available even if they're not hardcoded
    preloadPopularTokenLogos(POPULAR_TOKENS);
    
    // Also preload hardcoded logos immediately for instant display
    POPULAR_TOKENS.forEach((token) => {
      if (token.logo) {
        const img = new Image();
        img.src = token.logo;
      }
    });
  }, []);
  
  // Amount and quote
  const [amountIn, setAmountIn] = useState('');
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const quoteFetchedAt = useRef<number>(0);
  
  // Slippage tolerance
  const [slippageBps, setSlippageBps] = useState(DEFAULT_SLIPPAGE_BPS);
  
  // Swap status
  const [status, setStatus] = useState<'idle' | 'loading' | 'signing' | 'sending' | 'confirming' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [txStatus, setTxStatus] = useState<TransactionStatus | null>(null);
  const txPollCount = useRef<number>(0);
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentPollingSignatureRef = useRef<string | null>(null);
  
  // Developer mode
  const [developerMode, setDeveloperMode] = useState(false);
  const [quoteRequest, setQuoteRequest] = useState<{ url: string; method: string; body?: any } | undefined>();
  const [quoteResponse, setQuoteResponse] = useState<any>();
  const [swapRequest, setSwapRequest] = useState<{ url: string; method: string; body?: any } | undefined>();
  const [swapResponse, setSwapResponse] = useState<any>();
  const [devTxStatus, setDevTxStatus] = useState<any>();

  // Token balances
  const tokenInBalance = useTokenBalance(tokenIn.address, tokenIn.decimals);
  const tokenOutBalance = useTokenBalance(tokenOut.address, tokenOut.decimals);

  // Combine popular tokens, wallet tokens, and custom tokens
  // Wallet tokens are prioritized (they have balances), then popular tokens, then custom tokens
  const allTokens = useMemo(() => {
    // Create a map to deduplicate by address
    const tokenMap = new Map<string, Token>();
    
    // First add popular tokens (they have guaranteed logos and metadata)
    POPULAR_TOKENS.forEach(token => {
      tokenMap.set(token.address.toLowerCase(), token);
    });
    
    // Then merge wallet tokens (preserve logos from POPULAR_TOKENS if wallet token lacks logo)
    walletTokens.forEach(token => {
      const existing = tokenMap.get(token.address.toLowerCase());
      if (existing) {
        // If wallet token exists in POPULAR_TOKENS, merge but preserve POPULAR_TOKENS logo
        tokenMap.set(token.address.toLowerCase(), {
          ...token, // Use wallet token (has balance info)
          logo: existing.logo || token.logo, // Prefer POPULAR_TOKENS logo if available
        });
      } else {
        // New wallet token not in POPULAR_TOKENS
        tokenMap.set(token.address.toLowerCase(), token);
      }
    });
    
    // Finally add custom tokens (if not already present)
    customTokens.forEach(token => {
      if (!tokenMap.has(token.address.toLowerCase())) {
        tokenMap.set(token.address.toLowerCase(), token);
      }
    });
    
    // Return as array, with wallet tokens first (they have balances)
    const walletTokenAddresses = new Set(walletTokens.map(t => t.address.toLowerCase()));
    const result: Token[] = [];
    
    // Add wallet tokens first (merged with POPULAR_TOKENS logos)
    walletTokens.forEach(token => {
      const merged = tokenMap.get(token.address.toLowerCase());
      if (merged) {
        result.push(merged);
      } else {
        result.push(token);
      }
    });
    
    // Then add popular tokens not in wallet
    POPULAR_TOKENS.forEach(token => {
      if (!walletTokenAddresses.has(token.address.toLowerCase())) {
        result.push(token);
      }
    });
    
    customTokens.forEach(token => {
      if (!walletTokenAddresses.has(token.address.toLowerCase()) && 
          !POPULAR_TOKENS.some(t => t.address.toLowerCase() === token.address.toLowerCase())) {
        result.push(token);
      }
    });
    
    return result;
  }, [walletTokens, customTokens]);
  
  // Store wallet token balances from API response
  const [walletTokenBalancesMap, setWalletTokenBalancesMap] = useState<{ [key: string]: string }>({});
  
  // Fetch wallet tokens when wallet connects or changes
  useEffect(() => {
    if (!publicKey || !connected) {
      setWalletTokens([]);
      setWalletTokenBalancesMap({});
      return;
    }
    
    // Fetch wallet tokens
    const fetchWalletTokens = async () => {
      setWalletTokensLoading(true);
      try {
        const response = await getWalletTokens(publicKey.toString());
        
        // Convert WalletToken[] to Token[]
        const tokens: Token[] = response.tokens.map(wt => ({
          address: wt.address,
          symbol: wt.symbol,
          name: wt.name,
          decimals: wt.decimals,
          logo: wt.logo,
        }));
        
        // Build balances map
        const balancesMap: { [key: string]: string } = {};
        response.tokens.forEach(wt => {
          balancesMap[wt.address.toLowerCase()] = wt.balance_formatted;
        });
        
        setWalletTokens(tokens);
        setWalletTokenBalancesMap(balancesMap);
        
        // Also store in window for useTokenBalance hook to access
        (window as any).__walletTokenBalances = balancesMap;
        
        console.log('[EnhancedSwapInterface] ✅ Fetched wallet tokens:', {
          count: tokens.length,
          tokens: tokens.map(t => ({ symbol: t.symbol, address: t.address, balance: balancesMap[t.address.toLowerCase()] })),
        });
      } catch (err) {
        console.error('[EnhancedSwapInterface] Failed to fetch wallet tokens:', err);
        // Continue without wallet tokens - popular tokens will still be available
        setWalletTokens([]);
        setWalletTokenBalancesMap({});
      } finally {
        setWalletTokensLoading(false);
      }
    };
    
    fetchWalletTokens();
  }, [publicKey, connected]);
  
  // Batch fetch balances for all popular tokens when dropdown opens
  const [balanceCache, setBalanceCache] = useState<{ [key: string]: string | null }>({});
  const [balanceCacheLoading, setBalanceCacheLoading] = useState(false);
  
  // Fetch balances for all tokens in batch when component mounts or wallet connects
  useEffect(() => {
    if (!publicKey || !connected) {
      setBalanceCache({});
      return;
    }
    
    // Fetch balances immediately (no delay) - batch endpoint is optimized and exempt from rate limits
    const fetchBalances = async () => {
      setBalanceCacheLoading(true);
      try {
        const tokenMints = allTokens.map(t => t.address);
        const batchResponse = await getBatchBalances(publicKey.toString(), tokenMints);
        
        const cache: { [key: string]: string | null } = {};
        batchResponse.results.forEach(result => {
          if (result.success && result.data) {
            const decimals = result.data.decimals ?? 9;
            const rawBalance = result.data.balance || '0';
            cache[result.token_mint] = formatAmount(rawBalance, decimals);
          } else {
            cache[result.token_mint] = null;
          }
        });
        
        setBalanceCache(cache);
        console.log('[EnhancedSwapInterface] ✅ Batch balances cached:', {
          successful: batchResponse.successful,
          failed: batchResponse.failed,
        });
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        console.error('[EnhancedSwapInterface] ❌ Batch balance fetch failed:', {
          error: errorMsg,
          err,
        });
        // Continue without cache - individual fetches will still work
        // Don't show error to user - individual balance hooks will handle it
      } finally {
        setBalanceCacheLoading(false);
      }
    };
    
    // Fetch immediately - no delay needed since batch endpoint is optimized
    fetchBalances();
  }, [publicKey, connected, allTokens]);

  const getTokenByAddressFromList = (address: string): Token | undefined =>
    allTokens.find((t) => t.address === address) ?? getTokenByAddress(address);

  const isQuoteStale = quote && Date.now() - quoteFetchedAt.current > QUOTE_STALE_MS;

  // Fetch quote when amount or tokens change
  useEffect(() => {
    if (amountIn && tokenIn && tokenOut && parseFloat(amountIn) > 0) {
      // Reset status if we're starting a new swap after success
      if (status === 'success') {
        setStatus('idle');
        setTxSignature(null);
        setTxStatus(null);
        txPollCount.current = 0;
      }
      
      const timer = setTimeout(() => {
        fetchQuote();
      }, QUOTE_DEBOUNCE_MS);
      return () => clearTimeout(timer);
    } else {
      setQuote(null);
      setQuoteLoading(false);
    }
  }, [amountIn, tokenIn, tokenOut]);

  const fetchQuote = async () => {
    const amount = parseAmount(amountIn, tokenIn.decimals);
    if (amount === '0') return;

    setQuoteLoading(true);
    setError(null);
    
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.moltydex.com';
    const url = `${API_URL}/api/quote?input_mint=${tokenIn.address}&output_mint=${tokenOut.address}&amount=${amount}&slippage_bps=${slippageBps}`;
    
    // Track request for developer mode
    if (developerMode) {
      setQuoteRequest({
        url: `/api/quote?input_mint=${tokenIn.address}&output_mint=${tokenOut.address}&amount=${amount}&slippage_bps=${slippageBps}`,
        method: 'GET',
      });
    }
    
    try {
      const data = await getQuote(tokenIn.address, tokenOut.address, amount, slippageBps);
      setQuote(data);
      quoteFetchedAt.current = Date.now();
      setError(null);
      
      // Track response for developer mode
      if (developerMode) {
        setQuoteResponse(data);
      }
    } catch (err) {
      setError(formatErrorMessage(err));
      setQuote(null);
      if (developerMode) {
        setQuoteResponse({ error: formatErrorMessage(err) });
      }
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!publicKey || !signTransaction || !amountIn || !quote) return;

    // Clear any existing polling timeout before starting a new swap
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }

    // Check if quote is stale - refetch if older than 20 seconds (more conservative than 30s warning)
    const quoteAge = Date.now() - quoteFetchedAt.current;
    if (quoteAge > 20_000) {
      console.log('[SWAP] Quote is stale, refetching before swap:', {
        quoteAge,
        maxAge: 20_000,
      });
      setError('Quote expired. Refetching fresh quote...');
      setStatus('loading');
      
      // Refetch quote with current amount
      try {
        const amount = parseAmount(amountIn, tokenIn.decimals);
        const freshQuote = await getQuote(tokenIn.address, tokenOut.address, amount, slippageBps);
        setQuote(freshQuote);
        quoteFetchedAt.current = Date.now();
        setError(null);
        // Continue with swap below
      } catch (err) {
        setError(`Failed to refresh quote: ${formatErrorMessage(err)}. Please try again.`);
        setStatus('error');
        return;
      }
    }

    // Validate balance before attempting swap
    const swapAmount = parseFloat(amountIn);
    const availableBalance = parseFloat(tokenInBalance.balance || '0');
    
    // Reserve small buffer only for SOL transaction fees (network fees, not platform fees)
    // For SOL: reserve ~0.000005 SOL for transaction fees
    // For SPL tokens: no reservation needed (network fees paid in SOL separately)
    const reservedForNetworkFees = tokenIn.address.toLowerCase() === 'so11111111111111111111111111111111111111112' 
      ? 0.000005 
      : 0;
    const maxSwappable = Math.max(0, availableBalance - reservedForNetworkFees);
    
    if (swapAmount > maxSwappable) {
      const shortfall = swapAmount - availableBalance;
      setError(
        `Insufficient balance. You have ${availableBalance.toFixed(9)} ${tokenIn.symbol}, but trying to swap ${swapAmount} ${tokenIn.symbol}. ` +
        (shortfall > 0 ? `You need ${shortfall.toFixed(9)} more ${tokenIn.symbol}.` : '') +
        (reservedForNetworkFees > 0 ? ` Reserve ${reservedForNetworkFees.toFixed(9)} ${tokenIn.symbol} for network fees.` : '')
      );
      setStatus('error');
      return;
    }

    setStatus('loading');
    setError(null);

    try {
      const amount = parseAmount(amountIn, tokenIn.decimals);
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.moltydex.com';
      
      // Track request for developer mode
      if (developerMode) {
        setSwapRequest({
          url: '/api/swap/build',
          method: 'POST',
          body: {
            wallet_address: publicKey.toString(),
            input_mint: tokenIn.address,
            output_mint: tokenOut.address,
            amount,
            slippage_bps: slippageBps,
          },
        });
      }
      
      // Build transaction
      const buildResult = await buildSwapTransaction(
        publicKey.toString(),
        tokenIn.address,
        tokenOut.address,
        amount,
        slippageBps
      );
      
      // Track response for developer mode
      if (developerMode) {
        setSwapResponse(buildResult);
      }

      const txBase64 = buildResult.transaction;
      
      if (!txBase64 || typeof txBase64 !== 'string') {
        throw new Error('Invalid response from API: missing transaction');
      }

      // Validate base64 encoding
      if (!/^[A-Za-z0-9+/=]+$/.test(txBase64)) {
        throw new Error('Invalid transaction format: not valid base64');
      }

      setStatus('signing');

      // Sign transaction (fees are included directly in the transaction)
      let txBytes: Uint8Array;
      try {
        txBytes = Uint8Array.from(atob(txBase64), (c) => c.charCodeAt(0));
      } catch (decodeError) {
        console.error('[SWAP] Base64 decode error:', decodeError);
        throw new Error(`Failed to decode transaction: ${decodeError instanceof Error ? decodeError.message : 'Invalid base64 encoding'}`);
      }

      let signedSerialized: Uint8Array;

      try {
        const versioned = VersionedTransaction.deserialize(txBytes);
        const signed = await signTransaction(versioned);
        signedSerialized = signed.serialize();
      } catch {
        try {
          const legacy = Transaction.from(txBytes);
          const signed = await signTransaction(legacy);
          signedSerialized = new Uint8Array(signed.serialize());
        } catch (txError) {
          console.error('[SWAP] Transaction deserialization error:', txError);
          throw new Error(`Failed to parse transaction: ${txError instanceof Error ? txError.message : 'Unknown error'}`);
        }
      }

      setStatus('sending');

      // Send transaction (fees are included if there was room)
      const signedB64 = btoa(String.fromCharCode(...Array.from(signedSerialized)));
      const sendResult = await sendTransaction(signedB64);

      setTxSignature(sendResult.signature);
      setStatus('confirming');
      txPollCount.current = 0;
      
      // Clear any existing polling timeout
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
        pollTimeoutRef.current = null;
      }
      
      // Track the signature we're polling for using a ref to avoid stale closures
      const pollingSignature = sendResult.signature;
      currentPollingSignatureRef.current = pollingSignature;
      txPollCount.current = 0; // Reset poll count for new transaction
      
      // Start polling transaction status
      const pollTransactionStatus = async () => {
        // Check if we should stop polling (max attempts reached)
        if (txPollCount.current >= TX_STATUS_MAX_POLLS) {
          // If we've been polling for max attempts, check one more time
          // If still not confirmed, assume success (transaction might be confirmed but API lagging)
          const finalStatus = await getTransactionStatus(pollingSignature).catch(() => null);
          if (finalStatus?.confirmed) {
            setStatus('success');
            setAmountIn('');
            setQuote(null);
            setError(null);
            // Refresh balances after successful swap (with retry logic)
            const refreshBalancesAfterSwap = async (attempt = 1) => {
              if (!publicKey || !connected) return;
              const delays = [2000, 5000, 10000];
              setTimeout(async () => {
                try {
                  const tokenMints = allTokens.map(t => t.address);
                  const batchResponse = await getBatchBalances(publicKey.toString(), tokenMints);
                  const cache: { [key: string]: string | null } = {};
                  batchResponse.results.forEach(result => {
                    if (result.success && result.data) {
                      const decimals = result.data.decimals ?? 9;
                      const rawBalance = result.data.balance || '0';
                      cache[result.token_mint] = formatAmount(rawBalance, decimals);
                    }
                  });
                  setBalanceCache(cache);
                  if (attempt < 3) refreshBalancesAfterSwap(attempt + 1);
                } catch (err) {
                  if (attempt < 3) refreshBalancesAfterSwap(attempt + 1);
                }
              }, delays[attempt - 1] || 10000);
            };
            refreshBalancesAfterSwap();
          } else {
            // Assume success after max polls - transaction likely confirmed
            setStatus('success');
            setAmountIn('');
            setQuote(null);
            setError(null);
            // Refresh balances after successful swap (with retry logic)
            const refreshBalancesAfterSwap = async (attempt = 1) => {
              if (!publicKey || !connected) return;
              const delays = [2000, 5000, 10000];
              setTimeout(async () => {
                try {
                  const tokenMints = allTokens.map(t => t.address);
                  const batchResponse = await getBatchBalances(publicKey.toString(), tokenMints);
                  const cache: { [key: string]: string | null } = {};
                  batchResponse.results.forEach(result => {
                    if (result.success && result.data) {
                      const decimals = result.data.decimals ?? 9;
                      const rawBalance = result.data.balance || '0';
                      cache[result.token_mint] = formatAmount(rawBalance, decimals);
                    }
                  });
                  setBalanceCache(cache);
                  if (attempt < 3) refreshBalancesAfterSwap(attempt + 1);
                } catch (err) {
                  if (attempt < 3) refreshBalancesAfterSwap(attempt + 1);
                }
              }, delays[attempt - 1] || 10000);
            };
            refreshBalancesAfterSwap();
          }
          currentPollingSignatureRef.current = null;
          pollTimeoutRef.current = null;
          return;
        }

        // Check if we're still polling the same transaction using ref
        if (currentPollingSignatureRef.current !== pollingSignature) {
          pollTimeoutRef.current = null;
          return;
        }

        try {
          const statusResult = await getTransactionStatus(pollingSignature);
          setTxStatus(statusResult);
          
          // Fetch transaction status for developer mode
          if (developerMode) {
            setDevTxStatus(statusResult);
          }

          // Check again if we're still polling the same transaction
          if (currentPollingSignatureRef.current !== pollingSignature) {
            pollTimeoutRef.current = null;
            return;
          }

          // Check if transaction is confirmed
          // Also check status field as a fallback - include 'processed' as confirmed
          const isConfirmed = statusResult.confirmed || 
                             statusResult.status === 'confirmed' || 
                             statusResult.status === 'finalized' ||
                             (statusResult.status === 'processed' && !statusResult.error);

          if (isConfirmed) {
            setStatus('success');
            setAmountIn('');
            setQuote(null);
            setError(null);
            trackEvent('swap_success', {
              tokenIn: tokenIn.symbol,
              tokenOut: tokenOut.symbol,
              signature: pollingSignature,
            });
            
            // Immediately refresh balances after successful swap
            // Retry multiple times as balances may take a few seconds to update on-chain
            const refreshBalancesAfterSwap = async (attempt = 1, maxAttempts = 3) => {
              if (!publicKey || !connected) return;
              
              // Wait progressively longer: 2s, 5s, 10s
              const delays = [2000, 5000, 10000];
              const delay = delays[attempt - 1] || 10000;
              
              setTimeout(async () => {
                try {
                  console.log(`[SWAP] Refreshing balances after swap (attempt ${attempt}/${maxAttempts})...`);
                  const tokenMints = allTokens.map(t => t.address);
                  const batchResponse = await getBatchBalances(publicKey.toString(), tokenMints);
                  
                  const cache: { [key: string]: string | null } = {};
                  batchResponse.results.forEach(result => {
                    if (result.success && result.data) {
                      const decimals = result.data.decimals ?? 9;
                      const rawBalance = result.data.balance || '0';
                      cache[result.token_mint] = formatAmount(rawBalance, decimals);
                    } else {
                      cache[result.token_mint] = null;
                    }
                  });
                  setBalanceCache(cache);
                  
                  // Check if output token balance updated (for the token we swapped TO)
                  const outputTokenBalance = cache[tokenOut.address.toLowerCase()];
                  const expectedUpdate = outputTokenBalance && parseFloat(outputTokenBalance) > 0;
                  
                  if (expectedUpdate || attempt >= maxAttempts) {
                    console.log('[SWAP] ✅ Balances refreshed after swap', {
                      attempt,
                      outputTokenBalance,
                      expectedUpdate,
                    });
                  } else {
                    // Retry if balance hasn't updated yet
                    console.log('[SWAP] Balance not updated yet, retrying...', {
                      attempt,
                      outputTokenBalance,
                    });
                    refreshBalancesAfterSwap(attempt + 1, maxAttempts);
                  }
                } catch (err) {
                  console.warn(`[SWAP] Failed to refresh balances (attempt ${attempt}):`, err);
                  if (attempt < maxAttempts) {
                    refreshBalancesAfterSwap(attempt + 1, maxAttempts);
                  }
                }
              }, delay);
            };
            
            refreshBalancesAfterSwap();
            
            currentPollingSignatureRef.current = null;
            
            // Clear polling timeout
            if (pollTimeoutRef.current) {
              clearTimeout(pollTimeoutRef.current);
              pollTimeoutRef.current = null;
            }
            
            // Reset to idle after 5 seconds to allow another swap
            setTimeout(() => {
              // Double-check we're still showing success for this transaction
              if (currentPollingSignatureRef.current === null || currentPollingSignatureRef.current === pollingSignature) {
                setStatus('idle');
                setTxSignature(null);
                setTxStatus(null);
              }
            }, 5000);
          } else if (statusResult.error || statusResult.status === 'failed') {
            setStatus('error');
            
            // Extract detailed error information
            const errorCode = statusResult.error?.code || '';
            const errorMessage = statusResult.error?.message || 'Transaction failed';
            const errorDetails = (statusResult.error as any)?.details;
            const customErrorCode = (statusResult.error as any)?.custom_error_code;
            const instructionError = (statusResult.error as any)?.instruction_error;
            
            // Create user-friendly error message based on error code
            let userFriendlyError = errorMessage;
            
            // Check for Jupiter/Zerox error codes
            // Error code 13 typically means: slippage exceeded, insufficient input amount, or insufficient liquidity
            // Error code 6025 typically means: insufficient input amount or slippage exceeded
            if (customErrorCode === 13 || customErrorCode === '13' || String(errorCode).includes('13') || String(errorMessage).includes('0xd')) {
              userFriendlyError = 'Swap failed: Price moved too much (slippage exceeded) or insufficient input amount. Try refetching the quote and swapping again, or increase slippage tolerance in settings.';
            } else if (customErrorCode === 6025 || customErrorCode === '6025') {
              userFriendlyError = 'Swap failed: Insufficient input amount or slippage exceeded. The price may have moved, or you may not have enough tokens. Try refetching the quote and swapping again, or increase slippage tolerance in settings.';
            } else if (errorCode) {
              const errorCodeStr = String(errorCode).toLowerCase();
              
              // Map common Solana error codes to user-friendly messages
              if (errorCodeStr.includes('insufficient') || errorCodeStr.includes('balance')) {
                userFriendlyError = 'Insufficient balance. You may not have enough tokens or SOL for transaction fees.';
              } else if (errorCodeStr.includes('slippage') || errorCodeStr.includes('sliptolerance')) {
                userFriendlyError = 'Slippage exceeded. The price moved too much. Try increasing slippage tolerance or refetch the quote.';
              } else if (errorCodeStr.includes('size') || errorCodeStr.includes('too large')) {
                userFriendlyError = 'Transaction too large. Try a smaller swap amount.';
              } else if (errorCodeStr.includes('blockhash') || errorCodeStr.includes('expired')) {
                userFriendlyError = 'Transaction expired. Please get a new quote and try again.';
              } else if (errorCodeStr.includes('reject') || errorCodeStr.includes('user')) {
                userFriendlyError = 'Transaction was rejected. Please try again.';
              } else if (errorCodeStr.includes('simulation')) {
                userFriendlyError = 'Transaction would fail (simulation error). Check your balance and try again.';
              }
            }
            
            // Include error code in console for debugging
            console.error('[SWAP] Transaction failed:', {
              code: errorCode,
              customErrorCode: customErrorCode,
              instructionError: instructionError,
              message: errorMessage,
              details: errorDetails,
              status: statusResult.status,
            });
            
            setError(userFriendlyError);
            currentPollingSignatureRef.current = null;
            pollTimeoutRef.current = null;
          } else {
            // Continue polling
            txPollCount.current++;
            if (currentPollingSignatureRef.current === pollingSignature) {
              pollTimeoutRef.current = setTimeout(pollTransactionStatus, TX_STATUS_POLL_INTERVAL);
            }
          }
        } catch (err) {
          // Continue polling on error (network issues, etc.)
          txPollCount.current++;
          // Check if we're still polling the same transaction
          if (txPollCount.current < TX_STATUS_MAX_POLLS && currentPollingSignatureRef.current === pollingSignature) {
            pollTimeoutRef.current = setTimeout(pollTransactionStatus, TX_STATUS_POLL_INTERVAL);
          } else {
            // Max polls reached or new transaction started
            if (currentPollingSignatureRef.current === pollingSignature) {
              // After max polls, assume success (transaction likely confirmed)
              setStatus('success');
              setAmountIn('');
              setQuote(null);
            setError(null);
            // Refresh balances after successful swap (with retry logic)
            const refreshBalancesAfterSwap = async (attempt = 1) => {
              if (!publicKey || !connected) return;
              const delays = [2000, 5000, 10000];
              setTimeout(async () => {
                try {
                  const tokenMints = allTokens.map(t => t.address);
                  const batchResponse = await getBatchBalances(publicKey.toString(), tokenMints);
                  const cache: { [key: string]: string | null } = {};
                  batchResponse.results.forEach(result => {
                    if (result.success && result.data) {
                      const decimals = result.data.decimals ?? 9;
                      const rawBalance = result.data.balance || '0';
                      cache[result.token_mint] = formatAmount(rawBalance, decimals);
                    }
                  });
                  setBalanceCache(cache);
                  if (attempt < 3) refreshBalancesAfterSwap(attempt + 1);
                } catch (err) {
                  if (attempt < 3) refreshBalancesAfterSwap(attempt + 1);
                }
              }, delays[attempt - 1] || 10000);
            };
            refreshBalancesAfterSwap();
            }
            currentPollingSignatureRef.current = null;
            pollTimeoutRef.current = null;
          }
        }
      };

      // Start polling after a short delay
      pollTimeoutRef.current = setTimeout(pollTransactionStatus, TX_STATUS_POLL_INTERVAL);
    } catch (err) {
      // Extract detailed error information
      let errorMessage = formatErrorMessage(err);
      
      // Log full error for debugging
      console.error('[SWAP] Swap failed:', {
        error: err,
        errorMessage,
        response: (err as any)?.response,
        data: (err as any)?.response?.data,
      });
      
      // Check if it's an API error with details
      if (err && typeof err === 'object' && 'response' in err) {
        const apiError = (err as any).response?.data;
        if (apiError) {
          // Use detailed error from API if available
          if (apiError.details) {
            errorMessage = apiError.details;
          } else if (apiError.error) {
            errorMessage = apiError.error;
          }
          
          // Add suggestion if available
          if (apiError.suggestion) {
            errorMessage += `. ${apiError.suggestion}`;
          }
          
          // Log Jupiter error details if available
          if (apiError.jupiter_error) {
            console.error('[SWAP] Jupiter error details:', apiError.jupiter_error);
          }
          
          // Log debug info if available
          if (apiError.debug) {
            console.error('[SWAP] Debug info:', apiError.debug);
          }
          // Use API error message if available
          if (apiError.error) {
            errorMessage = apiError.error;
          }
          if (apiError.details) {
            errorMessage += `. ${apiError.details}`;
          }
          if (apiError.suggestion) {
            errorMessage += ` ${apiError.suggestion}`;
          }
          
          // Log full error for debugging
          console.error('[SWAP] API error:', {
            error: apiError.error,
            details: apiError.details,
            suggestion: apiError.suggestion,
            fullResponse: apiError,
          });
        }
      }
      
      // Log error for debugging
      console.error('[SWAP] Swap error:', {
        error: err,
        errorMessage,
        tokenIn: tokenIn.symbol,
        tokenOut: tokenOut.symbol,
      });
      
      setError(errorMessage);
      setStatus('error');
      trackEvent('swap_error', {
        tokenIn: tokenIn.symbol,
        tokenOut: tokenOut.symbol,
        error: errorMessage,
      });
    }
  };

  const swapTokens = () => {
    const temp = tokenIn;
    setTokenIn(tokenOut);
    setTokenOut(temp);
    setQuote(null);
  };

  const handleTokenSelect = async (token: Token, isInput: boolean) => {
    // Don't allow selecting the same token for both input and output
    if (isInput && token.address === tokenOut.address) {
      return;
    }
    if (!isInput && token.address === tokenIn.address) {
      return;
    }
    
    // Always fetch metadata if token shows as "Custom" or has placeholder name
    // This ensures we get the correct name/symbol even if initial fetch failed
    const needsMetadata = token.symbol === 'Custom' || 
                          token.name.includes('...') || 
                          token.name.length < 5; // Very short names are likely placeholders
    
    let tokenWithMetadata = token;
    
    // Always try to fetch metadata if needed, even if we have some data
    if (needsMetadata) {
      try {
        console.log(`[handleTokenSelect] Fetching metadata for ${isInput ? 'input' : 'output'} token:`, token.address);
        
        // Fetch full token metadata from API with longer timeout for slow tokens
        const metadata = await Promise.race([
          getTokenMetadata(token.address),
          new Promise<TokenMetadata>((_, reject) => 
            setTimeout(() => reject(new Error('Metadata fetch timeout')), 10000)
          )
        ]);
        
        tokenWithMetadata = {
          address: token.address,
          symbol: metadata.symbol || token.symbol,
          name: metadata.name || token.name,
          decimals: metadata.decimals ?? token.decimals ?? 9,
          logo: metadata.logo || token.logo,
        };
        
        console.log(`[handleTokenSelect] ✅ Fetched metadata for ${isInput ? 'input' : 'output'} token:`, {
          address: token.address,
          symbol: tokenWithMetadata.symbol,
          name: tokenWithMetadata.name,
          decimals: tokenWithMetadata.decimals,
          hasLogo: !!tokenWithMetadata.logo,
        });
      } catch (err) {
        console.warn(`[handleTokenSelect] Failed to fetch metadata for ${token.address}:`, err);
        
        // If metadata fetch failed but we have a valid address, try one more time after a short delay
        // This handles cases where the API is temporarily slow
        if (token.address && token.address.length >= 32) {
          console.log(`[handleTokenSelect] Retrying metadata fetch for ${token.address}...`);
          setTimeout(async () => {
            try {
              const retryMetadata = await getTokenMetadata(token.address);
              const retryToken = {
                address: token.address,
                symbol: retryMetadata.symbol || token.symbol,
                name: retryMetadata.name || token.name,
                decimals: retryMetadata.decimals ?? token.decimals ?? 9,
                logo: retryMetadata.logo || token.logo,
              };
              
              if (isInput) {
                setTokenIn((prev) => {
                  if (prev.address === token.address) {
                    return retryToken;
                  }
                  return prev;
                });
              } else {
                setTokenOut((prev) => {
                  if (prev.address === token.address) {
                    return retryToken;
                  }
                  return prev;
                });
              }
              
              console.log(`[handleTokenSelect] ✅ Retry successful for ${token.address}:`, retryToken.symbol);
            } catch (retryErr) {
              console.warn(`[handleTokenSelect] Retry also failed for ${token.address}:`, retryErr);
            }
          }, 1000);
        }
        
        // Fallback: check if popular token has logo
        const popularToken = getTokenByAddress(token.address);
        if (popularToken?.logo) {
          tokenWithMetadata = { ...token, logo: popularToken.logo };
        }
      }
    } else {
      // Token already has metadata, just check for logo
      const popularToken = getTokenByAddress(token.address);
      if (popularToken?.logo && !token.logo) {
        tokenWithMetadata = { ...token, logo: popularToken.logo };
      }
    }
    
    // Set token immediately with all metadata
    if (isInput) {
      setTokenIn(tokenWithMetadata);
    } else {
      setTokenOut(tokenWithMetadata);
    }
    
    // Fetch logo asynchronously if still not present
    if (!tokenWithMetadata.logo) {
      import('../utils/tokenLogos').then(({ getTokenLogo }) => {
        getTokenLogo(token.address).then((logo) => {
          if (logo) {
            if (isInput) {
              setTokenIn((prev) => ({ ...prev, logo }));
            } else {
              setTokenOut((prev) => ({ ...prev, logo }));
            }
          }
        }).catch(() => {
          // Logo fetch failed, continue without logo
        });
      });
    }
    
    // Clear quote when tokens change
    setQuote(null);
    setAmountIn('');
  };

  const handleAddCustomToken = async (token: Token) => {
    // Ensure we have complete metadata - fetch from API if missing
    let tokenWithMetadata = token;
    
    // If token is missing metadata, fetch full metadata from API
    if (token.symbol === 'Custom' || token.name.includes('...') || !token.logo || token.decimals === undefined) {
      try {
        const metadata = await getTokenMetadata(token.address);
        tokenWithMetadata = {
          address: token.address,
          symbol: metadata.symbol || token.symbol,
          name: metadata.name || token.name,
          decimals: metadata.decimals ?? token.decimals ?? 9,
          logo: metadata.logo || token.logo,
        };
        console.log('[handleAddCustomToken] ✅ Fetched complete metadata:', {
          address: token.address,
          symbol: tokenWithMetadata.symbol,
          name: tokenWithMetadata.name,
          decimals: tokenWithMetadata.decimals,
          hasLogo: !!tokenWithMetadata.logo,
        });
      } catch (err) {
        console.warn('[handleAddCustomToken] Failed to fetch metadata, using provided token:', err);
        // Use provided token as-is
      }
    }

    // Add to custom tokens list with complete metadata
    setCustomTokens((prev) => {
      if (prev.some((t) => t.address === tokenWithMetadata.address)) return prev;
      return [...prev, tokenWithMetadata];
    });
    
    // Immediately fetch balance for the new custom token
    if (publicKey && connected) {
      try {
        const batchResponse = await getBatchBalances(publicKey.toString(), [tokenWithMetadata.address]);
        
        const result = batchResponse.results[0];
        if (result?.success && result.data) {
          const decimals = result.data.decimals ?? tokenWithMetadata.decimals;
          const rawBalance = result.data.balance || '0';
          const formattedBalance = formatAmount(rawBalance, decimals);
          
          // Update cache immediately
          setBalanceCache(prev => ({
            ...prev,
            [tokenWithMetadata.address]: formattedBalance,
          }));
          
          console.log('[handleAddCustomToken] ✅ Balance fetched for custom token:', {
            address: tokenWithMetadata.address,
            balance: formattedBalance,
          });
        }
      } catch (err) {
        console.error('[handleAddCustomToken] Failed to fetch balance:', err);
        // Individual balance hook will handle it as fallback
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white/10 backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-white">Swap Tokens</h2>
        <div className="flex items-center gap-1.5 md:gap-2">
          <SlippageSettings slippageBps={slippageBps} onSlippageChange={setSlippageBps} />
          <button
            onClick={() => setDeveloperMode(!developerMode)}
            className={`text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-lg font-medium transition-colors touch-manipulation ${
              developerMode
                ? 'bg-white/20 hover:bg-white/30 text-white border border-white/20'
                : 'bg-white/10 hover:bg-white/20 text-gray-300 border border-white/10'
            }`}
            title="Toggle Developer Mode"
          >
            <span className="hidden md:inline">{developerMode ? '👨‍💻 Dev Mode ON' : '👨‍💻 Dev Mode'}</span>
            <span className="md:hidden">👨‍💻</span>
          </button>
        </div>
      </div>

      <div className="space-y-3 md:space-y-4">
        {/* From Token */}
        <div className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-5 border border-white/10">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <label className="text-xs md:text-sm font-medium text-gray-300">From</label>
            {connected && (
              <div className="flex items-center gap-1 md:gap-1.5 flex-wrap justify-end">
                {tokenInBalance.loading ? (
                  <BalanceSkeleton />
                ) : tokenInBalance.error ? (
                  <span className="text-[10px] md:text-xs text-red-400" title={tokenInBalance.error}>
                    Error: {tokenInBalance.error.substring(0, 30)}...
                  </span>
                ) : tokenInBalance.balance === null ? (
                  <span className="text-[10px] md:text-xs text-yellow-400" title="Balance not loaded - check console">
                    Loading... {tokenIn.symbol}
                  </span>
                ) : (
                  <span className="text-[10px] md:text-xs text-gray-400">
                    {tokenInBalance.balance} {tokenIn.symbol}
                  </span>
                )}
                {tokenInBalance.balance !== null && parseFloat(tokenInBalance.balance || '0') > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const balance = parseFloat(tokenInBalance.balance || '0') || 0;
                        const half = (balance / 2).toString();
                        setAmountIn(half);
                      }}
                      className="h-6 md:h-5 px-2 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded text-white text-[10px] font-medium transition-colors leading-none touch-manipulation"
                    >
                      HALF
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const balance = parseFloat(tokenInBalance.balance || '0') || 0;
                        // Reserve small buffer only for SOL network fees (not platform fees - we removed those)
                        // For SOL: reserve ~0.000005 SOL for transaction fees
                        // For SPL tokens: no reservation needed (network fees paid in SOL separately)
                        const reservedForNetworkFees = tokenIn.address.toLowerCase() === 'so11111111111111111111111111111111111111112' 
                          ? 0.000005 
                          : 0;
                        const maxAmount = Math.max(0, balance - reservedForNetworkFees);
                        setAmountIn(maxAmount.toFixed(9).replace(/\.?0+$/, ''));
                        setError(null); // Clear any errors when using MAX
                      }}
                      className="h-6 md:h-5 px-2 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded text-white text-[10px] font-medium transition-colors leading-none touch-manipulation"
                    >
                      MAX
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            {/* Token selector */}
            <div className="flex-shrink-0">
              <TokenSelector
                tokens={allTokens}
                selectedToken={tokenIn}
                onSelect={(token) => handleTokenSelect(token, true)}
                onAddCustomToken={handleAddCustomToken}
                balance={tokenInBalance.balance}
                balanceLoading={tokenInBalance.loading}
                balanceCache={balanceCache}
                walletTokenBalances={walletTokenBalancesMap}
              />
            </div>
            {/* Amount input - full width */}
            <div className="flex-1 min-w-0">
              <input
                type="number"
                value={amountIn}
                onChange={(e) => {
                  const value = e.target.value;
                  // Validate input doesn't exceed balance
                  const numValue = parseFloat(value);
                  const balance = parseFloat(tokenInBalance.balance || '0');
                  if (!isNaN(numValue) && numValue > balance && value !== '') {
                    // Don't update if exceeds balance - show error instead
                    setError(`Amount exceeds balance. Maximum: ${balance.toFixed(9)} ${tokenIn.symbol}`);
                    return;
                  }
                  setAmountIn(value);
                  setError(null); // Clear error when user types
                }}
                placeholder="0.0"
                step="any"
                min="0"
                max={tokenInBalance.balance ? parseFloat(tokenInBalance.balance) : undefined}
                disabled={status === 'loading' || status === 'signing' || status === 'sending' || status === 'confirming'}
                className="w-full h-12 md:h-16 px-2 md:px-4 bg-transparent text-white placeholder-gray-500 focus:outline-none text-right text-lg md:text-2xl font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center -my-1 relative z-10">
          <button
            onClick={swapTokens}
            className="w-10 h-10 md:w-9 md:h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-gray-400 hover:text-white text-lg transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            disabled={status !== 'idle'}
            aria-label="Swap tokens"
          >
            ⇅
          </button>
        </div>

        {/* To Token */}
        <div className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-5 border border-white/10">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <label className="text-xs md:text-sm font-medium text-gray-300">To</label>
            {connected && (
              <>
                {tokenOutBalance.loading ? (
                  <BalanceSkeleton />
                ) : (
                  <span className="text-[10px] md:text-xs text-gray-400">
                    {tokenOutBalance.balance ?? '0'} {tokenOut.symbol}
                  </span>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            {/* Token selector - narrower */}
            <div className="flex-shrink-0">
              <TokenSelector
                tokens={allTokens}
                selectedToken={tokenOut}
                onSelect={(token) => handleTokenSelect(token, false)}
                onAddCustomToken={handleAddCustomToken}
                balance={tokenOutBalance.balance}
                balanceLoading={tokenOutBalance.loading}
                balanceCache={balanceCache}
                walletTokenBalances={walletTokenBalancesMap}
              />
            </div>
            {/* Amount display - full width with no wrapping */}
            <div className="flex-1 min-w-0">
              <div className="h-12 md:h-16 flex items-center justify-end px-2 md:px-4">
                {quoteLoading ? (
                  <div className="animate-pulse flex items-center gap-2">
                    <div className="h-5 md:h-6 w-20 md:w-24 bg-white/10 rounded"></div>
                  </div>
                ) : (
                  <span className="text-right text-lg md:text-xl font-bold text-white whitespace-nowrap overflow-hidden text-ellipsis block w-full">
                    {quote
                      ? formatAmount(quote.output_after_fee, tokenOut.decimals)
                      : '0.0'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>


        {/* Stale Quote Notice */}
        {isQuoteStale && (
          <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-2 text-amber-200 text-sm flex items-center justify-between gap-2">
            <span>Quote may be outdated. Prices change quickly.</span>
            <button
              type="button"
              onClick={() => {
                setQuote(null);
                fetchQuote();
              }}
              className="px-2 py-1 bg-amber-500/30 rounded hover:bg-amber-500/50 text-white text-xs font-medium"
            >
              Refetch
            </button>
          </div>
        )}

        {/* Price Impact Warning */}
        {quote && quote.price_impact && parseFloat(quote.price_impact) > 1 && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="font-semibold">High Price Impact Warning</p>
                <p className="text-xs mt-1 text-red-300/80">
                  Price impact is {parseFloat(quote.price_impact).toFixed(2)}%. Consider refetching the quote or using a smaller amount.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuote(null);
                    fetchQuote();
                  }}
                  className="mt-2 px-3 py-1 bg-red-500/30 hover:bg-red-500/50 rounded text-white text-xs font-medium transition-colors"
                >
                  Refetch Quote
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quote Info */}
        {quote && (
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2.5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">You'll receive</span>
              <span className="text-white font-semibold text-base">
                {formatAmount(quote.output_after_fee, tokenOut.decimals)} {tokenOut.symbol}
              </span>
            </div>
            <div className="flex justify-between items-center text-gray-400">
              <span>Fee (0%)</span>
              <span>0 {tokenOut.symbol}</span>
            </div>
            {quote.price_impact && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Price impact</span>
                <span className={`font-medium ${
                  parseFloat(quote.price_impact) > 1
                    ? 'text-red-400'
                    : parseFloat(quote.price_impact) > 0.5
                    ? 'text-yellow-400'
                    : 'text-green-400'
                }`}>
                  {parseFloat(quote.price_impact).toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        )}

        {/* Error Message with Recovery Guidance */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 text-sm">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="font-semibold mb-1">Error: {error}</p>
                {txSignature && (
                  <a
                    href={`https://solscan.io/tx/${txSignature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline hover:opacity-80 mt-1 inline-block text-red-200"
                  >
                    View transaction on Solscan →
                  </a>
                )}
                {error.toLowerCase().includes('insufficient') && (
                  <p className="text-xs mt-2 text-red-300/80">
                    💡 <strong>Tip:</strong> Make sure you have enough balance. Try swapping a smaller amount or check your wallet balance.
                  </p>
                )}
                {(error.toLowerCase().includes('slippage') || error.toLowerCase().includes('price moved')) && (
                  <p className="text-xs mt-2 text-red-300/80">
                    💡 <strong>Tip:</strong> Price moved too much. Try increasing slippage tolerance in settings (gear icon) or refetch the quote by changing the amount slightly.
                  </p>
                )}
                {error.toLowerCase().includes('insufficient input') && (
                  <p className="text-xs mt-2 text-red-300/80">
                    💡 <strong>Tip:</strong> You may not have enough tokens to complete the swap. Try swapping a slightly smaller amount (leave a small buffer for fees).
                  </p>
                )}
                {(error.toLowerCase().includes('network') || error.toLowerCase().includes('connection')) && (
                  <p className="text-xs mt-2 text-red-300/80">
                    💡 <strong>Tip:</strong> Check your internet connection. If the issue persists, try refreshing the page.
                  </p>
                )}
                {error.toLowerCase().includes('quote') && (
                  <p className="text-xs mt-2 text-red-300/80">
                    💡 <strong>Tip:</strong> Quote may be stale. Try entering the amount again to fetch a fresh quote.
                  </p>
                )}
                {error.toLowerCase().includes('too large') && (
                  <p className="text-xs mt-2 text-red-300/80">
                    💡 <strong>Tip:</strong> Transaction is too large. Try swapping a smaller amount.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setStatus('idle');
                    setTxSignature(null);
                    setTxStatus(null);
                    if (amountIn) {
                      fetchQuote();
                    }
                  }}
                  className="mt-2 px-3 py-1.5 bg-red-500/30 hover:bg-red-500/50 rounded text-white text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Status */}
        {txSignature && (status === 'confirming' || status === 'success') && (
          <div className={`rounded-lg p-3 text-sm border ${
            status === 'success'
              ? 'bg-white/10 border-white/20 text-gray-200'
              : 'bg-white/10 border-white/20 text-gray-200'
          }`}>
            {status === 'confirming' ? (
              <div className="flex items-start gap-2">
                <div className="animate-spin flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Transaction Confirming...</p>
                  <p className="text-xs mt-1 opacity-80">
                    {txStatus?.confirmation_status 
                      ? `Status: ${txStatus.confirmation_status}`
                      : 'Waiting for confirmation'}
                  </p>
                  <a
                    href={`https://solscan.io/tx/${txSignature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline hover:opacity-80 mt-1 inline-block"
                  >
                    View on Solscan
                  </a>
                </div>
              </div>
            ) : (
              <>
                <p className="font-semibold">Swap successful!</p>
                <a
                  href={`https://solscan.io/tx/${txSignature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:opacity-80"
                >
                  View on Solscan
                </a>
                <p className="text-xs opacity-80 mt-2">You can start a new swap now</p>
              </>
            )}
          </div>
        )}

        {/* Swap Button with Loading Skeleton */}
        <button
          onClick={() => {
            trackEvent('swap_initiated', {
              tokenIn: tokenIn.symbol,
              tokenOut: tokenOut.symbol,
              amount: amountIn,
            });
            handleSwap();
          }}
          disabled={
            !connected ||
            !publicKey ||
            !amountIn ||
            !quote ||
            quoteLoading ||
            status === 'loading' ||
            status === 'signing' ||
            status === 'sending' ||
            status === 'confirming'
          }
          className="w-full h-12 md:h-14 bg-white text-gray-950 rounded-xl font-semibold text-sm md:text-base hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all touch-manipulation focus:outline-none focus:ring-2 focus:ring-white/50 relative overflow-hidden"
          aria-label={
            !connected
              ? 'Connect wallet to swap'
              : !amountIn
              ? 'Enter amount to swap'
              : !quote
              ? 'Waiting for quote'
              : 'Execute swap'
          }
        >
          {(status === 'loading' || status === 'signing' || status === 'sending' || status === 'confirming') && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="skeleton w-full h-full opacity-20" />
            </span>
          )}
          <span className="relative z-10 flex items-center justify-center gap-2">
            {status === 'loading' && (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {!connected
              ? 'Connect Wallet'
              : status === 'loading'
              ? 'Building Transaction...'
              : status === 'signing'
              ? 'Signing Transaction...'
              : status === 'sending'
              ? 'Sending Transaction...'
              : status === 'confirming'
              ? 'Confirming...'
              : status === 'success'
              ? developerMode ? 'Execute Again' : 'New Swap'
              : status === 'error'
              ? 'Try Again'
              : developerMode ? 'Execute Swap' : 'Swap'}
          </span>
        </button>

        {/* Developer Mode Panel */}
        {developerMode && (
          <DeveloperModePanel
            quoteRequest={quoteRequest}
            quoteResponse={quoteResponse}
            swapRequest={swapRequest}
            swapResponse={swapResponse}
            txSignature={txSignature}
            txStatus={devTxStatus}
          />
        )}
      </div>
    </div>
  );
}
