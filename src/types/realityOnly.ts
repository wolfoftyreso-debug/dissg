/**
 * 🔒 REALITY-ONLY PLATFORM TYPES
 * 
 * INGEN SANDBOX · INGEN LEK · BARA VERKLIGHET
 * 
 * Alla typer och kontrakt för:
 * - Reality Wrapped (endast verifierad data)
 * - Live question generation
 * - Misunderstanding Index
 * - Sharing/media blocking
 * - AI data filter
 */

// ============================================
// CORE DATA CONTRACTS
// ============================================

/**
 * Data availability status - determines if content can be shown
 */
export type DataAvailability = 
  | 'verified'        // Full verified data available
  | 'partial'         // Some data missing, can show with disclaimers
  | 'insufficient'    // Cannot show - not enough data
  | 'stale'           // Data too old for this view
  | 'conflicting';    // Sources conflict, cannot aggregate

/**
 * Standard response when data is insufficient
 */
export const INSUFFICIENT_DATA_MESSAGE = {
  en: 'Verified data is insufficient to present this view for the selected scope and period.',
  sv: 'Verifierad data är otillräcklig för att visa denna vy för valt omfång och period.',
} as const;

/**
 * Verification proof attached to every view
 */
export interface VerificationProof {
  hash: string;
  qrCodeUrl: string;
  buildPageUrl: string;
  sources: SourceDetail[];
  aggregationLogic: string;
  exclusions: ExclusionDetail[];
  versionStatus: string;
  generatedAt: string;
  validUntil: string | null;
}

export interface SourceDetail {
  id: string;
  name: string;
  url: string;
  reliability: number;
  lastUpdated: string;
  dataPoints: number;
  coverage: number; // 0-100
}

export interface ExclusionDetail {
  sourceId: string;
  reason: 'user_choice' | 'quality' | 'methodology' | 'coverage';
  impact: 'minor' | 'moderate' | 'significant';
  impactDescription: string;
}

// ============================================
// REALITY WRAPPED (No sandbox, only live data)
// ============================================

/**
 * Reality Wrapped step - only shows if data is verified
 */
export interface RealityWrappedStep {
  id: string;
  type: 'overview' | 'changes' | 'timeline' | 'comparison' | 'unchanged' | 'limitations';
  
  // Data availability
  availability: DataAvailability;
  availabilityReason?: string;
  
  // Content (only present if availability is 'verified' or 'partial')
  content?: RealityWrappedContent;
  
  // Always present
  verification: VerificationProof;
  
  // Click depth
  explanationLevels: ExplanationLevel[];
}

export interface RealityWrappedContent {
  title: string;
  titleLocal: Record<string, string>;
  mainMetric?: {
    value: number;
    unit: string;
    change?: number;
    changeDirection?: 'up' | 'down' | 'stable';
    uncertainty: { min: number; max: number };
  };
  observations: string[];
  visualData?: unknown;
}

export interface ExplanationLevel {
  level: number;
  title: string;
  content: string;
  clickable: boolean;
}

/**
 * Complete Reality Wrapped report
 */
export interface RealityWrappedReport {
  id: string;
  entityCode: string; // Country, region, or city code
  entityName: string;
  entityNameLocal: Record<string, string>;
  
  period: {
    start: string;
    end: string;
    type: 'year' | 'quarter' | 'custom';
  };
  
  // Steps - some may be unavailable
  steps: RealityWrappedStep[];
  
  // Overall data quality
  overallAvailability: DataAvailability;
  stepsAvailable: number;
  stepsUnavailable: number;
  
  // Master verification
  masterVerification: VerificationProof;
  
  generatedAt: string;
  stableUrl: string;
}

// ============================================
// LIVE QUESTION GENERATION
// ============================================

/**
 * Question that can only be generated if data exists
 */
export interface LiveQuestion {
  id: string;
  code: string;
  
  // Question text
  questionText: string;
  questionTextLocal: Record<string, string>;
  
  // Data backing
  dataAvailability: DataAvailability;
  indicatorIds: string[];
  dataQuality: number; // 0-100
  
  // Options (only generated from real data ranges)
  options: LiveQuestionOption[];
  
  // Live answer
  liveAnswer: {
    value: number | string;
    uncertainty: { min: number; max: number };
    asOf: string;
    sources: string[];
  };
  
  // Verification
  verification: VerificationProof;
}

export interface LiveQuestionOption {
  id: string;
  label: string;
  value: number | string;
  isCorrect: boolean;
  distanceFromCorrect?: number; // How far from the real answer
}

// ============================================
// MISUNDERSTANDING INDEX
// ============================================

/**
 * Where is the world most often misunderstood?
 */
export interface MisunderstandingEntry {
  indicatorId: string;
  indicatorName: string;
  indicatorNameLocal: Record<string, string>;
  category: string;
  
