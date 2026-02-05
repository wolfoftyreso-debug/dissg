 /**
  * ANSWER LAYER - CORE TYPES
  * 
  * The locked schema for Answer Packets.
  * All 300 search intents resolve to ~75 packets using this structure.
  */
 
 import type { TemporalEnvelope, SourceEnvelope, UncertaintyEnvelope } from '../core/ontology';
 
 /**
  * ANSWER PACKET CATEGORIES (LOCKED)
  */
 export const ANSWER_DOMAINS = [
   'population',
   'economy', 
   'health',
   'education',
   'crime',
   'migration',
   'housing',
   'environment',
   'governance',
   'labor',
   'welfare',
   'ranking',
 ] as const;
 
 export type AnswerDomain = typeof ANSWER_DOMAINS[number];
 
 /**
  * INTENT TYPES (what the user wants to know)
  */
 export const INTENT_TYPES = [
   'quantity',      // "How many...?"
   'trend',         // "Is it increasing...?"
   'structure',     // "What's the breakdown...?"
   'causation',     // "Why...?" (ALWAYS conditional)
   'comparison',    // "How does X compare to Y?"
 ] as const;
 
 export type IntentType = typeof INTENT_TYPES[number];
 
 /**
  * ANSWER PACKET SCHEMA (IMMUTABLE STRUCTURE)
  * 
  * Every Answer Packet MUST contain all fields.
  * No field is optional. Silence over speculation.
  */
 export interface AnswerPacket {
   // === IDENTIFICATION ===
   readonly packet_id: string;           // e.g., "population_basic"
   readonly domain: AnswerDomain;
   readonly version: number;
   readonly created_at: string;
   readonly supersedes: string | null;
   
   // === QUESTION MAPPING ===
   readonly canonical_question: string;  // The "pure" form
   readonly intent_type: IntentType;
   readonly variant_patterns: readonly string[];  // Regex patterns
   readonly blocked_variants: readonly string[];  // Forbidden phrasings
   
   // === DATA REQUIREMENTS ===
   readonly required_measures: readonly string[];   // Schema IDs
   readonly required_entities: readonly string[];   // Entity types
   readonly minimum_coverage: number;               // 0-1, below = no answer
   readonly temporal_requirement: TemporalRequirement;
   
   // === OUTPUT TEMPLATE ===
   readonly answer_template: AnswerTemplate;
   
   // === CONSTRAINTS (ALWAYS SHOWN) ===
   readonly mandatory_disclaimers: readonly string[];
   readonly comparison_limits: readonly ComparisonLimit[];
   readonly causation_blocked: boolean;  // If true, never claim causation
   
   // === METADATA ===
   readonly source_requirements: SourceRequirement;
   readonly refresh_policy: RefreshPolicy;
 }
 
 /**
  * TEMPORAL REQUIREMENT
  */
 export interface TemporalRequirement {
   readonly minimum_points: number;      // Min data points needed
   readonly maximum_age_days: number;    // Data staleness limit
   readonly preferred_granularity: 'day' | 'month' | 'quarter' | 'year';
   readonly trend_minimum_years: number; // For trend detection
 }
 
 /**
  * ANSWER TEMPLATE (A2F - Always Answer Format)
  * 
  * Six mandatory sections, never optional.
  */
 export interface AnswerTemplate {
   // Section 1: Direct Answer
   readonly fact_template: string;       // "The {measure} in {entity} is {value} {unit}."
   
   // Section 2: Mechanism (if applicable)
   readonly mechanism_template: string | null;
   
   // Section 3: Timeline
   readonly timeline_template: string;   // "Over the past {years} years, {trend}."
   
   // Section 4: Comparison
   readonly comparison_template: string; // "Compared to {baseline}, this is {relative}."
   
   // Section 5: Uncertainty (ALWAYS SHOWN)
   readonly uncertainty_template: string;
   
   // Section 6: Drill-down links
   readonly deeplinks: readonly DeeplinkTemplate[];
 }
 
 /**
  * DEEPLINK TEMPLATE
  */
 export interface DeeplinkTemplate {
   readonly label: string;
   readonly path_template: string;  // "/entity/{entity_id}/measure/{measure_id}"
   readonly condition: string | null;  // When to show
 }
 
 /**
  * COMPARISON LIMITS
  * 
  * Explicit rules for what comparisons are valid.
  */
 export interface ComparisonLimit {
   readonly entity_type_a: string;
   readonly entity_type_b: string;
   readonly is_valid: boolean;
   readonly reason: string;
   readonly adjustment_required: string | null;  // e.g., "PPP adjustment"
 }
 
 /**
  * SOURCE REQUIREMENTS
  */
 export interface SourceRequirement {
   readonly minimum_reliability: number;  // 0-1
   readonly preferred_sources: readonly string[];  // Source IDs
   readonly forbidden_sources: readonly string[];
   readonly requires_official: boolean;
 }
 
 /**
  * REFRESH POLICY
  */
 export interface RefreshPolicy {
   readonly check_interval_hours: number;
   readonly stale_after_days: number;
   readonly archive_after_days: number;
 }
 
 /**
  * ANSWER PACKET REGISTRY TYPE
  */
 export type AnswerPacketRegistry = Record<string, AnswerPacket>;
 
 /**
  * PACKET STATUS
  */
 export const PACKET_STATUS = ['draft', 'stable', 'deprecated'] as const;
 export type PacketStatus = typeof PACKET_STATUS[number];
 
 /**
  * ANSWER PACKET SCHEMA V2 (IMMUTABLE STRUCTURE)
  * 
  * Matches the YAML contract specification exactly.
  */
 export interface AnswerPacketV2 {
   // === IDENTIFICATION ===
   readonly id: string;                  // e.g., "answer:population_country_basic:v1"
   readonly status: PacketStatus;
   readonly version: number;
   readonly created_at: string;
   readonly supersedes: string | null;
   
   // === INTENT MAPPING ===
   readonly intent: {
     readonly domain: AnswerDomain;
     readonly category: 'quantitative' | 'trend' | 'structural' | 'comparative';
     readonly question_patterns: readonly string[];
     readonly blocked_patterns: readonly string[];
   };
   
   // === INPUT REQUIREMENTS ===
   readonly inputs: {
     readonly required: readonly string[];  // e.g., ["entity.country"]
     readonly optional: readonly string[];  // e.g., ["time.point"]
   };
   
   // === DEFINITION REQUIREMENTS ===
   readonly definition_requirements: readonly {
     readonly measure: string;
     readonly required: boolean;
   }[];
   
   // === QUERY SPECIFICATION ===
   readonly query: {
     readonly dsl_ref: string;
     readonly constraints: {
       readonly aggregation: 'none' | 'sum' | 'average' | 'explicit_only';
       readonly alignment: 'exact_definition' | 'compatible_definition';
       readonly source_policy: 'single' | 'allow_multiple' | 'consensus_required';
     };
   };
   
   // === DEFAULTS ===
   readonly defaults: {
     readonly time: {
       readonly strategy: 'latest_available' | 'explicit_required' | 'range_required';
     };
     readonly sources: {
       readonly prefer: readonly string[];
     };
   };
   
   // === OUTPUT TEMPLATES ===
   readonly output: {
     readonly formats: {
       readonly text: {
         readonly template: string;
         readonly footnotes: readonly string[];
       };
       readonly json: {
         readonly include: readonly string[];
       };
     };
   };
   
   // === CONFIDENCE REQUIREMENTS ===
   readonly confidence: {
     readonly required: boolean;
     readonly fields: readonly string[];
     readonly minimum_coverage: number;
   };
   
   // === HARD LIMITS (SPÄRRAR) ===
   readonly limits: {
     readonly causal_claims: 'forbidden' | 'conditional_only';
     readonly ranking: 'forbidden' | 'with_disclaimer';
     readonly aggregation: 'forbidden' | 'explicit_only';
     readonly extrapolation: 'forbidden';
   };
 }
 
 /**
  * INTENT MATCH RESULT
  */
 export interface IntentMatch {
   readonly packet_id: string;
   readonly confidence: number;
   readonly extracted_params: Record<string, string>;
   readonly matched_pattern: string;
 }
 
 /**
  * GENERATED ANSWER
  */
 export interface GeneratedAnswer {
   readonly packet_id: string;
   readonly success: boolean;
   readonly text: string | null;
   readonly json: Record<string, unknown> | null;
   readonly footnotes: readonly string[];
   readonly confidence: {
     readonly coverage: number;
     readonly source_agreement: number;
   };
   readonly error: string | null;
 }
 
 /**
  * LLM CONTRACT (what LLM is allowed to do)
  */
 export interface LLMContract {
   readonly role: 'answer_consumer';
   readonly permissions: readonly string[];
   readonly prohibitions: readonly string[];
 }
 
 export const LLM_CONTRACT: LLMContract = {
   role: 'answer_consumer',
   permissions: [
     'Match question to Answer Packet',
     'Extract parameters (country, year)',
     'Present generated answer verbatim',
     'Ask for clarification if packet constraints fail',
   ],
   prohibitions: [
     'Choose or infer definitions',
     'Aggregate data',
     'Draw conclusions beyond template',
     'Fill gaps with inference',
     'Summarize beyond provided template',
     'Add interpretation or opinion',
     'Rank without explicit packet permission',
   ],
 };