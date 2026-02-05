 /**
  * ONTOLOGICAL ANTI-PATTERNS
  * 
  * What must NEVER be built in the system.
  * These are structural violations, not errors.
  */
 
 export interface AntiPattern {
   code: string;
   name: string;
  category: 'structural' | 'semantic' | 'temporal' | 'provenance' | 'meta';
   description: string;
  whyItKillsSystems: string;
   detection: string;
  selfTest: string;
   example: {
     wrong: string;
     correct: string;
   };
   severity: 'blocking' | 'error' | 'warning';
   autoDetectable: boolean;
  failAction: string;
 }
 
/**
 * AMBIGUOUS TERMS LIST
 * 
 * Terms that require explicit disambiguation.
 * Must be maintained and expanded over time.
 */
export const AMBIGUOUS_TERMS = [
  'average', 'normal', 'standard', 'official', 'total', 'typical',
  'rate', 'index', 'score', 'level', 'status', 'type', 'category',
  'income', 'population', 'employment', 'growth', 'change',
  'current', 'active', 'valid', 'default', 'general', 'common',
  'main', 'primary', 'basic', 'simple', 'regular', 'usual',
] as const;

/**
 * UX-DRIVEN MOTIVATION PATTERNS
 * 
 * Phrases that indicate structure was created for visualization.
 */
