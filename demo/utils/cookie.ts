/**
 * SSR-safe cookie helpers.
 *
 * On the client, cookies are read from / written to `document.cookie`.
 * On the server, the caller passes the raw `cookie` request header (obtained via
 * Nuxt's `useRequestHeaders('cookie')` or the platform equivalent) so the same
 * `getCookie` call works in both environments without touching `document`.
 *
 * The playground uses this to mirror its localStorage settings into a cookie so a
 * future dynamic SSR runtime (e.g. a Cloudflare Worker) can pre-render the button
 * shell with the visitor's last configuration instead of a blank skeleton.
 * localStorage stays the primary store; the cookie is only the SSR signal.
 */

export enum CookieKey {
  ATTRS = 'atcb_playground',
}

/**
 * Parses a raw cookie header string (the value of the HTTP `cookie` header) into a
 * key/value map. Tolerates empty / undefined input.
 */
function parseCookieHeader(raw: string | undefined | null): Record<string, string> {
  const map: Record<string, string> = {};
  if (!raw) return map;
  // cookie pairs are separated by "; " - split and decode
  for (const pair of raw.split(';')) {
    const idx = pair.indexOf('=');
    if (idx === -1) continue;
    const key = pair.slice(0, idx).trim();
    const val = pair.slice(idx + 1).trim();
    if (key) {
      try {
        map[key] = decodeURIComponent(val);
      } catch {
        map[key] = val;
      }
    }
  }
  return map;
}

/**
 * Reads a cookie value.
 *
 * On the client, reads from `document.cookie`.
 * On the server, the caller passes the raw `cookie` request header via
 * `serverCookieHeader` (obtained from `useRequestHeaders('cookie')`).
 */
export const getCookie = (key: string, serverCookieHeader?: string): string | null => {
  // server path: parse the request header the caller passed in
  if (import.meta.server) {
    return parseCookieHeader(serverCookieHeader)[key] || null;
  }
  // client path: read from the live document
  if (typeof document !== 'undefined') {
    return parseCookieHeader(document.cookie)[key] || null;
  }
  return null;
};

/**
 * Writes a cookie value on the client. No-ops on the server (cookies are set via
 * the response header there, which is out of scope for this hybrid helper).
 *
 * The playground attrs object can grow beyond the 4 KB cookie limit, so the value
 * is stored as a JSON string and the caller is expected to keep it within bounds
 * (the shell-relevant subset). `maxAgeDays` defaults to 1 year.
 */
export const setCookie = (key: string, value: string, maxAgeDays: number = 365): void => {
  if (import.meta.server || typeof document === 'undefined') return;
  const encoded = encodeURIComponent(value);
  const maxAge = Math.round(maxAgeDays * 24 * 60 * 60);
  // SameSite=Lax so the cookie travels on top-level navigations (the SSR use case)
  // but not on cross-site subresource requests. No Secure flag in dev; the production
  // host is responsible for upgrading the connection to HTTPS.
  document.cookie = `${key}=${encoded}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

/**
 * Removes a cookie by expiring it.
 */
export const removeCookie = (key: string): void => {
  if (import.meta.server || typeof document === 'undefined') return;
  document.cookie = `${key}=; path=/; max-age=0; SameSite=Lax`;
};
