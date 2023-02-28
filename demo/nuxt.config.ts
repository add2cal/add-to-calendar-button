// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';
import { EnumChangefreq } from 'sitemap';

const baseUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://add-to-calendar-button.com';

export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n', '@nuxtjs/tailwindcss', 'nuxt-headlessui', 'nuxt-schema-org', '@vite-pwa/nuxt', 'nuxt-simple-sitemap', 'nuxt-delay-hydration'],
  vue: {
    compilerOptions: {
      // treat all tags starting with "add-" as custom elements
      isCustomElement: (tag) => tag.startsWith('add-'),
    },
  },
  ssr: true,
  nitro: {
    preset: 'azure',
  },
  runtimeConfig: {
    public: {
      siteUrl: baseUrl,
    },
  },
  experimental: {
    payloadExtraction: true,
    inlineSSRStyles: true,
  },
  delayHydration: {
    mode: 'mount',
    debug: process.env.NODE_ENV === 'development',
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      viewport: 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes',
      meta: [
        { 'http-equiv': 'content-type', content: 'text/html; charset=utf-8' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
        { name: 'author', content: 'Add to Calendar' },
        { name: 'publisher', content: 'Add to Calendar' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Add to Calendar Button' },
        { property: 'og:image', content: baseUrl + '/assets/img/fb.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: baseUrl },
        { name: 'twitter:creator', content: 'add2calendar' },
        { name: 'twitter:image', content: baseUrl + '/assets/img/tw.png' },
        { name: 'msapplication-TileColor', content: '#9755ff' },
        { name: 'msapplication-TileImage', content: baseUrl + '/assets/favicons/mstile-144x144.png' },
        { name: 'msapplication-config', content: baseUrl + '/browserconfig.xml' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'theme-color', content: '#9755ff' },
        { name: 'apple-mobile-web-app-title', content: 'Add to Calendar Button' },
        { name: 'application-name', content: 'Add to Calendar Button' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: '#9755ff' },
      ],
      link: [
        { rel: 'canonical', href: baseUrl },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: baseUrl + '/assets/favicons/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: baseUrl + '/assets/favicons/favicon-16x16.png' },
        { rel: 'icon', type: 'image/svg+xml', href: baseUrl + '/assets/favicons/favicon.svg' },
        { rel: 'shortcut icon', href: baseUrl + '/assets/favicons/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '57x57', href: baseUrl + '/assets/favicons/apple-touch-icon-57x57.png' },
        { rel: 'apple-touch-icon', sizes: '60x60', href: baseUrl + '/assets/favicons/apple-touch-icon-60x60.png' },
        { rel: 'apple-touch-icon', sizes: '72x72', href: baseUrl + '/assets/favicons/apple-touch-icon-72x72.png' },
        { rel: 'apple-touch-icon', sizes: '76x76', href: baseUrl + '/assets/favicons/apple-touch-icon-76x76.png' },
        { rel: 'apple-touch-icon', sizes: '114x114', href: baseUrl + '/assets/favicons/apple-touch-icon-114x114.png' },
        { rel: 'apple-touch-icon', sizes: '120x120', href: baseUrl + '/assets/favicons/apple-touch-icon-120x120.png' },
        { rel: 'apple-touch-icon', sizes: '144x144', href: baseUrl + '/assets/favicons/apple-touch-icon-144x144.png' },
        { rel: 'apple-touch-icon', sizes: '152x152', href: baseUrl + '/assets/favicons/apple-touch-icon-152x152.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: baseUrl + '/assets/favicons/apple-touch-icon-180x180.png' },
        { rel: 'mask-icon', color: '#9755ff', href: baseUrl + '/assets/favicons/safari-pinned-tab.svg' },
        { rel: 'dns-prefetch', href: 'https://a.add-to-calendar-button.com' },
        { rel: 'dns-prefetch', href: 'https://caldn.net' },
      ],
      script: [{ async: true, defer: true, 'data-website-id': 'd178e769-c435-4de9-87e5-48b0ec339f62', src: 'https://a.add-to-calendar-button.com/atcba.js', 'data-host-url': 'https://a.add-to-calendar-button.com', 'data-domains': 'add-to-calendar-button.com' }],
    },
  },
  schemaOrg: {
    host: baseUrl,
    tagPosition: 'head',
  },
  pwa: {
    registerType: 'autoUpdate',
    registerWebManifestInRouteRules: true,
    useCredentials: true,
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,ttf}'],
      navigateFallback: null,
      cleanupOutdatedCaches: true,
      sourcemap: true,
      runtimeCaching: [
        {
          handler: 'StaleWhileRevalidate',
          urlPattern: /.*$/,
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    manifestFilename: 'manifest.json',
    manifest: {
      name: 'Add to Calendar Button DEMO',
      short_name: 'Add2Cal DEMO',
      description: 'Demo and Guidance for the convenient JavaScript snippet, which lets you create beautiful buttons, where people can add events to their calendars',
      theme_color: '#9755ff',
      background_color: '#9755ff',
      display: 'standalone',
      start_url: '/',
      scope: '/',
      dir: 'ltr',
      icons: [
        {
          src: baseUrl + '/assets/favicons/android-chrome-36x36.png',
          sizes: '36x36',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: baseUrl + '/assets/favicons/android-chrome-48x48.png',
          sizes: '48x48',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: baseUrl + '/assets/favicons/android-chrome-72x72.png',
          sizes: '72x72',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: baseUrl + '/assets/favicons/android-chrome-96x96.png',
          sizes: '96x96',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: baseUrl + '/assets/favicons/android-chrome-144x144.png',
          sizes: '144x144',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: baseUrl + '/assets/favicons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: baseUrl + '/assets/favicons/android-chrome-256x256.png',
          sizes: '256x256',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: baseUrl + '/assets/favicons/android-chrome-384x384.png',
          sizes: '384x384',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: baseUrl + '/assets/favicons/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
      ],
      screenshots: [
        {
          src: baseUrl + '/assets/img/website1x1.png',
          sizes: '1920x1920',
        },
        {
          src: baseUrl + '/assets/img/website4x3.png',
          sizes: '1920x1440',
        },
        {
          src: baseUrl + '/assets/img/website16x9.png',
          sizes: '1920x1080',
        },
      ],
    },
  },
  i18n: {
    strategy: 'prefix_and_default',
    types: 'composition',
    langDir: 'locales',
    lazy: false,
    baseUrl: baseUrl,
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        iso: 'en',
        file: 'en.json',
        name: 'English',
      },
      {
        code: 'de',
        iso: 'de',
        file: 'de.json',
        name: 'Deutsch',
      },
    ],
    vueI18n: {
      locale: 'en',
      fallbackLocale: 'en',
      legacy: false,
      globalInjection: true,
      datetimeFormats: {
        en: {
          short: {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          },
        },
        de: {
          short: {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          },
        },
      },
      numberFormats: {
        en: {
          currency: {
            style: 'currency',
            currency: 'USD',
            useGrouping: true,
            currencyDisplay: 'symbol',
            notation: 'standard',
          },
          decimal: {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          },
        },
        de: {
          currency: {
            style: 'currency',
            currency: 'EUR',
            useGrouping: true,
            currencyDisplay: 'symbol',
            notation: 'standard',
          },
          decimal: {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          },
        },
      },
    },
  },
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: '~/tailwind.config.js',
    exposeConfig: false,
    viewer: false,
  },
  sitemap: {
    exclude: ['/en/**', 'legal-notice', 'privacy-policy', '*/legal-notice', '*/privacy-policy'],
    defaults: {
      priority: 1,
      changefreq: EnumChangefreq.DAILY,
      lastmod: new Date().toISOString(),
    },
  },
});
