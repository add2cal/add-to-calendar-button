<script setup lang="ts">
import Autocomplete from '@trevoreyre/autocomplete-js';
import { getAvailableTimezones } from '@/utils/timezone';
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid';

const props = defineProps({
  modelValue: [String, Number, Array],
  label: String,
  required: {
    type: Boolean,
    default: false
  },
  mobile: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
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

const elID = (function() {
  if (props.mobile) {
    return 'tz-mobile';
  }
  return 'tz';
})();

const elInputID = (function() {
  if (props.mobile) {
    return 'tz-input-mobile';
  }
  return 'tz-input';
})();

const elNoResultsID = (function() {
  if (props.mobile) {
    return 'tz-no-results-mobile';
  }
  return 'tz-no-results';
})();

onMounted(() => {
  if (props.modelValue && getFilteredTimezoneOptions().includes(props.modelValue.toString())) {
    if (searchInput.value) searchInput.value.value = props.modelValue;
  }

  if (import.meta.client) {
    new Autocomplete('#' + elID, {
      search: (input: string) => {
        search.value = input;
        return getFilteredTimezoneOptions();
      },
      onSubmit: (value: string) => {
        if (value !== undefined) {
          emit('update:modelValue', value);
          if (searchInput.value) searchInput.value.blur();
        }
      },
      autoSelect: true,
      debounceTime: 100,
    });
  }
});

const onSearchInputFocus = () => {
  isInputFocused.value = true;
  if (searchInput.value) searchInput.value.select();
}

const onSearchInputBlur = () => {
  isInputFocused.value = false;

  if (searchInput.value) {
    const value = searchInput.value.value.toString().trim();
    if (!timezoneOptions.includes(value)) {
      searchInput.value.value = '';
      emit('update:modelValue', '');
    } else {
      emit('update:modelValue', value);
    }
  }
}

// watch props changes to synch mobile and desktop field here
if (import.meta.client) {
  watch(props, () => {
    if (searchInput.value) searchInput.value.value = props.modelValue;
  });
}
</script>

<template>
  <div>
    <label v-if="label" :class="['block text-sm text-zinc-600 dark:text-zinc-400', required && 'required']">
      {{ label }}
    </label>
    <div class="relative w-full py-2 pl-2">
      <div :id="elID" class="autocomplete">
        <div class="group grid w-full cursor-default rounded-md bg-zinc-50 shadow hover:bg-white hover:shadow-md focus:outline-none focus-visible:ring focus-visible:ring-secondary/75 dark:bg-zinc-700 dark:hover:bg-zinc-600">
          <input
            :id="elInputID"
            ref="searchInput"
            :disabled="disabled"
            :class="[disabled && 'cursor-progress', 'autocomplete-input truncate rounded-md bg-zinc-50 py-2 pl-3 pr-10 text-left text-sm caret-secondary placeholder:text-xs focus:outline-none focus-visible:ring focus-visible:ring-secondary/75 group-hover:bg-white dark:bg-zinc-700 dark:group-hover:bg-zinc-600']"
            :placeholder="$t('labels.inputs.search_time_zone')"
            :aria-label="$t('labels.inputs.search_time_zone')"
            @focus="onSearchInputFocus"
            @blur="onSearchInputBlur"
          />
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </div>
        <ul style="visibility:hidden" class="autocomplete-result-list absolute z-10 mt-2.5 max-h-36 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring ring-secondary/75 focus:outline-none dark:bg-zinc-700" />
        <ul v-if="isInputFocused && !getFilteredTimezoneOptions().length" :id="elNoResultsID" class="autocomplete-result-list absolute z-10 mt-3 max-h-36 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring ring-red-600/75 focus:outline-none dark:bg-zinc-700">
          <li class="no-result relative cursor-default select-none px-4 py-2 italic">{{ $t('labels.inputs.nothing_found') }}</li>
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

[data-position='above'] .autocomplete-result-list {
  @apply mt-0 mb-2.5;
}
</style>
