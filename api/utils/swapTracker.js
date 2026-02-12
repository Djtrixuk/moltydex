/**
 * Swap Tracking Utility
 * Tracks swaps for analytics, history, and points program
 * Uses Upstash Redis for persistent storage (works with Vercel serverless)
 * Falls back to in-memory storage if Redis is not configured
 */

// -- Storage backend --

let redis = null;
let useRedis = false;

try {
  const { Redis } = require('@upstash/redis');
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    useRedis = true;
    console.log('[swapTracker] Using Upstash Redis for persistent swap tracking');
  } else {
    console.log('[swapTracker] Redis not configured, using in-memory storage (resets on restart)');
  }
} catch (err) {
  console.warn('[swapTracker] Redis not available:', err.message);
}

// In-memory fallback
const memoryStore = {
  swaps: [],          // Recent swaps (capped at 10,000)
  stats: { total_swaps: 0, total_volume_lamports: '0' },
  points: {},         // { walletAddress: { total_points, swaps_count, last_swap, created_at } }
};

// Redis key helpers
const KEY = {
  swap: (id) => `moltydex:swap:${id}`,
  walletSwaps: (wallet) => `moltydex:wallet_swaps:${wallet}`,
  stats: () => 'moltydex:swap_stats',
  points: (wallet) => `moltydex:points:${wallet}`,
  leaderboard: () => 'moltydex:leaderboard',
  recentSwaps: () => 'moltydex:recent_swaps',
};

// -- Helpers --

