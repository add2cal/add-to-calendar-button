import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import vueI18n from '@intlify/vite-plugin-vue-i18n';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // treat all tags with a dash as custom elements
          isCustomElement: (tag) => tag.includes('-'),
        },
      },
    }),
    vueI18n({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './locales/**'),
    }),
    VitePWA({
      registerType: 'autoUpdate',
      manifestFilename: 'manifest.json',
      manifest: {
        name: 'Add to Calendar Button DEMO',
        short_name: 'Add2Cal DEMO',
        description: 'Demo and Guidance for the convenient JavaScript snippet, which lets you create beautiful buttons, where people can add events to their calendars',
        icons: [
          {
            src: 'https://add-to-calendar-button.com/assets/favicons/android-chrome-36x36.png',
            sizes: '36x36',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'https://add-to-calendar-button.com/assets/favicons/android-chrome-48x48.png',
            sizes: '48x48',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'https://add-to-calendar-button.com/assets/favicons/android-chrome-72x72.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'https://add-to-calendar-button.com/assets/favicons/android-chrome-96x96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'https://add-to-calendar-button.com/assets/favicons/android-chrome-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'https://add-to-calendar-button.com/assets/favicons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'https://add-to-calendar-button.com/assets/favicons/android-chrome-256x256.png',
            sizes: '256x256',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'https://add-to-calendar-button.com/assets/favicons/android-chrome-384x384.png',
            sizes: '384x384',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'https://add-to-calendar-button.com/assets/favicons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
        screenshots: [
          {
            src: 'https://add-to-calendar-button.com/assets/img/website1x1.png',
            sizes: '1920x1920',
          },
          {
            src: 'https://add-to-calendar-button.com/assets/img/website4x3.png',
            sizes: '1920x1440',
          },
          {
            src: 'https://add-to-calendar-button.com/assets/img/website16x9.png',
            sizes: '1920x1080',
          },
        ],
        theme_color: '#9755ff',
        background_color: '#9755ff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
      },
      useCredentials: true,
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,ttf}'],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
