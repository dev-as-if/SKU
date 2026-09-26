const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const publish = path.join(root, 'site');
const homepage = path.join(root, 'mirror-smoke', 'pages', 'index.html');
const resultPage = path.join(root, 'mirror-full', 'pages', 'students', 'result');
const staticRoot = path.join(root, 'mirror-full', 'static');
const smokeStatic = path.join(root, 'mirror-smoke', 'static');

fs.rmSync(publish, { recursive: true, force: true });
fs.mkdirSync(publish, { recursive: true });

const html = fs.readFileSync(homepage, 'utf8');
const resultHtml = fs.readFileSync(resultPage, 'utf8');
fs.writeFileSync(path.join(publish, 'index.html'), html);
fs.mkdirSync(path.join(publish, 'students', 'result'), { recursive: true });
fs.writeFileSync(path.join(publish, 'students', 'result', 'index.html'), resultHtml);
fs.writeFileSync(path.join(publish, '404.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0; url=/"><title>Page not found</title><script>window.location.replace('/');</script></head><body><p>Page not found. <a href="/">Return home</a>.</p></body></html>`);
fs.writeFileSync(path.join(publish, '_redirects'), '/* / 302\n');
fs.writeFileSync(path.join(publish, '.nojekyll'), '');
const customDomain = path.join(root, 'CNAME');
if (fs.existsSync(customDomain)) fs.copyFileSync(customDomain, path.join(publish, 'CNAME'));

const needed = new Set([
  'results/SKU266920325-result.pdf',
  'Content/images/footer.jpg',
  'Content/web/university/sku-logo-header.png'
]);

function addFromHtml(text) {
  for (const match of text.matchAll(/(?:href|src|srcset)\s*=\s*["']([^"']+)["']/gi)) {
    for (const part of match[1].split(',')) {
      const value = part.replace(/\s+\d+(?:\.\d+)?[wx]$/i, '').trim().split(/[?#]/)[0];
      if (value.startsWith('/') && !value.startsWith('//')) needed.add(decodeURIComponent(value.slice(1)));
    }
  }
  for (const match of text.matchAll(/url\((['"]?)(\/[^'")]+)\1\)/gi)) {
    needed.add(decodeURIComponent(match[2].split(/[?#]/)[0].slice(1)));
  }
}

addFromHtml(html);
addFromHtml(resultHtml);

function copyFile(relative) {
  const clean = relative.replace(/^\/+/, '').replaceAll('\\', '/');
  if (!clean || clean.endsWith('/')) return;
  const dest = path.join(publish, clean);
  if (fs.existsSync(dest)) return;
  const sources = [path.join(staticRoot, clean), path.join(smokeStatic, clean)];
  const source = sources.find(file => fs.existsSync(file) && fs.statSync(file).isFile());
  if (!source) return;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(source, dest);
  if (/\.(css)$/i.test(clean)) {
    const css = fs.readFileSync(source, 'utf8');
    for (const match of css.matchAll(/url\((['"]?)([^'")]+)\1\)/gi)) {
      const value = match[2].trim();
      if (!value || value.startsWith('data:') || /^https?:/i.test(value)) continue;
      const resolved = value.startsWith('/')
        ? decodeURIComponent(value.split(/[?#]/)[0].slice(1))
        : path.posix.normalize(path.posix.join(path.posix.dirname(clean), value.split(/[?#]/)[0]));
      copyFile(resolved);
    }
  }
}

for (const relative of [...needed]) copyFile(relative);
copyDirectory(path.join(staticRoot, 'vendor'), path.join(publish, 'vendor'));

console.log(`Prepared ${publish}`);

function copyDirectory(source, destination) {
  if (!fs.existsSync(source)) return;
  fs.mkdirSync(destination, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) copyDirectory(from, to);
    else {
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.copyFileSync(from, to);
    }
  }
}
