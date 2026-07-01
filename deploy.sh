#!/bin/bash
# ============================================================
# Deploy: build + upload to Tencent COS
#
# Prereq: pip install cos-python-sdk-v5
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
python3 deploy.py

echo "[3/3] Deploy complete"
echo "   Site:  http://cunxiaziyou.cn/biomaterial/index.html"
echo "   Admin: http://cunxiaziyou.cn/biomaterial/admin"
