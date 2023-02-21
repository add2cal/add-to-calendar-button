<script setup lang="ts">
import Input from "~/components/controls/input.vue";
import Switch from "~/components/controls/switch.vue";
import { DateAttrsKey } from "@/models/attrs";
import { DateRecurrenceAttrsKey } from "@/models/attrs";
</script>

<template>
  <div class="grid">
    <Input required :label="$t(`labels.inputs.${[DateAttrsKey.NAME]}`.toLocaleLowerCase())" type="text" disabled class="mb-3" />
    <Input :label="$t(`labels.inputs.${[DateAttrsKey.DESCRIPTION]}`.toLocaleLowerCase())" type="text" disabled class="mb-3" />
    <div class="mb-3 grid grid-cols-2 gap-3">
      <Input :label="$t(`labels.inputs.${[DateAttrsKey.START_DATE]}`.toLocaleLowerCase())" type="text" disabled />
      <Input :label="$t(`labels.inputs.${[DateAttrsKey.START_TIME]}`.toLocaleLowerCase())" type="text" disabled />
    </div>
    <div class="mb-3 grid grid-cols-2 gap-3">
      <Input :label="$t(`labels.inputs.${[DateAttrsKey.END_DATE]}`.toLocaleLowerCase())" type="text" disabled />
      <Input :label="$t(`labels.inputs.${[DateAttrsKey.END_TIME]}`.toLocaleLowerCase())" type="text" disabled />
    </div>
    <Input :label="$t(`labels.inputs.${[DateAttrsKey.TIMEZONE]}`.toLocaleLowerCase())" type="text" disabled class="mb-3" />
    <Input :label="$t(`labels.inputs.${[DateAttrsKey.LOCATION]}`.toLocaleLowerCase())" type="text" disabled class="mb-3" />
    <div class="my-3 grid grid-cols-2 items-center gap-3 border-y border-zinc-300 px-1 pt-2 pb-4 dark:border-zinc-600">
      <div class="text-sm font-semibold text-zinc-400 dark:text-zinc-500">{{ $t('labels.inputs.recurrence.headline') }}</div>
      <Switch :label="$t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.IS_SIMPLE]}`.toLocaleLowerCase())" disabled />
      <Input :label="$t(`labels.inputs.recurrence.${[DateRecurrenceAttrsKey.RRULE_VALUE]}`.toLocaleLowerCase())" type="text" disabled class="col-span-2" />
    </div>
    <Input :label="$t(`labels.inputs.${[DateAttrsKey.AVAILABILITY]}`.toLocaleLowerCase())" type="text" disabled class="mb-3" />
    <div class="mb-3 grid grid-cols-2 gap-3">
      <Input :label="$t(`labels.inputs.${[DateAttrsKey.ORGANIZER_NAME]}`.toLocaleLowerCase())" type="text" disabled />
      <Input :label="$t(`labels.inputs.${[DateAttrsKey.ORGANIZER_EMAIL]}`.toLocaleLowerCase())" type="email" disabled />
    </div>
    <Switch :label="$t(`labels.inputs.${[DateAttrsKey.IS_SUBSCRIBED]}`.toLocaleLowerCase())" disabled class="mb-3" />
    <Input :label="$t(`labels.inputs.${[DateAttrsKey.ISC_FILE]}`.toLocaleLowerCase())" type="text" disabled class="mb-3" />
    <Input :label="$t(`labels.inputs.${[DateAttrsKey.ICAL_FILE_NAME]}`.toLocaleLowerCase())" type="text" disabled />
  </div>
</template>
