/**
 * Wallet routes
 * Fetch all tokens owned by a wallet
 */

const express = require('express');
const router = express.Router();
const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID, TOKENS } = require('../config/constants');
const { fetchTokenMetadata } = require('../utils/tokenMetadata');
const { validateQuery } = require('../middleware/validation');

/**
 * GET /api/wallet/tokens
 * Get all tokens owned by a wallet with metadata and balances
 * Returns tokens sorted by balance (highest first)
 */
router.get('/tokens', validateQuery('walletTokens'), async (req, res) => {
  try {
    const { wallet_address } = req.query;

    if (!wallet_address) {
      return res.status(400).json({ error: 'Missing wallet_address' });
    }

    const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    const connection = new Connection(RPC_URL, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 30000,
    });

    const walletPubkey = new PublicKey(wallet_address);

    // Get SOL balance and all token accounts in parallel
    const [solBalance, tokenAccountsResponse] = await Promise.all([
      connection.getBalance(walletPubkey, 'confirmed'),
      connection.getParsedTokenAccountsByOwner(
        walletPubkey,
        { programId: TOKEN_PROGRAM_ID },
        'confirmed'
      ).catch(err => {
        console.error('[wallet/tokens] Error fetching token accounts:', err.message);
        return { value: [] };
      }),
    ]);

    const tokens = [];
    
    // Add SOL if balance > 0
    if (solBalance > 0n) {
      tokens.push({
        address: TOKENS.SOL,
        symbol: 'SOL',
        name: 'Solana',
        decimals: 9,
        balance: solBalance.toString(),
        balance_formatted: (solBalance / LAMPORTS_PER_SOL).toFixed(9).replace(/\.?0+$/, ''),
        logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
        has_balance: true,
      });
    }

    // Process token accounts
    const tokenAccounts = tokenAccountsResponse.value || [];
    const mintBalanceMap = new Map();

    // Aggregate balances for tokens with multiple accounts
    for (const account of tokenAccounts) {
      const parsedInfo = account.account?.data?.parsed?.info;
      if (!parsedInfo) continue;

      const mint = parsedInfo.mint;
      if (!mint) continue;

      const tokenAmount = parsedInfo.tokenAmount;
      const amount = BigInt(tokenAmount.amount || '0');
      const decimals = tokenAmount.decimals || 9;

      if (amount === 0n) continue; // Skip zero balances

      const mintLower = mint.toLowerCase();
      const existing = mintBalanceMap.get(mintLower);
      
      if (existing) {
        // Sum balances if multiple accounts for same mint
        mintBalanceMap.set(mintLower, {
          mint,
          balance: (BigInt(existing.balance) + amount).toString(),
          decimals,
        });
      } else {
        mintBalanceMap.set(mintLower, {
          mint,
          balance: amount.toString(),
          decimals,
        });
      }
    }

    // Fetch metadata for all tokens in parallel (limit to 50 for performance)
    const mintAddresses = Array.from(mintBalanceMap.values()).slice(0, 50);
    const metadataPromises = mintAddresses.map(async ({ mint, balance, decimals }) => {
      try {
        const metadata = await Promise.race([
          fetchTokenMetadata(connection, mint),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Metadata timeout')), 3000)
          )
        ]);

        const rawBalance = BigInt(balance);
        const formattedBalance = (Number(rawBalance) / Math.pow(10, decimals))
          .toFixed(decimals)
          .replace(/\.?0+$/, '');

        return {
          address: mint,
          symbol: metadata.symbol || 'Custom',
          name: metadata.name || `${mint.slice(0, 4)}...${mint.slice(-4)}`,
          decimals,
          balance: balance,
          balance_formatted: formattedBalance,
          logo: metadata.logo,
          has_balance: true,
        };
      } catch (err) {
        // If metadata fetch fails, still return token with basic info
        const rawBalance = BigInt(balance);
        const formattedBalance = (Number(rawBalance) / Math.pow(10, decimals))
          .toFixed(decimals)
          .replace(/\.?0+$/, '');

        return {
          address: mint,
          symbol: 'Custom',
          name: `${mint.slice(0, 4)}...${mint.slice(-4)}`,
          decimals,
          balance: balance,
          balance_formatted: formattedBalance,
          logo: undefined,
          has_balance: true,
        };
      }
    });

    const walletTokens = await Promise.all(metadataPromises);
    tokens.push(...walletTokens);

    // Sort by balance (highest first) - convert to number for comparison
    tokens.sort((a, b) => {
      const balanceA = parseFloat(a.balance_formatted || '0');
      const balanceB = parseFloat(b.balance_formatted || '0');
      return balanceB - balanceA;
    });

    res.json({
      wallet_address,
      tokens,
      count: tokens.length,
    });
  } catch (err) {
    console.error('[wallet/tokens] Error:', err.message);
    res.status(500).json({
      error: 'Failed to fetch wallet tokens',
      message: err.message,
    });
  }
});

module.exports = router;
