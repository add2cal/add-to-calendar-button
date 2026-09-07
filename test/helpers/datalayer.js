/**
 * window.dataLayer helpers.
 * The lib pushes objects shaped: { eventCategory, eventAction, eventLabel, event }
 * with eventCategory 'Add-to-Calendar-Button' or 'Add-to-Calendar-RSVP'.
 */

export function resetDataLayer() {
  window.dataLayer = [];
}

export function removeDataLayer() {
  delete window.dataLayer;
}

/**
 * Returns all lib-pushed dataLayer entries, optionally filtered by event name.
 */
export function dlEvents(eventName = null) {
  const entries = (window.dataLayer || []).filter((e) => e && (e.eventCategory === 'Add-to-Calendar-Button' || e.eventCategory === 'Add-to-Calendar-RSVP'));
  if (eventName) return entries.filter((e) => e.event === eventName);
  return entries;
}
