<script setup lang="ts">
import { ref, watch, defineProps, defineEmits  } from 'vue'
import Input from "@/components/controls/Input.vue";
import Select from "@/components/controls/Select.vue";
import Switch from "@/components/controls/Switch.vue";
import { getMonthList } from "@/utils/date.js";
import { getDefaultDateRecurrenceAttrs } from '@/utils/attrs';
import { DateRecurrenceAttrsKey } from "@/models/attrs";
import { useI18n } from 'vue-i18n';

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

const { t } = useI18n();
</script>

<template>
  <div class="grid">
    <Switch v-model="internalValue[DateRecurrenceAttrsKey.IS_SIMPLE]" :label="t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.IS_SIMPLE]}`.toLocaleLowerCase())" class="mb-3" />

    <Input v-if="!internalValue[DateRecurrenceAttrsKey.IS_SIMPLE]" v-model="internalValue[DateRecurrenceAttrsKey.RRULE_VALUE]" :label="t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.RRULE_VALUE]}`.toLocaleLowerCase())" placeholder="RRULE :FREQ=..." class="mb-3" />

    <template v-else>
      <Input v-model="internalValue[DateRecurrenceAttrsKey.INTERVAL]" :label="t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.INTERVAL]}`.toLocaleLowerCase())" type="number" class="mb-3" />
      <Input v-model="internalValue[DateRecurrenceAttrsKey.COUNT]" :label="t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.COUNT]}`.toLocaleLowerCase())" type="number" class="mb-3" />
      <Input v-model="internalValue[DateRecurrenceAttrsKey.BY_DAY]" :label="t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.BY_DAY]}`.toLocaleLowerCase())" placeholder="e.g. “MO,SA” or “-2MO”" class="mb-3" />
      <Select v-model="internalValue[DateRecurrenceAttrsKey.BY_MONTH]" :options="monthList" :label="t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.BY_MONTH]}`.toLocaleLowerCase())" multiselect class="mb-3" byKey="key" byValue="value" />
      <Input v-model="internalValue[DateRecurrenceAttrsKey.BY_MONTH_DAY]" :label="t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.BY_MONTH_DAY]}`.toLocaleLowerCase())" placeholder="e.g. “4,5”" class="mb-3" />
    </template>
  </div>
</template>
