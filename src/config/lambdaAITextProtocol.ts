/**
 * LAMBDA AI TEXT GENERATION PROTOCOL
 * 
 * "Say only what the data supports"
 * 
 * FUNDAMENTAL RULE (ABSOLUTE):
 * AI may NEVER be smarter than the data.
 * It may only be CLEARER.
 * 
 * This is the most important rule in the entire system.
 */

// =============================================================================
// RULE 2: ALLOWED vs FORBIDDEN LINGUISTIC ACTIONS
// =============================================================================

/**
 * AI MAY ONLY do the following:
 */
export const ALLOWED_ACTIONS = [
  'summarize_observed_patterns',    // Sammanfatta observerade mönster
  'describe_direction',              // Beskriva riktning (ökning/minskning/stabil)
  'indicate_magnitude',              // Ange storlek på förändring
  'point_out_drivers',               // Peka ut drivande indikatorer
  'report_uncertainty_limits',       // Redovisa osäkerhet och begränsningar
] as const;

/**
 * AI MAY NOT:
 */
export const FORBIDDEN_ACTIONS = [
  'value_judgment',         // Värdera ("bra", "dåligt")
  'moralize',               // Moralisera
  'speculate',              // Spekulera
  'recommend_actions',      // Rekommendera åtgärder
  'attribute_intentions',   // Tillskriva intentioner
] as const;

// =============================================================================
// RULE 3: MANDATORY TEXT SKELETON (7 PARTS)
// =============================================================================

/**
 * All AI texts MUST follow EXACTLY this structure.
 * No free prose allowed.
 */

export interface LambdaTextSkeleton {
  status: string;           // 1️⃣ Status
  change: string;           // 2️⃣ Change
  drivers: string[];        // 3️⃣ Drivers (list)
  timeDimension: string;    // 4️⃣ Time dimension
  comparison: string;       // 5️⃣ Comparison
  uncertainty: string;      // 6️⃣ Uncertainty
  limitation: string;       // 7️⃣ Limitation (ALWAYS REQUIRED)
}

export const TEXT_SKELETON_ORDER = [
  'status',
  'change', 
  'drivers',
  'timeDimension',
  'comparison',
  'uncertainty',
  'limitation',
] as const;

// =============================================================================
// TEMPLATES (LOCKED STRUCTURE)
// =============================================================================

export interface LambdaTextTemplates {
  sv: LambdaTextTemplateSet;
  en: LambdaTextTemplateSet;
}

export interface LambdaTextTemplateSet {
  status: string;
  change: string;
  driverItem: string;
  timeDimension: string;
  comparison: string;
  uncertaintyHigh: string;
  uncertaintyMedium: string;
  uncertaintyLow: string;
  limitation: string;
  noReliableSummary: string;
  cautionRequired: string;
}

export const TEMPLATES: LambdaTextTemplates = {
  en: {
    status: 'Lambda for {scope} during {period} was {value} ± {uncertainty}, indicating a {trend} system balance.',
    change: 'Compared to {previousPeriod}, Lambda changed by {delta}, primarily driven by:',
    driverItem: '• {indicator}: {direction} of {magnitude}',
    timeDimension: 'These changes became observable from {observableFrom}, consistent with expected latency.',
    comparison: 'Relative to comparable entities, {scope} is positioned {position} the median.',
    uncertaintyHigh: 'Data coverage is low, with uncertainty primarily related to {factor}.',
    uncertaintyMedium: 'Data coverage is moderate, with some uncertainty related to {factor}.',
    uncertaintyLow: 'Data coverage is high. Uncertainty margins are within acceptable ranges.',
    limitation: 'This summary does not assess causality or policy effectiveness.',
    noReliableSummary: 'No reliable summary can be produced for this period due to insufficient data coverage.',
    cautionRequired: 'Interpretation should be cautious due to elevated uncertainty.',
  },
  sv: {
    status: 'Lambda för {scope} under {period} var {value} ± {uncertainty}, vilket indikerar en {trend} systembalans.',
    change: 'Jämfört med {previousPeriod} förändrades Lambda med {delta}, primärt drivet av:',
    driverItem: '• {indicator}: {direction} på {magnitude}',
    timeDimension: 'Dessa förändringar blev observerbara från {observableFrom}, i linje med förväntad latens.',
    comparison: 'Relativt jämförbara enheter är {scope} positionerat {position} medianen.',
    uncertaintyHigh: 'Datatäckningen är låg, med osäkerhet primärt relaterad till {factor}.',
    uncertaintyMedium: 'Datatäckningen är måttlig, med viss osäkerhet relaterad till {factor}.',
    uncertaintyLow: 'Datatäckningen är hög. Osäkerhetsmarginaler är inom acceptabla intervall.',
    limitation: 'Denna sammanfattning bedömer inte kausalitet eller politisk effektivitet.',
    noReliableSummary: 'Ingen tillförlitlig sammanfattning kan produceras för denna period på grund av otillräcklig datatäckning.',
    cautionRequired: 'Tolkning bör ske med försiktighet på grund av förhöjd osäkerhet.',
  },
};

