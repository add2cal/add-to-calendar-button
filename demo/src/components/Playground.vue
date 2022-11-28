<script setup lang="ts">
import "add-to-calendar-button";
</script>

<template>
  <add-to-calendar-button
    name="Reminder to star the add to calendar button repo"
    options="'Apple','Google','iCal','Outlook.com','Yahoo'"
    location="World Wide Web"
    startDate="2023-02-14"
    endDate="2023-02-14"
    startTime="10:15"
    endTime="23:30"
    timeZone="Europe/Berlin"
    lightMode="bodyScheme"
    buttonStyle="round"
    branding="true"
  ></add-to-calendar-button>
</template>
