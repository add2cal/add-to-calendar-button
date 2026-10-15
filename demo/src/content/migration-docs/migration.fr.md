# Migration de la v2 vers la v3

La version 3 conserve le même élément `<add-to-calendar-button>`, la même API impérative
`atcb_action` et les alias d'exécution des attributs et noms de calendriers existants de la v2. La
plupart des intégrations peuvent effectuer la mise à niveau en modifiant uniquement la version du
package ou du script installé.

Utilisez ce guide pour vérifier les quelques changements qui peuvent nécessiter une intervention
dans votre projet.

## Liste de contrôle de la migration

1. Mettez `add-to-calendar-button` à niveau vers la version 3 et continuez à utiliser l'entrée
   principale du package.
2. Si vous utilisez TypeScript, renommez la propriété de configuration typée `proKey` en `prokey`.
3. Renommez `created` et `updated` en `icsCreated` et `icsUpdated` dans la configuration JavaScript,
   ou en `ics-created` et `ics-updated` dans les attributs HTML.
4. Si vous fournissez `customLabels`, mettez à jour les clés de traduction renommées indiquées
   ci-dessous.
5. Si vous utilisez une ancienne entrée `no-pro`, `unstyle` ou `no-pro-unstyle`, passez à l'entrée
   principale. Les adaptateurs de compatibilité fonctionnent toujours, mais les builds dédiés
   n'existent plus.
6. Si vous utilisez le package npm avec un style autre que celui par défaut ou une langue autre que
   l'anglais, importez explicitement son module de style ou de paramètres régionaux.
7. Mettez à jour les attributs de données HTML avec leur orthographe officielle en kebab-case. Les
   anciennes orthographes restent compatibles pour le moment, mais pourront être supprimées dans
   une future version majeure.
8. Vérifiez que toutes les URL fournies utilisent un schéma autorisé et non exécutable.
9. Testez sur les navigateurs que vous prenez en charge. L'expérience v3 complète cible Baseline 2023.
10. Si du code serveur ou worker importe des utilitaires de date depuis la racine du package ou
    `/unstyle`, remplacez ces imports par l'entrée sans DOM `add-to-calendar-button/utils`.

Si aucun de ces cas ne s'applique, votre intégration v2 devrait continuer à fonctionner sans
modification.

## Mettre à niveau le package ou le script de navigateur

Les points d'entrée principaux n'ont pas changé :

| Intégration       | v2                                  | v3       |
| ----------------- | ----------------------------------- | -------- |
| ESM               | `import 'add-to-calendar-button'`   | inchangé |
| CommonJS          | `require('add-to-calendar-button')` | inchangé |
| Script navigateur | `<script src=".../atcb.js">`        | inchangé |
| API impérative    | `atcb_action(config, button)`       | inchangé |

Le bundle navigateur minifié `atcb.min.js` est désormais également inclus dans le package npm.

Les anciennes entrées de package `add-to-calendar-button/no-pro`,
`add-to-calendar-button/unstyle` et `add-to-calendar-button/no-pro-unstyle` restent disponibles
sous forme d'adaptateurs de dépréciation. De même, les anciens noms de fichiers CDN chargent le
package principal au moyen d'un petit adaptateur. Mettez ces intégrations à jour vers l'entrée
principale lorsque cela vous convient :

```js
import 'add-to-calendar-button';
```

L'entrée de compatibilité `/unstyle` n'est pas un build réservé aux serveurs : elle réexporte le
package principal et charge donc toujours Lit et le composant web. Les environnements d'exécution
serveur tels que Cloudflare Workers doivent utiliser l'entrée dédiée `/utils` lorsqu'ils ont
uniquement besoin des utilitaires de date décrits ci-dessous.

## Mettre à jour les configurations PRO TypeScript

La clé PRO typée est désormais `prokey`, conformément à l'attribut HTML officiel :

```ts
// v2
atcb_action({ proKey: '...' });

// v3
atcb_action({ prokey: '...' });
```

Il s'agit d'une rupture de compatibilité à la compilation pour les configurations `atcb_action`
typées et l'utilisation de `AddToCalendarButtonType`. L'ancienne propriété `proKey` reste un alias
à l'exécution pour les objets JavaScript simples. Le HTML existant tel que
`<add-to-calendar-button proKey="...">` continue également à fonctionner, car les noms d'attributs
HTML ne sont pas sensibles à la casse.

