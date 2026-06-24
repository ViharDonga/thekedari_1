const fs = require('fs');
const path = require('path');
const { version, versionCode } = require('./generate-version');

// API_URL must point at thekedari-api. Do NOT fall back to RENDER_EXTERNAL_URL — on static
// sites that is the web URL (e.g. thekedari-1.onrender.com), which breaks login.
let base = process.env.API_URL || 'https://thekedari-api.onrender.com';
base = base.replace(/\/$/, '');
const apiUrl = base.endsWith('/api') ? base : `${base}/api`;

const { resolveWebUrl } = require('./web-url');
const webUrl = resolveWebUrl();

const content = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
  webUrl: '${webUrl}',
  appVersion: '${version}',
  versionCode: ${versionCode},
};
`;

const out = path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');
fs.writeFileSync(out, content);
console.log('environment.prod.ts -> apiUrl:', apiUrl, 'version:', version);
