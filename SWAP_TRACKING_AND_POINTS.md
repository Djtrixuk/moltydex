# Swap Tracking & Points Program

## Overview

MoltyDEX now includes comprehensive swap tracking and a points program to reward active users!

## Features

### ✅ Swap Tracking
- Every swap is automatically tracked
- Stores: wallet address, token pairs, amounts, fees, timestamps
- Tracks swap signatures when transactions are confirmed
- Maintains statistics: total swaps, total volume

### 🎯 Points Program
- **Base Points**: 1 point per swap
- **Volume Bonus**: Additional points based on swap volume
  - 1 point per 1M lamports (0.001 SOL equivalent)
- **Leaderboard**: Top 100 users ranked by total points
- **Ranking**: See your position on the leaderboard

## API Endpoints

### Swap Tracking

#### `GET /api/analytics/stats`
Get overall swap statistics.

**Response:**
```json
{
  "total_swaps": 150,
  "total_volume": "50000000000",
  "timestamp": "2026-02-05T12:00:00.000Z"
}
```

#### `GET /api/analytics/swaps/:wallet_address`
Get swap history for a wallet.

**Query Parameters:**
- `limit` (optional): Number of swaps to return (default: 50, max: 100)

**Response:**
```json
{
  "wallet_address": "ABC...XYZ",
  "swaps": [
    {
      "id": "swap_1234567890_abc123",
      "wallet_address": "ABC...XYZ",
      "input_mint": "So11111111111111111111111111111111111111112",
      "output_mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      "input_amount": "1000000000",
      "output_amount": "250000000",
      "fee_amount": "250000",
      "fee_bps": 10,
      "timestamp": "2026-02-05T12:00:00.000Z",
      "signature": "5KJ...XYZ"
    }
  ],
  "count": 10
}
```

#### `POST /api/analytics/swap/:swap_id/signature`
Update swap signature when transaction is confirmed.

**Body:**
```json
{
  "signature": "5KJ...XYZ"
}
```

### Points Program

#### `GET /api/analytics/points/:wallet_address`
Get points information for a wallet.

**Response:**
```json
{
  "wallet_address": "ABC...XYZ",
  "total_points": 150,
  "swaps_count": 25,
  "last_swap": "2026-02-05T12:00:00.000Z",
  "rank": 5,
  "total_users": 100
}
```

#### `GET /api/analytics/leaderboard`
Get points leaderboard.

**Query Parameters:**
- `limit` (optional): Number of users to return (default: 100)

**Response:**
```json
{
  "leaderboard": [
    {
      "wallet_address": "ABC...XYZ",
      "total_points": 500,
      "swaps_count": 75,
      "last_swap": "2026-02-05T12:00:00.000Z"
    }
  ],
  "count": 100,
  "timestamp": "2026-02-05T12:00:00.000Z"
}
```

### Swap Response Enhancement

When building a swap (`POST /api/swap/build`), the response now includes:

```json
{
  "transaction": "base64...",
  "fee_amount": "250000",
  "output_amount": "250000000",
  "output_after_fee": "249750000",
  "fee_bps": 10,
  "swap_id": "swap_1234567890_abc123",
  "points": {
    "points_awarded": 2,
    "total_points": 150,
    "rank": 5
  },
  "instructions": "Sign this transaction client-side..."
}
```

## Points Calculation

### Formula
```
Points = 1 (base) + floor(Output Amount / 1,000,000)
```

### Examples
- **Small swap** (1M lamports = 0.001 SOL): 2 points (1 base + 1 volume)
- **Medium swap** (100M lamports = 0.1 SOL): 101 points (1 base + 100 volume)
- **Large swap** (1B lamports = 1 SOL): 1001 points (1 base + 1000 volume)

## Data Storage

- **Location**: `data/swaps.json` and `data/points.json`
- **Format**: JSON files (can be upgraded to database later)
- **Retention**: Last 10,000 swaps (to prevent file growth)
- **Privacy**: Data files are gitignored, not committed to repository

## Health Check

The `/api/health` endpoint now includes swap stats:

```json
{
  "status": "ok",
  "features": {
    "swap_tracking": true,
    "points_program": true
  },
  "swap_stats": {
    "total_swaps": 150,
    "total_volume": "50000000000"
  }
}
```

## Implementation Details

### Swap Tracking Flow
1. User calls `/api/swap/build`
2. Swap is tracked immediately (before transaction is sent)
3. Points are awarded immediately
4. When transaction is confirmed, signature can be updated via `/api/analytics/swap/:swap_id/signature`

### Points Award Flow
1. Swap is built
2. Points calculated based on output amount
3. Points added to wallet's total
4. Leaderboard updated automatically
5. Points info returned in swap response

## Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB) for better scalability
- [ ] Price feeds integration for accurate USD-based points
- [ ] Tiered rewards (bonus points for high-volume traders)
- [ ] Referral program (points for referring users)
- [ ] Rewards redemption (convert points to tokens/discounts)
- [ ] API rate limiting for analytics endpoints
- [ ] Caching for leaderboard queries

## Notes

- Swap tracking is **non-blocking** - if tracking fails, the swap still succeeds
- Points are awarded immediately when swap is built (not when confirmed)
- Leaderboard updates in real-time
- Data persists across deployments (stored in `data/` directory)

---

**Status**: ✅ Active  
**Last Updated**: 2026-02-05
