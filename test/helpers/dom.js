/**
 * DOM interaction helpers for the add-to-calendar-button shadow DOM.
 *
 * Element id conventions (from src/atcb-generate.js):
 *  - trigger button:      #{identifier}
 *  - option list items:   #{identifier}-{type}   (type: apple|google|ical|ms365|outlookcom|msteams|yahoo)
 *  - close list item:     #{identifier}-close
 *  - modal host (light DOM): #{identifier}-modal-host
 *  - sub-event buttons:   #{identifier}-{type}-{n} (inside modal host shadow DOM)
 */
import { aTimeout } from '@open-wc/testing';

export const ALL_OPTIONS = ['apple', 'google', 'ical', 'ms365', 'outlookcom', 'msteams', 'yahoo'];

export function trigger(host) {
  return host.shadowRoot.getElementById(host.getAttribute('identifier') || host.getAttribute('atcb-button-id'));
}

export function optionEl(host, type) {
  const id = (host.getAttribute('identifier') || host.getAttribute('atcb-button-id')) + '-' + type;
  return host.shadowRoot.getElementById(id);
}

export function renderedOptions(host) {
  return ALL_OPTIONS.filter((t) => !!optionEl(host, t));
}

/**
 * Opens the option list by clicking the trigger (config must use trigger="click").
 * Waits past the 5ms positioning timeout in atcb_open.
 */
export async function openList(host) {
  const btn = trigger(host);
  btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window, button: 0 }));
  await aTimeout(60);
}

export function listEl(host) {
  return host.shadowRoot.querySelector('.atcb-list');
}

/**
 * Clicks a calendar option (list must be open, or the config must be a singleton).
 */
export async function clickOption(host, type) {
  const el = optionEl(host, type);
  if (!el) throw new Error('Option not rendered: ' + type);
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window, button: 0 }));
  await aTimeout(60);
}

/**
 * Convenience: mounts config is expected to be singleton (one option) - clicks the single button.
 */
export async function clickSingleton(host) {
  const btn = trigger(host);
  btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window, button: 0 }));
  await aTimeout(60);
}

export function modalHost(host) {
  const id = (host.getAttribute('identifier') || host.getAttribute('atcb-button-id')) + '-modal-host';
  return document.getElementById(id);
}

export async function pressEsc() {
  document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', bubbles: true, cancelable: true }));
  await aTimeout(30);
}
