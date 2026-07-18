import { atcbDefaultTarget } from './globals';

// SHARED FUNCTION TO SECURE DATA
function atcb_secure_content(data: unknown, isJSON = true): unknown {
  // strip HTML tags (especially since stupid Safari adds stuff) - except for <br>
  const toClean = isJSON ? JSON.stringify(data) : (data as { toString(): string }).toString();
  const cleanedUp = toClean.replace(/(<(?!br)([^>]+)>)/gi, '');
  if (isJSON) {
    return JSON.parse(cleanedUp);
  } else {
    return cleanedUp;
  }
}

// SHARED FUNCTION TO SECURE URLS
function atcb_secure_url(url: string, throwError = true): boolean {
  if (url && url.match(/((\.\.\/)|(\.\.\\)|(%2e%2e%2f)|(%252e%252e%252f)|(%2e%2e\/)|(%252e%252e\/)|(\.\.%2f)|(\.\.%252f)|(%2e%2e%5c)|(%252e%252e%255c)|(%2e%2e\\)|(%252e%252e\\)|(\.\.%5c)|(\.\.%255c)|(\.\.%c0%af)|(\.\.%25c0%25af)|(\.\.%c1%9c)|(\.\.%25c1%259c))/gi)) {
    if (throwError) {
      console.error('Seems like the generated URL includes at least one security issue and got blocked. Please check the calendar button parameters!');
    }
    return false;
  } else {
    return true;
  }
}

// SHARED FUNCTION TO REPLACE HTML PSEUDO ELEMENTS
function atcb_rewrite_html_elements(content: string, clear = false, iCalBreaks = false): string {
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
      return atcb_parse_url_code(p1);
    });
    content = content.replace(/\{url\}((?:(?!\[\/url\]).)*)\{\/url\}/gi, function (match: string, p1: string) {
      return atcb_parse_url_code(p1);
    });
    content = content.replace(/\[(\/)?(br|hr|[pbui]|strong|em|li|ul|ol|h\d)(\s?\/?)\]/gi, '<$1$2$3>');
    content = content.replace(/\{(\/)?(br|hr|[pbui]|strong|em|li|ul|ol|h\d)(\s?\/?)\}/gi, '<$1$2$3>');
  }
  return content;
}

function atcb_parse_url_code(input: string): string {
  const urlText = input.split('|');
  const text = (function () {
    if (urlText.length > 1 && urlText[1] != '') {
      return urlText[1];
    } else {
      return urlText[0];
    }
  })();
  return '<a href="' + urlText[0] + '" target="' + atcbDefaultTarget + '" rel="noopener">' + text + '</a>';
}

// SHARED FUNCTIONS TO FORMAT iCAL TEXT
function atcb_rewrite_ical_text(content: string, inQuotes = false): string {
  if (inQuotes) {
    content = content.replace(/"/g, '');
  } else {
    content = content.replace(/\\/g, '\\\\').replace(/(,|;)/g, '\\$1').replace(/\\\\n/g, '\\n');
  }
  return content;
}

function atcb_format_ical_lines(content: string): string {
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

export { atcb_secure_content, atcb_secure_url, atcb_rewrite_html_elements, atcb_rewrite_ical_text, atcb_format_ical_lines };
