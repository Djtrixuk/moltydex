# MoltyDEX React Hooks

React hooks for integrating MoltyDEX into your React applications. Perfect for building x402 payment UIs.

## Installation

```bash
npm install moltydex-react @solana/wallet-adapter-react
# or
yarn add moltydex-react @solana/wallet-adapter-react
```

## Quick Start

```tsx
import { useMoltyDEX } from 'moltydex-react';
import { useWallet } from '@solana/wallet-adapter-react';

function SwapComponent() {
  const { publicKey } = useWallet();
  const { quote, swap, loading, error } = useMoltyDEX();

  const handleSwap = async () => {
    const quoteResult = await quote({
      inputMint: 'So11111111111111111111111111111111111111112', // SOL
      outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
      amount: 1_000_000_000, // 1 SOL
    });

    if (quoteResult) {
      const signature = await swap({
        inputMint: 'So11111111111111111111111111111111111111112',
        outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        amount: 1_000_000_000,
      });
    }
  };

  return (
    <button onClick={handleSwap} disabled={loading || !publicKey}>
      {loading ? 'Processing...' : 'Swap'}
    </button>
  );
}
```

## Hooks

### `useMoltyDEX()`

Main hook for MoltyDEX operations.

```tsx
const { quote, swap, balance, loading, error } = useMoltyDEX();
```

**Returns:**
- `quote` - Get swap quote
- `swap` - Execute swap
- `balance` - Check token balance
- `loading` - Loading state
- `error` - Error message

### `useX402Payment()`

Hook for handling x402 payments.

```tsx
const { handle402Response, loading } = useX402Payment();

const response = await fetch('https://api.example.com/data');
if (response.status === 402) {
  const paidResponse = await handle402Response(response, url);
}
```

## Features

✅ **React Native** - Works with React hooks  
✅ **Wallet Integration** - Works with Solana wallet adapters  
✅ **TypeScript** - Full type definitions  
✅ **x402 Support** - Automatic payment handling  
✅ **Error Handling** - Built-in error states  

## Example: Complete Swap Interface

```tsx
import { useMoltyDEX } from 'moltydex-react';
import { useWallet } from '@solana/wallet-adapter-react';

function SwapInterface() {
  const { publicKey } = useWallet();
  const { quote, swap, loading } = useMoltyDEX();
  const [amount, setAmount] = useState('1');
  const [quoteResult, setQuoteResult] = useState(null);

  const handleGetQuote = async () => {
    const result = await quote({
      inputMint: SOL,
      outputMint: USDC,
      amount: parseFloat(amount) * 1_000_000_000,
    });
    setQuoteResult(result);
  };

  const handleSwap = async () => {
    if (!publicKey) return;
    await swap({
      inputMint: SOL,
      outputMint: USDC,
      amount: parseFloat(amount) * 1_000_000_000,
    });
  };

  return (
    <div>
      <input value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handleGetQuote}>Get Quote</button>
      {quoteResult && <div>Output: {quoteResult.outputAmount}</div>}
      <button onClick={handleSwap} disabled={loading || !publicKey}>
        Swap
      </button>
    </div>
  );
}
```

## Resources

- **MoltyDEX Website**: https://www.moltydex.com
- **MoltyDEX Docs**: https://www.moltydex.com/developers
- **React Example**: See `/examples` directory
- **Solana Wallet Adapter**: https://github.com/solana-labs/wallet-adapter

## License

MIT

## Contributing

Contributions welcome! Open an issue or submit a PR.

---

Built with ❤️ for the React and x402 communities
