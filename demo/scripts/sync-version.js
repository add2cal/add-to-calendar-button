import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const demoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const rootPackage = JSON.parse(fs.readFileSync(path.join(demoRoot, '..', 'package.json'), 'utf8'));
const versionPath = path.join(demoRoot, 'src', 'components', 'layout', 'version.ts');

if (typeof rootPackage.version !== 'string' || !/^[0-9A-Za-z.+-]+$/.test(rootPackage.version)) {
  throw new Error('repository package version is missing or invalid');
}

const source = `export const repositoryVersion = '${rootPackage.version}';\n`;
if (!fs.existsSync(versionPath) || fs.readFileSync(versionPath, 'utf8') !== source) {
  fs.writeFileSync(versionPath, source);
}

console.log(`demo version synced to ${rootPackage.version}`);
