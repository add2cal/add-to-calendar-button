<script setup lang="ts">
import View_DE from "@/components/translated/SeoView-de.vue";
import FeaturesBlock from "@/components/FeaturesBlock.vue";
import "add-to-calendar-button";
import { ArrowRightIcon, WrenchScrewdriverIcon, BeakerIcon, MagnifyingGlassIcon, RocketLaunchIcon } from '@heroicons/vue/24/outline';
import { RouterLink } from "vue-router";
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();

const today = new Date();
const nextDay = new Date();
nextDay.setDate(today.getDate() + 3);
const defaultDate = nextDay.getFullYear() + '-' + ('0' + (nextDay.getMonth() + 1)).slice(-2) + '-' + ('0' + nextDay.getDate()).slice(-2);
</script>

<template>
  <View_DE v-if="locale=='de'" />
  <div v-else>
    <h1 class="mb-16 underline decoration-primary-light decoration-4 dark:decoration-primary-dark">What is an Add to Calendar Button?</h1>
    <h2 class="mb-10">Options to get events saved</h2>
    <p>
      Adding events to your calendar can help keep you organized and up-to-date on upcoming tasks, commitments, and events. However, manually entering events into your calendar can often be tedious and time-consuming.<br />
      Thankfully, there are several ways to save events to your calendar quickly and easily.
    </p>
    <h3 class="mb-3 mt-6">A. Add to Calendar Button</h3>
    <p>
      One of the most popular methods to save events to a calendar is by utilizing an <span class="font-semibold">add to calendar button</span>.<br />
      These buttons enable one-click importing directly from your website or event registration form, allowing users to quickly and easily add an event to their preferred calendar application.<br />
      By eliminating the need for manual entry and integrations, add to calendar buttons can help to save time and costs associated with calendar-related processes.
    </p>
    <h3 class="mb-3 mt-6">B. Deep Integration</h3>
    <p>
      Another convenient way to save events to a calendar is by <span class="font-semibold">integrating</span> a third-party calendar application to the respective tool or website.<br />
      Popular calendar applications such as Apple Calendar, Google Calendar, and Outlook Calendar can be integrated to automatically save events.<br />
      While this is extremely stable, it requires way more setup than a simple add to calendar button. In addition, it can have highly negative effects on the user experience (UX), when the user is required to allow another tool access to such sensitive information like the personal calendar.<br />
      As long as your application is not already connected to such or similar information out of other reasons, it is usually not recommendable to add any functionality promting the user to confirm the connection to his personal information.<br />
      Besides the UX issue, you might even not want this as the owner of the application, website, or tool, since such a process would come with a lot of privacy issues (GDPR, CCPA, and LGPD calling).
    </p>
    <h3 class="mb-3 mt-6">C. Manually</h3>
    <p>
      A third option for calendar users to save events is by <span class="font-semibold">manually copying</span> and pasting the event details into their chosen calendar program.<br />
      This obviously is not very convenient, as it is time-consuming and yields inconsistent results.<br />
      From a technical perspective, you could still support this process by making it easy to copy information via a "copy button". However, even this breaks the process in many ways, since you cannot be sure which format the user requires.
    </p>
    <p>
      Add to calendar buttons, integrations, and manual copy/paste each provide a viable way for to ensure that important meetings, tasks, and events are never forgotten.<br />
      The convenience and ease of use associated with add to calendar buttons makes them a popular choice for businesses that need to keep customers updated and make sure events take place as planned. For companies, marketing campaigns, and events that rely on customer success, add to calendar
      buttons are an invaluable tool that can help to keep customers organized and up-to-date.
    </p>
    <h2 class="mb-10 mt-16">Effort of implementing an Add to Calendar Button</h2>
    <p>
      The effort of implementing an Add to Calendar Button can be broken down into two main components: technical integration, and marketing.<br />
      Technical integration is essential to understand the technical requirements of adding an Add to Calendar button to your business's website.<br />
      Marketers must understand what customers are looking for in such a feature, and how to best promote it.
    </p>

    <p>
      First, the technical component of integrating an Add to Calendar button requires some programming knowledge.<br />
      The ability to embed code into the website and to link to third-party calendar systems will be needed. You'll need to choose from a variety of calendar systems, such as Google Calendar, Apple Calendar, Outlook, and Yahoo Calendar.<br />
      Depending on the computer language used to create the website, different coding techniques could be used. Once the code is added to the website, testing and debugging will need to take place to ensure the button works as expected.
    </p>

    <p>
      Second, the marketing component of an Add to Calendar Button involves increasing awareness about the feature and the benefits.<br />
      The main focus should be on educating customers on how easy and convenient it is to click an Add to Calendar button versus manually entering the event information into their calendar.<br />
      Promoting this feature through blog posts, email campaigns, social media posts, and even ads should be considered. By studying customer feedback, it'll be easier to assess what works best and what doesn't in terms of increasing customer engagement.
    </p>

    <p>
      An important part of the implementation of this feature is understanding the cost of such a process!<br />
      Many of the systems used will require a solution provider, and cost can vary depending on several factors. Some providers offer free, or even open-source, calendars which could reduce cost. However, with custom coding and integration, the amount of time and effort can cause the cost of
      implementation to increase greatly.
    </p>

    <p>
      Finally, there's the potential to expand the use of an Add to Calendar Button by creating other features such as SMS integration, or even expanding the availability to different devices.<br />
      In any case, the bottom line is that it's worth the effort to implement this feature as it can provide customers with an easier, more convenient way of scheduling events.<br />
      Plus, it can potentially lead to improved customer success and lower customers' expectations. Consider investing in implementing an Add to Calendar Button in your business' website to provide customers with an enhanced user experience.
    </p>
    <h2 class="mb-10 mt-16">Worried about cost and effort?</h2>
    <p class="font-semibold">Luckily, with the Add to Calendar solution, presented on this website, you can save a lot of cost and are facing almost no technical effort!</p>
    <p>The solution is designed to be usable without a lot of technical knowledge within only a few minutes - compatible with almost any modern web tech stack!</p>
    <p>
      Check out the interactive demo as well as integration guides and examples!<br />
      We are here to help and provide you with the best state-of-the-art add to calendar soltuion - boosting your business!
    </p>
  </div>
  <div class="mt-16 mb-16 flex flex-col justify-center gap-8 border-b border-zinc-300 pb-14 dark:border-zinc-700 md:flex-row lg:gap-12">
    <RouterLink class="button-primary w-56 self-center" v-if="locale=='en'" :to="{ name: 'home', hash: '#demo', params: { locale } }">
      <BeakerIcon class="-mt-0.5 mr-2 inline-block h-4 w-4 md:hidden lg:inline-block" aria-hidden="true" />
      {{ t('labels.demo') }}
      <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true" />
    </RouterLink>
    <RouterLink class="button-primary w-56 self-center" v-else :to="{ name: 'home-i18n', hash: '#demo', params: { locale } }">
      <BeakerIcon class="-mt-0.5 mr-2 inline-block h-4 w-4 md:hidden lg:inline-block" aria-hidden="true" />
      {{ t('labels.demo') }}
      <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true" />
    </RouterLink>
    <RouterLink class="button-secondary w-56 self-center" v-if="locale=='en'" :to="{ name: 'home', hash: '#installation', params: { locale } }">
      <WrenchScrewdriverIcon class="-mt-0.5 mr-2 inline-block h-4 w-4 md:hidden lg:inline-block" aria-hidden="true" />
      {{ t('navigation.installation') }}
      <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true" />
    </RouterLink>
    <RouterLink class="button-secondary w-56 self-center" v-else :to="{ name: 'home-i18n', hash: '#installation', params: { locale } }">
      <WrenchScrewdriverIcon class="-mt-0.5 mr-2 inline-block h-4 w-4 md:hidden lg:inline-block" aria-hidden="true" />
      {{ t('navigation.installation') }}
      <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true" />
    </RouterLink>
    <RouterLink class="button-secondary w-56 self-center" :to="{ name: 'examples', params: { locale } }">
      <MagnifyingGlassIcon class="-mt-0.5 mr-2 inline-block h-4 w-4 md:hidden lg:inline-block" aria-hidden="true" />
      {{ t('navigation.examples') }}
      <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true" />
    </RouterLink>
  </div>
  <h2 class="mt-16">{{ t('content.seo.features_headline_1') }}</h2>
  <h2 class="mb-10 mt-2">{{ t('content.seo.features_headline_2') }} ...</h2>
  <FeaturesBlock />
  <div class="text-center">
    <h2 class="mb-10 mt-20">... {{ t('content.seo.example') }}</h2>
    <div class="grid-bg flex w-full justify-center rounded-lg py-16 shadow-lg">
      <add-to-calendar-button
        :name="t('demo_data.name')"
        :startDate="defaultDate"
        startTime="10:15"
        endTime="23:30"
        timeZone="currentBrowser"
        :location="t('demo_data.url')"
        :description="t('demo_data.description')"
        options="'Apple','Google','iCal','Outlook.com','Microsoft 365','Microsoft Teams','Yahoo'"
        lightMode="bodyScheme"
        buttonStyle="round"
        size="8"
        :language="locale"
      ></add-to-calendar-button>
    </div>
    <p class="mt-10 italic">{{ t('content.seo.example_disclaimer') }}</p>
  </div>
  <div class="pt-24 pb-8 text-center">
    <RouterLink
      class="max-w-xl rounded-xl bg-gradient-to-tr from-secondary via-secondary to-secondary-light py-8 px-12 text-center text-xl font-semibold text-zinc-700 shadow-md hover:via-secondary-light hover:to-secondary-light hover:text-black hover:no-underline hover:shadow-xl"
      v-if="locale=='en'"
      :to="{ name: 'home', params: { locale } }"
    >
      <RocketLaunchIcon class="-mt-0.5 mr-3 inline-block h-8 w-8" aria-hidden="true" />
      {{ t('labels.clickHereLearnMore') }}
      <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true" />
    </RouterLink>
    <RouterLink
      class="hmax-w-xl rounded-xl bg-gradient-to-tr from-secondary via-secondary to-secondary-light py-8 px-12 text-center text-xl font-semibold text-zinc-700 shadow-md hover:via-secondary-light hover:to-secondary-light hover:text-black hover:no-underline"
      v-else
      :to="{ name: 'home-i18n', params: { locale } }"
    >
      <RocketLaunchIcon class="-mt-0.5 mr-3 inline-block h-8 w-8" aria-hidden="true" />
      {{ t('labels.clickHereLearnMore') }}
      <ArrowRightIcon class="-mt-0.5 ml-2 inline-block h-4 w-4" aria-hidden="true" />
    </RouterLink>
  </div>
</template>
