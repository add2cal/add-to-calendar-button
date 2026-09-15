import { expect } from '@playwright/test';
import type { Locator, Page, TestInfo } from '@playwright/test';
import type { ScreenReaderPlaywright } from '@guidepup/playwright';
import { PRO_EVT_KEY, PRO_RSVP_KEY, proEvtConfig, proRsvpConfig } from '../fixtures/pro.js';

declare global {
  interface Window {
    calendarLinks: string[];
  }
}

export const triggerName = /Add to Calendar/i;
export const eventConfig = {
  name: 'Accessibility workshop',
  'start-date': '2050-08-20',
  'start-time': '14:00',
  'end-time': '15:00',
  'time-zone': 'Europe/Berlin',
  options: ['Google', 'iCal'],
  trigger: 'click',
  language: 'en',
  'button-style': 'default',
  'hide-branding': true,
};

export async function mount(page: Page, config: Record<string, unknown>, pro: 'cta' | 'rsvp' | undefined = undefined) {
  await page.addInitScript(() => {
    window.calendarLinks = [];
    window.open = (url) => {
      window.calendarLinks.push(String(url));
      return null;
    };
  });
  const unexpectedRequests: string[] = [];
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === 'http://127.0.0.1:4174') return route.continue();
    if (pro && url.href === `https://event.caldn.net/${pro === 'cta' ? PRO_EVT_KEY : PRO_RSVP_KEY}/config.json`) {
      const payload =
        pro === 'rsvp'
          ? proRsvpConfig()
          : proEvtConfig({
              label: 'Add to Calendar',
              options: ['Google', 'iCal'],
              ty: {
                type: 'form',
                headline: 'Stay informed',
                text: 'Tell us where to send your reminder.',
                url: 'https://example.com/submit',
                button_label: 'Send reminder',
                fields: [
                  { name: 'email', label: 'Email', type: 'email', required: true },
                  { name: 'terms', label: 'I agree', type: 'checkbox', required: true },
                ],
              },
            });
      return route.fulfill({ json: payload });
    }
    // RSVP seat availability is deterministic. Submissions are deliberately not
    // fulfilled: these tests exercise client validation, not the RSVP service.
    if (pro === 'rsvp' && url.origin === 'https://api.add-to-calendar-pro.com' && route.request().method() === 'GET') {
      return route.fulfill({ json: { total: '0' } });
    }
    unexpectedRequests.push(`${route.request().method()} ${url.href}`);
    await route.abort();
  });
  await page.goto('/test/screen-reader/fixture.html');
  const attributes: Record<string, unknown> = { ...eventConfig, ...(pro ? { prokey: pro === 'cta' ? PRO_EVT_KEY : PRO_RSVP_KEY } : {}), ...config };
  // Root date/time fields override individual dates. A series fixture must use
  // only its own dates rather than inheriting the single-event defaults.
  if (config.dates) {
    delete attributes['start-date'];
    delete attributes['start-time'];
    delete attributes['end-time'];
  }
  await page.evaluate(async (attributes) => {
    await customElements.whenDefined('add-to-calendar-button');
    const element = document.createElement('add-to-calendar-button');
    for (const [name, value] of Object.entries(attributes)) {
      element.setAttribute(name, typeof value === 'object' ? JSON.stringify(value) : String(value));
    }
    document.getElementById('fixture')!.append(element);
    await (element as HTMLElement & { whenInitialized(): Promise<void> }).whenInitialized();
  }, attributes);
  const host = page.locator('add-to-calendar-button');
  await expect(host).toHaveAttribute('atcb-button-id', /.+/);
  await expect(host.locator('.atcb-initialized')).toBeVisible();
  return { host, unexpectedRequests };
}

const speechOffsets = new WeakMap<ScreenReaderPlaywright, number>();

export async function checkpointSpeech(reader: ScreenReaderPlaywright) {
  speechOffsets.set(reader, (await reader.spokenPhraseLog()).length);
}

