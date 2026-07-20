// Shared @web/test-runner configuration for the behavior test suite.
//
// concurrency 1 (one test-file page at a time) is INTENTIONAL and load-bearing:
// the runner opens one tab per test file, and Chrome's headless mode intensively
// throttles timers in backgrounded tabs. The component defers its initialization
// via setTimeout, so any test file whose tab is not in the foreground stalls on
// whenInitialized() and fails as a blanket timeout ("Tests were interrupted because
// the browser disconnected" / "Timeout of 20000ms exceeded") - reproducibly, for
// whichever file got backgrounded. The usual --disable-background-timer-throttling /
// --disable-features=IntensiveWakeUpThrottling switches did not reliably lift this
// for tabs in current Chrome builds. chrome-headless-shell has no tab-visibility
// concept and is not affected; regular Chrome is.
//
// Serialized pages are deterministic on every machine. The smoke tier (CI default)
// runs its tests in seconds anyway - the build dominates wall time, not the runner.
// Override for experiments via WTR_CONCURRENCY.
import fs from 'node:fs';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { chromeLauncher } from '@web/test-runner';

export default {
  // expose window.gc for the memory-leak regression checks (r-MEM): the flag lets the
  // heap-stability assertion trigger garbage collection deterministically; the binary
  // is still resolved via CHROME_PATH like before
  browsers: [chromeLauncher({ launchOptions: { args: ['--js-flags=--expose-gc'] } })],
  // resolve bare module specifiers here (instead of the --node-resolve CLI flag) so we can
  // request the "production" export condition: lit (pulled in by @open-wc/testing's fixture)
  // then loads its production build and stops printing the "Lit is in dev mode" banner.
  // extensions includes .ts so the extensionless relative imports inside src resolve
  // to the TypeScript sources (function-level tests import from ../../src directly).
  nodeResolve: {
    exportConditions: ['production', 'default'],
    extensions: ['.mjs', '.js', '.ts', '.json'],
  },
  // serve locale packs as RAW json: the esbuild plugin below compiles served .json
  // files into JS modules (needed for import statements), which would corrupt the
  // runtime fetch() of dist/locales/*.json that the component performs
  middleware: [
    async (ctx, next) => {
      if (ctx.path.startsWith('/dist/locales/') && ctx.path.endsWith('.json')) {
        ctx.type = 'application/json';
        // eslint-disable-next-line security/detect-non-literal-fs-filename -- test-runner middleware, path shape is asserted above
        ctx.body = fs.readFileSync('.' + ctx.path, 'utf8');
        return;
      }
      await next();
    },
  ],
  // transpile TypeScript sources on the fly for tests that import from src
  plugins: [esbuildPlugin({ ts: true, json: true })],
  // the component intentionally logs its init notice and the PRO banner once per page
  // (product behavior, license-relevant branding) - every test file is a fresh page, so
  // without this filter the runner echoes the same block dozens of times per tier.
  // Only these exact known lines are dropped; real warnings and errors surface normally,
  // and in-page console spies are unaffected (this filters runner OUTPUT only)
  filterBrowserLogs({ args }) {
    const text = args.map((arg) => String(arg)).join(' ');
    if (text.includes('Add to Calendar Button script initialized') || text.includes('Add to Calendar PRO script initialized') || text.includes('PRO version available at https://add-to-calendar-pro.com')) {
      return false;
    }
    return true;
  },
  testsFinishTimeout: 300000,
  browserStartTimeout: 60000,
  concurrency: Number(process.env.WTR_CONCURRENCY || 1),
  testFramework: {
    config: {
      timeout: 20000,
    },
  },
};
