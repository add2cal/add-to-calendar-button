<!-- Scope: initial project configuration in project mode. -->

# Configuration Guide - Instructions

This guide mirrors the README configuration section, condensed for execution.
It only guides on the most important steps and order of things. You might want to add additional steps in between.
Use it to build a `PLAN.md`, then keep it as reference. Create the `PLAN.md` in the same folder (./.ai) as the `CONFIG_GUIDE` (this file).
Interview the user wherever a choice is ambiguous.

1. **Trim first.** If the project was created without `npm create stardrive@latest` - by forking Stardrive and cloning the fork, cloning the official repository directly, or downloading its source - follow [TRIMMING_GUIDE.md](./TRIMMING_GUIDE.md) to remove unused/demo features. With `npm create stardrive` or if already done, the TRIMMING_GUIDE.md would no longer be there. In the `npm create stardrive@latest` case, mind that `npm run check` would find some issues as we are intentionally not cleaning up everything in order to have some functionality still in place, if the project, for example, establishes new content collections. Use the `npm run check` findings to clean up manually.
2. **`package.json`** - update name, description, metadata to reflect the project.
3. **`README.md`** - at minimum set the project name as the headline (for easy identification later).
4. **Favicons** - see [FAVICON_GUIDE.md](./FAVICON_GUIDE.md) for instructions.
5. **Social fallback images** - replace `og.png`, `x.png`, `structured-preview.png` in `./public/images/`. Ask the user to do so or generate them directly.
6. **`theme.config.ts`** - the core config pass:
   - Set base info: site URL, primary color, etc.
   - Choose languages, make sure there is a matching JSON in `./src/i18n/`, import it in theme.config.ts, and update the `i18n` block.
   - Choose the light and dark code themes in `./expressive-code-themes.mjs`; this plain ESM file is shared with Expressive Code's Node-loaded config.
   - If using the blog: set article settings (layout + functionality). If using the image fallback, replace [articles-fallback.jpg](../src/images/content/articles-fallback.jpg).
   - Set promo slots, or set them to `false` / drop them if unused.
   - Define how `llms.txt` is generated and set an intro text.
7. **Webfonts** - boilerplate ships "Geist" via fontsource. If required, swap it: `npm un @fontsource/geist` then install your own. Adjust the import statement at the layout level.
8. **`./src/styles/tailwind.config.css`**:
   - Update the font section (replace/add fonts), if you swaped the font the step before.
   - Update colors (Branding / Utility). Prefer editing hex codes or adding colors; do **not** remove lines until demo content is replaced (removals break demo content).
   - Optionally adjust breakpoints and add anything else known up front - only if explicitly stated by the user.
9. **CSS layering** - extend [global.css](../src/styles/global.css) and the other files in `./src/styles/`, if required by the design of the project you are creation. The model:
   - TailwindCSS as base.
   - `global.css` for custom rules, base styling, and single-source-of-truth duplicated bits (e.g. buttons).
   - Per-page CSS files imported at page level (e.g. `long-text-content.css`).
   - Super custom stuff stays in the page/component (Tailwind classes or scoped `<style>` - set the [`@reference`](https://tailwindcss.com/docs/functions-and-directives#reference-directive) to `tailwind.config.css`).
10. **Prune languages** - delete unused language subfolders in `./src/content/` and `./src/pages/`. For a single language, also drop `./src/pages/[lang]` and [language-select.astro](../src/components/layout/language-select.astro).
11. **Open Graph / X meta** - review and extend [ogx.astro](../src/components/head/ogx.astro).
12. **Page structure** - shape `./src/pages/` to your routes (one file per page, can start empty). For >1 language: string-translated pages go in `[lang]/`; content-heavy / per-language pages go in explicit subfolders (`de/`, `es/`, ...) with hard-coded text.
13. **Rendering mode** - static SSG by default and as Astro best practice. Some dynamic collections opt out via `theme.config.ts` to demo how to deal with extremely large content collections. Adjust if a static export is required or if SSR makes sense for other content collections as well. On-demand collections also have `deferRender` enabled on their glob loader, so entries are rendered on demand rather than eagerly during sync — lowering memory usage for large collections.
    - Security note: Any content loaded from an external CMS/API is untrusted. Sanitize rich HTML with `sanitizeTrustedHtmlFragment` before rendering it with `set:html` or a Markdown renderer, and use `toSafeJsonScript` for JSON embedded inside `<script>` elements. Do not rely on the CSP as the only XSS protection because Stardrive intentionally keeps inline scripts enabled for
      compatibility.
14. **Navigation** - edit `./src/components/layout/nav`.
15. **Layout** - review `./src/layouts` and `./src/components/layout`; match the site's general layout.
16. **i18n strings** - update the JSON files in `./src/i18n/` as you build the layout.
17. **Map data** - delete [office.pmtiles](../public/map/office.pmtiles) (demo contact page) and advice the user on how to create his own one - or drop the feature completely.
18. **Images** - delete demo images in `./src/images`, keep the folder structure. Site images → `./src/images/`; article/integration images → their subfolders. Use `./public/images/` for stable-URL non-article images and `./public/data/` for shareable public files.
19. **Validate** - run `npm run check:astro` and fix errors from removed demo links/content.
20. **Agent Skills** - review [`public/.well-known/agent-skills`](../public/.well-known/agent-skills). Replace the boilerplate's Stardrive-specific skill with skills the project genuinely publishes, or remove the directory. After changing a skill artifact, update its SHA-256 digest in `index.json`.
21. **Cloudflare files** - only if on Cloudflare: adjust [`_headers`](../public/_headers) and [`_redirects`](../public/_redirects). Preserve the homepage `Link` header for agent discovery or point it to another useful machine-readable resource. For other hosts, configure an equivalent response header. For migrations, map old paths to the new structure.
22. **Deployment** - for Cloudflare, adjust [wrangler.jsonc](../wrangler.jsonc). Disable **Speed Brain** in the Cloudflare dashboard (Speed → Optimization → Speed Brain) — Astro's own [prefetching](https://docs.astro.build/en/guides/prefetch/) conflicts with it and can cause double-fetches or stale content.
