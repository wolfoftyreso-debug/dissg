/**
 * useSystemEvolution Hook
 * 
 * Tracks user behavior for self-improving system architecture
 */

import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { UsageEvent, QueryAttempt, InterpretationEvent } from '@/lib/evolution/systemEvolutionEngine';

// Session ID for grouping events
const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

interface EventBuffer {
  usage: UsageEvent[];
  queries: QueryAttempt[];
  interpretations: InterpretationEvent[];
}

const eventBuffer: EventBuffer = {
  usage: [],
  queries: [],
  interpretations: []
};

// Flush buffer periodically
let flushTimer: NodeJS.Timeout | null = null;

async function flushBuffer() {
  if (eventBuffer.usage.length === 0 && 
      eventBuffer.queries.length === 0 && 
      eventBuffer.interpretations.length === 0) {
    return;
  }
  
  const events = { ...eventBuffer };
  eventBuffer.usage = [];
  eventBuffer.queries = [];
  eventBuffer.interpretations = [];
  
  try {
    // Store events in edge function or local storage for now
    // In production, this would go to a proper analytics table
    const { error } = await supabase.functions.invoke('evolution-events', {
      body: { events, sessionId }
    });
    
    if (error) {
      console.log('[EVOLUTION] Buffer flush deferred:', error.message);
      // Store locally if edge function not available
      const stored = localStorage.getItem('evolution_events') || '[]';
      const existing = JSON.parse(stored);
      existing.push(...events.usage, ...events.queries, ...events.interpretations);
      localStorage.setItem('evolution_events', JSON.stringify(existing.slice(-1000)));
    }
  } catch (err) {
    console.log('[EVOLUTION] Storing events locally');
  }
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushBuffer();
    flushTimer = null;
  }, 5000); // Flush every 5 seconds
}

/**
 * Track user events for system evolution
 */
export function useSystemEvolution() {
  const lastPath = useRef<string>('');
  const pageEntryTime = useRef<Date>(new Date());
  
  // Track page views
  useEffect(() => {
    const path = window.location.pathname;
    if (path !== lastPath.current) {
      // Log time spent on previous page
      if (lastPath.current) {
        const timeSpent = (Date.now() - pageEntryTime.current.getTime()) / 1000;
        eventBuffer.usage.push({
          eventType: 'time_spent',
          path: lastPath.current,
          timestamp: new Date(),
          sessionId,
          metadata: { seconds: timeSpent }
        });
      }
      
      // Log new page view
      eventBuffer.usage.push({
        eventType: 'page_view',
        path,
        timestamp: new Date(),
        sessionId
      });
      
      lastPath.current = path;
      pageEntryTime.current = new Date();
      scheduleFlush();
    }
  }, []);
  
  // Track scroll depth
  useEffect(() => {
    let maxScroll = 0;
    
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      maxScroll = Math.max(maxScroll, scrollPercent);
    };
    
    const logScrollDepth = () => {
      if (maxScroll > 0) {
        eventBuffer.usage.push({
          eventType: 'scroll_depth',
          path: window.location.pathname,
          timestamp: new Date(),
          sessionId,
          metadata: { depth: maxScroll }
        });
        scheduleFlush();
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', logScrollDepth);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', logScrollDepth);
      logScrollDepth();
    };
  }, []);
  
  // Track clicks
  const trackClick = useCallback((component: string, entityType?: string, entityId?: string) => {
    eventBuffer.usage.push({
      eventType: 'click',
      path: window.location.pathname,
      component,
      entityType: entityType as UsageEvent['entityType'],
      entityId,
      timestamp: new Date(),
      sessionId
    });
    scheduleFlush();
  }, []);
  
  // Track drill-downs
  const trackDrillDown = useCallback((entityType: string, entityId: string) => {
    eventBuffer.usage.push({
      eventType: 'drill_down',
      path: window.location.pathname,
      entityType: entityType as UsageEvent['entityType'],
      entityId,
      timestamp: new Date(),
      sessionId
    });
    scheduleFlush();
  }, []);
  
  // Track searches
  const trackSearch = useCallback((query: string, resultCount: number, resultsClicked: number = 0) => {
    eventBuffer.queries.push({
      query,
      queryType: 'search',
      resultCount,
      resultsClicked,
      timestamp: new Date(),
      language: navigator.language.split('-')[0]
    });
    scheduleFlush();
  }, []);
  
  // Track questions
  const trackQuestion = useCallback((question: string, answered: boolean) => {
    eventBuffer.queries.push({
      query: question,
      queryType: 'question',
      resultCount: answered ? 1 : 0,
      resultsClicked: answered ? 1 : 0,
      timestamp: new Date(),
      language: navigator.language.split('-')[0]
    });
    scheduleFlush();
  }, []);
  
  // Track interpretation events
  const trackInterpretation = useCallback((
    eventType: InterpretationEvent['eventType'],
    entityType: string,
    entityId: string,
    context?: Record<string, unknown>
  ) => {
    eventBuffer.interpretations.push({
      eventType,
      entityType,
      entityId,
      context,
      timestamp: new Date()
    });
    scheduleFlush();
  }, []);
  
  // Track uncertainty hover
  const trackUncertaintyHover = useCallback((entityType: string, entityId: string) => {
    trackInterpretation('hover_uncertainty', entityType, entityId);
  }, [trackInterpretation]);
  
  // Track methodology click
  const trackMethodologyClick = useCallback((entityType: string, entityId: string) => {
    trackInterpretation('click_methodology', entityType, entityId);
  }, [trackInterpretation]);
  
  // Track warning dismissal
  const trackWarningDismiss = useCallback((entityType: string, entityId: string, warningType: string) => {
    trackInterpretation('dismiss_warning', entityType, entityId, { warningType });
  }, [trackInterpretation]);
  
  // Track comparison blocked
  const trackComparisonBlocked = useCallback((entityType: string, entityId: string, reason: string) => {
    trackInterpretation('comparison_blocked', entityType, entityId, { reason });
  }, [trackInterpretation]);
  
  // Track negative feedback
  const trackNegativeFeedback = useCallback((entityType: string, entityId: string, reason?: string) => {
    trackInterpretation('feedback_negative', entityType, entityId, { reason });
  }, [trackInterpretation]);
  
  return {
    // Usage tracking
    trackClick,
    trackDrillDown,
    
    // Query tracking
    trackSearch,
    trackQuestion,
    
    // Interpretation tracking
    trackUncertaintyHover,
    trackMethodologyClick,
    trackWarningDismiss,
    trackComparisonBlocked,
    trackNegativeFeedback,
    
    // Session info
    sessionId
  };
}

/**
 * Context provider for system-wide evolution tracking
 */
export function useEvolutionContext() {
  const evolution = useSystemEvolution();
  
  // Make tracking available globally
  useEffect(() => {
    (window as any).__systemEvolution = evolution;
    return () => {
      delete (window as any).__systemEvolution;
    };
  }, [evolution]);
  
  return evolution;
}
