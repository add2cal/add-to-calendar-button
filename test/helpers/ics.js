/**
 * Minimal ICS (RFC 5545) parsing helpers for assertions.
 * Not a full parser - just enough to unfold lines and extract VEVENT/VTIMEZONE blocks.
 */

/**
 * Decodes an ICS data: URI (as produced by the lib) into raw text.
 */
export function decodeIcsHref(href) {
  if (!href || !href.startsWith('data:text/calendar')) {
    throw new Error('Not an ICS data URI: ' + String(href).slice(0, 80));
  }
  return decodeURIComponent(href.substring(href.indexOf(',') + 1));
}

/**
 * Unfolds RFC 5545 folded lines (CRLF followed by single whitespace).
 */
export function unfoldIcs(raw) {
  return raw.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '');
}

/**
 * Parses raw ICS text into a light structure for assertions.
 */
export function parseIcs(raw) {
  const unfolded = unfoldIcs(raw);
  const lines = unfolded.split(/\r\n|\n/);
  const prop = (name) => {
    const line = lines.find((l) => l.startsWith(name + ':') || l.startsWith(name + ';'));
    return line || null;
  };
  const events = [];
  const vtimezones = [];
  let current = null;
  let tzBuffer = null;
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      current = { lines: [] };
      continue;
    }
    if (line === 'END:VEVENT') {
      events.push(current);
      current = null;
      continue;
    }
    if (line === 'BEGIN:VTIMEZONE') {
      tzBuffer = [];
      continue;
    }
    if (line === 'END:VTIMEZONE') {
      vtimezones.push(tzBuffer.join('\n'));
      tzBuffer = null;
      continue;
    }
    if (current) current.lines.push(line);
    if (tzBuffer) tzBuffer.push(line);
  }
  for (const ev of events) {
    ev.prop = (name) => ev.lines.find((l) => l.startsWith(name + ':') || l.startsWith(name + ';')) || null;
    ev.value = (name) => {
      const l = ev.prop(name);
      return l ? l.substring(l.indexOf(':') + 1) : null;
    };
  }
  return {
    raw,
    unfolded,
    lines,
    prop,
    method: (prop('METHOD') || '').split(':')[1] || null,
    prodid: (prop('PRODID') || '').split(':').slice(1).join(':') || null,
    events,
    vtimezones,
    tzids: vtimezones.map((tz) => {
      const m = tz.match(/TZID:(.+)/);
      return m ? m[1] : null;
    }),
  };
}