function generateSwapId() {
  return `swap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// -- Core functions --

/**
 * Track a swap
 */
async function trackSwap(swapData) {
  const swap = {
    id: generateSwapId(),
    wallet_address: swapData.wallet_address,
    input_mint: swapData.input_mint,
    output_mint: swapData.output_mint,
    input_symbol: swapData.input_symbol || null,
    output_symbol: swapData.output_symbol || null,
    input_amount: swapData.input_amount,
    output_amount: swapData.output_amount,
    fee_amount: swapData.fee_amount || '0',
    fee_bps: swapData.fee_bps || 0,
    slippage_bps: swapData.slippage_bps || null,
    price_impact: swapData.price_impact || null,
    signature: swapData.signature || null,
    status: swapData.signature ? 'confirmed' : 'pending',
    timestamp: new Date().toISOString(),
  };

  if (useRedis && redis) {
    try {
      const pipeline = redis.pipeline();

      // Store the swap object (expires after 90 days)
      pipeline.set(KEY.swap(swap.id), JSON.stringify(swap), { ex: 90 * 24 * 3600 });

      // Add to wallet's swap list (keep last 500 per wallet)
      pipeline.lpush(KEY.walletSwaps(swap.wallet_address), swap.id);
      pipeline.ltrim(KEY.walletSwaps(swap.wallet_address), 0, 499);

      // Add to global recent swaps list (keep last 10,000)
      pipeline.lpush(KEY.recentSwaps(), swap.id);
      pipeline.ltrim(KEY.recentSwaps(), 0, 9999);

      // Increment stats
      pipeline.hincrby(KEY.stats(), 'total_swaps', 1);
      const outputAmount = BigInt(swap.output_amount || '0');
      pipeline.hincrby(KEY.stats(), 'total_volume_lamports', Number(outputAmount));

      // Daily stats
      const date = new Date().toISOString().split('T')[0];
      pipeline.hincrby(KEY.stats(), `swaps:${date}`, 1);

      await pipeline.exec();
    } catch (err) {
      console.error('[swapTracker] Redis write error:', err.message);
      // Fall through to memory
      pushToMemory(swap);
    }
  } else {
    pushToMemory(swap);
  }

  return swap;
}

function pushToMemory(swap) {
  memoryStore.swaps.unshift(swap);
  if (memoryStore.swaps.length > 10000) {
    memoryStore.swaps = memoryStore.swaps.slice(0, 10000);
  }
  memoryStore.stats.total_swaps += 1;
  const outputAmount = BigInt(swap.output_amount || '0');
  memoryStore.stats.total_volume_lamports = (
    BigInt(memoryStore.stats.total_volume_lamports || '0') + outputAmount
  ).toString();
}

/**
 * Award points for a swap
 * Formula: 1 base point + 1 point per 1M lamports volume
 */
async function awardPoints(walletAddress, swapData) {
  const outputAmount = BigInt(swapData.output_amount || '0');
  const volumeBonus = Number(outputAmount) / 1_000_000;
  const swapPoints = 1 + Math.floor(volumeBonus);

  if (useRedis && redis) {
    try {
      const pipeline = redis.pipeline();

      // Increment wallet points
      pipeline.hincrby(KEY.points(walletAddress), 'total_points', swapPoints);
      pipeline.hincrby(KEY.points(walletAddress), 'swaps_count', 1);
      pipeline.hset(KEY.points(walletAddress), 'last_swap', new Date().toISOString());

      // Set created_at if first time
      pipeline.hsetnx(KEY.points(walletAddress), 'created_at', new Date().toISOString());

      // Update leaderboard sorted set (score = total points)
      // We need to get current total first, then update
      await pipeline.exec();

      // Get updated total for leaderboard
      const totalPoints = await redis.hget(KEY.points(walletAddress), 'total_points');
      await redis.zadd(KEY.leaderboard(), { score: parseInt(totalPoints) || swapPoints, member: walletAddress });

      // Get rank
      const rank = await redis.zrevrank(KEY.leaderboard(), walletAddress);

      return {
        points_awarded: swapPoints,
        total_points: parseInt(totalPoints) || swapPoints,
        rank: rank !== null ? rank + 1 : null,
      };
    } catch (err) {
      console.error('[swapTracker] Redis points error:', err.message);
    }
  }

  // In-memory fallback
  if (!memoryStore.points[walletAddress]) {
    memoryStore.points[walletAddress] = {
      total_points: 0,
      swaps_count: 0,
      last_swap: null,
      created_at: new Date().toISOString(),
    };
  }

  memoryStore.points[walletAddress].total_points += swapPoints;
  memoryStore.points[walletAddress].swaps_count += 1;
  memoryStore.points[walletAddress].last_swap = new Date().toISOString();

  // Calculate rank from memory
  const sorted = Object.entries(memoryStore.points)
    .sort(([, a], [, b]) => b.total_points - a.total_points);
  const rank = sorted.findIndex(([addr]) => addr === walletAddress) + 1;

  return {
    points_awarded: swapPoints,
    total_points: memoryStore.points[walletAddress].total_points,
    rank: rank || null,
  };
}

/**
 * Get swap statistics
 */
async function getSwapStats() {
  if (useRedis && redis) {
    try {
      const stats = await redis.hgetall(KEY.stats());
      if (stats && Object.keys(stats).length > 0) {
        // Extract daily stats
        const dailySwaps = {};
        for (const [key, value] of Object.entries(stats)) {
          if (key.startsWith('swaps:')) {
            dailySwaps[key.replace('swaps:', '')] = parseInt(value) || 0;
          }
        }

        return {
          total_swaps: parseInt(stats.total_swaps) || 0,
          total_volume_lamports: stats.total_volume_lamports || '0',
          daily_swaps: dailySwaps,
          storage: 'redis',
        };
      }
    } catch (err) {
      console.error('[swapTracker] Redis stats error:', err.message);
    }
  }

  return {
    total_swaps: memoryStore.stats.total_swaps,
    total_volume_lamports: memoryStore.stats.total_volume_lamports,
    storage: 'memory',
  };
}

/**
 * Get swaps for a wallet
 */
async function getWalletSwaps(walletAddress, limit = 50) {
  if (useRedis && redis) {
    try {
      const swapIds = await redis.lrange(KEY.walletSwaps(walletAddress), 0, limit - 1);
      if (!swapIds || swapIds.length === 0) return [];

      // Fetch each swap object
      const pipeline = redis.pipeline();
      for (const id of swapIds) {
        pipeline.get(KEY.swap(id));
      }
      const results = await pipeline.exec();

      return results
        .filter((r) => r !== null)
        .map((r) => {
          try { return typeof r === 'string' ? JSON.parse(r) : r; } catch { return null; }
        })
        .filter(Boolean);
    } catch (err) {
      console.error('[swapTracker] Redis wallet swaps error:', err.message);
    }
  }

  // In-memory fallback
  return memoryStore.swaps
    .filter((s) => s.wallet_address === walletAddress)
    .slice(0, limit);
}

/**
 * Get points for a wallet
 */
async function getWalletPoints(walletAddress) {
  if (useRedis && redis) {
    try {
      const data = await redis.hgetall(KEY.points(walletAddress));
      if (data && Object.keys(data).length > 0) {
        return {
          total_points: parseInt(data.total_points) || 0,
          swaps_count: parseInt(data.swaps_count) || 0,
          last_swap: data.last_swap || null,
          created_at: data.created_at || null,
        };
      }
    } catch (err) {
      console.error('[swapTracker] Redis points lookup error:', err.message);
    }
  }

  return memoryStore.points[walletAddress] || {
    total_points: 0,
    swaps_count: 0,
    last_swap: null,
  };
}

/**
 * Get leaderboard
 */
async function getLeaderboard(limit = 100) {
  if (useRedis && redis) {
    try {
      // Get top wallets by score (descending)
      const entries = await redis.zrange(KEY.leaderboard(), 0, limit - 1, { rev: true, withScores: true });
      if (!entries || entries.length === 0) return [];

      // entries is [member, score, member, score, ...]
      const leaderboard = [];
      for (let i = 0; i < entries.length; i += 2) {
        const wallet = entries[i];
        const score = entries[i + 1];
        leaderboard.push({
          wallet_address: wallet,
          total_points: parseInt(score) || 0,
          rank: Math.floor(i / 2) + 1,
        });
      }
      return leaderboard;
    } catch (err) {
      console.error('[swapTracker] Redis leaderboard error:', err.message);
    }
  }

  // In-memory fallback
  return Object.entries(memoryStore.points)
    .map(([addr, data]) => ({
      wallet_address: addr,
      total_points: data.total_points,
      swaps_count: data.swaps_count,
      last_swap: data.last_swap,
    }))
    .sort((a, b) => b.total_points - a.total_points)
    .slice(0, limit)
    .map((entry, i) => ({ ...entry, rank: i + 1 }));
}

/**
 * Update swap signature when transaction is confirmed
 */
async function updateSwapSignature(swapId, signature) {
  if (useRedis && redis) {
    try {
      const raw = await redis.get(KEY.swap(swapId));
      if (!raw) return false;
      const swap = typeof raw === 'string' ? JSON.parse(raw) : raw;
      swap.signature = signature;
      swap.status = 'confirmed';
      await redis.set(KEY.swap(swapId), JSON.stringify(swap), { ex: 90 * 24 * 3600 });
      return true;
    } catch (err) {
      console.error('[swapTracker] Redis update error:', err.message);
    }
  }

  // In-memory fallback
  const swap = memoryStore.swaps.find((s) => s.id === swapId);
  if (swap) {
    swap.signature = signature;
    swap.status = 'confirmed';
    return true;
  }
  return false;
}

/**
 * Check if swap tracking is available (Redis or memory)
 */
function isAvailable() {
  return true; // Always available — Redis for persistence, memory as fallback
}

/**
 * Get storage backend info
 */
function getStorageInfo() {
  return {
    backend: useRedis ? 'redis' : 'memory',
    persistent: useRedis,
  };
}

module.exports = {
  trackSwap,
  awardPoints,
  getSwapStats,
  getWalletSwaps,
  getWalletPoints,
  getLeaderboard,
  updateSwapSignature,
  isAvailable,
  getStorageInfo,
};
