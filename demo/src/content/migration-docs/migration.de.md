# Migration von v2 zu v3

Version 3 behält dasselbe `<add-to-calendar-button>`-Element, dieselbe imperative `atcb_action`-
API sowie Laufzeit-Aliasse für bestehende v2-Attribute und Kalendernamen bei. Bei den meisten
Integrationen genügt es für das Upgrade, nur die Version des installierten Pakets oder Skripts zu ändern.

Prüfe anhand dieses Leitfadens die wenigen Änderungen, die in deinem Projekt Maßnahmen erfordern können.

## Migrationscheckliste

1. Aktualisiere `add-to-calendar-button` auf Version 3 und verwende weiterhin den Haupteinstiegspunkt des Pakets.
2. Wenn du TypeScript verwendest, benenne die typisierte `proKey`-Konfigurationseigenschaft in `prokey` um.
3. Benenne `created` und `updated` in der JavaScript-Konfiguration in `icsCreated` und `icsUpdated` um
   oder in HTML-Attributen in `ics-created` und `ics-updated`.
4. Wenn du `customLabels` angibst, aktualisiere die unten aufgeführten umbenannten Übersetzungsschlüssel.
5. Wenn du einen veralteten Einstiegspunkt `no-pro`, `unstyle` oder `no-pro-unstyle` verwendest, wechsle zum Haupteinstiegspunkt.
   Kompatibilitäts-Shims funktionieren weiterhin, aber die dedizierten Builds existieren nicht mehr.
6. Wenn du das npm-Paket mit einem nicht standardmäßigen Stil oder einer anderen Sprache als Englisch verwendest, importiere dessen Stil-
   oder Gebietsschema-Modul explizit.
7. Aktualisiere HTML-Datenattribute auf ihre offizielle Schreibweise in Kebab-Case. Veraltete Schreibweisen bleiben
   vorerst kompatibel, können aber in einer zukünftigen Hauptversion entfernt werden.
8. Prüfe, dass alle angegebenen URLs ein erlaubtes, nicht skriptfähiges Schema verwenden.
9. Teste in deinen unterstützten Browsern. Das vollständige v3-Erlebnis ist auf Baseline 2023 ausgerichtet.
10. Wenn Server- oder Worker-Code Datumswerkzeuge aus dem Paketstamm oder aus `/unstyle` importiert, stelle
    diese Importe auf den DOM-freien Einstiegspunkt `add-to-calendar-button/utils` um.

Wenn keiner dieser Fälle zutrifft, sollte deine v2-Integration unverändert weiter funktionieren.

## Paket oder Browser-Skript aktualisieren

Die primären Einstiegspunkte haben sich nicht geändert:

| Integration    | v2                                  | v3          |
| -------------- | ----------------------------------- | ----------- |
| ESM            | `import 'add-to-calendar-button'`   | unverändert |
| CommonJS       | `require('add-to-calendar-button')` | unverändert |
| Browser-Skript | `<script src=".../atcb.js">`        | unverändert |
| Imperative API | `atcb_action(config, button)`       | unverändert |

Das minimierte Browser-Bundle `atcb.min.js` ist jetzt ebenfalls im npm-Paket enthalten.

Die alten Paketeinstiegspunkte `add-to-calendar-button/no-pro`,
`add-to-calendar-button/unstyle` und `add-to-calendar-button/no-pro-unstyle` bleiben als
veraltete Shims verfügbar. Ebenso laden die alten CDN-Dateinamen das Hauptpaket über einen kleinen Shim.
Stelle diese Integrationen bei Gelegenheit auf den Haupteinstiegspunkt um:

```js
import 'add-to-calendar-button';
```

Der Kompatibilitätseinstiegspunkt `/unstyle` ist kein reiner Server-Build: Er exportiert das Hauptpaket erneut
und lädt daher weiterhin Lit und die Webkomponente. Server-Laufzeitumgebungen wie Cloudflare Workers müssen
den dedizierten Einstiegspunkt `/utils` verwenden, wenn sie nur die unten beschriebenen Datumshelfer benötigen.

## TypeScript-PRO-Konfigurationen aktualisieren

Der typisierte PRO-Schlüssel heißt jetzt `prokey` und entspricht damit dem offiziellen HTML-Attribut:

```ts
// v2
atcb_action({ proKey: '...' });

// v3
atcb_action({ prokey: '...' });
```

Dies ist eine Breaking Change zur Kompilierzeit für typisierte `atcb_action`-Konfigurationen und die
Verwendung von `AddToCalendarButtonType`. Die alte Eigenschaft `proKey` bleibt ein Laufzeit-Alias für einfache
JavaScript-Objekte. Bestehendes HTML wie `<add-to-calendar-button proKey="...">` funktioniert ebenfalls weiterhin,
da bei HTML-Attributnamen nicht zwischen Groß- und Kleinschreibung unterschieden wird.

