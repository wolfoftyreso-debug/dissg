/**
 * Absolute Clarity Standard
 * 
 * 🔬 ENGINEERING STANDARD FOR TRUTH PRESENTATION
 * "What does the data show?"
 * 
 * This is not ideology. This is engineering.
 */

// ============================================
// DESIGN PRINCIPLES (LOCKED)
// ============================================

export const CLARITY_DESIGN_RULES = {
  never: [
    'Icons that signal emotion',
    'Arrows up/down with color meaning',
    'Emojis of any kind',
    'Insights or recommendations',
    'Color codes implying good/bad',
    'Slogans or taglines',
    'Superlatives (best, worst, amazing)',
    'Urgency language (act now, critical)',
    'Social proof (X people viewed this)',
    'Engagement metrics',
  ],
  
  always: [
    'Black, white, grayscale, discrete blue',
    'Tables with exact values',
    'Time series with labeled axes',
    'Confidence intervals when available',
    'Exact words with precise meaning',
    'Source attribution on every data point',
    'Method documentation links',
    'Uncertainty indicators',
  ],
  
  aesthetic: {
    feelsLike: [
      'Audit tool',
      'Aircraft instrument',
      'Laboratory interface',
      'Central bank report',
      'Scientific publication',
    ],
    neverFeelsLike: [
      'News headline',
      'Marketing material',
      'Political campaign',
      'Social media post',
      'Advocacy platform',
    ],
  },
  
  // Allowed color palette (HSL values for Tailwind)
  palette: {
    primary: 'hsl(0, 0%, 0%)',      // Black - text
    secondary: 'hsl(0, 0%, 40%)',   // Dark gray - secondary text
    muted: 'hsl(0, 0%, 60%)',       // Gray - tertiary
    background: 'hsl(0, 0%, 100%)', // White - background
    accent: 'hsl(210, 50%, 40%)',   // Discrete blue - links/interactive
    border: 'hsl(0, 0%, 85%)',      // Light gray - borders
    // NO red, green, yellow for data values
  },
};

// ============================================
// FORBIDDEN LANGUAGE (Technical block)
// ============================================

export const FORBIDDEN_TERMS = {
  causal: [
    'caused', 'led to', 'resulted in', 'because of',
    'due to', 'thanks to', 'despite', 'proves',
    'demonstrates', 'shows that', 'indicates that',
    'orsakade', 'ledde till', 'berodde på', 'tack vare',
  ],
  
  normative: [
    'should', 'must', 'ought', 'better', 'worse',
    'good', 'bad', 'right', 'wrong', 'optimal',
    'borde', 'måste', 'bättre', 'sämre', 'bra', 'dålig',
  ],
  
  speculative: [
    'will', 'would', 'could lead to', 'might cause',
    'expected to', 'predicted', 'forecast',
    'kommer att', 'skulle', 'kan leda till', 'förväntas',
  ],
  
  emotive: [
    'crisis', 'disaster', 'catastrophe', 'miracle',
    'breakthrough', 'shocking', 'alarming', 'concerning',
    'kris', 'katastrof', 'mirakel', 'chockerande',
  ],
};

// Allowed replacements
export const NEUTRAL_REPLACEMENTS: Record<string, string> = {
  'caused': 'occurred alongside',
  'led to': 'was followed by',
  'resulted in': 'coincided with',
  'proves': 'is consistent with',
  'shows that': 'data indicates',
  'better': 'higher value',
  'worse': 'lower value',
  'crisis': 'deviation from baseline',
  'alarming': 'outside expected range',
  'improvement': 'increase',
  'deterioration': 'decrease',
};

// ============================================
// ANALYSIS VIEW STRUCTURE (Mandatory)
// ============================================

export interface ObservationBlock {
  type: 'observation';
  timePeriod: { start: string; end: string };
  keyIndicators: Array<{
    code: string;
    name: string;
    value: number;
    unit: string;
    source: string;
    methodology: string;
  }>;
  historicalDeviation: {
    baselinePeriod: string;
    deviationPercent: number;
    deviationAbsolute: number;
  };
  peerComparison: Array<{
    country: string;
    value: number;
    rank?: number;
  }>;
}

export interface CoMovementBlock {
  type: 'co_movement';
  correlations: Array<{
    indicatorA: string;
    indicatorB: string;
    correlation: number;
    stabilityScore: number; // 0-100
    timeLag?: number; // months
    direction: 'positive' | 'negative' | 'none';
  }>;
  whatMoved: string[];
  whatDidNotMove: string[];
}

