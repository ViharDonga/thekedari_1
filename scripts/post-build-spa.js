/**
 * SPA fallback for static hosts: serve index.html for unknown paths where supported.
 */
const fs = require('fs');
const path = require('path');

const www = path.join(__dirname, '..', 'www');
const indexPath = path.join(www, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.warn('post-build-spa: www/index.html not found, skipping');
  process.exit(0);
}

fs.copyFileSync(indexPath, path.join(www, '404.html'));

// Netlify / some static hosts
fs.writeFileSync(path.join(www, '_redirects'), '/*    /index.html   200\n');

// Hint file for manual Render static sites (not applied automatically by Render)
const hintSrc = path.join(__dirname, 'render-spa-rewrite.txt');
if (fs.existsSync(hintSrc)) {
  fs.copyFileSync(hintSrc, path.join(www, 'RENDER_SPA_REWRITE.txt'));
}

console.log('post-build-spa: wrote 404.html, _redirects, and SPA fallback files');
