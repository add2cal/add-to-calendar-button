import { defaultTarget } from './globals';

// SHARED FUNCTION TO SECURE DATA
function secure_content(data: unknown, isJSON = true): unknown {
  // strip HTML tags (especially since stupid Safari adds stuff) - except for <br>
  const toClean = isJSON ? JSON.stringify(data) : (data as { toString(): string }).toString();
  const cleanedUp = toClean.replace(/(<(?!br)([^>]+)>)/gi, '');
  if (isJSON) {
    const parsed = JSON.parse(cleanedUp) as unknown;
    strip_unsafe_keys(parsed);
    return parsed;
  } else {
    return cleanedUp;
  }
}

// remove prototype-pollution vectors from parsed json input: keys that would write
// into the prototype chain when copied around have no legitimate use in any config
function strip_unsafe_keys(node: unknown): unknown {
  if (!node || typeof node !== 'object') {
    return node;
  }
  for (const key of ['__proto__', 'constructor', 'prototype']) {
    if (Object.prototype.hasOwnProperty.call(node, key)) {
      delete (node as { [key: string]: unknown })[`${key}`];
    }
  }
  for (const value of Object.values(node)) {
    strip_unsafe_keys(value);
  }
  return node;
}

// SHARED FUNCTION TO SECURE URLS
function secure_url(url: string, throwError = true): boolean {
  if (url && url.match(/((\.\.\/)|(\.\.\\)|(%2e%2e%2f)|(%252e%252e%252f)|(%2e%2e\/)|(%252e%252e\/)|(\.\.%2f)|(\.\.%252f)|(%2e%2e%5c)|(%252e%252e%255c)|(%2e%2e\\)|(%252e%252e\\)|(\.\.%5c)|(\.\.%255c)|(\.\.%c0%af)|(\.\.%25c0%25af)|(\.\.%c1%9c)|(\.\.%25c1%259c))/gi)) {
    if (throwError) {
      console.error('Seems like the generated URL includes at least one security issue and got blocked. Please check the calendar button parameters!');
    }
    return false;
  }
  // scheme allowlist: relative urls plus everything the button legitimately opens or
  // links (web, calendar subscriptions, android intents, mail, generated ics payloads);
  // control characters and whitespace are ignored for the sniff, like browsers do
  // eslint-disable-next-line no-control-regex -- stripping control characters is the point: browsers ignore them when parsing schemes, so evasion like java\tscript: must be caught
  const scheme = url ? url.replace(/[\u0000-\u0020\u007f-\u009f]/g, '').match(/^([a-z][a-z0-9+.-]*):/i) : null;
  if (scheme) {
    const schemeName = scheme[1]!.toLowerCase();
    const allowed = ['http', 'https', 'webcal', 'webcals', 'mailto', 'intent'].includes(schemeName) || (schemeName === 'data' && /^data:text\/calendar[;,]/i.test(url.trim()));
    if (!allowed) {
      if (throwError) {
        console.error('Seems like the generated URL includes at least one security issue and got blocked. Please check the calendar button parameters!');
      }
      return false;
    }
  }
  return true;
}

