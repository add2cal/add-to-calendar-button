import os from 'node:os';

// Shared @web/test-runner configuration for the behavior test suite.
// - testsFinishTimeout: the suite mounts many web-component instances per file
// - concurrency: adaptive cap. Parallel tabs each load the full bundle and mount dozens
//   of component instances; machines under CPU/memory pressure kill or starve tabs, which
//   surfaces as "Tests were interrupted because the browser disconnected" or blanket
//   mocha timeouts. Half the cores, capped at 2, floor 1 - override via WTR_CONCURRENCY.
const cores = typeof os.availableParallelism === 'function' ? os.availableParallelism() : os.cpus().length;

export default {
  testsFinishTimeout: 300000,
  browserStartTimeout: 60000,
  concurrency: Number(process.env.WTR_CONCURRENCY || Math.max(1, Math.min(2, Math.floor(cores / 2)))),
  testFramework: {
    config: {
      timeout: 20000,
    },
  },
};
