"""
Deploy script: upload dist/ to Tencent COS, fix admin path Content-Type.
Reads credentials from env: TENCENT_SECRET_ID, TENCENT_SECRET_KEY
"""
import os, sys, glob, mimetypes
from qcloud_cos import CosConfig, CosS3Client

BUCKET = 'cunxiaziyou-tools-1439283284'
REGION = 'ap-hongkong'
PREFIX = 'biomaterial'
DIST = 'dist'

secret_id = os.environ.get('TENCENT_SECRET_ID', '')
secret_key = os.environ.get('TENCENT_SECRET_KEY', '')
if not secret_id or not secret_key:
    print('[ERROR] TENCENT_SECRET_ID and TENCENT_SECRET_KEY must be set')
    sys.exit(1)

config = CosConfig(Region=REGION, SecretId=secret_id, SecretKey=secret_key)
client = CosS3Client(config)

# 1. Remove old asset files (CSS/JS have content hashes, old ones pile up)
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

to_delete = existing - local_files
for key in to_delete:
    client.delete_object(Bucket=BUCKET, Key=key)

# 2. Upload new files
total = 0
for f in glob.glob(f'{DIST}/**/*', recursive=True):
    if not os.path.isfile(f):
        continue
    key = f.replace(f'{DIST}/', f'{PREFIX}/')
    content_type, _ = mimetypes.guess_type(f)
    if content_type is None:
        content_type = 'application/octet-stream'
    if f.endswith('.html'):
        content_type = 'text/html; charset=utf-8'

    with open(f, 'rb') as body:
        client.put_object(
            Bucket=BUCKET, Key=key, Body=body,
            ContentType=content_type,
            CacheControl='no-cache' if f.endswith('.html') else 'max-age=31536000',
        )
    total += 1

# 3. Fix admin path (no extension -> must set Content-Type explicitly)
with open(f'{DIST}/index.html', 'rb') as body:
    client.put_object(
        Bucket=BUCKET, Key=f'{PREFIX}/admin', Body=body,
        ContentType='text/html; charset=utf-8',
        CacheControl='no-cache',
    )

print(f'[OK] Uploaded {total} files + admin path, deleted {len(to_delete)} stale assets')
