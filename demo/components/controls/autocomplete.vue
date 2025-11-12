<script setup lang="ts">
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  provideUseId,
} from '@headlessui/vue';
import { CheckIcon, ChevronDownIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/vue/20/solid';
import { getAvailableTimezones } from '@/utils/timezone';

provideUseId(() => useId());

type NullableString = string | null | undefined;
type SelectOption = string | number | { [key: string]: any };

const props = defineProps({
  modelValue: {
    type: [String, Number, Array] as PropType<NullableString | number | any[]>,
    required: false,
  },
  label: String,
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  placeholder: { type: String, default: null },
  options: { type: Array as PropType<SelectOption[]>, required: false, default: undefined },
  byKey: { type: String, default: null },
  byValue: { type: String, default: null },
  hidelabel: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  styleClass: { type: String, default: 'ml-2 py-2' },
  // behavior: enforce selecting an item from list
  forceMatch: { type: Boolean, default: false },
  // convenience: when set to 'timezone', loads timezone list
  mode: { type: String as PropType<'default' | 'timezone'>, default: 'default' },
});

const emit = defineEmits(['update:modelValue']);

// derive options based on mode
const internalOptions = computed<SelectOption[]>(() => {
  if (props.mode === 'timezone') {
    const tz = getAvailableTimezones();
    return Array.isArray(tz) ? (tz as SelectOption[]) : [];
  }
  return props.options ?? [];
});

// search query
const query = ref('');
const rootRef = ref<HTMLElement | null>(null);
const listButton = ref<any>(null);
const hasFocus = ref<boolean>(false);

// helpers to read option key/value/label
const getOptionKey = (option: SelectOption) => {
  if (option == null) return '';
  if (typeof option === 'object' && props.byKey) return option[props.byKey] ?? '';
  return option?.toString?.() ?? '';
};
const getOptionValue = (option: SelectOption) => {
  if (option == null) return '';
  if (typeof option === 'object' && props.byValue) return option[props.byValue] ?? '';
  return option;
};
const getOptionLabel = (option: SelectOption) => {
  if (option == null) return '';
  if (typeof option === 'object' && props.byKey) return option[props.byKey] ?? '';
  return option?.toString?.() ?? '';
};

// filtering
const filteredOptions = computed(() => {
  if (!query.value) return internalOptions.value;
  const q = query.value.toLowerCase().replace(/\s+/g, '');
  return internalOptions.value.filter((opt: SelectOption) => {
    const label = getOptionLabel(opt).toString().toLowerCase().replace(/\s+/g, '');
    return label.includes(q);
  });
});

const virtualizationEnabled = computed(() => filteredOptions.value.length > 200);

const onOptionsScroll = (_e: Event) => {
  // No-op; Headless UI handles virtual scroll internally when using `virtual`
};

// Sync displayed text when external modelValue changes
watch(
  () => props.modelValue,
  () => {
    query.value = '';
  }
);

const hasEmptyValue = computed(() => !props.modelValue);

const onUpdate = (val: any) => {
  emit('update:modelValue', val);
  // after selecting, unfilter the list
  query.value = '';
};

const clear = () => {
  emit('update:modelValue', null);
  query.value = '';
};

// enforce a valid selection on blur if requested
const onInputBlur = (_e: FocusEvent) => {
  // Defer to allow focus to move within the combobox (e.g., to options)
  setTimeout(() => {
    hasFocus.value = false;
    const active = document.activeElement as Node | null;
    if (rootRef.value && active && rootRef.value.contains(active)) {
      // Focus stayed within dropdown; keep it open
      return;
    }
    if (props.forceMatch) {
      // If a valid modelValue is already selected, keep it and normalize the query to its label
      if (props.modelValue != null) {
        // keep current selection; we will clear filter below
        return;
      }
      const q = query.value.trim();
      if (q) {
        const match = internalOptions.value.find((opt) => getOptionLabel(opt) === q);
        if (!match) {
          emit('update:modelValue', null);
          query.value = '';
        } else {
          emit('update:modelValue', getOptionValue(match));
          // unfilter after matching
          query.value = '';
        }
      }
    }
    // always unfilter on blur once validation/selection done
    query.value = '';
    // Let Headless UI close it naturally
  }, 0);
};

const handleWrapperClick = (e: MouseEvent) => {
  if (props.disabled) return;
  const btn = listButton.value?.el || listButton.value?.$el || listButton.value;
  if (!btn) return;
  const target = e.target as HTMLElement;
  // If click is on (or inside) the button area, let the native ComboboxButton logic handle toggle
  if (btn.contains(target)) return;
  const expanded = btn.getAttribute?.('aria-expanded') === 'true';
  // Only open if currently closed
  if (!expanded && typeof btn.click === 'function') {
    hasFocus.value = true;
    btn.click();
  }
};

// ComboboxInput display value based on modelValue
const displayValue = (val: any) => {
  const found = internalOptions.value.find((opt) => getOptionValue(opt) === val);
  return found ? getOptionLabel(found) : '';
};
</script>

<template>
  <div ref="rootRef">
    <label v-if="props.label" :class="['block text-sm text-zinc-600 dark:text-zinc-400', required && 'required', hidelabel ? 'hidden' : 'block']">
      {{ props.label }}
    </label>

    <div :class="styleClass">
      <Combobox class="min-w-0 flex-1" :modelValue="modelValue" :disabled="disabled" :virtual="virtualizationEnabled ? { options: filteredOptions } : null" @update:model-value="onUpdate">
        <div class="relative">
          <div
            :class="[
              disabled ? 'cursor-not-allowed bg-zinc-100 text-zinc-500 opacity-80 shadow-sm dark:bg-zinc-800' : 'cursor-text bg-zinc-50 shadow hover:bg-white hover:shadow-md focus:outline-none dark:bg-zinc-700 dark:hover:bg-zinc-600',
              hasFocus ? 'ring ring-secondary/75' : '',
              'flex w-full items-center gap-2 rounded-md p-2 pl-3 text-left text-sm'
            ]"
            @click="handleWrapperClick"
          >
            <div :class="['shrink-0', hasEmptyValue && 'text-zinc-400']">
              <MagnifyingGlassIcon class="h-4 w-4" />
            </div>

            <div class="relative flex w-full items-center gap-2">
              <ComboboxInput
                class="w-full truncate bg-transparent text-left text-sm caret-secondary placeholder:text-xs focus:outline-none"
                :display-value="displayValue"
                :placeholder="props.placeholder || $t('labels.inputs.select_option')"
                @change="query = ($event?.target as HTMLInputElement)?.value || ''"
                @input="query = ($event?.target as HTMLInputElement)?.value || ''"
                @blur="onInputBlur"
                @focus="hasFocus = true"
              />
              <ComboboxButton ref="listButton" class="flex shrink-0 cursor-pointer items-center">
                <span v-if="!hasEmptyValue && clearable" role="button" tabindex="0" class="focus:outline-none focus-visible:ring focus-visible:ring-secondary/75" @click.stop.prevent="clear" @keydown.space.stop.prevent="clear" @keydown.enter.stop.prevent="clear">
                  <XMarkIcon class="h-5 w-5 cursor-pointer text-zinc-400 hover:text-secondary" role="button" />
                </span>
                <ChevronDownIcon :class="['h-5 w-5 text-zinc-400 transition-transform ui-open:rotate-180']" aria-hidden="true" />
              </ComboboxButton>
            </div>
          </div>

          <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <ComboboxOptions class="absolute z-10 mt-2 max-h-52 w-full overflow-y-auto overflow-x-hidden rounded-md bg-white py-1 text-sm shadow-lg ring ring-secondary/75 focus:outline-none dark:bg-zinc-700" @scroll.passive="onOptionsScroll">
              <template v-if="filteredOptions.length">
                <ComboboxOption v-for="(option, idx) in filteredOptions" v-slot="{ active, selected }" :key="getOptionKey(option)" :value="getOptionValue(option)" as="template">
                  <li
                    :class="[
                      active ? 'bg-secondary-light text-zinc-900' : 'text-zinc-800 dark:text-zinc-200',
                      hasEmptyValue ? 'pl-3' : 'pl-10',
                      'relative cursor-pointer select-none py-2 pr-4 text-left hover:bg-secondary-light hover:text-zinc-900 dark:hover:text-zinc-900',
                    ]"
                    :data-opt-index="idx"
                  >
                    <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate', 'pr-0']">
                      <slot name="option" :option="option">{{ getOptionLabel(option) }}</slot>
                    </span>
                    <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-secondary">
                      <CheckIcon class="h-5 w-5" aria-hidden="true" />
                    </span>
                  </li>
                </ComboboxOption>
              </template>
              <template v-else>
                <div class="my-3 ml-6 italic text-[#606060]">{{ $t('labels.inputs.nothing_found') }}</div>
              </template>
            </ComboboxOptions>
          </transition>
        </div>
      </Combobox>
    </div>
  </div>
</template>
