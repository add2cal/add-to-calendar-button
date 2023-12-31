/* eslint-disable no-unused-vars */
import type { ATCBActionEventConfig, AddToCalendarButtonType, EventDate, CustomLabelsObjectType } from '../index.d';

// MODULE
// no-pro-unstyle
declare module 'add-to-calendar-button/no-pro-unstyle' {
  export function atcb_action(config: ATCBActionEventConfig, triggerElement?: HTMLElement, keyboardTrigger?: boolean): Promise<string>;
}

// WEB COMPONENT DECLARATION
declare global {
  interface HTMLElementTagNameMap {
    'add-to-calendar-button': AddToCalendarButtonType;
  }
  namespace JSX {
    interface IntrinsicElements {
      ['add-to-calendar-button']: AddToCalendarButtonType;
    }
  }
}

export { ATCBActionEventConfig, AddToCalendarButtonType, EventDate, CustomLabelsObjectType };
