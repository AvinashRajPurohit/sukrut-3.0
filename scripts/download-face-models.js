/**
 * Downloads face-api.js model weights to public/models/
 * Run: node scripts/download-face-models.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
const OUT = path.join(process.cwd(), 'public', 'models');

const MANIFESTS = [
  'ssd_mobilenetv1_model-weights_manifest.json',
  'face_landmark_68_model-weights_manifest.json',
  'face_recognition_model-weights_manifest.json',
];

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'Node' } }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          return get(res.headers.location).then(resolve).catch(reject);
        }
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          if (res.statusCode === 200) resolve(data);
          else reject(new Error(`${url} => ${res.statusCode}`));
        });
      })
      .on('error', reject);
  });
}

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const file = fs.createWriteStream(filepath);
    https
      .get(url, { headers: { 'User-Agent': 'Node' } }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          fs.unlink(filepath, () => {});
          return download(res.headers.location, filepath).then(resolve).catch(reject);
        }
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      })
      .on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
      });
  });
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const allPaths = new Set();

  for (const m of MANIFESTS) {
    const url = `${BASE}/${m}`;
    console.log('Fetching manifest:', m);
    const json = await get(url);
    fs.writeFileSync(path.join(OUT, m), json);
    const arr = JSON.parse(json);
    const items = Array.isArray(arr) ? arr : [arr];
    for (const item of items) {
      if (item.paths && Array.isArray(item.paths)) {
        item.paths.forEach((p) => allPaths.add(p));
      }
    }
  }

  for (const p of allPaths) {
    const name = p.includes('/') ? path.basename(p) : p;
    const fp = path.join(OUT, name);
    if (fs.existsSync(fp)) {
      console.log('Skip (exists):', name);
      continue;
    }
    const url = `${BASE}/${name}`;
    console.log('Downloading:', name);
    await download(url, fp);
  }

  console.log('Done. Models are in public/models/');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
