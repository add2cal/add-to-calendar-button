import type { DocsLocale } from '../docs-data';
import { useTranslations } from '@utils/i18n';

const label = (locale: DocsLocale, key: string) => useTranslations(locale)(`docs.${key}`);

type GuideCopy = {
  step: string;
  option: string;
  installNpm: string;
  installNpmText: string;
  import: string;
  importText: string;
  use: string;
  useStart: string;
  simple: string;
  example: string;
  client: string;
  styles: string;
  stylesDefault: string;
  stylesOnDemand: string;
  stylesNpmHeading: string;
  stylesNpmBody: string;
  stylesAll: string;
  stylesCdnHeading: string;
  stylesCdnBody: string;
  stylesMore: string;
  ssrNote: string;
  ssrExample: string;
  advancedSsr: string;
  clickHere: string;
  title: string;
  location: string;
  timeZone: string;
  shortcodeDescription: string;
  sidebar: { framework: string; stack: string; cta: string; explainer: string; stackblitz: string };
  general: { headline: string; cdn: string; cdn1: string; cdn2: string };
  angular: {
    headline: string;
    optimize: string;
    config1: string;
    config2: string;
    config3: string;
    standalone: string;
    ngmodule: string;
    bindings: string;
    binding1: string;
    binding2: string;
  };
  astro: {
    headline: string;
    architecture: string;
    intro1: string;
    intro2: string;
    install: string;
    installText: string;
    create: string;
    newComponent: string;
    defineProps: string;
    define: string;
    addScript: string;
    addBlock: string;
    addImport: string;
    use: string;
  };
  nextjs: { headline: string; intro: string };
  nuxt: { headline: string; notes: string; vhtml: string; server: string; client: string; attrs: string };
  react: { headline: string; intro: string; options: string; types: string; typesConfig: string };
  svelte: { headline: string };
  vue: { headline: string; optimize: string; optimize1: string; optimize2: string; config1: string; config2: string; config3: string; config4: string; config5: string };
  wix: { headline: string; intro1: string; intro2: string; intro3: string; intro4: string; link: string };
  wordpress: {
    headline: string;
    install: string;
    install1: string;
    install2: string;
    way1: string;
    search: string;
    way2a: string;
    way2b: string;
    way2c: string;
    way2d: string;
    activateHeading: string;
    activate: string;
    block: string;
    block1: string;
    block2: string;
    block3: string;
    blockPro: string;
    shortcode1: string;
    shortcodePro: string;
    shortcode2: string;
    proDocs: string;
  };
};

