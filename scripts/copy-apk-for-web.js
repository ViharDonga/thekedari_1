/**
 * Copy built APK into web assets before static deploy (if backend/apk exists).
 */
const fs = require('fs');
const path = require('path');

const apkSrc = path.join(__dirname, '..', 'backend', 'apk', 'thekedari.apk');
const apkAndroid = path.join(
  __dirname,
  '..',
  'android',
  'app',
  'build',
  'outputs',
  'apk',
  'debug',
  'app-debug.apk',
);
const apkDest = path.join(__dirname, '..', 'src', 'assets', 'thekedari.apk');

let source = null;
if (fs.existsSync(apkSrc)) {
  source = apkSrc;
} else if (fs.existsSync(apkAndroid)) {
  source = apkAndroid;
  fs.mkdirSync(path.dirname(apkSrc), { recursive: true });
  fs.copyFileSync(apkAndroid, apkSrc);
  console.log('copy-apk-for-web: synced android debug APK → backend/apk/');
} else if (fs.existsSync(apkDest)) {
  console.log('copy-apk-for-web: using existing src/assets/thekedari.apk');
} else {
  console.warn('copy-apk-for-web: no APK found. Run npm run build:apk first.');
}

if (source) {
  fs.mkdirSync(path.dirname(apkDest), { recursive: true });
  fs.copyFileSync(source, apkDest);
  console.log('copy-apk-for-web: copied APK → src/assets/thekedari.apk');
  require('./generate-version');
  console.log('copy-apk-for-web: refreshed version.json');
}
