/**
 * Known logo URLs for popular tokens
 * Used as fallback when API doesn't return logos
 */

// Known logo URLs for popular tokens
// These are fallbacks - Jupiter's token list API will be used first
const POPULAR_TOKEN_LOGOS: Record<string, string> = {
  // Major tokens with guaranteed logos
  'So11111111111111111111111111111111111111112': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png', // USDC
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': 'https://coin-images.coingecko.com/coins/images/325/large/Tether.png?1696501661', // USDT
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263': 'https://coin-images.coingecko.com/coins/images/28600/large/bonk.jpg?1696527587', // BONK
  'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm': 'https://coin-images.coingecko.com/coins/images/33566/large/dogwifhat.jpg?1702499428', // WIF
  '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png', // RAY
  'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3': 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3/logo.png', // PYTH
  'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN': 'https://static.jup.ag/jup/icon.png', // JUP
  'jupyiwryjfskupiha7hker8vutaefosybkedznsdvcn': 'https://static.jup.ag/jup/icon.png', // JUP (lowercase)
  'HndwegC6q7UGn5MErjvdH6BeQzcWQtjZf1nJX6rhpump': '/mdex-logo.png', // MDEX (MoltyDEX)
  'hndwegc6q7ugn5merjvdh6beqzcwqtjzf1njx6rhpump': '/mdex-logo.png', // MDEX (lowercase)
  
  // Pump.fun tokens (using DexScreener CDN for reliable logos)
  'a3W4qutoEJA4232T2gwZUfgYJTetr96pU4SJMwppump': 'https://cdn.dexscreener.com/cms/images/46023f12cc0f15eb355d1c2432714fc6cb52e2215695af82a1fcc8a503a265aa?width=800&height=800&quality=90', // WhiteWhale
  '8Jx8AAHj86wbQgUTjGuj6GTTL5Ps3cqxKRTvpaJApump': 'https://pumpapi.fun/api/token/8Jx8AAHj86wbQgUTjGuj6GTTL5Ps3cqxKRTvpaJApump/image', // PENGUIN
  'BwTu5zJqEyLYawwYoGTWT7UxC85eLYQWRcta1GiEbonk': 'https://pumpapi.fun/api/token/BwTu5zJqEyLYawwYoGTWT7UxC85eLYQWRcta1GiEbonk/image', // URA (Uranus)
  'Cm6fNnMk7NfzStP9CZpsQA2v3jjzbcYGAxdJySmHpump': 'https://cdn.dexscreener.com/cms/images/baf3d4bdaac47ef59f32c8ddc11f83e995f351be1eef6d4d192d72ff8def0020?width=800&height=800&quality=90', // Buttcoin
  'cm6fnnmk7nfzstp9czpsqa2v3jjzbcygaxdjysmhpump': 'https://cdn.dexscreener.com/cms/images/baf3d4bdaac47ef59f32c8ddc11f83e995f351be1eef6d4d192d72ff8def0020?width=800&height=800&quality=90', // Buttcoin (lowercase)
};

/**
 * Get known logo URL for a token address
 */
export function getKnownTokenLogo(address: string): string | undefined {
  const addrLower = address.toLowerCase();
  return POPULAR_TOKEN_LOGOS[address] || POPULAR_TOKEN_LOGOS[addrLower];
}
