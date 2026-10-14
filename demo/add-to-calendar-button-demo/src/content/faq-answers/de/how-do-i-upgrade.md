---
publishDate: 2026-06-04
draft: false
question: 'Wie führe ich ein Upgrade durch'
category: 'technical'
---

Aufgrund seines Boilerplate-Charakters kann das Upgrade eines Stardrive-Projekts auf die neueste Stardrive-Version eine Herausforderung sein.

Du kannst es aktualisieren, indem du die neueste Version aus dem GitHub-Repository einspielst (via `git pull`).

Beachte jedoch, dass du je nachdem, wie viel du geändert hast, leicht in Konflikte geraten kannst, die diesen Prozess vollständig blockieren können.

In diesem Fall müsstest du den Code manuell anpassen, indem du die aktuellen [Änderungen](https://github.com/peltmonger/stardrive/CHANGELOG.md) mit deiner Version vergleichst und Dateien einzeln aktualisierst. Du kannst diese Aufgabe auch einem KI-Coding-Agent übergeben, der sie für dich erledigt.

In den meisten Fällen musst du nicht unbedingt die Stardrive-Version aktualisieren, sondern lediglich das zugrunde liegende Astro-Paket.

Führe dazu `npx @astrojs/upgrade` aus. Beachte, dass auch dies mit einigen manuellen Aufgaben verbunden sein kann. Wirf einen Blick in die [offizielle Astro-Dokumentation](https://docs.astro.build/en/upgrade-astro/) und dort vor allem auf die Changelogs und Migrationsleitfäden.

> **Hinweis:** Die lokale Stardrive-Version ist in der `package.json` unter dem Schlüssel `stardriveVersion` hinterlegt. Wenn du nach Änderungen suchst, vergleiche die [Release Notes im GitHub-Repository](https://github.com/peltmonger/stardrive/releases) mit dem Stand deiner lokalen Version, um zu sehen, was sich seitdem geändert hat.