export interface LimitationsBlock {
  type: 'limitations';
  dataGaps: string[];
  uncertainties: string[];
  alternativeExplanations: string[];
  knownBiases: string[];
  methodologyChanges: Array<{
    date: string;
    description: string;
  }>;
}

export interface MisinterpretationRiskBlock {
  type: 'misinterpretation_risk';
  commonMisbeliefs: string[];
  whatDataDoesNotSay: string[];
  requiresFurtherStudy: string[];
}

// Complete analysis structure
export interface ClarityAnalysis {
  id: string;
  topic: string;
  generatedAt: string;
  
  // MANDATORY SECTIONS
  observation: ObservationBlock;
  coMovement: CoMovementBlock;
  limitations: LimitationsBlock; // If missing → analysis blocked
  misinterpretationRisk: MisinterpretationRiskBlock; // If missing → analysis blocked
  
  // Footer (always shown)
  disclaimer: ClarityDisclaimer;
}

export interface ClarityDisclaimer {
  platformStatement: string;
  noCausalClaim: string;
  verificationMethod: string;
  lastUpdated: string;
}

// ============================================
// STANDARD DISCLAIMERS (Immutable)
// ============================================

export const STANDARD_DISCLAIMERS = {
  platformStatement: {
    en: 'This platform does not assign cause, intent, or recommendation. It presents observed data with methodology and limitations.',
    sv: 'Denna plattform tillskriver ingen orsak, avsikt eller rekommendation. Den presenterar observerad data med metodik och begränsningar.',
  },
  
  noCausalClaim: {
    en: 'Observed correlations do not establish causation. Co-movement is shown; attribution is not claimed.',
    sv: 'Observerade korrelationer fastställer inte orsakssamband. Samvariation visas; attribution görs inte.',
  },
  
  comparisonStatement: {
    en: 'Compared to historical and peer benchmarks, outcomes fall [within/outside] expected ranges.',
    sv: 'Jämfört med historiska och jämförelsegrupps-basvärden faller utfallen [inom/utanför] förväntade intervall.',
  },
  
  correlationWarning: {
    en: 'Observed correlation. No causal claim is made.',
    sv: 'Observerad korrelation. Inget orsakssamband hävdas.',
  },
  
  dataLimitation: {
    en: 'Data shown is subject to collection methodology, reporting delays, and definitional changes over time.',
    sv: 'Visad data är beroende av insamlingsmetodik, rapporteringsfördröjningar och definitionsförändringar över tid.',
  },
};

// ============================================
// TOPIC-SPECIFIC TEMPLATES
// ============================================

export const TOPIC_TEMPLATES = {
  pandemic: {
    title: {
      en: 'Observed outcomes during the COVID-19 period',
      sv: 'Observerade utfall under COVID-19-perioden',
    },
    subViews: [
      { key: 'health', name: { en: 'Health outcomes', sv: 'Hälsoutfall' } },
      { key: 'economic', name: { en: 'Economic indicators', sv: 'Ekonomiska indikatorer' } },
      { key: 'spending', name: { en: 'Public spending', sv: 'Offentliga utgifter' } },
      { key: 'excess_mortality', name: { en: 'Excess mortality', sv: 'Överdödlighet' } },
      { key: 'sector', name: { en: 'Sector-level impacts', sv: 'Sektorspåverkan' } },
    ],
    mandatoryContext: {
      en: 'Comparison to historical baselines and peer countries',
      sv: 'Jämförelse med historiska basvärden och jämförelseländer',
    },
  },
  
  diet_health: {
    title: {
      en: 'Observed patterns: nutrition and health outcomes',
      sv: 'Observerade mönster: kost och hälsoutfall',
    },
    subViews: [
      { key: 'disease', name: { en: 'Disease frequency', sv: 'Sjukdomsfrekvens' } },
      { key: 'consumption', name: { en: 'Consumption patterns', sv: 'Konsumtionsmönster' } },
      { key: 'time_lag', name: { en: 'Time-lagged correlations', sv: 'Tidsförskjutna korrelationer' } },
      { key: 'socioeconomic', name: { en: 'Socioeconomic factors', sv: 'Socioekonomiska faktorer' } },
      { key: 'industry', name: { en: 'Industry revenue trends', sv: 'Industrins intäktsutveckling' } },
    ],
    mandatoryContext: {
      en: 'Observed correlation. No causal claim is made.',
      sv: 'Observerad korrelation. Inget orsakssamband hävdas.',
    },
  },
  
  environment_energy: {
    title: {
      en: 'Observed outcomes associated with energy mix over time',
      sv: 'Observerade utfall associerade med energimix över tid',
    },
    subViews: [
      { key: 'emissions', name: { en: 'Emissions data', sv: 'Utsläppsdata' } },
      { key: 'energy_mix', name: { en: 'Energy sources', sv: 'Energikällor' } },
      { key: 'health', name: { en: 'Health outcomes', sv: 'Hälsoutfall' } },
      { key: 'climate', name: { en: 'Climate indicators', sv: 'Klimatindikatorer' } },
      { key: 'economic', name: { en: 'Economic activity', sv: 'Ekonomisk aktivitet' } },
    ],
    mandatoryContext: {
      en: 'Observed outcomes. Attribution to specific causes is not claimed.',
      sv: 'Observerade utfall. Attribution till specifika orsaker görs inte.',
    },
  },
  
  policy_outcomes: {
    title: {
      en: 'Observed indicators before and after policy implementation',
      sv: 'Observerade indikatorer före och efter policyimplementering',
    },
    subViews: [
      { key: 'before', name: { en: 'Pre-implementation baseline', sv: 'Baslinje före implementering' } },
      { key: 'during', name: { en: 'Implementation period', sv: 'Implementeringsperiod' } },
      { key: 'after', name: { en: 'Post-implementation outcomes', sv: 'Utfall efter implementering' } },
      { key: 'peer', name: { en: 'Peer comparison', sv: 'Jämförelsegruppsjämförelse' } },
      { key: 'confounders', name: { en: 'Confounding factors', sv: 'Störfaktorer' } },
    ],
    mandatoryContext: {
      en: 'Temporal correlation does not establish causation. Other factors may explain observed changes.',
      sv: 'Tidsmässig korrelation fastställer inte orsakssamband. Andra faktorer kan förklara observerade förändringar.',
    },
  },
};

