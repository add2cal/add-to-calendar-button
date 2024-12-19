<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  provideUseId,
} from '@headlessui/vue';
import { CheckIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/vue/20/solid';

provideUseId(() => useId());
const { t } = useI18n();

type NullableString = string | null | undefined;

interface SelectOption {
  [key: string]: any;
}

const props = defineProps({
  modelValue: {
    type: [String, Number, Array] as PropType<NullableString | number | any[]>,
    required: false,
  },
  label: String,
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String
  },
  options: {
    type: Array as PropType<SelectOption[]>,
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
  hidelabel: {
    type: Boolean,
    default: false
  },
  clearable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const selectedOptions = computed(() => {
  if (!props.modelValue || !props.options) {
    return [];
  }

  return props.options.filter((option: SelectOption) => {
    const key = option && props.byValue ? option[props.byValue] : option;
    return Array.isArray(props.modelValue) ? props.modelValue.includes(key) : props.modelValue === key
  });
});

const hasEmptyValue = computed(() => props.multiselect ? !(Array.isArray(props.modelValue) && !!props.modelValue.length) : !props.modelValue);

const clear = () => {
  emit('update:modelValue', props.multiselect ? [] : '');
}

const getOptionKey = (option: SelectOption) => {
  if (!option) return '';
  if (typeof option === 'object' && props.byKey) {
    return option[props.byKey] ?? '';
  }
  return option?.toString() ?? '';
};

const getOptionValue = (option: SelectOption) => {
  if (!option) return '';
  if (typeof option === 'object' && props.byValue) {
    return option[props.byValue] ?? '';
  }
  return option;
};

const getOptionLabel = (option: SelectOption) => {
  if (!option) return '';
  if (typeof option === 'object' && props.byKey) {
    return option[props.byKey] ?? '';
  }
  return option?.toString() ?? '';
};
</script>

<template>
  <div>
    <label v-if="label" :class="['text-sm text-zinc-600 dark:text-zinc-400', required && 'required', hidelabel ? 'hidden' : 'block']">
      {{ label }}
    </label>
    <div v-if="disabled" class="ml-2 py-2">
      <div :aria-label="label" class="block w-full flex-1 cursor-progress rounded-md bg-zinc-50 py-2 pl-3 text-sm leading-5 shadow dark:bg-zinc-700">...</div>
    </div>
    <template v-else>
      <Listbox :modelValue="multiselect ? (Array.isArray(modelValue) ? modelValue : []) : modelValue" :multiple="multiselect" class="ml-2 py-2" @update:model-value="$emit('update:modelValue', $event)">
        <div class="relative w-auto">
          <ListboxButton
            :aria-label="label + ': ' + (multiselect ? selectedOptions.map((option: any) => option[byKey as keyof typeof option]).join(', ') : selectedOptions[0])"
            :class="[
                !hasEmptyValue && clearable ? 'pr-12' : 'pr-10'
              ]"
            class="relative grid w-full cursor-pointer rounded-md bg-zinc-50 py-2 pl-3 text-left text-sm shadow hover:bg-white hover:shadow-md focus:outline-none focus-visible:ring focus-visible:ring-secondary/75 dark:bg-zinc-700 dark:hover:bg-zinc-600"
          >
            <span class="block h-auto min-h-[20px] truncate">
              <span v-if="!modelValue || modelValue === '' || (Array.isArray(modelValue) && modelValue.length === 0)" class="text-xs font-normal text-zinc-400">
                {{ placeholder || t('labels.inputs.select_option') }}
              </span>
              <template v-for="(selected, index) in selectedOptions" v-else :key="index">
                <template v-if="index !== 0">,&nbsp;</template>
                <slot name="selected" :option="selected">
                  <template v-if="byKey && selected">
                    {{ selected[byKey] || '' }}
                  </template>
                  <template v-else>
                    {{ selected || '' }}
                  </template>
                </slot>
              </template>
            </span>

            <span v-if="!hasEmptyValue && clearable" class="z-1 absolute inset-y-0 right-0 flex items-center pr-7">
              <XMarkIcon class="h-5 w-5 text-gray-400 hover:text-secondary" aria-hidden="true" @click.prevent="clear" />
            </span>
            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon class="h-5 w-5 text-gray-400 transition-transform ui-open:rotate-180" aria-hidden="true" />
            </span>
          </ListboxButton>

          <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <ListboxOptions class="absolute z-10 mt-2 max-h-36 w-full overflow-y-auto overflow-x-hidden rounded-md bg-white py-1 text-sm shadow-lg ring ring-secondary/75 focus:outline-none dark:bg-zinc-700">
              <ListboxOption v-for="option in options" v-slot="{ active, selected }" :key="getOptionKey(option)" :value="getOptionValue(option)" as="template">
                <li
                  :class="[
                      active ? 'bg-secondary-light text-zinc-900' : 'text-gray-800 dark:text-zinc-200',
                      'relative cursor-pointer select-none py-2 pl-10 pr-4 text-left hover:bg-secondary-light',
                    ]"
                >
                  <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                    {{ getOptionLabel(option) }}
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
    </template>
  </div>
</template>
