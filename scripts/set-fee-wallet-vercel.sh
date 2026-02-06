#!/bin/bash
# Script to help set FEE_WALLET in Vercel
# Note: This requires Vercel CLI and manual confirmation

FEE_WALLET="ATYWjod5jkQm5RxrC65irY8e97UUY42LFM45ZGuNK3JL"

echo "🔧 Setting Fee Wallet in Vercel"
echo ""
echo "Fee Wallet: $FEE_WALLET"
echo ""
echo "This script will help you set the FEE_WALLET environment variable."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Install with: npm i -g vercel"
    echo ""
    echo "Alternatively, set it manually:"
    echo "1. Go to https://vercel.com/dashboard"
    echo "2. Select moltydex-api project"
    echo "3. Settings → Environment Variables"
    echo "4. Add FEE_WALLET = $FEE_WALLET"
    echo "5. Redeploy"
    exit 1
fi

cd api

echo "Setting FEE_WALLET environment variable..."
echo ""

# Try to set via Vercel CLI (may require authentication)
vercel env add FEE_WALLET production <<EOF
$FEE_WALLET
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Fee wallet set successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Redeploy: vercel --prod"
    echo "2. Verify: curl https://api.moltydex.com/api/health | jq '.fee_wallet_configured'"
else
    echo ""
    echo "⚠️  Could not set automatically. Please set manually:"
    echo ""
    echo "1. Go to: https://vercel.com/dashboard"
    echo "2. Select: moltydex-api project"
    echo "3. Settings → Environment Variables"
    echo "4. Add:"
    echo "   Name: FEE_WALLET"
    echo "   Value: $FEE_WALLET"
    echo "   Environment: Production"
    echo "5. Save and Redeploy"
fi
