 /**
  * RANKING ANTIBODIES
  * 
  * Ranking is the most misused data format.
  * This module enforces strict constraints on all ranking outputs.
  */
 
 /**
  * RANKING CONSTRAINTS (HARD RULES)
  */
 export const RANKING_RULES = {
   NO_DEFAULT_RANKING: 'System never shows a "default" ranking',
   WEIGHTING_REQUIRED: 'All rankings must disclose weighting',
   SENSITIVITY_REQUIRED: 'Must show how ranking changes with different weights',
   NO_NORMATIVE_LANGUAGE: 'Never use "best", "worst" without qualification',
   EQUAL_VALIDITY_DISCLOSURE: 'Different weightings produce equally valid rankings',
 } as const;
 
 /**
  * RANKING RESPONSE STRUCTURE
  */
 export interface RankingResponse {
   readonly question_type: 'ranking';
   readonly response_mode: 'conditional';
   readonly weighting: WeightingDisclosure;
   readonly ranking: readonly RankedItem[];
   readonly sensitivity: SensitivityDisclosure;
   readonly disclaimers: readonly string[];
   readonly alternative_rankings: readonly AlternativeRanking[];
   readonly text_output: string;
 }
 
 export interface WeightingDisclosure {
   readonly weights: Record<string, number>;
   readonly weight_source: 'user_provided' | 'equal_weights' | 'literature_based';
   readonly weight_rationale: string;
   readonly total_weight: number;  // Must equal 1.0
 }
 
 export interface RankedItem {
   readonly entity: string;
   readonly rank: number;
   readonly score: number;
   readonly components: Record<string, number>;  // Individual indicator values
 }
 
 export interface SensitivityDisclosure {
   readonly most_volatile_rank: string;
   readonly rank_stability: 'stable' | 'moderate' | 'unstable';
   readonly weight_sensitivity: Record<string, string>;  // "If X weight +10%, rank changes by Y"
 }
 
 export interface AlternativeRanking {
   readonly weighting_name: string;
   readonly weights: Record<string, number>;
   readonly top_3: readonly string[];
   readonly difference_from_main: string;
 }
 
 /**
  * MANDATORY RANKING DISCLAIMERS
  */
 export const RANKING_DISCLAIMERS = [
   'This ranking reflects ONE possible weighting. Other weightings are equally valid.',
   'Rankings are sensitive to weighting choices. See sensitivity analysis.',
   'No single ranking can capture all dimensions of complex phenomena.',
   'The "best" according to this ranking may not be "best" by other criteria.',
   'Changing weights even slightly can significantly alter rankings.',
 ] as const;
 
 /**
  * FORBIDDEN RANKING LANGUAGE
  */
 export const FORBIDDEN_RANKING_TERMS = [
   'the best',
   'the worst', 
   'objectively ranked',
   'definitively',
   'clearly superior',
   'obviously better',
   'without question',
   'undeniably',
 ] as const;
 
 /**
  * PERMITTED RANKING LANGUAGE
  */
 export const PERMITTED_RANKING_LANGUAGE = [
   'ranks highest with this weighting',
   'under these criteria',
   'given these weights',
   'by this measure',
   'according to this methodology',
 ] as const;
 
 /**
  * VALIDATE WEIGHTING
  */
 export function validateWeighting(weights: Record<string, number>): {
   valid: boolean;
   errors: string[];
 } {
   const errors: string[] = [];
   
   // Check total weight
   const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
   if (Math.abs(total - 1.0) > 0.001) {
     errors.push(`Weights must sum to 1.0 (got ${total.toFixed(3)})`);
   }
   
   // Check for negative weights
   for (const [key, value] of Object.entries(weights)) {
     if (value < 0) {
       errors.push(`Negative weight not allowed: ${key} = ${value}`);
     }
   }
   
   // Check minimum number of dimensions
   if (Object.keys(weights).length < 2) {
     errors.push('Ranking requires at least 2 dimensions');
   }
   
   return {
     valid: errors.length === 0,
     errors,
   };
 }
 
 /**
  * GENERATE SENSITIVITY ANALYSIS
  */
 export function generateSensitivityAnalysis(
   ranking: RankedItem[],
   weights: Record<string, number>
 ): SensitivityDisclosure {
   // Find the entity with the smallest margin over the next rank
   let mostVolatile = ranking[0]?.entity || 'Unknown';
   let smallestMargin = Infinity;
   
   for (let i = 0; i < ranking.length - 1; i++) {
     const margin = ranking[i].score - ranking[i + 1].score;
     if (margin < smallestMargin) {
       smallestMargin = margin;
       mostVolatile = ranking[i].entity;
     }
   }
   
   // Determine stability
   let stability: 'stable' | 'moderate' | 'unstable' = 'stable';
   const avgMargin = ranking.reduce((sum, item, i, arr) => {
     if (i === 0) return 0;
     return sum + (arr[i - 1].score - item.score);
   }, 0) / (ranking.length - 1);
   
   if (avgMargin < 0.05) stability = 'unstable';
   else if (avgMargin < 0.15) stability = 'moderate';
   
   // Generate weight sensitivity descriptions
   const weightSensitivity: Record<string, string> = {};
   for (const dimension of Object.keys(weights)) {
     weightSensitivity[dimension] = `±10% weight change could shift ${mostVolatile}'s rank by 1-2 positions`;
   }
   
   return {
     most_volatile_rank: mostVolatile,
     rank_stability: stability,
     weight_sensitivity: weightSensitivity,
   };
 }
 
 /**
  * GENERATE ALTERNATIVE RANKINGS
  */
 export function generateAlternativeRankings(
   items: RankedItem[],
   baseWeights: Record<string, number>
 ): AlternativeRanking[] {
   const dimensions = Object.keys(baseWeights);
   const alternatives: AlternativeRanking[] = [];
   
   // Equal weights scenario
   const equalWeight = 1 / dimensions.length;
   const equalWeights: Record<string, number> = {};
   dimensions.forEach(d => equalWeights[d] = equalWeight);
   
   alternatives.push({
     weighting_name: 'Equal Weights',
     weights: equalWeights,
     top_3: items.slice(0, 3).map(i => i.entity),  // Simplified
     difference_from_main: 'May significantly reorder rankings',
   });
   
   // Single-dimension scenarios
   for (const dimension of dimensions.slice(0, 2)) {
     const singleWeights: Record<string, number> = {};
     dimensions.forEach(d => singleWeights[d] = d === dimension ? 1 : 0);
     
     alternatives.push({
       weighting_name: `${dimension} Only`,
       weights: singleWeights,
       top_3: items.slice(0, 3).map(i => i.entity),  // Simplified
       difference_from_main: `Focuses only on ${dimension}`,
     });
   }
   
   return alternatives;
 }
 
 /**
  * GENERATE RANKING RESPONSE
  */
 export function generateRankingResponse(
   question: string,
   items: RankedItem[],
   weighting: WeightingDisclosure
 ): RankingResponse {
   // Validate weighting
   const validation = validateWeighting(weighting.weights);
   if (!validation.valid) {
     throw new Error(`RANKING-ERR-01: Invalid weighting - ${validation.errors.join('; ')}`);
   }
   
   // Generate sensitivity analysis
   const sensitivity = generateSensitivityAnalysis(items, weighting.weights);
   
   // Generate alternatives
   const alternatives = generateAlternativeRankings(items, weighting.weights);
   
   // Build text output
   let textOutput = `${PERMITTED_RANKING_LANGUAGE[2]}:\n\n`;
   
   for (const item of items.slice(0, 5)) {
     textOutput += `${item.rank}. ${item.entity} (score: ${item.score.toFixed(2)})\n`;
   }
   
   textOutput += `\n📊 WEIGHTING USED:\n`;
   for (const [dim, weight] of Object.entries(weighting.weights)) {
     textOutput += `- ${dim}: ${(weight * 100).toFixed(0)}%\n`;
   }
   
   textOutput += `\n⚠️ ${RANKING_DISCLAIMERS[0]}`;
   
   return {
     question_type: 'ranking',
     response_mode: 'conditional',
     weighting,
     ranking: items,
     sensitivity,
     disclaimers: [...RANKING_DISCLAIMERS],
     alternative_rankings: alternatives,
     text_output: textOutput,
   };
 }
 
 /**
  * VALIDATE NO ABSOLUTE RANKING CLAIMS
  */
 export function containsAbsoluteRankingClaim(text: string): {
   hasClaim: boolean;
   violations: string[];
 } {
   const violations: string[] = [];
   const lowerText = text.toLowerCase();
   
   for (const term of FORBIDDEN_RANKING_TERMS) {
     if (lowerText.includes(term.toLowerCase())) {
       violations.push(term);
     }
   }
   
   return {
     hasClaim: violations.length > 0,
     violations,
   };
 }