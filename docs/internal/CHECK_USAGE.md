# How to Check if Anyone Uses MoltyDEX

## Quick Check (30 seconds)

**Open this URL in your browser:**
```
https://api.moltydex.com/api/analytics/stats
```

**Or use curl:**
```bash
curl https://api.moltydex.com/api/analytics/stats | python3 -m json.tool
```

---

## What to Look For

### Signs Someone is Using It:

✅ **`totalSwaps > 0`** - Someone executed swaps  
✅ **`totalQuotes > 0`** - Someone checked prices  
✅ **`totalApiCalls > 0`** - Someone used the API  
✅ **`uniqueWallets > 0`** - Unique users  
✅ **`swaps.byDate` has entries** - Activity on specific dates  

### If Everything is 0:
- No one has used it yet
- Or stats reset (serverless deployments reset in-memory data)
- Check again after a few days

---

## Example Response

```json
{
  "overview": {
    "totalSwaps": 5,
    "successfulSwaps": 4,
    "failedSwaps": 1,
    "totalQuotes": 23,
    "totalBalanceChecks": 45,
    "totalApiCalls": 73,
    "uniqueWallets": 3,
    "uptimeSince": "2026-02-07T04:30:00.000Z"
  },
  "swaps": {
    "byTokenPair": {
      "SOL_USDC": 3,
      "USDC_SOL": 1
    },
    "byDate": {
      "2026-02-07": 4,
      "2026-02-08": 1
    },
    "successRate": "80%"
  }
}
```

---

## Check Regularly

**Daily:** Quick check of `/api/analytics/stats`  
**Weekly:** Review trends in `byDate` data  
**Monthly:** Analyze growth and patterns  

---

## Notes

- **Stats reset on deployment** - In-memory storage (serverless)
- **For persistent tracking** - Would need a database
- **Privacy-friendly** - Only tracks usage, not personal data

---

**This is the easiest way to see if anyone is using MoltyDEX!**
