<script setup lang="ts">
import "add-to-calendar-button";
import { ArrowRightIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';
import CodeBlock from "@/components/codeBlock.vue";

const { t, locale } = useI18n();

definePageMeta({
  title: 'navigation.examples',
  description: 'meta.examples.description',
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
let defaultMultiDate = JSON.stringify([{
    "name":t('demo_data.name_sub_1'),
    "description":t('demo_data.description_sub_1'),
    "startDate":"today+3",
    "startTime":"10:15",
    "endTime":"23:30"
  },
  {
    "name":t('demo_data.name_sub_2'),
    "description":t('demo_data.description_sub_2'),
    "startDate":"today+5",
    "startTime":"11:30",
    "endTime":"20:00"
  },
  {
    "name":t('demo_data.name_sub_3'),
    "description":t('demo_data.description_sub_3'),
    "startDate":"today+8",
    "startTime":"09:00",
    "endTime":"19:00"
  }]);
watch(locale, value => {
  if (value != 'en') {
    defaultLang = '\n  language="' + locale.value + '"';
  } else {
    defaultLang = '';
  }
  defaultMultiDate = JSON.stringify([{
    "name":t('demo_data.name_sub_1'),
    "description":t('demo_data.description_sub_1'),
    "startDate":"today+3",
    "startTime":"10:15",
    "endTime":"23:30"
  },
  {
    "name":t('demo_data.name_sub_2'),
    "description":t('demo_data.description_sub_2'),
    "startDate":"today+5",
    "startTime":"11:30",
    "endTime":"20:00"
  },
  {
    "name":t('demo_data.name_sub_3'),
    "description":t('demo_data.description_sub_3'),
    "startDate":"today+8",
    "startTime":"09:00",
    "endTime":"19:00"
  }]);
});
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_192px]">
    <div class="pr-0 lg:pr-8 xl:pr-12 2xl:pr-20">
      <h1 class="mb-16 underline decoration-primary-light decoration-4 dark:decoration-primary-dark">
        {{ $t('navigation.examples') }}
      </h1>
      <div v-if="locale=='en'">
        <p>The following examples are demonstrating the most interesting functionality.<br />We recommend you to play with the demo to experience all variations.</p>
        <p class="italic">The buttons on this share some parameters. They all have the same dates (except the dynamic one), the default style, and adapt to the lightMode of the website.</p>
        <p>
          For more advanced expert cases, have a look at the <NuxtLink :to="localePath('advanced-use')">"{{ $t('navigation.advanced-use') }}"</NuxtLink> page.
        </p>
      </div>
      <div v-else>
        <p>Die nachfolgenden Beispiele veranschaulichen die spannendsten Funktionalitäten.<br />Wir empfehlen mit der Demo zu experimentieren, um weitere Varianten zu erleben.</p>
        <p class="italic">Die Beispiele auf dieser Seite haben ein paar Gemeinsamkeiten. Sie nutzen alle die gleichen Zeiten (außer das Dynamik-Beispiel), den Standard-Stil, und passen sich dem lightMode der Webseite an.</p>
        <p>
          Speziellere Beispiele und Erläuterung von komplexeren Konfigurationen findest du in der <NuxtLink :to="localePath('advanced-use')">"{{ $t('navigation.advanced-use') }}"</NuxtLink>.
        </p>
      </div>
      <section id="case-1">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">{{ $t('content.examples.example') }} 1: {{ $t('content.examples.1_long') }}</h2>
        <p v-if="locale=='en'">This is a more or less standard setup with all available calendar types and a time zone set.</p>
        <p v-else>Dies ist das gewöhnliche Standard-Setup mit allen verfügbaren Kalender-Links und einer definierten Zeitzone</p>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-6 pt-8 md:w-[300px]">
            <add-to-calendar-button
              :name="$t('demo_data.name')"
              :startDate="defaultDate"
              startTime="10:15"
              endTime="23:30"
              :timeZone="$t('demo_data.default_timezone')"
              :location="$t('demo_data.location')"
              :description="$t('demo_data.description_alt1')"
              options="'Apple','Google','iCal','Outlook.com','Microsoft 365','Microsoft Teams','Yahoo'"
              lightMode="bodyScheme"
              :language="locale"
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <LazyCodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="{{ $t('demo_data.name') }}"
  startDate="{{ defaultDate }}"
  startTime="10:15"
  endTime="23:30"
  timeZone="{{ $t('demo_data.default_timezone') }}"
  location="{{ $t('demo_data.location') }}"
  description="{{ $t('demo_data.description_alt1') }}"
  options="'Apple','Google','iCal','Outlook.com','Microsoft 365','Microsoft Teams','Yahoo'"
  lightMode="bodyScheme"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
      </section>

      <section id="case-2">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">{{ $t('content.examples.example') }} 2: {{ $t('content.examples.2_long') }}</h2>
        <p v-if="locale=='en'">
          For an all-day event, you would simply leave out the time information.<br />
          <span class="text-sm italic">You can even omit the time zone information here.</span>
        </p>
        <p v-else>
          Für Ganztages-Events muss lediglich die Information über die Uhrzeit weggelassen werden.<br />
          <span class="text-sm italic">Für derartige Events ist die Zeitzone obsolet.</span>
        </p>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-6 pt-8 md:w-[300px]">
            <add-to-calendar-button
              :name="$t('demo_data.name')"
              :startDate="defaultDate"
              :location="$t('demo_data.location')"
              :description="$t('demo_data.description_alt1')"
              options="'Apple','Google','iCal','Outlook.com','Microsoft 365','Microsoft Teams','Yahoo'"
              lightMode="bodyScheme"
              :language="locale"
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <LazyCodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="{{ $t('demo_data.name') }}"
  startDate="{{ defaultDate }}"
  location="{{ $t('demo_data.location') }}"
  description="{{ $t('demo_data.description_alt1') }}"
  options="'Apple','Google','iCal','Outlook.com','Microsoft 365','Microsoft Teams','Yahoo'"
  lightMode="bodyScheme"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
      </section>

      <section id="case-3">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">{{ $t('content.examples.example') }} 3: {{ $t('content.examples.3_long') }}</h2>
        <div v-if="locale=='en'">
          <p>Instead of using a fixed date, you can also go with dynamic ones.</p>
          <p>You can use "today" to always use the respective current day.<br />Adding a number like "+7" after the date string (e.g. "2025-04-18+7") would add 7 days. In the example, we are combining this to make the event always be 2 days from today.</p>
          <p class="text-sm italic">Btw: This example also generates online-event-rich-schema in the background, since the location is a URL.</p>
        </div>
        <div v-else>
          <p>Anstelle von festen Terminen kannst du auch dynamische Werte für das Datum nutzen.</p>
          <p>Mit dem Wort "today" wird stets der jeweils aktuelle Tag ausgewählt.<br />Füge eine Zahl, wie "+7" an das Datum (bspw. "2025-04-18+7") und es werden 7 Tage addiert. Im Beispiel kombinieren wir beides und fügen immer 2 Tage an das jeweils aktuelle Datum.</p>
          <p class="text-sm italic">Dieses Beispiel erzeugt im Übrigen ein Online-Event im Schema.org-Kontext, da die "location" eine URL ist.</p>
        </div>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-6 pt-8 md:w-[300px]">
            <add-to-calendar-button
              :name="$t('demo_data.name')"
              startDate="today+2"
              startTime="10:15"
              endTime="23:30"
              :timeZone="$t('demo_data.default_timezone')"
              :location="$t('demo_data.url')"
              :description="$t('demo_data.description_alt1')"
              options="'Apple','Google','iCal','Outlook.com','Yahoo'"
              lightMode="bodyScheme"
              :language="locale"
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <LazyCodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="{{ $t('demo_data.name') }}"
  startDate="today+2"
  startTime="10:15"
  endTime="23:30"
  timeZone="{{ $t('demo_data.default_timezone') }}"
  location="{{ $t('demo_data.url') }}"
  description="{{ $t('demo_data.description_alt1') }}"
  options="'Apple','Google','iCal','Outlook.com','Yahoo'"
  lightMode="bodyScheme"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
      </section>

      <section id="case-4">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">{{ $t('content.examples.example') }} 4: {{ $t('content.examples.4_long') }}</h2>
        <p v-if="locale=='en'">
          You can define recurring events by setting an
          <a href="https://www.rfc-editor.org/rfc/rfc5545" target="_blank" rel="noopener">RRULE <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-4 w-4" aria-hidden="true" /></a>.<br />
          Mind that the rule needs to be valid (technically and logically) and that it is not supported by all calendar types - in this example, the specified Yahoo and Outlook.com options won't show up for that reason.
        </p>
        <p v-else>
          Du kannst Wiederholungen grundsätzlich ganz einfach mit einer <a href="https://www.rfc-editor.org/rfc/rfc5545" target="_blank" rel="noopener">RRULE <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-4 w-4" aria-hidden="true" /></a> definieren.<br />
          Beachte, dass die Regel technisch und logisch gültig sein muss und die Option nicht von allen Kalender-Typen unterstützt wird - im Beispiel tauchen die definierten Yahoo- und Outlook-Optionen aus diesem Grund nicht auf.
        </p>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-6 pt-8 md:w-[300px]">
            <add-to-calendar-button
              :name="$t('demo_data.name')"
              :startDate="defaultDate"
              startTime="10:15"
              endTime="23:30"
              :timeZone="$t('demo_data.default_timezone')"
              :location="$t('demo_data.location')"
              :description="$t('demo_data.description_alt1')"
              options="'Apple','Google','iCal','Outlook.com','Yahoo'"
              recurrence="RRULE:FREQ=WEEKLY;INTERVAL=1;WKST=MO;BYDAY=WE,FR;COUNT=6"
              lightMode="bodyScheme"
              :language="locale"
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <LazyCodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="{{ $t('demo_data.name') }}"
  startDate="{{ defaultDate }}"
  startTime="10:15"
  endTime="23:30"
  timeZone="{{ $t('demo_data.default_timezone') }}"
  location="{{ $t('demo_data.location') }}"
  description="{{ $t('demo_data.description_alt1') }}"
  options="'Apple','Google','iCal','Outlook.com','Yahoo'"
  recurrence="RRULE:FREQ=WEEKLY;INTERVAL=1;WKST=MO;BYDAY=WE,FR;COUNT=6"
  lightMode="bodyScheme"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
        <p v-if="locale=='en'">
          You can also specify the rule in more simple terms.<br />
          Check the <NuxtLink :to="{path: localePath('configuration'), hash: '#recurrence'}">"{{ $t('navigation.configuration') }}"</NuxtLink> page for more details on that.
        </p>
        <p v-else>
          Alternativ zu der RRULE kannst du aber auch die "sprechenderen" Optionen nutzen.<br />
          Die <NuxtLink :to="{path: localePath('configuration'), hash: '#recurrence'}">"{{ $t('navigation.configuration') }}"</NuxtLink>-Seite hält mehr Details dazu bereit.
        </p>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-6 pt-8 md:w-[300px]">
            <add-to-calendar-button
              :name="$t('demo_data.name')"
              :startDate="defaultDate"
              startTime="10:15"
              endTime="23:30"
              :timeZone="$t('demo_data.default_timezone')"
              :location="$t('demo_data.location')"
              :description="$t('demo_data.description_alt1')"
              options="'Apple','Google','iCal','Outlook.com','Yahoo'"
              recurrence="weekly"
              recurrence_interval="1"
              recurrence_count="6"
              recurrence_byDay="WE,FR"
              lightMode="bodyScheme"
              :language="locale"
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <LazyCodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="{{ $t('demo_data.name') }}"
  startDate="{{ defaultDate }}"
  startTime="10:15"
  endTime="23:30"
  timeZone="{{ $t('demo_data.default_timezone') }}"
  location="{{ $t('demo_data.location') }}"
  description="{{ $t('demo_data.description_alt1') }}"
  options="'Apple','Google','iCal','Outlook.com','Yahoo'"
  recurrence="weekly"
  recurrence_interval="1"
  recurrence_count="6"
  recurrence_byDay="WE,FR"
  lightMode="bodyScheme"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
      </section>

      <section id="case-5">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">{{ $t('content.examples.example') }} 5: {{ $t('content.examples.5_long') }}</h2>
        <div v-if="locale=='en'">
          <p>
            Events can also have multiple dates, which are not recurring.<br />
            For example a workshop consisting of 2 parts.
          </p>
          <p>
            You define those parts by placing them as separate objects in a dates array.<br />
            Individual date and time information would be required - global ones will be ignored.
          </p>
        </div>
        <div v-else>
          <p>
            Events können aus mehreren Terminen bestehen, die nicht "wiederholend" sind.<br />
            Bspw. ein Workshop, der aus 2 Teilen besteht.
          </p>
          <p>
            Du kannst diese einzelnen Teile mit dem "dates" Objekt in einem Event spezifizieren.<br />
            Zeit-Informationen je Sub-Event sind verpflichtend - Daten auf übergeordneter Ebene werden ignoriert.
          </p>
        </div>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-6 pt-8 md:w-[300px]">
            <add-to-calendar-button
              :name="$t('demo_data.name_series')"
              :dates="defaultMultiDate"
              :timeZone="$t('demo_data.default_timezone')"
              :location="$t('demo_data.location')"
              options="'Apple','Google','iCal','Outlook.com','Yahoo'"
              lightMode="bodyScheme"
              :language="locale"
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <LazyCodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="{{ $t('demo_data.name_series') }}"
  dates='[
    {
      "name":"{{ $t('demo_data.name_sub_1') }}",
      "description":"{{ $t('demo_data.description_sub_1') }}",
      "startDate":"today+3",
      "startTime":"10:15",
      "endTime":"23:30"
    },
    {
      "name":"{{ $t('demo_data.name_sub_2') }}",
      "description":"{{ $t('demo_data.description_sub_2') }}",
      "startDate":"today+5",
      "startTime":"11:30",
      "endTime":"20:00"
    },
    {
      "name":"{{ $t('demo_data.name_sub_3') }}",
      "description":"{{ $t('demo_data.description_sub_3') }}",
      "startDate":"today+8",
      "startTime":"09:00",
      "endTime":"19:00"
    }
  ]'
  timeZone="{{ $t('demo_data.default_timezone') }}"
  location="{{ $t('demo_data.location') }}"
  options="'Apple','Google','iCal','Outlook.com','Yahoo'"
  lightMode="bodyScheme"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
      </section>

      <section id="case-6">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">{{ $t('content.examples.example') }} 6: {{ $t('content.examples.6_long') }}</h2>
        <div v-if="locale=='en'">
          <p>
            You can customize the button's label as well as the ones of each calendar option.<br />
            In the example, we also set the listStyle to an overlay list, slightly reduce the size, and set a custom ics file name.
          </p>
          <p class="text-sm italic">
            If you want to change system text blocks, you can do so with the "customLabels" option - check the <NuxtLink :to="{path: localePath('configuration'), hash: '#customlabels'}">"{{ $t('navigation.configuration') }}"</NuxtLink> page for details.
          </p>
        </div>
        <div v-else>
          <p>
            Du kannst den Text auf dem Button sowie für die jeweiligen Kalendar-Links individuell gestalten.<br />
            Im Beispiel haben wir zudem den listStyle zu einer überlagernden Liste (overlay) verändert, an der Skalierung gedreht und auch der ics-Datei einen eigenen Namen gegeben.
          </p>
          <p class="text-sm italic">
            Weitere System-Texte können mit der "customLabels"-Option verändert werden. Die <NuxtLink :to="{path: localePath('configuration'), hash: '#customlabels'}">"{{ $t('navigation.configuration') }}"</NuxtLink>-Seite weiß mehr.
          </p>
        </div>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-6 pt-8 md:w-[300px]">
            <add-to-calendar-button
              :name="$t('demo_data.name')"
              :startDate="defaultDate"
              startTime="10:15"
              endTime="23:30"
              :timeZone="$t('demo_data.default_timezone')"
              :location="$t('demo_data.location')"
              :label="$t('demo_data.name_custom_1')"
              :description="$t('demo_data.description_alt1')"
              :options="$t('demo_data.options_labels')"
              iCalFileName="Reminder-Event"
              listStyle="overlay"
              size="5"
              lightMode="bodyScheme"
              :language="locale"
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <LazyCodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="{{ $t('demo_data.name') }}"
  startDate="{{ defaultDate }}"
  startTime="10:15"
  endTime="23:30"
  timeZone="{{ $t('demo_data.default_timezone') }}"
  location="{{ $t('demo_data.location') }}"
  description="{{ $t('demo_data.description_alt1') }}"
  options="{{ $t('demo_data.options_labels') }}"
  label="{{ $t('demo_data.name_custom_1') }}"
  iCalFileName="Reminder-Event"
  listStyle="overlay"
  size="5"
  lightMode="bodyScheme"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
      </section>

      <section id="case-7">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">{{ $t('content.examples.example') }} 7: {{ $t('content.examples.7_long') }}</h2>
        <div v-if="locale=='en'">
          <p>
            Per default, the button is a block element, which opens a dropdown on hover.<br />
            As an alternative, you can also make the button render inline.
          </p>
          <p>In this example, we also made the "listStyle" a modal, which automatically sets the click trigger.</p>
        </div>
        <div v-else>
          <p>
            Standardmäßigist der Button ein Block-Element, das bei Hover ein Dropdown öffnet.<br />
            Du kannst den Button alternativ aber auch inline rendern lassen.
          </p>
          <p>Im Beispiel haben wir zudem den "listStyle" auf "modal" gesetzt, was wiederum die Standard-Trigger-Aktion von "Hover" auf "Click" setzt.</p>
        </div>
        <div>
          <div class="mx-auto p-6 pt-8 text-center">
            <span class="pr-6">{{ $t('demo_data.do_it') }}! →</span>
            <add-to-calendar-button
              :name="$t('demo_data.name')"
              :startDate="defaultDate"
              startTime="10:15"
              endTime="23:30"
              :timeZone="$t('demo_data.default_timezone')"
              :location="$t('demo_data.location')"
              :label="$t('demo_data.name_custom_2')"
              :description="$t('demo_data.description_alt1')"
              options="'Apple','Google','iCal','Outlook.com','Yahoo'"
              listStyle="modal"
              inline
              lightMode="bodyScheme"
              :language="locale"
            ></add-to-calendar-button>
          </div>
          <div class="overflow-x-auto">
            <LazyCodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="{{ $t('demo_data.name') }}"
  startDate="{{ defaultDate }}"
  startTime="10:15"
  endTime="23:30"
  timeZone="{{ $t('demo_data.default_timezone') }}"
  location="{{ $t('demo_data.location') }}"
  description="{{ $t('demo_data.description_alt1') }}"
  options="'Apple','Google','iCal','Outlook.com','Yahoo'"
  label="{{ $t('demo_data.name_custom_2') }}"
  inline
  listStyle="modal"
  lightMode="bodyScheme"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
      </section>
      <section id="case-8">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">{{ $t('content.examples.example') }} 8: {{ $t('content.examples.8_long') }}</h2>
        <p v-if="locale=='en'">
          When you specify only 1 calendar type, there will be no list at all.<br />
          Instead, the button itself becomes the calendar link.
        </p>
        <p v-else>
          Wenn nur 1 Kalender-Typ gesetzt ist, wird keine Liste erzeugt.<br />
          Stattdessen wird der Button selbst ein direkter Kalender-Link.
        </p>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-6 pt-8 md:w-[300px]">
            <add-to-calendar-button
              :name="$t('demo_data.name')"
              :startDate="defaultDate"
              startTime="10:15"
              endTime="23:30"
              :timeZone="$t('demo_data.default_timezone')"
              :description="$t('demo_data.description_alt1')"
              options="Google"
              lightMode="bodyScheme"
              :language="locale"
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <LazyCodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="{{ $t('demo_data.name') }}"
  startDate="{{ defaultDate }}"
  startTime="10:15"
  endTime="23:30"
  timeZone="{{ $t('demo_data.default_timezone') }}"
  description="{{ $t('demo_data.description_alt1') }}"
  options="Google"
  lightMode="bodyScheme"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
      </section>
      <section id="case-9">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">{{ $t('content.examples.example') }} 9: {{ $t('content.examples.9_long') }}</h2>
        <div v-if="locale=='en'">
          <p>With the option "buttonsList", you can split the button into multiple - one per calendar type.</p>
          <p>In this example, we also used the round button style and hide the button label.</p>
        </div>
        <div v-else>
          <p>Mit der Option "buttonsList" kann der Button in mehrere aufgeteilt werden - einer je Kalender-Typ.</p>
          <p>Im Beispiel haben wir hierbei zudem den runden Button-Stil gesetzt und den Text auf dem Button deaktiviert.</p>
        </div>
        <div>
          <div class="flex justify-center p-6 pt-8">
            <add-to-calendar-button
              :name="$t('demo_data.name')"
              :startDate="defaultDate"
              startTime="10:15"
              endTime="23:30"
              :timeZone="$t('demo_data.default_timezone')"
              :description="$t('demo_data.description_alt1')"
              options="'Apple','Google','iCal','Outlook.com','Yahoo'"
              buttonsList
              hideTextLabelButton
              buttonStyle="round"
              lightMode="bodyScheme"
              :language="locale"
            ></add-to-calendar-button>
          </div>
          <div class="overflow-x-auto">
            <LazyCodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="{{ $t('demo_data.name') }}"
  startDate="{{ defaultDate }}"
  startTime="10:15"
  endTime="23:30"
  timeZone="{{ $t('demo_data.default_timezone') }}"
  description="{{ $t('demo_data.description_alt1') }}"
  options="'Apple','Google','iCal','Outlook.com','Yahoo'"
  buttonsList
  hideTextLabelButton
  buttonStyle="round"
  lightMode="bodyScheme"{{ defaultLang }}
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </LazyCodeBlock>
          </div>
        </div>
      </section>

      <div class="mt-14 grid grid-cols-1 gap-12 border-t border-zinc-300 pt-14 dark:border-zinc-700 sm:grid-cols-2">
        <p class="self-center text-center sm:text-left">{{ $t('content.examples.go_play') }}</p>
        <NuxtLink :to="{path: localePath('index'), hash: '#demo'}" class="button-primary mx-auto w-56 self-center sm:mx-0">{{ $t('labels.startPlaying') }}<ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true" /></NuxtLink>
        <p class="self-center text-center sm:text-left">{{ $t('content.examples.go_advanced') }}</p>
        <NuxtLink :to="localePath('advanced-use')" class="button-secondary mx-auto w-56 self-center sm:mx-0">{{ $t('navigation.advanced-use') }}<ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true" /></NuxtLink>
      </div>
    </div>
    <div class="hidden border-l border-zinc-300 pl-8 text-sm dark:border-zinc-700 lg:block">
      <div class="sticky top-0 pt-4">
        <NuxtLink :to="'#case-1'" class="side-nav">#1: {{ $t('content.examples.1_short') }}</NuxtLink>
        <NuxtLink :to="'#case-2'" class="side-nav">#2: {{ $t('content.examples.2_short') }}</NuxtLink>
        <NuxtLink :to="'#case-3'" class="side-nav">#3: {{ $t('content.examples.3_short') }}</NuxtLink>
        <NuxtLink :to="'#case-4'" class="side-nav">#4: {{ $t('content.examples.4_short') }}</NuxtLink>
        <NuxtLink :to="'#case-5'" class="side-nav">#5: {{ $t('content.examples.5_short') }}</NuxtLink>
        <NuxtLink :to="'#case-6'" class="side-nav">#6: {{ $t('content.examples.6_short') }}</NuxtLink>
        <NuxtLink :to="'#case-7'" class="side-nav">#7: {{ $t('content.examples.7_short') }}</NuxtLink>
        <NuxtLink :to="'#case-8'" class="side-nav">#8: {{ $t('content.examples.8_short') }}</NuxtLink>
        <NuxtLink :to="'#case-9'" class="side-nav">#9: {{ $t('content.examples.9_short') }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.side-nav {
  @apply block my-4;
}
</style>
