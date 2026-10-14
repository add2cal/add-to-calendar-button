---
publishDate: 2026-06-01
updatedDate: 2026-06-04
draft: false
question: '¿Tengo que alojarlo en Cloudflare?'
category: 'technical'
---

**No, puedes alojar Stardrive donde quieras.**

Recomendamos Cloudflare porque Astro y Stardrive están optimizados para su plataforma Workers, y el `wrangler.jsonc` que incluimos junto con el script de purga de caché hacen que esa configuración sea especialmente sencilla.

Como Astro es un framework frontend que compila a assets estáticos (con renderizado del lado del servidor bajo demanda opcional), puedes desplegar en Vercel, Netlify, Cloudflare, GitHub Pages, tu propio servidor o cualquier otro host estático.

**Si cambias de host, simplemente quita las partes específicas de Cloudflare - el resto del boilerplate seguirá funcionando tal cual.**
