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
    symbol: 'MDEX',
    name: 'MoltyDEX',
    address: 'HndwegC6q7UGn5MErjvdH6BeQzcWQtjZf1nJX6rhpump',
    decimals: 6,
    logo: '/mdex-logo.png',
  },
  {
    symbol: 'POPCAT',
    name: 'Popcat',
    address: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr',
    decimals: 9,
    // Logo will be fetched from Jupiter token list or backend API
  },
  {
    symbol: 'JUP',
    name: 'Jupiter',
    address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    decimals: 6,
    logo: 'https://static.jup.ag/jup/icon.png',
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
 * Uses BigInt for precision with large numbers
 */
export function formatAmount(amount: string | number, decimals: number): string {
  try {
    // Convert to string and use BigInt for precision
    const amountStr = typeof amount === 'string' ? amount : amount.toString();
    if (!amountStr || amountStr === '0') return '0';
    
    // Use BigInt to avoid precision loss with large numbers
    const amountBigInt = BigInt(amountStr);
    const divisor = BigInt(10 ** decimals);
    
    // Calculate whole and fractional parts
    const whole = amountBigInt / divisor;
    const fractional = amountBigInt % divisor;
    
    // Format fractional part with leading zeros
    const fractionalStr = fractional.toString().padStart(decimals, '0');
    
    // Remove trailing zeros from fractional part
    const fractionalTrimmed = fractionalStr.replace(/0+$/, '');
    
    // Combine whole and fractional parts
    const wholeStr = whole.toString();
    
    // Add comma formatting for thousands
    const wholeFormatted = wholeStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    if (fractionalTrimmed === '') {
      return wholeFormatted;
    }
    
    return `${wholeFormatted}.${fractionalTrimmed}`;
  } catch (err) {
    // Fallback to old method if BigInt fails
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return '0';
    const divisor = Math.pow(10, decimals);
    return (num / divisor).toFixed(decimals).replace(/\.?0+$/, '');
  }
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