Typdeklarationen werden jetzt in einer flachen Datei `dist/index.d.ts` erzeugt und unterstützen Bundler-, Node-16-
und klassische Modulauflösung. Bestehende öffentliche Typnamen bleiben verfügbar.

## ICS-Zeitstempeloptionen umbenennen

Die allgemein wirkenden v2-Zeitstempeloptionen verwenden jetzt explizite ICS-Namen, da sie nur die
Apple-/iCal-Ausgabe beeinflussen:

| v2        | v3-HTML-Attribut | v3-JavaScript-Eigenschaft |
| --------- | ---------------- | ------------------------- |
| `created` | `ics-created`    | `icsCreated`              |
| `updated` | `ics-updated`    | `icsUpdated`              |

Anders als die meisten in v3 umbenannten Attribute werden die alten Namen `created` und `updated` nicht mehr gelesen.

## Schlüssel benutzerdefinierter Beschriftungen aktualisieren

Nur Integrationen, die genau diese `customLabels`-Schlüssel überschreiben, müssen geändert werden:

| v2-Schlüssel                | v3-Schlüssel                |
| --------------------------- | --------------------------- |
| `date.status.cancelled.cta` | `date.status.cancelled_cta` |
| `label.share.email.subject` | `label.share.email_subject` |
| `label.rsvp`                | `label.rsvp.title`          |
| `form.status`               | `form.status.title`         |
| `form.success`              | `form.success.title`        |

Außerdem gibt es einen neuen Schlüssel `modal.clipboard.failed` für die manuelle Kopieralternative, die angezeigt wird, wenn der automatische
Zugriff auf die Zwischenablage fehlschlägt.

## Neue offizielle Attribut- und Wertnamen bevorzugen

Offizielle HTML-Attributnamen verwenden jetzt Kebab-Case, zum Beispiel `start-date`, `button-style`,
`recurrence-interval` und `recurrence-by-day`. Bestehende v2-Schreibweisen in CamelCase, Kleinschreibung und mit Unterstrichen
werden weiterhin als Aliasse unterstützt. Wenn sowohl ein offizieller Name als auch ein veralteter Alias vorhanden sind,
hat der offizielle Name Vorrang.

Wir empfehlen dringend, während der v3-Migration alle HTML-Attribute auf die offizielle Kebab-Case-Schreibweise
zu aktualisieren. Die Aliasse bieten heute Abwärtskompatibilität, können aber in einer
zukünftigen Hauptversion entfernt werden. Diese Empfehlung gilt nur für HTML-Attribute. Bei JavaScript-
Konfigurationsobjekten, einschließlich der an `atcb_action` übergebenen, bleibt CamelCase die bevorzugte
Schreibweise (zum Beispiel `startDate` und `buttonStyle`).

Kalenderoptionswerte werden jetzt kleingeschrieben:

- `apple`
- `google`
- `ical`
- `ms365`
- `msteams`
- `outlookcom`
- `yahoo`

Die v2-Werte wie `Apple`, `Google`, `iCal`, `Microsoft365`, `MicrosoftTeams` und
`Outlook.com` funktionieren unabhängig von der Groß- und Kleinschreibung weiterhin. TypeScript stellt die neuen Werte über
`ATCBOptionName` und die alten Werte über `ATCBOptionNameLegacy` bereit.

Ereignisstatuswerte werden ebenfalls kleingeschrieben: `tentative`, `confirmed` und `cancelled`. Großgeschriebene
v2-Werte funktionieren weiterhin, und erzeugte ICS-Dateien verwenden weiterhin die von der
Spezifikation verlangten Großbuchstaben.

## Angegebene URLs prüfen

Version 3 lehnt skriptfähige URL-Schemata wie `javascript:` ab. URLs, die über die Ereignis-
konfiguration bereitgestellt werden, einschließlich ICS-Dateien, benutzerdefiniertem CSS, Bildern und Proxy-Zielen, müssen ein erlaubtes
Schema verwenden. Zu den unterstützten Schemata gehören gegebenenfalls `http`, `https`, `webcal`, `webcals`, `mailto`, `intent` und
`data:text/calendar`.

Beschreibungen mit der Linksyntax `[url]...[/url]` erstellen nur Links für HTTP(S)-, Webcal(S)- und
mailto-URLs. Nicht unterstützte Werte werden als Text dargestellt.

## Mindestanforderungen an die Browserunterstützung berücksichtigen

Version 3 bietet das vollständige Erlebnis in Baseline-2023-Browsern, einschließlich Safari 16.4 und
aktueller Evergreen-Browser. Bundles zielen auf ES2017 ab. Declarative Shadow DOM ist eine progressive
Verbesserung, sodass Browser ohne dessen Unterstützung auf clientseitiges Rendering zurückfallen.

