/**
 * Wallet Manager
 * Handles wallet loading and transaction signing
 */

import {
  Keypair,
  Transaction,
  VersionedTransaction,
  Connection,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import * as fs from 'fs';
import bs58 from 'bs58';
import type { AgentConfig, TransactionSigner } from './types.js';

export class WalletManager implements TransactionSigner {
  private keypair: Keypair;
  private connection: Connection;
  public readonly publicKey: PublicKey;

  constructor(config: AgentConfig) {
    // Load wallet - support multiple formats
    if (config.walletSecretKey) {
      // Handle different secret key formats
      let secretKey: Uint8Array;
      
      if (typeof config.walletSecretKey === 'string') {
        // Base58 string format
        secretKey = new Uint8Array(bs58.decode(config.walletSecretKey));
      } else if (Array.isArray(config.walletSecretKey)) {
        // Array of numbers format
        secretKey = Uint8Array.from(config.walletSecretKey);
      } else {
        // Already Uint8Array
        secretKey = config.walletSecretKey;
      }
      
      this.keypair = Keypair.fromSecretKey(secretKey);
    } else if (config.walletPath) {
      const keyData = JSON.parse(fs.readFileSync(config.walletPath, 'utf-8'));
      this.keypair = Keypair.fromSecretKey(Uint8Array.from(keyData));
    } else {
      throw new Error('Must provide walletPath or walletSecretKey in config');
    }

    this.publicKey = this.keypair.publicKey;
    
    // Verify wallet address if provided
    if (config.walletAddress) {
      const expectedPubkey = new PublicKey(config.walletAddress);
      if (!this.publicKey.equals(expectedPubkey)) {
        throw new Error(
          `Wallet address mismatch. Expected: ${config.walletAddress}, Got: ${this.publicKey.toBase58()}`
        );
      }
    }
    
    // Initialize RPC connection
    const rpcUrl = config.rpcUrl || process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    this.connection = new Connection(rpcUrl, 'confirmed');
  }

  /**
   * Get wallet address as string
   */
  getAddress(): string {
    return this.publicKey.toBase58();
  }

  /**
   * Sign a transaction
   */
  async signTransaction(transactionBase64: string): Promise<string> {
    const txBytes = Buffer.from(transactionBase64, 'base64');
    
    // Try versioned transaction first
    try {
      const versionedTx = VersionedTransaction.deserialize(txBytes);
      versionedTx.sign([this.keypair]);
      return Buffer.from(versionedTx.serialize()).toString('base64');
    } catch {
      // Fall back to legacy transaction
      const legacyTx = Transaction.from(txBytes);
      legacyTx.sign(this.keypair);
      return legacyTx.serialize({ requireAllSignatures: false }).toString('base64');
    }
  }

  /**
   * Build a payment transaction (SOL or SPL token)
   */
  async buildPaymentTransaction(
    recipientAddress: string,
    tokenMint: string,
    amount: string
  ): Promise<string> {
    const recipientPubkey = new PublicKey(recipientAddress);
    const mintPubkey = new PublicKey(tokenMint);
    const { blockhash } = await this.connection.getLatestBlockhash();
    
    const transaction = new Transaction();
    
    // SOL transfers
    if (tokenMint === 'So11111111111111111111111111111111111111112') {
      const lamports = BigInt(amount);
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: this.publicKey,
          toPubkey: recipientPubkey,
          lamports: Number(lamports),
        })
      );
    } else {
      // SPL token transfers
      // Get sender's associated token account
      const senderTokenAccount = await getAssociatedTokenAddress(
        mintPubkey,
        this.publicKey
      );
      
      // Get recipient's associated token account
      const recipientTokenAccount = await getAssociatedTokenAddress(
        mintPubkey,
        recipientPubkey
      );
      
      // Check if sender has token account (will be created if needed during swap)
      try {
        await getAccount(this.connection, senderTokenAccount);
      } catch (error) {
        throw new Error(
          `No token account found for ${tokenMint}. ` +
          `You may need to receive tokens first or create the account.`
        );
      }
      
      // Check if recipient has token account, create if needed
      let recipientAccountExists = false;
      try {
        await getAccount(this.connection, recipientTokenAccount);
        recipientAccountExists = true;
      } catch (error) {
        // Recipient doesn't have token account, create it
        console.log(`[Payment] Creating recipient token account: ${recipientTokenAccount.toBase58()}`);
        transaction.add(
          createAssociatedTokenAccountInstruction(
            this.publicKey, // Payer (we pay for account creation)
            recipientTokenAccount, // New account address
            recipientPubkey, // Owner
            mintPubkey, // Mint
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          )
        );
      }
      
      if (recipientAccountExists) {
        console.log(`[Payment] Recipient token account exists: ${recipientTokenAccount.toBase58()}`);
      }
      
      // Create transfer instruction
      transaction.add(
        createTransferInstruction(
          senderTokenAccount,
          recipientTokenAccount,
          this.publicKey,
          BigInt(amount),
          [],
          TOKEN_PROGRAM_ID
        )
      );
    }
    
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = this.publicKey;
    
    return transaction.serialize({ requireAllSignatures: false }).toString('base64');
  }

  /**
   * Get SOL balance
   */
  async getSOLBalance(): Promise<bigint> {
    const balance = await this.connection.getBalance(this.publicKey);
    return BigInt(balance);
  }
}
