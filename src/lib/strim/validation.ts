/**
 * STRIM Validation Schemas
 * 
 * Zod schemas enforcing quality rules:
 * - Inga "tips", råd, uppmaningar
 * - Inga känsloord eller förenklingar
 * - Endast neutral, faktabaserad text
 */

import { z } from 'zod';

// =============================================================================
// FORBIDDEN PATTERNS (Quality Enforcement)
// =============================================================================

const FORBIDDEN_WORDS = [
  // Imperativ/uppmaningar
  'bör', 'ska', 'måste', 'rekommenderas', 'undvik', 'prova', 'testa',
  // Värdeord
  'bra', 'dålig', 'bäst', 'sämst', 'fantastisk', 'hemsk', 'farlig',
  'viktig', 'kritisk', 'avgörande', 'otrolig', 'tragisk',
  // Känsloord
  'lyckligtvis', 'tyvärr', 'dessvärre', 'förhoppningsvis',
  // Normativa
  'borde', 'idealt', 'optimalt', 'rätt sätt', 'fel sätt',
  // Kausala (utan evidens)
  'beror på', 'orsakas av', 'leder till', 'resulterar i',
];

const FORBIDDEN_PATTERNS = [
  /om du/i,           // Direkt tilltal
  /du kan/i,          // Råd
  /vi rekommenderar/i,
  /experter menar/i,  // Vag auktoritet
  /studier visar/i,   // Utan källa
  /forskning visar/i, // Utan källa
  /!/,                // Utropstecken
];

function validateNeutralText(text: string): boolean {
  const lowerText = text.toLowerCase();
  
  // Check forbidden words
  for (const word of FORBIDDEN_WORDS) {
    if (lowerText.includes(word.toLowerCase())) {
      return false;
    }
  }
  
  // Check forbidden patterns
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(text)) {
      return false;
    }
  }
  
  return true;
}

// Neutral text validation as a function (used after .min/.max)
function neutralTextSchema(minLen: number, maxLen?: number) {
  let schema = z.string().min(minLen);
  if (maxLen) schema = schema.max(maxLen);
  return schema.refine(validateNeutralText, {
    message: 'Text innehåller förbjudna ord eller mönster (värdeord, uppmaningar, känsloord)',
  });
}

// Simple neutral text (no length constraints)
const neutralText = z.string().refine(validateNeutralText, {
  message: 'Text innehåller förbjudna ord eller mönster',
});

// =============================================================================
// SOURCE SCHEMA (Required for all entities)
// =============================================================================

export const SourceSchema = z.object({
  name: z.string().min(1),
  url: z.string().url().optional(),
  retrieved_at: z.string().datetime(),
  type: z.enum(['primary', 'secondary', 'tertiary']).default('secondary'),
  organization_type: z.enum([
    'government',      // Myndighet
    'international',   // WHO, EMCDDA, etc.
    'academic',        // Universitet, forskningsinstitut
    'professional',    // Läkarförbund etc.
  ]).optional(),
});

// =============================================================================
// SUBSTANCE SCHEMA
// =============================================================================

export const SubstanceSchema = z.object({
  // Identification
  canonical_slug: z.string().regex(/^[a-z0-9-]+$/),
  name_sv: z.string().min(1),
  name_en: z.string().optional(),
  
  // Definition (neutral, no value judgments)
  definition: neutralTextSchema(50, 500),
  
  // Classification
  classification_primary: z.enum([
    'depressant',
    'stimulant', 
    'opioid',
    'hallucinogen',
    'cannabinoid',
    'dissociative',
    'inhalant',
    'other',
  ]),
  classification_secondary: z.array(z.string()).optional(),
  pharmacological_class: z.string().optional(),
  
  // Mechanism
  mechanism_of_action: neutralText.optional(),
  administration_routes: z.array(z.enum([
    'oral', 'inhalation', 'injection', 'insufflation', 
    'transdermal', 'sublingual', 'rectal', 'other',
  ])),
  
  // Dependence potential
  dependence_potential: z.enum(['low', 'moderate', 'high', 'very_high', 'unknown']),
  dependence_uncertainty: z.string().optional(),
  
  // Risk profile
  acute_risks: z.array(neutralText),
  chronic_risks: z.array(neutralText),
  risk_category: z.enum(['low', 'moderate', 'high', 'very_high', 'unknown']),
  
  // Historical context
  introduction_sweden: z.object({
    approximate_year: z.number().optional(),
    context: neutralText.optional(),
  }).optional(),
  historical_changes: z.array(z.object({
    period: z.string(),
    description: neutralText,
  })).optional(),
  
  // Legal status
  current_legal_status: z.enum([
    'legal', 'prescription', 'controlled', 'illegal', 'varies',
  ]),
  legal_history: z.array(z.object({
    year: z.number(),
    change: neutralText,
    reference: z.string().optional(),
  })).optional(),
  
  // Relations (defined separately)
  causes_diagnoses: z.array(z.string()).optional(),
  regulated_by_laws: z.array(z.string()).optional(),
  associated_concepts: z.array(z.string()).optional(),
  
  // Sources (minimum 2 primary sources required)
  sources: z.array(SourceSchema).min(2).refine(
    (sources) => sources.filter(s => s.type === 'primary').length >= 1,
    { message: 'Minst 1 primär källa krävs' }
  ),
  
  // Metadata
  status: z.enum(['draft', 'active', 'historical', 'deprecated']).default('draft'),
  version: z.number().default(1),
});

