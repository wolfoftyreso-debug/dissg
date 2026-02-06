/**
 * LEGAL CLASSIFICATION & LIABILITY SHIELD
 * 
 * "Ni är inte en utgivare. Ni är en neutral index- och 
 * distributionsinfrastruktur för offentlig och verifierbar data."
 * 
 * This is not policy. This is code requirement.
 */

// ============================================
// WHAT WE ARE (LEGALLY)
// ============================================

export const LEGAL_IDENTITY = {
  classification: 'Neutral Index Provider',
  
  what_we_are: [
    'data_aggregation_infrastructure',
    'format_normalization_service',
    'version_control_system',
    'provenance_exposure_layer',
    'machine_readable_access_provider',
  ],
  
  what_we_are_not: [
    'media',
    'analyst',
    'advisor',
    'opinion_maker',
    'decision_maker',
    'publisher',
    'editorial_entity',
  ],
  
  // This must be true: technically, semantically, legally, operationally
  neutrality_domains: ['technical', 'semantic', 'legal', 'operational'] as const,
} as const;

// ============================================
// FUNCTIONAL NEUTRALITY (THE 5 ALLOWED ACTIONS)
// ============================================

export const ALLOWED_FUNCTIONS = [
  'collect_from_recognized_sources',    // 1. Samlar data från erkända källor
  'normalize_formats',                   // 2. Normaliserar format
  'version_changes',                     // 3. Versionerar förändringar
  'expose_provenance',                   // 4. Exponerar provenance
  'provide_machine_readable_access',     // 5. Tillhandahåller maskinläsbar åtkomst
] as const;

export const FORBIDDEN_FUNCTIONS = [
  'recommendations',     // ❌ Rekommendationer
  'predictions',         // ❌ Prognoser
  'conclusions',         // ❌ Slutsatser
  'value_judgments',     // ❌ Värderingar
  'action_advice',       // ❌ Handlingsråd
  'rankings',            // ❌ Rankningar
  'priorities',          // ❌ Prioriteringar
  'interpretations',     // ❌ Tolkningar
] as const;

export type AllowedFunction = typeof ALLOWED_FUNCTIONS[number];
export type ForbiddenFunction = typeof FORBIDDEN_FUNCTIONS[number];

// ============================================
// USAGE CONSTRAINTS (MANDATORY SCHEMA FIELD)
// ============================================

/**
 * Every data object MUST include this.
 * If it cannot satisfy these constraints, it cannot exist in the system.
 */
export interface UsageConstraints {
  contains_opinion: false;          // Must always be false
  contains_recommendation: false;   // Must always be false
  contains_prediction: false;       // Must always be false
  decision_support: false;          // Must always be false
  
  // What it IS
  is_observation: true;             // Must always be true
  is_verifiable: true;              // Must always be true
  is_source_traceable: true;        // Must always be true
}

export const MANDATORY_USAGE_CONSTRAINTS: UsageConstraints = {
  contains_opinion: false,
  contains_recommendation: false,
  contains_prediction: false,
  decision_support: false,
  is_observation: true,
  is_verifiable: true,
  is_source_traceable: true,
};

/**
 * Validate that an object meets usage constraints
 */
