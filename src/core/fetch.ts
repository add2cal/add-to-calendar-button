/**
 * Adds request context to browser fetch rejections (for example CSP failures),
 * whose native error messages usually contain no URL.
 */
async function fetch_with_context(url: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init);
  } catch (error) {
    // An abort is expected during component teardown and should retain its native type.
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    const origin = new URL(url).origin;
    throw new Error(`Fetch failed for "${origin}/..."`);
  }
}

export { fetch_with_context };
