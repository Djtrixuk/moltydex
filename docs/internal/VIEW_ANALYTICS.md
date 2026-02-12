# How to View MoltyDEX Usage Analytics

## Quick Access

**URL:** https://api.moltydex.com/api/analytics/stats

**Or use curl:**
```bash
curl https://api.moltydex.com/api/analytics/stats | python3 -m json.tool
```

---

## What Gets Tracked

### Automatically Tracked:
- ✅ **Swaps** - Successful and failed swaps
- ✅ **Quotes** - Price quote requests
- ✅ **Balance Checks** - Token balance lookups
- ✅ **API Calls** - All API endpoint usage
- ✅ **Unique Wallets** - Number of unique users
- ✅ **Token Pairs** - Which tokens are being swapped
- ✅ **Daily Stats** - Usage by date

---

## Understanding the Stats

### Overview Section
```json
{
  "overview": {
    "totalSwaps": 10,           // Total swaps attempted
    "successfulSwaps": 8,       // Successful swaps
    "failedSwaps": 2,           // Failed swaps
    "totalQuotes": 45,          // Price quote requests
    "totalBalanceChecks": 120,  // Balance lookups
    "totalApiCalls": 175,       // Total API calls
    "uniqueWallets": 5,         // Unique users
    "uptimeSince": "2026-02-07T04:30:00.000Z"
  }
}
```

### Swaps Section
```json
{
  "swaps": {
    "byTokenPair": {
      "SOL_USDC": 5,    // 5 swaps from SOL to USDC
      "USDC_SOL": 3     // 3 swaps from USDC to SOL
    },
    "byDate": {
      "2026-02-07": 6,  // 6 swaps on Feb 7
      "2026-02-08": 2   // 2 swaps on Feb 8
    },
    "successRate": "80%"  // 80% success rate
  }
}
```

### API Usage Section
```json
{
  "apiUsage": {
    "byEndpoint": {
      "/api/quote": 45,           // 45 quote requests
      "/api/swap/build": 10,      // 10 swap builds
      "/api/balance": 120         // 120 balance checks
    },
    "byDate": {
      "2026-02-07": 150,
      "2026-02-08": 25
    }
  }
}
```

---

## What Good Numbers Look Like

### Healthy Usage:
- **totalSwaps > 0** - People are actually swapping
- **totalQuotes > totalSwaps** - People checking prices before swapping (good sign)
- **successRate > 80%** - Most swaps succeed
- **uniqueWallets > 1** - Multiple users
- **Daily growth** - Numbers increasing in `byDate`

### Concerning Signs:
- **totalSwaps = 0** - No one swapping yet
- **successRate < 50%** - Many failures (investigate)
- **totalQuotes = 0** - No one even checking prices

---

## Check Regularly

**Daily Check:**
```bash
curl https://api.moltydex.com/api/analytics/stats | python3 -m json.tool | grep -A 5 "overview"
```

**Weekly Review:**
- Check `byDate` trends
- Look for growth patterns
- Identify popular token pairs

---

## Notes

- **Stats reset on deployment** - In-memory storage (serverless)
- **For persistent tracking** - Would need database
- **Privacy-friendly** - Only tracks usage, not personal data

---

**This is your dashboard to see if anyone uses MoltyDEX!**
