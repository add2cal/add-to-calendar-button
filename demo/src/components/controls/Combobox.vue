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

const search = ref("");

let filteredOptions = computed(() => {
  if (!props.options) {
    return [];
  }

  if (!search.value) {
    return props.options;
  }

  return props.options.filter((option: any) => option
    .toLowerCase()
    .replace(/\s+/g, '')
    .includes(search.value.toLowerCase().replace(/\s+/g, ''))
  );
});
</script>

<template>
  <div>
    <label v-if="props.label" :class="['block text-sm text-zinc-400 dark:text-zinc-500', props.required && 'required']">
      {{ props.label }}
    </label>

    <Combobox :value="modelValue" @update:modelValue="$emit('update:modelValue', $event)" as="div">
      <div class="relative w-full pl-2">
        <div class="group mt-1 grid w-full cursor-default rounded-md bg-zinc-50 shadow hover:bg-white hover:shadow-md focus:outline-none focus-visible:ring focus-visible:ring-secondary focus-visible:ring-opacity-75 dark:bg-zinc-700 dark:hover:bg-zinc-600">
          <ComboboxInput
            class="truncate rounded-md bg-zinc-50 py-2 pr-10 pl-3 text-left text-sm focus:outline-none focus-visible:ring focus-visible:ring-secondary focus-visible:ring-opacity-75 group-hover:bg-white dark:bg-zinc-700 dark:group-hover:bg-zinc-600"
            :value="modelValue"
            @change="search = $event.target.value"
          />
          <ComboboxButton class="absolute inset-y-0 right-0 flex items-center truncate pr-2">
            <ChevronUpDownIcon class="h-5 w-5 cursor-pointer text-gray-400" aria-hidden="true" />
          </ComboboxButton>
        </div>

        <TransitionRoot leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" @after-leave="search = ''">
          <ComboboxOptions :class="!filteredOptions.length && !!search ? 'ring-red-600' : 'ring-secondary'" class="absolute z-10 mt-2 max-h-36 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-opacity-75 focus:outline-none dark:bg-zinc-700">
            <div v-if="!filteredOptions.length && !!search" class="relative cursor-default select-none py-2 px-4 italic" v-t="'labels.inputs.nothing_found'"></div>

            <ComboboxOption v-for="option in filteredOptions" :key="(option as string)" :value="(option as string)" as="template">
              <li class="relative cursor-pointer select-none py-2 px-3 text-left ui-active:bg-secondary-light ui-active:text-zinc-900">
                <span class="block truncate">
                  {{ option }}
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
  </div>
</template>
