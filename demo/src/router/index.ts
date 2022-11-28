import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

// MIND TO ALSO UPDATE public/sitemap.xml IF YOU ADD OR REMOVE PAGES HERE!

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/examples',
    name: 'examples',
    component: () => import('../views/ExamplesView.vue'),
    meta: {
      title: 'Examples | Add to Calendar Button',
    },
  },
  {
    path: '/advanced-use',
    name: 'advanced-use',
    component: () => import('../views/AdvancedUseView.vue'),
    meta: {
      title: 'Advanced Use | Add to Calendar Button',
    },
  },
  {
    path: '/legal-notice',
    name: 'legal-notice',
    component: () => import('../views/ExamplesView.vue'),
    meta: {
      title: 'Examples | Add to Calendar Button',
      robots: 'noindex, nofollow',
    },
  },
  {
    path: '/privacy-policy',
    name: 'privacy-policy',
    component: () => import('../views/PrivacyPolicyView.vue'),
    meta: {
      title: 'Privacy Policy | Add to Calendar Button',
      robots: 'noindex, nofollow',
    },
  },
  {
    path: '/use',
    name: 'use',
    component: () => import('../views/GuideView.vue'),
    meta: {
      title: 'Integration Guide | Add to Calendar Button',
    },
  },
  {
    path: '/use-with-vue',
    name: 'use-with-vue',
    component: () => import('../views/GuideVueView.vue'),
    meta: {
      title: 'Vue Integration Guide | Add to Calendar Button',
    },
  },
  {
    path: '/use-with-react',
    name: 'use-with-react',
    component: () => import('../views/GuideVueView.vue'),
    meta: {
      title: 'React Integration Guide | Add to Calendar Button',
    },
  },
  {
    path: '/use-with-angular',
    name: 'use-with-angular',
    component: () => import('../views/GuideVueView.vue'),
    meta: {
      title: 'Angular Integration Guide | Add to Calendar Button',
    },
  },
  {
    path: '/use-with-astro',
    name: 'use-with-astro',
    component: () => import('../views/GuideVueView.vue'),
    meta: {
      title: 'Astro Integration Guide | Add to Calendar Button',
    },
  },
  {
    path: '/use-with-svelte',
    name: 'use-with-svelte',
    component: () => import('../views/GuideVueView.vue'),
    meta: {
      title: 'Svelte Integration Guide | Add to Calendar Button',
    },
  },
  {
    path: '/use-with-wordpress',
    name: 'use-with-wordpress',
    component: () => import('../views/GuideVueView.vue'),
    meta: {
      title: 'WordPress Integration Guide | Add to Calendar Button',
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const title = (function () {
    if (to.meta.title != null && to.meta.title != '') {
      return to.meta.title;
    }
    return 'Add to Calendar Button | The free and easy tool for more convenient event sharing';
  })();
  document.title = `${title}`;
  const robots = (function () {
    if (to.meta.robots != null && to.meta.robots != '') {
      return to.meta.robots;
    }
    return 'index, follow';
  })();
  const robotsEl = document.querySelector('meta[name="robots"]');
  if (robotsEl) robotsEl.setAttribute('content', `${robots}`);
  next();
});

export default router;
