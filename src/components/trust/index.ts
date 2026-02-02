/**
 * Trust Components Index
 * 
 * Part of Block 55: Public Trust Log & Governance
 */

export { TrustLogEntry } from './TrustLogEntry';
export { TrustLogList } from './TrustLogList';
export { MethodSidebar } from './MethodSidebar';

// Re-export config
export {
  CHANGE_TYPES,
  FORBIDDEN_CHANGE_TYPES,
  GOVERNANCE_ROLES,
  REVIEW_STATUSES,
  ANTI_INFLUENCE_BLOCKS,
  IMMUTABILITY_RULES,
  TRANSPARENCY_REQUIREMENTS,
  GOVERNANCE_DONE_CRITERIA,
  CRISIS_RESPONSE_TEMPLATE,
  type ChangeType,
  type GovernanceRole,
  type ReviewStatus,
  type TrustLogEntry as TrustLogEntryType,
  type CrisisResponse,
} from '@/config/trustLogConfig';

// Re-export hooks
export { useTrustLog, useTrustLogEntry, useTrustLogStats } from '@/hooks/useTrustLog';
