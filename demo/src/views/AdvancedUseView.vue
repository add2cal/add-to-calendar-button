<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { atcb_action } from "add-to-calendar-button";
import CodeBlock from "@/components/CodeBlock.vue";
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();

const today = new Date();
let nextDay = new Date();
nextDay.setDate(today.getDate() + 3);
const defaultDate = nextDay.getFullYear() + '-' + ('0' + (nextDay.getMonth() + 1)).slice(-2) + '-' + ('0' + nextDay.getDate()).slice(-2);

const config:Object = {
  name: "[Reminder] Test the Add to Calendar Button",
  description: "Check out the maybe easiest way to include Add to Calendar Buttons to your website:[br]→ [url]https://add-to-calendar-button.com/|Click here![/url]",
  startDate: defaultDate,
  startTime: "10:15",
  endTime: "23:30",
  options: ["Google", "iCal"],
  timeZone: "Europe/Berlin"
};
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
        {{ t('navigation.advanced-use') }}
      </h1>
      <p>On this page, we want to show you more special cases.<br />Additionally, you will learn how to customize even the smallest parts of the button.</p>
      <p class="italic">We do not recommend to use those advanced options, if you are no experienced developer, since they can be really tricky and break the usual behavior!</p>
      <p>
        Mind that if you did not check the <RouterLink :to="{ name: 'examples', params: { locale } }">"{{ t('navigation.examples') }}"</RouterLink> page before, you should go there first.
      </p>
      <section id="1">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">1. Using external styling</h2>
        <p>This is a more or less standard setup with all available calendar types and a time zone set.</p>
        <h3 class="mb-3 mt-8">Built-in options</h3>
        <p>It seems obvious, but sometimes people jump directly into the ugly stuff, while there is a lot you can do with the included easy-to-use features.</p>
        <p>
          Check the <RouterLink :to="{ name: 'configuration', params: { locale } }">"{{ t('navigation.configuration') }}"</RouterLink> page for all available setting and functionalities.
        </p>
        <p>The following exmaples use some of them to showcase the variety of included styles.</p>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-10 pb-6 md:w-[300px]">
            <add-to-calendar-button name="[Reminder] Test the Add to Calendar Button" v-bind:startDate="defaultDate" options="'Apple','Google','iCal'" listStyle="overlay" buttonStyle="round" hideIconButton hideBackground label="My custom Label" lightMode="bodyScheme"></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <CodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="[Reminder] Test the Add to Calendar Button"
  startDate="{{defaultDate}}"
  options="'Apple','Google','iCal'"
  buttonStyle="round"
  hideIconButton
  hideBackground
  label="My custom Label"
  lightMode="bodyScheme"
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </CodeBlock>
          </div>
        </div>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-10 pb-6 md:w-[300px]">
            <add-to-calendar-button name="[Reminder] Test the Add to Calendar Button" v-bind:startDate="defaultDate" options="'Apple','Google','iCal'" buttonStyle="flat" hideIconList buttonsList hideBackground size="5" label="Flat and Singleton" lightMode="bodyScheme"></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <CodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="[Reminder] Test the Add to Calendar Button"
  startDate="{{defaultDate}}"
  options="'Apple','Google','iCal'"
  buttonStyle="flat"
  hideIconList
  buttonsList
  hideBackground
  size="5"
  label="Flat and Singleton"
  lightMode="bodyScheme"
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </CodeBlock>
          </div>
        </div>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-10 pb-6 md:w-[300px]">
            <add-to-calendar-button name="My awesome Event" v-bind:startDate="defaultDate" options="'Apple','Google','iCal'" startTime="10:10" endTime="10:40" timeZone="Europe/Berlin" location="Fantasy Marketplace" buttonStyle="date" size="5" lightMode="bodyScheme"></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <CodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="My awesome Event"
  startDate="{{defaultDate}}"
  options="'Apple','Google','iCal'"
  startTime="10:10"
  endTime="10:40"
  timeZone="Europe/Berlin"
  location="Fantasy Marketplace"
  buttonStyle="date"
  size="5"
  lightMode="bodyScheme"
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </CodeBlock>
          </div>
        </div>
        <h3 class="mb-3 mt-8">Override colors</h3>
        <p>
          Generally, it is not possible to directly override the style, since the button sits in its own ShadowDOM.<br />
          What you can do, however, is overriding some variables, which are bound to the host (= the <code>&lt;add-to-calendar-button&gt;</code> tag).<br />
          You can simply provide the default ones via the "style" attribute and the "dark mode" overrides via an additional "styleDark" attribute.
        </p>
        <p>The available variables differ per selected button style. Check the respective <a href="https://github.com/add2cal/add-to-calendar-button/tree/main/assets/css" target="_blank" rel="noopener">css file in the repository</a> (have a look at the "Global colors and shadows" section).</p>
        <p class="italic">Mind that this is not working with the "none" button style or the atcb_action approach (<a href="#9">see #9</a>).</p>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-10 pb-6 md:w-[300px]">
            <add-to-calendar-button style="--atcb-background: #ffa255;" styleDark="--atcb-background: #000;" name="[Reminder] Test the Add to Calendar Button" v-bind:startDate="defaultDate" options="'Apple','Google','iCal'" lightMode="bodyScheme"></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <CodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button 
  style="--atcb-background: #ffa255;"
  styleDark="--atcb-background: #000;"
  name="[Reminder] Test the Add to Calendar Button"
  v-bind:startDate="{{defaultDate}}"
  options="'Apple','Google','iCal'"
  lightMode="bodyScheme"
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </CodeBlock>
          </div>
        </div>
        <h3 class="mb-3 mt-8">Load an external CSS file</h3>
        <p>
          Another approach you can use, would be to load an external CSS file by providing it with the "customCss" option and setting the button style to "custom".<br />
          This file could, of course, also be within your application, but should not be bundled with other css. Additionally, it is not allowed to use a url path with "../" syntax due to security reasons. Absolute urls would be recommended.
        </p>
        <p>
          Mind that in this case, you need to take care of all (!) elements.<br />
          It is recommended to copy a provided style <a href="https://github.com/add2cal/add-to-calendar-button/tree/main/assets/css" target="_blank" rel="noopener">from the repository</a> and change what you want to change.
        </p>
        <p>For this approach, you also need to make sure that your system allows to load external stylesheets (e.g. no blocking Content-Security-Policy rules).</p>
        <p>In our example here, we keep it basic any only change the color again.</p>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-10 pb-6 md:w-[300px]">
            <add-to-calendar-button name="[Reminder] Test the Add to Calendar Button" v-bind:startDate="defaultDate" options="'Apple','Google','iCal'" lightMode="bodyScheme" customCss="https://add-to-calendar-button.com/atcb.css" buttonStyle="custom"></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <CodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="[Reminder] Test the Add to Calendar Button"
  v-bind:startDate="{{defaultDate}}"
  options="'Apple','Google','iCal'"
  lightMode="bodyScheme"
  customCss="https://add-to-calendar-button.com/atcb.css"
  buttonStyle="custom"
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </CodeBlock>
          </div>
        </div>
        <h3 class="mb-3 mt-8">Use a custom object as button</h3>
        <p>
          Last but not least, you could also stick to a provided style, but use your own triggering object.<br />
          Check the <a href="#9">"Bring your own button" example</a> at this page for more details on that.
        </p>
      </section>
      <section id="2">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">2. Enriching the event description</h2>
        <p>
          The event description does not need to be simple plain text!<br />
          You can use HTML special characters as well as specific formatting rules.
        </p>
        <p>
          Those rules are set up as HTML pseudo tags, which get transformed automatically.<br />
          <span class="text-sm italic">(Yahoo and Microsoft Teams are not fully supported at the moment.)</span>
        </p>
        <p>
          <span class="font-semibold">Suported tags:</span>
        </p>
        <ul class=" ml-6 list-disc pb-4 pt-2">
          <li>[hr]</li>
          <li>[p] ... [/p]</li>
          <li>[br]</li>
          <li>[strong] ... [/strong]</li>
          <li>[u] ... [/u]</li>
          <li>[i] ... [/i], [em] ... [/em]</li>
          <li>[ul] ... [/ul], [ol] ... [/ol], [li] ... [/li]</li>
          <li>[h*] ... [/h*] (&larr; h1, h2, h3, ...)</li>
          <li>[url] ... [/url]<br /><span class="text-sm italic">Define a link text with [url]https://....|URL Text[/url]</span></li>
        </ul>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-10 pb-6 md:w-[300px]">
            <add-to-calendar-button
              name="[Reminder] Test the Add to Calendar Button"
              v-bind:startDate="defaultDate"
              startTime="10:15"
              endTime="23:30"
              timeZone="Europe/Berlin"
              options="'Apple','Google','iCal','Outlook.com','Microsoft 365','Microsoft Teams','Yahoo'"
              lightMode="bodyScheme"
              description="[p][strong]Check out[/strong] the maybe [u]easiest way[/u] to include Add to Calendar Buttons to your website! 🚀[/p][p]💻 [em]Visit the official website for more inspiration:[/em][br]&rarr; [url]https://add-to-calendar-button.com/|Click here![/url][/p]"
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
  options="'Apple','Google','iCal','Outlook.com','Microsoft 365','Microsoft Teams','Yahoo'"
  lightMode="bodyScheme"
  description="[p][strong]Check out[/strong] the maybe [u]easiest way[/u] to include Add to Calendar Buttons to your website! 🚀[/p][p]💻 [em]Visit the official website for more inspiration:[/em][br]&rarr; [url]https://add-to-calendar-button.com/|Click here![/url][/p]"
&gt;&lt;/add-to-calendar-button&gt;
</pre
              >
            </CodeBlock>
          </div>
        </div>
      </section>
      <section id="3">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">3. Offering a calendar subscription</h2>
        <p>You can also offer your users the option to subscribe to a calendar, instead of only saving static events.</p>
        <p>To get this to work, you would simply need to set the public address (an .ics file) of the calendar as the "icsFile" option and set the "subscribe" option to true.</p>
        <p>
          "Name" and "startDate" are still required for organizational purposes, but every other event parameter can be skipped in this case.<br />
          For Microsoft services, the "Name" will be used as name for the calendar.<br />
          <span class="text-sm italic">(Microsoft Teams is not yet supported and will be automatically disabled.)</span>
        </p>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-10 pb-6 md:w-[300px]">
            <add-to-calendar-button name="[Test Subscription] Add to Calendar Button" v-bind:startDate="defaultDate" subscribe icsFile="" options="'Apple','Google','iCal','Outlook.com','Microsoft 365','Microsoft Teams','Yahoo'" lightMode="bodyScheme"></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <CodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="[Test Subscription] Add to Calendar Button"
  startDate="{{defaultDate}}"
  subscribe
  icsFile=""
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
        <p>You can change any text blocks.</p>
        <p>For the button label you can simply specify the "label" optione, while for the calendar option labels in the list, you can set a custom text by separating it with a "|" from the option.</p>
        <p>
          For all other text blocks (like the "Close" at the modal), you can specify the "customLabels" option.<br />
          There, you need to specify a JSON structure and define any text you want to override.<br />
          Check the <a href="https://github.com/add2cal/add-to-calendar-button/blob/main/src/atcb-i18n.js" target="_blank" rel="noopener">atcb-i18n.js</a> file at the repository for the available keys/options.<br />
          <span class="font-semibold">Mind that for the "customLabels" option, all keys need to be transformed to a lower case string without any whitespaces!</span>
          Any custom label will also override any translation and that you cannot define a value per language.
        </p>
        <p class="text-sm italic">(In case you are only looking for a translation, check the "language" option instead!)</p>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-10 pb-6 md:w-[300px]">
            <add-to-calendar-button
              name="[Reminder] Test the Add to Calendar Button"
              v-bind:startDate="defaultDate"
              startTime="10:15"
              endTime="23:30"
              label="Hit me to save!"
              options="'Apple|Apple is ok for me','Google|Add to Google Cal','iCal|iCall ftw!','Outlook.com|Use Outlook instead','Yahoo|Yahoo, really?'"
              listStyle="modal"
              customLabels='{
                "close":"Close the list again"
              }'
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
  label="Hit me to save!"
  options="'Apple|Apple is ok for me','Google|Add to Google Cal','iCal|iCall ftw!','Outlook.com|Use Outlook instead','Yahoo|Yahoo, really?'"
  listStyle="modal"
  customLabels='{
    "close":"Close the list again"
  }'
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
        <p>
          There are some really rare cases where you might not have an event with a specific place and time, but rather a time bound to the user's individual time zone.<br />
          For example offering an event, which should remind the users at 8am to brush their teeth.
        </p>
        <p>In those cases, you could set the "timeZone" option to "currentBrowser".<br />The event's time will then be automatically adjusted for each user based on the individual time zone.</p>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-10 pb-6 md:w-[300px]">
            <add-to-calendar-button
              name="[Reminder] Test the Add to Calendar Button"
              v-bind:startDate="defaultDate"
              startTime="10:00"
              endTime="11:00"
              timeZone="currentBrowser"
              location="World Wide Web"
              description="Check out the maybe easiest way to include Add to Calendar Buttons to your website:[br]→ [url]https://add-to-calendar-button.com/|Click here![/url]"
              options="'Apple','Google','iCal'"
              lightMode="bodyScheme"
            ></add-to-calendar-button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <CodeBlock class="line-numbers">
              <pre>
