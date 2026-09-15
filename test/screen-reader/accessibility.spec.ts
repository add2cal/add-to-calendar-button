import { screenReaderTest as test } from '@guidepup/playwright';
import { expect } from '@playwright/test';
import { attachSpeech, checkpointSpeech, closeWithEscape, expectSpeech, mount, openList, readTo, tabTo, triggerName } from './helpers';

test.use({ screenReaderStartOptions: { capture: true } });
test.afterEach(async ({ screenReader }, testInfo) => {
  await attachSpeech(screenReader, testInfo);
});

test('SR-01: default button is discoverable, announced, and keyboard operable', async ({ page, screenReader }) => {
  await mount(page, {});
  await screenReader.navigateToWebContent();
  await readTo(screenReader, /Add to Calendar.*button|button.*Add to Calendar/i);
  const trigger = page.getByRole('button', { name: triggerName });
  await tabTo(screenReader, trigger, /Add to Calendar/i);
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await screenReader.press('Space');
  await expect(page.getByRole('menu')).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await closeWithEscape(page, screenReader, trigger);
  await tabTo(screenReader, page.getByRole('button', { name: 'After calendar' }), /After calendar/i);
});

for (const [index, style, overlay] of [
  [2, 'dropdown', false],
  [3, 'dropdown', true],
  [4, 'modal', false],
  [5, 'modal', true],
] as const) {
  test(`SR-0${index}: ${style} list with force-overlay=${overlay} supports reading, navigation, and dismissal`, async ({ page, screenReader }) => {
    await mount(page, { 'list-style': style, 'force-overlay': overlay });
    const trigger = await openList(page, screenReader);
    await expect(page.getByRole('button', { name: triggerName })).toHaveCount(1);
    if (style === 'modal') {
      await expect(page.getByRole('dialog')).toHaveAccessibleName(/Add to Calendar/i);
    }
    await checkpointSpeech(screenReader);
    await screenReader.press('Tab');
    await expect(page.getByRole('menuitem', { name: 'iCal File', exact: true })).toBeFocused();
    await expectSpeech(screenReader, /iCal/i);
    await screenReader.press('Shift+Tab');
    await expect(page.getByRole('menuitem', { name: 'Google', exact: true })).toBeFocused();
    await expectSpeech(screenReader, /Google/i);
    // The final item wraps back to Google without reaching page controls.
    await screenReader.press('Shift+Tab');
    await screenReader.press('Tab');
    await expect(page.getByRole('menuitem', { name: 'Google', exact: true })).toBeFocused();
    await readTo(screenReader, /iCal/i, style === 'modal' ? /Before calendar|After calendar/i : undefined);
    await closeWithEscape(page, screenReader, trigger);
    await openList(page, screenReader);
    if (style === 'modal') {
      await tabTo(screenReader, page.getByRole('menuitem', { name: 'Close', exact: true }), /Close/i);
      await screenReader.press('Enter');
      await expect(page.getByRole('dialog')).toHaveCount(0);
      await expect(trigger).toBeFocused();
    } else {
      await screenReader.press('Enter');
      await expect.poll(() => page.evaluate(() => window.calendarLinks.length)).toBe(1);
    }
  });
}

test('SR-06: multi-date Google dialog announces distinct dates and restores focus', async ({ page, screenReader }) => {
  const { unexpectedRequests } = await mount(page, {
    dates: [
      { name: 'Workshop one', startDate: '2050-08-20', startTime: '14:00', endTime: '15:00' },
      { name: 'Workshop two', startDate: '2050-08-21', startTime: '14:00', endTime: '15:00' },
    ],
  });
  const trigger = await openList(page, screenReader);
  await checkpointSpeech(screenReader);
  await screenReader.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await readTo(screenReader, /dialog/i, /Before calendar|After calendar/i);
  const first = dialog.getByRole('button', { name: /Workshop one/i });
  const second = dialog.getByRole('button', { name: /Workshop two/i });
  await tabTo(screenReader, first, /Workshop one/i);
  await expectSpeech(screenReader, /2050/);
  await tabTo(screenReader, second, /Workshop two/i);
  await screenReader.press('Enter');
  await expect.poll(() => page.evaluate(() => window.calendarLinks.length)).toBe(1);
  const url = new URL(await page.evaluate(() => window.calendarLinks[0]!));
  expect(url.searchParams.get('dates')).toContain('20500821');
  await closeWithEscape(page, screenReader, trigger);
  expect(unexpectedRequests).toEqual([]);
});

