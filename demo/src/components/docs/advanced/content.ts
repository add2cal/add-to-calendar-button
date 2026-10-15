import type { DocsLocale } from '../docs-data';

type LocaleContent = {
  intro: string[];
  warning: string;
  text: Record<string, string[]>;
  labels: Record<string, string>;
  demo: {
    name: string;
    nameDummy: string;
    nameCustom1: string;
    nameCustom3: string;
    nameCustom4: string;
    nameSubscription: string;
    description1: string;
    description2: string;
    description3: string;
    timezone: string;
    location: string;
    customOptionLabel: string;
    customLabels: Record<string, string>;
    add: string;
    cancel: string;
    confirmedFile: string;
    cancelledFile: string;
    organizer: string;
  };
};

const en: LocaleContent = {
  intro: ['On this page, we want to show you more special cases for our Add to Calendar Buttons.<br />Additionally, you will learn how to customize even the smallest parts of the button.', 'Mind that if you did not check the <a href="{examples}">"Examples"</a> page before, you should go there first.'],
  warning: 'We do not recommend to use those advanced options, if you are no experienced developer, since they can be really tricky and break the usual behavior!',
  text: {
    builtIn: ['It seems obvious, but sometimes people jump directly into the ugly stuff, while there is a lot you can do with the included easy-to-use features.', 'Check the <a href="{configuration}">"Configuration"</a> page for all available settings and functionalities.', 'The following examples use some of them to showcase the variety of the included styles.'],
    override: [
      'Generally, it is not possible to directly override the CSS style, since the button sits in its own ShadowDOM.<br />What you can do, however, is overriding some CSS variables, which are bound to the host (= the <code>&lt;add-to-calendar-button&gt;</code> tag).<br />You can simply provide the default ones via the "styleLight" attribute and the "dark mode" overrides via an additional "styleDark" attribute.',
      'The available variables differ per selected button style. Check the respective <a href="https://github.com/add2cal/add-to-calendar-button/tree/main/assets/css" target="_blank" rel="noopener">css file in the repository <span aria-hidden="true">↗</span></a> (have a look at the "Global colors and shadows" section).',
      'Mind that this is not working with the "none" button style or the atcb_action approach (<a href="#case-10">see #10</a>).',
    ],
    externalCss: [
      'Another approach you can use, would be to load an external CSS file. Provide the file with the "customCss" option and set the button style to "custom".<br />This file could, of course, also be within your application, but should not be bundled with other css. Additionally, it is not allowed to use a url path with "../" syntax due to security reasons. Absolute urls would be recommended.',
      'Mind that in this case, you need to take care of all (!) elements.<br />It is recommended to copy a provided stylesheet <a href="https://github.com/add2cal/add-to-calendar-button/tree/main/assets/css" target="_blank" rel="noopener">from the repository <span aria-hidden="true">↗</span></a> and change what you want to change.',
      'For this approach, you also need to make sure that your system allows to load external stylesheets (e.g. no blocking Content-Security-Policy rules).',
      'In our example here, we keep it basic and only change the color again.',
    ],
    part: [
      'You can use the <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/::part" target="_blank" rel="noopener">css ::part selector <span aria-hidden="true">↗</span></a> to directly style pre-selected elements from your regular css code.<br />Mind that modals (and therefore also the button, when using "forceOverlay") are rendered in a new DOM element and you need to use the general selector ".add-to-calendar" or "#atcb-btn-<i>identifierOfTheButton</i>-modal-host" for this.',
      'The following elements are available for this approach:',
    ],
    customObject: ['Last but not least, you could also stick to a provided style, but use your own triggering object.<br />Check the <a href="#case-10">"10. Bring your own button" example</a> at the bottom of this page for more details.'],
    s2: [
      'The event description does not need to be simple plain text!<br />You can use HTML special characters as well as specific formatting rules.',
      'Those rules are set up as HTML pseudo tags, which get transformed automatically.<br /><span class="text-sm italic">(If you are using the WordPress Plugin Shortcode, \']\' would break your code. Instead of [*], you could also use {*} here.)</span><br /><span class="text-sm italic">(Apple, Yahoo, and Microsoft Teams are not fully supported and automatically transformed to plain text, supporting only line breaks and hyperlinks.)</span>',
    ],
    s3: [
      'You can also offer your users the option to subscribe to a calendar, instead of only saving static events.',
      'To get this to work, you would simply need to set the public address (an .ics file) of the calendar as the "icsFile" option and set the "subscribe" option to true.',
      '"name" is still required, but every other event parameter can be skipped in this case.<br />For Microsoft services, the "name" will be used as name for the calendar.<br />Mind that there won\'t be rich data for the subscribe option. Microsoft Teams is not yet supported, while Yahoo is no longer supported; both will be automatically disabled. The same applies to other Microsoft services on mobile devices.<br />The Google Calendar Android App only supports Google Calendar subscriptions. Other urls will be served by Chrome.<br /><span class="text-sm italic">(If the user\'s browser does not recognize any installed calendar app, this might lead to a blank screen. The PRO version mitigates this with some explenatory middleware screen.)</span>',
    ],
    s4: [
      'You can change any text blocks.',
      'For the button label you can simply specify the "label" option.',
      'For all other text blocks (like the "Close" at the modal list type), you can specify the "customLabels" option.<br />There, you need to specify a JSON structure and define any text you want to override.<br />Check the <a href="https://github.com/add2cal/add-to-calendar-button/blob/main/src/atcb-i18n.js" target="_blank" rel="noopener">atcb-i18n.js <span aria-hidden="true">↗</span></a> file at the repository for the available keys/options.<br />Any custom label will also override any translation.',
      '<span class="text-sm italic">(In case you are only looking for translating labels, check the "language" option instead!)</span>',
    ],
    s5: [
      'If you feel confident enough to mess with the rather unusual iCal settings, you can use the options "uid", "sequence", "ics-created", "ics-updated", "attendee", and "status" (tentative, confirmed, cancelled).<br />They basically override the respective default values.',
      '<strong>Mind that those options are only supported by the iCal and Apple calendar links!</strong>',
      'To update an existing event (e.g. changing its status) by changing those properties, you would need to have a growing sequence number, newer "ics-updated" date, same "ics-created" date, the same "uid", and also the organizer field (name and email) set.',
      'Some calendars only work with the "attendee" to be specified as well. And if your "update" to the event is not a status change to "cancelled", it is mandatory in all cases!<br />The attendee needs to be the person saving the event. If you know this, you can make use of this functionality. If not, we would not recommend it.',
    ],
    s6: [
      'A generated button gets an ID assigned. This ID follows the scheme "atcb-btn-X", where "X" will be an ascending number.<br />The individual calendar links then get the button ID plus the calendar type assigned - like "atcb-btn-5-google".',
      'You can override the automatically defined "X" at the button ID by defining a distinctive one with the "identifier" option.<br />This might help you to track any user interaction more precisely.',
      '<strong>Mind that this ID needs to be unique and may not be used at any other element!</strong>',
      'It behaves a little different, if you are using the custom <a href="#case-10">atcb_action function</a>, where the script might take the triggering element\'s id first, before falling back to the described scheme.',
    ],
    s7: ['We keep track of any action happening with a button.<br />You can read this data in 2 ways.', 'We are pushing the events directly into the Data Layer, which can be read, for example, with the Google Tag Manager and Google Analytics.'],
    s8: [
      "There are some really rare cases where you might not have an event with a specific place and time, but rather a time bound to the user's individual time zone.<br />For example offering an event, which should remind the users at 8am to brush their teeth.",
      'In those cases, you could set the "timeZone" option to "currentBrowser".<br />The event\'s time will then be automatically adjusted for each user based on the individual time zone.',
    ],
    s9: [
      'On mobile devices, applications, which are using the "WebView", have problems with how we generate and deliver the .ics files on the fly.<br />Therefore, we catch those cases, copy the data url to the user\'s clipboard, and show a short guide on how to proceed.',
      'Since this is the best practice for all websites and web apps, it might not be, if you are building your own native/hybrid app where you have control over the WebView settings.',
      'While this would still break the dynamic generation of the .ics file, you could at least deliver existing external ics files directly.<br />In this case, you could deactivate the described workaround with the "bypassWebViewCheck" option.',
      '<strong>Please make sure that the following applys to your project!</strong>',
      '<span class="text-sm italic">(The button below should not fire within an in-app WebView like at the Instagram native app - but it would in your app.)</span>',
    ],
    s10: [
      'For those who want to go fuc**** crazy custom, we also provide the option to trigger the calendar links list manually.<br />This provides you with the option to use anything as your button or even trigger it programmatically.',
      'Theoretically, you do not need to provide a button element. However, it is recommended to do so, since it will optimize the user experience a lot (like focusing the element on closing the modal, etc.).<br />If you do not provide a specific button, the list will automatically show as modal. If provided, you can opt for the overlay-dropdown list style via the listStyle option (mind that all other options are not supported in the atcb_action case). The modal style is strongly recommended.',
      '<em>Note: When only the Apple or iCal option is configured on an Apple device, an interstitial window opens before saving the event. This ensures that the dynamically generated calendar file can be opened and saved reliably. This extra step is skipped when a static ICS file is provided.</em>',
    ],
    import: ['If you use the script via CDN, you can skip this step.<br />If you use the script as npm package, you would first need to import the "atcb_action" functionality. Simply change the import statement to the following:'],
    trigger: ['Secondly, you would need to define the config and the trigger.<br />This might differ a lot based on your environment. You are the expert there.', 'In the example we use a quite simple button for the demonstration.'],
    s11: [
      'First things first:<br />Wherever possible, we load the script asynchronously, so it will not block the rendering of your page.<br />The script is also radically split: the bundle only contains the core, the default button style, and English.<br />Every other button style (a few KB each) and language (~3 KB each) loads automatically on demand - from the same location the script itself is served from.',
      '<strong>You usually do not need to do anything.</strong> But you can take control:',
      "To load all styles or all languages at once, use the aggregate modules: <code>import 'add-to-calendar-button/styles/all'</code> and <code>import 'add-to-calendar-button/i18n/all'</code>.",
    ],
    s12: [
      'The button can render a shell on the server.<br />The <code>add-to-calendar-button/ssr</code> entry produces a style- and size-correct placeholder via declarative shadow DOM - it paints before any JavaScript runs, and the client script upgrades it in place without layout shift.',
      'In your client entry, register every non-default style and language before loading the main module:',
      'For PRO events, use the asynchronous <code>atcb_generate_ssr_html_async</code> function. It fetches and merges the hosted configuration for the <code>proKey</code> before rendering the shell. Without a <code>proKey</code>, it behaves like the synchronous function.',
      'The shell honors the button style, size, light mode, right-to-left languages, and the label (the localized default or your "label" value). During the first client upgrade, its matching style nodes stay in place, avoiding an unstyled frame while hydration completes.<br />Date-style buttons, inline RSVP, and group overviews render subtle skeletons, since their content requires client-side logic. Everything else happens at hydration.',
      '<em>Browsers without declarative shadow DOM support simply ignore the shell and initialize client-only - no extra handling needed.</em>',
    ],
  },
  labels: {
    url: 'Define a URL text like this: [url]https://....|URL Text[/url]',
    addExample: 'The following button adds an event via "REQUEST".',
    cancelExample: 'While this button cancels the event via the "CANCEL" method.',
    trackingDisclaimer: 'You can try this by playing with a button on this site and putting "dataLayer" into the JavaScript console.',
    trackingOne: 'Observe the <code>atcb-last-event</code> attribute, which gets added to every button. It holds the last event and respective trigger (schema: "EVENT:TRIGGER"; example: "openList:atcb-btn-1").',
    trackingTwo: 'Access the Data Layer.',
    webviewOne: 'You are developing your own native/hybrid app.',
    webviewTwo: "You are opening the device's default browser instead of using any in-app WebView.",
    webviewThree: 'You have a distinctive .ics file on some server and can refer to it via the "icsFile" option.',
    loadingOne: 'When bundling, import exactly what you use - no fetch will ever happen for it:',
    loadingTwo: 'With the script tag, assets load from the script\'s own origin. Override the location via the <a href="{configuration}#stylesource">styleSource</a> option if you host them elsewhere.',
    loadingThree: 'If you switch the buttonStyle at runtime, set <a href="{configuration}#load-all-styles">loadAllStyles</a> to prefetch all deltas.',
  },
  demo: {
    name: '[Reminder] Test the Add to Calendar Button',
    nameDummy: 'Title',
    nameCustom1: 'Hit me to save!',
    nameCustom3: 'Flat and Singleton',
    nameCustom4: 'My awesome Event',
    nameSubscription: '[Test Subscription] Add to Calendar Button',
    description1: 'Check out the maybe easiest way to include Add to Calendar Buttons to your web projects:[br]→ [url]https://add-to-calendar-button.com/|Click here![/url]',
    description2: '[p][strong]Check out[/strong] the maybe [u]easiest way[/u] to include Add to Calendar Buttons to your website! 🚀[/p][p]💻 [em]Visit the official website for more inspiration:[/em][br]&rarr; [url]https://add-to-calendar-button.com/|Click here![/url][/p]',
    description3: 'A rather special example for customizing the Add to Calendar Button to its maximum.[br]Learn more at [url]https://add-to-calendar-button.com/[/url]',
    timezone: 'EST',
    location: 'World Wide Web',
    customOptionLabel: 'My custom label',
    customLabels: { close: 'Close the list again', apple: 'Apple is ok for me', google: 'Add to Google Cal', outlookcom: 'Use Outlook instead', yahoo: 'Yahoo, really?', ical: 'iCall ftw!' },
    add: 'Add the event',
    cancel: 'Cancel the event',
    confirmedFile: 'Event-confirmed',
    cancelledFile: 'Event-cancelled',
    organizer: 'John Doe|john.doe@mail.com',
  },
};

