<script setup lang="ts">
import { get, set, LSKey } from '@/utils/localStorage';
import { mergeDeep } from '@/utils/array';
import MarqueeText from 'vue-marquee-text-component';

const { locale } = useI18n();

// on locale change, update component
watch(locale, () => {
  marqueeKey.value += 1;
});

const data = ref({
  github: {
    stars: 1200,
  },
  npm: {
    totalInstallations: 600000,
    monthlyInstallations: 1
  },
  jsdelivr: {
    montlyHits: 1
  }
});

const isLoading = ref(false);
const marqueeKey = ref(0);

const githubRepoUrl = 'https://api.github.com/repos/add2cal/add-to-calendar-button';
const npmDownloadsUrl = 'https://api.npmjs.org/downloads/range/{start}:{end}/add-to-calendar-button';
const jsdelivrStatsUrl = 'https://data.jsdelivr.com/v1/stats/packages/npm/add-to-calendar-button?period=month';

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

    if (json?.stargazers_count) data.value.github.stars = json.stargazers_count;
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

  // monthly
  startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 30);
  data.value.npm.monthlyInstallations = await getTotalByRange(startDate, new Date(now));
}

// get jsDelivr monthly CDN hits
const loadJsdelivrStats = async () => {
  const response = await fetch(jsdelivrStatsUrl);
  if (response.ok) {
    const json = await response.json();
    if (json?.hits.total) data.value.jsdelivr.montlyHits = json.hits.total;
  }
};
</script>

