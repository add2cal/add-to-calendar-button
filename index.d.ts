declare module "add-to-calendar-button" {
  export type ISO8601Date = string;
  export type ISO8601Time = string;
  export function atcb_init(): void;
  export function atcb_action(
    config: {
      name?: string;
      description?: string;
      startDate: ISO8601Date | "today";
      endDate: ISO8601Date;
      startTime?: ISO8601Time;
      endTime?: ISO8601Time;
      location?: string;
      options: ("Apple" | "Google" | "iCal" | "Microsoft365" | "MicrosoftTeams" | "Outlook.com" | "Yahoo")[];
      timeZone?: string;
      timeZoneOffset?: string;
      iCalFileName?: string;
      trigger?: "hover" | "click";
      listStyle?: "dropdown" | "modal";
    },
    placeBelow?: HTMLElement
  ): void;
}
