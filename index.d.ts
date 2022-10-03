declare module 'add-to-calendar-button' {
  export function atcb_init(): void;
  export function atcb_action(
    config: {
      name: string;
      dates?: {
        name?: string;
        description?: string;
        startDate?: string;
        startTime?: string;
        endDate?: string;
        endTime?: string;
        timeZone?: string;
        location?: string;
        status?: 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED';
      }[];
      description?: string;
      startDate?: string;
      startTime?: string;
      endDate?: string;
      endTime?: string;
      timeZone?: string;
      location?: string;
      status?: 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED';
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
      uid?: string;
      sequence?: bigint;
      created?: string;
      updated?: string;
      organizer?: string;
      identifier?: string;
      options: ('Apple' | 'Google' | 'iCal' | 'Microsoft365' | 'MicrosoftTeams' | 'Outlook.com' | 'Yahoo')[];
      iCalFileName?: string;
      trigger?: 'hover' | 'click';
      listStyle?: 'dropdown' | 'dropdown-static' | 'overlay' | 'modal';
      background?: boolean;
      buttonStyle?: 'default' | '3d' | 'flat' | 'round' | 'neumorphism' | 'text' | 'none';
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
