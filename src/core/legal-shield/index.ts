/**
 * LEGAL SHIELD
 * 
 * "Ni blir: för viktiga för att ignorera, för neutrala för att attackera,
 * för tekniska för att reglera som media."
 * 
 * This is architecture that reduces liability through design.
 */

// Legal Classification & Identity
export {
  LEGAL_IDENTITY,
  ALLOWED_FUNCTIONS,
  FORBIDDEN_FUNCTIONS,
  MANDATORY_USAGE_CONSTRAINTS,
  validateUsageConstraints,
  createProvenance,
  STANDARD_LEGAL_DISCLAIMER,
  AI_SAFE_HARBOR,
  STANDARD_LIABILITY_RESPONSE,
  type AllowedFunction,
  type ForbiddenFunction,
  type UsageConstraints,
  type ProvenanceDeclaration,
  type LegalDisclaimer,
  type AIUsageSafeHarbor,
} from './legalClassification';

// Language Validation
export {
  validateLanguage,
  generateValidationReport,
  NEUTRAL_TEMPLATES,
  type ViolationType,
  type LanguageViolation,
  type LanguageValidationReport,
} from './languageValidator';

// Jurisdiction Strategy
export {
  RECOMMENDED_JURISDICTIONS,
  RECOMMENDED_STRUCTURE,
  LIABILITY_SHIELDS,
  REGULATORY_POSITION,
  REQUIRED_DOCUMENTATION,
  ANTI_CAPTURE_MECHANISMS,
  type JurisdictionType,
  type Jurisdiction,
  type CorporateEntity,
  type LiabilityShield,
  type RegulatoryPosition,
  type ComplianceDocumentation,
} from './jurisdictionStrategy';

// ============================================
// QUICK ACCESS
// ============================================

import { 
  LEGAL_IDENTITY,
  STANDARD_LEGAL_DISCLAIMER, 
  AI_SAFE_HARBOR,
  MANDATORY_USAGE_CONSTRAINTS,
  STANDARD_LIABILITY_RESPONSE,
} from './legalClassification';
import { validateLanguage } from './languageValidator';
import { LIABILITY_SHIELDS, REGULATORY_POSITION } from './jurisdictionStrategy';

/**
 * Get complete legal shield for API response
 */
export function getLegalShieldEnvelope(): {
  identity: typeof LEGAL_IDENTITY;
  disclaimer: typeof STANDARD_LEGAL_DISCLAIMER;
  ai_safe_harbor: typeof AI_SAFE_HARBOR;
  usage_constraints: typeof MANDATORY_USAGE_CONSTRAINTS;
  liability_response: typeof STANDARD_LIABILITY_RESPONSE;
} {
  return {
    identity: LEGAL_IDENTITY,
    disclaimer: STANDARD_LEGAL_DISCLAIMER,
    ai_safe_harbor: AI_SAFE_HARBOR,
    usage_constraints: MANDATORY_USAGE_CONSTRAINTS,
    liability_response: STANDARD_LIABILITY_RESPONSE,
  };
}

/**
 * Validate content for legal compliance
 */
export function validateForLegalCompliance(text: string): {
  compliant: boolean;
  issues: string[];
  sanitized?: string;
} {
  const result = validateLanguage(text);
  
  return {
    compliant: result.valid,
    issues: result.violations.map(v => 
      `${v.type}: "${v.match}" at position ${v.position}`
    ),
    sanitized: result.sanitized,
  };
}

/**
 * Get liability shield summary
 */
export function getLiabilityShieldSummary(): {
  layers: number;
  shields: string[];
  regulatory_classification: string;
  analogous_to: string[];
} {
  return {
    layers: LIABILITY_SHIELDS.length,
    shields: LIABILITY_SHIELDS.map(s => s.name),
    regulatory_classification: REGULATORY_POSITION.classification,
    analogous_to: REGULATORY_POSITION.analogous_entities,
  };
}

// ============================================
// LEGAL SHIELD VERSION
// ============================================

export const LEGAL_SHIELD_VERSION = {
  version: '1.0.0',
  last_updated: '2024-01-01',
  status: 'active',
  
  core_principle: 'Architecture that reduces liability through design',
  
  result: {
    too_important_to_ignore: true,
    too_neutral_to_attack: true,
    too_technical_to_regulate_as_media: true,
  },
} as const;
