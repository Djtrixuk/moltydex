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

export interface TokenMetadata {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  logo?: string;
}

export interface BatchBalanceResult {
  token_mint: string;
  success: boolean;
  data?: BalanceResponse;
  error?: string;
}

export interface BatchQuoteResult {
  request: { input_mint: string; output_mint: string; amount: string };
  success: boolean;
  data?: QuoteResponse;
  error?: string;
}

export interface SimulationResult {
  simulation: boolean;
  ready: boolean;
  has_sufficient_balance: boolean;
  current_balance: string;
  required_amount: string;
  swap_needed: boolean;
  swap_details?: {
    input_token: string;
    output_token: string;
    input_amount: string;
    output_amount: string;
    fee_amount: string;
    price_impact: string;
  };
  validation?: {
    balance_sufficient_after_swap?: boolean;
    price_impact_acceptable?: boolean;
    quote_fresh?: boolean;
  };
}

export interface AgentConfig {
  apiUrl: string;
  walletPath?: string;
  walletSecretKey?: Uint8Array | number[] | string; // Can be Uint8Array, array of numbers, or base58 string
  walletAddress?: string; // Optional: for display/verification
  preferredInputToken?: string; // Default: SOL
  webhookUrl?: string;
  autoSwap?: boolean; // Auto-execute swaps if needed
  maxRetries?: number;
  retryDelay?: number; // milliseconds
  rpcUrl?: string; // Optional: override RPC URL
  maxPaymentAmount?: string; // Max payment in lamports (default: 1 SOL = 1_000_000_000)
}
