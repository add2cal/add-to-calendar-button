import { isMobile, isIOS } from './globals';
import { log_event } from './events';
import { generate_ty } from '../ui/pro';
import type { ATCBConfig } from '../types';

// SHARED FUNCTION HOOK FOR WHEN EVENT GOT SAVED
function saved_hook(host: ShadowRoot, data: ATCBConfig): void {
  // log event
  log_event('success', data.identifier as string, data.identifier as string);
  // trigger ty modal, if given
  if (data.ty && typeof generate_ty === 'function') {
    setTimeout(() => {
      generate_ty(host, data);
    }, 1000);
  }
}

// SHARED FUNCTION TO SAVE A FILE
function save_file(file: string, filename: string): void {
  try {
    const save = document.createElementNS('http://www.w3.org/1999/xhtml', 'a') as HTMLAnchorElement;
    save.rel = 'noopener';
    save.href = file;
    // not using default target here, since this needs to happen _self on iOS (abstracted to mobile in general) and _blank at Firefox (abstracted to other setups) due to potential cross-origin restrictions
    if (isMobile()) {
      save.target = '_self';
    } else {
      save.target = '_blank';
    }
    save.download = filename + '.ics';
    const evt = new MouseEvent('click', {
      view: window,
      button: 0,
      bubbles: true,
      cancelable: false,
    });
    save.dispatchEvent(evt);
    (window.URL || (window as unknown as { webkitURL: typeof URL }).webkitURL).revokeObjectURL(save.href);
  } catch (e) {
    console.error(e);
  }
}

// SHARED FUNCTION TO VALIDATE EMAIL ADDRESSES
function validEmail(email: string): boolean {
  // rough format check first
  if (!/^.{0,70}@.{1,30}\.[a-z]{2,9}$/i.test(email)) {
    return false;
  }
  return true;
}

// SHARED FUNCTION TO GENERATE UUIDs
function generate_uuid(): string {
  //const id = crypto.randomUUID(); // lacking support of Safari < 15.4 and Firefox < 95, which is too important for now
  const id = (([1e7] as unknown as string) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => ((c as unknown as number) ^ (crypto.getRandomValues(new Uint8Array(1))[0]! & (15 >> ((c as unknown as number) / 4)))).toString(16));
  return id;
}

// SHARED FUNCTION TO TRANSFORM A STRING
function apply_transformation(value: unknown, transform?: string): unknown {
  if (!transform || !value) return value;
  switch (transform) {
    case 'upper':
      return (value as { toString(): string }).toString().toUpperCase();
    case 'lower':
      return (value as { toString(): string }).toString().toLowerCase();
    default:
      return value;
  }
}

// SHARED FUNCTION TO COPY TO CLIPBOARD
async function copy_to_clipboard(dataString: unknown): Promise<string> {
  const v = ((dataString ?? '') as { toString(): string }).toString().trim();
  if (!v) throw new Error('No value to copy!');
  // Helper: legacy copy using a hidden textarea
  const legacyCopy = (): boolean => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return false;
    if (!document.queryCommandSupported || !document.queryCommandSupported('copy')) return false;
    const ta = document.createElement('textarea');
    const prevFocus = document.activeElement as HTMLElement | null;
    ta.value = v;
    ta.setAttribute('readonly', '');
    ta.style.contain = 'strict';
    ta.style.position = 'fixed';
    ta.style.top = '-9999px';
    ta.style.left = '-9999px';
    ta.style.opacity = '0';
    ta.style.outline = 'none';
    ta.style.pointerEvents = 'none';
    ta.style.fontSize = '12pt'; // Prevent zooming on iOS
    document.body.appendChild(ta);
    try {
      ta.focus();
      ta.select();
      if (isIOS()) {
        ta.selectionStart = 0;
        ta.selectionEnd = v.length;
      }
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (prevFocus && typeof prevFocus.focus === 'function') prevFocus.focus();
      return ok;
    } catch {
      document.body.removeChild(ta);
      if (prevFocus && typeof prevFocus.focus === 'function') prevFocus.focus();
      return false;
    }
  };
  const secure = (() => {
    try {
      // check for isSecureContext first
      if (typeof window !== 'undefined' && 'isSecureContext' in window && window.isSecureContext) return true;
      // check for protocol as fallback
      if (typeof window !== 'undefined' && window.location && window.location.protocol === 'https:') return true;
      // if localhost, also return true
      if (typeof window !== 'undefined' && window.location && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) return true;
      return false;
    } catch {
      return false;
    }
  })();
  // Try modern Clipboard API first when in a secure context
  if (secure && typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      if (typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(v);
        return 'Copied!';
      }
    } catch {
      // fall through to alternative methods
    }
    try {
      if (typeof window !== 'undefined' && typeof window.ClipboardItem !== 'undefined' && typeof navigator.clipboard.write === 'function') {
        const type = 'text/plain';
        const blob = new Blob([v], { type });
        const data = [new ClipboardItem({ [type]: blob })];
        await navigator.clipboard.write(data);
        return 'Copied!';
      }
    } catch {
      // fall through to legacy
    }
  }
  if (legacyCopy()) return 'Copied!';
  throw new Error('Clipboard copy not supported in this environment');
}

// SHARED DEBOUNCE FUNCTIONS
// going for last call debounce
function debounce<A extends unknown[]>(this: void, func: (...args: A) => unknown, timeout = 200): (...args: A) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: A) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
// dropping subsequent calls debounce
function debounce_leading<A extends unknown[]>(this: void, func: (...args: A) => unknown, timeout = 300): (...args: A) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: A) => {
    if (!timer) {
      func.apply(this, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
    }, timeout);
  };
}

export { saved_hook, save_file, validEmail, generate_uuid, apply_transformation, copy_to_clipboard, debounce, debounce_leading };
