import { generate_ical, static_ics_file } from '../generators/ical';
import { getOptionStates } from '../core/store';
import { log_event } from '../core/events';
import { saved_hook } from '../core/util';
import { isIOS } from '../core/globals';
import { toggle } from './control';
import type { ATCBConfig } from '../types';
import type { ATCBIcsAction } from '../generators/ical';

type IcsLinkContext = 'singleton' | 'list' | 'subevent';

const icsBlobUrls = new Map<string, Set<string>>();

function create_ics_blob_url(data: ATCBConfig, action: ATCBIcsAction): string {
  if (!(isIOS() || data.fakeIOS) || !action.content || typeof URL.createObjectURL !== 'function') return action.href;
  const url = URL.createObjectURL(new Blob([action.content], { type: 'text/calendar;charset=utf-8' }));
  const identifier = data.identifier!;
  const urls = icsBlobUrls.get(identifier) || new Set<string>();
  urls.add(url);
  icsBlobUrls.set(identifier, urls);
  return url;
}

function revoke_ics_blob_urls(identifier?: string): void {
  if (!identifier) return;
  const urls = icsBlobUrls.get(identifier);
  if (!urls) return;
  urls.forEach((url) => URL.revokeObjectURL(url));
  icsBlobUrls.delete(identifier);
}

function is_ics_option(type: string): boolean {
  return type === 'apple' || type === 'ical';
}

function can_group_ics(data: ATCBConfig): boolean {
  return !data.dates!.some((entry) => entry.status === 'cancelled') && data.dates!.every((entry) => (entry.organizer || '') === (data.dates![0]!.organizer || ''));
}

function complete_ics_link(host: ShadowRoot, data: ATCBConfig, type: string, subEvent: 'all' | number, context: IcsLinkContext, control: HTMLElement): void {
  const eventName = context === 'singleton' ? 'openSingletonLink' : context === 'subevent' ? 'openSubEventLink' : 'openCalendarLink';
  log_event(eventName, control.id, data.identifier as string);
  if (context === 'list') setTimeout(() => toggle(host, 'close'), 0);

  const states = Object.entries(getOptionStates(data.identifier!)).find(([option]) => option === type)?.[1];
  if (!states) return;
  if (subEvent === 'all') {
    states.forEach((value, index) => states.splice(index, 1, value + 1));
  } else if (data.dates!.find((_entry, index) => index === subEvent)?.status !== 'cancelled') {
    const value = states.find((_state, index) => index === subEvent) || 0;
    states.splice(subEvent, 1, value + 1);
  }
  if (states.every((value) => value > 0)) {
    host.getElementById(data.identifier as string)?.classList.add('atcb-saved');
    saved_hook(host, data);
    if (context === 'subevent') setTimeout(() => toggle(host, 'close'), 0);
  }
  control.classList.add('atcb-saved');
}

function replace_with_ics_anchor(host: ShadowRoot, data: ATCBConfig, control: HTMLElement, type: string, subEvent: 'all' | number, context: IcsLinkContext, action: ATCBIcsAction): HTMLAnchorElement {
  const anchor = document.createElement('a');
  for (const attribute of Array.from(control.attributes)) anchor.setAttribute(attribute.name, attribute.value);
  anchor.href = create_ics_blob_url(data, action);
  anchor.target = action.target;
  anchor.rel = 'noopener';
  if (action.kind === 'dynamic') anchor.download = action.filename + '.ics';
  delete anchor.dataset.atcbLinkPending;
  anchor.removeAttribute('disabled');
  while (control.firstChild) anchor.append(control.firstChild);
  anchor.addEventListener('click', () => complete_ics_link(host, data, type, subEvent, context, anchor));
  const focused = control.getRootNode() instanceof ShadowRoot && (control.getRootNode() as ShadowRoot).activeElement === control;
  control.replaceWith(anchor);
  if (focused) anchor.focus();
  return anchor;
}

function prepare_ics_link(host: ShadowRoot, data: ATCBConfig, control: HTMLElement, type: string, subEvent: 'all' | number = 'all', context: IcsLinkContext = 'list'): void {
  if (!is_ics_option(type) || data.subscribe || data.blockInteraction || data.disabled) return;
  if (subEvent === 'all' && data.dates!.length > 1 && !can_group_ics(data)) return;
  if (!data.proxy && static_ics_file(host, data, subEvent) !== '') return;
  control.dataset.atcbLinkPending = 'true';
  const blockPendingActivation = (event: Event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
  };
  control.addEventListener('click', blockPendingActivation, { capture: true });
  const identifier = data.identifier;
  setTimeout(() => {
    if (!control.isConnected || data.identifier !== identifier) return;
    let action: ATCBIcsAction | undefined;
    try {
      action = generate_ical(host, data, type, subEvent, false, true) as ATCBIcsAction | undefined;
    } catch {
      delete control.dataset.atcbLinkPending;
      control.removeEventListener('click', blockPendingActivation, { capture: true });
      return;
    }
    // Static files intentionally keep the established synthetic download path.
    if (!action || action.kind === 'static' || action.kind === 'assistance' || action.href === '') {
      delete control.dataset.atcbLinkPending;
      control.removeEventListener('click', blockPendingActivation, { capture: true });
      return;
    }
    replace_with_ics_anchor(host, data, control, type, subEvent, context, action);
  }, 0);
}

export { can_group_ics, is_ics_option, prepare_ics_link, revoke_ics_blob_urls };
