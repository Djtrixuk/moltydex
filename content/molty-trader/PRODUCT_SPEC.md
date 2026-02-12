# Molty Trader -- AI-Powered Autonomous Trading Agent

## Product Vision

Molty Trader is an autonomous AI trading agent that analyses the top trending tokens on Solana daily, identifies the highest-probability trade setups using detailed technical and sentiment analysis, and executes them automatically through MoltyDEX. It runs on autopilot, making profitable trades on the hourly chart while the user sleeps.

**Brand:** Powered by Molty, the MoltyDEX mascot
**Tagline:** "Molty never sleeps. Molty always trades."

---

## How It Works (User Perspective)

1. User connects their Solana wallet to Molty Trader
2. Sets a trading budget (e.g. 5 SOL) and risk parameters
3. Molty scans DexScreener's top 50 trending tokens every day
4. AI analyses each token across multiple dimensions
5. Picks the top 3 setups with the best risk/reward ratio
6. Executes entries automatically on the hourly chart
7. Manages positions with stop-losses and take-profit targets
8. User gets notifications on entries, exits, and daily P&L summaries

---

## Core Architecture

```
+-------------------+     +--------------------+     +------------------+
|   DexScreener     |     |   AI Analysis      |     |   MoltyDEX       |
|   Data Feed       |---->|   Engine           |---->|   Swap Execution |
|   (Top 50 tokens) |     |   (Signal Gen)     |     |   (Ultra API)    |
+-------------------+     +--------------------+     +------------------+
        |                         |                          |
        v                         v                          v
+-------------------+     +--------------------+     +------------------+
|   Price/Volume    |     |   Trade Scoring    |     |   Position       |
|   OHLCV Data      |     |   & Ranking        |     |   Manager        |
+-------------------+     +--------------------+     +------------------+
                                  |
                                  v
                          +--------------------+
                          |   Risk Manager     |
                          |   (Stops, Sizing)  |
                          +--------------------+
                                  |
                                  v
                          +--------------------+
                          |   Notification     |
                          |   System           |
                          +--------------------+
```

---

## Module Breakdown

### Module 1: DexScreener Data Feed

**Purpose:** Fetch and normalise the top trending Solana tokens daily.

**Data Source:** DexScreener API (free tier)
- `GET /latest/dex/tokens/{address}` -- Token pair data
- `GET /latest/dex/search?q={query}` -- Search tokens
- `GET /token-boosts/top/v1` -- Top boosted tokens
- `GET /token-profiles/latest/v1` -- Latest token profiles

**Data Collected Per Token:**
- Price (USD and SOL denominated)
- 5m, 1h, 6h, 24h price change percentages
- 24h volume
- Liquidity (pooled amounts)
- Market cap / FDV
- Transaction count (buys vs sells)
- Unique makers (buyers vs sellers)
- Pair age
- Boost count (social signal)

**Schedule:** Run every hour at :00 minutes
**Storage:** JSON files + optional Redis cache
**Output:** Ranked list of 50 tokens with normalised metrics

---

### Module 2: AI Analysis Engine

**Purpose:** Score each token on multiple dimensions and identify the top 3 trade setups.

**Analysis Dimensions:**

1. **Momentum Score (0-100)**
   - Price trend on 1h, 6h, 24h timeframes
   - Volume trend (increasing = bullish)
   - Buy/sell ratio (more buyers = bullish)
   - Rate of change acceleration

2. **Liquidity Score (0-100)**
   - Minimum liquidity threshold ($50K+)
   - Depth relative to position size
   - Pooled token balance health
   - Slippage estimation for target trade size

3. **Sentiment Score (0-100)**
   - Boost count (paid promotion signal)
   - Unique maker growth rate
   - Buy vs sell volume ratio
   - Social signal from token profile data

4. **Risk Score (0-100, lower = riskier)**
   - Pair age (older = safer)
   - Holder distribution (via on-chain data)
   - Liquidity lock status
   - Audit status from DexScreener
   - Volatility assessment (ATR)

5. **Technical Score (0-100)**
   - Hourly chart pattern recognition
   - Support/resistance levels from recent price action
   - Volume profile analysis
   - Mean reversion vs trend continuation signals

**Composite Score:**
```
final_score = (momentum * 0.30) + (liquidity * 0.15) + (sentiment * 0.20) 
            + (risk * 0.15) + (technical * 0.20)
```

**Output:** Top 3 tokens ranked by final_score with:
- Entry price and entry rationale
- Stop-loss level (based on ATR or support)
- Take-profit target(s) (1:2 or 1:3 R:R minimum)
- Position size recommendation
- Confidence level (HIGH / MEDIUM / LOW)

