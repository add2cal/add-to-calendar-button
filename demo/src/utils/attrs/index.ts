import { DefaultButtonStyle, DefaultTrigger, Size } from '@/models/addToCalendarButton';
import { AttrsKey, ComponentAttrKeyMap, DateRecurrenceAttrsKey, type Attrs } from '@/models/attrs';
import { DefaultLanguage } from '@/models/language';
import { getAvailableTimezones } from '@/utils/timezone';

import { getDefaultDateRecurrenceAttrs, getDefaultDateAttrs, getDefaultLayoutAttrs, getDefaultAttrs } from './default';

export { getDefaultDateRecurrenceAttrs, getDefaultDateAttrs, getDefaultLayoutAttrs, getDefaultAttrs };

export const mapAttrsObject = (attrs: Attrs) => {
  const data: { [key: string]: any } = {};

  const allAttrs: { [key: string]: any } = {
    ...attrs.date,
    ...attrs.layout,
  };

  const mapObject = (obj: any) => {
    Object.keys(obj).forEach((key: string) => {
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
          if (isNaN(+value) || +value < Size.min || +value > Size.max) {
            value = Size.default;
          }
          break;
        }
        case AttrsKey.LANGUAGE: {
          if (value === DefaultLanguage) {
            value = null;
          }
          break;
        }
        default: {
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            mapObject(value);
          }
          break;
        }
      }

      const componentAttrKey = ComponentAttrKeyMap[key];
      if (componentAttrKey) {
        data[componentAttrKey] = value;
      }
    });
  };

  mapObject(allAttrs);

  return data;
};
