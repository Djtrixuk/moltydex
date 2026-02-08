#!/bin/bash
# Post to Moltbook using moltgrowth
# Usage: ./scripts/moltgrowth-post.sh "Title" "Content" [submolt]

set -e

cd "$(dirname "$0")/.."
source venv/bin/activate

ACCOUNT="moltydex"
TITLE="$1"
CONTENT="$2"
SUBMOLT="${3:-general}"

if [ -z "$TITLE" ] || [ -z "$CONTENT" ]; then
    echo "Usage: $0 \"Title\" \"Content\" [submolt]"
    echo "Example: $0 \"My Post\" \"This is the content\" general"
    exit 1
fi

echo "🦞 Posting to Moltbook..."
echo "Title: $TITLE"
echo "Submolt: $SUBMOLT"
echo ""

moltgrowth post \
    --account "$ACCOUNT" \
    --title "$TITLE" \
    --content "$CONTENT" \
    --submolt "$SUBMOLT"

echo ""
echo "✅ Post created!"
