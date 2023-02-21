<template>
  <div class="bg-zinc-600 dark:bg-zinc-700">
    <div class="relative mx-auto flex w-full items-center overflow-x-hidden">
      <div class="z-10 bg-zinc-600 p-2 pr-3 dark:bg-zinc-700">
        <div class="whitespace-nowrap rounded-md bg-red-800 py-1 px-2 text-xs font-semibold text-zinc-100 shadow">
          <span class="hidden xl:inline">{{ $t('labels.stats.label_long') }}</span>
          <span class="inline xl:hidden">{{ $t('labels.stats.label_short') }}</span>
        </div>
      </div>
      <div class="z-10 h-10 w-10 bg-gradient-to-r from-zinc-600 to-transparent py-2 px-4 dark:from-zinc-700"></div>
    </div>
  </div>
</template>
