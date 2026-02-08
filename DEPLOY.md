# MoltyDEX — Deploy & run

Single place for running and deploying the API and frontend.

---

## Prerequisites

- Node.js 18+
- [Jupiter API key](https://portal.jup.ag) (for real quotes/swaps)
- Solana wallet (Phantom/Solflare) for testing

---

## Run locally

**API**

```bash
cd api
npm install
cp .env.example .env
# Edit .env: set JUPITER_API_KEY (required), optional FEE_WALLET, SOLANA_RPC_URL
npm start
```

Runs at http://localhost:3001

**Frontend** (uses production API by default; set `NEXT_PUBLIC_API_URL=http://localhost:3001` in `frontend/.env.local` to use local API)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

---

## Deploy API (Vercel)

1. **Env:** In Vercel → API project → Settings → Environment Variables, add `JUPITER_API_KEY` (from [portal.jup.ag](https://portal.jup.ag)).

2. **Deploy from your machine** (recommended so latest code is used):

   ```bash
   cd api
   vercel --prod
   ```
   Link to existing project when asked (e.g. `moltydex-api`).

3. **Or redeploy from dashboard:** Vercel → API project → Deployments → ⋮ on latest → Redeploy.  
   Pushes from Git use the latest commit; for local changes deploy from the terminal (step 2).

**Check:** Open `https://your-api.vercel.app/api/health` — expect `"jupiter_api_key_set": true`.

---

## Deploy frontend (Vercel)

```bash
cd frontend
vercel --prod
```

Set root to `frontend` if prompted. Optional: add a custom domain in Vercel → project → Settings → Domains.

---

## Quick reference

| Task           | Command / URL |
|----------------|---------------|
| Run API        | `cd api && npm start` |
| Run frontend   | `cd frontend && npm run dev` |
| Deploy API     | `cd api && vercel --prod` |
| Deploy frontend| `cd frontend && vercel --prod` |
| Health check   | `https://your-api.vercel.app/api/health` |
| App (local)    | http://localhost:3000 |

See **TROUBLESHOOTING.md** for 503s, “Failed to fetch”, and swap issues.
