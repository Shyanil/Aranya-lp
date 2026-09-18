const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const esbuild = require('esbuild');

function assetVersion(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex').slice(0, 12);
}

async function build() {
  console.log('🚀 Starting Aranya SSR & Client Build...');

  const distDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // 1. Build Main Client Bundle (for browser hydration)
  console.log('📦 Bundling main client hydration script...');
  await esbuild.build({
    entryPoints: [path.join(__dirname, 'src', 'entry-client.jsx')],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: ['es2020'],
    format: 'iife',
    outfile: path.join(distDir, 'client.js'),
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  });
  console.log('✅ Client bundle built: dist/client.js');

  // 2. Build Main Server SSR Renderer (for Node.js SSR)
  console.log('⚙️  Bundling main server SSR module...');
  await esbuild.build({
    entryPoints: [path.join(__dirname, 'src', 'entry-server.jsx')],
    bundle: true,
    platform: 'node',
    target: 'node20',
    format: 'cjs',
    outfile: path.join(distDir, 'entry-server.cjs'),
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  });
  console.log('✅ Server SSR module built: dist/entry-server.cjs');

  // 3. Pre-render Main index.html
  console.log('🌐 Pre-rendering static HTML with SSR markup...');
  const { render: renderMain } = require(path.join(distDir, 'entry-server.cjs'));
  const renderedAppHtml = renderMain();

  const templatePath = path.join(__dirname, 'index.template.html');
  const mainTemplate = fs.readFileSync(templatePath, 'utf8');

  const finalMainHtml = mainTemplate
    .replace('<div id="root"></div>', `<div id="root">${renderedAppHtml}</div>`)
    .replace('<!-- APP_SCRIPTS -->', `<script src="/dist/client.js?v=${assetVersion(path.join(distDir, 'client.js'))}" defer></script>`);

  fs.writeFileSync(path.join(__dirname, 'index.html'), finalMainHtml, 'utf8');
  console.log('✅ Pre-rendered index.html generated with full SSR content!');

  // 4. Build Coming-Soon Client Bundle
  console.log('📦 Bundling Coming Soon client hydration script...');
  await esbuild.build({
    entryPoints: [path.join(__dirname, 'src', 'entry-coming-soon-client.jsx')],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: ['es2020'],
    format: 'iife',
    outfile: path.join(distDir, 'coming-soon-client.js'),
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  });
  console.log('✅ Coming Soon client bundle built: dist/coming-soon-client.js');

  // 5. Build Coming-Soon Server SSR Renderer
  console.log('⚙️  Bundling Coming Soon server SSR module...');
  await esbuild.build({
    entryPoints: [path.join(__dirname, 'src', 'entry-coming-soon-server.jsx')],
    bundle: true,
    platform: 'node',
    target: 'node20',
    format: 'cjs',
    outfile: path.join(distDir, 'coming-soon-server.cjs'),
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  });
  console.log('✅ Coming Soon server SSR module built: dist/coming-soon-server.cjs');

  // 6. Pre-render coming-soon.html
  console.log('🌐 Pre-rendering static coming-soon.html with SSR markup...');
  const { render: renderComingSoon } = require(path.join(distDir, 'coming-soon-server.cjs'));
  const renderedComingSoonHtml = renderComingSoon();

  const csTemplatePath = path.join(__dirname, 'coming-soon.template.html');
  const csTemplate = fs.readFileSync(csTemplatePath, 'utf8');

  const finalCsHtml = csTemplate
    .replace('<div id="root"></div>', `<div id="root">${renderedComingSoonHtml}</div>`)
    .replace('<!-- APP_SCRIPTS -->', `<script src="/dist/coming-soon-client.js?v=${assetVersion(path.join(distDir, 'coming-soon-client.js'))}" defer></script>`);

  fs.writeFileSync(path.join(__dirname, 'coming-soon.html'), finalCsHtml, 'utf8');
  console.log('✅ Pre-rendered coming-soon.html generated with full SSR content!');

  console.log('🎉 Full build completed successfully.');
}

if (require.main === module) {
  build().catch((err) => {
    console.error('❌ Build failed:', err);
    process.exit(1);
  });
}

module.exports = { build };
