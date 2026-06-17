'use client';

import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initializeAnalytics, useAnalytics } from '@/lib/analytics';

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { trackPageView, trackEvent } = useAnalytics();
  const previousPathRef = useRef<string>('');

  useEffect(() => {
    initializeAnalytics();
  }, []);

  useEffect(() => {
    // Track page changes
    if (pathname !== previousPathRef.current) {
      if (typeof window !== 'undefined') {
        const pageTitle = document.title;
        trackPageView({
          path: pathname,
          title: pageTitle,
          referrer: previousPathRef.current === '' ? document.referrer : undefined,
        });

        // Track navigation event
        trackEvent({
          action: 'navigation',
          category: 'user_behavior',
          label: pathname,
        });
      }
      previousPathRef.current = pathname;
    }
  }, [pathname, trackPageView, trackEvent]);

  // Track search parameter changes
  useEffect(() => {
    if (searchParams.toString()) {
      trackEvent({
        action: 'search_parameters_change',
        category: 'user_behavior',
        label: searchParams.toString(),
      });
    }
  }, [searchParams, trackEvent]);

  return null;
}

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      {children}
    </>
  );
}
