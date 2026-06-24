/**
 * Cross-platform APK build (Windows + Linux/macOS + GitHub Actions).
 * Usage: WEB_URL=https://thekedari-1.onrender.com node scripts/build-apk.js
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const isWin = process.platform === 'win32';
const gradle = isWin ? 'gradlew.bat' : './gradlew';

function run(cmd, opts = {}) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: opts.cwd || root, env: { ...process.env, ...opts.env } });
}

run('node scripts/generate-env.js');
run('node scripts/sync-capacitor-config.js');
run('npx ng build');
run('npx cap sync android');

run(`${gradle} assembleDebug`, { cwd: path.join(root, 'android') });

const debugApk = path.join(
  root,
  'android',
  'app',
  'build',
  'outputs',
  'apk',
  'debug',
  'app-debug.apk',
);
const backendApkDir = path.join(root, 'backend', 'apk');
const backendApk = path.join(backendApkDir, 'thekedari.apk');
const assetsApk = path.join(root, 'src', 'assets', 'thekedari.apk');

if (!fs.existsSync(debugApk)) {
  console.error('build-apk: debug APK not found at', debugApk);
  process.exit(1);
}

fs.mkdirSync(backendApkDir, { recursive: true });
fs.mkdirSync(path.dirname(assetsApk), { recursive: true });
fs.copyFileSync(debugApk, backendApk);
fs.copyFileSync(debugApk, assetsApk);
run('node scripts/generate-version.js');

console.log('build-apk: done → backend/apk/thekedari.apk and src/assets/thekedari.apk');