Les déclarations de types sont désormais générées dans un fichier `dist/index.d.ts` plat et
prennent en charge la résolution de modules par les bundlers, Node 16 et la résolution classique.
Les noms de types publics existants restent disponibles.

## Renommer les options d'horodatage ICS

Les options d'horodatage de la v2, dont le nom était général, utilisent désormais des noms ICS
explicites, car elles affectent uniquement la sortie Apple/iCal :

| v2        | Attribut HTML v3 | Propriété JavaScript v3 |
| --------- | ---------------- | ----------------------- |
| `created` | `ics-created`    | `icsCreated`            |
| `updated` | `ics-updated`    | `icsUpdated`            |

Contrairement à la plupart des attributs renommés dans la v3, les anciens noms `created` et
`updated` ne sont plus lus.

## Mettre à jour les clés des libellés personnalisés

Seules les intégrations qui remplacent exactement ces clés `customLabels` doivent être modifiées :

| Clé v2                      | Clé v3                      |
| --------------------------- | --------------------------- |
| `date.status.cancelled.cta` | `date.status.cancelled_cta` |
| `label.share.email.subject` | `label.share.email_subject` |
| `label.rsvp`                | `label.rsvp.title`          |
| `form.status`               | `form.status.title`         |
| `form.success`              | `form.success.title`        |

Il existe également une nouvelle clé `modal.clipboard.failed` pour la solution de secours de copie
manuelle affichée lorsque l'accès automatique au presse-papiers échoue.

## Préférer les nouveaux noms officiels d'attributs et de valeurs

Les noms officiels des attributs HTML sont désormais en kebab-case, par exemple `start-date`,
`button-style`, `recurrence-interval` et `recurrence-by-day`. Les orthographes camelCase, en
minuscules et avec des underscores de la v2 restent prises en charge en tant qu'alias. Lorsqu'un
nom officiel et un ancien alias sont tous deux présents, le nom officiel l'emporte.

Nous recommandons vivement de mettre à jour tous les attributs HTML avec leur orthographe
officielle en kebab-case lors de la migration vers la v3. Les alias assurent aujourd'hui la
compatibilité descendante, mais pourront être supprimés dans une future version majeure. Cette
recommandation s'applique uniquement aux attributs HTML. Pour les objets de configuration
JavaScript, y compris ceux transmis à `atcb_action`, camelCase reste l'orthographe privilégiée (par
exemple, `startDate` et `buttonStyle`).

Les valeurs des options de calendrier sont désormais en minuscules :

- `apple`
- `google`
- `ical`
- `ms365`
- `msteams`
- `outlookcom`
- `yahoo`

Les valeurs de la v2 telles que `Apple`, `Google`, `iCal`, `Microsoft365`, `MicrosoftTeams` et
`Outlook.com` continuent à fonctionner quelle que soit la casse. TypeScript expose les nouvelles
valeurs via `ATCBOptionName` et les anciennes via `ATCBOptionNameLegacy`.

Les valeurs d'état d'un événement sont également en minuscules : `tentative`, `confirmed` et
`cancelled`. Les valeurs de la v2 en majuscules fonctionnent toujours et les fichiers ICS générés
continuent à utiliser les valeurs en majuscules exigées par la spécification.

## Vérifier les URL fournies

La version 3 rejette les schémas d'URL permettant l'exécution de scripts, tels que `javascript:`.
Les URL fournies par la configuration de l'événement, notamment les fichiers ICS, les CSS
personnalisées, les images et les cibles de proxy, doivent utiliser un schéma autorisé. Les schémas
pris en charge incluent `http`, `https`, `webcal`, `webcals`, `mailto`, `intent` et
`data:text/calendar` lorsqu'ils sont applicables.

Les descriptions utilisant la syntaxe de lien `[url]...[/url]` ne créent des liens que pour les URL
HTTP(S), Webcal(S) et mailto. Les valeurs non prises en charge sont affichées sous forme de texte.

## Tenir compte du niveau minimal de prise en charge des navigateurs

La version 3 fournit l'expérience complète sur les navigateurs Baseline 2023, y compris Safari 16.4
et les navigateurs evergreen actuels. Les bundles ciblent ES2017. Le Shadow DOM déclaratif est une
amélioration progressive : les navigateurs qui ne le prennent pas en charge reviennent donc à un
rendu côté client.

