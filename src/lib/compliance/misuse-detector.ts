/**
 * MISUSE DETECTOR
 * 
 * Detects and flags potential misuse of platform data.
 * Transparency replaces prohibition - all use is logged and visible.
 * 
 * Detection types:
 * - Campaign use (political/marketing manipulation)
 * - Data harvesting (bulk extraction)
 * - Context stripping (quotes without context)
 * - Selective citation (cherry-picking)
 */

import type { MisuseDetection } from '@/types/compliance';

export type MisuseType = 
  | 'campaign_use' 
  | 'data_harvesting' 
  | 'context_stripping' 
  | 'selective_citation'
  | 'rate_abuse'
  | 'scope_violation';

export type MisuseSeverity = 'info' | 'warning' | 'critical';

export interface MisuseIndicator {
  type: MisuseType;
  pattern: string;
  severity: MisuseSeverity;
  description: string;
}

// Misuse patterns to detect
const MISUSE_PATTERNS: MisuseIndicator[] = [
  // Campaign use indicators
  {
    type: 'campaign_use',
    pattern: 'export_with_party_name',
    severity: 'warning',
    description: 'Data exported in context that suggests political campaign use'
  },
  {
    type: 'campaign_use',
    pattern: 'comparison_framing_bias',
    severity: 'warning',
    description: 'Data comparisons that suggest biased framing'
  },
  
  // Data harvesting indicators
  {
    type: 'data_harvesting',
    pattern: 'bulk_api_requests',
    severity: 'warning',
    description: 'High volume of API requests suggesting bulk data extraction'
  },
  {
    type: 'data_harvesting',
    pattern: 'systematic_enumeration',
    severity: 'warning',
    description: 'Sequential requests that enumerate all data points'
  },
  
  // Context stripping indicators
  {
    type: 'context_stripping',
    pattern: 'export_without_metadata',
    severity: 'info',
    description: 'Data exported without accompanying context and limitations'
  },
  {
    type: 'context_stripping',
    pattern: 'screenshot_without_disclaimer',
    severity: 'info',
    description: 'Visual capture that may exclude required disclaimers'
  },
  
  // Selective citation indicators
  {
    type: 'selective_citation',
    pattern: 'cherry_pick_timeframe',
    severity: 'warning',
    description: 'Data requests for specific narrow timeframes that may misrepresent trends'
  },
  {
    type: 'selective_citation',
    pattern: 'outlier_focus',
    severity: 'info',
    description: 'Repeated focus on statistical outliers'
  },
  
  // Rate abuse
  {
    type: 'rate_abuse',
    pattern: 'rate_limit_circumvention',
    severity: 'critical',
    description: 'Attempts to circumvent rate limits'
  },
  
  // Scope violation
  {
    type: 'scope_violation',
    pattern: 'repeated_blocked_queries',
    severity: 'warning',
    description: 'Repeated attempts to query blocked content types'
  }
];

export interface MisuseCheckResult {
  detected: boolean;
  indicators: MisuseIndicator[];
  severity: MisuseSeverity;
  recommended_action: string;
}

/**
 * Analyze request patterns for potential misuse
 */
