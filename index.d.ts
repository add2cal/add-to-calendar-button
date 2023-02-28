declare module 'add-to-calendar-button' {
  export function atcb_action(
    config: {
      proKey?: string;
      name?: string;
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
        attendee?: string;
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
      attendee?: string;
      icsFile?: string;
      images?: string[];
      recurrence?: string;
      recurrence_interval?: bigint;
      recurrence_until?: string;
      recurrence_count?: bigint;
      recurrence_byDay?: string;
      recurrence_byMonth?: string;
      recurrence_byMonthDay?: string;
      recurrence_weekstart?: string;
      availability?: 'busy' | 'free';
      created?: string;
      updated?: string;
      identifier?: string;
      subscribe?: boolean;
      options?: ('Apple' | 'Google' | 'iCal' | 'Microsoft365' | 'MicrosoftTeams' | 'Outlook.com' | 'Yahoo')[];
      iCalFileName?: string;
      listStyle?: 'dropdown' | 'dropdown-static' | 'overlay' | 'modal';
      buttonStyle?: 'default' | '3d' | 'flat' | 'round' | 'neumorphism' | 'text' | 'date' | 'custom' | 'none';
      trigger?: 'hover' | 'click';
      hideIconButton?: boolean;
      hideIconList?: boolean;
      hideIconModal?: boolean;
      hideTextLabelButton?: boolean;
      hideTextLabelList?: boolean;
      hideBackground?: boolean;
      hideCheckmark?: boolean;
      hideBranding?: boolean;
      size?: string;
      label?: string;
      customLabels?: object;
      customCss?: string;
      lightMode?: 'system' | 'dark' | 'light' | 'bodyScheme';
      language?: 'en' | 'de' | 'nl' | 'fr' | 'es' | 'pt' | 'tr' | 'zh' | 'ar' | 'hi' | 'pl' | 'ro' | 'id' | 'no' | 'fi' | 'sv' | 'cs' | 'ja' | 'it' | 'ko' | 'vi';
      ty?: object;
      rsvp?: object;
      bypassWebViewCheck?: boolean;
    },
    triggerElement?: HTMLElement,
    keyboardTrigger?: boolean
  ): string;
}
