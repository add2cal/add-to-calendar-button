import type { APIContext } from 'astro';
import { themeConfig } from '~/theme.config';

export async function GET(context: APIContext) {
  const siteUrl = (context.site ?? new URL(themeConfig.site)).toString().replace(/\/$/, '');

  const body = ['User-agent: *', 'Content-signal: search=yes, ai-train=yes', 'Allow: /', '', `Sitemap: ${siteUrl}/sitemap-index.xml`, ''].join('\n');

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
