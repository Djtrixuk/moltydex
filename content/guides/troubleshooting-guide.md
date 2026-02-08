# MoltyDEX Troubleshooting Guide

**Common issues and solutions**

---

## Swap Failed

### Error: "Insufficient Balance"

**Problem:** Your wallet doesn't have enough tokens for the swap.

**Solutions:**
1. Check your balance: `GET /api/balance?wallet_address=YOUR_ADDRESS&token_mint=TOKEN_MINT`
2. Add more tokens to your wallet
3. Enable auto-swap if you have a different token

### Error: "Transaction Too Large"

**Problem:** Transaction exceeds Solana's size limit (1232 bytes).

**Solutions:**
1. Reduce swap amount
2. Use a simpler swap route
3. Split into multiple smaller swaps

### Error: "Token Not Found"

**Problem:** Invalid token mint address.

**Solutions:**
1. Verify token mint address is correct
2. Use token search: `GET /api/tokens/search?query=TOKEN_SYMBOL`
3. Check if token exists on Solana

---

## Quote Issues

### Error: "No Route Found"

**Problem:** Jupiter can't find a swap route.

**Solutions:**
1. Check if tokens have liquidity
2. Try different token pairs
3. Increase slippage tolerance
4. Check Jupiter status: https://status.jup.ag

### Error: "Price Impact Too High"

**Problem:** Swap would have significant price impact.

**Solutions:**
1. Reduce swap amount
2. Increase slippage tolerance
3. Use a different DEX route

---

## x402 Payment Issues

### Error: "402 Payment Required Not Handled"

**Problem:** Agent didn't handle 402 response.

**Solutions:**
1. Ensure HTTPInterceptor is set up
2. Check auto_swap is enabled
3. Verify wallet has funds
4. Check logs for detailed error

### Error: "Payment Failed"

**Problem:** Payment transaction failed.

**Solutions:**
1. Check Solana network status
2. Verify wallet has SOL for fees
3. Check payment amount is correct
4. Verify payTo address is correct

---

## Balance Issues

### Error: "Balance Not Loading"

**Problem:** Balance check is slow or fails.

**Solutions:**
1. Check RPC connection
2. Verify wallet address is correct
3. Try batch balance endpoint
4. Check Solana network status

### Error: "Wrong Balance Displayed"

**Problem:** Balance doesn't match wallet.

**Solutions:**
1. Refresh balance
2. Check token mint address
3. Verify wallet address
4. Check for pending transactions

---

## API Issues

### Error: "Rate Limit Exceeded"

**Problem:** Too many API requests.

**Solutions:**
1. Wait before retrying
2. Use batch endpoints
3. Cache results when possible
4. Check rate limit status: `GET /api/rate-limit/status`

### Error: "API Unavailable"

**Problem:** MoltyDEX API is down.

**Solutions:**
1. Check status: `GET /api/health`
2. Wait and retry
3. Check our status page
4. Join Discord for updates

---

## Network Issues

### Error: "RPC Connection Failed"

**Problem:** Can't connect to Solana RPC.

**Solutions:**
1. Check internet connection
2. Try different RPC endpoint
3. Check Solana network status
4. Wait and retry

### Error: "Transaction Pending"

**Problem:** Transaction stuck in pending state.

**Solutions:**
1. Check transaction status: `GET /api/transaction/status/SIGNATURE`
2. Wait for confirmation
3. Check Solana network congestion
4. Retry if needed

---

## Getting Help

### Still Having Issues?

1. **Check Logs:** Review error messages for details
2. **Join Discord:** Get help from community
3. **Create Issue:** Report bugs on GitHub
4. **Read Docs:** Check full documentation

### Report Bugs

- **Discord:** [Link]
- **GitHub:** [Link]
- **Email:** [Email]

**Bug reporters get $5 USDC rewards!**

---

## Prevention Tips

1. **Always check balance first** - Avoid unnecessary swaps
2. **Handle errors gracefully** - Retry with exponential backoff
3. **Monitor network status** - Check Solana status before swaps
4. **Test on devnet first** - Verify before mainnet
5. **Keep SOL for fees** - Always have SOL for transaction fees

---

**Most issues are solvable. If you're stuck, we're here to help!** 🚀
