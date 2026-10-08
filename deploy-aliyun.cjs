/**
 * Build output deployment for Alibaba Cloud OSS.
 * Credentials and target settings are read from .env.aliyun by npm script.
 */
const fs = require('fs');
const path = require('path');
const OSS = require('ali-oss');

const required = [
  'ALIBABA_CLOUD_ACCESS_KEY_ID',
  'ALIBABA_CLOUD_ACCESS_KEY_SECRET',
  'ALIYUN_REGION',
  'ALIYUN_OSS_BUCKET',
];

for (const name of required) {
  if (!process.env[name]) {
    console.error(`[ERROR] Missing ${name}`);
    process.exit(1);
  }
}

const bucket = process.env.ALIYUN_OSS_BUCKET;
const region = process.env.ALIYUN_REGION.startsWith('oss-')
  ? process.env.ALIYUN_REGION
  : `oss-${process.env.ALIYUN_REGION}`;
const dist = path.resolve('dist');

const client = new OSS({
  accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID,
  accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET,
  region,
});

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function contentType(filePath) {
  const types = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.woff2': 'font/woff2',
  };
  return types[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

async function bucketExists() {
  const result = await client.listBuckets({ prefix: bucket });
  return (result.buckets || []).some((item) => item.name === bucket);
}

async function main() {
  if (!fs.existsSync(dist)) {
    throw new Error('dist directory does not exist; run npm run build first');
  }

  if (!(await bucketExists())) {
    await client.putBucket(bucket, {
      acl: 'public-read',
      storageClass: 'Standard',
      dataRedundancyType: 'LRS',
    });
    console.log(`[OK] Created bucket ${bucket}`);
  } else {
    client.useBucket(bucket);
    await client.putBucketACL(bucket, 'public-read');
    console.log(`[OK] Using existing bucket ${bucket}`);
  }

  client.useBucket(bucket);
  await client.putBucketWebsite(bucket, {
    index: 'index.html',
    error: 'index.html',
    supportSubDir: true,
  });

  const files = walk(dist);
  for (const file of files) {
    const objectName = path.relative(dist, file).split(path.sep).join('/');
    const isHtml = path.extname(file).toLowerCase() === '.html';
    await client.put(objectName, file, {
      headers: {
        'Content-Type': contentType(file),
        'Cache-Control': isHtml ? 'no-cache' : 'public, max-age=31536000, immutable',
      },
    });
  }

  await client.put('admin', path.join(dist, 'index.html'), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });

  console.log(`[OK] Uploaded ${files.length} files plus /admin`);
  console.log(`[OK] OSS website: http://${bucket}.${region}.aliyuncs.com`);
}

main().catch((error) => {
  console.error(`[ERROR] ${error.code || error.name}: ${error.message}`);
  process.exit(1);
});
