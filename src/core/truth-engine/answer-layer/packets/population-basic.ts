 /**
  * ANSWER PACKET: population_basic
  * 
  * Covers search intents #1-5, #11-15, #21-25
  * "How many people live in X?"
  */
 
 import type { AnswerPacket } from '../types';
 
 export const POPULATION_BASIC: AnswerPacket = {
   // === IDENTIFICATION ===
   packet_id: 'population_basic',
   domain: 'population',
   version: 1,
   created_at: '2025-02-05T00:00:00Z',
   supersedes: null,
   
   // === QUESTION MAPPING ===
   canonical_question: 'What is the population of {entity}?',
   intent_type: 'quantity',
   variant_patterns: [
     'how many (people|inhabitants|residents) (live|are) in {entity}',
     'what is the population of {entity}',
     'population (of|in) {entity}',
     '{entity} population',
     'how big is {entity}',
   ],
   blocked_variants: [
     'how many immigrants',  // Different packet
     'how many foreigners',  // Loaded term
   ],
   
   // === DATA REQUIREMENTS ===
   required_measures: [
     'core:measure:population_resident:v1',
   ],
   required_entities: ['country', 'region', 'municipality'],
   minimum_coverage: 0.95,  // Need 95% of requested scope
   temporal_requirement: {
     minimum_points: 1,
     maximum_age_days: 365,
     preferred_granularity: 'year',
     trend_minimum_years: 5,
   },
   
   // === OUTPUT TEMPLATE (A2F) ===
   answer_template: {
     // Section 1: Direct fact
     fact_template: 
       'The population of {entity} is {value} {unit} as of {observed_at}.',
     
     // Section 2: Mechanism (null for basic quantity)
     mechanism_template: null,
     
     // Section 3: Timeline
     timeline_template:
       'Over the past {trend_years} years, the population has {trend_direction} by {trend_magnitude}%.',
     
     // Section 4: Comparison
     comparison_template:
       'This represents {percentage}% of {comparison_entity} and ranks #{rank} among {comparison_group}.',
     
     // Section 5: Uncertainty
     uncertainty_template:
       'This figure uses the {definition} definition. Confidence interval: {ci_lower} – {ci_upper}.',
     
     // Section 6: Deeplinks
     deeplinks: [
       {
         label: 'Age structure breakdown',
         path_template: '/entity/{entity_id}/population/age-structure',
         condition: null,
       },
       {
         label: 'Historical trend',
         path_template: '/entity/{entity_id}/population/timeline',
         condition: null,
       },
       {
         label: 'Regional comparison',
         path_template: '/entity/{entity_id}/population/compare',
         condition: 'entity_type === "country"',
       },
     ],
   },
   
   // === CONSTRAINTS ===
   mandatory_disclaimers: [
     'Population figures use the resident definition unless otherwise stated.',
     'Figures may differ from other sources due to definition differences.',
   ],
   comparison_limits: [
     {
       entity_type_a: 'country',
       entity_type_b: 'country',
       is_valid: true,
       reason: 'Direct comparison valid for total population.',
       adjustment_required: null,
     },
     {
       entity_type_a: 'municipality',
       entity_type_b: 'country',
       is_valid: false,
       reason: 'Scale mismatch makes direct comparison meaningless.',
       adjustment_required: 'per_capita',
     },
   ],
   causation_blocked: true,  // Population quantity cannot claim causation
   
   // === METADATA ===
   source_requirements: {
     minimum_reliability: 0.8,
     preferred_sources: [
       'core:source:scb_sweden:v1',
       'core:source:eurostat:v1',
       'core:source:un_desa:v1',
     ],
     forbidden_sources: [],
     requires_official: true,
   },
   refresh_policy: {
     check_interval_hours: 168,  // Weekly
     stale_after_days: 90,
     archive_after_days: 3650,   // 10 years
   },
 };