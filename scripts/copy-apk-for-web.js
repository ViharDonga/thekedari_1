/**
 * Copy built APK into web assets before static deploy (if backend/apk exists).
 */
const fs = require('fs');
const path = require('path');

const apkSrc = path.join(__dirname, '..', 'backend', 'apk', 'thekedari.apk');
const apkDest = path.join(__dirname, '..', 'src', 'assets', 'thekedari.apk');

if (fs.existsSync(apkSrc)) {
  fs.mkdirSync(path.dirname(apkDest), { recursive: true });
  fs.copyFileSync(apkSrc, apkDest);
  console.log('copy-apk-for-web: copied backend/apk/thekedari.apk → src/assets/');
} else if (fs.existsSync(apkDest)) {
  console.log('copy-apk-for-web: using existing src/assets/thekedari.apk');
} else {
  console.warn(
    'copy-apk-for-web: no APK found. Run npm run build:apk and commit backend/apk/thekedari.apk',
  );
}
