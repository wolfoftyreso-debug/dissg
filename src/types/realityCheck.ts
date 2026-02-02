/**
 * 🧠 REALITY CHECK ENGINE TYPES
 * 
 * Rosling-style calibration system with:
 * - Live data as the ONLY answer key
 * - 3-layer answer model (perception, observation, traceability)
 * - Full verification and source transparency
 * - Zero speculation, zero interpretation
 */

// ============================================
// QUESTION TYPES
// ============================================

export type QuestionCategory = 
  | 'trend'           // How has X changed over time?
  | 'comparison'      // Which group has the highest X?
  | 'distribution'    // What percentage of X has Y?
  | 'correlation'     // How do X and Y relate?
  | 'magnitude'       // What is the size of X?
  | 'ranking';        // Where does X rank?

export type QuestionDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface RealityCheckQuestion {
  id: string;
  code: string;
  
  // Question definition
  questionText: string;
  questionTextLocal: Record<string, string>; // { sv: '...', de: '...' }
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  
  // Required data parameters
  indicatorIds: string[];
  geoScope: 'global' | 'region' | 'country' | string[];
  timeRange: {
    start: string;
    end: string;
  };
  
  // Answer options (for multiple choice)
  options?: Array<{
    id: string;
    label: string;
    value: number | string;
  }>;
  
  // Validation
  requiresLiveData: boolean;
  minimumConfidence: number; // 0-100, minimum data confidence to show question
  
  // Metadata
  sources: string[];
  lastVerified: string;
  isActive: boolean;
}

// ============================================
// ANSWER MODEL (3 LAYERS)
// ============================================

export interface Layer1UserPerception {
  questionId: string;
  selectedOptionId?: string;
  numericGuess?: number;
  answeredAt: string;
  confidence: 'very_unsure' | 'unsure' | 'somewhat_sure' | 'confident' | 'very_confident';
}

export interface Layer2ObservedData {
  questionId: string;
  
  // The observed values
  observedValue: number | string;
  observedRange?: { min: number; max: number }; // Uncertainty range
  unit: string;
  
  // Context
  comparisonBaseline?: number;
  percentilePosition?: number;
  
  // Data quality
  confidence: number; // 0-100
  uncertainty: 'low' | 'medium' | 'high';
  dataPoints: number; // How many data points support this
  
  // Temporal
  dataAsOf: string;
  latencyDays: number; // How old is the data
}

export interface Layer3Traceability {
  questionId: string;
  
  // Sources
  sources: Array<{
    id: string;
    name: string;
    url: string;
    reliability: number;
    lastUpdated: string;
  }>;
  
  // Methodology
  aggregationMethod: string;
  normalizationApplied: boolean;
  exclusions: string[]; // What was excluded and why
  
  // Limitations
  limitations: string[];
  whatThisDoesNotShow: string[];
  
  // Verification
  verificationHash: string;
  verificationUrl: string;
  timestamp: string;
  systemVersion: string;
}

export interface RealityCheckAnswer {
  layer1: Layer1UserPerception;
  layer2: Layer2ObservedData;
  layer3: Layer3Traceability;
  
  // Comparison result (neutral, not "right/wrong")
  alignmentScore: number; // 0-100, how close perception is to observation
  deviation: number | null; // Numeric difference if applicable
  deviationDirection: 'over' | 'under' | 'aligned' | null;
}

// ============================================
// SOURCE SIGNATURE (Transparency)
// ============================================

export interface SourceSignature {
  id: string;
  hash: string;
  
  // What's included
  includedSources: Array<{
    id: string;
    name: string;
    weight: number;
  }>;
  
  // What's excluded (if any)
  excludedSources: Array<{
    id: string;
    name: string;
    excludedBy: 'user' | 'system';
    reason: string;
  }>;
  
  // Impact analysis
  exclusionImpact: {
    valueWithAll: number;
    valueWithSelection: number;
    differencePercent: number;
    isSignificant: boolean;
  } | null;
  
  // Verification
  qrCodeUrl: string;
  verificationUrl: string;
  createdAt: string;
}

// ============================================
// CORRELATION ANALYSIS (with discipline)
// ============================================

export interface CorrelationRequest {
  variableA: string;
  variableB: string;
  geoScope: string[];
  timeRange: { start: string; end: string };
  sourcesIncluded?: string[];
  sourcesExcluded?: string[];
}

export interface CorrelationResult {
  request: CorrelationRequest;
  
