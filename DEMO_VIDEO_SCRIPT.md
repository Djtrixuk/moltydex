# MoltyDEX Demo Video Script
## "How AI Agents Pay for APIs Automatically"

**Target Length:** 2-3 minutes  
**Style:** Screen recording with voiceover or captions  
**Goal:** Show the magic of automatic x402 payment handling

---

## 🎬 Video Structure

### Part 1: The Problem (0:00 - 0:30)
**Visual:** Show a code editor or terminal

**Script:**
```
"AI agents need to pay for APIs, but there's a problem.
They often don't have the exact token required.
They might have SOL, but the API wants USDC.
Without MoltyDEX, this breaks the automation."
```

**Show:**
- Code snippet showing agent trying to call API
- Getting 402 Payment Required
- Agent has SOL, but API wants USDC
- Manual intervention needed (bad!)

---

### Part 2: The Solution (0:30 - 1:30)
**Visual:** Show MoltyDEX in action

**Script:**
```
"MoltyDEX solves this automatically.
Watch what happens when an agent calls an API..."
```

**Show:**
1. **Agent calls API** (terminal/console)
   - Show: `fetch('https://premium-api.com/data')`
   - Show: Response: `402 Payment Required`
   - Show: Payment requirement: `1 USDC`

2. **MoltyDEX intercepts** (show logs/output)
   - Show: `[x402] Payment required: 1 USDC`
   - Show: `[x402] Current balance: 0 USDC, 0.1 SOL`
   - Show: `[x402] Insufficient balance. Initiating swap...`

3. **Automatic swap** (show transaction)
   - Show: `[x402] Swap quote: 0.1 SOL → 1.05 USDC`
   - Show: `[x402] Swap confirmed: [signature]`
   - Show: `[x402] Balance after swap: 1.05 USDC`

4. **Automatic payment** (show transaction)
   - Show: `[x402] Payment sent: [signature]`
   - Show: `[x402] Payment confirmed`
   - Show: `[x402] Retrying original request...`

5. **Success!** (show final result)
   - Show: `200 OK` response
   - Show: API data returned successfully
   - Show: `✅ Payment successful!`

**Key Visual Elements:**
- Terminal/console output showing the flow
- Transaction signatures (link to Solscan)
- Clear status messages
- Success indicators

---

### Part 3: The Code (1:30 - 2:00)
**Visual:** Show simple code example

**Script:**
```
"Here's the code. It's that simple."
```

**Show:**
```typescript
import { HTTPInterceptor } from '@moltydex/agent';

// Setup once
const interceptor = new HTTPInterceptor({
  apiUrl: 'https://api.moltydex.com',
  walletSecretKey: process.env.WALLET_SECRET_KEY,
  autoSwap: true,
});

// Now all fetch() calls handle 402 automatically!
const response = await fetch('https://premium-api.com/data');
const data = await response.json(); // Works seamlessly!
```

**Highlight:**
- Simple setup (3 lines)
- No manual payment handling
- Works with standard fetch()

---

### Part 4: The Benefits (2:00 - 2:30)
**Visual:** Show key features/benefits

**Script:**
```
"MoltyDEX gives you:
- Automatic token swapping
- Best prices across all Solana DEXes
- Zero integration complexity
- Secure client-side signing
- And it's live on Solana mainnet right now."
```

**Show:**
- Bullet points or badges
- Website: moltydex.com
- Links to docs, developers page

---

### Part 5: Call to Action (2:30 - 2:45)
**Visual:** Show website

**Script:**
```
"Try MoltyDEX today. Visit moltydex.com
Build agents that pay automatically.
That's MoltyDEX - the DEX built for x402."
```

**Show:**
- Website homepage
- "For Developers" link
- X account link

---

## 📝 Detailed Shot List

### Shot 1: Setup (0:00 - 0:15)
- **Screen:** Terminal or code editor
- **Action:** Show agent code that calls an API
- **Text Overlay:** "AI Agent needs to call premium API"

### Shot 2: The Problem (0:15 - 0:30)
- **Screen:** Show 402 response
- **Action:** Highlight payment requirement (USDC) vs agent balance (SOL)
- **Text Overlay:** "Problem: Agent has SOL, API wants USDC"

### Shot 3: MoltyDEX Activation (0:30 - 0:45)
- **Screen:** Show MoltyDEX logs starting
- **Action:** Show "[x402] Payment required" message
- **Text Overlay:** "MoltyDEX intercepts automatically"

