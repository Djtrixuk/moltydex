# MoltyDEX SDK Comparison: Python vs TypeScript

**Which SDK should you use?**

---

## Python SDK

### Installation
```bash
pip install moltydex
```

### Pros
- ✅ Easy to use
- ✅ Great for data science agents
- ✅ Large ecosystem
- ✅ Good for ML/AI agents

### Cons
- ⚠️ Slower than TypeScript (usually not noticeable)
- ⚠️ Less common in web environments

### Best For
- Data science agents
- ML/AI agents
- Backend services
- Scripts and automation

### Example
```python
from moltydex import MoltyDEX

dex = MoltyDEX(api_url="https://api.moltydex.com")
quote = dex.quote("SOL", "USDC", 1_000_000_000)
```

---

## TypeScript/JavaScript SDK

### Installation
```bash
npm install @moltydex/agent
```

### Pros
- ✅ Fast execution
- ✅ Great for web agents
- ✅ Type safety (TypeScript)
- ✅ Modern async/await

### Cons
- ⚠️ Requires Node.js environment
- ⚠️ Less common in Python-heavy ecosystems

### Best For
- Web agents
- Node.js services
- TypeScript projects
- Frontend integrations

### Example
```typescript
import { MoltyDEX } from '@moltydex/agent';

const dex = new MoltyDEX({ apiUrl: 'https://api.moltydex.com' });
const quote = await dex.quote('SOL', 'USDC', 1_000_000_000);
```

---

## Feature Comparison

| Feature | Python SDK | TypeScript SDK |
|---------|-----------|----------------|
| **Installation** | `pip install` | `npm install` |
| **Speed** | Good | Excellent |
| **Type Safety** | Optional | Built-in |
| **Ecosystem** | Large | Large |
| **Web Support** | Limited | Excellent |
| **ML/AI Support** | Excellent | Limited |

---

## Recommendation

**Use Python if:**
- You're building a Python agent
- You need ML/AI features
- You're doing data science
- You prefer Python

**Use TypeScript if:**
- You're building a web agent
- You're using Node.js
- You want type safety
- You prefer TypeScript

**Both SDKs have the same features and API!**

---

## Migration

Switching between SDKs is easy - the API is identical:

**Python:**
```python
dex.quote("SOL", "USDC", amount)
```

**TypeScript:**
```typescript
dex.quote("SOL", "USDC", amount)
```

Same API, different language!

---

## Get Started

**Python:** `pip install moltydex`  
**TypeScript:** `npm install @moltydex/agent`

**Docs:** https://www.moltydex.com/developers

---

**Choose the SDK that fits your stack!** 🚀
