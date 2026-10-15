<script setup lang="ts">
import { CalendarDaysIcon, PencilSquareIcon, XMarkIcon } from '@heroicons/vue/20/solid';
import { computed, ref, useId, watch } from 'vue';
import { usePlaygroundI18n } from '../../utils/playground/i18n';

const props = withDefaults(
  defineProps<{
    modelValue?: string | null;
    labelText?: string;
    required?: boolean;
    disabled?: boolean;
    type?: 'date' | 'time';
    placeholder?: string;
    hidelabel?: boolean;
    hideClear?: boolean;
    styleClass?: string;
    fullWidth?: boolean;
    noCustomInput?: boolean;
  }>(),
  {
    modelValue: '',
    labelText: '',
    type: 'date',
    styleClass: 'flex items-center py-2 pl-2',
  },
);

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
const t = usePlaygroundI18n();
const inputId = useId();
const inputValue = ref('');
const customValue = ref('');
const customInput = ref(false);
const hasValue = computed(() => Boolean(inputValue.value || customValue.value));

const isNativeDate = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const candidate = new Date(0);
  candidate.setUTCHours(0, 0, 0, 0);
  candidate.setUTCFullYear(year, month - 1, day);
  return year > 0 && candidate.getUTCFullYear() === year && candidate.getUTCMonth() === month - 1 && candidate.getUTCDate() === day;
};

watch(
  () => props.modelValue,
  (value) => {
    const next = value ?? '';
    if (props.type === 'date' && next && !isNativeDate(next) && !props.noCustomInput) {
      customInput.value = true;
      customValue.value = next;
      inputValue.value = '';
    } else {
      inputValue.value = next;
      customValue.value = next;
    }
  },
  { immediate: true },
);

const updateValue = () => emit('update:modelValue', inputValue.value);
const updateCustom = () => emit('update:modelValue', customValue.value);
const changeInputType = () => {
  customInput.value = !customInput.value;
  if (customInput.value) {
    customValue.value = inputValue.value;
    updateCustom();
  } else {
    inputValue.value = isNativeDate(customValue.value) ? customValue.value : '';
    updateValue();
  }
};
const clear = () => {
  inputValue.value = '';
  customValue.value = '';
  emit('update:modelValue', '');
};

let pickerWasFocused = false;
let pickerPointerTarget: HTMLInputElement | null = null;
const prepareNativePicker = (event: PointerEvent) => {
  pickerPointerTarget = event.currentTarget as HTMLInputElement;
  pickerWasFocused = document.activeElement === event.currentTarget;
};
const openNativePicker = (event: MouseEvent | KeyboardEvent) => {
  const input = event.currentTarget as HTMLInputElement & { showPicker?: () => void };
  if (event instanceof MouseEvent) {
    const keepInlineEditing = pickerPointerTarget === input && pickerWasFocused;
    pickerPointerTarget = null;
    if (keepInlineEditing) return;
  }
  if (input.disabled || !input.showPicker) return;
  try {
    input.showPicker();
    if (event instanceof KeyboardEvent) event.preventDefault();
  } catch {
    // Native editing remains available when the picker cannot be opened.
  }
};

const inputClass = computed(() => [
  'block min-h-9 rounded-md border-0 bg-zinc-50 py-1.5 pl-3 text-sm leading-5 shadow outline-none hover:bg-white hover:shadow-md focus:bg-white focus:ring focus:ring-secondary/75 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:focus:bg-zinc-600 dark:disabled:bg-zinc-800',
  props.hideClear ? 'pr-3' : 'pr-9',
  props.fullWidth && 'w-full',
]);
</script>

<template>
  <div :class="fullWidth && 'w-full'">
    <label v-if="labelText" :for="inputId" :class="['text-sm text-zinc-600 dark:text-zinc-400', required && 'required', hidelabel ? 'sr-only' : 'block']">{{ labelText }}</label>
    <div :class="styleClass">
      <div v-if="type === 'date' && customInput && !noCustomInput" :class="['relative', fullWidth && 'w-full']">
        <input :id="inputId" v-model="customValue" type="text" :aria-label="labelText" :placeholder="placeholder" :disabled="disabled" :required="required" :class="inputClass" @change="updateCustom" />
        <button v-if="!disabled && !hideClear && hasValue" type="button" :aria-label="t('labels.inputs.clear')" class="btn-control hover:text-secondary absolute top-1/2 right-2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-zinc-400" @click="clear">
          <XMarkIcon class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div v-else :class="['relative', fullWidth && 'w-full']">
        <input :id="inputId" v-model="inputValue" :type="type" :aria-label="labelText" :placeholder="placeholder" :disabled="disabled" :required="required" :class="[inputClass, 'native-picker']" @pointerdown="prepareNativePicker" @click="openNativePicker" @change="updateValue" @keydown.enter="openNativePicker" @keydown.space="openNativePicker" />
        <button v-if="!disabled && !hideClear && hasValue" type="button" :aria-label="t('labels.inputs.clear')" class="btn-control hover:text-secondary absolute top-1/2 right-2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-zinc-400" @click="clear">
          <XMarkIcon class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <button v-if="type === 'date' && !noCustomInput" type="button" class="btn-control hover:text-secondary ml-2 self-center rounded p-1 text-zinc-500" :title="customInput ? t('labels.inputs.calendar_input') : t('labels.inputs.manual_input')" :aria-label="customInput ? t('labels.inputs.calendar_input') : t('labels.inputs.manual_input')" @click="changeInputType">
        <CalendarDaysIcon v-if="customInput" class="h-5 w-5" aria-hidden="true" />
        <PencilSquareIcon v-else class="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.native-picker {
  appearance: none;
  color-scheme: light;
}
.native-picker:not(:disabled) {
  cursor: pointer;
}
.native-picker::-webkit-calendar-picker-indicator {
  display: none;
  appearance: none;
}
:global(.dark) .native-picker {
  color-scheme: dark;
}
</style>
