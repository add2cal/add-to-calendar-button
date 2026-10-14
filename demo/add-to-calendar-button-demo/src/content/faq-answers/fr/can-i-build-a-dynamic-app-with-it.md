---
publishDate: 2026-06-01
updatedDate: 2026-06-04
draft: false
question: 'Puis-je construire une application dynamique avec'
category: 'technical'
---

**Oui et non - cela dépend de ce que vous entendez par "dynamique".**

Astro est un framework frontend. Il s'exécute côté client et, en option, avec du rendu côté serveur à la demande et du middleware par-dessus. Cela couvre beaucoup de cas dynamiques : formulaires, recherche, filtrage, composants d'UI interactifs, pages personnalisées, etc.

Vous pouvez même inclure des composants écrits en React, Vue ou Svelte via ce qu'on appelle les ["Dynamic Islands"](https://docs.astro.build/en/concepts/islands/).

Ce qu'il **n'est pas**, c'est un backend. Tout ce qui touche aux données sensibles, à la logique métier authentifiée ou à une base de données doit vivre dans un véritable service backend, avec lequel Stardrive dialogue via une API.

**Donc : UI dynamique, contenu dynamique, rendu dynamique - oui. App full-stack avec base de données et auth dans le même projet - non, pas en autonomie, et c'est volontaire.**
