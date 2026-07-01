#!/bin/bash
# ============================================================
# Deploy: build + upload to Tencent COS
#
# Prereq: npm install (cos-nodejs-sdk-v5 is bundled)
# Usage:  TENCENT_SECRET_ID=xxx TENCENT_SECRET_KEY=xxx ./deploy.sh
# ============================================================
set -euo pipefail

if [ -z "${TENCENT_SECRET_ID:-}" ] || [ -z "${TENCENT_SECRET_KEY:-}" ]; then
  echo "[ERROR] Please set TENCENT_SECRET_ID and TENCENT_SECRET_KEY"
  exit 1
fi

echo "[1/3] Building..."
npm run build

echo "[2/3] Deploying to COS..."
node deploy.cjs

echo "[3/3] Deploy complete"
echo "   Site:  http://cunxiaziyou.cn/biomaterial/index.html"
echo "   Admin: http://cunxiaziyou.cn/biomaterial/admin"
