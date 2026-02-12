# Balance Fetching Issues - Report for Opus

## Executive Summary

After implementing Jupiter's native fee mechanism (which successfully resolved transaction size issues), we're now experiencing balance fetching problems for non-SOL tokens. The API returns balances correctly, but the frontend is not consistently displaying them. Some tokens (like USDC) work intermittently, while others (like BONK) fail to display balances at all.

---

## What We're Trying To Do

### Primary Goal
Display accurate token balances for all tokens (SOL and SPL tokens) in the swap interface so users can:
1. See their available balance
2. Use "MAX" button to swap their full balance
3. Validate swap amounts against their balance

### Secondary Goal
Ensure swaps work reliably with Jupiter's native fee mechanism (which we successfully implemented).

---

## Current Implementation

### Balance Fetching Flow

1. **Frontend Hook** (`useTokenBalance.ts`)
   - Uses React hook to fetch balance when token changes
   - Calls API endpoint: `/api/balance?wallet_address={address}&token_mint={mint}`
   - Formats balance using token decimals
   - Updates UI state

2. **API Endpoint** (`/api/balance`)
   - Fetches balance from Solana RPC
   - For SOL: Uses `connection.getBalance()`
   - For SPL tokens: Uses `connection.getParsedTokenAccountsByOwner()`
   - Returns: `{ balance, decimals, has_balance, wallet_address, token_mint }`

3. **Display Logic** (`EnhancedSwapInterface.tsx`)
   - Shows balance next to token selector
   - Shows "Error loading balance" if fetch fails
   - Shows loading skeleton while fetching

---

## The Problems

### Problem 1: Inconsistent Balance Display

**Symptoms:**
- ✅ SOL balances: Always work
- ⚠️ USDC balances: Work sometimes, fail other times
- ❌ BONK balances: Consistently fail with "Error loading balance"

