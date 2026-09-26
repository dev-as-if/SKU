const fs = require('fs');
const path = require('path');

const pageRoot = path.join(__dirname, '..', 'mirror-full', 'pages');
const htmlFiles = fs.existsSync(pageRoot) ? walk(pageRoot).filter(file => /\.html$/i.test(file) || !path.extname(file)) : [];
const broken = [];
const productionLinks = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  for (const match of html.matchAll(/(?:href|src|poster)=["']([^"']+)["']/gi)) {
    const url = match[1];
    if (/skuindia\.ac\.in/i.test(url)) productionLinks.push({ file, url });
    if (!url.startsWith('/') || url.startsWith('//') || url.startsWith('/admin')) continue;
    const clean = url.split(/[?#]/)[0];
    if (/\.(css|js|png|jpe?g|gif|svg|webp|pdf|woff2?|ttf|mp4)$/i.test(clean)) {
      const asset = path.join(__dirname, '..', 'mirror-full', 'static', clean.slice(1));
      if (!fs.existsSync(asset)) broken.push({ file, url });
    }
  }
}

console.log(`Checked ${htmlFiles.length} HTML file(s)`);
console.log(`Missing local assets: ${broken.length}`);
console.log(`Production URLs retained for rewrite/reference: ${productionLinks.length}`);
if (broken.length) {
  for (const item of broken.slice(0, 20)) console.log(`MISSING ${item.url} in ${item.file}`);
  process.exitCode = 1;
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
