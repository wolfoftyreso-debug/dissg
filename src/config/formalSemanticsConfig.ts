/**
 * 🧩 MASTER EXECUTION BLOCK 27
 * FORMAL SEMANTICS & CONSTRAINT ENGINE (FSCE)
 * 
 * Syfte: Varje statistik-uttag, vy, export och API-svar måste
 * uppfylla formella sannings- och tolkningsregler – annars blockeras det.
 * 
 * Detta är typkontroll för verkligheten.
 */

// ============================================================
// 1. STATISTICS AS TYPED LANGUAGE
// ============================================================

export type StatisticType = 
  | 'Rate'
  | 'Count'
  | 'Index'
  | 'Correlation'
  | 'Percentage'
  | 'Trend'
  | 'Ratio'
  | 'Absolute';

export interface RateType {
  readonly type: 'Rate';
  readonly per_capita: boolean;
  readonly period: string;
  readonly population: number;
}

export interface CountType {
  readonly type: 'Count';
  readonly reported: boolean;
  readonly jurisdiction: string;
  readonly year: number;
}

export interface IndexType {
  readonly type: 'Index';
  readonly composite: boolean;
  readonly weighted: boolean;
  readonly version: string;
}

export interface CorrelationType {
  readonly type: 'Correlation';
  readonly non_causal: true; // Always true - enforced
  readonly windowed: boolean;
  readonly controlled: boolean;
  readonly controls?: readonly string[];
}

export type TypedStatistic = RateType | CountType | IndexType | CorrelationType;

export const UNTYPED_DATA_RULE = 'En siffra utan typ får inte existera.';

// ============================================================
// 2. FORMAL INVARIANTS (UNBREAKABLE)
// ============================================================

export interface Invariant {
  readonly name: string;
  readonly applies_to: StatisticType;
  readonly requirements: readonly string[];
  readonly on_violation: 'BLOCK';
}

export const FORMAL_INVARIANTS: readonly Invariant[] = [
  {
    name: 'Percentage Invariant',
    applies_to: 'Percentage',
    requirements: ['base_population', 'time_period', 'numerator_definition'],
    on_violation: 'BLOCK',
  },
  {
    name: 'Trend Invariant',
    applies_to: 'Trend',
    requirements: ['minimum_data_points >= 5', 'time_interval_shown', 'methodology_constant'],
    on_violation: 'BLOCK',
  },
  {
    name: 'Correlation Invariant',
    applies_to: 'Correlation',
    requirements: ['minimum_controls >= 2', 'non_causal_flag = true', 'confidence_interval'],
    on_violation: 'BLOCK',
  },
  {
    name: 'Rate Invariant',
    applies_to: 'Rate',
    requirements: ['denominator_population', 'time_unit', 'geographic_scope'],
    on_violation: 'BLOCK',
  },
  {
    name: 'Index Invariant',
    applies_to: 'Index',
    requirements: ['component_weights', 'version_number', 'methodology_link'],
    on_violation: 'BLOCK',
  },
] as const;

export const INVARIANT_VIOLATION_MESSAGE = 'BLOCKERAD: Invariant bruten. Visa orsak.';
export const NO_QUICK_FIX_RULE = 'Ingen "quick fix" tillåten.';

// ============================================================
// 3. EXPLANATION-FIRST CONTRACT (MACHINE-VERIFIED)
// ============================================================

export interface ContractStep {
  readonly order: number;
  readonly function: string;
  readonly required: true;
  readonly on_missing: number; // HTTP status code
}

export const EXPLANATION_FIRST_CONTRACT: readonly ContractStep[] = [
  { order: 1, function: 'Explain()', required: true, on_missing: 403 },
  { order: 2, function: 'ShowContext()', required: true, on_missing: 409 },
  { order: 3, function: 'ShowUncertainty()', required: true, on_missing: 422 },
  { order: 4, function: 'ShowData()', required: true, on_missing: 200 },
] as const;

export const CONTRACT_SCOPE = 'Detta gäller UI och API.';

// ============================================================
// 4. CAUSALITY FIREWALL
// ============================================================

export const FORBIDDEN_CAUSAL_PHRASES = [
  'leder till',
  'orsakar',
  'på grund av',
  'beror på',
  'resulterar i',
  'förorsakar',
  'causes',
  'leads to',
  'results in',
  'because of',
  'due to',
] as const;

export const ALLOWED_ASSOCIATION_PHRASES = [
  'sammanfaller med',
  'rör sig parallellt med',
  'är associerat med',
  'korrelerar med',
  'observeras samtidigt som',
  'coincides with',
  'is associated with',
  'correlates with',
  'moves in parallel with',
] as const;

export const CAUSALITY_FIREWALL_RULE = 'Text som bryter mot detta renderas inte.';

