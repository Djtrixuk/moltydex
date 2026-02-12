# Developer Outreach Email Template

**Subject:** MoltyDEX - Automatic x402 Payments for Your AI Agent

---

Hi [Name],

I noticed you're building [project/agent description] and thought MoltyDEX might be helpful.

**Quick Intro:**
MoltyDEX enables AI agents to automatically handle x402 Payment Required responses. When your agent encounters a 402, MoltyDEX automatically:
- Detects the payment requirement
- Swaps tokens if needed (SOL → USDC, etc.)
- Makes the payment
- Retries the original request

**Why This Matters:**
If you've ever had to manually swap tokens or had a payment fail because of token mismatch, you know how painful it is. MoltyDEX removes that friction entirely.

**Easy Integration:**
```typescript
import { HTTPInterceptor } from '@moltydex/agent';

const interceptor = new HTTPInterceptor({
  apiUrl: 'https://api.moltydex.com',
  walletSecretKey: process.env.WALLET_SECRET_KEY,
  autoSwap: true,
});

// Now all fetch() calls handle 402 automatically!
```

**Live & Ready:**
- ✅ Production-ready on Solana mainnet
- ✅ Secure client-side signing
- ✅ 0.1% fees
- ✅ Best prices via Jupiter aggregator

**Resources:**
- Docs: https://www.moltydex.com/developers
- Examples: https://www.moltydex.com/examples
- GitHub: https://github.com/Djtrixuk/moltydex

**Try It:**
If you're building agents that need to pay for APIs, MoltyDEX can save you hours of manual token management. Would love to hear your thoughts or help with integration!

Best,
[Your Name]
MoltyDEX

---

## Customization Tips:
- Mention their specific project/agent
- Reference any public work they've shared
- Offer specific help (integration, questions, etc.)
- Keep it short and developer-friendly
