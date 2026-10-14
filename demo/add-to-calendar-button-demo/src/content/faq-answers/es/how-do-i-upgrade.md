---
publishDate: 2026-06-04
draft: false
question: 'Cómo actualizo'
category: 'technical'
---

Debido a su carácter de plantilla, actualizar un proyecto Stardrive a la última versión de Stardrive puede ser un desafío.

Puedes actualizarlo incorporando la última versión desde el repositorio de GitHub (mediante `git pull`).

Sin embargo, ten en cuenta que, según la cantidad de cambios que hayas realizado, puedes encontrarte fácilmente con conflictos que pueden bloquear este proceso por completo.

En ese caso, tendrías que adaptar el código manualmente, comparando los [cambios](https://github.com/peltmonger/stardrive/CHANGELOG.md) actuales con tu versión y actualizando los archivos uno por uno. También puedes encomendar esta tarea a un agente de codificación con IA, que la realizará por ti.

En la mayoría de los casos, no necesitas actualizar necesariamente la versión de Stardrive, sino simplemente el paquete subyacente de Astro.

Ejecuta `npx @astrojs/upgrade` para hacerlo. Ten en cuenta que esto también puede implicar algunas tareas manuales. Echa un vistazo a la [documentación oficial de Astro](https://docs.astro.build/en/upgrade-astro/) y, sobre todo, a los changelogs y guías de migración.

> **Nota:** La versión local de Stardrive está fijada en el `package.json` bajo la clave `stardriveVersion`. Al comprobar si hay cambios, compara las [notas de versión en el repositorio de GitHub](https://github.com/peltmonger/stardrive/releases) con el estado de tu versión local para ver qué ha cambiado desde entonces.
