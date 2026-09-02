import { secure_content, strip_unsafe_keys } from '../core/text';
import { icons } from '../core/globals';
import { ensure_locale, translate_hook } from '../i18n';
import { ensure_style } from '../styles/css-template';
import type { ATCBConfig, ATCBGroupOverviewConfig, ATCBInputConfig } from '../types';

type OverviewType = 'list' | 'cards' | 'compact';

interface OverviewDate {
  name?: string;
  description?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  timeZone?: string;
  location?: string;
}

interface OverviewResponseItem {
  prokey?: string;
  label?: string;
  dates?: OverviewDate[];
  rsvp?: boolean;
  rsvp_block?: string | number | null;
  recurrence?: unknown;
  recurrence_simple_type?: unknown;
}

interface OverviewEvent extends OverviewDate {
  prokey: string;
  title: string;
  year: number;
  month: number;
  hasRsvp: boolean;
}

interface RenderedGroupOverview {
  root: HTMLDivElement;
  style: HTMLStyleElement;
}

interface NormalizedOverviewConfig {
  yearsOnly: boolean;
  type: OverviewType;
  from: string;
  to?: string;
  noDetails: boolean;
  noAdd: boolean;
  customDomain?: string;
  addViaList: boolean;
}

function isoDate(year: number, month = 1, day = 1): string {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00Z`;
}

function normalize_config(input: ATCBGroupOverviewConfig | undefined, now: Date): NormalizedOverviewConfig {
  const config = strip_unsafe_keys(input || {}) as ATCBGroupOverviewConfig;
  const minimum = isoDate(now.getUTCFullYear() - 1);
  const validIso = (value: unknown): value is string => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value) && !isNaN(Date.parse(value));
  const from = validIso(config.from) && Date.parse(config.from) >= Date.parse(minimum) ? config.from : minimum;
  let to: string | undefined;
  if (config.to !== undefined) {
    if (!validIso(config.to) || Date.parse(config.to) < Date.parse(from)) {
      throw new Error('group-overview-config.to must be a UTC ISO datetime at or after from.');
    }
    to = config.to;
  }
  const domainInput = typeof config['custom-domain'] === 'string' ? config['custom-domain'].toLowerCase() : '';
  const domainParts = domainInput.split('.');
  const domain = domainParts.length > 1 && domainParts.every((part) => part.length > 0 && part.length <= 63 && /^[a-z0-9-]+$/.test(part) && !part.startsWith('-') && !part.endsWith('-')) ? domainInput : undefined;
  return {
    yearsOnly: config['years-only'] === true,
    type: config.type === 'cards' || config.type === 'compact' ? config.type : 'list',
    from,
    to,
    noDetails: config['no-details'] === true,
    noAdd: config['no-add'] === true,
    customDomain: domain,
    addViaList: config['add-via-list'] === true,
  };
}

function text(value: unknown): string {
  return typeof value === 'string' ? (secure_content(value, false) as string).replace(/\s+/g, ' ').trim() : '';
}

function flatten_events(input: unknown, currentYear: number): OverviewEvent[] {
  if (!Array.isArray(input)) throw new Error('The group overview response is invalid.');
  const output: OverviewEvent[] = [];
  for (const raw of input as OverviewResponseItem[]) {
    const item = strip_unsafe_keys(raw) as OverviewResponseItem;
    if (!item || typeof item !== 'object' || typeof item.prokey !== 'string' || !Array.isArray(item.dates)) continue;
    for (const date of item.dates) {
      if (!date || typeof date.startDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date.startDate)) continue;
      const startYear = Number(date.startDate.slice(0, 4));
      const startMonth = Number(date.startDate.slice(5, 7));
      if (startYear < currentYear - 1 || startMonth < 1 || startMonth > 12) continue;
      const event: OverviewEvent = {
        ...date,
        name: text(date.name),
        description: text(date.description),
        location: text(date.location),
        prokey: item.prokey,
        title: text(date.name) || text(item.label) || 'Event',
        year: startYear,
        month: startMonth,
        hasRsvp: item.rsvp === true || (item.rsvp_block !== null && item.rsvp_block !== undefined && item.rsvp_block !== '') || /,\s*RSVP\s*$/i.test(text(item.label)),
      };
      output.push(event);
      if (date.endDate && /^\d{4}-\d{2}-\d{2}$/.test(date.endDate)) {
        const endYear = Number(date.endDate.slice(0, 4));
        if (endYear > startYear && endYear >= currentYear - 1) output.push({ ...event, year: endYear, month: 1 });
      }
    }
  }
  output.sort((a, b) => `${a.startDate || ''}T${a.startTime || ''}`.localeCompare(`${b.startDate || ''}T${b.startTime || ''}`));
  return output;
}

function append_text(parent: Element, tag: string, value: string, part?: string): HTMLElement {
  const element = document.createElement(tag);
  element.textContent = value;
  if (part) element.setAttribute('part', part);
  parent.append(element);
  return element;
}

function append_meta(parent: Element, type: 'clock' | 'pin', value: string): HTMLElement {
  const item = document.createElement('span');
  item.className = `atcb-group-overview-meta-item atcb-group-overview-meta-${type === 'clock' ? 'datetime' : 'location'}`;
  item.setAttribute('part', `atcb-group-overview-${type === 'clock' ? 'datetime' : 'location'}`);
  const icon = document.createElement('span');
  icon.className = 'atcb-group-overview-meta-icon';
  icon.setAttribute('part', `atcb-group-overview-${type === 'clock' ? 'datetime' : 'location'}-icon`);
  icon.append(document.importNode(new DOMParser().parseFromString(icons[`${type}`]!, 'image/svg+xml').documentElement, true));
  item.append(icon);
  const text = append_text(item, 'span', value);
  text.className = 'atcb-group-overview-meta-text';
  parent.append(item);
  return item;
}

function blur_after_pointer_selection(select: HTMLSelectElement): void {
  let pointerInteraction = false;
  select.addEventListener('pointerdown', () => {
    pointerInteraction = true;
  });
  select.addEventListener('change', () => {
    if (pointerInteraction) select.blur();
    pointerInteraction = false;
  });
  select.addEventListener('blur', () => {
    pointerInteraction = false;
  });
}

function render_event(event: OverviewEvent, config: NormalizedOverviewConfig, locale: string, dev: boolean, onAdd: (event: OverviewEvent, trigger: HTMLElement) => void): HTMLLIElement {
  const item = document.createElement('li');
  item.className = 'atcb-group-overview-item';
  if (config.noAdd) item.classList.add('atcb-group-overview-item-no-add');
  else if (config.noDetails) item.classList.add('atcb-group-overview-item-no-details');
  item.setAttribute('part', 'atcb-group-overview-event');
  const start = new Date(`${event.startDate}T${event.startTime || '00:00'}:00`);
  const dateFormatter = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', ...(event.startTime ? { hour: '2-digit', minute: '2-digit' } : {}) });
  let dateLabel = dateFormatter.format(start);
  if (event.endDate || event.endTime) {
    const end = new Date(`${event.endDate || event.startDate}T${event.endTime || event.startTime || '00:00'}:00`);
    dateLabel += ` – ${dateFormatter.format(end)}`;
  }
  const href = `https://${config.customDomain || (dev ? 'dev.caldn.net' : 'caldn.net')}/${encodeURIComponent(event.prokey)}`;
  if (config.type === 'compact') {
    const row = document.createElement('span');
    row.className = 'atcb-group-overview-compact-row';
    item.append(row);
    const link = append_text(row, config.noAdd ? 'span' : 'a', `${dateLabel} | ${event.title}`, 'atcb-group-overview-link') as HTMLAnchorElement;
    if (!config.noAdd) {
      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener';
    }
    if (config.noDetails && !config.noAdd)
      link.addEventListener('click', (e) => {
        e.preventDefault();
        onAdd(event, link);
      });
    if (config.addViaList && !config.noDetails && !config.noAdd && event.hasRsvp) {
      item.classList.add('atcb-group-overview-compact-with-marker');
      const marker = append_text(row, 'span', '•', 'atcb-group-overview-marker');
      marker.className = 'atcb-group-overview-compact-marker';
      marker.setAttribute('aria-hidden', 'true');
      row.prepend(marker);
    } else if (config.addViaList && !config.noDetails && !config.noAdd) {
      item.classList.add('atcb-group-overview-compact-with-add');
      const add = append_text(row, 'button', '+', 'atcb-group-overview-add');
      add.className = 'atcb-group-overview-add';
      (add as HTMLButtonElement).type = 'button';
      add.setAttribute('aria-label', `Add ${event.title} to calendar`);
      add.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        onAdd(event, add);
      });
      row.prepend(add);
    }
    return item;
  }
  const link = document.createElement(config.noAdd ? 'div' : 'a');
  link.className = 'atcb-group-overview-event-link';
  link.setAttribute('part', 'atcb-group-overview-link');
  if (link instanceof HTMLAnchorElement) {
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('aria-label', event.title);
  }
  if (config.noDetails && !config.noAdd)
    link.addEventListener('click', (e) => {
      e.preventDefault();
      onAdd(event, link);
    });
  item.append(link);
  if (config.type === 'list') {
    const day = document.createElement('span');
    day.className = 'atcb-group-overview-day';
    day.setAttribute('part', 'atcb-group-overview-day');
    const dayValue = append_text(day, 'span', String(Number(event.startDate!.slice(8, 10))), 'atcb-group-overview-day-value');
    dayValue.className = 'atcb-group-overview-day-value';
    link.append(day);
  }
  const content = document.createElement('div');
  content.className = 'atcb-group-overview-content';
  link.append(content);
  const title = append_text(content, 'span', event.title, 'atcb-group-overview-title');
  title.className = 'atcb-group-overview-title';
  const meta = document.createElement('div');
  meta.className = 'atcb-group-overview-meta';
  meta.setAttribute('part', 'atcb-group-overview-meta');
  const datetime = append_meta(meta, 'clock', dateLabel);
  if (event.location) append_meta(meta, 'pin', event.location);
  content.append(meta);
  if (config.type === 'cards') {
    content.insertBefore(datetime, title);
    if (meta.children.length === 0) meta.remove();
  }
  if (event.description) {
    const description = append_text(content, 'p', event.description, 'atcb-group-overview-description');
    description.className = 'atcb-group-overview-description';
  }
  if (config.addViaList && !config.noAdd && !event.hasRsvp) {
    item.classList.add('atcb-group-overview-item-with-add');
    const add = append_text(config.noDetails ? link : item, config.noDetails ? 'span' : 'button', '+', 'atcb-group-overview-add');
    add.className = 'atcb-group-overview-add';
    if (config.noDetails) {
      add.setAttribute('aria-hidden', 'true');
    } else {
      (add as HTMLButtonElement).type = 'button';
      add.setAttribute('aria-label', `Add ${event.title} to calendar`);
      add.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        onAdd(event, add);
      });
    }
  }
  return item;
}

