/**
 * STRIM JSON-LD Generator
 * 
 * Re-export from schema-org.ts for backwards compatibility.
 * New code should use schema-org.ts directly.
 */

export {
  generateJsonLdGraph,
  generateJsonLdScript,
  generateDrugSchema,
  generateMedicalConditionSchema,
  generateMedicalTherapySchema,
  generateLegislationSchema,
  generateDatasetSchema,
  generateDefinedTermSchema,
  serializeJsonLd,
  STRIM_ORGANIZATION,
  type StrimEntityData,
} from './schema-org';

// Legacy exports for backwards compatibility
export { SCHEMA_ORG_TYPES } from './schema-org-legacy';
export { generateJsonLd, generateWebsiteJsonLd, generateDataCatalogJsonLd } from './schema-org-legacy';
