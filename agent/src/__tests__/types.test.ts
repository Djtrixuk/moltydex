/**
 * Type definition tests
 * Verifies type interfaces compile correctly and match expected shapes
 */

import { describe, it, expect } from 'vitest';
import type {
  PaymentRequirement,
  PaymentResponse,
  ParsedPayment,
  BalanceResponse,
  QuoteResponse,
  SwapBuildResponse,
  TransactionSendResponse,
  TransactionStatus,
  AutoPayResult,
  AgentConfig,
} from '../types.js';

describe('Type definitions', () => {
  describe('PaymentRequirement', () => {
    it('should accept valid payment requirement', () => {
      const req: PaymentRequirement = {
        network: 'solana',
        asset: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        amount: '1000000',
        address: 'RecipientAddress',
      };
      expect(req.network).toBe('solana');
      expect(req.asset).toBeTruthy();
      expect(req.amount).toBeTruthy();
    });

    it('should accept optional fields', () => {
      const req: PaymentRequirement = {
        network: 'solana',
        asset: 'USDC_MINT',
        amount: '500',
      };
      expect(req.address).toBeUndefined();
      expect(req.token_mint).toBeUndefined();
    });
  });

  describe('PaymentResponse', () => {
    it('should have accepts array', () => {
      const resp: PaymentResponse = {
        accepts: [
          { network: 'solana', asset: 'USDC', amount: '100' },
          { network: 'solana', asset: 'SOL', amount: '50000' },
        ],
      };
      expect(resp.accepts).toHaveLength(2);
    });
  });

  describe('AutoPayResult', () => {
    it('should represent success', () => {
      const result: AutoPayResult = {
        success: true,
        payment_signature: 'sig123',
        swap_signature: 'swap456',
        payment_proof: 'sig123',
        message: 'Payment completed',
      };
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should represent failure', () => {
      const result: AutoPayResult = {
        success: false,
        error: 'Insufficient funds',
        message: 'Payment failed',
      };
      expect(result.success).toBe(false);
      expect(result.payment_signature).toBeUndefined();
    });
  });

  describe('AgentConfig', () => {
    it('should accept minimal config', () => {
      const config: AgentConfig = {
        apiUrl: 'https://api.moltydex.com',
        walletPath: '/path/to/wallet.json',
      };
      expect(config.apiUrl).toBeTruthy();
      expect(config.autoSwap).toBeUndefined();
    });

    it('should accept full config', () => {
      const config: AgentConfig = {
        apiUrl: 'https://api.moltydex.com',
        walletSecretKey: new Uint8Array(64),
        walletAddress: 'MyWalletAddress',
        preferredInputToken: 'So11111111111111111111111111111111111111112',
        webhookUrl: 'https://agent.com/webhook',
        autoSwap: true,
        maxRetries: 5,
        retryDelay: 3000,
        rpcUrl: 'https://mainnet.helius-rpc.com/?api-key=KEY',
      };
      expect(config.maxRetries).toBe(5);
      expect(config.autoSwap).toBe(true);
    });

    it('should accept base58 string as walletSecretKey', () => {
      const config: AgentConfig = {
        apiUrl: 'https://api.moltydex.com',
        walletSecretKey: '5abc123base58key',
      };
      expect(typeof config.walletSecretKey).toBe('string');
    });

    it('should accept number array as walletSecretKey', () => {
      const config: AgentConfig = {
        apiUrl: 'https://api.moltydex.com',
        walletSecretKey: [1, 2, 3, 4, 5],
      };
      expect(Array.isArray(config.walletSecretKey)).toBe(true);
    });
  });

  describe('BalanceResponse', () => {
    it('should represent token balance', () => {
      const balance: BalanceResponse = {
        wallet_address: 'WALLET',
        token_mint: 'USDC_MINT',
        balance: '5000000',
        decimals: 6,
        has_balance: true,
      };
      expect(BigInt(balance.balance)).toBeGreaterThan(0n);
    });
  });

  describe('QuoteResponse', () => {
    it('should contain all quote fields', () => {
      const quote: QuoteResponse = {
        input_amount: '1000000000',
        output_amount: '80000000',
        output_after_fee: '80000000',
        fee_amount: '0',
        fee_bps: 0,
        price_impact: '0.01',
      };
      expect(BigInt(quote.output_amount)).toBeGreaterThan(0n);
    });
  });

  describe('TransactionStatus', () => {
    it('should represent confirmed transaction', () => {
      const status: TransactionStatus = {
        signature: 'sig123',
        status: 'confirmed',
        confirmed: true,
        confirmation_status: 'finalized',
      };
      expect(status.confirmed).toBe(true);
      expect(status.error).toBeUndefined();
    });

    it('should represent failed transaction', () => {
      const status: TransactionStatus = {
        signature: 'sig123',
        status: 'failed',
        confirmed: false,
        error: { code: 'InstructionError', message: 'Custom program error' },
      };
      expect(status.confirmed).toBe(false);
      expect(status.error?.code).toBe('InstructionError');
    });
  });
});
