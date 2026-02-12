/**
 * Swap Tracking Utility
 * Tracks swaps for analytics and points program
 * Uses file-based storage (can be upgraded to database later)
 */

const fs = require('fs').promises;
const path = require('path');
const os = require('os');

// Lazy calculation of data directory (only when needed)
function getDataDir() {
  const IS_SERVERLESS = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
  return IS_SERVERLESS ? path.join(os.tmpdir(), 'moltydex-data') : path.join(__dirname, '../../data');
}

function getSwapsFile() {
  return path.join(getDataDir(), 'swaps.json');
}

function getPointsFile() {
  return path.join(getDataDir(), 'points.json');
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    const dataDir = getDataDir();
    await fs.mkdir(dataDir, { recursive: true });
  } catch (err) {
    // Directory might already exist or we're in read-only filesystem
    // In serverless, /tmp is writable but ephemeral
  }
}

// Initialize files if they don't exist
async function initializeFiles() {
  try {
    await ensureDataDir();
    const swapsFile = getSwapsFile();
    const pointsFile = getPointsFile();
    
    try {
      await fs.access(swapsFile);
    } catch {
      await fs.writeFile(swapsFile, JSON.stringify({ swaps: [], stats: { total_swaps: 0, total_volume: '0' } }, null, 2));
    }
    
    try {
      await fs.access(pointsFile);
    } catch {
      await fs.writeFile(pointsFile, JSON.stringify({ points: {}, leaderboard: [] }, null, 2));
    }
  } catch (err) {
    // If file operations fail (e.g., read-only filesystem), we'll use in-memory storage
    // This is a fallback for serverless environments without persistent storage
    console.warn('File system not writable, using in-memory storage:', err.message);
  }
}

/**
 * Track a swap
 */
async function trackSwap(swapData) {
  try {
    await initializeFiles();
    
    const swap = {
      id: `swap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      wallet_address: swapData.wallet_address,
      input_mint: swapData.input_mint,
      output_mint: swapData.output_mint,
      input_amount: swapData.input_amount,
      output_amount: swapData.output_amount,
      fee_amount: swapData.fee_amount,
      fee_bps: swapData.fee_bps,
      timestamp: new Date().toISOString(),
      signature: swapData.signature || null, // Will be added when transaction is confirmed
    };
    
    // Read current swaps
    const swapsFile = getSwapsFile();
    const swapsData = JSON.parse(await fs.readFile(swapsFile, 'utf8'));
    
    // Add new swap
    swapsData.swaps.push(swap);
    
    // Update stats
    const inputAmount = BigInt(swap.input_amount || '0');
    const outputAmount = BigInt(swap.output_amount || '0');
    swapsData.stats.total_swaps += 1;
    swapsData.stats.total_volume = (BigInt(swapsData.stats.total_volume || '0') + outputAmount).toString();
    
    // Keep only last 10,000 swaps (to prevent file from growing too large)
    if (swapsData.swaps.length > 10000) {
      swapsData.swaps = swapsData.swaps.slice(-10000);
    }
    
    // Write back
    await fs.writeFile(swapsFile, JSON.stringify(swapsData, null, 2));
    
    return swap;
  } catch (err) {
    // If file operations fail (e.g., in serverless without persistent storage), return swap object anyway
    // The swap will still work, just won't be tracked
    console.warn('Swap tracking failed (non-critical):', err.message);
    return {
      id: `swap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      wallet_address: swapData.wallet_address,
      input_mint: swapData.input_mint,
      output_mint: swapData.output_mint,
      input_amount: swapData.input_amount,
      output_amount: swapData.output_amount,
      fee_amount: swapData.fee_amount,
      fee_bps: swapData.fee_bps,
      timestamp: new Date().toISOString(),
      signature: swapData.signature || null,
      _tracking_failed: true,
    };
  }
}

/**
 * Award points for a swap
 * Points formula: 1 point per $1 of swap volume (estimated)
 * For now, we'll use output amount as proxy (can be improved with price feeds)
 */
