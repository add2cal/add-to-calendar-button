// Shared @web/test-runner configuration for the behavior test suite.
// The suite mounts many web-component instances per file - allow more time per file.
export default {
  testsFinishTimeout: 300000,
  browserStartTimeout: 60000,
  testFramework: {
    config: {
      timeout: 20000,
    },
  },
};
