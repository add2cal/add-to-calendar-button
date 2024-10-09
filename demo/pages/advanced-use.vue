<script setup lang="ts">
import { atcb_action } from "add-to-calendar-button";
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';
import Interstitial from '@/components/interstitial.vue';
const LazyCodeBlock = defineAsyncComponent(() => import('@/components/codeBlock.vue'));
const { t, locale } = useI18n();

definePageMeta({
  title: 'navigation.advanced-use',
  description: 'meta.advanced-use.description',
});

const localePath = useLocalePath();

const today = new Date();
const nextDay = new Date();
nextDay.setDate(today.getDate() + 3);
const defaultDate = nextDay.getFullYear() + '-' + ('0' + (nextDay.getMonth() + 1)).slice(-2) + '-' + ('0' + nextDay.getDate()).slice(-2);
let defaultLang = (function () {
  if (locale.value != 'en') {
    return '\n  language="' + locale.value + '"';
  }
  return '';
})();
let defaultLangJS = (function () {
  if (locale.value != 'en') {
    return ',\n    language: "' + locale.value + '"';
  }
  return '';
})();
let defaultCustLabels = t('demo_data.custom_labels');

// config for atcb_action example
let config:object = {
  name: t('demo_data.name'),
  description: t('demo_data.description_alt1'),
  startDate: defaultDate,
  startTime: "10:15",
  endTime: "23:30",
  options: ["Google", "iCal"],
  timeZone: t('demo_data.default_timezone'),
  lightMode: "bodyScheme",
  language: locale.value
};

watch(locale, value => {
  if (value != 'en') {
    defaultLang = '\n  language="' + locale.value + '"';
    defaultLangJS = ',\n    language: "' + locale.value + '"';
  } else {
    defaultLang = '';
    defaultLangJS = '';
  }
  defaultCustLabels = t('demo_data.custom_labels');
  config = {
    name: t('demo_data.name'),
    description: t('demo_data.description_alt1'),
    startDate: defaultDate,
    startTime: "10:15",
    endTime: "23:30",
    options: ["Google", "iCal"],
    timeZone: t('demo_data.default_timezone'),
    lightMode: "bodyScheme",
    language: locale.value
  };
});

onMounted(() => {
  const button = document.getElementById('my-default-button');
  if (button) {
    button.addEventListener('click', () => atcb_action(config, button));
  }
});

onUnmounted(() => {
  const button = document.getElementById('my-default-button');
  if (button) {
    button.removeEventListener('click', () => atcb_action(config, button));
  }
});
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_192px]">
    <div class="pr-0 lg:pr-8 xl:pr-12 2xl:pr-20">
      <h1 class="mb-16 underline decoration-primary-light decoration-4 dark:decoration-primary-dark">
        {{ $t('navigation.advanced-use') }}
      </h1>
      <div v-if="locale=='en'">
        <p>
          On this page, we want to show you more special cases.<br />
          Additionally, you will learn how to customize even the smallest parts of the button.
        </p>
        <p class="italic">We do not recommend to use those advanced options, if you are no experienced developer, since they can be really tricky and break the usual behavior!</p>
        <p>
          Mind that if you did not check the <NuxtLink :to="localePath('examples')">"{{ $t('navigation.examples') }}"</NuxtLink> page before, you should go there first.
        </p>
      </div>
      <div v-else>
        <p>
          Auf dieser Seite zeigen wir etwas speziellere Fälle.<br />
          Darüber hinaus lernst du hier, wie du den Button in jedem noch so kleinen Detail konfigurieren kannst.
        </p>
        <p class="italic">Wenn du kein erfahrener Entwickler bist, raten wir von der Nutzung dieser Profi-Optionen explizit ab, da sie in der Umsetzung teilweise herausfordernd sein können und bei falscher Umsetzung das reguläres Verhalten der Anwendung stören!</p>
        <p>
          Sofern du die <NuxtLink :to="localePath('examples')">"{{ $t('navigation.examples') }}"</NuxtLink>-Seite noch nicht besucht hast, solltest du dies zuerst tun.
        </p>
      </div>
      <section id="case-1">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">1. {{ $t('content.advanced.1_long') }}</h2>
        <div v-if="locale=='en'">
          <h3 class="mb-3 mt-8">Built-in options</h3>
          <p>It seems obvious, but sometimes people jump directly into the ugly stuff, while there is a lot you can do with the included easy-to-use features.</p>
          <p>
            Check the <NuxtLink :to="localePath('configuration')">"{{ $t('navigation.configuration') }}"</NuxtLink> page for all available settings and functionalities.
          </p>
          <p>The following examples use some of them to showcase the variety of the included styles.</p>
        </div>
        <div v-else>
          <h3 class="mb-3 mt-8">Integrierte Optionen nutzen</h3>
          <p>Oft stürzen sich Nutzer direkt in sehr komplexe Schemata, obwohl es zahlreiche Möglichkeiten gibt, mit den inkludierten und idiotensicheren Funktionen zu arbeiten.</p>
          <p>
            Prüfe die <NuxtLink :to="localePath('configuration')">"{{ $t('navigation.configuration') }}"</NuxtLink>-Seite für alle Einstellungs-Optionen und Funktionalitäten.
          </p>
          <p>Die folgenden Beispiele illustrieren die grundsätzliche Vielfalt der inkludierten Stile und zeigen doch nur einen sehr kleinen Ausschnitt dessen.</p>
        </div>
        <div class="block w-full justify-between pt-4 md:flex">
          <div class="flex w-full flex-none justify-center p-6 pt-8 md:w-[300px]">
            <add-to-calendar-button
              :name="$t('demo_data.name')"
              :startDate="defaultDate"
              options="'Apple','Google','iCal'"
              listStyle="overlay"
              buttonStyle="round"
              hideIconButton
              hideBackground
              :label="$t('demo_data.options_label_single_dummy')"
              lightMode="bodyScheme"
              :language="locale"
              hideRichData
              hideBranding
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <LazyCodeBlock>
              <pre>
&lt;add-to-calendar-button
  name="{{ $t('demo_data.name') }}"
  startDate="{{ defaultDate }}"
  options="'Apple','Google','iCal'"
  buttonStyle="round"
  hideIconButton
  hideBackground
  label="{{ $t('demo_data.options_label_single_dummy') }}"
  lightMode="bodyScheme"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
        <div class="block w-full justify-between pt-4 md:flex">
          <div class="flex w-full flex-none justify-center p-6 pt-8 md:w-[300px]">
            <add-to-calendar-button :name="$t('demo_data.name')" :startDate="defaultDate" options="'Apple','Google','iCal'" buttonStyle="flat" hideIconList buttonsList hideBackground :label="$t('demo_data.name_custom_3')" lightMode="bodyScheme" :language="locale"></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <LazyCodeBlock>
              <pre>
