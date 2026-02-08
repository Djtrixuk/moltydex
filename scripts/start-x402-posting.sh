#!/bin/bash
# Start posting x402 educational posts in background
# This will take ~4.5 hours (9 posts × 30 min = 270 minutes)

cd "$(dirname "$0")/.."

echo "🚀 Starting x402 Educational Posting Campaign"
echo "This will post 9 remaining posts with 30-minute delays"
echo "Estimated time: ~4.5 hours"
echo ""
echo "To monitor progress:"
echo "  tail -f .x402-posting.log"
echo ""
echo "To check status:"
echo "  cat .x402-posts-posted.json"
echo ""

# Run in background, log to file
nohup node scripts/post-all-x402-educational.js > .x402-posting.log 2>&1 &

echo "✅ Posting started in background (PID: $!)"
echo "📋 Check .x402-posting.log for progress"
