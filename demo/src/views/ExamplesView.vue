<script setup lang="ts">
import "add-to-calendar-button";
import { ArrowRightIcon } from '@heroicons/vue/24/outline';
import CodeBlock from "@/components/CodeBlock.vue";
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();

const today = new Date();
let nextDay = new Date();
nextDay.setDate(today.getDate() + 3);
const defaultDate = nextDay.getFullYear() + '-' + ('0' + (nextDay.getMonth() + 1)).slice(-2) + '-' + ('0' + nextDay.getDate()).slice(-2);
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_192px]">
    <div class="pr-0 lg:pr-8 xl:pr-12 2xl:pr-20">
      <h1 class="mb-16 underline decoration-primary-light decoration-4 dark:decoration-primary-dark">
        {{ t('navigation.examples') }}
      </h1>
      <p>The following examples are demonstrating parts of the functionality.<br />We recommend you to play with the demo to experience all variations.</p>
      <p class="italic">On this page, all buttons have some shared parameters. Beside the base date sample, all have the default style, no endDate (defaults to the startDate), and adapt to the lightMode of the website.</p>
      <p>
        For more advanced expert cases, have a look at the <RouterLink :to="{ name: 'advanced-use', params: { locale } }">"{{ t('navigation.advanced') }}"</RouterLink> page.
      </p>
      <section id="1">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">Example 1: The usual one</h2>
        <p>This is a more or less standard setup with all available calendar types and a time zone set.</p>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-10 pb-6 md:w-[300px]">
            <add-to-calendar-button
              name="[Reminder] Test the Add to Calendar Button"
              v-bind:startDate="defaultDate"
              startTime="10:15"
              endTime="23:30"
              timeZone="Europe/Berlin"
              location="World Wide Web"
              description="Check out the maybe easiest way to include Add to Calendar Buttons to your website:[br]→ [url]https://add-to-calendar-button.com/|Click here![/url]"
              options="'Apple','Google','iCal','Outlook.com','Microsoft 365','Microsoft Teams','Yahoo'"
              lightMode="bodyScheme"
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <CodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="[Reminder] Test the Add to Calendar Button"
  startDate="{{defaultDate}}"
  startTime="10:15"
  endTime="23:30"
  timeZone="Europe/Berlin"
  location="World Wide Web"
  description="Check out the maybe easiest way to include Add to Calendar Buttons to your website:[br]→ [url]https://add-to-calendar-button.com/|Click here![/url]"
  options="'Apple','Google','iCal','Outlook.com','Microsoft 365','Microsoft Teams','Yahoo'"
  lightMode="bodyScheme"
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </CodeBlock>
          </div>
        </div>
      </section>

      <section id="2">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">Example 2: All-Day Event</h2>
        <p>
          For an all-day event, you would simply leave out the time information.<br />
          <span class="text-sm italic">You can even omit the time zone information here.</span>
        </p>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-10 pb-6 md:w-[300px]">
            <add-to-calendar-button
              name="[Reminder] Test the Add to Calendar Button"
              v-bind:startDate="defaultDate"
              location="World Wide Web"
              description="Check out the maybe easiest way to include Add to Calendar Buttons to your website:[br]→ [url]https://add-to-calendar-button.com/|Click here![/url]"
              options="'Apple','Google','iCal','Outlook.com','Microsoft 365','Microsoft Teams','Yahoo'"
              lightMode="bodyScheme"
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <CodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="[Reminder] Test the Add to Calendar Button"
  startDate="{{defaultDate}}"
  location="World Wide Web"
  description="Check out the maybe easiest way to include Add to Calendar Buttons to your website:[br]→ [url]https://add-to-calendar-button.com/|Click here![/url]"
  options="'Apple','Google','iCal','Outlook.com','Microsoft 365','Microsoft Teams','Yahoo'"
  lightMode="bodyScheme"
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </CodeBlock>
          </div>
        </div>
      </section>

      <section id="3">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">Example 3: Dynamic Dates</h2>
        <p>Instead of using a fixed date, you can also go with dynamic ones.</p>
        <p>You can use "today" instead of a date to always use the respective current day.<br />Adding "+7" after the date string (like "2025-04-18+7") would add 7 days. Here, we are combining this to make the event always be 2 days from today.</p>
        <p class="text-sm italic">Btw: This example also generates online-event-rich-schema in the background, since the location is a URL.</p>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-10 pb-6 md:w-[300px]">
            <add-to-calendar-button
              name="[Reminder] Test the Add to Calendar Button"
              startDate="today+2"
              startTime="10:15"
              endTime="23:30"
              timeZone="Europe/Berlin"
              location="https://add-to-calendar-button.com/"
              description="Check out the maybe easiest way to include Add to Calendar Buttons to your website:[br]→ [url]https://add-to-calendar-button.com/|Click here![/url]"
              options="'Apple','Google','iCal','Outlook.com','Yahoo'"
              lightMode="bodyScheme"
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <CodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="[Reminder] Test the Add to Calendar Button"
  startDate="today+2"
  startTime="10:15"
  endTime="23:30"
  timeZone="Europe/Berlin"
  location="https://add-to-calendar-button.com/"
  description="Check out the maybe easiest way to include Add to Calendar Buttons to your website:[br]→ [url]https://add-to-calendar-button.com/|Click here![/url]"
  options="'Apple','Google','iCal','Outlook.com','Yahoo'"
  lightMode="bodyScheme"
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </CodeBlock>
          </div>
        </div>
      </section>

      <section id="4">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">Example 4: Recurring Event</h2>
        <p>
          You can define recurring events by setting an
          <a href="https://www.rfc-editor.org/rfc/rfc5545" target="_blank" rel="noopener">RRULE</a>.<br />
          Mind that the rule needs to be valid (technically and logically) and that it is not supported by all calendar types - in this example, the specified Yahoo option won't show up for that reason.
        </p>
        <p>
          You can also specify the rule in more simple terms. Check the <RouterLink :to="{ name: 'configuration', params: { locale } }">"{{ t('navigation.configuration') }}"</RouterLink> page for more details on that.
        </p>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-10 pb-6 md:w-[300px]">
            <add-to-calendar-button
              name="[Reminder] Test the Add to Calendar Button"
              v-bind:startDate="defaultDate"
              startTime="10:15"
              endTime="23:30"
              timeZone="Europe/Berlin"
              location="World Wide Web"
              description="Check out the maybe easiest way to include Add to Calendar Buttons to your website:[br]→ [url]https://add-to-calendar-button.com/|Click here![/url]"
              options="'Apple','Google','iCal','Outlook.com','Yahoo'"
              recurrence="RRULE:FREQ=WEEKLY;INTERVAL=1;WKST=MO;BYDAY=WE,FR;COUNT=6"
              lightMode="bodyScheme"
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <CodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="[Reminder] Test the Add to Calendar Button"
  startDate="{{defaultDate}}"
  startTime="10:15"
  endTime="23:30"
  timeZone="Europe/Berlin"
  location="World Wide Web"
  description="Check out the maybe easiest way to include Add to Calendar Buttons to your website:[br]→ [url]https://add-to-calendar-button.com/|Click here![/url]"
  options="'Apple','Google','iCal','Outlook.com','Yahoo'"
  recurrence="RRULE:FREQ=WEEKLY;INTERVAL=1;WKST=MO;BYDAY=WE,FR;COUNT=6"
  lightMode="bodyScheme"
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </CodeBlock>
          </div>
        </div>
      </section>

      <section id="5">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">Example 5: Multi-Date Event</h2>
        <p>Events can also have multiple dates, which are not recurring. For example a workshop consisting of 2 parts.</p>
        <p>You define those parts by placing them as separate objects in a dates array. Each part can have his own name, description, and location. If not given, a global one will be used (in the example, we use the location globally).</p>
        <p>Individual date and time information would be required - global ones will be ignored.</p>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-10 pb-6 md:w-[300px]">
            <add-to-calendar-button
              name="Event Series"
              dates='[
                {
                  "name":"[Reminder 1/3] to use the Add to Calendar Button",
                  "description":"This is the first part to check the Add to Calendar Button script at [url]https://add-to-calendar-button.com/[/url]",
                  "startDate":"today+3",
                  "startTime":"10:15",
                  "endTime":"23:30"
                },
                {
                  "name":"[Reminder 2/3] to use the Add to Calendar Button",
                  "description":"This is the second part to check the Add to Calendar Button script at [url]https://add-to-calendar-button.com/[/url]",
                  "startDate":"today+5",
                  "startTime":"11:30",
                  "endTime":"20:00"
                },
                {
                  "name":"[Reminder 3/3] to use the Add to Calendar Button",
                  "description":"This is the third part to check the Add to Calendar Button script at [url]https://add-to-calendar-button.com/[/url]",
                  "startDate":"today+8",
                  "startTime":"09:00",
                  "endTime":"19:00"
                }
              ]'
              timeZone="Europe/London"
              location="World Wide Web"
              options="'Apple','Google','iCal','Outlook.com','Yahoo'"
              lightMode="bodyScheme"
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <CodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="Event Series"
  dates='[
    {
      "name":"[Reminder 1/3] to use the Add to Calendar Button",
      "description":"This is the first part to check the Add to Calendar Button script at [url]https://add-to-calendar-button.com/[/url]",
      "startDate":"today+3",
      "startTime":"10:15",
      "endTime":"23:30"
    },
    {
      "name":"[Reminder 2/3] to use the Add to Calendar Button",
      "description":"This is the second part to check the Add to Calendar Button script at [url]https://add-to-calendar-button.com/[/url]",
      "startDate":"today+5",
      "startTime":"11:30",
      "endTime":"20:00"
    },
    {
      "name":"[Reminder 3/3] to use the Add to Calendar Button",
      "description":"This is the third part to check the Add to Calendar Button script at [url]https://add-to-calendar-button.com/[/url]",
      "startDate":"today+8",
      "startTime":"09:00",
      "endTime":"19:00"
    }
  ]'
  timeZone="Europe/London"
  location="World Wide Web"
  options="'Apple','Google','iCal','Outlook.com','Yahoo'"
  lightMode="bodyScheme"
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </CodeBlock>
          </div>
        </div>
      </section>

      <section id="6">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">Example 6: Custom Labels</h2>
        <p>
          You can customize the button's label as well as the ones of each calendar option.<br />
          Here, we also set the listStyle to an overlay list, slightly reduce the size, and set a custom ics file name.
        </p>
        <p class="text-sm italic">
          If you want to change system text blocks, you can do so with the "customLabels" option - check the <RouterLink :to="{ name: 'configuration', params: { locale } }">"{{ t('navigation.configuration') }}"</RouterLink> page for details.
        </p>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-10 pb-6 md:w-[300px]">
            <add-to-calendar-button
              name="[Reminder] Test the Add to Calendar Button"
              v-bind:startDate="defaultDate"
              startTime="10:15"
              endTime="23:30"
              timeZone="Europe/Berlin"
              location="World Wide Web"
              label="Hit me to save!"
              description="Check out the maybe easiest way to include Add to Calendar Buttons to your website:[br]→ [url]https://add-to-calendar-button.com/|Click here![/url]"
              options="'Apple|Apple is ok for me','Google|Add to Google Cal','iCal|iCall ftw!','Outlook.com|Use Outlook instead','Yahoo|Yahoo, really?'"
              iCalFileName="Reminder-Event"
              listStyle="overlay"
              size="5"
              lightMode="bodyScheme"
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <CodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="[Reminder] Test the Add to Calendar Button"
  startDate="{{defaultDate}}"
  startTime="10:15"
  endTime="23:30"
  timeZone="Europe/Berlin"
  location="World Wide Web"
  label="Hit me to save!"
  description="Check out the maybe easiest way to include Add to Calendar Buttons to your website:[br]→ [url]https://add-to-calendar-button.com/|Click here![/url]"
  options="'Apple|Apple is ok for me','Google|Add to Google Cal','iCal|iCall ftw!','Outlook.com|Use Outlook instead','Yahoo|Yahoo, really?'"
  iCalFileName="Reminder-Event"
  listStyle="overlay"
  size="5"
  lightMode="bodyScheme"
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </CodeBlock>
          </div>
        </div>
      </section>

      <section id="7">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">Example 7: Inline Button</h2>
        <p>
          Per default, the button is a block element, which opens a dropdown on hover.<br />
          You can make the button inline as well as change the trigger for the dropdown to "click".
        </p>
        <p>In this example, instead of changing the trigger, we made the "listStyle" a modal, which automatically sets the click trigger.</p>
        <div>
          <div class="flex justify-center p-10 pb-6">
            <span class="self-center pr-6">Do it! →</span>
            <add-to-calendar-button
              name="[Reminder] Test the Add to Calendar Button"
              v-bind:startDate="defaultDate"
              startTime="10:15"
              endTime="23:30"
              timeZone="Europe/Berlin"
              location="World Wide Web"
              label="Click me hard!"
              description="Check out the maybe easiest way to include Add to Calendar Buttons to your website:[br]→ [url]https://add-to-calendar-button.com/|Click here![/url]"
              options="'Apple','Google','iCal','Outlook.com','Yahoo'"
              inline
              listStyle="modal"
              lightMode="bodyScheme"
            ></add-to-calendar-button>
          </div>
          <div class="overflow-x-auto">
            <CodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="[Reminder] Test the Add to Calendar Button"
  startDate="{{defaultDate}}"
  startTime="10:15"
  endTime="23:30"
  timeZone="Europe/Berlin"
  location="World Wide Web"
  label="Click me hard!"
  description="Check out the maybe easiest way to include Add to Calendar Buttons to your website:[br]→ [url]https://add-to-calendar-button.com/|Click here![/url]"
  options="'Apple','Google','iCal','Outlook.com','Yahoo'"
  inline
  listStyle="modal"
  lightMode="bodyScheme"
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </CodeBlock>
          </div>
        </div>
      </section>
      <section id="8">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">Example 8: One calendar type only</h2>
        <p>When you specify only 1 calendar type, there will be no list at all. Instead, the button itself becomes the list entry.</p>
        <p class="text-sm italic">Mind that this would not block any potential info screen from showing up (for example the Google type with a multi-date event)</p>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-10 pb-6 md:w-[300px]">
            <add-to-calendar-button
              name="[Reminder] Test the Add to Calendar Button"
              v-bind:startDate="defaultDate"
              startTime="10:15"
              endTime="23:30"
              timeZone="Europe/Berlin"
              description="Check out the maybe easiest way to include Add to Calendar Buttons to your website:[br]→ [url]https://add-to-calendar-button.com/|Click here![/url]"
              options="Google"
              lightMode="bodyScheme"
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <CodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="[Reminder] Test the Add to Calendar Button"
  startDate="{{defaultDate}}"
  startTime="10:15"
  endTime="23:30"
  timeZone="Europe/Berlin"
  description="Check out the maybe easiest way to include Add to Calendar Buttons to your website:[br]→ [url]https://add-to-calendar-button.com/|Click here![/url]"
  options="Google"
  lightMode="bodyScheme"
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </CodeBlock>
          </div>
        </div>
      </section>
      <section id="9">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">Example 9: Splitting a button</h2>
        <p>With the option "buttonsList", you can split the button into multiple - one per calendar type.</p>
        <p>In this example, we also used the round button style and hide the button label.</p>
        <div>
          <div class="flex justify-center p-10 pb-6">
            <add-to-calendar-button
              name="[Reminder] Test the Add to Calendar Button"
              v-bind:startDate="defaultDate"
              startTime="10:15"
              endTime="23:30"
              timeZone="Europe/Berlin"
              description="Check out the maybe easiest way to include Add to Calendar Buttons to your website:[br]→ [url]https://add-to-calendar-button.com/|Click here![/url]"
              options="'Apple','Google','iCal','Outlook.com','Yahoo'"
              buttonsList
              hideTextLabelButton
              buttonStyle="round"
              buttonLabel="fals"
              lightMode="bodyScheme"
            ></add-to-calendar-button>
          </div>
          <div class="overflow-x-auto">
            <CodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="[Reminder] Test the Add to Calendar Button"
  startDate="{{defaultDate}}"
  startTime="10:15"
  endTime="23:30"
  timeZone="Europe/Berlin"
  description="Check out the maybe easiest way to include Add to Calendar Buttons to your website:[br]→ [url]https://add-to-calendar-button.com/|Click here![/url]"
  options="'Apple','Google','iCal','Outlook.com','Yahoo'"
  buttonsList
  hideTextLabelButton
  buttonStyle="round"
  buttonLabel="fals"
  lightMode="bodyScheme"
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </CodeBlock>
          </div>
        </div>
      </section>

      <div class="mt-14 grid grid-cols-1 gap-12 border-t border-zinc-300 pt-14 dark:border-zinc-700 sm:grid-cols-2">
        <p class="self-center text-center sm:text-left">Let's directly test most of the options at our playground!</p>
        <RouterLink class="button-primary w-56 self-center" :to="{ name: 'configuration', params: { locale } }">
          {{ t('labels.startPlaying') }}
          <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true" />
        </RouterLink>
        <p class="self-center text-center sm:text-left">If you are looking for crazy customization, you can check out the "danger zone".</p>
        <RouterLink class="button-secondary w-56 self-center" :to="{ name: 'examples', params: { locale } }">
          {{ t('navigation.advanced') }}
          <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true" />
        </RouterLink>
      </div>
    </div>
    <div class="hidden border-l border-zinc-300 pl-8 text-sm dark:border-zinc-700 lg:block">
      <div class="sticky top-0 h-96 pt-4">
        <a href="#1" class="my-4 block">#1: The usual</a>
        <a href="#2" class="my-4 block">#2: All-Day</a>
        <a href="#3" class="my-4 block">#3: Dynamic Dates</a>
        <a href="#4" class="my-4 block">#4: Recurrence</a>
        <a href="#5" class="my-4 block">#5: Multi-Date</a>
        <a href="#6" class="my-4 block">#6: Custom Labels</a>
        <a href="#7" class="my-4 block">#7: Inline</a>
        <a href="#8" class="my-4 block">#8: Single Type</a>
        <a href="#9" class="my-4 block">#9: Splitting</a>
      </div>
    </div>
  </div>
</template>
