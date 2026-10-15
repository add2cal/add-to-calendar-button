export const locales = ['en', 'de', 'fr', 'es'] as const;
export type DocsLocale = (typeof locales)[number];

export const docSlugs = ['configuration', 'examples', 'advanced-use', 'use', 'use-with-angular', 'use-with-astro', 'use-with-nextjs', 'use-with-nuxt', 'use-with-react', 'use-with-svelte', 'use-with-vue', 'use-with-wix', 'use-with-wordpress', 'what-is-an-add-to-calendar-button', 'migration-guide-v2-to-v3'] as const;
export type DocSlug = (typeof docSlugs)[number];

export const pathFor = (slug: string, locale: DocsLocale) => {
  const base = locale === 'en' ? '' : `/${locale}`;
  return slug ? `${base}/${slug}` : base || '/';
};

export const frameworkNames = ['angular', 'astro', 'nextjs', 'nuxt', 'react', 'svelte', 'vue', 'wix', 'wordpress'] as const;
export type FrameworkName = (typeof frameworkNames)[number];
