/**
 * Resolves the directory that contains a loaded script.
 *
 * jsDelivr serves the package's `jsdelivr` entry directly for package-root URLs,
 * without changing the script element's src to the resolved dist file. Account for
 * that supported CDN form so lazy assets still resolve beside dist/atcb.js.
 */
function resolve_script_base(src: string): string {
  const suffixIndex = src.search(/[?#]/);
  const packageUrl = suffixIndex === -1 ? src : src.substring(0, suffixIndex);
  for (const base of ['https://cdn.jsdelivr.net/npm/add-to-calendar-button', 'http://cdn.jsdelivr.net/npm/add-to-calendar-button']) {
    if (!packageUrl.startsWith(base)) continue;
    const version = packageUrl.substring(base.length);
    if (version === '' || (version.startsWith('@') && version.length > 1 && !version.includes('/'))) {
      return packageUrl + '/dist/';
    }
  }
  return src.lastIndexOf('/') > -1 ? src.substring(0, src.lastIndexOf('/') + 1) : '';
}

export { resolve_script_base };
