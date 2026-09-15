import type { FullResult, Reporter, Suite } from '@playwright/test/reporter';

export default class CountReporter implements Reporter {
  private suite?: Suite;

  onBegin(_config: unknown, suite: Suite) {
    this.suite = suite;
  }

  async onEnd(result: FullResult): Promise<{ status: 'failed' } | undefined> {
    const tests = this.suite?.allTests() || [];
    if (process.argv.includes('--list')) {
      if (tests.length !== 9) return { status: 'failed' };
      return;
    }
    const passed = tests.filter((test) => test.results.length === 1 && test.results[0]?.status === 'passed').length;
    console.log(`Screen-reader coverage: ${passed}/9 passed; ${tests.length}/9 discovered.`);
    if (result.status !== 'passed' || tests.length !== 9 || passed !== 9) {
      return { status: 'failed' };
    }
  }
}
