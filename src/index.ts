/**
 * Main package entry (ES module / CommonJS via build).
 * Mirrors the public export surface of the former Grunt "module" build:
 * importing this module registers the <add-to-calendar-button> custom element
 * (side effect of atcb-init.js) and exposes the imperative API.
 */
export { atcb_action } from './action/index';
export { i18nStrings } from './i18n/index';
export { atcbCssTemplate as cssStyles, atcb_register_style } from './styles/css-template';
export { atcb_generate_ty } from './ui/pro';
export { atcb_generate_timestring } from './core/dates';
export { atcb_decorate_data_dates } from './core/decorate';
