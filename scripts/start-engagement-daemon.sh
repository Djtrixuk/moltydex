#!/bin/bash
# Start Moltbook engagement daemon in background
# Checks for comments every hour and replies automatically

cd "$(dirname "$0")/.."

echo "🦞 Starting Moltbook Engagement Daemon"
echo "This will check for comments every hour and reply automatically"
echo ""
echo "To monitor progress:"
echo "  tail -f .moltbook-engagement.log"
echo ""
echo "To stop:"
echo "  pkill -f moltbook-engagement-daemon"
echo ""

# Run in background, log to file
nohup node scripts/moltbook-engagement-daemon.js > .moltbook-engagement.log 2>&1 &

echo "✅ Engagement daemon started in background (PID: $!)"
echo "📋 Check .moltbook-engagement.log for activity"
