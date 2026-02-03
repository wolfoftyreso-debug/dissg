/**
 * LAMBDA VISUALIZATION RULES
 * 
 * "Never lie with graphs"
 * 
 * These rules are ABSOLUTE. No exceptions.
 */

// =============================================================================
// RULE 1: COLOR SYSTEM (LOCKED)
// =============================================================================

export const LAMBDA_COLORS = {
  // Status colors - NOT value judgments
  stable: {
    range: [0.90, 1.10],
    color: 'hsl(var(--primary))',
    label: { sv: 'Stabilt', en: 'Stable' },
  },
  warningLow: {
    range: [0.85, 0.90],
    color: 'hsl(35, 92%, 50%)', // Warning orange
    label: { sv: 'Förhöjd stress', en: 'Elevated stress' },
  },
  criticalLow: {
    range: [0, 0.85],
    color: 'hsl(0, 72%, 51%)', // Critical red
    label: { sv: 'Kritisk zon', en: 'Critical zone' },
  },
  warningHigh: {
    range: [1.10, 1.15],
    color: 'hsl(280, 70%, 55%)', // Warning purple
    label: { sv: 'Resursstress', en: 'Resource stress' },
  },
  criticalHigh: {
    range: [1.15, 2.0],
    color: 'hsl(280, 80%, 40%)', // Critical violet
    label: { sv: 'Kritisk resursstress', en: 'Critical resource stress' },
  },
} as const;

// ❗ NO GREEN "GOOD" COLORS
// ❗ NO RED "EVIL" COLORS
// This is STATUS, not GRADE.

export const getLambdaColor = (value: number): string => {
  if (value < 0.85) return LAMBDA_COLORS.criticalLow.color;
  if (value < 0.90) return LAMBDA_COLORS.warningLow.color;
  if (value <= 1.10) return LAMBDA_COLORS.stable.color;
  if (value <= 1.15) return LAMBDA_COLORS.warningHigh.color;
  return LAMBDA_COLORS.criticalHigh.color;
};

export const getLambdaStatus = (value: number, language: 'sv' | 'en' = 'sv'): string => {
  if (value < 0.85) return LAMBDA_COLORS.criticalLow.label[language];
  if (value < 0.90) return LAMBDA_COLORS.warningLow.label[language];
  if (value <= 1.10) return LAMBDA_COLORS.stable.label[language];
  if (value <= 1.15) return LAMBDA_COLORS.warningHigh.label[language];
  return LAMBDA_COLORS.criticalHigh.label[language];
};

// =============================================================================
// RULE 2: UNCERTAINTY REQUIREMENTS
// =============================================================================

export interface LambdaValueWithUncertainty {
  value: number;
  uncertainty: number; // ± value
  confidence: number; // 0-1
  dataCoverage: number; // 0-1
}

export const formatLambdaValue = (data: LambdaValueWithUncertainty): string => {
  return `λ = ${data.value.toFixed(2)} ± ${data.uncertainty.toFixed(2)}`;
};

// If uncertainty is missing, the graph MUST NOT be shown
export const canShowLambda = (data: Partial<LambdaValueWithUncertainty>): boolean => {
  return (
    typeof data.value === 'number' &&
    typeof data.uncertainty === 'number' &&
    data.uncertainty > 0
  );
};

// =============================================================================
// RULE 3: TIMELINE MARKERS (Policy Decisions)
// =============================================================================

export interface PolicyMarker {
  date: string;
  title: string;
  type: 'reform' | 'budget' | 'law' | 'crisis' | 'election';
  sourceUrl?: string;
  responsibleEntity?: string;
}

export const POLICY_MARKER_STYLES = {
  reform: { color: 'hsl(var(--primary))', icon: '📋' },
  budget: { color: 'hsl(var(--secondary))', icon: '💰' },
  law: { color: 'hsl(var(--muted-foreground))', icon: '⚖️' },
  crisis: { color: 'hsl(35, 92%, 50%)', icon: '⚠️' },
  election: { color: 'hsl(var(--primary))', icon: '🗳️' },
} as const;

// =============================================================================
// RULE 4: CHART RESTRICTIONS
// =============================================================================

export const CHART_RULES = {
  // Bar charts: ONLY allowed if...
  barChart: {
    requiresContemporaryComparison: true,
    requiresAbsoluteScale: true,
    requiresAllDataPoints: true,
    barsWithoutHistory: 'FORBIDDEN',
  },
  
  // Timelines
  timeline: {
    truncatedYAxis: 'FORBIDDEN',
    mustShowPolicyMarkers: true,
    mustShowUncertaintyBand: true,
  },
  
  // Spider/Radar charts
  spiderChart: 'FORBIDDEN', // Too misleading
  
  // Pie charts
  pieChart: 'FORBIDDEN', // Comparison distortion
  
  // 3D charts
  threeDChart: 'FORBIDDEN', // Always misleading
  
  // Dual Y-axis
  dualYAxis: 'FORBIDDEN', // Correlation confusion
};

