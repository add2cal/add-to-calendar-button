<script setup lang="ts">
import CodeBlock from "@/components/CodeBlock.vue";
import NextSteps from "@/components/integration/NextSteps.vue";
import GuideSidebar from "@/components/integration/GuideSidebar.vue";
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';

const today = new Date();
const nextDay = new Date();
nextDay.setDate(today.getDate() + 3);
const defaultDate = nextDay.getFullYear() + '-' + ('0' + (nextDay.getMonth() + 1)).slice(-2) + '-' + ('0' + nextDay.getDate()).slice(-2);
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_192px]">
    <div class="pr-0 lg:pr-8 xl:pr-12 2xl:pr-20">
      <h1 class="mb-16 underline decoration-primary-light decoration-4 dark:decoration-primary-dark">How to use the Add to Calendar Button with WordPress</h1>
      <div class="px-0 md:px-3 lg:px-5">
        <h2 class="mb-6">Step 1: Install the plugin</h2>
        <p>
          Install the <a href="https://wordpress.org/plugins/add-to-calendar-button" target="_blank" rel="noopener">official package from the WordPress Plugin Directory. <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-4 w-4" aria-hidden="true" /></a>
        </p>
        <ul class="my-4 list-disc pl-6">
          <li class="text-left">You can find it directly from the "Plugins" page within your admin dashboard. Search for "Add to Calendar Button"</li>
          <li class="mt-3 text-left">
            Alternatively, you can
            <a href="https://wordpress.org/plugins/add-to-calendar-button" target="_blank" rel="noopener">download it here <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-4 w-4" aria-hidden="true" /></a>, upload the zip file OR unzip and upload the plugin manually into your
            <span class="font-semibold italic">wp-content/plugins/</span>
            directory
          </li>
        </ul>
        <h2 class="mt-20 mb-6">Step 2: Activate it</h2>
        <p>At the "Plugins" page, activate the plugin.</p>
        <h2 class="mt-20 mb-6">Step 3: Use it</h2>
        <h3 class="mb-6">A: Shortcode</h3>
        <p>You can simply use the shortcode <code>[add-to-calendar-button]</code> and add the attributes directly to it like this:</p>
        <CodeBlock>
          <pre>[add-to-calendar-button name="Title" options="'Apple','Google'" startDate="{{defaultDate}}"]</pre>
        </CodeBlock>
        <h3 class="mt-12 mb-6">B: Block</h3>
        <p>Alternatively, you can simply use the "Block" within the WordPress Gutenberg Block Editor.</p>
        <ol class="my-6 list-decimal pl-8">
          <li>Add a new block and search for "Add to Calendar Button".</li>
          <li class="mt-3">Click at the appearing button.</li>
          <li class="mt-3">Add the attributes of your choice at the input on the right side "Block" settings.</li>
        </ol>
        <p class="pt-6 font-semibold italic">Yes, it is that simple.</p>
        <div class="mt-14 border-t border-zinc-300 dark:border-zinc-700"></div>
        <NextSteps />
      </div>
    </div>
    <div class="hidden border-l border-zinc-300 pl-8 text-xs dark:border-zinc-700 lg:block xl:pl-12">
      <GuideSidebar stack="wordpress" />
    </div>
  </div>
</template>
