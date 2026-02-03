/**
 * STRIM Schema.org Validation
 * 
 * Kvalitetsregel: Schema markup får aldrig ljuga, förenkla eller marknadsföra.
 * Detta validerar att generated schema följer Googles riktlinjer.
 */

import { z } from 'zod';

// =============================================================================
// VALIDATION RULES
// =============================================================================

/**
 * Required fields per entity type
 */
const REQUIRED_FIELDS = {
  Drug: ['@id', 'name'],
  MedicalCondition: ['@id', 'name'],
  MedicalTherapy: ['@id', 'name'],
  Legislation: ['@id', 'name'],
  Dataset: ['@id', 'name'],
  DefinedTerm: ['@id', 'name'],
} as const;

/**
 * Forbidden patterns in descriptions (marketing language)
 */
const FORBIDDEN_DESCRIPTION_PATTERNS = [
  /bäst/i,
  /ledande/i,
  /revolution/i,
  /fantastisk/i,
  /unik/i,
  /garanterad/i,
  /!/,
];

/**
 * Maximum description length (Google truncates)
 */
const MAX_DESCRIPTION_LENGTH = 320;

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

export interface SchemaValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate Schema.org JSON-LD
 */
export function validateSchemaOrg(schema: Record<string, unknown>): SchemaValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check @context
  if (schema['@context'] !== 'https://schema.org') {
    errors.push('@context must be "https://schema.org"');
  }

  // Check @type
  const type = schema['@type'] as string;
  if (!type) {
    errors.push('@type is required');
  }

  // Check @id
  const id = schema['@id'] as string;
  if (!id) {
    errors.push('@id is required for entity linking');
  } else if (!id.startsWith('https://')) {
    errors.push('@id must be a full HTTPS URL');
  }

  // Check name
  if (!schema.name) {
    errors.push('name is required');
  }

  // Check description quality
  const description = schema.description as string | undefined;
  if (description) {
    // Length check
    if (description.length > MAX_DESCRIPTION_LENGTH) {
      warnings.push(`description exceeds ${MAX_DESCRIPTION_LENGTH} chars (Google truncates)`);
    }

    // Marketing language check
    for (const pattern of FORBIDDEN_DESCRIPTION_PATTERNS) {
      if (pattern.test(description)) {
        errors.push(`description contains forbidden marketing language: ${pattern}`);
      }
    }

    // Minimum quality
    if (description.length < 20) {
      warnings.push('description is very short, consider expanding');
    }
  }

  // Check publisher reference
  const publisher = schema.publisher as Record<string, unknown> | undefined;
  if (publisher && !publisher['@id']) {
    errors.push('publisher must have @id reference');
  }

  // Type-specific validation
  if (type === 'Drug') {
    validateDrugSchema(schema, errors, warnings);
  } else if (type === 'MedicalCondition') {
    validateMedicalConditionSchema(schema, errors, warnings);
  } else if (type === 'Dataset') {
    validateDatasetSchema(schema, errors, warnings);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function validateDrugSchema(
  schema: Record<string, unknown>,
  errors: string[],
  warnings: string[]
): void {
  // Drug-specific checks
  const legalStatus = schema.legalStatus as Record<string, unknown> | undefined;
  if (legalStatus && !legalStatus.name) {
    warnings.push('legalStatus should have a name');
  }

  // Check administrationRoute is array
  const routes = schema.administrationRoute;
  if (routes && !Array.isArray(routes)) {
    errors.push('administrationRoute must be an array');
  }
}

function validateMedicalConditionSchema(
  schema: Record<string, unknown>,
  errors: string[],
  warnings: string[]
): void {
  // Code validation
  const code = schema.code as Record<string, unknown> | undefined;
  if (code) {
    if (!code.codingSystem) {
      errors.push('MedicalCode must have codingSystem');
    }
    if (!code.codeValue) {
      errors.push('MedicalCode must have codeValue');
    }
  }
}

function validateDatasetSchema(
  schema: Record<string, unknown>,
  errors: string[],
  warnings: string[]
): void {
  // Dataset should have temporal or spatial coverage
  if (!schema.temporalCoverage && !schema.spatialCoverage) {
    warnings.push('Dataset should have temporalCoverage or spatialCoverage');
  }
}

/**
 * Validate complete @graph structure
 */
export function validateSchemaGraph(graph: Record<string, unknown>): SchemaValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (graph['@context'] !== 'https://schema.org') {
    errors.push('@context must be "https://schema.org"');
  }

  const graphItems = graph['@graph'] as unknown[];
  if (!Array.isArray(graphItems)) {
    errors.push('@graph must be an array');
    return { valid: false, errors, warnings };
  }

  // Check for organization
  const hasOrg = graphItems.some(
    (item) => (item as Record<string, unknown>)['@type'] === 'Organization'
  );
  if (!hasOrg) {
    warnings.push('Graph should include Organization for publisher attribution');
  }

  // Validate each item
  for (const item of graphItems) {
    const itemResult = validateSchemaOrg(item as Record<string, unknown>);
    errors.push(...itemResult.errors.map(e => `${(item as Record<string, unknown>)['@type']}: ${e}`));
    warnings.push(...itemResult.warnings.map(w => `${(item as Record<string, unknown>)['@type']}: ${w}`));
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Pre-publish schema validation
 */
export function validateBeforePublish(
  entityType: string,
  schema: Record<string, unknown>
): { canPublish: boolean; issues: string[] } {
  const result = validateSchemaOrg(schema);
  
  const issues: string[] = [
    ...result.errors.map(e => `❌ ${e}`),
    ...result.warnings.map(w => `⚠️ ${w}`),
  ];

  return {
    canPublish: result.valid,
    issues,
  };
}
