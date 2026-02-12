/**
 * Solana RPC Proxy
 * Keeps the Alchemy/Helius API key server-side only.
 * The frontend sends JSON-RPC requests here instead of directly to the provider.
 */

import type { NextApiRequest, NextApiResponse } from 'next';

// Server-side only — never exposed to the client bundle
const RPC_URL =
  process.env.SOLANA_RPC_URL ||
  process.env.NEXT_PUBLIC_SOLANA_RPC || // Fallback during migration
  'https://api.mainnet-beta.solana.com';

// Allowed JSON-RPC methods (read-only — no sendTransaction through the proxy)
const ALLOWED_METHODS = new Set([
  'getAccountInfo',
  'getBalance',
  'getBlock',
  'getBlockHeight',
  'getBlockTime',
  'getClusterNodes',
  'getEpochInfo',
  'getEpochSchedule',
  'getFeeForMessage',
  'getFirstAvailableBlock',
  'getGenesisHash',
  'getHealth',
  'getHighestSnapshotSlot',
  'getLatestBlockhash',
  'getMinimumBalanceForRentExemption',
  'getMultipleAccounts',
  'getProgramAccounts',
  'getRecentPerformanceSamples',
  'getSignatureStatuses',
  'getSignaturesForAddress',
  'getSlot',
  'getSlotLeader',
  'getStakeMinimumDelegation',
  'getSupply',
  'getTokenAccountBalance',
  'getTokenAccountsByOwner',
  'getTokenLargestAccounts',
  'getTokenSupply',
  'getTransaction',
  'getTransactionCount',
  'getVersion',
  'getVoteAccounts',
  'isBlockhashValid',
  'minimumLedgerSlot',
  'simulateTransaction',
]);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;

    // Validate JSON-RPC structure
    if (!body || !body.method || !body.jsonrpc) {
      return res.status(400).json({ error: 'Invalid JSON-RPC request' });
    }

    // Block disallowed methods
    if (!ALLOWED_METHODS.has(body.method)) {
      return res.status(403).json({
        error: `Method "${body.method}" is not allowed through the RPC proxy`,
      });
    }

    const upstream = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (error: any) {
    console.error('[rpc-proxy] Error:', error.message);
    return res.status(502).json({ error: 'RPC proxy error' });
  }
}
