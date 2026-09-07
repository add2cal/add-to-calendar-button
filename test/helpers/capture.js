/**
 * Output-capture helpers.
 *
 * The library delivers its results in two ways:
 *  1. Calendar URLs -> window.open(url, target)      [open_cal_url]
 *  2. ICS files     -> ad-hoc <a> created via document.createElementNS + synthetic click [save_file]
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
 * Intercepts both the legacy ad-hoc save anchors and rendered native ICS anchors.
 * Returns { saves, restore }.
 * saves: Array<{ href: string, download: string, target: string }>
 */
export function interceptFileSave() {
  const saves = [];
  const originalDispatch = HTMLAnchorElement.prototype.dispatchEvent;
  HTMLAnchorElement.prototype.dispatchEvent = function (evt) {
    if (evt && evt.type === 'click' && (this.download || this.href.startsWith('data:text/calendar'))) {
      saves.push({ href: this.href, download: this.download, target: this.target });
      const href = this.getAttribute('href');
      const download = this.getAttribute('download');
      this.removeAttribute('href');
      this.removeAttribute('download');
      const result = originalDispatch.call(this, evt);
      if (href !== null) this.setAttribute('href', href);
      if (download !== null) this.setAttribute('download', download);
      return result;
    }
    return originalDispatch.call(this, evt);
  };
  return {
    saves,
    restore() {
      HTMLAnchorElement.prototype.dispatchEvent = originalDispatch;
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
  const originals = new Map();
  for (const m of methods) {
    originals.set(m, Reflect.get(console, m));
    Reflect.set(console, m, (...args) => messages.push(args.map(String).join(' ')));
  }
  return {
    messages,
    restore() {
      for (const [m, fn] of originals) {
        Reflect.set(console, m, fn);
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

/**
 * Force every clipboard strategy to fail: the Clipboard API write throws and the
 * legacy execCommand path reports itself unsupported. Use to exercise manual-copy
 * fallbacks. Returns { restore }.
 */
export function stubClipboardFailure() {
  const originalClipboard = Object.getOwnPropertyDescriptor(Navigator.prototype, 'clipboard');
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText: async () => {
        throw new Error('clipboard denied');
      },
    },
  });
  const originalQueryCommandSupported = document.queryCommandSupported;
  document.queryCommandSupported = () => false;
  return {
    restore() {
      delete navigator.clipboard;
      if (originalClipboard) Object.defineProperty(Navigator.prototype, 'clipboard', originalClipboard);
      document.queryCommandSupported = originalQueryCommandSupported;
    },
  };
}
