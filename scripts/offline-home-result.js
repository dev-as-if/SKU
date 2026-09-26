const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');
const execFileAsync = promisify(execFile);

const root = path.join(__dirname, '..');
const homepage = path.join(root, 'mirror-smoke', 'pages', 'index.html');
const resultPage = path.join(root, 'mirror-full', 'pages', 'students', 'result');
const staticRoots = [
  path.join(root, 'mirror-full', 'static'),
  path.join(root, 'mirror-smoke', 'static')
];
const origin = 'https://www.skuindia.ac.in';
const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const extraLocalAssets = [
  '/Content/images/footer.jpg',
  '/Content/images/sku_logo.png',
  '/Content/web/university/sku-logo-header.png',
  '/Content/web/university/infra/sku-infra-1.webp',
  '/Content/web/university/infra/sku-infra-2.webp',
  '/Content/web/university/infra/sku-infra-3.webp',
  '/Content/web/university/infra/sku-infra-4.webp',
  '/Content/web/university/infra/sku-infra-5.webp',
  '/Content/web/university/highlights/sku-ariel-view.jpg',
  '/Content/web/university/courses/education.jpg',
  '/Content/web/university/courses/paramedical%20science.jpg',
  '/Content/web/university/courses/faculty-commerce.jpg',
  '/Content/web/university/courses/mass-communication.jpg',
  '/Content/web/university/courses/management.jpg',
  '/Content/web/university/courses/engineering.jpg',
  '/Content/web/university/courses/faculty-socialscience.jpg',
  '/Content/web/university/courses/law.jpg',
  '/Content/web/university/courses/pharmacy.jpg',
  '/Content/web/banner/shri-krishna-university-2026-admission-enquiry-now.webp',
  '/Content/web/icon/message.png',
  '/Content/web/icon/download.png',
  '/Content/web/icon/link.png',
  '/Content/web/icon/sku-ayurvedic-hospital-logo.png',
  '/content/web/university/shri-krishna-universityconvocation-2024.jpg',
  '/Content/upload/web-news/qHWAzx7UnU82TehtWTNdKM-1024-80.jpg'
];
const vendorFiles = [
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css', dest: 'vendor/font-awesome/css/font-awesome.min.css' },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.eot', dest: 'vendor/font-awesome/fonts/fontawesome-webfont.eot' },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2', dest: 'vendor/font-awesome/fonts/fontawesome-webfont.woff2' },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff', dest: 'vendor/font-awesome/fonts/fontawesome-webfont.woff' },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.ttf', dest: 'vendor/font-awesome/fonts/fontawesome-webfont.ttf' },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.svg', dest: 'vendor/font-awesome/fonts/fontawesome-webfont.svg' },
  { url: 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css', dest: 'vendor/boxicons/css/boxicons.min.css' },
  { url: 'https://unpkg.com/boxicons@2.1.4/fonts/boxicons.woff2', dest: 'vendor/boxicons/fonts/boxicons.woff2' },
  { url: 'https://unpkg.com/boxicons@2.1.4/fonts/boxicons.woff', dest: 'vendor/boxicons/fonts/boxicons.woff' },
  { url: 'https://unpkg.com/boxicons@2.1.4/fonts/boxicons.ttf', dest: 'vendor/boxicons/fonts/boxicons.ttf' },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css', dest: 'vendor/owl/owl.carousel.min.css' },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css', dest: 'vendor/owl/owl.theme.default.min.css' },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js', dest: 'vendor/owl/owl.carousel.min.js' },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css', dest: 'vendor/animate.min.css' },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css', dest: 'vendor/slick/slick.min.css' },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css', dest: 'vendor/slick/slick-theme.min.css' },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.js', dest: 'vendor/slick/slick.min.js' },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/ajax-loader.gif', dest: 'vendor/slick/ajax-loader.gif' },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/fonts/slick.woff', dest: 'vendor/slick/fonts/slick.woff' },
  { url: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/fonts/slick.ttf', dest: 'vendor/slick/fonts/slick.ttf' }
];
const googleFontCss = [
  { url: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap', dest: 'vendor/fonts/inter.css' },
  { url: 'https://fonts.googleapis.com/css?family=Playfair+Display:700,800&display=swap', dest: 'vendor/fonts/playfair.css' },
  { url: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap', dest: 'vendor/fonts/roboto.css' }
];
const failures = [];

async function curlTo(url, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return dest;
  try {
    await execFileAsync('curl.exe', ['-L', '--fail', '--silent', '--show-error', '--max-time', '20', '--connect-timeout', '8', '-A', ua, '-o', dest, url], { windowsHide: true });
    if (!fs.existsSync(dest) || fs.statSync(dest).size === 0) throw new Error('empty download');
    return dest;
  } catch (error) {
    failures.push({ url, dest, error: String(error.stderr || error.message).split('\n')[0] });
    try { fs.unlinkSync(dest); } catch {}
    return null;
  }
}

async function curlText(url) {
  const tmp = path.join(root, `.tmp-${Date.now()}-${Math.random().toString(16).slice(2)}.txt`);
  const dest = await curlTo(url, tmp);
  if (!dest) throw new Error(`download failed ${url}`);
  const text = fs.readFileSync(dest, 'utf8');
  try { fs.unlinkSync(tmp); } catch {}
  return text;
}

async function pool(items, limit, worker) {
  let index = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const current = items[index++];
      await worker(current, index, items.length);
    }
  }));
}

