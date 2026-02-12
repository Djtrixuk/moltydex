// ============================================================
// Molty Trader - Type Definitions
// ============================================================

// -- DexScreener Types --

export interface DexScreenerPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  txns: {
    m5: { buys: number; sells: number };
    h1: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h24: { buys: number; sells: number };
  };
  volume: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  liquidity: {
    usd: number;
    base: number;
    quote: number;
  };
  fdv: number;
  marketCap: number;
  pairCreatedAt: number;
  info?: {
    imageUrl?: string;
    websites?: { label: string; url: string }[];
    socials?: { type: string; url: string }[];
  };
  boosts?: {
    active: number;
  };
}

export interface DexScreenerTokenProfile {
  url: string;
  chainId: string;
  tokenAddress: string;
  icon?: string;
  header?: string;
  description?: string;
  links?: { label: string; type: string; url: string }[];
}

export interface DexScreenerBoostToken {
  url: string;
  chainId: string;
  tokenAddress: string;
  amount: number;
  totalAmount: number;
  icon?: string;
  name?: string;
  description?: string;
}

// -- Scoring Types --

export interface TokenScores {
  momentum: number;     // 0-100
  liquidity: number;    // 0-100
  sentiment: number;    // 0-100
  risk: number;         // 0-100 (higher = safer)
  technical: number;    // 0-100
  composite: number;    // Weighted average
}

export interface TokenAnalysis {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  pairAddress: string;
  currentPriceUsd: number;
  currentPriceSol: number;
  scores: TokenScores;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio: number;
  positionSizeSol: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  rationale: string;
  timestamp: number;
}

// -- Position Types --

export type PositionStatus = 'open' | 'closed' | 'pending';
export type ExitReason = 'stop_loss' | 'take_profit' | 'trailing_stop' | 'time_stop' | 'emergency' | 'manual';

export interface Position {
  id: string;
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  pairAddress: string;
  entryPrice: number;
  entryPriceSol: number;
  entryTimestamp: number;
  amountToken: number;
  amountSolInvested: number;
  stopLoss: number;
  takeProfit: number;
  trailingStop: number | null;
  status: PositionStatus;
  exitPrice: number | null;
  exitTimestamp: number | null;
  exitReason: ExitReason | null;
  pnlSol: number | null;
  pnlPercent: number | null;
  txEntrySignature: string;
  txExitSignature: string | null;
}

// -- Portfolio Types --

export interface PortfolioMetrics {
  totalBudgetSol: number;
  investedSol: number;
  availableSol: number;
  totalPnlSol: number;
  totalPnlPercent: number;
  winCount: number;
  lossCount: number;
  winRate: number;
  averageRR: number;
  maxDrawdownPercent: number;
  dailyPnlSol: number;
  dailyPnlPercent: number;
  openPositions: number;
}

// -- Trade Types --

export interface TradeSignal {
  action: 'BUY' | 'SELL';
  tokenAddress: string;
  tokenSymbol: string;
  pairAddress: string;
  price: number;
  amount: number;
  reason: string;
}

export interface TradeResult {
  success: boolean;
  signature: string | null;
  error: string | null;
  executedPrice: number | null;
  executedAmount: number | null;
  timestamp: number;
}

// -- Ultra API Types --

export interface UltraOrderRequest {
  inputMint: string;
  outputMint: string;
  amount: number;
  taker: string;
}

export interface UltraOrderResponse {
  requestId: string;
  inAmount: string;
  outAmount: string;
  otherAmountThreshold: string;
  transaction: string;
  inputMint: string;
  outputMint: string;
}

export interface UltraExecuteRequest {
  signedTransaction: string;
  requestId: string;
}

export interface UltraExecuteResponse {
  status: string;
  signature: string;
  slot: number;
}

// -- Config Types --

export interface MoltyTraderConfig {
  budgetSol: number;
  maxPositions: number;
  maxRiskPerTrade: number;
  maxDailyLoss: number;
  minLiquidity: number;
  minPairAgeHours: number;
  slippageBps: number;
  scanIntervalMinutes: number;
  minRRRatio: number;
  moltydexApiUrl: string;
  solanaRpcUrl: string;
  discordWebhookUrl: string | null;
  telegramBotToken: string | null;
  telegramChatId: string | null;
}

// -- Notification Types --

export type NotificationLevel = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  level: NotificationLevel;
  title: string;
  message: string;
  timestamp: number;
  data?: Record<string, unknown>;
}

// -- Scan Result Types --

export interface ScanResult {
  timestamp: number;
  tokensScanned: number;
  tokensQualified: number;
  topPicks: TokenAnalysis[];
  tradesExecuted: number;
}
