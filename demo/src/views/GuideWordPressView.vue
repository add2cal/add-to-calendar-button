<script setup lang="ts">
import CodeBlock from "@/components/CodeBlock.vue";
import NextSteps from "@/components/integration/NextSteps.vue";
import GuideSidebar from "@/components/integration/GuideSidebar.vue";
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_192px]">
    <div class="pr-0 lg:pr-8 xl:pr-12 2xl:pr-20">
      <h1 class="mb-16 underline decoration-primary-light decoration-4 dark:decoration-primary-dark">How to use the Add to Calendar Button with WordPress</h1>
      <div class="px-0 md:px-3 lg:px-5">
        <h2 class="mb-6">Step 1: Install the plugin</h2>
        <p>Install the official package from the WordPress Plugin Directory.</p>
        <ul class="my-4 list-disc pl-6">
          <li class="text-left">You can find it directly from the "Plugins" page within your admin dashboard.</li>
          <li class="mt-3 text-left">
            Alternatively, you can
            <a href="#" target="_blank" rel="noopener">download it here <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-4 w-4" aria-hidden="true" /></a>, upload the zip file OR unzip and upload the plugin manually into your
            <span class="font-semibold italic">wp-content/plugins/</span>
            directory
          </li>
        </ul>
        <h2 class="mt-20 mb-6">Step 2: Activate it</h2>
        <p>At the "Plugins" page, activate the plugin.</p>
        <h2 class="mt-20 mb-6">Step 3: Use it</h2>
        <p>Start using the Add to Calendar Button by TBD.</p>
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
        <NextSteps />
      </div>
    </div>
    <div class="hidden border-l border-zinc-300 pl-8 text-xs dark:border-zinc-700 lg:block xl:pl-12">
      <GuideSidebar stack="wordpress" />
    </div>
  </div>
</template>
