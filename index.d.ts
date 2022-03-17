declare module 'add-to-calendar-button' {
  export type ISO8601Date = string;
  export type ISO8601Time = string;
  export function atcb_init(): any;
  export function atcb_action (
    config: {
      name?: string;
      description?: string;
      startDate: ISO8601Date | "today";
      endDate: ISO8601Date;
      startTime?: ISO8601Time;
      endTime?: ISO8601Time;
      location?: string;
      options: ("Apple" | "Google" | "iCal" | "Microsoft365" | "MicrosoftTeams" | "Outlook.com" | "Yahoo")[],
      timeZone?: string;
      timeZoneOffset?: string;
      iCalFileName?: string;
      /**
       * By default, the dropdown list will be opened on hover and closed as 
       * soon as you mouse over the background overlay. If you want it to 
       * instead close only when thebackground overlay is clicked, set this 
       * to `"click"`.
       */
      trigger?: "click";
    },
    placeBelow?: HTMLElement
  ): void;
}