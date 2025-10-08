<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Input from "@/components/controls/input.vue";
import Select from "@/components/controls/select.vue";
import Switch from "@/components/controls/switch.vue";
import { getMonthList } from "@/utils/date.js";
import { Frequency } from "@/models/addToCalendarButton";
import { getDefaultDateRecurrenceAttrs } from '@/utils/attrs';
import { DateRecurrenceAttrsKey } from "@/models/attrs";

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => getDefaultDateRecurrenceAttrs()
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const internalValue = ref(props.modelValue || getDefaultDateRecurrenceAttrs());

watch(internalValue, () => {
  emit('update:modelValue', internalValue.value);
}, { deep: true });

watch(() => props.modelValue, (val) => {
  internalValue.value = val;
}, { immediate: true });

const monthList = getMonthList();

const i18nFrequencyOptions = computed(() =>
  Object.values(Frequency).map((item: string) =>
    ({
      key: t(`options.frequency.${item}`),
      value: item
    })
  )
)
</script>

<template>
  <div class="my-3 grid grid-cols-2 items-center gap-3 border-y border-zinc-400 px-1 pb-4 pt-2 dark:border-zinc-600">
    <div class="text-sm font-semibold uppercase text-zinc-700 dark:text-zinc-300">{{ $t('labels.inputs.recurrence.headline') }}</div>
    <Switch v-model="internalValue[DateRecurrenceAttrsKey.IS_SIMPLE]" :disabled="disabled" class="justify-end" :label="$t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.IS_SIMPLE]}`.toLocaleLowerCase())" />

    <Input
      v-show="!internalValue[DateRecurrenceAttrsKey.IS_SIMPLE]"
      v-model="internalValue[DateRecurrenceAttrsKey.RRULE_VALUE]"
      :disabled="disabled"
      :label="$t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.RRULE_VALUE]}`.toLocaleLowerCase())"
      type="text"
      placeholder="RRULE:FREQ=..."
      class="col-span-2"
    />

    <div v-show="internalValue[DateRecurrenceAttrsKey.IS_SIMPLE]" class="col-span-2 grid grid-cols-2 gap-3">
      <div class="col-span-2">
        <label class="block text-sm text-zinc-600 dark:text-zinc-400">
          {{ $t('labels.inputs.recurrence.repeat_every') }}
        </label>
        <div class="grid grid-cols-3">
          <Input v-model="internalValue[DateRecurrenceAttrsKey.INTERVAL]" :disabled="disabled" :label="$t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.INTERVAL]}`.toLocaleLowerCase())" hidelabel type="number" :min="1" />
          <Select v-model="internalValue[DateRecurrenceAttrsKey.FREQUENCY]" :disabled="disabled" :label="$t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.FREQUENCY]}`.toLocaleLowerCase())" hidelabel :options="i18nFrequencyOptions" byKey="key" byValue="value" clearable class="col-span-2" />
        </div>
      </div>
      <Input v-model="internalValue[DateRecurrenceAttrsKey.BY_DAY]" :disabled="disabled" :label="$t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.BY_DAY]}`.toLocaleLowerCase())" type="text" :placeholder="$t('labels.inputs.recurrence.placeholder.by_day')" />
      <Select v-model="internalValue[DateRecurrenceAttrsKey.BY_MONTH]" :disabled="disabled" :options="monthList" multiselect :label="$t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.BY_MONTH]}`.toLocaleLowerCase())" byKey="key" byValue="value" />
      <Input v-model="internalValue[DateRecurrenceAttrsKey.BY_MONTH_DAY]" :disabled="disabled" :label="$t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.BY_MONTH_DAY]}`.toLocaleLowerCase())" type="text" :placeholder="$t('labels.inputs.recurrence.placeholder.by_month_day')" />
      <Input v-model="internalValue[DateRecurrenceAttrsKey.COUNT]" :disabled="disabled" :label="$t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.COUNT]}`.toLocaleLowerCase())" type="number" :min="1" />
    </div>
  </div>
</template>
