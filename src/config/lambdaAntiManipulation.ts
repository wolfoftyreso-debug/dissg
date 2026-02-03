/**
 * LAMBDA ANTI-MANIPULATION FRAMEWORK
 * 
 * "If it can be abused, it will be – unless you design against it"
 * 
 * AXIOM: All data that affects power will be attempted to be manipulated.
 * This is not cynicism. It is systems engineering realism.
 * 
 * Protection must be: BUILT-IN, AUTOMATIC, IMPOSSIBLE TO CIRCUMVENT WITHOUT VISIBILITY
 */

// =============================================================================
// RULE 1: CHERRY-PICKING LOCK
// =============================================================================

/**
 * No Lambda view may be shown without the ENTIRE relevant sensor package.
 * Partial views are allowed, but NEVER without context marking.
 */

export interface PartialViewWarning {
  isPartial: boolean;
  missingSensors: string[];
  totalSensors: number;
  visibleSensors: number;
  coveragePercent: number;
}

export const CHERRY_PICKING_THRESHOLD = 0.7; // Must show at least 70% of sensors

export const getPartialViewWarning = (
  warning: PartialViewWarning,
  language: 'sv' | 'en' = 'sv'
): string | null => {
  if (!warning.isPartial) return null;
  
  return language === 'sv'
    ? `Partiell vy – representerar endast ${warning.coveragePercent.toFixed(0)}% av systemtillståndet. ${warning.missingSensors.length} sensorer döljs.`
    : `Partial view – represents only ${warning.coveragePercent.toFixed(0)}% of system state. ${warning.missingSensors.length} sensors hidden.`;
};

export const PARTIAL_VIEW_DISCLAIMER = {
  sv: 'Partiell vy – ej representativ för systemtillstånd.',
  en: 'Partial view – not representative of system state.',
};

// =============================================================================
// RULE 2: TIME WINDOW INTEGRITY
// =============================================================================

/**
 * Manipulation often happens via:
 * - Short periods
 * - Odd start/end dates
 * 
 * Default = standardized intervals (1y, 5y, 10y)
 * Deviating intervals require: warning + visual marking
 */

export const STANDARD_TIME_WINDOWS = [
  { months: 12, label: { sv: '1 år', en: '1 year' } },
  { months: 36, label: { sv: '3 år', en: '3 years' } },
  { months: 60, label: { sv: '5 år', en: '5 years' } },
  { months: 120, label: { sv: '10 år', en: '10 years' } },
  { months: 240, label: { sv: '20 år', en: '20 years' } },
] as const;

export interface TimeWindowValidation {
  isStandard: boolean;
  selectedMonths: number;
  nearestStandard: number;
  deviationPercent: number;
}

export const validateTimeWindow = (startDate: string, endDate: string): TimeWindowValidation => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const months = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
  
  const nearestStandard = STANDARD_TIME_WINDOWS.reduce((prev, curr) => 
    Math.abs(curr.months - months) < Math.abs(prev.months - months) ? curr : prev
  ).months;
  
  const isStandard = STANDARD_TIME_WINDOWS.some(w => w.months === months);
  const deviationPercent = Math.abs(months - nearestStandard) / nearestStandard * 100;
  
  return {
    isStandard,
    selectedMonths: months,
    nearestStandard,
    deviationPercent,
  };
};

export const TIME_WINDOW_WARNING = {
  sv: 'Anpassat tidsintervall valt. Tolka med försiktighet.',
  en: 'Custom time window selected. Interpret with caution.',
};

// =============================================================================
// RULE 3: TRANSPARENCY REQUIREMENTS (No Hidden Normalization)
// =============================================================================

/**
 * Every graph, every number, every Lambda value MUST have:
 * - "How calculated" link
 * - List of indicators
 * - Weighting
 * - Method version
 * 
 * If something is missing: THE GRAPH IS NOT SHOWN.
 */

export interface TransparencyRequirements {
  hasCalculationMethod: boolean;
  hasIndicatorList: boolean;
  hasWeighting: boolean;
  hasMethodVersion: boolean;
  hasDataSources: boolean;
  hasLastUpdated: boolean;
  hasUncertainty: boolean;
}

export const checkTransparency = (req: TransparencyRequirements): { valid: boolean; missing: string[] } => {
  const missing: string[] = [];
  
  if (!req.hasCalculationMethod) missing.push('calculation_method');
  if (!req.hasIndicatorList) missing.push('indicator_list');
  if (!req.hasWeighting) missing.push('weighting');
  if (!req.hasMethodVersion) missing.push('method_version');
  if (!req.hasDataSources) missing.push('data_sources');
  if (!req.hasLastUpdated) missing.push('last_updated');
  if (!req.hasUncertainty) missing.push('uncertainty');
  
  return { valid: missing.length === 0, missing };
};

