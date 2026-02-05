 /**
  * QUERY BLOCKER
  * 
  * Blocks queries that are semantically invalid,
  * even if they are syntactically correct.
  * 
  * This is where AI gets STOPPED before causing harm.
  */
 
 import type { Query } from './query-types';
 
 /**
  * BLOCK RESULT
  */
 export interface BlockResult {
   blocked: boolean;
   reasons: BlockReason[];
   suggestions: string[];
 }
 
 export interface BlockReason {
   code: string;
   category: BlockCategory;
   severity: 'hard_block' | 'soft_block';
   message: string;
   evidence: string;
 }
 
 export type BlockCategory =
   | 'aggregation_violation'
   | 'temporal_violation'
   | 'semantic_violation'
   | 'source_violation'
   | 'narrative_risk';
 
 /**
  * BLOCK RULES
  */
 interface BlockRule {
   code: string;
   name: string;
   category: BlockCategory;
   severity: 'hard_block' | 'soft_block';
   check: (query: Query, context: BlockContext) => BlockCheckResult | null;
 }
 
 interface BlockCheckResult {
   message: string;
   evidence: string;
   suggestions: string[];
 }
 
 export interface BlockContext {
   /** Known definition versions */
   definitionVersions: Map<string, { validFrom: string; validTo?: string }[]>;
   
   /** Known methodology breaks */
   methodologyBreaks: Map<string, { date: string; description: string }[]>;
   
   /** Aggregation compatibility matrix */
   aggregationCompatibility: Map<string, string[]>;
   
   /** Source reliability scores */
   sourceReliability: Map<string, number>;
 }
 
 /**
  * BLOCK RULES REGISTRY
  */
 const BLOCK_RULES: BlockRule[] = [
   // RULE 1: Cross-definition aggregation
   {
     code: 'BLK-001',
     name: 'Cross-Definition Aggregation',
     category: 'aggregation_violation',
     severity: 'hard_block',
     check: (query, context) => {
       if (!query.ops?.operations.some(o => o.type === 'aggregate')) {
         return null;
       }
       
       // Check if query spans multiple definition versions
       if (query.when.type === 'range' && query.when.range) {
         const startYear = query.when.range.start.year;
         const endYear = query.when.range.end.year;
         
         for (const indicator of query.what.indicators) {
           const versions = context.definitionVersions.get(indicator.code) ?? [];
           
           const versionsInRange = versions.filter(v => {
             const vStart = new Date(v.validFrom).getFullYear();
             const vEnd = v.validTo ? new Date(v.validTo).getFullYear() : 9999;
             return vStart <= endYear && vEnd >= startYear;
           });
           
           if (versionsInRange.length > 1) {
             return {
               message: `Aggregation spans ${versionsInRange.length} definition versions for ${indicator.code}`,
               evidence: `Time range ${startYear}-${endYear} crosses definition boundaries`,
               suggestions: [
                 'Split query by definition version',
                 'Use specific definition version with definitionVersion: "specific"',
               ],
             };
           }
         }
       }
       
       return null;
     },
   },
   
   // RULE 2: Cross-methodology aggregation
   {
     code: 'BLK-002',
     name: 'Cross-Methodology Aggregation',
     category: 'aggregation_violation',
     severity: 'hard_block',
     check: (query, context) => {
       if (!query.ops?.operations.some(o => o.type === 'aggregate')) {
         return null;
       }
       
       if (query.when.type === 'range' && query.when.range) {
         const startYear = query.when.range.start.year;
         const endYear = query.when.range.end.year;
         
         for (const indicator of query.what.indicators) {
           const breaks = context.methodologyBreaks.get(indicator.code) ?? [];
           
           const breaksInRange = breaks.filter(b => {
             const breakYear = new Date(b.date).getFullYear();
             return breakYear >= startYear && breakYear <= endYear;
           });
           
           if (breaksInRange.length > 0) {
             return {
               message: `Aggregation crosses ${breaksInRange.length} methodology break(s) for ${indicator.code}`,
               evidence: breaksInRange.map(b => `${b.date}: ${b.description}`).join('; '),
               suggestions: [
                 'Split query at methodology break points',
                 'Acknowledge methodology changes in query intent',
               ],
             };
           }
         }
       }
       
       return null;
     },
   },
   
   // RULE 3: Incompatible indicator comparison
   {
     code: 'BLK-003',
     name: 'Incompatible Indicator Comparison',
     category: 'semantic_violation',
     severity: 'hard_block',
     check: (query, context) => {
       if (query.what.indicators.length < 2) {
         return null;
       }
       
       // Check correlation operations
       const correlationOps = query.ops?.operations.filter(o => o.type === 'correlate') ?? [];
       if (correlationOps.length === 0) {
         return null;
       }
       
       // Check compatibility matrix
       const codes = query.what.indicators.map(i => i.code);
       for (const code of codes) {
         const compatible = context.aggregationCompatibility.get(code) ?? [];
         const incompatible = codes.filter(c => c !== code && !compatible.includes(c));
         
         if (incompatible.length > 0) {
           return {
             message: `Indicator ${code} is not compatible for comparison with: ${incompatible.join(', ')}`,
             evidence: 'Semantic types or measurement units are incompatible',
             suggestions: [
               'Use indicators with compatible semantic types',
               'Transform indicators to comparable units first',
             ],
           };
         }
       }
       
       return null;
     },
   },
   
   // RULE 4: Single source for global claim
   {
     code: 'BLK-004',
     name: 'Single Source Global Claim',
     category: 'source_violation',
     severity: 'soft_block',
     check: (query, context) => {
       if (query.where.level !== 'global') {
         return null;
       }
       
       // Check source diversity (simplified)
       const hasMultipleSources = context.sourceReliability.size > 1;
       
       if (!hasMultipleSources) {
         return {
           message: 'Global query relies on single data source',
           evidence: 'Source diversity is required for global claims',
           suggestions: [
             'Acknowledge single-source limitation in intent',
             'Request data from multiple sources if available',
           ],
         };
       }
       
       return null;
     },
   },
   
   // RULE 5: Cherry-picking time range
   {
     code: 'BLK-005',
     name: 'Potential Cherry-Picking',
     category: 'narrative_risk',
     severity: 'soft_block',
     check: (query, context) => {
       if (query.when.type !== 'range' || !query.when.range) {
         return null;
       }
       
       const startYear = query.when.range.start.year;
       const endYear = query.when.range.end.year;
       const span = endYear - startYear;
       
       // Short time spans with comparison operations are suspicious
       const hasComparison = query.ops?.operations.some(o => o.type === 'compare');
       
       if (span <= 3 && hasComparison) {
         return {
           message: 'Short time range with comparison may enable cherry-picking',
           evidence: `${span + 1} year(s) selected with comparison operation`,
           suggestions: [
             'Consider longer time range for robust comparison',
             'Include full economic cycles (typically 7-10 years)',
           ],
         };
       }
       
       return null;
     },
   },
   
   // RULE 6: Missing uncertainty for conclusion
   {
     code: 'BLK-006',
     name: 'Conclusion Without Uncertainty',
     category: 'narrative_risk',
     severity: 'soft_block',
     check: (query, context) => {
       // If intent is publication or decision_support, uncertainty is required
       if (
         (query.intent.purpose === 'publication' || query.intent.purpose === 'decision_support') &&
         !query.output.uncertainty.required
       ) {
         return {
           message: 'Publication/decision queries require uncertainty information',
           evidence: `Purpose is "${query.intent.purpose}" but uncertainty.required is false`,
           suggestions: [
             'Enable uncertainty.required in output clause',
             'Change purpose to "exploration" if uncertainty is not available',
           ],
         };
       }
       
       return null;
     },
   },
 ];
 
 /**
  * CHECK QUERY AGAINST BLOCK RULES
  */
 export function checkBlockRules(query: Query, context: BlockContext): BlockResult {
   const reasons: BlockReason[] = [];
   const suggestions: string[] = [];
   
   for (const rule of BLOCK_RULES) {
     const result = rule.check(query, context);
     
     if (result) {
       reasons.push({
         code: rule.code,
         category: rule.category,
         severity: rule.severity,
         message: result.message,
         evidence: result.evidence,
       });
       
       suggestions.push(...result.suggestions);
     }
   }
   
   // Query is blocked if any hard_block reason exists
   const blocked = reasons.some(r => r.severity === 'hard_block');
   
   return {
     blocked,
     reasons,
     suggestions: [...new Set(suggestions)], // Deduplicate
   };
 }
 
 /**
  * ADD CUSTOM BLOCK RULE
  */
 export function addBlockRule(rule: BlockRule): void {
   BLOCK_RULES.push(rule);
 }
 
 /**
  * GET ALL BLOCK RULES
  */
 export function getBlockRules(): readonly BlockRule[] {
   return BLOCK_RULES;
 }
 
 /**
  * FORMAT BLOCK RESULT
  */
 export function formatBlockResult(result: BlockResult): string {
   if (!result.blocked && result.reasons.length === 0) {
     return 'Query passed all block checks.';
   }
   
   const lines: string[] = [];
   
   if (result.blocked) {
     lines.push('⛔ QUERY BLOCKED');
   } else {
     lines.push('⚠️ QUERY HAS WARNINGS');
   }
   
   lines.push('');
   
   for (const reason of result.reasons) {
     const icon = reason.severity === 'hard_block' ? '🚫' : '⚠️';
     lines.push(`${icon} [${reason.code}] ${reason.message}`);
     lines.push(`   Category: ${reason.category}`);
     lines.push(`   Evidence: ${reason.evidence}`);
     lines.push('');
   }
   
   if (result.suggestions.length > 0) {
     lines.push('Suggestions:');
     for (const suggestion of result.suggestions) {
       lines.push(`  • ${suggestion}`);
     }
   }
   
   return lines.join('\n');
 }