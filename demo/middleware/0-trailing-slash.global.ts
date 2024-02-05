export default defineNuxtRouteMiddleware((to) => {
  // Redirect root domain.com to domain.com/ (adding a trailing slash)
  if (to.path === '') {
    return navigateTo('/', { redirectCode: 301 });
  }
  // For any sub path, redirect from trailing slash to without
  if (to.path !== '/' && to.path.endsWith('/')) {
    const newPath = to.path.slice(0, -1);
    return navigateTo(newPath, { redirectCode: 301 });
  }
});
