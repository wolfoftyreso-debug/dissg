/**
 * QA & GO-LIVE COMPONENTS INDEX
 * 
 * Final QA playbook and Day-0 readiness tracking.
 */

export { QAChecklistDashboard } from './QAChecklistDashboard';

// Re-export configuration
export {
  QA_CHECKLIST,
  DAY0_CRITERIA,
  METHOD_DATA_QA,
  AI_QA,
  SCENARIO_QA,
  INCONSISTENCY_QA,
  UI_UX_QA,
  LEGAL_GOVERNANCE_QA,
  OPERATIONS_QA,
  getAllQAChecks,
  validateDay0Readiness,
  getCheckById,
  type QACheckStatus,
  type QACheckResult,
  type QAReport,
} from '@/config/qaGoLiveConfig';