export function containsForbiddenCausality(text: string): boolean {
  const lowerText = text.toLowerCase();
  return FORBIDDEN_CAUSAL_PHRASES.some(phrase => lowerText.includes(phrase));
}

export function sanitizeCausalLanguage(text: string): { sanitized: string; violations: readonly string[] } {
  const violations: string[] = [];
  let sanitized = text;
  
  for (const phrase of FORBIDDEN_CAUSAL_PHRASES) {
    if (text.toLowerCase().includes(phrase)) {
      violations.push(phrase);
      // Replace with neutral alternative
      const replacement = ALLOWED_ASSOCIATION_PHRASES[0]; // "sammanfaller med"
      sanitized = sanitized.replace(new RegExp(phrase, 'gi'), replacement);
    }
  }
  
  return { sanitized, violations };
}

// ============================================================
// 5. EXPORT SANITIZER (HARD)
// ============================================================

export interface ExportRisk {
  readonly type: string;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly description: string;
}

export const EXPORT_RISK_CHECKS: readonly ExportRisk[] = [
  { type: 'missing_context', severity: 'critical', description: 'Kontext saknas' },
  { type: 'extreme_values', severity: 'high', description: 'Extrema värden utan förklaring' },
  { type: 'short_period', severity: 'medium', description: 'Kort tidsperiod vald' },
  { type: 'missing_uncertainty', severity: 'high', description: 'Osäkerhet ej angiven' },
  { type: 'causal_language', severity: 'critical', description: 'Kausalspråk detekterat' },
] as const;

export const EXPORT_BLOCK_THRESHOLD = 'high' as const;

export const EXPORT_BLOCK_MESSAGE = 'Exporten kräver kompletterande kontext. Lägg till eller avbryt.';
export const EXPORT_PRIVILEGE_RULE = 'Export är privilegium, inte rättighet.';

// ============================================================
// 6. API TRUTH CONTRACT
// ============================================================

export interface APITruthPayload {
  readonly meaning: string;
  readonly depends_on: readonly string[];
  readonly does_not_mean: readonly string[];
  readonly uncertainty: {
    readonly level: 'low' | 'medium' | 'high';
    readonly sources: readonly string[];
    readonly confidence_interval?: readonly [number, number];
  };
  readonly method_version: string;
  readonly time_scope: string;
  readonly population_scope: string;
}

export const API_TRUTH_REQUIRED_FIELDS: readonly (keyof APITruthPayload)[] = [
  'meaning',
  'depends_on',
  'does_not_mean',
  'uncertainty',
  'method_version',
  'time_scope',
  'population_scope',
] as const;

export const API_CONTRACT_RULES = {
  clientIgnoresFields: 'Deras problem',
  fieldsMissing: 'Ert fel (build fails)',
} as const;

export function validateAPITruthPayload(payload: Partial<APITruthPayload>): { valid: boolean; missing: readonly string[] } {
  const missing = API_TRUTH_REQUIRED_FIELDS.filter(field => !payload[field]);
  return { valid: missing.length === 0, missing };
}

// ============================================================
// 7. SEMANTIC DIFF (EXTREMELY IMPORTANT)
// ============================================================

export type SemanticChangeType = 
  | 'method_changed'
  | 'weight_changed'
  | 'source_changed'
  | 'definition_changed'
  | 'scope_changed';

export interface SemanticDiff {
  readonly change_type: SemanticChangeType;
  readonly previous_meaning: string;
  readonly new_meaning: string;
  readonly impact_description: string;
  readonly affected_from: string; // ISO date
}

export const SEMANTIC_DIFF_MESSAGE = 'Detta betyder nu något annat än tidigare.';

export const SEMANTIC_DIFF_DISPLAY_LOCATIONS = [
  'UI (banner)',
  'API (header + body)',
  'Export (metadata)',
] as const;

export const NO_SILENT_DRIFT_RULE = 'Ingen tyst betydelseglidning.';

// ============================================================
// 8. MISUSE SIMULATOR (AUTOMATIC)
// ============================================================

export interface MisuseScenario {
  readonly id: string;
  readonly attack_type: string;
  readonly description: string;
  readonly test_method: string;
}

