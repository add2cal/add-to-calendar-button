/**
 * lit-html templates for the button rendering path.
 *
 * These templates produce the same DOM as the imperative ui builders (generate_label,
 * date-button rendering and the trigger parts of generate_label /
 * generate_label_content) 1:1 - every class, part, id, aria attribute and
 * event wiring is behavior-identical. The transient interaction layers (dropdown
 * list, modal, overlay) stay imperative by design; they are event-driven,
 * positioned and removed outside the reactive render cycle.
 */
import { html, nothing, render } from 'lit';
import type { TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { icons } from '../core/globals';
import { toggle } from './control';
import { generate_links } from '../generators/index';
import { generate_time, generate_timestring } from '../core/dates';
import { set_sizes } from './positioning';
import { debounce_leading } from '../core/util';
import { translate_hook } from '../i18n/index';
import { log_event } from '../core/events';
import { generate_rsvp_form } from './pro';
import type { ATCBConfig } from '../types';

// ---------- label content helpers (trigger / singleton path) ----------

function defaultTriggerText(data: ATCBConfig): string {
  if (data.pastDateHandling != 'none') {
    let allOverdue = true;
    for (let i = 0; i < data.dates!.length; i++) {
      if (!data.dates![`${i}`]!.overdue) {
        allOverdue = false;
        break;
      }
    }
    if (allOverdue) {
      return translate_hook('expired', data);
    }
  }
  return translate_hook('label.addtocalendar', data);
}

function labelText(data: ATCBConfig, type: string, text: string): string {
  if (text !== '') return text;
  if (data.options!.length === 1 || type === 'trigger') {
    return defaultTriggerText(data);
  }
  if (type === 'close') {
    return translate_hook('close', data);
  }
  return translate_hook(type, data);
}

function labelAriaLabel(data: ATCBConfig, type: string, text: string, oneOption: boolean): string {
  if (oneOption) {
    return translate_hook('label.addtocalendar', data) + ' (' + translate_hook(type, data) + '): ' + data.name;
  }
  if (type === 'trigger') {
    return text + ': ' + data.name;
  }
  return text;
}

function iconTemplate(type: string): TemplateResult {
  return html`<div class="atcb-icon atcb-icon-${type}" part=${type === 'trigger' ? 'atcb-button-icon' : 'atcb-list-icon'}>${unsafeHTML(icons[`${type}`]!)}</div>`;
}

// ---------- trigger / singleton event handlers ----------

function triggerListeners(host: ShadowRoot, data: ATCBConfig, type: string) {
  const toggleAuto = (parent: HTMLElement, keyboard: boolean) => {
    if (type === 'rsvp' && typeof generate_rsvp_form === 'function') {
      generate_rsvp_form(host, data, parent, keyboard);
    } else {
      toggle(host, 'auto', data, parent, keyboard, true);
    }
  };
  const touchendHandler = debounce_leading((event: TouchEvent) => {
    event.preventDefault();
    toggleAuto(event.currentTarget as HTMLElement, false);
  });
  const mouseupHandler = debounce_leading((event: MouseEvent) => {
    event.preventDefault();
    toggleAuto(event.currentTarget as HTMLElement, false);
  });
  return {
    keyup: (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.code == 'Space') {
        event.preventDefault();
        if (type === 'rsvp' && typeof generate_rsvp_form === 'function') {
          generate_rsvp_form(host, data, event.currentTarget as HTMLElement, true);
        } else {
          toggle(host, 'auto', data, event.currentTarget as HTMLElement, true, true);
        }
      }
    },
    touchend: touchendHandler,
    mouseup: data.trigger === 'click' || type === 'rsvp' ? mouseupHandler : undefined,
    mouseenter:
      data.trigger !== 'click' && type !== 'rsvp'
        ? (event: MouseEvent) => {
            toggle(host, 'open', data, event.currentTarget as HTMLElement, false, true);
          }
        : undefined,
  };
}

function singletonListeners(host: ShadowRoot, data: ATCBConfig, type: string) {
  const clickHandler = debounce_leading(async (event: Event) => {
    const parent = event.currentTarget as HTMLElement;
    (host.querySelector('#' + parent.id) as HTMLElement | null)?.blur();
    log_event('openSingletonLink', parent.id, data.identifier as string);
    await generate_links(host, type, data);
  });
  return {
    click: clickHandler,
    keyup: async (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        const parent = event.currentTarget as HTMLElement;
        (host.querySelector('#' + parent.id) as HTMLElement | null)?.blur();
        log_event('openSingletonLink', parent.id, data.identifier as string);
        await generate_links(host, type, data, 'all', true);
      }
    },
  };
}

