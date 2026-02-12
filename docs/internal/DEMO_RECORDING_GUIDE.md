# Demo Video Recording Guide
## Quick Start for Recording MoltyDEX Demo

---

## 🎥 Recording Setup

### What You Need
1. **Screen Recording Software**
   - Mac: QuickTime (built-in) or OBS Studio
   - Windows: OBS Studio or Windows Game Bar
   - Online: Loom (easiest option)

2. **Terminal Ready**
   - Terminal with readable font (at least 14pt)
   - Dark theme (looks better)
   - Full screen or large window

3. **Wallet Ready**
   - Small amount of SOL (0.1-0.2 SOL for demo)
   - Secret key ready to use

---

## 🚀 Quick Recording Steps

### Step 1: Prepare Terminal
```bash
cd /Users/danielstephenson/agentdex/agent
```

### Step 2: Start Screen Recording
- Open your screen recorder
- Set to record terminal window
- Make sure terminal is large and readable

### Step 3: Run Demo Script
```bash
WALLET_SECRET_KEY="your-secret-key-here" npm run demo:video
```

### Step 4: Let It Run
- The script will show each step clearly
- It pauses at key moments
- Shows all the important information
- Takes about 30-60 seconds to complete

### Step 5: Stop Recording
- Stop recording when you see "SUCCESS!"
- You now have your demo video!

---

## 📝 What the Demo Shows

The script automatically demonstrates:

1. ✅ **Agent Initialization** - Shows wallet address
2. ✅ **Balance Check** - Shows current SOL/USDC balances
3. ✅ **402 Detection** - Shows payment requirement
4. ✅ **Automatic Swap** - Shows SOL → USDC swap
5. ✅ **Transaction Confirmation** - Shows swap success
6. ✅ **Automatic Payment** - Shows payment transaction
7. ✅ **Success** - Shows final success message

**All with clear, readable output perfect for video!**

---

## 🎬 Recording Tips

### Before Recording
- [ ] Clean terminal (clear previous output)
- [ ] Test run once to make sure it works
- [ ] Have wallet with SOL ready
- [ ] Set terminal font to large (16-18pt)
- [ ] Use dark theme for better visuals

### During Recording
- [ ] Start recording BEFORE running command
- [ ] Let script run naturally (don't rush)
- [ ] Terminal output is self-explanatory
- [ ] No need to type or explain - output shows everything

### After Recording
- [ ] Trim beginning/end if needed
- [ ] Add title card at start (optional)
- [ ] Add website link at end (optional)
- [ ] Export as MP4

---

## 🎨 Optional Enhancements

### Add Title Card
- "MoltyDEX Demo"
- "Automatic x402 Payment Handling"
- Website: moltydex.com

### Add Captions/Overlays
- "Step 1: Agent Initialization"
- "Step 2: 402 Payment Required"
- "Step 3: Automatic Token Swap"
- "Step 4: Payment Success"

### Add Outro
- Website: moltydex.com
- X: @MoltyDEX
- "Try it yourself!"

---

## 📊 Expected Output

The demo script produces output like this:

```
🎬 MOLTYDEX DEMO VIDEO - x402 Auto-Pay Agent

============================================================

📋 STEP 1: Initializing Agent...
------------------------------------------------------------
✅ Agent initialized
   Wallet: ATYWjod5jkQm5RxrC65irY8e97UUY42LFM45ZGuNK3JL

💰 Current Balances:
   SOL:  0.15 SOL
   USDC: 0.0 USDC

📋 STEP 2: Simulating API Call...
------------------------------------------------------------
   Agent calls: https://premium-api.com/data
   Response: 402 Payment Required

📋 STEP 3: MoltyDEX Auto-Pay Agent Intercepts...
------------------------------------------------------------
   [x402] Payment required detected
   [x402] Parsing payment requirements...
   Required: 1 USDC
   Payment to: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU

📋 STEP 4: Checking Balance...
------------------------------------------------------------
   ❌ Insufficient USDC balance
   Current: 0.0 USDC
   Required: 1.0 USDC

📋 STEP 5: Automatic Token Swap...
------------------------------------------------------------
   [x402] Initiating automatic token swap...
   [x402] Swapping SOL → USDC via MoltyDEX...
   ✅ Swap transaction sent: [signature]
   [x402] Waiting for confirmation...
   ✅ Swap confirmed: [signature]
   🔗 View on Solscan: https://solscan.io/tx/[signature]
   ✅ New USDC balance: 1.05 USDC

📋 STEP 6: Making Payment...
------------------------------------------------------------
   [x402] Building payment transaction...
   ✅ Payment transaction sent: [signature]
   [x402] Waiting for confirmation...
   ✅ Payment confirmed: [signature]
   🔗 View on Solscan: https://solscan.io/tx/[signature]

📋 STEP 7: Retrying Original Request...
------------------------------------------------------------
   [x402] Payment verified, retrying API call...
   ✅ Response: 200 OK
   ✅ Data received successfully!

============================================================
🎉 SUCCESS! Payment completed automatically.
============================================================

✨ Key Takeaways:
   • Agent had SOL, API wanted USDC
   • MoltyDEX swapped automatically
   • Payment made automatically
   • Zero manual intervention

🌐 Learn more: https://www.moltydex.com
📚 Docs: https://www.moltydex.com/developers
🐦 Follow: https://x.com/MoltyDEX
```

**Perfect for screen recording!**

---

## 🎯 Post-Recording

### Quick Edit (Optional)
1. Add intro: "MoltyDEX Demo - Automatic x402 Payments"
2. Add captions: Highlight key steps
3. Add outro: Website and social links
4. Keep it under 2 minutes

### Where to Post
1. **X (Twitter)** - Main platform
2. **Website** - Embed on homepage
3. **YouTube** - Longer version
4. **LinkedIn** - Professional version

---

## ✅ Ready to Record?

1. Open terminal
2. Start screen recorder
3. Run: `WALLET_SECRET_KEY="..." npm run demo:video`
4. Stop recording when done
5. Post on X!

**That's it! The script does all the work - you just record it.** 🎬
