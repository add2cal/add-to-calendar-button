import sanitizeHtml from 'sanitize-html';

/**
 * Serialize data for embedding as raw text inside a `<script>` element.
 *
 * `JSON.stringify` alone is valid JSON, but it is not safe script text: strings
 * containing `</script>` can close the element early. Escaping the HTML-significant
 * characters keeps the output valid JSON while preventing script breakouts.
 */
export const toSafeJsonScript = (value: unknown): string =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

/**
 * Sanitize rich HTML fragments from external sources before rendering with
 * `set:html`. The allowlist keeps common article/event formatting while removing
 * scripts, event handlers, unsafe URL schemes and unknown tags/attributes.
 */
export const sanitizeTrustedHtmlFragment = (html: string): string =>
  sanitizeHtml(html, {
    allowedTags: ['a', 'abbr', 'b', 'blockquote', 'br', 'cite', 'code', 'dd', 'del', 'div', 'dl', 'dt', 'em', 'figcaption', 'figure', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'img', 'li', 'ol', 'p', 'pre', 'q', 's', 'small', 'span', 'strong', 'sub', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'u', 'ul'],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel', 'title'],
      abbr: ['title'],
      blockquote: ['cite'],
      cite: ['title'],
      code: ['class'],
      img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
      q: ['cite'],
      table: ['summary'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan', 'scope'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'data'],
    },
    allowProtocolRelative: false,
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, true),
    },
  });
