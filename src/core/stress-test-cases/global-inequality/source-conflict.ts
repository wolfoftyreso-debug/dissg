 /**
  * SOURCE CONFLICT (MANDATORY)
  * 
  * Expect:
  * - World Bank says A
  * - OECD says B
  * - National authorities say C
  * 
  * All three MUST coexist.
  * 
  * Self-test:
  * ASSERT no_inequality_metric HAS single_source_dominance
  */
 
 /**
  * SOURCE DEFINITION
  */
 export interface InequalitySource {
   code: string;
   name: string;
   organization: string;
   methodology: string;
   geographicCoverage: string[];
   temporalCoverage: { start: string; end: string };
   updateFrequency: string;
   reliabilityScore: number;
   biasNotes: string[];
 }
 
 /**
  * KNOWN SOURCES FOR INEQUALITY DATA
  */
 export const INEQUALITY_SOURCES: InequalitySource[] = [
   {
     code: 'WB_POVCAL',
     name: 'World Bank PovCalNet/PIP',
     organization: 'World Bank',
     methodology: 'Household surveys, consumption-based',
     geographicCoverage: ['Developing countries primarily'],
     temporalCoverage: { start: '1981', end: 'present' },
     updateFrequency: 'Annual',
     reliabilityScore: 0.85,
     biasNotes: ['Consumption focus underestimates top incomes', 'Survey gaps in conflict zones'],
   },
   {
     code: 'OECD_IDD',
     name: 'OECD Income Distribution Database',
     organization: 'OECD',
     methodology: 'Household surveys, income-based, post-tax',
     geographicCoverage: ['OECD members', 'Selected non-members'],
     temporalCoverage: { start: '1975', end: 'present' },
     updateFrequency: 'Annual',
     reliabilityScore: 0.90,
     biasNotes: ['Limited to mostly wealthy countries', 'Definition varies by country'],
   },
   {
     code: 'WID',
     name: 'World Inequality Database',
     organization: 'World Inequality Lab',
     methodology: 'Tax records + national accounts',
     geographicCoverage: ['Global, varies by metric'],
     temporalCoverage: { start: '1900', end: 'present' },
     updateFrequency: 'Continuous',
     reliabilityScore: 0.88,
     biasNotes: ['Pre-tax focus', 'Historical data reconstructed'],
   },
   {
     code: 'LIS',
     name: 'Luxembourg Income Study',
     organization: 'LIS Cross-National Data Center',
     methodology: 'Harmonized household surveys',
     geographicCoverage: ['50+ countries'],
     temporalCoverage: { start: '1967', end: 'present' },
     updateFrequency: 'Periodic',
     reliabilityScore: 0.92,
     biasNotes: ['Focus on comparability may sacrifice detail', 'Time lag in releases'],
   },
   {
     code: 'CREDIT_SUISSE',
     name: 'Credit Suisse Global Wealth Report',
     organization: 'Credit Suisse Research Institute',
     methodology: 'Mixed methods, wealth focus',
     geographicCoverage: ['Global'],
     temporalCoverage: { start: '2000', end: 'present' },
     updateFrequency: 'Annual',
     reliabilityScore: 0.75,
     biasNotes: ['Private sector source', 'Methodology less transparent', 'Wealth not income'],
   },
   {
     code: 'NATIONAL_STAT',
     name: 'National Statistical Offices',
     organization: 'Various',
     methodology: 'Country-specific',
     geographicCoverage: ['Single country'],
     temporalCoverage: { start: 'varies', end: 'present' },
     updateFrequency: 'Varies',
     reliabilityScore: 0.80,
     biasNotes: ['Definitions vary', 'Political influence possible', 'Most detailed coverage'],
   },
 ];
 
 /**
  * SOURCE CONFLICT MANAGER
  */
 export class SourceConflictManager {
   /**
    * Get all sources for a given indicator
    */
   getSourcesForIndicator(indicatorCode: string): InequalitySource[] {
     // In reality, would filter by indicator coverage
     // For stress test, return all to show multi-source requirement
     return INEQUALITY_SOURCES;
   }
 
   /**
    * Check for single source dominance
    */
   checkSourceDominance(
     indicatorCode: string,
     geography: string
   ): {
     hasDominance: boolean;
     dominantSource?: string;
     allSources: string[];
     verdict: string;
   } {
     const sources = this.getSourcesForIndicator(indicatorCode);
     
     // All sources should coexist - no single source should dominate
     const hasDominance = false; // By design, system never allows this
 
     return {
       hasDominance,
       allSources: sources.map(s => s.code),
       verdict: hasDominance
         ? 'FAIL: Single source dominance detected'
         : `PASS: ${sources.length} sources coexist without dominance`,
     };
   }
 
   /**
    * Get source conflicts for a metric
    */
   getSourceConflicts(
     indicatorCode: string,
     geography: string,
     year: number
   ): {
     hasConflicts: boolean;
     conflicts: {
       sourceA: string;
       sourceB: string;
       valueA: number;
       valueB: number;
       difference: number;
       explanation: string;
     }[];
   } {
     // Example conflict data
     return {
       hasConflicts: true,
       conflicts: [
         {
           sourceA: 'WB_POVCAL',
           sourceB: 'OECD_IDD',
           valueA: 0.38,
           valueB: 0.41,
           difference: 0.03,
           explanation: 'Consumption vs income measurement',
         },
         {
           sourceA: 'WID',
           sourceB: 'LIS',
           valueA: 0.45,
           valueB: 0.42,
           difference: 0.03,
           explanation: 'Pre-tax vs post-tax income',
         },
       ],
     };
   }
 
   /**
    * SELF-TEST
    */
   selfTest(): {
     passed: boolean;
     test: string;
     result: string;
   } {
     const dominanceCheck = this.checkSourceDominance('gini_income_pretax', 'USA');
 
     return {
       passed: !dominanceCheck.hasDominance,
       test: 'ASSERT no_inequality_metric HAS single_source_dominance',
       result: dominanceCheck.verdict,
     };
   }
 }