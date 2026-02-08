/**
 * Token metadata fetching utilities
 * Fetches token name, symbol, and logo from multiple sources
 */

const axios = require('axios');
const { PublicKey } = require('@solana/web3.js');
const { Connection } = require('@solana/web3.js');
const { EXTERNAL_APIS, METADATA_PROGRAM_ID, PUMPFUN_PROGRAM_ID, DEFAULTS, TOKENS } = require('../config/constants');

/**
 * Fetch token metadata from multiple sources
 * @param {Connection} connection - Solana connection
 * @param {string} mint - Token mint address
 * @returns {Promise<{symbol: string, name: string, logo?: string}>}
 */
async function fetchTokenMetadata(connection, mint) {
  const mintPubkey = new PublicKey(mint);
  let symbol = 'Custom';
  let name = `${mint.slice(0, 4)}...${mint.slice(-4)}`;
  let logo = undefined;

  // 0. Special handling for native SOL
  if (mint.toLowerCase() === TOKENS.SOL.toLowerCase()) {
    return {
      symbol: 'SOL',
      name: 'Solana',
      logo: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
    };
  }

  // 1. Try Jupiter's token list (fastest, but limited)
  // Use longer timeout for well-known tokens - Jupiter's list is the most reliable source
  try {
    const jupiterResponse = await axios.get(EXTERNAL_APIS.JUPITER_TOKEN_LIST, {
      timeout: 5000, // 5 seconds - increased timeout for reliability
    });
    const jupiterToken = jupiterResponse.data.find(
      (t) => t.address.toLowerCase() === mint.toLowerCase() && (t.chainId === 101 || t.chainId === 103)
    );
    if (jupiterToken) {
      symbol = jupiterToken.symbol || symbol;
      name = jupiterToken.name || name;
      logo = jupiterToken.logoURI;
      // If we got good data from Jupiter, return early to save time
      // Even if symbol is "Custom", if we have a name and logo from Jupiter, use it
      if (symbol !== 'Custom' || (name && !name.includes('...') && logo)) {
        return { symbol, name, logo };
      }
    }
  } catch (err) {
    // Log error but continue to other sources
    console.warn(`[tokenMetadata] Jupiter token list fetch failed for ${mint}:`, err.message);
  }

  // 2. Try Pump.fun API for pump.fun tokens (addresses ending in 'pump')
  // Handle redirects properly by following them
  if (mint.toLowerCase().endsWith('pump') && (symbol === 'Custom' || !logo)) {
    try {
      const pumpApiUrl = `${EXTERNAL_APIS.PUMPAPI_TOKEN}/${mint}/metadata`;
      const pumpResponse = await axios.get(pumpApiUrl, {
        timeout: 8000, // 8 second timeout
        maxRedirects: 5, // Follow redirects
        validateStatus: (status) => status < 500, // Don't throw on 3xx/4xx
      });
      
      if (pumpResponse.status === 200 && pumpResponse.data) {
        const pumpData = pumpResponse.data;
        if (pumpData.symbol && symbol === 'Custom') symbol = pumpData.symbol;
        if (pumpData.name && name.includes('...')) name = pumpData.name;
        // Pump.fun API returns image URL that redirects - we'll use it anyway
        if (pumpData.image && !logo) {
          logo = pumpData.image;
        }
        // If we got good data, return early
        if (symbol !== 'Custom' || (name && !name.includes('...'))) {
          return { symbol, name, logo };
        }
      }
    } catch (err) {
      // Pump.fun API failed - continue to other sources
      console.warn(`[tokenMetadata] Pump.fun API fetch failed for ${mint}:`, err.message);
    }
  }

  // 3. Skip SolanaFM API - unreliable (502 errors)
  // Skip CoinGecko (too slow) and try Metaplex on-chain metadata (faster)
  // This is the last resort before returning defaults

  // 5. Try Metaplex metadata directly from chain (with timeout)
  if (symbol === 'Custom' || name.includes('...') || !logo) {
    try {
      const [metadataPDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('metadata'),
          METADATA_PROGRAM_ID.toBuffer(),
          mintPubkey.toBuffer(),
        ],
        METADATA_PROGRAM_ID
      );

      const metadataAccount = await Promise.race([
        connection.getAccountInfo(metadataPDA),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
      ]);
      
      if (metadataAccount && metadataAccount.data.length > 0) {
        const parsed = parseMetaplexMetadata(metadataAccount.data);
        if (parsed.name && name.includes('...')) name = parsed.name;
        if (parsed.symbol && symbol === 'Custom') symbol = parsed.symbol;
        
        // Fetch logo from Metaplex URI if we don't have one yet
        if (!logo && parsed.uri) {
          try {
            const logoFromUri = await fetchLogoFromUri(parsed.uri);
            if (logoFromUri) logo = logoFromUri;
          } catch (uriErr) {
            // Logo fetch from URI failed - continue without it
            console.warn(`Failed to fetch logo from URI ${parsed.uri}:`, uriErr.message);
          }
        }
      }
    } catch (err) {
      // Metaplex fetch failed or timed out - use defaults
    }
  }

  return { symbol, name, logo };
}

/**
 * Parse Metaplex Token Metadata v1 structure
 * @param {Buffer} data - Account data buffer
 * @returns {{name?: string, symbol?: string, uri?: string}}
 */
function parseMetaplexMetadata(data) {
  let offset = 1 + 32 + 32; // Skip key(1), update_authority(32), mint(32)
  const result = {};

  // Read name
  if (offset + 4 <= data.length) {
    const nameLen = data.readUInt32LE(offset);
    offset += 4;
    if (nameLen > 0 && nameLen < 200 && offset + nameLen <= data.length) {
      const nameBytes = data.slice(offset, offset + nameLen);
      result.name = nameBytes.toString('utf8').replace(/\0/g, '').trim();
      offset += nameLen;
    }
  }

  // Read symbol
  if (offset + 4 <= data.length) {
    const symbolLen = data.readUInt32LE(offset);
    offset += 4;
    if (symbolLen > 0 && symbolLen < 50 && offset + symbolLen <= data.length) {
      const symbolBytes = data.slice(offset, offset + symbolLen);
      result.symbol = symbolBytes.toString('utf8').replace(/\0/g, '').trim();
      offset += symbolLen;
    }
  }

  // Read URI
  if (offset + 4 <= data.length) {
    const uriLen = data.readUInt32LE(offset);
    offset += 4;
    if (uriLen > 0 && uriLen < 500 && offset + uriLen <= data.length) {
      const uriBytes = data.slice(offset, offset + uriLen);
      result.uri = uriBytes.toString('utf8').replace(/\0/g, '').trim();
    }
  }

  return result;
}

/**
 * Fetch logo from URI (IPFS or HTTP)
 * @param {string} uri - Metadata URI
 * @returns {Promise<string|undefined>}
 */
async function fetchLogoFromUri(uri) {
  if (!uri || (!uri.startsWith('http://') && !uri.startsWith('https://') && !uri.startsWith('ipfs://'))) {
    return undefined;
  }

  try {
    const metadataUrl = uri.startsWith('ipfs://')
      ? `https://ipfs.io/ipfs/${uri.replace('ipfs://', '')}`
      : uri;
    const uriResponse = await axios.get(metadataUrl, { timeout: DEFAULTS.METADATA_TIMEOUT });
    const uriData = uriResponse.data;
    return uriData?.image;
  } catch (err) {
    return undefined;
  }
}

module.exports = {
  fetchTokenMetadata,
};
