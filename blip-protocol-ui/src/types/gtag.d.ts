/**
 * Type definitions for Google Analytics gtag.js
 */

interface Window {
  gtag?: (
    command: 'config' | 'event' | 'js' | 'set',
    targetId: string | Date,
    config?: Gtag.ConfigParams | Gtag.CustomParams | Gtag.EventParams
  ) => void;
  dataLayer?: unknown[];
}

declare namespace Gtag {
  interface ConfigParams {
    page_path?: string;
    page_title?: string;
    page_location?: string;
    send_page_view?: boolean;
    [key: string]: unknown;
  }

  interface EventParams {
    event_category?: string;
    event_label?: string;
    value?: number;
    non_interaction?: boolean;
    [key: string]: unknown;
  }

  interface CustomParams {
    [key: string]: unknown;
  }
}

export {};
