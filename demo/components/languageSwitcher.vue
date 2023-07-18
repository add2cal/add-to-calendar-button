<script setup lang="ts">
import { set, LSKey } from '@/utils/localStorage';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue';
import { LanguageIcon, CheckIcon, ChevronDownIcon } from '@heroicons/vue/20/solid';

const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const currentId = locales.value.findIndex((e: { code: string; }) => e.code === locale.value);
const currentLanguage = ref(locales.value[currentId]);

// push route when locale change has been detected
watch(currentLanguage, val => {
  set(LSKey.LANG, val.code);
  navigateTo(switchLocalePath(val.code));
});
</script>

<template>
  <div class="mx-auto w-36">
    <Listbox v-model="currentLanguage">
      <div class="relative">
        <ListboxButton class="language-switch-btn">
          <span class="icon">
            <LanguageIcon class="h-5 w-5" aria-hidden="true" />
          </span>
          <span class="label">{{ currentLanguage.name }}</span>
          <span class="arrow">
            <ChevronDownIcon class="h-5 w-5 text-gray-400 transition-transform ui-open:rotate-180" aria-hidden="true" />
          </span>
        </ListboxButton>

        <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
          <ListboxOptions class="language-switch-list">
            <ListboxOption v-for="entry in locales" v-slot="{ active, selected }" :key="entry.code" :value="entry" as="template">
              <li
                :class="[
                  active ? 'bg-secondary-light text-zinc-900' : 'text-gray-800 dark:text-zinc-200',
                  'relative cursor-pointer select-none py-2 pl-10 pr-4 text-left hover:bg-secondary-light',
                ]"
              >
                <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ entry.name }}</span>
                <span v-if="selected" class="check">
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>

<style scoped>
.language-switch-btn {
  @apply relative w-full cursor-pointer rounded-lg bg-zinc-50 py-2 pl-9 pr-10 text-left shadow hover:bg-white hover:shadow-md focus:outline-none focus-visible:ring focus-visible:ring-secondary focus-visible:ring-opacity-75 dark:bg-zinc-700 dark:hover:bg-zinc-600 sm:text-sm;
}

.language-switch-btn .icon {
  @apply pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2;
}

.language-switch-btn .label {
  @apply block truncate;
}

.language-switch-btn .arrow {
  @apply pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2;
}

.language-switch-list {
  @apply absolute mt-1 max-h-36 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-700 sm:text-sm;
}

.language-switch-list li .check {
  @apply absolute inset-y-0 left-0 flex items-center pl-3 text-secondary;
}
</style>
