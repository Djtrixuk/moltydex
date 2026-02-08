# MoltyDEX Integration Guides

Complete guides for integrating MoltyDEX into popular frameworks and tools.

## Table of Contents

- [LangChain Integration](#langchain-integration)
- [AutoGPT Integration](#autogpt-integration)
- [Cursor Agents](#cursor-agents)
- [Custom Python Agents](#custom-python-agents)
- [TypeScript/JavaScript](#typescriptjavascript)
- [React Hooks](#react-hooks)

## LangChain Integration

### Installation

```bash
pip install langchain moltydex
```

### Basic Integration

```python
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain_openai import ChatOpenAI
from moltydex import MoltyDEX

# Initialize MoltyDEX
dex = MoltyDEX(
    wallet_path="wallet.json",
    api_url="https://api.moltydex.com"
)

# Create a tool for token swapping
def swap_tokens(input_mint: str, output_mint: str, amount: int):
    """Swap tokens using MoltyDEX"""
    result = dex.swap(input_mint, output_mint, amount)
    return f"Swap completed: {result['signature']}"

# Add to LangChain tools
tools = [
    Tool(
        name="swap_tokens",
        func=swap_tokens,
        description="Swap tokens on Solana using MoltyDEX"
    )
]

# Use in your agent
agent = create_openai_functions_agent(
    llm=ChatOpenAI(),
    tools=tools,
    prompt=prompt
)
```

### x402 Payment Handling

```python
from langchain.tools import Tool
from moltydex import MoltyDEX

dex = MoltyDEX(wallet_path="wallet.json")

def handle_402_payment(payment_response):
    """Handle 402 Payment Required responses"""
    return dex.handle_x402_payment(payment_response)

tools.append(
    Tool(
        name="handle_402_payment",
        func=handle_402_payment,
        description="Handle 402 Payment Required responses automatically"
    )
)
```

See `examples/langchain-integration.py` for complete example.

## AutoGPT Integration

### Plugin Setup

1. Create `moltydex_plugin.py`:

```python
from autogpt_plugin import AutoGPTPlugin
from moltydex import MoltyDEX

class MoltyDEXPlugin(AutoGPTPlugin):
    def __init__(self):
        self.dex = MoltyDEX(wallet_path="wallet.json")
    
    def swap_tokens(self, input_mint: str, output_mint: str, amount: int):
        """Swap tokens for AutoGPT"""
        return self.dex.swap(input_mint, output_mint, amount)
```

2. Add to AutoGPT plugins directory
3. Enable in AutoGPT configuration

See `examples/autogpt-plugin.py` for complete example.

## Cursor Agents

### Integration Steps

1. **Add MoltyDEX SDK** to your Cursor agent project
2. **Create swap tool**:

```python
from moltydex import MoltyDEX

dex = MoltyDEX(wallet_path="wallet.json")

@tool
def swap_tokens(input_mint: str, output_mint: str, amount: int) -> str:
    """Swap tokens using MoltyDEX DEX aggregator"""
    result = dex.swap(input_mint, output_mint, amount)
    return f"Swapped {amount} {input_mint} for {result['output_amount']} {output_mint}. TX: {result['signature']}"
```

3. **Register tool** with Cursor agent
4. **Use in prompts**: "Swap 1 SOL to USDC using MoltyDEX"

## Custom Python Agents

### Basic Setup

```python
from moltydex import MoltyDEX
import requests

# Initialize
dex = MoltyDEX(
    wallet_path="wallet.json",
    api_url="https://api.moltydex.com"
)

# Make API call that might require payment
def call_api(url):
    response = requests.get(url)
    
    # Handle 402 Payment Required
    if response.status_code == 402:
        payment_result = dex.handle_x402_payment(response)
        # Retry original request with payment
        headers = {'X-Payment': payment_result['signature']}
        response = requests.get(url, headers=headers)
    
    return response.json()
```

### Error Handling

```python
try:
    result = dex.swap(input_mint, output_mint, amount)
except Exception as e:
    print(f"Swap failed: {e}")
    # Handle error (retry, fallback, etc.)
```

## TypeScript/JavaScript

### Installation

```bash
npm install @solana/web3.js
```

### Basic Usage

```typescript
import { Connection, PublicKey } from '@solana/web3.js';

const API_URL = 'https://api.moltydex.com';

async function getQuote(
  inputMint: string,
  outputMint: string,
  amount: string
) {
  const response = await fetch(
    `${API_URL}/api/quote?input_mint=${inputMint}&output_mint=${outputMint}&amount=${amount}`
  );
  return await response.json();
}

async function buildSwap(
  walletAddress: string,
  inputMint: string,
  outputMint: string,
  amount: string
) {
  const response = await fetch(`${API_URL}/api/swap/build`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      wallet_address: walletAddress,
      input_mint: inputMint,
      output_mint: outputMint,
      amount: amount,
    }),
  });
  return await response.json();
}
```

See `examples/typescript-example.ts` for complete example.

## React Hooks

### Custom Hook

```typescript
import { useState, useCallback } from 'react';

export function useMoltyDEX() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getQuote = useCallback(async (
    inputMint: string,
    outputMint: string,
    amount: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.moltydex.com/api/quote?input_mint=${inputMint}&output_mint=${outputMint}&amount=${amount}`
      );
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getQuote, loading, error };
}
```

### Usage in Component

```typescript
function SwapComponent() {
  const { getQuote, loading, error } = useMoltyDEX();

  const handleSwap = async () => {
    const quote = await getQuote('SOL', 'USDC', '1000000000');
    console.log('Quote:', quote);
  };

  return (
    <button onClick={handleSwap} disabled={loading}>
      {loading ? 'Loading...' : 'Get Quote'}
    </button>
  );
}
```

See `examples/react-example.tsx` for complete example.

## Best Practices

1. **Error Handling**: Always wrap API calls in try-catch
2. **Rate Limiting**: Respect API rate limits (100 requests/minute)
3. **Transaction Signing**: Always sign transactions client-side
4. **Balance Checks**: Check balances before swapping
5. **Retry Logic**: Implement retry logic for failed swaps
6. **Logging**: Log all swap transactions for debugging

## Support

- **Documentation**: https://moltydex.com/developers
- **API Docs**: https://api.moltydex.com/api-docs
- **Issues**: https://github.com/your-username/agentdex/issues
