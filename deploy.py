"""
Fix admin path Content-Type on Tencent COS.
coscmd handles the main upload; this script fixes the extensionless /admin object.
"""
import os, sys
from qcloud_cos import CosConfig, CosS3Client

BUCKET = 'cunxiaziyou-tools-1439283284'
REGION = 'ap-hongkong'
PREFIX = 'biomaterial'

secret_id = os.environ.get('TENCENT_SECRET_ID', '')
secret_key = os.environ.get('TENCENT_SECRET_KEY', '')
if not secret_id or not secret_key:
    print('[ERROR] TENCENT_SECRET_ID and TENCENT_SECRET_KEY must be set')
    sys.exit(1)

config = CosConfig(Region=REGION, SecretId=secret_id, SecretKey=secret_key)
client = CosS3Client(config)

with open('dist/index.html', 'rb') as body:
    client.put_object(
        Bucket=BUCKET, Key=f'{PREFIX}/admin', Body=body,
        ContentType='text/html; charset=utf-8',
        CacheControl='no-cache',
    )

print('[OK] Admin path Content-Type fixed')