// =============================================================================
// RULE 5: SENSOR BREAKDOWN DISPLAY
// =============================================================================

export const SENSOR_CATEGORIES = [
  { id: 'health', name: { sv: 'Hälsa', en: 'Health' }, icon: '🏥' },
  { id: 'economy', name: { sv: 'Ekonomi', en: 'Economy' }, icon: '📊' },
  { id: 'energy', name: { sv: 'Energi', en: 'Energy' }, icon: '⚡' },
  { id: 'safety', name: { sv: 'Trygghet', en: 'Safety' }, icon: '🛡️' },
  { id: 'housing', name: { sv: 'Bostäder', en: 'Housing' }, icon: '🏠' },
  { id: 'demographics', name: { sv: 'Demografi', en: 'Demographics' }, icon: '👥' },
  { id: 'environment', name: { sv: 'Miljö', en: 'Environment' }, icon: '🌍' },
] as const;

// Display: Parallel horizontal bars with SAME SCALE (not spider chart)

// =============================================================================
// RULE 6: LAMBDA CHANGE EXPLANATION
// =============================================================================

export interface LambdaChangeExplanation {
  direction: 'increase' | 'decrease' | 'stable';
  magnitude: number; // absolute change
  primaryFactors: string[];
  // NO interpretation - only correlation
}

// Required when change > ±0.02
export const CHANGE_THRESHOLD = 0.02;

// =============================================================================
// RULE 7: COMPARISON WARNINGS
// =============================================================================

export interface ComparisonValidity {
  sameTimePeriod: boolean;
  sameIndicators: boolean;
  sameWeighting: boolean;
  dataCoverageDifference: number; // percentage
}

export const getComparisonWarning = (
  validity: ComparisonValidity,
  language: 'sv' | 'en' = 'sv'
): string | null => {
  if (!validity.sameTimePeriod || !validity.sameIndicators || !validity.sameWeighting) {
    return language === 'sv'
      ? 'Jämförelse begränsad av skillnader i datatäckning.'
      : 'Comparison limited by data coverage differences.';
  }
  if (validity.dataCoverageDifference > 10) {
    return language === 'sv'
      ? `Datatäckning skiljer sig med ${validity.dataCoverageDifference.toFixed(0)}%.`
      : `Data coverage differs by ${validity.dataCoverageDifference.toFixed(0)}%.`;
  }
  return null;
};

// =============================================================================
// RULE 8: MAP RESTRICTIONS
// =============================================================================

export const MAP_RULES = {
  showExactValues: false, // Only zones
  exactValuesRequireClick: true,
  allowedDisplay: 'rough Lambda zone only',
  
  // Prevents: simplification, political misuse, map propaganda
};

// =============================================================================
// RULE 9: ANIMATION RULES (STRICT)
// =============================================================================

export const ANIMATION_RULES_VIZ = {
  allowed: [
    'slow timeline zoom',
    'fade-in of data points',
    'smooth transitions (150-300ms)',
  ],
  
  forbidden: [
    'bounce',
    'pulse',
    'celebration effects',
    'dramatic reveals',
    'confetti',
    'glow effects',
  ],
  
  // This is INSTRUMENT PANEL, not GAME
  maxDuration: 300, // ms
  easing: 'ease-out',
};

// =============================================================================
// RULE 10: TRANSPARENCY REQUIREMENTS
// =============================================================================

export const TRANSPARENCY_REQUIREMENTS = {
  everyGraphMustHave: [
    'How this is calculated (button)',
    'Indicator list',
    'Weighting',
    'Method version',
    'Data sources',
    'Last updated timestamp',
  ],
  
  // No black box. NEVER.
};

// =============================================================================
// RULE 11: CORE PRINCIPLE
// =============================================================================

export const VISUALIZATION_DOCTRINE = {
  sv: 'En graf får aldrig säga mer än datan vet – och aldrig mindre än datan kräver.',
  en: 'A graph must never say more than the data knows – and never less than the data requires.',
};

export const SUCCESS_CRITERION = {
  sv: 'En bra Lambda-graf ska göra att användaren säger: "Jag förstår – även om jag inte gillar vad jag ser."',
  en: 'A good Lambda graph should make the user say: "I understand – even if I don\'t like what I see."',
};
