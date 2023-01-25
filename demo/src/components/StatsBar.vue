<script setup lang="ts">
import { StarIcon, CogIcon, PresentationChartLineIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/20/solid';
import { ref, onMounted } from 'vue';
import { get, set, LSKey } from '@/utils/localStorage';
import { mergeDeep } from '@/utils/array';
import MarqueeText from 'vue-marquee-text-component';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const data = ref({
  github: {
    stars: 1,
  },
  npm: {
    totalInstallations: 1,
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
  const cachedStats = get(LSKey.STATS) && JSON.parse(get(LSKey.STATS));;

  if (cachedStats?.expireAt && cachedStats?.data && new Date(cachedStats.expireAt).getTime() > Date.now()) {
    data.value = mergeDeep(data.value, cachedStats.data);
    marqueeKey.value += 1;
  } else {
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

  // save to LS with expiration date (+5 days)
  const date = new Date();
  date.setDate(date.getDate() + 5);
  set(LSKey.STATS, {
    data: data.value,
    expireAt: date
  });
}

const loadGitHubRepoData = async () => {
  const response = await fetch(githubRepoUrl);
  if (response.ok) {
    const json = await response.json();

    json?.stargazers_count && (data.value.github.stars = json.stargazers_count);
  }
}


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

  const getTotal = async (startDate: Date, endDate: Date, total: number = 0) => {
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

const loadJsdelivrStats = async () => {
  const response = await fetch(jsdelivrStatsUrl);
  if (response.ok) {
    const json = await response.json();
    json?.total && (data.value.jsdelivr.montlyHits = json.total);
  }
};
</script>

<template>
  <div class="bg-zinc-600 dark:bg-zinc-700">
    <div class="relative mx-auto flex w-full items-center overflow-x-hidden">
      <div class="z-10 bg-zinc-600 p-2 pr-3 dark:bg-zinc-700">
        <div class="whitespace-nowrap rounded-md bg-red-800 py-1 px-2 text-xs font-semibold text-zinc-100 shadow">
          <span class="hidden xl:inline">{{ t('labels.stats.label_long') }}</span>
          <span class="inline xl:hidden">{{ t('labels.stats.label_short') }}</span>
        </div>
      </div>
      <div class="z-10 h-10 w-10 bg-gradient-to-r from-zinc-600 to-transparent py-2 px-4 dark:from-zinc-700"></div>

      <MarqueeText :duration="100" :repeat="4" :key="marqueeKey" class="overflow-visible">
        <div class="flex whitespace-nowrap">
          <a target="_blank" rel="noopener" href="https://github.com/add2cal/add-to-calendar-button" class="group mr-20 flex text-xs text-zinc-200 hover:text-white hover:no-underline">
            <StarIcon class="mr-1 inline-block h-3 w-3 self-center" />{{ isLoading ? '...' : $n(data.github.stars) }}<span class="pl-1 font-normal text-zinc-400 group-hover:text-zinc-200">{{ t('labels.stats.stars') }}</span>
            <ArrowTopRightOnSquareIcon class="mt-0.5 ml-0.5 hidden h-3 w-3 group-hover:inline-block" aria-hidden="true" />
            <span class="ml-0.5 block w-3 group-hover:hidden"></span>
          </a>
          <a target="_blank" rel="noopener" href="https://www.npmjs.com/package/add-to-calendar-button" class="group mr-20 flex text-xs text-zinc-200 hover:text-white hover:no-underline">
            <CogIcon class="mr-1 inline-block h-3 w-3 self-center" />{{ isLoading ? '...' : $n(data.npm.totalInstallations) }}<span class="pl-1 font-normal text-zinc-400 group-hover:text-zinc-200">{{ t('labels.stats.npm_total') }}</span>
            <ArrowTopRightOnSquareIcon class="mt-0.5 ml-0.5 hidden h-3 w-3 group-hover:inline-block" aria-hidden="true" />
            <span class="ml-0.5 block w-3 group-hover:hidden"></span>
          </a>
          <a target="_blank" rel="noopener" href="https://www.npmjs.com/package/add-to-calendar-button" class="group mr-20 flex text-xs text-zinc-200 hover:text-white hover:no-underline">
            <CogIcon class="mr-1 inline-block h-3 w-3 self-center" />{{ isLoading ? '...' : $n(data.npm.weeklyInstallations) }}<span class="pl-1 font-normal text-zinc-400 group-hover:text-zinc-200">{{ t('labels.stats.npm_weekly') }}</span>
            <ArrowTopRightOnSquareIcon class="mt-0.5 ml-0.5 hidden h-3 w-3 group-hover:inline-block" aria-hidden="true" />
            <span class="ml-0.5 block w-3 group-hover:hidden"></span>
          </a>
          <a target="_blank" rel="noopener" href="https://www.jsdelivr.com/package/npm/add-to-calendar-button" class="group mr-20 flex text-xs text-zinc-200 hover:text-white hover:no-underline">
            <PresentationChartLineIcon class="mr-1 inline-block h-3 w-3 self-center" />{{ isLoading ? '...' : $n(data.jsdelivr.montlyHits) }}<span class="pl-1 font-normal text-zinc-400 group-hover:text-zinc-200">{{ t('labels.stats.cdn') }}</span>
            <ArrowTopRightOnSquareIcon class="mt-0.5 ml-0.5 hidden h-3 w-3 group-hover:inline-block" aria-hidden="true" />
            <span class="ml-0.5 block w-3 group-hover:hidden"></span>
          </a>
        </div>
      </MarqueeText>
    </div>
  </div>
</template>