test('SR-07: CTA form announces its content, required fields, checkbox, and validation', async ({ page, screenReader }) => {
  const { unexpectedRequests } = await mount(page, {}, 'cta');
  const trigger = await openList(page, screenReader);
  await checkpointSpeech(screenReader);
  await screenReader.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Stay informed' });
  await expect(dialog).toBeVisible();
  await tabTo(screenReader, dialog.getByRole('button', { name: 'Close', exact: true }), /Close/i);
  await readTo(screenReader, /Tell us where to send your reminder/i, /Before calendar|After calendar/i);
  const email = dialog.getByRole('textbox', { name: /Email/i });
  await tabTo(screenReader, email, /Email/i);
  await expectSpeech(screenReader, /required/i);
  const checkbox = dialog.getByRole('checkbox', { name: /I agree/i });
  await tabTo(screenReader, checkbox, /I agree/i);
  await checkpointSpeech(screenReader);
  await screenReader.press('Space');
  await expect(checkbox).toBeChecked();
  await expectSpeech(screenReader, /\bchecked\b/i);
  await readTo(screenReader, /Send reminder.*button|button.*Send reminder/i, /Before calendar|After calendar/i);
  await checkpointSpeech(screenReader);
  await screenReader.act();
  await expect(email).toBeFocused();
  await expect.poll(() => email.evaluate((element) => (element as HTMLInputElement).validity.valid)).toBe(false);
  await expectSpeech(screenReader, /required|invalid|fill out|blank/i);
  await screenReader.type('reader@example.com', { capture: false });
  await expect(email).toHaveValue('reader@example.com');
  await closeWithEscape(page, screenReader, trigger);
  expect(unexpectedRequests).toEqual([]);
});

for (const [index, inline] of [
  [8, false],
  [9, true],
] as const) {
  test(`SR-0${index}: ${inline ? 'inline' : 'modal'} RSVP announces fields and client validation`, async ({ page, screenReader }) => {
    const { unexpectedRequests } = await mount(page, { 'inline-rsvp': inline }, 'rsvp');
    await screenReader.navigateToWebContent();
    const trigger = page.locator('add-to-calendar-button').getByRole('button', { name: /^RSVP:/i });
    if (!inline) {
      await tabTo(screenReader, trigger, /RSVP/i);
      await checkpointSpeech(screenReader);
      await screenReader.press('Enter');
      await expect(page.getByRole('dialog', { name: 'RSVP', exact: true })).toBeVisible();
      await readTo(screenReader, /RSVP.*dialog|dialog.*RSVP/i, /Before calendar|After calendar/i);
    }
    const email = page.getByRole('textbox', { name: /Email/i });
    await tabTo(screenReader, email, /Email/i);
    await expectSpeech(screenReader, /required/i);
    await screenReader.type('reader@example.com', { capture: false });
    await expect(email).toHaveValue('reader@example.com');
    const name = page.getByRole('textbox', { name: 'Name', exact: true });
    await tabTo(screenReader, name, /Name/i);
    await expectSpeech(screenReader, /required/i);
    const checkbox = page.getByRole('checkbox', { name: /Subscribe to news/i });
    await tabTo(screenReader, checkbox, /Subscribe to news/i);
    await checkpointSpeech(screenReader);
    await screenReader.press('Space');
    await expect(checkbox).toBeChecked();
    await expectSpeech(screenReader, /\bchecked\b/i);
    await readTo(screenReader, /Submit.*button|button.*Submit/i, !inline ? /Before calendar|After calendar/i : undefined);
    await checkpointSpeech(screenReader);
    await screenReader.act();
    await expect(name).toBeFocused();
    await expect.poll(() => name.evaluate((element) => (element as HTMLInputElement).validity.valid)).toBe(false);
    await expectSpeech(screenReader, /required|invalid|fill out|blank/i);
    await screenReader.type('Screen Reader', { capture: false });
    await expect(name).toHaveValue('Screen Reader');
    if (!inline) await closeWithEscape(page, screenReader, trigger);
    else await tabTo(screenReader, page.getByRole('button', { name: 'After calendar' }), /After calendar/i);
    expect(unexpectedRequests).toEqual([]);
  });
}
