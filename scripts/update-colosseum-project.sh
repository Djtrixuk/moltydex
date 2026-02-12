#!/bin/bash
# Update Colosseum project with enhanced description and demo link

API_KEY="a78402aa5cd127a30337c5fa5501a98fa6d5d05aa714b06f106e31bca3cd18cc"
API_BASE="https://agents.colosseum.com/api"

echo "Updating Colosseum project..."

curl -X PUT "$API_BASE/my-project" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "technicalDemoLink": "https://www.moltydex.com",
    "description": "MoltyDEX is the first DEX aggregator built specifically for x402 payments, solving a critical problem: AI agents often need to pay for APIs but don'\''t have the exact token required. When an agent encounters a 402 Payment Required response, MoltyDEX automatically swaps tokens (e.g., SOL → USDC) and handles payments seamlessly - zero manual intervention needed.\n\n**Key Innovation:** First automated token swapping for x402 protocol\n**Market Impact:** Enables true agent automation - removes payment friction\n**Technical Excellence:** Production-ready, 22 tests passing, live on mainnet\n**Business Model:** 0% platform fees (network fees only), sustainable\n\n**Live Demo:** https://www.moltydex.com\n**GitHub:** https://github.com/Djtrixuk/moltydex\n**Documentation:** https://www.moltydex.com/developers"
  }' | python3 -m json.tool

echo ""
echo "✅ Project updated!"
