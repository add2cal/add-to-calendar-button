export default defineNuxtRouteMiddleware((to) => {
  // Redirect root domain.com to domain.com/ (adding a trailing slash)
  console.log('to.path', to.path);
  if (to.path === '') {
    console.log('redirecting root');
    return navigateTo('/', { redirectCode: 301 });
  }
  // For any sub path, redirect from trailing slash to without
  if (to.path !== '/' && to.path.endsWith('/')) {
    const newPath = to.path.slice(0, -1);
    console.log(`redirecting ${to.path} to ${newPath}`);
    return navigateTo(newPath, { redirectCode: 301 });
  }
});
