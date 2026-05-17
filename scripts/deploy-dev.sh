#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# deploy-dev.sh — Build and deploy NetTrek game client to DEV
# ─────────────────────────────────────────────────────────────
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

BUCKET="spacechannel-nettrek-dev"
CF_ID="E39B54DCRK5DHO"

echo ""
echo "  ┌─────────────────────────────────────────────┐"
echo "  │  NetTrek Game Client DEV Deploy             │"
echo "  └─────────────────────────────────────────────┘"
echo ""

cd "$PROJECT_ROOT"

# Build
echo "  Building..."
npx vite build 2>&1 | tail -5
echo "  ✓ Build complete"
echo ""

# Deploy
echo "  Syncing to s3://$BUCKET ..."
aws s3 sync dist/ "s3://$BUCKET" --delete --region us-east-1
echo "  ✓ Uploaded"

echo "  Invalidating CloudFront..."
aws cloudfront create-invalidation --distribution-id "$CF_ID" --paths "/*" > /dev/null 2>&1
echo "  ✓ CloudFront invalidated"

echo ""
echo "  ✓ NetTrek DEV deployed"
echo "  Preview: https://d2pu3pmby1pmk.cloudfront.net"
echo ""
