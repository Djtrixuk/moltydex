/**
 * Type definitions for x402 Auto-Pay Agent
 */

export interface PaymentRequirement {
  network: string;
  asset: string; // Token mint address
  amount: string; // Amount in smallest unit (lamports/decimals)
  address?: string; // Payment recipient address
  token_mint?: string; // Alternative field name
  amount_required?: string; // Alternative field name
}

export interface PaymentResponse {
  accepts: PaymentRequirement[];
}

export interface ParsedPayment {
  payment_requirements: PaymentRequirement[];
  recommended: PaymentRequirement;
  total_options: number;
}

export interface BalanceResponse {
  wallet_address: string;
  token_mint: string;
  balance: string;
  decimals: number;
  has_balance?: boolean;
}

export interface QuoteResponse {
  output_amount: string;
  output_after_fee: string;
  fee_amount: string;
  fee_bps: number;
  input_amount: string;
  price_impact?: string;
}

export interface SwapBuildResponse {
  transaction: string; // Base64 encoded transaction
  fee_amount: string;
  output_amount: string;
  output_after_fee: string;
  fee_bps: number;
}

export interface TransactionSendResponse {
  signature: string;
  status?: string;
  message?: string;
}

export interface TransactionStatus {
  signature: string;
  status: string;
  confirmed: boolean;
  confirmation_status?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface AutoPayResult {
  success: boolean;
  payment_signature?: string;
  swap_signature?: string;
  payment_proof?: string;
  error?: string;
  message?: string;
}

/**
 * TransactionSigner — pluggable wallet interface.
 *
 * Any wallet backend (local keypair, MPC, hardware, custodial)
 * can implement this interface and be used with MoltyDEX.
 *
 * @example
 * // Use the built-in WalletManager (local keypair)
 * const signer = new WalletManager({ walletPath: '~/.config/solana/id.json', rpcUrl });
 *
 * // Or bring your own signer
 * const signer: TransactionSigner = {
 *   getAddress: () => '7xKXtg...',
 *   signTransaction: async (txBase64) => { ... return signedBase64; },
 * };
 *
 * const agent = new X402AutoPayAgent({ apiUrl, signer });
 */
export interface TransactionSigner {
  /** Returns the wallet's public key as a base58 string. */
  getAddress(): string;

  /**
   * Signs a base64-encoded Solana transaction and returns the
   * signed transaction as a base64 string.
   */
  signTransaction(transactionBase64: string): Promise<string>;

  /**
   * Optionally builds a payment transaction (SOL or SPL token).
   * If not implemented, the agent will use the MoltyDEX API to build transactions.
   */
  buildPaymentTransaction?(
    recipientAddress: string,
    tokenMint: string,
    amount: string,
  ): Promise<string>;
}

export interface AgentConfig {
  apiUrl: string;

  // Option 1: Provide a TransactionSigner directly (recommended for custom wallets / MPC)
  signer?: TransactionSigner;

  // Option 2: Let WalletManager create one from key material (backwards-compatible)
  walletPath?: string;
  walletSecretKey?: Uint8Array | number[] | string; // Can be Uint8Array, array of numbers, or base58 string
  walletAddress?: string; // Optional: for display/verification

  preferredInputToken?: string; // Default: SOL
  webhookUrl?: string;
  autoSwap?: boolean; // Auto-execute swaps if needed
  maxRetries?: number;
  retryDelay?: number; // milliseconds
  rpcUrl?: string; // Optional: override RPC URL
}
