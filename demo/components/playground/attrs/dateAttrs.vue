<script setup lang="ts">
import { ref, computed, watch } from "vue";
import Input from "@/components/controls/input.vue";
import Select from "@/components/controls/select.vue";
import Switch from "@/components/controls/switch.vue";
import Autocomplete from "~/components/controls/autocomplete.vue";
import Recurrence from "@/components/playground/attrs/recurrence/recurrence.vue";
import { Availability } from "@/models/addToCalendarButton";
import { DateAttrsKey } from "@/models/attrs";
import { getDefaultDateAttrs } from "@/utils/attrs";

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: Object,
    default: getDefaultDateAttrs('', '', '')
  },
  mobile: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const internalValue = ref(props.modelValue || getDefaultDateAttrs(t('defaults.name'), t('defaults.description'), t('defaults.location')));

watch(internalValue, () => {
  emit('update:modelValue', internalValue.value);
}, { deep: true });

watch(() => props.modelValue, (val: any) => {
  internalValue.value = val;
}, { immediate: true });

const i18nAvailabilityOptions = computed(() =>
  Object.values(Availability).map((item: string) =>
    ({
      key: t(`options.availability.${item}`),
      value: item
    })
  )
);
</script>

<template>
  <div class="grid">
    <Input v-model="internalValue[DateAttrsKey.NAME]" :disabled="disabled" required :label="$t(`labels.inputs.${[DateAttrsKey.NAME]}`.toLocaleLowerCase())" type="text" class="mb-3" />
    <Input v-model="internalValue[DateAttrsKey.DESCRIPTION]" :disabled="disabled" :label="$t(`labels.inputs.${[DateAttrsKey.DESCRIPTION]}`.toLocaleLowerCase())" type="text" class="mb-3" />
    <div class="mb-3 grid grid-cols-2 gap-3">
      <Input v-model="internalValue[DateAttrsKey.START_DATE]" :disabled="disabled" :label="$t(`labels.inputs.${[DateAttrsKey.START_DATE]}`.toLocaleLowerCase())" type="text" placeholder="YYYY-MM-DD" />
      <Input v-model="internalValue[DateAttrsKey.START_TIME]" :disabled="disabled" :label="$t(`labels.inputs.${[DateAttrsKey.START_TIME]}`.toLocaleLowerCase())" type="text" placeholder="HH:MM" />
    </div>
    <div class="mb-3 grid grid-cols-2 gap-3">
      <Input v-model="internalValue[DateAttrsKey.END_DATE]" :disabled="disabled" :label="$t(`labels.inputs.${[DateAttrsKey.END_DATE]}`.toLocaleLowerCase())" type="text" placeholder="YYYY-MM-DD" />
      <Input v-model="internalValue[DateAttrsKey.END_TIME]" :disabled="disabled" :label="$t(`labels.inputs.${[DateAttrsKey.END_TIME]}`.toLocaleLowerCase())" type="text" placeholder="HH:MM" />
    </div>
    <Autocomplete v-model="internalValue[DateAttrsKey.TIMEZONE]" mode="timezone" forceMatch :disabled="disabled" :label="$t(`labels.inputs.${[DateAttrsKey.TIMEZONE]}`.toLocaleLowerCase())" :placeholder="t('labels.inputs.search_time_zone')" class="mb-3" />
    <Input v-model="internalValue[DateAttrsKey.LOCATION]" :disabled="disabled" :label="$t(`labels.inputs.${[DateAttrsKey.LOCATION]}`.toLocaleLowerCase())" type="text" class="mb-3" />
    <Recurrence v-model="internalValue[DateAttrsKey.RECURRENCE_OBJECT]" :disabled="disabled" />
    <Select v-model="internalValue[DateAttrsKey.AVAILABILITY]" :disabled="disabled" :label="$t(`labels.inputs.${[DateAttrsKey.AVAILABILITY]}`.toLocaleLowerCase())" :options="i18nAvailabilityOptions" byKey="key" byValue="value" clearable class="mb-3" />
    <div class="mb-3 grid grid-cols-2 gap-3">
      <Input v-model="internalValue[DateAttrsKey.ORGANIZER][DateAttrsKey.ORGANIZER_NAME]" :disabled="disabled" :label="$t(`labels.inputs.${[DateAttrsKey.ORGANIZER_NAME]}`.toLocaleLowerCase())" type="text" />
      <Input v-model="internalValue[DateAttrsKey.ORGANIZER][DateAttrsKey.ORGANIZER_EMAIL]" :disabled="disabled" :label="$t(`labels.inputs.${[DateAttrsKey.ORGANIZER_EMAIL]}`.toLocaleLowerCase())" type="email" />
    </div>
    <Switch v-model="internalValue[DateAttrsKey.IS_SUBSCRIBED]" :disabled="disabled" :label="$t(`labels.inputs.${[DateAttrsKey.IS_SUBSCRIBED]}`.toLocaleLowerCase())" class="mb-3" />
    <Input v-model="internalValue[DateAttrsKey.ISC_FILE]" :disabled="disabled" :label="$t(`labels.inputs.${[DateAttrsKey.ISC_FILE]}`.toLocaleLowerCase())" placeholder="https://..." type="text" class="mb-3" />
    <Input v-model="internalValue[DateAttrsKey.ICAL_FILE_NAME]" :disabled="disabled" :label="$t(`labels.inputs.${[DateAttrsKey.ICAL_FILE_NAME]}`.toLocaleLowerCase())" type="text" />
  </div>
</template>
