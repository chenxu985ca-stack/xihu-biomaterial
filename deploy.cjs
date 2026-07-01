/**
 * Deploy dist/ to Tencent COS + fix admin path Content-Type.
 * Uses Node.js COS SDK (no encoding issues).
 * Reads TENCENT_SECRET_ID and TENCENT_SECRET_KEY from env.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const COS = require('cos-nodejs-sdk-v5');

const BUCKET = 'cunxiaziyou-tools-1439283284';
const REGION = 'ap-hongkong';
const PREFIX = 'biomaterial';
const DIST = 'dist';

// Validate and clean keys
const rawId = process.env.TENCENT_SECRET_ID || '';
const rawKey = process.env.TENCENT_SECRET_KEY || '';

// Strip non-printable and non-ASCII chars (common copy-paste artifacts)
const secretId = rawId.replace(/[^ -~]/g, '').trim();
const secretKey = rawKey.replace(/[^ -~]/g, '').trim();

if (!secretId || !secretKey) {
  console.error('[ERROR] TENCENT_SECRET_ID and TENCENT_SECRET_KEY must be set');
  process.exit(1);
}

// Warn if keys were cleaned (had invalid chars)
if (secretId !== rawId.trim() || secretKey !== rawKey.trim()) {
  console.error('[ERROR] API keys contain invalid characters (newlines, spaces, Unicode).');
  console.error('       Please re-copy keys from https://console.cloud.tencent.com/cam/capi');
  console.error('       Make sure there is no extra whitespace or newline.');
  process.exit(1);
}

const cos = new COS({ SecretId: secretId, SecretKey: secretKey });

/** Recursively walk a directory */
function walk(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walk(full));
    else if (entry.isFile()) results.push(full);
  }
  return results;
}

/** Guess MIME type */
function mimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.json': 'application/json',
    '.woff2': 'font/woff2',
  };
  return map[ext] || 'application/octet-stream';
}

async function main() {
  // 1. List existing assets
  const existingAssets = [];
  let marker;
  do {
    const { Contents, IsTruncated, NextMarker } = await new Promise((resolve, reject) => {
      cos.getBucket({ Bucket: BUCKET, Region: REGION, Prefix: `${PREFIX}/assets/`, Marker: marker }, (err, data) => {
        if (err) reject(err); else resolve(data);
      });
    });
    for (const obj of Contents || []) existingAssets.push(obj.Key);
    marker = (IsTruncated === 'true') ? NextMarker : null;
  } while (marker);

  // 2. Walk local dist
  const localFiles = walk(DIST).map(f => f.replace(DIST + '/', PREFIX + '/'));

  // 3. Delete stale assets
  const toDelete = existingAssets.filter(k => !localFiles.includes(k) && k.startsWith(PREFIX + '/assets/'));
  if (toDelete.length > 0) {
    await new Promise((resolve, reject) => {
      cos.deleteMultipleObject({
        Bucket: BUCKET, Region: REGION,
        Objects: toDelete.map(k => ({ Key: k })),
      }, (err, data) => err ? reject(err) : resolve(data));
    });
  }

  // 4. Upload new files
  let uploaded = 0;
  for (const file of walk(DIST)) {
    const key = file.replace(DIST + '/', PREFIX + '/');
    const body = fs.readFileSync(file);
    await new Promise((resolve, reject) => {
      cos.putObject({
        Bucket: BUCKET, Region: REGION, Key: key, Body: body,
        ContentType: mimeType(file),
        CacheControl: file.endsWith('.html') ? 'no-cache' : 'max-age=31536000',
      }, (err, data) => err ? reject(err) : resolve(data));
    });
    uploaded++;
  }

  // 5. Fix admin path (extensionless -> explicit Content-Type)
  const htmlBody = fs.readFileSync(path.join(DIST, 'index.html'));
  await new Promise((resolve, reject) => {
    cos.putObject({
      Bucket: BUCKET, Region: REGION, Key: `${PREFIX}/admin`, Body: htmlBody,
      ContentType: 'text/html; charset=utf-8',
      CacheControl: 'no-cache',
    }, (err, data) => err ? reject(err) : resolve(data));
  });

  console.log(`[OK] Uploaded ${uploaded} files + admin path, deleted ${toDelete.length} stale assets`);
}

main().catch(err => {
  console.error('[ERROR]', err.message || err);
  process.exit(1);
});
