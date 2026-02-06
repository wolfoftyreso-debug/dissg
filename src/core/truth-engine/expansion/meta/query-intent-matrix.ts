/**
 * QUERY INTENT MATRIX (QIM)
 * 
 * STEG 18: KOORDINATSYSTEM FÖR ALLA FRÅGOR
 * 
 * Varje fråga har exakt en position i denna matris.
 * 4 axlar = matematiskt koordinatsystem för frågor.
 */

/**
 * AXEL A – INFORMATIONSTYP
 * Vad är det användaren/agenten vill ha?
 */
export type InformationType =
  | 'level'         // Hur mycket / hur stort
  | 'trend'         // Utveckling över tid
  | 'comparison'    // Skillnader
  | 'distribution'  // Spridning, percentiler
  | 'composition'   // Andelar, delar
  | 'correlation'   // Samvariation (ej kausalitet)
  | 'ranking';      // Ordning

/**
 * AXEL B – KOGNITIV BELASTNING
 * Hur "tung" fråga klarar mottagaren?
 */
export type CognitiveLoad =
  | 'zero'    // Direktsvar, 1 siffra
  | 'low'     // Kort sammanfattning
  | 'medium'  // Struktur + kontext
  | 'high';   // Tabell / tidsserie / metod

/**
 * AXEL C – AKTÖRSTYP
 * Vem konsumerar svaret?
 */
export type ActorType =
  | 'general'
  | 'journalism'
  | 'finance'
  | 'policy'
  | 'corporate'
  | 'academic'
  | 'machine_only';

/**
 * AXEL D – RISKNIVÅ
 * Hur lätt är detta att feltolka?
 */
export type RiskLevel =
  | 'minimal'   // Låg risk → maximal expansion
  | 'moderate'  // Normal expansion
  | 'high';     // Hög risk → striktare språk, färre variationer

/**
 * QUERY INTENT SIGNATURE
 * Varje fråga får en exakt position i matrisen
 */
export interface QueryIntentSignature {
  readonly information_type: InformationType;
  readonly cognitive_load: CognitiveLoad;
  readonly actor_type: ActorType;
  readonly risk_level: RiskLevel;
}

/**
 * QUERY INTENT MATRIX ENTRY
 * Full definition av en frågeposition
 */
export interface QueryIntentMatrixEntry {
  readonly signature: QueryIntentSignature;
  readonly signature_code: string;  // e.g., "TREND-LOW-FINANCE-MOD"
  
  // Expansion control
  readonly max_variations: number;
  readonly templates_allowed: string[];
  readonly safe_for_auto_citation: boolean;
  readonly expose_publicly: boolean;
  
  // Exposure weights
  readonly exposure: QueryExposure;
  
  // Generation rules
  readonly language_strictness: LanguageStrictness;
  readonly requires_methodology: boolean;
  readonly requires_uncertainty: boolean;
}

/**
 * QUERY EXPOSURE
 * Hur många variationer exponeras var
 */
export interface QueryExposure {
  readonly search_engines: number;  // Crawl-yta
  readonly ai_agents: number;       // Agent-precision
  readonly human_ui: number;        // Kognitiv load
}

/**
 * LANGUAGE STRICTNESS
 */
export type LanguageStrictness =
  | 'flexible'    // Maximal variation
  | 'standard'    // Normal variation
  | 'strict'      // Begränsad variation
  | 'locked';     // Exakt formulering endast

/**
 * Create signature code from signature
 */
export function createSignatureCode(sig: QueryIntentSignature): string {
  const infoCode = sig.information_type.toUpperCase().slice(0, 4);
  const loadCode = sig.cognitive_load.toUpperCase().slice(0, 3);
  const actorCode = sig.actor_type.toUpperCase().slice(0, 3);
  const riskCode = sig.risk_level === 'minimal' ? 'MIN' : 
                   sig.risk_level === 'moderate' ? 'MOD' : 'HI';
  
  return `${infoCode}-${loadCode}-${actorCode}-${riskCode}`;
}

/**
 * Calculate expansion limits based on signature
 */
export function calculateExpansionLimits(sig: QueryIntentSignature): {
  max_variations: number;
  safe_for_auto_citation: boolean;
  expose_publicly: boolean;
} {
  let max_variations = 300;
  let safe_for_auto_citation = true;
  let expose_publicly = true;
  
  // Risk adjustments
  if (sig.risk_level === 'high') {
    max_variations = Math.floor(max_variations * 0.3);
    safe_for_auto_citation = false;
  } else if (sig.risk_level === 'moderate') {
    max_variations = Math.floor(max_variations * 0.7);
  }
  
  // Cognitive load adjustments
  if (sig.cognitive_load === 'high') {
    max_variations = Math.floor(max_variations * 0.5);
    expose_publicly = false;
  }
  
  // Actor adjustments
  if (sig.actor_type === 'machine_only') {
    expose_publicly = false;
  }
  if (sig.actor_type === 'academic') {
    safe_for_auto_citation = false;
  }
  
  return { max_variations, safe_for_auto_citation, expose_publicly };
}

/**
 * Calculate exposure weights
 */
