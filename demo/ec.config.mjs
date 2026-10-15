import { defineEcConfig } from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { expressiveCodeThemes } from './expressive-code-themes.mjs';

// Expressive Code configuration.
//
// This lives in a dedicated `ec.config.mjs` (instead of inline in astro.config.ts)
// because the `<Code>` component (imported from "astro-expressive-code/components")
// needs to read these options, and Astro can only share them with the component by
// serializing the config to JSON. Options like the `pluginLineNumbers()` plugin are
// functions and therefore not JSON-serializable, which breaks that mechanism.
// Moving them here lets both the Markdown integration and the `<Code>` component
// pick up the exact same configuration.
export default defineEcConfig({
  themes: [expressiveCodeThemes.light, expressiveCodeThemes.dark],
  useDarkModeMediaQuery: false,
  plugins: [pluginLineNumbers()],
  defaultProps: { showLineNumbers: false },
});
