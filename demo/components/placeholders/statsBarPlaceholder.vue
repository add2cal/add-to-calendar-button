<template>
  <div class="-mt-2 h-[68px] w-full">
    <svg version="1.1" viewBox="0 0 1500 68" preserveAspectRatio="none" class="h-[68px] w-full fill-zinc-600 dark:fill-zinc-700" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m0 62.572c129.98-0.48579 135.88 6.2187 368.8 4.7672 290.46-1.81 220.13-3.7434 330.2-4.0747 124.07-0.37343 248.13 2.3891 372.2 2.3522 249.15-2.6139 166.97-2.0838 428.8 0.8059v-60.029c-230.74-0.16215-448.31-1.9959-643-4.3042-226.2 1.0603-428.55 0.14121-642.8 2.97-99.725 1.3167-95.683-0.28568-214.2-4.6058z"
      />
    </svg>
  </div>
  <div class="mt-[-54px] h-[40px]">
    <div class="relative mx-auto flex w-full items-center overflow-x-hidden">
      <div class="z-10 p-2 pr-3">
        <div class="whitespace-nowrap rounded-md bg-red-800 py-1 px-2 text-xs font-semibold text-zinc-100 shadow">
          <span class="hidden xl:inline">{{ $t('labels.stats.label_long') }}</span>
          <span class="inline xl:hidden">{{ $t('labels.stats.label_short') }}</span>
        </div>
      </div>
      <div class="z-10 h-10 w-10 bg-gradient-to-r from-zinc-600 to-transparent py-2 px-4 dark:from-zinc-700"></div>
    </div>
  </div>
</template>
