/**
 * X402AutoPayAgent tests
 * Tests the main agent logic with mocked client and wallet
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Create mock functions at module scope (hoisted by vitest)
const mockParsePayment = vi.fn();
const mockGetBalance = vi.fn();
const mockGetQuote = vi.fn();
const mockBuildSwapTransaction = vi.fn();
const mockSendTransaction = vi.fn();
const mockGetTransactionStatus = vi.fn();
const mockRegisterWebhook = vi.fn();
const mockAutoPay = vi.fn();
const mockGetAddress = vi.fn().mockReturnValue('MockWalletAddress1234567890abcdef');
const mockSignTransaction = vi.fn().mockResolvedValue('signedtx==');
const mockBuildPaymentTransaction = vi.fn().mockResolvedValue('paymenttx==');

vi.mock('../MoltyDEXClient.js', () => ({
  MoltyDEXClient: class MockMoltyDEXClient {
    parsePayment = mockParsePayment;
    getBalance = mockGetBalance;
    getQuote = mockGetQuote;
    buildSwapTransaction = mockBuildSwapTransaction;
    sendTransaction = mockSendTransaction;
    getTransactionStatus = mockGetTransactionStatus;
    registerWebhook = mockRegisterWebhook;
    autoPay = mockAutoPay;
  },
}));

vi.mock('../WalletManager.js', () => ({
  WalletManager: class MockWalletManager {
    getAddress = mockGetAddress;
    signTransaction = mockSignTransaction;
    buildPaymentTransaction = mockBuildPaymentTransaction;
    publicKey = { toBase58: () => 'MockWalletAddress1234567890abcdef' };
  },
}));

import { X402AutoPayAgent } from '../X402AutoPayAgent.js';

function createAgent() {
  return new X402AutoPayAgent({
    apiUrl: 'https://api.moltydex.com',
    walletSecretKey: new Uint8Array(64),
  });
}

describe('X402AutoPayAgent', () => {
  let agent: X402AutoPayAgent;

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAddress.mockReturnValue('MockWalletAddress1234567890abcdef');
    mockSignTransaction.mockResolvedValue('signedtx==');
    mockBuildPaymentTransaction.mockResolvedValue('paymenttx==');
    agent = createAgent();
  });

  describe('constructor', () => {
    it('should create agent with default config', () => {
      expect(agent).toBeInstanceOf(X402AutoPayAgent);
      expect(agent.getWalletAddress()).toBe('MockWalletAddress1234567890abcdef');
    });

    it('should apply default preferredInputToken', () => {
      const config = (agent as any).config;
      expect(config.preferredInputToken).toBe('So11111111111111111111111111111111111111112');
    });

    it('should apply default maxRetries', () => {
      const config = (agent as any).config;
      expect(config.maxRetries).toBe(3);
    });

    it('should apply default retryDelay', () => {
      const config = (agent as any).config;
      expect(config.retryDelay).toBe(2000);
    });

    it('should allow config overrides', () => {
      const customAgent = new X402AutoPayAgent({
        apiUrl: 'https://custom.api.com',
        walletSecretKey: new Uint8Array(64),
        maxRetries: 5,
        retryDelay: 5000,
        preferredInputToken: 'CUSTOM_TOKEN',
      });
      const config = (customAgent as any).config;
      expect(config.maxRetries).toBe(5);
      expect(config.retryDelay).toBe(5000);
      expect(config.preferredInputToken).toBe('CUSTOM_TOKEN');
    });
  });

  describe('handle402 - sufficient balance', () => {
    it('should complete payment without swap when balance is sufficient', async () => {
      mockParsePayment.mockResolvedValue({
        recommended: {
          network: 'solana',
          asset: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          amount: '1000000',
          address: 'RecipientAddress123456789012345678',
        },
        total_options: 1,
      });

      mockGetBalance.mockResolvedValue({
        balance: '5000000', // 5 USDC -- more than enough
        decimals: 6,
      });

      mockSendTransaction.mockResolvedValue({
        signature: 'payment_sig_123',
      });

      mockGetTransactionStatus.mockResolvedValue({
        confirmed: true,
        status: 'confirmed',
      });

      const result = await agent.handle402({
        accepts: [
          {
            network: 'solana',
            asset: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
            amount: '1000000',
            address: 'RecipientAddress123456789012345678',
          },
        ],
      });

      expect(result.success).toBe(true);
      expect(result.payment_signature).toBe('payment_sig_123');
      expect(result.swap_signature).toBeUndefined(); // No swap needed
      expect(mockGetQuote).not.toHaveBeenCalled(); // No quote needed
    });
  });

  describe('handle402 - insufficient balance (needs swap)', () => {
    it('should swap and then pay when balance is insufficient', async () => {
      mockParsePayment.mockResolvedValue({
        recommended: {
          network: 'solana',
          asset: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
          amount: '1000000',
          address: 'RecipientAddress123456789012345678',
        },
        total_options: 1,
      });

      // First balance check: insufficient
      mockGetBalance
        .mockResolvedValueOnce({ balance: '0', decimals: 6 })
        // Second balance check after swap: sufficient
        .mockResolvedValueOnce({ balance: '1200000', decimals: 6 });

      mockGetQuote.mockResolvedValue({
        input_amount: '10000000',
        output_amount: '1100000',
        output_after_fee: '1100000',
        fee_amount: '0',
        fee_bps: 0,
      });

      mockBuildSwapTransaction.mockResolvedValue({
        transaction: 'swaptx==',
      });

      mockSendTransaction
        .mockResolvedValueOnce({ signature: 'swap_sig_123' })
        .mockResolvedValueOnce({ signature: 'payment_sig_456' });

      mockGetTransactionStatus.mockResolvedValue({
        confirmed: true,
        status: 'confirmed',
      });

      const result = await agent.handle402({
        accepts: [
          {
            network: 'solana',
            asset: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
            amount: '1000000',
            address: 'RecipientAddress123456789012345678',
          },
        ],
      });

      expect(result.success).toBe(true);
      expect(result.swap_signature).toBe('swap_sig_123');
      expect(result.payment_signature).toBe('payment_sig_456');
      expect(mockGetQuote).toHaveBeenCalled();
      expect(mockBuildSwapTransaction).toHaveBeenCalled();
    });
  });

  describe('handle402 - error cases', () => {
    it('should return failure when parse fails', async () => {
      mockParsePayment.mockRejectedValue(new Error('Invalid payment format'));

      const result = await agent.handle402({ invalid: true });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid payment format');
    });

    it('should return failure when balance check fails', async () => {
      mockParsePayment.mockResolvedValue({
        recommended: { asset: 'USDC', amount: '1000', address: 'ADDR' },
      });
      mockGetBalance.mockRejectedValue(new Error('RPC rate limit'));

      const result = await agent.handle402({
        accepts: [{ network: 'solana', asset: 'USDC', amount: '1000' }],
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('RPC rate limit');
    });

    it('should return failure when swap fails', async () => {
      mockParsePayment.mockResolvedValue({
        recommended: { asset: 'USDC', amount: '1000000', address: 'ADDR' },
      });
      mockGetBalance.mockResolvedValue({ balance: '0', decimals: 6 });
      mockGetQuote.mockRejectedValue(new Error('No route found'));

      const result = await agent.handle402({
        accepts: [{ network: 'solana', asset: 'USDC', amount: '1000000' }],
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('No route found');
    });

    it('should return failure when payment tx send fails', async () => {
      mockParsePayment.mockResolvedValue({
        recommended: { asset: 'USDC', amount: '1000', address: 'ADDR' },
      });
      mockGetBalance.mockResolvedValue({ balance: '5000', decimals: 6 });
      mockSendTransaction.mockRejectedValue(new Error('Transaction simulation failed'));

      const result = await agent.handle402({
        accepts: [{ network: 'solana', asset: 'USDC', amount: '1000' }],
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Transaction simulation failed');
    });

    it('should return failure when post-swap balance is still insufficient', async () => {
      mockParsePayment.mockResolvedValue({
        recommended: { asset: 'USDC', amount: '1000000', address: 'ADDR' },
      });
      // Both balance checks return insufficient
      mockGetBalance
        .mockResolvedValueOnce({ balance: '0', decimals: 6 })
        .mockResolvedValueOnce({ balance: '500000', decimals: 6 }); // Still not enough

      mockGetQuote.mockResolvedValue({
        input_amount: '10000000',
        output_amount: '600000',
        output_after_fee: '600000',
        fee_amount: '0',
        fee_bps: 0,
      });

      mockBuildSwapTransaction.mockResolvedValue({ transaction: 'swaptx==' });
      mockSendTransaction.mockResolvedValue({ signature: 'swap_sig' });
      mockGetTransactionStatus.mockResolvedValue({ confirmed: true });

      const result = await agent.handle402({
        accepts: [{ network: 'solana', asset: 'USDC', amount: '1000000' }],
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Insufficient balance after swap');
    });
  });

  describe('handle402 - retry original request', () => {
    it('should retry original request after successful payment', async () => {
      mockParsePayment.mockResolvedValue({
        recommended: { asset: 'USDC', amount: '1000', address: 'ADDR' },
      });
      mockGetBalance.mockResolvedValue({ balance: '5000', decimals: 6 });
      mockSendTransaction.mockResolvedValue({ signature: 'pay_sig' });
      mockGetTransactionStatus.mockResolvedValue({ confirmed: true });

      const retryFn = vi.fn().mockResolvedValue({ status: 200 });

      const result = await agent.handle402(
        { accepts: [{ network: 'solana', asset: 'USDC', amount: '1000' }] },
        retryFn
      );

      expect(result.success).toBe(true);
      expect(retryFn).toHaveBeenCalledOnce();
    });
  });

  describe('getWalletAddress', () => {
    it('should return wallet address', () => {
      expect(agent.getWalletAddress()).toBe('MockWalletAddress1234567890abcdef');
    });
  });
});
