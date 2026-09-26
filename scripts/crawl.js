const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { execFile } = require('child_process');

const source = new URL(process.env.SOURCE || 'https://www.skuindia.ac.in/');
const output = path.resolve(process.env.OUTPUT || path.join(__dirname, '..', 'mirror-full'));
const maxPages = Number(process.env.MAX_PAGES || 1000);
const maxBytes = 50 * 1024 * 1024;
const originHosts = new Set(['skuindia.ac.in', 'www.skuindia.ac.in']);
const pages = new Set();
const queuedPages = new Set([canonical(source).href]);
const resources = new Set();
const external = new Set();
const failures = [];
const queue = [canonical(source)];
let active = 0;
let finished = false;

function canonical(url) {
  const result = new URL(url.href);
  if (originHosts.has(result.hostname)) {
    result.protocol = 'https:';
    result.hostname = 'www.skuindia.ac.in';
  }
  result.hash = '';
  result.search = '';
  return result;
}

function localName(url) {
  let name = decodeURIComponent(url.pathname).replace(/^\/+/, '');
  if (!name || name.endsWith('/')) name += 'index.html';
  return name;
}

function sameOrigin(url) { return originHosts.has(url.hostname); }
function pageLike(url) { return !path.extname(url.pathname) || /\.(html?|aspx?|php)$/i.test(url.pathname); }
function ignored(url) { return /^\/admin(?:\/|$)/i.test(url.pathname) || /\/(login|logout)(?:\/|$)/i.test(url.pathname); }

function resolve(value, base) {
  if (!value || /^(data|javascript|mailto|tel|#):/i.test(value)) return null;
  const first = value.split(',')[0].trim().replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
  try { return canonical(new URL(first, base)); } catch { return null; }
}

function discover(value, base, fromPage) {
  const url = resolve(value, base);
  if (!url) return;
  if (!sameOrigin(url)) { external.add(url.href); return; }
  if (ignored(url)) return;
  if (pageLike(url)) {
    if (fromPage && queuedPages.size < maxPages && queuedPages.add(url.href)) queue.push(url);
  } else resources.add(url.href);
}

function extract(text, base, fromPage) {
  const attributes = /(?:href|src|srcset|data-src|data-srcset|poster|content)\s*=\s*["']([^"']+)["']/gi;
  for (const match of text.matchAll(attributes)) {
    for (const value of match[1].split(/\s*,\s*/)) discover(value.replace(/\s+\d+(?:\.\d+)?[wx]$/, ''), base, fromPage);
  }
  const cssUrls = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;
  for (const match of text.matchAll(cssUrls)) discover(match[1], base, false);
}

function requestUrl(url) {
  return new Promise((resolvePromise, reject) => {
    execFile('curl.exe', ['-L', '--fail', '--silent', '--show-error', '--max-time', '8', '--connect-timeout', '5', '-A', 'SKU-local-clone/1.0 (+public mirror)', url.href], { encoding: null, maxBuffer: maxBytes }, (error, stdout) => {
      if (error) return reject(new Error(error.message));
      resolvePromise({ body: stdout, contentType: '' });
    });
  });
}

async function save(url, body) {
  const target = path.join(output, 'static', localName(url));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, body);
}

async function processPage(url) {
  try {
    const result = await requestUrl(url);
    const text = result.body.toString('utf8');
    const target = path.join(output, 'pages', localName(url));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, result.body);
    extract(text, url, true);
    pages.add(url.href);
    console.log(`page ${pages.size}: ${url.pathname}`);
  } catch (error) { failures.push({ url: url.href, error: error.message }); }
}

async function processResource(url) {
  try { const result = await requestUrl(url); await save(url, result.body); extract(result.body.toString('utf8'), url, false); }
  catch (error) { failures.push({ url: url.href, error: error.message }); }
}

async function run() {
  fs.mkdirSync(path.join(output, 'pages'), { recursive: true });
  fs.mkdirSync(path.join(output, 'static'), { recursive: true });
  while (queue.length) {
    const batch = queue.splice(0, 8);
    await Promise.all(batch.map(url => pages.has(url.href) ? null : processPage(url)));
  }
  const downloaded = new Set();
  while (true) {
    const pending = [...resources].filter(url => !downloaded.has(url));
    if (!pending.length) break;
    pending.forEach(url => downloaded.add(url));
    for (let index = 0; index < pending.length; index += 16) {
      await Promise.all(pending.slice(index, index + 16).map(url => processResource(new URL(url))));
      console.log(`assets: ${downloaded.size}/${resources.size}`);
    }
  }
  const files = fs.existsSync(path.join(output, 'static')) ? walk(path.join(output, 'static')) : [];
  const byExtension = ext => files.filter(file => path.extname(file).toLowerCase() === ext).length;
  const manifest = { source: source.href, crawledAt: new Date().toISOString(), pagesDiscovered: queuedPages.size, pagesCloned: pages.size, assetsDownloaded: files.length, imagesDownloaded: ['.png','.jpg','.jpeg','.gif','.webp','.svg'].reduce((n, ext) => n + byExtension(ext), 0), documentsDownloaded: ['.pdf','.doc','.docx','.xls','.xlsx'].reduce((n, ext) => n + byExtension(ext), 0), videosDownloaded: ['.mp4','.webm','.ogg'].reduce((n, ext) => n + byExtension(ext), 0), externalLinks: [...external].sort(), failedResources: failures, skippedRestrictedResources: ['/admin/*', 'login/logout routes'] };
  fs.writeFileSync(path.join(output, '..', 'clone-manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`complete: ${pages.size} pages, ${files.length} assets, ${failures.length} failures`);
}

function walk(directory) { return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => { const file = path.join(directory, entry.name); return entry.isDirectory() ? walk(file) : [file]; }); }
run().catch(error => { console.error(error); process.exitCode = 1; });
