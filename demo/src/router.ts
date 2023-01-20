import { createRouter, createWebHistory } from 'vue-router';
import { setI18nLanguage, loadLocaleResources, SUPPORT_LOCALES } from '@/i18n';
import type { Router, RouteRecordRaw } from 'vue-router';
import type { I18n } from 'vue-i18n';

// MIND TO ALSO UPDATE public/sitemap.xml IF YOU ADD OR REMOVE PAGES HERE!

export function setupRouter(i18n: I18n): Router {
  // setup routes
  const routes: RouteRecordRaw[] = [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/en',
      redirect: { name: 'home' },
    },
    {
      path: '/:locale',
      name: 'home-i18n',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/:locale/examples',
      name: 'examples',
      component: () => import('@/views/ExamplesView.vue'),
    },
    {
      path: '/:locale/advanced-use',
      name: 'advanced-use',
      component: () => import('@/views/AdvancedUseView.vue'),
    },
    {
      path: '/:locale/legal-notice',
      name: 'legal-notice',
      component: () => import('@/views/LegalNoticeView.vue'),
    },
    {
      path: '/:locale/privacy-policy',
      name: 'privacy-policy',
      component: () => import('@/views/PrivacyPolicyView.vue'),
    },
    {
      path: '/:locale/use',
      name: 'use',
      component: () => import('@/views/GuideView.vue'),
    },
    {
      path: '/:locale/use-with-angular',
      name: 'use-with-angular',
      component: () => import('@/views/GuideAngularView.vue'),
    },
    {
      path: '/:locale/use-with-astro',
      name: 'use-with-astro',
      component: () => import('@/views/GuideAstroView.vue'),
    },
    {
      path: '/:locale/use-with-react',
      name: 'use-with-react',
      component: () => import('@/views/GuideReactView.vue'),
    },
    {
      path: '/:locale/use-with-svelte',
      name: 'use-with-svelte',
      component: () => import('@/views/GuideSvelteView.vue'),
    },
    {
      path: '/:locale/use-with-vue',
      name: 'use-with-vue',
      component: () => import('@/views/GuideVueView.vue'),
    },
    {
      path: '/:locale/use-with-wordpress',
      name: 'use-with-wordpress',
      component: () => import('@/views/GuideWordPressView.vue'),
    },
    {
      path: '/:locale/configuration',
      name: 'configuration',
      component: () => import('@/views/ConfigView.vue'),
    },
    {
      path: '/:locale/what-is-an-add-to-calendar-button',
      name: 'seo',
      component: () => import('@/views/SeoView.vue'),
    },
    {
      path: '/:locale/:_(.*)',
      name: '404',
      component: () => import('@/views/404View.vue'),
    },
  ];

  // create router instance
  const router = createRouter({
    history: createWebHistory(),
    routes,
    strict: true,
    scrollBehavior(to, from, savedPosition) {
      if (to.hash) {
        return {
          el: to.hash,
          behavior: 'smooth',
        };
      }
      if (savedPosition) {
        return savedPosition;
      } else {
        return { top: 0 };
      }
    },
  });

  // navigation guards
  router.beforeEach(async (to) => {
    const paramsLocale = (function () {
      if (to.params.locale != null) {
        return to.params.locale as string;
      }
      return 'en';
    })();

    // use locale if paramsLocale is not in SUPPORT_LOCALES
    if (!SUPPORT_LOCALES.includes(paramsLocale)) {
      const storedLanguage = localStorage.getItem('user-language');
      if (storedLanguage != null && SUPPORT_LOCALES.includes(storedLanguage)) {
        return '/' + storedLanguage;
      }
      return '/';
    }

    // remove trailing slash
    if (to.fullPath.slice(-1) == '/' && to.fullPath.length > 1) {
      return to.fullPath.slice(0, -1);
    }

    // load locale resources
    if (!i18n.global.availableLocales.includes(paramsLocale)) {
      await loadLocaleResources(i18n, paramsLocale);
    }

    // set i18n language
    setI18nLanguage(i18n, paramsLocale);
  });

  return router;
}
