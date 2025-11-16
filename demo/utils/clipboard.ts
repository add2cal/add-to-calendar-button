export async function copyValue(value: string): Promise<string> {
  const v = (value ?? '').toString().trim();
  if (!v) throw new Error('No value to copy!');
  // Helper: legacy copy using a hidden textarea
  const legacyCopy = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return false;
    if (!document.queryCommandSupported || !document.queryCommandSupported('copy')) return false;
    const ta = document.createElement('textarea');
    const prevFocus = document.activeElement;
    ta.textContent = v;
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
      ta.selectionStart = 0; // iOS workaround
      ta.selectionEnd = v.length;
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (prevFocus && typeof (prevFocus as HTMLElement).focus === 'function') (prevFocus as HTMLElement).focus();
      return ok;
    } catch {
      document.body.removeChild(ta);
      if (prevFocus && typeof (prevFocus as HTMLElement).focus === 'function') (prevFocus as HTMLElement).focus();
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