**User Experience:**
- User selects BONK → Sees "Error loading balance" in red
- Swap button is disabled (can't proceed without balance)
- User frustrated, can't complete swap

**Evidence:**
- Screenshot shows "Error loading balance" for BONK
- Console logs show balance fetching attempts
- API returns correct balance when tested directly

### Problem 2: API Returns Correct Data

**Direct API Test:**
```bash
curl "https://api.moltydex.com/api/balance?wallet_address=9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM&token_mint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
# Returns: { "balance": "34129969", "decimals": 6, "has_balance": true }
```

**Result:** API works correctly ✅

**But:** Frontend doesn't display it ❌

### Problem 3: Swap Failures After Balance Fetch

**Symptoms:**
- USDC balance fetched successfully
- User attempts swap
- Swap fails (reason unclear from user's description)

**Possible Causes:**
- Balance validation failing
- Transaction building failing
- Network/RPC issues

---

## Technical Details

### Frontend Balance Hook (`useTokenBalance.ts`)

```typescript
export function useTokenBalance(tokenAddress: string, decimals: number) {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!publicKey || !connected) return;
    
    const fetchBalance = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBalance(publicKey.toString(), tokenAddress);
        const formattedBalance = formatAmount(data.balance, data.decimals);
        setBalance(formattedBalance);
      } catch (err) {
        setError(err.message);
        setBalance('0');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBalance();
  }, [publicKey, connected, tokenAddress, decimals]);
  
  return { balance, loading, error };
}
```

### API Balance Endpoint (`/api/balance`)

```javascript
router.get('/balance', async (req, res) => {
  const { wallet_address, token_mint } = req.query;
  const connection = new Connection(RPC_URL, 'confirmed');
  
  if (!token_mint || token_mint === TOKENS.SOL) {
    // SOL balance
    const balance = await connection.getBalance(walletPubkey);
    return { balance: balance.toString(), balance_sol: (balance / LAMPORTS_PER_SOL).toFixed(9), decimals: 9 };
  }
  
  // SPL token balance
  const response = await connection.getParsedTokenAccountsByOwner(
    walletPubkey,
    { programId: TOKEN_PROGRAM_ID }
  );
  
  const matchingAccounts = response.value.filter(account => 
    account.account.data.parsed.info.mint === tokenMintStr
  );
  
  if (matchingAccounts.length === 0) {
    return { balance: '0', decimals: 9, has_balance: false };
  }
  
  // Sum balances from all matching accounts
  let totalBalance = 0n;
  let decimals = 9;
  for (const account of matchingAccounts) {
    totalBalance += BigInt(account.account.data.parsed.info.tokenAmount.amount);
    decimals = account.account.data.parsed.info.tokenAmount.decimals || decimals;
  }
  
  return { balance: totalBalance.toString(), decimals, has_balance: totalBalance > 0n };
});
```

---

## What We've Tried

### Attempt 1: Added Debugging
- ✅ Added console logging to balance hook
- ✅ Added logging to API calls
- ✅ Added error display in UI
- ❌ **Result**: Logs show API is called, but balance still not displayed

### Attempt 2: Cache Busting
- ✅ Added timestamp parameter to API calls
- ✅ Added `cache: 'no-store'` to fetch requests
- ❌ **Result**: Still inconsistent

### Attempt 3: Improved Error Handling
- ✅ Added error display in UI
- ✅ Added "Error loading balance" message
- ❌ **Result**: Errors shown, but root cause unclear

### Attempt 4: Reset Balance on Token Change
- ✅ Set balance to `null` while loading
- ✅ Added cancellation checks
- ❌ **Result**: Still not working consistently

---

## Current State

### What Works
- ✅ SOL balances: Always display correctly
- ✅ API endpoint: Returns correct data when tested directly
- ✅ Error handling: Shows errors when balance fetch fails
- ✅ Jupiter native fees: Working correctly (from previous fix)

### What Doesn't Work
- ❌ BONK balances: Consistently fail
- ❌ USDC balances: Work intermittently
- ❌ Other SPL tokens: Likely have same issue

### What's Uncertain
- ⚠️ Why does API work but frontend doesn't display?
- ⚠️ Is it a timing issue? Race condition?
- ⚠️ Is it a React state update issue?
- ⚠️ Is it a network/CORS issue?
- ⚠️ Is it a token-specific issue (BONK vs USDC)?

---

## Error Patterns

### Pattern 1: BONK Always Fails
- Token: BONK (`DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263`)
- Decimals: 5
- Result: "Error loading balance"
- API Test: Not tested yet (need to verify)

### Pattern 2: USDC Works Sometimes
- Token: USDC (`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`)
- Decimals: 6
- Result: Sometimes displays, sometimes fails
- API Test: ✅ Returns correct balance

### Pattern 3: SOL Always Works
- Token: SOL (`So11111111111111111111111111111111111111112`)
- Decimals: 9
- Result: ✅ Always displays correctly

---

## Key Questions for Opus

### 1. Why Does API Work But Frontend Doesn't Display?
- API returns correct data when tested directly
- Frontend hook receives data (based on logs)
- But balance doesn't appear in UI
- Is this a React state update issue?

### 2. Why Do Some Tokens Work But Others Don't?
- SOL always works
- USDC works sometimes
- BONK never works
- Is there something different about how these tokens are handled?

### 3. Is There a Race Condition?
- Multiple balance fetches happening simultaneously?
- Token change triggers new fetch before old one completes?
- State updates happening out of order?

### 4. Is It a Network/RPC Issue?
- RPC rate limiting?
- Timeout issues?
- CORS issues?
- Network errors being swallowed?

### 5. Is It a Token Account Issue?
- Some tokens don't have associated token accounts?
- Account creation needed?
- Different account structure?

### 6. Should We Use a Different Approach?
- Poll balances instead of fetch-on-demand?
- Cache balances?
- Use a different RPC method?
- Use a different balance fetching library?

---

## Code Locations

### Frontend Files
- `frontend/hooks/useTokenBalance.ts` - Balance fetching hook
- `frontend/services/api.ts` - API service layer
- `frontend/components/EnhancedSwapInterface.tsx` - Main swap component
- `frontend/components/TokenSelector.tsx` - Token selector with balance display

### Backend Files
- `api/routes/balance.js` - Balance API endpoint
- `api/utils/balance.js` - Balance fetching utilities

---

## Console Logs (What We Should See)

When balance fetching works:
```
[getBalance] Fetching balance: { walletAddress: "...", tokenMint: "..." }
[getBalance] Balance response: { balance: "34129969", decimals: 6 }
[useTokenBalance] Token balance response: { rawBalance: "34129969", decimals: 6 }
[useTokenBalance] ✅ Setting balance: { formattedBalance: "34.129969" }
```

When balance fetching fails:
```
[getBalance] Fetching balance: { walletAddress: "...", tokenMint: "..." }
[useTokenBalance] Error fetching balance: { error: "...", tokenAddress: "..." }
```

---

## User Impact

### Current Experience
1. User connects wallet ✅
2. User selects token (e.g., BONK) ✅
3. Balance doesn't load ❌
4. User sees "Error loading balance" ❌
5. Swap button disabled ❌
6. User frustrated, can't complete swap ❌

### Expected Experience
1. User connects wallet ✅
2. User selects token ✅
3. Balance loads immediately ✅
4. User sees balance (e.g., "378533.33748 BONK") ✅
5. User can use MAX button ✅
6. User can complete swap ✅

---

## Next Steps Needed

1. **Diagnosis**: Understand why API works but frontend doesn't display
2. **Fix**: Implement solution based on root cause
3. **Test**: Verify all tokens work consistently
4. **Monitor**: Ensure balances load reliably

---

## Additional Context

### Recent Changes
- ✅ Implemented Jupiter native fees (working)
- ✅ Fixed transaction size issues (working)
- ✅ Added balance debugging (in progress)
- ⚠️ Balance display still inconsistent

### Related Issues
- Balance validation works (error shows correct max balance)
- Swap functionality works when balance is available
- Only issue is balance display/loading

---

## Request for Opus

**Opus, please help us:**
1. Identify why balance fetching is inconsistent
2. Determine if it's a frontend, backend, or network issue
3. Suggest the best approach to fix it
4. Recommend any improvements to the balance fetching architecture

**We need:**
- Reliable balance display for all tokens
- Consistent behavior (not intermittent)
- Fast loading (user experience)
- Error handling (graceful failures)

---

**Report Created**: 2026-02-07
**Status**: Awaiting Opus analysis and recommendations
