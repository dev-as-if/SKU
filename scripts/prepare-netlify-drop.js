const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const publish = path.join(root, 'netlify-drop');
const mirror = path.join(root, 'mirror-full');
const homepage = path.join(root, 'mirror-smoke', 'pages', 'index.html');
const maxOptionalPdfBytes = 1024 * 1024;

fs.rmSync(publish, { recursive: true, force: true });
fs.mkdirSync(publish, { recursive: true });
copyHtml(homepage, path.join(publish, 'index.html'));
copyDirectory(path.join(mirror, 'pages'), publish, () => true);
copyDirectory(path.join(mirror, 'static'), publish, source => {
  const relative = path.relative(path.join(mirror, 'static'), source);
  if (path.extname(source).toLowerCase() !== '.pdf') return true;
  return relative.replaceAll('\\', '/') === 'results/SKU266920325-result.pdf' || fs.statSync(source).size <= maxOptionalPdfBytes;
});
fs.writeFileSync(path.join(publish, '_redirects'), '/* /index.html 200\n');
console.log(`Prepared ${publish}`);

function copyDirectory(source, destination, shouldCopy) {
  if (!fs.existsSync(source)) return;
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);
    if (sourcePath === path.join(mirror, 'pages', 'index.html')) continue;
    if (entry.isDirectory()) copyDirectory(sourcePath, destinationPath, shouldCopy);
    else if (shouldCopy(sourcePath)) {
      if (isHtmlRoute(sourcePath)) copyHtml(sourcePath, path.extname(sourcePath) ? destinationPath : path.join(destinationPath, 'index.html'));
      else copyFile(sourcePath, destinationPath);
    }
  }
}

function isHtmlRoute(file) {
  return path.extname(file).toLowerCase() === '.html' || path.extname(file) === '';
}

function copyHtml(source, destination) {
  const html = localize(fs.readFileSync(source, 'utf8'));
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, html, 'utf8');
}

function localize(html) {
  const localized = html.replaceAll('https://www.skuindia.ac.in', '').replaceAll('http://skuindia.ac.in', '').replaceAll('https://skuindia.ac.in', '');
  const styles = `<style id="local-clone-overrides">
    .footer { background: #fff url('/Content/images/footer.jpg') center center / cover no-repeat !important; color: #333 !important; }
    .info__box { min-height: 170px !important; height: 170px !important; padding: 20px !important; overflow: hidden; background-size: cover !important; background-position: center !important; }
    .box__highlight__x { background-image: linear-gradient(rgb(82 51 40 / 3%), rgb(33 33 33 / 85%)), url('/Content/web/university/infra/sku-infra-1.webp') !important; }
    .box__virtualtour { background: linear-gradient(rgb(82 51 40 / 3%), rgb(33 33 33 / 85%)), url('/Content/web/university/infra/sku-infra-2.webp') center / cover !important; }
    .box__registration { background-image: linear-gradient(rgb(82 51 40 / 3%), rgb(52 35 29 / 85%)), url('/Content/web/university/infra/sku-infra-3.webp') !important; }
    .box__admission_enquiry { background-image: linear-gradient(rgb(61 135 237 / 35%), rgb(9 100 153 / 88%)), url('/Content/web/university/infra/sku-infra-4.webp') !important; }
    .box__syllabus { background-image: linear-gradient(rgb(82 51 40 / 3%), rgb(52 35 29 / 85%)), url('/Content/web/university/infra/sku-infra-5.webp') !important; }
    .box__exam__timetable { background-image: linear-gradient(#ffffff00, rgb(219 168 14 / 93%)), url('/Content/web/university/infra/sku-infra-1.webp') !important; }
    .box__media__gallery { background-image: linear-gradient(rgb(82 51 40 / 3%), rgb(28 81 30 / 85%)), url('/Content/web/university/infra/sku-infra-2.webp') !important; }
  </style>`;
  return localized.includes('</body>') ? localized.replace('</body>', `${styles}</body>`) : `${localized}${styles}`;
}

function copyFile(source, destination) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}
