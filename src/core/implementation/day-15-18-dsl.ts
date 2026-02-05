 /**
  * DAY 15-18: QUERY DSL - MINIMAL LANGUAGE THAT MAKES ERRORS IMPOSSIBLE
  * 
  * Implement:
  * - Grammar
  * - Parser
  * - Semantic linter
  * - Rejection logic
  * 
  * NO GUI. NO REST API. CLI is enough.
  * 
  * Self-test:
  *   TRY query WITHOUT definition
  *   ASSERT rejected
  */
 
 /**
  * DSL GRAMMAR (SIMPLIFIED)
  */
 export const DSL_GRAMMAR = `
 QUERY := SELECT indicators FROM geography DURING timerange [WHERE conditions]
 
 indicators := indicator_id ("," indicator_id)*
 indicator_id := entity_type ":" entity_name ":" version
 
 geography := "geo:" geo_type ":" geo_code
 geo_type := "country" | "region" | "municipality" | "global"
 
 timerange := "time:" start_date ".." end_date
 start_date := YYYY-MM-DD
 end_date := YYYY-MM-DD
 
 conditions := condition ("AND" condition)*
 condition := property comparator value
 comparator := "=" | "!=" | ">" | "<" | ">=" | "<="
 
 -- FORBIDDEN TOKENS --
 FORBIDDEN := "latest" | "current" | "default" | "all" | "any"
 `;
 
 /**
  * QUERY AST
  */
 export interface QueryAST {
   type: 'query';
   indicators: {
     entityType: string;
     entityName: string;
     version: number;
   }[];
   geography: {
     type: string;
     code: string;
   };
   timeRange: {
     start: string;
     end: string;
   };
   conditions?: {
     property: string;
     comparator: string;
     value: string | number;
   }[];
 }
 
 /**
  * PARSER
  */
 export class QueryParser {
   private forbiddenTokens = ['latest', 'current', 'default', 'all', 'any'];
 
   parse(query: string): { success: boolean; ast?: QueryAST; error?: string } {
     // Check for forbidden tokens first
     for (const token of this.forbiddenTokens) {
       if (query.toLowerCase().includes(token)) {
         return {
           success: false,
           error: `FORBIDDEN TOKEN: "${token}" is not allowed. Use explicit versions.`,
         };
       }
     }
 
     // Simplified parsing (would be full parser in production)
     try {
       // Extract indicators
       const indicatorMatch = query.match(/SELECT\s+(.+?)\s+FROM/i);
       if (!indicatorMatch) {
         return { success: false, error: 'Missing SELECT clause' };
       }
 
       // Extract geography
       const geoMatch = query.match(/FROM\s+geo:(\w+):(\w+)/i);
       if (!geoMatch) {
         return { success: false, error: 'Missing or invalid FROM clause' };
       }
 
       // Extract time range
       const timeMatch = query.match(/DURING\s+time:(\d{4}-\d{2}-\d{2})\.\.(\d{4}-\d{2}-\d{2})/i);
       if (!timeMatch) {
         return { success: false, error: 'Missing or invalid DURING clause' };
       }
 
       // Parse indicators
       const indicatorStrings = indicatorMatch[1].split(',').map(s => s.trim());
       const indicators = indicatorStrings.map(s => {
         const parts = s.split(':');
         if (parts.length !== 3) {
           throw new Error(`Invalid indicator format: ${s}`);
         }
         const version = parseInt(parts[2].replace('v', ''), 10);
         if (isNaN(version)) {
           throw new Error(`Invalid version in indicator: ${s}`);
         }
         return {
           entityType: parts[0],
           entityName: parts[1],
           version,
         };
       });
 
       return {
         success: true,
         ast: {
           type: 'query',
           indicators,
           geography: {
             type: geoMatch[1],
             code: geoMatch[2],
           },
           timeRange: {
             start: timeMatch[1],
             end: timeMatch[2],
           },
         },
       };
     } catch (error) {
       return { success: false, error: String(error) };
     }
   }
 }
 
 /**
  * SEMANTIC LINTER
  */
 export class SemanticLinter {
   lint(ast: QueryAST): { valid: boolean; errors: string[]; warnings: string[] } {
     const errors: string[] = [];
     const warnings: string[] = [];
 
     // Check all indicators have explicit versions
     for (const indicator of ast.indicators) {
       if (indicator.version <= 0) {
         errors.push(`Invalid version for ${indicator.entityType}:${indicator.entityName}`);
       }
     }
 
     // Check time range is valid
     const start = new Date(ast.timeRange.start);
     const end = new Date(ast.timeRange.end);
     if (start >= end) {
       errors.push('Time range start must be before end');
     }
 
     // Check geography is specific
     if (ast.geography.type === 'global' && ast.geography.code !== 'all_countries') {
       warnings.push('Global queries should specify aggregation method');
     }
 
     return {
       valid: errors.length === 0,
       errors,
       warnings,
     };
   }
 }
 
 /**
  * REJECTION LOGIC
  */
 export class QueryRejector {
   private parser = new QueryParser();
   private linter = new SemanticLinter();
 
   evaluate(query: string): {
     accepted: boolean;
     rejection_reason?: string;
     ast?: QueryAST;
     warnings?: string[];
   } {
     // Step 1: Parse
     const parseResult = this.parser.parse(query);
     if (!parseResult.success) {
       return {
         accepted: false,
         rejection_reason: `PARSE ERROR: ${parseResult.error}`,
       };
     }
 
     // Step 2: Lint
     const lintResult = this.linter.lint(parseResult.ast!);
     if (!lintResult.valid) {
       return {
         accepted: false,
         rejection_reason: `SEMANTIC ERROR: ${lintResult.errors.join(', ')}`,
       };
     }
 
     return {
       accepted: true,
       ast: parseResult.ast,
       warnings: lintResult.warnings,
     };
   }
 }
 
 /**
  * DAY 15-18 SELF-TEST
  */
 export function runDay15to18SelfTest(): {
   passed: boolean;
   question: string;
   answer: string;
   tests: { query: string; shouldReject: boolean; wasRejected: boolean }[];
 } {
   const question = 'TRY query WITHOUT definition → ASSERT rejected';
 
   const rejector = new QueryRejector();
 
   const testCases = [
     // Should be rejected
     { query: 'SELECT population FROM geo:country:SE', shouldReject: true },
     { query: 'SELECT population:latest FROM geo:country:SE DURING time:2020-01-01..2023-01-01', shouldReject: true },
     { query: 'SELECT all FROM geo:country:SE DURING time:2020-01-01..2023-01-01', shouldReject: true },
     { query: 'SELECT current:population:v1 FROM geo:country:SE DURING time:2020-01-01..2023-01-01', shouldReject: true },
 
     // Should be accepted
     { query: 'SELECT population:resident:v1 FROM geo:country:SE DURING time:2020-01-01..2023-01-01', shouldReject: false },
   ];
 
   const tests = testCases.map(tc => {
     const result = rejector.evaluate(tc.query);
     return {
       query: tc.query,
       shouldReject: tc.shouldReject,
       wasRejected: !result.accepted,
     };
   });
 
   const allCorrect = tests.every(t => t.shouldReject === t.wasRejected);
 
   return {
     passed: allCorrect,
     question,
     answer: allCorrect
       ? 'YES - All bad queries rejected, all good queries accepted'
       : 'NO - Some queries slipped through. Language is too weak.',
     tests,
   };
 }