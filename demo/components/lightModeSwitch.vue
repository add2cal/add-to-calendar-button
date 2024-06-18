<script setup lang="ts">
import { getUserTheme, changeUserTheme } from "@/utils/themeSwitch";
import { Switch, provideUseId } from '@headlessui/vue';
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline';

provideUseId(() => useId());

let userTheme = 'light';
if (import.meta.client) {
  userTheme = getUserTheme();
}

const toggleTheme = (): void => {
  if (userTheme === 'light') {
    changeUserTheme('dark');
    userTheme = 'dark';
  } else {
    changeUserTheme('light');
    userTheme = 'light';
  }
};

const darkEnabled = userTheme === 'dark' ? ref(true) : ref(false);

if (import.meta.client) {
  const docObserver = new MutationObserver(function (mutationsList) {
    mutationsList.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        if (document.documentElement.classList.contains('atcb-dark')) {
          darkEnabled.value = true;
        } else {
          darkEnabled.value = false;
        }
      }
    });
  });

  onMounted(() => {
    docObserver.observe(document.documentElement, { attributes: true });
  });

  onUnmounted(() => {
  if (typeof docObserver !== 'undefined') {
    docObserver.disconnect();
  }
  });
}
</script>

<template>
  <ClientOnly>
    <Switch
      v-model="darkEnabled"
      :class="darkEnabled ? 'border-zinc-500 bg-zinc-700 hover:border-zinc-400' : 'border-zinc-300 bg-zinc-200 hover:border-zinc-400'"
      class="relative inline-flex h-[24px] w-[40px] items-center rounded-full border shadow outline-none transition-colors hover:shadow-md focus:outline-none focus-visible:ring focus-visible:ring-secondary/75"
      @update:model-value="toggleTheme"
    >
      <span class="sr-only">{{ $t('labels.enableDarkMode') }}</span>
      <span :class="darkEnabled ? 'ml-[18px] bg-zinc-900 text-white' : 'ml-[1px] bg-white text-zinc-900'" class="inline-block h-[19px] w-[19px] rounded-full shadow-md outline-none">
        <SunIcon class="m-[2px] ui-checked:hidden" />
        <MoonIcon class="m-[2px] ui-not-checked:hidden" />
      </span>
    </Switch>
    <template #fallback>
      <div class="h-[1.5rem] w-10 animate-pulse rounded-full bg-zinc-300 dark:bg-zinc-700"></div>
    </template>
  </ClientOnly>
</template>