<template>
  <div class="-mt-16 block px-8 pb-16 sm:hidden">
    <div class="inline-block">
      <div class="fade-in m-2 flex flex-col rounded-3xl bg-zinc-800/70 px-5 py-3 text-white xs:flex-row xs:rounded-full">
        <div class="flex">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="mr-2 inline-block h-4 w-4 self-center">
            <path
              fill-rule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-md self-center font-semibold underline decoration-primary decoration-2 underline-offset-4">{{ isLoading ? '...' : $n(data.github.stars) }}</span>
        </div>
        <span class="self-center pt-2 text-xs font-normal text-zinc-100 opacity-80 xs:pl-2 xs:pt-0">{{ $t('labels.stats.stars') }}</span>
      </div>
    </div>
    <div class="inline-block">
      <div class="fade-in m-2 flex flex-col rounded-3xl bg-zinc-800/70 px-5 py-3 text-white xs:flex-row xs:rounded-full">
        <div class="flex">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="mr-2 inline-block h-4 w-4 self-center">
            <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
          </svg>
          <span class="text-md self-center font-semibold underline decoration-primary decoration-2 underline-offset-4">{{ isLoading ? '...' : $n(data.npm.totalInstallations) }}</span>
        </div>
        <span class="self-center pt-2 text-xs font-normal text-zinc-100 opacity-80 xs:pl-2 xs:pt-0">{{ $t('labels.stats.npm_total') }}</span>
      </div>
    </div>
    <div class="inline-block">
      <div class="fade-in m-2 flex flex-col rounded-3xl bg-zinc-800/70 px-5 py-3 text-white xs:flex-row xs:rounded-full">
        <div class="flex">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="mr-2 inline-block h-4 w-4 self-center">
            <path
              fill-rule="evenodd"
              d="M10.5 3.75a6 6 0 00-5.98 6.496A5.25 5.25 0 006.75 20.25H18a4.5 4.5 0 002.206-8.423 3.75 3.75 0 00-4.133-4.303A6.001 6.001 0 0010.5 3.75zm2.25 6a.75.75 0 00-1.5 0v4.94l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V9.75z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-md self-center font-semibold underline decoration-primary decoration-2 underline-offset-4">{{ isLoading ? '...' : $n(data.jsdelivr.montlyHits) }}</span>
        </div>
        <span class="self-center pt-2 text-xs font-normal text-zinc-100 opacity-80 xs:pl-2 xs:pt-0">{{ $t('labels.stats.cdn') }}</span>
      </div>
    </div>
  </div>

  <div class="relative z-40 -mt-2 hidden h-[68px] w-full drop-shadow-xl sm:block">
    <svg version="1.1" viewBox="0 0 1500 68" preserveAspectRatio="none" class="h-[68px] w-full fill-zinc-600 dark:fill-zinc-800" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m0 62.572c129.98-0.48579 135.88 6.2187 368.8 4.7672 290.46-1.81 220.13-3.7434 330.2-4.0747 124.07-0.37343 248.13 2.3891 372.2 2.3522 249.15-2.6139 166.97-2.0838 428.8 0.8059v-60.029c-230.74-0.16215-448.31-1.9959-643-4.3042-226.2 1.0603-428.55 0.14121-642.8 2.97-99.725 1.3167-95.683-0.28568-214.2-4.6058z"
      />
    </svg>
  </div>
  <div class="relative z-40 mt-[-54px] hidden h-[40px] sm:block">
    <div class="relative mx-auto flex h-[40px] w-full items-center overflow-hidden">
      <div class="z-10 p-2 pr-3">
        <div class="whitespace-nowrap rounded-md bg-red-800 px-2 py-1 text-xs font-semibold text-zinc-100 shadow">
          <span class="hidden xl:inline">{{ $t('labels.stats.label_long') }}</span>
          <span class="inline xl:hidden">{{ $t('labels.stats.label_short') }}</span>
        </div>
      </div>
      <div class="z-10 ml-1 h-10 w-14 shrink-0 bg-gradient-to-r from-zinc-600 to-transparent py-2 dark:from-zinc-800"></div>

      <client-only>
        <MarqueeText :key="marqueeKey" :duration="100" :repeat="4" class="-ml-14 overflow-visible">
          <div class="flex whitespace-nowrap">
            <a target="_blank" rel="noopener" href="https://github.com/add2cal/add-to-calendar-button" class="fade-in group mr-20 flex py-2 text-xs text-zinc-200 hover:text-white hover:no-underline">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="mr-1.5 inline-block h-3 w-3 self-center">
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="mr-1.5 inline-block h-3 w-3 self-center">
                <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
              </svg>
              <span class="underline decoration-primary decoration-2 underline-offset-4 group-hover:decoration-primary-light group-hover:underline-offset-1">{{ isLoading ? '...' : $n(data.npm.totalInstallations) }}</span>
              <span class="pl-1 font-normal text-zinc-200 group-hover:text-zinc-100">{{ $t('labels.stats.npm_total') }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-0.5 mt-0.5 hidden h-3 w-3 group-hover:inline-block" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              <span class="ml-0.5 block w-3 group-hover:hidden"></span>
            </a>
            <a target="_blank" rel="noopener" href="https://www.npmjs.com/package/add-to-calendar-button" class="fade-in group mr-20 flex py-2 text-xs text-zinc-200 hover:text-white hover:no-underline">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="mr-1.5 inline-block h-3 w-3 self-center">
                <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
              </svg>
              <span class="underline decoration-primary decoration-2 underline-offset-4 group-hover:decoration-primary-light group-hover:underline-offset-1">{{ isLoading ? '...' : $n(data.npm.monthlyInstallations) }}</span>
              <span class="pl-1 font-normal text-zinc-200 group-hover:text-zinc-100">{{ $t('labels.stats.npm_monthly') }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-0.5 mt-0.5 hidden h-3 w-3 group-hover:inline-block" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              <span class="ml-0.5 block w-3 group-hover:hidden"></span>
            </a>
            <a target="_blank" rel="noopener" href="https://www.jsdelivr.com/package/npm/add-to-calendar-button?tab=stats" class="fade-in group mr-20 flex py-2 text-xs text-zinc-200 hover:text-white hover:no-underline">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="mr-1.5 inline-block h-3 w-3 self-center">
                <path
                  fill-rule="evenodd"
                  d="M10.5 3.75a6 6 0 00-5.98 6.496A5.25 5.25 0 006.75 20.25H18a4.5 4.5 0 002.206-8.423 3.75 3.75 0 00-4.133-4.303A6.001 6.001 0 0010.5 3.75zm2.25 6a.75.75 0 00-1.5 0v4.94l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V9.75z"
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