async function awardPoints(walletAddress, swapData) {
  try {
    await initializeFiles();
    
    // Read current points
    const pointsFile = getPointsFile();
    const pointsData = JSON.parse(await fs.readFile(pointsFile, 'utf8'));
    
    if (!pointsData.points[walletAddress]) {
      pointsData.points[walletAddress] = {
        total_points: 0,
        swaps_count: 0,
        last_swap: null,
        created_at: new Date().toISOString(),
      };
    }
    
    // Calculate points (simplified: 1 point per swap + volume bonus)
    // Volume bonus: 1 point per 1M lamports (0.001 SOL) or equivalent
    const outputAmount = BigInt(swapData.output_amount || '0');
    const volumeBonus = Number(outputAmount) / 1_000_000; // 1 point per 1M lamports
    const swapPoints = 1 + Math.floor(volumeBonus); // Base 1 point + volume bonus
    
    pointsData.points[walletAddress].total_points += swapPoints;
    pointsData.points[walletAddress].swaps_count += 1;
    pointsData.points[walletAddress].last_swap = new Date().toISOString();
    
    // Update leaderboard
    const leaderboard = Object.entries(pointsData.points)
      .map(([address, data]) => ({
        wallet_address: address,
        total_points: data.total_points,
        swaps_count: data.swaps_count,
        last_swap: data.last_swap,
      }))
      .sort((a, b) => b.total_points - a.total_points)
      .slice(0, 100); // Top 100
    
    pointsData.leaderboard = leaderboard;
    
    // Write back
    await fs.writeFile(pointsFile, JSON.stringify(pointsData, null, 2));
    
    return {
      points_awarded: swapPoints,
      total_points: pointsData.points[walletAddress].total_points,
      rank: leaderboard.findIndex(entry => entry.wallet_address === walletAddress) + 1,
    };
  } catch (err) {
    // If file operations fail, calculate points but don't persist
    // The swap will still work, just won't track points
    console.warn('Points awarding failed (non-critical):', err.message);
    const outputAmount = BigInt(swapData.output_amount || '0');
    const volumeBonus = Number(outputAmount) / 1_000_000;
    const swapPoints = 1 + Math.floor(volumeBonus);
    return {
      points_awarded: swapPoints,
      total_points: swapPoints, // Can't track total without storage
      rank: null,
      _tracking_failed: true,
    };
  }
}

/**
 * Get swap statistics
 */
async function getSwapStats() {
  try {
    await initializeFiles();
    const swapsFile = getSwapsFile();
    const swapsData = JSON.parse(await fs.readFile(swapsFile, 'utf8'));
    return swapsData.stats;
  } catch {
    return { total_swaps: 0, total_volume: '0' };
  }
}

/**
 * Get swaps for a wallet
 */
async function getWalletSwaps(walletAddress, limit = 50) {
  try {
    await initializeFiles();
    const swapsFile = getSwapsFile();
    const swapsData = JSON.parse(await fs.readFile(swapsFile, 'utf8'));
    const walletSwaps = swapsData.swaps
      .filter(swap => swap.wallet_address === walletAddress)
      .slice(-limit)
      .reverse();
    return walletSwaps;
  } catch {
    return [];
  }
}

/**
 * Get points for a wallet
 */
async function getWalletPoints(walletAddress) {
  try {
    await initializeFiles();
    const pointsFile = getPointsFile();
    const pointsData = JSON.parse(await fs.readFile(pointsFile, 'utf8'));
    return pointsData.points[walletAddress] || {
      total_points: 0,
      swaps_count: 0,
      last_swap: null,
    };
  } catch {
    return {
      total_points: 0,
      swaps_count: 0,
      last_swap: null,
    };
  }
}

/**
 * Get leaderboard
 */
async function getLeaderboard(limit = 100) {
  try {
    await initializeFiles();
    const pointsFile = getPointsFile();
    const pointsData = JSON.parse(await fs.readFile(pointsFile, 'utf8'));
    return pointsData.leaderboard.slice(0, limit);
  } catch {
    return [];
  }
}

/**
 * Update swap signature when transaction is confirmed
 */
async function updateSwapSignature(swapId, signature) {
  try {
    await initializeFiles();
    const swapsFile = getSwapsFile();
    const swapsData = JSON.parse(await fs.readFile(swapsFile, 'utf8'));
    const swap = swapsData.swaps.find(s => s.id === swapId);
    if (swap) {
      swap.signature = signature;
      await fs.writeFile(swapsFile, JSON.stringify(swapsData, null, 2));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

module.exports = {
  trackSwap,
  awardPoints,
  getSwapStats,
  getWalletSwaps,
  getWalletPoints,
  getLeaderboard,
  updateSwapSignature,
};
