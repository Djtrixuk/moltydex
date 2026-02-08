#!/bin/bash
# Run Moltbook growth automation in background
# Posts content and runs engagement with proper delays

cd "$(dirname "$0")/.."
source venv/bin/activate

LOG_FILE="logs/moltbook-growth.log"
mkdir -p logs

echo "🚀 Starting Moltbook growth automation..."
echo "📝 Logs: $LOG_FILE"

# Run the automation script and log output
./scripts/moltbook-growth-automation.sh >> "$LOG_FILE" 2>&1 &

echo "✅ Growth automation running in background (PID: $!)"
echo "📊 Monitor with: tail -f $LOG_FILE"
echo "🛑 Stop with: pkill -f moltbook-growth-automation"
