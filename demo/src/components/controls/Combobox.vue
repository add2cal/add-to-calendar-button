<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  ComboboxButton,
  TransitionRoot
} from '@headlessui/vue';
import { ChevronUpDownIcon } from '@heroicons/vue/20/solid';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  modelValue: [String, Number, Array],
  label: String,
  required: {
    type: Boolean,
    default: false
  },
  placeholder: String,
  options: Array,
});

defineEmits(['update:modelValue']);

const { t } = useI18n();

const search = ref("");

let filteredOptions = computed(() => {
  if (!props.options) {
    return [];
  }

  if (!search.value) {
    return props.options;
  }

  return props.options.filter((option) => option
    .toLowerCase()
    .replace(/\s+/g, '')
    .includes(search.value.toLowerCase().replace(/\s+/g, ''))
  );
});
</script>

<template>
  <div>
    <label v-if="label" :class="['block text-sm font-medium text-gray-700', required && 'required']">
      {{ t(label) }}
    </label>

    <Combobox :value="modelValue" @update:modelValue="$emit('update:modelValue', $event)" as="div">
      <div class="relative mt-1">
        <div class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
          <ComboboxInput class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 outline-none focus:ring-0" :value="modelValue" @change="search = $event.target.value" />
          <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </ComboboxButton>
        </div>

        <TransitionRoot leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" @after-leave="search = ''">
          <ComboboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            <div v-if="!filteredOptions.length && !!search" class="relative cursor-default select-none py-2 px-4 text-gray-700">Nothing found.</div>

            <ComboboxOption v-for="option in filteredOptions" :key="option" :value="option" as="template" v-slot="{ selected, active }">
              <li
                class="relative cursor-default select-none py-2 pl-10 pr-4"
                :class="{
                  'bg-teal-600 text-white': active,
                  'text-gray-900': !active,
                }"
              >
                <span class="block truncate" :class="{ 'font-medium': selected, 'font-normal': !selected }">
                  {{ t(option) }}
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
  </div>
</template>
