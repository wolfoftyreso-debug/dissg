/**
 * LAMBDA DECISION → OUTCOME MAPPING
 * 
 * Accountability without scapegoating
 * Causation discipline with mandatory latency
 * 
 * Core principle: "No Lambda shift is shown without linking to observable events.
 * No events are linked to Lambda without time delay and uncertainty."
 */

// =============================================================================
// RULE 1: WHAT COUNTS AS A "DECISION"
// =============================================================================

/**
 * A decision is NOT an opinion or statement.
 * A decision is a VERIFIABLE INTERVENTION that changes system conditions.
 */

export type DecisionType = 
  | 'legislation'      // Law with effective date
  | 'budget'           // Budget decision with disbursement start
  | 'tax_change'       // Tax change with billing period
  | 'regulation'       // Rule change
  | 'infrastructure'   // Major infrastructure decision
  | 'international'    // International agreement (ratification)
  | 'reform'           // Structural reform
  | 'crisis_response'; // Emergency measures

export const DECISION_TYPE_LABELS: Record<DecisionType, { sv: string; en: string }> = {
  legislation: { sv: 'Lagstiftning', en: 'Legislation' },
  budget: { sv: 'Budget', en: 'Budget' },
  tax_change: { sv: 'Skatteändring', en: 'Tax Change' },
  regulation: { sv: 'Regeländring', en: 'Regulation' },
  infrastructure: { sv: 'Infrastruktur', en: 'Infrastructure' },
  international: { sv: 'Internationellt avtal', en: 'International Agreement' },
  reform: { sv: 'Reform', en: 'Reform' },
  crisis_response: { sv: 'Krishantering', en: 'Crisis Response' },
};

// =============================================================================
// RULE 2: DECISION LIFECYCLE
// =============================================================================

export interface DecisionLifecycle {
  id: string; // Decision ID (unique)
  
  // 1. Decision date - when the decision was made
  decisionDate: string;
  
  // 2. Effective date - when the system is actually affected
  effectiveDate: string;
  
  // 3. Expected impact - which sensors are reasonably affected
  expectedSensorImpact: string[];
  
  // 4. Latency window - when effect can be measured
  latencyWindow: {
    minMonths: number;
    maxMonths: number;
  };
  
  // 5. Observed effect - actual change in sensor data
  observedEffect?: {
    sensors: string[];
    direction: 'positive' | 'negative' | 'mixed' | 'none';
    magnitude: number; // 0-1
    confidence: 'low' | 'medium' | 'high';
    observedAt: string;
  };
  
  // 6. Lambda response - aggregated system impact
  lambdaResponse?: {
    beforeValue: number;
    afterValue: number;
    change: number;
    attributionConfidence: 'low' | 'medium' | 'high';
    confoundingFactors: string[];
  };
}

// =============================================================================
// RULE 3: MANDATORY LATENCY (CRITICAL)
// =============================================================================

/**
 * The system PROHIBITS immediate causal conclusions.
 * This KILLS populism directly.
 */

export const LATENCY_RULES: Record<DecisionType, { minMonths: number; maxMonths: number; typical: number }> = {
  legislation: { minMonths: 6, maxMonths: 36, typical: 18 },
  budget: { minMonths: 3, maxMonths: 24, typical: 12 },
  tax_change: { minMonths: 6, maxMonths: 24, typical: 12 },
  regulation: { minMonths: 3, maxMonths: 18, typical: 9 },
  infrastructure: { minMonths: 24, maxMonths: 120, typical: 60 },
  international: { minMonths: 12, maxMonths: 60, typical: 36 },
  reform: { minMonths: 12, maxMonths: 180, typical: 60 }, // 5-15 years
  crisis_response: { minMonths: 1, maxMonths: 12, typical: 6 },
};

export const isEffectWindowOpen = (
  effectiveDate: string,
  decisionType: DecisionType
): boolean => {
  const effective = new Date(effectiveDate);
  const now = new Date();
  const monthsElapsed = (now.getTime() - effective.getTime()) / (1000 * 60 * 60 * 24 * 30);
  
  return monthsElapsed >= LATENCY_RULES[decisionType].minMonths;
};

export const getEffectWindowMessage = (
  effectiveDate: string,
  decisionType: DecisionType,
  language: 'sv' | 'en' = 'sv'
): string | null => {
  if (isEffectWindowOpen(effectiveDate, decisionType)) {
    return null;
  }
  
  const effective = new Date(effectiveDate);
  const now = new Date();
  const monthsElapsed = Math.floor((now.getTime() - effective.getTime()) / (1000 * 60 * 60 * 24 * 30));
  const minMonths = LATENCY_RULES[decisionType].minMonths;
  const remaining = minMonths - monthsElapsed;
  
  return language === 'sv'
    ? `Effektfönster ännu ej observerbart. Minst ${remaining} månader återstår.`
    : `Effect window not yet observable. At least ${remaining} months remaining.`;
};

// =============================================================================
// RULE 4: RESPONSIBILITY MAPPING
// =============================================================================

/**
 * System maps responsibility to:
 * - Level (municipal, regional, state)
 * - Institution (parliament, government, agency)
 * 
 * NOT to individuals primarily.
 * Person connection is secondary, optional, and always source-marked.
 */

export type ResponsibilityLevel = 'municipal' | 'regional' | 'national' | 'international';

export interface ResponsibilityMapping {
  level: ResponsibilityLevel;
  institution: string;
  institutionCode?: string;
  persons?: {
    name: string;
    role: string;
    sourceUrl: string;
  }[];
}