### Shot 4: Token Swap (0:45 - 1:00)
- **Screen:** Show swap transaction
- **Action:** Show quote, transaction signature, confirmation
- **Text Overlay:** "Automatic token swap: SOL → USDC"

### Shot 5: Payment (1:00 - 1:15)
- **Screen:** Show payment transaction
- **Action:** Show payment signature, confirmation
- **Text Overlay:** "Automatic payment sent"

### Shot 6: Success (1:15 - 1:30)
- **Screen:** Show successful API response
- **Action:** Show data returned, success message
- **Text Overlay:** "✅ Success! Zero manual steps"

### Shot 7: Code Example (1:30 - 2:00)
- **Screen:** Code editor with simple example
- **Action:** Highlight simplicity
- **Text Overlay:** "Just 3 lines of setup code"

### Shot 8: Benefits (2:00 - 2:30)
- **Screen:** Website or feature list
- **Action:** Show key features
- **Text Overlay:** "Best prices • Low fees • Automatic"

### Shot 9: CTA (2:30 - 2:45)
- **Screen:** Website homepage
- **Action:** Show "For Developers" button
- **Text Overlay:** "Try it: moltydex.com"

---

## 🎥 Recording Instructions

### Tools Needed
- **Screen Recording:** OBS Studio, QuickTime (Mac), or Loom
- **Microphone:** For voiceover (optional - can use captions instead)
- **Code Editor:** VS Code or terminal
- **Browser:** For showing website

### Setup Steps

1. **Prepare Demo Environment**
   - Have agent code ready to run
   - Have wallet with small amount of SOL
   - Have test x402 API endpoint (or mock)
   - Open terminal/console for logs

2. **Prepare Visuals**
   - Clean desktop (hide personal stuff)
   - Terminal with readable font
   - Code editor with nice theme
   - Browser ready with moltydex.com

3. **Recording Settings**
   - Resolution: 1920x1080 (or 1280x720 minimum)
   - Frame rate: 30fps
   - Audio: Clear voice or captions
   - Format: MP4

### Recording Tips

- **Practice first:** Run through the demo 2-3 times
- **Zoom in:** Make terminal/code text large and readable
- **Slow down:** Don't rush - let viewers see what's happening
- **Highlight:** Use cursor to point at important parts
- **Clean transitions:** Smooth cuts between shots
- **Add captions:** If no voiceover, add text overlays

---

## 📝 Alternative: No-Code Demo (Easier)

If coding demo is complex, show the **concept** instead:

### Simplified Version (1-2 minutes)

1. **Show Problem** (0:00 - 0:20)
   - Diagram: Agent → API → 402 → Needs USDC
   - Show: Agent only has SOL
   - Problem: Manual swap needed

2. **Show Solution** (0:20 - 1:00)
   - Diagram: Agent → MoltyDEX → Auto Swap → Payment → Success
   - Show: Website interface
   - Show: Automatic flow

3. **Show Benefits** (1:00 - 1:30)
   - Key features
   - Use cases
   - Website CTA

**This version is easier to record and still effective!**

---

## 🎬 Post-Production

### Editing Checklist
- [ ] Add intro title card: "MoltyDEX Demo"
- [ ] Add captions/text overlays for key points
- [ ] Add transitions between sections
- [ ] Add outro with website/X links
- [ ] Add background music (optional, keep it subtle)
- [ ] Optimize for web (compress, but keep quality)

### Where to Post
1. **X (Twitter):** Main post with video
2. **YouTube:** Longer-form version
3. **Website:** Embed on homepage
4. **LinkedIn:** Professional version
5. **Dev.to/Medium:** Embed in blog post

---

## 🎯 Key Messages to Emphasize

1. **"Automatic"** - No manual steps
2. **"Zero Integration"** - Just works
3. **"Best Prices"** - Jupiter aggregator
4. **"Live Now"** - Production-ready
5. **"For Agents"** - Built specifically for AI

---

## 📊 Success Metrics

After posting, track:
- Views on X/YouTube
- Website traffic spike
- Developer signups
- Community engagement

---

## 🚀 Quick Start Option

**Fastest way to create:**
1. Record screen showing terminal output of agent running
2. Show the automatic swap and payment happening
3. Add text overlays explaining each step
4. Keep it under 2 minutes
5. Post on X with caption: "Watch how MoltyDEX enables AI agents to pay for APIs automatically..."

**You can create a polished version later - get something out first!**

---

Ready to record? Let me know if you need help with any specific part! 🎥
