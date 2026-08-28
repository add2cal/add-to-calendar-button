/**
 * DOM-free utility entry tests. The build runs before this file via `npm run test:ssr`.
 */
import { test } from 'node:test';
import assert from 'node:assert';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

test('UTIL-01: ESM and CJS utilities import without DOM globals and process dates', async () => {
  assert.strictEqual(typeof HTMLElement, 'undefined');
  assert.strictEqual(typeof window, 'undefined');
  assert.strictEqual(typeof document, 'undefined');

  const esm = await import('../../dist/utils/index.js');
  const cjs = require('../../dist/utils/index.cjs');
  for (const utilities of [esm, cjs]) {
    const decorated = utilities.atcb_decorate_data_dates({
      dates: [{ name: 'Utility event', startDate: '2050-06-15', startTime: '10:00', endTime: '11:00', timeZone: 'GMT' }],
    });
    assert.strictEqual(decorated.dates[0].endDate, '2050-06-15');
    const timestring = utilities.atcb_generate_timestring(decorated.dates, 'en', 0, false, false, true);
    assert.ok(timestring.length > 0);
    assert.ok(timestring.join(' ').includes('2050'));
  }
});
