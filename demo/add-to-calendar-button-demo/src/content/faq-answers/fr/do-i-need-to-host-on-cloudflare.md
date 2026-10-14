---
publishDate: 2026-06-01
updatedDate: 2026-06-04
draft: false
question: 'Dois-je héberger sur Cloudflare'
category: 'technical'
---

**Non, vous êtes libre d'héberger Stardrive où vous voulez.**

Nous recommandons Cloudflare parce qu'Astro et Stardrive sont optimisés pour leur plateforme Workers, et le `wrangler.jsonc` ainsi que le script de purge du cache que nous incluons rendent cette configuration particulièrement fluide.

Comme Astro est un framework frontend qui compile vers des assets statiques (avec un rendu côté serveur à la demande en option), vous pouvez déployer sur Vercel, Netlify, Cloudflare, GitHub Pages, votre propre serveur, ou tout autre hébergeur statique.

**Si vous changez d'hébergeur, retirez simplement les parties spécifiques à Cloudflare - le reste du boilerplate continuera de fonctionner tel quel.**
