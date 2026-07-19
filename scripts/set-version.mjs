/**
 * Version bump script (replaces grunt-version).
 * Updates the version string in package.json, src/*.js banners and constants,
 * assets/css/*.css banners, and the demo footer.
 *
 * Accepts release AND prerelease versions (semver): the release flow publishes
 * pre-releases like 3.0.0-next.1 under the npm `next` dist-tag before the final.
 *
 * Usage: node scripts/set-version.mjs [patch|minor|major|prerelease|x.y.z|x.y.z-tag.n]
 *   patch|minor|major  bump from the current version (a prerelease suffix is dropped
 *                      first, so 3.0.0-next.2 + patch -> 3.0.0, like `npm version`)
 *   prerelease         increment the prerelease counter (3.0.0-next.1 -> 3.0.0-next.2);
 *                      errors when the current version has no prerelease suffix
 *   x.y.z / x.y.z-tag.n  set an explicit version
 * Default: patch
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = process.argv[2] || 'patch';

const pkgPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const current = pkg.version;

// x.y.z with an optional -tag(.n) prerelease suffix (the subset of semver this project uses);
// eslint-disable-next-line security/detect-unsafe-regex -- input is the local package.json version / cli argument (tiny, trusted), not attacker-controlled
const VERSION_PATTERN = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9a-z-]+(?:\.[0-9a-z-]+)*))?$/i;

function bump(version, kind) {
  const match = version.match(VERSION_PATTERN);
  if (!match) throw new Error(`current version is not valid semver: ${version}`);
  const [, major, minor, patch, prerelease] = match;
  const parts = [Number(major), Number(minor), Number(patch)];
  if (kind === 'major') return `${parts[0] + 1}.0.0`;
  if (kind === 'minor') return `${parts[0]}.${parts[1] + 1}.0`;
  if (kind === 'patch') {
    // releasing a prerelease: patch finalizes the base version (npm version semantics)
    if (prerelease) return `${parts[0]}.${parts[1]}.${parts[2]}`;
    return `${parts[0]}.${parts[1]}.${parts[2] + 1}`;
  }
  if (kind === 'prerelease') {
    if (!prerelease) throw new Error(`current version ${version} has no prerelease suffix to increment - set one explicitly (e.g. ${parts[0]}.${parts[1]}.${parts[2] + 1}-next.1)`);
    const segments = prerelease.split('.');
    const counter = Number(segments[segments.length - 1]);
    if (!Number.isInteger(counter)) throw new Error(`prerelease suffix "${prerelease}" does not end in a counter to increment`);
    segments[segments.length - 1] = `${counter + 1}`;
    return `${parts[0]}.${parts[1]}.${parts[2]}-${segments.join('.')}`;
  }
  if (!VERSION_PATTERN.test(kind)) throw new Error(`invalid version argument: ${kind}`);
  return kind;
}

const next = bump(current, arg);

// matches any version this script may have written before (incl. prerelease suffixes)
const VERSION_IN_FILE = '\\d+\\.\\d+\\.\\d+(?:-[0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*)?';

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

// eslint-disable-next-line security/detect-non-literal-regexp -- assembled from the constants above, no external input
const versionRegex = (prefix, flags = undefined) => new RegExp(`(${prefix})${VERSION_IN_FILE}`, flags);

// package.json (raw replace to keep formatting)
replaceInFile(pkgPath, [versionRegex('"version":\\s*"')]);

// src banners (" *  Version: x.y.z") and constants ("const atcbVersion: string = 'x.y.z'"),
// walking all source subdirectories
function walkSrc(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkSrc(full);
    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.ts')) {
      replaceInFile(full, [versionRegex('Version: ', 'g'), versionRegex("Version(?:: string)? = '", 'g')]);
    }
  }
}
walkSrc(path.join(root, 'src'));

// css banners
for (const file of fs.readdirSync(path.join(root, 'assets/css'))) {
  if (!file.endsWith('.css') || file.endsWith('.min.css')) continue;
  replaceInFile(path.join(root, 'assets/css', file), [versionRegex('Version: ', 'g')]);
}

// demo footer
const demoFooter = path.join(root, 'demo/components/footer.vue');
if (fs.existsSync(demoFooter)) {
  replaceInFile(demoFooter, [versionRegex('Version: ', 'g')]);
}

console.log(`version: ${current} -> ${next}`);
