<script setup lang="ts">
import ConfigSearch from '~~/components/controls/configSearch.vue';
import { ArrowRightIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';

const { locale } = useI18n();
const localePath = useLocalePath();

definePageMeta({
  title: 'navigation.configuration',
  description: 'meta.configuration.description',
});
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_192px]">
    <div class="pr-0 lg:pr-8 xl:pr-12 2xl:pr-20">
      <h1 class="mb-16 underline decoration-primary-light decoration-4 dark:decoration-primary-dark">
        {{ $t('navigation.configuration') }}
      </h1>
      <div v-if="locale=='en'">
        <p>The following list holds all potential attributes to set up and customize your next Add to Calendar Button.</p>
        <p class="mt-8 italic">Check the Demo to play with most of them and explore the examples pages for more extensive descriptions for specific cases.</p>
        <p class="hidden lg:block">
          To specify a boolean value within the HTML custom element, you would only add the name as attribute.<br />
          Not setting it would automatically reflect to "false". As an alternative, you could also always write it as a string like <code>attributeName="true"</code>.
        </p>
        <p class="mt-8 hidden lg:block">
          Mind that if you are using the <a href="https://github.com/add2cal/add-to-calendar-button-react" target="_blank" rel="noopener" class="whitespace-nowrap">React wrapper <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-4 w-4" aria-hidden="true" /></a>, you do not necessarily
          need to stringify any non-string value.<br />
          You could simply write something like <code>options=['Apple','Google']</code> instead of <code>options="['Apple','Google']"</code>.
        </p>
      </div>
      <div v-else>
        <p>Die nachfolgende Liste beinhaltet alle möglichen Attribute, um deinen Add to Calendar Button nach deinen Wünschen zu configurieren.</p>
        <p class="mt-8 italic">Wirf unbedingt auch einen Blick auf unsere Demo, bei welcher du mit den meisten Paramtern live herumspielen kannst - und durchstöbere die "Beispiele"-Seiten für weitere Erläuterungen und speziellere Funktionalitäten.</p>
        <p class="hidden lg:block">
          Um einen boolschen Wert in dem HTML-Element zu definieren, kannst du einfach nur den Namen als Attribute setzen.<br />
          Wenn er nicht gesetzt ist, definiert das die Option automatisch als "false". Alternativ kannst du den Wert aber auch immer vollständig als String ergänzen: <code>attributeName="true"</code>.
        </p>
        <p class="mt-8 hidden lg:block">
          Falls du den <a href="https://github.com/add2cal/add-to-calendar-button-react" target="_blank" rel="noopener" class="whitespace-nowrap">React Wrapper <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-4 w-4" aria-hidden="true" /></a> nutzt, musst du Nicht-String-Werte nicht
          zwingend zu Strings transformieren.<br />
          In diesem Fall kannst du bspw. auch einfach <code>options=['Apple','Google']</code> anstelle von <code>options="['Apple','Google']"</code> schreiben.
        </p>
      </div>

      <div class="mx-auto mt-14 block border-y border-zinc-300 px-5 pt-6 pb-7 dark:border-zinc-700 md:mx-0 lg:hidden">
        <ConfigSearch :mobile="true" label />
      </div>

      <h3 id="event-parameters" class="mt-12 pt-4">{{ $t('content.config.event_params') }}</h3>
      <div class="my-8 overflow-x-auto rounded-lg shadow-sm">
        <table>
          <thead>
            <tr>
              <th scope="col" class="p-3 font-semibold sm:px-5">
                {{ $t('content.config.name') }}<span class="block pt-1 normal-case md:hidden">({{ $t('content.config.value') }})</span>
              </th>
              <th scope="col" class="hidden p-3 font-semibold sm:px-5 md:table-cell">{{ $t('content.config.value') }}</th>
              <th scope="col" class="p-3 font-semibold sm:px-5">{{ $t('content.config.details') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr id="prokey" class="hidden">
              <th scope="row" class="text-base text-primary dark:text-primary-light">proKey</th>
              <td><em>String</em></td>
              <td v-if="locale=='en'">
                If you are using the PRO service, you can use the "proKey" attribute to connect the button to a specific event of yours.<br />
                <span class="mt-2 block font-semibold">In this case, no other parameters need to be defined in the code, since this is 100% managed at the Add to Calendar PRO admin panel.</span>
              </td>
              <td v-else>
                Wenn du unseren PRO-Servie nutzt, kannst du das "proKey"-Attribut nutzen, um den Button mit einem bestimmten Event zu verknüpfen.<br />
                <span class="mt-2 block font-semibold">In diesem Fall müssen ansonsten keine weiteren Parameter im Code definiert werden, da die weitere Verwaltung zu 100% im Add to Calendar PRO Admin-Bereich erfolgt.</span>
              </td>
            </tr>
            <tr id="options">
              <th scope="row">options</th>
              <td>
                <em>Stringified Array</em><br /><br /><span class="font-semibold text-red-700">{{ $t('content.config.required') }}</span
                ><br /><br /><span class="label block">{{ $t('content.config.options') }}:</span>Apple, Google, iCal, Microsoft365, MicrosoftTeams, Outlook.com, Yahoo
              </td>
              <td v-if="locale=='en'">
                Array of options to use in the list.<br /><br />
                You can also override the label per option here. Simply add a pipe between the option name and your label (e.g. "Google|My custom Google Label").<br />
                If you only specify 1 calendar type, the button would show the calendar's icon instead of the default one and redirect directly instead of opening a list (singleton case).<br />
                Some options might be dynamically excluded based on other settings!<br />
                "iCal" will be replaced by "Apple" on iOS devices.
              </td>
              <td v-else>
                Array an Kalender-Arten, die in der Liste erscheinen.<br /><br />
                Du kannst das Label jeweils direkt überschreiben. Füge hierzu ein Pipe-Symbol nach dem Kalender-Namen, gefolgt von deinem Label-Text ein (bspw. "Google|Mein Google-Label").<br />
                Sofern du nur 1 Option definierst wird der Button das Icon dieser Option anzeigen sowie direkt die jeweilige Kalender-Aktion auslösen und keine Auswahlliste öffnen (Singleton-Case).<br />
                Optionen können deaktiviert werden, wenn sie aufgrund anderere Einstellungen nicht unterstützt werden!<br />
                Auf iOS-Geräten wird die iCal-Option durch "Apple" ersetzt.
              </td>
            </tr>
            <tr id="name">
              <th scope="row">name</th>
              <td>
                <em>String</em><br /><br /><span class="font-semibold text-red-700">{{ $t('content.config.required') }}</span>
              </td>
              <td v-if="locale=='en'">
                The title of your event.<br /><br />
                Should be a rather short string.<br />
                In case you set the "dates" parameter (multi-date), the name is still required. It then acts as fallback and name for the event series.<br />
                In the subscription case, the name would be used as calendar name for Microsoft services.
              </td>
              <td v-else>
                Der Titel deines Events.<br /><br />
                Sollte ein eher kurzer String sein.<br />
                Auch Pflicht, sofern du die "dates"-Option nutzt (Multi-Date). In diesem Fall dient der Wert als Fallback und Name für die Termin-Reihe.<br />
                Bei Nutzung der Kalender-Abonnement-Funktion wird der Wert für die Microsoft-Services zudem als Kalendar-Name genutzt.
              </td>
            </tr>
            <tr id="description">
              <th scope="row">description</th>
              <td><em>String</em></td>
              <td v-if="locale=='en'">
                Supports HTML pseudo tags for formatting: [url], [br], [hr], [p], [strong], [u], [i], [em], [li], [ul], [ol], [h*] (like h1, h2, h3, ...).<br />
                Define a link text with the following schema: [url]https://....|URL Text[/url].<br /><br />
                (Yahoo and Microsoft Teams are not fully supported and automatically transformed to plain text.)<br /><br />
                <NuxtLink :to="{path: localePath('advanced-use'), hash: '#2'}">{{ $t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
              </td>
              <td v-else>
                Unterstützt HTML-Pseudo-Tags zur Formatierung: [url], [br], [hr], [p], [strong], [u], [i], [em], [li], [ul], [ol], [h*] (wie etwa h1, h2, h3, ...).<br />
                Einen Link-Text spezifizierst du mit folgendem Schema: [url]https://....|URL Text[/url].<br /><br />
                (Yahoo und Microsoft Teams werden hierbei nicht vollständig unterstützt und der Wert automatisch zu Plain Text transformiert.)<br /><br />
                <NuxtLink :to="{path: localePath('advanced-use'), hash: '#2'}">{{ $t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
              </td>
            </tr>
            <tr id="startdate">
              <th scope="row">startDate</th>
              <td>
                <em>String</em><br /><br /><span class="font-semibold">{{ $t('content.config.required_alt1') }}</span
                ><br /><br /><span class="format">YYYY-MM-DD</span>
              </td>
              <td v-if="locale=='en'">
                A date needs to be formatted as YYYY-MM-DD as specified with
                <a href="https://en.wikipedia.org/wiki/ISO_8601" target="_blank" rel="noopener" class="whitespace-nowrap">ISO-8601 <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a>.<br /><br />
                You can use the magic word "today" to dynamically set the current day. Adding "+5" at the end would automatically add 5 days to the calculated date.<br /><br />
                <NuxtLink :to="{path: localePath('examples'), hash: '#3'}">{{ $t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
              </td>
              <td v-else>
                Ein Datum muss im Schema YYYY-MM-DD gemäß <a href="https://de.wikipedia.org/wiki/ISO_8601" target="_blank" rel="noopener" class="whitespace-nowrap">ISO-8601 <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a> formatiert sein<br /><br />
                Du kannst das Wort "today" nutzen, um dynamisch den jeweils aktuellen Tag zu setzen. Wenn du bspw. "+5" hinzufügst, werden automatisch 5 Tage aufaddiert.<br /><br />
                <NuxtLink :to="{path: localePath('examples'), hash: '#3'}">{{ $t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
              </td>
            </tr>
            <tr id="starttime">
              <th scope="row">startTime</th>
              <td><em>String</em><br /><br /><span class="format">HH:MM</span></td>
              <td v-if="locale=='en'">If not set, the event will be defined as "all-day".</td>
              <td v-else>Sofern nicht spezifiziert, wird das Event als Ganztages-Event abgebildet.</td>
            </tr>
            <tr id="enddate">
              <th scope="row">endDate</th>
              <td><em>String</em><br /><br /><span class="format">YYYY-MM-DD</span></td>
              <td v-if="locale=='en'">
                A date needs to be formatted as YYYY-MM-DD as specified with
                <a href="https://en.wikipedia.org/wiki/ISO_8601" target="_blank" rel="noopener" class="whitespace-nowrap">ISO-8601 <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a>.<br /><br />
                If there is no endDate set, it is assumed that it is the same as startDate. You can use the magic word "today" to dynamically set the current day. Adding "+5" at the end would automatically add 5 days to the calculated date.
              </td>
              <td v-else>
                Ein Datum muss im Schema YYYY-MM-DD gemäß <a href="https://de.wikipedia.org/wiki/ISO_8601" target="_blank" rel="noopener" class="whitespace-nowrap">ISO-8601 <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a> formatiert sein<br /><br />
                Du kannst das Wort "today" nutzen, um dynamisch den jeweils aktuellen Tag zu setzen. Wenn du bspw. "+5" hinzufügst, werden automatisch 5 Tage aufaddiert.<br /><br />
              </td>
            </tr>
            <tr id="endtime">
              <th scope="row">endTime</th>
              <td><em>String</em><br /><br /><span class="format">HH:MM</span></td>
              <td v-if="locale=='en'">If not set, the event will be defined as "all-day".</td>
              <td v-else>Sofern nicht spezifiziert, wird das Event als Ganztages-Event abgebildet.</td>
            </tr>
            <tr id="timezone">
              <th scope="row">timeZone</th>
              <td>
                <em>String</em><br /><br /><span class="label">{{ $t('content.config.default') }}:</span>UTC
              </td>
              <td v-if="locale=='en'">
                It is not required, but recommended to add a time zone.<br />
                Find a list of them at <a href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones" target="_blank" rel="noopener" class="whitespace-nowrap">Wikipedia <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a>.<br /><br />
                You can use "currentBrowser" as value to dynamically use the time of the user's browser. Use this with caution, since it would mean that the time for the event will differ per user, which should not be the usual case.
                <br />
                A time zone only comes into play, when startTime and endTime are defined.
              </td>
              <td v-else>
                Kein Pflichtfeld, aber wärmstens empfohlen.<br />
                Eine Liste valider Zeitzonen findest du auf
                <a href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones" target="_blank" rel="noopener" class="whitespace-nowrap">Wikipedia <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a>.<br /><br />
                Du kannst "currentBrowser" als Wert nutzen, um dynamisch die Zeitzone des jeweiligen Nutzers (Browser) zu wählen. Nutze diese Funktion mit Vorsicht, da dies bedeutet, dass die Zeitangabe für das Event je Nutzer unterschiedlich sein kann, was meist nicht gewollt ist.<br />
                Eine Zeitzone ist nur relevant, wenn startTime und endTime spezifiziert sind.
              </td>
            </tr>
            <tr id="location">
              <th scope="row">location</th>
              <td>
                <em>String</em><br /><br /><span class="font-semibold">{{ $t('content.config.required_alt2') }}</span>
              </td>
              <td v-if="locale=='en'">Can be anything.<br /><br />If it is a URL, the event will be classified as "online event" via the schema.org declaration.</td>
              <td v-else>Kann alles mögliche sein.<br /><br />Wenn es eine URL ist, so wird das Event innerhalb der Schema.org-Daten als "Online Event" klassifiziert.</td>
            </tr>
            <tr id="status">
              <th scope="row">status</th>
              <td>
                <em>String</em><br /><br /><span class="label block">{{ $t('content.config.options') }}:</span>TENTATIVE, CONFIRMED, CANCELLED<br /><br /><span class="label">{{ $t('content.config.default') }}:</span>CONFIRMED
              </td>
              <td v-if="locale=='en'">
                Can be used to manage changes of an event as it is specified within the iCalendar specifications
                <a href="https://www.rfc-editor.org/rfc/rfc5545#section-3.8.1.11" target="_blank" rel="noopener" class="whitespace-nowrap">RFC5545 <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a>.<br /><br />
                <NuxtLink :to="{path: localePath('advanced-use'), hash: '#5'}">{{ $t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
              </td>
              <td v-else>
                Kann genutzt werden, um Änderungen an einem Event zu verwalten.<br />Gemäß der iCalendar-Spezifikation
                <a href="https://www.rfc-editor.org/rfc/rfc5545#section-3.8.1.11" target="_blank" rel="noopener" class="whitespace-nowrap">RFC5545 <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a>.<br /><br />
                <NuxtLink :to="{path: localePath('advanced-use'), hash: '#5'}">{{ $t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
              </td>
            </tr>
            <tr id="sequence">
              <th scope="row">sequence</th>
              <td>
                <em>Stringified bigInt</em><br /><br /><span class="label">{{ $t('content.config.default') }}:</span>0
              </td>
              <td v-if="locale=='en'">
                Needs to be a positive integer number.<br />Needs to grow when you make changes to the event.<br /><br />
                <NuxtLink :to="{path: localePath('advanced-use'), hash: '#5'}">{{ $t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
              </td>
              <td v-else>
                Muss eine positive ganze Zahl sein.<br />Muss größer werden, wenn Veränderungen am Event vorgenommen werden.<br /><br />
                <NuxtLink :to="{path: localePath('advanced-use'), hash: '#5'}">{{ $t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
              </td>
            </tr>
            <tr id="uid">
              <th scope="row">uid</th>
              <td>
                <em>String</em><br /><br /><span class="format">XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX</span><br /><br /><span class="label">{{ $t('content.config.default') }}:</span>{{ $t('content.config.random_val') }}
              </td>
              <td v-if="locale=='en'">
                The unique ID of the event as it is used within the iCal file.<br /><br />
                May only contain alpha, digits, and dashes; and be less than 255 characters.<br />
                A hex-encoded random Universally Unique Identifier (UUID) is recommended.
              </td>
              <td v-else>
                Die einzigartige ID eines Events, wie sie für iCal-Dateien genutzt wird.<br /><br />
                Darf nur Buchstaben, Ziffern und Bindestriche enthalten; kleiner 255 Zeichen gesamt.<br />
                Ein Hex-kodierter zufälliger "Universally Unique Identifier" (UUID) wird empfohlen.
              </td>
            </tr>
            <tr id="organizer">
              <th scope="row">organizer</th>
              <td>
                <em>String</em><br /><br /><span class="format">{{ $t('content.config.organizer_default') }}</span>
              </td>
              <td v-if="locale=='en'">
                Use the schema "NAME|EMAIL" (e.g. "John Doe|john.doe@gmail.com").<br /><br />
                The organizer will appear within the schema.org rich data as well as the iCal file.<br />
                Setting this option will also change the style of the iCal information from being an event to simply save to an event invitation one can accept or decline.<br /><br />
                <NuxtLink :to="{path: localePath('advanced-use'), hash: '#5'}">{{ $t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
              </td>
              <td v-else>
                Schema "NAME|E-MAIL" (bspw. "Max Muster|max.muster@gmail.com").<br /><br />
                Der "Organizer" wird innerhalb der Schema.org-Daten sowie in iCal-Dateien integriert.<br />
                Sofern diese Option gesetzt wird, verändert sich auch die iCal-Struktur. Anstelle eines einfachen Events wird eine Event-Einladung, der man zu- oder absagen kann, erzeugt.<br /><br />
                <NuxtLink :to="{path: localePath('advanced-use'), hash: '#5'}">{{ $t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
              </td>
            </tr>
            <tr id="dates">
              <th scope="row">dates</th>
              <td><em>Stringified Object</em></td>
              <td v-if="locale=='en'">
                If you want to define an event series, you can use the dates object.<br /><br />
                It basically holds the same information as the top level, but enables you to define multiple events. Except for date and time information, all other attributes, if not provided in the dates object, use the top level information as fallback. There is one special case with the "UID",
                which only uses the top level information for the first sub-event (since it needs to be unique). All subsequent sub-events will receive randomly generated new UIDs.<br /><br />
                <span class="underline">Attributes per sub-event block:</span><br />
                <ul class="list-disc pt-2 pl-5">
                  <li>name</li>
                  <li>description</li>
                  <li>startDate</li>
                  <li>startTime</li>
                  <li>endDate</li>
                  <li>endTime</li>
                  <li>timeZone</li>
                  <li>location</li>
                  <li>status</li>
                  <li>sequence</li>
                  <li>uid</li>
                  <li>organizer</li>
                </ul>
                <br /><br />
                <NuxtLink :to="{path: localePath('examples'), hash: '#5'}">{{ $t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
              </td>
              <td v-else>
                Mit dem "dates"-Objekt kannst du eine Termin-Reihe spezifizieren.<br /><br />
                Es beinhaltet im Grunde die gleichen Parameter wie die Haupt-Ebene, bietet aber die Möglichkeit mehrere Events zu definieren. Abgesehen von Datums- und Zeitangaben wird für die möglichken Parameter stets eine Information auf der Haupt-Ebene genutzt, sofern sie innerhalb des
                "dates"-Elements fehlt. Für die "UID" geschieht dies allerdings nur für das erste Event (da die ID einzigartig sein muss). Weitere Events erhalten eine eigene, zufällig generierte ID.<br /><br />
                <span class="underline">Attribute je Sub-Event-Block:</span><br />
                <ul class="list-disc pt-2 pl-5">
                  <li>name</li>
                  <li>description</li>
                  <li>startDate</li>
                  <li>startTime</li>
                  <li>endDate</li>
                  <li>endTime</li>
                  <li>timeZone</li>
                  <li>location</li>
                  <li>status</li>
                  <li>sequence</li>
                  <li>uid</li>
                  <li>organizer</li>
                </ul>
                <br /><br />
                <NuxtLink :to="{path: localePath('examples'), hash: '#5'}">{{ $t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
              </td>
            </tr>
            <tr id="recurrence">
              <th scope="row">recurrence</th>
              <td>
                <em>String</em><br /><br /><span class="label">{{ $t('content.config.options') }}:</span><br />"RRULE:...";<br />daily, weekly, monthly, yearly
              </td>
              <td v-if="locale=='en'">
                Defines recurring events.<br /><br />
                This will deactivate the Yahoo and Microsoft options, since they do not support it at the moment (users could still use iCal in this case).<br />
                You can use any valid <a href="https://www.rfc-editor.org/rfc/rfc5545" target="_blank" rel="noopener" class="whitespace-nowrap">RRULE <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a> to define the respective rule (<a
                  href="https://icalendar.org/rrule-tool.html"
                  target="_blank"
                  rel="noopener"
                  class="whitespace-nowrap"
                  >click here for a generator <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a
                >).<br />
                Mind that the startDate needs to be valid within the given recurrence ruleset!<br /><br />
                As an alternative to the RRULE, you could also specify the following more specific reccurence settings, which will then generate the RRULE for you in the background (see next parameters).<br />
                In this case, for the "recurrence" field, you would define the frequency (daily, weekly, monthly, yearly) instead of the RRULE.<br /><br />
                <NuxtLink :to="{path: localePath('examples'), hash: '#4'}">{{ $t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
              </td>
              <td v-else>
                Definiert wiederkehrende Events.<br /><br />
                Diese Optione deaktiviert die Yahoo- und Microsoft-Kalendar-Optionen, da die Funktion dort aktuell nicht unterstützt wird (in diesen Fällen können Nutzer weiterhin auf die iCal-Datei zurückgreifen).<br />
                Du kannst jede valide <a href="https://www.rfc-editor.org/rfc/rfc5545" target="_blank" rel="noopener" class="whitespace-nowrap">RRULE <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a> nutzen, um eine entsprechende Regel anzuwenden (<a
                  href="https://icalendar.org/rrule-tool.html"
                  target="_blank"
                  rel="noopener"
                  class="whitespace-nowrap"
                  >Generator-Tool <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a
                >).<br />
                Beachte, dass das startDate ein valides Datum innerhalb des definierten Regelwerks sein muss!<br /><br />
                Alternativ zur RRULE kannst du auch die folgenden einfacheren und spezifischeren Einstellungen nutzen. Diese generieren die RRULE automatisch für dich im Hintergrund.<br />
                In diesem Fall würdest du als Wert für die "recurrence"-Option lediglich die Frequenz (täglich, wöchentlich, ...) anstelle der kompletten RRULE definieren.<br /><br />
                <NuxtLink :to="{path: localePath('examples'), hash: '#4'}">{{ $t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
              </td>
            </tr>
            <tr id="recurrence_interval">
              <th scope="row">recurrence_interval</th>
              <td>
                <em>Stringified bigInt</em><br /><br /><span class="label">{{ $t('content.config.default') }}:</span>1
              </td>
              <td v-if="locale=='en'">
                Defines the interval between iterations.<br />
                "3" would mean "every third".
              </td>
              <td v-else>
                Bestimmt den Abstand zwischen Wiederholungen.<br />
                "3" würde "jedes dritte Vorkommnis" beschreiben.
              </td>
            </tr>
            <tr id="recurrence_until">
              <th scope="row">recurrence_until</th>
              <td><em>String</em></td>
              <td v-if="locale=='en'">
                Defines an end date.<br /><br />
                <span class="text-red-700">Mind that this does not work in many applications! Rather use the count option.</span>
              </td>
              <td v-else>
                Definiert ein End-Datum.<br /><br />
                <span class="text-red-700">Beachte, dass dies von vielen Anwendungen nicht unterstützt wird! Nutze stattdessen lieber die "count"-Option.</span>
              </td>
            </tr>
            <tr id="recurrence_count">
              <th scope="row">recurrence_count</th>
              <td><em>Stringified bigInt</em></td>
              <td v-if="locale=='en'">
                Defines an upper limit of repetitions.<br />
                If recurrence_until and recurrence_count are given, whatever comes first overrides the other. If none are given, it would repeat indefinitely.
              </td>
              <td v-else>
                Definiert die maximale Anzahl an Wiederholungen.<br />
                Sofern recurrence_until und recurrence_count definiert sind, gilt, was zuerst eintritt. Sofern keiner der Werte gegeben ist, erfolgt die Wiederholung endlos.
              </td>
            </tr>
            <tr id="recurrence_byDay">
              <th scope="row">recurrence_byDay</th>
              <td><em>String</em></td>
              <td v-if="locale=='en'">
                Defines the weekdays (MO, TU, WE, TH, FR, SA, SU), where the even occurs (if, for example, it is bound to Tuesday instead of the 24th).<br />
                Requires a weekly frequency.<br />
                Can be enriched with a number to specify something like the 3rd Monday (3MO).<br />
                Can be multiple, comma separated.
              </td>
              <td v-else>
                Bestimmt die Wochentage (MO, TU, WE, TH, FR, SA, SU), an denen das Event stattfindet. Sinnvoll, sofern ein Termin an den Wochentag (bspw. Dienstag) und kein bestimmtes Datum geknüpft ist.<br />
                Erfordert eine wöchentlichen Frequenz.<br />
                Kann um Zahlen erweitert werden, um Regeln auszudrücken, wie den 3ten Montag (3MO).<br />
                Mehrere Tage möglich; durch Komma getrennt.
              </td>
            </tr>
            <tr id="recurrence_byMonthDay">
              <th scope="row">recurrence_byMonthDay</th>
              <td><em>String</em></td>
              <td v-if="locale=='en'">
                Use this instead of the "byDay" option, if you want use a numbered day (1, 2, ... 31) instead of a weekday.<br />
                Requires a monthly frequency.<br />
                Can be multiple, comma separated.
              </td>
              <td v-else>
                Nutze diese Option anstelle von "byDay", sofern du dich auf ein bestimmtes Datum (1, 2, ... 31) anstatt eines Wochentags beziehen möchtest.<br />
                Erfordert ein monatliche Frequenz.<br />
                Mehrere Werte möglich; durch Komma getrennt.
              </td>
            </tr>
            <tr id="recurrence_byMonth">
              <th scope="row">recurrence_byMonth</th>
              <td>
                <em>String</em><br /><br /><span class="label block">{{ $t('content.config.options') }}:</span>1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
              </td>
              <td v-if="locale=='en'">
                Defines the months (1, 2, 3, ... 12), where the event should happen.<br />
                Requires a yearly frequency.<br />
                Can be multiple, comma separated.
              </td>
              <td v-else>
                Beschreibt die Monate (1, 2, 3, ... 12), in denen das Event wiederholt wird.<br />
                Erfordert ein jährliche Frequenz.<br />
                Mehrere Werte möglich; durch Komma getrennt.
              </td>
            </tr>
            <tr id="recurrence_weekstart">
              <th scope="row">recurrence_weekstart</th>
              <td>
                <em>String</em><br /><br /><span class="label block">{{ $t('content.config.options') }}:</span>MO, TU, WE, TH, FR, SA, SU<br /><br /><span class="label">{{ $t('content.config.default') }}:</span>MO
              </td>
              <td v-if="locale=='en'">Specify a specific weekday as start of the week.</td>
              <td v-else>Definiert einen bestimmten Wochentag als Wochenstart.</td>
            </tr>
            <tr id="availability">
              <th scope="row">availability</th>
              <td>
                <em>String</em><br /><br /><span class="label block">{{ $t('content.config.options') }}:</span>busy, free<br /><br /><span class="label block">{{ $t('content.config.default') }}:</span>{{ $t('content.config.availability_default') }}
              </td>
              <td v-if="locale=='en'">
                Per default, the event will be marked as busy/free/available based on the user's calendar settings.<br />
                For Apple, iCal, and Google, you can force this by using the setting availability with options "busy" or "free".
              </td>
              <td v-else>
                Standardmäßig wird ein Event gemäß der Standard-Einstellung im Kalender des jeweiligen Nutzers als beschäftigt/verfügbar gespeichert.<br />
                Für Apple-, iCal- und Google-Kalender kann dieser Wert mittels dieser Option erzwungen werden.
              </td>
            </tr>
            <tr id="subscribe">
              <th scope="row">subscribe</th>
              <td>
                <em>Boolean</em><br /><br /><span class="label">{{ $t('content.config.default') }}:</span>False
              </td>
              <td v-if="locale=='en'">
                As an alternative to providing a specific predefined event, you can also host a calendar and offer it for subscription (requires a hosted calendar).<br />
                To offer the subscription via the button, you need to also specify the icsFile option.<br /><br />
                "Name" and "startDate" would be still required for organizational purposes, but every other event parameter can be skipped in the subscription case.<br />
                For Microsoft services, the "Name" will be used as name for the calendar.<br /><br />
                Microsoft Teams is not yet supported and will be automatically disabled.<br /><br />
                <NuxtLink :to="{path: localePath('advanced-use'), hash: '#3'}">{{ $t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
              </td>
              <td v-else>
                Alternativ zur Angabe eines bestimmten vordefinierten Events kannst du auch einen Kalender bereitstellen und ihn zum Abonnieren anbieten (erfordert einen gehosteten Kalender).<br />
                Um das Abonnement über den Button anzubieten, musst du zusätzlich die icsFile-Option definieren.<br /><br />
                "Name" und "startDate" wären für organisatorische Zwecke immer noch erforderlich, aber jeder andere Event-Parameter kann im Abonnementfall übersprungen werden.<br />
                Für Microsoft-Dienste wird der "Name" als Name für den Kalender verwendet.<br /><br />
                Microsoft Teams wird derzeit nicht unterstützt und automatisch deaktiviert.<br /><br />
                <NuxtLink :to="{path: localePath('advanced-use'), hash: '#3'}">{{ $t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
              </td>
            </tr>
            <tr id="icsfile">
              <th scope="row">icsFile</th>
              <td><em>String</em><br /><br /><span class="format">URL</span></td>
              <td v-if="locale=='en'">
                The iCal/ics file gets created dynamically.<br />
                This has some drawbacks as it might be blocked in some rare cases.<br />
                With this option, you can redirect to an existing ics file instead.<br /><br />
                In the subscription case, you need to define the external calendar here.
              </td>
              <td v-else>
                Die iCal/ics-Datei wir dynamisch generiert.<br />
                Dies hat den Nachteil, dass der Prozess in seltenen Fällen vom Browser des Nutzers blockiert werden kann.<br />
                Mit dieser Option kannst du stattdessen auf eine bestehende ics-Datei verweisen.<br /><br />
                Im "subscribe"-Fall muss hier der externe Kalender referenziert werden.
              </td>
            </tr>
            <tr id="icalfilename">
              <th scope="row">iCalFileName</th>
              <td>
                <em>String</em><br /><br /><span class="label block">{{ $t('content.config.default') }}:</span>event-to-save-in-my-calendar
              </td>
              <td v-if="locale=='en'">If you want to define a specific name for any generated ics file (iCal), you can specify it via the iCalFileName option.</td>
              <td v-else>Wenn du einen bestimmten Namen für die generierte ics-Datei (iCal) definieren möchten, kannst du diesen über die Option iCalFileName definieren.</td>
            </tr>
            <tr id="created">
              <th scope="row">created</th>
              <td>
                <em>String</em><br /><br /><span class="format">YYYYMMDDTHHMMSSZ</span><br /><br /><span class="label block">{{ $t('content.config.default') }}:</span>{{ $t('content.config.time_val') }}
              </td>
              <td v-if="locale=='en'">
                The "Created" field in the iCal file would default to the time the file gets generated and downloaded.<br />
                Use this option, if you want to define a specific static timestamp instead.<br /><br />
                Should be a UTC timestamp like "20231201T103000Z".
              </td>
              <td v-else>
                Das "Created"-Feld in der iCal-Datei erhält grundsätzlich den Zeitpunkt, zu welchem die Datei generiert und heruntergeladen wird.<br />
                Nutze diese Option, um stattdessen einen bestimmten Timestamp zu setzen.<br /><br />
                Spezifiziere den Zeitpunkt als UTC Timestamp. Bspw. "20231201T103000Z".
              </td>
            </tr>
            <tr id="updated">
              <th scope="row">updated</th>
              <td>
                <em>String</em><br /><br /><span class="format">YYYYMMDDTHHMMSSZ</span><br /><br /><span class="label block">{{ $t('content.config.default') }}:</span>{{ $t('content.config.time_val') }}
              </td>
              <td v-if="locale=='en'">
                The "Updated" field in the iCal file would default to the time the file gets generated.<br />
                Use this option, if you want to define a specific static timestamp instead.<br /><br />
                Should be a UTC timestamp like "20231201T103000Z".
              </td>
              <td v-else>
                Das "Updated"-Feld in der iCal-Datei erhält grundsätzlich den Zeitpunkt, zu welchem die Datei generiert und heruntergeladen wird.<br />
                Nutze diese Option, um stattdessen einen bestimmten Timestamp zu setzen.<br /><br />
                Spezifiziere den Zeitpunkt als UTC Timestamp. Bspw. "20231201T103000Z".
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="style-parameters" class="mt-12 pt-4">{{ $t('content.config.style_params') }}</h3>
      <div class="my-8 overflow-x-auto rounded-lg shadow-sm">
        <table>
          <thead>
            <tr>
              <th scope="col" class="p-3 font-semibold sm:px-5">
                {{ $t('content.config.name') }}<span class="block pt-1 normal-case md:hidden">({{ $t('content.config.value') }})</span>
              </th>
              <th scope="col" class="hidden p-3 font-semibold sm:px-5 md:table-cell">{{ $t('content.config.value') }}</th>
              <th scope="col" class="p-3 font-semibold sm:px-5">{{ $t('content.config.details') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr id="buttonstyle">
              <th scope="row">buttonStyle</th>
              <td>
                <em>String</em><br /><br /><span class="label block">{{ $t('content.config.options') }}:</span>default, 3d, flat, round, neumorphism, text, date, custom, none<br /><br /><span class="label">{{ $t('content.config.default') }}:</span>default
              </td>
              <td v-if="locale=='en'">
                There are multiple integrated button styles, which also affect a lot of other parameters.<br />
                We recommend to play around with them in order to find out how they behave in detail.<br /><br />
                "none" would simply load no css style at all, while "custom" requires an external css file specified with the "customCss" option.
              </td>
              <td v-else>
                Es gibt mehrere integrierte Button-Stile (Themes), die auch einige weitere Parameter beeinflussen.<br />
                Wir empfehlen die Optionen der Reihe nach auszuprobieren, um herauszufinden, wie sie sich im Detail verhalten.<br /><br />
                "none" würde gar kein CSS laden, während "custom" eine externes CSS-Datei über die "customCss"-Option erfordert.
              </td>
            </tr>
            <tr id="inline">
              <th scope="row">inline</th>
              <td>
                <em>Boolean</em><br /><br /><span class="label">{{ $t('content.config.default') }}:</span>False
              </td>
              <td v-if="locale=='en'">
                This option would render the button inline instead of the default block style.<br /><br />
                <NuxtLink :to="{path: localePath('examples'), hash: '#7'}">{{ $t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
              </td>
              <td v-else>
                Diese Option rendert den Button inline anstelle des standardmäßigen Block-Styles.<br /><br />
                <NuxtLink :to="{path: localePath('examples'), hash: '#7'}">{{ $t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
              </td>
            </tr>
            <tr id="customcss">
              <th scope="row">customCss</th>
              <td><em>String</em><br /><br /><span class="format">URL</span></td>
              <td v-if="locale=='en'">
                You can load an external css file instead of using and customizing the integrated one.<br />
                Define the url of the file here and set the buttonStyle option to "custom".<br /><br />
                <NuxtLink :to="{path: localePath('advanced-use'), hash: '#1'}">{{ $t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
              </td>
              <td v-else>
                Du kannst eine externe CSS-DAtei anstelle der integrierten Optionen laden.<br />
                Spezifiziere die URL der Datei hier und nutze die buttonStyle-Option "custom".<br /><br />
                <NuxtLink :to="{path: localePath('advanced-use'), hash: '#1'}">{{ $t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
              </td>
            </tr>
            <tr id="buttonslist">
              <th scope="row">buttonsList</th>
              <td>
                <em>Boolean</em><br /><br /><span class="label">{{ $t('content.config.default') }}:</span>False
              </td>
              <td v-if="locale=='en'">
                Activating this option would render one button per calendar type instead of the button + list.<br /><br />
                <NuxtLink :to="{path: localePath('examples'), hash: '#9'}">{{ $t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
              </td>
              <td v-else>
                Wenn du diese Option aktivierst wird ein Button je Kalender-Typ erzeugt - anstelle eines Buttons mit entsprechender Liste.<br /><br />
                <NuxtLink :to="{path: localePath('examples'), hash: '#9'}">{{ $t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
              </td>
            </tr>
            <tr id="label">
              <th scope="row">label</th>
              <td>
                <em>String</em><br /><br /><span class="label block">{{ $t('content.config.default') }}:</span>{{ $t('content.config.default_label') }}
              </td>
              <td v-if="locale=='en'">This option overrides the text at the button.</td>
              <td v-else>Diese Option überschreibt den Text auf dem Button.</td>
            </tr>
            <tr id="trigger">
              <th scope="row">trigger</th>
              <td>
                <em>String</em><br /><br /><span class="label block">{{ $t('content.config.options') }}:</span>hover, click<br /><br /><span class="label">{{ $t('content.config.default') }}:</span>hover
              </td>
              <td v-if="locale=='en'">
                The dropdown or overlay list unfolds on hover per default in most cases.<br />
                If you want it to get triggered on click, you can specify this with this option.
              </td>
              <td v-else>
                In den meisten Fällen wird das Erscheinen der Kalendar-Link-Liste über Hover ausgelöst.<br />
                Wenn du stattdessen eine Klick-Interaktion erzwingen möchtest, kannst du dies über diese Option definieren.
              </td>
            </tr>
            <tr id="liststyle">
              <th scope="row">listStyle</th>
              <td>
                <em>String</em><br /><br /><span class="label block">{{ $t('content.config.options') }}:</span>dropdown, dropdown-static, overlay, modal<br /><br /><span class="label">{{ $t('content.config.default') }}:</span>dropdown
              </td>
              <td v-if="locale=='en'">
                The calendar link list can be rendered as dropdown, overlay, or modal.<br /><br />
                The dropdown style also considers the position of the button on the screen and shows the list automatically above or below the button. Use "dropdown-static" to always open below the button.
              </td>
              <td v-else>
                Die Kalender-Link-Liste kann als Dropdown, Overlay oder Modal dargestellt werden.<br /><br />
                Der Dropdown-Stil berücksichtigt auch die Position auf dem Bildschirm und zeigt die Liste je nach Situation über oder unter dem Button an. Nutze den Wert "dropdown-static", um sie immer unterhalb anzuzeigen.
              </td>
            </tr>
            <tr id="hidebackground">
              <th scope="row">hideBackground</th>
              <td>
                <em>Boolean</em><br /><br /><span class="label">{{ $t('content.config.default') }}:</span>False
              </td>
              <td v-if="locale=='en'">With this option, you get a fully transparent background instead of the darker blurry one.</td>
              <td v-else>Mit dieser Option wird der Hintergrund vollständig transparent erzeugt.</td>
            </tr>
            <tr id="hideiconbutton">
              <th scope="row">hideIconButton</th>
              <td>
                <em>Boolean</em><br /><br /><span class="label">{{ $t('content.config.default') }}:</span>False
              </td>
              <td v-if="locale=='en'">This option hides the icon at the button.</td>
              <td v-else>Diese Option verbirgt das Icon auf dem Button.</td>
            </tr>
            <tr id="hideiconlist">
              <th scope="row">hideIconList</th>
              <td>
                <em>Boolean</em><br /><br /><span class="label">{{ $t('content.config.default') }}:</span>False
              </td>
              <td v-if="locale=='en'">This option hides the icons at the calendar link list.</td>
              <td v-else>Diese Option verbirgt die Icons in der Kalender-Link-Liste.</td>
            </tr>
            <tr id="hideiconmodal">
              <th scope="row">hideIconModal</th>
              <td>
                <em>Boolean</em><br /><br /><span class="label">{{ $t('content.config.default') }}:</span>False
              </td>
              <td v-if="locale=='en'">This option hides the heading icon at any info modal.</td>
              <td v-else>Diese Option verbirgt das Icon in den Modal-Dialogen.</td>
            </tr>
            <tr id="hidetextlabelbutton">
              <th scope="row">hideTextLabelButton</th>
              <td>
                <em>Boolean</em><br /><br /><span class="label">{{ $t('content.config.default') }}:</span>False
              </td>
              <td v-if="locale=='en'">This option hides the text label at the button.</td>
              <td v-else>Diese Option verbirgt den Text auf dem Button.</td>
            </tr>
            <tr id="hidetextlabellist">
              <th scope="row">hideTextLabelList</th>
              <td>
                <em>Boolean</em><br /><br /><span class="label">{{ $t('content.config.default') }}:</span>False
              </td>
              <td v-if="locale=='en'">This option hides any text at the calendar link list.</td>
              <td v-else>Diese Option verbirgt die Texte in der Kalender-Link-Liste.</td>
            </tr>
            <tr id="hidecheckmark">
              <th scope="row">hideCheckmark</th>
              <td>
                <em>Boolean</em><br /><br /><span class="label">{{ $t('content.config.default') }}:</span>False
              </td>
              <td v-if="locale=='en'">
                Clicking a calendar link marks the event as "saved" by adding a checkmark icon.<br />
                This is not the case, if the button's text labels are turned off, you use the buttonsList option, or when using atcb_action.<br />
                Set this option to disable it in all other cases too.
              </td>
              <td v-else>
                Nach Klick auf einen Kalender-Link wird das Event als "gespeichert" markiert und ein Icon auf den Button gesetzt.<br />
                Dies ist nicht der Fall, wenn der Text auf dem Button verborgen wird, die buttonsList-Option gesetzt ist oder mit der atcb_action-Variante gearbeitet wird.<br />
                Nutze diese Option hier, um das Icon auch in allen anderen Fällen zu verbergen.
              </td>
            </tr>
            <tr id="size">
              <th scope="row">size</th>
              <td>
                <em>String</em><br /><br /><span class="format">X|X|X</span><br /><br /><span class="label">{{ $t('content.config.default') }}:</span>6|6|6
              </td>
              <td v-if="locale=='en'">
                Specify a number between 0 and 10 to scale the button.<br /><br />
                You can define 1 number like "5" or up to 3 values like "8|6|4", where the first one will apply to large, the second to medium, and the third to small screens.<br />
                If you provide two, it will be for large and medium+small screens.
              </td>
              <td v-else>
                Du kannst eine Zahl zwischen 0 und 10 spezifizieren, um den Button zu skalieren.<br /><br />
                Du kannst 1 Zahl (bspw. "5") oder bis zu 3 Werte (bspw. "8|6|4") definieren. Bei mehreren Werten wird der erste für große, der zweite für mittlere und der dritte für kleine Bildschirme gesetzt.<br />
                Sofern 2 Werte angegeben werden, so gilt der zweite für mittlere und kleine Bildschirme.
              </td>
            </tr>
            <tr id="lightmode">
              <th scope="row">lightMode</th>
              <td>
                <em>String</em><br /><br /><span class="label block">{{ $t('content.config.options') }}:</span>system, dark, light, bodyScheme<br /><br /><span class="label">{{ $t('content.config.default') }}:</span>light
              </td>
              <td v-if="locale=='en'">
                Each button comes with a dark and light mode.<br /><br />
                Set the option lightMode to "dark" or "light" explicitly, or use "system" to automatically adapt to the user's default setting.<br />
                You can also use "bodyScheme" to look for the class "atcb-dark" at the html or body tag and connect the button dynamically to the style of your website.
              </td>
              <td v-else>
                Jeder Button kommt mit einem Dark- und Light-Theme.<br /><br />
                Mit der Optiomn "lightMode" kann dies explizit ausgewählt werden. Du kannst auch den Wert "system" nutzen, um automatisch den Wert des Betriebssystems des Nutzers zu übernehmen.<br />
                Mit dem Wert "bodyScheme" wird automatisch nach der class "atcb-dark" im html oder body tag Ausschau gehalten - der Button lässt sich in diesem Fall dynamisch dem Stil der Webseite anpassen.
              </td>
            </tr>
            <tr id="language">
              <th scope="row">language</th>
              <td>
                <em>String</em><br /><br /><span class="label block">{{ $t('content.config.options') }}:</span>ar, cs, de, en, es, fi, fr, hi, id, it, ja, ko, nl, no, ro, pl, pt, sv, tr, vi, zh<br /><br /><span class="label">{{ $t('content.config.default') }}:</span>en
              </td>
              <td v-if="locale=='en'">
                If you want to have the text blocks in another language than English, you can use the included translations (i18n).<br /><br />
                Simply set one of the supported languages as <a href="https://www.w3schools.com/tags/ref_language_codes.asp" target="_blank" rel="noopener" class="whitespace-nowrap">ISO 639-1 code <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a>.<br />
                Also supports Right-to-Left (RTL) with Arabic.
              </td>
              <td v-else>
                Sofern du die Text-Blöcke in einer anderen Sprache als Englisch anzeigen möchtest, kannst du die inkludierten Übersetzungen nutzen (i18n).<br /><br />
                Spezifiere einfach eine der unterstützten Sprachen als
                <a href="https://www.w3schools.com/tags/ref_language_codes.asp" target="_blank" rel="noopener" class="whitespace-nowrap">ISO 639-1 code <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a>.<br />
                Für Arabisch wird zudem Rechts-nach-Links (RTL) für alle Elemente unterstützt und automatisch angewendet.
              </td>
            </tr>
            <tr id="customlabels">
              <th scope="row">customLabels</th>
              <td><em>Stringified Object</em></td>
              <td v-if="locale=='en'">
                For all text blocks, which are not already customizable via other options (like the word "Close"), you can specify the "customLabels" option.<br />
                There, you need to specify a JSON structure and define any text you want to override. Check the
                <a href="https://github.com/add2cal/add-to-calendar-button/blob/main/src/atcb-i18n.js" target="_blank" rel="noopener" class="whitespace-nowrap">atcb-i18n.js file <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a> for the available keys.
                Mind to transform those keys to lower case strings without any whitespaces!<br />
                Any custom label will also override any translation.<br />You can use the same HTML pseudo tags as with the description option here.<br /><br />
                <NuxtLink :to="{path: localePath('advanced-use'), hash: '#4'}">{{ $t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
              </td>
              <td v-else>
                Text-Blöcke, die nicht bereits durch andere Optionen bearbeitbar sind (bspw. das Wort "Schließen"), können über die Option "customLabels" verändert werden.<br />
                Hierbei muss eine JSON-Struktur mit den zu überschreibenden Texten definiert werden. Sieh dir die
                <a href="https://github.com/add2cal/add-to-calendar-button/blob/main/src/atcb-i18n.js" target="_blank" rel="noopener" class="whitespace-nowrap">atcb-i18n.js-Datei <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a> für eine Liste der
                verfügbaren Keys an. Beachte, dass die Keys hier zu Kleinbuchstaben transformiert und Leerzeichen entfernt werden müssen!<br />
                Ein so manipulierter Text überschreibt auch jegliche Übersetzung.<br />Du kannst hierbei die gleichen HTML-Pseudo-Tags nutzen, wie sie auch in der "description"-Option möglich sind.<br /><br />
                <NuxtLink :to="{path: localePath('advanced-use'), hash: '#4'}">{{ $t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="additional-parameters" class="mt-12 pt-4">{{ $t('content.config.additional_params') }}</h3>
      <div class="my-8 overflow-x-auto rounded-lg shadow-sm">
        <table>
          <thead>
            <tr>
              <th scope="col" class="p-3 font-semibold sm:px-5">
                {{ $t('content.config.name') }}<span class="block pt-1 normal-case md:hidden">({{ $t('content.config.value') }})</span>
              </th>
              <th scope="col" class="hidden p-3 font-semibold sm:px-5 md:table-cell">{{ $t('content.config.value') }}</th>
              <th scope="col" class="p-3 font-semibold sm:px-5">{{ $t('content.config.details') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr id="images">
              <th scope="row">images</th>
              <td><em>Stringified Array</em><br /><br /><span class="format">URLs</span></td>
              <td v-if="locale=='en'">
                Images are used to enrich the rich data and therefore how an event might appear, for example, at the Google search results.<br />
                It is recommended to define at least 1 image via an absolute url with at least 720px width.<br />
                Ideally, you specify 3 images with a width of 1920px each. One with an aspect ration 1x1, one with 4x3, and one with 16x9. If not set, a default fallback image will be used.
              </td>
              <td v-else>
                Bilder werden verwendet, um die Rich-Data-Angaben anzureichern und somit bspw. Rich-Snippets in den Google-Suchergebnissen zu steuern.<br />
                Es wird empfohlen, mindestens ein Bild über eine absolute URL mit einer Breite von mindestens 720px zu definieren.<br />
                Idealerweise definierst du 3 Bilder mit einer Breite von je 1920px. Eines mit einem Seitenverhältnis von 1x1, eines mit 4x3 und eines mit 16x9. Wenn nichts angegeben ist, wird ein Standard-Bild verwendet.
              </td>
            </tr>
            <tr id="hiderichdata">
              <th scope="row">hideRichData</th>
              <td>
                <em>Boolean</em><br /><br /><span class="label">{{ $t('content.config.default') }}:</span>False
              </td>
              <td v-if="locale=='en'">
                If you set at least a name, startDate, and location, the script automatically generates schema.org rich data when rendering a button.<br />
                Setting this option would disable the feature.
              </td>
              <td v-else>
                Sofern du "name", "startDate" und "location" definierst, werden beim Erstellen des Buttons automatisch Schema.org-Daten generiert.<br />
                Mit dieser Option kann dies verhindert werden.
              </td>
            </tr>
            <tr id="identifier">
              <th scope="row">identifier</th>
              <td>
                <em>String</em><br /><br /><span class="label block">{{ $t('content.config.default') }}:</span>{{ $t('content.config.number_asc') }}
              </td>
              <td v-if="locale=='en'">
                Each generated button and calendar link has a speaking ID to be used for any tracking methods.<br />
                Scheme: "atcb-btn-IDENTIFIER" or "atcb-btn-IDENTIFIER-google" (for the Google option) respectively.<br />
                The IDENTIFIER will be an ascending number, but can be overridden by providing the option "identifier" (no special characters allowed; needs to be unique).
              </td>
              <td v-else>
                Jedes generierte Button- und Kalender-Link-Element besitzt eine sprechende ID, die für Tracking-Maßnahmen genutzt werden kann.<br />
                Schema: "atcb-btn-IDENTIFIER", bzw. "atcb-btn-IDENTIFIER-google" (für die Google-Option).<br />
                Der IDENTIFIER ist im Standard eine aufsteigende Numer, kann mittels dieser Option aber überschrieben werden (keine Sonderzeichen erlaubt; muss einzigartig sein).
              </td>
            </tr>
            <tr id="bypasswebviewcheck">
              <th scope="row">bypassWebViewCheck</th>
              <td>
                <em>Boolean</em><br /><br /><span class="label">{{ $t('content.config.default') }}:</span>False
              </td>
              <td v-if="locale=='en'">
                For users loading the button on their iPhone within a WebView environment (e.g. the Instagram Browser), we are not able to directly offer the ics file for download.<br />
                Therefore, we show a small instruction note on how to do it instead.<br />
                If you are using the button in your own app, where you actively allow the download of ics files in the default browser and are also providing the file explicitely with the icsFile option, you can bypass this workaround with the option bypassWebViewCheck.
              </td>
              <td v-else>
                Für Nutzer, die den Button auf ihrem iPhone in einer WebView-Umgebung (z.B. dem Instagram Browser) laden, können wir die ics-Datei nicht direkt zum Download anbieten.<br />
                Deshalb zeigen wir in diesem Fall eine kleine Anleitung, wie man den Termin stattdessen speichern kann.<br />
                Wenn du den Button in deiner eigenen Anwendung verwendest; in der du den Download von ics-Dateien im Standardbrowser aktiv zulassen kannst und gleichzeitig die Datei explizit mit der "icsFile"-Option bereitstellst, kannst du diesen Workaround mit der Option bypassWebViewCheck
                umgehen.
              </td>
            </tr>
            <tr id="hidebranding">
              <th scope="row">hideBranding</th>
              <td>
                <em>Boolean</em><br /><br /><span class="label">{{ $t('content.config.default') }}:</span>False
              </td>
              <td v-if="locale=='en'">
                Per default, there is a slight branding.<br />
                This is a small support for this free open-source project.<br /><br />
                If you do not want to support this project, you can set this option to remove the branding and still comply with the underyling license.
              </td>
              <td v-else>
                Standardmäßig wird ein dezentes Branding integriert.<br /><br />
                Dies ist eine kleine Unterstützung für dieses kostenfreie Open-Source-Projekt.<br /><br />
                Sofern du das Projekt nicht unterstützen möchtest, kannst du mit dieser Option das Branding entfernen (im Einklang mit den Lizenzbedingungen).
              </td>
            </tr>
            <tr id="debug">
              <th scope="row">debug</th>
              <td>
                <em>Boolean</em><br /><br /><span class="label">{{ $t('content.config.default') }}:</span>False
              </td>
              <td v-if="locale=='en'">Setting this option would put any misconfiguration into the browser's JavaScript console and also render an error instead of the calendar.<br />Helpful while implementing the button for the first time.</td>
              <td v-else>
                Wenn du diese Option aktivierst, wird jede Fehlkonfiguration in der JavaScript-Konsole des Browsers angezeigt und anstelle des Kalenders eine Fehlermeldung ausgegeben.<br />
                Dies ist hilfreich, wenn der Button zum ersten Mal implementiert wird.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">
        <div class="mx-auto grid grid-cols-1 gap-12 md:grid-cols-3">
          <div class="next-group">
            <p class="next-text">{{ $t('content.config.go_play') }}</p>
            <NuxtLink :to="{path: localePath('index'), hash: '#demo'}" class="button-primary next-button">
              {{ $t('labels.startPlaying') }}
              <ArrowRightIcon class="next-icon" aria-hidden="true" />
            </NuxtLink>
          </div>
          <div class="next-group">
            <p class="next-text">{{ $t('content.config.go_examples') }}</p>
            <NuxtLink :to="localePath('examples')" class="button-secondary next-button">
              {{ $t('labels.exploreExamples') }}
              <ArrowRightIcon class="next-icon" aria-hidden="true" />
            </NuxtLink>
          </div>
          <div class="next-group">
            <p class="next-text">{{ $t('content.config.go_edge') }}</p>
            <NuxtLink :to="localePath('advanced-use')" class="button-secondary next-button">
              {{ $t('navigation.advanced-use') }}
              <ArrowRightIcon class="next-icon" aria-hidden="true" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <div class="hidden border-l border-zinc-300 pl-8 text-sm dark:border-zinc-700 lg:block">
      <div class="sticky top-0 pt-4">
        <ConfigSearch class="mb-10" />
        <NuxtLink :to="'#event-parameters'" class="side-nav">{{ $t('content.config.event_params') }}</NuxtLink>
        <NuxtLink :to="'#style-parameters'" class="side-nav">{{ $t('content.config.style_params') }}</NuxtLink>
        <NuxtLink :to="'#additional-parameters'" class="side-nav">{{ $t('content.config.additional_params') }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
table {
  @apply w-full text-left text-sm text-zinc-800 dark:text-zinc-200 table-fixed md:table-auto;
}

thead {
  @apply hidden bg-zinc-300 uppercase text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400 sm:table-header-group;
}

tbody tr {
  @apply border-b border-zinc-300 bg-zinc-50 hover:bg-white dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700;
}

tbody tr th span.label,
tbody tr td span.label {
  @apply pr-1 text-zinc-500 dark:text-zinc-400;
}

tbody tr th span.format,
tbody tr td span.format {
  @apply block pr-1 text-zinc-500 dark:text-zinc-400;
}

tbody tr th {
  @apply block p-3 pb-5 underline underline-offset-2 md:no-underline font-semibold sm:p-5 md:table-cell text-base md:text-sm;
  vertical-align: top;
}

tbody tr td {
  @apply block p-3 pt-0 sm:p-5 sm:pt-0 md:table-cell md:pt-5;
  vertical-align: top;
}

tbody tr td+td {
  @apply pt-6 sm:table-cell sm:p-5 sm:pt-5;
}

.next-group {
  @apply flex h-auto gap-4 md:h-36 flex-col justify-between;
}

.next-text {
  @apply self-center text-center;
}

.next-button {
  @apply mx-auto w-56 self-center;
}

.next-icon {
  @apply -mt-0.5 ml-2 inline-block h-4 w-4;
}

.side-nav {
  @apply block my-4;
}
</style>
