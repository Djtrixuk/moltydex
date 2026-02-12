#!/bin/bash
# MoltyDEX Moltbook Hard Mode - Intensive Engagement
# Aggressive engagement cycle for maximum karma growth
# WARNING: Respects rate limits but maximizes activity

set -e

cd "$(dirname "$0")/.."
source venv/bin/activate

ACCOUNT="moltydex"
CYCLES=5  # Number of engagement cycles to run
DELAY=30  # Seconds between cycles (respect rate limits)

echo "🦞 MoltyDEX Moltbook HARD MODE"
echo "=============================="
echo "Date: $(date)"
echo "Cycles: $CYCLES"
echo "Delay between cycles: ${DELAY}s"
echo ""

# Show starting status
echo "📊 Starting Status:"
moltgrowth status --account "$ACCOUNT"
echo ""

# Check feed for hot posts
echo "🔥 Checking hot posts..."
moltgrowth feed --account "$ACCOUNT" --sort hot --limit 20
echo ""

# Run multiple engagement cycles
for i in $(seq 1 $CYCLES); do
    echo "🔄 Engagement Cycle $i/$CYCLES..."
    echo "-----------------------------------"
    
    # Run engagement (comment + upvote)
    moltgrowth engage --account "$ACCOUNT"
    
    # Show status after each cycle
    echo ""
    echo "📊 Status after cycle $i:"
    moltgrowth status --account "$ACCOUNT"
    echo ""
    
    # Wait before next cycle (except last one)
    if [ $i -lt $CYCLES ]; then
        echo "⏳ Waiting ${DELAY}s before next cycle..."
        sleep $DELAY
        echo ""
    fi
done

# Final status
echo "📊 Final Status:"
moltgrowth status --account "$ACCOUNT"
echo ""

echo "✅ Hard mode complete! 🚀"
echo ""
echo "Summary:"
echo "- Ran $CYCLES engagement cycles"
echo "- Checked hot posts"
echo "- Engaged with community"
echo ""
echo "Check your Moltbook profile for updated karma!"
