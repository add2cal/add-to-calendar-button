/**
 * Browser bundle entry (classic <script> tag usage, IIFE build).
 * Importing atcb-init.js registers the <add-to-calendar-button> custom element;
 * the only global exposed is window.atcb_action (matching the former Grunt wrapper).
 */
import { atcb_action } from './atcb-init.js';

window.atcb_action = function (data, triggerElement, keyboardTrigger = false) {
  return atcb_action(data, triggerElement, keyboardTrigger);
};
