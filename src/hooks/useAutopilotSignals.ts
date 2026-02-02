/**
 * 🔁 BLOCK 53 — AUTOPILOT SIGNALS HOOK
 * 
 * Tracks UX signals for automated optimization:
 * - Time to first insight (TTFI)
 * - Scroll depth to "What this shows"
 * - Clicks to sources/method
 * - Backtracking (confusion indicator)
 * - Exit before summary
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { UX_THRESHOLDS, needsAutoRewrite, type RewriteTrigger } from '@/config/autopilotConfig';

export interface AutopilotSignals {
  /** Time to first insight (ms) */
  ttfi: number | null;
  /** Maximum scroll depth (0-100) */
  scrollDepth: number;
  /** Clicks to reach sources */
  clicksToSources: number | null;
  /** Clicks to reach method */
  clicksToMethod: number | null;
  /** Number of back navigations */
  backtrackCount: number;
  /** Did user exit before summary? */
  exitedBeforeSummary: boolean;
  /** Page session duration (ms) */
  sessionDuration: number;
  /** Device type */
  deviceType: 'desktop' | 'mobile';
}

interface UseAutopilotSignalsOptions {
  pageId: string;
  onSignalUpdate?: (signals: AutopilotSignals) => void;
  onRewriteTrigger?: (triggers: RewriteTrigger[]) => void;
}

/**
 * Hook to track UX signals for autopilot optimization
 */
export function useAutopilotSignals({
  pageId,
  onSignalUpdate,
  onRewriteTrigger,
}: UseAutopilotSignalsOptions) {
  const loadTimeRef = useRef(Date.now());
  const firstInsightRef = useRef<number | null>(null);
  const clickCountRef = useRef({ sources: 0, method: 0, total: 0 });
  const sawSummaryRef = useRef(false);

  const [signals, setSignals] = useState<AutopilotSignals>({
    ttfi: null,
    scrollDepth: 0,
    clicksToSources: null,
    clicksToMethod: null,
    backtrackCount: 0,
    exitedBeforeSummary: false,
    sessionDuration: 0,
    deviceType: typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop',
  });

  // Track first insight
  const trackFirstInsight = useCallback(() => {
    if (!firstInsightRef.current) {
      const ttfi = Date.now() - loadTimeRef.current;
      firstInsightRef.current = ttfi;
      setSignals(s => ({ ...s, ttfi }));

      // Check if TTFI exceeds threshold
      const threshold = signals.deviceType === 'mobile' 
        ? UX_THRESHOLDS.ttfiMobile 
        : UX_THRESHOLDS.ttfiDesktop;
      
      if (ttfi > threshold) {
        console.warn(`[Autopilot] TTFI exceeded: ${ttfi}ms > ${threshold}ms`);
      }
    }
  }, [signals.deviceType]);

  // Track source click
  const trackSourceClick = useCallback(() => {
    clickCountRef.current.total++;
    if (clickCountRef.current.sources === 0) {
      clickCountRef.current.sources = clickCountRef.current.total;
      setSignals(s => ({ ...s, clicksToSources: clickCountRef.current.sources }));
    }
    trackFirstInsight();
  }, [trackFirstInsight]);

  // Track method click
  const trackMethodClick = useCallback(() => {
    clickCountRef.current.total++;
    if (clickCountRef.current.method === 0) {
      clickCountRef.current.method = clickCountRef.current.total;
      setSignals(s => ({ ...s, clicksToMethod: clickCountRef.current.method }));
    }
    trackFirstInsight();
  }, [trackFirstInsight]);

  // Track summary visibility
  const trackSummaryVisible = useCallback(() => {
    sawSummaryRef.current = true;
    trackFirstInsight();
  }, [trackFirstInsight]);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const depth = scrollHeight > 0 ? Math.round((scrolled / scrollHeight) * 100) : 0;

      setSignals(s => ({
        ...s,
        scrollDepth: Math.max(s.scrollDepth, depth),
      }));

      // Check for summary element visibility
      const summaryEl = document.querySelector('[data-section="summary"]');
      if (summaryEl) {
        const rect = summaryEl.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          trackSummaryVisible();
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackSummaryVisible]);

  // Back navigation tracking
  useEffect(() => {
    const handlePopState = () => {
      setSignals(s => ({ ...s, backtrackCount: s.backtrackCount + 1 }));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Session duration tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setSignals(s => ({
        ...s,
        sessionDuration: Date.now() - loadTimeRef.current,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Check for rewrite triggers on unmount
  useEffect(() => {
    return () => {
      const finalSignals: AutopilotSignals = {
        ...signals,
        exitedBeforeSummary: !sawSummaryRef.current,
        sessionDuration: Date.now() - loadTimeRef.current,
      };

      // Calculate rates
      const backtrackingRate = finalSignals.backtrackCount / 
        Math.max(1, clickCountRef.current.total);
      const earlyExitRate = finalSignals.exitedBeforeSummary ? 1 : 0;

      // Check for rewrite triggers
      const triggers = needsAutoRewrite({
        ttfi: finalSignals.ttfi || 0,
        backtrackingRate,
        scrollDepth: finalSignals.scrollDepth,
        earlyExitRate,
      });

      if (triggers.length > 0) {
        onRewriteTrigger?.(triggers);
      }

      onSignalUpdate?.(finalSignals);
    };
  }, [signals, onSignalUpdate, onRewriteTrigger]);

  return {
    signals,
    trackSourceClick,
    trackMethodClick,
    trackSummaryVisible,
    trackFirstInsight,
  };
}

/**
 * Analyze signals and return optimization suggestions
 */
export function analyzeSignals(signals: AutopilotSignals): {
  issues: string[];
  suggestions: string[];
  urgency: 'low' | 'medium' | 'high';
} {
  const issues: string[] = [];
  const suggestions: string[] = [];

  const threshold = signals.deviceType === 'mobile' 
    ? UX_THRESHOLDS.ttfiMobile 
    : UX_THRESHOLDS.ttfiDesktop;

  // TTFI analysis
  if (signals.ttfi && signals.ttfi > threshold) {
    issues.push(`TTFI too slow: ${(signals.ttfi / 1000).toFixed(1)}s`);
    suggestions.push('Shorten summary, move key info up');
  }

  // Scroll depth analysis
  if (signals.scrollDepth < UX_THRESHOLDS.minScrollDepth) {
    issues.push(`Low scroll depth: ${signals.scrollDepth}%`);
    suggestions.push('Front-load important content');
  }

  // Backtracking analysis
  if (signals.backtrackCount > 2) {
    issues.push(`High backtracking: ${signals.backtrackCount} times`);
    suggestions.push('Improve navigation clarity, add breadcrumbs');
  }

  // Early exit analysis
  if (signals.exitedBeforeSummary) {
    issues.push('User exited before seeing summary');
    suggestions.push('Make summary more prominent, reduce intro');
  }

  // Click depth analysis
  if (signals.clicksToSources && signals.clicksToSources > UX_THRESHOLDS.maxClicksToSources) {
    issues.push(`Too many clicks to sources: ${signals.clicksToSources}`);
    suggestions.push('Surface sources earlier');
  }

  const urgency = 
    issues.length >= 3 ? 'high' :
    issues.length >= 1 ? 'medium' : 'low';

  return { issues, suggestions, urgency };
}

export default useAutopilotSignals;