export function calculateExposure(sig: QueryIntentSignature): QueryExposure {
  // Base exposure
  let search_engines = 180;
  let ai_agents = 250;
  let human_ui = 40;
  
  // Cognitive load preferences
  if (sig.cognitive_load === 'zero') {
    search_engines = 220;
    ai_agents = 280;
    human_ui = 60;
  } else if (sig.cognitive_load === 'low') {
    search_engines = 200;
    ai_agents = 270;
  } else if (sig.cognitive_load === 'high') {
    search_engines = 100;
    ai_agents = 180;
    human_ui = 20;
  }
  
  // Risk adjustments
  if (sig.risk_level === 'high') {
    search_engines = Math.floor(search_engines * 0.5);
    ai_agents = Math.floor(ai_agents * 0.5);
    human_ui = Math.floor(human_ui * 0.5);
  }
  
  // Actor preferences
  if (sig.actor_type === 'machine_only') {
    search_engines = 0;
    human_ui = 0;
    ai_agents = 300;
  }
  
  return { search_engines, ai_agents, human_ui };
}

/**
 * Determine language strictness
 */
export function determineLanguageStrictness(sig: QueryIntentSignature): LanguageStrictness {
  if (sig.risk_level === 'high') return 'locked';
  if (sig.risk_level === 'moderate' && sig.actor_type === 'academic') return 'strict';
  if (sig.cognitive_load === 'high') return 'standard';
  return 'flexible';
}

/**
 * Create full matrix entry from signature
 */
export function createMatrixEntry(sig: QueryIntentSignature): QueryIntentMatrixEntry {
  const limits = calculateExpansionLimits(sig);
  const exposure = calculateExposure(sig);
  const strictness = determineLanguageStrictness(sig);
  
  return {
    signature: sig,
    signature_code: createSignatureCode(sig),
    max_variations: limits.max_variations,
    templates_allowed: getTemplatesForSignature(sig),
    safe_for_auto_citation: limits.safe_for_auto_citation,
    expose_publicly: limits.expose_publicly,
    exposure,
    language_strictness: strictness,
    requires_methodology: sig.cognitive_load === 'high' || sig.actor_type === 'academic',
    requires_uncertainty: sig.risk_level !== 'minimal',
  };
}

/**
 * Get allowed templates for a signature
 */
function getTemplatesForSignature(sig: QueryIntentSignature): string[] {
  const baseTemplates: Record<InformationType, string[]> = {
    level: ['T-LEVEL-001', 'T-LEVEL-002', 'T-LEVEL-003'],
    trend: ['T-TREND-001', 'T-TREND-002', 'T-TREND-003', 'T-TREND-004'],
    comparison: ['T-COMP-001', 'T-COMP-002', 'T-COMP-003', 'T-COMP-004'],
    distribution: ['T-DIST-001', 'T-DIST-002'],
    composition: ['T-COMP-001', 'T-COMP-002'],
    correlation: ['T-CORR-001', 'T-CORR-002'],
    ranking: ['T-RANK-001', 'T-RANK-002', 'T-RANK-003', 'T-RANK-004'],
  };
  
  let templates = baseTemplates[sig.information_type] || [];
  
  // Reduce templates for high risk
  if (sig.risk_level === 'high') {
    templates = templates.slice(0, 2);
  }
  
  return templates;
}

/**
 * SEMANTIC FINGERPRINT
 * Anti-duplicering by design
 */
export interface SemanticFingerprint {
  readonly hash: string;
  readonly components: {
    readonly intent: InformationType;
    readonly variable: string;
    readonly entity: string;
    readonly time: string;
  };
}

/**
 * Create semantic fingerprint for a query
 */
export function createSemanticFingerprint(
  intent: InformationType,
  variable: string,
  entity: string,
  time: string
): SemanticFingerprint {
  // Simple hash function for demo (use crypto in production)
  const input = `${intent}|${variable}|${entity}|${time}`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return {
    hash: `SF-${Math.abs(hash).toString(36).toUpperCase()}`,
    components: { intent, variable, entity, time },
  };
}

/**
 * MATRIX STATISTICS
 */
export function getMatrixStatistics() {
  const infoTypes: InformationType[] = ['level', 'trend', 'comparison', 'distribution', 'composition', 'correlation', 'ranking'];
  const loads: CognitiveLoad[] = ['zero', 'low', 'medium', 'high'];
  const actors: ActorType[] = ['general', 'journalism', 'finance', 'policy', 'corporate', 'academic', 'machine_only'];
  const risks: RiskLevel[] = ['minimal', 'moderate', 'high'];
  
  return {
    total_possible_signatures: infoTypes.length * loads.length * actors.length * risks.length,
    axes: {
      information_types: infoTypes.length,
      cognitive_loads: loads.length,
      actor_types: actors.length,
      risk_levels: risks.length,
    },
    optimal_combinations: {
      search_engine_friendly: ['level', 'trend', 'comparison', 'ranking'],
      ai_agent_friendly: ['level', 'trend', 'comparison', 'correlation'],
      human_ui_friendly: ['level', 'trend', 'ranking'],
    },
  };
}

/**
 * QUERY INTENT MATRIX PRINCIPLES
 */
export const QUERY_INTENT_MATRIX_PRINCIPLES = {
  every_query_has_exact_position: true,
  four_axes_define_all_queries: true,
  signature_controls_generation: true,
  no_semantic_divergence: true,
  deterministic_expansion: true,
} as const;
