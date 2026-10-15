<script setup lang="ts">
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { setUserTheme } from '../../utils/themeSwitch';

defineProps<{ label: string }>();

const button = ref<HTMLButtonElement>();
let observer: MutationObserver | undefined;

const sync = () => {
  button.value?.setAttribute('aria-checked', String(document.documentElement.classList.contains('dark')));
};

onMounted(() => {
  sync();
  observer = new MutationObserver(sync);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
});

onBeforeUnmount(() => observer?.disconnect());

const toggleTheme = (event: MouseEvent) => {
  const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
  (event.currentTarget as HTMLButtonElement).setAttribute('aria-checked', String(next === 'dark'));
  setUserTheme(next);
};
</script>

<template>
  <button ref="button" type="button" role="switch" aria-checked="false" class="btn-control relative inline-flex h-6 w-10 items-center rounded-full border border-zinc-300 bg-zinc-200 shadow transition-colors hover:border-zinc-400 hover:shadow-md dark:border-zinc-500 dark:bg-zinc-700" @click="toggleTheme">
    <span class="sr-only">{{ label }}</span>
    <span class="ml-px inline-block h-[19px] w-[19px] rounded-full bg-white text-zinc-900 shadow-md outline-none dark:ml-[18px] dark:bg-zinc-900 dark:text-white">
      <SunIcon class="m-0.5 dark:hidden" aria-hidden="true" />
      <MoonIcon class="m-0.5 hidden dark:block" aria-hidden="true" />
    </span>
  </button>
</template>