---

### Module 3: Trade Execution Engine

**Purpose:** Execute trades through MoltyDEX using Jupiter Ultra API.

**Entry Logic:**
- Place market buy via Ultra API `/order` + `/execute`
- Maximum slippage: 1% (configurable)
- Position sized as percentage of trading budget
- Never risk more than 2% of total budget per trade

**Exit Logic (Hourly Check):**
- **Stop-Loss:** If price drops below stop level, execute market sell
- **Take-Profit:** If price reaches TP target, execute market sell
- **Trailing Stop:** After 1:1 R:R reached, trail stop to breakeven
- **Time Stop:** Close position after 24h if neither SL nor TP hit
- **Emergency Exit:** If liquidity drops below threshold, close immediately

**Execution Flow:**
```
1. Fetch current price from DexScreener
2. Compare to entry price, SL, and TP levels
3. If exit condition met:
   a. Get Ultra order (sell token -> SOL)
   b. Sign transaction with agent wallet
   c. Execute via Ultra execute endpoint
   d. Log trade result
   e. Notify user
4. If no exit condition: continue monitoring
```

---

### Module 4: Position Manager

**Purpose:** Track all open positions and portfolio state.

**Data Structure (per position):**
```typescript
interface Position {
  id: string;
  tokenAddress: string;
  tokenSymbol: string;
  entryPrice: number;          // USD
  entryPriceSol: number;       // SOL
  entryTimestamp: number;
  amountToken: number;         // tokens held
  amountSolInvested: number;   // SOL spent
  stopLoss: number;            // USD price
  takeProfit: number;          // USD price
  trailingStop: number | null; // USD price (activated after 1:1)
  status: 'open' | 'closed' | 'pending';
  exitPrice: number | null;
  exitTimestamp: number | null;
  exitReason: 'stop_loss' | 'take_profit' | 'trailing_stop' | 'time_stop' | 'emergency' | 'manual' | null;
  pnlSol: number | null;
  pnlPercent: number | null;
  txEntrySignature: string;
  txExitSignature: string | null;
}
```

**Storage:** JSON file (local) + optional database for persistence
**Portfolio Metrics:**
- Total P&L (SOL and %)
- Win rate
- Average R:R achieved
- Max drawdown
- Sharpe ratio (rolling 30 days)

---

### Module 5: Risk Manager

**Purpose:** Enforce risk rules to protect the trading budget.

**Rules:**
1. **Max Position Size:** No single trade > 10% of budget
2. **Max Concurrent Positions:** 3 at any time
3. **Max Daily Loss:** Stop trading if daily loss exceeds 5% of budget
4. **Minimum Liquidity:** Skip tokens with < $50K liquidity
5. **Minimum Pair Age:** Skip tokens younger than 2 hours
6. **Cooldown After Loss:** 1 hour cooldown after a stop-loss hit
7. **Budget Reserve:** Always keep 20% of budget uninvested (for gas + recovery)
8. **Correlation Check:** Don't enter 2 tokens that are > 80% correlated

---

### Module 6: Notification System

**Purpose:** Keep the user informed without requiring them to watch.

**Channels:**
- Console/terminal logs (always)
- Webhook (Discord, Telegram -- configurable)
- Moltbook post (optional daily summary)

**Notification Events:**
- Trade entry (token, amount, entry price, SL, TP)
- Trade exit (token, exit price, P&L, reason)
- Daily summary (trades taken, P&L, portfolio value)
- Risk alert (max loss approaching, liquidity warning)
- Error alert (API failure, execution failure)

---

## File Structure

```
molty-trader/
  src/
    index.ts                  # Main entry point / daemon
    config.ts                 # Configuration and env vars
    modules/
      dexscreener.ts          # DexScreener data feed
      analyzer.ts             # AI analysis engine
      executor.ts             # Trade execution via MoltyDEX
      positions.ts            # Position manager
      risk.ts                 # Risk manager
      notifications.ts        # Notification system
    utils/
      indicators.ts           # Technical indicators (ATR, RSI, etc.)
      scoring.ts              # Token scoring algorithms
      formatting.ts           # Display formatting
    types/
      index.ts                # TypeScript interfaces
    data/
      positions.json          # Persisted positions
      history.json            # Trade history
      daily-scans.json        # Daily scan results
  package.json
  tsconfig.json
  .env.example
  README.md
```

---

## Configuration

