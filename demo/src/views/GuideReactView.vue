<script setup lang="ts">
import CodeBlock from "@/components/CodeBlock.vue";
import NextSteps from "@/components/integration/NextSteps.vue";
import GuideSidebar from "@/components/integration/GuideSidebar.vue";
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_192px]">
    <div class="pr-0 lg:pr-8 xl:pr-12 2xl:pr-20">
      <h1 class="mb-16 underline decoration-primary-light decoration-4 dark:decoration-primary-dark">How to use the Add to Calendar Button with React</h1>
      <div class="px-0 md:px-3 lg:px-5">
        <h2 class="mb-6">Step 0: Pick a solution</h2>
        <p>As React project can be very versatile, there are multiple potential ways to work with the Add to Calendar Button.</p>
        <ul class="my-4 list-disc pl-6">
          <li class="text-left">In rather basic projects, you can use the Web Component out-of-the-box.</li>
          <li class="mt-3 text-left">If you are using TypeScript, you would need to define a respective interface.</li>
          <li class="mt-3 text-left">
            In all cases, you could also use the
            <a href="https://github.com/add2cal/add-to-calendar-button-react" target="_blank" rel="noopener">official Add to Calendar Button React Wrapper <ArrowTopRightOnSquareIcon class="-mt-0.5 mr-0.5 inline-block h-4 w-4" aria-hidden="true" /></a>
            instead of the main script. This comes with a deeper TypeScript and React integration.
          </li>
        </ul>
        <p class="pt-5">We will highlight all options below.</p>
        <p class="italic">Choose your fighter!</p>
        <h2 class="mt-20 mb-6">Step 1: npm installation</h2>
        <h3 class="mb-6">Option A: Web Component</h3>
        <p>Install the package from the npm registry.</p>
        <CodeBlock><pre>npm install add-to-calendar-button</pre></CodeBlock>
        <h3 class="mt-12 mb-6">Option B: React Wrapper</h3>
        <p>If you rather go with the more specialized React Wrapper, install this package <span class="font-semibold">instead</span>.</p>
        <CodeBlock>
          <pre>npm install add-to-calendar-button-react</pre>
        </CodeBlock>
        <h2 class="mt-20 mb-6">Step 2: Import it</h2>
        <h3 class="mb-6">Option A: Web Component</h3>
        <p>Import the module into the component, where you want to use the button.</p>
        <CodeBlock language="javascript">
          <pre>import 'add-to-calendar-button';</pre>
        </CodeBlock>
        <h3 class="mt-12 mb-6">Option B: React Wrapper</h3>
        <p>With the React Wrapper implementation, the import statement looks a little bit different.</p>
        <CodeBlock language="javascript">
          <pre>import { AddToCalendarButton } from 'add-to-calendar-button-react';</pre>
        </CodeBlock>
        <h2 class="mt-20 mb-6">Step 3: Optimize the TypeScript config for the Web Component</h2>
        <p class="font-semibold">This step is only necessary if you are NOT using the React Wrapper AND if you are working with TypeScript!</p>
        <p>In this case, you would need to define a respective global JSX interface. You do this within a *.d.ts type file (like "global.d.ts"), which needs to be picked up by your tsconfig (there, you should specify the "typeRoots" option).</p>
        <CodeBlock language="javascript" class="line-numbers">
          <pre>
// global.d.ts

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['add-to-calendar-button']: CustomElement&lt;AddToCalendarButton&gt;;
    }
  }
}</pre
          >
        </CodeBlock>
        <h2 class="mt-20 mb-6">Step 4: Use it</h2>
        <h3 class="mb-6">Option A: Web Component</h3>
        <p>
          Start using the component by adding a
          <code>&lt;add-to-calendar-button&gt;</code> tag to your code - with the options as attributes.
        </p>
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
        <h3 class="mt-12 mb-6">Option B: React Wrapper</h3>
        <p>
          If you went for the React Wrapper, you would specify a button by using the
          <code>&lt;AddtoCalendarButton&gt;</code> tag instead. Basically, you then use the imported React component instead of the custom element (Web Component).
        </p>
        <p>Your code block would then look rather like this:</p>
        <CodeBlock language="javascript" class="line-numbers">
          <pre>
&lt;AddtoCalendarButton
  name="Title"
  options=['Apple','Google']
  location="World Wide Web"
  startDate="2023-02-14"
  endDate="2023-02-14"
  startTime="10:15"
  endTime="23:30"
  timeZone="Europe/Berlin"
&gt;&lt;/AddtoCalendarButton&gt;</pre
          >
        </CodeBlock>
        <p class="font-semibold">Mind that with the Wrapper approach, you can provide Array options as actual Arrays, while with the custom element, they also need to be Strings!</p>
        <p>Keep this style and specialties in mind when you look at more examples around here.<br />We focus on the Web Component approach, but this can always easily transferred to the React Wrapper style.</p>
        <h2 class="mt-24">Next:</h2>
        <NextSteps />
      </div>
    </div>
    <div class="hidden border-l border-zinc-300 pl-8 text-xs dark:border-zinc-700 lg:block xl:pl-12">
      <GuideSidebar stack="react" />
    </div>
  </div>
</template>
