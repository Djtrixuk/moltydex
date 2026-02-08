# Analytics Setup for MoltyDEX

## ✅ What's Implemented

### Backend Tracking
- **API Usage Tracking** - Tracks all API calls (quotes, swaps, balances)
- **Swap Tracking** - Tracks successful/failed swaps, token pairs, dates
- **Unique Wallets** - Tracks unique wallet addresses
- **Analytics Endpoint** - `/api/analytics/stats` to view usage statistics

### Frontend Tracking
- **Event Tracking** - Tracks user actions (swaps, wallet connects, etc.)
- **Google Analytics Ready** - Can add GA4 with environment variable
- **Custom Analytics** - Sends events to backend analytics endpoint

---

## 📊 View Usage Statistics

### Endpoint: `/api/analytics/stats`

**URL:** https://api.moltydex.com/api/analytics/stats

**Response:**
```json
{
  "overview": {
    "totalSwaps": 0,
    "successfulSwaps": 0,
    "failedSwaps": 0,
    "totalQuotes": 0,
    "totalBalanceChecks": 0,
    "totalApiCalls": 0,
    "uniqueWallets": 0,
    "uptimeSince": "2026-02-07T04:30:00.000Z"
  },
  "swaps": {
    "byTokenPair": {},
    "byDate": {},
    "successRate": "0%"
  },
  "apiUsage": {
    "byEndpoint": {},
    "byDate": {}
  },
  "quotes": {
    "byDate": {}
  },
  "balances": {
    "byDate": {}
  }
}
```

---

## 🔧 Setup Google Analytics (Optional)

### Step 1: Get Google Analytics ID
1. Go to https://analytics.google.com
2. Create account/property
3. Get Measurement ID (G-XXXXXXXXXX)

### Step 2: Add to Environment Variables
Add to `frontend/.env.local`:
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Step 3: Deploy
Google Analytics will automatically start tracking.

---

## 📈 What's Tracked

### Backend (Automatic)
- ✅ All API calls (quotes, swaps, balances)
- ✅ Swap success/failure
- ✅ Token pairs swapped
- ✅ Unique wallet addresses
- ✅ Daily usage statistics

### Frontend (Automatic)
- ✅ Wallet connections
- ✅ Swap initiations
- ✅ Swap successes
- ✅ Swap errors
- ✅ Token selections
- ✅ Page views

---

## 🎯 Quick Check

**To see if anyone is using MoltyDEX:**

1. **Check Analytics Endpoint:**
   ```bash
   curl https://api.moltydex.com/api/analytics/stats
   ```

2. **Look for:**
   - `totalSwaps > 0` - Someone executed swaps
   - `totalQuotes > 0` - Someone checked prices
   - `totalApiCalls > 0` - Someone used the API
   - `uniqueWallets > 0` - Unique users

3. **Check Daily Stats:**
   - Look at `swaps.byDate` - See which days had activity
   - Look at `apiUsage.byDate` - See API usage over time

---

## 💡 Notes

- **In-Memory Storage** - Stats reset on each deployment (serverless)
- **For Production** - Consider using a database for persistent tracking
- **Privacy** - Only tracks usage, not personal data
- **No Cookies** - Backend tracking doesn't use cookies

---

## 🚀 Next Steps

1. **Check stats regularly** - Visit `/api/analytics/stats` daily
2. **Set up Google Analytics** - For detailed frontend analytics
3. **Add database** - For persistent tracking (if needed)
4. **Create dashboard** - Simple page to view stats (optional)

---

**You can now track if anyone uses MoltyDEX!** Check `/api/analytics/stats` to see usage.
