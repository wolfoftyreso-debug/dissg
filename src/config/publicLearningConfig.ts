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

// ============================================================
// WAVE 9: BLOCK BW — LEARNING-AT-SCALE ENGINE
// ============================================================

export interface GlobalLearningCluster {
  id: string;
  patternId: string;
  
  // Var mönstret observerats
  observedIn: {
    countryCode: string;
    regionCode?: string;
    period: { from: string; to: string };
    strength: number;
    contextFactors: string[];
  }[];
  
  // Var det INTE gäller (BX1)
  counterexamples: {
    countryCode: string;
    period: { from: string; to: string };
    observation: string;
    potentialExplanations: string[];
    confidence: number;
  }[];
  
  // BW2: Learning Score
  replicationScore: number;
  contextDependency: 'universal' | 'high' | 'moderate' | 'low' | 'context_specific';
  stabilityOverTime: number;
  
  overallQuality: 'robust' | 'moderate' | 'emerging' | 'fragile' | 'contested';
}

// ============================================================
// WAVE 9: BLOCK BY — USER AGGREGATION MODE
// ============================================================

export interface UserAggregation {
  id: string;
  userId: string;
  
  type: 'index' | 'dashboard' | 'cluster' | 'comparison';
  name: string;
  description?: string;
  
  config: {
    components?: { entityId: string; weight: number; direction: 'positive' | 'negative' }[];
    methodology?: string;
    filters?: Record<string, unknown>;
  };
  
  version: number;
  visibility: 'private' | 'unlisted' | 'public';
  shareUrl?: string;
  
  createdAt: string;
  updatedAt: string;
  viewCount?: number;
  forkCount?: number;
}

// ============================================================
// WAVE 9: BLOCK BZ — "PROVE ME WRONG" MODE
// ============================================================

export interface ProveWrongConfig {
  enabled: boolean;
  features: ('alternative_interpretations' | 'weaknesses' | 'confounding_factors' | 'temporal_instability' | 'geographic_limits')[];
}

export interface InsightWeakness {
  id: string;
  insightId: string;
  weaknessType: 'data_quality' | 'sample_size' | 'methodology' | 'confounding' | 'selection_bias' | 'measurement_error';
  description: string;
  severity: 'critical' | 'significant' | 'minor';
  impact: string;
}

export const WEAKNESS_TYPE_LABELS: Record<string, { sv: string; en: string }> = {
  data_quality: { sv: 'Datakvalitet', en: 'Data quality' },
  sample_size: { sv: 'Urvalsstorlek', en: 'Sample size' },
  methodology: { sv: 'Metodologi', en: 'Methodology' },
  confounding: { sv: 'Störfaktorer', en: 'Confounding factors' },
  selection_bias: { sv: 'Urvalsfel', en: 'Selection bias' },
  measurement_error: { sv: 'Mätfel', en: 'Measurement error' }
};

export const DEFAULT_PROVE_WRONG_CONFIG: ProveWrongConfig = {
  enabled: true,
  features: ['alternative_interpretations', 'weaknesses', 'confounding_factors', 'temporal_instability', 'geographic_limits']
};

// ============================================================
// WAVE 9: BLOCK CA — DATA LITERACY MODE
// ============================================================

export interface LiteracyExplanation {
  id: string;
  targetType: 'kpi' | 'index' | 'chart' | 'concept';
  
  levels: {
    simple: string;      // Förskolelärartest
    standard: string;    // Allmänbildad vuxen
    technical: string;   // Specialist
  };
  
  commonMisinterpretations: {
    description: string;
    whyWrong: string;
    correctInterpretation: string;
    frequency: 'very_common' | 'common' | 'occasional';
  }[];
  
  readingGuide: {
    whatToLookFor: string[];
    whatToIgnore: string[];
    questions: string[];
  };
}

export const LITERACY_EXAMPLES: LiteracyExplanation[] = [
  {
    id: 'lit_correlation',
    targetType: 'concept',
    levels: {
      simple: 'Korrelation betyder att två saker rör sig åt samma håll samtidigt. Det betyder INTE att det ena orsakar det andra.',
      standard: 'Korrelation mäter hur starkt två variabler rör sig tillsammans. En korrelation på 1 betyder perfekt samrörelse, 0 betyder inget samband, och -1 betyder perfekt motsatt rörelse.',
      technical: 'Pearsons korrelationskoefficient mäter linjärt samband mellan två kontinuerliga variabler. Signifikans beror på urvalsstorlek och bör tolkas med p-värde och konfidensintervall.'
    },
    commonMisinterpretations: [
      {
        description: 'Korrelation visar att A orsakar B',
        whyWrong: 'Korrelation visar samrörelse, inte kausalitet. En tredje faktor kan orsaka båda.',
        correctInterpretation: 'A och B rör sig ofta tillsammans. Mer analys krävs för att förstå varför.',
        frequency: 'very_common'
      }
    ],
    readingGuide: {
      whatToLookFor: ['Styrkan (0-1)', 'Riktningen (+/-)', 'Signifikans', 'Tidsperiod'],
      whatToIgnore: ['Antaget kausalsamband', 'Korrelationer utan kontext'],
      questions: ['Vilka andra faktorer kan påverka?', 'Gäller detta i alla sammanhang?']
    }
  }
];

export const LITERACY_FEATURE_FLAGS = {
  showSimpleExplanations: true,
  showMisinterpretations: true,
  showReadingGuide: true,
  defaultLevel: 'simple' as const,
  alwaysShowDisclaimer: true
};
