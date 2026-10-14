import { get, set } from '@/utils/localStorage';
import { themeConfig } from '~/theme.config';
import type { UserTheme } from '~/types/user-theme';

// Expressive Code theme names (per mode) used as the `data-theme` value so that
// code blocks render with the matching theme. Derived from `theme.config.ts`.
const EC_THEME_LIGHT = themeConfig.expressiveCodeThemes?.light as string;
const EC_THEME_DARK = (themeConfig.expressiveCodeThemes?.dark || EC_THEME_LIGHT) as string;

/**
 * Applies the given theme to the <html> element: toggles the `dark` class and
 * sets `data-theme` to the Expressive Code theme name for that mode.
 */
const applyTheme = (theme: UserTheme) => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  if (EC_THEME_LIGHT !== undefined && EC_THEME_DARK !== undefined) {
    root.setAttribute('data-theme', theme === 'dark' ? EC_THEME_DARK : EC_THEME_LIGHT);
  }
};

/**
 * Inline script run synchronously in <head> before first paint to prevent theme flash.
 * Must be self-contained (no imports) - injected via `set:html` in base.astro.
 * The Expressive Code theme names are interpolated at build time from `theme.config.ts`.
 */
export const THEME_INIT_SCRIPT =
  `(function(){function a(doc){var t=localStorage.getItem('user-theme');` +
  `var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);` +
  `doc.documentElement.classList.toggle('dark',d);` +
  `doc.documentElement.setAttribute('data-theme',d?'${EC_THEME_DARK}':'${EC_THEME_LIGHT}')}a(document);` +
  `document.addEventListener('astro:before-swap',function(e){a(e.newDocument)})})();`;

function getSystemPreference(): UserTheme {
  // check for the system and fall back to light
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

export const getUserTheme = (): UserTheme => {
  // try to get the theme from local storage
  let theme = get('user-theme') as UserTheme;
  if (!theme) {
    theme = getSystemPreference();
    void set('user-theme', theme);
  }
  // adjust the html element (dark class + data-theme) before returning the theme
  applyTheme(theme);
  return theme;
};

export const setUserTheme = (theme: UserTheme) => {
  // save the theme to local storage (async, non-blocking)
  void set('user-theme', theme);
  // adjust the html element (dark class + data-theme)
  applyTheme(theme);
};
