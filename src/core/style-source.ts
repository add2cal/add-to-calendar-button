/** Normalize explicit asset overrides without changing unrelated custom sources. */
function resolve_style_source(source: string, version: string): string {
  if (source === 'jsdelivr') {
    return `https://cdn.jsdelivr.net/npm/add-to-calendar-button@${version}/dist/styles/`;
  }
  try {
    const url = new URL(source);
    const [, registry, pkg, ...rest] = url.pathname.split('/');
    const packageName = 'add-to-calendar-button';
    const knownPackage = pkg === packageName || (pkg?.startsWith(packageName + '@') && pkg.length > packageName.length + 1);
    const path = rest.join('/').replace(/\/$/, '');
    if (['https://cdn.jsdelivr.net', 'http://cdn.jsdelivr.net'].includes(url.origin) && !url.username && !url.password && registry === 'npm' && knownPackage && ['', 'dist', 'dist/styles', 'dist/atcb.js', 'dist/atcb.min.js'].includes(path)) {
      return `${url.origin}/npm/${pkg}/dist/styles/`;
    }
  } catch {
    // Relative paths and non-URL custom sources retain their existing behavior.
  }
  return source.endsWith('/') ? source : source + '/';
}

export { resolve_style_source };