export function analyzeMisusePatterns(
  requests: Array<{
    endpoint: string;
    method: string;
    params: Record<string, unknown>;
    timestamp: Date;
  }>
): MisuseCheckResult {
  const indicators: MisuseIndicator[] = [];
  
  // Check for bulk data harvesting
  if (requests.length > 100) {
    const timeSpan = requests[requests.length - 1].timestamp.getTime() - requests[0].timestamp.getTime();
    const requestsPerMinute = requests.length / (timeSpan / 60000);
    
    if (requestsPerMinute > 60) {
      indicators.push(MISUSE_PATTERNS.find(p => p.pattern === 'bulk_api_requests')!);
    }
  }
  
  // Check for systematic enumeration
  const endpoints = requests.map(r => r.endpoint);
  const uniqueEndpoints = new Set(endpoints);
  if (uniqueEndpoints.size > 50 && endpoints.length / uniqueEndpoints.size < 2) {
    indicators.push(MISUSE_PATTERNS.find(p => p.pattern === 'systematic_enumeration')!);
  }
  
  // Check for cherry-picking timeframes
  const timeframeParams = requests
    .filter(r => r.params.start_date || r.params.period_start)
    .map(r => ({ 
      start: r.params.start_date || r.params.period_start,
      end: r.params.end_date || r.params.period_end
    }));
  
  if (timeframeParams.length > 10) {
    // If many short, non-overlapping timeframes, flag potential cherry-picking
    const shortTimeframes = timeframeParams.filter(t => {
      if (!t.start || !t.end) return false;
      const start = new Date(t.start as string);
      const end = new Date(t.end as string);
      const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      return days < 90; // Less than 3 months
    });
    
    if (shortTimeframes.length > timeframeParams.length * 0.7) {
      indicators.push(MISUSE_PATTERNS.find(p => p.pattern === 'cherry_pick_timeframe')!);
    }
  }
  
  // Determine overall severity
  let severity: MisuseSeverity = 'info';
  if (indicators.some(i => i.severity === 'critical')) {
    severity = 'critical';
  } else if (indicators.some(i => i.severity === 'warning')) {
    severity = 'warning';
  }
  
  // Determine recommended action
  let recommended_action = 'log';
  if (severity === 'critical') {
    recommended_action = 'rate_limit';
  } else if (severity === 'warning' && indicators.length > 2) {
    recommended_action = 'flag_for_review';
  }
  
  return {
    detected: indicators.length > 0,
    indicators,
    severity,
    recommended_action
  };
}

/**
 * Check if export request is potentially stripping context
 */
export function checkContextStripping(
  exportRequest: {
    includeMetadata: boolean;
    includeLimitations: boolean;
    includeDisclaimers: boolean;
    includeSource: boolean;
  }
): MisuseCheckResult {
  const indicators: MisuseIndicator[] = [];
  
  if (!exportRequest.includeMetadata) {
    indicators.push(MISUSE_PATTERNS.find(p => p.pattern === 'export_without_metadata')!);
  }
  
  if (!exportRequest.includeDisclaimers) {
    indicators.push({
      type: 'context_stripping',
      pattern: 'no_disclaimers',
      severity: 'warning',
      description: 'Export without required disclaimers'
    });
  }
  
  if (!exportRequest.includeLimitations) {
    indicators.push({
      type: 'context_stripping',
      pattern: 'no_limitations',
      severity: 'info',
      description: 'Export without data limitations'
    });
  }
  
  return {
    detected: indicators.length > 0,
    indicators,
    severity: indicators.some(i => i.severity === 'warning') ? 'warning' : 'info',
    recommended_action: indicators.length > 0 ? 'require_context' : 'allow'
  };
}

/**
 * Check for repeated scope violations
 */
export function checkRepeatedViolations(
  blockedQueries: Array<{ query: string; timestamp: Date; reason: string }>
): MisuseCheckResult {
  const indicators: MisuseIndicator[] = [];
  
  if (blockedQueries.length > 5) {
    indicators.push(MISUSE_PATTERNS.find(p => p.pattern === 'repeated_blocked_queries')!);
    
    // Check if same type of violation
    const reasons = blockedQueries.map(q => q.reason);
    const reasonCounts = reasons.reduce((acc, r) => {
      acc[r] = (acc[r] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const maxCount = Math.max(...Object.values(reasonCounts));
    if (maxCount > blockedQueries.length * 0.7) {
      indicators.push({
        type: 'scope_violation',
        pattern: 'persistent_violation_attempt',
        severity: 'warning',
        description: 'Persistent attempts to access blocked content type'
      });
    }
  }
  
  return {
    detected: indicators.length > 0,
    indicators,
    severity: indicators.length > 1 ? 'warning' : 'info',
    recommended_action: indicators.length > 1 ? 'flag_for_review' : 'log'
  };
}

/**
 * Build misuse detection entry for logging
 */
export function buildMisuseEntry(
  result: MisuseCheckResult,
  apiLogIds: string[]
): Omit<MisuseDetection, 'id' | 'detected_at'> {
  const primaryIndicator = result.indicators[0];
  
  return {
    detection_type: primaryIndicator?.type || 'scope_violation',
    severity: result.severity,
    evidence_summary: result.indicators
      .map(i => i.description)
      .join('; '),
    api_log_ids: apiLogIds,
    action_taken: result.recommended_action
  };
}

/**
 * Get all misuse patterns for documentation
 */
export function getAllMisusePatterns(): MisuseIndicator[] {
  return MISUSE_PATTERNS;
}
