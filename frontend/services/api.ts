/**
 * API service layer
 * Centralized API calls for the frontend
 */

const DEFAULT_API_URL = 'https://api.moltydex.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

export interface QuoteResponse {
  output_after_fee: string;
  output_amount: string;
  fee_amount: string;
  fee_bps: number;
  price_impact?: string;
}

export interface BalanceResponse {
  wallet_address: string;
  token_mint: string;
  balance: string;
  balance_sol?: string;
  decimals: number;
  has_balance?: boolean;
  error?: string;
}

export interface TokenMetadata {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  logo?: string;
}

export interface SwapBuildResponse {
  transaction: string;
  fee_amount: string;
  output_amount: string;
  output_after_fee: string;
  fee_bps: number;
  fee_collected?: boolean;
  fee_in_same_transaction?: boolean; // Always true - fees are only in main transaction
  fee_wallet?: string;
  is_versioned?: boolean;
  instructions?: string;
}

export interface TransactionSendResponse {
  signature: string;
}

export interface TransactionStatus {
  signature: string;
  status: string;
  confirmed: boolean;
  confirmation_status?: string;
  slot?: number;
  error?: {
    code: string;
    message: string;
  };
  transaction_details?: any;
  timestamp?: string;
}

/**
 * Parse API response, handling HTML error pages
 */
async function parseApiResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  
  if (!response.ok) {
    let errorMessage: string;
    try {
      const json = JSON.parse(text);
      errorMessage = json.error || json.message || text;
      if (json.suggestion) errorMessage += `. ${json.suggestion}`;
      if (json.details) errorMessage += `. ${json.details}`;
    } catch {
      if (text.trimStart().startsWith('<')) {
        errorMessage = `API at ${API_URL} returned a page instead of JSON. Is the API running? For local dev set NEXT_PUBLIC_API_URL=http://localhost:3002 in frontend/.env.local`;
      } else {
        errorMessage = text || `API error: ${response.status}`;
      }
    }
    throw new Error(errorMessage);
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    if (text.trimStart().startsWith('<')) {
      throw new Error(`API at ${API_URL} returned a page instead of JSON. Is the API running?`);
    }
    throw new Error('Invalid API response');
  }
}

/**
 * Fetch with retry logic for server errors
 */
async function fetchWithRetry(url: string, options?: RequestInit, maxRetries = 1): Promise<Response> {
  let response = await fetch(url, options);
  
  if (!response.ok && response.status >= 500 && maxRetries > 0) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    response = await fetch(url, options);
  }
  
  return response;
}

/**
 * Get swap quote
 */
export async function getQuote(
  inputMint: string,
  outputMint: string,
  amount: string,
  slippageBps = 50
): Promise<QuoteResponse> {
  const url = `${API_URL}/api/quote?input_mint=${inputMint}&output_mint=${outputMint}&amount=${amount}&slippage_bps=${slippageBps}`;
  const response = await fetchWithRetry(url);
  return parseApiResponse<QuoteResponse>(response);
}

/**
 * Get token balance (single)
 */