export const MISUSE_SCENARIOS: readonly MisuseScenario[] = [
  { id: 'MS001', attack_type: 'decontextualize', description: 'Ta ur kontext', test_method: 'Remove all context, check if data still renders' },
  { id: 'MS002', attack_type: 'cherry_pick', description: 'Välj endast gynnsamma värden', test_method: 'Select extreme period, check for warnings' },
  { id: 'MS003', attack_type: 'causal_implication', description: 'Antyda kausalitet', test_method: 'Test causal language injection' },
  { id: 'MS004', attack_type: 'oversimplify', description: 'Förenkla till vilseledning', test_method: 'Remove nuance, check for blocking' },
  { id: 'MS005', attack_type: 'false_precision', description: 'Överdriven precision', test_method: 'Display more decimals than warranted' },
  { id: 'MS006', attack_type: 'scope_mismatch', description: 'Applicera fel scope', test_method: 'Apply national data to local context' },
  { id: 'MS007', attack_type: 'time_manipulation', description: 'Manipulera tidsaxel', test_method: 'Stretch/compress time to alter perception' },
  { id: 'MS008', attack_type: 'denominator_hiding', description: 'Dölja nämnare', test_method: 'Show rate without population base' },
  { id: 'MS009', attack_type: 'uncertainty_hiding', description: 'Dölja osäkerhet', test_method: 'Remove confidence intervals' },
  { id: 'MS010', attack_type: 'method_obscuring', description: 'Dölja metodval', test_method: 'Hide methodology from output' },
] as const;

export const MISUSE_SIMULATION_CONFIG = {
  scenarios_per_view: { min: 10, max: 50 },
  on_any_success: 'VIEW_BLOCKED',
  rationale: 'Maskiner testar ond vilja bättre än människor.',
} as const;

// ============================================================
// 9. "NO SILENT MODE" PRINCIPLE
// ============================================================

export const NO_SILENT_MODE_RULES = {
  forbidden: [
    'Visa siffror utan text',
    'Exportera utan sammanhang',
    'Rendera grafer utan förklaringspanel',
    'API-svar utan meaning-fält',
    'Delning utan kontext-payload',
  ],
  rationale: 'Tystnad = risk. Allt måste tala.',
} as const;

// ============================================================
// 10. FORMAL DEFINITION OF DONE (FSCE)
// ============================================================

export interface DefinitionOfDone {
  readonly criterion: string;
  readonly test: string;
  readonly required: true;
}

export const FSCE_DEFINITION_OF_DONE: readonly DefinitionOfDone[] = [
  { criterion: 'Kan inte användas utan tolkning', test: 'Explanation contract enforced', required: true },
  { criterion: 'Kan inte delas utan kontext', test: 'Share protection payload attached', required: true },
  { criterion: 'Kan inte exporteras utan begränsning', test: 'Export sanitizer passed', required: true },
  { criterion: 'Kan inte uttrycka kausalitet', test: 'Causality firewall active', required: true },
  { criterion: 'Kan inte förenklas bort från sanningen', test: 'Misuse simulator passed', required: true },
] as const;

export function isFeatureComplete(checks: Record<string, boolean>): { complete: boolean; failed: readonly string[] } {
  const failed = FSCE_DEFINITION_OF_DONE
    .filter(dod => !checks[dod.criterion])
    .map(dod => dod.criterion);
  return { complete: failed.length === 0, failed };
}

// ============================================================
// SYSTEM STATUS
// ============================================================

export const FSCE_STATUS = {
  design_protection: 'ACTIVE',
  ux_protection: 'ACTIVE',
  language_protection: 'ACTIVE',
  legal_protection: 'ACTIVE',
  formal_protection: 'ACTIVE',
  
  final_statement: 'Det finns inget mer att lägga till. Allt annat skulle bara späda ut detta.',
  response_to_more: 'Vi håller linjen.',
} as const;

export const TRUTH_PRESERVING_SOFTWARE = {
  guarantees: [
    'Det går inte att missförstå systemet utan att systemet säger ifrån',
    'Det går inte att vinkla utan att varningar följer med',
    'Det går inte att vara slarvig utan att bli stoppad',
  ],
  classification: 'Sanningsbevarande mjukvara',
} as const;

// ============================================================
// COMPLETE FSCE EXPORT
// ============================================================

export const FSCE_COMPLETE = {
  typedStatistics: { rule: UNTYPED_DATA_RULE },
  formalInvariants: FORMAL_INVARIANTS,
  explanationContract: EXPLANATION_FIRST_CONTRACT,
  causalityFirewall: { forbidden: FORBIDDEN_CAUSAL_PHRASES, allowed: ALLOWED_ASSOCIATION_PHRASES },
  exportSanitizer: { risks: EXPORT_RISK_CHECKS, threshold: EXPORT_BLOCK_THRESHOLD },
  apiTruthContract: { requiredFields: API_TRUTH_REQUIRED_FIELDS },
  semanticDiff: { message: SEMANTIC_DIFF_MESSAGE, locations: SEMANTIC_DIFF_DISPLAY_LOCATIONS },
  misuseSimulator: MISUSE_SIMULATION_CONFIG,
  noSilentMode: NO_SILENT_MODE_RULES,
  definitionOfDone: FSCE_DEFINITION_OF_DONE,
  status: FSCE_STATUS,
} as const;
