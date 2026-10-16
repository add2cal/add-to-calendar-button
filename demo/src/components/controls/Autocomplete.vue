<script setup lang="ts">
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, provideUseId } from '@headlessui/vue';
import { CheckIcon, ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/20/solid';
import { computed, ref, useId } from 'vue';
import { getAvailableTimezones } from '../../utils/playground/timezone';
import { usePlaygroundI18n } from '../../utils/playground/i18n';

type Value = string | number | null | undefined;
type SelectOption = Value | Record<string, unknown>;

provideUseId(() => useId());
const t = usePlaygroundI18n();
const props = withDefaults(defineProps<{ modelValue?: Value; label?: string; required?: boolean; disabled?: boolean; placeholder?: string; options?: SelectOption[]; byKey?: string; byValue?: string; hidelabel?: boolean; clearable?: boolean; styleClass?: string; forceMatch?: boolean; mode?: 'default' | 'timezone' }>(), { options: () => [], styleClass: 'ml-2 py-2', mode: 'default' });
const emit = defineEmits<{ 'update:modelValue': [value: Value] }>();
const query = ref('');
const root = ref<HTMLElement>();
const listButton = ref<{ $el?: HTMLElement } | HTMLElement>();
const focused = ref(false);
const internalOptions = computed<SelectOption[]>(() => (props.mode === 'timezone' ? getAvailableTimezones() : props.options));
const getOptionValue = (option: SelectOption) => (typeof option === 'object' && option && props.byValue ? (option[props.byValue] as Value) : (option as Value));
const getOptionLabel = (option: SelectOption) => String(typeof option === 'object' && option && props.byKey ? (option[props.byKey] ?? '') : (option ?? ''));
const normalizeSearch = (value: string) => value.toLowerCase().replaceAll(/[\s_-]/g, '');
const filteredOptions = computed(() => {
  const search = normalizeSearch(query.value);
  return search ? internalOptions.value.filter((option) => normalizeSearch(getOptionLabel(option)).includes(search)) : internalOptions.value;
});
const virtualizationEnabled = computed(() => filteredOptions.value.length > 200);
const displayValue = (value: Value) => getOptionLabel(internalOptions.value.find((option) => getOptionValue(option) === value));
const update = (value: Value) => {
  emit('update:modelValue', value);
  query.value = '';
};
const clear = () => update(null);
const blur = () =>
  window.setTimeout(() => {
    focused.value = false;
    if (root.value?.contains(document.activeElement)) return;
    if (props.forceMatch && query.value) {
      if (props.modelValue != null) return;
      const match = internalOptions.value.find((option) => getOptionLabel(option) === query.value.trim());
      if (!match) emit('update:modelValue', null);
      else emit('update:modelValue', getOptionValue(match));
    }
    query.value = '';
  });
const open = (event: MouseEvent) => {
  if (props.disabled) return;
  const button = listButton.value instanceof HTMLElement ? listButton.value : listButton.value?.$el;
  if (!button || button.contains(event.target as Node) || button.getAttribute('aria-expanded') === 'true') return;
  focused.value = true;
  button.click();
};
</script>

<template>
  <div ref="root" class="w-full">
    <label v-if="label" :class="['text-sm text-zinc-600 dark:text-zinc-400', required && 'required', hidelabel ? 'hidden' : 'block']">{{ label }}</label>
    <div :class="styleClass">
      <Combobox class="min-w-0 flex-1" :model-value="modelValue" :disabled="disabled" :virtual="virtualizationEnabled ? { options: filteredOptions } : undefined" @update:model-value="update">
        <div class="relative">
          <div :class="[disabled ? 'cursor-not-allowed bg-zinc-100 text-zinc-500 opacity-80 dark:bg-zinc-800' : 'cursor-text bg-zinc-50 shadow hover:bg-white hover:shadow-md dark:bg-zinc-700 dark:hover:bg-zinc-600', focused && 'ring-primary ring-2', 'flex min-h-11 w-full items-center gap-2 rounded-lg py-0 pr-1 pl-3 text-left text-sm']" @click="open">
            <MagnifyingGlassIcon :class="['h-4 w-4 shrink-0', !modelValue && 'text-zinc-400']" aria-hidden="true" />
            <div class="relative flex w-full items-center gap-2">
              <ComboboxInput class="caret-secondary min-h-11 w-full truncate bg-transparent text-left text-base focus:outline-none" :display-value="displayValue" :placeholder="placeholder || t('labels.inputs.select_option')" @change="query = ($event.target as HTMLInputElement).value" @input="query = ($event.target as HTMLInputElement).value" @blur="blur" @focus="focused = true" />
              <ComboboxButton ref="listButton" :aria-label="`${t('labels.inputs.show_options')}: ${label || placeholder || t('labels.inputs.select_option')}`" class="btn-control flex size-11 shrink-0 items-center justify-center">
                <span v-if="modelValue && clearable" role="button" tabindex="0" @click.stop.prevent="clear" @keydown.space.stop.prevent="clear" @keydown.enter.stop.prevent="clear"><XMarkIcon class="hover:text-secondary h-5 w-5 text-zinc-400" /></span>
                <ChevronDownIcon class="ui-open:rotate-180 h-5 w-5 text-zinc-400 transition-transform" aria-hidden="true" />
              </ComboboxButton>
            </div>
          </div>
          <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <ComboboxOptions class="ring-secondary/75 absolute z-10 mt-2 max-h-52 w-full overflow-y-auto rounded-md bg-white py-1 text-sm shadow-lg ring focus:outline-none dark:bg-zinc-700">
              <ComboboxOption v-for="option in filteredOptions" v-slot="{ active, selected }" :key="getOptionLabel(option)" :value="getOptionValue(option)" as="template">
                <li :class="[active ? 'bg-secondary-light text-zinc-900' : 'text-zinc-800 dark:text-zinc-200', modelValue ? 'pl-10' : 'pl-3', 'hover:bg-secondary-light relative cursor-pointer py-2 pr-4 text-left select-none hover:text-zinc-900']">
                  <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ getOptionLabel(option) }}</span>
                  <span v-if="selected" class="text-secondary absolute inset-y-0 left-0 flex items-center pl-3"><CheckIcon class="h-5 w-5" aria-hidden="true" /></span>
                </li>
              </ComboboxOption>
              <div v-if="!filteredOptions.length" class="my-3 ml-6 text-zinc-600 italic">{{ t('labels.inputs.nothing_found') }}</div>
            </ComboboxOptions>
          </transition>
        </div>
      </Combobox>
    </div>
  </div>
</template>
