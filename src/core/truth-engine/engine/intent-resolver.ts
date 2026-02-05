/**
 * INTENT RESOLVER — Classification, not interpretation
 * 
 * Intent is classification, NOT interpretation.
 * No NLP magic. Pure pattern matching.
 */

/**
 * USER INTENT — Raw input
 */
export interface UserIntent {
  readonly query: string;
  readonly context?: IntentContext;
}

export interface IntentContext {
  readonly previous_node_id?: string;
  readonly session_id?: string;
  readonly depth_level?: number;
  readonly domain_hint?: string;
}

/**
 * RESOLVED INTENT — Classified intent
 */
export interface ResolvedIntent {
  readonly domain: Domain;
  readonly depth: DepthLevel;
  readonly scope: Scope;
  readonly question_type: QuestionType;
  readonly confidence: number;
}

export type Domain = 
  | 'healthcare'
  | 'economy'
  | 'education'
  | 'environment'
  | 'demographics'
  | 'labor'
  | 'housing'
  | 'safety'
  | 'governance'
  | 'general';

export type DepthLevel = 1 | 2 | 3 | 4 | 5;

export interface Scope {
  readonly geographic: GeographicScope;
  readonly temporal: TemporalScope;
  readonly population: PopulationScope;
}

export interface GeographicScope {
  readonly level: 'global' | 'region' | 'country' | 'subnational' | 'local';
  readonly code?: string;
}

export interface TemporalScope {
  readonly type: 'current' | 'historical' | 'trend' | 'comparison';
  readonly start?: string;
  readonly end?: string;
}

export interface PopulationScope {
  readonly type: 'total' | 'demographic' | 'specific';
  readonly definition?: string;
}

export type QuestionType =
  | 'state'          // What is happening?
  | 'change'         // What changed?
  | 'importance'     // Why does this matter?
  | 'comparison'     // How does X compare to Y?
  | 'connection'     // What relates to this?
  | 'depth'          // Tell me more
  | 'verification'   // Is this true?
  | 'uncertainty'    // What don't we know?
  | 'historical';    // What was it like in year X?

/**
 * DOMAIN PATTERNS — For classification
 */
const DOMAIN_PATTERNS: Record<Domain, RegExp[]> = {
  healthcare: [/health/i, /medical/i, /disease/i, /hospital/i, /doctor/i, /patient/i, /mental/i, /anxiety/i, /depression/i],
  economy: [/economy/i, /gdp/i, /inflation/i, /market/i, /trade/i, /finance/i, /currency/i, /debt/i],
  education: [/education/i, /school/i, /university/i, /student/i, /teacher/i, /literacy/i, /pisa/i],
  environment: [/climate/i, /environment/i, /emission/i, /pollution/i, /carbon/i, /temperature/i, /biodiversity/i],
  demographics: [/population/i, /age/i, /birth/i, /death/i, /migration/i, /fertility/i, /demographic/i],
  labor: [/employment/i, /unemployment/i, /job/i, /work/i, /labor/i, /wage/i, /salary/i],
  housing: [/housing/i, /rent/i, /mortgage/i, /property/i, /home/i, /real estate/i],
  safety: [/crime/i, /safety/i, /violence/i, /police/i, /security/i, /murder/i, /theft/i],
  governance: [/government/i, /policy/i, /election/i, /parliament/i, /law/i, /regulation/i],
  general: [],
};

/**
 * QUESTION TYPE PATTERNS
 */
const QUESTION_PATTERNS: Record<QuestionType, RegExp[]> = {
  state: [/what is/i, /how is/i, /current/i, /status/i, /situation/i],
  change: [/changed/i, /trend/i, /increasing/i, /decreasing/i, /growing/i, /shrinking/i],
  importance: [/why/i, /matter/i, /important/i, /significant/i, /impact/i],
  comparison: [/compare/i, /versus/i, /vs/i, /difference/i, /between/i],
  connection: [/related/i, /connected/i, /affects/i, /causes/i, /influences/i],
  depth: [/more/i, /detail/i, /explain/i, /deeper/i, /breakdown/i],
  verification: [/true/i, /verify/i, /correct/i, /accurate/i, /confirm/i],
  uncertainty: [/uncertain/i, /unknown/i, /gap/i, /limit/i, /confident/i],
  historical: [/was/i, /were/i, /history/i, /past/i, /\b(19|20)\d{2}\b/],
};

/**
 * RESOLVE INTENT — Main function
 */
export function resolveIntent(input: UserIntent): ResolvedIntent {
  const query = input.query.toLowerCase();
  
  return {
    domain: detectDomain(query),
    depth: detectDepth(input),
    scope: normalizeScope(input),
    question_type: mapToAllowedQuestion(query),
    confidence: calculateIntentConfidence(query),
  };
}

/**
 * DETECT DOMAIN
 */
export function detectDomain(query: string): Domain {
  for (const [domain, patterns] of Object.entries(DOMAIN_PATTERNS)) {
    if (patterns.some(p => p.test(query))) {
      return domain as Domain;
    }
  }
  return 'general';
}

/**
 * DETECT DEPTH
 */
export function detectDepth(input: UserIntent): DepthLevel {
  if (input.context?.depth_level) {
    return Math.min(5, input.context.depth_level + 1) as DepthLevel;
  }
  
  const query = input.query.toLowerCase();
  if (/detail|explain|breakdown|mechanism/i.test(query)) return 3;
  if (/history|historical|over time/i.test(query)) return 4;
  if (/uncertain|limitation|gap/i.test(query)) return 5;
  
  return 1;
}

/**
 * NORMALIZE SCOPE
 */
export function normalizeScope(input: UserIntent): Scope {
  const query = input.query;
  
  // Geographic detection
  let geographic: GeographicScope = { level: 'country', code: 'SE' }; // Default
  if (/global|world/i.test(query)) geographic = { level: 'global' };
  if (/europe|eu\b/i.test(query)) geographic = { level: 'region', code: 'EU' };
  if (/stockholm|göteborg|malmö/i.test(query)) geographic = { level: 'local' };
  
  // Temporal detection
  let temporal: TemporalScope = { type: 'current' };
  if (/trend|over time|years/i.test(query)) temporal = { type: 'trend' };
  if (/compare|versus/i.test(query)) temporal = { type: 'comparison' };
  if (/was|were|\b(19|20)\d{2}\b/i.test(query)) temporal = { type: 'historical' };
  
  // Population detection
  let population: PopulationScope = { type: 'total' };
  if (/youth|young|teenager/i.test(query)) population = { type: 'demographic', definition: 'youth' };
  if (/elderly|senior|old/i.test(query)) population = { type: 'demographic', definition: 'elderly' };
  
  return { geographic, temporal, population };
}

/**
 * MAP TO ALLOWED QUESTION
 */
export function mapToAllowedQuestion(query: string): QuestionType {
  for (const [type, patterns] of Object.entries(QUESTION_PATTERNS)) {
    if (patterns.some(p => p.test(query))) {
      return type as QuestionType;
    }
  }
  return 'state';
}

/**
 * CALCULATE INTENT CONFIDENCE
 */
function calculateIntentConfidence(query: string): number {
  let confidence = 0.5; // Base
  
  // Longer queries = more context = higher confidence
  if (query.split(' ').length > 5) confidence += 0.1;
  if (query.split(' ').length > 10) confidence += 0.1;
  
  // Clear domain match = higher confidence
  for (const patterns of Object.values(DOMAIN_PATTERNS)) {
    if (patterns.some(p => p.test(query))) {
      confidence += 0.2;
      break;
    }
  }
  
  return Math.min(0.95, confidence);
}
