import type { RouterConfig } from '@nuxt/schema';

const findEl = async (hash: string, x = 0) => {
  return (
    document.querySelector(hash) ||
    new Promise((resolve) => {
      if (x > 0) {
        return resolve(document.querySelector('#app'));
      }
      setTimeout(() => {
        resolve(findEl(hash, 1));
      }, 300);
    })
  );
};

// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig>{
  async scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      if (to.name != from.name) {
        await findEl(to.hash);
      }
      return {
        el: to.hash,
        left: 0,
        behavior: 'smooth',
      };
    }
    return { top: 0, left: 0 };
  },
};
