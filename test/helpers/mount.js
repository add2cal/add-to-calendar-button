/* eslint-disable security/detect-object-injection */
/**
 * Mount helper for <add-to-calendar-button> web component tests.
 * Serializes config objects to attributes (JSON for objects/arrays) and awaits full init.
 */
import { fixture } from '@open-wc/testing';
import '../../dist/module/index.js';

const OBJECT_PARAMS = ['options', 'dates', 'rsvp', 'ty', 'customLabels', 'customCss', 'images', 'customVar', 'optionsMobile', 'optionsIOS', 'styleLight', 'styleDark'];

/**
 * Serialize a config value to an attribute string.
 */
export function attrValue(key, value) {
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

/**
 * Mounts an add-to-calendar-button element with the given config and waits for initialization.
 * @param {object} config - key/value config; objects/arrays are JSON-stringified.
 * @returns {Promise<{host: HTMLElement, shadow: ShadowRoot}>}
 */
export async function mountAtcb(config = {}) {
  const el = document.createElement('add-to-calendar-button');
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined || value === null) continue;
    el.setAttribute(key, attrValue(key, value));
  }
  const wrapper = await fixture('<div></div>');
  wrapper.appendChild(el);
  await el.whenInitialized();
  return { host: el, shadow: el.shadowRoot };
}

/**
 * Mounts WITHOUT waiting for initialization (for async-contract tests like A-11).
 */
export async function mountAtcbNoWait(config = {}) {
  const el = document.createElement('add-to-calendar-button');
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined || value === null) continue;
    el.setAttribute(key, attrValue(key, value));
  }
  const wrapper = await fixture('<div></div>');
  wrapper.appendChild(el);
  return el;
}

/**
 * Default minimal future event (far future so it never becomes "past").
 */
export function baseEvent(overrides = {}) {
  return {
    name: 'Test Event',
    startDate: '2050-06-15',
    startTime: '10:00',
    endTime: '11:00',
    timeZone: 'America/New_York',
    location: 'Somewhere 1, 12345 Cityplace',
    description: 'A test event description.',
    options: "['Google','Apple','iCal','Microsoft365','Outlook.com','MicrosoftTeams','Yahoo']",
    ...overrides,
  };
}