  // The gap
  averagePerception: number;
  actualValue: number;
  gapPercent: number;
  gapDirection: 'overestimate' | 'underestimate';
  
  // Confidence
  sampleSize: number;
  confidence: number;
  
  // Breakdown
  gapByDemographic?: Record<string, number>;
  
  // Why this might be
  possibleReasons: string[];
  
  // Data backing
  dataAvailability: DataAvailability;
  verification: VerificationProof;
}

export interface MisunderstandingIndex {
  calculatedAt: string;
  period: { start: string; end: string };
  
  // Rankings
  mostOverestimated: MisunderstandingEntry[];
  mostUnderestimated: MisunderstandingEntry[];
  
  // Overall patterns
  overallBias: 'pessimistic' | 'optimistic' | 'neutral';
  biasStrength: number;
  
  // Verification
  verification: VerificationProof;
}

// ============================================
// SHARING & MEDIA BLOCKING
// ============================================

/**
 * Sharing validation result
 */
export interface ShareValidation {
  canShare: boolean;
  blockReasons: ShareBlockReason[];
  warnings: ShareWarning[];
  requiredContext: string[];
  suggestedCaption: string;
  mandatoryDisclaimer: string;
}

export interface ShareBlockReason {
  code: string;
  message: string;
  messageLocal: Record<string, string>;
  severity: 'block' | 'require_context';
}

export interface ShareWarning {
  code: string;
  message: string;
  suggestion: string;
}

/**
 * Media embedding rules
 */
export interface EmbedRules {
  allowIframe: boolean;
  allowScreenshot: boolean;
  requireAttribution: boolean;
  attributionText: string;
  mandatoryElements: ('sources' | 'uncertainty' | 'limitations' | 'verification')[];
  forbiddenContexts: string[]; // e.g., 'political_campaign', 'advertising'
}

// ============================================
// AI DATA FILTER
// ============================================

/**
 * AI response validation
 */
export interface AIDataFilter {
  claim: string;
  validation: AIClaimValidation;
}

export interface AIClaimValidation {
  hasDataBacking: boolean;
  backingStrength: 'strong' | 'moderate' | 'weak' | 'none';
  
  // If backed
  supportingIndicators?: string[];
  supportingDataPoints?: number;
  dataAsOf?: string;
  
  // If not backed
  rejection?: {
    reason: 'no_data' | 'insufficient_data' | 'stale_data' | 'conflicting_data' | 'speculative';
    suggestion: string;
    alternatives?: string[];
  };
  
  // Verification
  verification?: VerificationProof;
}

/**
 * Allowed vs forbidden AI response patterns
 */
export const AI_RESPONSE_PATTERNS = {
  allowed: [
    'Observed data indicates...',
    'According to [source], as of [date]...',
    'Within the limits of available data...',
    'The measured value is...',
    'Data from [source] shows...',
    'Based on verified observations...',
  ],
  forbidden: [
    'probably',
    'likely',
    'suggests that',
    'could mean',
    'implies',
    'therefore',
    'because',
    'leads to',
    'causes',
    'should',
    'ought to',
    'better',
    'worse',
    'good',
    'bad',
  ],
} as const;

// ============================================
// DATA SUFFICIENCY CHECKS
// ============================================

export interface DataSufficiencyCheck {
  indicatorId: string;
  geoScope: string;
  timeRange: { start: string; end: string };
  
  result: {
    isSufficient: boolean;
    availability: DataAvailability;
    
    // Details
    requiredDataPoints: number;
    availableDataPoints: number;
    coveragePercent: number;
    
    // Gaps
    missingPeriods: string[];
    missingRegions: string[];
    
    // Quality
    averageConfidence: number;
    sourceCount: number;
  };
}

/**
 * Check if content can be displayed
 */
export function canDisplayContent(availability: DataAvailability): boolean {
  return availability === 'verified' || availability === 'partial';
}

/**
 * Get display message for unavailable content
 */
export function getUnavailableMessage(
  availability: DataAvailability,
  language: 'en' | 'sv' = 'en'
): string {
  if (availability === 'verified' || availability === 'partial') {
    return '';
  }
  
  const messages: Record<DataAvailability, Record<'en' | 'sv', string>> = {
    verified: { en: '', sv: '' },
    partial: { en: '', sv: '' },
    insufficient: INSUFFICIENT_DATA_MESSAGE,
    stale: {
      en: 'Available data is too old to present current conditions.',
      sv: 'Tillgänglig data är för gammal för att visa nuvarande förhållanden.',
    },
    conflicting: {
      en: 'Data sources conflict and cannot be reliably aggregated for this view.',
      sv: 'Datakällor är motstridiga och kan inte aggregeras tillförlitligt för denna vy.',
    },
  };
  
  return messages[availability][language];
}