// =============================================================================
// RULE 4: LANGUAGE RESTRICTIONS (HARD LOCKED)
// =============================================================================

/**
 * AI may NEVER use these patterns.
 */

// Forbidden superlatives
export const FORBIDDEN_SUPERLATIVES = [
  // English
  'extreme', 'catastrophic', 'fantastic', 'amazing', 'incredible',
  'unprecedented', 'historic', 'massive', 'enormous', 'terrible',
  'wonderful', 'perfect', 'disaster', 'crisis', 'collapse',
  // Swedish
  'extrem', 'katastrofal', 'fantastisk', 'otrolig', 'historisk',
  'massiv', 'enorm', 'fruktansvärd', 'underbar', 'perfekt',
  'katastrof', 'kris', 'kollaps',
];

// Forbidden value words
export const FORBIDDEN_VALUE_WORDS = [
  // English
  'failure', 'success', 'good', 'bad', 'wrong', 'right',
  'better', 'worse', 'best', 'worst', 'excellent', 'poor',
  'positive', 'negative', // when used as value judgment
  // Swedish
  'misslyckande', 'framgång', 'bra', 'dålig', 'fel', 'rätt',
  'bättre', 'sämre', 'bäst', 'sämst', 'utmärkt', 'usel',
];

// Forbidden personification patterns
export const FORBIDDEN_PERSONIFICATION = [
  // English
  /the government (wanted|felt|believed|thought|hoped|feared)/i,
  /the people (wanted|felt|believed|thought|hoped|feared)/i,
  /citizens (wanted|felt|believed|thought|hoped|feared)/i,
  /society (wants|feels|believes|thinks|hopes|fears)/i,
  // Swedish
  /regeringen (ville|kände|trodde|tänkte|hoppades|fruktade)/i,
  /folket (ville|kände|trodde|tänkte|hoppades|fruktade)/i,
  /medborgarna (ville|kände|trodde|tänkte|hoppades|fruktade)/i,
  /samhället (vill|känner|tror|tänker|hoppas|fruktar)/i,
];

// Forbidden future promises
export const FORBIDDEN_FUTURE_PATTERNS = [
  /will (definitely|certainly|surely|inevitably)/i,
  /is going to (definitely|certainly|surely|inevitably)/i,
  /kommer (definitivt|säkert|oundvikligen)/i,
  /ska (definitivt|säkert|oundvikligen)/i,
];

// Forbidden causal claims
export const FORBIDDEN_CAUSAL_CLAIMS = [
  /caused by/i,
  /resulted in/i,
  /led to/i,
  /because of/i,
  /due to the decision/i,
  /orsakade/i,
  /resulterade i/i,
  /ledde till/i,
  /på grund av beslutet/i,
];

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

export interface ValidationResult {
  isValid: boolean;
  violations: ValidationViolation[];
}

export interface ValidationViolation {
  type: 'superlative' | 'value_word' | 'personification' | 'future_promise' | 'causal_claim' | 'missing_section' | 'uncertainty_missing';
  details: string;
  severity: 'block' | 'warning';
}

export const validateText = (text: string): ValidationResult => {
  const violations: ValidationViolation[] = [];
  const lowerText = text.toLowerCase();

  // Check superlatives
  for (const word of FORBIDDEN_SUPERLATIVES) {
    if (lowerText.includes(word.toLowerCase())) {
      violations.push({
        type: 'superlative',
        details: `Forbidden superlative: "${word}"`,
        severity: 'block',
      });
    }
  }

  // Check value words
  for (const word of FORBIDDEN_VALUE_WORDS) {
    if (lowerText.includes(word.toLowerCase())) {
      violations.push({
        type: 'value_word',
        details: `Forbidden value word: "${word}"`,
        severity: 'block',
      });
    }
  }

  // Check personification patterns
  for (const pattern of FORBIDDEN_PERSONIFICATION) {
    if (pattern.test(text)) {
      violations.push({
        type: 'personification',
        details: `Forbidden personification pattern detected`,
        severity: 'block',
      });
    }
  }

  // Check future promises
  for (const pattern of FORBIDDEN_FUTURE_PATTERNS) {
    if (pattern.test(text)) {
      violations.push({
        type: 'future_promise',
        details: `Forbidden future promise pattern detected`,
        severity: 'block',
      });
    }
  }

  // Check causal claims
  for (const pattern of FORBIDDEN_CAUSAL_CLAIMS) {
    if (pattern.test(text)) {
      violations.push({
        type: 'causal_claim',
        details: `Forbidden causal claim detected`,
        severity: 'block',
      });
    }
  }

  return {
    isValid: violations.filter(v => v.severity === 'block').length === 0,
    violations,
  };
};

