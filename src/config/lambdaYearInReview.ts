/**
 * LAMBDA YEAR IN REVIEW
 * 
 * "What actually happened – and why"
 * 
 * PURPOSE (LOCKED):
 * Provide a correct, coherent annual picture of system state and movement
 * - Without narrative
 * - Without blame
 * - Without hype
 * 
 * This is THE RECORD, not a campaign.
 */

// =============================================================================
// STRUCTURE (FIXED ORDER – ALWAYS THE SAME)
// =============================================================================

export const YEAR_IN_REVIEW_SECTIONS = [
  'headline',      // A. Årets Lambda
  'drivers',       // B. Vad rörde Lambda mest
  'timeline',      // C. När hände vad
  'comparisons',   // D. Jämförelser
  'movements',     // E. Vad förbättrades / försämrades
  'uncertainties', // F. Osäkerheter & blinda fläckar
  'summary',       // G. Sammanfattning i 3 meningar
] as const;

export type YearInReviewSection = typeof YEAR_IN_REVIEW_SECTIONS[number];

// =============================================================================
// SECTION A: HEADLINE LAMBDA
// =============================================================================

export interface HeadlineLambda {
  year: number;
  value: number;
  uncertainty: number;
  direction: 'up' | 'down' | 'stable';
  changeFromPreviousYear: number;
  dataCoveragePercent: number;
}

export const DIRECTION_SYMBOLS: Record<HeadlineLambda['direction'], string> = {
  up: '↑',
  down: '↓',
  stable: '→',
};

// =============================================================================
// SECTION B: DRIVERS
// =============================================================================

export interface LambdaDriver {
  indicatorId: string;
  indicatorName: string;
  contribution: number; // How much it contributed to Lambda change
  direction: 'positive' | 'negative';
  confidence: 'high' | 'medium' | 'low';
  statisticalSupport: boolean;
}

export const DRIVER_DISPLAY_LIMIT = 5; // Top 5 drivers

// =============================================================================
// SECTION C: TIMELINE
// =============================================================================

export interface TimelineMonth {
  month: number; // 1-12
  lambdaValue: number;
  uncertainty: number;
}

export interface TimelineEvent {
  date: string;
  type: 'decision' | 'external_shock';
  title: string;
  institutionLevel?: string;
  sourceUrl?: string;
}

export interface LambdaTimeline {
  year: number;
  monthlyData: TimelineMonth[];
  events: TimelineEvent[];
}

// =============================================================================
// SECTION D: COMPARISONS
// =============================================================================

export interface LambdaComparison {
  type: 'previous_year' | 'five_year_median' | 'peer_group';
  currentValue: number;
  comparisonValue: number;
  difference: number;
  differencePercent: number;
  isComparable: boolean;
  limitations?: string[];
}

export interface PeerComparison extends LambdaComparison {
  type: 'peer_group';
  peerEntityNames: string[];
  peerCount: number;
}

// =============================================================================
// SECTION E: MOVEMENTS (Improvements / Deteriorations)
// =============================================================================

export interface IndicatorMovement {
  indicatorId: string;
  indicatorName: string;
  change: number;
  changePercent: number;
  direction: 'improved' | 'deteriorated';
}

export interface MovementsSummary {
  improvements: IndicatorMovement[];
  deteriorations: IndicatorMovement[];
}

// No summing to "good/bad". Only movement.

// =============================================================================
// SECTION F: UNCERTAINTIES & BLIND SPOTS
// =============================================================================

export interface UncertaintyReport {
  lowCoverageIndicators: { id: string; name: string; coveragePercent: number }[];
  estimatesUsed: { id: string; name: string; estimateType: string }[];
  cannotBeSaid: string[];
}

// This INCREASES trust the most.

// =============================================================================
// SECTION G: 3-SENTENCE SUMMARY
// =============================================================================

export interface ThreeSentenceSummary {
  overallMovement: string;      // System's overall movement
  mainDrivers: string;          // Main driving forces
  riskRobustness: string;       // Risk/robustness forward (without forecast)
  generatedAt: string;
  methodVersion: string;
}

// Machine-generated, strict template. No interpretation.

// =============================================================================
// FRACTAL VERSIONING
// =============================================================================

/**
 * Same Year in Review exists for:
 * 🌍 World
 * 🇸🇪 Countries
 * 🏙 Regions
 * 🏘 Municipalities
 * 🧩 Sectors
 * 
 * Same structure. Same logic. Only sensors change.
 */

export type EntityLevel = 'world' | 'country' | 'region' | 'municipality' | 'sector';

export const ENTITY_LEVEL_LABELS: Record<EntityLevel, { sv: string; en: string; icon: string }> = {
  world: { sv: 'Världen', en: 'World', icon: '🌍' },
  country: { sv: 'Land', en: 'Country', icon: '🇸🇪' },
  region: { sv: 'Region', en: 'Region', icon: '🏙' },
  municipality: { sv: 'Kommun', en: 'Municipality', icon: '🏘' },
  sector: { sv: 'Sektor', en: 'Sector', icon: '🧩' },
};

// =============================================================================
// SHARING & VERIFICATION
// =============================================================================

export interface YearInReviewMetadata {
  permanentUrl: string;
  versionId: string;
  methodId: string;
  contentHash: string;
  qrCodeData: string;
  generatedAt: string;
  validUntil: string;
}

// =============================================================================
// AI SUMMARY CONSTRAINTS
// =============================================================================

/**
 * AI MAY ONLY:
 * - Reproduce the structure
 * - Point to drivers
 * - Mention uncertainty
 * 
 * AI MAY NOT:
 * - Interpret values
 * - Draw policy conclusions
 * - Speculate forward
 */

export const AI_ALLOWED_ACTIONS = [
  'reproduce_structure',
  'cite_drivers',
  'mention_uncertainty',
  'reference_sources',
] as const;

export const AI_FORBIDDEN_ACTIONS = [
  'interpret_values',
  'policy_conclusions',
  'future_speculation',
  'normative_statements',
  'blame_assignment',
] as const;

// =============================================================================
// CORE PRINCIPLE
// =============================================================================

export const YEAR_IN_REVIEW_DOCTRINE = {
  sv: 'Year in Review svarar inte på vad som borde ha hänt. Den visar vad som faktiskt hände – och varför.',
  en: 'Year in Review does not answer what should have happened. It shows what actually happened – and why.',
};

// =============================================================================
// SECTION LABELS
// =============================================================================

export const SECTION_LABELS: Record<YearInReviewSection, { sv: string; en: string }> = {
  headline: { sv: 'Årets Lambda', en: "Year's Lambda" },
  drivers: { sv: 'Vad rörde Lambda mest', en: 'What Moved Lambda Most' },
  timeline: { sv: 'När hände vad', en: 'When Things Happened' },
  comparisons: { sv: 'Jämförelser', en: 'Comparisons' },
  movements: { sv: 'Förändringar', en: 'Changes' },
  uncertainties: { sv: 'Osäkerheter & blinda fläckar', en: 'Uncertainties & Blind Spots' },
  summary: { sv: 'Sammanfattning', en: 'Summary' },
};
