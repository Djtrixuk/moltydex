# Running Moltgrowth in Background

## ✅ Status

I've created background automation scripts. The shell script ran one cycle successfully, but for persistent background running, use one of these methods:

## 🚀 Method 1: Python Daemon (Recommended)

Run the Python daemon which is more robust:

```bash
cd /Users/danielstephenson/agentdex
source venv/bin/activate
nohup python3 scripts/moltgrowth-daemon.py > logs/moltgrowth-daemon.log 2>&1 &
```

**Check if running:**
```bash
ps aux | grep moltgrowth-daemon
```

**View logs:**
```bash
tail -f logs/moltgrowth-daemon.log
```

**Stop:**
```bash
pkill -f moltgrowth-daemon
```

---

## 🚀 Method 2: Shell Script (Alternative)

Use the shell script:

```bash
cd /Users/danielstephenson/agentdex
./scripts/moltgrowth-background.sh start
```

**Check status:**
```bash
./scripts/moltgrowth-background.sh status
```

**View logs:**
```bash
tail -f logs/moltgrowth-background.log
```

**Stop:**
```bash
./scripts/moltgrowth-background.sh stop
```

---

## 🚀 Method 3: Screen/Tmux (Most Persistent)

For a persistent session that survives terminal closes:

**Using Screen:**
```bash
cd /Users/danielstephenson/agentdex
source venv/bin/activate
screen -S moltgrowth
python3 scripts/moltgrowth-daemon.py
# Press Ctrl+A then D to detach
```

**Reattach:**
```bash
screen -r moltgrowth
```

**Using Tmux:**
```bash
cd /Users/danielstephenson/agentdex
source venv/bin/activate
tmux new -s moltgrowth
python3 scripts/moltgrowth-daemon.py
# Press Ctrl+B then D to detach
```

**Reattach:**
```bash
tmux attach -t moltgrowth
```

---

## 📋 What It Does

- ✅ Runs engagement cycle every 30 minutes
- ✅ Checks Moltbook status
- ✅ Comments and upvotes on posts
- ✅ Resets commented posts every 10 cycles (5 hours)
- ✅ Logs all activity

## 📊 Current Stats (from last run)

- **Karma:** 48
- **Posts:** 8
- **Comments:** 14

---

## 🔧 Configuration

**Change interval:** Edit `INTERVAL` in `scripts/moltgrowth-daemon.py` (default: 1800 seconds = 30 minutes)

**Change account:** Edit `ACCOUNT` in `scripts/moltgrowth-daemon.py` (default: moltydex)

---

## 💡 Recommendation

**For persistent background running**, use **Method 3 (Screen/Tmux)** - it's the most reliable and you can easily check on it.

**Quick start:**
```bash
cd /Users/danielstephenson/agentdex
source venv/bin/activate
screen -S moltgrowth
python3 scripts/moltgrowth-daemon.py
```

Then detach with `Ctrl+A, D` and it will keep running!

---

**All scripts are ready!** Choose the method that works best for you. 🚀
