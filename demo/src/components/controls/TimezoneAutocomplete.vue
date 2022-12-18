<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted } from 'vue'
import { getAvailableTimezones } from '@/utils/timezone';
import Autocomplete from '@trevoreyre/autocomplete-js';
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid';
import { useI18n } from 'vue-i18n'
const { t } = useI18n();

const props = defineProps({
  modelValue: [String, Number, Array],
  label: String,
  required: {
    type: Boolean,
    default: false
  },
});

const emit = defineEmits(['update:modelValue']);

const isInputFocused = ref(false);
const search = ref('');
const searchInput = ref();

const timezoneOptionsImport = getAvailableTimezones();
const timezoneOptions = (() => Array.isArray(timezoneOptionsImport) ? timezoneOptionsImport : [])();

const getFilteredTimezoneOptions = () => {
  if (!search.value) {
    return timezoneOptions;
  }

  return timezoneOptions.filter((option: string) => option
    .toLowerCase()
    .replace(/\s+/g, '')
    .includes(search.value.toLowerCase().replace(/\s+/g, ''))
  );
};

onMounted(() => {
  if (props.modelValue && getFilteredTimezoneOptions().includes(props.modelValue.toString())) {
    searchInput.value && (searchInput.value.value = props.modelValue)
  }

  new Autocomplete('#autocomplete', {
    search: (input: string) => {
      search.value = input;
      return getFilteredTimezoneOptions();
    },
    onSubmit: (value: string) => {
      if (value !== undefined) {
        emit('update:modelValue', value);
        searchInput.value && searchInput.value.blur();
      }
    },
    autoSelect: true,
    debounceTime: 100,
  });
})

const onSearchInputFocus = () => {
  isInputFocused.value = true;
  searchInput.value && searchInput.value.select();
}
</script>

<template>
  <div>
    <label v-if="label" :class="['block text-sm text-zinc-400 dark:text-zinc-500', required && 'required']">
      {{ label }}
    </label>
    <div class="relative w-full pl-2">
      <div id="autocomplete" class="autocomplete">
        <div class="group mt-1 grid w-full cursor-default rounded-md bg-zinc-50 shadow hover:bg-white hover:shadow-md focus:outline-none focus-visible:ring focus-visible:ring-secondary focus-visible:ring-opacity-75 dark:bg-zinc-700 dark:hover:bg-zinc-600">
          <input
            id="autocomplete-input"
            class="autocomplete-input truncate rounded-md bg-zinc-50 py-2 pr-10 pl-3 text-left text-sm focus:outline-none focus-visible:ring focus-visible:ring-secondary focus-visible:ring-opacity-75 group-hover:bg-white dark:bg-zinc-700 dark:group-hover:bg-zinc-600"
            ref="searchInput"
            :placeholder="t('labels.inputs.search_time_zone')"
            :aria-label="t('labels.inputs.search_time_zone')"
            @focus="onSearchInputFocus"
            @blur="isInputFocused=false"
          />
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </div>
        <ul class="autocomplete-result-list absolute z-10 mt-3 max-h-36 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring ring-secondary ring-opacity-75 focus:outline-none dark:bg-zinc-700" />
        <ul id="tz-no-results" v-if="isInputFocused && !getFilteredTimezoneOptions().length" class="autocomplete-result-list absolute z-10 mt-3 max-h-36 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring ring-red-600 ring-opacity-75 focus:outline-none dark:bg-zinc-700">
          <li class="no-result relative cursor-default select-none py-2 px-4 italic" v-t="'labels.inputs.nothing_found'">Nothing found.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
.autocomplete-result {
  @apply relative cursor-pointer select-none py-2 px-3 text-left truncate;
}

.autocomplete-result[aria-selected="true"] {
  @apply font-semibold;
}

.autocomplete-result:hover {
  @apply bg-secondary-light text-zinc-900;
}
</style>
