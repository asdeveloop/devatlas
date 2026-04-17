'use client';

import dynamic from 'next/dynamic';

const ServiceWorkerRegistration = dynamic(
  () => import('./ServiceWorkerRegistration'),
  {
    ssr: false,
  },
);
const UsageTracker = dynamic(() => import('./UsageTracker'), { ssr: false });
const RumTracker = dynamic(() => import('./RumTracker'), { ssr: false });

export default function ClientRuntimeBoot() {
  return (
    <>
      <ServiceWorkerRegistration />
      <UsageTracker />
      <RumTracker />
    </>
  );
}
