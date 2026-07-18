/**
 * Version bump script (replaces grunt-version).
 * Updates the version string in package.json, src/*.js banners and constants,
 * assets/css/*.css banners, and the demo footer.
 *
 * Usage: node scripts/set-version.mjs [patch|minor|major|x.y.z]  (default: patch)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = process.argv[2] || 'patch';

const pkgPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const current = pkg.version;

function bump(version, kind) {
  const parts = version.split('.').map(Number);
  if (kind === 'major') return `${parts[0] + 1}.0.0`;
  if (kind === 'minor') return `${parts[0]}.${parts[1] + 1}.0`;
  if (kind === 'patch') return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
  if (!/^\d+\.\d+\.\d+$/.test(kind)) throw new Error(`invalid version argument: ${kind}`);
  return kind;
}

const next = bump(current, arg);

function replaceInFile(file, patterns) {
  const content = fs.readFileSync(file, 'utf8');
  let updated = content;
  for (const pattern of patterns) {
    updated = updated.replace(pattern, `$1${next}`);
  }
  if (updated !== content) {
    fs.writeFileSync(file, updated);
    return true;
  }
  return false;
}

// package.json (raw replace to keep formatting)
replaceInFile(pkgPath, [/("version":\s*")\d+\.\d+\.\d+/]);

// src banners (" *  Version: x.y.z") and constants ("const atcbVersion = 'x.y.z'")
for (const file of fs.readdirSync(path.join(root, 'src'))) {
  if (!file.endsWith('.js') && !file.endsWith('.ts')) continue;
  replaceInFile(path.join(root, 'src', file), [/(Version: )\d+\.\d+\.\d+/g, /(Version = ')\d+\.\d+\.\d+/g]);
}

// css banners
for (const file of fs.readdirSync(path.join(root, 'assets/css'))) {
  if (!file.endsWith('.css') || file.endsWith('.min.css')) continue;
  replaceInFile(path.join(root, 'assets/css', file), [/(Version: )\d+\.\d+\.\d+/g]);
}

// demo footer
const demoFooter = path.join(root, 'demo/components/footer.vue');
if (fs.existsSync(demoFooter)) {
  replaceInFile(demoFooter, [/(Version: )\d+\.\d+\.\d+/g]);
}

console.log(`version: ${current} -> ${next}`);
