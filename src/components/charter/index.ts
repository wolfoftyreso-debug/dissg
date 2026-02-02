/**
 * CHARTER & LEGAL COMPONENTS INDEX
 * 
 * Public Charter, Terms of Service, and legal framework.
 */

export { 
  PublicCharterDisplay,
  InternalRuleDisplay,
  CompletionCriteriaDisplay,
} from './PublicCharterDisplay';

// Re-export configuration
export {
  PUBLIC_CHARTER,
  TERMS_OF_SERVICE,
  INTERNAL_OPERATING_RULE,
  COMPLETION_CRITERIA,
  LEGAL_FRAMEWORK,
  validateCharterCompleteness,
  validateToSCompleteness,
} from '@/config/publicCharterConfig';