// ---------- date-style button content ----------

function dateButtonAriaLabel(data: ATCBConfig, subEvent: number, subEventAll: boolean, hoverText: string, fullTimeInfo: string[], oneOption: boolean): string {
  const btnHeadlineText = data.dates!.length > 1 && subEventAll ? data.name : data.dates![`${subEvent}`]!.name;
  // the visual button abbreviates the date - the label must stand on its own for
  // assistive tech: always include the year, announce recurrence, and never emit
  // dangling separators for missing parts
  const detailedTimeInfo = (function () {
    const withYear = generate_timestring(data.dates!, data.formatLocale || data.language, subEvent, false, false, true);
    if (withYear.length > 0) {
      return withYear.join(' ');
    }
    return fullTimeInfo.join(' ');
  })();
  const parts: string[] = [hoverText.replace(/<br>/g, ' ').replace(/\+\s/g, '') + (oneOption ? ' (' + translate_hook(data.options![0] as string, data) + ')' : '') + ': ' + btnHeadlineText];
  if (data.dates![`${subEvent}`]!.location && data.dates![`${subEvent}`]!.location !== '') {
    parts.push(data.dates![`${subEvent}`]!.location as string);
  }
  if (detailedTimeInfo !== '') {
    parts.push(detailedTimeInfo);
  }
  if (data.recurrence && data.recurrence !== '') {
    parts.push(translate_hook('recurring', data));
  }
  return parts.join(', ');
}

function dateButtonMeta(data: ATCBConfig, subEventIn: string | number = 'all', forceFullDate: boolean = false) {
  let subEvent: string | number = subEventIn;
  if (subEvent !== 'all') {
    subEvent = parseInt(subEvent as string) - 1;
  } else if (data.dates!.length === 1) {
    subEvent = 0;
  }
  const fullTimeInfo = generate_timestring(data.dates!, data.formatLocale || data.language, subEvent as 'all' | number, false, false, forceFullDate);
  const hoverText = (function () {
    if ((subEvent !== 'all' && data.dates![`${subEvent}`]!.status === 'cancelled') || (subEvent === 'all' && data.allCancelled)) {
      return translate_hook('date.status.cancelled', data) + '<br>' + translate_hook('date.status.cancelled_cta', data);
    }
    if (data.pastDateHandling !== 'none') {
      if ((subEvent === 'all' && data.allOverdue) || (subEvent !== 'all' && data.dates![`${subEvent}`]!.overdue)) {
        return translate_hook('expired', data);
      }
    }
    if (data.label && data.label !== '') {
      return data.label;
    }
    return translate_hook('label.addtocalendar', data);
  })();
  const cancelledInfo = (function () {
    if ((subEvent !== 'all' && data.dates![`${subEvent}`]!.status === 'cancelled') || (subEvent === 'all' && data.allCancelled)) {
      return translate_hook('date.status.cancelled', data);
    }
    return '';
  })();
  const recurringString = (function () {
    if (fullTimeInfo.length === 0) {
      return translate_hook('recurring', data) + ' &#x27F3;';
    }
    return '&#x27F3;';
  })();
  let subEventAll = false;
  if (subEvent === 'all') {
    subEvent = 0;
    if (!data.allOverdue) {
      for (let i = 0; i < data.dates!.length; i++) {
        if (!data.dates![`${i}`]!.overdue) {
          subEvent = i;
          break;
        }
      }
    }
    subEventAll = true;
  }
  return { subEvent: subEvent as number, subEventAll, fullTimeInfo, hoverText, cancelledInfo, recurringString };
}

