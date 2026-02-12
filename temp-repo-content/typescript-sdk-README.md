# MoltyDEX TypeScript/JavaScript SDK

TypeScript and JavaScript SDK for integrating MoltyDEX into your Node.js or browser applications. Perfect for AI agents, automated systems, and x402 payment handling.

## Installation

```bash
npm install moltydex
# or
yarn add moltydex
# or
pnpm add moltydex
```

## Quick Start

### Node.js

```typescript
import { MoltyDEX } from 'moltydex';

const dex = new MoltyDEX({
  walletPath: './wallet.json',
  apiUrl: 'https://api.moltydex.com'
});

// Get a quote
const quote = await dex.quote({
  inputMint: 'So11111111111111111111111111111111111111112', // SOL
  outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  amount: 1_000_000_000 // 1 SOL
});

console.log(`Output: ${quote.outputAmount} USDC`);

// Execute swap
const result = await dex.swap({
  inputMint: 'So11111111111111111111111111111111111111112',
  outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  amount: 1_000_000_000
});

console.log(`Swap transaction: ${result.signature}`);
```

### Browser

```typescript
import { MoltyDEX } from 'moltydex';

const dex = new MoltyDEX({
  // Use wallet adapter in browser
  walletAdapter: window.solana,
  apiUrl: 'https://api.moltydex.com'
});
```

## x402 Integration

```typescript
import { X402PaymentHandler } from 'moltydex';

const handler = new X402PaymentHandler({
  walletPath: './wallet.json'
});

// Make request to x402-protected API
const response = await fetch('https://api.example.com/data');

if (response.status === 402) {
  // Automatically handle payment
  const paidResponse = await handler.handle402Response(
    response,
    'https://api.example.com/data'
  );
  const data = await paidResponse.json();
}
```

## Features

✅ **TypeScript Support** - Full type definitions  
✅ **Node.js & Browser** - Works everywhere  
✅ **x402 Support** - Automatic payment handling  
✅ **Token Swapping** - Best prices across all DEXes  
✅ **Balance Checking** - Check token balances  
✅ **Transaction Building** - Build and sign transactions  
✅ **Error Handling** - Comprehensive error handling  

## API Reference

### MoltyDEX

```typescript
class MoltyDEX {
  constructor(options: MoltyDEXOptions);
  quote(params: QuoteParams): Promise<QuoteResult>;
  swap(params: SwapParams): Promise<SwapResult>;
  balance(walletAddress: string, tokenMint: string): Promise<number>;
}
```

### X402PaymentHandler

```typescript
class X402PaymentHandler {
  constructor(options: HandlerOptions);
  handle402Response(response: Response, originalUrl: string): Promise<Response>;
}
```

## Examples

See the [examples directory](https://github.com/Djtrixuk/moltydex-x402-example) for complete examples.

## Documentation

Full documentation: https://www.moltydex.com/developers

## Web Interface

Try MoltyDEX in your browser: https://www.moltydex.com

## License

MIT

## Contributing

Contributions welcome! Open an issue or submit a PR.

---

Built with ❤️ for the x402 and AI agent communities
