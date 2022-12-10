<script setup lang="ts">
import { ref, computed, watch, defineProps, defineEmits } from "vue";
import Input from "@/components/controls/Input.vue";
import Combobox from "@/components/controls/Combobox.vue";
import Select from "@/components/controls/Select.vue";
import Switch from "@/components/controls/Switch.vue";
import Recurrence from "@/components/playground/attrs/recurrence/Recurrence.vue";
import { getAvailableTimezones } from "@/utils/timezone.js";
import { Status, Availability, Option } from "@/models/addToCalendarButton";
import { getDefaultDateAttrs } from "@/utils/attrs";
import { DateAttrsKey } from "@/models/attrs";
import { useI18n } from 'vue-i18n';

const props = defineProps({
  modelValue: {
    type: Object,
    default: getDefaultDateAttrs()
  },
});

const emit = defineEmits(['update:modelValue']);


const timezoneOptions = getAvailableTimezones();

const internalValue = ref(props.modelValue || getDefaultDateAttrs());

const { t } = useI18n();

watch(internalValue, () => {
  emit('update:modelValue', internalValue);
}, { deep: true });

const i18nAvailabilityOptions = computed(() =>
  Object.values(Availability).map((item: string) =>
    ({
      key: t(`options.availability.${item}`),
      value: item
    })
  )
)

const i18nStatusOptions  = computed(() =>
  Object.values(Status).map((item: string) =>
    ({
      key: t(`options.status.${item}`),
      value: item
    })
  )
)
</script>

<template>
  <div class="grid">
    <Input v-model="internalValue[DateAttrsKey.NAME]" required :label="t(`labels.inputs.${[DateAttrsKey.NAME]}`.toLocaleLowerCase())" class="mb-3" />
    <Input v-model="internalValue[DateAttrsKey.DESCRIPTION]" :label="t(`labels.inputs.${[DateAttrsKey.DESCRIPTION]}`.toLocaleLowerCase())" class="mb-3" />
    <Input v-model="internalValue[DateAttrsKey.START_DATE]" :label="t(`labels.inputs.${[DateAttrsKey.START_DATE]}`.toLocaleLowerCase())" placeholder="YYYY-MM-DD" class="mb-3" />
    <Input v-model="internalValue[DateAttrsKey.START_TIME]" :label="t(`labels.inputs.${[DateAttrsKey.START_TIME]}`.toLocaleLowerCase())" placeholder="HH:MM" class="mb-3" />
    <Input v-model="internalValue[DateAttrsKey.END_DATE]" :label="t(`labels.inputs.${[DateAttrsKey.END_DATE]}`.toLocaleLowerCase())" placeholder="YYYY-MM-DD" class="mb-3" />
    <Input v-model="internalValue[DateAttrsKey.END_TIME]" :label="t(`labels.inputs.${[DateAttrsKey.END_TIME]}`.toLocaleLowerCase())" placeholder="HH:MM" class="mb-3" />
    <Combobox v-model="internalValue[DateAttrsKey.TIMEZONE]" :label="t(`labels.inputs.${[DateAttrsKey.TIMEZONE]}`.toLocaleLowerCase())" :options="timezoneOptions" class="mb-3" />
    <Input v-model="internalValue[DateAttrsKey.LOCATION]" :label="t(`labels.inputs.${[DateAttrsKey.LOCATION]}`.toLocaleLowerCase())" class="mb-3" />
    <Select v-model="internalValue[DateAttrsKey.STATUS]" :label="t(`labels.inputs.${[DateAttrsKey.STATUS]}`.toLocaleLowerCase())" :options="i18nStatusOptions" byKey="key" byValue="value" class="mb-3" />
    <Input v-model="internalValue[DateAttrsKey.ORGANIZER][DateAttrsKey.ORGANIZER_NAME]" :label="t(`labels.inputs.${[DateAttrsKey.ORGANIZER_NAME]}`.toLocaleLowerCase())" class="mb-3" />
    <Input v-model="internalValue[DateAttrsKey.ORGANIZER][DateAttrsKey.ORGANIZER_EMAIL]" :label="t(`labels.inputs.${[DateAttrsKey.ORGANIZER_EMAIL]}`.toLocaleLowerCase())" class="mb-3" />

    <Input v-model="internalValue[DateAttrsKey.ISC_FILE]" :label="t(`labels.inputs.${[DateAttrsKey.ISC_FILE]}`.toLocaleLowerCase())" placeholder="https://..." class="mb-3" />
    <Recurrence v-model="internalValue[DateAttrsKey.RECURRENCE_OBJECT]" />
    <Select v-model="internalValue[DateAttrsKey.AVAILABILITY]" :label="t(`labels.inputs.${[DateAttrsKey.AVAILABILITY]}`.toLocaleLowerCase())" :options="i18nAvailabilityOptions" byKey="key" byValue="value" class="mb-3" />
    <Switch v-model="internalValue[DateAttrsKey.IS_SUBSCRIBED]" :label="t(`labels.inputs.${[DateAttrsKey.IS_SUBSCRIBED]}`.toLocaleLowerCase())" class="mb-3" />

    <Select v-model="internalValue[DateAttrsKey.OPTIONS]" multiselect required :label="t(`labels.inputs.${[DateAttrsKey.OPTIONS]}`.toLocaleLowerCase())" :options="Object.values(Option)" class="mb-3" />

    <Input v-model="internalValue[DateAttrsKey.ICAL_FILE_NAME]" :label="t(`labels.inputs.${[DateAttrsKey.ICAL_FILE_NAME]}`.toLocaleLowerCase())" class="mb-3" />
  </div>
</template>