export async function getBalance(walletAddress: string, tokenMint: string): Promise<BalanceResponse> {
  // Add cache busting to ensure fresh data
  const cacheBuster = Date.now();
  const url = `${API_URL}/api/balance?wallet_address=${walletAddress}&token_mint=${tokenMint}&_=${cacheBuster}`;
  
  console.log('[getBalance] Fetching balance:', {
    walletAddress,
    tokenMint,
    url,
  });
  
  const controller = new AbortController();
  // Increased timeout to 30 seconds for pump.fun tokens which can be slower
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
  
  try {
    const response = await fetch(url, {
      cache: 'no-store', // Prevent browser caching
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    // Check if response is rate limited
    if (response.status === 429) {
      const errorText = await response.text();
      console.error('[getBalance] Rate limit error:', {
        walletAddress,
        tokenMint,
        status: response.status,
        error: errorText,
      });
      throw new Error(`Rate limit exceeded: ${errorText}`);
    }
    
    const data = await parseApiResponse<BalanceResponse>(response);
    
    console.log('[getBalance] Balance response:', {
      walletAddress,
      tokenMint,
      balance: data.balance,
      decimals: data.decimals,
      has_balance: data.has_balance,
    });
    
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Balance request timed out after 30 seconds');
    }
    throw err;
  }
}

/**
 * Batch balance response interface
 */
export interface BatchBalanceResult {
  token_mint: string;
  success: boolean;
  data?: BalanceResponse;
  error?: string;
}

export interface BatchBalanceResponse {
  wallet_address: string;
  results: BatchBalanceResult[];
  total: number;
  successful: number;
  failed: number;
}

/**
 * Get multiple token balances in one request (optimized - single RPC call)
 * This avoids rate limiting issues when fetching multiple balances
 */
export async function getBatchBalances(
  walletAddress: string,
  tokenMints: string[]
): Promise<BatchBalanceResponse> {
  const url = `${API_URL}/api/batch/balance`;
  
  console.log('[getBatchBalances] Fetching batch balances:', {
    walletAddress,
    tokenMints,
    count: tokenMints.length,
  });
  
  // Add timeout and retry logic
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet_address: walletAddress,
        token_mints: tokenMints,
      }),
      cache: 'no-store',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    const data = await parseApiResponse<BatchBalanceResponse>(response);
    
    console.log('[getBatchBalances] Batch balance response:', {
      walletAddress,
      total: data.total,
      successful: data.successful,
      failed: data.failed,
    });
    
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Batch balance request timed out after 15 seconds');
    }
    throw err;
  }
}

/**
 * Get token metadata
 */
export async function getTokenMetadata(mint: string): Promise<TokenMetadata> {
  const url = `${API_URL}/api/token?mint=${encodeURIComponent(mint)}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: 'no-store', // Always fetch fresh metadata
    });
    
    clearTimeout(timeoutId);
    return parseApiResponse<TokenMetadata>(response);
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Token metadata request timed out after 15 seconds');
    }
    throw err;
  }
}

export interface WalletToken {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  balance_formatted: string;
  logo?: string;
  has_balance: boolean;
}

export interface WalletTokensResponse {
  wallet_address: string;
  tokens: WalletToken[];
  count: number;
}

/**
 * Get all tokens owned by a wallet
 */
export async function getWalletTokens(walletAddress: string): Promise<WalletTokensResponse> {
  const url = `${API_URL}/api/wallet/tokens?wallet_address=${encodeURIComponent(walletAddress)}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: 'no-store',
    });
    
    clearTimeout(timeoutId);
    return parseApiResponse<WalletTokensResponse>(response);
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Wallet tokens request timed out after 20 seconds');
    }
    throw err;
  }
}

/**
 * Build swap transaction
 */
export async function buildSwapTransaction(
  walletAddress: string,
  inputMint: string,
  outputMint: string,
  amount: string,
  slippageBps = 50
): Promise<SwapBuildResponse> {
  const url = `${API_URL}/api/swap/build`;
  const response = await fetchWithRetry(
    url,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet_address: walletAddress,
        input_mint: inputMint,
        output_mint: outputMint,
        amount,
        slippage_bps: slippageBps,
      }),
    }
  );
  return parseApiResponse<SwapBuildResponse>(response);
}

/**
 * Send signed transaction
 */
export async function sendTransaction(signedTransaction: string): Promise<TransactionSendResponse> {
  const url = `${API_URL}/api/transaction/send`;
  const response = await fetchWithRetry(
    url,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signedTransaction }),
    }
  );
  return parseApiResponse<TransactionSendResponse>(response);
}

/**
 * Get transaction status
 */
export async function getTransactionStatus(signature: string): Promise<TransactionStatus> {
  const url = `${API_URL}/api/transaction/status/${signature}`;
  const response = await fetch(url);
  return parseApiResponse<TransactionStatus>(response);
}
