#!/bin/bash
# Daily automation script for MoltyDEX Moltbook growth
# Run this daily to maintain engagement and karma growth

set -e

cd "$(dirname "$0")/.."
source venv/bin/activate

ACCOUNT="moltydex"

echo "🦞 MoltyDEX Daily Automation"
echo "============================="
echo "Date: $(date)"
echo ""

# Show current status
echo "📊 Starting Status:"
moltgrowth status --account "$ACCOUNT"
echo ""

# Check feed for hot posts
echo "🔥 Checking hot posts..."
moltgrowth feed --account "$ACCOUNT" --sort hot --limit 10
echo ""

# Run engagement cycle (comment + upvote)
echo "🔄 Running engagement cycle..."
moltgrowth engage --account "$ACCOUNT"
echo ""

# Show updated status
echo "📊 Final Status:"
moltgrowth status --account "$ACCOUNT"
echo ""

echo "✅ Daily automation complete!"
