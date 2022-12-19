<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Switch } from '@headlessui/vue';
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline';
import { useI18n } from 'vue-i18n'

export type UserTheme = 'light' | 'dark';

const { t } = useI18n();

const setTheme = (theme: UserTheme) => {
  localStorage.setItem('user-theme', theme);
  userTheme.value = theme;
};

const getTheme = (): UserTheme => {
  return localStorage.getItem('user-theme') as UserTheme;
};

const toggleTheme = (): void => {
  const activeTheme = localStorage.getItem('user-theme');
  if (activeTheme === 'light') {
    setTheme('dark');
    document.documentElement.classList.add('atcb-dark');
  } else {
    setTheme('light');
    document.documentElement.classList.remove('atcb-dark');
  }
};

const getMediaPreference = (): UserTheme => {
  /*const hasDarkPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (hasDarkPreference) {
    return 'dark';
  } else {
    return 'light';
  }*/
  // for now, we will not adapt to any system setting, but always start light, since it better suits the button. Might change this in the future. Therefore, we leave it commented
  return 'light';
};

const userTheme = ref<UserTheme>(getTheme() || getMediaPreference());

const darkEnabled = userTheme.value == 'dark' ? ref(true) : ref(false);

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
  if (userTheme.value == 'dark') {
    document.documentElement.classList.add('atcb-dark');
  }
  setTheme(userTheme.value);
  docObserver.observe(document.documentElement, { attributes: true });
});

onUnmounted(() => {
if (typeof docObserver !== 'undefined') {
  docObserver.disconnect();
}
});
</script>

<template>
  <Switch @update:model-value="toggleTheme" v-model="darkEnabled" :class="darkEnabled ? 'border-zinc-500 bg-zinc-700 hover:border-zinc-400' : 'border-zinc-300 bg-zinc-200 hover:border-zinc-400'" class="relative inline-flex h-[24px] w-[40px] items-center rounded-full border shadow hover:shadow-md">
    <span class="sr-only">{{ t('labels.enableDarkMode') }}</span>
    <span :class="darkEnabled ? 'ml-[18px] bg-zinc-900 text-white' : 'ml-[1px] bg-white text-zinc-900'" class="inline-block h-[19px] w-[19px] transform rounded-full shadow-md transition"><SunIcon class="m-[2px] ui-checked:hidden" /><MoonIcon class="m-[2px] ui-not-checked:hidden" /></span>
  </Switch>
</template>
