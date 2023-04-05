<script setup lang="ts">
import { get, set, LSKey } from '@/utils/localStorage';
import { mergeDeep } from '@/utils/array';
import MarqueeText from 'vue-marquee-text-component';

const data = ref({
  github: {
    stars: 1000,
  },
  npm: {
    totalInstallations: 200000,
    weeklyInstallations: 1
  },
  jsdelivr: {
    montlyHits: 1
  }
});

const isLoading = ref(false);
const marqueeKey = ref(0);

const githubRepoUrl = 'https://api.github.com/repos/add2cal/add-to-calendar-button';
const npmDownloadsUrl = 'https://api.npmjs.org/downloads/range/{start}:{end}/add-to-calendar-button';
const jsdelivrStatsUrl = 'https://data.jsdelivr.com/v1/package/npm/add-to-calendar-button/stats';

onMounted(() => {

  const cachedStats = get(LSKey.STATS);
  const cachedStatsParsed = (function () {
    if (cachedStats) {
      return JSON.parse(cachedStats);
    }
  })();

  if (cachedStatsParsed?.expireAt && cachedStatsParsed?.data) {
    data.value = mergeDeep(data.value, cachedStatsParsed.data);
    marqueeKey.value += 1;
    if (new Date(cachedStatsParsed.expireAt).getTime() < Date.now()) {
      // we load new data in the background, if expired
      loadData();
    }
  } else {
    // and on first visit
    loadData();
  }
});

const loadData = async () => {
  isLoading.value = true;
  marqueeKey.value += 1;

  await Promise.all([
    loadGitHubRepoData(),
    loadNpmDownloadsData(),
    loadJsdelivrStats()
  ])

  isLoading.value = false;
  marqueeKey.value += 1;

  // save to LS with expiration date (+2 days)
  const date = new Date();
  date.setDate(date.getDate() + 2);
  set(LSKey.STATS, {
    data: data.value,
    expireAt: date
  });
}

// get GitHub stars
const loadGitHubRepoData = async () => {
  const response = await fetch(githubRepoUrl);
  if (response.ok) {
    const json = await response.json();

    json?.stargazers_count && (data.value.github.stars = json.stargazers_count);
  }
}

// get npm installations
const loadNpmDownloadsData = async () => {
  const getTotalByRange = async (startDate: Date, endDate: Date) => {
    const url = npmDownloadsUrl.replace('{start}', startDate.toISOString().slice(0, 10)).replace('{end}', endDate.toISOString().slice(0, 10));
    const response = await fetch(url);
    const data = response.ok ? ((await response.json())?.downloads || []) : [];

    return data.reduce((total: number, item: { downloads: number}) => {
      total += item.downloads;
      return total
    }, 0);
  }

  const getTotal = async (startDate: Date, endDate: Date, total = 0) => {
    const result = await getTotalByRange(startDate, endDate);

    if (result > 0) {
      total += result;

      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() - 1);
      startDate.setFullYear(startDate.getFullYear() - 1);

      total += await getTotal(startDate, endDate);
    }

    return total;
  }

  const now = new Date();

  // total
  let startDate = new Date(now);
  startDate.setFullYear(startDate.getFullYear() - 1);
  data.value.npm.totalInstallations = await getTotal(startDate, new Date(now));

  // weekly
  startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 7);
  data.value.npm.weeklyInstallations = await getTotalByRange(startDate, new Date(now));
}

// get jsDelivr monthly CDN hits
const loadJsdelivrStats = async () => {
  const response = await fetch(jsdelivrStatsUrl);
  if (response.ok) {
    const json = await response.json();
    json?.total && (data.value.jsdelivr.montlyHits = json.total);
  }
};
</script>