export const RESPONSIBILITY_LEVEL_LABELS: Record<ResponsibilityLevel, { sv: string; en: string }> = {
  municipal: { sv: 'Kommun', en: 'Municipal' },
  regional: { sv: 'Region', en: 'Regional' },
  national: { sv: 'Nationell', en: 'National' },
  international: { sv: 'Internationell', en: 'International' },
};

// =============================================================================
// RULE 5: EFFECT MEASUREMENT (NOT GUESSING)
// =============================================================================

export interface EffectMeasurement {
  // Change in relevant sensors
  sensorChanges: {
    sensorId: string;
    beforeValue: number;
    afterValue: number;
    changePercent: number;
  }[];
  
  // Comparison against control period
  controlPeriodComparison?: {
    period: string;
    expectedValue: number;
    actualValue: number;
    deviation: number;
  };
  
  // Comparison against similar regions
  peerComparison?: {
    peers: string[];
    averageChange: number;
    thisChange: number;
    deviationFromPeers: number;
  };
  
  // Statistical significance
  statisticalSignificance: {
    pValue?: number;
    confidenceInterval: [number, number];
    sampleSize: number;
  };
}

export type CorrelationConfidence = 'low' | 'medium' | 'high';

export const getCorrelationStatement = (
  confidence: CorrelationConfidence,
  language: 'sv' | 'en' = 'sv'
): string => {
  const statements = {
    low: {
      sv: 'Observerad korrelation med Lambda-förändring: låg konfidens',
      en: 'Observed correlation with Lambda change: low confidence',
    },
    medium: {
      sv: 'Observerad korrelation med Lambda-förändring: medel konfidens',
      en: 'Observed correlation with Lambda change: medium confidence',
    },
    high: {
      sv: 'Observerad korrelation med Lambda-förändring: hög konfidens',
      en: 'Observed correlation with Lambda change: high confidence',
    },
  };
  
  return statements[confidence][language];
};

// NEVER "caused" - only "correlated"

// =============================================================================
// RULE 6: CUMULATIVE EFFECTS
// =============================================================================

/**
 * Decisions are NOT assessed in isolation but CUMULATIVELY.
 * 
 * Example: 12 small decisions → 1 large Lambda shift
 * 
 * This PREVENTS scapegoating.
 */

export interface CumulativeEffect {
  periodStart: string;
  periodEnd: string;
  totalDecisions: number;
  decisionIds: string[];
  netLambdaChange: number;
  dominantDirection: 'positive' | 'negative' | 'mixed';
}

export const getCumulativeStatement = (
  effect: CumulativeEffect,
  language: 'sv' | 'en' = 'sv'
): string => {
  const years = Math.round(
    (new Date(effect.periodEnd).getTime() - new Date(effect.periodStart).getTime()) /
    (1000 * 60 * 60 * 24 * 365)
  );
  
  return language === 'sv'
    ? `Nuvarande Lambda-tillstånd reflekterar ackumulerade beslut under ${years} år (${effect.totalDecisions} beslut).`
    : `Current Lambda state reflects cumulative decisions over ${years} years (${effect.totalDecisions} decisions).`;
};

// =============================================================================
// RULE 7: LANGUAGE DISCIPLINE
// =============================================================================

/**
 * When Lambda IMPROVES (moves toward 1.0):
 * - Which sensors improved
 * - Which decisions coincide in time
 * - What uncertainty exists
 * 
 * System does NOT say: "This was the right policy."
 * System says: "System stress decreased."
 */

export const ALLOWED_IMPROVEMENT_PHRASES = {
  sv: [
    'Systemstress minskade',
    'Lambda rörde sig mot stabilitet',
    'Observerad förbättring i sensorer',
    'Positiv trend observerad',
  ],
  en: [
    'System stress decreased',
    'Lambda moved toward stability',
    'Observed improvement in sensors',
    'Positive trend observed',
  ],
};

/**
 * When Lambda WORSENS:
 * - Which sensors worsened
 * - Where stress is building up
 * - How long the trend has lasted
 * 
 * System does NOT say: "Someone did wrong."
 * System says: "The system is moving away from stability."
 */

export const ALLOWED_WORSENING_PHRASES = {
  sv: [
    'Systemet rör sig bort från stabilitet',
    'Stress byggs upp i följande sensorer',
    'Negativ trend observerad sedan [datum]',
    'Lambda avviker från jämvikt',
  ],
  en: [
    'The system is moving away from stability',
    'Stress is building up in the following sensors',
    'Negative trend observed since [date]',
    'Lambda deviates from equilibrium',
  ],
};

// =============================================================================
// RULE 8: PROTECTION RULE (CRITICAL)
// =============================================================================

/**
 * No Lambda change may be used as proof of INTENTIONS.
 * Only for OUTCOMES.
 * 
 * This protects:
 * - Democracy
 * - Research
 * - Legitimacy
 */

export const PROTECTION_DISCLAIMER = {
  sv: 'Lambda-förändringar visar observerade utfall, inte avsikter. Korrelation innebär inte orsakssamband.',
  en: 'Lambda changes show observed outcomes, not intentions. Correlation does not imply causation.',
};

// =============================================================================
// CORE INSIGHT
// =============================================================================

export const CORE_INSIGHT = {
  sv: 'Lambda gör ansvar möjligt utan att skapa syndabockar.',
  en: 'Lambda makes accountability possible without creating scapegoats.',
};
