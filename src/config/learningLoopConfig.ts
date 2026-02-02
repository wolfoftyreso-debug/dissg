/**
 * WAVE 14 — BLOCK DI, DJ, DK
 * AUTO-CONTEXT, LEARNING LOOP & INSIGHT LIFECYCLE
 * 
 * Systemet hittar samband, lär sig av användning och hanterar insikters livscykel.
 */

// ============================================
// BLOCK DI: AUTO-CONTEXT & RELATION DISCOVERY
// ============================================

export type RelationType = 
  | 'correlation'
  | 'lagged_correlation'
  | 'multi_factor'
  | 'inverse'
  | 'threshold_triggered';

export interface DiscoveredRelation {
  id: string;
  type: RelationType;
  sourceKpis: string[];
  targetKpi: string;
  strength: number; // 0-1
  lagMonths: number | null;
  confidence: number;
  sampleSize: number;
  periodStart: string;
  periodEnd: string;
  discoveredAt: string;
  status: 'discovered' | 'testing' | 'verified' | 'rejected' | 'archived';
  verificationAttempts: number;
  
  // Transparency requirements
  disclaimer: string;
  limitations: string[];
  alternativeExplanations: string[];
}

export const RELATION_DISCOVERY_CONFIG = {
  types: {
    correlation: {
      name: 'Korrelation',
      description: 'Samtidig rörelse',
      minStrength: 0.5,
      minSampleSize: 30,
    },
    lagged_correlation: {
      name: 'Laggad korrelation',
      description: 'Fördröjd påverkan',
      maxLagMonths: 36,
      minStrength: 0.4,
    },
    multi_factor: {
      name: 'Multipla faktorer',
      description: 'Flera indikatorer påverkar tillsammans',
      maxFactors: 5,
      minCombinedExplanation: 0.6,
    },
    inverse: {
      name: 'Invers relation',
      description: 'Motsatt rörelse',
      minStrength: -0.5,
    },
    threshold_triggered: {
      name: 'Tröskelutlöst',
      description: 'Effekt aktiveras vid viss nivå',
      requiresThreshold: true,
    },
  },
  
  mandatoryDisclaimer: 'Upptäckt av systemet – ej verifierat.',
  
  verificationRequirements: {
    minReplications: 3,
    differentTimePeriods: true,
    differentGeographies: true,
    robustnessCheck: true,
  },
} as const;

// ============================================
// BLOCK DJ: CONTINUOUS LEARNING LOOP
// ============================================

export type UserSignalType = 
  | 'reuse'
  | 'question'
  | 'replicate'
  | 'ignore'
  | 'share'
  | 'export'
  | 'drill_down'
  | 'compare';

export interface UserBehaviorSignal {
  signalType: UserSignalType;
  entityType: 'kpi' | 'observation' | 'analysis' | 'comparison';
  entityId: string;
  timestamp: string;
  sessionId: string; // Anonymized
  context: {
    userRole?: string;
    geographic?: string;
    domain?: string;
  };
}

export interface LearningInsight {
  id: string;
  pattern: string;
  confidence: number;
  sampleSize: number;
  actionTaken: 'boost_priority' | 'reduce_priority' | 'flag_for_review' | 'none';
  discoveredAt: string;
  isActive: boolean;
}

export const LEARNING_LOOP_CONFIG = {
  signals: {
    reuse: {
      weight: 1.0,
      description: 'Analysen återanvänds',
      interpretation: 'Hög relevans',
    },
    question: {
      weight: -0.5,
      description: 'Analysen ifrågasätts',
      interpretation: 'Behöver granskning',
    },
    replicate: {
      weight: 1.5,
      description: 'Användare replikerar analysen',
      interpretation: 'Validering önskad',
    },
    ignore: {
      weight: -0.3,
      description: 'Analysen ignoreras',
      interpretation: 'Låg relevans eller kvalitet',
    },
    share: {
      weight: 0.8,
      description: 'Analysen delas',
      interpretation: 'Externt värde',
    },
    export: {
      weight: 0.6,
      description: 'Data exporteras',
      interpretation: 'Vidare användning',
    },
    drill_down: {
      weight: 0.4,
      description: 'Djupare granskning',
      interpretation: 'Intresse för detaljer',
    },
    compare: {
      weight: 0.5,
      description: 'Jämförelse med annat',
      interpretation: 'Kontextsökande',
    },
  },
  
  privacyPolicy: {
    anonymization: 'required',
    aggregationMinSize: 10,
    noIndividualTracking: true,
    dataRetentionDays: 90,
  },
  
  prioritizationAlgorithm: {
    baseWeight: 1.0,
    signalDecay: 0.1, // per day
    minimumSignals: 5,
  },
  
  principle: 'Användarbeteende → bättre prioritering (anonymt).',
} as const;

// ============================================
// BLOCK DK: AUTOMATED INSIGHT LIFECYCLE
// ============================================

export type InsightLifecycleStage = 
  | 'new'
  | 'tested'
  | 'stable'
  | 'fading'
  | 'archived';

