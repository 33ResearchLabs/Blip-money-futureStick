// Google Analytics helper functions

interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

/**
 * Send a custom event to Google Analytics
 * @param event - Event object containing action, category, label, and value
 */
export const trackEvent = ({ action, category, label, value }: GAEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

/**
 * Track a page view in Google Analytics
 * @param url - The URL to track
 * @param title - The page title
 */
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: url,
      page_title: title,
    });
  }
};

/**
 * Track a custom conversion event
 * @param eventName - Name of the conversion event
 * @param data - Additional data to send with the event
 */
export const trackConversion = (eventName: string, data?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, data);
  }
};

/**
 * Common event tracking functions
 */
export const analytics = {
  // Track button clicks
  trackButtonClick: (buttonName: string) => {
    trackEvent({
      action: 'click',
      category: 'Button',
      label: buttonName,
    });
  },

  // Track form submissions
  trackFormSubmit: (formName: string) => {
    trackEvent({
      action: 'submit',
      category: 'Form',
      label: formName,
    });
  },

  // Track link clicks
  trackLinkClick: (linkUrl: string, linkText?: string) => {
    trackEvent({
      action: 'click',
      category: 'Link',
      label: linkText || linkUrl,
    });
  },

  // Track errors
  trackError: (errorMessage: string, errorType?: string) => {
    trackEvent({
      action: 'error',
      category: errorType || 'Error',
      label: errorMessage,
    });
  },

  // Track user engagement
  trackEngagement: (action: string, value?: number) => {
    trackEvent({
      action,
      category: 'Engagement',
      value,
    });
  },

  // Track transactions
  trackTransaction: (transactionId: string, value: number, currency = 'USD') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: transactionId,
        value,
        currency,
      });
    }
  },
};
