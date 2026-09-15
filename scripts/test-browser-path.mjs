import { appendFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const variant = process.argv[2];
if (!['chrome', 'chrome-headless-shell'].includes(variant) || !process.env.GITHUB_ENV) {
  throw new Error('Usage in GitHub Actions: node scripts/test-browser-path.mjs chrome|chrome-headless-shell');
}
// Resolve the installed executable through Playwright's public API, without
// depending on its cache directory layout or browser revision numbers.
const server = await chromium.launchServer({ headless: true, ...(variant === 'chrome' ? { channel: 'chromium' } : {}) });
try {
  const executable = server.process().spawnfile;
  appendFileSync(process.env.GITHUB_ENV, `CHROME_PATH=${executable}\n`);
  console.log(`${variant}: ${executable}`);
} finally {
  await server.close();
}