&lt;add-to-calendar-button
  name="[Reminder] Test the Add to Calendar Button"
  startDate="{{defaultDate}}"
  startTime="10:00"
  endTime="11:00"
  timeZone="currentBrowser"
  location="World Wide Web"
  description="Check out the maybe easiest way to include Add to Calendar Buttons to your website:[br]→ [url]https://add-to-calendar-button.com/|Click here![/url]"
  options="'Apple','Google','iCal'"
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
      <section id="9">
        <h2 class="mb-4 mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">8. Bring your own button</h2>
        <p>
          For those who want to go fuc**** crazy custom, we also provide the option to trigger the options list manually.<br />
          This provides you with the option to basically use anything as your button or even trigger it programmatically.
        </p>
        <p>
          Theoretically, you do not need to provide a button element. However, it is recommended to do so, since it will optimize the user experience a lot (like focusing the element on closing the modal, etc.).<br />
          If you provide a specific button, you can also choose between the overlay-dropdown list or the modal (default) style. Latter one is strongly recommended.
        </p>
        <h3 class="mb-3 mt-8">Step 1: Import</h3>
        <p>If you use the script via CDN, you can skip this step.<br />If you use the script as npm package, you would first need to import the "atcb_action" functionality. Simply change the import statement to the following:</p>
        <CodeBlock language="javascript">
          <pre>import { atcb_action } from "add-to-calendar-button";</pre>
        </CodeBlock>
        <h3 class="mb-3 mt-8">Step 2: Config and trigger</h3>
        <p>
          Secondly, you would need to define the config and the trigger.<br />
          This might differ a lot based on your environment. You are the expert there.
        </p>
        <p>In the example we use a quite simple button for the demonstration.</p>
        <div class="block w-full justify-between md:flex">
          <div class="flex w-full flex-none justify-center p-10 pb-6 md:w-[300px]">
            <button id="my-default-button" style="background:#ffa255; color:#000; padding:8px 16px; height:fit-content; display:block; border-radius: 21px;">{{ t('labels.clickHere') }}</button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <CodeBlock class="line-numbers">
              <pre>
&lt;button id="my-default-button" style="background:#ffa255; color:#000; padding:8px 16px; height:fit-content; display:block; border-radius: 21px;"&gt;{{ t('labels.clickHere') }}&lt;/button&gt;

&lt;script type="application/javascript"&gt;
  const config:Object = {
    name: "[Reminder] Test the Add to Calendar Button",
    description: "Check out the maybe easiest way to include Add to Calendar Buttons to your website:[br]→ [url]https://add-to-calendar-button.com/|Click here![/url]",
    startDate: "2023-02-23",
    startTime: "10:15",
    endTime: "23:30",
    options: ["Google", "iCal"],
    timeZone: "Europe/Berlin"
  };
  const button = document.getElementById('my-default-button');
  if (button) {
    button.addEventListener('click', () => atcb_action(config, button));
  }
&lt;/script&gt;
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
        <a href="#9" class="my-4 block">#9: Bring your Button</a>
      </div>
    </div>
  </div>
</template>
