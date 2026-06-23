const fs = require('fs');
const path = require('path');

let base =
  process.env.API_URL ||
  process.env.RENDER_EXTERNAL_URL ||
  'https://thekedari-api.onrender.com';
base = base.replace(/\/$/, '');
const apiUrl = base.endsWith('/api') ? base : `${base}/api`;

const content = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}',
};
`;

const out = path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');
fs.writeFileSync(out, content);
console.log('environment.prod.ts -> apiUrl:', apiUrl);
