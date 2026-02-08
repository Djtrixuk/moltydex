# Wallet Setup Guide

## Quick Start: Using Your Private Key

### Step 1: Get Your Private Key

**If you have a Phantom wallet:**
1. Open Phantom wallet
2. Click the menu (☰) → **Settings**
3. Go to **Security & Privacy**
4. Click **Show Private Key**
5. Enter your password
6. **Copy the private key** (it's a long string starting with something like `5K...` or similar)

**If you have a Solflare wallet:**
1. Open Solflare
2. Settings → **Export Private Key**
3. Enter password
4. **Copy the private key**

**If you have a wallet.json file:**
- The file is usually located at: `~/.config/solana/id.json` (Linux/Mac) or `%USERPROFILE%\.config\solana\id.json` (Windows)
- Or wherever you saved it when creating the wallet

### Step 2: Use Your Private Key

You have **two options**:

#### Option A: Set Environment Variable (Recommended)

**On Mac/Linux:**
```bash
export WALLET_SECRET_KEY='your-private-key-here'
```

**On Windows (PowerShell):**
```powershell
$env:WALLET_SECRET_KEY='your-private-key-here'
```

**On Windows (Command Prompt):**
```cmd
set WALLET_SECRET_KEY=your-private-key-here
```

#### Option B: Create wallet.json File

1. Create a file called `wallet.json` in the `agent` folder
2. If your private key is **base58 format** (long string), you need to convert it to an array
3. Or if you have the array format already, paste it directly

**Example wallet.json (array format):**
```json
[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64]
```

### Step 3: Run the Example

**If using environment variable:**
```bash
cd agent
npm run example:wallet
```

**If using wallet.json file:**
```bash
cd agent
npm run example
```

## Finding Your Wallet Address

After setting up, you can find your wallet address by:

1. **From Phantom/Solflare**: Copy your wallet address from the wallet app
2. **From the agent**: It will display your wallet address when you run it
3. **From Solana CLI**: `solana address` (if using CLI wallet)

## Example: Complete Setup

```bash
# 1. Navigate to agent folder
cd agent

# 2. Set your private key (replace with your actual key)
export WALLET_SECRET_KEY='5KJvsngHeMoo884zZhPQYrQiuGDBeBUkH5G4gL9d4y7q...'

# 3. Optional: Set your wallet address for verification
export WALLET_ADDRESS='YourWalletAddressHere...'

# 4. Run the example
npm run example:wallet
```

## Troubleshooting

**Error: "Invalid secret key"**
- Make sure you copied the entire private key
- If it's base58 format, use it as-is
- If it's an array, make sure it's valid JSON

**Error: "Wallet address mismatch"**
- The secret key doesn't match the wallet address you provided
- Remove `WALLET_ADDRESS` or use the correct address

**Error: "Insufficient balance"**
- Your wallet needs SOL for transaction fees
- Get SOL from an exchange or faucet (for devnet)

## Security Note

⚠️ **Never share your private key!**
- Don't commit it to git
- Don't share it publicly
- The `.gitignore` file already excludes `wallet.json` for safety