function dateButtonContentTemplate(data: ATCBConfig, subEventIn: string | number = 'all', forceFullDate: boolean = false): TemplateResult {
  const { subEvent, subEventAll, fullTimeInfo, hoverText, cancelledInfo, recurringString } = dateButtonMeta(data, subEventIn, forceFullDate);
  const startDate = new Date(generate_time(data.dates![`${subEvent}`]!).start);
  const allDay = generate_time(data.dates![`${subEvent}`]!).allday;
  const timeZone = data.dates![`${subEvent}`]!.timeZone;
  const btnHeadlineText = data.dates!.length > 1 && subEventAll ? data.name : data.dates![`${subEvent}`]!.name;
  const hasLocationLine = (data.dates![`${subEvent}`]!.location && data.dates![`${subEvent}`]!.location !== '' && !data.dates![`${subEvent}`]!.onlineEvent) || cancelledInfo !== '';
  const hasDescriptionFallback = !hasLocationLine && data.dates![`${subEvent}`]!.description !== '' && fullTimeInfo.length === 0 && (!data.recurrence || data.recurrence === '');
  const centerHeadline = !hasLocationLine && !hasDescriptionFallback && fullTimeInfo.length == 0 && (data.recurrence == null || data.recurrence == '');
  const headlineStyle = !hasLocationLine && !hasDescriptionFallback ? `line-clamp:2;${centerHeadline ? 'text-align:center;' : ''}` : '';
  return html`<div class="atcb-date-btn-left">
      <div class="atcb-date-btn-day">${startDate.toLocaleString(data.formatLocale || data.language, { day: 'numeric', timeZone: allDay ? 'UTC' : (timeZone as string) })}</div>
      <div class="atcb-date-btn-month">${startDate.toLocaleString(data.formatLocale || data.language, { month: 'short', timeZone: allDay ? 'UTC' : (timeZone as string) })}</div>
    </div>
    <div class="atcb-date-btn-right" style=${centerHeadline ? 'align-self:center' : nothing}>
      <div class="atcb-date-btn-details">
        <div class="atcb-date-btn-headline" style=${headlineStyle !== '' ? headlineStyle : nothing}>${btnHeadlineText as string}</div>
        ${
          hasLocationLine
            ? cancelledInfo != ''
              ? html`<div class="atcb-date-btn-content atcb-date-btn-cancelled">${cancelledInfo}</div>`
              : html`<div class="atcb-date-btn-content">
                <span class="atcb-date-btn-content-icon">${unsafeHTML(icons['pin']!)}</span>
                <span class="atcb-date-btn-content-location">${data.dates![`${subEvent}`]!.location as string}</span>
              </div>`
            : hasDescriptionFallback
              ? html`<div class="atcb-date-btn-content" style="overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2">${data.dates![`${subEvent}`]!.descriptionHtmlFree as string}</div>`
              : nothing
        }
        ${
          fullTimeInfo.length > 0 || (data.recurrence != null && data.recurrence != '')
            ? html`<div class="atcb-date-btn-content">
              <span class="atcb-date-btn-content-icon">${unsafeHTML(icons['clock']!)}</span>
              <span class="atcb-date-btn-content-text">
                ${fullTimeInfo.map((block: string) => html`<span>${block}</span>`)}${data.recurrence != null && data.recurrence != '' ? html`<span>${unsafeHTML(recurringString)}</span>` : nothing}
              </span>
            </div>`
            : nothing
        }
      </div>
      <div class="atcb-date-btn-hover">${unsafeHTML(hoverText as string)}</div>
    </div>
    ${!data.hideCheckmark && data.dates![`${subEvent}`]!.status !== 'cancelled' ? html`<div class="atcb-checkmark">${unsafeHTML(icons['checkmark']!)}</div>` : nothing}
    ${!data.dates![`${subEvent}`]!.overdue || data.pastDateHandling === 'none' ? html`<div class="atcb-date-btn-plus">${unsafeHTML(icons['plus']!)}</div>` : nothing}`;
}

// ---------- the button ----------

