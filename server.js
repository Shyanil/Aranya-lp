const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
if (fs.existsSync(path.join(PUBLIC_DIR, '.env'))) process.loadEnvFile(path.join(PUBLIC_DIR, '.env'));
const { handleLead } = require('./lib/leads.cjs');

const MAIN_TEMPLATE_PATH = path.join(PUBLIC_DIR, 'index.template.html');
const MAIN_SSR_PATH = path.join(PUBLIC_DIR, 'dist', 'entry-server.cjs');

const CS_TEMPLATE_PATH = path.join(PUBLIC_DIR, 'coming-soon.template.html');
const CS_SSR_PATH = path.join(PUBLIC_DIR, 'dist', 'coming-soon-server.cjs');

function versionedAsset(publicPath, filePath) {
  try {
    return `${publicPath}?v=${Math.floor(fs.statSync(filePath).mtimeMs)}`;
  } catch (_) {
    return publicPath;
  }
}

// Auto-build if dist doesn't exist
if (!fs.existsSync(MAIN_SSR_PATH) || !fs.existsSync(CS_SSR_PATH)) {
  console.log('⚡ Initializing SSR build for main and coming-soon pages...');
  try {
    require('./build.js').build();
  } catch (e) {
    console.error('Build warning:', e);
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.jsx': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

// Main SSR HTML renderer
function renderMainSSR() {
  try {
    if (!fs.existsSync(MAIN_SSR_PATH)) return null;
    delete require.cache[require.resolve(MAIN_SSR_PATH)];
    const { render } = require(MAIN_SSR_PATH);
    const appHtml = render();

    const template = fs.existsSync(MAIN_TEMPLATE_PATH)
      ? fs.readFileSync(MAIN_TEMPLATE_PATH, 'utf8')
      : fs.readFileSync(path.join(PUBLIC_DIR, 'index.html'), 'utf8');

    return template
      .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
      .replace('<!-- APP_SCRIPTS -->', `<script src="${versionedAsset('/dist/client.js', path.join(PUBLIC_DIR, 'dist', 'client.js'))}" defer></script>`);
  } catch (err) {
    console.error('Main SSR render error:', err);
    return null;
  }
}

// Coming Soon SSR HTML renderer
function renderComingSoonSSR() {
  try {
    if (!fs.existsSync(CS_SSR_PATH)) return null;
    delete require.cache[require.resolve(CS_SSR_PATH)];
    const { render } = require(CS_SSR_PATH);
    const appHtml = render();

    const template = fs.existsSync(CS_TEMPLATE_PATH)
      ? fs.readFileSync(CS_TEMPLATE_PATH, 'utf8')
      : fs.readFileSync(path.join(PUBLIC_DIR, 'coming-soon.html'), 'utf8');

    return template
      .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
      .replace('<!-- APP_SCRIPTS -->', `<script src="${versionedAsset('/dist/coming-soon-client.js', path.join(PUBLIC_DIR, 'dist', 'coming-soon-client.js'))}" defer></script>`);
  } catch (err) {
    console.error('Coming Soon SSR render error:', err);
    return null;
  }
}

function sendHtml(res, req, htmlContent) {
  const acceptEncoding = req.headers['accept-encoding'] || '';
  const headers = {
    'Content-Type': 'text/html; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'X-Render-Mode': 'SSR',
    'Cache-Control': 'no-cache, no-transform',
  };

  if (acceptEncoding.includes('gzip')) {
    headers['Content-Encoding'] = 'gzip';
    res.writeHead(200, headers);
    const gzip = zlib.createGzip();
    gzip.pipe(res);
    gzip.end(htmlContent);
  } else {
    res.writeHead(200, headers);
    res.end(htmlContent);
  }
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, 'http://localhost:' + PORT);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  if (pathname === '/api/leads') {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 16384) {
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Submission too large' }));
        return;
      }
      chunks.push(chunk);
    }
    const result = await handleLead(req.method, Buffer.concat(chunks).toString('utf8'));
    res.writeHead(result.statusCode, result.headers);
    res.end(result.body);
    return;
  }

  if (pathname.replace(/\\/g, '/').split('/').some(segment => segment.startsWith('.'))) {
    res.writeHead(404);
    res.end('404 Not Found');
    return;
  }

  // 1. Coming Soon Route: /coming-soon or /coming-soon.html
  if (pathname === '/coming-soon' || pathname === '/coming-soon.html') {
    const ssrHtml = renderComingSoonSSR();
    const fallbackFile = path.join(PUBLIC_DIR, 'coming-soon.html');
    const htmlToSend = ssrHtml || (fs.existsSync(fallbackFile) ? fs.readFileSync(fallbackFile, 'utf8') : '<h1>Aranya Coming Soon</h1>');
    return sendHtml(res, req, htmlToSend);
  }

  // 2. Thank You Routes: /thank-you, /thank-you.html, /thank-you-coming-soon, /thank-you-coming-soon.html
  if (pathname === '/thank-you' || pathname === '/thank-you.html') {
    const thankYouFile = path.join(PUBLIC_DIR, 'thank-you.html');
    if (fs.existsSync(thankYouFile)) {
      return sendHtml(res, req, fs.readFileSync(thankYouFile, 'utf8'));
    }
  }
  if (pathname === '/thank-you-coming-soon' || pathname === '/thank-you-coming-soon.html') {
    const csThankYouFile = path.join(PUBLIC_DIR, 'thank-you-coming-soon.html');
    if (fs.existsSync(csThankYouFile)) {
      return sendHtml(res, req, fs.readFileSync(csThankYouFile, 'utf8'));
    }
  }

  // 2. Main Page Route: / or /index.html
  if (pathname === '/' || pathname === '' || pathname === '/index.html') {
    const ssrHtml = renderMainSSR();
    const fallbackFile = path.join(PUBLIC_DIR, 'index.html');
    const htmlToSend = ssrHtml || (fs.existsSync(fallbackFile) ? fs.readFileSync(fallbackFile, 'utf8') : '<h1>Aranya</h1>');
    return sendHtml(res, req, htmlToSend);
  }

  // 3. Static Files
  const filePath = path.normalize(path.join(PUBLIC_DIR, pathname));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Cache immutable assets like bundled js or uploads
    const isImmutable = pathname.startsWith('/dist/') || pathname.startsWith('/uploads/');
    const cacheControl = isImmutable ? 'public, max-age=31536000, immutable' : 'no-cache';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': cacheControl,
      'X-Content-Type-Options': 'nosniff',
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`🌿 Aranya Server running at http://localhost:${PORT}/`);
  console.log(`✨ Coming Soon page available at: http://localhost:${PORT}/coming-soon`);
  console.log(`✨ Full Experience page available at: http://localhost:${PORT}/`);
});
