/**
 * Main package entry (ES module / CommonJS via build).
 * Mirrors the public export surface of the former Grunt "module" build:
 * importing this module registers the <add-to-calendar-button> custom element
 * (side effect of atcb-init.js) and exposes the imperative API.
 */
export { atcb_action } from './atcb-init';
export { i18nStrings } from './atcb-i18n';
export { atcbCssTemplate as cssStyles } from './atcb-globals';
export { atcb_generate_ty } from './atcb-generate-pro';
export { atcb_generate_timestring } from './atcb-util';
export { atcb_decorate_data_dates } from './atcb-decorate';