// SHARED FUNCTION TO REPLACE HTML PSEUDO ELEMENTS
function rewrite_html_elements(content: string, clear = false, iCalBreaks = false): string {
  if (clear) {
    // for line breaks, we add a space instead (or \\n for iCal)
    if (iCalBreaks) {
      content = content.replace(/(\[br\s?\/?\]|\{br\s?\/?\}|(\[\/p\](?=.))|(\{\/p\}(?=.)))/gi, '\\n');
    } else {
      content = content.replace(/(\[br\s?\/?\]|\{br\s?\/?\}|(\[\/p\](?=.))|(\{\/p\}(?=.)))/gi, ' ');
    }
    // remove any pseudo elements
    content = content.replace(/\[url\](.+?)\[\/url\]/gi, (match: string, p1: string) => {
      return p1.split('|')[0]!;
    });
    content = content.replace(/\{url\}(.+?)\{\/url\}/gi, (match: string, p1: string) => {
      return p1.split('|')[0]!;
    });
    content = content.replace(/\[\/?(hr|[pbui]|strong|em|li|ul|ol|h\d)\]/gi, '');
    content = content.replace(/\{\/?(hr|[pbui]|strong|em|li|ul|ol|h\d)\}/gi, '');
    // also remove any special characters
    content = content.replace(/&[#a-z0-9]{1,9};/gi, '');
  } else {
    // and build html for the rest
    // supporting: br, hr, p, strong, u, i, em, li, ul, ol, h (like h1, h2, h3, ...), url (= a)
    content = content.replace(/\[url\]((?:(?!\[\/url\]).)*)\[\/url\]/gi, function (match: string, p1: string) {
      return parse_url_code(p1);
    });
    content = content.replace(/\{url\}((?:(?!\[\/url\]).)*)\{\/url\}/gi, function (match: string, p1: string) {
      return parse_url_code(p1);
    });
    content = content.replace(/\[(\/)?(br|hr|[pbui]|strong|em|li|ul|ol|h\d)(\s?\/?)\]/gi, '<$1$2$3>');
    content = content.replace(/\{(\/)?(br|hr|[pbui]|strong|em|li|ul|ol|h\d)(\s?\/?)\}/gi, '<$1$2$3>');
  }
  return content;
}

function parse_url_code(input: string): string {
  const urlText = input.split('|');
  const url = (urlText[0] || '').trim();
  const text = (function () {
    if (urlText.length > 1 && urlText[1] != '') {
      return urlText[1]!;
    } else {
      return url;
    }
  })();
  const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // descriptions often carry third-party content: only linkify explicit web/calendar/
  // mail schemes (or relative urls) and escape everything - anything else stays text
  // eslint-disable-next-line no-control-regex -- stripping control characters is the point: browsers ignore them when parsing schemes, so evasion like java\tscript: must be caught
  const scheme = url.replace(/[\u0000-\u0020\u007f-\u009f]/g, '').match(/^([a-z][a-z0-9+.-]*):/i);
  if (scheme && !['http', 'https', 'webcal', 'webcals', 'mailto'].includes(scheme[1]!.toLowerCase())) {
    return escapeHtml(text);
  }
  return '<a href="' + escapeHtml(url).replace(/"/g, '&quot;') + '" target="' + defaultTarget + '" rel="noopener">' + escapeHtml(text) + '</a>';
}

// SHARED FUNCTIONS TO FORMAT iCAL TEXT
function rewrite_ical_text(content: string, inQuotes = false): string {
  if (inQuotes) {
    content = content.replace(/"/g, '');
  } else {
    content = content.replace(/\\/g, '\\\\').replace(/(,|;)/g, '\\$1').replace(/\\\\n/g, '\\n');
  }
  return content;
}

function format_ical_lines(content: string): string {
  const contentArr = content.split('\r\n');
  const result: string[] = [];
  for (const line of contentArr) {
    if (!line || line.length <= 65) {
      result.push(line);
      continue;
    }
    let currentLine = '';
    let position = 0;
    const foldedLines: string[] = [];
    while (position < line.length) {
      const char = line.charAt(position);
      // Check for emoji or surrogate pairs (multibyte characters)
      const isHighSurrogate = char.charCodeAt(0) >= 0xd800 && char.charCodeAt(0) <= 0xdbff;
      const isEscapedChar = position > 0 && line.charAt(position - 1) === '\\';
      // If adding this character would exceed 65 characters and it's safe to break here. We aim for 65 to have space left for special cases
      if ((currentLine + char).length > 65 && !isHighSurrogate && !isEscapedChar) {
        foldedLines.push(currentLine);
        currentLine = '';
      }
      currentLine += char;
      position++;
      // If this was a high surrogate, make sure we include its pair in the same line
      if (isHighSurrogate && position < line.length) {
        currentLine += line.charAt(position);
        position++;
      }
    }
    if (currentLine.length > 0) {
      foldedLines.push(currentLine);
    }
    result.push(foldedLines[0]!);
    for (let i = 1; i < foldedLines.length; i++) {
      result.push(' ' + foldedLines[`${i}`]);
    }
  }

  return result.join('\r\n');
}

export { secure_content, secure_url, strip_unsafe_keys, rewrite_html_elements, rewrite_ical_text, format_ical_lines };
