 /**
  * ANSWER PACKET GENERATOR (META-LAYER)
  * 
  * Automatically generates permitted Answer Packets from ontology.
  * If a packet cannot be derived from ontology + rules → it cannot exist.
  */
 
 import type { AnswerPacketV2, AnswerDomain, PacketStatus } from '../types';
 import { BASE_CLASSES } from '../../core/ontology';
 
 /**
  * DERIVABLE PACKET TYPES
  * These are the only packet structures that can be auto-generated.
  */
 export const DERIVABLE_TYPES = [
   'basic',           // Single measure, single entity, point-in-time
   'latest',          // Single measure, single entity, most recent
   'historical',      // Single measure, single entity, time range
   'trend',           // Single measure, single entity, direction over time
   'comparison',      // Single measure, two entities, same time
   'structure',       // Multiple measures, single entity, breakdown
   'ranking_conditional', // Single measure, multiple entities, WITH DISCLAIMER
 ] as const;
 
 export type DerivableType = typeof DERIVABLE_TYPES[number];
 
 /**
  * MEASURE DEFINITION (from ontology)
  */
 export interface MeasureDefinition {
   readonly id: string;
   readonly name: string;
   readonly domain: AnswerDomain;
   readonly unit: string;
   readonly entity_type: string;
   readonly temporal_resolution: 'point' | 'period' | 'range';
   readonly aggregatable: boolean;
   readonly comparable: boolean;
 }
 
 /**
  * GENERATION RULES
  * Each rule defines what packet types a measure can generate.
  */
 export interface GenerationRule {
   readonly measure_pattern: string;  // Regex pattern
   readonly allowed_types: readonly DerivableType[];
   readonly constraints: {
     readonly requires_definition: boolean;
     readonly requires_source: boolean;
     readonly requires_temporal: boolean;
     readonly causal_claims: 'forbidden' | 'conditional_only';
     readonly ranking: 'forbidden' | 'with_disclaimer';
   };
 }
 
 /**
  * DEFAULT GENERATION RULES
  */
 export const DEFAULT_GENERATION_RULES: readonly GenerationRule[] = [
   {
     measure_pattern: '.*',  // All measures
     allowed_types: ['basic', 'latest', 'historical', 'trend', 'comparison'],
     constraints: {
       requires_definition: true,
       requires_source: true,
       requires_temporal: true,
       causal_claims: 'forbidden',
       ranking: 'with_disclaimer',
     },
   },
   {
     measure_pattern: '(index|score|composite)',  // Composite measures
     allowed_types: ['basic', 'latest', 'comparison', 'ranking_conditional'],
     constraints: {
       requires_definition: true,
       requires_source: true,
       requires_temporal: true,
       causal_claims: 'forbidden',
       ranking: 'with_disclaimer',  // ALWAYS with disclaimer
     },
   },
 ];
 
 /**
  * GENERATED PACKET TEMPLATE
  */
 function generatePacketId(measure: MeasureDefinition, type: DerivableType): string {
   return `answer:${measure.domain}_${measure.name}_${type}:v1`;
 }
 
 function generateQuestionPatterns(measure: MeasureDefinition, type: DerivableType): string[] {
   const patterns: string[] = [];
   
   switch (type) {
     case 'basic':
     case 'latest':
       patterns.push(
         `What is the ${measure.name} of {country}?`,
         `{country} ${measure.name}`,
         `How much ${measure.name} in {country}?`,
       );
       break;
     case 'trend':
       patterns.push(
         `Is ${measure.name} increasing or decreasing in {country}?`,
         `${measure.name} trend in {country}`,
         `How has ${measure.name} changed in {country}?`,
       );
       break;
     case 'comparison':
       patterns.push(
         `Compare ${measure.name} between {country_a} and {country_b}`,
         `{country_a} vs {country_b} ${measure.name}`,
       );
       break;
     case 'ranking_conditional':
       patterns.push(
         `Which country has the highest ${measure.name}?`,
         `Rank countries by ${measure.name}`,
       );
       break;
   }
   
   return patterns;
 }
 
 function generateBlockedPatterns(type: DerivableType): string[] {
   const blocked: string[] = [
     'why',           // Always blocked from quantitative packets
     'what causes',
     'what will happen',
     'should',
     'better',
     'worse',
   ];
   
   if (type !== 'ranking_conditional') {
     blocked.push('best', 'worst', 'rank');
   }
   
   return blocked;
 }
 
 /**
  * MAIN GENERATOR FUNCTION
  */
 export function generatePacketFromMeasure(
   measure: MeasureDefinition,
   type: DerivableType,
   rule: GenerationRule
 ): AnswerPacketV2 {
   // Validate that this type is allowed for this measure
   if (!rule.allowed_types.includes(type)) {
     throw new Error(`GEN-ERR-01: Type '${type}' not allowed for measure pattern '${rule.measure_pattern}'`);
   }
   
   const packet: AnswerPacketV2 = {
     id: generatePacketId(measure, type),
     status: 'stable' as PacketStatus,
     version: 1,
     created_at: new Date().toISOString(),
     supersedes: null,
     
     intent: {
       domain: measure.domain,
       category: type === 'trend' ? 'trend' : 
                 type === 'comparison' ? 'comparative' :
                 type === 'structure' ? 'structural' : 'quantitative',
       question_patterns: generateQuestionPatterns(measure, type),
       blocked_patterns: generateBlockedPatterns(type),
     },
     
     inputs: {
       required: type === 'comparison' 
         ? ['entity.country_a', 'entity.country_b']
         : ['entity.country'],
       optional: type === 'historical' || type === 'trend'
         ? ['time.range']
         : ['time.point'],
     },
     
     definition_requirements: [
       { measure: measure.id, required: true },
     ],
     
     query: {
       dsl_ref: `query.${measure.domain}_${type}:v1`,
       constraints: {
         aggregation: 'none',
         alignment: 'exact_definition',
         source_policy: type === 'comparison' ? 'consensus_required' : 'allow_multiple',
       },
     },
     
     defaults: {
       time: { 
         strategy: type === 'trend' || type === 'historical' 
           ? 'range_required' 
           : 'latest_available' 
       },
       sources: { prefer: [] },
     },
     
     output: {
       formats: {
         text: {
           template: `{value} ${measure.unit} in {country} as of {observed_at}.`,
           footnotes: [
             `Definition: ${measure.name}.`,
             'Source: {sources}',
           ],
         },
         json: {
           include: ['value', 'unit', 'observed_at', 'sources', 'confidence'],
         },
       },
     },
     
     confidence: {
       required: true,
       fields: ['coverage', 'source_agreement'],
       minimum_coverage: 0.9,
     },
     
     limits: {
       causal_claims: rule.constraints.causal_claims,
       ranking: rule.constraints.ranking,
       aggregation: 'forbidden',
       extrapolation: 'forbidden',
     },
   };
   
   return packet;
 }
 
 /**
  * GENERATE ALL VALID PACKETS FOR A MEASURE
  */
 export function generateAllPacketsForMeasure(
   measure: MeasureDefinition
 ): AnswerPacketV2[] {
   const packets: AnswerPacketV2[] = [];
   
   for (const rule of DEFAULT_GENERATION_RULES) {
     if (new RegExp(rule.measure_pattern).test(measure.name)) {
       for (const type of rule.allowed_types) {
         try {
           packets.push(generatePacketFromMeasure(measure, type, rule));
         } catch (error) {
           // Type not allowed, skip
           console.warn(`Skipping ${type} for ${measure.name}: ${error}`);
         }
       }
       break; // Use first matching rule
     }
   }
   
   return packets;
 }
 
 /**
  * VALIDATION: Can this packet be derived from ontology?
  */
 export function isDerivable(packet: AnswerPacketV2): boolean {
   // Must have definition requirements
   if (!packet.definition_requirements || packet.definition_requirements.length === 0) {
     return false;
   }
   
   // Must have temporal constraints
   if (!packet.defaults.time) {
     return false;
   }
   
   // Must have source requirements
   if (!packet.output.formats.text.footnotes.some(f => f.includes('Source'))) {
     return false;
   }
   
   // Must have hard limits
   if (!packet.limits || packet.limits.causal_claims !== 'forbidden') {
     // Causal packets need special derivation
     return false;
   }
   
   return true;
 }