// =============================================================================
// DIAGNOSIS SCHEMA
// =============================================================================

export const DiagnosisSchema = z.object({
  canonical_slug: z.string().regex(/^[a-z0-9-]+$/),
  name_sv: z.string().min(1),
  name_en: z.string().optional(),
  
  // ICD codes
  icd_10_code: z.string().regex(/^F\d{2}(\.\d{1,2})?$/).optional(),
  icd_11_code: z.string().optional(),
  dsm_5_code: z.string().optional(),
  
  // Definition (ICD-based, neutral)
  definition: neutralTextSchema(50, 800),
  
  // Diagnostic criteria (summary, not simplification)
  diagnostic_criteria: z.object({
    summary: neutralText,
    key_indicators: z.array(neutralText),
    exclusion_criteria: z.array(neutralText).optional(),
  }),
  
  // Prevalence (with uncertainty)
  prevalence: z.object({
    sweden_estimate: z.string().optional(),
    uncertainty_note: z.string().optional(),
    data_year: z.number().optional(),
    source: z.string(),
  }).optional(),
  
  // Comorbidity
  common_comorbidities: z.array(z.object({
    condition: z.string(),
    frequency: z.enum(['common', 'occasional', 'rare', 'unknown']),
  })).optional(),
  
  // Treatment principles (overview, not recommendation)
  treatment_overview: neutralText.optional(),
  
  // Historical development
  definition_changes: z.array(z.object({
    period: z.string(),
    change: neutralText,
  })).optional(),
  
  // Relations
  caused_by_substances: z.array(z.string()).optional(),
  treated_by_methods: z.array(z.string()).optional(),
  
  // Sources
  sources: z.array(SourceSchema).min(2),
  
  status: z.enum(['draft', 'active', 'historical', 'deprecated']).default('draft'),
  version: z.number().default(1),
});

// =============================================================================
// TREATMENT SCHEMA
// =============================================================================

export const TreatmentSchema = z.object({
  canonical_slug: z.string().regex(/^[a-z0-9-]+$/),
  name_sv: z.string().min(1),
  name_en: z.string().optional(),
  
  // Definition (what the method IS, not what it "should" do)
  definition: neutralTextSchema(50, 500),
  
  // Method type
  method_type: z.enum([
    'pharmacological',
    'psychosocial', 
    'combined',
    'harm_reduction',
    'rehabilitation',
    'other',
  ]),
  
  // Evidence level
  evidence_level: z.enum([
    'level_1a',  // Systematic reviews
    'level_1b',  // RCTs
    'level_2a',  // Controlled studies
    'level_2b',  // Quasi-experimental
    'level_3',   // Observational
    'level_4',   // Case series
    'level_5',   // Expert opinion
    'unknown',
  ]),
  evidence_summary: neutralText.optional(),
  
  // Swedish application
  sweden_context: neutralText.optional(),
  sweden_availability: z.enum([
    'widely_available',
    'limited',
    'specialized_centers',
    'not_available',
    'unknown',
  ]).optional(),
  
  // Risks and limitations (clearly stated)
  risks: z.array(neutralText).optional(),
  limitations: z.array(neutralText).optional(),
  contraindications: z.array(neutralText).optional(),
  
  // Historical context
  introduction_year: z.number().optional(),
  historical_context: neutralText.optional(),
  
  // Relations
  used_for_diagnoses: z.array(z.string()).optional(),
  regulated_by_laws: z.array(z.string()).optional(),
  
  // Sources
  sources: z.array(SourceSchema).min(2),
  
  status: z.enum(['draft', 'active', 'historical', 'deprecated']).default('draft'),
  version: z.number().default(1),
});