// =============================================================================
// RULE 5: UNCERTAINTY THRESHOLDS
// =============================================================================

export const UNCERTAINTY_THRESHOLDS = {
  low: 0.02,     // ± 0.02 or less
  medium: 0.05,  // ± 0.02-0.05
  high: 0.10,    // ± 0.05-0.10
  unreliable: 0.15, // ± 0.10+ → no summary
} as const;

export const getUncertaintyLevel = (uncertainty: number): 'low' | 'medium' | 'high' | 'unreliable' => {
  if (uncertainty <= UNCERTAINTY_THRESHOLDS.low) return 'low';
  if (uncertainty <= UNCERTAINTY_THRESHOLDS.medium) return 'medium';
  if (uncertainty <= UNCERTAINTY_THRESHOLDS.high) return 'high';
  return 'unreliable';
};

// =============================================================================
// RULE 7: AI-TO-AI STRUCTURED OUTPUT
// =============================================================================

export interface StructuredLambdaOutput {
  version: string;
  generatedAt: string;
  scope: string;
  period: string;
  lambda: {
    value: number;
    uncertainty: number;
    trend: 'stable' | 'declining' | 'improving';
  };
  drivers: {
    indicatorId: string;
    indicatorName: string;
    direction: 'increase' | 'decrease';
    magnitude: number;
  }[];
  comparison: {
    medianPosition: 'above' | 'below' | 'near';
    peerGroup: string;
  };
  uncertainty: {
    level: 'low' | 'medium' | 'high';
    primaryFactor: string;
  };
  textSummary: LambdaTextSkeleton;
  validation: ValidationResult;
  citations: {
    indicatorId: string;
    sourceId: string;
    timestamp: string;
  }[];
}

// =============================================================================
// RULE 8: SELF-CHECK BEFORE PUBLISHING
// =============================================================================

export interface PrePublishCheck {
  hasDataSupport: boolean;
  allWordsNeutral: boolean;
  uncertaintyMentioned: boolean;
  canBeMisunderstood: boolean;
  structureFollowed: boolean;
}

export const runPrePublishChecks = (
  text: string,
  skeleton: LambdaTextSkeleton
): PrePublishCheck => {
  const validation = validateText(text);
  
  return {
    hasDataSupport: true, // Would check against actual data
    allWordsNeutral: validation.violations.filter(v => 
      v.type === 'superlative' || v.type === 'value_word'
    ).length === 0,
    uncertaintyMentioned: skeleton.uncertainty.length > 0,
    canBeMisunderstood: validation.violations.length > 0,
    structureFollowed: TEXT_SKELETON_ORDER.every(section => 
      skeleton[section] !== undefined && skeleton[section] !== ''
    ),
  };
};

export const canPublish = (checks: PrePublishCheck): boolean => {
  return (
    checks.hasDataSupport &&
    checks.allWordsNeutral &&
    checks.uncertaintyMentioned &&
    !checks.canBeMisunderstood &&
    checks.structureFollowed
  );
};

// =============================================================================
// RULE 4 RESPONSE: VALUE JUDGMENT DEFLECTION
// =============================================================================

export const VALUE_JUDGMENT_RESPONSE = {
  sv: 'Lambda beskriver systembalans, inte värdeomdömen.',
  en: 'Lambda describes system balance, not value judgments.',
};

// =============================================================================
// CORE PRINCIPLE
// =============================================================================

export const AI_TEXT_DOCTRINE = {
  sv: 'AI är här för att reducera brus – inte skapa mening. Mening skapas av människor.',
  en: 'AI is here to reduce noise – not to create meaning. Meaning is created by humans.',
};

export const FUNDAMENTAL_RULE = {
  sv: 'AI får aldrig vara smartare än datan. Den får bara vara tydligare.',
  en: 'AI may never be smarter than the data. It may only be clearer.',
};
