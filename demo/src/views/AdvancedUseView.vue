<script setup lang="ts">
import "add-to-calendar-button";
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
        {{ t('navigation.advanced') }}
      </h1>
      <p>On this page, we want to show you more special cases.<br />Additionally, you will learn how to customize even the smallest parts of the button.</p>
      <p class="italic">We do not recommend to use those advanced options, if you are no experienced developer, since they can be really tricky and break the usual behavior!</p>
      <p>
        Mind that if you did not check the <RouterLink :to="{ name: 'examples', params: { locale } }">"{{ t('navigation.examples') }}"</RouterLink> page before, you should go there first.
      </p>
      <section id="1">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">1. Using external styling</h2>
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
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">2. Enriching the event description</h2>
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
      <section id="3">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">3. Offering a calendar subscription</h2>
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
      <section id="4">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">4. Custom system text</h2>
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
      <section id="5">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">5. Using advanced iCal properties</h2>
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
      <section id="6">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">6. Set a custom ID</h2>
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
      <section id="7">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">7. Use the browser's time zone</h2>
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
      <section id="8">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">8. WebView</h2>
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
    </div>
    <div class="hidden border-l border-zinc-300 pl-8 text-sm dark:border-zinc-700 lg:block">
      <div class="sticky top-0 h-96 pt-4">
        <a href="#1" class="my-4 block">#1: External Style</a>
        <a href="#2" class="my-4 block">#2: Rich description</a>
        <a href="#3" class="my-4 block">#3: Subscription</a>
        <a href="#4" class="my-4 block">#4: Custom text</a>
        <a href="#5" class="my-4 block">#5: iCal+</a>
        <a href="#6" class="my-4 block">#6: Custom IDs</a>
        <a href="#7" class="my-4 block">#7: Browser Time</a>
        <a href="#8" class="my-4 block">#8: WebView</a>
      </div>
    </div>
  </div>
</template>