&lt;add-to-calendar-button
  name="{{ $t('demo_data.name') }}"
  startDate="{{ defaultDate }}"
  options="'Apple','Google','iCal'"
  buttonStyle="flat"
  hideIconList
  buttonsList
  hideBackground
  label="{{ $t('demo_data.name_custom_3') }}"
  lightMode="bodyScheme"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
        <div class="block w-full justify-between pt-4 md:flex">
          <div class="flex w-full flex-none justify-center p-6 pt-8 md:w-[300px]">
            <add-to-calendar-button
              :name="$t('demo_data.name_custom_4')"
              :startDate="defaultDate"
              options="'Apple','Google','iCal'"
              startTime="10:10"
              endTime="10:40"
              :timeZone="$t('demo_data.default_timezone')"
              location="Fantasy Marketplace"
              buttonStyle="date"
              size="5"
              lightMode="bodyScheme"
              :language="locale"
              hideRichData
              hideBranding
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <LazyCodeBlock>
              <pre>
&lt;add-to-calendar-button
  name="{{ $t('demo_data.name_custom_4') }}"
  startDate="{{ defaultDate }}"
  options="'Apple','Google','iCal'"
  startTime="10:10"
  endTime="10:40"
  timeZone="{{ $t('demo_data.default_timezone') }}"
  location="Fantasy Marketplace"
  buttonStyle="date"
  size="5"
  lightMode="bodyScheme"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
        <div v-if="locale=='en'">
          <h3 class="mb-3 mt-8">Override styles</h3>
          <p>
            Generally, it is not possible to directly override the CSS style, since the button sits in its own ShadowDOM.<br />
            What you can do, however, is overriding some CSS variables, which are bound to the host (= the <code>&lt;add-to-calendar-button&gt;</code> tag).<br />
            You can simply provide the default ones via the "styleLight" attribute and the "dark mode" overrides via an additional "styleDark" attribute.
          </p>
          <p>
            The available variables differ per selected button style. Check the respective
            <a href="https://github.com/add2cal/add-to-calendar-button/tree/main/assets/css" target="_blank" rel="noopener">css file in the repository <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-4 w-4" aria-hidden="true" /></a> (have a look at the "Global colors and shadows"
            section).
          </p>
          <p class="italic">Mind that this is not working with the "none" button style or the atcb_action approach (<NuxtLink :to="'#case-10'">see #10</NuxtLink>).</p>
        </div>
        <div v-else>
          <h3 class="mb-3 mt-8">Styles überschreiben</h3>
          <p>
            Grundsätzlich ist es nicht möglich den CSS-Style direkt zu manipulieren, da der Button in seinem eigenen "ShadowDOM" gerendert wird.<br />
            Es gibt allerdings eine kleine Hintertür, über die du einige Variablen doch überschreiben kannst.<br />
            Du kannst CSS-Variablen, die an den Host (= the <code>&lt;add-to-calendar-button&gt;</code> tag) gebunden sind.<br />
            Spezifiziere deine invididuellen Werte über das "styleLight"-Attribut für den Standard-Look und über das "styleDark"-Attribut für den Dark-Mode.
          </p>
          <p>
            Die möglichen Variablen unterscheiden sich ein wenig von Button-Theme zu Button-Themen. Wirf hierzu einen Blick in die entsprechende
            <a href="https://github.com/add2cal/add-to-calendar-button/tree/main/assets/css" target="_blank" rel="noopener">CSS-Datei im Repository <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-4 w-4" aria-hidden="true" /></a> an (du findest die möglichen Werte in der Sektion
            "Global colors and shadows").
          </p>
          <p class="italic">Beachte, dass dies nicht mit dem Button-Stil "none" oder dem atcb_action-Ansatz (<NuxtLink :to="'#case-10'">siehe #10</NuxtLink>) kompatibel ist.</p>
        </div>
        <div class="block w-full justify-between pt-4 md:flex">
          <div class="flex w-full flex-none justify-center p-6 pt-8 md:w-[300px]">
            <add-to-calendar-button
              styleLight="--btn-background: #2f4377; --btn-text: #fff; --font: Georgia, 'Times New Roman', Times, serif;"
              styleDark="--btn-background: #000;"
              :name="$t('demo_data.name')"
              :startDate="defaultDate"
              options="'Apple','Google','iCal'"
              hideIconButton
              lightMode="bodyScheme"
              :language="locale"
              hideRichData
              hideBranding
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <LazyCodeBlock>
              <pre>
&lt;add-to-calendar-button 
  styleLight="--btn-background: #2f4377; --btn-text: #fff; --font: Georgia, 'Times New Roman', Times, serif;"
  styleDark="--btn-background: #000;"
  name="{{ $t('demo_data.name') }}"
  startDate="{{ defaultDate }}"
  options="'Apple','Google','iCal'"
  hideIconButton
  lightMode="bodyScheme"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
        <div v-if="locale=='en'">
          <h3 class="mb-3 mt-8">Load an external CSS file</h3>
          <p>
            Another approach you can use, would be to load an external CSS file. Provide the file with the "customCss" option and set the button style to "custom".<br />
            This file could, of course, also be within your application, but should not be bundled with other css. Additionally, it is not allowed to use a url path with "../" syntax due to security reasons. Absolute urls would be recommended.
          </p>
          <p>
            Mind that in this case, you need to take care of all (!) elements.<br />
            It is recommended to copy a provided stylesheet <a href="https://github.com/add2cal/add-to-calendar-button/tree/main/assets/css" target="_blank" rel="noopener">from the repository <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-4 w-4" aria-hidden="true" /></a> and change
            what you want to change.
          </p>
          <p>For this approach, you also need to make sure that your system allows to load external stylesheets (e.g. no blocking Content-Security-Policy rules).</p>
          <p>In our example here, we keep it basic and only change the color again.</p>
        </div>
        <div v-else>
          <h3 class="mb-3 mt-8">Eine externe CSS-Datei laden</h3>
          <p>
            Ein weiterer möglicher Ansatz besteht darin eine externe CSS-Datei zu laden. Hierzu musst du lediglich mit der Option "customCss" auf diese Datei verweisen und den Button-Stil "custom" setzen.<br />
            Die Datei kann natürlich auf dem gleichen Server wie deine Anwendung liegen; sollte aber nicht mit anderem css verknüpft sein. Aus Sicherheitsgründen ist die Nutzung von "../" im Pfad allerdings nicht zulässig. Absolute URLs werden entsprechend empfohlen.
          </p>
          <p>
            Beachte, dass du dich um den Look aller (!) Elemente selbst kümmern musst, wenn du diesen Weg einschlägst.<br />
            Wir empfehlen eines der integrierten Stylesheets aus dem
            <a href="https://github.com/add2cal/add-to-calendar-button/tree/main/assets/css" target="_blank" rel="noopener">offiziellen Repository <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-4 w-4" aria-hidden="true" /></a> zu kopieren und zu verändern.
          </p>
          <p>Bei Nutzung externer Dateien musst du außerdem sicherstellen, dass dein System das Laden externer Stylesheets nicht blockiert (bspw. über Content-Security-Policy-Regeln)</p>
          <p>Im Beispiel halten wir das Ganze recht einfach und haben in dem externen Style lediglich die Farbe verändert.</p>
        </div>
        <div class="block w-full justify-between pt-4 md:flex">
          <div class="flex w-full flex-none justify-center p-6 pt-8 md:w-[300px]">
            <add-to-calendar-button :name="$t('demo_data.name')" :startDate="defaultDate" options="'Apple','Google','iCal'" lightMode="bodyScheme" :language="locale" customCss="https://add-to-calendar-button.com/atcb.css" buttonStyle="custom" listStyle="modal" hideRichData hideBranding>
            </add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <LazyCodeBlock>
              <pre>
&lt;add-to-calendar-button
  name="{{ $t('demo_data.name') }}"
  startDate="{{ defaultDate }}"
  options="'Apple','Google','iCal'"
  lightMode="bodyScheme"{{ defaultLang }}
  customCss="https://add-to-calendar-button.com/atcb.css"
  buttonStyle="custom"
  listStyle="modal"
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
        <div v-if="locale=='en'">
          <h3 class="mb-3 mt-8">Target elements via ::part</h3>
          <p>
            You can use the <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/::part" target="_blank" rel="noopener">css ::part selector <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-4 w-4" aria-hidden="true" /></a> to directly style pre-selected elements from your regular
            css code.<br />
            Mind that modals (and therefore also the button, when using "forceOverlay") are rendered in a new DOM element and you need to use the general selector ".add-to-calendar" or "#atcb-btn-<i>identifierOfTheButton</i>-modal-host" for this.
          </p>
          <p>The following elements are available for this approach:</p>
          <ul class="ml-6 list-disc pb-4 pt-2 text-sm">
            <li class="text-left">atcb-button-wrapper</li>
            <li class="text-left">atcb-button</li>
            <li class="text-left">atcb-button-icon</li>
            <li class="text-left">atcb-button-text</li>
            <li class="text-left">atcb-list-wrapper</li>
            <li class="text-left">atcb-list</li>
            <li class="text-left">atcb-list-item</li>
            <li class="text-left">atcb-list-item-close</li>
            <li class="text-left">atcb-list-icon</li>
            <li class="text-left">atcb-list-text</li>
            <li class="text-left">atcb-modal-box</li>
          </ul>
        </div>
        <div v-else>
          <h3 class="mb-3 mt-8">Elemente via ::part selektieren</h3>
          <p>
            Du kannst den <a href="https://developer.mozilla.org/de/docs/Web/CSS/::part" target="_blank" rel="noopener">css ::part selector <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-4 w-4" aria-hidden="true" /></a> nutzen, um vorselektierte Elemente direkt über deinen regulären
            CSS-Code zu stylen.<br />
            Beachte, dass Modals (damit auch der Button, bei Nutzung von "forceOverlay") in einem neuen DOM-Element gerendert werden und hierfür der allgemeine Selektor ".add-to-calendar" oder "#atcb-btn-<i>identifierDesButtons</i>-modal-host" genutzt werden muss.
          </p>
          <p>Nachfolgende Elemente stehen hierzu zur Verfügung:</p>
          <ul class="ml-6 list-disc pb-4 pt-2 text-sm">
            <li class="text-left">atcb-button-wrapper</li>
            <li class="text-left">atcb-button</li>
            <li class="text-left">atcb-button-icon</li>
            <li class="text-left">atcb-button-text</li>
            <li class="text-left">atcb-list-wrapper</li>
            <li class="text-left">atcb-list</li>
            <li class="text-left">atcb-list-item</li>
            <li class="text-left">atcb-list-item-close</li>
            <li class="text-left">atcb-list-icon</li>
            <li class="text-left">atcb-list-text</li>
            <li class="text-left">atcb-modal-box</li>
          </ul>
        </div>
        <div class="block w-full justify-between pt-4 md:flex">
          <div class="flex w-full flex-none justify-center p-6 pt-8 md:w-[300px]">
            <add-to-calendar-button id="css-part-example" identifier="css-part-example" :name="$t('demo_data.name')" :startDate="defaultDate" options="'Apple','Google','iCal'" lightMode="bodyScheme" :language="locale" hideRichData hideBranding> </add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <LazyCodeBlock>
              <pre>
&lt;add-to-calendar-button
  id="css-part-example"
  name="{{ $t('demo_data.name') }}"
  startDate="{{ defaultDate }}"
  options="'Apple','Google','iCal'"
  lightMode="bodyScheme"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;

&lt;style&gt;
  add-to-calendar-button#css-part-example::part(atcb-button),
  #atcb-btn-css-part-example-modal-host::part(atcb-button) {
    background-color: #264f3c;
    color: #fff;
  }
  /* or, for all buttons and modals:
  .add-to-calendar::part(atcb-button) {
    background-color: #264f3c;
    color: #fff;
  }
  */
