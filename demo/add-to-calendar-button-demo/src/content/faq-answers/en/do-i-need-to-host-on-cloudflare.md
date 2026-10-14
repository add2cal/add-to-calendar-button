---
publishDate: 2026-06-01
updatedDate: 2026-06-04
draft: false
question: 'Do I need to host on Cloudflare'
category: 'technical'
---

**No, you are free to host Stardrive wherever you want.**

We recommend Cloudflare because Astro and Stardrive are optimized for their Workers platform, and our included `wrangler.jsonc` plus cache-purge script make that setup particularly smooth.

Since Astro is a frontend framework that compiles to static assets (with optional on-demand server-side rendering), you can deploy to Vercel, Netlify, Cloudflare, GitHub Pages, your own server, or any other static host.

**If you switch hosts, just remove the Cloudflare-specific bits - the rest of the boilerplate will keep working as-is.**
