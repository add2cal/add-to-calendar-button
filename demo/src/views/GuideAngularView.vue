<script setup lang="ts">
import CodeBlock from "@/components/CodeBlock.vue";
import NextSteps from "@/components/integration/NextSteps.vue";
import GuideSidebar from "@/components/integration/GuideSidebar.vue";
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_192px]">
    <div class="pr-0 lg:pr-8 xl:pr-12 2xl:pr-20">
      <h1 class="mb-16 underline decoration-primary-light decoration-4 dark:decoration-primary-dark">How to use the Add to Calendar Button with Angular</h1>
      <div class="px-0 md:px-3 lg:px-5">
        <h2 class="mb-6">Step 1: npm installation</h2>
        <p>Install the package from the npm registry.</p>
        <CodeBlock><pre>npm install add-to-calendar-button</pre></CodeBlock>
        <h2 class="mt-20 mb-6">Step 2: Import it</h2>
        <p>Import the module into the component, where you want to use the button.</p>
        <CodeBlock language="javascript">
          <pre>import 'add-to-calendar-button';</pre>
        </CodeBlock>
        <h2 class="mt-20 mb-6">Step 3: Optimize the Angular config</h2>
        <p>
          To make Angular work properly with the Web Component, you need to import the
          <span class="font-semibold italic">CUSTOM_ELEMENTS_SCHEMA</span> and update the <span class="font-semibold italic">@NgModule</span> block respectively.
        </p>
        <CodeBlock language="javascript" class="line-numbers">
          <pre>
// app.module.ts

import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
//(...)

@NgModule({
  //(...),
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
//(...)</pre
          >
        </CodeBlock>
        <h2 class="mt-20 mb-6">Step 4: Use it</h2>
        <p>
          Start using the component by adding a
          <code>&lt;add-to-calendar-button&gt;</code> tag to your code - with the options as attributes.
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
        <NextSteps />
      </div>
    </div>
    <div class="hidden border-l border-zinc-300 pl-8 text-xs dark:border-zinc-700 lg:block xl:pl-12">
      <GuideSidebar stack="angular" />
    </div>
  </div>
</template>
