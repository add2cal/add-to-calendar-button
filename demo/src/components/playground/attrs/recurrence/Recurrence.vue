<script setup lang="ts">
import { ref, computed, defineProps } from 'vue'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue';
import Input from "@/components/controls/Input.vue";
import Combobox from "@/components/controls/Combobox.vue";
import Select from "@/components/controls/Select.vue";
import Switch from "@/components/controls/Switch.vue";
import { getMonthList } from "@/utils/date.js";
import { getDefaultDateRecurrenceAttrs } from '@/utils/attrs';
import { DateRecurrenceAttrsKey } from "@/models/attrs";

defineProps({
  modelValue: {
    type: Object,
    default: () => getDefaultDateRecurrenceAttrs()
  },
});

const monthList = getMonthList();
</script>

<template>
  <div class="grid">
    <Switch
      label="Simply Reccurence Input"
      class="mb-3"
      v-model="modelValue[DateRecurrenceAttrsKey.IS_SIMPLE]"
    />

    <Input
      v-if="!modelValue[DateRecurrenceAttrsKey.IS_SIMPLE]"
      v-model="modelValue[DateRecurrenceAttrsKey.RECURRENCE]"
      label="Recurrence"
      placeholder="RRULE :FREQ=…"
      class="mb-3"
    />

    <template v-else>
      <Input
        v-model="modelValue[DateRecurrenceAttrsKey.RECURRENCE_INTERVAL]"
        label="Recurrence Interval"
        type="number"
        class="mb-3"
      />
      <Input
        v-model="modelValue[DateRecurrenceAttrsKey.RECURRENCE_COUNT]"
        label="Recurrence Count"
        type="number"
        class="mb-3"
      />
      <Input
        v-model="modelValue[DateRecurrenceAttrsKey.RECURRENCE_BY_DAY]"
        label="Recurrence by Day"
        placeholder="e.g. “MO,SA” or “-2MO”"
        class="mb-3"
      />
      <Select
        v-model="modelValue[DateRecurrenceAttrsKey.RECURRENCE_BY_MONTH]"
        :options="monthList"
        label="Recurrence by Month"
        multiselect
        class="mb-3"
        byKey="key"
        byValue="value"
      />
      <Input
        v-model="modelValue[DateRecurrenceAttrsKey.RECURRENCE_BY_MONTH_DAY]"
        label="Recurrence by Month Day"
        placeholder="e.g. “4,5”"
        class="mb-3"
      />
    </template>
  </div>
</template>
