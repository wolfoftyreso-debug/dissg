/**
 * INSTITUTION
 * 
 * Mechanisms for 50+ year survival.
 * Not vision — constraints.
 */

// Charter
export {
  CHARTER_VERSION,
  CHARTER_ARTICLES,
  FROZEN_ARTIFACTS,
  PERMITTED_EVOLUTION,
  CHARTER_TEXT,
  validateCharterCompliance,
} from './charter';

// Trust Structure
export {
  TRUST_ENTITIES,
  SEPARATION_OF_POWERS,
  ANTI_CAPTURE,
  TRUST_DIAGRAM,
  validateTrustIntegrity,
} from './trust-structure';

// Licensing
export {
  LICENSE_TIERS,
  LICENSING_PRINCIPLES,
  PREMIUM_FEATURES,
  LICENSING_STATEMENT,
  validateLicenseModel,
} from './licensing';

// Global Expansion
export {
  ONBOARDING_STAGES,
  PIPELINE_DURATION,
  EXPANSION_PRINCIPLES,
  EXPANSION_STATUS,
  getOnboardingProgress,
  type CountryStatus,
} from './global-expansion';

// Governance
export {
  GOVERNANCE_ROLES,
  GOVERNANCE_HEADCOUNT,
  DOES_NOT_EXIST,
  DECISION_MATRIX,
  SUSTAINABILITY,
  validateGovernanceStructure,
} from './governance';

/**
 * INSTITUTION VERSION
 */
export const INSTITUTION_VERSION = '1.0.0' as const;

/**
 * POSITIONING STATEMENT
 */
export const POSITIONING = {
  statement: 'We do not tell you what to do. We show what is true, what is uncertain, and how to understand it.',
  length: 'One sentence.',
  marketing_language: false,
} as const;

/**
 * WHAT THIS SYSTEM IS
 */
export const SYSTEM_IDENTITY = {
  is: [
    'Civilizational infrastructure',
    'Read-only truth retrieval',
    'Machine-first API',
    'Permanent record',
  ],
  is_not: [
    'A company',
    'A product',
    'A service',
    'An advisor',
  ],
} as const;

/**
 * FINAL STATUS
 */
export const FINAL_STATUS = {
  cannot_be_bought: true,
  cannot_be_biased: true,
  cannot_be_simplified: true,
  cannot_become_obsolete: true,
  becomes_reference_point: true,
} as const;