function buttonTemplate(host: ShadowRoot, data: ATCBConfig): TemplateResult {
  const oneOption = (function () {
    if (data.options!.length === 1 || (data.buttonsList && data.buttonStyle != 'date')) {
      return true;
    }
    return false;
  })();
  const optionSplit = oneOption ? data.options! : ['default'];
  const isDate = data.buttonStyle === 'date';
  return html`${optionSplit.map((option, index) => {
    // id rules: singleton buttons carry the identifier; buttonsList entries append the option
    const buttonId = oneOption && data.buttonsList ? data.identifier + '-' + option : (data.identifier as string);
    // label text (buttonsList with multiple options uses the option label)
    const label = (function () {
      if (oneOption && data.buttonsList && data.options!.length > 1) {
        return translate_hook(`${data.options![`${index}`]}`, data);
      }
      return data.label;
    })();
    // label-content type coercion: non-buttonsList singletons render like a trigger
    const contentType = oneOption ? (!data.buttonsList ? 'trigger' : option) : 'trigger';
    const text = labelText(data, contentType, label ?? '');
    const showText = ((contentType === 'trigger' || oneOption) && !data.hideTextLabelButton) || (!oneOption && contentType !== 'trigger' && !data.hideTextLabelList);
    // listener wiring mirrors generate_label: singletons (incl. date style) get the
    // option handlers, everything else the trigger handlers
    const handlers = oneOption ? singletonListeners(host, data, option) : triggerListeners(host, data, 'trigger');
    const interactive = !data.blockInteraction;
    const meta = isDate ? dateButtonMeta(data, 'all', false) : null;
    const ariaLabel = isDate ? dateButtonAriaLabel(data, meta!.subEvent, meta!.subEventAll, meta!.hoverText, meta!.fullTimeInfo, oneOption) : labelAriaLabel(data, contentType, text, oneOption);
    const showLabelAria = !(isDate && (contentType === 'trigger' || oneOption));
    return html`<div class="atcb-button-wrapper${data.rtl ? ' atcb-rtl' : ''}" part="atcb-button-wrapper">
      <button
        type="button"
        class="atcb-button${data.hideTextLabelButton ? ' atcb-no-text' : ''}${data.trigger === 'click' ? ' atcb-click' : ''}${data.listStyle === 'overlay' ? ' atcb-dropoverlay' : ''}${oneOption ? ' atcb-single' : ''}"
        part="atcb-button"
        id=${buttonId}
        disabled=${data.disabled ? 'true' : nothing}
        aria-haspopup=${!oneOption ? 'true' : nothing}
        aria-expanded="false"
        aria-label=${isDate ? ariaLabel : showLabelAria ? ariaLabel : nothing}
        @keyup=${interactive ? handlers.keyup : nothing}
        @touchend=${interactive && 'touchend' in handlers ? handlers.touchend : nothing}
        @mouseup=${interactive && 'mouseup' in handlers && handlers.mouseup ? handlers.mouseup : nothing}
        @mouseenter=${interactive && 'mouseenter' in handlers && handlers.mouseenter ? handlers.mouseenter : nothing}
        @click=${interactive && 'click' in handlers ? handlers.click : nothing}
      >
        ${isDate ? dateButtonContentTemplate(data, 'all', false) : nothing}
        ${!isDate && !data.hideIconButton ? iconTemplate(contentType === 'trigger' ? 'trigger' : option) : nothing}${!isDate && showText ? html`<span class="atcb-text" part=${contentType === 'trigger' ? 'atcb-button-text' : 'atcb-list-text'}>${text}</span>` : nothing}
        ${!isDate && contentType === 'trigger' && !oneOption && !data.buttonsList && !data.hideTextLabelButton ? html`<div class="atcb-chevron" part="atcb-button-chevron">${unsafeHTML(icons['chevron']!)}</div>` : nothing}
        ${!oneOption ? html`<div class="atcb-dropdown-anchor"></div>` : nothing}
        ${!data.hideCheckmark && !data.hideTextLabelButton && !data.buttonsList && !data.disabled && !data.allCancelled ? html`<div class="atcb-checkmark">${unsafeHTML(icons['checkmark']!)}</div>` : nothing}
      </button>
    </div>`;
  })}`;
}

/**
 * Renders the date-style button CONTENT into an imperatively created parent
 * (used by the modal sub-event buttons) and sets the aria-label on the parent,
 * and sets the aria-label on that parent.
 */
function renderDateButtonContent(data: ATCBConfig, parent: HTMLElement, subEventIn: string | number = 'all', oneOption: boolean = false, forceFullDate: boolean = false): void {
  const meta = dateButtonMeta(data, subEventIn, forceFullDate);
  render(dateButtonContentTemplate(data, subEventIn, forceFullDate), parent);
  parent.setAttribute('aria-label', dateButtonAriaLabel(data, meta.subEvent, meta.subEventAll, meta.hoverText, meta.fullTimeInfo, oneOption));
}

/**
 * Renders the button template into a container and applies the post-render
 * imperative finishing (sizes on the wrapper elements) - shared by the element,
 * the PRO rsvp flow, and any standalone consumer.
 */
function renderButton(host: ShadowRoot, container: HTMLElement, data: ATCBConfig): void {
  render(buttonTemplate(host, data), container);
  container.querySelectorAll('.atcb-button-wrapper').forEach((wrapper) => {
    set_sizes(wrapper as HTMLElement, data.sizes!);
  });
  if (data.debug) {
    console.log('Add to Calendar Button "' + data.identifier + '" created');
  }
}

export { buttonTemplate, dateButtonContentTemplate, renderDateButtonContent, renderButton };