&lt;/style&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
        <div v-if="locale=='en'">
          <h3 class="mb-3 mt-8">Use a custom object as button</h3>
          <p>
            Last but not least, you could also stick to a provided style, but use your own triggering object.<br />
            Check the <NuxtLink :to="'#case-10'">"10. Bring your own button" example</NuxtLink> at the bottom of this page for more details.
          </p>
        </div>
        <div v-else>
          <h3 class="mb-3 mt-8">Einen eigenen Button nutzen</h3>
          <p>
            Zu guter Letzt kannst du auch den Button durch dein eigenes Element ersetzen.<br />
            Dies beeinflusst zwar nicht den Stil weiterer Elemente (wie die Kalender-Link-Liste), ermöglicht es dir aber, jedes beliebige Element auf deiner Seite als Trigger zu nutzen.<br />
            Wirf einen Blick auf die Sektion <NuxtLink :to="'#case-10'">"10. Eigenen Button verknüpfen"</NuxtLink> am Ende dieser Seite.
          </p>
        </div>
      </section>
      <section id="case-2">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">2. {{ $t('content.advanced.2_long') }}</h2>
        <div v-if="locale=='en'">
          <p>
            The event description does not need to be simple plain text!<br />
            You can use HTML special characters as well as specific formatting rules.
          </p>
          <p>
            Those rules are set up as HTML pseudo tags, which get transformed automatically.<br />
            <span class="text-sm italic">(If you are using the WordPress Plugin Shortcode, ']' would break your code. Instead of [*], you could also use {*} here.)</span><br />
            <span class="text-sm italic">(Apple, Yahoo, and Microsoft Teams are not fully supported and automatically transformed to plain text, supporting only line breaks and hyperlinks.)</span>
          </p>
        </div>
        <div v-else>
          <p>
            Die Event-Beschreibung muss nicht nur simpler Plain Text sein!<br />
            Du kannst HTML Special Characters einfügen sowie bestimmte Formatierungs-Regeln nutzen.
          </p>
          <p>
            Diese Regeln setzt du über HTML-Pseudo-Tags, die am Ende automatisch in echtes HTML transformiert werden.<br />
            <span class="text-sm italic">(Wenn du den WordPress Plugin Shortcode nutzt, stört ']' den Code. In diesem Fall kannst du {*} anstelle von [*] nutzen.)</span><br />
            <span class="text-sm italic">(Apple, Yahoo und Microsoft Teams werden hierbei nicht vollständig unterstützt und der Wert automatisch zu Plain Text transformiert, womit nur Zeilenumbrüche und Links dargestellt werden.)</span>
          </p>
        </div>
        <p class="mt-6">
          <span class="font-semibold">{{ $t('content.advanced.supported_tags') }}:</span>
        </p>
        <ul class="ml-6 list-disc pb-4 pt-2 text-sm">
          <li class="text-left">[hr]</li>
          <li class="text-left">[p] ... [/p]</li>
          <li class="text-left">[br]</li>
          <li class="text-left">[strong] ... [/strong]</li>
          <li class="text-left">[u] ... [/u]</li>
          <li class="text-left">[i] ... [/i], [em] ... [/em]</li>
          <li class="text-left">[ul] ... [/ul], [ol] ... [/ol], [li] ... [/li]</li>
          <li class="text-left">[h*] ... [/h*] (&larr; h1, h2, h3, ...)</li>
          <li class="text-left">
            [url] ... [/url]<br /><span class="text-sm italic">{{ $t('content.advanced.url_link_text') }}</span>
          </li>
        </ul>
        <div class="block w-full justify-between pt-4 md:flex">
          <div class="flex w-full flex-none justify-center p-6 pt-8 md:w-[300px]">
            <add-to-calendar-button
              :name="$t('demo_data.name')"
              :startDate="defaultDate"
              startTime="10:15"
              endTime="23:30"
              :timeZone="$t('demo_data.default_timezone')"
              options="'Apple','Google','iCal','Outlook.com','Microsoft 365','Microsoft Teams','Yahoo'"
              lightMode="bodyScheme"
              :description="$t('demo_data.description_alt2')"
              :language="locale"
              hideRichData
              hideBranding
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <LazyCodeBlock>
              <pre>
