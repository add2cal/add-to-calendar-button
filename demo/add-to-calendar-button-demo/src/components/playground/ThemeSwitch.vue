<script setup lang="ts">
import { Switch, provideUseId } from '@headlessui/vue';
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline';
import { onBeforeUnmount, onMounted, ref, useId } from 'vue';
import { getUserTheme, setUserTheme } from '../../utils/themeSwitch';

provideUseId(() => useId());

defineProps<{ label: string }>();

const darkEnabled = ref(false);
let observer: MutationObserver | undefined;

const sync = () => {
  darkEnabled.value = document.documentElement.classList.contains('dark');
};

onMounted(() => {
  darkEnabled.value = getUserTheme() === 'dark';
  observer = new MutationObserver(sync);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
});

onBeforeUnmount(() => observer?.disconnect());

const toggleTheme = (enabled: boolean) => setUserTheme(enabled ? 'dark' : 'light');
</script>

<template>
  <Switch v-model="darkEnabled" :class="darkEnabled ? 'border-zinc-500 bg-zinc-700 hover:border-zinc-400' : 'border-zinc-300 bg-zinc-200 hover:border-zinc-400'" class="focus-visible:ring-secondary/75 relative inline-flex h-6 w-10 cursor-pointer items-center rounded-full border shadow transition-colors outline-none hover:shadow-md focus-visible:ring" @update:model-value="toggleTheme">
    <span class="sr-only">{{ label }}</span>
    <span :class="darkEnabled ? 'ml-[18px] bg-zinc-900 text-white' : 'ml-px bg-white text-zinc-900'" class="inline-block h-[19px] w-[19px] rounded-full shadow-md outline-none">
      <SunIcon v-if="!darkEnabled" class="m-0.5" aria-hidden="true" />
      <MoonIcon v-else class="m-0.5" aria-hidden="true" />
    </span>
  </Switch>
</template>