export const guideCopy: Record<DocsLocale, GuideCopy> = {
  en: {
    step: label('en', 'common.step'),
    option: label('en', 'common.option'),
    installNpm: label('en', 'integration.install-npm'),
    installNpmText: 'Install the package from the npm registry.',
    import: label('en', 'integration.import'),
    importText: 'Import the module into the component, where you want to use the button.',
    use: label('en', 'integration.use'),
    useStart: 'Start using it by adding a <add-to-calendar-button> tag to your HTML source code - with the options as attributes.',
    simple: label('en', 'integration.simple'),
    example: 'Your code block could look like the following.',
    client: "Mind that the button only works on the client side! Add 'use client'; respectively.",
    styles: label('en', 'integration.styles'),
    stylesDefault: 'The script ships with the "default" button style and the English language pack built in - so the button looks great and works out of the box without any extra configuration.',
    stylesOnDemand: 'When you load the browser script directly, every other style and language loads automatically on demand (a few KB each). Bundled integrations should register the required modules explicitly as shown below.',
    stylesNpmHeading: label('en', 'integration.styles-npm'),
    stylesNpmBody: 'When you bundle the script, import the style and language modules you need before the main module. This registers them fetch-free before the custom element upgrades, including during SSR hydration:',
    stylesAll: "To load all styles or all languages in one statement, use the aggregate modules: import 'add-to-calendar-button/styles/all' and import 'add-to-calendar-button/i18n/all'.",
    stylesCdnHeading: label('en', 'integration.styles-cdn'),
    stylesCdnBody: 'With the CDN script tag, on-demand styles and languages are fetched from the same origin as the script itself - nothing else to set up. If you self-host the script, point the "style-source" attribute at the directory that contains the styles/ and locales/ folders.',
    stylesMore: 'See the "button-style" and "language" options at the Configuration page for the full picture.',
    ssrNote: 'The button can also pre-render a shell on the server for an instant, layout-stable first paint. During hydration, the component keeps the shell\'s matching styles in place until the client button is fully styled. See the "Server-side rendering" section on the advanced-use page.',
    ssrExample: 'A full example could look like this.',
    advancedSsr: label('en', 'integration.ssr'),
    clickHere: label('en', 'integration.click-here'),
    title: label('en', 'integration.title'),
    location: 'World Wide Web',
    timeZone: 'EST',
    shortcodeDescription: 'Description with {b}bold{/b} text.',
    sidebar: { framework: label('en', 'integration.sidebar.framework'), stack: label('en', 'integration.sidebar.stack'), cta: label('en', 'integration.sidebar.cta'), explainer: 'We have strong guides and solutions for all big frontend stacks as well things like WordPress.', stackblitz: label('en', 'integration.sidebar.stackblitz') },
    general: { headline: label('en', 'integration.general.headline'), cdn: label('en', 'integration.general.cdn'), cdn1: 'Load the respective script by adding the following script tag to the head section of your website.', cdn2: "The script will be loaded in a non-blocking way. So you don't need to worry about where to include it exactly." },
    angular: {
      headline: label('en', 'integration.angular.headline'),
      optimize: label('en', 'integration.angular.optimize'),
      config1: 'To make Angular work properly with the Web Component, you need to import the ',
      config2: ' and update the ',
      config3: ' block respectively.',
      standalone: label('en', 'integration.angular.standalone'),
      ngmodule: label('en', 'integration.angular.ngmodule'),
      bindings: label('en', 'integration.angular.bindings'),
      binding1: 'To bind data to a specific attribute, you need to use the syntax [attr.PARAMETER]="your data".',
      binding2: 'Based on your setup, the data flow might happen after the first rendering of the button. This is no problem, but you might see errors in the console when in debug mode, claiming there is data missing. Mind that due to this reason, binding the "identifier" option would not work.',
    },
    astro: {
      headline: label('en', 'integration.astro.headline'),
      architecture: label('en', 'integration.astro.architecture'),
      intro1: 'You can use the web component directly wherever you need it or indirectly via a component (like add-to-calendar.astro, which gets imported at the respective page).',
      intro2: 'We recommend the direct approach, if you only use 1 element. More than 1, go with the helper component. Below, we describe the helper component way. If you use it directly, simply do not create the component, but include the add-to-calendar-button tag directly where you need it.',
      install: label('en', 'integration.astro.install'),
      installText: 'Install the package from the npm registry.',
      create: label('en', 'integration.astro.create'),
      newComponent: 'Create a new component add-to-calendar.astro (usually at ./src/components/).',
      defineProps: label('en', 'integration.astro.define-props'),
      define: 'Define the props of the component. This should at least be the start date and name.',
      addScript: label('en', 'integration.astro.add-script'),
      addBlock: 'Add the web component tag:',
      addImport: 'Followed by the script import:',
      use: 'On any other page (or component), import and use it. Set the path the way your project is set up.',
    },
    nextjs: { headline: label('en', 'integration.nextjs.headline'), intro: 'Since Next.js builds on React 19, it fully supports web components out of the box. Simply use the Add to Calendar Button web component directly.' },
    nuxt: {
      headline: label('en', 'integration.nuxt.headline'),
      notes: label('en', 'integration.nuxt.notes'),
      vhtml: 'Never render the generated shell with v-html: during hydration, Vue re-assigns innerHTML, which does not parse declarative shadow DOM - the pre-rendered shadow root gets destroyed (flash + console warnings). Use a directive that skips the assignment when the server markup is already in place (see the example above).',
      server: 'Keep the add-to-calendar-button/ssr import strictly on the server side of your component (top-level in script setup is fine - it is DOM-free and tree-shaken from the client bundle).',
      client: 'Load non-default style and language modules before the main add-to-calendar-button module on the client (or do the same in a client-only plugin). The main module registers the custom element, which upgrades the shell while retaining its matching server-rendered styles.',
      attrs: 'Attributes work exactly like on the plain tag - including kebab-case names and bare boolean flags like buttons-list or hide-icon-button.',
    },
    react: {
      headline: label('en', 'integration.react.headline'),
      intro: 'Since React 19, web components are fully supported out of the box - no wrapper or workarounds needed. Simply use the Add to Calendar Button web component directly in your JSX.',
      options: 'We will highlight all options below.',
      types: "With React 19, custom element properties can be typed via TypeScript's custom elements support. Register the element type once (e.g. in a global.d.ts) to get full type checking:",
      typesConfig: 'If compilerOptions.types is set in your tsconfig, include react and react-dom alongside any existing entries:',
    },
    svelte: { headline: label('en', 'integration.svelte.headline') },
    vue: {
      headline: label('en', 'integration.vue.headline'),
      optimize: label('en', 'integration.vue.optimize'),
      optimize1: 'Theoretically, this was already it.',
      optimize2: 'Vue works extremely well with Web Components.',
      config1: 'However, you might notice a warning in the browser console.',
      config2: 'To get rid of this, you need to provide a little bit more information to the compiler options.',
      config3: 'This can go into your vite.config.js or other places depending on your setup. Check the official Vue documentation for more details',
      config4: 'In case the Add to Calendar Button is the only Web Component in your project, you could also be a little bit more explicit here.',
      config5: 'In this case, our recommendation is to define tags, which start with "add-" as "custom elements".',
    },
    wix: {
      headline: label('en', 'integration.wix.headline'),
      intro1: 'Wix is a rather special case, as it does not allow the direct smooth integration of Web Components. It is possible, but comes with a lot of restrictions and difficulties.',
      intro2: "That's why we have built a dedicated plugin for Wix, which you can find in the Wix App Market.",
      intro3: 'This plugin is a wrapper around the Web Component, which makes it work seamlessly within the Wix environment, while you still get the power of our famous Add to Calendar Button script.',
      intro4: 'Once installed, you can add Add to Calendar Buttons as native Wix blocks in a no-code style. You can even define a global default style to make event management with Wix even more convenient.',
      link: label('en', 'integration.wix.link'),
    },
    wordpress: {
      headline: label('en', 'integration.wordpress.headline'),
      install: label('en', 'integration.wordpress.install'),
      install1: 'Install the ',
      install2: 'official package from the WordPress Plugin Directory.',
      way1: 'You can find it directly from the "Plugins" page within your admin dashboard.',
      search: label('en', 'integration.wordpress.search'),
      way2a: 'Alternatively, you can ',
      way2b: 'download it here',
      way2c: ' and upload the zip file to your WordPress system. OR you unzip and upload the plugin manually into your',
      way2d: 'directory.',
      activateHeading: label('en', 'integration.wordpress.activate'),
      activate: 'At your WordPress "Plugins" page, activate the plugin.',
      block: 'Simply use the "Block" within the WordPress Gutenberg Block Editor.',
      block1: 'Add a new block and search for "Add to Calendar Button".',
      block2: 'Click at the appearing button.',
      block3: 'Add the attributes of your choice at the input on the right side "Block" settings.',
      blockPro: 'When using our PRO service, you can activate the respective option. This will also allow you to link dynamic data to the button - like meta or ACF field values.',
      shortcode1: 'Alternatively, you can also use the shortcode [add-to-calendar-button] and add the attributes directly to it:',
      shortcodePro: 'The linking of dynamic data is also possible with the shortcode. Check our PRO documentation for more information and guidance.',
      shortcode2: "Mind that you cannot use '[' and ']' characters inside a shortcode! For content formatting, you can use {*} instead of [*].",
      proDocs: label('en', 'integration.wordpress.pro-docs'),
    },
  },
  de: {
    step: label('de', 'common.step'),
    option: label('de', 'common.option'),
    installNpm: label('de', 'integration.install-npm'),
    installNpmText: 'Installiere das Package über die npm Registry.',
    import: label('de', 'integration.import'),
    importText: 'Importiere das Modul in deine Komponente, in welcher du den Button nutzen möchtest.',
    use: label('de', 'integration.use'),
    useStart: 'Beginne mit der Nutzung, indem du einen <add-to-calendar-button> Tag in deinem HTML-Quellcode einfügst - mit den Optionen als Attribute.',
    simple: label('de', 'integration.simple'),
    example: 'Dein Code kann hierbei bspw. wie folgt aussehen.',
    client: "Beachte, dass der Button nur client-seitig funktioniert! Nutze 'use client'; entsprechend.",
    styles: label('de', 'integration.styles'),
    stylesDefault: 'Das Skript wird mit dem "default"-Button-Style und dem englischen Sprachpaket ausgeliefert - der Button sieht also von Haus aus gut aus und funktioniert ohne jegliche zusätzliche Konfiguration.',
    stylesOnDemand: 'Wenn du das Browser-Skript direkt lädst, werden weitere Styles und Sprachen automatisch bei Bedarf geladen (jeweils wenige KB). Bei gebündelten Integrationen solltest du die benötigten Module wie unten gezeigt explizit registrieren.',
    stylesNpmHeading: label('de', 'integration.styles-npm'),
    stylesNpmBody: 'Wenn du das Skript bundlest, importiere die benötigten Style- und Sprachmodule vor dem Hauptmodul. So sind sie ohne Netzwerk-Anfrage registriert, bevor das Custom Element übernimmt - auch bei der SSR-Hydration:',
    stylesAll: "Um alle Styles oder alle Sprachen in einer Anweisung zu laden, nutze die Aggregat-Module: import 'add-to-calendar-button/styles/all' und import 'add-to-calendar-button/i18n/all'.",
    stylesCdnHeading: label('de', 'integration.styles-cdn'),
    stylesCdnBody: 'Mit dem CDN-Script-Tag werden On-Demand-Styles und -Sprachen von derselben Quelle wie das Skript selbst geladen - nichts weiter einzustellen. Falls du das Skript selbst hostest, setze das "style-source"-Attribut auf das Verzeichnis, das die styles/- und locales/-Ordner enthält.',
    stylesMore: 'Siehe die Optionen "button-style" und "language" auf der Konfigurations-Seite für alle Details.',
    ssrNote: 'Der Button kann zusätzlich eine Hülle auf dem Server vor-rendern - für ein sofortiges, layout-stabiles erstes Rendern. Bei der Hydration behält die Komponente die passenden Styles der Hülle bei, bis der Client-Button vollständig gestylt ist. Siehe den "Server-seitiges Rendern"-Abschnitt auf der Profi-Funktionen-Seite.',
    ssrExample: 'Ein komplettes Beispiel könnte so aussehen.',
    advancedSsr: label('de', 'integration.ssr'),
    clickHere: label('de', 'integration.click-here'),
    title: label('de', 'integration.title'),
    location: 'World Wide Web',
    timeZone: 'Europe/Berlin',
    shortcodeDescription: 'Beschreibung mit {b}fettem{/b} Text.',
    sidebar: { framework: label('de', 'integration.sidebar.framework'), stack: label('de', 'integration.sidebar.stack'), cta: label('de', 'integration.sidebar.cta'), explainer: 'Wir unterstützen alle großen Frontend-Stacks und viele weitere Umgebungen, wie bspw. WordPress.', stackblitz: label('de', 'integration.sidebar.stackblitz') },
    general: { headline: label('de', 'integration.general.headline'), cdn: label('de', 'integration.general.cdn'), cdn1: 'Lade das Skript, indem du den nachfolgenden "Script Tag" im head-Bereich deiner Webseite einfügst.', cdn2: 'Das Skript lädt automatisch auf nicht-blockierende Art und Weise. Daher ist es im Zweifel nicht entscheidend, wo genau es platziert wird.' },
    angular: {
      headline: label('de', 'integration.angular.headline'),
      optimize: label('de', 'integration.angular.optimize'),
      config1: 'Damit Angular sauber mit Web Components arbeitet, musst du das ',
      config2: ' importieren und den ',
      config3: '-Block entsprechend aktualisieren.',
      standalone: label('de', 'integration.angular.standalone'),
      ngmodule: label('de', 'integration.angular.ngmodule'),
      bindings: label('de', 'integration.angular.bindings'),
      binding1: 'Um eine Variable an ein bestimmtes Attribut zu binden, musst du den Syntax [attr.PARAMETER]="your data" nutzen.',
      binding2: 'Basierend auf deinem Setup werden Daten erst nach dem ersten Rendering des Buttons übermittelt. Dies ist kein Problem, führt aber zu Fehlermeldungen über fehlende Daten in der Console, sofern du dich im Debug-Modus befindest. Beachte, dass ein Binding für die "identifier"-Option aus diesem Grund nicht funktioniert.',
    },
    astro: {
      headline: label('de', 'integration.astro.headline'),
      architecture: label('de', 'integration.astro.architecture'),
      intro1: 'Du kannst die Web Component direkt dort nutzen, wo du sie brauchst, oder indirekt über eine Komponente (wie z.B. add-to-calendar.astro, die dann auf der jeweiligen Seite importiert wird).',
      intro2: 'Wir empfehlen den direkten Weg, wenn du nur 1 Element nutzt. Bei mehreren Elementen gehe mit der Helper-Komponente. Nachfolgend beschreiben wir den Weg über die Helper-Komponente. Wenn du es direkt nutzt, erstelle einfach keine Komponente, sondern füge den add-to-calendar-button Tag direkt dort ein, wo du ihn brauchst.',
      install: label('de', 'integration.astro.install'),
      installText: 'Installiere das Package über die npm Registry.',
      create: label('de', 'integration.astro.create'),
      newComponent: 'Erstelle eine neue Komponente add-to-calendar.astro (üblicherweise unter ./src/components/).',
      defineProps: label('de', 'integration.astro.define-props'),
      define: 'Definiere die Props der Komponente. Dies sollte mindestens das Start-Date und der Name sein.',
      addScript: label('de', 'integration.astro.add-script'),
      addBlock: 'Füge das Web-Component-Tag hinzu:',
      addImport: 'Gefolgt vom Skript-Import:',
      use: 'Importiere und nutze sie auf jeder anderen Seite (oder Komponente). Passe den Pfad entsprechend deinem Projekt-Setup an.',
    },
    nextjs: { headline: label('de', 'integration.nextjs.headline'), intro: 'Da Next.js auf React 19 aufsetzt, werden Web Components vollständig out-of-the-box unterstützt. Nutze den Add to Calendar Button Web Component einfach direkt.' },
    nuxt: {
      headline: label('de', 'integration.nuxt.headline'),
      notes: label('de', 'integration.nuxt.notes'),
      vhtml: 'Rendere die erzeugte Hülle niemals mit v-html: bei der Hydration setzt Vue innerHTML erneut, was Declarative Shadow DOM nicht parst - die vorgerenderte Shadow-Root wird zerstört (Flackern + Konsolen-Warnungen). Nutze eine Direktive, die die Zuweisung überspringt, wenn das Server-Markup bereits vorhanden ist (siehe Beispiel oben).',
      server: 'Halte den add-to-calendar-button/ssr-Import strikt auf der Server-Seite deiner Komponente (Top-Level im Script-Setup ist ok - der Eintrag ist DOM-frei und wird aus dem Client-Bundle tree-geshaked).',
      client: 'Lade nicht-standardmäßige Style- und Sprachmodule im Client vor dem Hauptmodul add-to-calendar-button (oder entsprechend in einem Client-Only-Plugin). Das Hauptmodul registriert das Custom Element, welches die Hülle übernimmt und deren passende server-gerenderte Styles beibehält.',
      attrs: 'Attribute funktionieren exakt wie beim Plain-Tag - inklusive kebab-case-Namen und Bare-Boolean-Flags wie buttons-list oder hide-icon-button.',
    },
    react: {
      headline: label('de', 'integration.react.headline'),
      intro: 'Seit React 19 werden Web Components vollständig out-of-the-box unterstützt - ganz ohne Wrapper oder Workarounds. Nutze den Add to Calendar Button Web Component einfach direkt in deinem JSX.',
      options: 'Wir beschreiben nachfolgend alle Optionen.',
      types: 'Mit React 19 lassen sich Custom-Element-Properties über TypeScripts Custom-Elements-Support typisieren. Registriere den Element-Typ einmalig (z.B. in einer global.d.ts), um vollständiges Type-Checking zu erhalten:',
      typesConfig: 'Falls compilerOptions.types in deiner tsconfig gesetzt ist, ergänze react und react-dom neben den bereits vorhandenen Einträgen:',
    },
    svelte: { headline: label('de', 'integration.svelte.headline') },
    vue: {
      headline: label('de', 'integration.vue.headline'),
      optimize: label('de', 'integration.vue.optimize'),
      optimize1: 'Theoretisch war es das schon.',
      optimize2: 'Vue funktioniert wunderbar mit Web Components.',
      config1: 'Allerdings wirst du feststellen, dass die Anwendung in deiner Browser-Konsole eine Warnung wirft.',
      config2: 'Um diese aufzulösen musst du dem Compiler ein paar mehr Informationen mitgeben.',
      config3: 'Dies geschieht tendenziell in der vite.config.js. Je nach Umgebung kannst du es aber auch an anderen Stellen integrieren. Prüfe hierzu die offizielle Vue Dokumentation',
      config4: 'Für den Fall, dass der Add to Calendar Button der einzige Web Component in deinem Projekt ist, kannst du hierbei auch etwas konkreter werden.',
      config5: 'Unsere Empfehlung wäre hier, Tags, die mit "add-" starten, pauschal als "Custom Elements" zu definieren.',
    },
    wix: {
      headline: label('de', 'integration.wix.headline'),
      intro1: 'Wix ist ein Sonderfall, da es die direkte Integration von Web Components nicht, bzw. nur eingeschränkt erlaubt.',
      intro2: 'Aus diesem Grund haben wir ein spezielles Plugin für Wix entwickelt, welches du im Wix App Market findest.',
      intro3: 'Dieses Plugin ist ein Wrapper um den Web Component, welches es ermöglicht, den Button nahtlos in die Wix-Umgebung zu integrieren, während du dennoch die volle Power unseres berühmten Add to Calendar Button Scripts erhältst.',
      intro4: 'Sobald es installiert ist, kannst du Add to Calendar Buttons als native Wix-Blöcke im No-Code-Stil hinzufügen. Du kannst sogar einen globalen Standard-Style definieren, um das Event-Management mit Wix noch bequemer zu gestalten.',
      link: label('de', 'integration.wix.link'),
    },
    wordpress: {
      headline: label('de', 'integration.wordpress.headline'),
      install: label('de', 'integration.wordpress.install'),
      install1: 'Installiere das ',
      install2: 'offizielle Plugin aus dem WordPress Plugin Directory.',
      way1: 'Du kannst es direkt über die Suche auf der "Plugin"-Seite deines Admin-Dashboards finden.',
      search: label('de', 'integration.wordpress.search'),
      way2a: 'Alternativ kannst du es auch ',
      way2b: 'hier herunterladen',
      way2c: ' und das zip-File in WordPress hochladen. ODER du entpackst das zip-File und überträgst den Inhalt manuall in dein',
      way2d: 'Verzeichnis.',
      activateHeading: label('de', 'integration.wordpress.activate'),
      activate: 'Aktiviere das Plugin auf der WordPress "Plugin"-Seite.',
      block: 'Du kannst nun ganz einfach den entsprechenden "Block" mit dem WordPress Gutenberg Block Editor nutzen.',
      block1: 'Füge einen neuen Block hinzu und suche hierbei nach "Add to Calendar Button".',
      block2: 'Klicke auf den Block, bzw. auf den Button.',
      block3: 'Füge über die "Block"-Einstellungen auf der rechten Seite die gewünschten Attribute hinzu.',
      blockPro: 'Wenn du unseren PRO-Service nutzt, kannst du die entsprechende Option aktivieren. Dies erlaubt dir auch dynamische Daten zu verknüpfen - bspw. Meta- oder ACF-Felder.',
      shortcode1: 'Alternativ kannst du einen Button auch mit dem shortcode [add-to-calendar-button] erzeugen und Attribute direkt dort spezifizieren:',
      shortcodePro: 'Die Verknüpfung von dynamischen Daten ist auch mit dem Shortcode mögich. Schau dir die PRO-Dokumentation für weitere Informationen und Anleitungen an.',
      shortcode2: "Beachte, dass du innerhalb eines Shortcodes die Zeichen '[' und ']' nicht nutzen kannst! Für die erweiterten Formatierungs-Optionen kannst du das Schema {*} anstelle von [*] nutzen.",
      proDocs: label('de', 'integration.wordpress.pro-docs'),
    },
  },
  fr: {
    step: label('fr', 'common.step'),
    option: label('fr', 'common.option'),
    installNpm: label('fr', 'integration.install-npm'),
    installNpmText: 'Installez le paquet depuis le registre npm.',
    import: label('fr', 'integration.import'),
    importText: 'Importez le module dans le composant où vous souhaitez utiliser le bouton.',
    use: label('fr', 'integration.use'),
    useStart: 'Commencez par ajouter une balise <add-to-calendar-button> à votre code HTML, avec les options sous forme d’attributs.',
    simple: label('fr', 'integration.simple'),
    example: 'Votre bloc de code pourrait ressembler à ceci.',
    client: "Notez que le bouton ne fonctionne que côté client ! Ajoutez 'use client'; lorsque nécessaire.",
    styles: label('fr', 'integration.styles'),
    stylesDefault: 'Le script inclut le style de bouton « default » et le pack anglais : le bouton est donc immédiatement fonctionnel et agréable sans configuration supplémentaire.',
    stylesOnDemand: 'Lorsque vous chargez directement le script navigateur, les autres styles et langues sont chargés automatiquement à la demande (quelques Ko chacun). Les intégrations groupées doivent enregistrer explicitement les modules requis comme ci-dessous.',
    stylesNpmHeading: label('fr', 'integration.styles-npm'),
    stylesNpmBody: 'Lors du bundling, importez les modules de style et de langue requis avant le module principal. Ils sont ainsi enregistrés sans requête avant la mise à niveau du custom element, y compris pendant l’hydratation SSR :',
    stylesAll: "Pour charger tous les styles ou toutes les langues en une seule instruction, utilisez les modules agrégés : import 'add-to-calendar-button/styles/all' et import 'add-to-calendar-button/i18n/all'.",
    stylesCdnHeading: label('fr', 'integration.styles-cdn'),
    stylesCdnBody: 'Avec la balise script CDN, les styles et langues à la demande sont récupérés depuis la même origine que le script. Si vous auto-hébergez le script, définissez l’attribut « style-source » sur le répertoire contenant les dossiers styles/ et locales/.',
    stylesMore: 'Consultez les options « button-style » et « language » sur la page Configuration pour tous les détails.',
    ssrNote: 'Le bouton peut aussi pré-rendre une enveloppe sur le serveur pour un premier affichage instantané et stable. Pendant l’hydratation, le composant conserve les styles correspondants jusqu’à ce que le bouton client soit entièrement stylé. Consultez la section « Rendu côté serveur » de la page d’utilisation avancée.',
    ssrExample: 'Un exemple complet pourrait ressembler à ceci.',
    advancedSsr: label('fr', 'integration.ssr'),
    clickHere: label('fr', 'integration.click-here'),
    title: label('fr', 'integration.title'),
    location: 'World Wide Web',
    timeZone: 'Europe/Paris',
    shortcodeDescription: 'Description avec texte {b}en gras{/b}.',
    sidebar: { framework: label('fr', 'integration.sidebar.framework'), stack: label('fr', 'integration.sidebar.stack'), cta: label('fr', 'integration.sidebar.cta'), explainer: 'Nous proposons des guides et solutions solides pour tous les grands stacks front-end ainsi que pour WordPress.', stackblitz: label('fr', 'integration.sidebar.stackblitz') },
    general: { headline: label('fr', 'integration.general.headline'), cdn: label('fr', 'integration.general.cdn'), cdn1: 'Chargez le script en ajoutant la balise suivante dans la section head de votre site.', cdn2: 'Le script est chargé sans bloquer la page. Son emplacement exact n’est donc pas critique.' },
    angular: {
      headline: label('fr', 'integration.angular.headline'),
      optimize: label('fr', 'integration.angular.optimize'),
      config1: 'Pour qu’Angular fonctionne correctement avec le Web Component, importez ',
      config2: ' et mettez à jour le bloc ',
      config3: ' correspondant.',
      standalone: label('fr', 'integration.angular.standalone'),
      ngmodule: label('fr', 'integration.angular.ngmodule'),
      bindings: label('fr', 'integration.angular.bindings'),
      binding1: 'Pour lier une donnée à un attribut, utilisez la syntaxe [attr.PARAMETER]="vos données".',
      binding2: 'Selon votre configuration, les données peuvent arriver après le premier rendu du bouton. Ce n’est pas un problème, mais le mode debug peut signaler des données manquantes dans la console. Pour cette raison, la liaison de l’option « identifier » ne fonctionne pas.',
    },
    astro: {
      headline: label('fr', 'integration.astro.headline'),
      architecture: label('fr', 'integration.astro.architecture'),
      intro1: 'Vous pouvez utiliser le Web Component directement là où vous en avez besoin, ou indirectement via un composant tel que add-to-calendar.astro, importé dans la page concernée.',
      intro2: 'Nous recommandons l’approche directe pour un seul élément. Pour plusieurs éléments, utilisez le composant auxiliaire décrit ci-dessous. En usage direct, ne créez simplement pas ce composant et placez la balise add-to-calendar-button là où elle est nécessaire.',
      install: label('fr', 'integration.astro.install'),
      installText: 'Installez le paquet depuis le registre npm.',
      create: label('fr', 'integration.astro.create'),
      newComponent: 'Créez un composant add-to-calendar.astro (généralement dans ./src/components/).',
      defineProps: label('fr', 'integration.astro.define-props'),
      define: 'Définissez les props du composant, au minimum la date de début et le nom.',
      addScript: label('fr', 'integration.astro.add-script'),
      addBlock: 'Ajoutez la balise du Web Component :',
      addImport: 'Puis l’import du script :',
      use: 'Dans une autre page ou un autre composant, importez-le et utilisez-le. Adaptez le chemin à votre projet.',
    },
    nextjs: { headline: label('fr', 'integration.nextjs.headline'), intro: 'Next.js reposant sur React 19, les Web Components sont entièrement pris en charge sans configuration. Utilisez directement le Web Component Add to Calendar Button.' },
    nuxt: {
      headline: label('fr', 'integration.nuxt.headline'),
      notes: label('fr', 'integration.nuxt.notes'),
      vhtml: 'Ne rendez jamais l’enveloppe générée avec v-html : pendant l’hydratation, Vue réaffecte innerHTML, qui ne parse pas le Declarative Shadow DOM. La shadow root pré-rendue serait détruite (flash et avertissements console). Utilisez une directive qui ignore cette affectation lorsque le balisage serveur est déjà présent.',
      server: 'Conservez l’import add-to-calendar-button/ssr strictement côté serveur du composant. Un import au niveau supérieur de script setup convient : cette entrée est sans DOM et retirée du bundle client.',
      client: 'Chargez les modules de style et de langue non standards avant le module principal add-to-calendar-button côté client, ou dans un plugin client-only. Le module principal enregistre le custom element et met à niveau l’enveloppe tout en conservant ses styles serveur.',
      attrs: 'Les attributs fonctionnent exactement comme sur la balise simple, y compris les noms en kebab-case et les booléens sans valeur tels que buttons-list ou hide-icon-button.',
    },
    react: {
      headline: label('fr', 'integration.react.headline'),
      intro: 'Depuis React 19, les Web Components sont entièrement pris en charge sans wrapper ni contournement. Utilisez directement le Web Component Add to Calendar Button dans votre JSX.',
      options: 'Nous détaillons toutes les options ci-dessous.',
      types: 'Avec React 19, les propriétés des custom elements peuvent être typées grâce au support TypeScript. Enregistrez le type une fois, par exemple dans global.d.ts, pour bénéficier du typage complet :',
      typesConfig: 'Si compilerOptions.types est défini dans votre tsconfig, ajoutez react et react-dom aux entrées existantes :',
    },
    svelte: { headline: label('fr', 'integration.svelte.headline') },
    vue: {
      headline: label('fr', 'integration.vue.headline'),
      optimize: label('fr', 'integration.vue.optimize'),
      optimize1: 'En théorie, tout est déjà prêt.',
      optimize2: 'Vue fonctionne très bien avec les Web Components.',
      config1: 'Vous pouvez toutefois voir un avertissement dans la console du navigateur.',
      config2: 'Pour le supprimer, fournissez quelques informations supplémentaires aux options du compilateur.',
      config3: 'Cela peut se placer dans vite.config.js ou ailleurs selon votre configuration. Consultez la documentation officielle de Vue pour plus de détails',
      config4: 'Si Add to Calendar Button est le seul Web Component de votre projet, vous pouvez être plus explicite.',
      config5: 'Nous recommandons alors de déclarer comme custom elements les balises commençant par « add- ».',
    },
    wix: {
      headline: label('fr', 'integration.wix.headline'),
      intro1: 'Wix est un cas particulier : l’intégration directe et fluide de Web Components est possible, mais soumise à de nombreuses restrictions et difficultés.',
      intro2: 'Nous avons donc créé un plugin dédié à Wix, disponible sur le Wix App Market.',
      intro3: 'Ce plugin enveloppe le Web Component pour l’intégrer parfaitement à Wix tout en conservant toute la puissance du script Add to Calendar Button.',
      intro4: 'Une fois installé, vous pouvez ajouter des boutons Add to Calendar comme des blocs Wix natifs, sans code, et définir un style global par défaut pour simplifier la gestion des événements.',
      link: label('fr', 'integration.wix.link'),
    },
    wordpress: {
      headline: label('fr', 'integration.wordpress.headline'),
      install: label('fr', 'integration.wordpress.install'),
      install1: 'Installez le ',
      install2: 'plugin officiel depuis le répertoire des extensions WordPress.',
      way1: 'Vous pouvez le trouver directement depuis la page « Extensions » de votre tableau de bord.',
      search: label('fr', 'integration.wordpress.search'),
      way2a: 'Vous pouvez aussi ',
      way2b: 'le télécharger ici',
      way2c: ' puis téléverser le fichier zip dans WordPress, ou le décompresser et envoyer manuellement son contenu dans le répertoire',
      way2d: '.',
      activateHeading: label('fr', 'integration.wordpress.activate'),
      activate: 'Activez le plugin depuis la page « Extensions » de WordPress.',
      block: 'Utilisez simplement le bloc dans l’éditeur Gutenberg de WordPress.',
      block1: 'Ajoutez un bloc et recherchez « Add to Calendar Button ».',
      block2: 'Cliquez sur le bloc qui apparaît.',
      block3: 'Ajoutez les attributs souhaités dans les réglages « Bloc » à droite.',
      blockPro: 'Avec notre service PRO, vous pouvez activer l’option correspondante et lier des données dynamiques, comme des champs meta ou ACF.',
      shortcode1: 'Vous pouvez aussi utiliser le shortcode [add-to-calendar-button] et lui ajouter directement les attributs :',
      shortcodePro: 'Les données dynamiques peuvent également être liées avec le shortcode. Consultez notre documentation PRO pour plus d’informations.',
      shortcode2: "Vous ne pouvez pas utiliser les caractères '[' et ']' dans un shortcode. Pour la mise en forme, utilisez {*} à la place de [*].",
      proDocs: label('fr', 'integration.wordpress.pro-docs'),
    },
  },
  es: {
    step: label('es', 'common.step'),
    option: label('es', 'common.option'),
    installNpm: label('es', 'integration.install-npm'),
    installNpmText: 'Instala el paquete desde el registro de npm.',
    import: label('es', 'integration.import'),
    importText: 'Importa el módulo en el componente donde quieras usar el botón.',
    use: label('es', 'integration.use'),
    useStart: 'Empieza añadiendo una etiqueta <add-to-calendar-button> al código HTML, con las opciones como atributos.',
    simple: label('es', 'integration.simple'),
    example: 'Tu bloque de código podría ser como el siguiente.',
    client: "Ten en cuenta que el botón solo funciona en el cliente. Añade 'use client'; cuando corresponda.",
    styles: label('es', 'integration.styles'),
    stylesDefault: 'El script incluye el estilo de botón «default» y el paquete de inglés, por lo que funciona y se ve bien sin configuración adicional.',
    stylesOnDemand: 'Al cargar directamente el script del navegador, los demás estilos e idiomas se descargan automáticamente cuando se necesitan (unos pocos KB cada uno). Las integraciones empaquetadas deben registrar explícitamente los módulos necesarios como se muestra abajo.',
    stylesNpmHeading: label('es', 'integration.styles-npm'),
    stylesNpmBody: 'Al empaquetar el script, importa los módulos de estilo e idioma necesarios antes del módulo principal. Así quedan registrados sin solicitudes antes de que se actualice el custom element, también durante la hidratación SSR:',
    stylesAll: "Para cargar todos los estilos o idiomas en una sola instrucción, usa los módulos agregados: import 'add-to-calendar-button/styles/all' e import 'add-to-calendar-button/i18n/all'.",
    stylesCdnHeading: label('es', 'integration.styles-cdn'),
    stylesCdnBody: 'Con la etiqueta de script del CDN, los estilos e idiomas bajo demanda se obtienen del mismo origen que el script. Si lo alojas tú, apunta el atributo «style-source» al directorio que contiene las carpetas styles/ y locales/.',
    stylesMore: 'Consulta las opciones «button-style» y «language» de la página Configuración para ver todos los detalles.',
    ssrNote: 'El botón también puede prerenderizar una envoltura en el servidor para ofrecer un primer renderizado instantáneo y estable. Durante la hidratación, conserva los estilos coincidentes hasta que el botón del cliente esté completamente estilizado. Consulta la sección «Renderizado del lado del servidor» de la página de uso avanzado.',
    ssrExample: 'Un ejemplo completo podría ser el siguiente.',
    advancedSsr: label('es', 'integration.ssr'),
    clickHere: label('es', 'integration.click-here'),
    title: label('es', 'integration.title'),
    location: 'World Wide Web',
    timeZone: 'Europe/Madrid',
    shortcodeDescription: 'Descripción con texto en {b}negrita{/b}.',
    sidebar: { framework: label('es', 'integration.sidebar.framework'), stack: label('es', 'integration.sidebar.stack'), cta: label('es', 'integration.sidebar.cta'), explainer: 'Tenemos guías y soluciones sólidas para los principales stacks frontend y entornos como WordPress.', stackblitz: label('es', 'integration.sidebar.stackblitz') },
    general: { headline: label('es', 'integration.general.headline'), cdn: label('es', 'integration.general.cdn'), cdn1: 'Carga el script añadiendo la siguiente etiqueta en la sección head de tu sitio web.', cdn2: 'El script se cargará sin bloquear la página, así que no tienes que preocuparte por su ubicación exacta.' },
    angular: {
      headline: label('es', 'integration.angular.headline'),
      optimize: label('es', 'integration.angular.optimize'),
      config1: 'Para que Angular funcione correctamente con el Web Component, debes importar ',
      config2: ' y actualizar el bloque ',
      config3: ' correspondiente.',
      standalone: label('es', 'integration.angular.standalone'),
      ngmodule: label('es', 'integration.angular.ngmodule'),
      bindings: label('es', 'integration.angular.bindings'),
      binding1: 'Para enlazar datos con un atributo concreto, usa la sintaxis [attr.PARAMETER]="tus datos".',
      binding2: 'Según tu configuración, los datos pueden llegar después del primer renderizado del botón. No supone ningún problema, aunque el modo debug puede mostrar errores por datos ausentes. Por esta razón, no funcionaría enlazar la opción «identifier».',
    },
    astro: {
      headline: label('es', 'integration.astro.headline'),
      architecture: label('es', 'integration.astro.architecture'),
      intro1: 'Puedes usar el Web Component directamente donde lo necesites o indirectamente mediante un componente como add-to-calendar.astro, que se importa en la página correspondiente.',
      intro2: 'Recomendamos el uso directo si solo necesitas un elemento. Para más de uno, utiliza el componente auxiliar que se explica abajo. Si lo usas directamente, no crees el componente y coloca la etiqueta add-to-calendar-button donde la necesites.',
      install: label('es', 'integration.astro.install'),
      installText: 'Instala el paquete desde el registro de npm.',
      create: label('es', 'integration.astro.create'),
      newComponent: 'Crea un componente add-to-calendar.astro, normalmente en ./src/components/.',
      defineProps: label('es', 'integration.astro.define-props'),
      define: 'Define las props del componente. Como mínimo, deben incluir la fecha de inicio y el nombre.',
      addScript: label('es', 'integration.astro.add-script'),
      addBlock: 'Añade la etiqueta del Web Component:',
      addImport: 'A continuación, importa el script:',
      use: 'Impórtalo y úsalo en cualquier otra página o componente. Ajusta la ruta a la estructura de tu proyecto.',
    },
    nextjs: { headline: label('es', 'integration.nextjs.headline'), intro: 'Como Next.js se basa en React 19, admite Web Components completamente y sin configuración adicional. Usa directamente el Web Component Add to Calendar Button.' },
    nuxt: {
      headline: label('es', 'integration.nuxt.headline'),
      notes: label('es', 'integration.nuxt.notes'),
      vhtml: 'Nunca renderices la envoltura generada con v-html: durante la hidratación, Vue vuelve a asignar innerHTML, que no interpreta Declarative Shadow DOM. Esto destruye la shadow root prerenderizada y provoca parpadeos y avisos en consola. Usa una directiva que omita la asignación si el marcado del servidor ya existe.',
      server: 'Mantén la importación add-to-calendar-button/ssr estrictamente en el lado del servidor del componente. Puede estar en el nivel superior de script setup: no usa el DOM y se elimina del bundle del cliente.',
      client: 'Carga los módulos de estilos e idiomas no predeterminados antes del módulo principal add-to-calendar-button en el cliente, o hazlo en un plugin solo de cliente. El módulo principal registra el custom element y actualiza la envoltura conservando sus estilos del servidor.',
      attrs: 'Los atributos funcionan exactamente igual que en la etiqueta normal, incluidos los nombres kebab-case y los booleanos sin valor como buttons-list o hide-icon-button.',
    },
    react: {
      headline: label('es', 'integration.react.headline'),
      intro: 'Desde React 19, los Web Components son totalmente compatibles sin wrappers ni soluciones alternativas. Usa directamente el Web Component Add to Calendar Button en tu JSX.',
      options: 'A continuación destacamos todas las opciones.',
      types: 'Con React 19, las propiedades de los custom elements pueden tiparse mediante la compatibilidad de TypeScript. Registra el tipo una vez, por ejemplo en global.d.ts, para obtener comprobación completa:',
      typesConfig: 'Si compilerOptions.types está definido en tu tsconfig, incluye react y react-dom junto con las entradas existentes:',
    },
    svelte: { headline: label('es', 'integration.svelte.headline') },
    vue: {
      headline: label('es', 'integration.vue.headline'),
      optimize: label('es', 'integration.vue.optimize'),
      optimize1: 'En teoría, esto ya sería todo.',
      optimize2: 'Vue funciona muy bien con Web Components.',
      config1: 'Sin embargo, puede aparecer un aviso en la consola del navegador.',
      config2: 'Para eliminarlo, proporciona algo más de información a las opciones del compilador.',
      config3: 'Puedes hacerlo en vite.config.js o en otro lugar según tu configuración. Consulta la documentación oficial de Vue para más detalles',
      config4: 'Si Add to Calendar Button es el único Web Component del proyecto, puedes ser más específico.',
      config5: 'En ese caso, recomendamos definir como custom elements las etiquetas que empiezan por «add-».',
    },
    wix: {
      headline: label('es', 'integration.wix.headline'),
      intro1: 'Wix es un caso especial porque no permite una integración directa y fluida de Web Components. Es posible, pero con muchas restricciones y dificultades.',
      intro2: 'Por eso hemos creado un plugin específico para Wix, disponible en Wix App Market.',
      intro3: 'Este plugin envuelve el Web Component para integrarlo perfectamente en Wix sin renunciar a toda la potencia del script Add to Calendar Button.',
      intro4: 'Una vez instalado, puedes añadir botones Add to Calendar como bloques nativos de Wix sin código e incluso definir un estilo predeterminado global para facilitar la gestión de eventos.',
      link: label('es', 'integration.wix.link'),
    },
    wordpress: {
      headline: label('es', 'integration.wordpress.headline'),
      install: label('es', 'integration.wordpress.install'),
      install1: 'Instala el ',
      install2: 'plugin oficial desde el directorio de plugins de WordPress.',
      way1: 'Puedes encontrarlo directamente en la página «Plugins» del panel de administración.',
      search: label('es', 'integration.wordpress.search'),
      way2a: 'También puedes ',
      way2b: 'descargarlo aquí',
      way2c: ' y subir el archivo zip a WordPress, o descomprimirlo y cargar manualmente su contenido en el directorio',
      way2d: '.',
      activateHeading: label('es', 'integration.wordpress.activate'),
      activate: 'Activa el plugin desde la página «Plugins» de WordPress.',
      block: 'Usa simplemente el bloque en el editor Gutenberg de WordPress.',
      block1: 'Añade un bloque nuevo y busca «Add to Calendar Button».',
      block2: 'Haz clic en el bloque que aparece.',
      block3: 'Añade los atributos que quieras en los ajustes de «Bloque» de la derecha.',
      blockPro: 'Si usas nuestro servicio PRO, puedes activar la opción correspondiente y enlazar datos dinámicos, como campos meta o ACF.',
      shortcode1: 'También puedes usar el shortcode [add-to-calendar-button] y añadirle directamente los atributos:',
      shortcodePro: 'También es posible enlazar datos dinámicos con el shortcode. Consulta la documentación PRO para obtener más información.',
      shortcode2: "No puedes usar los caracteres '[' y ']' dentro de un shortcode. Para dar formato, usa {*} en lugar de [*].",
      proDocs: label('es', 'integration.wordpress.pro-docs'),
    },
  },
};

export const getGuideCopy = (locale: DocsLocale): GuideCopy => {
  switch (locale) {
    case 'de':
      return guideCopy.de;
    case 'fr':
      return guideCopy.fr;
    case 'es':
      return guideCopy.es;
    default:
      return guideCopy.en;
  }
};
