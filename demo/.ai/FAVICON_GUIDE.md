<!-- Scope: favicon and manifest setup when invoked by CONFIG_GUIDE.md. -->

# Favicon Guide

This guide is invoked from the favicon step of [`CONFIG_GUIDE.md`](./CONFIG_GUIDE.md) (project mode). It produces the icon assets in `./public/`.

## Generation

Replace the favicon and `web-app-manifest-*` files in `./public/`.

First, ask the user whether they already have a base/source image (logo, mark) to generate from, or whether everything must be created from scratch.

Then pick a generation path:

- **Preferred:** generate the files yourself only if you can actually produce all required formats correctly - including a true multi-resolution `.ico` and exact pixel dimensions. If you cannot reliably emit a given format (commonly `.ico`), do not ship a fake or mislabeled file.
- **Fallback:** direct the user to [realfavicongenerator.net](https://realfavicongenerator.net/), have them download the set, and place the files for them. Use this whenever self-generation cannot meet the exact specs below.

Note that the webmanifest is generated dynamically from [`theme.config.ts`](../theme.config.ts) and must not be generated or duplicated anywhere else.

You should end up having 6 files + optional additional dark mode variants.

- favicon-96x96.png (square, 96px height, 96px width, png, transparent background if not explicitly set differently)
- apple-touch-icon.png (square, 180px height, 180px width, png, transparent background if not explicitly set differently)
- favicon.ico (square, 48px height, 48px width, ico, transparent background if not explicitly set differently)
- favicon.svg (square, svg, transparent background if not explicitly set differently)
- web-app-manifest-192x192.png (square, 192px height, 192px width, png, transparent background if not explicitly set differently)
- web-app-manifest-512x512.png (square, 512px height, 512px width, png, transparent background if not explicitly set differently)

Mind that the apple-touch-icon sits on a theme color. This color is specified in the [`theme.config.ts`](../theme.config.ts).

## Theme

Light/dark variants exist (device mode, not site mode); if unused, drop the dark icons and adjust [base.astro](../src/components/head/base.astro). For the SVG, handle light/dark inside the SVG code (see [favicon.svg](../public/favicon.svg)).
