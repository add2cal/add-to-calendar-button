import { defineConfig } from '@playwright/test';
import { screenReaderConfig } from '@guidepup/playwright';

if (!['darwin', 'win32'].includes(process.platform)) {
  throw new Error('Screen-reader tests require macOS (VoiceOver) or Windows (NVDA).');
}

export default defineConfig({
  ...screenReaderConfig,
  testDir: './test/screen-reader',
  testMatch: '**/*.spec.ts',
  workers: 1,
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  timeout: process.platform === 'darwin' ? 4 * 60_000 : 120_000,
  globalTimeout: process.platform === 'darwin' ? 28 * 60_000 : 20 * 60_000,
  expect: { timeout: 10_000 },
  outputDir: 'test-results/screen-reader',
  reporter: [['list'], ['./test/screen-reader/count-reporter.ts'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    ...screenReaderConfig.use,
    baseURL: 'http://127.0.0.1:4174',
    locale: 'en-US',
    timezoneId: 'Europe/Berlin',
    viewport: { width: 1280, height: 900 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: process.platform === 'darwin' ? 'voiceover-webkit' : 'nvda-chromium', use: { browserName: process.platform === 'darwin' ? 'webkit' : 'chromium' } }],
  webServer: {
    command: 'node test/screen-reader/server.mjs',
    url: 'http://127.0.0.1:4174/test/screen-reader/fixture.html',
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
