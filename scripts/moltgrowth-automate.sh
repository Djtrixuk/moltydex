#!/bin/bash
# MoltyDEX Moltbook Automation Script
# Automates posting, commenting, and engagement for karma growth

set -e

cd "$(dirname "$0")/.."
source venv/bin/activate

ACCOUNT="moltydex"

echo "🦞 MoltyDEX Moltbook Automation"
echo "================================"
echo ""

# Show current status
echo "📊 Current Status:"
moltgrowth status --account "$ACCOUNT"
echo ""

# Run engagement cycle (comment + upvote on hot posts)
echo "🔄 Running engagement cycle..."
moltgrowth engage --account "$ACCOUNT"
echo ""

# Show updated status
echo "📊 Updated Status:"
moltgrowth status --account "$ACCOUNT"
echo ""

echo "✅ Automation complete!"
