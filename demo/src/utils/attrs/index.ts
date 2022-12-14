import { DefaultButtonStyle, DefaultTrigger, Size } from '@/models/addToCalendarButton';
import { AttrsKey, ComponentAttrKeyMap, DateRecurrenceAttrsKey, type Attrs } from '@/models/attrs';
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
    case DateRecurrenceAttrsKey.INTERVAL:
    case DateRecurrenceAttrsKey.COUNT:
    case DateRecurrenceAttrsKey.BY_DAY:
    case DateRecurrenceAttrsKey.BY_MONTH:
    case DateRecurrenceAttrsKey.BY_MONTH_DAY: {
      if (obj[DateRecurrenceAttrsKey.IS_SIMPLE]) {
        if (Array.isArray(value)) {
          value = value.join();
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
      if (componentAttrKey) {
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
  const allAttrs: { [key: string]: any } = {
    ...attrs.date,
    ...attrs.layout,
  };

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

  const defaultAttrs = { ...getDefaultAttrs().date, ...getDefaultAttrs().layout };

  const proceedAttr = (obj: any) => {
    Object.keys(obj).forEach((key: string) => {
      const value = allAttrs[key];
      const defaultValue = defaultAttrs[key as keyof typeof defaultAttrs];
      const mappedValue = mapAttrsField(obj, key);

      //TODO: The following makes no sense.
      // First: if the first block only gets accessed when there is no mappedValue, why are we checking if the mappedValue equals the default in it?
      // Second: we might change the logic anyway, since we are using default values differently. Proposed approach: Add some new "list" of keys, where matching the default lead to them being not included. This list would contain: buttonStyle, trigger, dropdownStyle, size, lightMode, language. Then, go for addAttr always, except the key is on this list and its value equals the default, OR (for all keys) the value is null or empty or false (for all boolean attributes).
      if (!mappedValue) {
        if (JSON.stringify(value || null) !== JSON.stringify(defaultValue || null) && JSON.stringify(mappedValue || null) !== JSON.stringify(defaultValue || null)) {
          addAttr(key, mappedValue);
        }
      } else {
        addAttr(key, mappedValue);
      }

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        proceedAttr(value);
      }
    });
  };

  proceedAttr(allAttrs);

  html += '></add-to-calendar-button>';

  return html;
};
