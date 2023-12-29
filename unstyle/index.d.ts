/* eslint-disable no-unused-vars */
import type { ATCBActionEventConfig, AddToCalendarButtonType, EventDate, CustomLabelsObjectType } from '../index.d';

// MODULE
// unstyle
declare module 'add-to-calendar-button/unstyle' {
  export function atcb_action(config: ATCBActionEventConfig, triggerElement?: HTMLElement, keyboardTrigger?: boolean): Promise<string>;
  export function atcb_generate_ty(host: HTMLElement, data: object): null;
  export function atcb_generate_timestring(dates: EventDate[], language?: string, subEvent?: string | number, decorate?: boolean, browserTimeOverride?: boolean, enforceYear?: boolean, hideTimeZone?: boolean): string[];
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
