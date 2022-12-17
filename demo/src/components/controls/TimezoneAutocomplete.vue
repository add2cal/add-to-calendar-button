<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted } from 'vue'
import { getAvailableTimezones } from '@/utils/timezone';
import Autocomplete from '@trevoreyre/autocomplete-js';

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
  if (props.modelValue && getFilteredTimezoneOptions().includes(props.modelValue)) {
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
    autoSelect: false,
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
    <div id="autocomplete" class="autocomplete">
      <input class="autocomplete-input" ref="searchInput" placeholder="Search for a time zone..." aria-label="Search for a time zone..." @focus="onSearchInputFocus" @blur="isInputFocused  =false" />
      <ul class="autocomplete-result-list" />
      <ul id="tz-no-results" v-if="isInputFocused && !getFilteredTimezoneOptions().length" class="autocomplete-result-list">
        <li class="autocomplete-result no-result">No results found.</li>
      </ul>
    </div>
  </div>
</template>
