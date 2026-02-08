# Understanding Slippage in Token Swaps

**Published:** February 7, 2026  
**Category:** Educational, Trading

---

## What is Slippage?

Slippage is the difference between the expected price and the actual execution price of a swap.

**Example:**
- Expected: 1 SOL = 250 USDC
- Actual: 1 SOL = 249.5 USDC
- **Slippage:** 0.5 USDC (0.2%)

---

## Why Slippage Happens

### 1. Market Movement
Prices change between quote and execution.

### 2. Liquidity
Low liquidity = higher slippage.

### 3. Swap Size
Large swaps = more slippage.

### 4. Route Complexity
Multi-hop swaps can have more slippage.

---

## How MoltyDEX Handles Slippage

### Slippage Tolerance

You can set slippage tolerance:
- **Default:** 0.5% (50 basis points)
- **Custom:** Set via `slippage_bps` parameter

### Example

```python
quote = dex.quote(
    "SOL", "USDC", amount,
    slippage_bps=100  # 1% slippage tolerance
)
```

### Protection

MoltyDEX ensures you get at least:
```
minimum_output = expected_output * (1 - slippage_tolerance)
```

If actual output is less, transaction fails (protects you).

---

## Slippage vs Price Impact

### Slippage
- Difference between expected and actual price
- Can be positive or negative
- Usually small (<1%)

### Price Impact
- How much your swap moves the market
- Always increases with swap size
- Can be significant for large swaps

**MoltyDEX shows both in quotes.**

---

## Best Practices

### 1. Set Reasonable Slippage
- **Small swaps:** 0.5% (50 bps)
- **Medium swaps:** 1% (100 bps)
- **Large swaps:** 2% (200 bps)

### 2. Check Price Impact
- **Low impact:** <0.5% (good)
- **Medium impact:** 0.5-2% (acceptable)
- **High impact:** >2% (consider splitting)

### 3. Monitor Market Conditions
- High volatility = more slippage
- Low liquidity = more slippage
- Network congestion = more slippage

---

## Real Examples

### Example 1: Small Swap
- **Amount:** 0.1 SOL
- **Slippage:** 0.1% (minimal)
- **Price Impact:** 0.01% (negligible)

### Example 2: Large Swap
- **Amount:** 100 SOL
- **Slippage:** 0.5% (acceptable)
- **Price Impact:** 2% (significant)

**Solution:** Split into smaller swaps if price impact is too high.

---

## How Jupiter Helps

Jupiter finds optimal routes to minimize slippage:
- **Direct swaps:** If best price
- **Multi-hop:** If better overall
- **Split routes:** If optimal

**Result:** Best possible execution price.

---

## Get Started

**Try MoltyDEX:** https://www.moltydex.com  
**Get a quote:** See slippage and price impact

---

**Understand slippage. Get better swaps.** 🚀
