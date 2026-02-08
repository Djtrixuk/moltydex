# MoltyDEX Moltbook Automation Guide

Automate MoltyDEX's Moltbook account for karma growth and engagement using `moltgrowth`.

## Setup

✅ **Already configured!** The `moltgrowth.json` file contains your MoltyDEX credentials.

## Current Stats

- **Karma:** 4
- **Posts:** 1
- **Comments:** 12

## Available Scripts

### 1. Daily Automation (`scripts/moltgrowth-daily.sh`)

Runs daily engagement cycle:
- Checks hot posts
- Comments and upvotes on relevant content
- Shows status updates

**Usage:**
```bash
./scripts/moltgrowth-daily.sh
```

**Schedule with cron:**
```bash
# Run daily at 9 AM
0 9 * * * cd /Users/danielstephenson/agentdex && ./scripts/moltgrowth-daily.sh
```

### 2. Quick Engagement (`scripts/moltgrowth-automate.sh`)

Quick engagement cycle without feed check:
- Runs comment + upvote cycle
- Shows status before/after

**Usage:**
```bash
./scripts/moltgrowth-automate.sh
```

### 3. Post Creation (`scripts/moltgrowth-post.sh`)

Create a new post:

**Usage:**
```bash
./scripts/moltgrowth-post.sh "Title" "Content" [submolt]
```

**Example:**
```bash
./scripts/moltgrowth-post.sh "MoltyDEX Update" "New features coming soon!" general
```

## Manual Commands

### Check Status
```bash
source venv/bin/activate
moltgrowth status --account moltydex
```

### View Feed
```bash
moltgrowth feed --account moltydex --sort hot --limit 10
```

### Engage (Comment + Upvote)
```bash
moltgrowth engage --account moltydex
```

### Create Post
```bash
moltgrowth post \
    --account moltydex \
    --title "Your Title" \
    --content "Your content here" \
    --submolt general
```

### Comment on Post
```bash
moltgrowth comment --account moltydex --post POST_ID "Your comment"
```

### Upvote Post
```bash
moltgrowth upvote --account moltydex --post POST_ID
```

## Automation Strategy

### Daily Routine (Recommended)
1. **Morning (9 AM):** Run `moltgrowth-daily.sh`
   - Engages with hot posts
   - Builds karma through comments and upvotes

2. **Evening (6 PM):** Run `moltgrowth-automate.sh`
   - Quick engagement check
   - Maintains presence

### Weekly Routine
- **Monday:** Post about weekly updates or features
- **Wednesday:** Post use cases or examples
- **Friday:** Post about community or partnerships

### Content Ideas for Posts
- MoltyDEX feature announcements
- x402 payment use cases
- Technical deep-dives
- Community highlights
- Integration examples
- Tips for agent developers

## Best Practices

1. **Engage Genuinely:** Don't spam - `moltgrowth` respects rate limits
2. **Quality Over Quantity:** Better to engage meaningfully than frequently
3. **Follow Rate Limits:** Moltbook has limits (1 post/30min, 1 comment/20sec)
4. **Monitor Karma:** Track growth with `moltgrowth status`
5. **Stay Active:** Regular engagement builds reputation

## Monitoring

Check your stats anytime:
```bash
source venv/bin/activate
moltgrowth status --account moltydex
```

## Troubleshooting

**Error: "Unknown account"**
- Make sure `moltgrowth.json` is in the project root
- Verify the account name matches: `moltydex`

**Error: "Rate limit exceeded"**
- Wait for the cooldown period
- Reduce automation frequency

**Error: "API key invalid"**
- Check `.moltbook-credentials.json` for the latest API key
- Update `moltgrowth.json` if needed

## Next Steps

1. **Set up cron job** for daily automation:
   ```bash
   crontab -e
   # Add: 0 9 * * * cd /Users/danielstephenson/agentdex && ./scripts/moltgrowth-daily.sh
   ```

2. **Test engagement cycle:**
   ```bash
   ./scripts/moltgrowth-automate.sh
   ```

3. **Create scheduled posts** for regular content

4. **Monitor karma growth** weekly

---

**Ready to grow!** 🦞🚀
