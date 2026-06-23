/**
 * Bump patch version in package.json and regenerate version files.
 * Usage: npm run version:bump
 *        npm run version:bump -- minor
 *        npm run version:bump -- major
 */
const fs = require('fs');
const path = require('path');

const bump = process.argv[2] || 'patch';
const pkgPath = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const parts = pkg.version.split('.').map((n) => parseInt(n, 10) || 0);

if (bump === 'major') {
  parts[0] += 1;
  parts[1] = 0;
  parts[2] = 0;
} else if (bump === 'minor') {
  parts[1] += 1;
  parts[2] = 0;
} else {
  parts[2] += 1;
}

pkg.version = parts.join('.');
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
require('./generate-version');
require('./generate-env');

console.log(`Bumped to v${pkg.version}`);
