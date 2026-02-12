/**
 * Application constants and configuration
 */

const { PublicKey } = require('@solana/web3.js');
const splToken = require('@solana/spl-token');

// Solana Program IDs
const TOKEN_PROGRAM_ID = splToken.TOKEN_PROGRAM_ID || new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const ASSOCIATED_TOKEN_PROGRAM_ID = splToken.ASSOCIATED_TOKEN_PROGRAM_ID || new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
const METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
const PUMPFUN_PROGRAM_ID = new PublicKey('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P');

// Common token addresses
const TOKENS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
};

// Agent-friendly tokens (commonly used by AI agents)
const AGENT_FRIENDLY_TOKENS = [
  TOKENS.SOL,
  TOKENS.USDC,
  TOKENS.USDT,
  'a3W4qutoEJA4232T2gwZUfgYJTetr96pU4SJMwppump', // WhiteWhale
  '8Jx8AAHj86wbQgUTjGuj6GTTL5Ps3cqxKRTvpaJApump', // PENGUIN (Nietzschean Penguin)
  'BwTu5zJqEyLYawwYoGTWT7UxC85eLYQWRcta1GiEbonk', // URA (Uranus)
  'Cm6fNnMk7NfzStP9CZpsQA2v3jjzbcYGAxdJySmHpump', // BUTT (Buttcoin)
  '6KmwvVo8gDUVAnoAftMuyUTojfx6xtgm2xkHp2ixpump', // DELUSIONAL
];

// Commonly accepted tokens for x402 payments
const COMMONLY_ACCEPTED_TOKENS = [
  TOKENS.SOL,
  TOKENS.USDC,
  TOKENS.USDT,
];

// Jupiter API endpoints (fallback order)
// IMPORTANT: As of 2026, Jupiter requires API keys for api.jup.ag/swap/v1
// The endpoint returns 401 Unauthorized without an API key
// We prioritize api.jup.ag with API key, but also try without if no key is set
const JUPITER_ENDPOINTS = [
  'https://api.jup.ag/swap/v1',  // Primary endpoint (requires API key for free tier)
];

// External API endpoints
const EXTERNAL_APIS = {
  JUPITER_TOKEN_LIST: 'https://token.jup.ag/all',
  SOLANAFM_TOKEN: 'https://api.solana.fm/v1/tokens',
  COINGECKO_SOLANA_CONTRACT: 'https://api.coingecko.com/api/v3/coins/solana/contract',
  PUMPAPI_TOKEN: 'https://pumpapi.fun/api/token',
};

// Default values
const DEFAULTS = {
  FEE_BPS: 0, // 0% — fees are currently disabled (set via FEE_BPS env var to enable)
  SLIPPAGE_BPS: 50, // 0.5%
  QUOTE_TIMEOUT: 8000, // 8 seconds - reduced for Vercel function limits
  METADATA_TIMEOUT: 2000, // 2 seconds - reduced for faster responses
  MAX_RETRIES: 3,
  RETRY_BACKOFF_BASE: 1000, // 1 second
};

module.exports = {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  METADATA_PROGRAM_ID,
  PUMPFUN_PROGRAM_ID,
  TOKENS,
  AGENT_FRIENDLY_TOKENS,
  COMMONLY_ACCEPTED_TOKENS,
  JUPITER_ENDPOINTS,
  EXTERNAL_APIS,
  DEFAULTS,
};
