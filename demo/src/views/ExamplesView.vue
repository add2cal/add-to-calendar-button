<script setup lang="ts">
import "add-to-calendar-button";
import CodeBlock from "@/components/CodeBlock.vue";
</script>

<template>
  <h1>Examples</h1>

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
  ></add-to-calendar-button>

  <CodeBlock class="line-numbers">
    <pre>
&lt;add-to-calendar-button
  name="Title"
  options="'Apple','Google'"
  location="World Wide Web"
  startDate="2023-02-14"
  endDate="2023-02-14"
  startTime="10:15"
  endTime="23:30"
  timeZone="Europe/Berlin"
&gt;&lt;/add-to-calendar-button&gt;
</pre
    >
  </CodeBlock>

  <CodeBlock>
    <pre>
&lt;script type="application/javascript"&gt;
const triggerEl = document.getElementById('myTriggerElement');
document.getElementById('event-form')
  .addEventListener('submit', (e) => {
    e.preventDefault();
    atcb_action({
      name: e.currentTarget.elements.name.value,
      startDate: "2023-01-14",
      endDate: "2023-01-18",
      options: ["Apple", "Google", "iCal", "Microsoft365", "Outlook.com", "MicrosoftTeams", "Yahoo"],
      timeZone: "Europe/Berlin",
      listStyle: "modal",
      iCalFileName: "Reminder-Event",
    }, triggerEl);
  });
&lt;/script&gt;
</pre
    >
  </CodeBlock>

  <CodeBlock>npm run build</CodeBlock>
</template>
