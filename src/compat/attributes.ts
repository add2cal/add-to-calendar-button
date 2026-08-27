/**
 * Attribute naming.
 *
 * Official attribute names are kebab-case ('start-date', 'button-style', ...) with
 * one exception: proKey's official attribute is 'prokey'. The legacy spellings
 * (the lowercased camelCase names the DOM produced for v2 markup, e.g. 'startdate',
 * 'recurrence_byday') keep working but are no longer documented.
 *
 * Precedence: when both spellings are present on an element, the OFFICIAL name wins.
 */
import type { ATCBInputConfig } from '../types';

const SPECIAL_OFFICIAL_NAMES: { [param: string]: string } = {
  proKey: 'prokey',
  iCalFileName: 'ical-file-name',
  useUserTZ: 'use-user-tz',
};

/**
 * The official kebab-case attribute name for a config param.
 */
function officialAttributeName(param: string): string {
  if (SPECIAL_OFFICIAL_NAMES[`${param}`]) {
    return SPECIAL_OFFICIAL_NAMES[`${param}`]!;
  }
  return param
    .replace(/_/g, '-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * The legacy attribute name: what the DOM stores for the documented camelCase
 * attribute names (HTML lowercases attribute names).
 */
function legacyAttributeName(param: string): string {
  return param.toLowerCase();
}

/**
 * Resolves the attribute name to read for a param on a given element,
 * honoring official-over-legacy precedence. Returns null if neither is set.
 */
function resolveAttributeName(el: Element, param: string): string | null {
  const official = officialAttributeName(param);
  if (el.hasAttribute(official)) {
    return official;
  }
  const legacy = legacyAttributeName(param);
  if (el.hasAttribute(legacy)) {
    return legacy;
  }
  return null;
}

/**
 * Convenience readers used by the attribute scan and the special-cased reads.
 */
function hasConfigAttribute(el: Element, param: string): boolean {
  return resolveAttributeName(el, param) !== null;
}

function getConfigAttribute(el: Element, param: string): string | null {
  const name = resolveAttributeName(el, param);
  return name === null ? null : el.getAttribute(name);
}

/**
 * All attribute names the element observes for change-triggered re-initialization:
 * official + legacy spellings of every WC param plus the special control attributes.
 */
function observedConfigAttributes(params: (keyof ATCBInputConfig)[]): string[] {
  const names = new Set<string>();
  for (const param of params) {
    names.add(officialAttributeName(param));
    names.add(legacyAttributeName(param));
  }
  for (const extra of ['instance', 'prokey', 'pro-override', 'prooverride']) {
    names.add(extra);
  }
  return [...names];
}

export { officialAttributeName, legacyAttributeName, resolveAttributeName, hasConfigAttribute, getConfigAttribute, observedConfigAttributes };
