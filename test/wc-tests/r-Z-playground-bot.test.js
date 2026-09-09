/**
 * Reduced Suite - Group Z: Demo Playground hydration regressions.
 */
import { expect } from '@open-wc/testing';
import { shouldSkipClientLoad } from '../../demo/utils/playground-bot.ts';

const headlessChrome = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/151.0.0.0 Safari/537.36';
const googlebot = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

describe('Group Z - Demo Playground hydration', () => {
  it('Z-06: Headless Chromium initializes the Playground while crawlers retain the SSR shell', () => {
    expect(shouldSkipClientLoad(headlessChrome)).to.equal(false);
    expect(shouldSkipClientLoad(googlebot)).to.equal(true);
  });
});
