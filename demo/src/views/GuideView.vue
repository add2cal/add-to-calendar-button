<script setup lang="ts">
import CodeBlock from "@/components/CodeBlock.vue";
import NextSteps from "@/components/integration/NextSteps.vue";
import GuideSidebar from "@/components/integration/GuideSidebar.vue";

const today = new Date();
const nextDay = new Date();
nextDay.setDate(today.getDate() + 3);
const defaultDate = nextDay.getFullYear() + '-' + ('0' + (nextDay.getMonth() + 1)).slice(-2) + '-' + ('0' + nextDay.getDate()).slice(-2);
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_192px]">
    <div class="pr-0 lg:pr-8 xl:pr-12 2xl:pr-20">
      <h1 class="mb-16 underline decoration-primary-light decoration-4 dark:decoration-primary-dark">How to install the Add to Calendar Button</h1>
      <div class="px-0 md:px-3 lg:px-5">
        <h2 class="mb-6">Step 1: CDN setup</h2>
        <p>
          Load the respective script by adding the following script tag to the
          <code>&lt;head&gt;</code> section of your website.<br />
          The script will be loaded in a non-blocking way. So you don't need to worry about where to include it exactly.
        </p>
        <CodeBlock>
          <pre>&lt;script src="https://cdn.jsdelivr.net/npm/add-to-calendar-button@2" async defer&gt;&lt;/script&gt;</pre>
        </CodeBlock>
        <h2 class="mt-20 mb-6">Step 2: Use it</h2>
        <p>
          Start using it by adding a
          <code>&lt;add-to-calendar-button&gt;</code> tag to your HTML source code - with the options as attributes.
        </p>
        <p class="font-semibold italic">Yes, it is that simple.</p>
        <p>Your code block could look like the following:</p>
        <CodeBlock class="line-numbers">
          <pre>
&lt;add-to-calendar-button
  name="Title"
  options="'Apple','Google'"
  location="World Wide Web"
  startDate="{{defaultDate}}"
  endDate="{{defaultDate}}"
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
      <GuideSidebar />
    </div>
  </div>
</template>
