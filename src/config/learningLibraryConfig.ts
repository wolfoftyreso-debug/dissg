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

// ============================================================
// WAVE 13: BLOCK CZ — GLOBAL EDUCATION & DATA LITERACY
// BLOCK DA — OPEN CURRICULUM & ACADEMIC INTEGRATION
// ============================================================

export type LiteracyCategory = 'reading_graphs' | 'misinterpretations' | 'correlation_effect' | 'uncertainty' | 'method_critique';

export interface LiteracyModule {
  id: string;
  category: LiteracyCategory;
  title_sv: string;
  duration_minutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  outcomes: string[];
  ui_contexts: string[];
}

export const LITERACY_MODULES: LiteracyModule[] = [
  { id: 'lm_graph', category: 'reading_graphs', title_sv: 'Hur läser man grafer?', duration_minutes: 10, difficulty: 'beginner', outcomes: ['Förstå axlar', 'Identifiera trender', 'Känna igen skalfällor'], ui_contexts: ['kpi_detail', 'trend_chart'] },
  { id: 'lm_cherry', category: 'misinterpretations', title_sv: 'Cherry-picking & selektivt urval', duration_minutes: 12, difficulty: 'intermediate', outcomes: ['Identifiera selektiva perioder', 'Känna igen urvalsfel'], ui_contexts: ['time_selector', 'filter_panel'] },
  { id: 'lm_base_rate', category: 'misinterpretations', title_sv: 'Basfrekvens-fallacier', duration_minutes: 15, difficulty: 'intermediate', outcomes: ['Relativa vs absoluta tal', 'Per capita-justeringar'], ui_contexts: ['kpi_card', 'comparison'] },
  { id: 'lm_correlation', category: 'correlation_effect', title_sv: 'Korrelation är inte kausalitet', duration_minutes: 20, difficulty: 'intermediate', outcomes: ['Skilja korrelation från effekt', 'Identifiera confounders'], ui_contexts: ['correlation_view', 'why_engine'] },
  { id: 'lm_uncertainty', category: 'uncertainty', title_sv: 'Osäkerhet & konfidensintervall', duration_minutes: 15, difficulty: 'intermediate', outcomes: ['Läsa konfidensintervall', 'Tolka p-värden'], ui_contexts: ['forecast', 'simulation'] },
  { id: 'lm_method', category: 'method_critique', title_sv: 'Hur kritiserar man metoder?', duration_minutes: 20, difficulty: 'advanced', outcomes: ['Ställa rätt frågor', 'Identifiera svagheter'], ui_contexts: ['method_panel', 'reproduce'] }
];

// DA1: Academic Integration
export interface AcademicResource {
  id: string;
  type: 'dataset' | 'exercise' | 'method_comparison' | 'research_guide';
  title: string;
  license: 'CC-BY' | 'CC-BY-SA' | 'CC0';
  target_level: 'undergraduate' | 'graduate' | 'researcher';
  hours: number;
}

export const ACADEMIC_RESOURCES: AcademicResource[] = [
  { id: 'ar_intro', type: 'dataset', title: 'Introductory KPI Dataset', license: 'CC0', target_level: 'undergraduate', hours: 4 },
  { id: 'ar_corr', type: 'exercise', title: 'Correlation vs Causation Exercise', license: 'CC-BY', target_level: 'undergraduate', hours: 2 },
  { id: 'ar_method', type: 'method_comparison', title: 'Index Construction Methods', license: 'CC-BY-SA', target_level: 'graduate', hours: 6 },
  { id: 'ar_repl', type: 'research_guide', title: 'Replication Study Guide', license: 'CC-BY', target_level: 'researcher', hours: 20 }
];

export const ACADEMIC_POLICY = {
  all_cc_licensed: true,
  results_public: true,
  methodology_documented: true,
  attribution_required: true
} as const;

export interface LearningPath {
  id: string;
  name_sv: string;
  modules: string[];
  hours: number;
}

export const LEARNING_PATHS: LearningPath[] = [
  { id: 'lp_citizen', name_sv: 'Informerad medborgare', modules: ['lm_graph', 'lm_cherry', 'lm_base_rate'], hours: 1 },
  { id: 'lp_journalist', name_sv: 'Datajournalistik', modules: ['lm_graph', 'lm_cherry', 'lm_correlation', 'lm_uncertainty'], hours: 2 },
  { id: 'lp_analyst', name_sv: 'Policyanalys', modules: ['lm_graph', 'lm_base_rate', 'lm_correlation', 'lm_uncertainty', 'lm_method'], hours: 3 }
];

export function getModulesForContext(context: string): LiteracyModule[] {
  return LITERACY_MODULES.filter(m => m.ui_contexts.includes(context));
}