export const TRANSPARENCY_BLOCK_MESSAGE = {
  sv: 'Visualisering blockerad: transparenskrav ej uppfyllda.',
  en: 'Visualization blocked: transparency requirements not met.',
};

// =============================================================================
// RULE 4: FALSE COMPARISON GUARD
// =============================================================================

/**
 * System automatically BLOCKS comparisons that have:
 * - Different data coverage
 * - Different method versions
 * - Different latency windows
 */

export interface ComparisonValidation {
  isValid: boolean;
  issues: ComparisonIssue[];
}

export type ComparisonIssue = 
  | 'coverage_mismatch'
  | 'method_version_mismatch'
  | 'latency_window_mismatch'
  | 'time_period_mismatch'
  | 'indicator_set_mismatch';

export const COMPARISON_ISSUE_LABELS: Record<ComparisonIssue, { sv: string; en: string }> = {
  coverage_mismatch: { sv: 'Olika datatäckning', en: 'Coverage mismatch' },
  method_version_mismatch: { sv: 'Olika metodversioner', en: 'Method version mismatch' },
  latency_window_mismatch: { sv: 'Olika latensfönster', en: 'Latency window mismatch' },
  time_period_mismatch: { sv: 'Olika tidsperioder', en: 'Time period mismatch' },
  indicator_set_mismatch: { sv: 'Olika indikatoruppsättning', en: 'Indicator set mismatch' },
};

export const COMPARISON_BLOCKED_MESSAGE = {
  sv: 'Jämförelse ogiltig på grund av metodologisk skillnad.',
  en: 'Comparison invalid due to methodological mismatch.',
};

// =============================================================================
// RULE 5: ANTI-NARRATIVE PROTECTION
// =============================================================================

/**
 * System FORBIDS:
 * - Value words in headings
 * - "catastrophe", "success", "fiasco"
 * - Emojis
 * - Color coding that implies morality
 * 
 * All presentation is: NEUTRAL, TECHNICAL, FACTUAL
 */

export const FORBIDDEN_WORDS = [
  // Swedish
  'katastrof', 'succé', 'fiasko', 'triumf', 'kris', 'kollaps', 'mirakel',
  'fantastisk', 'fruktansvärd', 'underbar', 'hemsk', 'perfekt', 'värdelös',
  'bäst', 'sämst', 'vinnare', 'förlorare', 'hjälte', 'skurk',
  // English
  'catastrophe', 'success', 'fiasco', 'triumph', 'crisis', 'collapse', 'miracle',
  'fantastic', 'terrible', 'wonderful', 'horrible', 'perfect', 'worthless',
  'best', 'worst', 'winner', 'loser', 'hero', 'villain',
];

export const FORBIDDEN_PATTERNS = [
  /🎉|🎊|💀|😱|🔥|💥|✨|⭐|❌|✅|👍|👎/u, // Emojis
  /!{2,}/,  // Multiple exclamation marks
  /\?{2,}/, // Multiple question marks
];

export const validateNarrative = (text: string): { valid: boolean; issues: string[] } => {
  const issues: string[] = [];
  const lowerText = text.toLowerCase();
  
  // Check forbidden words
  for (const word of FORBIDDEN_WORDS) {
    if (lowerText.includes(word.toLowerCase())) {
      issues.push(`forbidden_word:${word}`);
    }
  }
  
  // Check forbidden patterns
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(text)) {
      issues.push(`forbidden_pattern:${pattern.source}`);
    }
  }
  
  return { valid: issues.length === 0, issues };
};

export const NARRATIVE_DISCLAIMER = {
  sv: 'Narrativ skapas av användaren – systemet bekräftar det inte.',
  en: 'Narrative is created by the user – the system does not confirm it.',
};

// =============================================================================
// RULE 6: AUDIT TRAIL (Version & Revision)
// =============================================================================

/**
 * Every Lambda value has:
 * - Version ID
 * - Calculation date
 * - Which data changed since previous version
 * - Why the change occurred
 */

export interface AuditRecord {
  versionId: string;
  calculatedAt: string;
  previousVersionId: string | null;
  changedIndicators: string[];
  changeReason: string;
  methodVersion: string;
  checksumSha256: string;
}

export const generateVersionId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `λ-${timestamp}-${random}`.toUpperCase();
};

// =============================================================================
// RULE 7: "EXPLAIN THE MOVE" REQUIREMENT
// =============================================================================

