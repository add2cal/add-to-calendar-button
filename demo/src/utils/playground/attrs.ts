import { DefaultButtonStyle, DefaultListStyle, DefaultTrigger, Size } from '../../models/addToCalendarButton';
import { AttrsKey, ComponentAttrKeyMap, DateAttrsKey, DateRecurrenceAttrsKey, LayoutAttrsKey, type Attrs } from '../../models/attrs';
import { DefaultLanguageCode } from '../../models/language';
import { getDefaultAttrs } from './default';
import { getAvailableTimezones } from './timezone';

const ownValue = (object: Record<string, unknown>, key: string) =>
  Object.entries(object)
    .find(([entryKey]) => entryKey === key)
    ?.at(1);

const mapField = (object: Record<string, unknown>, key: string, rawValue: unknown): unknown => {
  let value = rawValue;
  switch (key) {
    case AttrsKey.TIMEZONE:
      if (!getAvailableTimezones().includes(value as string)) value = null;
      break;
    case AttrsKey.STATUS:
      if (typeof value === 'string') value = value.toUpperCase();
      break;
    case AttrsKey.ORGANIZER: {
      const organizer = value as Record<string, string>;
      const name = organizer ? ownValue(organizer, AttrsKey.ORGANIZER_NAME) : undefined;
      const email = organizer ? ownValue(organizer, AttrsKey.ORGANIZER_EMAIL) : undefined;
      value = name && email ? `${name}|${email}` : '';
      break;
    }
    case DateRecurrenceAttrsKey.RRULE_VALUE:
      if (ownValue(object, DateRecurrenceAttrsKey.IS_SIMPLE)) value = '';
      break;
    case DateRecurrenceAttrsKey.FREQUENCY:
    case DateRecurrenceAttrsKey.INTERVAL:
    case DateRecurrenceAttrsKey.COUNT:
    case DateRecurrenceAttrsKey.BY_DAY:
    case DateRecurrenceAttrsKey.BY_MONTH:
    case DateRecurrenceAttrsKey.BY_MONTH_DAY:
      if (ownValue(object, DateRecurrenceAttrsKey.IS_SIMPLE)) value = Array.isArray(value) ? value.join() : value !== '' && !Number.isNaN(Number(value)) ? Number(value) : value;
      else value = '';
      break;
    case AttrsKey.OPTIONS:
      if (Array.isArray(value)) value = value.map((item) => `'${item}'`).join();
      break;
    case AttrsKey.BUTTON_STYLE:
      if (value === DefaultButtonStyle) value = null;
      break;
    case AttrsKey.LIST_STYLE:
      if (value === DefaultListStyle) value = null;
      break;
    case AttrsKey.TRIGGER:
      if (value === DefaultTrigger) value = null;
      break;
    case AttrsKey.SIZE:
      value = value === '' || Number.isNaN(Number(value)) || Number(value) < Size.min || Number(value) > Size.max ? Size.default : Number(value);
      break;
    case AttrsKey.LANGUAGE:
      if (value === DefaultLanguageCode) value = null;
  }
  return value;
};

export const mapAttrsObject = (attrs: Attrs): Record<string, string | number | boolean> => {
  const output: Array<[string, string | number | boolean]> = [];
  const visit = (object: Record<string, unknown>) =>
    Object.entries(object).forEach(([key, rawValue]) => {
      const value = mapField(object, key, rawValue);
      const attribute = ComponentAttrKeyMap.get(key);
      if (attribute && (value || (key === LayoutAttrsKey.SIZE && value === 0))) output.push([attribute, value as string | number | boolean]);
      if (value && typeof value === 'object' && !Array.isArray(value)) visit(value as Record<string, unknown>);
    });
  visit({ ...attrs.date, ...attrs.layout });
  return Object.fromEntries(output);
};

const escapeAttribute = (value: unknown) => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

export const attrsToHtmlString = (attrs: Attrs): string => {
  const defaults = getDefaultAttrs('', '', '');
  const defaultFields = { ...defaults.date, ...defaults.layout } as Record<string, unknown>;
  const required = [DateAttrsKey.NAME, DateAttrsKey.START_DATE, DateAttrsKey.START_TIME, DateAttrsKey.END_TIME, DateAttrsKey.TIMEZONE, LayoutAttrsKey.OPTIONS];
  const lines: string[] = [];
  const visit = (object: Record<string, unknown>, defaultObject: Record<string, unknown>) =>
    Object.entries(object).forEach(([key, raw]) => {
      const value = mapField(object, key, raw);
      const defaultRaw = ownValue(defaultObject, key);
      const defaultValue = mapField(defaultObject, key, defaultRaw);
      const attribute = ComponentAttrKeyMap.get(key);
      if (attribute && (value || (key === LayoutAttrsKey.SIZE && value === 0)) && (value !== defaultValue || required.includes(key as never))) lines.push(value === true ? `  ${attribute}` : `  ${attribute}="${escapeAttribute(value)}"`);
      if (raw && typeof raw === 'object' && !Array.isArray(raw)) visit(raw as Record<string, unknown>, (defaultRaw || {}) as Record<string, unknown>);
    });
  visit({ ...attrs.date, ...attrs.layout }, defaultFields);
  return `<add-to-calendar-button\n${lines.join('\n')}\n></add-to-calendar-button>`;
};
