# MoltyDEX – Troubleshooting

Quick fixes for common issues so the app runs smoothly.

---

## "Failed to fetch" / "Couldn't reach the API"

- **Cause:** Frontend can't reach the API (network, CORS, or API down).
- **Do this:**
  1. Open **https://api.moltydex.com/api/health** in a browser. If it doesn't load, the API is down or your network is blocking it.
  2. If you run the frontend locally, ensure `NEXT_PUBLIC_API_URL` in `frontend/.env.local` is `https://api.moltydex.com` (or your API URL). Don't point at `localhost:3001` unless the API is actually running there.
  3. The app retries once on 5xx; if it still fails, wait a moment and try again.

---

## "Jupiter API unavailable" (503)

- **Cause:** API can't reach Jupiter (missing key, Jupiter down, or DNS).
- **Do this:**
  1. In Vercel → your **API** project → **Settings** → **Environment Variables**, confirm **`JUPITER_API_KEY`** is set (get a key at https://portal.jup.ag).
  2. **Redeploy** the API after adding or changing env vars (Deployments → ⋮ → Redeploy), or deploy from your machine: `cd api && vercel --prod`.
  3. Check Jupiter status: https://status.jup.ag

---

## Quote loads but swap fails (e.g. simulation / transaction failed)

- **Cause:** Wallet on wrong network, not enough balance, or quote too old.
- **Do this:**
  1. **Network:** Wallet must be on **Mainnet** (Phantom/Solflare: switch in settings). The app uses Mainnet only.
  2. **Balance:** You need enough SOL for the swap **and** fees (e.g. 0.01 SOL buffer). For SOL → USDC you need SOL; for USDC → SOL you need USDC.
  3. **Stale quote:** If the quote is older than ~30 seconds, click **Refetch** in the yellow banner, then Swap again.
  4. **Slippage:** If you see "Price moved" or "slippage", refetch quote and try again; the UI uses 0.5% slippage.

---

## Transaction expired / block height exceeded

- **Cause:** Took too long between getting the quote and sending the tx.
- **Do this:** Get a new quote (change amount slightly or click Refetch), then Swap right away.

---

## Slow or unreliable RPC (long waits, timeouts)

- **Cause:** Default public RPC (api.mainnet-beta.solana.com) is rate-limited and can be slow.
- **Do this:** Use a dedicated RPC and set it in the frontend:
  1. Get a mainnet RPC URL (e.g. Helius, QuickNode, Triton).
  2. In `frontend/.env.local` add:  
     **`NEXT_PUBLIC_SOLANA_RPC=https://your-rpc-url-here`**
  3. Restart the dev server. The app will use this RPC for sending transactions.

---

## Checklist for "runs super smoothly"

| Item | Check |
|------|--------|
| API | `JUPITER_API_KEY` set in Vercel; API redeployed after changes. |
| Frontend | Uses production API URL (or intended API). Wallet on **Mainnet**. |
| Quote | Refetch if older than ~30s before swapping. |
| Balance | Enough SOL + input token; small SOL buffer for fees. |
| RPC (optional) | Set `NEXT_PUBLIC_SOLANA_RPC` for a faster, more reliable RPC. |
