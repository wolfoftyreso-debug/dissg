 /**
  * ONTOLOGICAL ANTI-PATTERNS
  * 
  * What must NEVER be built in the system.
  * These are structural violations, not errors.
  */
 
 export interface AntiPattern {
   code: string;
   name: string;
   description: string;
   detection: string;
   example: {
     wrong: string;
     correct: string;
   };
   severity: 'blocking' | 'error' | 'warning';
   autoDetectable: boolean;
 }
 
 export const ANTI_PATTERNS: Record<string, AntiPattern> = {
   // ============================================================
   // STRUCTURAL ANTI-PATTERNS
   // ============================================================
   
   'AP-STRUCT-001': {
     code: 'AP-STRUCT-001',
     name: 'Implicit Hierarchy',
     description: 'Nesting objects without formal relation',
     detection: 'Object contains child objects without relation_id',
     example: {
       wrong: 'Country { population: { male: 1000, female: 1000 } }',
       correct: 'Entity(Country) -[has_attribute]-> Attribute(population) -[has_attribute]-> Attribute(sex)',
     },
     severity: 'blocking',
     autoDetectable: true,
   },
   
   'AP-STRUCT-002': {
     code: 'AP-STRUCT-002',
     name: 'Multi-Meaning Object',
     description: 'Single object contains multiple distinct semantic meanings',
     detection: 'Object has fields that could be separate entities',
     example: {
       wrong: 'Country { gdp: 1000, gdp_source: "WB", gdp_method: "PPP" }',
       correct: 'Measure(gdp) -[sourced_from]-> Source(WB), Measure(gdp) -[defined_by]-> Definition(PPP)',
     },
     severity: 'blocking',
     autoDetectable: false,
   },
   
   'AP-STRUCT-003': {
     code: 'AP-STRUCT-003',
     name: 'Context-Dependent Meaning',
     description: 'Object interpretation requires external context',
     detection: 'Field meaning changes based on other field values',
     example: {
       wrong: 'Measure { value: 100, type: "gdp" } // meaning of value depends on type',
       correct: 'Measure(gdp) { value: 100 } // type is in the identity, not a field',
     },
     severity: 'blocking',
     autoDetectable: false,
   },
   
   'AP-STRUCT-004': {
     code: 'AP-STRUCT-004',
     name: 'Orphan Entity',
     description: 'Entity exists without any relations',
     detection: 'Entity has 0 relations in or out',
     example: {
       wrong: 'Entity(mystery_country) with no relations',
       correct: 'All entities must have at least one relation',
     },
     severity: 'warning',
     autoDetectable: true,
   },
   
   // ============================================================
   // TEMPORAL ANTI-PATTERNS
   // ============================================================
   
   'AP-TEMP-001': {
     code: 'AP-TEMP-001',
     name: 'Timeless Data',
     description: 'Data without temporal axis',
     detection: 'Object missing valid_from or observed_at',
     example: {
       wrong: 'Measure { indicator: "gdp", value: 1000 }',
       correct: 'Measure { indicator: "gdp", value: 1000, valid_from: "2024-01-01", observed_at: "2024-06-01" }',
     },
     severity: 'blocking',
     autoDetectable: true,
   },
   
   'AP-TEMP-002': {
     code: 'AP-TEMP-002',
     name: 'Mutable History',
     description: 'Historical data was modified instead of superseded',
     detection: 'Object updated_at > created_at without supersede relation',
     example: {
       wrong: 'UPDATE measure SET value = 1100 WHERE id = "old_id"',
       correct: 'INSERT measure (new_id) -[supersedes]-> measure(old_id)',
     },
     severity: 'blocking',
     autoDetectable: true,
   },
   
   'AP-TEMP-003': {
     code: 'AP-TEMP-003',
     name: 'Temporal Blind Aggregation',
     description: 'Aggregating data from different time periods without awareness',
     detection: 'SUM/AVG across measures with non-overlapping time ranges',
     example: {
       wrong: 'AVG(gdp) across 1990, 2000, 2020 as single value',
       correct: 'Time series: [{period: 1990, value: X}, {period: 2000, value: Y}, ...]',
     },
     severity: 'error',
     autoDetectable: true,
   },
   
   // ============================================================
   // SEMANTIC ANTI-PATTERNS
   // ============================================================
   
   'AP-SEM-001': {
     code: 'AP-SEM-001',
     name: 'Definition Collision',
     description: 'Same ID used for different definitions',
     detection: 'Schema hash changed but ID unchanged',
     example: {
       wrong: 'unemployment_rate (changed from ILO to national definition, same ID)',
       correct: 'unemployment_rate_ilo:v1, unemployment_rate_national:v1 (separate IDs)',
     },
     severity: 'blocking',
     autoDetectable: true,
   },
   
   'AP-SEM-002': {
     code: 'AP-SEM-002',
     name: 'False Equivalence',
     description: 'Treating similar concepts as identical',
     detection: 'same_as relation without definition match verification',
     example: {
       wrong: 'Sweden_unemployment same_as Germany_unemployment (different definitions)',
       correct: 'Sweden_unemployment similar_to Germany_unemployment (with difference documented)',
     },
     severity: 'error',
     autoDetectable: false,
   },
   
   'AP-SEM-003': {
     code: 'AP-SEM-003',
     name: 'Suppressed Contradiction',
     description: 'Conflicting data discarded instead of preserved',
     detection: 'Only one source retained when multiple sources available',
     example: {
       wrong: 'Using World Bank GDP, ignoring IMF GDP that differs',
       correct: 'Store both, link with contradicts relation',
     },
     severity: 'blocking',
     autoDetectable: false,
   },
   
   // ============================================================
   // PROVENANCE ANTI-PATTERNS
   // ============================================================
   
   'AP-PROV-001': {
     code: 'AP-PROV-001',
     name: 'Sourceless Data',
     description: 'Data without source attribution',
     detection: 'Object missing sourced_from relation',
     example: {
       wrong: 'Measure { value: 1000 } // where did this come from?',
       correct: 'Measure { value: 1000 } -[sourced_from]-> Source(WB)',
     },
     severity: 'blocking',
     autoDetectable: true,
   },
   
   'AP-PROV-002': {
     code: 'AP-PROV-002',
     name: 'Broken Derivation Chain',
     description: 'Derived data without traceable inputs',
     detection: 'Calculated field missing derived_from relations',
     example: {
       wrong: 'gdp_per_capita without link to gdp and population',
       correct: 'gdp_per_capita -[derived_from]-> gdp, -[derived_from]-> population',
     },
     severity: 'error',
     autoDetectable: true,
   },
   
   // ============================================================
   // UNIT ANTI-PATTERNS
   // ============================================================
   
   'AP-UNIT-001': {
     code: 'AP-UNIT-001',
     name: 'Unitless Value',
     description: 'Numeric value without unit definition',
     detection: 'Numeric field missing unit_id reference',
     example: {
       wrong: 'population: 10000000',
       correct: 'population: { value: 10000000, unit: "persons" }',
     },
     severity: 'blocking',
     autoDetectable: true,
   },
   
   'AP-UNIT-002': {
     code: 'AP-UNIT-002',
     name: 'Incompatible Unit Aggregation',
     description: 'Aggregating values with incompatible units',
     detection: 'SUM/AVG across different unit types',
     example: {
       wrong: 'SUM(gdp_usd, gdp_eur) without conversion',
       correct: 'Convert all to common unit before aggregation',
     },
     severity: 'error',
     autoDetectable: true,
   },
 } as const;
 
 /**
  * Check for anti-pattern violations
  */
 export function detectAntiPattern(
   patternCode: string,
   context: Record<string, unknown>
 ): { violated: boolean; details?: string } {
   const pattern = ANTI_PATTERNS[patternCode];
   
   if (!pattern) {
     return { violated: false };
   }
   
   // Auto-detectable patterns have specific checks
   switch (patternCode) {
     case 'AP-STRUCT-004':
       // Orphan Entity check
       const relationCount = (context.relationCount as number) ?? 0;
       return {
         violated: relationCount === 0,
         details: relationCount === 0 ? 'Entity has no relations' : undefined,
       };
       
     case 'AP-TEMP-001':
       // Timeless Data check
       const hasValidFrom = 'valid_from' in context && context.valid_from != null;
       const hasObservedAt = 'observed_at' in context && context.observed_at != null;
       return {
         violated: !hasValidFrom || !hasObservedAt,
         details: !hasValidFrom ? 'Missing valid_from' : !hasObservedAt ? 'Missing observed_at' : undefined,
       };
       
     case 'AP-PROV-001':
       // Sourceless Data check
       const hasSource = (context.sourceCount as number) > 0;
       return {
         violated: !hasSource,
         details: !hasSource ? 'No source attribution' : undefined,
       };
       
     case 'AP-UNIT-001':
       // Unitless Value check
       const hasUnit = 'unit_id' in context && context.unit_id != null;
       return {
         violated: !hasUnit,
         details: !hasUnit ? 'Missing unit definition' : undefined,
       };
       
     default:
       // Non-auto-detectable patterns require manual review
       return { violated: false };
   }
 }
 
 /**
  * Get all blocking anti-patterns
  */
 export function getBlockingAntiPatterns(): AntiPattern[] {
   return Object.values(ANTI_PATTERNS).filter(p => p.severity === 'blocking');
 }
 
 /**
  * Get all auto-detectable anti-patterns
  */
 export function getAutoDetectableAntiPatterns(): AntiPattern[] {
   return Object.values(ANTI_PATTERNS).filter(p => p.autoDetectable);
 }