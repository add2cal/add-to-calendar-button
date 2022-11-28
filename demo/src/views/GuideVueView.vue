<script setup lang="ts">
import "add-to-calendar-button";
</script>

<template>
  <div class="about">
    <div>
      <h1>This is an about page</h1>
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
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
