---
publishDate: 2026-06-01
updatedDate: 2026-06-04
draft: false
question: '¿Puedo construir una app dinámica con esto?'
category: 'technical'
---

**Sí y no, depende de a qué te refieras con "dinámica".**

Astro es un framework frontend. Se ejecuta del lado del cliente y, opcionalmente, con renderizado del lado del servidor bajo demanda y middleware por encima. Eso cubre muchos casos dinámicos: formularios, búsqueda, filtros, componentes de UI interactivos, páginas personalizadas, etc.

Incluso puedes incluir componentes escritos en React, Vue o Svelte con las llamadas ["Dynamic Islands"](https://docs.astro.build/en/concepts/islands/).

Lo que **no** es, es un backend. Cualquier cosa que implique datos sensibles, lógica de negocio autenticada o una base de datos tiene que vivir en un servicio backend real con el que Stardrive se comunique vía API.

**Así que: UI dinámica, contenido dinámico, renderizado dinámico, sí. App full-stack con base de datos y autenticación en el mismo proyecto, no de forma autónoma, y eso es a propósito.**
