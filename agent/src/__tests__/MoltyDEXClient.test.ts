/**
 * MoltyDEXClient tests
 * Tests API client methods with mocked HTTP responses
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Store mock instance so tests can configure it
const mockGet = vi.fn();
const mockPost = vi.fn();

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: mockGet,
      post: mockPost,
    })),
  },
}));

import { MoltyDEXClient } from '../MoltyDEXClient.js';

describe('MoltyDEXClient', () => {
  let client: MoltyDEXClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new MoltyDEXClient('https://api.moltydex.com');
  });

  describe('constructor', () => {
    it('should create client with default URL', () => {
      const defaultClient = new MoltyDEXClient();
      expect(defaultClient).toBeInstanceOf(MoltyDEXClient);
    });

    it('should strip trailing slash from URL', () => {
      const c = new MoltyDEXClient('https://api.moltydex.com/');
      expect(c).toBeInstanceOf(MoltyDEXClient);
    });
  });

  describe('parsePayment', () => {
    it('should parse 402 response body', async () => {
      const mockResponse = {
        data: {
          payment_requirements: [
            { network: 'solana', asset: 'USDC_MINT', amount: '1000000' },
          ],
          recommended: { network: 'solana', asset: 'USDC_MINT', amount: '1000000' },
          total_options: 1,
        },
      };
      mockPost.mockResolvedValue(mockResponse);

      const result = await client.parsePayment({
        accepts: [{ network: 'solana', asset: 'USDC_MINT', amount: '1000000' }],
      });

      expect(result.recommended.asset).toBe('USDC_MINT');
      expect(result.total_options).toBe(1);
      expect(mockPost).toHaveBeenCalledWith(
        '/api/x402/parse-payment',
        expect.objectContaining({ payment_response_body: expect.any(Object) })
      );
    });

    it('should handle string payment body', async () => {
      const mockResponse = {
        data: {
          payment_requirements: [],
          recommended: { network: 'solana', asset: 'SOL', amount: '5000' },
          total_options: 1,
        },
      };
      mockPost.mockResolvedValue(mockResponse);

      const result = await client.parsePayment('{"accepts":[]}');
      expect(result.recommended.asset).toBe('SOL');
    });
  });

  describe('getBalance', () => {
    it('should fetch balance for wallet and token', async () => {
      mockGet.mockResolvedValue({
        data: {
          wallet_address: 'WALLET123',
          token_mint: 'USDC_MINT',
          balance: '5000000',
          decimals: 6,
          has_balance: true,
        },
      });

      const result = await client.getBalance('WALLET123', 'USDC_MINT');

      expect(result.balance).toBe('5000000');
      expect(result.decimals).toBe(6);
      expect(mockGet).toHaveBeenCalledWith('/api/balance', {
        params: { wallet_address: 'WALLET123', token_mint: 'USDC_MINT' },
      });
    });

    it('should return zero balance for empty wallet', async () => {
      mockGet.mockResolvedValue({
        data: { balance: '0', decimals: 6, has_balance: false },
      });

      const result = await client.getBalance('EMPTY_WALLET', 'USDC_MINT');
      expect(result.balance).toBe('0');
      expect(result.has_balance).toBe(false);
    });
  });

  describe('getQuote', () => {
    it('should fetch swap quote with default slippage', async () => {
      mockGet.mockResolvedValue({
        data: {
          input_amount: '1000000000',
          output_amount: '80000000',
          output_after_fee: '80000000',
          fee_amount: '0',
          fee_bps: 0,
        },
      });

      const result = await client.getQuote(
        'So11111111111111111111111111111111111111112',
        'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        '1000000000'
      );

      expect(result.output_amount).toBe('80000000');
      expect(mockGet).toHaveBeenCalledWith('/api/quote', {
        params: expect.objectContaining({
          input_mint: 'So11111111111111111111111111111111111111112',
          output_mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          amount: '1000000000',
          slippage_bps: 50,
        }),
      });
    });

    it('should pass custom slippage', async () => {
      mockGet.mockResolvedValue({
        data: { output_amount: '100', output_after_fee: '100', fee_amount: '0', fee_bps: 0, input_amount: '100' },
      });

      await client.getQuote('A', 'B', '100', 100);

      expect(mockGet).toHaveBeenCalledWith('/api/quote', {
        params: expect.objectContaining({ slippage_bps: 100 }),
      });
    });
  });

  describe('buildSwapTransaction', () => {
    it('should build unsigned swap transaction', async () => {
      mockPost.mockResolvedValue({
        data: {
          transaction: 'base64encodedtx==',
          fee_amount: '0',
          output_amount: '80000000',
          output_after_fee: '80000000',
          fee_bps: 0,
        },
      });

      const result = await client.buildSwapTransaction(
        'WALLET_ADDR',
        'SOL_MINT',
        'USDC_MINT',
        '1000000000',
        50
      );

      expect(result.transaction).toBe('base64encodedtx==');
      expect(mockPost).toHaveBeenCalledWith('/api/swap/build', {
        wallet_address: 'WALLET_ADDR',
        input_mint: 'SOL_MINT',
        output_mint: 'USDC_MINT',
        amount: '1000000000',
        slippage_bps: 50,
      });
    });
  });

  describe('sendTransaction', () => {
    it('should send signed transaction and return signature', async () => {
      mockPost.mockResolvedValue({
        data: {
          signature: '5abc123def456',
          status: 'pending',
          message: 'Transaction sent successfully',
        },
      });

      const result = await client.sendTransaction('signedtxbase64==');

      expect(result.signature).toBe('5abc123def456');
      expect(mockPost).toHaveBeenCalledWith('/api/transaction/send', {
        signedTransaction: 'signedtxbase64==',
      });
    });
  });

  describe('getTransactionStatus', () => {
    it('should return confirmed status', async () => {
      mockGet.mockResolvedValue({
        data: {
          signature: 'sig123',
          status: 'confirmed',
          confirmed: true,
          confirmation_status: 'confirmed',
        },
      });

      const result = await client.getTransactionStatus('sig123');

      expect(result.confirmed).toBe(true);
      expect(result.status).toBe('confirmed');
    });

    it('should return pending status', async () => {
      mockGet.mockResolvedValue({
        data: { signature: 'sig123', status: 'pending', confirmed: false },
      });

      const result = await client.getTransactionStatus('sig123');
      expect(result.confirmed).toBe(false);
    });

    it('should return failed status with error', async () => {
      mockGet.mockResolvedValue({
        data: {
          signature: 'sig123',
          status: 'failed',
          confirmed: false,
          error: { code: 'InstructionError', message: 'Custom error' },
        },
      });

      const result = await client.getTransactionStatus('sig123');
      expect(result.status).toBe('failed');
      expect(result.error?.code).toBe('InstructionError');
    });
  });

  describe('registerWebhook', () => {
    it('should register webhook and return ID', async () => {
      mockPost.mockResolvedValue({
        data: { webhook_id: 'wh_123', message: 'Webhook registered' },
      });

      const result = await client.registerWebhook(
        'sig123',
        'https://agent.com/webhook',
        { type: 'swap' }
      );

      expect(result.webhook_id).toBe('wh_123');
      expect(mockPost).toHaveBeenCalledWith('/api/transaction/webhook', {
        signature: 'sig123',
        callback_url: 'https://agent.com/webhook',
        metadata: { type: 'swap' },
      });
    });
  });

  describe('autoPay', () => {
    it('should call auto-pay endpoint', async () => {
      mockPost.mockResolvedValue({
        data: {
          ready: true,
          payment_ready: true,
          has_sufficient_balance: true,
        },
      });

      const result = await client.autoPay(
        { accepts: [{ network: 'solana', asset: 'USDC', amount: '1000' }] },
        'WALLET_ADDR',
        'SOL_MINT',
        true
      );

      expect(result.ready).toBe(true);
      expect(mockPost).toHaveBeenCalledWith('/api/x402/auto-pay', {
        payment_response_body: expect.any(Object),
        wallet_address: 'WALLET_ADDR',
        preferred_input_token: 'SOL_MINT',
        auto_swap: true,
      });
    });
  });

  describe('error handling', () => {
    it('should propagate API errors', async () => {
      mockGet.mockRejectedValue(new Error('Network error'));

      await expect(
        client.getBalance('WALLET', 'TOKEN')
      ).rejects.toThrow('Network error');
    });

    it('should propagate 429 rate limit errors', async () => {
      const rateLimitError = new Error('Request failed with status code 429');
      (rateLimitError as any).response = { status: 429, data: { error: 'Rate limited' } };
      mockGet.mockRejectedValue(rateLimitError);

      await expect(
        client.getQuote('A', 'B', '100')
      ).rejects.toThrow('429');
    });
  });
});