export async function expectSpeech(reader: ScreenReaderPlaywright, expected: RegExp) {
  await expect.poll(async () => (await reader.spokenPhraseLog()).slice(speechOffsets.get(reader) || 0).join('\n'), { message: `Screen reader announces ${expected}` }).toMatch(expected);
}

// Reach controls using real keyboard input, never locator.focus() or DOM clicks.
export async function tabTo(reader: ScreenReaderPlaywright, target: Locator, speech: RegExp, backwards = false) {
  for (let step = 0; step < 20; step++) {
    await checkpointSpeech(reader);
    await reader.press(backwards ? 'Shift+Tab' : 'Tab');
    if (await target.evaluate((element) => element === (element.getRootNode() as Document | ShadowRoot).activeElement)) {
      await expectSpeech(reader, speech);
      return;
    }
  }
  throw new Error(`Could not reach ${speech} within 20 Tab presses.`);
}

// Exercise the reading cursor separately from keyboard focus. Hidden background
// text must not appear when traversing a modal's content.
export async function readTo(reader: ScreenReaderPlaywright, expected: RegExp, forbidden?: RegExp) {
  const currentPhrase = await reader.lastSpokenPhrase();
  if (forbidden) expect(currentPhrase).not.toMatch(forbidden);
  if (expected.test(currentPhrase)) return;
  for (let step = 0; step < 40; step++) {
    await reader.next();
    const phrase = await reader.lastSpokenPhrase();
    if (forbidden) expect(phrase).not.toMatch(forbidden);
    if (expected.test(phrase)) return;
  }
  throw new Error(`Could not read ${expected} within 40 screen-reader steps.`);
}

async function readBackTo(reader: ScreenReaderPlaywright, expected: RegExp, forbidden?: RegExp) {
  for (let step = 0; step < 40; step++) {
    await reader.previous();
    const phrase = await reader.lastSpokenPhrase();
    if (forbidden) expect(phrase).not.toMatch(forbidden);
    if (expected.test(phrase)) return;
  }
  throw new Error(`Could not read back to ${expected} within 40 screen-reader steps.`);
}

export async function openList(page: Page, reader: ScreenReaderPlaywright) {
  await reader.navigateToWebContent();
  const trigger = page.locator('add-to-calendar-button').getByRole('button', { name: triggerName });
  await tabTo(reader, trigger, /Add to Calendar/i);
  await checkpointSpeech(reader);
  await reader.press('Enter');
  await expect(page.getByRole('menu')).toBeVisible();
  const google = page.getByRole('menuitem', { name: 'Google', exact: true });
  // Programmatic focus enters the menu, but VoiceOver and NVDA can initially
  // announce only its container, and Chromium can leave focus on the trigger.
  // Follow the real keyboard route when focus was not moved automatically.
  if (await google.evaluate((element) => element.matches(':focus'))) {
    await readTo(reader, /Google/i);
  } else {
    await tabTo(reader, google, /Google/i);
  }
  if (await page.getByRole('dialog').isVisible()) {
    await readBackTo(reader, /Add to Calendar.*dialog|dialog.*Add to Calendar/i, /Before calendar|After calendar/i);
    await readTo(reader, /Google/i, /Before calendar|After calendar/i);
  }
  return trigger;
}

export async function closeWithEscape(page: Page, reader: ScreenReaderPlaywright, trigger: Locator) {
  await checkpointSpeech(reader);
  await reader.press('Escape');
  // NVDA can consume the first Escape while leaving focus/browse mode. A second
  // press then reaches the page and dismisses the open menu or dialog.
  if ((await page.getByRole('menu').isVisible()) || (await page.getByRole('dialog').isVisible())) await reader.press('Escape');
  await expect(page.getByRole('menu')).toBeHidden();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expectSpeech(reader, /Add to Calendar|RSVP/i);
}

export async function attachSpeech(reader: ScreenReaderPlaywright, testInfo: TestInfo) {
  await testInfo.attach('screen-reader-speech', { body: (await reader.spokenPhraseLog()).join('\n'), contentType: 'text/plain' });
  await testInfo.attach('screen-reader-items', { body: (await reader.itemTextLog()).join('\n'), contentType: 'text/plain' });
}