Das Dropdown folgt jetzt dem WAI-ARIA-Menümuster (Rollen `menu` und `menuitem`), und Modaldialoge verwenden
native `<dialog>`-Elemente. Wenn die Tests oder das CSS deiner Anwendung auf die alten Rollen `list`/`link` oder
die alte Modalstruktur abzielen, aktualisiere diese Selektoren.

## Nicht standardmäßige Stile und nicht englische Gebietsschemata mit npm importieren

Der Standardstil und Englisch bleiben gebündelt. Für Nutzer des npm-Pakets werden andere Stile und Sprachen
nicht mehr automatisch eingebunden: Du musst jeden nicht standardmäßigen Stil und jedes
nicht englische Gebietsschema, das deine Anwendung verwendet, explizit importieren. Dies ist eine Breaking Change gegenüber v2.

Zum Beispiel:

```js
import 'add-to-calendar-button';
import 'add-to-calendar-button/styles/3d';
import 'add-to-calendar-button/i18n/de';
```

Normale Browser-Skript-/CDN-Integrationen laden angeforderte Stile und Sprachen weiterhin bei Bedarf als
kleine Assets und benötigen diese Importe nicht.

Du kannst außerdem `style-source` verwenden, um die Basis-URL für verzögert geladene Assets zu überschreiben, `load-all-styles`, um
alle Stile für einen Wechsel zur Laufzeit vorab zu laden, `atcb_register_style(name, css)`, um einen Stil zu registrieren,
oder `atcb_register_locale(lang, strings)`, um ein Gebietsschema zu registrieren.

Vollständige Gebietsschemata werden unterstützt. Zum Beispiel verwendet `language="en_GB"` oder `language="en-GB"` regionale
Übersetzungen, sofern vorhanden, und behält die Region für die Datumsformatierung bei. Ukrainisch (`uk`) ist jetzt
Teil des öffentlichen Sprachtyps.

## Optional: Serverseitiges Rendering verwenden

Version 3 enthält einen reinen SSR-Einstiegspunkt, der eine Declarative-Shadow-DOM-Hülle erzeugt:

```js
import { atcb_generate_ssr_html } from 'add-to-calendar-button/ssr';

const html = atcb_generate_ssr_html({
  name: 'Launch Party',
  startDate: '2050-06-15',
  buttonStyle: '3d',
  language: 'de',
});
```

Die Hülle gibt den Schaltflächenstil, die Größe, den Farbmodus, die Textrichtung und die Beschriftung wieder. Das reguläre
Browserpaket übernimmt und hydriert sie, ohne die bereits dargestellte Shadow Root zu ersetzen.

## Datumswerkzeuge in Server- und Worker-Laufzeitumgebungen verwenden

Version 3 stellt einen DOM-freien Werkzeugeinstiegspunkt für Cloudflare Workers, Node und ähnliche Laufzeitumgebungen bereit:

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

Der `/utils`-Export unterstützt ESM, CommonJS und TypeScript, ohne Lit, die Webkomponente,
Stile oder Browser-Globals zu importieren. Der Import dieser Funktionen aus dem Hauptpaket oder dem
veralteten Einstiegspunkt `/unstyle` bietet diese Garantie nicht.

## Neue reine ICS-Optionen

Version 3 fügt Optionen hinzu, die nur erzeugte Apple-/iCal-Dateien beeinflussen. Andere Kalenderdienste ignorieren
sie:

- `ics-reminder` / `icsReminder`
- `ics-url` / `icsUrl`
- `ics-categories` / `icsCategories`
- `ics-class` / `icsClass`
- `ics-priority` / `icsPriority`
- `ics-geo` / `icsGeo`
- `ics-attach` / `icsAttach`
- `ics-exdate` / `icsExdate`

Die erste Form ist das HTML-Attribut, die zweite die JavaScript-Konfigurationseigenschaft.
`ics-exdate` ist nur auf Stammebene zulässig. Die anderen Optionen können auf einzelne Einträge eines mehrteiligen
Ereignisses angewendet werden, wobei Stammwerte Vorrang haben.

## Verhaltensverbesserungen, die keine Migration erfordern

- Wiederkehrende Ereignisse mit alten Startdaten werden effizient vorgespult, wobei das Verhalten von `COUNT`
  und `UNTIL` erhalten bleibt.
- Bei Fehlern der Zwischenablage wird ein Feld zum manuellen Kopieren angezeigt, statt fälschlicherweise einen Erfolg zu melden.
- Die Eingabeverarbeitung entfernt Schlüssel für Prototype Pollution und maskiert die Rich-Data-Ausgabe sicher.
- Das Google-Kalender-Symbol verwendet das aktuelle Logo.