const de: LocaleContent = {
  ...en,
  intro: ['Auf dieser Seite zeigen wir etwas speziellere Fälle für unsere Add to Calendar Buttons.<br />Darüber hinaus lernst du hier, wie du den Button in jedem noch so kleinen Detail konfigurieren kannst.', 'Sofern du die <a href="{examples}">"Beispiele"</a>-Seite noch nicht besucht hast, solltest du dies zuerst tun.'],
  warning: 'Wenn du kein erfahrener Entwickler bist, raten wir von der Nutzung dieser Profi-Optionen explizit ab, da sie in der Umsetzung teilweise herausfordernd sein können und bei falscher Umsetzung das reguläres Verhalten der Anwendung stören!',
  text: {
    builtIn: [
      'Oft stürzen sich Nutzer direkt in sehr komplexe Schemata, obwohl es zahlreiche Möglichkeiten gibt, mit den inkludierten und idiotensicheren Funktionen zu arbeiten.',
      'Prüfe die <a href="{configuration}">"Konfiguration"</a>-Seite für alle Einstellungs-Optionen und Funktionalitäten.',
      'Die folgenden Beispiele illustrieren die grundsätzliche Vielfalt der inkludierten Stile und zeigen doch nur einen sehr kleinen Ausschnitt dessen.',
    ],
    override: [
      'Grundsätzlich ist es nicht möglich den CSS-Style direkt zu manipulieren, da der Button in seinem eigenen "ShadowDOM" gerendert wird.<br />Es gibt allerdings eine kleine Hintertür, über die du einige Variablen doch überschreiben kannst.<br />Du kannst CSS-Variablen, die an den Host (= the <code>&lt;add-to-calendar-button&gt;</code> tag) gebunden sind.<br />Spezifiziere deine invididuellen Werte über das "styleLight"-Attribut für den Standard-Look und über das "styleDark"-Attribut für den Dark-Mode.',
      'Die möglichen Variablen unterscheiden sich ein wenig von Button-Theme zu Button-Themen. Wirf hierzu einen Blick in die entsprechende <a href="https://github.com/add2cal/add-to-calendar-button/tree/main/assets/css" target="_blank" rel="noopener">CSS-Datei im Repository <span aria-hidden="true">↗</span></a> an (du findest die möglichen Werte in der Sektion "Global colors and shadows").',
      'Beachte, dass dies nicht mit dem Button-Stil "none" oder dem atcb_action-Ansatz (<a href="#case-10">siehe #10</a>) kompatibel ist.',
    ],
    externalCss: [
      'Ein weiterer möglicher Ansatz besteht darin eine externe CSS-Datei zu laden. Hierzu musst du lediglich mit der Option "customCss" auf diese Datei verweisen und den Button-Stil "custom" setzen.<br />Die Datei kann natürlich auf dem gleichen Server wie deine Anwendung liegen; sollte aber nicht mit anderem css verknüpft sein. Aus Sicherheitsgründen ist die Nutzung von "../" im Pfad allerdings nicht zulässig. Absolute URLs werden entsprechend empfohlen.',
      'Beachte, dass du dich um den Look aller (!) Elemente selbst kümmern musst, wenn du diesen Weg einschlägst.<br />Wir empfehlen eines der integrierten Stylesheets aus dem <a href="https://github.com/add2cal/add-to-calendar-button/tree/main/assets/css" target="_blank" rel="noopener">offiziellen Repository <span aria-hidden="true">↗</span></a> zu kopieren und zu verändern.',
      'Bei Nutzung externer Dateien musst du außerdem sicherstellen, dass dein System das Laden externer Stylesheets nicht blockiert (bspw. über Content-Security-Policy-Regeln)',
      'Im Beispiel halten wir das Ganze recht einfach und haben in dem externen Style lediglich die Farbe verändert.',
    ],
    part: [
      'Du kannst den <a href="https://developer.mozilla.org/de/docs/Web/CSS/::part" target="_blank" rel="noopener">css ::part selector <span aria-hidden="true">↗</span></a> nutzen, um vorselektierte Elemente direkt über deinen regulären CSS-Code zu stylen.<br />Beachte, dass Modals (damit auch der Button, bei Nutzung von "forceOverlay") in einem neuen DOM-Element gerendert werden und hierfür der allgemeine Selektor ".add-to-calendar" oder "#atcb-btn-<i>identifierDesButtons</i>-modal-host" genutzt werden muss.',
      'Nachfolgende Elemente stehen hierzu zur Verfügung:',
    ],
    customObject: ['Zu guter Letzt kannst du auch den Button durch dein eigenes Element ersetzen.<br />Dies beeinflusst zwar nicht den Stil weiterer Elemente (wie die Kalender-Link-Liste), ermöglicht es dir aber, jedes beliebige Element auf deiner Seite als Trigger zu nutzen.<br />Wirf einen Blick auf die Sektion <a href="#case-10">"10. Eigenen Button verknüpfen"</a> am Ende dieser Seite.'],
    s2: [
      'Die Event-Beschreibung muss nicht nur simpler Plain Text sein!<br />Du kannst HTML Special Characters einfügen sowie bestimmte Formatierungs-Regeln nutzen.',
      'Diese Regeln setzt du über HTML-Pseudo-Tags, die am Ende automatisch in echtes HTML transformiert werden.<br /><span class="text-sm italic">(Wenn du den WordPress Plugin Shortcode nutzt, stört \']\' den Code. In diesem Fall kannst du {*} anstelle von [*] nutzen.)</span><br /><span class="text-sm italic">(Apple, Yahoo und Microsoft Teams werden hierbei nicht vollständig unterstützt und der Wert automatisch zu Plain Text transformiert, womit nur Zeilenumbrüche und Links dargestellt werden.)</span>',
    ],
    s3: [
      'Du kannst deinen Nutzern auch die Möglichkeit bieten, einen Kalender zu abonnieren - anstelle davon einen statischen Termin zu speichern.',
      'Damit dies funktioniert, benötigst du einen öffentlich zugänglichen Kalender (.ics-Datei), dessen Adresse du über die "icsFile"-Option definierst. Setze nun noch die Option "subscribe" und du bist schon fertig.',
      '"name" ist weiterhin eine verpflichtende Angabe. Alle weiteren Parameter sind in diesem Fall aber optional.<br />Bei Microsoft-Diensten wird der "name" als Name für den geteilten Kalender genutzt.<br />Beachte, dass es für den Abonnement-Modus keine Rich-Data-Generierung gibt. Microsoft Teams wird noch nicht unterstützt, während Yahoo nicht mehr unterstützt wird; beide werden automatisch deaktiviert. Gleiches gilt für andere Microsoft-Dienste auf mobilen Geräten.<br />Die Google Calendar Android App unterstützt ausschließlich Google Calendar-Abonnements. Andere URLs werden von Chrome geöffnet.<br /><span class="text-sm italic">(Sollte der Browser des Nutzers keine installierte Kalender-App erkennen, kann dies zu einer leeren Seite führen. Die PRO-Version optimiert dies mit einem erklärenden Zwischenbildschirm.)</span>',
    ],
    s4: [
      'Du kannst grundsätzlich jeden Text-Block anpassen.',
      'Für den Text auf dem Button kannst du hierzu ganz einfach die "label"-Option nutzen.',
      'Für alle anderen Text-Blöcke (bspw. "Schließen" im Modal-Listen-Typ) kannst du die Option "customLabels" nutzen.<br />Hierbei musst du eine JSON-Struktur spezifizieren, die den jeweiligen Text zu dem zu ändernden Text-Key definiert.<br />Wirf einen Blick auf die Quellcode-Datei <a href="https://github.com/add2cal/add-to-calendar-button/blob/main/src/atcb-i18n.js" target="_blank" rel="noopener">atcb-i18n.js <span aria-hidden="true">↗</span></a> in unserem Repository. Sie beinhaltet alle verfügbaren Optionen (Text-Keys).<br />Texte werden je nach gewählter Sprache übersetzt. Ein individueller Text wird auch jede Übersetzung überschreiben.',
      '<span class="text-sm italic">(Falls du Texte lediglich übersetzen möchtest, prüfe zunächst die "language"-Option!)</span>',
    ],
    s5: [
      'Falls du im Umgang mit iCal-Einstellungen erfahren bist, kannst du die Optionen "uid", "sequence", "ics-created", "ics-updated", "attendee" und "status" (tentative, confirmed, cancelled) manuell steuern.',
      '<strong>Beachte, dass diese Optionen nur von den iCal und Apple Kalendar-Links unterstützt werden (und auch dann nicht von allen Kalender immer sauber erkannt werden)!</strong>',
      'Um ein bestehendes Event zu aktualisieren (bspw. den Status) muss die "sequence"-Nummer aufsteigen, ein jüngeres "ics-updated"-Datum bei gleichem "ics-created"-Datum gesetzt, die gleiche "uid" und die "organizer"-Option gegeben sein.',
      'Einige Kalender erfordern zudem einen "attendee". Sollte dein "Update" des Event kein Status-Wechsel auf "cancelled" sein, ist dieser in jedem Fall verpflichtend!<br />Der "attendee" muss die Person sein, die das Event bei sich speichert. Wenn du diese Information hast, kannst du die Update-Funktionalität nutzen. Ansonsten muss davon abgeraten werden.',
    ],
    s6: [
      'Jeder generierter Button erhält stets seine eigene unique ID. Diese wird nach dem Schema "atcb-btn-X" erzeugt, bei welchem "X" eine aufsteigende Zahl ist.<br />Die einzelnen Kalender-Links erhalten als ID diese Button-ID zzgl. des Kalendar-Typs - bspw. "atcb-btn-5-google".',
      'Du kannst das automatisch erzeugte "X" mit deiner eigenen ID überschreiben, indem du die Option "identifier" spezifizierst.<br />Dies kann bspw. für Tracking-Funktionalitäten auf deiner Webseite hilfreich sein.',
      '<strong>Beachte, dass der Wert eindeutig sein muss und für kein weiteres Element genutzt werden darf!</strong>',
      'Bei Nutzung der <a href="#case-10">atcb_action Funktion</a> verhält es sich minimal anders. Das Skript nutzt das genannte Schema nur, wenn das auslösende Element keine ID besitzt.',
    ],
    s7: ['Wir tracken jede Aktion auf dem Button für dich.<br />Die Daten kannst du auf 2 Arten auslesen.', 'Wir speichern alle Events direct im Data Layer, der wiederum bspw. vom Google Tag Manager und Google Analytics gelesen werden kann.'],
    s8: [
      'In wenigen seltenen Fällen, in welchen du bspw. kein Event mit einem bestimmten Ort und Zeit nutzt, kann es hilfreich sein die Zeitzone dynamisch dem Ort des jeweiligen Nutzers zuzuordnen.<br />Bspw. ein Event, welches den Nutzer daran erinnern soll, um 8 Uhr morgens seine Zähne zu putzen - egal, wo auf der Welt er sich befindet.',
      'In diesen Fällen kannst du den Wert "currentBrowser" in der "timeZone"-Option nutzen.<br />Die Zeitangabe des Events wird dann automatisch an die Zeitzone des jeweiligen Nutzers angepasst.',
    ],
    s9: [
      'Apps auf mobilen Endgeräten, die den so genannten "WebView" nutzen, zeigen Probleme mit der Art, wie wir .ics-Dateien erzeugen und dynamisch ausliefern.<br />Aus diesem Grund fangen wir diese Fälle ab, kopieren stattdessen eine URL in die Zwischenablage des Nutzers und zeigen eine Anleitung an, wie das Event mit wenigen Zusatzschritten gespeichert werden kann.',
      'Auch wenn dies Best Practice für Webseiten und Web-Apps darstellt, kann es hinderlich sein, wenn du deine eigene native/hybride App erstellst, in welcher du selbst volle Kontrolle über die WebView-Einstellungen hast.',
      'Auch wenn die dynamische Erzeugung von .ics-Dateien auch in diesem Fall nicht funktionieren würde, kannst du eine statische DAtei über die "icsFile"-Option ausliefern.<br />In diesem Fall solltest du zusätzlich die "bypassWebViewCheck"-Option setzen, um den genannten Workaround zu deaktivieren.',
      '<strong>Bitte stelle sicher, dass folgendes auf dein Projekt zutrifft!</strong>',
      '<span class="text-sm italic">(Der nachfolgende Button sollte in einer in-App-WebView-Umgebung, wie der Instagram-App nicht funktionieren, wohl aber in deiner eigenen App.)</span>',
    ],
    s10: [
      'Für alle Entwickler, die extrem "custom" arbeiten wollen, bieten wir die Option die Kalender-Link-Liste programmatisch zu öffnen.<br />Dies eröffnet dir dir Möglichkeit jedes Element als Button/Trigger zu nutzen.',
      'Theoretisch muss dieses Element kein Button sein. Wir raten allerdings stark dazu, da es die User Experience wesentlich positiv beeinflusst (bspw. durch die Unterstützung von Tastatur-Navigation, etc.).<br />Wenn du kein Button-Element nutzt, öffnet sich die Kalendar-Liste als Modal. Gibt es ein Button-Element kannst du auch den Overlay-Dropdown-Stil über die Option listStyle wählen (beachte, dass die übrigen Optionen mit atcb_action nicht unterstützt werden). Der Modal-Stil ist der Standard und wird auch empfohlen.',
      '<em>Hinweis: Wenn auf einem Apple-Gerät ausschließlich die Apple- oder iCal-Option konfiguriert ist, öffnet sich vor dem Speichern ein Zwischenfenster. Dadurch kann die dynamisch erzeugte Kalenderdatei zuverlässig geöffnet und gespeichert werden. Wenn eine statische ICS-Datei hinterlegt ist, entfällt dieser zusätzliche Schritt.</em>',
    ],
    import: ['Wenn du das Skript via CDN einbindest kannst du diesen Schritt überspringen.<br />Wenn du das Skript über das npm Package ntuzt, musst du zunächst die "atcb_action"-Funktion importieren. Ändere dein Import-Statement entsprechend.'],
    trigger: ['Im Anschluss musst du die Config und den Trigger der Funktion definieren.<br />Dies kann je nachdem wie deine Entwicklungsumgebung aussieht, sehr unterschiedlich aussehen - hier bist du der Experte.', 'Im Beispiel nutzen wir einen recht einfachen Button und Prozess zu Demonstrationszwecken.'],
    s11: [
      'First things first:<br />Woimmer möglich, laden wir das Skript asynchron, sodass es das Rendern deiner Seite nicht blockiert.<br />Das Skript ist zudem radikal aufgeteilt: das Bundle enthält nur den Kern, den Default-Button-Style und Englisch.<br />Jeder weitere Button-Style (wenige KB) und jede weitere Sprache (~3 KB) lädt automatisch bei Bedarf - von dort, wo auch das Skript selbst ausgeliefert wird.',
      '<strong>In der Regel musst du nichts weiter tun.</strong> Du kannst aber die Kontrolle übernehmen:',
      "Um alle Styles oder alle Sprachen auf einmal zu laden, nutze die Aggregat-Module: <code>import 'add-to-calendar-button/styles/all'</code> und <code>import 'add-to-calendar-button/i18n/all'</code>.",
    ],
    s12: [
      'Der Button kann eine Hülle auf dem Server rendern.<br />Der <code>add-to-calendar-button/ssr</code>-Einstiegspunkt erzeugt einen Platzhalter mit korrektem Style und Größe via Declarative Shadow DOM - er wird gerendered, bevor JavaScript läuft, und das Client-Skript übernimmt ihn ohne Layout-Sprung.',
      'Registriere in deinem Client-Einstiegspunkt alle nicht-standardmäßigen Styles und Sprachen, bevor du das Hauptmodul lädst:',
      'Für PRO-Events verwendest du die asynchrone Funktion <code>atcb_generate_ssr_html_async</code>. Sie lädt und kombiniert die gehostete Konfiguration für den <code>proKey</code>, bevor sie die Hülle rendert. Ohne <code>proKey</code> verhält sie sich wie die synchrone Funktion.',
      'Die Hülle berücksichtigt Button-Style, Größe, Light-Mode, Rechts-nach-Links-Sprachen und das Label (der lokalisierte Default oder dein "label"-Wert). Beim ersten Client-Upgrade bleiben die passenden Style-Nodes bestehen, sodass während der Hydration kein ungestylter Frame entsteht.<br />Date-Style-Buttons, Inline-RSVP und Gruppenübersichten rendern dezente Skeletons, da ihr Inhalt Client-Logik erfordert. Alles Weitere passiert bei der Hydration.',
      '<em>Browser ohne Declarative-Shadow-DOM-Unterstützung ignorieren die Hülle einfach und initialisieren rein client-seitig - ohne weiteres Zutun.</em>',
    ],
  },
  labels: {
    url: 'Definiere den Link-Text wie folgt: [url]https://....|Link-Text[/url]',
    addExample: 'Der folgende Button fügt ein Event via "REQUEST" hinzu.',
    cancelExample: 'Während dieser Button das Event mittels der "CANCEL"-Methode wieder absagt.',
    trackingDisclaimer: 'Probier es aus, indem du mit einem Button auf dieser Seite interagierst und "dataLayer" in die JavaScript-Konsole eingibst.',
    trackingOne: 'Tracke selbst das <code>atcb-last-event</code> Attribut, welches an jedem Button erzeugt wird. Es zeigt das jeweils letzte Event zusammen mit dem jeweiligen Trigger an (Schema: "EVENT:TRIGGER"; Beispiel: "openList:atcb-btn-1").',
    trackingTwo: 'Nutzer den Data Layer.',
    webviewOne: 'Du entwickelst deine eigene native/hybride App.',
    webviewTwo: 'Du öffnest in der App den Standard-Browser des Geräts und nutzt nicht den WebView.',
    webviewThree: 'Du hast eine dedizierte .ics-Datei zur Verfügung und verweist auf diese über die "icsFile"-Option.',
    loadingOne: 'Beim Bundling importierst du exakt das, was du nutzt - dafür findet dann nie eine Netzwerk-Anfrage statt:',
    loadingTwo: 'Mit dem Script-Tag laden Assets vom Origin des Skripts. Über die <a href="{configuration}#stylesource">styleSource</a>-Option kannst du den Ort überschreiben.',
    loadingThree: 'Wenn du den buttonStyle zur Laufzeit wechselst, lädt <a href="{configuration}#load-all-styles">loadAllStyles</a> alle Deltas vor.',
  },
  demo: {
    name: '[Reminder] Add to Calendar Button testen',
    nameDummy: 'Titel',
    nameCustom1: 'Speicher mich!',
    nameCustom3: 'Flat und Singleton',
    nameCustom4: 'Mein geniales Event',
    nameSubscription: '[Kalendar-Abo-Dummy] Add to Calendar Button',
    description1: 'Entdecke die wahrscheinlich einfachste Möglichkeit einen Add to Calendar Button in dein Web-Projekt zu integrieren:[br]→ [url]https://add-to-calendar-button.com/de/|Hier klicken![/url]',
    description2: '[p][strong]Entdecke[/strong] die wahrscheinlich [u]einfachste Möglichkeit[/u] einen Add to Calendar Button in dein Web-Projekt zu integrieren! 🚀[/p][p]💻 [em]Besuche die offizielle Webseite für weitere Inspiration:[/em][br]&rarr; [url]https://add-to-calendar-button.com/de/|Hier klicken![/url][/p]',
    description3: 'Ein etwas spezielleres Beispiel, wie der Add to Calendar Button konfiguriert werden kann.[br]Erfahre mehr unter [url]https://add-to-calendar-button.com/de/[/url]',
    timezone: 'Europe/Berlin',
    location: 'World Wide Web',
    customOptionLabel: 'Mein eigenes Label',
    customLabels: { close: 'Liste schließen', apple: 'Apple ist in Ordnung', google: 'Zum Google-Kalendar', outlookcom: 'Lieber Outlook...', yahoo: 'Yahoo, wirklich?', ical: 'iCall ftw!' },
    add: 'Event hinzufügen',
    cancel: 'Event absagen',
    confirmedFile: 'Event-bestaetigt',
    cancelledFile: 'Event-abgesagt',
    organizer: 'Max Muster|max.muster@mail.com',
  },
};

