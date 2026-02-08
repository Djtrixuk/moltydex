# How Jupiter Aggregation Works: Why MoltyDEX Gets Best Prices

**Published:** February 7, 2026  
**Category:** Technical, Jupiter, Price Discovery

---

## What is Jupiter?

Jupiter is Solana's largest DEX aggregator. It doesn't operate its own DEX - instead, it routes trades through multiple DEXes to find the best prices.

**Supported DEXes:**
- Raydium
- Orca
- Meteora
- Phoenix
- And 20+ more

---

## How Aggregation Works

### Step 1: Price Discovery
Jupiter queries all DEXes simultaneously to find:
- Available liquidity
- Current prices
- Slippage estimates
- Route options

### Step 2: Route Optimization
Jupiter finds the optimal route:
- Direct swaps (if best price)
- Multi-hop swaps (if better)
- Split routes (if optimal)

### Step 3: Execution
Jupiter executes the swap through the best route(s).

---

## Why This Matters

### Without Aggregation
You pick one DEX:
- Might not have best price
- Might not have liquidity
- Limited options

### With Aggregation (MoltyDEX)
Jupiter finds best price:
- Checks all DEXes
- Finds optimal route
- Gets best price automatically

---

## Real Example

**Swap:** 1 SOL → USDC

**DEX Prices:**
- Raydium: 249.5 USDC
- Orca: 250.0 USDC
- Meteora: 249.8 USDC

**Without Aggregation:**
- You pick Raydium: Get 249.5 USDC

**With Aggregation (MoltyDEX):**
- Jupiter picks Orca: Get 250.0 USDC
- **Savings:** 0.5 USDC (0.2%)

---

## Price Impact

### Small Swaps
- Price impact: Minimal
- Best route: Usually direct

### Large Swaps
- Price impact: Can be significant
- Best route: Often multi-hop or split

**Jupiter handles this automatically.**

---

## Slippage Protection

Jupiter also considers:
- Slippage tolerance
- Price impact
- Route complexity
- Gas costs

**Result:** Optimal swap for your parameters.

---

## Why MoltyDEX Uses Jupiter

1. **Best Prices:** Always get optimal prices
2. **Liquidity:** Access to all DEXes
3. **Reliability:** Jupiter is battle-tested
4. **Optimization:** Automatic route optimization

---

## Technical Details

### How MoltyDEX Integrates

1. **Quote Request:** MoltyDEX → Jupiter
2. **Route Found:** Jupiter → Best route
3. **Transaction Built:** MoltyDEX builds transaction
4. **Client Signs:** You sign securely
5. **Executed:** Swap happens on-chain

**All transparent. All automatic.**

---

## Benefits for Agents

1. **Best Prices:** Save money on every swap
2. **Reliability:** Jupiter handles routing
3. **Simplicity:** One API call, best price
4. **Future-Proof:** New DEXes added automatically

---

## Get Started

**Try MoltyDEX:** https://www.moltydex.com  
**See prices:** Get a quote and compare!

---

**Get the best prices automatically with MoltyDEX + Jupiter.** 🚀
