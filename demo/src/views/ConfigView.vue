<script setup lang="ts">
import ConfigSearch from '@/components/controls/ConfigSearch.vue';
import { ArrowRightIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_192px]">
    <div class="pr-0 lg:pr-8 xl:pr-12 2xl:pr-20">
      <h1 class="mb-16 underline decoration-primary-light decoration-4 dark:decoration-primary-dark">
        {{ t('navigation.configuration') }}
      </h1>
      <p>The following list holds all potential attributes to set up and customize your next Add to Calendar Button.</p>
      <p class="mt-8 italic">Check the Demo to play with most of them and explore the examples pages for more extensive descriptions for specific cases.</p>
      <p class="hidden lg:block">
        To specify a boolean value within an HTML element, you would only add the name as attribute.<br />
        Not setting it would automatically reflect to "false". As an alternative, you could also always write it as a string like <code>attributeName="true"</code>.
      </p>

      <p class="mt-8 hidden lg:block">
        Mind that if you are using the <a href="https://github.com/add2cal/add-to-calendar-button-react" target="_blank" rel="noopener">React wrapper <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-4 w-4" aria-hidden="true" /></a>, you do not necessarily need to stringify any
        non-string value.<br />
        You could simply write something like <code>options=['Apple','Google']</code> instead of <code>options="['Apple','Google']"</code>.
      </p>

      <div class="mx-auto mt-14 block border-y border-zinc-300 px-5 pt-6 pb-7 dark:border-zinc-700 md:mx-0 lg:hidden">
        <ConfigSearch :mobile="true" label="Find parameters:" />
      </div>

      <h3 id="event-parameters" class="mt-12 pt-4">Event parameters</h3>
      <div class="my-8 overflow-x-auto rounded-lg shadow-sm">
        <table>
          <thead>
            <tr>
              <th scope="col" class="py-3 px-3 font-semibold sm:px-5">Name<span class="block pt-1 normal-case md:hidden">(Value)</span></th>
              <th scope="col" class="hidden py-3 px-3 font-semibold sm:px-5 md:table-cell">Value</th>
              <th scope="col" class="py-3 px-3 font-semibold sm:px-5">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr id="prokey" class="hidden">
              <th scope="row" class="text-base text-primary dark:text-primary-light">proKey</th>
              <td><em>String</em></td>
              <td>
                If you are using the PRO service, you can use the "proKey" attribute to connect the button to a specific event of yours.
                <span class="mt-2 block font-semibold">In this case, no other parameters need to be defined in the code, since this is 100% managed at the Add to Calendar PRO admin panel.</span>
              </td>
            </tr>
            <tr id="options">
              <th scope="row">options</th>
              <td><em>Stringified Array</em><br /><br /><span class="font-semibold text-red-700">Required</span><br /><br /><span class="label block">Options:</span>Apple, Google, iCal, Microsoft365, MicrosoftTeams, Outlook.com, Yahoo</td>
              <td>
                Array of options to use in the list.<br /><br />
                When not using the custom <code>atcb_action</code> function, you can also override the label per option here. Simply add a pipe between the option name and your label (e.g. "Google|My custom Google Label").<br />
                If you only specify 1 calendar type, the button would show the calendar's icon instead of the default one and redirect directly instead of opening a list (singleton case).
              </td>
            </tr>
            <tr id="name">
              <th scope="row">name</th>
              <td><em>String</em><br /><br /><span class="font-semibold text-red-700">Required</span></td>
              <td>
                The name of your event.<br /><br />
                Should be a rather short string.<br />
                In case you set the "dates" attribute (multi-date), the name is still required. It then acts as fallback and name for the event series.<br />
                In the subscription case, the name would be used as calendar name for Microsoft services.
              </td>
            </tr>
            <tr id="description">
              <th scope="row">description</th>
              <td><em>String</em></td>
              <td>
                You can use HTML pseudo tags for formatting.<br />
                Suported ones: [url], [br], [hr], [p], [strong], [u], [i], [em], [li], [ul], [ol], [h*] (like h1, h2, h3, ...).<br />
                Define a link text with the following schema: [url]https://....|URL Text[/url].<br /><br />
                (Yahoo and Microsoft Teams are not fully supported and automatically transformed to plain text.)<br /><br />
                <RouterLink :to="{ name: 'advanced-use', hash: '#2', params: { locale } }">{{ t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></RouterLink>
              </td>
            </tr>
            <tr id="startdate">
              <th scope="row">startDate</th>
              <td><em>String</em><br /><br /><span class="font-semibold">Required, if not using "dates" or "subscribe" option</span><br /><br /><span class="format">YYYY-MM-DD</span></td>
              <td>
                A date needs to be formatted as YYYY-MM-DD as specified with <a href="https://en.wikipedia.org/wiki/ISO_8601" target="_blank" rel="noopener">ISO-8601 <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a>.<br /><br />
                You can use the magic word "today" to dynamically set the current day. Adding "+5" at the end would automatically add 5 days to the calculated date.<br /><br />
                <RouterLink :to="{ name: 'examples', hash: '#3', params: { locale } }">{{ t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></RouterLink>
              </td>
            </tr>
            <tr id="starttime">
              <th scope="row">startTime</th>
              <td><em>String</em><br /><br /><span class="format">HH:MM</span></td>
              <td>If not set, the event will be defined as "all-day".</td>
            </tr>
            <tr id="enddate">
              <th scope="row">endDate</th>
              <td><em>String</em><br /><br /><span class="format">YYYY-MM-DD</span></td>
              <td>
                A date needs to be formatted as YYYY-MM-DD as specified with <a href="https://en.wikipedia.org/wiki/ISO_8601" target="_blank" rel="noopener">ISO-8601 <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a>.<br /><br />
                If there is no endDate set, it is assumed that it is the same as startDate. You can use the magic word "today" to dynamically set the current day. Adding "+5" at the end would automatically add 5 days to the calculated date.
              </td>
            </tr>
            <tr id="endtime">
              <th scope="row">endTime</th>
              <td><em>String</em><br /><br /><span class="format">HH:MM</span></td>
              <td>If not set, the event will be defined as "all-day".</td>
            </tr>
            <tr id="timezone">
              <th scope="row">timeZone</th>
              <td><em>String</em><br /><br /><span class="label">Default:</span>UTC</td>
              <td>
                You can and should add a time zone.<br />
                Find a list of them at <a href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones" target="_blank" rel="noopener">Wikipedia <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a>.<br /><br />
                You can use "currentBrowser" as value to dynamically use the time of the user's browser. Use this with caution, since it would mean that the date and time will differ per user, which should not be the usual case.
                <br />
                A time zone only comes into play, when startTime and endTime are defined.
              </td>
            </tr>
            <tr id="location">
              <th scope="row">location</th>
              <td><em>String</em></td>
              <td>Can be anything. If it is a location, the event will be classified as "online event" via the schema.org declaration.</td>
            </tr>
            <tr id="status">
              <th scope="row">status</th>
              <td><em>String</em><br /><br /><span class="label block">Options:</span>TENTATIVE, CONFIRMED, CANCELLED<br /><br /><span class="label">Default:</span>CONFIRMED</td>
              <td>
                Can be used to manage changes of an event as it is specified within the iCalendar specifications
                <a href="https://www.rfc-editor.org/rfc/rfc5545#section-3.8.1.11" target="_blank" rel="noopener">RFC5545 <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a>.<br /><br />
                <RouterLink :to="{ name: 'advanced-use', hash: '#5', params: { locale } }">{{ t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></RouterLink>
              </td>
            </tr>
            <tr id="sequence">
              <th scope="row">sequence</th>
              <td><em>Stringified bigInt</em><br /><br /><span class="label">Default:</span>0</td>
              <td>
                Needs to be a positive integer number.<br />Needs to grow when you make changes to the event.<br /><br />
                <RouterLink :to="{ name: 'advanced-use', hash: '#5', params: { locale } }">{{ t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></RouterLink>
              </td>
            </tr>
            <tr id="uid">
              <th scope="row">uid</th>
              <td><em>String</em><br /><br /><span class="format">XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX</span><br /><br /><span class="label">Default:</span>Randomly generated</td>
              <td>
                The unique ID of the event as it is used within the iCal file.<br /><br />
                May only contain alpha, digits, and dashes; and be less than 255 characters.<br />
                A hex-encoded random Universally Unique Identifier (UUID) is recommended.
              </td>
            </tr>
            <tr id="organizer">
              <th scope="row">organizer</th>
              <td><em>String</em><br /><br /><span class="format">NAME|EMAIL</span></td>
              <td>
                Use the schema "NAME|EMAIL" (e.g. "John Doe|john.doe@gmail.com").<br /><br />
                The organizer will appear within the schema.org rich data as well as the iCal file.<br />
                Setting this option will also change the style of the iCal information from being an event to simply save to an event invitation one can accept or decline.<br /><br />
                <RouterLink :to="{ name: 'advanced-use', hash: '#5', params: { locale } }">{{ t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></RouterLink>
              </td>
            </tr>
            <tr id="dates">
              <th scope="row">dates</th>
              <td><em>Stringified Object</em></td>
              <td>
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
                <RouterLink :to="{ name: 'examples', hash: '#5', params: { locale } }">{{ t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></RouterLink>
              </td>
            </tr>
            <tr id="recurrence">
              <th scope="row">recurrence</th>
              <td><em>String</em><br /><br /><span class="label">Options:</span><br />"RRULE:...";<br />daily, weekly, monthly, yearly</td>
              <td>
                Defines recurring events.<br /><br />
                This will deactivate the Yahoo and Microsoft options, since they do not support it at the moment (users could still use iCal in this case).<br />
                You can use any valid <a href="https://www.rfc-editor.org/rfc/rfc5545" target="_blank" rel="noopener">RRULE <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a> to define the respective rule (<a
                  href="https://icalendar.org/rrule-tool.html"
                  target="_blank"
                  rel="noopener"
                  >click here for a generator <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a
                >).<br />
                Mind that the startDate needs to be valid within the given recurrence ruleset!<br /><br />
                As an alternative to the RRULE, you could also specify the following more specific reccurence settings, which will then generate the RRULE for you in the background (see next parameters).<br />
                In this case, for the "recurrence" field, you would define the frequency (daily, weekly, monthly, yearly) instead of the RRULE.<br /><br />
                <RouterLink :to="{ name: 'examples', hash: '#4', params: { locale } }">{{ t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></RouterLink>
              </td>
            </tr>
            <tr id="recurrence_interval">
              <th scope="row">recurrence_interval</th>
              <td><em>Stringified bigInt</em><br /><br /><span class="label">Default:</span>1</td>
              <td>
                Defines the interval between iterations.<br />
                "1" would be the default, while "3" would mean "every third".
              </td>
            </tr>
            <tr id="recurrence_until">
              <th scope="row">recurrence_until</th>
              <td><em>String</em></td>
              <td>
                Defines an end date.<br />
                This should be the last day of the event, formatted as YYYY-MM-DD.<br /><br />
                <span class="text-red-700">Mind that this does not work in many applications!<br />Rather use the count option.</span>
              </td>
            </tr>
            <tr id="recurrence_count">
              <th scope="row">recurrence_count</th>
              <td><em>Stringified bigInt</em></td>
              <td>
                Defines an upper limit of repetitions.<br />
                If endDate and count are given, whatever comes first overrides the other. If none are given, it would repeat indefinitely.
              </td>
            </tr>
            <tr id="recurrence_byDay">
              <th scope="row">recurrence_byDay</th>
              <td><em>String</em></td>
              <td>
                Defines the weekdays (MO, TU, WE, TH, FR, SA, SU), where the even occurs (if, for example, it is bound to Tuesday instead of the 24th).<br />
                Requires a weekly frequency.<br />
                Can be enriched with a number to specify something like the 3rd Monday (3MO).<br />
                Can be multiple, comma separated.
              </td>
            </tr>
            <tr id="recurrence_byMonthDay">
              <th scope="row">recurrence_byMonthDay</th>
              <td><em>String</em></td>
              <td>
                Use this instead of the "byDay" option, if you want use a numbered day (1, 2, ... 31) instead of a weekday.<br />
                Requires a monthly frequency.<br />
                Can be multiple, comma separated.
              </td>
            </tr>
            <tr id="recurrence_byMonth">
              <th scope="row">recurrence_byMonth</th>
              <td><em>String</em><br /><br /><span class="label block">Options:</span>1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12</td>
              <td>
                Defines the months (1, 2, 3, ... 12), where the event should happen.<br />
                Requires a yearly frequency.<br />
                Can be multiple, comma separated.
              </td>
            </tr>
            <tr id="recurrence_weekstart">
              <th scope="row">recurrence_weekstart</th>
              <td><em>String</em><br /><br /><span class="label block">Options:</span>MO, TU, WE, TH, FR, SA, SU<br /><br /><span class="label">Default:</span>MO</td>
              <td>Specify a specific weekday as start of the week.</td>
            </tr>
            <tr id="availability">
              <th scope="row">availability</th>
              <td><em>String</em><br /><br /><span class="label block">Options:</span>busy, free<br /><br /><span class="label block">Default:</span>Default setting at the user's calendar</td>
              <td>
                Per default, the event will be marked as busy/free/available based on the user's calendar settings.<br />
                For Apple, iCal, and Google, you can force this by using the setting availability with options "busy" or "free".
              </td>
            </tr>
            <tr id="subscribe">
              <th scope="row">subscribe</th>
              <td><em>Boolean</em><br /><br /><span class="label">Default:</span>False</td>
              <td>
                As an alternative to providing a specific predefined event, you can also host a calendar and offer it for subscription (requires a hosted calendar).<br />
                To offer the subscription via the button, you need to provide an explicit icsFile and set subscribe.<br /><br />
                "Name" and "startDate" would be still required for organizational purposes, but every other event parameter can be skipped in the subscription case.<br />
                For Microsoft services, the "Name" will be used as name for the calendar.<br /><br />
                Microsoft Teams is not yet supported and will be automatically disabled.<br /><br />
                <RouterLink :to="{ name: 'advanced-use', hash: '#3', params: { locale } }">{{ t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></RouterLink>
              </td>
            </tr>
            <tr id="icsfile">
              <th scope="row">icsFile</th>
              <td><em>String</em><br /><br /><span class="format">URL</span></td>
              <td>
                The iCal/ics file gets created dynamically.<br />
                This has some drawbacks as it might be blocked in some rare cases.<br />
                With this option, you can redirect to an existing ics file instead.<br /><br />
                In the subscription case, you need to define the external calendar here.
              </td>
            </tr>
            <tr id="icalfilename">
              <th scope="row">iCalFileName</th>
              <td><em>String</em><br /><br /><span class="label block">Default:</span>event-to-save-in-my-calendar</td>
              <td>If you want to define a specific name for any generated ics file (iCal), you can specify it via the iCalFileName option.</td>
            </tr>
            <tr id="created">
              <th scope="row">created</th>
              <td><em>String</em><br /><br /><span class="format">YYYYMMDDTHHMMSSZ</span><br /><br /><span class="label block">Default:</span>Time the file gets downloaded</td>
              <td>
                The "Created" field in the iCal file would default to the time the file gets generated.<br />
                Use this option, if you want to define a specific static timestamp instead.<br /><br />
                Should be a UTC timestamp like "20221201T103000Z".
              </td>
            </tr>
            <tr id="updated">
              <th scope="row">updated</th>
              <td><em>String</em><br /><br /><span class="format">YYYYMMDDTHHMMSSZ</span><br /><br /><span class="label block">Default:</span>Time the file gets downloaded</td>
              <td>
                The "Updated" field in the iCal file would default to the time the file gets generated. <br />Use this option, if you want to define a specific static timestamp instead.<br /><br />
                Should be a UTC timestamp like "20221201T103000Z".
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="style-parameters" class="mt-12 pt-4">Style parameters</h3>
      <div class="my-8 overflow-x-auto rounded-lg shadow-sm">
        <table>
          <thead>
            <tr>
              <th scope="col" class="py-3 px-3 font-semibold sm:px-5">Name<span class="block pt-1 normal-case md:hidden">(Value)</span></th>
              <th scope="col" class="hidden py-3 px-3 font-semibold sm:px-5 md:table-cell">Value</th>
              <th scope="col" class="py-3 px-3 font-semibold sm:px-5">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr id="buttonstyle">
              <th scope="row">buttonStyle</th>
              <td><em>String</em><br /><br /><span class="label block">Options:</span>default, 3d, flat, round, neumorphism, text, date, custom, none<br /><br /><span class="label">Default:</span>default</td>
              <td>
                There are multiple integrated button styles, which also affect a lot of other parameters.<br />
                We recommend to play around with them in order to find out how they behave in detail.<br /><br />
                "None" would simply load no style at all, while "Custom" requires an external css file specified with the "customCss" option.
              </td>
            </tr>
            <tr id="inline">
              <th scope="row">inline</th>
              <td><em>Boolean</em><br /><br /><span class="label">Default:</span>False</td>
              <td>
                This option would render the button inline instead of the default block style.<br /><br />
                <RouterLink :to="{ name: 'examples', hash: '#7', params: { locale } }">{{ t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></RouterLink>
              </td>
            </tr>
            <tr id="customcss">
              <th scope="row">customCss</th>
              <td><em>String</em><br /><br /><span class="format">URL</span></td>
              <td>
                You can load an external css file instead of using and customizing the integrated one.<br />
                Define the url of the file here and set the buttonStyle option to "custom".<br /><br />
                <RouterLink :to="{ name: 'advanced-use', hash: '#1', params: { locale } }">{{ t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></RouterLink>
              </td>
            </tr>
            <tr id="buttonslist">
              <th scope="row">buttonsList</th>
              <td><em>Boolean</em><br /><br /><span class="label">Default:</span>False</td>
              <td>
                Activating this option would render one button per calendar type instead of the button + list.<br /><br />
                <RouterLink :to="{ name: 'examples', hash: '#9', params: { locale } }">{{ t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></RouterLink>
              </td>
            </tr>
            <tr id="label">
              <th scope="row">label</th>
              <td><em>String</em><br /><br /><span class="label block">Default:</span>Add to Calendar</td>
              <td>This option overrides the text at the button.</td>
            </tr>
            <tr id="trigger">
              <th scope="row">trigger</th>
              <td><em>String</em><br /><br /><span class="label block">Options:</span>hover, click<br /><br /><span class="label">Default:</span>hover</td>
              <td>
                Multiple calendar types as dropdown or overlay list, unfold on hover.<br />
                If you want them to get triggered on click, you can specify this with this option.
              </td>
            </tr>
            <tr id="liststyle">
              <th scope="row">listStyle</th>
              <td><em>String</em><br /><br /><span class="label block">Options:</span>dropdown, dropdown-static, overlay, modal<br /><br /><span class="label">Default:</span>dropdown</td>
              <td>
                The calendar type list can be rendered as dropdown, overlay, or modal.<br /><br />
                The default dropdown style also considers the position of the button on the screen. Use "dropdown-static" to always open below the button, no matter the screen.
              </td>
            </tr>
            <tr id="hidebackground">
              <th scope="row">hideBackground</th>
              <td><em>Boolean</em><br /><br /><span class="label">Default:</span>False</td>
              <td>With this option, you get a fully transparent background instead of the darker blurry one.</td>
            </tr>
            <tr id="hideiconbutton">
              <th scope="row">hideIconButton</th>
              <td><em>Boolean</em><br /><br /><span class="label">Default:</span>False</td>
              <td>This option hides the icon at the button.</td>
            </tr>
            <tr id="hideiconlist">
              <th scope="row">hideIconList</th>
              <td><em>Boolean</em><br /><br /><span class="label">Default:</span>False</td>
              <td>This option hides the icons at the calendar type list.</td>
            </tr>
            <tr id="hideiconmodal">
              <th scope="row">hideIconModal</th>
              <td><em>Boolean</em><br /><br /><span class="label">Default:</span>False</td>
              <td>This option hides the heading icon at any info modal.</td>
            </tr>
            <tr id="hidetextlabelbutton">
              <th scope="row">hideTextLabelButton</th>
              <td><em>Boolean</em><br /><br /><span class="label">Default:</span>False</td>
              <td>This option hides the text label at the button.</td>
            </tr>
            <tr id="hidetextlabellist">
              <th scope="row">hideTextLabelList</th>
              <td><em>Boolean</em><br /><br /><span class="label">Default:</span>False</td>
              <td>This option hides any text at the calendar type list.</td>
            </tr>
            <tr id="hidecheckmark">
              <th scope="row">hideCheckmark</th>
              <td><em>Boolean</em><br /><br /><span class="label">Default:</span>False</td>
              <td>Clicking an option marks the event as "saved" by adding a checkmark icon. This is not the case, if the button's text labels are turned off, you use the buttonsList option, or when using atcb_action. Set this option to disable it in all other cases too.</td>
            </tr>
            <tr id="size">
              <th scope="row">size</th>
              <td><em>String</em><br /><br /><span class="format">X|X|X</span><br /><br /><span class="label">Default:</span>6|6|6</td>
              <td>
                Specify a number between 0 and 10 to scale the button.<br /><br />
                You can define one number like "5" or up to 3 values like "8|6|4", where the first one will apply to large, the second to medium, and the third to small screens.<br />If you provide two, it will be for large and medium+small screens.
              </td>
            </tr>
            <tr id="lightmode">
              <th scope="row">lightMode</th>
              <td><em>String</em><br /><br /><span class="label block">Options:</span>system, dark, light, bodyScheme<br /><br /><span class="label">Default:</span>light</td>
              <td>
                Each button comes with a dark and light mode.<br /><br />
                Set the option lightMode to "dark" or "light" explicitly, or use "system" to automatically adapt to the user's default setting.<br />
                You can also use "bodyScheme" to look for the class "atcb-dark" at the html or body tag and connect the button dynamically to the style of your website.
              </td>
            </tr>
            <tr id="language">
              <th scope="row">language</th>
              <td><em>String</em><br /><br /><span class="label block">Options:</span>en, de, nl, fr, es, pt, tr, zh, ar, hi, pl, id, no, fi, sv, cs, ja, it, ko, vi<br /><br /><span class="label">Default:</span>en</td>
              <td>
                If you want to have the text blocks in another language than English, you can use the included translations (i18n).<br /><br />
                Simply set one of the supported languages as <a href="https://www.w3schools.com/tags/ref_language_codes.asp" target="_blank" rel="noopener">ISO 639-1 code <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a>. If you provide a full
                language+country code, the script automatically only takes the first two characters.<br />Also supports Right-to-Left (RTL) with Arabic.
              </td>
            </tr>
            <tr id="customlabels">
              <th scope="row">customLabels</th>
              <td><em>Stringified Object</em></td>
              <td>
                For all text blocks, which are not already customizable via other options (like the "Close" at the modal), you can specify the "customLabels" option.<br />
                There, you need to specify a JSON structure and define any text you want to override. Check the
                <a href="https://github.com/add2cal/add-to-calendar-button/blob/main/src/atcb-i18n.js" target="_blank" rel="noopener">atcb-i18n.js file <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></a> for the available keys. Mind to transform those
                keys to lower case strings without any whitespaces!<br />
                Any custom label will also override any translation.<br />You can use the same HTML pseudo tags as with the description option here.<br /><br />
                <RouterLink :to="{ name: 'advanced-use', hash: '#4', params: { locale } }">{{ t('labels.example') }} <ArrowRightIcon class="-mt-0.5 mr-0.5 inline-block h-3 w-3" aria-hidden="true" /></RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 id="additional-parameters" class="mt-12 pt-4">Additional parameters</h3>
      <div class="my-8 overflow-x-auto rounded-lg shadow-sm">
        <table>
          <thead>
            <tr>
              <th scope="col" class="py-3 px-3 font-semibold sm:px-5">Name<span class="block pt-1 normal-case md:hidden">(Value)</span></th>
              <th scope="col" class="hidden py-3 px-3 font-semibold sm:px-5 md:table-cell">Value</th>
              <th scope="col" class="py-3 px-3 font-semibold sm:px-5">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr id="images">
              <th scope="row">images</th>
              <td><em>Stringified Array</em><br /><br /><span class="format">URLs</span></td>
              <td>
                Images are used to enrich the rich data and therefore how an event might appear, for example, at the Google search results.<br />
                It is recommended to define at least 1 image via an absolute url with at least 720px width.<br />
                Ideally, you specify 3 images with a width of 1920px each. One with an aspect ration 1x1, one with 4x3, and one with 16x9. If not set, a default fallback image will be used.
              </td>
            </tr>
            <tr id="hiderichdata">
              <th scope="row">hideRichData</th>
              <td><em>Boolean</em><br /><br /><span class="label">Default:</span>False</td>
              <td>
                If you set at least a name, startDate, and location, the script automatically generates schema.org rich data when rendering a button.<br />
                Setting this option would disable the feature.
              </td>
            </tr>
            <tr id="identifier">
              <th scope="row">identifier</th>
              <td><em>String</em><br /><br /><span class="label block">Default:</span>Ascending number</td>
              <td>
                Each generated button and option has a speaking ID to be used for any tracking methods.<br />
                Scheme: "atcb-btn-IDENTIFIER" or "atcb-btn-IDENTIFIER-google" (for the Google option) respectively.<br />
                The IDENTIFIER will be an ascending number, but can be overridden by providing the option "identifier" (no special characters allowed; needs to be unique).
              </td>
            </tr>
            <tr id="bypasswebviewcheck">
              <th scope="row">bypassWebViewCheck</th>
              <td><em>Boolean</em><br /><br /><span class="label">Default:</span>False</td>
              <td>
                For users loading the button on their iPhone within a WebView environment (e.g. the Instagram Browser), we are not able to directly offer the ics file for download.<br />
                Therefore, we show a small instruction note on how to do it instead.<br />
                If you are using the button in your own app, where you actively allow the download of ics files in the default browser and are also providing the file explicitely with the icsFile option, you can bypass this workaround with the option bypassWebViewCheck.
              </td>
            </tr>
            <tr id="hidebranding">
              <th scope="row">hideBranding</th>
              <td><em>Boolean</em><br /><br /><span class="label">Default:</span>False</td>
              <td>
                Per default, there is a slight branding.<br />
                This supports the open-source project.<br /><br />
                If you do not want to support this project, you can set this option to remove the branding and still comply with the underyling license.
              </td>
            </tr>
            <tr id="debug">
              <th scope="row">debug</th>
              <td><em>Boolean</em><br /><br /><span class="label">Default:</span>False</td>
              <td>Setting this option would put any misconfiguration into the browser's JavaScript console and also render an error instead of the calendar.<br />Helpful while implementing the calendar the first time.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-14 border-t border-zinc-300 pt-14 dark:border-zinc-700">
        <div class="mx-auto grid grid-cols-1 gap-12 md:grid-cols-3">
          <div class="next-group">
            <p class="next-text">Let's directly test most of the options at our playground!</p>
            <RouterLink class="button-primary next-button" v-if="locale=='en'" :to="{ name: 'home', hash: '#demo', params: { locale } }">
              {{ t('labels.startPlaying') }}
              <ArrowRightIcon class="next-icon" aria-hidden="true" />
            </RouterLink>
            <RouterLink class="button-primary next-button" v-if="locale!='en'" :to="{ name: 'home-i18n', hash: '#demo', params: { locale } }">
              {{ t('labels.startPlaying') }}
              <ArrowRightIcon class="next-icon" aria-hidden="true" />
            </RouterLink>
          </div>
          <div class="next-group">
            <p class="next-text">Or explore more specific examples.</p>
            <RouterLink class="button-secondary next-button" :to="{ name: 'examples', params: { locale } }">
              {{ t('labels.exploreExamples') }}
              <ArrowRightIcon class="next-icon" aria-hidden="true" />
            </RouterLink>
          </div>
          <div class="next-group">
            <p class="next-text">For the edge cases, you can check the "danger zone".</p>
            <RouterLink class="button-secondary next-button" :to="{ name: 'advanced-use', params: { locale } }">
              {{ t('navigation.advanced-use') }}
              <ArrowRightIcon class="next-icon" aria-hidden="true" />
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
    <div class="hidden border-l border-zinc-300 pl-8 text-sm dark:border-zinc-700 lg:block">
      <div class="sticky top-0 pt-4">
        <ConfigSearch class="mb-10" />
        <a href="#event-parameters" class="side-nav">Event parameters</a>
        <a href="#style-parameters" class="side-nav">Style parameters</a>
        <a href="#additional-parameters" class="side-nav">Additional parameters</a>
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
  @apply flex p-3 font-semibold sm:p-5 md:table-cell text-base md:text-sm;
  vertical-align: top;
}

tbody tr td {
  @apply flex flex-col p-3 pt-0 sm:p-5 sm:pt-0 md:table-cell md:pt-5;
  vertical-align: top;
}

tbody tr td+td {
  @apply pt-3 sm:table-cell sm:p-5 sm:pt-5;
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
