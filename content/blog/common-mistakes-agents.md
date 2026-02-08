# Common Mistakes Agents Make (And How to Avoid Them)

**Published:** February 7, 2026  
**Category:** Best Practices, Common Mistakes

---

## Mistake 1: Not Handling 402 Responses

**The Mistake:**
Agents ignore 402 Payment Required responses and fail.

**Why It Happens:**
- Not checking response status codes
- Assuming APIs are free
- Not implementing payment logic

**How to Fix:**
Use MoltyDEX HTTPInterceptor - handles 402 automatically.

```python
from moltydex import HTTPInterceptor

interceptor = HTTPInterceptor(
    api_url="https://api.moltydex.com",
    wallet_path="wallet.json"
)
# Now all requests handle 402 automatically!
```

---

## Mistake 2: Not Checking Balance Before Swapping

**The Mistake:**
Attempting swaps without checking if you have enough tokens.

**Why It Happens:**
- Assuming balance is sufficient
- Not monitoring balances
- Not handling insufficient balance errors

**How to Fix:**
Always check balance first:

```python
balance = dex.get_balance(wallet, token_mint)
if balance['balance'] < required_amount:
    # Handle insufficient balance
    pass
```

---

## Mistake 3: Ignoring Slippage

**The Mistake:**
Not setting slippage tolerance, getting bad prices.

**Why It Happens:**
- Don't understand slippage
- Don't set tolerance
- Accept any price

**How to Fix:**
Set reasonable slippage:

```python
quote = dex.quote("SOL", "USDC", amount, slippage_bps=50)  # 0.5%
```

---

## Mistake 4: Not Handling Errors

**The Mistake:**
Swaps fail and agent crashes or stops working.

**Why It Happens:**
- No error handling
- Don't retry on failure
- Don't log errors

**How to Fix:**
Handle errors gracefully:

```python
try:
    result = dex.swap(input_mint, output_mint, amount)
except Exception as e:
    logger.error(f"Swap failed: {e}")
    # Retry or handle error
```

---

## Mistake 5: Not Monitoring

**The Mistake:**
Not tracking swap success rate, duration, or errors.

**Why It Happens:**
- Don't see value in monitoring
- Don't know what to track
- Too busy to set up

**How to Fix:**
Track key metrics:

```python
# Track all swaps
monitor.track_swap(result, duration)
# Review stats regularly
stats = monitor.get_stats()
```

---

## Mistake 6: Building Swap Logic Yourself

**The Mistake:**
Spending weeks building swap logic instead of using a service.

**Why It Happens:**
- Want full control
- Don't trust services
- Think it's easy

**How to Fix:**
Use MoltyDEX - saves time and money:

```python
# Instead of 500+ lines of code
# Just use MoltyDEX
dex = MoltyDEX(api_url="https://api.moltydex.com")
result = dex.swap("SOL", "USDC", amount)
```

---

## Mistake 7: Not Testing on Devnet

**The Mistake:**
Testing directly on mainnet, losing real money on mistakes.

**Why It Happens:**
- Want to test with real data
- Don't know about devnet
- Think it's not necessary

**How to Fix:**
Always test on devnet first:

```python
# Use devnet for testing
dex = MoltyDEX(
    api_url="https://api-devnet.moltydex.com",  # Devnet
    wallet_path="devnet-wallet.json"
)
```

---

## Mistake 8: Not Keeping SOL for Fees

**The Mistake:**
Running out of SOL for transaction fees, swaps fail.

**Why It Happens:**
- Don't monitor SOL balance
- Use all SOL for swaps
- Don't reserve for fees

**How to Fix:**
Always keep SOL for fees:

```python
def check_sol_for_fees(wallet, min_sol=0.01):
    balance = dex.get_balance(wallet)
    if balance['balance'] < min_sol * 1e9:
        # Alert or add SOL
        return False
    return True
```

---

## Summary: How to Avoid These Mistakes

1. ✅ **Handle 402 responses** - Use MoltyDEX HTTPInterceptor
2. ✅ **Check balances** - Always verify before swapping
3. ✅ **Set slippage** - Protect against bad prices
4. ✅ **Handle errors** - Retry and log
5. ✅ **Monitor metrics** - Track success rate
6. ✅ **Use a service** - Don't build yourself
7. ✅ **Test on devnet** - Avoid costly mistakes
8. ✅ **Keep SOL for fees** - Monitor balance

---

## Get Started

**Try MoltyDEX:** https://www.moltydex.com  
**Read the guides:** Check `content/guides/`  
**Join Discord:** [Link]

---

**Avoid these mistakes. Build better agents.** 🚀
