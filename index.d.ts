declare module 'add-to-calendar-button' {
  export function atcb_init(): void;
  export function atcb_action(
    config: {
      name: string;
      description?: string;
      startDate: string;
      startTime?: string;
      endDate?: string;
      endTime?: string;
      location?: string;
      icsFile?: string;
      images?: string[];
      recurrence?: string;
      recurrence_interval?: bigint;
      recurrence_until?: string;
      recurrence_count?: string;
      recurrence_byDay?: string;
      recurrence_byMonth?: string;
      recurrence_byMonthDay?: string;
      recurrence_weekstart?: string;
      sequence?: bigint;
      identifier?: string;
      options: ('Apple' | 'Google' | 'iCal' | 'Microsoft365' | 'MicrosoftTeams' | 'Outlook.com' | 'Yahoo')[];
      iCalFileName?: string;
      timeZone?: string;
      trigger?: 'hover' | 'click';
      listStyle?: 'dropdown' | 'dropdown-static' | 'overlay' | 'modal';
      background?: boolean;
      buttonStyle?: 'default' | '3d' | 'flat' | 'round' | 'neumorphism' | 'none';
      size?: bigint;
      customLabels?: object;
      lightMode?: 'system' | 'dark' | 'light' | 'bodyScheme';
      language?:
        | 'en'
        | 'de'
        | 'nl'
        | 'fr'
        | 'es'
        | 'pt'
        | 'tr'
        | 'zh'
        | 'ar'
        | 'hi'
        | 'pl'
        | 'id'
        | 'no'
        | 'fi'
        | 'sv'
        | 'cs'
        | 'ja'
        | 'it'
        | 'ko'
        | 'vi';
    },
    triggerElement?: HTMLElement,
    keyboardTrigger?: boolean
  ): void;
}
