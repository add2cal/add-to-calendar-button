---
publishDate: 2026-06-01
updatedDate: 2026-06-04
draft: false
question: 'Muss ich auf Cloudflare hosten'
category: 'technical'
---

**Nein, du kannst Stardrive hosten, wo du willst.**

Wir empfehlen Cloudflare, weil Astro und Stardrive für deren Workers-Plattform optimiert sind, und die mitgelieferte `wrangler.jsonc` zusammen mit dem Cache-Purge-Script das Setup besonders reibungslos machen.

Da Astro ein Frontend-Framework ist, das zu statischen Assets kompiliert (optional mit On-Demand-Server-Side-Rendering), kannst du auch auf Vercel, Netlify, Cloudflare, GitHub Pages, deinem eigenen Server oder jedem anderen statischen Host deployen.

**Wenn du den Host wechselst, entfernst du einfach die Cloudflare-spezifischen Teile - der Rest des Boilerplates funktioniert weiterhin wie gewohnt.**