  // The correlation
  coefficient: number; // -1 to 1
  strength: 'very_weak' | 'weak' | 'moderate' | 'strong' | 'very_strong';
  direction: 'positive' | 'negative' | 'none';
  pValue: number;
  isSignificant: boolean;
  
  // MANDATORY disclaimers
  disclaimers: {
    correlationNotCausation: true; // Always true, always shown
    unmeasuredVariables: string[]; // What's NOT measured
    confoundingFactors: string[];
    temporalLimitations: string;
  };
  
  // Source signature for this view
  sourceSignature: SourceSignature;
  
  // Traceability
  verificationHash: string;
  generatedAt: string;
}

// ============================================
// VERIFICATION
// ============================================

export interface VerificationRecord {
  hash: string;
  type: 'question' | 'answer' | 'correlation' | 'diagram';
  
  // What was verified
  entityId: string;
  entityData: Record<string, unknown>;
  
  // Context
  sources: string[];
  aggregationLogic: string;
  timestamp: string;
  systemVersion: string;
  
  // Links
  rawDataUrl: string;
  methodologyUrl: string;
  apiEndpoint: string;
}

// ============================================
// PERCEPTION GAP ANALYSIS
// ============================================

export interface PerceptionGap {
  questionId: string;
  questionCategory: QuestionCategory;
  
  // Aggregate perception vs reality
  averagePerception: number;
  actualValue: number;
  gapPercent: number;
  gapDirection: 'over' | 'under';
  
  // Demographics (if tracked)
  gapByRegion?: Record<string, number>;
  gapByAge?: Record<string, number>;
  gapByEducation?: Record<string, number>;
  
  // Sample
  sampleSize: number;
  calculatedAt: string;
}

// ============================================
// FORBIDDEN PHRASES (Engine-level)
// ============================================

export const REALITY_CHECK_FORBIDDEN_PHRASES = [
  // Causal
  'leads to',
  'causes',
  'results in',
  'because',
  'due to',
  'therefore',
  'leder till',
  'orsakar',
  'beror på',
  'därför',
  
  // Speculative
  'probably',
  'likely',
  'presumably',
  'reasonable to assume',
  'förmodligen',
  'troligen',
  'rimligt att anta',
  
  // Normative
  'should',
  'ought to',
  'better',
  'worse',
  'good',
  'bad',
  'bör',
  'borde',
  'bättre',
  'sämre',
] as const;

// ============================================
// ALLOWED PHRASES
// ============================================

export const REALITY_CHECK_ALLOWED_PHRASES = [
  'Observed data indicates...',
  'Within the limits of available data...',
  'The measured value is...',
  'Data shows...',
  'According to [source]...',
  'Observerad data visar...',
  'Inom ramen för tillgängliga data...',
  'Det uppmätta värdet är...',
  'Data visar...',
  'Enligt [källa]...',
] as const;

// ============================================
// SESSION & PROGRESS
// ============================================

export interface RealityCheckSession {
  id: string;
  startedAt: string;
  completedAt: string | null;
  
  // Questions in this session
  questions: string[];
  answers: RealityCheckAnswer[];
  
  // Aggregate results
  overallAlignmentScore: number;
  categoriesStrong: QuestionCategory[];
  categoriesWeak: QuestionCategory[];
  
  // Mode
  mode: 'public' | 'professional' | 'education' | 'ai_filter';
}

export type UsageMode = 'public' | 'professional' | 'education' | 'ai_filter';

export interface UsageModeConfig {
  mode: UsageMode;
  showDetailedSources: boolean;
  showMethodology: boolean;
  allowSourceFiltering: boolean;
  requireVerification: boolean;
  exportFormats: ('json' | 'csv' | 'pdf')[];
}

export const USAGE_MODE_CONFIGS: Record<UsageMode, UsageModeConfig> = {
  public: {
    mode: 'public',
    showDetailedSources: false,
    showMethodology: false,
    allowSourceFiltering: false,
    requireVerification: false,
    exportFormats: [],
  },
  professional: {
    mode: 'professional',
    showDetailedSources: true,
    showMethodology: true,
    allowSourceFiltering: true,
    requireVerification: true,
    exportFormats: ['json', 'csv', 'pdf'],
  },
  education: {
    mode: 'education',
    showDetailedSources: true,
    showMethodology: true,
    allowSourceFiltering: false,
    requireVerification: false,
    exportFormats: ['pdf'],
  },
  ai_filter: {
    mode: 'ai_filter',
    showDetailedSources: true,
    showMethodology: true,
    allowSourceFiltering: false,
    requireVerification: true,
    exportFormats: ['json'],
  },
};