```env
# Molty Trader Configuration
MOLTY_TRADER_BUDGET_SOL=5            # Total trading budget in SOL
MOLTY_TRADER_MAX_POSITIONS=3          # Max concurrent positions
MOLTY_TRADER_MAX_RISK_PER_TRADE=0.02  # 2% max risk per trade
MOLTY_TRADER_MAX_DAILY_LOSS=0.05      # 5% max daily loss
MOLTY_TRADER_MIN_LIQUIDITY=50000      # Minimum $50K liquidity
MOLTY_TRADER_MIN_PAIR_AGE_HOURS=2     # Minimum pair age
MOLTY_TRADER_SLIPPAGE_BPS=100         # 1% max slippage
MOLTY_TRADER_SCAN_INTERVAL_MINUTES=60 # Scan every 60 minutes
MOLTY_TRADER_MIN_RR_RATIO=2           # Minimum 1:2 risk/reward

# MoltyDEX API
MOLTYDEX_API_URL=https://api.moltydex.com
MOLTYDEX_API_KEY=                      # Optional API key

# Wallet (agent wallet, NOT the user's main wallet)
SOLANA_PRIVATE_KEY=                    # Base58 encoded private key
SOLANA_RPC_URL=                        # Solana RPC endpoint

# Notifications
DISCORD_WEBHOOK_URL=                   # Discord webhook for alerts
TELEGRAM_BOT_TOKEN=                    # Telegram bot token
TELEGRAM_CHAT_ID=                      # Telegram chat ID
```

---

## Daily Workflow

```
HOUR 0 (Midnight or configured start):
  1. Fetch DexScreener top trending Solana tokens
  2. Filter: min liquidity, min age, audit status
  3. Collect OHLCV and metrics for each token
  4. Run AI analysis on all qualifying tokens
  5. Rank by composite score
  6. Select top 3 setups with best R:R
  7. Post daily analysis to logs/notifications

EVERY HOUR:
  1. Check existing open positions against SL/TP/trailing
  2. Execute exits if conditions met
  3. If position slots available AND within daily risk budget:
     a. Re-scan for new opportunities
     b. Enter if high-confidence setup found
  4. Update portfolio metrics
  5. Log hourly status

END OF DAY:
  1. Force-close any remaining positions (time stop)
  2. Calculate daily P&L
  3. Post daily summary
  4. Reset daily risk counters
  5. Archive scan data
```

---

## MVP Scope (Phase 1)

Build the minimum viable trading agent:

1. DexScreener data fetch (top 50 trending tokens)
2. Basic scoring algorithm (momentum + liquidity + risk)
3. Top 3 selection with entry/SL/TP levels
4. Automated execution via MoltyDEX Ultra API
5. Hourly position monitoring with SL/TP exits
6. Console logging and basic Discord webhook notifications
7. JSON-based position tracking
8. Basic risk rules (max position size, max positions, min liquidity)

**Not in MVP:**
- Web dashboard
- Advanced technical indicators
- Machine learning model
- Backtesting engine
- Multi-wallet support
- Token correlation analysis

---

## Revenue Model

1. **Subscription:** Monthly fee for Molty Trader access
2. **Performance Fee:** Small % of profitable trades
3. **$MOLTY Staking:** Stake $MOLTY tokens to access the agent
4. **Premium Tier:** Higher budgets, more positions, faster scans

---

## Branding

- **Name:** Molty Trader
- **Voice:** Molty's personality -- confident, direct, slightly cocky
- **Notifications in Molty's voice:**
  - Entry: "Spotted a setup. Entering COPPERINU at $0.012. SL at $0.011. TP at $0.015. Let me cook."
  - Win: "Called it. COPPERINU hit TP. +25% in 6 hours. You are welcome."
  - Loss: "GIRAFFES stopped out. -8%. It happens. Moving on."
  - Daily: "Today: 2 wins, 1 loss. Net +12% on the day. Molty does not sleep."

---

## Technical Dependencies

**Already Available (reuse from MoltyDEX):**
- Jupiter Ultra API integration (order + execute)
- Solana wallet management and transaction signing
- Token metadata and balance checking
- Rate limiting and error handling
- Cron/daemon infrastructure
- Analytics tracking

**New Dependencies:**
- DexScreener API (free, no key required)
- Simple technical indicators library (or custom)
- Notification webhooks (Discord/Telegram)

---

## Risk Disclaimer

Molty Trader is an experimental autonomous trading agent. Cryptocurrency trading carries significant risk. Past performance does not guarantee future results. Users should only trade with funds they can afford to lose. The AI analysis is probabilistic, not guaranteed. Always monitor your positions and understand the risks involved.

---

*"I never sleep. I never stop scanning. I trade so you do not have to." -- Molty*
