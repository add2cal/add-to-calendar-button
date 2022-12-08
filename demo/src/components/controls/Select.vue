<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';
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
  byKey: {
    type: String,
    default: null
  },
  byValue: {
    type: String,
    default: null
  },
  multiselect: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue']);

const { t } = useI18n();

const selectedOptions = computed(() => {
  if (!props.modelValue) {
    return [];
  }

  return props.options.filter((option) => {
    const key = option && props.byValue ? option[props.byValue] : option;
    return Array.isArray(props.modelValue) ? props.modelValue.includes(key)  : props.modelValue === key
  });
})
</script>

<template>
  <div>
    <label
      v-if="label"
      :class="['block text-sm font-medium text-gray-700', required && 'required']"
    >
      {{ t(label) }}
    </label>
    <Listbox
      :modelValue="multiselect ? (Array.isArray(modelValue) ? modelValue : []) : modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      :multiple="multiselect"
    >
      <div class="relative">
        <ListboxButton
          class="focus-visible:none relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-secondary-light dark:bg-zinc-700 sm:text-sm"
        >
          <span class="block truncate">
            <template v-for="(selected, index) in selectedOptions">
              <template v-if="(index !== 0)">&nbsp;</template>
              <template v-if="byKey">
                {{ selected && selected[byKey] && t(selected[byKey]) }}
              </template>
              <template v-else>
                {{ selected && t(selected) }}
              </template>
            </template>
          </span>
          <span
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <ChevronDownIcon
              class="h-5 w-5 text-gray-400 transition-transform ui-open:rotate-180"
              aria-hidden="true"
            />
          </span>
        </ListboxButton>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute z-10 mt-1 max-h-36 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-zinc-700 sm:text-sm"
          >
            <ListboxOption
              v-for="option in options"
              :key="byKey ? option[byKey] : option"
              :value="byValue ? option[byValue] : option"
              as="template"
            >
              <li
                class="relative cursor-pointer select-none py-2 pl-10 pr-4 text-left ui-active:bg-secondary-light ui-active:text-zinc-900"
              >
                <span class="block truncate ui-selected:font-semibold">
                  {{ t(byKey ? option[byKey]: option) }}</span
                >
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>