// =============================================================================
// LEGAL SCHEMA
// =============================================================================

export const LegalSchema = z.object({
  canonical_slug: z.string().regex(/^[a-z0-9-]+$/),
  name_sv: z.string().min(1),
  name_en: z.string().optional(),
  
  // Identification
  sfs_number: z.string().optional(), // Swedish law identifier
  jurisdiction: z.enum(['SE', 'EU', 'UN', 'international']),
  jurisdiction_level: z.enum(['national', 'regional', 'international']),
  
  // Purpose (what the law intends to regulate)
  purpose: neutralTextSchema(30, 500),
  
  // Validity period
  valid_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  valid_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  is_current: z.boolean().default(true),
  
  // Changes over time
  amendments: z.array(z.object({
    date: z.string(),
    description: neutralText,
    sfs_reference: z.string().optional(),
  })).optional(),
  
  // Impact areas
  impact: z.object({
    healthcare: neutralText.optional(),
    access: neutralText.optional(),
    society: neutralText.optional(),
  }).optional(),
  
  // Summary
  summary: neutralTextSchema(100, 1000),
  
  // Relations
  regulates_substances: z.array(z.string()).optional(),
  affects_treatments: z.array(z.string()).optional(),
  
  // Sources (official law texts required)
  sources: z.array(SourceSchema).min(1).refine(
    (sources) => sources.some(s => s.organization_type === 'government'),
    { message: 'Officiell lagtext krävs som källa' }
  ),
  
  status: z.enum(['draft', 'active', 'historical', 'deprecated']).default('draft'),
  version: z.number().default(1),
});

// =============================================================================
// CONCEPT/TERM SCHEMA
// =============================================================================

export const TermSchema = z.object({
  canonical_slug: z.string().regex(/^[a-z0-9-]+$/),
  term_sv: z.string().min(1),
  term_en: z.string().optional(),
  
  // Canonical definition
  definition_sv: neutralTextSchema(30, 500),
  definition_en: neutralText.optional(),
  
  // Alternative definitions (if relevant)
  alternative_definitions: z.array(z.object({
    source: z.string(),
    definition: neutralText,
    context: z.string().optional(),
  })).optional(),
  
  // Usage areas
  usage_context: z.array(z.enum([
    'healthcare',
    'legal',
    'research',
    'policy',
    'general',
  ])),
  
  // Historical changes
  historical_usage: z.array(z.object({
    period: z.string(),
    usage: neutralText,
  })).optional(),
  
  // Relations
  used_in_laws: z.array(z.string()).optional(),
  associated_diagnoses: z.array(z.string()).optional(),
  associated_substances: z.array(z.string()).optional(),
  related_concepts: z.array(z.string()).optional(),
  
  // Sources
  sources: z.array(SourceSchema).min(1),
  
  status: z.enum(['draft', 'active', 'historical', 'deprecated']).default('draft'),
  version: z.number().default(1),
});

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

export function validateSubstance(data: unknown) {
  return SubstanceSchema.safeParse(data);
}

export function validateDiagnosis(data: unknown) {
  return DiagnosisSchema.safeParse(data);
}

export function validateTreatment(data: unknown) {
  return TreatmentSchema.safeParse(data);
}

export function validateLegal(data: unknown) {
  return LegalSchema.safeParse(data);
}

export function validateTerm(data: unknown) {
  return TermSchema.safeParse(data);
}

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type ValidatedSubstance = z.infer<typeof SubstanceSchema>;
export type ValidatedDiagnosis = z.infer<typeof DiagnosisSchema>;
export type ValidatedTreatment = z.infer<typeof TreatmentSchema>;
export type ValidatedLegal = z.infer<typeof LegalSchema>;
export type ValidatedTerm = z.infer<typeof TermSchema>;
export type ValidatedSource = z.infer<typeof SourceSchema>;
