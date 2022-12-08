<script setup lang="ts">
import CodeBlock from "@/components/CodeBlock.vue";
import { ArrowRightIcon, CodeBracketIcon } from '@heroicons/vue/24/outline';
import { RouterLink } from "vue-router";
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n();
</script>

<template>
  <div class="flex justify-between">
    <div class="flex-1 pr-0 lg:pr-8 xl:pr-12 2xl:pr-20">
      <h1 class="pb-16">How to install the Add to Calendar Button</h1>
      <div class="px-0 md:px-3 lg:px-5">
        <h2 class="mb-6">Step 1</h2>
        <p>
          Load the respective script by adding the following script tag to the
          <code>&lt;head&gt;</code> section of your website.<br />
          The script will be loaded in a non-blocking way. So you don't need to
          worry about where to include it exactly.
        </p>
        <CodeBlock>
          <pre>
&lt;script src="https://cdn.jsdelivr.net/npm/add-to-calendar-button@2" async defer&gt;&lt;/script&gt;</pre
          >
        </CodeBlock>
        <h2 class="mt-20 mb-6">Step 2</h2>
        <p>
          Start using it by adding a
          <code>&lt;add-to-calendar-button&gt;</code> tag to your HTML source
          code and add the options as attributes.
        </p>
        <p class="font-semibold italic">Yes, it is that simple.</p>
        <p>Your code block could look like the following:</p>
        <CodeBlock class="line-numbers">
          <pre>
&lt;add-to-calendar-button
  name="Title"
  options="'Apple','Google'"
  location="World Wide Web"
  startDate="2023-02-14"
  endDate="2023-02-14"
  startTime="10:15"
  endTime="23:30"
  timeZone="Europe/Berlin"
&gt;&lt;/add-to-calendar-button&gt;</pre
          >
        </CodeBlock>
        <p class="mt-20 mb-6">
          Check out the "Functionality" section for all configuration options.
        </p>
        <RouterLink
          class="button-primary"
          v-if="locale=='en'"
          :to="{ name: 'home', hash: '#features', params: { locale } }"
        >
          {{ t('labels.startConfiguring') }}
          <ArrowRightIcon
            class="-mt-0.5 ml-2 inline-block h-4 w-4"
            aria-hidden="true"
          />
        </RouterLink>
        <RouterLink
          class="button-primary"
          v-if="locale!='en'"
          :to="{ name: 'home-i18n', hash: '#features', params: { locale } }"
        >
          {{ t('labels.startConfiguring') }}
          <ArrowRightIcon
            class="-mt-0.5 ml-2 inline-block h-4 w-4"
            aria-hidden="true"
          />
        </RouterLink>
      </div>
    </div>
    <div
      class="hidden w-48 flex-none border-l border-zinc-300 pl-8 text-xs dark:border-zinc-700 lg:block xl:pl-12"
    >
      <CodeBracketIcon class="block w-24 pb-28" />
      <p>You are using Angular, React, Vue, or other frameworks?</p>
      <p class="font-semibold">Check out the "Installation" section!</p>
      <p>
        We have strong guides and solutions for all big frontend tech stacks as
        well as things like WordPress.
      </p>
    </div>
  </div>
</template>