// ============================================
// BENCHMARK RESPONSE TEMPLATE
// ============================================

export const BENCHMARK_RESPONSE = {
  // Never answers yes/no to "Is this reasonable?"
  template: {
    en: 'Compared to historical and peer benchmarks, outcomes fall {position} expected ranges.',
    sv: 'Jämfört med historiska och jämförelsegrupps-basvärden faller utfallen {position} förväntade intervall.',
  },
  positions: {
    within: { en: 'within', sv: 'inom' },
    outside: { en: 'outside', sv: 'utanför' },
    at_boundary: { en: 'at the boundary of', sv: 'på gränsen till' },
  },
};

// ============================================
// USER COMPREHENSION TARGET (30 seconds)
// ============================================

export const COMPREHENSION_TARGET = {
  timeLimit: 30, // seconds
  
  questionsAnswered: [
    { en: 'What do we know?', sv: 'Vad vet vi?' },
    { en: 'What do we NOT know?', sv: 'Vad vet vi INTE?' },
    { en: 'How does this compare historically?', sv: 'Hur förhåller sig detta historiskt?' },
    { en: 'How does this compare to peers?', sv: 'Hur förhåller sig detta jämfört med andra?' },
    { en: 'What cannot be said with integrity?', sv: 'Vad kan inte sägas med hederlighet?' },
  ],
  
  without: [
    'Platform taking a position',
    'System making recommendations',
    'Content that can be called biased',
    'Language that can be weaponized',
  ],
};

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate that analysis has all mandatory sections
 */
export function validateAnalysisCompleteness(analysis: Partial<ClarityAnalysis>): {
  isValid: boolean;
  missingBlocks: string[];
} {
  const required = ['observation', 'coMovement', 'limitations', 'misinterpretationRisk'];
  const missing = required.filter(key => !(analysis as Record<string, unknown>)[key]);
  
  return {
    isValid: missing.length === 0,
    missingBlocks: missing,
  };
}

/**
 * Check text for forbidden terms
 */
export function scanForForbiddenTerms(text: string): {
  hasForbidden: boolean;
  found: string[];
  category: string[];
} {
  const found: string[] = [];
  const categories: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const [category, terms] of Object.entries(FORBIDDEN_TERMS)) {
    for (const term of terms) {
      if (lowerText.includes(term.toLowerCase())) {
        found.push(term);
        categories.push(category);
      }
    }
  }
  
  return {
    hasForbidden: found.length > 0,
    found: [...new Set(found)],
    category: [...new Set(categories)],
  };
}

/**
 * Get neutral replacement for forbidden term
 */
export function getNeutralReplacement(term: string): string | null {
  return NEUTRAL_REPLACEMENTS[term.toLowerCase()] || null;
}