export interface InsightLifecycle {
  insightId: string;
  currentStage: InsightLifecycleStage;
  stageHistory: {
    stage: InsightLifecycleStage;
    enteredAt: string;
    reason: string;
  }[];
  metrics: {
    replications: number;
    confirmations: number;
    contradictions: number;
    robustnessScore: number;
    citationCount: number;
    lastActivity: string;
  };
  transitions: {
    canAdvance: boolean;
    canFade: boolean;
    suggestedAction: string;
  };
}

export const INSIGHT_LIFECYCLE_CONFIG = {
  stages: {
    new: {
      name: 'New',
      description: 'Ny observation',
      maxDurationDays: 30,
      transitionCriteria: {
        toTested: 'Minst 1 replikation',
        toArchived: 'Motbevisad eller irrelevant',
      },
      color: 'blue',
    },
    tested: {
      name: 'Tested',
      description: 'Replikerad',
      maxDurationDays: 90,
      transitionCriteria: {
        toStable: 'Robust över tid och geografi',
        toFading: 'Förlorar stöd',
      },
      color: 'yellow',
    },
    stable: {
      name: 'Stable',
      description: 'Robust',
      maxDurationDays: null, // No limit
      transitionCriteria: {
        toFading: 'Motbevis eller förändring i mönster',
      },
      color: 'green',
    },
    fading: {
      name: 'Fading',
      description: 'Förlorar stöd',
      maxDurationDays: 60,
      transitionCriteria: {
        toArchived: 'Ingen återhämtning',
        toTested: 'Nytt stöd framkommer',
      },
      color: 'orange',
    },
    archived: {
      name: 'Archived',
      description: 'Historisk',
      maxDurationDays: null,
      transitionCriteria: {},
      color: 'gray',
    },
  },
  
  rules: {
    neverDelete: true,
    alwaysVersion: true,
    archiveAccessible: true,
    reasonRequired: true,
  },
  
  principle: 'Inget raderas. Allt versioneras.',
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

export function calculatePriorityScore(
  signals: UserBehaviorSignal[]
): number {
  const config = LEARNING_LOOP_CONFIG;
  let score = config.prioritizationAlgorithm.baseWeight;
  
  const now = Date.now();
  for (const signal of signals) {
    const signalConfig = config.signals[signal.signalType];
    const ageInDays = (now - new Date(signal.timestamp).getTime()) / (1000 * 60 * 60 * 24);
    const decayedWeight = signalConfig.weight * Math.exp(-config.prioritizationAlgorithm.signalDecay * ageInDays);
    score += decayedWeight;
  }
  
  return Math.max(0, score);
}

export function determineLifecycleTransition(
  lifecycle: InsightLifecycle
): { shouldTransition: boolean; newStage?: InsightLifecycleStage; reason?: string } {
  const { currentStage, metrics } = lifecycle;
  const stageConfig = INSIGHT_LIFECYCLE_CONFIG.stages[currentStage];
  
  // Check duration
  const lastStageEntry = lifecycle.stageHistory[lifecycle.stageHistory.length - 1];
  const daysInStage = (Date.now() - new Date(lastStageEntry.enteredAt).getTime()) / (1000 * 60 * 60 * 24);
  
  if (currentStage === 'new' && metrics.replications >= 1) {
    return { shouldTransition: true, newStage: 'tested', reason: 'Första replikationen genomförd' };
  }
  
  if (currentStage === 'tested' && metrics.robustnessScore > 0.8 && metrics.confirmations >= 3) {
    return { shouldTransition: true, newStage: 'stable', reason: 'Robust bekräftelse uppnådd' };
  }
  
  if (currentStage === 'stable' && metrics.contradictions > metrics.confirmations) {
    return { shouldTransition: true, newStage: 'fading', reason: 'Mer motbevis än bekräftelse' };
  }
  
  if (stageConfig.maxDurationDays && daysInStage > stageConfig.maxDurationDays) {
    if (currentStage === 'new') {
      return { shouldTransition: true, newStage: 'archived', reason: 'Timeout utan replikation' };
    }
    if (currentStage === 'fading') {
      return { shouldTransition: true, newStage: 'archived', reason: 'Ingen återhämtning' };
    }
  }
  
  return { shouldTransition: false };
}

export function createRelationDisclaimer(relation: DiscoveredRelation): string {
  return `${RELATION_DISCOVERY_CONFIG.mandatoryDisclaimer} ` +
    `Styrka: ${(relation.strength * 100).toFixed(0)}%. ` +
    `Baserat på ${relation.sampleSize} observationer. ` +
    `Period: ${relation.periodStart} – ${relation.periodEnd}.`;
}

export const LEARNING_LOOP_STATUS = {
  version: '14.0',
  blocks: ['DI', 'DJ', 'DK'],
  capabilities: [
    'relation_discovery',
    'user_signal_learning',
    'insight_lifecycle_management',
  ],
  privacyCompliant: true,
} as const;