Le menu déroulant suit désormais le modèle de menu WAI-ARIA (rôles `menu` et `menuitem`), et les
fenêtres modales utilisent des éléments `<dialog>` natifs. Si les tests ou le CSS de votre
application ciblent les anciens rôles `list`/`link` ou l'ancienne structure des fenêtres modales,
mettez ces sélecteurs à jour.

## Importer les styles autres que celui par défaut et les paramètres régionaux autres que l'anglais avec npm

Le style par défaut et l'anglais restent inclus dans le bundle. Pour les utilisateurs du package
npm, les autres styles et langues ne sont plus inclus automatiquement : vous devez importer
explicitement chaque style autre que celui par défaut et chaque paramètre régional autre que
l'anglais utilisé par votre application. Il s'agit d'une rupture de compatibilité avec la v2.

Par exemple :

```js
import 'add-to-calendar-button';
import 'add-to-calendar-button/styles/3d';
import 'add-to-calendar-button/i18n/de';
```

Les intégrations normales par script de navigateur/CDN continuent à charger les styles et langues
demandés à la volée sous forme de petites ressources et ne nécessitent pas ces imports.

Vous pouvez également utiliser `style-source` pour remplacer l'URL de base des ressources chargées
à la demande, `load-all-styles` pour précharger tous les styles afin de les changer à l'exécution,
`atcb_register_style(name, css)` pour enregistrer un style ou `atcb_register_locale(lang, strings)`
pour enregistrer des paramètres régionaux.

Les paramètres régionaux complets sont pris en charge. Par exemple, `language="en_GB"` ou
`language="en-GB"` utilise les traductions régionales lorsqu'elles sont disponibles et conserve la
région pour le formatage des dates. L'ukrainien (`uk`) fait désormais partie du type de langue
public.

## Facultatif : utiliser le rendu côté serveur

La version 3 comprend une entrée réservée au SSR qui crée une structure Shadow DOM déclarative :

```js
import { atcb_generate_ssr_html } from 'add-to-calendar-button/ssr';

const html = atcb_generate_ssr_html({
  name: 'Launch Party',
  startDate: '2050-06-15',
  buttonStyle: '3d',
  language: 'de',
});
```

La structure reflète le style, la taille, le mode de couleur, la direction du texte et le libellé
du bouton. Le package de navigateur normal l'adopte et l'hydrate sans remplacer le shadow root déjà
affiché.

## Utiliser les utilitaires de date dans les environnements d'exécution serveur et worker

La version 3 fournit une entrée sans DOM pour Cloudflare Workers, Node et les environnements
d'exécution similaires :

```js
import { atcb_decorate_data_dates, atcb_generate_timestring } from 'add-to-calendar-button/utils';

const event = atcb_decorate_data_dates({
  dates: [
    {
      name: 'Launch Party',
      startDate: '2050-06-15',
      startTime: '10:00',
      endTime: '11:00',
      timeZone: 'Europe/Berlin',
    },
  ],
});

const label = atcb_generate_timestring(event.dates, 'en').join(' ');
```

L'export `/utils` prend en charge ESM, CommonJS et TypeScript sans importer Lit, le composant web,
les styles ou les variables globales du navigateur. L'importation de ces fonctions depuis le
package principal ou l'ancienne entrée `/unstyle` n'offre pas cette garantie.

## Nouvelles options réservées aux ICS

La version 3 ajoute des options qui affectent uniquement les fichiers Apple/iCal générés. Les autres
services de calendrier les ignorent :

- `ics-reminder` / `icsReminder`
- `ics-url` / `icsUrl`
- `ics-categories` / `icsCategories`
- `ics-class` / `icsClass`
- `ics-priority` / `icsPriority`
- `ics-geo` / `icsGeo`
- `ics-attach` / `icsAttach`
- `ics-exdate` / `icsExdate`

La première forme est l'attribut HTML ; la seconde est la propriété de configuration JavaScript.
`ics-exdate` ne s'applique qu'à la racine. Les autres options peuvent être appliquées aux entrées
individuelles d'un événement à plusieurs dates, les valeurs racines étant prioritaires.

## Améliorations du comportement ne nécessitant aucune migration

- Les événements récurrents dont les dates de début sont anciennes sont avancés efficacement tout
  en préservant le comportement de `COUNT` et `UNTIL`.
- Les échecs du presse-papiers affichent un champ de copie manuelle au lieu de signaler un faux
  succès.
- L'analyse des entrées supprime les clés de pollution de prototype et échappe de manière sécurisée
  la sortie de données enrichies.
- L'icône Google Calendar utilise le logo actuel.
