const fs = require('fs');
const path = require('path');

const webUrl = (process.env.WEB_URL || process.env.FRONTEND_URL || 'https://thekedari-web.onrender.com').replace(/\/$/, '');
const useLive = process.env.CAPACITOR_LIVE !== 'false';

const config = `import type { CapacitorConfig } from '@capacitor/cli';

// Live APK loads your Render website — updates automatically after each deploy.
// Set CAPACITOR_LIVE=false before build to bundle code inside the APK instead.
const config: CapacitorConfig = {
  appId: 'com.thekedari.hub',
  appName: 'Thekedari',
  webDir: 'www',
${useLive ? `  server: {
    url: '${webUrl}',
    cleartext: false,
  },` : ''}
};

export default config;
`;

const out = path.join(__dirname, '..', 'capacitor.config.ts');
fs.writeFileSync(out, config);
console.log(useLive ? `Capacitor live URL: ${webUrl}` : 'Capacitor: bundled mode (no live URL)');