&lt;add-to-calendar-button
  name="{{ $t('demo_data.name') }}"
  startDate="{{ defaultDate }}"
  startTime="10:15"
  endTime="23:30"
  timeZone="{{ $t('demo_data.default_timezone') }}"
  options="'Apple','Google','iCal','Outlook.com','Microsoft 365','Microsoft Teams','Yahoo'"
  lightMode="bodyScheme"
  description="{{ $t('demo_data.description_alt2') }}"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
      </section>
      <section id="case-3">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">3. {{ $t('content.advanced.3_long') }}</h2>
        <div v-if="locale=='en'">
          <p>You can also offer your users the option to subscribe to a calendar, instead of only saving static events.</p>
          <p>To get this to work, you would simply need to set the public address (an .ics file) of the calendar as the "icsFile" option and set the "subscribe" option to true.</p>
          <p>
            "name" is still required, but every other event parameter can be skipped in this case.<br />
            For Microsoft services, the "name" will be used as name for the calendar.<br />
            Mind that there won't be rich data for the subscribe option.<br />
            <span class="text-sm italic">(If the user's browser does not recognize any installed calendar app, this might lead to a blank screen. The PRO version mitigates this with some explenatory middleware screen.)</span>
            <span class="block text-sm font-semibold italic text-red-500">(The Google Calendar App currently also has issues with this type. The PRO version mitigates this as well!)</span>
          </p>
        </div>
        <div v-else>
          <p>Du kannst deinen Nutzern auch die Möglichkeit bieten, einen Kalender zu abonnieren - anstelle davon einen statischen Termin zu speichern.</p>
          <p>Damit dies funktioniert, benötigst du einen öffentlich zugänglichen Kalender (.ics-Datei), dessen Adresse du über die "icsFile"-Option definierst. Setze nun noch die Option "subscribe" und du bist schon fertig.</p>
          <p>
            "name" ist weiterhin eine verpflichtende Angabe. Alle weiteren Parameter sind in diesem Fall aber optional.<br />
            Bei Microsoft-Diensten wird der "name" als Name für den geteilten Kalender genutzt.<br />
            Beachte, dass es für den Abonnement-Modus keine Rich-Data-Generierung gibt.<br />
            <span class="text-sm italic">(Sollte der Browser des Nutzers keine installierte Kalender-App erkennen, kann dies zu einer leeren Seite führen. Die PRO-Version optimiert dies mit einem erklärenden Zwischenbildschirm.)</span>
            <span class="block text-sm font-semibold italic text-red-500">(Die Google Kalendar-App hat aktuell auch Probleme mit diesem Prozess. Die PRO-Version optimiert auch das!)</span>
          </p>
        </div>
        <div class="block w-full justify-between pt-4 md:flex">
          <div class="flex w-full flex-none justify-center p-6 pt-8 md:w-[300px]">
            <add-to-calendar-button
              :name="$t('demo_data.name_subscription')"
              subscribe
              icsFile="https://add2cal.github.io/ics-demo/demo-calendar.ics"
              options="'Apple','Google','iCal','Outlook.com','Microsoft 365','Microsoft Teams','Yahoo'"
              lightMode="bodyScheme"
              :language="locale"
              hideRichData
              hideBranding
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <LazyCodeBlock>
              <pre>
&lt;add-to-calendar-button
  name="{{ $t('demo_data.name_subscription') }}"
  subscribe
  icsFile="https://add2cal.github.io/ics-demo/demo-calendar.ics"
  options="'Apple','Google','iCal','Outlook.com','Microsoft 365','Microsoft Teams','Yahoo'"
  lightMode="bodyScheme"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
      </section>
      <section id="case-4">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">4. {{ $t('content.advanced.4_long') }}</h2>
        <div v-if="locale=='en'">
          <p>You can change any text blocks.</p>
          <p>For the button label you can simply specify the "label" option.</p>
          <p>
            For all other text blocks (like the "Close" at the modal list type), you can specify the "customLabels" option.<br />
            There, you need to specify a JSON structure and define any text you want to override.<br />
            Check the <a href="https://github.com/add2cal/add-to-calendar-button/blob/main/src/atcb-i18n.js" target="_blank" rel="noopener">atcb-i18n.js <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-4 w-4" aria-hidden="true" /></a> file at the repository for the available
            keys/options.<br />
            Any custom label will also override any translation.
          </p>
          <p class="text-sm italic">(In case you are only looking for translating labels, check the "language" option instead!)</p>
        </div>
        <div v-else>
          <p>Du kannst grundsätzlich jeden Text-Block anpassen.</p>
          <p>Für den Text auf dem Button kannst du hierzu ganz einfach die "label"-Option nutzen.</p>
          <p>
            Für alle anderen Text-Blöcke (bspw. "Schließen" im Modal-Listen-Typ) kannst du die Option "customLabels" nutzen.<br />
            Hierbei musst du eine JSON-Struktur spezifizieren, die den jeweiligen Text zu dem zu ändernden Text-Key definiert.<br />
            Wirf einen Blick auf die Quellcode-Datei <a href="https://github.com/add2cal/add-to-calendar-button/blob/main/src/atcb-i18n.js" target="_blank" rel="noopener">atcb-i18n.js <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-4 w-4" aria-hidden="true" /></a> in unserem
            Repository. Sie beinhaltet alle verfügbaren Optionen (Text-Keys).<br />
            Texte werden je nach gewählter Sprache übersetzt. Ein individueller Text wird auch jede Übersetzung überschreiben.
          </p>
          <p class="text-sm italic">(Falls du Texte lediglich übersetzen möchtest, prüfe zunächst die "language"-Option!)</p>
        </div>
        <div class="block w-full justify-between pt-4 md:flex">
          <div class="flex w-full flex-none justify-center p-6 pt-8 md:w-[300px]">
            <add-to-calendar-button
              :name="$t('demo_data.name')"
              :startDate="defaultDate"
              startTime="10:15"
              endTime="23:30"
              :label="$t('demo_data.name_custom_1')"
              options="'Apple','Google','iCal','Outlook.com','Yahoo'"
              listStyle="modal"
              :customLabels="defaultCustLabels"
              lightMode="bodyScheme"
              :language="locale"
              hideRichData
              hideBranding
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <LazyCodeBlock>
              <pre>
&lt;add-to-calendar-button
  name="{{ $t('demo_data.name') }}"
  startDate="{{ defaultDate }}"
  startTime="10:15"
  endTime="23:30"
  label="{{ $t('demo_data.name_custom_1') }}"
  options="'Apple','Google','iCal','Outlook.com','Yahoo'"
  listStyle="modal"
  customLabels='{{ defaultCustLabels }}'
  lightMode="bodyScheme"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
      </section>
      <section id="case-5">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">5. {{ $t('content.advanced.5_long') }}</h2>
        <div v-if="locale=='en'">
          <p>
            If you feel confident enough to mess with the rather unusual iCal settings, you can use the options "uid", "sequence", "created", "updated", "attendee", and "status" (TENTATIVE, CONFIRMED, CANCELLED).<br />
            They basically override the respective default values.
          </p>
          <p class="font-semibold">Mind that those options are only supported by the iCal and Apple calendar links!</p>
          <p>To update an existing event (e.g. changing its status) by changing those properties, you would need to have a growing sequence number, newer "updated" date, same "created" date, the same "uid", and also the organizer field (name and email) set.</p>
          <p>
            Some calendars only work with the "attendee" to be specified as well. And if your "update" to the event is not a status change to "CANCELLED", it is mandatory in all cases!<br />
            The attendee needs to be the person saving the event. If you know this, you can make use of this functionality. If not, we would not recommend it.
          </p>
        </div>
        <div v-else>
          <p>Falls du im Umgang mit iCal-Einstellungen erfahren bist, kannst du die Optionen "uid", "sequence", "created", "updated", "attendee" und "status" (TENTATIVE, CONFIRMED, CANCELLED) manuell steuern.</p>
          <p class="font-semibold">Beachte, dass diese Optionen nur von den iCal und Apple Kalendar-Links unterstützt werden (und auch dann nicht von allen Kalender immer sauber erkannt werden)!</p>
          <p>Um ein bestehendes Event zu aktualisieren (bspw. den Status) muss die "sequence"-Nummer aufsteigen, ein jüngeres "updated"-Datum bei gleichem "created"-Datum gesetzt, die gleiche "uid" und die "organizer"-Option gegeben sein.</p>
          <p>
            Einige Kalender erfordern zudem einen "attendee". Sollte dein "Update" des Event kein Status-Wechsel auf "CANCELLED" sein, ist dieser in jedem Fall verpflichtend!<br />
            Der "attendee" muss die Person sein, die das Event bei sich speichert. Wenn du diese Information hast, kannst du die Update-Funktionalität nutzen. Ansonsten muss davon abgeraten werden.
          </p>
        </div>
        <div class="block w-full justify-between pt-4 md:flex">
          <div class="flex w-full flex-none flex-col items-center justify-start p-6 pt-8 text-center md:w-[300px]">
            <div class="mb-5 text-sm font-semibold">A. {{ $t('content.advanced.add_event_example') }}</div>
            <add-to-calendar-button
              :name="$t('demo_data.name')"
              :startDate="defaultDate"
              startTime="10:15"
              endTime="23:30"
              :timeZone="$t('demo_data.default_timezone')"
              :label="$t('demo_data.label_add')"
              :description="$t('demo_data.description_alt3')"
              options="iCal"
              :organizer="$t('demo_data.default_organizer')"
              uid="7060df05-7b3d-4baa-b215-689b85769e5b"
              sequence="1"
              created="20221201T103000Z"
              updated="20221205T154500Z"
              status="CONFIRMED"
              :iCalFileName="$t('demo_data.iCal_confirmed')"
              lightMode="bodyScheme"
              :language="locale"
              hideRichData
              hideBranding
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <LazyCodeBlock>
              <pre>
&lt;add-to-calendar-button
  name="{{ $t('demo_data.name') }}"
  startDate="{{ defaultDate }}"
  startTime="10:15"
  endTime="23:30"
  timeZone="{{ $t('demo_data.default_timezone') }}"
  label="{{ $t('demo_data.label_add') }}"
  description="{{ $t('demo_data.description_alt3') }}"
  options="iCal"
  organizer="{{ $t('demo_data.default_organizer') }}"
  uid="7060df05-7b3d-4baa-b215-689b85769e5b"
  sequence="1"
  created="20221201T103000Z"
  updated="20221205T154500Z"
  status="CONFIRMED"
  iCalFileName="{{ $t('demo_data.iCal_confirmed') }}"
  lightMode="bodyScheme"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
        <div class="block w-full justify-between pt-4 md:flex">
          <div class="flex w-full flex-none flex-col items-center justify-start p-6 pt-8 text-center md:w-[300px]">
            <div class="mb-5 text-sm font-semibold">B. {{ $t('content.advanced.remove_event_example') }}</div>
            <add-to-calendar-button
              :name="$t('demo_data.name')"
              :startDate="defaultDate"
              startTime="10:15"
              endTime="23:30"
              :timeZone="$t('demo_data.default_timezone')"
              :label="$t('demo_data.label_cancel')"
              :description="$t('demo_data.description_alt3')"
              options="iCal"
              :organizer="$t('demo_data.default_organizer')"
              uid="7060df05-7b3d-4baa-b215-689b85769e5b"
              sequence="3"
              created="20221201T103000Z"
              updated="20221218T154500Z"
              status="CANCELLED"
              :iCalFileName="$t('demo_data.iCal_cancelled')"
              lightMode="bodyScheme"
              :language="locale"
              hideRichData
              hideBranding
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <LazyCodeBlock>
              <pre>
&lt;add-to-calendar-button
  name="{{ $t('demo_data.name') }}"
  startDate="{{ defaultDate }}"
  startTime="10:15"
  endTime="23:30"
  timeZone="{{ $t('demo_data.default_timezone') }}"
  label="{{ $t('demo_data.label_cancel') }}"
  description="{{ $t('demo_data.description_alt3') }}"
  options="iCal"
  organizer="{{ $t('demo_data.default_organizer') }}"
  uid="7060df05-7b3d-4baa-b215-689b85769e5b"
  sequence="2"
  created="20221201T103000Z"
  updated="20221218T154500Z"
  status="CANCELLED"
  iCalFileName="{{ $t('demo_data.iCal_cancelled') }}"
  lightMode="bodyScheme"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
      </section>
      <Interstitial />
      <section id="case-6">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">6. {{ $t('content.advanced.6_long') }}</h2>
        <div v-if="locale=='en'">
          <p>
            A generated button gets an ID assigned. This ID follows the scheme "atcb-btn-X", where "X" will be an ascending number.<br />
            The individual calendar links then get the button ID plus the calendar type assigned - like "atcb-btn-5-google".
          </p>
          <p>
            You can override the automatically defined "X" at the button ID by defining a distinctive one with the "identifier" option.<br />
            This might help you to track any user interaction more precisely.
          </p>
          <p class="font-semibold">Mind that this ID needs to be unique and may not be used at any other element!</p>
          <p>It behaves a little different, if you are using the custom <NuxtLink :to="'#case-10'">atcb_action function</NuxtLink>, where the script might take the triggering element's id first, before falling back to the described scheme.</p>
        </div>
        <div v-else>
          <p>
            Jeder generierter Button erhält stets seine eigene unique ID. Diese wird nach dem Schema "atcb-btn-X" erzeugt, bei welchem "X" eine aufsteigende Zahl ist.<br />
            Die einzelnen Kalender-Links erhalten als ID diese Button-ID zzgl. des Kalendar-Typs - bspw. "atcb-btn-5-google".
          </p>
          <p>
            Du kannst das automatisch erzeugte "X" mit deiner eigenen ID überschreiben, indem du die Option "identifier" spezifizierst.<br />
            Dies kann bspw. für Tracking-Funktionalitäten auf deiner Webseite hilfreich sein.
          </p>
          <p class="font-semibold">Beachte, dass der Wert eindeutig sein muss und für kein weiteres Element genutzt werden darf!</p>
          <p>Bei Nutzung der <NuxtLink :to="'#case-10'">atcb_action Funktion</NuxtLink> verhält es sich minimal anders. Das Skript nutzt das genannte Schema nur, wenn das auslösende Element keine ID besitzt.</p>
        </div>
        <div class="block w-full justify-between pt-4 md:flex">
          <div class="flex w-full flex-none justify-center p-6 pt-8 md:w-[300px]">
            <add-to-calendar-button
              :name="$t('demo_data.name')"
              :startDate="defaultDate"
              startTime="10:15"
              endTime="23:30"
              :timeZone="$t('demo_data.default_timezone')"
              options="'Apple','Google','iCal','Outlook.com','Microsoft 365','Microsoft Teams','Yahoo'"
              identifier="my-custom-id"
              lightMode="bodyScheme"
              :language="locale"
              hideRichData
              hideBranding
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <LazyCodeBlock>
              <pre>
&lt;add-to-calendar-button
  name="{{ $t('demo_data.name') }}"
  startDate="{{ defaultDate }}"
  startTime="10:15"
  endTime="23:30"
  timeZone="{{ $t('demo_data.default_timezone') }}"
  options="'Apple','Google','iCal','Outlook.com','Microsoft 365','Microsoft Teams','Yahoo'"
  identifier="my-custom-id"
  lightMode="bodyScheme"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
      </section>
      <section id="case-7">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">7. {{ $t('content.advanced.7_long') }}</h2>
        <div v-if="locale=='en'">
          <p>
            We keep track of any action happening with a button.<br />
            You can read this data in 2 ways.
          </p>
          <ol class="ml-6 list-decimal py-3">
            <li class="text-left">Observe the <code>atcb-last-event</code> attribute, which gets added to every button. It holds the last event and respective trigger (schema: "EVENT:TRIGGER"; example: "openList:atcb-btn-1").</li>
            <li class="pt-2 text-left">Access the Data Layer.</li>
          </ol>
          <p>We are pushing the events directly into the Data Layer, which can be read, for example, with the Google Tag Manager and Google Analytics.</p>
        </div>
        <div v-else>
          <p>
            Wir tracken jede Aktion auf dem Button für dich.<br />
            Die Daten kannst du auf 2 Arten auslesen.
          </p>
          <ol class="ml-6 list-decimal py-3">
            <li class="text-left">Tracke selbst das <code>atcb-last-event</code> Attribut, welches an jedem Button erzeugt wird. Es zeigt das jeweils letzte Event zusammen mit dem jeweiligen Trigger an (Schema: "EVENT:TRIGGER"; Beispiel: "openList:atcb-btn-1").</li>
            <li class="pt-2 text-left">Nutzer den Data Layer.</li>
          </ol>
          <p>Wir speichern alle Events direct im Data Layer, der wiederum bspw. vom Google Tag Manager und Google Analytics gelesen werden kann.</p>
        </div>
        <p class="mt-6 font-semibold">{{ $t('content.advanced.available_events') }}:</p>
        <ul class="ml-6 list-disc py-3 text-sm">
          <li class="text-left">initialization</li>
          <li class="text-left">openList</li>
          <li class="text-left">closeList</li>
          <li class="text-left">openCalendarLink</li>
          <li class="text-left">openSingletonLink</li>
          <li class="text-left">openSubEventLink</li>
          <li class="text-left">success</li>
        </ul>
        <p class="mt-3 text-sm italic">({{ $t('content.advanced.tracking_test_disclaimer') }})</p>
      </section>
      <section id="case-8">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">8. {{ $t('content.advanced.8_long') }}</h2>
        <div v-if="locale=='en'">
          <p>
            There are some really rare cases where you might not have an event with a specific place and time, but rather a time bound to the user's individual time zone.<br />
            For example offering an event, which should remind the users at 8am to brush their teeth.
          </p>
          <p>
            In those cases, you could set the "timeZone" option to "currentBrowser".<br />
            The event's time will then be automatically adjusted for each user based on the individual time zone.
          </p>
        </div>
        <div v-else>
          <p>
            In wenigen seltenen Fällen, in welchen du bspw. kein Event mit einem bestimmten Ort und Zeit nutzt, kann es hilfreich sein die Zeitzone dynamisch dem Ort des jeweiligen Nutzers zuzuordnen.<br />
            Bspw. ein Event, welches den Nutzer daran erinnern soll, um 8 Uhr morgens seine Zähne zu putzen - egal, wo auf der Welt er sich befindet.
          </p>
          <p>
            In diesen Fällen kannst du den Wert "currentBrowser" in der "timeZone"-Option nutzen.<br />
            Die Zeitangabe des Events wird dann automatisch an die Zeitzone des jeweiligen Nutzers angepasst.
          </p>
        </div>
        <div class="block w-full justify-between pt-4 md:flex">
          <div class="flex w-full flex-none justify-center p-6 pt-8 md:w-[300px]">
            <add-to-calendar-button
              :name="$t('demo_data.name')"
              :startDate="defaultDate"
              startTime="10:00"
              endTime="11:00"
              timeZone="currentBrowser"
              :location="$t('demo_data.location')"
              :description="$t('demo_data.description_alt1')"
              options="'Apple','Google','iCal'"
              lightMode="bodyScheme"
              :language="locale"
              hideRichData
              hideBranding
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <LazyCodeBlock>
              <pre>
&lt;add-to-calendar-button
  name="{{ $t('demo_data.name') }}"
  startDate="{{ defaultDate }}"
  startTime="10:00"
  endTime="11:00"
  timeZone="currentBrowser"
  location="{{ $t('demo_data.location') }}"
  description="{{ $t('demo_data.description_alt1') }}"
  options="'Apple','Google','iCal'"
  lightMode="bodyScheme"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
      </section>
      <section id="case-9">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">9. {{ $t('content.advanced.9_long') }}</h2>
        <div v-if="locale=='en'">
          <p>
            On mobile devices, applications, which are using the "WebView", have problems with how we generate and deliver the .ics files on the fly.<br />
            Therefore, we catch those cases, copy the data url to the user's clipboard, and show a short guide on how to proceed.
          </p>
          <p>Since this is the best practice for all websites and web apps, it might not be, if you are building your own native/hybrid app where you have control over the WebView settings.</p>
          <p>
            While this would still break the dynamic generation of the .ics file, you could at least deliver existing external ics files directly.<br />
            In this case, you could deactivate the described workaround with the "bypassWebViewCheck" option.
          </p>
          <p class="font-semibold">Please make sure that the following applys to your project!</p>
          <ul class="ml-6 list-disc py-3">
            <li class="text-left">You are developing your own native/hybrid app.</li>
            <li class="text-left">You are opening the device's default browser instead of using any in-app WebView.</li>
            <li class="text-left">You have a distinctive .ics file on some server and can refer to it via the "icsFile" option.</li>
          </ul>
          <span class="text-sm italic">(The button below should not fire within an in-app WebView like at the Instagram native app - but it would in your app.)</span>
        </div>
        <div v-else>
          <p>
            Apps auf mobilen Endgeräten, die den so genannten "WebView" nutzen, zeigen Probleme mit der Art, wie wir .ics-Dateien erzeugen und dynamisch ausliefern.<br />
            Aus diesem Grund fangen wir diese Fälle ab, kopieren stattdessen eine URL in die Zwischenablage des Nutzers und zeigen eine Anleitung an, wie das Event mit wenigen Zusatzschritten gespeichert werden kann.
          </p>
          <p>Auch wenn dies Best Practice für Webseiten und Web-Apps darstellt, kann es hinderlich sein, wenn du deine eigene native/hybride App erstellst, in welcher du selbst volle Kontrolle über die WebView-Einstellungen hast.</p>
          <p>
            Auch wenn die dynamische Erzeugung von .ics-Dateien auch in diesem Fall nicht funktionieren würde, kannst du eine statische DAtei über die "icsFile"-Option ausliefern.<br />
            In diesem Fall solltest du zusätzlich die "bypassWebViewCheck"-Option setzen, um den genannten Workaround zu deaktivieren.
          </p>
          <p class="font-semibold">Bitte stelle sicher, dass folgendes auf dein Projekt zutrifft!</p>
          <ul class="ml-6 list-disc py-3">
            <li class="text-left">Du entwickelst deine eigene native/hybride App.</li>
            <li class="text-left">Du öffnest in der App den Standard-Browser des Geräts und nutzt nicht den WebView.</li>
            <li class="text-left">Du hast eine dedizierte .ics-Datei zur Verfügung und verweist auf diese über die "icsFile"-Option.</li>
          </ul>
          <span class="text-sm italic">(Der nachfolgende Button sollte in einer in-App-WebView-Umgebung, wie der Instagram-App nicht funktionieren, wohl aber in deiner eigenen App.)</span>
        </div>
        <div class="block w-full justify-between pt-4 md:flex">
          <div class="flex w-full flex-none justify-center p-6 pt-8 md:w-[300px]">
            <add-to-calendar-button
              :name="$t('demo_data.name_dummy')"
              :startDate="defaultDate"
              startTime="10:15"
              endTime="23:30"
              options="iCal"
              icsFile="https://add-to-calendar-button.com/demo-event.ics"
              bypassWebViewCheck
              lightMode="bodyScheme"
              :language="locale"
              hideRichData
              hideBranding
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <LazyCodeBlock>
              <pre>
&lt;add-to-calendar-button
  name="{{ $t('demo_data.name_dummy') }}"
  startDate="{{ defaultDate }}"
  startTime="10:15"
  endTime="23:30"
  options="iCal"
  icsFile="https://add-to-calendar-button.com/demo-event.ics"
  bypassWebViewCheck
  lightMode="bodyScheme"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
      </section>
      <section id="case-10">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">10. {{ $t('content.advanced.10_long') }}</h2>
        <div v-if="locale=='en'">
          <p>
            For those who want to go fuc**** crazy custom, we also provide the option to trigger the calendar links list manually.<br />
            This provides you with the option to use anything as your button or even trigger it programmatically.
          </p>
          <p>
            Theoretically, you do not need to provide a button element. However, it is recommended to do so, since it will optimize the user experience a lot (like focusing the element on closing the modal, etc.).<br />
            If you do not provide a specific button, the list will automatically show as modal. If provided, you can opt for the overlay-dropdown list style via the listStyle option (mind that all other options are not supported in the atcb_action case). The modal style is strongly recommended.
          </p>
          <h3 class="mb-3 mt-8">{{ $t('content.guide.step1') }}: Import</h3>
          <p>
            If you use the script via CDN, you can skip this step.<br />
            If you use the script as npm package, you would first need to import the "atcb_action" functionality. Simply change the import statement to the following:
          </p>
        </div>
        <div v-else>
          <p>
            Für alle Entwickler, die extrem "custom" arbeiten wollen, bieten wir die Option die Kalender-Link-Liste programmatisch zu öffnen.<br />
            Dies eröffnet dir dir Möglichkeit jedes Element als Button/Trigger zu nutzen.
          </p>
          <p>
            Theoretisch muss dieses Element kein Button sein. Wir raten allerdings stark dazu, da es die User Experience wesentlich positiv beeinflusst (bspw. durch die Unterstützung von Tastatur-Navigation, etc.).<br />
            Wenn du kein Button-Element nutzt, öffnet sich die Kalendar-Liste als Modal. Gibt es ein Button-Element kannst du auch den Overlay-Dropdown-Stil über die Option listStyle wählen (beachte, dass die übrigen Optionen mit atcb_action nicht unterstützt werden). Der Modal-Stil ist der Standard
            und wird auch empfohlen.
          </p>
          <h3 class="mb-3 mt-8">{{ $t('content.guide.step1') }}: Import</h3>
          <p>
            Wenn du das Skript via CDN einbindest kannst du diesen Schritt überspringen.<br />
            Wenn du das Skript über das npm Package ntuzt, musst du zunächst die "atcb_action"-Funktion importieren. Ändere dein Import-Statement entsprechend.
          </p>
        </div>
        <LazyCodeBlock language="javascript">
          <pre>import { atcb_action } from "add-to-calendar-button";</pre>
        </LazyCodeBlock>
        <div v-if="locale=='en'">
          <h3 class="mb-3 mt-8">{{ $t('content.guide.step2') }}: Config and trigger</h3>
          <p>
            Secondly, you would need to define the config and the trigger.<br />
            This might differ a lot based on your environment. You are the expert there.
          </p>
          <p>In the example we use a quite simple button for the demonstration.</p>
        </div>
        <div v-else>
          <h3 class="mb-3 mt-8">{{ $t('content.guide.step2') }}: Config und Trigger</h3>
          <p>
            Im Anschluss musst du die Config und den Trigger der Funktion definieren.<br />
            Dies kann je nachdem wie deine Entwicklungsumgebung aussieht, sehr unterschiedlich aussehen - hier bist du der Experte.
          </p>
          <p>Im Beispiel nutzen wir einen recht einfachen Button und Prozess zu Demonstrationszwecken.</p>
        </div>
        <div class="block w-full justify-between pt-4 md:flex">
          <div class="flex w-full flex-none justify-center p-6 pt-8 md:w-[300px]">
            <button id="my-default-button" class="h-fit rounded-full border-2 border-secondary bg-secondary px-4 py-2 text-zinc-800 hover:bg-secondary-light hover:text-black hover:shadow-lg">{{ $t('labels.clickHere') }}</button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <LazyCodeBlock>
              <pre>
&lt;button id="my-default-button"&gt;{{ $t('labels.clickHere') }}&lt;/button&gt;

&lt;script type="application/javascript"&gt;
  const config = {
    name: "{{ $t('demo_data.name') }}",
    description: "{{ $t('demo_data.description_alt1') }}",
    startDate: "{{ defaultDate }}",
    startTime: "10:15",
    endTime: "23:30",
    options: ["Google", "iCal"],
    timeZone: "{{ $t('demo_data.default_timezone') }}"{{ defaultLangJS }}
  };
  const button = document.getElementById('my-default-button');
  if (button) {
    button.addEventListener('click', () => atcb_action(config, button));
  }
&lt;/script&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
      </section>
      <section id="case-11">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">11. {{ $t('content.advanced.11_long') }}</h2>
        <div v-if="locale=='en'">
          <p>
            First things first:<br />
            Wherever possible, we load the script asynchronously, so it will not block the rendering of your page.<br />
            However, if you include it as a ES module, this behavior usually changes.<br />
            Besides some JavaScript frameworks offering other tricks to load components asynchronously, you can try the following to optimize the loading behavior and bundle size.
          </p>
          <p>Unfortunately, we cannot offer any easy tree-shaking solution, as this contradicts the way we are building the script - being a flexible web component, which can adapt on runtime.</p>
          <p>
            <strong>The ES package comes in 4 flavors:</strong>
          </p>
          <ol class="ml-6 list-decimal pb-4 pt-2">
            <li class="text-left">Default: Includes everything and therefore reduces the risk of failure.</li>
            <li class="text-left">no-pro: This is basically the default, if you are not using the <a target="_blank" rel="author" href="https://add-to-calendar-pro.com">PRO version</a> of the script.</li>
            <li class="text-left">unstyle: This is the default, but without integrated css (style).</li>
            <li class="text-left">no-pro-unstyle: No integrated css, no PRO functionalities.</li>
          </ol>
          <p>
            To reduce the bundle size, you can use the unstyle version with <CodeBlock inline>import 'add-to-calendar-button/unstyle'</CodeBlock> and add the css manually to your project via the customCss option.<br />
            For the css file, you can make use of the jsDelivr CDN - find possible files at <a target="_blank" rel="noopener" href="https://www.jsdelivr.com/package/npm/add-to-calendar-button?tab=files&path=assets%2Fcss">jsdelivr</a>.<br />
            This, of course, makes changing the style more difficult and adds an additional request to the network, but would reduce the bundle size by ~ 30%.<br />
            In the end, it depends on your project and strategy, which version is the best for you.
          </p>
        </div>
        <div v-else>
          <p>
            First things first:<br />
            Woimmer möglich, laden wir das Skript asynchron, sodass es das Rendern deiner Seite nicht blockiert.<br />
            Wenn du es allerdings als ES Modul einbindest, ändert sich dieses Verhalten in der Regel.<br />
            Neben dem Umstand, dass einige JavaScript-Frameworks andere Kniffe anbieten, um Komponenten asynchron zu laden, kannst du folgendes versuchen, um das Ladeverhalten und die Bundle-Size zu optimieren.
          </p>
          <p>Leider können wir keine einfache Tree-Shaking-Lösung anbieten, da dies dem Ansatz des Skripts widerspricht - ein flexibler Web-Component, welcher sich zur Laufzeit anpassen lässt.</p>
          <p>
            <strong>Das ES-Package kommt in 4 Varianten:</strong>
          </p>
          <ol class="ml-6 list-decimal pb-4 pt-2">
            <li class="text-left">Default: Beinhaltet alles und reduziert das Risiko von Fehlfunktionen.</li>
            <li class="text-left">no-pro: Entspricht dem Default, solange du nicht die <a target="_blank" rel="author" href="https://add-to-calendar-pro.com/de">PRO version</a> nutzt.</li>
            <li class="text-left">unstyle: Entspricht dem Default, aber ohne CSS-Informationen (Style).</li>
            <li class="text-left">no-pro-unstyle: Kein integriertes css, keine PRO-Funktionalitäten.</li>
          </ol>
          <p>
            Um die Bundle-Size zu reduzieren, kannst du die unstyle Version mit <CodeBlock inline>import 'add-to-calendar-button/unstyle'</CodeBlock> nutzen und das CSS manuell über die customCss Option einbinden.<br />
            Für die CSS-Datei, kannst du das jsDelivr CDN nutzen - mögliche Dateien findest du unter <a target="_blank" rel="noopener" href="https://www.jsdelivr.com/package/npm/add-to-calendar-button?tab=files&path=assets%2Fcss">https://www.jsdelivr.com/package/npm/add-to-calendar-button</a>.<br />
            Dies macht es natürlich schwieriger das Design zur Laufzeit anzupassen und fügt eine weitere Anfrage zum Netzwerk hinzu, würde die Bundle-Size aber um ~ 30% reduzieren.<br />
            Letztendlich hängt es von deinem Projekt und deiner Strategie ab, welche Version für dich die beste ist.
          </p>
        </div>
      </section>
    </div>
    <div class="hidden border-l border-zinc-300 pl-8 text-sm dark:border-zinc-700 lg:block">
      <div class="sticky top-0 pt-4">
        <NuxtLink :to="'#case-1'" class="my-4 block">#1: {{ $t('content.advanced.1_short') }}</NuxtLink>
        <NuxtLink :to="'#case-2'" class="my-4 block">#2: {{ $t('content.advanced.2_short') }}</NuxtLink>
        <NuxtLink :to="'#case-3'" class="my-4 block">#3: {{ $t('content.advanced.3_short') }}</NuxtLink>
        <NuxtLink :to="'#case-4'" class="my-4 block">#4: {{ $t('content.advanced.4_short') }}</NuxtLink>
        <NuxtLink :to="'#case-5'" class="my-4 block">#5: {{ $t('content.advanced.5_short') }}</NuxtLink>
        <NuxtLink :to="'#case-6'" class="my-4 block">#6: {{ $t('content.advanced.6_short') }}</NuxtLink>
        <NuxtLink :to="'#case-7'" class="my-4 block">#7: {{ $t('content.advanced.7_short') }}</NuxtLink>
        <NuxtLink :to="'#case-8'" class="my-4 block">#8: {{ $t('content.advanced.8_short') }}</NuxtLink>
        <NuxtLink :to="'#case-9'" class="my-4 block">#9: {{ $t('content.advanced.9_short') }}</NuxtLink>
        <NuxtLink :to="'#case-10'" class="my-4 block">#10: {{ $t('content.advanced.10_short') }}</NuxtLink>
        <NuxtLink :to="'#case-11'" class="my-4 block">#11: {{ $t('content.advanced.11_short') }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style>
add-to-calendar-button#css-part-example::part(atcb-button),
#atcb-btn-css-part-example-modal-host::part(atcb-button) {
  background-color: #264f3c;
  color: #fff;
}
</style>
