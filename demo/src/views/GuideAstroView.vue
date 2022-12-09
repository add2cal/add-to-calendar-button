<script setup lang="ts">
import CodeBlock from "@/components/CodeBlock.vue";
import NextSteps from "@/components/integration/NextSteps.vue";
import GuideSidebar from "@/components/integration/GuideSidebar.vue";
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_192px]">
    <div class="pr-0 lg:pr-8 xl:pr-12 2xl:pr-20">
      <h1 class="mb-16 underline decoration-primary-light decoration-4 dark:decoration-primary-dark">How to use the Add to Calendar Button with Astro</h1>
      <div class="px-0 md:px-3 lg:px-5">
        <h2 class="mb-6">Step 0: Pick a solution</h2>
        <p>For static site generators (SSG), we generally recommend to load the Add to Calendar Button script via CDN.<br />Alternatively, you can still use the npm package and include the module via an observer function</p>
        <p class="pt-5">We will highlight both options below.</p>
        <p class="italic">Choose your fighter!</p>
        <h2 class="mt-20 mb-6">Step 1: Setup</h2>
        <h3 class="mb-6">Option A: Include via CDN</h3>
        <p>
          Load the respective script by adding the following script tag to the
          <code>&lt;head&gt;</code> section of your website.<br />
          The script will be loaded in a non-blocking way.
        </p>
        <CodeBlock>
          <pre>&lt;script src="https://cdn.jsdelivr.net/npm/add-to-calendar-button@2" async defer&gt;&lt;/script&gt;</pre>
        </CodeBlock>
        <h3 class="mt-20 mb-6">Option B: Install the npm package</h3>
        <p>Alternatively, install the package from the npm registry.</p>
        <CodeBlock><pre>npm install add-to-calendar-button</pre></CodeBlock>
        <div class="mt-10 mb-6 font-bold">...and setup an Observer to load the script properly:</div>
        <CodeBlock class="line-numbers">
          <pre>
&lt;script type="module" hoist&gt;
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.disconnect();
      import('../../node_modules/add-to-calendar-button/dist/module/index.js');
    }
  });
  const instances = document.querySelectorAll('add-to-calendar-button');
  for (const instance of instances) observer.observe(instance);
&lt;/script&gt;</pre
          >
        </CodeBlock>
        <h2 class="mt-20 mb-6">Step 2: Use it</h2>
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
      <GuideSidebar stack="astro" />
    </div>
  </div>
</template>
