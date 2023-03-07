/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefaultButtonStyle, DefaultListStyle, DefaultTrigger, Size } from '@/models/addToCalendarButton';
import { AttrsKey, ComponentAttrKeyMap, DateAttrsKey, DateRecurrenceAttrsKey, LayoutAttrsKey, type Attrs } from '@/models/attrs';
import { DefaultLanguageCode } from '@/models/language';
import { getAvailableTimezones } from '@/utils/timezone';

import { getDefaultDateRecurrenceAttrs, getDefaultDateAttrs, getDefaultLayoutAttrs, getDefaultAttrs } from './default';

export { getDefaultDateRecurrenceAttrs, getDefaultDateAttrs, getDefaultLayoutAttrs, getDefaultAttrs };

const mapAttrsField = (obj: any, key: string) => {
  let value = obj[key];

  switch (key) {
    case AttrsKey.TIMEZONE: {
      if (!getAvailableTimezones().includes(value)) {
        value = null;
      }
      break;
    }
    case AttrsKey.STATUS: {
      if (!!value && typeof value === 'string') {
        value = value.toUpperCase();
      }
      break;
    }
    case AttrsKey.ORGANIZER: {
      const name = value[AttrsKey.ORGANIZER_NAME];
      const email = value[AttrsKey.ORGANIZER_EMAIL];
      value = name && email ? `${name}|${email}` : '';
      break;
    }
    case DateRecurrenceAttrsKey.RRULE_VALUE: {
      if (obj[DateRecurrenceAttrsKey.IS_SIMPLE]) {
        value = '';
      }
      break;
    }
    case DateRecurrenceAttrsKey.FREQUENCY:
    case DateRecurrenceAttrsKey.INTERVAL:
    case DateRecurrenceAttrsKey.COUNT:
    case DateRecurrenceAttrsKey.BY_DAY:
    case DateRecurrenceAttrsKey.BY_MONTH:
    case DateRecurrenceAttrsKey.BY_MONTH_DAY: {
      if (obj[DateRecurrenceAttrsKey.IS_SIMPLE]) {
        if (Array.isArray(value)) {
          value = value.join();
        } else if (!isNaN(+value)) {
          value = +value;
        }
      } else {
        value = '';
      }
      break;
    }
    case AttrsKey.OPTIONS: {
      if (Array.isArray(value)) {
        value = value.map((item) => `'${item}'`).join();
      }
      break;
    }
    case AttrsKey.BUTTON_STYLE: {
      if (value === DefaultButtonStyle) {
        value = null;
      }
      break;
    }
    case AttrsKey.LIST_STYLE: {
      if (value === DefaultListStyle) {
        value = null;
      }
      break;
    }
    case AttrsKey.TRIGGER: {
      if (value === DefaultTrigger) {
        value = null;
      }
      break;
    }
    case AttrsKey.SIZE: {
      if (value === '' || isNaN(+value) || +value < Size.min || +value > Size.max) {
        value = Size.default;
      }
      value = +value;
      break;
    }
    case AttrsKey.LANGUAGE: {
      if (value === DefaultLanguageCode) {
        value = null;
      }
      break;
    }
  }

  return value;
};

export const mapAttrsObject = (attrs: Attrs) => {
  const data: { [key: string]: any } = {};

  const allAttrs: { [key: string]: any } = {
    ...attrs.date,
    ...attrs.layout,
  };

  const mapObject = (obj: any) => {
    Object.keys(obj).forEach((key: string) => {
      const value = mapAttrsField(obj, key);
      const componentAttrKey = ComponentAttrKeyMap[key];
      if (componentAttrKey && (value || (key == LayoutAttrsKey.SIZE && value == '0'))) {
        data[componentAttrKey] = value;
      }

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        mapObject(value);
      }
    });
  };

  mapObject(allAttrs);

  return data;
};

export const attrsToHtmlString = (attrs: Attrs) => {
  let html = '<add-to-calendar-button \n';

  const addAttr = (key: string, value: any) => {
    const componentAttrKey = ComponentAttrKeyMap[key];
    if (componentAttrKey) {
      html += `  ${componentAttrKey}`;

      if (value !== true) {
        html += `="${value}"`;
      }

      html += '\n';
    }
  };

  const allAttrs: { [key: string]: any } = {
    ...attrs.date,
    ...attrs.layout,
  };
  const defaultAttrs = { ...getDefaultAttrs('', '', '').date, ...getDefaultAttrs('', '', '').layout };
  const requiredAttrs: string[] = [DateAttrsKey.NAME, DateAttrsKey.START_DATE, DateAttrsKey.START_TIME, DateAttrsKey.END_TIME, DateAttrsKey.TIMEZONE, LayoutAttrsKey.OPTIONS];

  const proceedAttr = (obj: any, defaultObj: any) => {
    Object.keys(obj).forEach((key: string) => {
      const defaultValue = mapAttrsField(defaultObj, key);
      const mappedValue = mapAttrsField(obj, key);

      if ((mappedValue || (key == LayoutAttrsKey.SIZE && mappedValue == '0')) && (defaultValue !== mappedValue || (defaultValue === mappedValue && requiredAttrs.includes(key)))) {
        addAttr(key, mappedValue);
      }

      const value = obj[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        proceedAttr(value, defaultObj[key]);
      }
    });
  };

  proceedAttr(allAttrs, defaultAttrs);

  html += '></add-to-calendar-button>';

  return html;
};
