#!/usr/bin/env node
// Workaround for https://github.com/withastro/astro/issues/15917
//
// The Astro Cloudflare adapter generates `dist/server/wrangler.json` and
// redirects `wrangler deploy` to it via `.wrangler/deploy/config.json`.
// The generated file includes `"legacy_env": true`, a field that recent
// wrangler versions (4.x) no longer accept and hard-error on:
//   "The 'legacy_env' field is no longer supported, so please remove it
//    from your configuration file."
//
// We cannot prevent the adapter from emitting the field, so we strip it
// from the generated config after the build. This is safe because
// `legacy_env = true` was already the default behaviour and removing the
// field does not change how the Worker is deployed.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const generatedConfigPath = join(__dirname, '..', 'dist', 'server', 'wrangler.json');

if (!existsSync(generatedConfigPath)) {
  // Nothing to do — no server build was produced (e.g. static-only output).
  process.exit(0);
}

const raw = readFileSync(generatedConfigPath, 'utf8');
const config = JSON.parse(raw);

let changed = false;

if ('legacy_env' in config) {
  delete config.legacy_env;
  changed = true;
}

if (changed) {
  writeFileSync(generatedConfigPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
  console.log('[fixWranglerConfig] Removed unsupported "legacy_env" field from dist/server/wrangler.json');
} else {
  console.log('[fixWranglerConfig] No "legacy_env" field found — nothing to do.');
}
