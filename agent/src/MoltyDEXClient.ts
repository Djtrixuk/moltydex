/**
 * MoltyDEX API Client
 * Handles all API calls to MoltyDEX
 */

import axios, { AxiosInstance } from 'axios';
import type {
  ParsedPayment,
  BalanceResponse,
  QuoteResponse,
  SwapBuildResponse,
  TransactionSendResponse,
  TransactionStatus,
} from './types.js';

export class MoltyDEXClient {
  private client: AxiosInstance;
  private apiUrl: string;

  constructor(apiUrl: string = 'https://api.moltydex.com') {
    this.apiUrl = apiUrl.replace(/\/$/, '');
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  /**
   * Parse x402 payment requirements from response body
   */
  async parsePayment(paymentResponseBody: any): Promise<ParsedPayment> {
    const response = await this.client.post<ParsedPayment>(
      '/api/x402/parse-payment',
      { payment_response_body: paymentResponseBody }
    );
    return response.data;
  }

  /**
   * Check token balance for a wallet
   */
  async getBalance(
    walletAddress: string,
    tokenMint: string
  ): Promise<BalanceResponse> {
    const response = await this.client.get<BalanceResponse>('/api/balance', {
      params: {
        wallet_address: walletAddress,
        token_mint: tokenMint,
      },
    });
    return response.data;
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
    const response = await this.client.get<QuoteResponse>('/api/quote', {
      params: {
        input_mint: inputMint,
        output_mint: outputMint,
        amount,
        slippage_bps: slippageBps,
      },
    });
    return response.data;
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
  }

  /**
   * Send signed transaction
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
    const response = await this.client.get<TransactionStatus>(
      `/api/transaction/status/${signature}`
    );
    return response.data;
  }

  /**
   * Register webhook for transaction status updates
   */
  async registerWebhook(
    signature: string,
    callbackUrl: string,
    metadata?: any
  ): Promise<{ webhook_id: string; message: string }> {
    const response = await this.client.post('/api/transaction/webhook', {
      signature,
      callback_url: callbackUrl,
      metadata,
    });
    return response.data;
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
    const response = await this.client.post('/api/x402/auto-pay', {
      payment_response_body: paymentResponseBody,
      wallet_address: walletAddress,
      preferred_input_token: preferredInputToken,
      auto_swap: autoSwap,
    });
    return response.data;
  }
}
