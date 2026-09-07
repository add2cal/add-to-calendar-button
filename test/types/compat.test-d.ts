/**
 * Type compatibility gate (compile-only, no runtime).
 *
 * Two layers of assignability keep the public type surface honest:
 *  1. v2 -> current: everything a v2 consumer wrote against the frozen v2 public
 *     types (v2-public-types.d.ts) must keep satisfying the current public types.
 *  2. public -> internal: every value satisfying the current public types must be
 *     accepted by the internal implementation types.
 *
 * Run via `npm run typecheck` (tsc -p test/types/tsconfig.json).
 */
import type { V2ATCBActionEventConfig, V2AddToCalendarButtonType, V2EventDate } from './v2-public-types';
import { atcb_action, atcb_generate_ty, atcb_generate_timestring, atcb_decorate_data_dates, i18nStrings, cssStyles } from '../../src/index';
import type { ATCBActionEventConfig, AddToCalendarButtonType, EventDate } from '../../src/index';
import type { ATCBInputConfig, ATCBDateEntryInput } from '../../src/types';

// helper: compile-time assignability assertions
type Extends<A, B> = A extends B ? true : false;
type Assert<T extends true> = T;

// 1. v2 consumer values keep satisfying the current public types
export type V2ActionConfigStillValid = Assert<Extends<V2ATCBActionEventConfig, ATCBActionEventConfig>>;
export type V2WcConfigStillValid = Assert<Extends<V2AddToCalendarButtonType, AddToCalendarButtonType>>;
export type V2EventDateStillValid = Assert<Extends<V2EventDate, EventDate>>;

// 2. the public action config must be accepted by the real atcb_action parameter type
export type ActionConfigAssignable = Assert<Extends<ATCBActionEventConfig, ATCBInputConfig>>;

// 3. the public web component attribute type must be accepted by the internal input config
export type WcConfigAssignable = Assert<Extends<AddToCalendarButtonType, ATCBInputConfig>>;

// 4. the public EventDate must be accepted where date entries go
export type EventDateAssignable = Assert<Extends<EventDate, ATCBDateEntryInput>>;

// 5. atcb_action accepts v2-typed and current-typed config objects and returns Promise<string>
declare const v2Config: V2ATCBActionEventConfig;
declare const publicConfig: ATCBActionEventConfig;
declare const trigger: HTMLElement;
export const v2ActionResult: Promise<string> = atcb_action(v2Config, trigger, false);
export const actionResult: Promise<string> = atcb_action(publicConfig, trigger, false);
export const actionResultNoTrigger: Promise<string> = atcb_action(publicConfig);

// 6. representative v2 consumer literal keeps compiling against the real implementation
export const literalCall: Promise<string> = atcb_action({
  name: 'Compat Check',
  startDate: '2050-06-15',
  startTime: '10:00',
  endTime: '11:00',
  timeZone: 'America/New_York',
  options: ['Google', 'Apple', 'iCal'],
  listStyle: 'modal',
  buttonStyle: 'date',
  lightMode: 'bodyScheme',
  language: 'de',
  recurrence_byDay: 'MO,WE',
  recurrence_count: 5,
  subscribe: false,
});

// 6b. the v3 official lowercase values compile equally (options keys + status)
export const officialNamesCall: Promise<string> = atcb_action({
  prokey: '00000000-0000-0000-0000-000000000000',
  name: 'Official Names Check',
  startDate: '2050-06-15',
  status: 'confirmed',
  options: ['apple', 'google', 'ical', 'ms365', 'msteams', 'outlookcom', 'yahoo'],
});

// @ts-expect-error proKey was replaced by the official lowercase prokey spelling in v3
atcb_action({ proKey: 'legacy-casing' });

// 6c. legacy uppercase status and v2 option spellings stay accepted side by side
export const mixedAliasCall: Promise<string> = atcb_action({
  name: 'Alias Check',
  startDate: '2050-06-15',
  status: 'CANCELLED',
  options: ['Apple', 'google', 'Outlook.com', 'ms365'],
});

// 7. secondary public exports keep their contracts
export const tyResult: ReturnType<typeof atcb_generate_ty> = atcb_generate_ty(trigger, {});
declare const eventDates: EventDate[];
export const timestringResult: string[] = atcb_generate_timestring(eventDates, 'en', 1, true);
export const decorateResult: object = atcb_decorate_data_dates({ dates: eventDates });
export const i18nCheck: { [key: string]: { [key: string]: string } } = i18nStrings;
export const cssCheck: { [key: string]: string } = cssStyles;

// 8. the global element declarations resolve (tag name map + typed attribute surface)
export const globalTagType: HTMLElement & AddToCalendarButtonType = document.createElement('add-to-calendar-button');
