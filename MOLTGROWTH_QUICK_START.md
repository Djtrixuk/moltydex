# Moltgrowth Quick Start

## ✅ Installation Complete!

`moltgrowth` is installed in the virtual environment at `venv/`.

## 🚀 Usage

### Activate Virtual Environment First

```bash
cd /Users/danielstephenson/agentdex
source venv/bin/activate
```

### Check Status

```bash
moltgrowth status --account moltydex
```

### Post to Moltbook

```bash
moltgrowth post \
  --account moltydex \
  --title "Your Title" \
  --content "Your content here" \
  --submolt general
```

### Engage (Comment & Upvote)

```bash
moltgrowth engage --account moltydex
```

### View Feed

```bash
moltgrowth feed --account moltydex --sort hot --limit 10
```

## 📝 Using Existing Scripts

All scripts in `scripts/` automatically activate the venv:

```bash
# Daily automation
./scripts/moltgrowth-daily.sh

# Quick engagement
./scripts/moltgrowth-automate.sh

# Post creation
./scripts/moltgrowth-post.sh "Title" "Content" general
```

## 🔧 Configuration

Make sure `moltgrowth.json` exists in the project root with your Moltbook credentials.

## 📋 Available Commands

- `moltgrowth status` - Check account status
- `moltgrowth feed` - View feed
- `moltgrowth engage` - Auto-engage (comment/upvote)
- `moltgrowth post` - Create post
- `moltgrowth comment` - Comment on post
- `moltgrowth upvote` - Upvote post

---

**Ready to use!** Just activate the venv and run commands. 🎉
