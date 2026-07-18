/**
 * Browser bundle entry (classic <script> tag usage, IIFE build).
 * Importing atcb-init.js registers the <add-to-calendar-button> custom element;
 * the only global exposed is window.atcb_action (matching the former Grunt wrapper).
 */
import { atcb_action } from './action/index';
import type { ATCBInputConfig } from './types';

window.atcb_action = function (data: ATCBInputConfig, triggerElement?: HTMLElement, keyboardTrigger = false): Promise<string> {
  return atcb_action(data, triggerElement, keyboardTrigger);
};
