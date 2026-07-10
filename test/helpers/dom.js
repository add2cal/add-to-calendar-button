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

/**
 * Canonical button id. NOTE: the lib PREFIXES custom identifiers with 'atcb-btn-'
 * (src/atcb-init.js), so always derive ids from the reflected atcb-button-id attribute.
 */
export function btnId(host) {
  return host.getAttribute('atcb-button-id');
}

/**
 * True when initialization failed (silent error path).
 * NOTE: do NOT run querySelector against the shadow root of a failed-init element -
 * chrome-headless-shell can crash the renderer on it (observed with v150).
 * Property access (attributes, childElementCount) is safe.
 */
export function initFailed(host) {
  return host.getAttribute('atcb-button-id') === null;
}

export function trigger(host) {
  return host.shadowRoot.getElementById(btnId(host));
}

export function optionEl(host, type) {
  return host.shadowRoot.getElementById(btnId(host) + '-' + type);
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
  return document.getElementById(btnId(host) + '-modal-host');
}

export function subEventBtn(host, type, n) {
  const modal = modalHost(host);
  if (!modal) return null;
  return modal.shadowRoot.getElementById(`${btnId(host)}-${type}-${n}`);
}

export async function pressEsc() {
  document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', bubbles: true, cancelable: true }));
  await aTimeout(30);
}
