'use client';

import { useEffect, useRef, useState } from 'react';
import { useAnalytics } from '@/lib/analytics';

interface ScrollTrackingOptions {
  threshold?: number[];
  debounceMs?: number;
  trackDirection?: boolean;
}

export const useScrollTracking = (options: ScrollTrackingOptions = {}) => {
  const {
    threshold = [25, 50, 75, 90],
    debounceMs = 1000,
    trackDirection = true,
  } = options;

  const { trackScroll, trackEngagement } = useAnalytics();
  const lastScrollTop = useRef(0);
  const scrollDirection = useRef<'up' | 'down'>('down');
  const trackedThresholds = useRef<Set<number>>(new Set());
  const sessionStart = useRef(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    sessionStart.current = Date.now();

    const handleScroll = () => {
      if (typeof window === 'undefined') return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollPercentage = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);

      // Track scroll direction
      if (trackDirection) {
        const newDirection = scrollTop > lastScrollTop.current ? 'down' : 'up';
        if (newDirection !== scrollDirection.current) {
          scrollDirection.current = newDirection;
        }
      }

      // Track scroll depth thresholds
      threshold.forEach((thresholdValue) => {
        if (scrollPercentage >= thresholdValue && !trackedThresholds.current.has(thresholdValue)) {
          trackedThresholds.current.add(thresholdValue);
          
          trackScroll({
            direction: scrollDirection.current,
            scrollTop,
            scrollHeight,
            clientHeight,
            scrollPercentage: thresholdValue,
          });

          trackEngagement('scroll_depth', thresholdValue);
        }
      });

      // Update scrolling state
      setIsScrolling(true);
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Set new timeout to detect when scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        
        // Track engagement time
        const engagementTime = Date.now() - sessionStart.current;
        trackEngagement('session_time', Math.round(engagementTime / 1000));
      }, debounceMs);

      lastScrollTop.current = scrollTop;
    };

    // Add scroll listener with passive option for performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [threshold, debounceMs, trackDirection, trackScroll, trackEngagement]);

  return { isScrolling };
};
