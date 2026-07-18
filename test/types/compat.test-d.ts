/**
 * Type compatibility gate (compile-only, no runtime).
 *
 * Asserts that the NEW internal source types remain assignable-compatible with the
 * CURRENT hand-written public types in index.d.ts: everything a v2 consumer wrote
 * against the public types must keep compiling against the real implementation.
 *
 * Run via `npm run typecheck` (tsc -p test/types/tsconfig.json).
 */
import type { ATCBActionEventConfig, AddToCalendarButtonType, EventDate } from '../../index';
import { atcb_action, atcb_generate_ty, atcb_generate_timestring, atcb_decorate_data_dates, i18nStrings, cssStyles } from '../../src/index';
import type { ATCBInputConfig, ATCBDateEntryInput } from '../../src/types';

// helper: compile-time assignability assertions
type Extends<A, B> = A extends B ? true : false;
type Assert<T extends true> = T;

// 1. the public action config must be accepted by the real atcb_action parameter type
export type ActionConfigAssignable = Assert<Extends<ATCBActionEventConfig, ATCBInputConfig>>;

// 2. the public web component attribute type must be accepted by the internal input config
export type WcConfigAssignable = Assert<Extends<AddToCalendarButtonType, ATCBInputConfig>>;

// 3. the public EventDate must be accepted where date entries go
export type EventDateAssignable = Assert<Extends<EventDate, ATCBDateEntryInput>>;

// 4. atcb_action accepts a public-typed config object and returns Promise<string>
declare const publicConfig: ATCBActionEventConfig;
declare const trigger: HTMLElement;
export const actionResult: Promise<string> = atcb_action(publicConfig, trigger, false);
export const actionResultNoTrigger: Promise<string> = atcb_action(publicConfig);

// 5. representative v2 consumer literal keeps compiling against the real implementation
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

// 6. secondary public exports keep their contracts
export const tyResult: ReturnType<typeof atcb_generate_ty> = atcb_generate_ty(trigger, {});
declare const eventDates: EventDate[];
export const timestringResult: string[] = atcb_generate_timestring(eventDates, 'en', 1, true);
export const decorateResult: object = atcb_decorate_data_dates({ dates: eventDates });
export const i18nCheck: { [key: string]: { [key: string]: string } } = i18nStrings;
export const cssCheck: { [key: string]: string } = cssStyles;
