import { spawnSync } from 'node:child_process';

// CI distributes the full tier across Linux browser jobs and macOS/Windows reader
// jobs. A local invocation runs both parts; unsupported systems must not silently
// pass without exercising a real screen reader.
const part = process.env.ATCB_TEST_FULL_PART || 'all';
if (!['all', 'browser', 'screen-reader'].includes(part)) {
  throw new Error('ATCB_TEST_FULL_PART must be all, browser, or screen-reader.');
}
if (part !== 'browser' && !['darwin', 'win32'].includes(process.platform)) {
  throw new Error('The full tier requires VoiceOver on macOS or NVDA on Windows. For the browser portion only, set ATCB_TEST_FULL_PART=browser; the release CI runs both reader platforms separately.');
}

function run(args) {
  const result = spawnSync(process.execPath, args, { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}

console.log(`Full suite portion: ${part}`);
run(['test/test-prep.js']);
if (part !== 'screen-reader') {
  run(['node_modules/@web/test-runner/dist/bin.js', 'test/wc-tests/*.test.js', 'test/wc-tests-smoke/*.test.js', 'test/wc-tests-full/*.test.js']);
}
if (part !== 'browser') {
  run(['node_modules/@playwright/test/cli.js', 'test', '--config', 'playwright.screen-reader.config.ts']);
}
