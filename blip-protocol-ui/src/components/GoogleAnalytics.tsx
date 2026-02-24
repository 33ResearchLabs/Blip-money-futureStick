import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
    dataLayer?: unknown[];
  }
}

const GoogleAnalytics = () => {
  const location = useLocation();
  const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

  useEffect(() => {
    // Only initialize if measurement ID is provided and not a placeholder
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
      return;
    }

    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: location.pathname + location.search,
    });

    return () => {
      // Cleanup script on unmount
      document.head.removeChild(script1);
    };
  }, [GA_MEASUREMENT_ID]);

  // Track page views on route change
  useEffect(() => {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
      return;
    }

    if (window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location, GA_MEASUREMENT_ID]);

  return null;
};

export default GoogleAnalytics;
