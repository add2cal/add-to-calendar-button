import type { RouterConfig } from '@nuxt/schema';

const offset = (function () {
  if (typeof window !== 'undefined') {
    // on mobile, we use a small offset
    if (window.innerWidth < 976) {
      return 70;
    }
  }
  return 0;
})();

// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig>{
  async scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    // if we have a saved position (when going back)
    if (savedPosition) {
      if (to.name != from.name && from.name != undefined) {
        return new Promise((resolve) => {
          nuxtApp.hook('page:finish', () => {
            resolve(savedPosition);
          });
        });
      }
      return savedPosition;
    }
    // if we are dealing with a hash/anchor
    if (to.hash) {
      if (to.name != from.name && from.name != undefined) {
        return new Promise((resolve) => {
          nuxtApp.hook('page:finish', () => {
            resolve({
              el: to.hash,
              top: offset,
              left: 0,
            });
          });
        });
      }
      return {
        el: to.hash,
        top: offset,
        left: 0,
        behavior: 'smooth',
      };
    }
    // in all other regular cases
    if (to.name != from.name && from.name != undefined) {
      return new Promise((resolve) => {
        nuxtApp.hook('page:finish', () => {
          resolve({
            top: 0,
            left: 0,
          });
        });
      });
    }
    return undefined;
  },
};
