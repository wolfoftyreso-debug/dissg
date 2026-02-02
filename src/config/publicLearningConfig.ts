/**
 * WAVE 7 — PUBLIC LEARNING ENGINE
 * 
 * Dagliga "vad världen lärde sig idag"
 * Replikerade mönster
 * Vad som inte fungerar
 */

export type PatternStage = 
  | 'hypothesis'    // Föreslagen, ej testad
  | 'emerging'      // Första tecken
  | 'confirmed'     // Replikerad minst 2x
  | 'strong'        // Replikerad 5x+, få motexempel
  | 'weakening'     // Nya motexempel
  | 'falsified'     // Motbevisad
  | 'archived';     // Historiskt intresse

export interface PatternLifecycle {
  id: string;
  patternCode: string;
  patternDescription: string;
  
  // Current stage
  stage: PatternStage;
  stageChangedAt: string;
  
  // Evidence
  supportingEvidence: number;
  contradictingEvidence: number;
  replications: number;
  failedReplications: number;
  
  // History
  stageHistory: Array<{
    stage: PatternStage;
    changedAt: string;
    reason: string;
  }>;
  
  // Geographic scope
  firstObservedGeo: string;
  confirmedInGeos: string[];
  failedInGeos: string[];
}

export interface DailyLearning {
  id: string;
  learningDate: string;
  
  // Counts
  totalNewInsights: number;
  totalConfirmedPatterns: number;
  totalFalsifiedPatterns: number;
  totalReplications: number;
  
  // Top items
  topLearnings: LearningItem[];
  notableFailures: FailureItem[];
  replicationUpdates: ReplicationUpdate[];
  
  // Coverage
  countriesWithUpdates: string[];
  kpiCategoriesUpdated: string[];
  
  // Summary
  summaryText: string;
}

export interface LearningItem {
  id: string;
  title: string;
  summary: string;
  confidence: number;
  isNew: boolean;
  category: string;
}

export interface FailureItem {
  id: string;
  hypothesis: string;
  whyFailed: string;
  whatWeLearned: string;
}

export interface ReplicationUpdate {
  patternId: string;
  patternDescription: string;
  previousStage: PatternStage;
  newStage: PatternStage;
  reason: string;
}

export interface FalsifiedHypothesis {
  id: string;
  hypothesisCode: string;
  originalHypothesis: string;
  originallyProposedBy?: string;
  originallyProposedAt?: string;
  
  // Why it failed
  falsificationSummary: string;
  falsificationEvidence: Record<string, unknown>;
  contradictingData: string[];
  
  // Context
  failedInContexts: string[];
  mightWorkInContexts: string[];
  
  // Learning value
  whatWeLearned: string;
  relatedValidPatterns: string[];
  
  falsifiedAt: string;
}

/**
 * Stage progression rules
 */
export const STAGE_TRANSITIONS: Record<PatternStage, PatternStage[]> = {
  hypothesis: ['emerging', 'falsified'],
  emerging: ['confirmed', 'falsified', 'archived'],
  confirmed: ['strong', 'weakening', 'falsified'],
  strong: ['weakening', 'archived'],
  weakening: ['confirmed', 'falsified', 'archived'],
  falsified: ['archived'],
  archived: []
};

/**
 * Stage requirements
 */
export const STAGE_REQUIREMENTS: Record<PatternStage, {
  minReplications?: number;
  maxCounterexamples?: number;
  minConfidence?: number;
}> = {
  hypothesis: {},
  emerging: { minReplications: 1 },
  confirmed: { minReplications: 2, maxCounterexamples: 1 },
  strong: { minReplications: 5, maxCounterexamples: 1, minConfidence: 0.8 },
  weakening: {},
  falsified: {},
  archived: {}
};

/**
 * Calculate pattern stage from evidence
 */
export function calculatePatternStage(
  replications: number,
  failedReplications: number,
  confidence: number
): PatternStage {
  const counterRatio = failedReplications / Math.max(1, replications + failedReplications);
  
  if (counterRatio > 0.5) return 'falsified';
  if (counterRatio > 0.3) return 'weakening';
  
  if (replications >= 5 && failedReplications <= 1 && confidence >= 0.8) return 'strong';
  if (replications >= 2 && failedReplications <= 1) return 'confirmed';
  if (replications >= 1) return 'emerging';
  
  return 'hypothesis';
}

/**
 * Stage display configuration
 */
export const STAGE_DISPLAY: Record<PatternStage, {
  label: string;
  color: string;
  icon: string;
  description: string;
}> = {
  hypothesis: {
    label: 'Hypotes',
    color: 'text-muted-foreground',
    icon: 'HelpCircle',
    description: 'Föreslagen, ännu ej testad'
  },
  emerging: {
    label: 'Framväxande',
    color: 'text-blue-500',
    icon: 'Sparkles',
    description: 'Första tecken observerade'
  },
  confirmed: {
    label: 'Bekräftad',
    color: 'text-status-positive',
    icon: 'CheckCircle',
    description: 'Replikerad i flera kontexter'
  },
  strong: {
    label: 'Stark',
    color: 'text-green-600',
    icon: 'Shield',
    description: 'Robust, få motexempel'
  },
  weakening: {
    label: 'Försvagad',
    color: 'text-status-warning',
    icon: 'AlertTriangle',
    description: 'Nya motexempel har dykt upp'
  },
  falsified: {
    label: 'Falsifierad',
    color: 'text-status-critical',
    icon: 'XCircle',
    description: 'Motbevisad av data'
  },
  archived: {
    label: 'Arkiverad',
    color: 'text-muted-foreground',
    icon: 'Archive',
    description: 'Historiskt intresse'
  }
};

/**
 * Generate daily learning summary
 */
export function generateDailySummary(learning: DailyLearning): string {
  const parts: string[] = [];
  
  if (learning.totalNewInsights > 0) {
    parts.push(`${learning.totalNewInsights} nya insikter`);
  }
  
  if (learning.totalConfirmedPatterns > 0) {
    parts.push(`${learning.totalConfirmedPatterns} bekräftade mönster`);
  }
  
  if (learning.totalFalsifiedPatterns > 0) {
    parts.push(`${learning.totalFalsifiedPatterns} falsifierade hypoteser`);
  }
  
  if (learning.totalReplications > 0) {
    parts.push(`${learning.totalReplications} replikationer`);
  }
  
  if (parts.length === 0) {
    return 'Inga signifikanta uppdateringar idag.';
  }
  
  return `Idag: ${parts.join(', ')}. Uppdateringar från ${learning.countriesWithUpdates.length} länder.`;
}

/**
 * Categories for daily learnings
 */
export const LEARNING_CATEGORIES = {
  economic: { label: 'Ekonomi', priority: 1 },
  social: { label: 'Samhälle', priority: 2 },
  health: { label: 'Hälsa', priority: 3 },
  environment: { label: 'Miljö', priority: 4 },
  governance: { label: 'Styrning', priority: 5 },
  education: { label: 'Utbildning', priority: 6 },
  infrastructure: { label: 'Infrastruktur', priority: 7 }
} as const;

/**
 * Template for "what doesn't work" items
 */
export function formatFalsifiedHypothesis(hyp: FalsifiedHypothesis): string {
  return `
**Hypotes:** ${hyp.originalHypothesis}

**Falsifierad:** ${hyp.falsificationSummary}

**Vad vi lärde oss:** ${hyp.whatWeLearned}

${hyp.mightWorkInContexts.length > 0 ? `**Kan fungera i:** ${hyp.mightWorkInContexts.join(', ')}` : ''}
  `.trim();
}
