import { expect } from '@open-wc/testing';
import { shouldSkipPlaygroundClientLoad } from '../../demo/utils/playground-bot.ts';

const headlessChrome = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/151.0.0.0 Safari/537.36';
const googlebot = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

describe('Group Z - Demo Playground hydration', () => {
  it('Z-06: initializes in Headless Chromium and retains crawler SSR behavior', () => {
    expect(shouldSkipPlaygroundClientLoad(headlessChrome)).to.equal(false);
    expect(shouldSkipPlaygroundClientLoad(googlebot)).to.equal(true);
  });
});
