# MoltyDEX x402 Auto-Pay Agent

Automatically handles **402 Payment Required** responses by parsing payment requirements, checking balances, swapping tokens if needed, making payments, and retrying the original request.

## Features

- ✅ **Automatic 402 Handling** - Intercepts and processes payment requirements
- ✅ **Token Swapping** - Automatically swaps to required tokens via MoltyDEX
- ✅ **Payment Processing** - Builds and sends payment transactions
- ✅ **Request Retry** - Automatically retries original requests after payment
- ✅ **Webhook Support** - Optional webhook notifications for transaction status
- ✅ **TypeScript** - Fully typed for better developer experience

## Installation

```bash
cd agent
npm install
npm run build
```

## Quick Start

### Basic Usage

**Option 1: Using wallet file**
```typescript
import { X402AutoPayAgent } from './src/X402AutoPayAgent.js';
import type { AgentConfig } from './src/types.js';

const config: AgentConfig = {
  apiUrl: 'https://api.moltydex.com',
  walletPath: './wallet.json', // Path to your Solana wallet
  preferredInputToken: 'So11111111111111111111111111111111111111112', // SOL
  autoSwap: true,
};

const agent = new X402AutoPayAgent(config);
```

**Option 2: Using wallet secret key directly**
```typescript
const config: AgentConfig = {
  apiUrl: 'https://api.moltydex.com',
  walletSecretKey: [1,2,3,...], // Array of numbers (from wallet.json)
  // OR
  walletSecretKey: 'base58string', // Base58 encoded secret key
  walletAddress: 'YourWalletAddress...', // Optional: for verification
  preferredInputToken: 'So11111111111111111111111111111111111111112',
  autoSwap: true,
};

const agent = new X402AutoPayAgent(config);
```

**Option 3: Using environment variables**
```bash
# Set your wallet secret key (JSON array or base58 string)
export WALLET_SECRET_KEY='[1,2,3,...]'
export WALLET_ADDRESS='YourWalletAddress...'  # Optional
export SOLANA_RPC_URL='https://api.mainnet-beta.solana.com'

# Run example
npm run example:wallet
```

// Handle 402 response
const paymentResponse = {
  accepts: [{
    network: 'solana',
    asset: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
    amount: '1000000', // 1 USDC
    address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
  }],
};

const result = await agent.handle402(paymentResponse);
if (result.success) {
  console.log('Payment successful!', result.payment_signature);
}
```

### HTTP Interceptor (Automatic)

```typescript
import { HTTPInterceptor } from './src/HTTPInterceptor.js';

const interceptor = new HTTPInterceptor({
  apiUrl: 'https://api.moltydex.com',
  walletPath: './wallet.json',
  autoSwap: true,
});

// Now all fetch calls automatically handle 402 responses!
const response = await fetch('https://premium-api.com/data');
// If API returns 402, agent automatically:
// 1. Parses payment requirements
// 2. Swaps tokens if needed
// 3. Makes payment
// 4. Retries original request
```

## How It Works

### Flow Diagram

```
1. Agent makes API call
   ↓
2. API returns 402 Payment Required
   ↓
3. Auto-Pay Agent intercepts
   ↓
4. Parse payment requirements
   ↓
5. Check balance
   ↓
6. Swap tokens if needed (via MoltyDEX)
   ↓
7. Make payment transaction
   ↓
8. Wait for confirmation
   ↓
9. Retry original request with payment proof
   ↓
10. Success! Get API response
```

### Step-by-Step

1. **Parse Payment**: Extracts payment requirements from 402 response
2. **Check Balance**: Verifies if wallet has sufficient tokens
3. **Swap if Needed**: Uses MoltyDEX to swap SOL → required token
4. **Make Payment**: Builds and sends payment transaction
5. **Wait for Confirmation**: Polls transaction status until confirmed
6. **Retry Request**: Automatically retries original API call

## Configuration

```typescript
interface AgentConfig {
  apiUrl: string;                    // MoltyDEX API URL
  walletPath?: string;               // Path to wallet JSON file
  walletSecretKey?: Uint8Array | number[] | string; // Secret key (Uint8Array, array, or base58 string)
  walletAddress?: string;            // Optional: wallet address for verification
  preferredInputToken?: string;       // Token to swap from (default: SOL)
  autoSwap?: boolean;                // Auto-execute swaps (default: true)
  webhookUrl?: string;               // Optional webhook for status updates
  rpcUrl?: string;                   // Optional: override Solana RPC URL
  maxRetries?: number;                // Max retry attempts (default: 3)
  retryDelay?: number;               // Delay between retries in ms (default: 2000)
}
```

## Examples

### Example 1: Basic Payment Handling

```typescript
import { X402AutoPayAgent } from './src/X402AutoPayAgent.js';

