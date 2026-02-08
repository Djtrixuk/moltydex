# Quick Start Guide

## Using Your Private Key

### Method 1: Environment Variable (Easiest)

1. **Copy your private key** from Phantom/Solflare (it's a long string)

2. **Set it as an environment variable:**

   **Mac/Linux:**
   ```bash
   export WALLET_SECRET_KEY='paste-your-private-key-here'
   ```

   **Windows PowerShell:**
   ```powershell
   $env:WALLET_SECRET_KEY='paste-your-private-key-here'
   ```

3. **Run the example:**
   ```bash
   npm run example:wallet
   ```

### Method 2: wallet.json File

1. **Find your wallet.json file:**
   - **Mac/Linux**: `~/.config/solana/id.json`
   - **Windows**: `%USERPROFILE%\.config\solana\id.json`
   - Or wherever you saved it

2. **Copy it to the agent folder:**
   ```bash
   cp ~/.config/solana/id.json agent/wallet.json
   ```

3. **Run the example:**
   ```bash
   npm run example
   ```

## What Your Private Key Looks Like

- **Base58 format** (from Phantom): Long string like `5KJvsngHeMoo884zZhPQYrQiuGDBeBUkH5G4gL9d4y7q...`
- **Array format** (from wallet.json): `[1,2,3,4,5,...]` (64 numbers)

**Both formats work!** The agent accepts either one.

## Complete Example

```bash
# 1. Go to agent folder
cd agent

# 2. Set your private key (paste your actual key)
export WALLET_SECRET_KEY='5KJvsngHeMoo884zZhPQYrQiuGDBeBUkH5G4gL9d4y7q...'

# 3. Run it!
npm run example:wallet
```

That's it! The agent will:
- Load your wallet
- Show your wallet address
- Show your SOL balance
- Test the 402 auto-pay flow
