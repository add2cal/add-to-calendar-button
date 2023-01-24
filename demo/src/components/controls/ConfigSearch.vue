<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from "vue-router";
import Autocomplete from '@trevoreyre/autocomplete-js';
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const { t, locale } = useI18n();

const props = defineProps({
  label: Boolean,
  mobile: {
    type: Boolean,
    default: false
  }
});

const isInputFocused = ref(false);
const search = ref('');
const searchInput = ref();

const configOptions = [
  //"proKey",
  "options",
  "name",
  "description",
  "startDate",
  "startTime",
  "endDate",
  "endTime",
  "timeZone",
  "location",
  "status",
  "sequence",
  "uid",
  "organizer",
  "dates",
  "recurrence",
  "recurrence_interval",
  "recurrence_until",
  "recurrence_count",
  "recurrence_byDay",
  "recurrence_byMonthDay",
  "recurrence_byMonth",
  "recurrence_weekstart",
  "availability",
  "subscribe",
  "icsFile",
  "iCalFileName",
  "created",
  "updated",
  "buttonStyle",
  "inline",
  "customCss",
  "buttonsList",
  "label",
  "trigger",
  "listStyle",
  "hideBackground",
  "hideIconButton",
  "hideIconList",
  "hideIconModal",
  "hideTextLabelButton",
  "hideTextLabelList",
  "hideCheckmark",
  "size",
  "lightMode",
  "language",
  "customLabels",
  "images",
  "hideRichData",
  "identifier",
  "bypassWebViewCheck",
  "hideBranding",
  "debug"
];

const getFilteredOptions = () => {
  if (!search.value) {
    return configOptions;
  }

  return configOptions.filter((option: string) => option
    .toLowerCase()
    .replace(/\s+/g, '')
    .includes(search.value.toLowerCase().replace(/\s+/g, ''))
  );
};

const elID = (function() {
  if (props.mobile) {
    return 'configsearch-mobile';
  }
  return 'configsearch';
})();

const elInputID = (function() {
  if (props.mobile) {
    return 'configsearch-input-mobile';
  }
  return 'configsearch-input';
})();

const elNoResultsID = (function() {
  if (props.mobile) {
    return 'configsearch-no-results-mobile';
  }
  return 'configsearch-no-results';
})();

onMounted(() => {
  new Autocomplete('#' + elID, {
    search: (input: string) => {
      search.value = input;
      return getFilteredOptions();
    },
    onSubmit: (value: string, myLocale: any = locale) => {
      if (value !== undefined) {
        router.push({
          name: 'configuration',
          hash: '#' + value.toLowerCase(),
          params: { myLocale }
        });
        searchInput.value && searchInput.value.blur();
        searchInput.value.value = '';
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

const onSearchInputBlur = () => {
  isInputFocused.value = false;

  if (searchInput.value && !configOptions.includes(searchInput.value.value.toString().trim())) {
    searchInput.value.value = '';
  }
}
</script>

<template>
  <div>
    <label v-if="label" class="hidden pr-5 text-sm text-zinc-500 sm:inline-block">{{ t('content.config.find_params') }}: </label>
    <div class="relative" :class="label ? 'block sm:inline-block' : 'block w-full'">
      <div :id="elID" class="autocomplete">
        <div class="group mt-1 grid w-full cursor-default rounded-md bg-zinc-50 shadow hover:bg-white hover:shadow-md focus:outline-none focus-visible:ring focus-visible:ring-secondary focus-visible:ring-opacity-75 dark:bg-zinc-700 dark:hover:bg-zinc-600">
          <input
            :id="elInputID"
            class="autocomplete-input truncate rounded-md bg-zinc-50 py-2 pr-10 pl-3 text-left text-sm focus:outline-none focus-visible:ring focus-visible:ring-secondary focus-visible:ring-opacity-75 group-hover:bg-white dark:bg-zinc-700 dark:group-hover:bg-zinc-600"
            ref="searchInput"
            :placeholder="t('labels.inputs.search')"
            :aria-label="t('labels.inputs.search')"
            @focus="onSearchInputFocus"
            @blur="onSearchInputBlur"
          />
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </div>
        <ul class="autocomplete-result-list absolute z-10 mt-2.5 max-h-36 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring ring-secondary ring-opacity-75 focus:outline-none dark:bg-zinc-700" />
        <ul :id="elNoResultsID" v-if="isInputFocused && !getFilteredOptions().length" class="autocomplete-result-list absolute z-10 mt-3 max-h-36 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring ring-red-600 ring-opacity-75 focus:outline-none dark:bg-zinc-700">
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

[data-position='above'] .autocomplete-result-list {
  @apply mt-0 mb-2.5;
}
</style>
