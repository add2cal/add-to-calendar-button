import { defineConfig, svgoOptimizer } from 'astro/config';
import type { Config } from 'svgo';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vue from '@astrojs/vue';
import icon from 'astro-icon';
import { unified, rehypeHeadingIds } from '@astrojs/markdown-remark';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import astroExpressiveCode from 'astro-expressive-code';
import { externalLinking } from './src/plugins/external-linking';
import { rehypeYoutubePlugin } from './src/plugins/youtube-embed';
import { themeConfig } from './theme.config';
import cloudflare from '@astrojs/cloudflare';

// i18n config for sitemap integration
export const sitemap_i18n = {
  defaultLocale: themeConfig.i18n.defaultLocale,
  locales: themeConfig.i18n.locales.reduce((acc, lang) => ({ ...acc, [lang]: lang }), {}),
};

const sitemapExcludedPaths = new Set(['/404', '/404_dynamic', ...themeConfig.i18n.locales.map((locale) => `/${locale}/404`)]);

// Shared SVGO config used by the experimental svgOptimizer, astro-icon, and astro-compress.
const svgoConfig: Config = {
  multipass: true,
  floatPrecision: 5,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: false,
          inlineStyles: false,
          mergeStyles: false,
          removeHiddenElems: false,
          convertShapeToPath: false,
          convertEllipseToCircle: false,
          convertPathData: false,
          convertTransform: {
            degPrecision: 1,
            transformPrecision: 3,
          },
          removeEmptyAttrs: false,
          removeDesc: false,
        },
      },
    },
    'convertStyleToAttrs',
    'removeRasterImages',
    'reusePaths',
    {
      name: 'removeXlink',
      params: { includeLegacy: true },
    },
    {
      name: 'prefixIds',
      params: {
        delim: '_',
        prefix: () => Math.random().toString(36).slice(2, 8),
        prefixIds: true,
        prefixClassNames: false,
      },
    },
  ],
};

// https://astro.build/config
export default defineConfig({
  site: themeConfig.site,
  // Astro projects are intended to deliver static pages and not to be fully rendered on-demand!
  // You can use 'server' for SSR, see https://docs.astro.build/en/guides/on-demand-rendering/, but it is not recommended.
  // Best approach: Use static and opt-out some pages from prerendering if needed and supported by your hosting solution (https://docs.astro.build/en/reference/routing-reference/#per-page-override).
  // You can find an option in the themes.config.ts to mark content collections as dynamic, which will then render them on-demand instead of prerendering them.
  output: 'static',
  session: false, // adjust if you require session support for your site (e.g. for user login, etc.)
  trailingSlash: 'never',

  build: {
    format: 'file',
  },

  image: {
    remotePatterns: [{ protocol: 'https' }], // only allows remote images with https, see https://docs.astro.build/en/guides/images/#authorizing-remote-images for more options
    responsiveStyles: true, // set false for less convenience, but more control; https://docs.astro.build/en/reference/configuration-reference/#imageresponsivestyles
    layout: 'constrained',
    // Astro generates variants for each width in this list (plus the image's intrinsic width).
    // Defaults are [640, 750, 828, 1080, 1200, 1920]; This is our recommendation based on Tailwind defaults.
    breakpoints: [414, 576, 768, 976, 1440, 1600],
  },

  experimental: {
    // Always include svg images as components or <img> tags, never via Astro's <Image> component. The latter one is not supported by Cloudflare and might also break in other scenarios.
    // To auto-optimize SVGs, we use the svgo optimizer. If your svg files look strange, you might want to tweak its configuration or even disable it.
    // See https://docs.astro.build/en/reference/experimental-flags/svg-optimization/
    svgOptimizer: svgoOptimizer(svgoConfig),
  },

  vite: {
    plugins: [
      tailwindcss(),
      // The following are workarounds for issues with the Cloudflare adapter and its on-demand SSR runtime (workerd).
      // See https://docs.astro.build/en/guides/integrations-guide/cloudflare/#some-dependencies-might-need-to-be-pre-compiled for details.
      //
      // Custom Plugin: Neutralize `createRequire(import.meta.url)` in fdir (used by astro/loaders -> tinyglobby -> picomatch) to avoid "The argument 'path' ... Received 'undefined'" errors in workerd.
      {
        name: 'neutralize-create-require-for-workerd',
        enforce: 'post',
        apply: 'build',
        renderChunk(code) {
          if (!code.includes('createRequire(import.meta.url)')) return null;
          return {
            code: code.replaceAll('createRequire(import.meta.url)', '() => ({ resolve: () => { throw new Error("no require"); }, })'),
            map: null,
          };
        },
      },
    ],
    // Pre-compilation of dependencies that are not compatible with the Cloudflare workerd runtime (on-demand SSR) or that are ESM-only and not pre-bundled by Vite.
    optimizeDeps: {
      include: ['debug', 'ms', 'fdir > picomatch', 'expressive-code > postcss'],
      exclude: ['astro/assets/services/noop'],
    },
  },

  markdown: {
    processor: unified({
      rehypePlugins: [
        rehypeYoutubePlugin, // custom plugin to create optimized youtube embeds from youtube links in markdown content; see src/plugins/youtube-embed.ts for details
        rehypeHeadingIds, // adds ids to markdown headings, which are needed for the autolink plugin and also the table of contents generation
        [
          rehypeAutolinkHeadings, // adds anchor links to markdown headings; needs to be added after the rehypeHeadingIds plugin, so that it can find the generated ids
          {
            behavior: 'wrap',
          },
        ],
        [
          externalLinking, // custom plugin to add target="_blank" and rel="noopener" to external links in markdown content; see src/plugins/external-linking.ts for details
          {
            domain: themeConfig.site,
          },
        ],
      ],
    }),
  },

  i18n: {
    defaultLocale: themeConfig.i18n.defaultLocale,
    locales: themeConfig.i18n.locales,
    routing: {
      prefixDefaultLocale: false,
      fallbackType: 'redirect',
    },
  },

  integrations: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'add-to-calendar-button',
        },
      },
    }),
    sitemap({
      xslURL: '/sitemap.xsl',
      i18n: sitemap_i18n,
      filter: (page) => !sitemapExcludedPaths.has(new URL(page).pathname),
    }),
    icon({
      svgoOptions: svgoConfig,
    }),
    // Expressive Code options live in `ec.config.mjs` in the project root, so both the
    // Markdown integration and the `<Code>` component share the same config.
    astroExpressiveCode(),
    (await import('astro-compress')).default({
      CSS: false, // disabled: astro-compress's CSS minifier (csso) strips Tailwind v4's modern `@media (width >= ...)` range syntax, which removes all responsive breakpoints and makes the site render mobile-only. Vite already minifies CSS safely.
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      SVG: {
        svgo: svgoConfig,
      },
    }),
  ],

  adapter: cloudflare({
    // Compile image variants at build time so they also work in local and branch previews.
    // The Cloudflare service emits /cdn-cgi/image URLs that only resolve behind a
    // Cloudflare zone with Image Transformations enabled.
    imageService: 'cloudflare',
    prerenderEnvironment: 'node', // only applies to prerendering at build time. On-demand SSR always uses the Cloudflare workerd runtime. Node is currently required here because some render-time dependencies call Node-only path/url APIs that are not available in workerd's isolated runtime.
  }),
});
