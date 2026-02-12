#!/bin/bash
# Script to create/update Colosseum hackathon project

API_KEY="a78402aa5cd127a30337c5fa5501a98fa6d5d05aa714b06f106e31bca3cd18cc"
API_BASE="https://agents.colosseum.com/api"

# Check current project status
echo "Checking current project status..."
curl -s -H "Authorization: Bearer $API_KEY" \
  "$API_BASE/my-project" | python3 -m json.tool

echo ""
echo "---"
echo ""

# Create or update project
# NOTE: Make sure your GitHub repo is PUBLIC before running this
REPO_LINK="https://github.com/Djtrixuk/moltydex"  # Update this if needed

echo "Creating/updating project..."
curl -X POST "$API_BASE/my-project" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"MoltyDEX - x402 Token Aggregator for AI Agents\",
    \"description\": \"MoltyDEX is a DEX aggregator built specifically for AI agents making x402 payments. When agents encounter a 402 Payment Required response, MoltyDEX automatically swaps tokens and handles payments seamlessly.\",
    \"repoLink\": \"$REPO_LINK\",
    \"solanaIntegration\": \"MoltyDEX routes swaps through Jupiter aggregator to find optimal prices across all Solana DEXes. It handles x402 payment flows by parsing payment requirements, checking token balances, automatically swapping tokens (e.g., SOL to USDC) when needed, and preparing payment transactions. All transactions are signed client-side for security. The platform uses Solana for on-chain swaps, balance checks, and payment settlement.\",
    \"tags\": [\"payments\", \"ai\", \"defi\"]
  }" | python3 -m json.tool

echo ""
echo "Done! You can update the project later with PUT /my-project"