export function validateUsageConstraints(
  constraints: Partial<UsageConstraints>
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  
  // Check forbidden flags are false
  if (constraints.contains_opinion !== false) {
    violations.push('contains_opinion must be false');
  }
  if (constraints.contains_recommendation !== false) {
    violations.push('contains_recommendation must be false');
  }
  if (constraints.contains_prediction !== false) {
    violations.push('contains_prediction must be false');
  }
  if (constraints.decision_support !== false) {
    violations.push('decision_support must be false');
  }
  
  // Check required flags are true
  if (constraints.is_observation !== true) {
    violations.push('is_observation must be true');
  }
  if (constraints.is_verifiable !== true) {
    violations.push('is_verifiable must be true');
  }
  if (constraints.is_source_traceable !== true) {
    violations.push('is_source_traceable must be true');
  }
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

// ============================================
// PROVENANCE = LIABILITY TRANSFER
// ============================================

export interface ProvenanceDeclaration {
  source: string;                           // Primary source organization
  source_url?: string;                      // Direct link to source
  methodology_reference: string;            // Methodology document ID
  collection_date: string;                  // When data was collected
  validity_period: {
    start: string;
    end: string | null;                     // null = ongoing
  };
  
  // CRITICAL: Liability assignment
  interpretation_responsibility: 'User';    // Always 'User', never us
  decision_responsibility: 'User';          // Always 'User', never us
  verification_responsibility: 'Source';    // Always 'Source', never us
}

/**
 * Create a valid provenance declaration
 */
export function createProvenance(
  source: string,
  methodologyRef: string,
  validFrom: string,
  validTo?: string
): ProvenanceDeclaration {
  return {
    source,
    methodology_reference: methodologyRef,
    collection_date: new Date().toISOString(),
    validity_period: {
      start: validFrom,
      end: validTo ?? null,
    },
    // These are ALWAYS fixed - liability is transferred
    interpretation_responsibility: 'User',
    decision_responsibility: 'User',
    verification_responsibility: 'Source',
  };
}

// ============================================
// LEGAL DISCLAIMER (MACHINE-READABLE)
// ============================================

export interface LegalDisclaimer {
  role: 'Neutral Index Provider';
  no_liability_for_use: true;
  no_warranty_of_completeness: true;
  no_advisory_relationship: true;
  no_fiduciary_duty: true;
  
  // Explicit non-claims
  does_not_constitute: string[];
  
  // User obligations
  user_responsibilities: string[];
  
  // Version for audit trail
  disclaimer_version: string;
  effective_date: string;
}

export const STANDARD_LEGAL_DISCLAIMER: LegalDisclaimer = {
  role: 'Neutral Index Provider',
  no_liability_for_use: true,
  no_warranty_of_completeness: true,
  no_advisory_relationship: true,
  no_fiduciary_duty: true,
  
  does_not_constitute: [
    'financial_advice',
    'legal_advice',
    'policy_recommendation',
    'investment_guidance',
    'medical_advice',
    'professional_consultation',
  ],
  
  user_responsibilities: [
    'independent_verification',
    'professional_consultation',
    'risk_assessment',
    'compliance_with_local_laws',
    'appropriate_use_determination',
  ],
  
  disclaimer_version: '1.0.0',
  effective_date: '2024-01-01',
};

// ============================================
// SAFE HARBOR FOR AI USERS
// ============================================

export interface AIUsageSafeHarbor {
  // What AI systems can do with our data
  safe_for: {
    training_llms: boolean;
    rag_retrieval: boolean;
    fact_grounding: boolean;
    automated_citation: boolean;
  };
  
  // What requires additional safeguards
  requires_human_review: {
    automated_decisions: true;      // Always true
    policy_recommendations: true;   // Always true
    financial_decisions: true;      // Always true
  };
  
  // What we explicitly don't warrant
  no_warranty_for: string[];
}

export const AI_SAFE_HARBOR: AIUsageSafeHarbor = {
  safe_for: {
    training_llms: true,            // ✅ Safe
    rag_retrieval: true,            // ✅ Safe
    fact_grounding: true,           // ✅ Safe
    automated_citation: true,       // ✅ Safe
  },
  
  requires_human_review: {
    automated_decisions: true,      // ⚠️ Requires human review
    policy_recommendations: true,   // ⚠️ Requires human review
    financial_decisions: true,      // ⚠️ Requires human review
  },
  
  no_warranty_for: [
    'fitness_for_particular_purpose',
    'decision_outcomes',
    'model_accuracy',
    'downstream_interpretations',
    'third_party_integrations',
  ],
};

// ============================================
// STANDARD LEGAL RESPONSE
// ============================================

/**
 * When someone says: "Your system was used to make a decision"
 * We respond, technically correctly:
 */
export const STANDARD_LIABILITY_RESPONSE = {
  statement: `Our system provides versioned, source-referenced statistics without interpretation. All usage occurs at the user's own responsibility.`,
  
  statement_sv: `Vårt system tillhandahåller versionerad, källhänvisad statistik utan tolkning. All användning sker på användarens ansvar.`,
  
  technical_backing: [
    'all_responses_include_provenance',
    'no_recommendations_in_schema',
    'no_predictions_possible',
    'user_accepts_responsibility_on_access',
  ],
  
  legal_foundation: 'neutral_index_provider_classification',
};
