/**
 * Solana utility functions
 */

const { PublicKey } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } = require('../config/constants');

/**
 * Derive associated token account address (PDA)
 * @param {PublicKey} mint - Token mint address
 * @param {PublicKey} owner - Token account owner
 * @param {boolean} allowOwnerOffCurve - Allow off-curve owner (default: false)
 * @param {PublicKey} programId - Token program ID (default: TOKEN_PROGRAM_ID)
 * @param {PublicKey} associatedTokenProgramId - Associated token program ID
 * @returns {Promise<PublicKey>} Associated token account address
 */
async function getAssociatedTokenAddress(
  mint,
  owner,
  allowOwnerOffCurve = false,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
) {
  if (!allowOwnerOffCurve && !PublicKey.isOnCurve(owner)) {
    throw new Error('Owner must be on curve');
  }

  const seeds = [
    owner.toBuffer(),
    programId.toBuffer(),
    mint.toBuffer(),
  ];

  const [address] = PublicKey.findProgramAddressSync(seeds, associatedTokenProgramId);
  return address;
}

module.exports = {
  getAssociatedTokenAddress,
};