const agent = new X402AutoPayAgent({
  apiUrl: 'https://api.moltydex.com',
  walletPath: './wallet.json',
});

const result = await agent.handle402(paymentResponse);
```

### Example 2: With Request Retry

```typescript
const result = await agent.handle402(paymentResponse, async () => {
  // This function is called after payment is confirmed
  return fetch('https://premium-api.com/data', {
    headers: {
      'X-Payment': result.payment_proof || '',
    },
  });
});
```

### Example 3: HTTP Interceptor

```typescript
import { HTTPInterceptor } from './src/HTTPInterceptor.js';

// Setup interceptor once
const interceptor = new HTTPInterceptor({
  apiUrl: 'https://api.moltydex.com',
  walletPath: './wallet.json',
});

// Now all fetch calls handle 402 automatically
const response = await fetch('https://api.example.com/data');
```

## Environment Variables

```bash
# Required
WALLET_PATH=./wallet.json          # Path to Solana wallet

# Optional
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
WEBHOOK_URL=https://your-agent.com/webhook
MOLTYDEX_API_URL=https://api.moltydex.com
```

## Wallet Setup

You can use the agent with your existing wallet in several ways:

### Option 1: Wallet File
Create a Solana wallet file (`wallet.json`):
```bash
# Using Solana CLI
solana-keygen new --outfile wallet.json
```

The wallet file should contain a JSON array of numbers (secret key bytes).

### Option 2: Secret Key Array
Use the secret key array directly from your wallet file:
```typescript
walletSecretKey: [1,2,3,4,...] // Copy from wallet.json
```

### Option 3: Base58 Secret Key
Use a base58-encoded secret key (from Phantom or other wallets):
```typescript
walletSecretKey: 'your-base58-secret-key-string'
```

### Option 4: Environment Variable
Set `WALLET_SECRET_KEY` environment variable:
```bash
export WALLET_SECRET_KEY='[1,2,3,...]'  # JSON array
# OR
export WALLET_SECRET_KEY='base58string'  # Base58 string
```

**Getting your secret key:**
- **From wallet.json**: Copy the array of numbers
- **From Phantom**: Settings → Show Private Key → Copy (base58 format)
- **From Solana CLI**: `cat wallet.json` (copy the array)

## Limitations

- **SPL Token Payments**: Currently supports SOL payments. Full SPL token payment support requires `@solana/spl-token` library (can be added as dependency)
- **Payment Address**: Some 402 responses may not include payment address - agent will attempt to use token mint as fallback

## Future Enhancements

- [ ] Full SPL token transfer support
- [ ] Payment address discovery
- [ ] Batch payment support
- [ ] Payment history tracking
- [ ] Rate limiting and retry strategies

## API Reference

### `X402AutoPayAgent`

Main agent class for handling 402 payments.

**Methods:**
- `handle402(paymentResponse, retryFn?)` - Handle 402 payment response
- `getWalletAddress()` - Get wallet address

### `HTTPInterceptor`

HTTP interceptor that automatically handles 402 responses in fetch calls.

**Methods:**
- `getAgent()` - Get underlying agent instance
- `restore()` - Restore original fetch function

### `MoltyDEXClient`

Client for MoltyDEX API.

**Methods:**
- `parsePayment()` - Parse payment requirements
- `getBalance()` - Get token balance
- `getQuote()` - Get swap quote
- `buildSwapTransaction()` - Build swap transaction
- `sendTransaction()` - Send signed transaction
- `getTransactionStatus()` - Get transaction status
- `registerWebhook()` - Register webhook

## License

MIT

## Support

For issues and questions, visit [MoltyDEX](https://moltydex.com) or check the [API documentation](https://moltydex.com/api-docs.md).
