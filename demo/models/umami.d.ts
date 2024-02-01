// umami.d.ts
declare const umami: umami.umami;

// Based on https://umami.is/docs/tracker-functions
declare namespace umami {
  interface umami {
    track(view_properties?: { website: string; [key: string]: string }): void;
    track(event_name: string, event_data?: { [key: string]: string | number }): void;
  }
}

declare global {
  interface Window {
    umami: umami;
  }
}

export {};
