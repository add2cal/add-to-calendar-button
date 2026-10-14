import type { DocsLocale } from '../docs-data';

export interface ExampleParagraph {
  html: string;
  muted?: boolean;
}

interface ExampleCopy {
  paragraphs: ExampleParagraph[];
  between?: ExampleParagraph[];
}

interface DemoCopy {
  name: string;
  nameSeries: string;
  subNames: string[];
  description: string;
  subDescriptions: string[];
  timeZone: string;
  location: string;
  url: string;
  customLabel: string;
  inlineLabel: string;
  doIt: string;
}

interface ExamplesCopy {
  intro: ExampleParagraph[];
  examples: ExampleCopy[];
  demo: DemoCopy;
}

const href = (locale: DocsLocale, path: string) => `${locale === 'en' ? '' : `/${locale}`}/${path}`;

export const getExamplesCopy = (locale: DocsLocale): ExamplesCopy => {
  const configuration = `${href(locale, 'configuration')}#recurrence`;
  const customLabels = `${href(locale, 'configuration')}#customlabels`;
  const advanced = href(locale, 'advanced-use');
  const advancedExample = `${advanced}#case-4`;

  return {
    en: {
      intro: [
        { html: 'The following examples are demonstrating the most interesting functionality.<br>We recommend you to play with the demo to experience all variations.' },
        { html: 'The Add to Calendar Buttons on this page share some parameters. They all have the same dates (except the dynamic one), the default style, and adapt to the lightMode of the website.', muted: true },
        { html: `For more advanced expert cases, have a look at the <a href="${advanced}">"Advanced use"</a> page.` },
      ],
      examples: [
        { paragraphs: [{ html: 'This is a more or less standard setup with all available calendar types and a time zone set.' }] },
        { paragraphs: [{ html: 'For an all-day event, you would simply leave out the time information.<br><span class="text-sm italic">You can even omit the time zone information here.</span>' }] },
        {
          paragraphs: [
            { html: 'Instead of using a fixed date, you can also go with dynamic ones.' },
            { html: 'You can use "today" to always use the respective current day.<br>Adding a number like "+7" after the date string (e.g. "2025-04-18+7") would add 7 days. In the example, we are combining this to make the event always be 2 days from today.' },
            { html: 'Btw: This example also generates online-event-rich-schema in the background, since the location is a URL.', muted: true },
          ],
        },
        {
          paragraphs: [
            {
              html: 'You can define recurring events by setting an <a class="external-link" href="https://www.rfc-editor.org/rfc/rfc5545" target="_blank" rel="noopener">RRULE</a>.<br>Mind that the rule needs to be valid (technically and logically) and that it is not supported by all calendar types - in this example, the specified Yahoo and Outlook.com (and Google, if you\'re on iOS) options won\'t show up for that reason.',
            },
          ],
          between: [{ html: `You can also specify the rule in more simple terms.<br>Check the <a href="${configuration}">"Configuration"</a> page for more details on that.` }],
        },
        {
          paragraphs: [
            { html: 'Events can also have multiple dates, which are not recurring.<br>For example a workshop consisting of 2 parts.' },
            {
              html: "You define those parts by placing them as separate objects in a dates array.<br>Individual date and time information would be required. Root values override individual ones (except for the name, if there is more than 1 date - in this case, the name will be used for the event series title).<br>Events get automatically sorted based on their startDate.<br>You can omit the starting '[' and ending ']', if necessary (e.g. when using the WordPress Shortcode).",
            },
          ],
        },
        {
          paragraphs: [
            { html: "You can customize the button's label as well as all other text labels.<br>In the example, we also set the listStyle to an overlay list, slightly reduce the size, and set a custom ics file name." },
            { html: `If you want to change other text blocks, you can do so with the "customLabels" option - check the <a href="${customLabels}">"Configuration"</a> page as well as our <a href="${advancedExample}">Advanced Example</a> for details.`, muted: true },
          ],
        },
        { paragraphs: [{ html: 'Per default, the button is a block element, which opens a dropdown on hover.<br>As an alternative, you can also make the button render inline.' }, { html: 'In this example, we also made the "listStyle" a modal, which automatically sets the click trigger.' }] },
        { paragraphs: [{ html: 'When you specify only 1 calendar type, there will be no list at all.<br>Instead, the button itself becomes the calendar link.' }] },
        { paragraphs: [{ html: 'With the option "buttonsList", you can split the button into multiple - one per calendar type.' }, { html: 'In this example, we also used the round button style and hide the button label.' }] },
      ],
      demo: {
        name: '[Reminder] Test the Add to Calendar Button',
        nameSeries: 'Event Series',
        subNames: ['Reminder 1/3 to test the Add to Calendar Button', 'Reminder 2/3 to test the Add to Calendar Button', 'Reminder 3/3 to test the Add to Calendar Button'],
        description: 'Check out the maybe easiest way to include Add to Calendar Buttons to your web projects:[br]→ [url]https://add-to-calendar-button.com/|Click here![/url]',
        subDescriptions: ['This is the first part to check the Add to Calendar Button script at [url]https://add-to-calendar-button.com/[/url]', 'This is the second part to check the Add to Calendar Button script at [url]https://add-to-calendar-button.com/[/url]', 'This is the third part to check the Add to Calendar Button script at [url]https://add-to-calendar-button.com/[/url]'],
        timeZone: 'EST',
        location: 'World Wide Web',
        url: 'https://add-to-calendar-button.com',
        customLabel: 'Hit me to save!',
        inlineLabel: 'Click me hard!',
        doIt: 'Do it',
      },
    },
    de: {
      intro: [
        { html: 'Die nachfolgenden Beispiele veranschaulichen die spannendsten Funktionalitäten.<br>Wir empfehlen mit der Demo zu experimentieren, um weitere Varianten zu erleben.' },
        { html: 'Die Add to Calendar Buttons auf dieser Seite haben ein paar Gemeinsamkeiten. Sie nutzen alle die gleichen Zeiten (außer das Dynamik-Beispiel), den Standard-Stil, und passen sich dem lightMode der Webseite an.', muted: true },
        { html: `Speziellere Beispiele und Erläuterung von komplexeren Konfigurationen findest du in der <a href="${advanced}">"Erweiterten Nutzung"</a>.` },
      ],
      examples: [
        { paragraphs: [{ html: 'Dies ist das gewöhnliche Standard-Setup mit allen verfügbaren Kalender-Links und einer definierten Zeitzone' }] },
        { paragraphs: [{ html: 'Für Ganztages-Events muss lediglich die Information über die Uhrzeit weggelassen werden.<br><span class="text-sm italic">Für derartige Events ist die Zeitzone obsolet.</span>' }] },
        {
          paragraphs: [
            { html: 'Anstelle von festen Terminen kannst du auch dynamische Werte für das Datum nutzen.' },
            { html: 'Mit dem Wort "today" wird stets der jeweils aktuelle Tag ausgewählt.<br>Füge eine Zahl, wie "+7" an das Datum (bspw. "2025-04-18+7") und es werden 7 Tage addiert. Im Beispiel kombinieren wir beides und fügen immer 2 Tage an das jeweils aktuelle Datum.' },
            { html: 'Dieses Beispiel erzeugt im Übrigen ein Online-Event im Schema.org-Kontext, da die "location" eine URL ist.', muted: true },
          ],
        },
        {
          paragraphs: [
            {
              html: 'Du kannst Wiederholungen grundsätzlich ganz einfach mit einer <a class="external-link" href="https://www.rfc-editor.org/rfc/rfc5545" target="_blank" rel="noopener">RRULE</a> definieren.<br>Beachte, dass die Regel technisch und logisch gültig sein muss und die Option nicht von allen Kalender-Typen unterstützt wird - im Beispiel tauchen die definierten Yahoo- und Outlook-Optionen (sowie Google unter iOS) aus diesem Grund nicht auf.',
            },
          ],
          between: [{ html: `Alternativ zu der RRULE kannst du aber auch die "sprechenderen" Optionen nutzen.<br>Die <a href="${configuration}">"Konfiguration"</a>-Seite hält mehr Details dazu bereit.` }],
        },
        {
          paragraphs: [
            { html: 'Events können aus mehreren Terminen bestehen, die nicht "wiederholend" sind.<br>Bspw. ein Workshop, der aus 2 Teilen besteht.' },
            {
              html: 'Du kannst diese einzelnen Teile mit dem "dates" Objekt in einem Event spezifizieren.<br>Zeit-Informationen je Sub-Event sind verpflichtend. Werte auf der Basis-Ebene überschreiben Werte in dem "dates" Objekt (außer "name", falls es mehr als 1 Termin gibt. In diesem Fall wird der Name für den Titel der Veranstaltungsreihe verwendet).<br>Sub-Events werden automatisch nach StartDate sortiert.<br>Falls nötig, kannst du die \'[\' und \']\' Zeichen aussparen (bspw. bei Nutzung des WordPress Shortcodes).',
            },
          ],
        },
        {
          paragraphs: [
            { html: 'Du kannst den Text auf dem Button sowie alle anderen Texte individuell gestalten.<br>Im Beispiel haben wir zudem den listStyle zu einer überlagernden Liste (overlay) verändert, an der Skalierung gedreht und auch der ics-Datei einen eigenen Namen gegeben.' },
            { html: `Weitere Texte können mit der "customLabels"-Option verändert werden. Die <a href="${customLabels}">"Konfiguration"</a>-Seite und unser <a href="${advancedExample}">Profi-Beispiel</a> beinhalten mehr Details.`, muted: true },
          ],
        },
        { paragraphs: [{ html: 'Standardmäßig ist der Button ein Block-Element, das bei Hover ein Dropdown öffnet.<br>Du kannst den Button alternativ aber auch inline rendern lassen.' }, { html: 'Im Beispiel haben wir zudem den "listStyle" auf "modal" gesetzt, was wiederum die Standard-Trigger-Aktion von "Hover" auf "Click" setzt.' }] },
        { paragraphs: [{ html: 'Wenn nur 1 Kalender-Typ gesetzt ist, wird keine Liste erzeugt.<br>Stattdessen wird der Button selbst ein direkter Kalender-Link.' }] },
        { paragraphs: [{ html: 'Mit der Option "buttonsList" kann der Button in mehrere aufgeteilt werden - einer je Kalender-Typ.' }, { html: 'Im Beispiel haben wir hierbei zudem den runden Button-Stil gesetzt und den Text auf dem Button deaktiviert.' }] },
      ],
      demo: {
        name: '[Reminder] Add to Calendar Button testen',
        nameSeries: 'Termin-Reihe',
        subNames: ['Reminder 1/3, den Add to Calendar Button zu testen', 'Reminder 2/3, den Add to Calendar Button zu testen', 'Reminder 3/3, den Add to Calendar Button zu testen'],
        description: 'Entdecke die wahrscheinlich einfachste Möglichkeit einen Add to Calendar Button in dein Web-Projekt zu integrieren:[br]→ [url]https://add-to-calendar-button.com/de/|Hier klicken![/url]',
        subDescriptions: [
          'Dies ist der erste Teil des Reminders den Add to Calendar Button unter [url]https://add-to-calendar-button.com/de/[/url] zu testen',
          'Dies ist der zweite Teil des Reminders den Add to Calendar Button unter [url]https://add-to-calendar-button.com/de/[/url] zu testen',
          'Dies ist der dritte Teil des Reminders den Add to Calendar Button unter [url]https://add-to-calendar-button.com/de/[/url] zu testen',
        ],
        timeZone: 'Europe/Berlin',
        location: 'World Wide Web',
        url: 'https://add-to-calendar-button.com/de/',
        customLabel: 'Speicher mich!',
        inlineLabel: 'Klick mich hart!',
        doIt: 'Tu es',
      },
    },
    fr: {
      intro: [
        { html: 'Les exemples suivants présentent les fonctionnalités les plus intéressantes.<br>Nous vous recommandons d’expérimenter avec la démo pour découvrir toutes les variantes.' },
        { html: 'Les boutons Add to Calendar de cette page partagent certains paramètres. Ils utilisent tous les mêmes dates (à l’exception de l’exemple dynamique), le style par défaut et s’adaptent au lightMode du site.', muted: true },
        { html: `Pour les cas experts plus avancés, consultez la page <a href="${advanced}">« Utilisation avancée »</a>.` },
      ],
      examples: [
        { paragraphs: [{ html: 'Il s’agit d’une configuration plus ou moins standard avec tous les types de calendriers disponibles et un fuseau horaire défini.' }] },
        { paragraphs: [{ html: 'Pour un événement sur toute la journée, il suffit d’omettre les horaires.<br><span class="text-sm italic">Vous pouvez même omettre le fuseau horaire dans ce cas.</span>' }] },
        {
          paragraphs: [
            { html: 'Au lieu d’utiliser une date fixe, vous pouvez également employer des dates dynamiques.' },
            { html: 'Utilisez « today » pour toujours sélectionner le jour courant.<br>Ajouter un nombre tel que « +7 » après la date (par ex. « 2025-04-18+7 ») ajoute 7 jours. Dans cet exemple, nous combinons les deux pour que l’événement ait toujours lieu dans 2 jours.' },
            { html: 'À noter : cet exemple génère aussi en arrière-plan les données structurées d’un événement en ligne, car le lieu est une URL.', muted: true },
          ],
        },
        {
          paragraphs: [
            {
              html: 'Vous pouvez définir des événements récurrents à l’aide d’une <a class="external-link" href="https://www.rfc-editor.org/rfc/rfc5545" target="_blank" rel="noopener">RRULE</a>.<br>La règle doit être valide techniquement et logiquement. Tous les types de calendriers ne la prennent pas en charge : les options Yahoo et Outlook.com indiquées (ainsi que Google sous iOS) n’apparaissent donc pas dans cet exemple.',
            },
          ],
          between: [{ html: `Vous pouvez aussi exprimer la règle de façon plus simple.<br>Consultez la page <a href="${configuration}">« Configuration »</a> pour plus de détails.` }],
        },
        {
          paragraphs: [
            { html: 'Un événement peut aussi comporter plusieurs dates non récurrentes.<br>Par exemple, un atelier composé de 2 parties.' },
            {
              html: 'Définissez ces parties comme des objets distincts dans un tableau dates.<br>Les dates et horaires de chaque partie sont obligatoires. Les valeurs racine remplacent les valeurs individuelles (sauf le nom lorsqu’il existe plusieurs dates : il devient alors le titre de la série).<br>Les événements sont automatiquement triés selon leur startDate.<br>Vous pouvez omettre les caractères « [ » et « ] » si nécessaire (par ex. avec le shortcode WordPress).',
            },
          ],
        },
        {
          paragraphs: [
            { html: 'Vous pouvez personnaliser le libellé du bouton ainsi que tous les autres textes.<br>Dans cet exemple, nous définissons aussi listStyle sur une liste superposée, réduisons légèrement la taille et choisissons un nom de fichier ics personnalisé.' },
            { html: `Pour modifier d’autres textes, utilisez l’option « customLabels ». Consultez la page <a href="${customLabels}">« Configuration »</a> et notre <a href="${advancedExample}">exemple avancé</a> pour plus de détails.`, muted: true },
          ],
        },
        { paragraphs: [{ html: 'Par défaut, le bouton est un élément de type bloc qui ouvre une liste au survol.<br>Vous pouvez également l’afficher en ligne.' }, { html: 'Dans cet exemple, nous avons aussi défini « listStyle » sur « modal », ce qui active automatiquement le déclenchement au clic.' }] },
        { paragraphs: [{ html: 'Si vous ne définissez qu’un seul type de calendrier, aucune liste n’est créée.<br>Le bouton devient directement le lien vers le calendrier.' }] },
        { paragraphs: [{ html: 'L’option « buttonsList » permet de séparer le bouton en plusieurs boutons, un par type de calendrier.' }, { html: 'Dans cet exemple, nous utilisons également le style rond et masquons le libellé du bouton.' }] },
      ],
      demo: {
        name: '[Rappel] Tester Add to Calendar Button',
        nameSeries: 'Série d’événements',
        subNames: ['Rappel 1/3 pour tester Add to Calendar Button', 'Rappel 2/3 pour tester Add to Calendar Button', 'Rappel 3/3 pour tester Add to Calendar Button'],
        description: 'Découvrez sans doute la façon la plus simple d’intégrer des boutons Add to Calendar à vos projets web :[br]→ [url]https://add-to-calendar-button.com/fr/|Cliquez ici ![/url]',
        subDescriptions: [
          'Première partie du rappel pour tester le script Add to Calendar Button sur [url]https://add-to-calendar-button.com/fr/[/url]',
          'Deuxième partie du rappel pour tester le script Add to Calendar Button sur [url]https://add-to-calendar-button.com/fr/[/url]',
          'Troisième partie du rappel pour tester le script Add to Calendar Button sur [url]https://add-to-calendar-button.com/fr/[/url]',
        ],
        timeZone: 'Europe/Paris',
        location: 'World Wide Web',
        url: 'https://add-to-calendar-button.com/fr/',
        customLabel: 'Enregistrez-moi !',
        inlineLabel: 'Cliquez fort !',
        doIt: 'Allez-y',
      },
    },
    es: {
      intro: [
        { html: 'Los siguientes ejemplos muestran las funcionalidades más interesantes.<br>Te recomendamos experimentar con la demo para descubrir todas las variantes.' },
        { html: 'Los botones Add to Calendar de esta página comparten algunos parámetros. Todos usan las mismas fechas (excepto el ejemplo dinámico), el estilo predeterminado y se adaptan al lightMode del sitio web.', muted: true },
        { html: `Para casos expertos más avanzados, consulta la página de <a href="${advanced}">«Uso avanzado»</a>.` },
      ],
      examples: [
        { paragraphs: [{ html: 'Esta es una configuración más o menos estándar con todos los tipos de calendario disponibles y una zona horaria definida.' }] },
        { paragraphs: [{ html: 'Para un evento de día completo, basta con omitir la información de la hora.<br><span class="text-sm italic">En este caso incluso puedes omitir la zona horaria.</span>' }] },
        {
          paragraphs: [
            { html: 'En lugar de usar una fecha fija, también puedes utilizar fechas dinámicas.' },
            { html: 'Usa «today» para seleccionar siempre el día actual.<br>Si añades un número como «+7» después de la fecha (p. ej., «2025-04-18+7»), se sumarán 7 días. En el ejemplo combinamos ambas opciones para que el evento sea siempre dentro de 2 días.' },
            { html: 'Por cierto: este ejemplo también genera en segundo plano datos enriquecidos de un evento en línea, ya que la ubicación es una URL.', muted: true },
          ],
        },
        {
          paragraphs: [{ html: 'Puedes definir eventos recurrentes mediante una <a class="external-link" href="https://www.rfc-editor.org/rfc/rfc5545" target="_blank" rel="noopener">RRULE</a>.<br>La regla debe ser válida técnica y lógicamente. No todos los calendarios la admiten, por lo que en este ejemplo no aparecen las opciones indicadas de Yahoo y Outlook.com (ni Google en iOS).' }],
          between: [{ html: `También puedes expresar la regla de una forma más sencilla.<br>Consulta la página de <a href="${configuration}">«Configuración»</a> para obtener más detalles.` }],
        },
        {
          paragraphs: [
            { html: 'Los eventos también pueden tener varias fechas que no sean recurrentes.<br>Por ejemplo, un taller compuesto por 2 partes.' },
            {
              html: 'Define esas partes como objetos independientes dentro de un array dates.<br>La fecha y la hora de cada parte son obligatorias. Los valores raíz sobrescriben los individuales (excepto el nombre cuando hay más de una fecha: en ese caso será el título de la serie).<br>Los eventos se ordenan automáticamente según su startDate.<br>Si es necesario, puedes omitir los caracteres inicial «[» y final «]» (p. ej., al usar el shortcode de WordPress).',
            },
          ],
        },
        {
          paragraphs: [
            { html: 'Puedes personalizar la etiqueta del botón y todos los demás textos.<br>En el ejemplo también establecemos listStyle como una lista superpuesta, reducimos ligeramente el tamaño y definimos un nombre personalizado para el archivo ics.' },
            { html: `Para cambiar otros textos, usa la opción «customLabels». Consulta la página de <a href="${customLabels}">«Configuración»</a> y nuestro <a href="${advancedExample}">ejemplo avanzado</a> para obtener más detalles.`, muted: true },
          ],
        },
        { paragraphs: [{ html: 'De forma predeterminada, el botón es un elemento de bloque que abre un desplegable al pasar el cursor.<br>Como alternativa, también puedes mostrarlo en línea.' }, { html: 'En este ejemplo también establecemos «listStyle» como «modal», lo que activa automáticamente el clic como disparador.' }] },
        { paragraphs: [{ html: 'Si defines un único tipo de calendario, no se creará ninguna lista.<br>El propio botón se convierte en el enlace directo al calendario.' }] },
        { paragraphs: [{ html: 'La opción «buttonsList» permite dividir el botón en varios, uno por cada tipo de calendario.' }, { html: 'En este ejemplo también usamos el estilo de botón redondo y ocultamos su etiqueta.' }] },
      ],
      demo: {
        name: '[Recordatorio] Probar Add to Calendar Button',
        nameSeries: 'Serie de eventos',
        subNames: ['Recordatorio 1/3 para probar Add to Calendar Button', 'Recordatorio 2/3 para probar Add to Calendar Button', 'Recordatorio 3/3 para probar Add to Calendar Button'],
        description: 'Descubre probablemente la forma más sencilla de incluir botones Add to Calendar en tus proyectos web:[br]→ [url]https://add-to-calendar-button.com/es/|¡Haz clic aquí![/url]',
        subDescriptions: [
          'Esta es la primera parte para probar el script Add to Calendar Button en [url]https://add-to-calendar-button.com/es/[/url]',
          'Esta es la segunda parte para probar el script Add to Calendar Button en [url]https://add-to-calendar-button.com/es/[/url]',
          'Esta es la tercera parte para probar el script Add to Calendar Button en [url]https://add-to-calendar-button.com/es/[/url]',
        ],
        timeZone: 'Europe/Madrid',
        location: 'World Wide Web',
        url: 'https://add-to-calendar-button.com/es/',
        customLabel: '¡Guárdame!',
        inlineLabel: '¡Haz clic fuerte!',
        doIt: 'Hazlo',
      },
    },
  }[locale];
};