<template>
  <div class="-mt-16 block px-8 pb-16 sm:hidden">
    <div class="inline-block">
      <div class="fade-in m-2 flex rounded-full bg-zinc-800/70 py-3 px-5 text-white">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="mr-2 inline-block h-4 w-4 self-center">
          <path
            fill-rule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-md self-center font-semibold underline decoration-primary decoration-2 underline-offset-4">{{ isLoading ? '...' : $n(data.github.stars) }}</span>
        <span class="self-center pl-2 text-xs font-normal text-zinc-100">{{ $t('labels.stats.stars') }}</span>
      </div>
    </div>
    <div class="inline-block">
      <div class="fade-in m-2 flex rounded-full bg-zinc-800/70 py-3 px-5 text-white">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="mr-2 inline-block h-4 w-4 self-center">
          <path
            d="M17.004 10.407c.138.435-.216.842-.672.842h-3.465a.75.75 0 01-.65-.375l-1.732-3c-.229-.396-.053-.907.393-1.004a5.252 5.252 0 016.126 3.537zM8.12 8.464c.307-.338.838-.235 1.066.16l1.732 3a.75.75 0 010 .75l-1.732 3.001c-.229.396-.76.498-1.067.16A5.231 5.231 0 016.75 12c0-1.362.519-2.603 1.37-3.536zM10.878 17.13c-.447-.097-.623-.608-.394-1.003l1.733-3.003a.75.75 0 01.65-.375h3.465c.457 0 .81.408.672.843a5.252 5.252 0 01-6.126 3.538z"
          />
          <path
            fill-rule="evenodd"
            d="M21 12.75a.75.75 0 000-1.5h-.783a8.22 8.22 0 00-.237-1.357l.734-.267a.75.75 0 10-.513-1.41l-.735.268a8.24 8.24 0 00-.689-1.191l.6-.504a.75.75 0 10-.964-1.149l-.6.504a8.3 8.3 0 00-1.054-.885l.391-.678a.75.75 0 10-1.299-.75l-.39.677a8.188 8.188 0 00-1.295-.471l.136-.77a.75.75 0 00-1.477-.26l-.136.77a8.364 8.364 0 00-1.377 0l-.136-.77a.75.75 0 10-1.477.26l.136.77c-.448.121-.88.28-1.294.47l-.39-.676a.75.75 0 00-1.3.75l.392.678a8.29 8.29 0 00-1.054.885l-.6-.504a.75.75 0 00-.965 1.149l.6.503a8.243 8.243 0 00-.689 1.192L3.8 8.217a.75.75 0 10-.513 1.41l.735.267a8.222 8.222 0 00-.238 1.355h-.783a.75.75 0 000 1.5h.783c.042.464.122.917.238 1.356l-.735.268a.75.75 0 10.513 1.41l.735-.268c.197.417.428.816.69 1.192l-.6.504a.75.75 0 10.963 1.149l.601-.505c.326.323.679.62 1.054.885l-.392.68a.75.75 0 101.3.75l.39-.679c.414.192.847.35 1.294.471l-.136.771a.75.75 0 101.477.26l.137-.772a8.376 8.376 0 001.376 0l.136.773a.75.75 0 101.477-.26l-.136-.772a8.19 8.19 0 001.294-.47l.391.677a.75.75 0 101.3-.75l-.393-.679a8.282 8.282 0 001.054-.885l.601.504a.75.75 0 10.964-1.15l-.6-.503a8.24 8.24 0 00.69-1.191l.735.268a.75.75 0 10.512-1.41l-.734-.268c.115-.438.195-.892.237-1.356h.784zm-2.657-3.06a6.744 6.744 0 00-1.19-2.053 6.784 6.784 0 00-1.82-1.51A6.704 6.704 0 0012 5.25a6.801 6.801 0 00-1.225.111 6.7 6.7 0 00-2.15.792 6.784 6.784 0 00-2.952 3.489.758.758 0 01-.036.099A6.74 6.74 0 005.251 12a6.739 6.739 0 003.355 5.835l.01.006.01.005a6.706 6.706 0 002.203.802c.007 0 .014.002.021.004a6.792 6.792 0 002.301 0l.022-.004a6.707 6.707 0 002.228-.816 6.781 6.781 0 001.762-1.483l.009-.01.009-.012a6.744 6.744 0 001.18-2.064c.253-.708.39-1.47.39-2.264a6.74 6.74 0 00-.408-2.308z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-md self-center font-semibold underline decoration-primary decoration-2 underline-offset-4">{{ isLoading ? '...' : $n(data.npm.totalInstallations) }}</span>
        <span class="self-center pl-2 text-xs font-normal text-zinc-100">{{ $t('labels.stats.npm_total') }}</span>
      </div>
    </div>
    <div class="hidden xs:inline-block">
      <div class="fade-in m-2 flex rounded-full bg-zinc-800/70 py-3 px-5 text-white">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="mr-2 inline-block h-4 w-4 self-center">
          <path
            fill-rule="evenodd"
            d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.54 15h6.42l.5 1.5H8.29l.5-1.5zm8.085-8.995a.75.75 0 10-.75-1.299 12.81 12.81 0 00-3.558 3.05L11.03 8.47a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l2.47-2.47 1.617 1.618a.75.75 0 001.146-.102 11.312 11.312 0 013.612-3.321z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-md self-center font-semibold underline decoration-primary decoration-2 underline-offset-4">{{ isLoading ? '...' : $n(data.jsdelivr.montlyHits) }}</span>
        <span class="self-center pl-2 text-xs font-normal text-zinc-100">{{ $t('labels.stats.cdn') }}</span>
      </div>
    </div>
  </div>

  <div class="-mt-2 hidden h-[68px] w-full drop-shadow-xl sm:block">
    <svg version="1.1" viewBox="0 0 1500 68" preserveAspectRatio="none" class="h-[68px] w-full fill-zinc-600 dark:fill-zinc-700" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m0 62.572c129.98-0.48579 135.88 6.2187 368.8 4.7672 290.46-1.81 220.13-3.7434 330.2-4.0747 124.07-0.37343 248.13 2.3891 372.2 2.3522 249.15-2.6139 166.97-2.0838 428.8 0.8059v-60.029c-230.74-0.16215-448.31-1.9959-643-4.3042-226.2 1.0603-428.55 0.14121-642.8 2.97-99.725 1.3167-95.683-0.28568-214.2-4.6058z"
      />
    </svg>
  </div>
  <div class="mt-[-54px] hidden h-[40px] sm:block">
    <div class="relative mx-auto flex h-[40px] w-full items-center overflow-hidden">
      <div class="z-10 p-2 pr-3">
        <div class="whitespace-nowrap rounded-md bg-red-800 px-2 py-1 text-xs font-semibold text-zinc-100 shadow">
          <span class="hidden xl:inline">{{ $t('labels.stats.label_long') }}</span>
          <span class="inline xl:hidden">{{ $t('labels.stats.label_short') }}</span>
        </div>
      </div>
      <div class="z-10 ml-1 h-10 w-14 shrink-0 bg-gradient-to-r from-zinc-600 to-transparent py-2 dark:from-zinc-700"></div>

      <client-only>
        <MarqueeText :key="marqueeKey" :duration="100" :repeat="4" class="-ml-14 overflow-visible">
          <div class="flex whitespace-nowrap">
            <a target="_blank" rel="noopener" href="https://github.com/add2cal/add-to-calendar-button" class="fade-in group mr-20 flex py-2 text-xs text-zinc-200 hover:text-white hover:no-underline">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="mr-1 inline-block h-3 w-3 self-center">
                <path
                  fill-rule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="underline decoration-primary decoration-2 underline-offset-4 group-hover:decoration-primary-light group-hover:underline-offset-1">{{ isLoading ? '...' : $n(data.github.stars) }}</span>
              <span class="pl-1 font-normal text-zinc-200 group-hover:text-zinc-100">{{ $t('labels.stats.stars') }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-0.5 mt-0.5 hidden h-3 w-3 group-hover:inline-block" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              <span class="ml-0.5 block w-3 group-hover:hidden"></span>
            </a>
            <a target="_blank" rel="noopener" href="https://www.npmjs.com/package/add-to-calendar-button" class="fade-in group mr-20 flex py-2 text-xs text-zinc-200 hover:text-white hover:no-underline">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="mr-1 inline-block h-3 w-3 self-center">
                <path
                  d="M17.004 10.407c.138.435-.216.842-.672.842h-3.465a.75.75 0 01-.65-.375l-1.732-3c-.229-.396-.053-.907.393-1.004a5.252 5.252 0 016.126 3.537zM8.12 8.464c.307-.338.838-.235 1.066.16l1.732 3a.75.75 0 010 .75l-1.732 3.001c-.229.396-.76.498-1.067.16A5.231 5.231 0 016.75 12c0-1.362.519-2.603 1.37-3.536zM10.878 17.13c-.447-.097-.623-.608-.394-1.003l1.733-3.003a.75.75 0 01.65-.375h3.465c.457 0 .81.408.672.843a5.252 5.252 0 01-6.126 3.538z"
                />
                <path
                  fill-rule="evenodd"
                  d="M21 12.75a.75.75 0 000-1.5h-.783a8.22 8.22 0 00-.237-1.357l.734-.267a.75.75 0 10-.513-1.41l-.735.268a8.24 8.24 0 00-.689-1.191l.6-.504a.75.75 0 10-.964-1.149l-.6.504a8.3 8.3 0 00-1.054-.885l.391-.678a.75.75 0 10-1.299-.75l-.39.677a8.188 8.188 0 00-1.295-.471l.136-.77a.75.75 0 00-1.477-.26l-.136.77a8.364 8.364 0 00-1.377 0l-.136-.77a.75.75 0 10-1.477.26l.136.77c-.448.121-.88.28-1.294.47l-.39-.676a.75.75 0 00-1.3.75l.392.678a8.29 8.29 0 00-1.054.885l-.6-.504a.75.75 0 00-.965 1.149l.6.503a8.243 8.243 0 00-.689 1.192L3.8 8.217a.75.75 0 10-.513 1.41l.735.267a8.222 8.222 0 00-.238 1.355h-.783a.75.75 0 000 1.5h.783c.042.464.122.917.238 1.356l-.735.268a.75.75 0 10.513 1.41l.735-.268c.197.417.428.816.69 1.192l-.6.504a.75.75 0 10.963 1.149l.601-.505c.326.323.679.62 1.054.885l-.392.68a.75.75 0 101.3.75l.39-.679c.414.192.847.35 1.294.471l-.136.771a.75.75 0 101.477.26l.137-.772a8.376 8.376 0 001.376 0l.136.773a.75.75 0 101.477-.26l-.136-.772a8.19 8.19 0 001.294-.47l.391.677a.75.75 0 101.3-.75l-.393-.679a8.282 8.282 0 001.054-.885l.601.504a.75.75 0 10.964-1.15l-.6-.503a8.24 8.24 0 00.69-1.191l.735.268a.75.75 0 10.512-1.41l-.734-.268c.115-.438.195-.892.237-1.356h.784zm-2.657-3.06a6.744 6.744 0 00-1.19-2.053 6.784 6.784 0 00-1.82-1.51A6.704 6.704 0 0012 5.25a6.801 6.801 0 00-1.225.111 6.7 6.7 0 00-2.15.792 6.784 6.784 0 00-2.952 3.489.758.758 0 01-.036.099A6.74 6.74 0 005.251 12a6.739 6.739 0 003.355 5.835l.01.006.01.005a6.706 6.706 0 002.203.802c.007 0 .014.002.021.004a6.792 6.792 0 002.301 0l.022-.004a6.707 6.707 0 002.228-.816 6.781 6.781 0 001.762-1.483l.009-.01.009-.012a6.744 6.744 0 001.18-2.064c.253-.708.39-1.47.39-2.264a6.74 6.74 0 00-.408-2.308z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="underline decoration-primary decoration-2 underline-offset-4 group-hover:decoration-primary-light group-hover:underline-offset-1">{{ isLoading ? '...' : $n(data.npm.totalInstallations) }}</span>
              <span class="pl-1 font-normal text-zinc-200 group-hover:text-zinc-100">{{ $t('labels.stats.npm_total') }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-0.5 mt-0.5 hidden h-3 w-3 group-hover:inline-block" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              <span class="ml-0.5 block w-3 group-hover:hidden"></span>
            </a>
            <a target="_blank" rel="noopener" href="https://www.npmjs.com/package/add-to-calendar-button" class="fade-in group mr-20 flex py-2 text-xs text-zinc-200 hover:text-white hover:no-underline">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="mr-1 inline-block h-3 w-3 self-center">
                <path
                  d="M17.004 10.407c.138.435-.216.842-.672.842h-3.465a.75.75 0 01-.65-.375l-1.732-3c-.229-.396-.053-.907.393-1.004a5.252 5.252 0 016.126 3.537zM8.12 8.464c.307-.338.838-.235 1.066.16l1.732 3a.75.75 0 010 .75l-1.732 3.001c-.229.396-.76.498-1.067.16A5.231 5.231 0 016.75 12c0-1.362.519-2.603 1.37-3.536zM10.878 17.13c-.447-.097-.623-.608-.394-1.003l1.733-3.003a.75.75 0 01.65-.375h3.465c.457 0 .81.408.672.843a5.252 5.252 0 01-6.126 3.538z"
                />
                <path
                  fill-rule="evenodd"
                  d="M21 12.75a.75.75 0 000-1.5h-.783a8.22 8.22 0 00-.237-1.357l.734-.267a.75.75 0 10-.513-1.41l-.735.268a8.24 8.24 0 00-.689-1.191l.6-.504a.75.75 0 10-.964-1.149l-.6.504a8.3 8.3 0 00-1.054-.885l.391-.678a.75.75 0 10-1.299-.75l-.39.677a8.188 8.188 0 00-1.295-.471l.136-.77a.75.75 0 00-1.477-.26l-.136.77a8.364 8.364 0 00-1.377 0l-.136-.77a.75.75 0 10-1.477.26l.136.77c-.448.121-.88.28-1.294.47l-.39-.676a.75.75 0 00-1.3.75l.392.678a8.29 8.29 0 00-1.054.885l-.6-.504a.75.75 0 00-.965 1.149l.6.503a8.243 8.243 0 00-.689 1.192L3.8 8.217a.75.75 0 10-.513 1.41l.735.267a8.222 8.222 0 00-.238 1.355h-.783a.75.75 0 000 1.5h.783c.042.464.122.917.238 1.356l-.735.268a.75.75 0 10.513 1.41l.735-.268c.197.417.428.816.69 1.192l-.6.504a.75.75 0 10.963 1.149l.601-.505c.326.323.679.62 1.054.885l-.392.68a.75.75 0 101.3.75l.39-.679c.414.192.847.35 1.294.471l-.136.771a.75.75 0 101.477.26l.137-.772a8.376 8.376 0 001.376 0l.136.773a.75.75 0 101.477-.26l-.136-.772a8.19 8.19 0 001.294-.47l.391.677a.75.75 0 101.3-.75l-.393-.679a8.282 8.282 0 001.054-.885l.601.504a.75.75 0 10.964-1.15l-.6-.503a8.24 8.24 0 00.69-1.191l.735.268a.75.75 0 10.512-1.41l-.734-.268c.115-.438.195-.892.237-1.356h.784zm-2.657-3.06a6.744 6.744 0 00-1.19-2.053 6.784 6.784 0 00-1.82-1.51A6.704 6.704 0 0012 5.25a6.801 6.801 0 00-1.225.111 6.7 6.7 0 00-2.15.792 6.784 6.784 0 00-2.952 3.489.758.758 0 01-.036.099A6.74 6.74 0 005.251 12a6.739 6.739 0 003.355 5.835l.01.006.01.005a6.706 6.706 0 002.203.802c.007 0 .014.002.021.004a6.792 6.792 0 002.301 0l.022-.004a6.707 6.707 0 002.228-.816 6.781 6.781 0 001.762-1.483l.009-.01.009-.012a6.744 6.744 0 001.18-2.064c.253-.708.39-1.47.39-2.264a6.74 6.74 0 00-.408-2.308z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="underline decoration-primary decoration-2 underline-offset-4 group-hover:decoration-primary-light group-hover:underline-offset-1">{{ isLoading ? '...' : $n(data.npm.weeklyInstallations) }}</span>
              <span class="pl-1 font-normal text-zinc-200 group-hover:text-zinc-100">{{ $t('labels.stats.npm_weekly') }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-0.5 mt-0.5 hidden h-3 w-3 group-hover:inline-block" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              <span class="ml-0.5 block w-3 group-hover:hidden"></span>
            </a>
            <a target="_blank" rel="noopener" href="https://www.jsdelivr.com/package/npm/add-to-calendar-button" class="fade-in group mr-20 flex py-2 text-xs text-zinc-200 hover:text-white hover:no-underline">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="mr-1 inline-block h-3 w-3 self-center">
                <path
                  fill-rule="evenodd"
                  d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.54 15h6.42l.5 1.5H8.29l.5-1.5zm8.085-8.995a.75.75 0 10-.75-1.299 12.81 12.81 0 00-3.558 3.05L11.03 8.47a.75.75 0 00-1.06 0l-3 3a.75.75 0 101.06 1.06l2.47-2.47 1.617 1.618a.75.75 0 001.146-.102 11.312 11.312 0 013.612-3.321z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="underline decoration-primary decoration-2 underline-offset-4 group-hover:decoration-primary-light group-hover:underline-offset-1">{{ isLoading ? '...' : $n(data.jsdelivr.montlyHits) }}</span>
              <span class="pl-1 font-normal text-zinc-200 group-hover:text-zinc-100">{{ $t('labels.stats.cdn') }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-0.5 mt-0.5 hidden h-3 w-3 group-hover:inline-block" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              <span class="ml-0.5 block w-3 group-hover:hidden"></span>
            </a>
          </div>
        </MarqueeText>
      </client-only>
    </div>
  </div>
</template>

<style scoped>
.fade-in {
  animation: entryAnimation 2s ease 0s 1 normal forwards;
}

@keyframes entryAnimation {
	0% {
		opacity: 0;
	}

	100% {
		opacity: 1;
	}
}
</style>