function skuToLocal(url) {
  try {
    const parsed = new URL(url, origin);
    if (!/skuindia\.ac\.in$/i.test(parsed.hostname)) return null;
    let pathname = decodeURIComponent(parsed.pathname);
    if (!pathname.startsWith('/')) pathname = '/' + pathname;
    return pathname;
  } catch {
    return null;
  }
}

function extractCssUrls(css, cssPath) {
  const urls = [];
  for (const match of css.matchAll(/url\((['"]?)([^'")]+)\1\)/gi)) {
    let value = match[2].trim();
    if (!value || value.startsWith('data:') || value.startsWith('#')) continue;
    if (/^https?:\/\//i.test(value)) {
      const local = skuToLocal(value);
      if (local) urls.push(local);
      continue;
    }
    if (value.startsWith('/')) urls.push(value.split(/[?#]/)[0]);
    else urls.push(path.posix.normalize(path.posix.join(path.posix.dirname('/' + cssPath.replaceAll('\\', '/')), value.split(/[?#]/)[0])));
  }
  return urls;
}

function extractHtmlAssets(html) {
  const urls = new Set(extraLocalAssets);
  for (const match of html.matchAll(/(?:href|src|srcset|data-src|data-srcset|poster)\s*=\s*["']([^"']+)["']/gi)) {
    for (const part of match[1].split(',')) {
      const raw = part.replace(/\s+\d+(?:\.\d+)?[wx]$/i, '').trim();
      if (!raw || raw.startsWith('data:') || raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.startsWith('javascript:')) continue;
      const local = /^https?:\/\//i.test(raw) ? skuToLocal(raw) : (raw.startsWith('/') ? raw.split(/[?#]/)[0] : null);
      if (local && /\.(css|js|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|eot|pdf)$/i.test(local)) urls.add(local);
    }
  }
  for (const match of html.matchAll(/url\((['"]?)([^'")]+)\1\)/gi)) {
    const value = match[2].trim();
    const local = /^https?:\/\//i.test(value) ? skuToLocal(value) : (value.startsWith('/') ? value.split(/[?#]/)[0] : null);
    if (local && !value.startsWith('data:')) urls.add(local);
  }
  return [...urls];
}

function localizeCssText(css) {
  return css
    .replaceAll('https://www.skuindia.ac.in/Content/Assets/css/html', 'html')
    .replaceAll('https://www.skuindia.ac.in', '')
    .replaceAll('http://www.skuindia.ac.in', '')
    .replaceAll('https://skuindia.ac.in', '')
    .replaceAll('http://skuindia.ac.in', '')
    .replace(/@import url\(['"]https:\/\/fonts\.googleapis\.com\/css\?family=Roboto:[^'"]+['"]\);?/i, '@import url("/vendor/fonts/roboto.css");');
}

function rewriteHomepage(html) {
  let next = html
    .replace(/\s*<script src="https:\/\/analytics\.ahrefs\.com\/analytics\.js"[^>]*><\/script>\s*/i, '\n')
    .replace(/\s*<!-- Global site tag[\s\S]*?<\/script>\s*/i, '\n')
    .replace('href="https://www.skuindia.ac.in/"', 'href="/"')
    .replace('content="https://www.skuindia.ac.in/"', 'content="/"')
    .replace('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap', '/vendor/fonts/inter.css')
    .replace('https://fonts.googleapis.com/css?family=Playfair+Display:700,800&display=swap', '/vendor/fonts/playfair.css')
    .replace('https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', '/vendor/font-awesome/css/font-awesome.min.css')
    .replace('https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css', '/vendor/boxicons/css/boxicons.min.css')
    .replace('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css', '/vendor/owl/owl.carousel.min.css')
    .replace('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css', '/vendor/owl/owl.theme.default.min.css')
    .replace('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css', '/vendor/animate.min.css')
    .replace('https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js', '/vendor/owl/owl.carousel.min.js')
    .replace('https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.js', '/vendor/slick/slick.min.js')
    .replaceAll('https://www.skuindia.ac.in', '')
    .replaceAll('http://www.skuindia.ac.in', '')
    .replaceAll('https://skuindia.ac.in', '')
    .replaceAll('http://skuindia.ac.in', '');

  next = next.replace(/href="(\/content\/upload\/[^"]+\.pdf|\/Content\/web\/prospectus\/[^"]+\.pdf|\/content\/upload\/disclosure\/[^"]+\.pdf|\/admin\/News\/DownLoadFile\/[^"]+)"/gi, (full, pathname) => {
    const localPath = decodeURIComponent(pathname);
    const exists = staticRoots.some(dir => fs.existsSync(path.join(dir, localPath.replace(/^\//, ''))));
    return exists ? `href="${pathname}"` : 'href="#"';
  });
  next = next.replace('href="/students/result"', 'href="/students/result/"');
  if (!next.includes('/vendor/slick/slick.min.css')) {
    next = next.replace('/vendor/animate.min.css" />', '/vendor/animate.min.css" />\n<link rel="stylesheet" href="/vendor/slick/slick.min.css">\n<link rel="stylesheet" href="/vendor/slick/slick-theme.min.css">');
  }
  return next;
}

async function localizeGoogleFont(entry) {
  const dest = path.join(staticRoots[0], entry.dest);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  let css = await curlText(entry.url);
  const fontUrls = [...css.matchAll(/url\((['"]?)(https:\/\/fonts\.gstatic\.com\/[^'")]+)\1\)/g)].map(match => match[2]);
  for (const fontUrl of [...new Set(fontUrls)]) {
    const fileName = path.basename(new URL(fontUrl).pathname);
    const fontDest = path.join(staticRoots[0], 'vendor', 'fonts', 'files', fileName);
    await curlTo(fontUrl, fontDest);
    css = css.replaceAll(fontUrl, `/vendor/fonts/files/${fileName}`);
  }
  fs.writeFileSync(dest, css, 'utf8');
}

function copyIfMissing(relative) {
  const decoded = decodeURIComponent(relative.replace(/^\//, ''));
  const fullDest = path.join(staticRoots[0], decoded);
  if (fs.existsSync(fullDest) && fs.statSync(fullDest).size > 0) return;
  const smoke = path.join(staticRoots[1], decoded);
  if (fs.existsSync(smoke)) {
    fs.mkdirSync(path.dirname(fullDest), { recursive: true });
    fs.copyFileSync(smoke, fullDest);
  }
}

(async () => {
  let html = rewriteHomepage(fs.readFileSync(homepage, 'utf8'));
  fs.writeFileSync(homepage, html, 'utf8');
  fs.writeFileSync(resultPage, fs.readFileSync(resultPage, 'utf8').replaceAll('https://www.skuindia.ac.in', '').replaceAll('http://www.skuindia.ac.in', ''), 'utf8');

  const cssFiles = new Set();
  for (const match of html.matchAll(/<link[^>]+href=["']([^"']+\.css)["']/gi)) {
    if (match[1].startsWith('/Content/')) cssFiles.add(decodeURIComponent(match[1].slice(1)));
  }

  for (const relative of cssFiles) {
    for (const staticRoot of staticRoots) {
      const file = path.join(staticRoot, relative);
      if (!fs.existsSync(file)) continue;
      fs.writeFileSync(file, localizeCssText(fs.readFileSync(file, 'utf8')), 'utf8');
    }
  }

  const needed = new Set(extractHtmlAssets(html).concat(extractHtmlAssets(fs.readFileSync(resultPage, 'utf8')), extraLocalAssets));
  for (const relative of cssFiles) {
    const file = path.join(staticRoots[0], relative);
    if (!fs.existsSync(file)) continue;
    for (const url of extractCssUrls(fs.readFileSync(file, 'utf8'), relative)) needed.add(url);
  }

  console.log(`Downloading ${vendorFiles.length} vendor files...`);
  await pool(vendorFiles, 6, async entry => {
    await curlTo(entry.url, path.join(staticRoots[0], entry.dest));
  });
  for (const entry of googleFontCss) {
    try {
      console.log(`Localizing ${entry.dest}`);
      await localizeGoogleFont(entry);
    } catch (error) {
      failures.push({ url: entry.url, dest: entry.dest, error: error.message });
    }
  }

  const pending = [];
  for (const url of needed) {
    const relative = decodeURIComponent(url.replace(/^\//, ''));
    copyIfMissing(relative);
    const dest = path.join(staticRoots[0], relative);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) continue;
    if (!/\.(css|js|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|eot|pdf)$/i.test(url)) continue;
    const encoded = origin + '/' + relative.split('/').map(segment => encodeURIComponent(segment)).join('/');
    pending.push({ encoded, dest, url });
  }
  console.log(`Downloading ${pending.length} origin assets...`);
  await pool(pending, 8, async (item, done, total) => {
    await curlTo(item.encoded, item.dest);
    if (done % 10 === 0 || done === total) console.log(`origin assets ${done}/${total}`);
  });

  fs.writeFileSync(path.join(root, 'offline-localize-report.json'), JSON.stringify({ failures, needed: needed.size }, null, 2));
  console.log(`Offline localize complete. Failures: ${failures.length}. Tracked assets: ${needed.size}.`);
  for (const item of failures.slice(0, 25)) console.log(`FAIL ${item.url} :: ${item.error}`);
})();
