/**
 * HEALTH & SUBSTANCE REALITY LAYER - AI Guardrails
 * 
 * This module implements technical barriers against:
 * - Medical advice
 * - Individual conclusions
 * - Dose comparisons
 * - Treatment recommendations
 * 
 * The platform is EPIDEMIOLOGICAL, not CLINICAL.
 */

import { BLOCKED_PATTERNS } from '@/types/health';

/**
 * Patterns that indicate individual-level health queries
 * These are BLOCKED - system refuses to answer
 */
const INDIVIDUAL_PATTERNS = [
  /\bmy\s+(symptoms?|condition|health|body|pain|disease|illness)\b/i,
  /\bI\s+(have|feel|am\s+experiencing|suffer)\b/i,
  /\bshould\s+I\s+(take|use|try|stop|continue)\b/i,
  /\bwhat\s+(should|can|would)\s+I\b/i,
  /\brecommend(ed)?\s+(for\s+me|dose|treatment)\b/i,
  /\bdiagnos(e|is)\s+(me|my)\b/i,
  /\b(cure|treat|heal)\s+(me|my)\b/i,
  /\bhow\s+to\s+(treat|cure|fix)\s+my\b/i,
  /\bwhat\s+(drug|medication|medicine)\s+(is\s+best|should)\b/i,
  /\bis\s+it\s+safe\s+(to|for\s+me)\b/i,
  /\bwill\s+(this|it)\s+(help|cure|fix)\b/i,
  /\b(better|safer|worse)\s+(drug|medication|option)\b/i,
  /\bdose|dosage|how\s+much\s+(to\s+take|should\s+I)\b/i
];

/**
 * Patterns that indicate normative/value judgments
 * These trigger warnings but don't block
 */
const NORMATIVE_PATTERNS = [
  /\b(should|must|ought\s+to|need\s+to)\b/i,
  /\b(good|bad|better|worse|best|worst)\s+(for|drug|treatment)\b/i,
  /\b(dangerous|safe|risky|harmful)\s+(to|drug)\b/i,
  /\brecommend/i,
  /\badvise/i
];

/**
 * Response types for query validation
 */
export type GuardrailResponse = {
  allowed: boolean;
  reason?: string;
  suggestion?: string;
  warningLevel?: 'none' | 'caution' | 'blocked';
};

/**
 * Validate a user query against health guardrails
 */
export function validateHealthQuery(query: string): GuardrailResponse {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Check for blocked patterns (individual health queries)
  for (const pattern of INDIVIDUAL_PATTERNS) {
    if (pattern.test(normalizedQuery)) {
      return {
        allowed: false,
        reason: "This platform does not provide personal health advice.",
        suggestion: "For individual health concerns, please consult a licensed healthcare professional. This platform shows population-level epidemiological data only.",
        warningLevel: 'blocked'
      };
    }
  }
  
  // Check for blocked keyword patterns
  for (const blockedPhrase of BLOCKED_PATTERNS) {
    if (normalizedQuery.includes(blockedPhrase.toLowerCase())) {
      return {
        allowed: false,
        reason: "This query type is not supported.",
        suggestion: "This platform provides historical health data for research and reference. It cannot provide medical recommendations.",
        warningLevel: 'blocked'
      };
    }
  }
  
  // Check for normative patterns (warning only)
  for (const pattern of NORMATIVE_PATTERNS) {
    if (pattern.test(normalizedQuery)) {
      return {
        allowed: true,
        reason: "This platform shows observational data without value judgments.",
        suggestion: "Results will show what was observed, not what 'should' happen.",
        warningLevel: 'caution'
      };
    }
  }
  
  return {
    allowed: true,
    warningLevel: 'none'
  };
}

/**
 * Sanitize output to remove any normative language
 */
export function sanitizeHealthOutput(text: string): string {
  const replacements: [RegExp, string][] = [
    [/\bshould\b/gi, 'was observed to'],
    [/\bmust\b/gi, 'typically'],
    [/\bneed to\b/gi, 'tend to'],
    [/\bbetter\b/gi, 'higher'],
    [/\bworse\b/gi, 'lower'],
    [/\bsafe\b/gi, 'associated with lower risk'],
    [/\bdangerous\b/gi, 'associated with higher risk'],
    [/\brecommended\b/gi, 'observed'],
    [/\bcauses\b/gi, 'was observed together with'],
    [/\bleads to\b/gi, 'was associated with'],
  ];
  
  let sanitized = text;
  for (const [pattern, replacement] of replacements) {
    sanitized = sanitized.replace(pattern, replacement);
  }
  
  return sanitized;
}

/**
 * Generate a neutral observation statement
 * Converts causal claims to observational language
 */
export function toObservationalStatement(
  observation: string,
  context?: {
    timeframe?: string;
    population?: string;
    dataSource?: string;
  }
): string {
  let statement = sanitizeHealthOutput(observation);
  
  const parts: string[] = [];
  
  if (context?.population) {
    parts.push(`In ${context.population}`);
  }
  
  if (context?.timeframe) {
    parts.push(`during ${context.timeframe}`);
  }
  
  if (parts.length > 0) {
    statement = `${parts.join(', ')}, ${statement.charAt(0).toLowerCase()}${statement.slice(1)}`;
  }
  
  if (context?.dataSource) {
    statement += ` (Source: ${context.dataSource})`;
  }
  
  return statement;
}

/**
 * Generate required disclaimer block
 */
export function getRequiredDisclaimer(): {
  title: string;
  points: string[];
  urgent: boolean;
} {
  return {
    title: "Important Notice",
    points: [
      "This platform does not provide medical advice.",
      "No diagnosis, treatment, or prevention guidance is offered.",
      "For personal health decisions, consult licensed professionals.",
      "All data shown is population-level and aggregated."
    ],
    urgent: true
  };
}

/**
 * Check if a response needs additional context warnings
 */
export function needsContextWarning(
  hasComparisonData: boolean,
  hasTemporalData: boolean,
  hasCrossCountryData: boolean
): string[] {
  const warnings: string[] = [];
  
  if (hasComparisonData) {
    warnings.push("Comparison does not imply causation. Multiple confounding factors may explain differences.");
  }
  
  if (hasTemporalData) {
    warnings.push("Temporal correlation does not indicate causation. Other factors changed during this period.");
  }
  
  if (hasCrossCountryData) {
    warnings.push("Cross-country comparisons are affected by different measurement methods, healthcare systems, and reporting standards.");
  }
  
  return warnings;
}

/**
 * Validate that a data display includes required context
 */
export function validateDataDisplay(
  hasDisclaimers: boolean,
  hasSourceAttribution: boolean,
  hasMethodologyLink: boolean,
  hasUncertaintyInfo: boolean
): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!hasDisclaimers) missing.push('Medical disclaimer');
  if (!hasSourceAttribution) missing.push('Data source attribution');
  if (!hasMethodologyLink) missing.push('Methodology explanation');
  if (!hasUncertaintyInfo) missing.push('Uncertainty/confidence information');
  
  return {
    valid: missing.length === 0,
    missing
  };
}
