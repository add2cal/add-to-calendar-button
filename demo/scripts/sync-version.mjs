import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const demoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rootPackage = JSON.parse(fs.readFileSync(path.join(demoRoot, '..', 'package.json'), 'utf8'));
const footerPath = path.join(demoRoot, 'components', 'footer.vue');
const footer = fs.readFileSync(footerPath, 'utf8');
const versionPattern = /(Current Version:\s*)[^<\s]+/;

if (!versionPattern.test(footer)) {
  throw new Error('demo footer version marker not found');
}

const updatedFooter = footer.replace(versionPattern, `$1${rootPackage.version}`);
if (updatedFooter !== footer) {
  fs.writeFileSync(footerPath, updatedFooter);
}

console.log(`demo version synced to ${rootPackage.version}`);
