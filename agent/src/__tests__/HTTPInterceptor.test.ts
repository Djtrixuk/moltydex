/**
 * HTTPInterceptor tests
 * Tests fetch interception and 402 handling
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Create mock functions at module scope
const mockHandle402 = vi.fn();
const mockGetWalletAddress = vi.fn().mockReturnValue('MockWallet');

vi.mock('../X402AutoPayAgent.js', () => ({
  X402AutoPayAgent: class MockAgent {
    handle402 = mockHandle402;
    getWalletAddress = mockGetWalletAddress;
    wallet = { getAddress: () => 'MockWallet' };
  },
}));

vi.mock('../WalletManager.js', () => ({
  WalletManager: class MockWalletManager {
    getAddress = vi.fn().mockReturnValue('MockWallet');
    publicKey = { toBase58: () => 'MockWallet' };
  },
}));

vi.mock('../MoltyDEXClient.js', () => ({
  MoltyDEXClient: class MockClient {},
}));

import { HTTPInterceptor } from '../HTTPInterceptor.js';

describe('HTTPInterceptor', () => {
  let originalFetch: typeof fetch;
  let interceptor: HTTPInterceptor | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    // Always restore fetch
    if (interceptor) {
      interceptor.restore();
      interceptor = null;
    }
    globalThis.fetch = originalFetch;
  });

  describe('constructor', () => {
    it('should create interceptor and replace global fetch', () => {
      interceptor = new HTTPInterceptor({
        apiUrl: 'https://api.moltydex.com',
        walletSecretKey: new Uint8Array(64),
      });

      expect(interceptor).toBeInstanceOf(HTTPInterceptor);
      // fetch should be replaced
      expect(globalThis.fetch).not.toBe(originalFetch);
    });
  });

  describe('restore', () => {
    it('should restore original fetch', () => {
      interceptor = new HTTPInterceptor({
        apiUrl: 'https://api.moltydex.com',
        walletSecretKey: new Uint8Array(64),
      });

      expect(globalThis.fetch).not.toBe(originalFetch);
      interceptor.restore();
      expect(globalThis.fetch).toBe(originalFetch);
      interceptor = null; // Already restored
    });
  });

  describe('getAgent', () => {
    it('should return the agent instance', () => {
      interceptor = new HTTPInterceptor({
        apiUrl: 'https://api.moltydex.com',
        walletSecretKey: new Uint8Array(64),
      });

      const agent = interceptor.getAgent();
      expect(agent).toBeDefined();
      expect(agent.getWalletAddress()).toBe('MockWallet');
    });
  });

  describe('fetch interception', () => {
    it('should pass through non-402 responses unchanged', async () => {
      // Set up a mock fetch BEFORE creating the interceptor
      const mockFetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ data: 'ok' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
      globalThis.fetch = mockFetch;

      interceptor = new HTTPInterceptor({
        apiUrl: 'https://api.moltydex.com',
        walletSecretKey: new Uint8Array(64),
      });

      const result = await globalThis.fetch('https://example.com/api');
      expect(result.status).toBe(200);

      const body = await result.json();
      expect(body.data).toBe('ok');
    });

    it('should intercept 402 responses and trigger auto-pay', async () => {
      const paymentBody = {
        accepts: [{ network: 'solana', asset: 'USDC', amount: '1000' }],
      };

      // First call returns 402, second call (retry) returns 200
      const mockFetch = vi.fn()
        .mockResolvedValueOnce(
          new Response(JSON.stringify(paymentBody), {
            status: 402,
            headers: { 'Content-Type': 'application/json' },
          })
        )
        .mockResolvedValue(
          new Response(JSON.stringify({ data: 'success' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      globalThis.fetch = mockFetch;

      mockHandle402.mockResolvedValue({
        success: true,
        payment_proof: 'proof_sig_123',
      });

      interceptor = new HTTPInterceptor({
        apiUrl: 'https://api.moltydex.com',
        walletSecretKey: new Uint8Array(64),
      });

      const result = await globalThis.fetch('https://example.com/paid-api');

      // Should have called handle402
      expect(mockHandle402).toHaveBeenCalled();
      // The retry should return 200
      expect(result.status).toBe(200);
    });

    it('should throw when auto-pay fails on 402', async () => {
      const paymentBody = {
        accepts: [{ network: 'solana', asset: 'USDC', amount: '1000' }],
      };

      const mockFetch = vi.fn().mockResolvedValue(
        new Response(JSON.stringify(paymentBody), {
          status: 402,
          headers: { 'Content-Type': 'application/json' },
        })
      );
      globalThis.fetch = mockFetch;

      mockHandle402.mockResolvedValue({
        success: false,
        error: 'Insufficient funds',
      });

      interceptor = new HTTPInterceptor({
        apiUrl: 'https://api.moltydex.com',
        walletSecretKey: new Uint8Array(64),
      });

      await expect(
        globalThis.fetch('https://example.com/paid-api')
      ).rejects.toThrow('Auto-pay failed');
    });
  });
});