const fr: LocaleContent = {
  ...en,
  intro: ['Sur cette page, nous souhaitons vous présenter des cas plus particuliers pour nos boutons Add to Calendar.<br />Vous apprendrez également à personnaliser le bouton jusque dans ses moindres détails.', 'Si vous n’avez pas encore consulté la page <a href="{examples}">« Exemples »</a>, commencez par là.'],
  warning: 'Nous déconseillons ces options avancées aux développeurs inexpérimentés : elles peuvent être délicates et perturber le comportement habituel !',
  text: {
    builtIn: [
      'Cela semble évident, mais certains se lancent directement dans les solutions complexes alors que les fonctions intégrées et simples offrent déjà beaucoup de possibilités.',
      'Consultez la page <a href="{configuration}">« Configuration »</a> pour découvrir tous les réglages et toutes les fonctionnalités.',
      'Les exemples suivants en utilisent quelques-uns pour illustrer la variété des styles inclus.',
    ],
    override: [
      'Il n’est généralement pas possible de remplacer directement le style CSS, car le bouton se trouve dans son propre Shadow DOM.<br />Vous pouvez toutefois remplacer certaines variables CSS liées à l’hôte (= la balise <code>&lt;add-to-calendar-button&gt;</code>).<br />Fournissez les valeurs par défaut avec l’attribut « styleLight » et les valeurs du mode sombre avec « styleDark ».',
      'Les variables disponibles dépendent du style choisi. Consultez le <a href="https://github.com/add2cal/add-to-calendar-button/tree/main/assets/css" target="_blank" rel="noopener">fichier CSS correspondant dans le dépôt <span aria-hidden="true">↗</span></a> (section « Global colors and shadows »).',
      'Cela ne fonctionne pas avec le style de bouton « none » ni avec l’approche atcb_action (<a href="#case-10">voir le nº 10</a>).',
    ],
    externalCss: [
      'Vous pouvez aussi charger un fichier CSS externe. Indiquez-le avec l’option « customCss » et choisissez le style de bouton « custom ».<br />Ce fichier peut se trouver dans votre application, mais ne doit pas être regroupé avec d’autres feuilles CSS. Pour des raisons de sécurité, les chemins contenant « ../ » sont interdits. Une URL absolue est recommandée.',
      'Dans ce cas, vous devez prendre en charge tous (!) les éléments.<br />Il est recommandé de copier une feuille de style fournie <a href="https://github.com/add2cal/add-to-calendar-button/tree/main/assets/css" target="_blank" rel="noopener">depuis le dépôt <span aria-hidden="true">↗</span></a>, puis de la modifier.',
      'Vérifiez aussi que votre système autorise le chargement de feuilles de style externes (aucune règle Content-Security-Policy bloquante, par exemple).',
      'Dans cet exemple, nous restons simples et ne changeons que la couleur.',
    ],
    part: [
      'Le <a href="https://developer.mozilla.org/fr/docs/Web/CSS/::part" target="_blank" rel="noopener">sélecteur CSS ::part <span aria-hidden="true">↗</span></a> permet de styler directement des éléments présélectionnés depuis votre CSS habituel.<br />Les fenêtres modales (et donc le bouton avec « forceOverlay ») sont rendues dans un nouvel élément DOM : utilisez alors le sélecteur général « .add-to-calendar » ou « #atcb-btn-<i>identifiantDuBouton</i>-modal-host ».',
      'Les éléments suivants sont disponibles :',
    ],
    customObject: ['Enfin, vous pouvez conserver un style fourni tout en utilisant votre propre élément déclencheur.<br />Consultez l’exemple <a href="#case-10">« 10. Utiliser votre propre bouton »</a> au bas de cette page.'],
    s2: [
      'La description de l’événement ne doit pas nécessairement être du texte brut !<br />Vous pouvez utiliser des caractères HTML spéciaux et des règles de mise en forme.',
      'Ces règles prennent la forme de pseudo-balises HTML transformées automatiquement.<br /><span class="text-sm italic">(Dans le shortcode de l’extension WordPress, « ] » casserait le code. Vous pouvez utiliser {*} au lieu de [*].)</span><br /><span class="text-sm italic">(Apple, Yahoo et Microsoft Teams ne sont pas entièrement compatibles : le contenu est converti en texte brut avec uniquement les sauts de ligne et les liens.)</span>',
    ],
    s3: [
      'Vous pouvez proposer à vos utilisateurs de s’abonner à un calendrier au lieu d’enregistrer uniquement des événements statiques.',
      'Pour cela, définissez l’adresse publique du calendrier (un fichier .ics) dans l’option « icsFile » et activez l’option « subscribe ».',
      '« name » reste obligatoire, mais tous les autres paramètres d’événement peuvent être omis.<br />Pour les services Microsoft, « name » sert de nom au calendrier.<br />Aucune donnée enrichie n’est générée pour un abonnement. Microsoft Teams n’est pas encore pris en charge et Yahoo ne l’est plus ; tous deux sont désactivés automatiquement. Il en va de même pour les autres services Microsoft sur mobile.<br />L’application Google Calendar sur Android ne prend en charge que les abonnements Google Calendar. Les autres URL sont ouvertes dans Chrome.<br /><span class="text-sm italic">(Si le navigateur ne détecte aucune application de calendrier installée, un écran vide peut apparaître. La version PRO atténue ce problème avec un écran intermédiaire explicatif.)</span>',
    ],
    s4: [
      'Vous pouvez modifier tous les blocs de texte.',
      'Pour le libellé du bouton, utilisez simplement l’option « label ».',
      'Pour les autres textes (comme « Fermer » dans une liste modale), utilisez « customLabels ».<br />Fournissez une structure JSON et définissez les textes à remplacer.<br />Consultez le fichier <a href="https://github.com/add2cal/add-to-calendar-button/blob/main/src/atcb-i18n.js" target="_blank" rel="noopener">atcb-i18n.js <span aria-hidden="true">↗</span></a> du dépôt pour connaître les clés disponibles.<br />Un libellé personnalisé remplace toujours la traduction.',
      '<span class="text-sm italic">(Si vous souhaitez seulement traduire les libellés, utilisez plutôt l’option « language » !)</span>',
    ],
    s5: [
      'Si les réglages iCal inhabituels ne vous effraient pas, utilisez les options « uid », « sequence », « ics-created », « ics-updated », « attendee » et « status » (tentative, confirmed, cancelled).<br />Elles remplacent les valeurs par défaut correspondantes.',
      '<strong>Ces options ne sont prises en charge que par les liens iCal et Apple Calendar !</strong>',
      'Pour mettre à jour un événement existant (par exemple son statut), augmentez « sequence », utilisez une date « ics-updated » plus récente, conservez les mêmes « ics-created » et « uid », et fournissez l’organisateur (nom et adresse e-mail).',
      'Certains calendriers exigent aussi « attendee ». Si la mise à jour n’est pas un changement de statut vers « cancelled », ce champ est toujours obligatoire !<br />L’attendee doit être la personne qui enregistre l’événement. N’utilisez cette fonctionnalité que si vous connaissez cette information.',
    ],
    s6: [
      'Un identifiant est attribué à chaque bouton généré selon le modèle « atcb-btn-X », où « X » est un nombre croissant.<br />Chaque lien de calendrier reçoit ensuite l’identifiant du bouton suivi du type de calendrier, par exemple « atcb-btn-5-google ».',
      'Vous pouvez remplacer le « X » automatique par une valeur distincte avec l’option « identifier ».<br />Cela peut permettre un suivi plus précis des interactions.',
      '<strong>Cet identifiant doit être unique et ne doit être utilisé par aucun autre élément !</strong>',
      'Avec la fonction personnalisée <a href="#case-10">atcb_action</a>, le script peut d’abord utiliser l’identifiant de l’élément déclencheur avant de revenir au modèle décrit.',
    ],
    s7: ['Nous suivons chaque action effectuée avec un bouton.<br />Vous pouvez lire ces données de deux façons.', 'Nous envoyons directement les événements dans le Data Layer, lisible notamment par Google Tag Manager et Google Analytics.'],
    s8: ['Dans de rares cas, l’événement n’est pas lié à un lieu et une heure précis, mais à une heure dans le fuseau propre à chaque utilisateur.<br />Par exemple, un rappel demandant à chacun de se brosser les dents à 8 h.', 'Dans ce cas, définissez l’option « timeZone » sur « currentBrowser ».<br />L’heure de l’événement sera automatiquement adaptée au fuseau de chaque utilisateur.'],
    s9: [
      'Sur mobile, les applications utilisant une « WebView » rencontrent des problèmes avec la génération et la livraison à la volée des fichiers .ics.<br />Nous détectons ces cas, copions l’URL de données dans le presse-papiers et affichons un bref guide.',
      'Cette bonne pratique convient aux sites et applications web, mais pas forcément à votre propre application native ou hybride, où vous contrôlez les réglages de la WebView.',
      'La génération dynamique du fichier .ics resterait impossible, mais vous pourriez livrer directement un fichier ICS externe existant.<br />Désactivez alors ce contournement avec l’option « bypassWebViewCheck ».',
      '<strong>Vérifiez que les conditions suivantes s’appliquent à votre projet !</strong>',
      '<span class="text-sm italic">(Le bouton ci-dessous ne devrait pas fonctionner dans une WebView intégrée comme celle de l’application Instagram, mais fonctionnerait dans votre application.)</span>',
    ],
    s10: [
      'Pour ceux qui veulent une personnalisation complètement débridée, nous permettons aussi de déclencher manuellement la liste des liens de calendrier.<br />Vous pouvez ainsi utiliser n’importe quel élément comme bouton, voire déclencher l’action par programmation.',
      'En théorie, aucun bouton n’est nécessaire. Il reste fortement recommandé, car il améliore nettement l’expérience (retour du focus à la fermeture de la fenêtre modale, etc.).<br />Sans bouton, la liste s’affiche automatiquement dans une fenêtre modale. Avec un bouton, vous pouvez choisir la liste déroulante superposée via « listStyle » (les autres options ne sont pas prises en charge avec atcb_action). Le style modal est vivement recommandé.',
      '<em>Remarque : sur un appareil Apple, si seule l’option Apple ou iCal est configurée, une fenêtre intermédiaire apparaît avant l’enregistrement. Elle garantit l’ouverture et l’enregistrement fiables du fichier généré. Cette étape est ignorée lorsqu’un fichier ICS statique est fourni.</em>',
    ],
    import: ['Si vous utilisez le script via CDN, ignorez cette étape.<br />Avec le paquet npm, importez d’abord la fonction « atcb_action » comme suit :'],
    trigger: ['Définissez ensuite la configuration et le déclencheur.<br />L’implémentation peut varier fortement selon votre environnement : vous en êtes l’expert.', 'Pour la démonstration, l’exemple utilise un bouton très simple.'],
    s11: [
      'Avant tout :<br />Dès que possible, nous chargeons le script de façon asynchrone afin de ne pas bloquer le rendu de la page.<br />Le script est aussi fortement découpé : le bundle ne contient que le cœur, le style de bouton par défaut et l’anglais.<br />Chaque autre style (quelques Ko) et chaque autre langue (environ 3 Ko) est chargé automatiquement à la demande depuis la même origine que le script.',
      '<strong>Vous n’avez généralement rien à faire.</strong> Mais vous pouvez garder le contrôle :',
      "Pour charger tous les styles ou toutes les langues en une fois, utilisez les modules agrégés : <code>import 'add-to-calendar-button/styles/all'</code> et <code>import 'add-to-calendar-button/i18n/all'</code>.",
    ],
    s12: [
      'Le bouton peut rendre une enveloppe sur le serveur.<br />L’entrée <code>add-to-calendar-button/ssr</code> produit avec le Shadow DOM déclaratif un espace réservé dont le style et la taille sont corrects : il s’affiche avant tout JavaScript, puis le script client le met à niveau sur place sans décalage de mise en page.',
      'Dans votre entrée client, enregistrez tous les styles et toutes les langues autres que ceux par défaut avant de charger le module principal :',
      'Pour les événements PRO, utilisez la fonction asynchrone <code>atcb_generate_ssr_html_async</code>. Elle récupère et fusionne la configuration hébergée du <code>proKey</code> avant de rendre l’enveloppe. Sans <code>proKey</code>, elle se comporte comme la fonction synchrone.',
      'L’enveloppe respecte le style, la taille, le mode clair, les langues de droite à gauche et le libellé (valeur localisée par défaut ou valeur de « label »). Lors de la première mise à niveau côté client, les nœuds de style correspondants restent en place, ce qui évite une image non stylée pendant l’hydratation.<br />Les boutons de style date, les RSVP en ligne et les aperçus de groupe affichent des squelettes discrets, car leur contenu nécessite une logique côté client. Tout le reste se produit à l’hydratation.',
      '<em>Les navigateurs sans prise en charge du Shadow DOM déclaratif ignorent simplement l’enveloppe et s’initialisent uniquement côté client : aucune gestion supplémentaire n’est nécessaire.</em>',
    ],
  },
  labels: {
    url: 'Définissez le texte du lien ainsi : [url]https://....|Texte du lien[/url]',
    addExample: 'Le bouton suivant ajoute un événement avec la méthode « REQUEST ».',
    cancelExample: 'Tandis que ce bouton annule l’événement avec la méthode « CANCEL ».',
    trackingDisclaimer: 'Essayez en manipulant un bouton de ce site, puis en saisissant « dataLayer » dans la console JavaScript.',
    trackingOne: 'Observez l’attribut <code>atcb-last-event</code> ajouté à chaque bouton. Il contient le dernier événement et son déclencheur (modèle : « EVENT:TRIGGER » ; exemple : « openList:atcb-btn-1 »).',
    trackingTwo: 'Accédez au Data Layer.',
    webviewOne: 'Vous développez votre propre application native ou hybride.',
    webviewTwo: 'Vous ouvrez le navigateur par défaut de l’appareil au lieu d’utiliser une WebView intégrée.',
    webviewThree: 'Vous disposez d’un fichier .ics distinct sur un serveur et pouvez le référencer avec l’option « icsFile ».',
    loadingOne: 'Lors du bundling, importez exactement ce que vous utilisez : aucune requête ne sera effectuée pour ces ressources :',
    loadingTwo: 'Avec la balise script, les ressources sont chargées depuis l’origine du script. Remplacez cet emplacement avec l’option <a href="{configuration}#stylesource">styleSource</a> si vous les hébergez ailleurs.',
    loadingThree: 'Si vous changez buttonStyle à l’exécution, activez <a href="{configuration}#load-all-styles">loadAllStyles</a> pour précharger toutes les différences.',
  },
  demo: {
    name: '[Rappel] Tester Add to Calendar Button',
    nameDummy: 'Titre',
    nameCustom1: 'Cliquez pour enregistrer !',
    nameCustom3: 'Plat et direct',
    nameCustom4: 'Mon événement génial',
    nameSubscription: '[Abonnement test] Add to Calendar Button',
    description1: 'Découvrez la façon peut-être la plus simple d’intégrer des boutons Add to Calendar dans vos projets web :[br]→ [url]https://add-to-calendar-button.com/fr/|Cliquez ici ![/url]',
    description2: '[p][strong]Découvrez[/strong] la façon peut-être [u]la plus simple[/u] d’intégrer des boutons Add to Calendar à votre site ! 🚀[/p][p]💻 [em]Visitez le site officiel pour plus d’inspiration :[/em][br]&rarr; [url]https://add-to-calendar-button.com/fr/|Cliquez ici ![/url][/p]',
    description3: 'Un exemple assez particulier pour personnaliser Add to Calendar Button au maximum.[br]En savoir plus sur [url]https://add-to-calendar-button.com/fr/[/url]',
    timezone: 'Europe/Paris',
    location: 'World Wide Web',
    customOptionLabel: 'Mon libellé personnalisé',
    customLabels: { close: 'Fermer la liste', apple: 'Apple me convient', google: 'Ajouter à Google Agenda', outlookcom: 'Utiliser plutôt Outlook', yahoo: 'Yahoo, vraiment ?', ical: 'iCal pour gagner !' },
    add: 'Ajouter l’événement',
    cancel: 'Annuler l’événement',
    confirmedFile: 'Evenement-confirme',
    cancelledFile: 'Evenement-annule',
    organizer: 'Jean Dupont|jean.dupont@mail.com',
  },
};