export const UX_MOTIVATION_PATTERNS = [
  'easier to display', 'better visualization', 'simpler chart',
  'fits the UI', 'for the dashboard', 'click-friendly',
  'user expects', 'looks better', 'cleaner interface',
  'performance optimization', 'faster rendering',
] as const;

 export const ANTI_PATTERNS: Record<string, AntiPattern> = {
   // ============================================================
  // CATEGORY 1: MULTI-MEANING ANTI-PATTERNS (DÖDSSYNDEN)
   // ============================================================
   
  'AP-MULTI-001': {
    code: 'AP-MULTI-001',
    name: 'Multi-Meaning Object',
    category: 'semantic',
    description: 'Object represents more than one meaning depending on context',
    whyItKillsSystems: 'AI cannot determine which meaning applies. Aggregation becomes false. Historical comparisons become propaganda.',
    detection: 'Schema definition contains ambiguous terms without explicit disambiguation',
    selfTest: 'FOR EACH schema: IF definition CONTAINS ambiguous_terms: FAIL',
     example: {
      wrong: '"income" without specifying gross/net; "population" without definition (resident, citizen, registered)',
      correct: '"income_gross_annual" with explicit definition; "population_registered_residents" with legal framework',
     },
     severity: 'blocking',
     autoDetectable: true,
    failAction: 'Stop ingestion. Force split into separate schemas. New ID per meaning.',
   },
   
  // ============================================================
  // CATEGORY 2: IMPLICIT CONTEXT ANTI-PATTERNS
  // ============================================================
  
  'AP-CONTEXT-001': {
    code: 'AP-CONTEXT-001',
    name: 'Implicit Context Dependency',
    category: 'semantic',
    description: 'Data interpretation requires national knowledge, cultural understanding, legal background, or "how we usually count"',
    whyItKillsSystems: 'AI lacks implicit culture. Implicit = untruth. Global aggregation becomes impossible.',
    detection: 'Data point requires external context not encoded in the data itself',
    selfTest: 'FOR EACH datapoint: IF requires_external_context(datapoint): FAIL',
     example: {
      wrong: '"unemployment" that uses national definition without specifying which',
      correct: '"unemployment_ilo_definition" with explicit ILO methodology reference',
     },
     severity: 'blocking',
    autoDetectable: true,
    failAction: 'Context must become explicit data. Otherwise: forbid object.',
   },
   
  // ============================================================
  // CATEGORY 3: UX-DRIVEN MODELING ANTI-PATTERNS
  // ============================================================
  
  'AP-UX-001': {
    code: 'AP-UX-001',
    name: 'UX-Driven Modeling',
    category: 'structural',
    description: 'Structure created to fit a view, make a chart easier, or facilitate clicks',
    whyItKillsSystems: 'UX changes → structure breaks. Machines get semantic leaks. System ages rapidly.',
    detection: 'Schema change motivation matches UX-related patterns',
    selfTest: 'FOR EACH schema_change: IF motivation == "visualization": FAIL',
     example: {
      wrong: 'Flattening nested data to "make the dashboard simpler"',
      correct: 'UX adapts to structure. Never the reverse.',
     },
     severity: 'blocking',
     autoDetectable: false,
    failAction: 'Reject schema change. Document correct approach.',
   },
   
  // ============================================================
  // CATEGORY 4: CONVENIENCE FIELD ANTI-PATTERNS
  // ============================================================
  
  'AP-CONV-001': {
    code: 'AP-CONV-001',
    name: 'Convenience Field',
    category: 'structural',
    description: 'Field that duplicates data, is a derivative, or "saves calculation time"',
    whyItKillsSystems: 'Inconsistency over time. Hidden assumptions. Impossible history.',
    detection: 'Field value can be derived from other fields in the same or related objects',
    selfTest: 'FOR EACH field: IF is_derivable(field): FAIL',
     example: {
      wrong: 'population_growth_rate stored instead of calculated; is_active = true instead of explicit event',
      correct: 'Only primary data in core. Derivatives in query layer.',
     },
    severity: 'blocking',
     autoDetectable: true,
    failAction: 'Remove convenience field. Create derived view or function.',
   },
   
   // ============================================================
  // CATEGORY 5: MIXED LEVEL ANTI-PATTERNS
   // ============================================================
   
  'AP-LEVEL-001': {
    code: 'AP-LEVEL-001',
    name: 'Entity-Measure Confusion',
    category: 'structural',
    description: 'Measures treated as objects, or objects treated as measures',
    whyItKillsSystems: 'Relations become illogical. AI misunderstands causality.',
    detection: 'Entity contains raw numeric values; Measure exists without measure definition',
    selfTest: 'ASSERT no_entity_contains_raw_numeric_values; ASSERT all_numeric_values_are_measures',
     example: {
      wrong: '"Economy" as entity with values directly; "GDP" as entity without measure definition',
      correct: 'Entity(Economy) -[measured_by]-> Measure(GDP) with full definition',
     },
     severity: 'blocking',
     autoDetectable: true,
    failAction: 'Restructure to correct ontological level.',
   },
   
  // ============================================================
  // CATEGORY 6: SILENT SEMANTIC MIGRATION ANTI-PATTERNS
  // ============================================================
  
  'AP-MIGRATE-001': {
    code: 'AP-MIGRATE-001',
    name: 'Silent Semantic Migration',
    category: 'semantic',
    description: 'Meaning of concept changes over time but ID is kept and schema is "slightly updated"',
    whyItKillsSystems: 'Historical analyses become wrong. AI trains on mixed reality.',
    detection: 'Schema definition hash changed but ID remains unchanged',
    selfTest: 'FOR EACH schema_version: ASSERT definition_hash IS IMMUTABLE',
     example: {
      wrong: 'Updating "unemployment" definition from national to ILO, keeping same ID',
      correct: 'New version → new ID → explicit supersedes relation',
     },
     severity: 'blocking',
     autoDetectable: true,
    failAction: 'Create new ID. Establish supersedes relation. Document change.',
   },
   
  // ============================================================
  // CATEGORY 7: AGGREGATION ANTI-PATTERNS
  // ============================================================
  
  'AP-AGG-001': {
    code: 'AP-AGG-001',
    name: 'Aggregation Without Permission',
    category: 'semantic',
    description: 'System allows aggregation over different definitions, incompatible time axes, or different source regimes',
    whyItKillsSystems: 'Creates "global numbers" that do not exist. AI builds incorrect models.',
    detection: 'Aggregation operation spans incompatible schemas or time ranges',
    selfTest: 'FOR EACH aggregation: ASSERT aggregation_rules ARE EXPLICIT',
     example: {
      wrong: 'SUM(gdp) across countries with PPP and nominal definitions mixed',
      correct: 'Aggregation requires machine-readable permission with explicit compatibility declaration',
     },
    severity: 'blocking',
     autoDetectable: true,
    failAction: 'Block aggregation. Require explicit aggregation rules.',
   },
   
   // ============================================================
  // CATEGORY 8: STRUCTURAL ANTI-PATTERNS
   // ============================================================
   
  'AP-STRUCT-001': {
    code: 'AP-STRUCT-001',
    name: 'Implicit Hierarchy',
    category: 'structural',
    description: 'Nesting objects without formal relation',
    whyItKillsSystems: 'Traversal becomes impossible. Machines cannot navigate structure.',
    detection: 'Object contains child objects without relation_id',
    selfTest: 'FOR EACH object: IF has_nested_objects AND no_relation: FAIL',
     example: {
      wrong: 'Country { population: { male: 1000, female: 1000 } }',
      correct: 'Entity(Country) -[has_attribute]-> Attribute(population) -[has_attribute]-> Attribute(sex)',
     },
     severity: 'blocking',
     autoDetectable: true,
    failAction: 'Flatten. Create explicit relations.',
   },
   
  'AP-STRUCT-002': {
    code: 'AP-STRUCT-002',
    name: 'Orphan Entity',
    category: 'structural',
    description: 'Entity exists without any relations',
    whyItKillsSystems: 'Isolated entities cannot be traversed or validated.',
    detection: 'Entity has 0 relations in or out',
    selfTest: 'FOR EACH entity: IF relation_count == 0: FAIL',
     example: {
      wrong: 'Entity(mystery_country) with no relations',
      correct: 'All entities must have at least one relation',
     },
    severity: 'warning',
    autoDetectable: true,
    failAction: 'Add required relations or delete entity.',
   },
   
  // ============================================================
  // CATEGORY 9: TEMPORAL ANTI-PATTERNS
  // ============================================================
  
  'AP-TEMP-001': {
    code: 'AP-TEMP-001',
    name: 'Timeless Data',
    category: 'temporal',
    description: 'Data without temporal axis',
    whyItKillsSystems: 'Data without time is propaganda. Cannot reproduce historical state.',
    detection: 'Object missing valid_from or observed_at',
    selfTest: 'FOR EACH data_object: IF missing(valid_from) OR missing(observed_at): FAIL',
     example: {
      wrong: 'Measure { indicator: "gdp", value: 1000 }',
      correct: 'Measure { indicator: "gdp", value: 1000, valid_from: "2024-01-01", observed_at: "2024-06-01" }',
     },
     severity: 'blocking',
    autoDetectable: true,
    failAction: 'Add temporal axis. If unknown, mark as unknown with explicit uncertainty.',
   },
   
  'AP-TEMP-002': {
    code: 'AP-TEMP-002',
    name: 'Mutable History',
    category: 'temporal',
    description: 'Historical data was modified instead of superseded',
    whyItKillsSystems: 'Destroys reproducibility. Makes backtesting impossible.',
    detection: 'Object updated_at > created_at without supersede relation',
    selfTest: 'FOR EACH object: IF updated AND no_supersede_relation: FAIL',
    example: {
      wrong: 'UPDATE measure SET value = 1100 WHERE id = "old_id"',
      correct: 'INSERT measure (new_id) -[supersedes]-> measure(old_id)',
    },
    severity: 'blocking',
    autoDetectable: true,
    failAction: 'Reject update. Create new version with supersedes relation.',
  },
   
  // ============================================================
  // CATEGORY 10: PROVENANCE ANTI-PATTERNS
  // ============================================================
  
   'AP-PROV-001': {
     code: 'AP-PROV-001',
     name: 'Sourceless Data',
    category: 'provenance',
     description: 'Data without source attribution',
    whyItKillsSystems: 'Unverifiable claims. Cannot trace errors. Trust impossible.',
     detection: 'Object missing sourced_from relation',
    selfTest: 'FOR EACH data_object: IF source_count == 0: FAIL',
     example: {
       wrong: 'Measure { value: 1000 } // where did this come from?',
       correct: 'Measure { value: 1000 } -[sourced_from]-> Source(WB)',
     },
     severity: 'blocking',
     autoDetectable: true,
    failAction: 'Block ingestion. Require source attribution.',
   },
   
   'AP-PROV-002': {
     code: 'AP-PROV-002',
     name: 'Broken Derivation Chain',
    category: 'provenance',
     description: 'Derived data without traceable inputs',
    whyItKillsSystems: 'Cannot validate calculations. Hidden assumptions.',
     detection: 'Calculated field missing derived_from relations',
    selfTest: 'FOR EACH derived_field: IF input_count == 0: FAIL',
     example: {
       wrong: 'gdp_per_capita without link to gdp and population',
       correct: 'gdp_per_capita -[derived_from]-> gdp, -[derived_from]-> population',
     },
     severity: 'error',
     autoDetectable: true,
    failAction: 'Add derivation chain or remove field.',
   },
   
  'AP-PROV-003': {
    code: 'AP-PROV-003',
    name: 'Suppressed Contradiction',
    category: 'provenance',
    description: 'Conflicting data discarded instead of preserved',
    whyItKillsSystems: 'Censors reality. AI cannot learn from disagreement.',
    detection: 'Only one source retained when multiple sources available with different values',
    selfTest: 'FOR EACH indicator: IF sources_discarded > 0: FAIL',
    example: {
      wrong: 'Using World Bank GDP, ignoring IMF GDP that differs',
      correct: 'Store both, link with contradicts relation',
    },
    severity: 'blocking',
    autoDetectable: false,
    failAction: 'Store all sources. Create contradicts relations.',
  },
   
  // ============================================================
  // CATEGORY 11: UNIT ANTI-PATTERNS
  // ============================================================
  
   'AP-UNIT-001': {
     code: 'AP-UNIT-001',
     name: 'Unitless Value',
    category: 'semantic',
     description: 'Numeric value without unit definition',
    whyItKillsSystems: 'Cannot convert. Cannot compare. Aggregation impossible.',
     detection: 'Numeric field missing unit_id reference',
    selfTest: 'FOR EACH numeric_field: IF missing(unit_id): FAIL',
     example: {
       wrong: 'population: 10000000',
       correct: 'population: { value: 10000000, unit: "persons" }',
     },
     severity: 'blocking',
     autoDetectable: true,
    failAction: 'Add unit. If unknown, reject data.',
   },
   
  // ============================================================
  // CATEGORY 12: META ANTI-PATTERN (EXTREMELY IMPORTANT)
  // ============================================================
  
  'AP-META-001': {
    code: 'AP-META-001',
    name: 'The "It Works" Fallacy',
    category: 'meta',
    description: 'Design decisions motivated by "it works", "it\'s practical", or "everyone does it this way"',
    whyItKillsSystems: 'This is exactly how all other systems die. Pragmatism without principle is decay.',
    detection: 'Design decision lacks formal justification',
    selfTest: 'ASSERT no_design_decision LACKS formal_justification',
    example: {
      wrong: '"We stored it this way because it was faster to implement"',
      correct: 'Every structural decision has explicit rationale linked to system principles',
     },
    severity: 'blocking',
    autoDetectable: false,
    failAction: 'Document formal justification. If none exists, redesign.',
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
    case 'AP-STRUCT-002':
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
      
    case 'AP-MULTI-001':
      // Multi-meaning check
      const definition = (context.definition as string) ?? '';
      const foundAmbiguous = AMBIGUOUS_TERMS.filter(term => 
        definition.toLowerCase().includes(term.toLowerCase())
      );
      return {
        violated: foundAmbiguous.length > 0,
        details: foundAmbiguous.length > 0 
          ? `Ambiguous terms found: ${foundAmbiguous.join(', ')}` 
          : undefined,
      };
      
    case 'AP-LEVEL-001':
      // Entity-Measure confusion check
      const objectType = context.objectType as string;
      const hasRawNumericValues = context.hasRawNumericValues as boolean;
      const hasMeasureDefinition = context.hasMeasureDefinition as boolean;
      
      if (objectType === 'entity' && hasRawNumericValues) {
        return { violated: true, details: 'Entity contains raw numeric values' };
      }
      if (objectType === 'measure' && !hasMeasureDefinition) {
        return { violated: true, details: 'Measure lacks proper definition' };
      }
      return { violated: false };
      
    case 'AP-MIGRATE-001':
      // Silent semantic migration check
      const currentHash = context.currentDefinitionHash as string;
      const previousHash = context.previousDefinitionHash as string;
      const idChanged = context.idChanged as boolean;
      
      if (currentHash !== previousHash && !idChanged) {
        return { 
          violated: true, 
          details: 'Definition changed without ID change' 
        };
      }
      return { violated: false };
      
    case 'AP-TEMP-002':
      // Mutable history check
      const wasUpdated = context.wasUpdated as boolean;
      const hasSupersedes = context.hasSupersedes as boolean;
      
      if (wasUpdated && !hasSupersedes) {
        return {
          violated: true,
          details: 'Data was updated without supersedes relation',
        };
      }
      return { violated: false };
       
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