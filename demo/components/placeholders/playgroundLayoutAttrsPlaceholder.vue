<script setup lang="ts">
import Input from "~~/components/controls/input.vue";
import Switch from "~~/components/controls/switch.vue";
import { LayoutAttrsKey } from "@/models/attrs";
</script>

<template>
  <div class="grid">
    <Input required :label="$t(`labels.inputs.${[LayoutAttrsKey.OPTIONS]}`.toLocaleLowerCase())" type="text" disabled class="mb-3 border-b border-zinc-300 pb-4 dark:border-zinc-600" />

    <div class="mb-3 flex items-center justify-between">
      <Input :label="$t(`labels.inputs.${[LayoutAttrsKey.BUTTON_STYLE]}`.toLocaleLowerCase())" type="text" disabled class="mr-5 flex-1" />
      <Switch :label="$t(`labels.inputs.${[LayoutAttrsKey.IS_BUTTONS_LIST]}`.toLocaleLowerCase())" disabled class="pt-6 pb-0" />
    </div>
    <Input :label="$t(`labels.inputs.${[LayoutAttrsKey.LABEL]}`.toLocaleLowerCase())" type="text" disabled class="mb-3" />
    <Input :label="$t(`labels.inputs.${[LayoutAttrsKey.TRIGGER]}`.toLocaleLowerCase())" type="text" disabled class="mb-3" />

    <Input :label="$t(`labels.inputs.${[LayoutAttrsKey.LIST_STYLE]}`.toLocaleLowerCase())" type="text" disabled class="mb-3" />
    <Switch :label="$t(`labels.inputs.${[LayoutAttrsKey.HIDE_BACKGROUND]}`.toLocaleLowerCase())" disabled class="mb-3" />

    <Input :label="$t(`labels.inputs.${[LayoutAttrsKey.HIDE_ICON_OPTIONS]}`.toLocaleLowerCase())" type="text" disabled class="mb-3" />
    <Input :label="$t(`labels.inputs.${[LayoutAttrsKey.HIDE_TEXT_OPTIONS]}`.toLocaleLowerCase())" type="text" disabled class="mb-3" />
    <Switch :label="$t(`labels.inputs.${[LayoutAttrsKey.HIDE_CHECKMARK]}`.toLocaleLowerCase())" disabled class="mb-3" />

    <Input :label="$t(`labels.inputs.${[LayoutAttrsKey.SIZE]}`.toLocaleLowerCase())" type="range" :min="0" :max="10" :modelValue="6" disabled class="mb-3" />

    <Input :label="$t(`labels.inputs.${[LayoutAttrsKey.LIGHT_MODE]}`.toLocaleLowerCase())" type="text" disabled class="mb-3" />
    <Input :label="$t(`labels.inputs.${[LayoutAttrsKey.LANGUAGE]}`.toLocaleLowerCase())" type="text" disabled />
  </div>
</template>
