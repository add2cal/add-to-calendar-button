declare module 'add-to-calendar-button' {
  export function atcb_init(): string[];
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
        sequence?: bigint;
        uid?: string;
        organizer?: string;
      }[];
      description?: string;
      startDate?: string;
      startTime?: string;
      endDate?: string;
      endTime?: string;
      timeZone?: string;
      location?: string;
      status?: 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED';
      sequence?: bigint;
      uid?: string;
      organizer?: string;
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
      availability?: 'busy' | 'free';
      created?: string;
      updated?: string;
      identifier?: string;
      subscribe?: boolean;
      options: ('Apple' | 'Google' | 'iCal' | 'Microsoft365' | 'MicrosoftTeams' | 'Outlook.com' | 'Yahoo')[];
      iCalFileName?: string;
      listStyle?: 'dropdown' | 'dropdown-static' | 'overlay' | 'modal';
      buttonStyle?: 'default' | '3d' | 'flat' | 'round' | 'neumorphism' | 'text' | 'date' | 'custom' | 'none';
      trigger?: 'hover' | 'click';
      background?: boolean;
      checkmark?: boolean;
      mindScrolling?: boolean;
      size?: string;
      label?: string;
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
  ): string[];
  export function atcb_destroy(id: string): string;
}
