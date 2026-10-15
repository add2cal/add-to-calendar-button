<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, provideUseId } from '@headlessui/vue';
import { CheckIcon, ChevronDownIcon, XMarkIcon } from '@heroicons/vue/20/solid';
import { computed, useId } from 'vue';
import { usePlaygroundI18n } from '../../utils/playground/i18n';

type Value = string | number | null | undefined;
type SelectOption = Value | Record<string, unknown>;

provideUseId(() => useId());
const t = usePlaygroundI18n();
const props = defineProps<{ modelValue?: Value | Value[]; label?: string; required?: boolean; disabled?: boolean; placeholder?: string; options: SelectOption[]; byKey?: string; byValue?: string; multiselect?: boolean; hidelabel?: boolean; clearable?: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [value: Value | Value[]] }>();

const getOptionValue = (option: SelectOption) => (typeof option === 'object' && option && props.byValue ? (option[props.byValue] as Value) : (option as Value));
const getOptionLabel = (option: SelectOption) => String(typeof option === 'object' && option && props.byKey ? (option[props.byKey] ?? '') : (option ?? ''));
const selectedOptions = computed(() => props.options.filter((option) => (Array.isArray(props.modelValue) ? props.modelValue.includes(getOptionValue(option)) : props.modelValue === getOptionValue(option))));
const hasEmptyValue = computed(() => (props.multiselect ? !Array.isArray(props.modelValue) || !props.modelValue.length : !props.modelValue));
const clear = () => emit('update:modelValue', props.multiselect ? [] : '');
</script>

<template>
  <div>
    <label v-if="label" :class="['text-sm text-zinc-600 dark:text-zinc-400', required && 'required', hidelabel ? 'hidden' : 'block']">{{ label }}</label>
    <div v-if="disabled" class="ml-2 py-2"><div :aria-label="label" class="block w-full cursor-progress rounded-md bg-zinc-50 py-2 pl-3 text-sm leading-5 shadow dark:bg-zinc-700">...</div></div>
    <Listbox v-else :model-value="multiselect ? (Array.isArray(modelValue) ? modelValue : []) : modelValue" :multiple="multiselect" class="ml-2 py-2" @update:model-value="$emit('update:modelValue', $event)">
      <div class="relative w-auto">
        <ListboxButton :aria-label="`${label}: ${selectedOptions.map(getOptionLabel).join(', ')}`" :class="!hasEmptyValue && clearable ? 'pr-12' : 'pr-10'" class="btn-control relative grid w-full rounded-md bg-zinc-50 py-2 pl-3 text-left text-sm shadow hover:bg-white hover:shadow-md dark:bg-zinc-700 dark:hover:bg-zinc-600">
          <span class="block min-h-5 truncate">
            <span v-if="hasEmptyValue" class="text-xs font-normal text-zinc-400">{{ placeholder || t('labels.inputs.select_option') }}</span>
            <template v-for="(selected, index) in selectedOptions" v-else :key="getOptionLabel(selected)"><template v-if="index">,&nbsp;</template>{{ getOptionLabel(selected) }}</template>
          </span>
          <span v-if="!hasEmptyValue && clearable" class="absolute inset-y-0 right-0 z-1 flex items-center pr-7"><XMarkIcon class="hover:text-secondary h-5 w-5 text-gray-400" aria-hidden="true" @click.prevent.stop="clear" /></span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"><ChevronDownIcon class="ui-open:rotate-180 h-5 w-5 text-gray-400 transition-transform" aria-hidden="true" /></span>
        </ListboxButton>
        <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
          <ListboxOptions class="ring-secondary/75 absolute z-10 mt-2 max-h-36 w-full overflow-y-auto rounded-md bg-white py-1 text-sm shadow-lg ring focus:outline-none dark:bg-zinc-700">
            <ListboxOption v-for="option in options" v-slot="{ active, selected }" :key="getOptionLabel(option)" :value="getOptionValue(option)" as="template">
              <li :class="[active ? 'bg-secondary-light text-zinc-900' : 'text-gray-800 dark:text-zinc-200', 'hover:bg-secondary-light relative cursor-pointer py-2 pr-4 pl-10 text-left select-none']">
                <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ getOptionLabel(option) }}</span>
                <span v-if="selected" class="text-secondary absolute inset-y-0 left-0 flex items-center pl-3"><CheckIcon class="h-5 w-5" aria-hidden="true" /></span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>
