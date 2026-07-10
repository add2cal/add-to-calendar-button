/**
 * Output-capture helpers.
 *
 * The library delivers its results in two ways:
 *  1. Calendar URLs -> window.open(url, target)      [atcb_open_cal_url]
 *  2. ICS files     -> ad-hoc <a> created via document.createElementNS + synthetic click [atcb_save_file]
 *
 * These interceptors capture both without any navigation happening in the test browser.
 */

/**
 * Intercepts window.open calls. Returns { calls, restore }.
 * calls: Array<{ url: string, target: string }>
 */
export function interceptWindowOpen() {
  const calls = [];
  const original = window.open;
  window.open = (url, target) => {
    calls.push({ url: String(url), target });
    return { focus() {}, close() {} };
  };
  return {
    calls,
    restore() {
      window.open = original;
    },
  };
}

/**
 * Intercepts file-save anchors (atcb_save_file creates them via document.createElementNS
 * and dispatches a synthetic click without appending to the DOM).
 * Returns { saves, restore }.
 * saves: Array<{ href: string, download: string, target: string }>
 */
export function interceptFileSave() {
  const saves = [];
  const original = document.createElementNS.bind(document);
  document.createElementNS = (ns, tag) => {
    const el = original(ns, tag);
    if (String(tag).toLowerCase() === 'a') {
      const originalDispatch = el.dispatchEvent.bind(el);
      el.dispatchEvent = (evt) => {
        if (evt && evt.type === 'click') {
          saves.push({ href: el.href, download: el.download, target: el.target });
          return true; // swallow the click - no navigation/download
        }
        return originalDispatch(evt);
      };
    }
    return el;
  };
  return {
    saves,
    restore() {
      document.createElementNS = original;
    },
  };
}

/**
 * Overrides navigator.userAgent for the current test (env detection functions
 * in atcb-globals.js read navigator.userAgent at call time).
 * Returns a restore function.
 */
export function setUA(ua) {
  const original = Object.getOwnPropertyDescriptor(Navigator.prototype, 'userAgent');
  Object.defineProperty(navigator, 'userAgent', { value: ua, configurable: true });
  return () => {
    delete navigator.userAgent;
    if (original) Object.defineProperty(Navigator.prototype, 'userAgent', original);
  };
}

export const UA = {
  desktopWinChrome: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  desktopMacSafari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
  desktopMacChrome: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  desktopWinFirefox: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0',
  iosSafari: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
  iosChrome: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/125.0.0.0 Mobile/15E148 Safari/604.1',
  androidChrome: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
  androidFirefox: 'Mozilla/5.0 (Android 14; Mobile; rv:126.0) Gecko/126.0 Firefox/126.0',
  androidWebView: 'Mozilla/5.0 (Linux; Android 14; Pixel 8; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/125.0.0.0 Mobile Safari/537.36',
  instagramIOS: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 320.0.0.0 (iPhone14,2; iOS 17_4)',
};

/**
 * Temporarily silences console methods for tests that INTENTIONALLY exercise
 * error paths (the lib catches and console-logs those errors internally).
 * Returns { messages, restore }.
 */
export function muteConsole(methods = ['error', 'warn']) {
  const messages = [];
  const originals = {};
  for (const m of methods) {
    // eslint-disable-next-line no-console
    originals[m] = console[m];
    // eslint-disable-next-line no-console
    console[m] = (...args) => messages.push(args.map(String).join(' '));
  }
  return {
    messages,
    restore() {
      for (const m of methods) {
        // eslint-disable-next-line no-console
        console[m] = originals[m];
      }
    },
  };
}

/**
 * Installs a working navigator.clipboard stub for headless/insecure contexts where
 * the Clipboard API is unavailable (the lib would otherwise log its fallback error).
 * Returns { texts, restore }.
 */
export function stubClipboard() {
  const texts = [];
  const original = Object.getOwnPropertyDescriptor(Navigator.prototype, 'clipboard');
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText: async (t) => {
        texts.push(String(t));
      },
    },
  });
  return {
    texts,
    restore() {
      delete navigator.clipboard;
      if (original) Object.defineProperty(Navigator.prototype, 'clipboard', original);
    },
  };
}
