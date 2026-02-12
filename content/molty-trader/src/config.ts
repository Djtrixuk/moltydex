// ============================================================
// Molty Trader - Configuration
// ============================================================

import dotenv from 'dotenv';
import path from 'path';
import { MoltyTraderConfig } from './types';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

function getEnvNumber(key: string, defaultVal: number): number {
  const val = process.env[key];
  if (!val) return defaultVal;
  const parsed = parseFloat(val);
  if (isNaN(parsed)) return defaultVal;
  return parsed;
}

function getEnvString(key: string, defaultVal: string): string {
  return process.env[key] || defaultVal;
}

function getEnvStringOptional(key: string): string | null {
  return process.env[key] || null;
}

export const config: MoltyTraderConfig = {
  budgetSol: getEnvNumber('MOLTY_TRADER_BUDGET_SOL', 5),
  maxPositions: getEnvNumber('MOLTY_TRADER_MAX_POSITIONS', 3),
  maxRiskPerTrade: getEnvNumber('MOLTY_TRADER_MAX_RISK_PER_TRADE', 0.02),
  maxDailyLoss: getEnvNumber('MOLTY_TRADER_MAX_DAILY_LOSS', 0.05),
  minLiquidity: getEnvNumber('MOLTY_TRADER_MIN_LIQUIDITY', 50000),
  minPairAgeHours: getEnvNumber('MOLTY_TRADER_MIN_PAIR_AGE_HOURS', 2),
  slippageBps: getEnvNumber('MOLTY_TRADER_SLIPPAGE_BPS', 100),
  scanIntervalMinutes: getEnvNumber('MOLTY_TRADER_SCAN_INTERVAL_MINUTES', 60),
  minRRRatio: getEnvNumber('MOLTY_TRADER_MIN_RR_RATIO', 2),
  moltydexApiUrl: getEnvString('MOLTYDEX_API_URL', 'https://api.moltydex.com'),
  solanaRpcUrl: getEnvString('SOLANA_RPC_URL', 'https://api.mainnet-beta.solana.com'),
  discordWebhookUrl: getEnvStringOptional('DISCORD_WEBHOOK_URL'),
  telegramBotToken: getEnvStringOptional('TELEGRAM_BOT_TOKEN'),
  telegramChatId: getEnvStringOptional('TELEGRAM_CHAT_ID'),
};

// Solana constants
export const SOL_MINT = 'So11111111111111111111111111111111111111112';
export const JUPITER_ULTRA_ORDER_URL = 'https://lite.jup.ag/ultra/v1/order';
export const JUPITER_ULTRA_EXECUTE_URL = 'https://lite.jup.ag/ultra/v1/execute';
export const DEXSCREENER_API = 'https://api.dexscreener.com';

// Scoring weights
export const SCORE_WEIGHTS = {
  momentum: 0.30,
  liquidity: 0.15,
  sentiment: 0.20,
  risk: 0.15,
  technical: 0.20,
};

export default config;
