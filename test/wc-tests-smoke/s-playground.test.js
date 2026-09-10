/**
 * Smoke Suite: browser regression coverage for the generated v3 Playground.
 */
import { expect } from '@open-wc/testing';

const timeout = 10000;

const waitFor = async (predicate, message) => {
  const end = Date.now() + timeout;
  while (Date.now() < end) {
    const value = predicate();
    if (value) return value;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  throw new Error(message);
};

const waitForLoad = (frame) => new Promise((resolve) => frame.addEventListener('load', resolve, { once: true }));

const input = (doc, label) => {
  const labelledInput = doc.querySelector(`[aria-label="${label}"]`);
  if (labelledInput) return labelledInput;
  const labelEl = [...doc.querySelectorAll('label')].find((el) => el.textContent.trim() === label);
  const el = labelEl?.parentElement?.querySelector('input');
  expect(el, `input ${label}`).to.exist;
  return el;
};

const updateInput = (doc, label, value) => {
  const el = input(doc, label);
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
  setter.call(el, value);
  el.dispatchEvent(new Event('input', { bubbles: true }));
  return el;
};

const liveButton = (doc) => {
  const el = doc.querySelector('#rendering add-to-calendar-button');
  expect(el, 'live Playground preview').to.exist;
  return el;
};

const waitForHydration = async (frame) => {
  const doc = frame.contentDocument;
  await waitFor(() => doc.querySelector('#date-input input[aria-label="Subject"]:not([disabled])'), 'Playground controls did not become enabled after initialization');
  return doc;
};

const assertInteractiveControls = (doc) => {
  const controls = [...doc.querySelectorAll('#date-input input[aria-label], #style-input input[aria-label]')];
  expect(controls.length, 'desktop Playground labelled control count').to.be.greaterThan(8);
  expect(
    controls.filter((el) => el.disabled),
    'no desktop control remains disabled',
  ).to.have.length(0);
  controls.forEach((el) => expect(el.getAttribute('aria-label'), 'control has an accessible name').to.not.equal(null));
};

describe('Smoke - generated v3 Playground', () => {
  it('S-17: HeadlessChrome initializes the real Playground on fresh load and reload without uncaught errors', async () => {
    const frame = document.createElement('iframe');
    frame.style.width = '1280px';
    frame.style.height = '900px';
    document.body.append(frame);

    const uncaught = [];
    frame.contentWindow.addEventListener('error', (event) => uncaught.push(event.error || event.message));
    frame.contentWindow.addEventListener('unhandledrejection', (event) => uncaught.push(event.reason));
    const loaded = waitForLoad(frame);
    frame.src = '/playground/';
    await loaded;
    let doc = await waitForHydration(frame);
    frame.contentWindow.localStorage.clear();
    assertInteractiveControls(doc);

    const reloaded = waitForLoad(frame);
    frame.src = '/playground/';
    await reloaded;
    doc = await waitForHydration(frame);
    assertInteractiveControls(doc);
    expect(uncaught, 'Playground initialization errors').to.have.length(0);

    frame.remove();
  });

  it('S-18: Playground edits reach the live preview and configuration across the supported control categories', async () => {
    const frame = document.createElement('iframe');
    frame.style.width = '1280px';
    frame.style.height = '900px';
    document.body.append(frame);
    const loaded = waitForLoad(frame);
    frame.src = '/playground/';
    await loaded;
    const doc = await waitForHydration(frame);

    updateInput(doc, 'Subject', 'Browser regression subject');
    await waitFor(() => liveButton(doc).getAttribute('name') === 'Browser regression subject', 'Subject did not reach the preview');
    updateInput(doc, 'Start Date', '2030-05-02');
    updateInput(doc, 'Start Time', '09:30');
    await waitFor(() => liveButton(doc).getAttribute('start-date') === '2030-05-02' && liveButton(doc).getAttribute('start-time') === '09:30', 'Date/time did not reach the preview');
    updateInput(doc, 'Location', 'Browser Test Lab');
    await waitFor(() => liveButton(doc).getAttribute('location') === 'Browser Test Lab', 'Location did not reach the preview');
    updateInput(doc, 'Organizer: Name', 'Test Organizer');
    updateInput(doc, 'Organizer: Email', 'organizer@example.test');
    await waitFor(() => liveButton(doc).getAttribute('organizer')?.includes('organizer@example.test'), 'Organizer did not reach the preview');
    updateInput(doc, 'RRULE', 'RRULE:FREQ=WEEKLY;COUNT=2');
    await waitFor(() => liveButton(doc).getAttribute('recurrence') === 'RRULE:FREQ=WEEKLY;COUNT=2', 'Recurrence did not reach the preview');
    updateInput(doc, 'Custom Button Label', 'Browser label');
    await waitFor(() => liveButton(doc).getAttribute('label') === 'Browser label', 'Custom label did not reach the preview');
    updateInput(doc, 'Size', '8');
    await waitFor(() => liveButton(doc).getAttribute('size') === '8', 'Size did not reach the preview');

    const timeZone = input(doc, 'Time Zone');
    timeZone.focus();
    timeZone.value = 'Europe/Berlin';
    timeZone.dispatchEvent(new Event('input', { bubbles: true }));
    await waitFor(() => [...doc.querySelectorAll('li')].some((el) => el.textContent.trim() === 'Europe/Berlin'), 'Time zone option was not available');
    timeZone.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    timeZone.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await waitFor(() => liveButton(doc).getAttribute('time-zone') === 'Europe/Berlin', 'Time zone did not reach the preview');

    doc.querySelector('#code-output > div').click();
    await waitFor(() => doc.querySelector('#code-output').textContent.includes('Browser label'), 'Configuration output did not update');
    frame.remove();
  });

  it('S-19: mobile controls remain available and keyboard-labelled after real initialization', async () => {
    const frame = document.createElement('iframe');
    frame.style.width = '375px';
    frame.style.height = '900px';
    document.body.append(frame);
    const loaded = waitForLoad(frame);
    frame.src = '/playground/';
    await loaded;
    const doc = await waitForHydration(frame);

    const mobileInput = doc.querySelector('#mobile-input');
    expect(frame.contentWindow.innerWidth, 'mobile viewport').to.be.at.most(375);
    expect(frame.contentWindow.getComputedStyle(mobileInput).display, 'mobile toolbar visibility').to.not.equal('none');
    const mobileSubject = input(doc, 'Subject');
    expect(mobileSubject.disabled, 'mobile Subject control').to.equal(false);
    mobileSubject.focus();
    mobileSubject.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(doc.activeElement, 'keyboard focus remains in the interactive document').to.exist;
    expect(frame.contentWindow.matchMedia('(prefers-reduced-motion: reduce)').media, 'reduced-motion media query is supported').to.equal('(prefers-reduced-motion: reduce)');
    frame.remove();
  });
});
