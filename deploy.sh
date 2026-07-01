#!/bin/bash
# ============================================================
# 部署脚本：构建 + 上传 COS + 修复 admin 路径 Content-Type
#
# 依赖: pip install qcloud_cos
# 用法: TENCENT_SECRET_ID=xxx TENCENT_SECRET_KEY=xxx ./deploy.sh
# ============================================================
set -euo pipefail

# 检查环境变量
if [ -z "${TENCENT_SECRET_ID:-}" ] || [ -z "${TENCENT_SECRET_KEY:-}" ]; then
  echo "❌ 请设置环境变量: TENCENT_SECRET_ID 和 TENCENT_SECRET_KEY"
  exit 1
fi

BUCKET="cunxiaziyou-tools-1439283284"
REGION="ap-hongkong"
PREFIX="biomaterial"

echo "🔨 Building..."
npm run build

echo "🚀 Deploying to COS..."
python3 << EOF
import os, sys, glob, mimetypes
from qcloud_cos import CosConfig, CosS3Client

BUCKET = '${BUCKET}'
REGION = '${REGION}'
PREFIX = '${PREFIX}'
DIST = 'dist'

config = CosConfig(
    Region=REGION,
    SecretId=os.environ['TENCENT_SECRET_ID'],
    SecretKey=os.environ['TENCENT_SECRET_KEY'],
)
client = CosS3Client(config)

# 1. 删除远端旧的资产文件（CSS/JS 文件名带 hash，不清理会堆积）
existing = set()
marker = ''
while True:
    resp = client.list_objects(Bucket=BUCKET, Prefix=f'{PREFIX}/assets/', Marker=marker)
    for obj in resp.get('Contents', []):
        existing.add(obj['Key'])
    if resp.get('IsTruncated') == 'false':
        break
    marker = resp.get('NextMarker', '')

local_files = set()
for f in glob.glob(f'{DIST}/**/*', recursive=True):
    if os.path.isfile(f):
        local_files.add(f.replace(f'{DIST}/', f'{PREFIX}/'))

# 删除远端有但本地没有的
to_delete = existing - local_files
for key in to_delete:
    client.delete_object(Bucket=BUCKET, Key=key)

# 2. 上传新文件
total = 0
for f in glob.glob(f'{DIST}/**/*', recursive=True):
    if not os.path.isfile(f):
        continue
    key = f.replace(f'{DIST}/', f'{PREFIX}/')
    content_type, _ = mimetypes.guess_type(f)
    if content_type is None:
        content_type = 'application/octet-stream'
    # HTML 文件需要明确编码
    if f.endswith('.html'):
        content_type = 'text/html; charset=utf-8'

    with open(f, 'rb') as body:
        client.put_object(
            Bucket=BUCKET,
            Key=key,
            Body=body,
            ContentType=content_type,
            CacheControl='no-cache' if f.endswith('.html') else 'max-age=31536000',
        )
    total += 1

# 3. 修复 admin 路径（无扩展名，需单独上传设 Content-Type）
with open(f'{DIST}/index.html', 'rb') as body:
    client.put_object(
        Bucket=BUCKET,
        Key=f'{PREFIX}/admin',
        Body=body,
        ContentType='text/html; charset=utf-8',
        CacheControl='no-cache',
    )

print(f'✅ Uploaded {total} files + admin path, deleted {len(to_delete)} stale assets')
EOF

echo ""
echo "✅ Deploy complete"
echo "   Site:  http://cunxiaziyou.cn/biomaterial/index.html"
echo "   Admin: http://cunxiaziyou.cn/biomaterial/admin"
