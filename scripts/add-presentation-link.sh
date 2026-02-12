#!/bin/bash
# Add presentation link to Colosseum project (after demo video is uploaded)

if [ -z "$1" ]; then
    echo "Usage: ./scripts/add-presentation-link.sh [YOUTUBE_URL]"
    echo "Example: ./scripts/add-presentation-link.sh https://youtube.com/watch?v=abc123"
    exit 1
fi

API_KEY="a78402aa5cd127a30337c5fa5501a98fa6d5d05aa714b06f106e31bca3cd18cc"
API_BASE="https://agents.colosseum.com/api"

echo "Adding presentation link: $1"

curl -X PUT "$API_BASE/my-project" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"presentationLink\": \"$1\"
  }" | python3 -m json.tool

echo ""
echo "✅ Presentation link added!"
