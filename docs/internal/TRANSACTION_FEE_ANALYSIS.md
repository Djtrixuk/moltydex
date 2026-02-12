# Transaction Fee Analysis

## Transaction Details
**Signature**: `59xBi27H9wovht5KdBMdsJQGnSW7iiuJfPvLL6UkaXA8yKQYCBkTecoM4JftFVEzRBX9XjQ2j9ruBWJoDKCDDn4C`  
**Explorer**: https://solscan.io/tx/59xBi27H9wovht5KdBMdsJQGnSW7iiuJfPvLL6UkaXA8yKQYCBkTecoM4JftFVEzRBX9XjQ2j9ruBWJoDKCDDn4C

## Where Fees Appear in Solana Transactions

In Solana transactions, fees can appear in two places:

### 1. **Network Transaction Fee** (Always Present)
- **Location**: Transaction metadata (`meta.fee`)
- **What it is**: The Solana network fee (typically 5,000 lamports = 0.000005 SOL)
- **Where to see it**: 
  - Solscan: In the "Transaction Fee" section
  - RPC: `result.meta.fee`
- **Who pays**: The transaction signer (user)

### 2. **MoltyDEX Aggregator Fee** (If Collected)
- **Location**: Token transfer instruction (SPL Token Transfer)
- **What it is**: The 0.1% fee collected by MoltyDEX
- **Where to see it**: 
  - Solscan: In the "Token Transfers" section
  - Look for a transfer FROM the user's token account TO the fee wallet's token account
  - RPC: `result.meta.postTokenBalances` - check for balance changes to fee wallet
- **Who pays**: The user (deducted from swap output)
- **Who receives**: Fee wallet (`ATYWjod5jkQm5RxrC65irY8e97UUY42LFM45ZGuNK3JL`)

## How to Identify MoltyDEX Fees on Solscan

1. **Go to the transaction page** on Solscan
2. **Look for "Token Transfers" section**
3. **Find transfers involving your fee wallet**: `ATYWjod5jkQm5RxrC65irY8e97UUY42LFM45ZGuNK3JL`
4. **The fee amount** will be shown as a token transfer TO this wallet

## Expected Fee Transfer Instruction

When fees are collected, you should see:
- **Program**: Token Program (`TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`)
- **Instruction Type**: Transfer
- **From**: User's token account (for output token)
- **To**: Fee wallet's associated token account
- **Amount**: 0.1% of swap output

## Checking This Transaction

Based on the transaction analysis:
- **Network fee**: Present (standard Solana transaction fee)
- **MoltyDEX fee**: Need to check if fee wallet appears in token transfers

If the fee wallet does NOT appear in this transaction, it means:
1. The transaction was built before `FEE_WALLET` was configured in Vercel
2. OR the fee transfer instruction failed to be added
3. OR this transaction was built by a different service

---

**Note**: To verify fees are being collected, check recent transactions AFTER the fee wallet was configured (after the API fix on 2026-02-05).
