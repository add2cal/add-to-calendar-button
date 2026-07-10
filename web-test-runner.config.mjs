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
export default {
  testsFinishTimeout: 300000,
  browserStartTimeout: 60000,
  concurrency: Number(process.env.WTR_CONCURRENCY || 1),
  testFramework: {
    config: {
      timeout: 20000,
    },
  },
};
