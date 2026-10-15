<script setup lang="ts">
import { computed } from 'vue';
import Autocomplete from '../../controls/Autocomplete.vue';
import Datetime from '../../controls/Datetime.vue';
import Input from '../../controls/Input.vue';
import Select from '../../controls/Select.vue';
import Switch from '../../controls/Switch.vue';
import { Availability } from '../../../models/addToCalendarButton';
import { DateAttrsKey, type DateAttrs } from '../../../models/attrs';
import { usePlaygroundI18n } from '../../../utils/playground/i18n';
import Recurrence from './recurrence/Recurrence.vue';

defineProps<{ modelValue: DateAttrs; mobile?: boolean; disabled?: boolean }>();
defineEmits<{ 'update:modelValue': [value: DateAttrs] }>();
const t = usePlaygroundI18n();
const label = (key: DateAttrsKey) => t(`labels.inputs.${key.toLowerCase()}`);
const availabilityOptions = computed(() => Object.values(Availability).map((value) => ({ key: t(`options.availability.${value}`), value })));
</script>

<template>
  <div class="grid">
    <Input v-model="modelValue[DateAttrsKey.NAME]" :disabled="disabled" required :label="label(DateAttrsKey.NAME)" type="text" class="mb-3" />
    <Input v-model="modelValue[DateAttrsKey.DESCRIPTION]" :disabled="disabled" :label="label(DateAttrsKey.DESCRIPTION)" type="text" class="mb-3" />
    <div class="mb-3 grid grid-cols-2 gap-3">
      <Datetime v-model="modelValue[DateAttrsKey.START_DATE]" :disabled="disabled" :label-text="label(DateAttrsKey.START_DATE)" type="date" placeholder="YYYY-MM-DD" full-width no-custom-input />
      <Datetime v-model="modelValue[DateAttrsKey.START_TIME]" :disabled="disabled" :label-text="label(DateAttrsKey.START_TIME)" type="time" placeholder="HH:MM" full-width />
    </div>
    <div class="mb-3 grid grid-cols-2 gap-3">
      <Datetime v-model="modelValue[DateAttrsKey.END_DATE]" :disabled="disabled" :label-text="label(DateAttrsKey.END_DATE)" type="date" placeholder="YYYY-MM-DD" full-width no-custom-input />
      <Datetime v-model="modelValue[DateAttrsKey.END_TIME]" :disabled="disabled" :label-text="label(DateAttrsKey.END_TIME)" type="time" placeholder="HH:MM" full-width />
    </div>
    <Autocomplete v-model="modelValue[DateAttrsKey.TIMEZONE]" mode="timezone" force-match :disabled="disabled" :label="label(DateAttrsKey.TIMEZONE)" :placeholder="t('labels.inputs.search_time_zone')" class="mb-3" />
    <Input v-model="modelValue[DateAttrsKey.LOCATION]" :disabled="disabled" :label="label(DateAttrsKey.LOCATION)" type="text" class="mb-3" />
    <Recurrence v-model="modelValue[DateAttrsKey.RECURRENCE_OBJECT]" :disabled="disabled" />
    <Select v-model="modelValue[DateAttrsKey.AVAILABILITY]" :disabled="disabled" :label="label(DateAttrsKey.AVAILABILITY)" :options="availabilityOptions" by-key="key" by-value="value" clearable class="mb-3" />
    <div class="mb-3 grid grid-cols-2 gap-3">
      <Input v-model="modelValue[DateAttrsKey.ORGANIZER][DateAttrsKey.ORGANIZER_NAME]" :disabled="disabled" :label="label(DateAttrsKey.ORGANIZER_NAME)" type="text" />
      <Input v-model="modelValue[DateAttrsKey.ORGANIZER][DateAttrsKey.ORGANIZER_EMAIL]" :disabled="disabled" :label="label(DateAttrsKey.ORGANIZER_EMAIL)" type="email" />
    </div>
    <Switch v-model="modelValue[DateAttrsKey.IS_SUBSCRIBED]" :disabled="disabled" :label="label(DateAttrsKey.IS_SUBSCRIBED)" class="mb-3" />
    <Input v-model="modelValue[DateAttrsKey.ISC_FILE]" :disabled="disabled" :label="label(DateAttrsKey.ISC_FILE)" placeholder="https://..." type="text" class="mb-3" />
    <Input v-model="modelValue[DateAttrsKey.ICAL_FILE_NAME]" :disabled="disabled" :label="label(DateAttrsKey.ICAL_FILE_NAME)" type="text" />
  </div>
</template>
