 /**
  * TRUTH INTENT CLASSIFICATION
  * 
  * Maps from "what people ask" to "what type of truth is requested".
  * This abstracts away from specific formulations to intent categories.
  */
 
 /**
  * TRUTH INTENT TYPES (LOCKED)
  * These are the only types of truth that can be requested.
  */
 export const TRUTH_INTENT_TYPES = {
   QUANTITY: 'quantity',           // "How many...?"
   CHANGE: 'change',               // "Is it increasing?"
   STRUCTURE: 'structure',         // "What is the breakdown?"
   COMPARISON: 'comparison',       // "How does X compare to Y?"
   CAUSATION: 'causation',         // "Why...?" (ALWAYS LIMITED)
   SCENARIO: 'scenario',           // "What if...?" (ALWAYS HYPOTHETICAL)
   RANKING: 'ranking',             // "Which is highest?" (ALWAYS CONDITIONAL)
   DEFINITION: 'definition',       // "What does X mean?"
 } as const;
 
 export type TruthIntentType = typeof TRUTH_INTENT_TYPES[keyof typeof TRUTH_INTENT_TYPES];
 
 /**
  * INTENT RISK CLASSIFICATION
  */
 export const INTENT_RISK_LEVELS = {
   SAFE: 'safe',           // Can answer directly
   GUARDED: 'guarded',     // Can answer with disclaimers
   DANGEROUS: 'dangerous', // Must reframe or refuse
 } as const;
 
 export type IntentRiskLevel = typeof INTENT_RISK_LEVELS[keyof typeof INTENT_RISK_LEVELS];
 
 /**
  * INTENT CLASSIFICATION RESULT
  */
 export interface IntentClassification {
   readonly intent_type: TruthIntentType;
   readonly risk_level: IntentRiskLevel;
   readonly confidence: number;
   readonly requires_disclaimer: boolean;
   readonly required_qualifiers: readonly string[];
   readonly forbidden_outputs: readonly string[];
 }
 
 /**
  * CLASSIFICATION PATTERNS
  */
 const INTENT_PATTERNS: Record<TruthIntentType, {
   patterns: RegExp[];
   risk: IntentRiskLevel;
   requires_disclaimer: boolean;
   required_qualifiers: string[];
   forbidden_outputs: string[];
 }> = {
   quantity: {
     patterns: [
       /how many/i,
       /how much/i,
       /what is the (number|amount|total|count)/i,
       /population of/i,
       /\b(gdp|income|rate)\b.*\b(in|of)\b/i,
     ],
     risk: 'safe',
     requires_disclaimer: false,
     required_qualifiers: [],
     forbidden_outputs: ['causal_claim', 'prediction'],
   },
   
   change: {
     patterns: [
       /is (it|the|this) (increasing|decreasing|growing|shrinking)/i,
       /has (it|the|this) (increased|decreased|changed)/i,
       /trend/i,
       /over time/i,
       /how fast/i,
     ],
     risk: 'safe',
     requires_disclaimer: false,
     required_qualifiers: ['time_range'],
     forbidden_outputs: ['causal_claim', 'prediction'],
   },
   
   structure: {
     patterns: [
       /breakdown/i,
       /distribution/i,
       /by (age|sex|region|income)/i,
       /what (percentage|share|proportion)/i,
     ],
     risk: 'safe',
     requires_disclaimer: false,
     required_qualifiers: ['dimension'],
     forbidden_outputs: ['causal_claim'],
   },
   
   comparison: {
     patterns: [
       /compare/i,
       /vs\.?/i,
       /versus/i,
       /difference between/i,
       /how does .* compare/i,
     ],
     risk: 'guarded',
     requires_disclaimer: true,
     required_qualifiers: ['definition_match', 'temporal_alignment'],
     forbidden_outputs: ['normative_judgment', 'causal_claim'],
   },
   
   causation: {
     patterns: [
       /why/i,
       /what causes/i,
       /because/i,
       /reason for/i,
       /explain/i,
       /due to/i,
     ],
     risk: 'dangerous',
     requires_disclaimer: true,
     required_qualifiers: ['correlation_only', 'alternative_explanations', 'data_limits'],
     forbidden_outputs: ['causal_claim', 'single_explanation', 'definitive_cause'],
   },
   
   scenario: {
     patterns: [
       /what if/i,
       /what would happen/i,
       /what will happen/i,
       /if .* continues/i,
       /in the future/i,
       /by 2\d{3}/i,
     ],
     risk: 'dangerous',
     requires_disclaimer: true,
     required_qualifiers: ['model_disclosure', 'assumption_set', 'confidence_low'],
     forbidden_outputs: ['prediction_as_fact', 'certainty_language'],
   },
   
   ranking: {
     patterns: [
       /which (is|country|region) (best|worst|highest|lowest)/i,
       /rank/i,
       /top \d+/i,
       /best .* (country|countries)/i,
       /number one/i,
     ],
     risk: 'dangerous',
     requires_disclaimer: true,
     required_qualifiers: ['weighting_disclosure', 'sensitivity_analysis'],
     forbidden_outputs: ['absolute_ranking', 'normative_best'],
   },
   
   definition: {
     patterns: [
       /what (is|does|means)/i,
       /define/i,
       /definition of/i,
       /how is .* measured/i,
     ],
     risk: 'safe',
     requires_disclaimer: false,
     required_qualifiers: ['source_of_definition'],
     forbidden_outputs: [],
   },
 };
 
 /**
  * CLASSIFY INTENT
  */
 export function classifyIntent(question: string): IntentClassification {
   let bestMatch: TruthIntentType = 'quantity';  // Default
   let bestConfidence = 0;
   
   for (const [intentType, config] of Object.entries(INTENT_PATTERNS)) {
     for (const pattern of config.patterns) {
       if (pattern.test(question)) {
         // Calculate confidence based on pattern specificity
         const confidence = pattern.source.length / 50; // Longer patterns = more specific
         
         if (confidence > bestConfidence) {
           bestConfidence = Math.min(confidence, 1);
           bestMatch = intentType as TruthIntentType;
         }
       }
     }
   }
   
   const config = INTENT_PATTERNS[bestMatch];
   
   return {
     intent_type: bestMatch,
     risk_level: config.risk,
     confidence: bestConfidence,
     requires_disclaimer: config.requires_disclaimer,
     required_qualifiers: config.required_qualifiers,
     forbidden_outputs: config.forbidden_outputs,
   };
 }
 
 /**
  * CHECK IF INTENT IS ANSWERABLE
  */
 export function isAnswerable(classification: IntentClassification): {
   answerable: boolean;
   reason: string | null;
   reframe_suggestion: string | null;
 } {
   // Safe intents are always answerable
   if (classification.risk_level === 'safe') {
     return { answerable: true, reason: null, reframe_suggestion: null };
   }
   
   // Guarded intents are answerable with qualifications
   if (classification.risk_level === 'guarded') {
     return { 
       answerable: true, 
       reason: 'Requires disclaimers', 
       reframe_suggestion: null 
     };
   }
   
   // Dangerous intents need reframing
   if (classification.intent_type === 'causation') {
     return {
       answerable: false,
       reason: 'Causal claims require controlled experiments we cannot provide',
       reframe_suggestion: 'Would you like to see known correlations instead?',
     };
   }
   
   if (classification.intent_type === 'scenario') {
     return {
       answerable: false,
       reason: 'Predictions require assumptions that may not hold',
       reframe_suggestion: 'Would you like to see historical patterns instead?',
     };
   }
   
   if (classification.intent_type === 'ranking') {
     return {
       answerable: false,
       reason: 'Rankings depend on weighting choices',
       reframe_suggestion: 'Would you like to see the data with your chosen weighting?',
     };
   }
   
   return { answerable: true, reason: null, reframe_suggestion: null };
 }