<script setup lang="ts">
import { computed } from 'vue';
import Input from '../../../controls/Input.vue';
import Select from '../../../controls/Select.vue';
import Switch from '../../../controls/Switch.vue';
import { Frequency } from '../../../../models/addToCalendarButton';
import { DateRecurrenceAttrsKey, type DateRecurrenceAttrs } from '../../../../models/attrs';
import { getMonthList } from '../../../../utils/playground/date';
import { usePlaygroundI18n } from '../../../../utils/playground/i18n';

defineProps<{ modelValue: DateRecurrenceAttrs; disabled?: boolean }>();
defineEmits<{ 'update:modelValue': [value: DateRecurrenceAttrs] }>();
const t = usePlaygroundI18n();
const monthList = getMonthList();
const frequencyOptions = computed(() => Object.values(Frequency).map((value) => ({ key: t(`options.frequency.${value}`), value })));
</script>

<template>
  <div class="my-3 grid grid-cols-2 items-center gap-3 border-y border-zinc-400 px-1 pt-2 pb-4 dark:border-zinc-600">
    <div class="text-sm font-semibold text-zinc-700 uppercase dark:text-zinc-300">{{ t('labels.inputs.recurrence.headline') }}</div>
    <Switch :model-value="modelValue[DateRecurrenceAttrsKey.IS_SIMPLE]" :disabled="disabled" class="justify-end" :label="t('labels.inputs.recurrence.is_simple')" @update:model-value="modelValue[DateRecurrenceAttrsKey.IS_SIMPLE] = $event" />
    <Input v-show="!modelValue[DateRecurrenceAttrsKey.IS_SIMPLE]" :model-value="modelValue[DateRecurrenceAttrsKey.RRULE_VALUE]" :disabled="disabled" :label="t('labels.inputs.recurrence.rrule_value')" type="text" placeholder="RRULE:FREQ=..." class="col-span-2" @update:model-value="modelValue[DateRecurrenceAttrsKey.RRULE_VALUE] = $event" />
    <div v-show="modelValue[DateRecurrenceAttrsKey.IS_SIMPLE]" class="col-span-2 grid grid-cols-2 gap-3">
      <div class="col-span-2">
        <label class="block text-sm text-zinc-600 dark:text-zinc-400">{{ t('labels.inputs.recurrence.repeat_every') }}</label>
        <div class="grid grid-cols-3">
          <Input :model-value="modelValue[DateRecurrenceAttrsKey.INTERVAL]" :disabled="disabled" :label="t('labels.inputs.recurrence.interval')" hidelabel type="number" :min="1" @update:model-value="modelValue[DateRecurrenceAttrsKey.INTERVAL] = $event" />
          <Select :model-value="modelValue[DateRecurrenceAttrsKey.FREQUENCY]" :disabled="disabled" :label="t('labels.inputs.recurrence.frequency')" hidelabel :options="frequencyOptions" by-key="key" by-value="value" clearable class="col-span-2" @update:model-value="modelValue[DateRecurrenceAttrsKey.FREQUENCY] = String($event ?? '')" />
        </div>
      </div>
      <Input :model-value="modelValue[DateRecurrenceAttrsKey.BY_DAY]" :disabled="disabled" :label="t('labels.inputs.recurrence.by_day')" type="text" :placeholder="t('labels.inputs.recurrence.placeholder.by_day')" @update:model-value="modelValue[DateRecurrenceAttrsKey.BY_DAY] = $event" />
      <Select :model-value="modelValue[DateRecurrenceAttrsKey.BY_MONTH]" :disabled="disabled" :options="monthList" multiselect :label="t('labels.inputs.recurrence.by_month')" by-key="key" by-value="value" @update:model-value="modelValue[DateRecurrenceAttrsKey.BY_MONTH] = $event as number[]" />
      <Input :model-value="modelValue[DateRecurrenceAttrsKey.BY_MONTH_DAY]" :disabled="disabled" :label="t('labels.inputs.recurrence.by_month_day')" type="text" :placeholder="t('labels.inputs.recurrence.placeholder.by_month_day')" @update:model-value="modelValue[DateRecurrenceAttrsKey.BY_MONTH_DAY] = $event" />
      <Input :model-value="modelValue[DateRecurrenceAttrsKey.COUNT]" :disabled="disabled" :label="t('labels.inputs.recurrence.count')" type="number" :min="1" @update:model-value="modelValue[DateRecurrenceAttrsKey.COUNT] = $event" />
    </div>
  </div>
</template>
