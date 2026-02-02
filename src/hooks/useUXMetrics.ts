/**
 * 🧠 BLOCK 52 — UX METRICS HOOK
 * 
 * Tracks critical UX metrics:
 * - Time to insight (TTI)
 * - Click depth
 * - Scroll depth
 * - Back navigation (confusion indicator)
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { TTI_TARGETS, type BehaviorLog, createBehaviorLog } from '@/config/qualityReviewConfig';

interface UXMetrics {
  /** Page load timestamp */
  loadTime: number;
  /** Time to first meaningful interaction */
  timeToInteraction: number | null;
  /** Number of clicks since page load */
  clickCount: number;
  /** Maximum scroll depth (0-100) */
  maxScrollDepth: number;
  /** Number of back navigations (confusion) */
  backNavigations: number;
  /** Time spent on page */
  timeOnPage: number;
}

interface UseUXMetricsOptions {
  pageId: string;
  onLog?: (log: BehaviorLog) => void;
}

/**
 * Hook to track UX metrics for quality review
 */
export function useUXMetrics({ pageId, onLog }: UseUXMetricsOptions) {
  const loadTimeRef = useRef(Date.now());
  const firstInteractionRef = useRef<number | null>(null);
  const [metrics, setMetrics] = useState<UXMetrics>({
    loadTime: loadTimeRef.current,
    timeToInteraction: null,
    clickCount: 0,
    maxScrollDepth: 0,
    backNavigations: 0,
    timeOnPage: 0,
  });

  // Track clicks
  const trackClick = useCallback((label?: string) => {
    const now = Date.now();
    
    // Record first interaction
    if (!firstInteractionRef.current) {
      firstInteractionRef.current = now;
      const tti = now - loadTimeRef.current;
      setMetrics(m => ({ ...m, timeToInteraction: tti }));
      
      // Log if TTI exceeds target
      if (tti > TTI_TARGETS.desktop) {
        console.warn(`[UX] TTI exceeded target: ${tti}ms > ${TTI_TARGETS.desktop}ms`);
      }
    }

    setMetrics(m => ({ ...m, clickCount: m.clickCount + 1 }));
    
    onLog?.(createBehaviorLog('fact_click', pageId, { label }));
  }, [pageId, onLog]);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const depth = scrollHeight > 0 ? Math.round((scrolled / scrollHeight) * 100) : 0;
      
      setMetrics(m => ({
        ...m,
        maxScrollDepth: Math.max(m.maxScrollDepth, depth),
      }));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track back navigation
  useEffect(() => {
    const handlePopState = () => {
      setMetrics(m => ({ ...m, backNavigations: m.backNavigations + 1 }));
      onLog?.(createBehaviorLog('back_navigation', pageId));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [pageId, onLog]);

  // Track time on page
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(m => ({
        ...m,
        timeOnPage: Date.now() - loadTimeRef.current,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Log on unmount
  useEffect(() => {
    return () => {
      onLog?.(createBehaviorLog('exit', pageId, {
        timeOnPage: Date.now() - loadTimeRef.current,
        scrollDepth: metrics.maxScrollDepth,
        clicks: metrics.clickCount,
      }));
    };
  }, [pageId, onLog, metrics.maxScrollDepth, metrics.clickCount]);

  return {
    metrics,
    trackClick,
    trackSourceOpen: () => onLog?.(createBehaviorLog('source_open', pageId)),
    trackShowData: () => onLog?.(createBehaviorLog('show_data_click', pageId)),
  };
}

/**
 * Check if current metrics indicate UX problems
 */
export function analyzeUXMetrics(metrics: UXMetrics): {
  issues: string[];
  severity: 'good' | 'warning' | 'critical';
} {
  const issues: string[] = [];

  // TTI too slow
  if (metrics.timeToInteraction && metrics.timeToInteraction > TTI_TARGETS.desktop) {
    issues.push(`Time to interaction: ${(metrics.timeToInteraction / 1000).toFixed(1)}s (target: ${TTI_TARGETS.desktop / 1000}s)`);
  }

  // Too many clicks (user struggling)
  if (metrics.clickCount > 5 && metrics.timeOnPage < 30000) {
    issues.push('High click rate suggests user confusion');
  }

  // Back navigation (user lost)
  if (metrics.backNavigations > 0) {
    issues.push(`${metrics.backNavigations} back navigation(s) - user may be lost`);
  }

  // Low scroll depth with quick exit
  if (metrics.maxScrollDepth < 30 && metrics.timeOnPage < 10000) {
    issues.push('Low engagement: quick exit without scrolling');
  }

  const severity = 
    issues.length === 0 ? 'good' :
    issues.length <= 2 ? 'warning' : 'critical';

  return { issues, severity };
}

export default useUXMetrics;
