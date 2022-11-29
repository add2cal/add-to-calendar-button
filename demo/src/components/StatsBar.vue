<script setup lang="ts">
import { StarIcon, CogIcon, PresentationChartLineIcon, BoltIcon, TagIcon } from '@heroicons/vue/20/solid';

// get numbers directly (but asynch!) from https://api.npms.io/v2/package/add-to-calendar-button (installations total + weekly, stars, version, update)
// and https://data.jsdelivr.com/v1/package/npm/add-to-calendar-button/stats (monthly jsdelivr hits)
</script>

<template>
  <div class="bg-zinc-600 dark:bg-zinc-700">
    <div
      class="relative mx-auto flex w-full max-w-screen-2xl overflow-x-hidden"
    >
      <div class="z-10 bg-zinc-600 p-2 pr-3 dark:bg-zinc-700">
        <div
          class="rounded-md bg-red-700 py-1 px-2 text-xs font-semibold text-white shadow motion-safe:animate-pulse"
        >
          <span class="hidden xl:inline">Verifiable Statistics</span>
          <span class="inline xl:hidden">Statistics</span>
        </div>
      </div>
      <div
        class="z-10 w-10 bg-gradient-to-r from-zinc-600 to-transparent p-2 dark:from-zinc-700"
      ></div>

      <div class="flex animate-marquee space-x-10 whitespace-nowrap">
        <a
          target="_blank"
          rel="noopener"
          href="https://github.com/add2cal/add-to-calendar-button"
          class="flex self-center text-xs text-zinc-300"
        >
          <StarIcon
            class="mr-1 -mt-0.5 inline-block h-3 w-3 self-center"
          />1.234<span class="pl-1 text-zinc-400">GitHub Stars</span>
        </a>
        <a
          target="_blank"
          rel="noopener"
          href="https://www.npmjs.com/package/add-to-calendar-button"
          class="flex self-center text-xs text-zinc-300"
        >
          <CogIcon
            class="mr-1 -mt-0.5 inline-block h-3 w-3 self-center"
          />255.254<span class="pl-1 text-zinc-400"
            >total npm Installations</span
          >
        </a>
        <a
          target="_blank"
          rel="noopener"
          href="https://www.npmjs.com/package/add-to-calendar-button"
          class="flex self-center text-xs text-zinc-300"
        >
          <CogIcon
            class="mr-1 -mt-0.5 inline-block h-3 w-3 self-center"
          />9.254<span class="pl-1 text-zinc-400"
            >weekly npm Installations</span
          >
        </a>
        <a
          target="_blank"
          rel="noopener"
          href="https://www.jsdelivr.com/package/npm/add-to-calendar-button"
          class="flex self-center text-xs text-zinc-300"
        >
          <PresentationChartLineIcon
            class="mr-1 -mt-0.5 inline-block h-3 w-3 self-center"
          />1.255.254<span class="pl-1 text-zinc-400">monthly CDN hits</span>
        </a>
        <a
          target="_blank"
          rel="noopener"
          href="https://github.com/add2cal/add-to-calendar-button"
          class="flex self-center text-xs text-zinc-300"
        >
          <TagIcon class="mr-1 -mt-0.5 inline-block h-3 w-3 self-center" /><span
            class="pr-1 text-zinc-400"
            >latest version:</span
          >v2.13.14
        </a>
        <a
          target="_blank"
          rel="noopener"
          href="https://github.com/add2cal/add-to-calendar-button"
          class="flex self-center text-xs text-zinc-300"
        >
          <BoltIcon
            class="mr-1 -mt-0.5 inline-block h-3 w-3 self-center"
          /><span class="pr-1 text-zinc-400">last update:</span>12/24/2022
        </a>
      </div>

      <div
        class="absolute top-3 left-56 flex animate-marquee2 space-x-10 whitespace-nowrap"
      >
        <a
          target="_blank"
          rel="noopener"
          href="https://github.com/add2cal/add-to-calendar-button"
          class="flex self-center text-xs text-zinc-300"
        >
          <StarIcon
            class="mr-1 -mt-0.5 inline-block h-3 w-3 self-center"
          />1.234<span class="pl-1 text-zinc-400">GitHub Stars</span>
        </a>
        <a
          target="_blank"
          rel="noopener"
          href="https://www.npmjs.com/package/add-to-calendar-button"
          class="flex self-center text-xs text-zinc-300"
        >
          <CogIcon
            class="mr-1 -mt-0.5 inline-block h-3 w-3 self-center"
          />255.254<span class="pl-1 text-zinc-400"
            >total npm Installations</span
          >
        </a>
        <a
          target="_blank"
          rel="noopener"
          href="https://www.npmjs.com/package/add-to-calendar-button"
          class="flex self-center text-xs text-zinc-300"
        >
          <CogIcon
            class="mr-1 -mt-0.5 inline-block h-3 w-3 self-center"
          />9.254<span class="pl-1 text-zinc-400"
            >weekly npm Installations</span
          >
        </a>
        <a
          target="_blank"
          rel="noopener"
          href="https://www.jsdelivr.com/package/npm/add-to-calendar-button"
          class="flex self-center text-xs text-zinc-300"
        >
          <PresentationChartLineIcon
            class="mr-1 -mt-0.5 inline-block h-3 w-3 self-center"
          />1.255.254<span class="pl-1 text-zinc-400">monthly CDN hits</span>
        </a>
        <a
          target="_blank"
          rel="noopener"
          href="https://github.com/add2cal/add-to-calendar-button"
          class="flex self-center text-xs text-zinc-300"
        >
          <TagIcon class="mr-1 -mt-0.5 inline-block h-3 w-3 self-center" /><span
            class="pr-1 text-zinc-400"
            >latest version:</span
          >v2.13.14
        </a>
        <a
          target="_blank"
          rel="noopener"
          href="https://github.com/add2cal/add-to-calendar-button"
          class="flex self-center text-xs text-zinc-300"
        >
          <BoltIcon
            class="mr-1 -mt-0.5 inline-block h-3 w-3 self-center"
          /><span class="pr-1 text-zinc-400">last update:</span>12/24/2022
        </a>
      </div>
    </div>
  </div>
</template>
