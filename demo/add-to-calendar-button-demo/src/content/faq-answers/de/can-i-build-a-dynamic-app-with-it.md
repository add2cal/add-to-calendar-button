---
publishDate: 2026-06-01
updatedDate: 2026-06-04
draft: false
question: 'Kann ich damit eine dynamische App bauen'
category: 'technical'
---

**Ja und nein - es kommt darauf an, was du mit "dynamisch" meinst.**

Astro ist ein Frontend-Framework. Es läuft clientseitig und optional zusätzlich mit On-Demand-Server-Side-Rendering und Middleware obendrauf. Das deckt viele dynamische Anwendungsfälle ab: Formulare, Suche, Filterung, interaktive UI-Komponenten, personalisierte Seiten und mehr.

Du kannst sogar Komponenten einbinden, die in React, Vue oder Svelte geschrieben sind - über die sogenannten ["Dynamic Islands"](https://docs.astro.build/en/concepts/islands/).

Was es **nicht** ist, ist ein Backend. Alles, was sensible Daten, authentifizierte Geschäftslogik oder eine Datenbank betrifft, gehört in einen richtigen Backend-Service, mit dem Stardrive über eine API kommuniziert.

**Also: Dynamisches UI, dynamische Inhalte, dynamisches Rendering - ja. Full-Stack-App mit Datenbank und Auth im selben Projekt - nicht eigenständig, und das ist so gewollt.**
