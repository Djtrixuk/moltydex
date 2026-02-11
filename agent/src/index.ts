/**
 * MoltyDEX SDK — x402 auto-pay agent and API client for Solana token swaps.
 *
 * @example
 * // Quick start with local wallet
 * import { HTTPInterceptor } from 'moltydex';
 * const interceptor = new HTTPInterceptor({ apiUrl: 'https://api.moltydex.com', walletPath: '~/.config/solana/id.json' });
 *
 * @example
 * // Bring your own wallet (MPC, hardware, custodial)
 * import { X402AutoPayAgent, TransactionSigner } from 'moltydex';
 * const signer: TransactionSigner = { getAddress: () => '...', signTransaction: async (tx) => '...' };
 * const agent = new X402AutoPayAgent({ apiUrl: 'https://api.moltydex.com', signer });
 */

export { X402AutoPayAgent } from './X402AutoPayAgent.js';
export { MoltyDEXClient } from './MoltyDEXClient.js';
export { WalletManager } from './WalletManager.js';
export { HTTPInterceptor } from './HTTPInterceptor.js';

// Re-export types — TransactionSigner is the key interface for custom wallet backends
export type { TransactionSigner, AgentConfig } from './types.js';
export * from './types.js';
