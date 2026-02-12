# Phantom Wallet Whitelist Request

## Issue
Phantom wallet is showing a "This dApp could be malicious" warning when users try to connect to moltydex.com, blocking swaps.

## Solution
Request whitelisting from Blowfish (Phantom's security provider) and Phantom support.

## Steps to Fix

### 1. Contact Blowfish (Primary)
**Email:** [email protected]  
**Subject:** Whitelist Request: moltydex.com - Legitimate DEX Aggregator

**Email Template:**
```
Subject: Whitelist Request: moltydex.com - Legitimate DEX Aggregator

Hi Blowfish Team,

I'm requesting whitelisting for moltydex.com, a legitimate Solana DEX aggregator.

**Project Details:**
- Domain: moltydex.com
- Project: MoltyDEX - DEX Aggregator for x402 Payments
- Type: DeFi / DEX Aggregator
- Status: Live on Solana Mainnet
- Website: https://www.moltydex.com

**About MoltyDEX:**
MoltyDEX is a DEX aggregator built specifically for x402 payments. It routes swaps through Jupiter aggregator to provide best prices across all Solana DEXes. The project is:
- Open source (will be public on GitHub)
- Uses client-side signing (keys never leave user's system)
- Integrates with Jupiter (verified aggregator)
- Has proper security headers and HTTPS

**Why We Need Whitelisting:**
Users are unable to connect their Phantom wallets due to the security warning, preventing them from using our legitimate service.

**Verification:**
- HTTPS enabled
- Proper security headers (CSP, X-Frame-Options, etc.)
- No malicious code
- Legitimate business use case
- Integrates with verified services (Jupiter, Solana)

Please let me know if you need any additional information or documentation.

Thank you,
[Your Name]
MoltyDEX Team
```

### 2. Contact Phantom Support
**Email:** [email protected]  
**Subject:** dApp Verification Request: moltydex.com

**Email Template:**
```
Subject: dApp Verification Request: moltydex.com

Hi Phantom Support,

I'm requesting verification for moltydex.com, a legitimate Solana DEX aggregator that's being blocked by Phantom's security system.

**Project:** MoltyDEX
**Domain:** moltydex.com
**Website:** https://www.moltydex.com
**Type:** DEX Aggregator / DeFi

**Issue:**
Users are seeing "This dApp could be malicious" warning when trying to connect Phantom wallet, preventing legitimate use of our service.

**Project Details:**
- Built for x402 payments protocol
- Routes through Jupiter aggregator
- Client-side signing (secure)
- Open source
- Proper security headers

**Verification Links:**
- Website: https://www.moltydex.com
- Documentation: https://www.moltydex.com/developers
- API: https://api.moltydex.com

Please help us get whitelisted so users can connect their wallets.

Thank you,
[Your Name]
```

### 3. Check Current Status
**Check if already flagged:**
- Visit: https://dappsentry.com
- Search for: moltydex.com
- See if it appears in any blocklists

### 4. Additional Verification Steps

**For Users (Temporary Workaround):**
Users can click "Proceed anyway (unsafe)" if they trust the site, but this is not ideal.

**For Developers:**
1. Ensure HTTPS is properly configured ✅
2. Add proper security headers ✅ (done)
3. Add Content-Security-Policy ✅ (done)
4. Ensure no malicious code ✅
5. Contact Blowfish/Phantom ✅ (this document)

## Security Headers Added

We've added proper security headers including:
- Content-Security-Policy
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

## Expected Timeline

- Blowfish review: 24-48 hours typically
- Phantom support: Varies, usually responds within a few days

## Follow-Up

After submitting, check back in 24-48 hours. If no response, follow up politely.

## Notes

- This is a common issue for new dApps
- Blowfish maintains the blocklist Phantom uses
- Once whitelisted, the warning will disappear
- Users can still proceed manually, but whitelisting is better UX

---

**Status:** Ready to submit  
**Priority:** High (blocking user access)  
**Next Action:** Send emails to Blowfish and Phantom support
