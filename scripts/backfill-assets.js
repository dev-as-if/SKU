const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const root = path.resolve(__dirname, '..');
const pagesRoot = path.join(root, 'mirror-full', 'pages');
const staticRoot = path.join(root, 'mirror-full', 'static');
const urls = new Set();
const origin = 'https://www.skuindia.ac.in';

for (const file of walk(pagesRoot)) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(/(?:href|src|srcset|data-src|data-srcset|poster)\s*=\s*["']([^"']+)["']/gi)) {
    for (const part of match[1].split(/\s*,\s*/)) {
      const value = part.replace(/\s+\d+(?:\.\d+)?[wx]$/, '').trim();
      if (value.startsWith('/Content/') || value.startsWith('/images/')) urls.add(value.split(/[?#]/)[0]);
    }
  }
  for (const match of text.matchAll(/(?:image|url)"?\s*:\s*"([^"]+)"/gi)) {
    if (!match[1].includes('://') && !match[1].startsWith('/') && /\.(?:jpg|jpeg|png|webp|gif|svg)$/i.test(match[1])) urls.add('/Content/web/university/courses/' + match[1]);
  }
}
urls.add('/Content/images/footer.jpg');

const pending = [...urls].filter(url => !fs.existsSync(path.join(staticRoot, decodeURIComponent(url.slice(1)))));
let index = 0;
const failures = [];

function download(url) {
  return new Promise(resolve => {
    const target = path.join(staticRoot, decodeURIComponent(url.slice(1)));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    const encodedUrl = origin + url.split('/').map(segment => encodeURIComponent(decodeURIComponent(segment))).join('/');
    execFile('curl.exe', ['-L', '--fail', '--silent', '--show-error', '--max-time', '15', '--connect-timeout', '5', '-A', 'SKU-local-clone/1.0', '-o', target, encodedUrl], error => {
      if (error) { failures.push({ url, error: error.message }); try { fs.unlinkSync(target); } catch {} }
      resolve();
    });
  });
}

async function worker() {
  while (index < pending.length) {
    const current = pending[index++];
    await download(current);
    if (index % 10 === 0 || index === pending.length) console.log(`assets ${index}/${pending.length}`);
  }
}

(async () => {
  await Promise.all(Array.from({ length: 12 }, worker));
  fs.writeFileSync(path.join(root, 'asset-backfill-report.json'), JSON.stringify({ attempted: pending.length, downloaded: pending.length - failures.length, failures }, null, 2));
  console.log(`complete: attempted ${pending.length}, downloaded ${pending.length - failures.length}, failed ${failures.length}`);
})();

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}
