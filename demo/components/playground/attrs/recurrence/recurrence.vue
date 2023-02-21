<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Input from "@/components/controls/Input.vue";
import Select from "@/components/controls/Select.vue";
import Switch from "@/components/controls/Switch.vue";
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
});

const emit = defineEmits(['update:modelValue']);

const internalValue = ref(props.modelValue || getDefaultDateRecurrenceAttrs());

watch(internalValue, () => {
  emit('update:modelValue', internalValue);
}, { deep: true });

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
  <div class="my-3 grid grid-cols-2 items-center gap-3 border-y border-zinc-300 px-1 pt-2 pb-4 dark:border-zinc-600">
    <div class="text-sm font-semibold text-zinc-400 dark:text-zinc-500">{{ t('labels.inputs.recurrence.headline') }}</div>
    <Switch v-model="internalValue[DateRecurrenceAttrsKey.IS_SIMPLE]" :label="t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.IS_SIMPLE]}`.toLocaleLowerCase())" />

    <Input v-if="!internalValue[DateRecurrenceAttrsKey.IS_SIMPLE]" v-model="internalValue[DateRecurrenceAttrsKey.RRULE_VALUE]" :label="t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.RRULE_VALUE]}`.toLocaleLowerCase())" type="text" placeholder="RRULE:FREQ=..." class="col-span-2" />

    <template v-else>
      <div class="col-span-2">
        <label class="block text-sm text-zinc-500">
          {{ t('labels.inputs.recurrence.repeat_every') }}
        </label>
        <div class="grid grid-cols-3">
          <Input v-model="internalValue[DateRecurrenceAttrsKey.INTERVAL]" :label="t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.INTERVAL]}`.toLocaleLowerCase())" hidelabel type="number" :min="1" />
          <Select v-model="internalValue[DateRecurrenceAttrsKey.FREQUENCY]" :label="t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.FREQUENCY]}`.toLocaleLowerCase())" hidelabel :options="i18nFrequencyOptions" byKey="key" byValue="value" clearable class="col-span-2" />
        </div>
      </div>
      <Input v-model="internalValue[DateRecurrenceAttrsKey.BY_DAY]" :label="t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.BY_DAY]}`.toLocaleLowerCase())" type="text" :placeholder="t('labels.inputs.recurrence.placeholder.by_day')" />
      <Select v-model="internalValue[DateRecurrenceAttrsKey.BY_MONTH]" :options="monthList" multiselect :label="t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.BY_MONTH]}`.toLocaleLowerCase())" byKey="key" byValue="value" />
      <Input v-model="internalValue[DateRecurrenceAttrsKey.BY_MONTH_DAY]" :label="t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.BY_MONTH_DAY]}`.toLocaleLowerCase())" type="text" :placeholder="t('labels.inputs.recurrence.placeholder.by_month_day')" />
      <Input v-model="internalValue[DateRecurrenceAttrsKey.COUNT]" :label="t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.COUNT]}`.toLocaleLowerCase())" type="number" :min="0" />
    </template>
  </div>
</template>