/**
 * Every Lambda change > ±0.02 requires automatically:
 * - Sensor explanation
 * - Time explanation
 * - Uncertainty explanation
 * 
 * If this cannot be generated: Lambda change is marked as "inconclusive"
 */

export const EXPLAIN_MOVE_THRESHOLD = 0.02;

export interface MoveExplanation {
  magnitude: number;
  direction: 'increase' | 'decrease';
  sensorContributions: { sensorId: string; contribution: number }[];
  timePeriod: string;
  uncertainty: number;
  isConclusive: boolean;
}

export const validateMoveExplanation = (explanation: MoveExplanation): boolean => {
  return (
    explanation.sensorContributions.length > 0 &&
    explanation.timePeriod.length > 0 &&
    explanation.uncertainty >= 0
  );
};

export const INCONCLUSIVE_MESSAGE = {
  sv: 'Lambda-förändring markerad som icke-slutgiltig (otillräcklig data för förklaring).',
  en: 'Lambda change marked as inconclusive (insufficient data for explanation).',
};

// =============================================================================
// RULE 8: NO INDIVIDUAL SCAPEGOATS
// =============================================================================

/**
 * System:
 * - Links to INSTITUTIONS, not individuals as default
 * - Person connection requires:
 *   - Public role
 *   - Verified source
 *   - Clear time connection
 */

export interface PersonMentionRequirements {
  hasPublicRole: boolean;
  hasVerifiedSource: boolean;
  hasTimeConnection: boolean;
  sourceUrl?: string;
}

export const canMentionPerson = (req: PersonMentionRequirements): boolean => {
  return req.hasPublicRole && req.hasVerifiedSource && req.hasTimeConnection;
};

export const SCAPEGOAT_PROTECTION = {
  sv: 'Ansvar kopplas till institutioner. Personkoppling kräver verifierad offentlig roll.',
  en: 'Responsibility is linked to institutions. Person connection requires verified public role.',
};

// =============================================================================
// RULE 9: GLOBAL CONSISTENCY RULE
// =============================================================================

/**
 * Same question + same data = SAME ANSWER.
 * 
 * Regardless of:
 * - Country
 * - Language
 * - User
 * - Political context
 * 
 * If two answers differ: System error → block → revision
 */

export interface ConsistencyCheck {
  queryHash: string;
  dataHash: string;
  resultHash: string;
  timestamp: string;
}

export const generateQueryHash = (query: object): string => {
  // Simplified hash - in production use SHA-256
  return btoa(JSON.stringify(query)).substring(0, 16);
};

export const CONSISTENCY_VIOLATION = {
  sv: 'Konsistensfel upptäckt. Vy blockerad för revision.',
  en: 'Consistency violation detected. View blocked for revision.',
};

// =============================================================================
// RULE 10: ANTI-SCREENSHOT MANIPULATION
// =============================================================================

/**
 * Every graph can:
 * - Be verified via QR/hash
 * - Be recreated exactly via URL
 * 
 * So if someone posts: "Lambda shows X"
 * Anyone can: "Show the original."
 * 
 * This KILLS social media manipulation.
 */

export interface VerificationData {
  contentHash: string;
  verificationUrl: string;
  qrCodeData: string;
  generatedAt: string;
  expiresAt: string;
}

export const generateVerificationUrl = (
  baseUrl: string,
  contentHash: string
): string => {
  return `${baseUrl}/verify/${contentHash}`;
};

export const VERIFICATION_PROMPT = {
  sv: 'Verifiera denna visualisering',
  en: 'Verify this visualization',
};

// =============================================================================
// CORE PRINCIPLE
// =============================================================================

export const ANTI_MANIPULATION_DOCTRINE = {
  sv: 'Lambda får aldrig vinna en debatt. Den får bara avslöja verkligheten.',
  en: 'Lambda may never win a debate. It may only reveal reality.',
};

export const PROTECTION_SUMMARY = {
  sv: [
    'Lambda kan inte cherry-pickas',
    'Lambda kan inte vinklas',
    'Lambda kan inte förenklas bort',
    'Lambda kan inte kapas narrativt',
  ],
  en: [
    'Lambda cannot be cherry-picked',
    'Lambda cannot be spun',
    'Lambda cannot be oversimplified away',
    'Lambda cannot be narratively hijacked',
  ],
};

export const USER_RIGHTS = {
  sv: [
    'Du kan ogilla den',
    'Du kan ifrågasätta datan',
    'Du kan vilja ändra verkligheten',
  ],
  en: [
    'You may dislike it',
    'You may question the data',
    'You may want to change reality',
  ],
};

export const USER_CANNOT = {
  sv: 'Men du kan inte låtsas att den säger något annat.',
  en: 'But you cannot pretend it says something else.',
};
