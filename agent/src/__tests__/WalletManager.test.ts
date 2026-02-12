/**
 * WalletManager tests
 * Tests wallet loading, signing, and payment building
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Keypair, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

// Use vi.hoisted() so these are available inside vi.mock factories
const {
  mockGetLatestBlockhash,
  mockGetBalance,
  mockReadFileSync,
} = vi.hoisted(() => ({
  mockGetLatestBlockhash: vi.fn().mockResolvedValue({
    blockhash: 'GHtXQBtaLTAtNP89ckAcoUsYch2SgEGy1VWgCB7YFKJL',
    lastValidBlockHeight: 200000,
  }),
  mockGetBalance: vi.fn().mockResolvedValue(1_000_000_000),
  mockReadFileSync: vi.fn(),
}));

// Mock Connection as a proper class (must be constructable with `new`)
vi.mock('@solana/web3.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@solana/web3.js')>();
  return {
    ...actual,
    Connection: class MockConnection {
      constructor(_url: string, _commitment?: string) {}
      getLatestBlockhash = mockGetLatestBlockhash;
      getBalance = mockGetBalance;
    },
  };
});

// Mock spl-token (avoid real RPC calls)
vi.mock('@solana/spl-token', async () => {
  const { vi: viInner } = await import('vitest');
  const { Keypair: KP } = await import('@solana/web3.js');
  const mockPubkey = KP.generate().publicKey;
  return {
    getAssociatedTokenAddress: viInner.fn().mockResolvedValue(mockPubkey),
    createTransferInstruction: viInner.fn().mockReturnValue({
      programId: mockPubkey,
      keys: [],
      data: Buffer.alloc(0),
    }),
    createAssociatedTokenAccountInstruction: viInner.fn().mockReturnValue({
      programId: mockPubkey,
      keys: [],
      data: Buffer.alloc(0),
    }),
    getAccount: viInner.fn().mockResolvedValue({ amount: BigInt(1000) }),
    TOKEN_PROGRAM_ID: mockPubkey,
    ASSOCIATED_TOKEN_PROGRAM_ID: mockPubkey,
  };
});

// Mock fs
vi.mock('fs', () => ({
  default: { readFileSync: mockReadFileSync },
  readFileSync: mockReadFileSync,
}));

import { WalletManager } from '../WalletManager.js';

describe('WalletManager', () => {
  let testKeypair: Keypair;
  let testSecretKeyBase58: string;

  beforeEach(() => {
    vi.clearAllMocks();
    testKeypair = Keypair.generate();
    testSecretKeyBase58 = bs58.encode(testKeypair.secretKey);
    mockGetBalance.mockResolvedValue(1_000_000_000);
  });

  describe('constructor', () => {
    it('should create wallet from Uint8Array secret key', () => {
      const wallet = new WalletManager({
        apiUrl: 'https://api.moltydex.com',
        walletSecretKey: testKeypair.secretKey,
      });

      expect(wallet.getAddress()).toBe(testKeypair.publicKey.toBase58());
    });

    it('should create wallet from base58 secret key', () => {
      const wallet = new WalletManager({
        apiUrl: 'https://api.moltydex.com',
        walletSecretKey: testSecretKeyBase58,
      });

      expect(wallet.getAddress()).toBe(testKeypair.publicKey.toBase58());
    });

    it('should create wallet from number array', () => {
      const keyArray = Array.from(testKeypair.secretKey);
      const wallet = new WalletManager({
        apiUrl: 'https://api.moltydex.com',
        walletSecretKey: keyArray,
      });

      expect(wallet.getAddress()).toBe(testKeypair.publicKey.toBase58());
    });

    it('should create wallet from file path', () => {
      mockReadFileSync.mockReturnValue(JSON.stringify(Array.from(testKeypair.secretKey)));

      const wallet = new WalletManager({
        apiUrl: 'https://api.moltydex.com',
        walletPath: '/path/to/wallet.json',
      });

      expect(wallet.getAddress()).toBe(testKeypair.publicKey.toBase58());
      expect(mockReadFileSync).toHaveBeenCalledWith('/path/to/wallet.json', 'utf-8');
    });

    it('should throw if no wallet key or path provided', () => {
      expect(() => {
        new WalletManager({
          apiUrl: 'https://api.moltydex.com',
        });
      }).toThrow('Must provide walletPath or walletSecretKey in config');
    });

    it('should verify wallet address if provided and matching', () => {
      const wallet = new WalletManager({
        apiUrl: 'https://api.moltydex.com',
        walletSecretKey: testKeypair.secretKey,
        walletAddress: testKeypair.publicKey.toBase58(),
      });

      expect(wallet.getAddress()).toBe(testKeypair.publicKey.toBase58());
    });

    it('should throw on wallet address mismatch', () => {
      const otherKeypair = Keypair.generate();

      expect(() => {
        new WalletManager({
          apiUrl: 'https://api.moltydex.com',
          walletSecretKey: testKeypair.secretKey,
          walletAddress: otherKeypair.publicKey.toBase58(),
        });
      }).toThrow('Wallet address mismatch');
    });

    it('should use custom RPC URL', () => {
      const wallet = new WalletManager({
        apiUrl: 'https://api.moltydex.com',
        walletSecretKey: testKeypair.secretKey,
        rpcUrl: 'https://mainnet.helius-rpc.com/?api-key=TEST',
      });

      expect(wallet).toBeInstanceOf(WalletManager);
    });

    it('should use env RPC URL as fallback', () => {
      const origEnv = process.env.SOLANA_RPC_URL;
      process.env.SOLANA_RPC_URL = 'https://env-rpc.example.com';

      const wallet = new WalletManager({
        apiUrl: 'https://api.moltydex.com',
        walletSecretKey: testKeypair.secretKey,
      });

      expect(wallet).toBeInstanceOf(WalletManager);
      process.env.SOLANA_RPC_URL = origEnv;
    });
  });

  describe('getAddress', () => {
    it('should return base58 address string', () => {
      const wallet = new WalletManager({
        apiUrl: 'https://api.moltydex.com',
        walletSecretKey: testKeypair.secretKey,
      });

      const address = wallet.getAddress();
      expect(address).toBe(testKeypair.publicKey.toBase58());
      expect(address.length).toBeGreaterThanOrEqual(32);
      expect(address.length).toBeLessThanOrEqual(44);
    });
  });

  describe('publicKey', () => {
    it('should expose public key as PublicKey instance', () => {
      const wallet = new WalletManager({
        apiUrl: 'https://api.moltydex.com',
        walletSecretKey: testKeypair.secretKey,
      });

      expect(wallet.publicKey).toBeInstanceOf(PublicKey);
      expect(wallet.publicKey.equals(testKeypair.publicKey)).toBe(true);
    });
  });

  describe('getSOLBalance', () => {
    it('should return SOL balance as bigint', async () => {
      const wallet = new WalletManager({
        apiUrl: 'https://api.moltydex.com',
        walletSecretKey: testKeypair.secretKey,
      });

      const balance = await wallet.getSOLBalance();
      expect(balance).toBe(BigInt(1_000_000_000)); // 1 SOL from mock
    });
  });

  describe('signTransaction', () => {
    it('should sign a legacy transaction', async () => {
      const wallet = new WalletManager({
        apiUrl: 'https://api.moltydex.com',
        walletSecretKey: testKeypair.secretKey,
      });

      // Create a minimal legacy transaction
      const { Transaction, SystemProgram } = await import('@solana/web3.js');
      const tx = new Transaction();
      tx.recentBlockhash = 'GHtXQBtaLTAtNP89ckAcoUsYch2SgEGy1VWgCB7YFKJL';
      tx.feePayer = testKeypair.publicKey;
      tx.add(
        SystemProgram.transfer({
          fromPubkey: testKeypair.publicKey,
          toPubkey: Keypair.generate().publicKey,
          lamports: 1000,
        })
      );

      const txBase64 = tx.serialize({ requireAllSignatures: false }).toString('base64');
      const signed = await wallet.signTransaction(txBase64);

      expect(typeof signed).toBe('string');
      expect(signed.length).toBeGreaterThan(0);
    });
  });
});
