/**
 * Popular tokens for human-friendly UI
 */
export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logo?: string;
}

export const POPULAR_TOKENS: Token[] = [
  {
    symbol: 'SOL',
    name: 'Solana',
    address: 'So11111111111111111111111111111111111111112',
    decimals: 9,
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    decimals: 6,
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    decimals: 6,
    logo: 'https://coin-images.coingecko.com/coins/images/325/large/Tether.png?1696501661',
  },
  {
    symbol: 'BONK',
    name: 'Bonk',
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    decimals: 5,
    logo: 'https://coin-images.coingecko.com/coins/images/28600/large/bonk.jpg?1696527587',
  },
  {
    symbol: 'WIF',
    name: 'dogwifhat',
    address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
    decimals: 6,
    logo: 'https://coin-images.coingecko.com/coins/images/33566/large/dogwifhat.jpg?1702499428',
  },
  {
    symbol: 'RAY',
    name: 'Raydium',
    address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    decimals: 6,
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png',
  },
  {
    symbol: 'PYTH',
    name: 'Pyth Network',
    address: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3',
    decimals: 6,
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3/logo.png',
  },
  {
    symbol: 'JitoSOL',
    name: 'Jito Staked SOL',
    address: 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
    decimals: 9,
    logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn/logo.png',
  },
];

export function getTokenByAddress(address: string): Token | undefined {
  return POPULAR_TOKENS.find(t => t.address === address);
}

export function getTokenBySymbol(symbol: string): Token | undefined {
  return POPULAR_TOKENS.find(t => t.symbol.toUpperCase() === symbol.toUpperCase());
}

/**
 * Convert human-readable amount to lamports
 */
export function parseAmount(amount: string, decimals: number): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return '0';
  return Math.floor(num * Math.pow(10, decimals)).toString();
}

/**
 * Convert lamports to human-readable amount
 */
export function formatAmount(amount: string | number, decimals: number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0';
  const divisor = Math.pow(10, decimals);
  return (num / divisor).toFixed(decimals).replace(/\.?0+$/, '');
}

/**
 * Format error messages for display
 */
export function formatErrorMessage(error: unknown): string {
  const message = typeof error === 'string' ? error : (error instanceof Error ? error.message : String(error));
  const errorMap: Record<string, string> = {
    'failed to fetch': 'Couldn\'t reach the API. Check your connection and try again.',
    'insufficient funds': 'You don\'t have enough SOL or tokens for this swap and fees.',
    'slippage': 'Price moved. Try again or refetch quote.',
    'slippage exceeded': 'Price moved too much. Refetch quote and try again.',
    'block height': 'Transaction expired. Get a new quote and try again.',
    'blockhash': 'Transaction expired. Refetch quote and swap again.',
    'network error': 'Network issue. Check your connection and try again.',
    'user rejected': 'Transaction was cancelled.',
    'transaction failed': 'Transaction failed. Try again or refetch quote.',
    'simulation failed': 'Transaction would fail (e.g. balance or slippage). Try a smaller amount or refetch quote.',
    'confirmation timeout': 'Transaction was sent. Check your wallet or Solscan for confirmation.',
  };

  const lower = message.toLowerCase();
  for (const [key, value] of Object.entries(errorMap)) {
    if (lower.includes(key.toLowerCase())) return value;
  }
  return message;
}