const es: LocaleContent = {
  ...fr,
  intro: ['En esta página queremos mostrarte casos más especiales para nuestros botones Add to Calendar.<br />Además, aprenderás a personalizar hasta los detalles más pequeños del botón.', 'Si todavía no has visitado la página de <a href="{examples}">«Ejemplos»</a>, deberías empezar por allí.'],
  warning: 'No recomendamos usar estas opciones avanzadas si no tienes experiencia como desarrollador, ya que pueden ser complicadas y alterar el comportamiento habitual.',
  text: {
    builtIn: ['Parece obvio, pero a veces se salta directamente a lo complicado cuando las funciones incluidas y fáciles de usar ya ofrecen muchas posibilidades.', 'Consulta la página de <a href="{configuration}">«Configuración»</a> para ver todos los ajustes y funcionalidades disponibles.', 'Los siguientes ejemplos usan algunas de ellas para mostrar la variedad de estilos incluidos.'],
    override: [
      'Por lo general no puedes sobrescribir directamente el CSS porque el botón está en su propio Shadow DOM.<br />Sin embargo, puedes sobrescribir algunas variables CSS vinculadas al host (= la etiqueta <code>&lt;add-to-calendar-button&gt;</code>).<br />Indica los valores predeterminados con «styleLight» y los del modo oscuro con «styleDark».',
      'Las variables disponibles cambian según el estilo. Consulta el <a href="https://github.com/add2cal/add-to-calendar-button/tree/main/assets/css" target="_blank" rel="noopener">archivo CSS correspondiente del repositorio <span aria-hidden="true">↗</span></a> (sección «Global colors and shadows»).',
      'Esto no funciona con el estilo «none» ni con el enfoque atcb_action (<a href="#case-10">consulta el n.º 10</a>).',
    ],
    externalCss: [
      'Otra opción es cargar un archivo CSS externo. Indícalo con «customCss» y establece el estilo del botón en «custom».<br />El archivo puede estar en tu aplicación, pero no debe agruparse con otros CSS. Por seguridad no se admiten rutas con «../»; se recomiendan URL absolutas.',
      'En este caso debes ocuparte de todos (!) los elementos.<br />Recomendamos copiar una hoja de estilo <a href="https://github.com/add2cal/add-to-calendar-button/tree/main/assets/css" target="_blank" rel="noopener">del repositorio <span aria-hidden="true">↗</span></a> y modificarla.',
      'También debes asegurarte de que el sistema permite cargar hojas de estilo externas (por ejemplo, sin reglas Content-Security-Policy que las bloqueen).',
      'En este ejemplo lo mantenemos sencillo y solo cambiamos el color.',
    ],
    part: [
      'Puedes usar el <a href="https://developer.mozilla.org/es/docs/Web/CSS/::part" target="_blank" rel="noopener">selector CSS ::part <span aria-hidden="true">↗</span></a> para aplicar estilos directamente a elementos preseleccionados desde tu CSS habitual.<br />Los modales (y el botón al usar «forceOverlay») se renderizan en un elemento DOM nuevo; usa el selector general «.add-to-calendar» o «#atcb-btn-<i>identificadorDelBotón</i>-modal-host».',
      'Los siguientes elementos están disponibles:',
    ],
    customObject: ['Por último, puedes conservar un estilo incluido y usar tu propio elemento activador.<br />Consulta el ejemplo <a href="#case-10">«10. Usar tu propio botón»</a> al final de esta página.'],
    s2: [
      '¡La descripción del evento no tiene que ser texto sin formato!<br />Puedes usar caracteres especiales HTML y reglas de formato concretas.',
      'Estas reglas se definen como pseudoetiquetas HTML que se transforman automáticamente.<br /><span class="text-sm italic">(En el shortcode del plugin de WordPress, «]» rompería el código. Puedes usar {*} en lugar de [*].)</span><br /><span class="text-sm italic">(Apple, Yahoo y Microsoft Teams no son totalmente compatibles; el valor se transforma en texto sin formato y solo conserva saltos de línea e hipervínculos.)</span>',
    ],
    s3: [
      'También puedes ofrecer a tus usuarios la posibilidad de suscribirse a un calendario en vez de guardar solo eventos estáticos.',
      'Para ello, define la dirección pública del calendario (un archivo .ics) en «icsFile» y activa «subscribe».',
      '«name» sigue siendo obligatorio, pero puedes omitir los demás parámetros del evento.<br />En los servicios de Microsoft, «name» se usa como nombre del calendario.<br />Las suscripciones no generan datos enriquecidos. Microsoft Teams todavía no es compatible y Yahoo ya no lo es; ambos se desactivan automáticamente. Lo mismo ocurre con otros servicios de Microsoft en móviles.<br />La aplicación Google Calendar para Android solo admite suscripciones de Google Calendar. Chrome abre las demás URL.<br /><span class="text-sm italic">(Si el navegador no reconoce ninguna aplicación de calendario instalada, puede aparecer una pantalla en blanco. La versión PRO lo mitiga con una pantalla intermedia explicativa.)</span>',
    ],
    s4: [
      'Puedes cambiar cualquier bloque de texto.',
      'Para el texto del botón, usa simplemente «label».',
      'Para los demás textos (como «Cerrar» en una lista modal), usa «customLabels».<br />Debes indicar una estructura JSON con los textos que quieras sobrescribir.<br />Consulta el archivo <a href="https://github.com/add2cal/add-to-calendar-button/blob/main/src/atcb-i18n.js" target="_blank" rel="noopener">atcb-i18n.js <span aria-hidden="true">↗</span></a> del repositorio para ver las claves disponibles.<br />Cualquier texto personalizado sobrescribe también la traducción.',
      '<span class="text-sm italic">(Si solo quieres traducir los textos, consulta primero la opción «language».)</span>',
    ],
    s5: [
      'Si dominas los ajustes poco habituales de iCal, puedes usar «uid», «sequence», «ics-created», «ics-updated», «attendee» y «status» (tentative, confirmed, cancelled).<br />Estas opciones sobrescriben sus valores predeterminados.',
      '<strong>Estas opciones solo son compatibles con los enlaces de iCal y Apple Calendar.</strong>',
      'Para actualizar un evento existente (por ejemplo, su estado), aumenta «sequence», usa una fecha «ics-updated» más reciente, conserva «ics-created» y «uid», e indica el organizador (nombre y correo electrónico).',
      'Algunos calendarios también requieren «attendee». Si la actualización no cambia el estado a «cancelled», es obligatorio en todos los casos.<br />El attendee debe ser la persona que guarda el evento. Usa esta función solo si conoces ese dato.',
    ],
    s6: [
      'Cada botón generado recibe un ID con el patrón «atcb-btn-X», donde «X» es un número ascendente.<br />Los enlaces de calendario reciben el ID del botón más el tipo de calendario, por ejemplo «atcb-btn-5-google».',
      'Puedes reemplazar la «X» automática por un valor único mediante «identifier».<br />Esto puede ayudarte a seguir las interacciones con mayor precisión.',
      '<strong>Este ID debe ser único y no puede usarse en ningún otro elemento.</strong>',
      'Con la función personalizada <a href="#case-10">atcb_action</a>, el script puede usar primero el ID del elemento activador antes de recurrir al patrón descrito.',
    ],
    s7: ['Registramos todas las acciones que ocurren con un botón.<br />Puedes leer estos datos de dos maneras.', 'Enviamos los eventos directamente al Data Layer, que puede leer, por ejemplo, Google Tag Manager y Google Analytics.'],
    s8: ['En casos muy poco frecuentes, quizá no tengas un evento con lugar y hora concretos, sino una hora vinculada a la zona horaria de cada usuario.<br />Por ejemplo, un recordatorio para lavarse los dientes a las 8:00.', 'En esos casos, establece «timeZone» en «currentBrowser».<br />La hora del evento se ajustará automáticamente a la zona horaria de cada usuario.'],
    s9: [
      'En móviles, las aplicaciones que usan «WebView» tienen problemas con la generación y entrega dinámica de archivos .ics.<br />Por eso detectamos esos casos, copiamos la URL de datos al portapapeles y mostramos una guía breve.',
      'Es la práctica recomendada para sitios y aplicaciones web, pero quizá no para tu propia aplicación nativa o híbrida, donde controlas la configuración de WebView.',
      'Aunque la generación dinámica seguiría sin funcionar, al menos puedes entregar directamente archivos ICS externos existentes.<br />En ese caso, desactiva la solución alternativa con «bypassWebViewCheck».',
      '<strong>Asegúrate de que se cumpla lo siguiente en tu proyecto.</strong>',
      '<span class="text-sm italic">(El botón siguiente no debería funcionar en una WebView integrada como la de Instagram, pero sí en tu aplicación.)</span>',
    ],
    s10: [
      'Para quienes quieran una personalización absolutamente extrema, también ofrecemos la opción de abrir manualmente la lista de enlaces de calendario.<br />Así puedes usar cualquier elemento como botón o incluso activarlo mediante código.',
      'En teoría no necesitas un botón, aunque lo recomendamos porque mejora mucho la experiencia (por ejemplo, devuelve el foco al cerrar el modal).<br />Sin un botón, la lista aparece automáticamente como modal. Con uno, puedes elegir la lista desplegable superpuesta mediante «listStyle» (las demás opciones no se admiten con atcb_action). Se recomienda encarecidamente el estilo modal.',
      '<em>Nota: si en un dispositivo Apple solo está configurada la opción Apple o iCal, se abre una ventana intermedia antes de guardar. Así el archivo generado puede abrirse y guardarse de forma fiable. Este paso se omite cuando se proporciona un archivo ICS estático.</em>',
    ],
    import: ['Si usas el script mediante CDN, omite este paso.<br />Si usas el paquete npm, primero importa la función «atcb_action» de esta forma:'],
    trigger: ['Después debes definir la configuración y el activador.<br />Esto puede variar mucho según tu entorno; tú eres quien lo conoce.', 'En el ejemplo usamos un botón bastante sencillo para la demostración.'],
    s11: [
      'Lo primero:<br />Siempre que es posible, cargamos el script de forma asíncrona para no bloquear el renderizado.<br />El script también está dividido de forma radical: el bundle solo contiene el núcleo, el estilo predeterminado y el inglés.<br />Cada estilo adicional (unos pocos KB) y cada idioma (unos 3 KB) se carga automáticamente cuando hace falta desde el mismo lugar que el script.',
      '<strong>Normalmente no tienes que hacer nada.</strong> Pero puedes tomar el control:',
      "Para cargar todos los estilos o idiomas a la vez, usa los módulos agregados: <code>import 'add-to-calendar-button/styles/all'</code> e <code>import 'add-to-calendar-button/i18n/all'</code>.",
    ],
    s12: [
      'El botón puede renderizar una estructura base en el servidor.<br />La entrada <code>add-to-calendar-button/ssr</code> genera mediante Shadow DOM declarativo un marcador con el estilo y tamaño correctos: se pinta antes de ejecutar JavaScript y el script del cliente lo actualiza en el mismo lugar sin saltos de diseño.',
      'En la entrada del cliente, registra todos los estilos e idiomas no predeterminados antes de cargar el módulo principal:',
      'Para eventos PRO, usa la función asíncrona <code>atcb_generate_ssr_html_async</code>. Obtiene y combina la configuración alojada del <code>proKey</code> antes de renderizar la estructura. Sin <code>proKey</code>, se comporta como la función síncrona.',
      'La estructura respeta el estilo y tamaño del botón, el modo claro, los idiomas de derecha a izquierda y la etiqueta (la predeterminada traducida o tu valor «label»). Durante la primera actualización del cliente, los nodos de estilo coincidentes permanecen para evitar un fotograma sin estilos durante la hidratación.<br />Los botones de estilo fecha, RSVP en línea y resúmenes de grupo muestran esqueletos sutiles porque necesitan lógica del cliente. Todo lo demás ocurre durante la hidratación.',
      '<em>Los navegadores sin Shadow DOM declarativo simplemente ignoran la estructura y se inicializan solo en el cliente; no hace falta ningún tratamiento adicional.</em>',
    ],
  },
  labels: {
    url: 'Define el texto de una URL así: [url]https://....|Texto del enlace[/url]',
    addExample: 'El siguiente botón añade un evento mediante «REQUEST».',
    cancelExample: 'Este botón cancela el evento mediante el método «CANCEL».',
    trackingDisclaimer: 'Pruébalo interactuando con un botón de este sitio y escribiendo «dataLayer» en la consola de JavaScript.',
    trackingOne: 'Observa el atributo <code>atcb-last-event</code> que se añade a cada botón. Contiene el último evento y su activador (esquema: «EVENT:TRIGGER»; ejemplo: «openList:atcb-btn-1»).',
    trackingTwo: 'Accede al Data Layer.',
    webviewOne: 'Estás desarrollando tu propia aplicación nativa o híbrida.',
    webviewTwo: 'Abres el navegador predeterminado del dispositivo en lugar de una WebView integrada.',
    webviewThree: 'Tienes un archivo .ics específico en un servidor y puedes referenciarlo mediante «icsFile».',
    loadingOne: 'Al empaquetar, importa exactamente lo que utilizas; nunca habrá una solicitud para ello:',
    loadingTwo: 'Con la etiqueta script, los recursos se cargan desde el origen del script. Cambia la ubicación mediante <a href="{configuration}#stylesource">styleSource</a> si los alojas en otro sitio.',
    loadingThree: 'Si cambias buttonStyle en tiempo de ejecución, activa <a href="{configuration}#load-all-styles">loadAllStyles</a> para precargar todas las diferencias.',
  },
  demo: {
    name: '[Recordatorio] Probar Add to Calendar Button',
    nameDummy: 'Título',
    nameCustom1: '¡Púlsame para guardar!',
    nameCustom3: 'Plano y directo',
    nameCustom4: 'Mi evento genial',
    nameSubscription: '[Suscripción de prueba] Add to Calendar Button',
    description1: 'Descubre quizá la forma más sencilla de integrar botones Add to Calendar en tus proyectos web:[br]→ [url]https://add-to-calendar-button.com/es/|¡Haz clic aquí![/url]',
    description2: '[p][strong]Descubre[/strong] quizá la forma [u]más sencilla[/u] de integrar botones Add to Calendar en tu sitio web. 🚀[/p][p]💻 [em]Visita el sitio oficial para inspirarte:[/em][br]&rarr; [url]https://add-to-calendar-button.com/es/|¡Haz clic aquí![/url][/p]',
    description3: 'Un ejemplo bastante especial para personalizar Add to Calendar Button al máximo.[br]Más información en [url]https://add-to-calendar-button.com/es/[/url]',
    timezone: 'Europe/Madrid',
    location: 'World Wide Web',
    customOptionLabel: 'Mi etiqueta personalizada',
    customLabels: { close: 'Cerrar la lista', apple: 'Apple me sirve', google: 'Añadir a Google Calendar', outlookcom: 'Usar Outlook', yahoo: '¿Yahoo, de verdad?', ical: '¡iCal gana!' },
    add: 'Añadir el evento',
    cancel: 'Cancelar el evento',
    confirmedFile: 'Evento-confirmado',
    cancelledFile: 'Evento-cancelado',
    organizer: 'Juan Pérez|juan.perez@mail.com',
  },
};

export const getAdvancedContent = (locale: DocsLocale, examplesPath: string, configurationPath: string) => {
  const selected = locale === 'de' ? de : locale === 'fr' ? fr : locale === 'es' ? es : en;
  const replacePaths = (value: string) => value.replaceAll('{examples}', examplesPath).replaceAll('{configuration}', configurationPath);

  return {
    ...selected,
    intro: selected.intro.map(replacePaths),
    text: Object.fromEntries(Object.entries(selected.text).map(([key, values]) => [key, values.map(replacePaths)])),
    labels: Object.fromEntries(Object.entries(selected.labels).map(([key, value]) => [key, replacePaths(value)])),
  };
};
