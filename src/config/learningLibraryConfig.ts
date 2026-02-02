/**
 * WAVE 6 — BLOCK AY: LEARNING & PATTERN LIBRARY
 * 
 * Världens bibliotek av samhällslärdomar.
 * Lärdom utan replikation = låg vikt.
 */

export type EvidenceGrade = 'high' | 'moderate' | 'low' | 'preliminary';

export interface LearningObject {
  id: string;
  learningCode: string;
  
  // Core content
  summary: string; // Max 200 tecken
  detailedDescription?: string;
  
  // Context (where/when)
  context: {
    geographies: string[];
    timeStart: string;
    timeEnd?: string;
    conditions: Record<string, unknown>;
  };
  
  // Observed effect
  observedEffect: string;
  effectMagnitude?: string;
  effectConfidence: number;
  
  // Conditions for effect
  requiredConditions: string[];
  enablingFactors: string[];
  blockingFactors: string[];
  
  // Validation
  replications: number;
  replicationContexts: ReplicationContext[];
  counterexamples: number;
  counterexampleContexts: CounterexampleContext[];
  
  // Quality
  evidenceGrade: EvidenceGrade;
  lastValidated?: string;
}

export interface ReplicationContext {
  geography: string;
  timePeriod: string;
  conditions: Record<string, unknown>;
  effectObserved: string;
  deviationFromOriginal?: number;
}

export interface CounterexampleContext {
  geography: string;
  timePeriod: string;
  conditions: Record<string, unknown>;
  whyDifferent: string;
}

/**
 * Evidence grade calculation based on replications and counterexamples
 */
export function calculateEvidenceGrade(
  replications: number,
  counterexamples: number,
  baseConfidence: number
): EvidenceGrade {
  const ratio = replications / Math.max(1, replications + counterexamples);
  const replicationWeight = Math.min(1, replications / 5);
  
  const score = (baseConfidence * 0.4) + (ratio * 0.4) + (replicationWeight * 0.2);
  
  if (score >= 0.8 && replications >= 3) return 'high';
  if (score >= 0.6 && replications >= 2) return 'moderate';
  if (score >= 0.4) return 'low';
  return 'preliminary';
}

/**
 * Learning library categories
 */
export const LEARNING_CATEGORIES = {
  economic: {
    label: 'Ekonomi & arbetsmarknad',
    subcategories: ['employment', 'gdp', 'inflation', 'trade', 'investment']
  },
  social: {
    label: 'Social välfärd',
    subcategories: ['healthcare', 'education', 'housing', 'inequality', 'poverty']
  },
  environmental: {
    label: 'Miljö & klimat',
    subcategories: ['emissions', 'energy', 'biodiversity', 'pollution', 'resources']
  },
  governance: {
    label: 'Styrning & förvaltning',
    subcategories: ['efficiency', 'transparency', 'participation', 'trust', 'compliance']
  },
  security: {
    label: 'Säkerhet & beredskap',
    subcategories: ['crime', 'defense', 'cyber', 'emergency', 'resilience']
  }
} as const;

/**
 * Replication strength thresholds
 */
export const REPLICATION_THRESHOLDS = {
  strong: {
    minReplications: 5,
    maxCounterexamples: 1,
    label: 'Stark evidens'
  },
  moderate: {
    minReplications: 3,
    maxCounterexamples: 2,
    label: 'Moderat evidens'
  },
  weak: {
    minReplications: 1,
    maxCounterexamples: 3,
    label: 'Svag evidens'
  },
  contested: {
    minReplications: 0,
    maxCounterexamples: Infinity,
    label: 'Omtvistad'
  }
} as const;

export function getReplicationStrength(replications: number, counterexamples: number): keyof typeof REPLICATION_THRESHOLDS {
  if (replications >= 5 && counterexamples <= 1) return 'strong';
  if (replications >= 3 && counterexamples <= 2) return 'moderate';
  if (replications >= 1 && counterexamples <= 3) return 'weak';
  return 'contested';
}

/**
 * Format learning for display
 */
export function formatLearning(learning: LearningObject): {
  headline: string;
  context: string;
  confidence: string;
  evidence: string;
} {
  const strength = getReplicationStrength(learning.replications, learning.counterexamples);
  
  return {
    headline: learning.summary,
    context: `${learning.context.geographies.join(', ')} (${learning.context.timeStart}${learning.context.timeEnd ? ' – ' + learning.context.timeEnd : ''})`,
    confidence: `${(learning.effectConfidence * 100).toFixed(0)}% konfidens`,
    evidence: `${learning.replications} replikationer, ${learning.counterexamples} motexempel – ${REPLICATION_THRESHOLDS[strength].label}`
  };
}

/**
 * Pattern templates for common learnings
 */
export const LEARNING_TEMPLATES = {
  regional_effect: 'I regioner med {condition1} observeras {effect} efter ~{timeframe}.',
  policy_impact: 'Efter införande av {policy} i {geography} förändrades {metric} med {magnitude}.',
  threshold_pattern: 'När {indicator} överstiger {threshold} tenderar {outcome} att inträffa.',
  comparative: 'Länder med {characteristic} uppvisar i genomsnitt {difference} i {metric}.',
  temporal: 'Historiskt har {intervention_type} visat effekt efter {lag} månader i {context}.'
} as const;

/**
 * Validates learning object completeness
 */
export function validateLearning(learning: Partial<LearningObject>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!learning.summary) errors.push('Sammanfattning saknas');
  if (learning.summary && learning.summary.length > 200) errors.push('Sammanfattning för lång (max 200 tecken)');
  if (!learning.context?.geographies?.length) errors.push('Geografisk kontext saknas');
  if (!learning.context?.timeStart) errors.push('Tidsperiod saknas');
  if (!learning.observedEffect) errors.push('Observerad effekt saknas');
  if (typeof learning.effectConfidence !== 'number') errors.push('Konfidensnivå saknas');
  
  return { valid: errors.length === 0, errors };
}
