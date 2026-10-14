---
publishDate: 2026-06-04
draft: false
question: 'Comment effectuer une mise à niveau'
category: 'technical'
---

En raison de son caractère de modèle, la mise à niveau d'un projet Stardrive vers la dernière version de Stardrive peut être un défi.

Tu peux le mettre à jour en récupérant la dernière version depuis le dépôt GitHub (via `git pull`).

Cependant, garde à l'esprit qu'en fonction de l'ampleur de tes modifications, tu peux facilement rencontrer des conflits susceptibles de bloquer complètement ce processus.

Dans ce cas, tu devrais adapter le code manuellement, en comparant les [changements](https://github.com/peltmonger/stardrive/CHANGELOG.md) actuels avec ta version et en mettant à jour les fichiers un par un. Tu peux aussi confier cette tâche à un agent de codage IA, qui la réalisera pour toi.

Dans la plupart des cas, tu n'as pas nécessairement besoin de mettre à niveau la version de Stardrive, mais simplement le paquet Astro sous-jacent.

Exécute `npx @astrojs/upgrade` pour ce faire. Garde à l'esprit que cela peut également comporter quelques tâches manuelles. Jette un œil à la [documentation officielle d'Astro](https://docs.astro.build/en/upgrade-astro/) et surtout aux changelogs et guides de migration.

> **Note :** La version locale de Stardrive est fixée dans le `package.json` sous la clé `stardriveVersion`. Lorsque tu vérifies les modifications, compare les [notes de version du dépôt GitHub](https://github.com/peltmonger/stardrive/releases) avec l'état de ta version locale pour voir ce qui a changé depuis.
