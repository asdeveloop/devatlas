'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { analytics } from '../lib/monitoring';
import { recordPageView } from '../shared/analytics/localUsage';
import { scheduleDeferredTask } from '../shared/utils/runtime/scheduleDeferredTask';

export default function UsageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) {
      return;
    }
    return scheduleDeferredTask(
      () => {
        recordPageView(pathname);
        analytics.trackEvent('page_view');
      },
      {
        fallbackDelayMs: 350,
        idleTimeoutMs: 1000,
        maxWaitMs: 2500,
      },
    );
  }, [pathname]);

  return null;
}