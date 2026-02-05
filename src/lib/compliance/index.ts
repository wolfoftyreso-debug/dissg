/**
 * AI & COMPLIANCE GUARDRAILS
 * 
 * Core module for maintaining platform as reference, not advisor.
 * Exports all compliance-related functionality.
 */

export * from './query-filter';
export * from './scope-manager';
export * from './ai-response-builder';
export * from './ethics-enforcer';
// Re-export specific items from legal-classifier to avoid name conflicts
export { 
  getLegalClassification,
  getAllLegalClassifications,
  getRequiredDisclaimers as getLegalDisclaimers,
  isClassifiedAs,
  isNotClassifiedAs,
  buildLegalFooter,
  buildRegulatoryReference,
  getAPIComplianceStatement,
  validateContentLegality
} from './legal-classifier';
 export * from './misuse-detector';
