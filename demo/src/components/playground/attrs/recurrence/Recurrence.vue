<script setup lang="ts">
import { ref, watch } from 'vue'
import Input from "@/components/controls/Input.vue";
import Select from "@/components/controls/Select.vue";
import Switch from "@/components/controls/Switch.vue";
import { getMonthList } from "@/utils/date.js";
import { getDefaultDateRecurrenceAttrs } from '@/utils/attrs';
import { DateRecurrenceAttrsKey } from "@/models/attrs";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => getDefaultDateRecurrenceAttrs()
  },
});

const emit = defineEmits(['update:modelValue']);

const internalValue = ref(props.modelValue || getDefaultDateRecurrenceAttrs());

watch(internalValue, () => {
  emit('update:modelValue', internalValue);
}, { deep: true });

const monthList = getMonthList();
</script>

<template>
  <div class="my-3 grid grid-cols-2 items-center gap-3 border-y border-zinc-300 px-1 pt-3 pb-4 dark:border-zinc-600">
    <div class="text-sm font-semibold text-zinc-400 dark:text-zinc-500">{{ t('labels.inputs.recurrence.headline') }}</div>
    <Switch v-model="internalValue[DateRecurrenceAttrsKey.IS_SIMPLE]" :label="t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.IS_SIMPLE]}`.toLocaleLowerCase())" />

    <Input v-if="!internalValue[DateRecurrenceAttrsKey.IS_SIMPLE]" v-model="internalValue[DateRecurrenceAttrsKey.RRULE_VALUE]" :label="t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.RRULE_VALUE]}`.toLocaleLowerCase())" type="text" placeholder="RRULE :FREQ=..." class="col-span-2" />

    <template v-else>
      <Input v-model="internalValue[DateRecurrenceAttrsKey.INTERVAL]" :label="t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.INTERVAL]}`.toLocaleLowerCase())" type="number" :min="0" :placeholder="t('labels.inputs.recurrence.placeholder.interval')" class="col-span-2" />
      <Input v-model="internalValue[DateRecurrenceAttrsKey.BY_DAY]" :label="t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.BY_DAY]}`.toLocaleLowerCase())" type="text" :placeholder="t('labels.inputs.recurrence.placeholder.by_day')" />
      <Select v-model="internalValue[DateRecurrenceAttrsKey.BY_MONTH]" :options="monthList" multiselect :label="t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.BY_MONTH]}`.toLocaleLowerCase())" byKey="key" byValue="value" />
      <Input v-model="internalValue[DateRecurrenceAttrsKey.BY_MONTH_DAY]" :label="t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.BY_MONTH_DAY]}`.toLocaleLowerCase())" type="text" :placeholder="t('labels.inputs.recurrence.placeholder.by_month_day')" />
      <Input v-model="internalValue[DateRecurrenceAttrsKey.COUNT]" :label="t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.COUNT]}`.toLocaleLowerCase())" type="number" :min="0" />
    </template>
  </div>
</template>
