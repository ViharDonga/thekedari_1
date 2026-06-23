const fs = require('fs');
const path = require('path');

const pkg = require('../package.json');
const version = pkg.version;
const parts = version.split('.').map((n) => parseInt(n, 10) || 0);
const versionCode = parts[0] * 10000 + parts[1] * 100 + parts[2];

const webUrl = (process.env.WEB_URL || process.env.FRONTEND_URL || 'https://thekedari-web.onrender.com').replace(/\/$/, '');

const versionJson = {
  version,
  versionCode,
  apkUrl: `${webUrl}/download`,
  releaseNotes: 'Latest features and fixes from Thekedari',
};

const assetsDir = path.join(__dirname, '..', 'src', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

fs.writeFileSync(path.join(assetsDir, 'version.json'), JSON.stringify(versionJson, null, 2));

const gradlePath = path.join(__dirname, '..', 'android', 'app', 'build.gradle');
if (fs.existsSync(gradlePath)) {
  let gradle = fs.readFileSync(gradlePath, 'utf8');
  gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${versionCode}`);
  gradle = gradle.replace(/versionName\s+"[^"]+"/, `versionName "${version}"`);
  fs.writeFileSync(gradlePath, gradle);
}

module.exports = { version, versionCode, webUrl };
