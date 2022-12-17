<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue';
import { CheckIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/vue/20/solid';

const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    required: false,
  },
  label: String,
  required: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String
  },
  options: {
    type: Array,
    required: true
  },
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
  },
  clearable: {
    type: Boolean,
    default: false
  },
});

const emit = defineEmits(['update:modelValue']);

const selectedOptions = computed(() => {
  if (!props.modelValue || !props.options) {
    return [];
  }

  return props.options.filter((option: any) => {
    const key = option && props.byValue ? option[props.byValue] : option;
    return Array.isArray(props.modelValue) ? props.modelValue.includes(key) : props.modelValue === key
  });
});

const hasEmptyValue = computed(() => props.multiselect ? !(Array.isArray(props.modelValue) && !!props.modelValue.length) : !props.modelValue);

const clear = () => {
  emit('update:modelValue', props.multiselect ? [] : '');
}
</script>

<template>
  <div>
    <label v-if="label" :class="['block text-sm text-zinc-400 dark:text-zinc-500', required && 'required']">
      {{ label }}
    </label>
    <Listbox :modelValue="multiselect ? (Array.isArray(modelValue) ? modelValue : []) : modelValue" :multiple="multiselect" class="mt-1 pl-2" @update:modelValue="$emit('update:modelValue', $event)">
      <div class="relative w-full">
        <ListboxButton
          :class="[
            'grid w-full cursor-pointer rounded-md bg-zinc-50 py-2 pl-3 text-left text-sm shadow hover:bg-white hover:shadow-md focus:outline-none focus-visible:ring focus-visible:ring-secondary focus-visible:ring-opacity-75 dark:bg-zinc-700 dark:hover:bg-zinc-600',
            !hasEmptyValue && clearable ? 'pr-12' : 'pr-10'
          ]"
        >
          <span class="block h-auto min-h-[20px] truncate">
            <span v-if="modelValue==''" class="font-normal text-gray-400">{{ props.placeholder }}<span v-if="!props.placeholder" v-t="'labels.inputs.select_option'"></span></span>
            <template v-for="(selected, index) in selectedOptions">
              <template v-if="(index !== 0)">,&nbsp;</template>
              <slot name="selected" :option="selected">
                <template v-if="byKey">
                  {{ selected && selected[byKey as keyof typeof selected] }}
                </template>
                <template v-else>
                  {{ selected }}
                </template>
              </slot>
            </template>
          </span>

          <span class="z-1 absolute inset-y-0 right-0 flex items-center pr-7" v-if="!hasEmptyValue && clearable">
            <XMarkIcon class="h-5 w-5 text-gray-400" aria-hidden="true" @click.prevent="clear" />
          </span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon class="h-5 w-5 text-gray-400 transition-transform ui-open:rotate-180" aria-hidden="true" />
          </span>
        </ListboxButton>

        <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
          <ListboxOptions class="absolute z-10 mt-2 max-h-36 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring ring-secondary ring-opacity-75 focus:outline-none dark:bg-zinc-700">
            <ListboxOption
              v-slot="{ selected }"
              v-for="option in props.options"
              :key="(byKey && typeof option === 'object' && option != null) ? option[byKey as keyof typeof option] : (option as string)"
              :value="(byValue && typeof option === 'object' && option != null) ? option[byValue as keyof typeof option] : (option as string)"
              as="template"
            >
              <li class="relative cursor-pointer select-none py-2 pl-10 pr-4 text-left ui-active:bg-secondary-light ui-active:text-zinc-900">
                <span class="block truncate ui-selected:font-semibold">
                  <slot name="option" :option="option">{{ (byKey && typeof option === 'object' && option != null) ? option[byKey as keyof typeof option]: (option as string) }}</slot>
                </span>
                <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-secondary">
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