async function render_group_overview(input: ATCBInputConfig, signal: AbortSignal, onAdd: (event: ATCBInputConfig, trigger: HTMLElement) => void): Promise<RenderedGroupOverview> {
  const prokey = typeof input.prokey === 'string' ? input.prokey : '';
  if (!prokey) throw new Error('group-overview requires a prokey.');
  const now = new Date();
  const config = normalize_config(input.groupOverviewConfig as ATCBGroupOverviewConfig | undefined, now);
  const query = new URLSearchParams({ group: prokey, dates: 'true', from: config.from });
  if (config.to) query.set('to', config.to);
  const response = await fetch(`https://api${input.dev ? '-dev' : ''}.add-to-calendar-pro.com/v1/event/all?${query}`, { signal });
  if (!response.ok) throw new Error('Not possible to read the public group overview.');
  const events = flatten_events(await response.json(), now.getFullYear());
  if (input.subscribe === true || input.subscribe === 'true' || input.subscribe === '1') {
    for (const event of events) event.prokey = prokey;
  }
  const locale = typeof input.language === 'string' ? input.language.replace('_', '-') : 'en';
  const translationData = { ...input, language: locale } as ATCBConfig;
  await ensure_locale(translationData);
  const emptyLabel = translate_hook('group_overview.empty', translationData);
  const currentYear = now.getFullYear();
  const years = [...new Set(events.map((event) => event.year).concat(currentYear))].sort((a, b) => a - b);
  const css = await ensure_style(input as unknown as ATCBConfig);
  const style = document.createElement('style');
  style.textContent = css || '';
  if (input.cspnonce) style.setAttribute('nonce', input.cspnonce);
  const root = document.createElement('div');
  root.className = `atcb-group-overview atcb-group-overview-${config.type}`;
  root.setAttribute('part', 'atcb-group-overview');
  root.setAttribute('lang', locale);
  const controls = document.createElement('div');
  controls.className = 'atcb-group-overview-controls';
  controls.setAttribute('part', 'atcb-group-overview-controls');
  const yearSelect = document.createElement('select');
  yearSelect.className = 'atcb-group-overview-select';
  yearSelect.setAttribute('part', 'atcb-group-overview-year-select');
  yearSelect.setAttribute('aria-label', 'Year');
  for (const year of years) yearSelect.add(new Option(String(year), String(year), year === currentYear, year === currentYear));
  if (years.length > 1) controls.append(yearSelect);
  let monthSelect: HTMLSelectElement | undefined;
  if (!config.yearsOnly) {
    monthSelect = document.createElement('select');
    monthSelect.className = 'atcb-group-overview-select';
    monthSelect.setAttribute('part', 'atcb-group-overview-month-select');
    monthSelect.setAttribute('aria-label', 'Month');
    controls.append(monthSelect);
  }
  if (controls.childElementCount > 0) root.append(controls);
  const results = document.createElement('div');
  results.className = 'atcb-group-overview-results';
  results.setAttribute('part', 'atcb-group-overview-results');
  root.append(results);
  const render = (): void => {
    results.replaceChildren();
    const year = Number(yearSelect.value);
    const yearEvents = events.filter((event) => event.year === year);
    if (yearEvents.length === 0) {
      if (year === currentYear) {
        const empty = append_text(results, 'p', emptyLabel, 'atcb-group-overview-empty');
        empty.className = 'atcb-group-overview-empty';
      }
      if (monthSelect) monthSelect.replaceChildren();
      return;
    }
    const months = [...new Set(yearEvents.map((event) => event.month))].sort((a, b) => a - b);
    const renderMonth = (month: number, headline: boolean): void => {
      if (headline) {
        const heading = append_text(results, 'h3', new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2000, month - 1, 1)), 'atcb-group-overview-month-heading');
        heading.className = 'atcb-group-overview-month';
      }
      const list = document.createElement('ul');
      list.className = `atcb-group-overview-items atcb-group-overview-${config.type}`;
      list.setAttribute('part', 'atcb-group-overview-list');
      for (const event of yearEvents.filter((candidate) => candidate.month === month)) list.append(render_event(event, config, locale, input.dev === true || input.dev === 'true', onAdd));
      results.append(list);
    };
    if (config.yearsOnly) {
      for (const month of months) renderMonth(month, true);
    } else if (monthSelect) {
      const previous = Number(monthSelect.value);
      monthSelect.replaceChildren(...months.map((month) => new Option(new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2000, month - 1, 1)), String(month))));
      monthSelect.value = String(months.includes(previous) ? previous : months.includes(now.getMonth() + 1) ? now.getMonth() + 1 : months[0]);
      renderMonth(Number(monthSelect.value), false);
    }
  };
  yearSelect.addEventListener('change', render);
  monthSelect?.addEventListener('change', () => {
    results.replaceChildren();
    const yearEvents = events.filter((event) => event.year === Number(yearSelect.value) && event.month === Number(monthSelect!.value));
    const list = document.createElement('ul');
    list.className = `atcb-group-overview-items atcb-group-overview-${config.type}`;
    list.setAttribute('part', 'atcb-group-overview-list');
    for (const event of yearEvents) list.append(render_event(event, config, locale, input.dev === true || input.dev === 'true', onAdd));
    results.append(list);
  });
  blur_after_pointer_selection(yearSelect);
  if (monthSelect) blur_after_pointer_selection(monthSelect);
  render();
  return { root, style };
}

export { render_group_overview };
