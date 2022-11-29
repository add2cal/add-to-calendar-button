<script setup lang="ts">
import { ref } from 'vue';
import LightModeSwitch from "@/components/LightModeSwitch.vue";
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';
import "add-to-calendar-button";
import CodeBlock from "@/components/CodeBlock.vue";
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

const showCode = ref(false);
</script>

<template>
  <div
    class="grid grid-cols-2 rounded-t-md border-2 border-zinc-400 shadow-lg dark:border-zinc-600 lg:grid-cols-3"
  >
    <div id="date-input" class="rounded-tl-md bg-zinc-200 p-3 dark:bg-zinc-800">
      <div
        class="mb-4 text-sm font-semibold uppercase text-zinc-400 dark:text-zinc-600"
      >
        {{ t('labels.dateInput') }}
      </div>
      Input fields ...
    </div>
    <div
      id="rendering"
      class="row-span-2 flex justify-center border-l-2 border-zinc-400 bg-zinc-100 px-3 py-8 dark:border-zinc-600 dark:bg-zinc-900 lg:row-span-1"
    >
      <add-to-calendar-button
        name="Demo-Button"
        options="'Apple','Google','iCal','Outlook.com','Yahoo'"
        startDate="2023-02-14"
        startTime="10:15"
        endTime="23:30"
        timeZone="Europe/Berlin"
        lightMode="bodyScheme"
        buttonStyle="round"
      ></add-to-calendar-button>
    </div>
    <div
      id="style-input"
      class="border-l-0 border-t-2 border-zinc-400 bg-zinc-200 p-3 dark:border-zinc-600 dark:bg-zinc-800 lg:rounded-tr-md lg:border-t-0 lg:border-l-2"
    >
      <div
        class="mb-4 flex justify-between text-sm font-semibold uppercase text-zinc-400 dark:text-zinc-600"
      >
        <span>{{ t('labels.layoutInput') }}</span>
        <LightModeSwitch />
      </div>
      Input fields ...
    </div>
  </div>
  <div
    id="code-output"
    :class="[ !showCode ? 'bg-zinc-300 dark:bg-zinc-800' : 'bg-zinc-200 dark:bg-zinc-800' ]"
    class="rounded-b-md border-2 border-t-0 border-zinc-400 p-2 shadow-lg dark:border-zinc-600"
  >
    <div
      class="cursor-pointer text-center text-sm font-semibold text-zinc-500 hover:text-black dark:text-zinc-500 dark:hover:text-secondary"
      @click="showCode = !showCode"
    >
      <span :class="{ hidden: showCode }"
        ><EyeIcon
          class="-mt-1 mr-2 inline-block h-5 w-5"
          aria-hidden="true"
        />{{ t('labels.showCode') }}</span
      >
      <span :class="{ hidden: !showCode }"
        ><EyeSlashIcon
          class="-mt-1 mr-2 inline-block h-5 w-5"
          aria-hidden="true"
        />{{ t('labels.hideCode') }}</span
      >
    </div>
    <div :class="{ hidden: !showCode }" class="m-2 mt-3">
      <CodeBlock class="line-numbers">
        <pre>
&lt;!-- Just some sample code, which should be dynamically generated later... --&gt;
&lt;!-- We might be able to not use the &lt;pre&gt; here when dynamically generating it... --&gt;
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
    </div>
  </div>
</template>
