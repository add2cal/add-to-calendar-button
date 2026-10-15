# Add to Calendar Button Demo: Agent Guide

This directory contains the Astro demo and documentation site for the parent `add-to-calendar-button` package. Repository-wide rules in `../AGENTS.md` also apply.

## Stack and commands

- Astro, Vite, strict TypeScript, Tailwind CSS, Vue islands, and Cloudflare Workers.
- Read `package.json` for the authoritative scripts and dependencies.
- Use `npm run check` for Astro, TypeScript, ESLint, and Prettier checks.
- Use `npm run build` followed by `npm run check:artifacts` for production verification.
- Use `npm run fix` only for files owned by the current change.
- Edit source only. `dist/` and generated public outputs are not source.

## Architecture

- Routes live in `src/pages/`. Default-locale wrappers and `src/pages/[lang]/[slug].astro` share implementations from `src/components/docs/`.
- Short shared UI copy lives in `src/i18n/{en,de,fr,es}.json`; keep all four locale schemas aligned.
- Long-form or structurally different content belongs in `src/content/`, locale-aware content modules, or dedicated locale routes.
- FAQ content lives in `src/content/faq-answers/<locale>/`.
- Product, promotion, LLM, and dropped-feature settings live in `theme.config.ts`.
- `src/components/playground/PlaygroundArea.vue` is the interactive Vue island. Prefer Astro, native HTML, or small vanilla scripts elsewhere.
- `scripts/sync-version.js` pulls the parent package version into `src/components/layout/version.ts` during `predev` and `prebuild`; do not edit the generated version manually.

## Implementation rules

- Preserve public route compatibility and homepage anchors.
- Use SVG files as Astro components, not through Astro's `<Image>` component.
- Follow existing Tailwind and component patterns. Keep one-off markup inline; extract components for reuse or genuinely self-contained complexity.
- Keep accessibility fundamentals: semantic HTML, labels, keyboard/touch/mouse support, visible focus, reduced motion, and sufficient contrast.
- This is a frontend project. Do not place secrets or privileged backend logic in it.
- Prefer Astro and platform features before adding client JavaScript. Use Vue only where the existing playground architecture requires it.
- Use `sanitizeTrustedHtmlFragment` and `toSafeJsonScript` from `src/utils/security.ts` at their respective HTML and JSON script boundaries.
- Keep custom analytics events separate from the existing pageview tracking and avoid high-cardinality or user-entered payloads.
- When restoring a feature listed in `theme.config.ts#droppedFeatures`, first compare the current Stardrive implementation instead of rebuilding it blindly.

## Styling details

- Shared prose styling belongs in `src/styles/`; import it through the `@styles/*` alias.
- Inside scoped Astro `<style>` blocks, Tailwind's `@reference` must use a relative path because CSS does not resolve the TypeScript aliases.
- Preserve responsive behavior across mobile and desktop and test both light and dark themes.

## Upstream provenance

The site started from Astro Stardrive. `package.json#stardriveVersion` records the baseline for manual upstream comparisons; update it when intentionally adopting a newer Stardrive release.
