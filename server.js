const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const site = path.join(root, 'site');
const homepage = path.join(root, 'mirror-smoke', 'pages', 'index.html');
const resultPage = path.join(root, 'mirror-full', 'pages', 'students', 'result');
const staticRoots = [
  path.join(root, 'mirror-full', 'static'),
  path.join(root, 'mirror-smoke', 'static')
];
const port = Number(process.env.PORT || 5173);
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.ico': 'image/x-icon'
};

function safePath(base, requestPath) {
  const target = path.resolve(base, '.' + decodeURIComponent(requestPath));
  return target.startsWith(path.resolve(base)) ? target : null;
}

function findFile(requestPath) {
  const siteFile = safePath(site, requestPath);
  if (siteFile && fs.existsSync(siteFile) && fs.statSync(siteFile).isFile()) return siteFile;
  if (requestPath === '/' || requestPath === '/index.html') return homepage;
  if (requestPath === '/students/result' || requestPath === '/students/result/' || requestPath === '/students/result/index.html') return resultPage;
  for (const staticRoot of staticRoots) {
    const file = safePath(staticRoot, requestPath);
    if (file && fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  }
  return null;
}

const server = http.createServer((request, response) => {
  const requestPath = new URL(request.url, `http://${request.headers.host}`).pathname;
  const file = findFile(requestPath);
  if (!file) {
    response.writeHead(302, { Location: '/', 'Cache-Control': 'no-store' });
    response.end();
    return;
  }
  const ext = path.extname(file).toLowerCase();
  const isHtml = ext === '' || ext === '.html';
  response.writeHead(200, {
    'Content-Type': isHtml ? 'text/html; charset=utf-8' : (mimeTypes[ext] || 'application/octet-stream'),
    'Cache-Control': 'public, max-age=86400'
  });
  response.end(fs.readFileSync(file));
});

server.listen(port, () => console.log(`SKU local clone listening at http://localhost:${port}`));
