/**
 * MoltyDEX API Client
 * Handles all API calls to MoltyDEX with automatic retry + exponential backoff
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import type {
  ParsedPayment,
  BalanceResponse,
  QuoteResponse,
  SwapBuildResponse,
  TransactionSendResponse,
  TransactionStatus,
  TokenMetadata,
  BatchBalanceResult,
  BatchQuoteResult,
  SimulationResult,
} from './types.js';

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_BASE_DELAY_MS = 1000;

/** Status codes that are safe to retry */
const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);

export class MoltyDEXClient {
  private client: AxiosInstance;
  private apiUrl: string;
  private maxRetries: number;
  private baseDelayMs: number;

  constructor(
    apiUrl: string = 'https://api.moltydex.com',
    options?: { maxRetries?: number; retryDelay?: number }
  ) {
    this.apiUrl = apiUrl.replace(/\/$/, '');
    this.maxRetries = options?.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.baseDelayMs = options?.retryDelay ?? DEFAULT_BASE_DELAY_MS;
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  /**
   * Execute a request with exponential backoff retry.
   * Only retries on network errors and retryable HTTP status codes.
   */
  private async withRetry<T>(fn: () => Promise<T>, retries?: number): Promise<T> {
    const maxAttempts = retries ?? this.maxRetries;
    let lastError: unknown;
    for (let attempt = 0; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        const axiosErr = err as AxiosError;
        const status = axiosErr.response?.status;

        // Don't retry client errors (4xx) except 408/429
        if (status && status >= 400 && status < 500 && !RETRYABLE_STATUS.has(status)) {
          throw err;
        }

        // Don't retry if we've exhausted attempts
        if (attempt >= maxAttempts) break;

        // Exponential backoff with jitter
        const delay = this.baseDelayMs * Math.pow(2, attempt) + Math.random() * 500;
        console.log(`[MoltyDEXClient] Retry ${attempt + 1}/${maxAttempts} after ${Math.round(delay)}ms (status: ${status || 'network error'})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw lastError;
  }

  /**
   * Parse x402 payment requirements from response body
   */
  async parsePayment(paymentResponseBody: any): Promise<ParsedPayment> {
    return this.withRetry(async () => {
      const response = await this.client.post<ParsedPayment>(
        '/api/x402/parse-payment',
        { payment_response_body: paymentResponseBody }
      );
      return response.data;
    });
  }

  /**
   * Check token balance for a wallet
   */
  async getBalance(
    walletAddress: string,
    tokenMint: string
  ): Promise<BalanceResponse> {
    return this.withRetry(async () => {
      const response = await this.client.get<BalanceResponse>('/api/balance', {
        params: {
          wallet_address: walletAddress,
          token_mint: tokenMint,
        },
      });
      return response.data;
    });
  }

  /**
   * Get swap quote
   */
  async getQuote(
    inputMint: string,
    outputMint: string,
    amount: string,
    slippageBps: number = 50
  ): Promise<QuoteResponse> {
    return this.withRetry(async () => {
      const response = await this.client.get<QuoteResponse>('/api/quote', {
        params: {
          input_mint: inputMint,
          output_mint: outputMint,
          amount,
          slippage_bps: slippageBps,
        },
      });
      return response.data;
    });
  }

  /**
   * Build swap transaction (unsigned)
   */
  async buildSwapTransaction(
    walletAddress: string,
    inputMint: string,
    outputMint: string,
    amount: string,
    slippageBps: number = 50
  ): Promise<SwapBuildResponse> {
    return this.withRetry(async () => {
      const response = await this.client.post<SwapBuildResponse>(
        '/api/swap/build',
        {
          wallet_address: walletAddress,
          input_mint: inputMint,
          output_mint: outputMint,
          amount,
          slippage_bps: slippageBps,
        }
      );
      return response.data;
    });
  }

  /**
   * Send signed transaction (no retry — double-send is dangerous)
   */
  async sendTransaction(
    signedTransaction: string
  ): Promise<TransactionSendResponse> {
    const response = await this.client.post<TransactionSendResponse>(
      '/api/transaction/send',
      {
        signedTransaction,
      }
    );
    return response.data;
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(signature: string): Promise<TransactionStatus> {
    return this.withRetry(async () => {
      const response = await this.client.get<TransactionStatus>(
        `/api/transaction/status/${signature}`
      );
      return response.data;
    });
  }

  /**
   * Register webhook for transaction status updates
   */
  async registerWebhook(
    signature: string,
    callbackUrl: string,
    metadata?: any
  ): Promise<{ webhook_id: string; message: string }> {
    return this.withRetry(async () => {
      const response = await this.client.post('/api/transaction/webhook', {
        signature,
        callback_url: callbackUrl,
        metadata,
      });
      return response.data;
    });
  }

  /**
   * Auto-pay endpoint (one-call solution)
   */
  async autoPay(
    paymentResponseBody: any,
    walletAddress: string,
    preferredInputToken?: string,
    autoSwap: boolean = false
  ): Promise<any> {
    return this.withRetry(async () => {
      const response = await this.client.post('/api/x402/auto-pay', {
        payment_response_body: paymentResponseBody,
        wallet_address: walletAddress,
        preferred_input_token: preferredInputToken,
        auto_swap: autoSwap,
      });
      return response.data;
    });
  }

  // ── Batch endpoints ──────────────────────────────────────────────

  /**
   * Get multiple token balances in one call
   */
  async batchBalances(
    walletAddress: string,
    tokenMints: string[]
  ): Promise<{ results: BatchBalanceResult[]; total: number }> {
    return this.withRetry(async () => {
      const response = await this.client.post('/api/batch/balance', {
        wallet_address: walletAddress,
        token_mints: tokenMints,
      });
      return response.data;
    });
  }

  /**
   * Get multiple swap quotes in one call
   */
  async batchQuotes(
    requests: Array<{ input_mint: string; output_mint: string; amount: string; slippage_bps?: number }>
  ): Promise<{ results: BatchQuoteResult[]; total: number }> {
    return this.withRetry(async () => {
      const response = await this.client.post('/api/batch/quotes', { requests });
      return response.data;
    });
  }

  // ── Token endpoints ──────────────────────────────────────────────

  /**
   * Get token metadata by mint address
   */
  async getTokenMetadata(mint: string): Promise<TokenMetadata> {
    return this.withRetry(async () => {
      const response = await this.client.get<TokenMetadata>('/api/token', {
        params: { mint },
      });
      return response.data;
    });
  }

  /**
   * Search tokens by symbol, name, or address
   */
  async searchTokens(query: string, limit: number = 20): Promise<any[]> {
    return this.withRetry(async () => {
      const response = await this.client.get('/api/tokens/search', {
        params: { q: query, limit },
      });
      return response.data.tokens || response.data;
    });
  }

  // ── x402 payment helpers ─────────────────────────────────────────

  /**
   * Prepare payment — checks balance and returns swap info if needed
   */
  async preparePayment(
    walletAddress: string,
    paymentRequirements: any,
    preferredInputToken?: string
  ): Promise<any> {
    return this.withRetry(async () => {
      const response = await this.client.post('/api/x402/prepare-payment', {
        wallet_address: walletAddress,
        payment_requirements: paymentRequirements,
        preferred_input_token: preferredInputToken,
      });
      return response.data;
    });
  }

  /**
   * Simulate payment flow without executing transactions
   */
  async simulatePayment(
    walletAddress: string,
    paymentRequirements: any,
    preferredInputToken?: string
  ): Promise<SimulationResult> {
    return this.withRetry(async () => {
      const response = await this.client.post<SimulationResult>('/api/x402/simulate-payment', {
        wallet_address: walletAddress,
        payment_requirements: paymentRequirements,
        preferred_input_token: preferredInputToken,
      });
      return response.data;
    });
  }

  // ── Ultra (Jupiter Ultra) endpoints ──────────────────────────────

  /**
   * Get Jupiter Ultra order (gasless swap)
   */
  async getUltraOrder(
    inputMint: string,
    outputMint: string,
    amount: string,
    taker?: string
  ): Promise<any> {
    return this.withRetry(async () => {
      const response = await this.client.get('/api/ultra/order', {
        params: { inputMint, outputMint, amount, taker },
      });
      return response.data;
    });
  }

  /**
   * Execute Jupiter Ultra swap
   */
  async executeUltraSwap(signedTransaction: string, requestId?: string): Promise<any> {
    const response = await this.client.post('/api/ultra/execute', {
      signedTransaction,
      requestId,
    });
    return response.data;
  }

  // ── Wallet / analytics ───────────────────────────────────────────

  /**
   * Get all token holdings for a wallet
   */
  async getWalletTokens(walletAddress: string): Promise<any> {
    return this.withRetry(async () => {
      const response = await this.client.get('/api/wallet/tokens', {
        params: { wallet_address: walletAddress },
      });
      return response.data;
    });
  }

  /**
   * Get swap history for a wallet
   */
  async getSwapHistory(walletAddress: string): Promise<any> {
    return this.withRetry(async () => {
      const response = await this.client.get(`/api/analytics/swaps/${walletAddress}`);
      return response.data;
    });
  }

  /**
   * Get points/rewards for a wallet
   */
  async getPoints(walletAddress: string): Promise<any> {
    return this.withRetry(async () => {
      const response = await this.client.get(`/api/analytics/points/${walletAddress}`);
      return response.data;
    });
  }

  /**
   * Get swap leaderboard
   */
  async getLeaderboard(): Promise<any> {
    return this.withRetry(async () => {
      const response = await this.client.get('/api/analytics/leaderboard');
      return response.data;
    });
  }

  /**
   * API health check
   */
  async health(): Promise<any> {
    return this.withRetry(async () => {
      const response = await this.client.get('/api/health');
      return response.data;
    });
  }
}
