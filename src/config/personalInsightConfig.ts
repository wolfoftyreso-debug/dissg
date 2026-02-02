/**
 * MODULE — PERSONAL INSIGHT BUILDER (PIB)
 * "Hjälp mig formulera mina egna frågor – och förstå svaren korrekt."
 * 
 * KÄRNPRINCIP:
 * Systemet ska göra det lätt att ställa bra frågor
 * och svårt att dra dåliga slutsatser.
 */

// ═══════════════════════════════════════════════════════════════
// CORE PRINCIPLE
// ═══════════════════════════════════════════════════════════════

export const PIB_CORE_PRINCIPLE = {
  statement: 'Systemet ska göra det lätt att ställa bra frågor och svårt att dra dåliga slutsatser.',
  statementEn: 'The system should make it easy to ask good questions and hard to draw bad conclusions.',
  enforced: true,
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK TA — QUESTION-FIRST INTERFACE
// ═══════════════════════════════════════════════════════════════

export interface UserQuestion {
  id: string;
  originalText: string;
  interpretedAs: string;
  interpretedAsSv: string;
  approvedByUser: boolean;
  createdAt: string;
  category: 'comparison' | 'trend' | 'correlation' | 'change' | 'difference';
}

export const EXAMPLE_QUESTIONS = [
  'Hur hänger energipriser och hushållens ekonomi ihop?',
  'Vad skiljer länder som klarat inflation bättre?',
  'Vad har förändrats mest i Europa de senaste 10 åren?',
  'Varför har arbetslösheten sjunkit i Norden?',
  'Hur påverkar utbildningsnivå välstånd?',
] as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK TB — INSIGHT BLUEPRINT
// ═══════════════════════════════════════════════════════════════

export interface InsightBlueprint {
  questionId: string;
  dataPoints: { id: string; name: string; nameSv: string; relevance: string }[];
  timePeriod: { start: string; end: string; reason: string };
  comparisonGroups: { id: string; name: string; nameSv: string }[];
  potentialConfounders: { factor: string; factorSv: string; impact: 'high' | 'medium' | 'low' }[];
  limitations: string[];
  limitationsSv: string[];
}

// ═══════════════════════════════════════════════════════════════
// BLOCK TC — STEPWISE EXPLORATION
// ═══════════════════════════════════════════════════════════════

export type ExplorationStepType = 
  | 'basic_trend'
  | 'comparison'
  | 'covariation'
  | 'deviations'
  | 'limitations';

export interface ExplorationStep {
  type: ExplorationStepType;
  title: string;
  titleSv: string;
  description: string;
  descriptionSv: string;
  order: number;
}

export const EXPLORATION_STEPS: ExplorationStep[] = [
  {
    type: 'basic_trend',
    title: 'Basic Trend',
    titleSv: 'Grundtrend',
    description: 'What does the data show over time?',
    descriptionSv: 'Vad visar datan över tid?',
    order: 1,
  },
  {
    type: 'comparison',
    title: 'Comparison',
    titleSv: 'Jämförelse',
    description: 'How does this compare to similar entities?',
    descriptionSv: 'Hur ser detta ut jämfört med liknande?',
    order: 2,
  },
  {
    type: 'covariation',
    title: 'Covariation',
    titleSv: 'Samvariation',
    description: 'What else moves together with this?',
    descriptionSv: 'Vad annat rör sig tillsammans med detta?',
    order: 3,
  },
  {
    type: 'deviations',
    title: 'Deviations',
    titleSv: 'Avvikelser',
    description: 'Where are the exceptions and outliers?',
    descriptionSv: 'Var finns undantagen och avvikarna?',
    order: 4,
  },
  {
    type: 'limitations',
    title: 'What This Does Not Say',
    titleSv: 'Vad detta inte säger',
    description: 'Critical limitations and what cannot be concluded',
    descriptionSv: 'Kritiska begränsningar och vad som inte kan slutledas',
    order: 5,
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK TD — CORRELATION EXPLAINER
// ═══════════════════════════════════════════════════════════════

export interface CorrelationExplanation {
  variableA: string;
  variableB: string;
  relationship: 'positive' | 'negative' | 'weak' | 'none';
  strength: number; // 0-1
  possibleDrivers: string[];
  possibleDriversSv: string[];
  cannotExclude: string[];
  cannotExcludeSv: string[];
  uncertaintyLevel: 'low' | 'medium' | 'high';
  uncertaintyReason: string;
  uncertaintyReasonSv: string;
}

export const CORRELATION_DISCLAIMER_SV = 
  'Här ser vi att variablerna ofta rör sig tillsammans under denna period. Detta kan bero på flera faktorer.';

export const CORRELATION_DISCLAIMER_EN = 
  'Here we see that the variables often move together during this period. This can be due to several factors.';

// ═══════════════════════════════════════════════════════════════
// BLOCK TE — USER NOTES
// ═══════════════════════════════════════════════════════════════

export interface UserNote {
  id: string;
  insightId: string;
  content: string;
  type: 'interpretation' | 'question' | 'observation';
  createdAt: string;
  isPersonal: true; // Always true - marked as personal
}

export const NOTE_DISCLAIMER_SV = 'Personlig anteckning – inte systemets analys';
export const NOTE_DISCLAIMER_EN = 'Personal note – not the system\'s analysis';

// ═══════════════════════════════════════════════════════════════
// BLOCK TF — MISINTERPRETATION GUARD
// ═══════════════════════════════════════════════════════════════

export type MisinterpretationType = 
  | 'causal_claim'
  | 'incomparable_groups'
  | 'skipped_step'
  | 'overgeneralization'
  | 'cherry_picking';

export interface MisinterpretationWarning {
  type: MisinterpretationType;
  title: string;
  titleSv: string;
  message: string;
  messageSv: string;
  suggestion: string;
  suggestionSv: string;
}

export const MISINTERPRETATION_WARNINGS: Record<MisinterpretationType, MisinterpretationWarning> = {
  causal_claim: {
    type: 'causal_claim',
    title: 'Causal claim without evidence',
    titleSv: 'Kausal slutsats utan stöd',
    message: 'This conclusion is not supported by the data shown.',
    messageSv: 'Denna slutsats stöds inte av den data som visas.',
    suggestion: 'Correlation does not imply causation. Would you like to see why?',
    suggestionSv: 'Samvariation innebär inte orsak. Vill du se varför?',
  },
  incomparable_groups: {
    type: 'incomparable_groups',
    title: 'Non-comparable groups',
    titleSv: 'Icke-jämförbara grupper',
    message: 'These entities may not be directly comparable.',
    messageSv: 'Dessa enheter kanske inte är direkt jämförbara.',
    suggestion: 'Structural differences may affect comparison. View details?',
    suggestionSv: 'Strukturella skillnader kan påverka jämförelsen. Se detaljer?',
  },
  skipped_step: {
    type: 'skipped_step',
    title: 'Critical step skipped',
    titleSv: 'Kritiskt steg hoppades över',
    message: 'Important context was not reviewed.',
    messageSv: 'Viktig kontext granskades inte.',
    suggestion: 'Review all steps for a complete understanding.',
    suggestionSv: 'Gå igenom alla steg för fullständig förståelse.',
  },
  overgeneralization: {
    type: 'overgeneralization',
    title: 'Overgeneralization',
    titleSv: 'Övergeneralisering',
    message: 'This pattern may not apply universally.',
    messageSv: 'Detta mönster gäller kanske inte universellt.',
    suggestion: 'Consider exceptions and context limitations.',
    suggestionSv: 'Beakta undantag och kontextbegränsningar.',
  },
  cherry_picking: {
    type: 'cherry_picking',
    title: 'Selective evidence',
    titleSv: 'Selektivt urval',
    message: 'Only partial data is being considered.',
    messageSv: 'Endast delvis data beaktas.',
    suggestion: 'View the full dataset for balanced analysis.',
    suggestionSv: 'Se hela datasetet för balanserad analys.',
  },
};

// ═══════════════════════════════════════════════════════════════
// BLOCK TG — INSIGHT QUALITY SCORE
// ═══════════════════════════════════════════════════════════════

export type QualityCriterion = 
  | 'clear_question'
  | 'correct_comparison'
  | 'uncertainty_considered'
  | 'limitations_reviewed'
  | 'steps_completed';

export interface QualityCheck {
  criterion: QualityCriterion;
  label: string;
  labelSv: string;
  status: 'passed' | 'warning' | 'failed';
  note?: string;
  noteSv?: string;
}

export const QUALITY_CRITERIA: Record<QualityCriterion, { label: string; labelSv: string }> = {
  clear_question: { label: 'Clear question', labelSv: 'Tydlig fråga' },
  correct_comparison: { label: 'Correct comparison', labelSv: 'Korrekt jämförelse' },
  uncertainty_considered: { label: 'Uncertainty considered', labelSv: 'Osäkerhet beaktad' },
  limitations_reviewed: { label: 'Limitations reviewed', labelSv: 'Begränsningar granskade' },
  steps_completed: { label: 'All steps completed', labelSv: 'Alla steg genomförda' },
};

// ═══════════════════════════════════════════════════════════════
// BLOCK TH — SHAREABLE INSIGHTS
// ═══════════════════════════════════════════════════════════════

export interface ShareableInsight {
  id: string;
  question: string;
  questionSv: string;
  dataPoints: string[];
  methodology: string;
  methodologySv: string;
  findings: string;
  findingsSv: string;
  warnings: string[];
  warningsSv: string[];
  userInterpretation?: string; // Clearly marked if present
  generatedAt: string;
  shareUrl?: string;
}

export const SHARE_DISCLAIMER_SV = 'Denna analys inkluderar alltid fråga, data, metod och varningar.';
export const SHARE_DISCLAIMER_EN = 'This analysis always includes question, data, method, and warnings.';

// ═══════════════════════════════════════════════════════════════
// BLOCK TI — INSIGHT LIBRARY
// ═══════════════════════════════════════════════════════════════

export interface InsightHistoryEntry {
  id: string;
  question: string;
  createdAt: string;
  qualityScore: number;
  stepsCompleted: number;
  totalSteps: number;
  hasUpdatedData: boolean;
  updateNotes?: string;
}

export interface InsightLibrary {
  userId: string;
  entries: InsightHistoryEntry[];
  learningProgress: {
    totalInsights: number;
    averageQuality: number;
    improvementTrend: 'improving' | 'stable' | 'declining';
    skillsStrengthened: string[];
    areasToImprove: string[];
  };
}

// ═══════════════════════════════════════════════════════════════
// SYSTEM STATUS
// ═══════════════════════════════════════════════════════════════

export const PERSONAL_INSIGHT_BUILDER_SYSTEM = {
  name: 'Personal Insight Builder',
  acronym: 'PIB',
  version: '1.0',
  
  core_principle: PIB_CORE_PRINCIPLE,
  
  blocks: {
    TA: 'Question-First Interface',
    TB: 'Insight Blueprint',
    TC: 'Stepwise Exploration',
    TD: 'Correlation Explainer',
    TE: 'User Notes',
    TF: 'Misinterpretation Guard',
    TG: 'Insight Quality Score',
    TH: 'Shareable Insights',
    TI: 'Insight Library',
  },
  
  result: 'Demokratiserad analys – vem som helst kan analysera världen korrekt.',
} as const;
