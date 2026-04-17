'use client';

import { useEffect } from 'react';
import { getAdsConsent } from '../shared/consent/adsConsent';

const RUM_ENDPOINT = '/api/rum';

function roundMetric(value: number): number {
  return Number(value.toFixed(2));
}

export default function RumTracker() {
  useEffect(() => {
    const consent = getAdsConsent();
    if (!consent.contextualAds) {
      return;
    }

    let clsValue = 0;
    let lcpValue = 0;
    let sentLcp = false;
    let sentCls = false;
    let sentFcp = false;

    const sendRum = (payload: Record<string, unknown>) => {
      try {
        const body = JSON.stringify(payload);
        if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
          const blob = new Blob([body], { type: 'application/json' });
          navigator.sendBeacon(RUM_ENDPOINT, blob);
          return;
        }
        void fetch(RUM_ENDPOINT, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body,
          keepalive: true,
        });
      } catch {
        // Never break UI because of telemetry.
      }
    };

    const reportVital = (metric: string, value: number) => {
      if (!Number.isFinite(value) || value < 0) {
        return;
      }
      sendRum({
        type: 'web_vital',
        consentGranted: true,
        metric,
        value: roundMetric(value),
        path: window.location.pathname || '/',
      });
    };

    const reportError = (type: 'error' | 'unhandledrejection', message: string) => {
      sendRum({
        type: 'js_error',
        consentGranted: true,
        errorType: type,
        message: message.slice(0, 220),
        path: window.location.pathname || '/',
      });
    };

    const onWindowError = (event: ErrorEvent) => {
      reportError('error', event.message || 'window_error');
    };
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason =
        typeof event.reason === 'string'
          ? event.reason
          : event.reason instanceof Error
            ? event.reason.message
            : 'unhandled_rejection';
      reportError('unhandledrejection', reason);
    };

    window.addEventListener('error', onWindowError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);

    const paintObserver = new PerformanceObserver((list) => {
      if (sentFcp) {
        return;
      }
      const fcp = list.getEntries().find((entry) => entry.name === 'first-contentful-paint');
      if (fcp) {
        sentFcp = true;
        reportVital('FCP', fcp.startTime);
      }
    });
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
        if (!shift.hadRecentInput) {
          clsValue += shift.value ?? 0;
        }
      }
    });
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) {
        lcpValue = last.startTime;
      }
    });

    try {
      paintObserver.observe({ type: 'paint', buffered: true });
    } catch {
      // Ignore unsupported browsers.
    }
    try {
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch {
      // Ignore unsupported browsers.
    }
    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch {
      // Ignore unsupported browsers.
    }

    const navigation = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (navigation) {
      reportVital('TTFB', navigation.responseStart - navigation.requestStart);
    }

    const flushFinalVitals = () => {
      if (!sentLcp && lcpValue > 0) {
        sentLcp = true;
        reportVital('LCP', lcpValue);
      }
      if (!sentCls) {
        sentCls = true;
        reportVital('CLS', clsValue * 1000);
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushFinalVitals();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', flushFinalVitals);

    return () => {
      flushFinalVitals();
      paintObserver.disconnect();
      clsObserver.disconnect();
      lcpObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', flushFinalVitals);
      window.removeEventListener('error', onWindowError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, []);

  return null;
}