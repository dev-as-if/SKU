const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const vm = require('vm');

const root = path.join(__dirname, '..');
const port = 5179;
const blockedHost = /skuindia\.ac\.in|googleapis\.com|gstatic\.com|cdnjs\.cloudflare\.com|unpkg\.com|stackpath\.bootstrapcdn\.com|googletagmanager\.com|google-analytics\.com|analytics\.ahrefs\.com|fonts\.google/i;
function get(pathname) {
  return new Promise((resolve, reject) => {
    const requestPath = new URL(pathname, `http://127.0.0.1:${port}`).pathname;
    http.get({ hostname: '127.0.0.1', port, path: requestPath }, response => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve({ status: response.statusCode, type: response.headers['content-type'] || '', location: response.headers.location || '', body: Buffer.concat(chunks) }));
    }).on('error', reject);
  });
}

function extractLoadUrls(html) {
  const urls = [];
  for (const match of html.matchAll(/<(?:link|script|img|source|video|audio|iframe)\b[^>]*>/gi)) {
    const tag = match[0];
    if (/rel=["']canonical["']/i.test(tag) || /property=["']og:/i.test(tag)) continue;
    for (const attr of tag.matchAll(/\b(?:href|src|srcset|poster)\s*=\s*["']([^"']+)["']/gi)) {
      if (!attr[1].includes('${')) urls.push({ kind: 'load', url: attr[1], tag: tag.slice(0, 80) });
    }
  }
  for (const match of html.matchAll(/url\((['"]?)([^'")]+)\1\)/gi)) {
    if (!match[2].includes('${')) urls.push({ kind: 'css', url: match[2], tag: 'style url()' });
  }
  return urls;
}

function verifyResultForm(html, problems) {
  const script = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .find(match => !/\bsrc\s*=/i.test(match[1]) && match[2].includes("getElementById('result-form')"));
  if (!script) {
    problems.push('result page is missing its form handler');
    return;
  }

  let submitHandler;
  const classes = new Set();
  const elements = {
    'result-form': { addEventListener: (event, handler) => { if (event === 'submit') submitHandler = handler; } },
    enrollment: { value: 'SKU244238923' },
    dob: { value: '2002-02-15' },
    semester: { value: '1' },
    message: { textContent: '' },
    'result-output': { innerHTML: '', classList: { add: value => classes.add(value), remove: value => classes.delete(value) } }
  };
  vm.runInNewContext(script[2], { document: { getElementById: id => elements[id] } });
  if (!submitHandler) {
    problems.push('result form submit handler was not registered');
    return;
  }

  const submit = () => submitHandler({ preventDefault() {} });
  submit();
  if (!classes.has('visible') || !elements['result-output'].innerHTML.includes('Childhood &amp; Growing Up') || elements['result-output'].innerHTML.includes('Download Result PDF')) {
    problems.push('semester 1 did not render its static result without a PDF download');
  }
  elements.semester.value = '2';
  submit();
  if (!elements['result-output'].innerHTML.includes('Learning &amp; Teaching') || elements['result-output'].innerHTML.includes('Download Result PDF')) {
    problems.push('semester 2 did not render its static result without a PDF download');
  }
  elements.semester.value = '3';
  submit();
  if (!elements['result-output'].innerHTML.includes('School Internship') || elements['result-output'].innerHTML.includes('Download Result PDF')) {
    problems.push('semester 3 did not render its static result without a PDF download');
  }
  elements.semester.value = '4';
  submit();
  if (classes.has('visible') || elements.message.textContent !== 'No result found for this enrollment number and semester.') {
    problems.push('new enrollment incorrectly returned a semester 4 result');
  }
  elements.enrollment.value = 'SKU266920325';
  for (const semester of ['1', '2', '3']) {
    elements.semester.value = semester;
    submit();
    if (classes.has('visible') || elements.message.textContent !== 'No result found for this enrollment number and semester.') {
      problems.push(`old enrollment incorrectly returned a semester ${semester} result`);
    }
  }
  elements.semester.value = '4';
  submit();
  if (!classes.has('visible') || !elements['result-output'].innerHTML.includes('Gender, School &amp; Equality') || !elements['result-output'].innerHTML.includes('Download Result PDF')) {
    problems.push('old enrollment did not render its semester 4 result and PDF download');
  }
  if (!elements['result-output'].innerHTML.includes('Biru Kumar Thakur') || !elements['result-output'].innerHTML.includes('Krishna Narayan Thakur') || !elements['result-output'].innerHTML.includes('15-02-2002')) {
    problems.push('result did not retain the shared student name, father name and date of birth');
  }
  elements.enrollment.value = 'INVALID';
  submit();
  if (classes.has('visible') || !elements.message.textContent) problems.push('invalid credentials were not rejected');

  if (!html.includes("totals: ['TOTAL', '75', '48', '425', '273', '500', '321']")) {
    problems.push('semester 3 external maximum total should be 75');
  }
  if (!html.includes("['EPC 2', 'Drama & Art in Education', '', '', '50', '38', '50', '']")) {
    problems.push('semester 2 EPC 2 marks changed unexpectedly');
  }
}

function verifyGrievanceForm(html, problems) {
  const script = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .find(match => !/\bsrc\s*=/.test(match[1]) && match[2].includes("getElementById('grievance-form')"));
  if (!script) {
    problems.push('grievance page is missing its form handler');
    return;
  }

  let submitHandler;
  let alertMessage = '';
  let resetCalled = false;
  const form = { addEventListener: (event, handler) => { if (event === 'submit') submitHandler = handler; }, reset: () => { resetCalled = true; } };
  vm.runInNewContext(script[2], {
    document: { getElementById: id => id === 'grievance-form' ? form : undefined },
    alert: message => { alertMessage = message; }
  });
  if (!submitHandler) {
    problems.push('grievance form submit handler was not registered');
    return;
  }
  submitHandler.call(form, { preventDefault() {} });
  if (alertMessage !== 'Your issue was submitted successfully. Sorry for the inconvenience.' || !resetCalled) {
    problems.push('grievance form did not show its success popup and reset');
  }
  for (const category of ['Result issue', 'Website not working', 'Server issue', 'General issue']) {
    if (!html.includes(category)) problems.push(`grievance category missing: ${category}`);
  }
  if (!/name="message"/.test(html) || !/name="email"[^>]*type="email"/.test(html)) {
    problems.push('grievance form is missing its message or email field');
  }
}

(async () => {
  const child = spawn(process.execPath, ['server.js'], { cwd: root, env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('server start timeout')), 8000);
    child.stdout.on('data', chunk => {
      if (String(chunk).includes('listening')) { clearTimeout(timer); resolve(); }
    });
    child.on('error', reject);
  });

  const problems = [];
  try {
    for (const page of ['/', '/students/result/', '/grievance/']) {
      const response = await get(page);
      if (response.status !== 200) problems.push(`${page} status ${response.status}`);
      const html = response.body.toString('utf8');
      if (blockedHost.test(html) && /<(?:script|link|img)\b[^>]*(skuindia\.ac\.in|googleapis|gstatic|cdnjs|unpkg|stackpath|googletagmanager|ahrefs)/i.test(html)) {
        problems.push(`${page} still loads a blocked third-party resource`);
      }
      const pending = extractLoadUrls(html).map(item => ({ url: item.url, base: page }));
      const checkedAssets = new Set();
      while (pending.length) {
        const item = pending.shift();
        const raw = item.url.split(',')[0].trim().split(/[?#]/)[0];
        if (!raw || raw.startsWith('data:') || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.includes('${')) continue;
        if (/^https?:/i.test(raw) || raw.startsWith('//')) {
          problems.push(`${page} load URL is remote: ${raw}`);
          continue;
        }
        const resolved = new URL(raw, `http://127.0.0.1:${port}${item.base}`);
        const assetPath = decodeURIComponent(resolved.pathname);
        if (/\.(html?)$/i.test(assetPath) || !path.extname(assetPath) || checkedAssets.has(assetPath)) continue;
        checkedAssets.add(assetPath);
        const asset = await get(resolved.pathname);
        if (asset.status !== 200) {
          problems.push(`${page} missing ${assetPath} (${asset.status})`);
          continue;
        }
        if (/\.(png|jpe?g|gif|webp|svg|css|js|woff2?|ttf|eot|pdf)$/i.test(assetPath) && /text\/html/i.test(asset.type) && asset.body.length > 2000) {
          problems.push(`${page} ${assetPath} returned HTML instead of the asset`);
        }
        if (/\.css$/i.test(assetPath)) {
          const css = asset.body.toString('utf8').replace(/\/\*[\s\S]*?\*\//g, '');
          for (const match of css.matchAll(/@import\s+(?:url\()?\s*["']?([^'"\s;)]+)/gi)) {
            pending.push({ url: match[1], base: resolved.pathname });
          }
          for (const match of css.matchAll(/url\(\s*["']?([^'"\s)]+)["']?\s*\)/gi)) {
            if (/^https?:/i.test(match[1]) || match[1].startsWith('//')) {
              pending.push({ url: match[1], base: resolved.pathname });
            }
          }
        }
      }
    }

    const result = await get('/students/result/');
    const resultHtml = result.body.toString('utf8');
    if (!/SKU266920325/.test(resultHtml)) problems.push('result page is missing the sample enrollment markup');
    verifyResultForm(resultHtml, problems);
    const grievance = await get('/grievance/');
    verifyGrievanceForm(grievance.body.toString('utf8'), problems);
    const pdf = await get('/results/SKU266920325-result.pdf');
    if (pdf.status !== 200 || !/pdf/i.test(pdf.type)) problems.push('result PDF is not being served');
    const missing = await get('/this-path-should-404');
    if (missing.status !== 302 || missing.location !== '/') problems.push(`unknown routes must redirect to /, got ${missing.status} ${missing.location}`);
    const static404 = fs.readFileSync(path.join(root, 'site', '404.html'), 'utf8');
    if (!static404.includes("window.location.replace('/')") || !fs.readFileSync(path.join(root, 'site', '_redirects'), 'utf8').includes('/* / 302')) {
      problems.push('static hosting fallback does not redirect unknown routes to /');
    }
  } finally {
    child.kill();
  }

  if (problems.length) {
    console.error(problems.join('\n'));
    process.exit(1);
  }
  console.log('Offline home and result pages passed: local assets only, all semesters render as expected, and missing routes redirect home.');
})();
