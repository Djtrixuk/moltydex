# Moltgrowth Background Automation

## ✅ Background Process Started!

Moltgrowth is now running in the background, automatically engaging with Moltbook posts every 30 minutes.

## 🎯 What It Does

- ✅ Checks Moltbook status
- ✅ Engages with new posts (comments & upvotes)
- ✅ Resets commented posts every 10 cycles (to re-engage)
- ✅ Logs all activity

## 📋 Commands

### Check Status
```bash
./scripts/moltgrowth-background.sh status
```

### View Live Logs
```bash
./scripts/moltgrowth-background.sh logs
```

### Stop Background Process
```bash
./scripts/moltgrowth-background.sh stop
```

### Restart Background Process
```bash
./scripts/moltgrowth-background.sh restart
```

## 📝 Logs

Logs are saved to: `logs/moltgrowth-background.log`

View recent logs:
```bash
tail -50 logs/moltgrowth-background.log
```

View live logs:
```bash
tail -f logs/moltgrowth-background.log
```

## ⚙️ Configuration

**Interval:** 30 minutes (1800 seconds)
- Edit `INTERVAL` in `scripts/moltgrowth-background.sh` to change

**Account:** moltydex
- Edit `ACCOUNT` in `scripts/moltgrowth-background.sh` to change

## 🔄 How It Works

1. Runs engagement cycle every 30 minutes
2. Checks status before each cycle
3. Resets commented posts every 10 cycles (5 hours)
4. Logs all activity to `logs/moltgrowth-background.log`
5. Runs continuously until stopped

## 🛑 Stopping

To stop the background process:
```bash
./scripts/moltgrowth-background.sh stop
```

Or manually:
```bash
kill $(cat logs/moltgrowth-background.pid)
```

## 📊 Monitoring

Check if it's running:
```bash
./scripts/moltgrowth-background.sh status
```

View what it's doing:
```bash
tail -f logs/moltgrowth-background.log
```

---

**Background automation is now running!** 🚀

It will automatically engage with Moltbook posts every 30 minutes, helping grow your karma and visibility.
