 /**
  * INTENT COMPILER
  * 
  * Query → Intent → Blueprint → Coverage Check → Response
  */
 
 import { QueryNormalizer } from '@/core/truth-engine/query/taxonomy/normalizer';
 import { getBlueprint } from '@/core/truth-engine/query/taxonomy/blueprints';
 import { checkCoverageGate, type CoverageInput } from '../legitimacy/coverage-gate';
 
 export interface CompiledIntent {
   readonly query_id: string;
   readonly normalized_query: string;
   readonly domain: string;
   readonly blueprint_id: string;
   readonly confidence: number;
   readonly can_proceed: boolean;
   readonly coverage_result: ReturnType<typeof checkCoverageGate>;
   readonly data_requirements: readonly string[];
 }
 
 export function compileQuery(rawQuery: string, coverageInput: CoverageInput): CompiledIntent {
   const classification = QueryNormalizer.classify(rawQuery);
   const blueprint = getBlueprint(classification.blueprint_id);
   const coverageResult = checkCoverageGate(coverageInput);
   
   return {
     query_id: `QRY-${Date.now().toString(36)}`,
     normalized_query: classification.normalized_query,
     domain: classification.domain,
     blueprint_id: classification.blueprint_id,
     confidence: classification.confidence,
     can_proceed: coverageResult.can_answer && classification.confidence >= 0.5,
     coverage_result: coverageResult,
     data_requirements: blueprint?.data_requirements || [],
   };
 }