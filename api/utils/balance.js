/**
 * Token balance utilities
 */

const { PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { Connection } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID, TOKENS, DEFAULTS } = require('../config/constants');

/**
 * Get SOL balance for a wallet
 * @param {Connection} connection - Solana connection
 * @param {PublicKey} walletPubkey - Wallet public key
 * @returns {Promise<{balance: string, balance_sol: string, decimals: number}>}
 */
async function getSolBalance(connection, walletPubkey) {
  const balance = await connection.getBalance(walletPubkey);
  return {
    balance: balance.toString(),
    balance_sol: (balance / LAMPORTS_PER_SOL).toFixed(9),
    decimals: 9,
  };
}

/**
 * Get SPL token balance for a wallet with retry logic
 * @param {Connection} connection - Solana connection
 * @param {PublicKey} walletPubkey - Wallet public key
 * @param {PublicKey} tokenMintPubkey - Token mint public key
 * @returns {Promise<{balance: string, decimals: number, has_balance: boolean}>}
 */
async function getTokenBalance(connection, walletPubkey, tokenMintPubkey) {
  const tokenMintStr = tokenMintPubkey.toString();
  let lastError = null;

  // Debug logging for USDC and JUP
  const isUSDC = tokenMintStr === 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
  const isJUP = tokenMintStr.toLowerCase() === 'jupyiwryjfskupiha7hker8vutaefosybkedznsdvcn';
  if (isUSDC || isJUP) {
    console.log(`[balance.js] getTokenBalance - ${isUSDC ? 'USDC' : 'JUP'} lookup:`, {
      wallet: walletPubkey.toString(),
      tokenMint: tokenMintStr,
    });
  }

  for (let attempt = 0; attempt < DEFAULTS.MAX_RETRIES; attempt++) {
    try {
      // For pump.fun tokens, we need to check both TOKEN_PROGRAM_ID and potentially Token2022
      // But most pump.fun tokens use standard TOKEN_PROGRAM_ID, so we'll try that first
      // If it fails, we could add Token2022 support later
      // Use confirmed commitment for faster response and add timeout to prevent hanging
      const response = await Promise.race([
        connection.getParsedTokenAccountsByOwner(
          walletPubkey,
          { programId: TOKEN_PROGRAM_ID },
          'confirmed'
        ),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('RPC timeout after 25 seconds')), 25000)
        )
      ]).catch(err => {
        if (err.message.includes('timeout')) {
          throw new Error(`Balance fetch timed out after 25 seconds for token ${tokenMintStr}`);
        }
        throw err;
      });

      const allTokenAccounts = response.value || [];
      
      if (isUSDC || isJUP) {
        console.log(`[balance.js] getTokenBalance - Found token accounts for ${isUSDC ? 'USDC' : 'JUP'}:`, {
          totalAccounts: allTokenAccounts.length,
          accountMints: allTokenAccounts.map(acc => {
            const parsedInfo = acc.account?.data?.parsed?.info;
            return parsedInfo?.mint || 'unknown';
          }),
        });
      }
      
      const matchingAccounts = allTokenAccounts.filter((account) => {
        const parsedInfo = account.account?.data?.parsed?.info;
        if (!parsedInfo) return false;
        // Use case-insensitive comparison for mint addresses
        const matches = parsedInfo.mint.toLowerCase() === tokenMintStr.toLowerCase();
        
        if (isUSDC || isJUP) {
          console.log(`[balance.js] getTokenBalance - Comparing for ${isUSDC ? 'USDC' : 'JUP'}:`, {
            accountMint: parsedInfo.mint,
            targetMint: tokenMintStr,
            matches,
          });
        }
        
        return matches;
      });

      if (matchingAccounts.length === 0) {
        if (isUSDC || isJUP) {
          console.log(`[balance.js] getTokenBalance - No matching ${isUSDC ? 'USDC' : 'JUP'} accounts found`);
        }
        return {
          balance: '0',
          decimals: 9,
          has_balance: false,
        };
      }

      // Sum balances from all matching accounts
      let totalBalance = 0n;
      let decimals = 9;

      for (const tokenAccount of matchingAccounts) {
        const parsedInfo = tokenAccount.account.data.parsed.info;
        const tokenAmount = parsedInfo.tokenAmount;
        const amount = BigInt(tokenAmount.amount);
        totalBalance += amount;
        decimals = tokenAmount.decimals || decimals;
        
        if (isUSDC || isJUP) {
          console.log(`[balance.js] getTokenBalance - ${isUSDC ? 'USDC' : 'JUP'} account details:`, {
            amount: tokenAmount.amount,
            decimals: tokenAmount.decimals,
            uiAmount: tokenAmount.uiAmount,
            uiAmountString: tokenAmount.uiAmountString,
          });
        }
      }

      const result = {
        balance: totalBalance.toString(),
        decimals,
        has_balance: totalBalance > 0n,
      };
      
      if (isUSDC || isJUP) {
        console.log(`[balance.js] getTokenBalance - ${isUSDC ? 'USDC' : 'JUP'} result:`, result);
      }
      
      return result;
    } catch (err) {
      lastError = err;
      const errorMsg = err.message || String(err);
      const isRateLimit =
        errorMsg.includes('429') ||
        errorMsg.includes('Too Many Requests') ||
        errorMsg.includes('rate limit');

      if (isRateLimit && attempt < DEFAULTS.MAX_RETRIES - 1) {
        const waitTime = Math.pow(2, attempt) * DEFAULTS.RETRY_BACKOFF_BASE;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }

      break;
    }
  }

  // If rate limited, throw specific error
  const errorMsg = lastError?.message || 'Token account lookup failed';
  const isRateLimit =
    errorMsg.includes('429') ||
    errorMsg.includes('Too Many Requests') ||
    errorMsg.includes('rate limit');

  if (isRateLimit) {
    const rateLimitError = new Error('RPC rate limit exceeded. Please try again in a moment.');
    rateLimitError.statusCode = 429;
    rateLimitError.retryAfter = 60;
    throw rateLimitError;
  }

  throw lastError || new Error('Token account lookup failed');
}

/**
 * Get balance (SOL or SPL token) for a wallet
 * @param {Connection} connection - Solana connection
 * @param {string} walletAddress - Wallet address
 * @param {string} tokenMint - Token mint address (optional, defaults to SOL)
 * @returns {Promise<Object>}
 */
async function getBalance(connection, walletAddress, tokenMint = null) {
  const walletPubkey = new PublicKey(walletAddress);

  // Return SOL balance if no token_mint or if SOL
  if (!tokenMint || tokenMint === TOKENS.SOL) {
    const solBalance = await getSolBalance(connection, walletPubkey);
    return {
      wallet_address: walletAddress,
      token_mint: TOKENS.SOL,
      ...solBalance,
    };
  }

  // Get SPL token balance
  const tokenMintPubkey = new PublicKey(tokenMint);
  const tokenBalance = await getTokenBalance(connection, walletPubkey, tokenMintPubkey);

  return {
    wallet_address: walletAddress,
    token_mint: tokenMint,
    ...tokenBalance,
  };
}

module.exports = {
  getBalance,
  getSolBalance,
  getTokenBalance,
};
