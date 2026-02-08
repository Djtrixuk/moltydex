# Cron Job Setup for MoltyDEX Moltbook Automation

## ✅ Cron Job Installed

**Schedule:** Daily at 9:00 AM  
**Script:** `/Users/danielstephenson/agentdex/scripts/moltgrowth-daily-cron.sh`  
**Logs:** `/Users/danielstephenson/agentdex/logs/moltgrowth-daily.log`

## Current Cron Job

```bash
0 9 * * * /Users/danielstephenson/agentdex/scripts/moltgrowth-daily-cron.sh
```

This runs every day at 9:00 AM.

## What It Does

1. **Activates virtual environment** - Ensures `moltgrowth` is available
2. **Checks current status** - Shows karma, posts, comments
3. **Views hot posts** - Checks what's trending
4. **Runs engagement cycle** - Comments and upvotes on relevant posts
5. **Shows final status** - Displays updated stats
6. **Logs everything** - All output saved to log file

## Viewing Logs

Check the automation logs:
```bash
tail -f /Users/danielstephenson/agentdex/logs/moltgrowth-daily.log
```

View recent logs:
```bash
cat /Users/danielstephenson/agentdex/logs/moltgrowth-daily.log
```

## Managing the Cron Job

### View current cron jobs
```bash
crontab -l
```

### Edit cron jobs
```bash
crontab -e
```

### Remove the cron job
```bash
crontab -l | grep -v moltgrowth-daily-cron.sh | crontab -
```

### Test the script manually
```bash
/Users/danielstephenson/agentdex/scripts/moltgrowth-daily-cron.sh
```

## Changing the Schedule

To change when it runs, edit the cron job:
```bash
crontab -e
```

**Common schedules:**
- `0 9 * * *` - Daily at 9 AM (current)
- `0 9,18 * * *` - Daily at 9 AM and 6 PM
- `0 */6 * * *` - Every 6 hours
- `0 9 * * 1-5` - Weekdays only at 9 AM
- `0 9 * * 0` - Sundays only at 9 AM

**Cron format:** `minute hour day month weekday`

## Troubleshooting

### Check if cron is running
```bash
ps aux | grep cron
```

### Check cron logs (macOS)
```bash
grep CRON /var/log/system.log
```

### Verify script works
```bash
cd /Users/danielstephenson/agentdex
./scripts/moltgrowth-daily-cron.sh
```

### Check script permissions
```bash
ls -l /Users/danielstephenson/agentdex/scripts/moltgrowth-daily-cron.sh
```

Should show: `-rwxr-xr-x` (executable)

## Monitoring

### Daily Check
After the cron job runs, check:
1. **Log file** - See what happened
2. **Moltbook status** - Check karma growth
3. **Engagement** - Verify comments/upvotes were made

### Weekly Review
```bash
# Check last week's logs
tail -100 /Users/danielstephenson/agentdex/logs/moltgrowth-daily.log

# Check current karma
cd /Users/danielstephenson/agentdex
source venv/bin/activate
moltgrowth status --account moltydex
```

## Best Practices

1. **Monitor logs regularly** - Check for errors or issues
2. **Respect rate limits** - Don't add too many cron jobs
3. **Adjust schedule** - Find the best time for engagement
4. **Review engagement** - Make sure comments are relevant
5. **Track karma growth** - Monitor progress over time

## Next Steps

1. ✅ Cron job is set up and will run daily at 9 AM
2. 📊 Monitor logs after first run
3. 🔄 Adjust schedule if needed
4. 📈 Track karma growth weekly
5. 🎯 Create additional posts manually as needed

---

**Status:** ✅ Active  
**Next Run:** Tomorrow at 9:00 AM  
**Logs:** `/Users/danielstephenson/agentdex/logs/moltgrowth-daily.log`
