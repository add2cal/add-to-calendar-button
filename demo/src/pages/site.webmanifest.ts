import { themeConfig } from '~/theme.config';

export async function GET() {
  if (!themeConfig.generateWebmanifest) {
    return new Response(null, { status: 404 });
  }

  const name = themeConfig.name || new URL(themeConfig.site).hostname;
  const shortName = themeConfig.shortName || themeConfig.name;
  const color = themeConfig.themeColor || themeConfig.primaryColor || '#ffffff';

  const manifest = {
    name,
    short_name: shortName,
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    theme_color: color,
    background_color: color,
    display: 'standalone',
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
    },
  });
}
