# MoltyDEX FAQ

**Frequently Asked Questions**

---

## General Questions

### What is MoltyDEX?
MoltyDEX is a DEX aggregator built specifically for AI agents that need to handle x402 payments. It automatically swaps tokens when your agent needs to pay for APIs.

### Why do I need MoltyDEX?
If your agent makes x402 payments, you'll encounter APIs that want different tokens. Without automatic swapping, your agent breaks. MoltyDEX handles this automatically.

### Is MoltyDEX free?
Yes! Currently 0% platform fees. You only pay Solana network fees (~0.00001 SOL per transaction).

### Will MoltyDEX always be free?
We're offering 0% fees while we gather usage data and feedback. Future pricing will likely be 0.1-0.5%, but early adopters may get grandfathered rates.

---

## Technical Questions

### How does MoltyDEX work?
1. Your agent hits an API
2. API returns 402 Payment Required
3. MoltyDEX detects this
4. Checks what token is needed
5. Swaps automatically if needed
6. Makes payment
7. Retries original request

### What tokens does MoltyDEX support?
Any SPL token on Solana. We route through Jupiter, which supports all major tokens.

### How do I integrate MoltyDEX?
Install the SDK and add a few lines of code. See our integration guide: [Link]

### What's the API rate limit?
Currently no rate limits on balance/quote endpoints. Swap endpoints have reasonable limits to prevent abuse.

### Does MoltyDEX store my private keys?
**No!** All transactions are signed client-side. Your private keys never leave your system.

---

## x402 Protocol Questions

### What is x402?
x402 is a protocol for pay-per-use APIs. APIs return HTTP 402 when payment is required.

### Do I need to understand x402 to use MoltyDEX?
No! MoltyDEX handles all x402 protocol details automatically.

### What tokens do x402 APIs accept?
Most commonly: USDC, USDT, SOL. But each API can specify any token.

### Can MoltyDEX handle non-x402 payments?
Yes! You can use MoltyDEX for any token swap, not just x402 payments.

---

## Pricing & Fees

### How much does MoltyDEX cost?
Currently free (0% platform fees). You only pay Solana network fees.

### What are Solana network fees?
Typically ~0.00001 SOL per transaction (~$0.0002 at current prices).

### Will fees increase?
Possibly in the future (0.1-0.5%), but early adopters may get grandfathered rates.

---

## Support & Community

### Where can I get help?
- Discord: [Link]
- GitHub Issues: [Link]
- Email: [Email]

### How do I report bugs?
Join our Discord or create a GitHub issue. Bug reporters get $5 USDC rewards!

### Can I contribute?
Yes! We welcome contributions. See our GitHub repo.

---

## Beta Tester Program

### What's the Beta Tester Program?
We're offering rewards for agents who test MoltyDEX and provide feedback.

### What are the rewards?
- Early Testers: $10 USDC (first 20)
- Bug Reports: $5 USDC per valid bug
- Use Case Stories: $25 USDC per story
- Full Integration: $50 USDC per integration

### How do I join?
1. Test MoltyDEX: https://www.moltydex.com
2. Join Discord: [Link]
3. Report findings
4. Get rewarded!

---

## Technical Support

### My swap failed. What do I do?
Check the error message. Common issues:
- Insufficient balance (add SOL for fees)
- Token not found (verify mint address)
- Network issues (check Solana status)

### How do I check my balance?
Use our API: `GET /api/balance?wallet_address=YOUR_ADDRESS&token_mint=TOKEN_MINT`

### Can I test on devnet?
Yes! Set `api_url` to devnet endpoint in SDK configuration.

---

## Security

### Is MoltyDEX secure?
Yes! All transactions are signed client-side. We never see your private keys.

### What data does MoltyDEX collect?
Only usage statistics (swaps, quotes, API calls). No personal data.

### Can I audit the code?
Yes! Our code is open source. See GitHub repo.

---

**Have more questions?** Join our Discord or check our docs: https://www.moltydex.com/developers
