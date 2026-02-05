/**
 * BOARD UX — INDEX
 * 
 * Behavioral architecture for decision-making.
 * Friction where consequence lives. Flow where it must.
 */

// Types
export type {
  CaseStatus,
  ImpactLevel,
  BoardCase,
  FrictionCheckpoint,
  DecisionConfirmation,
  RoleViewPermissions,
} from './types';

export { ROLE_VIEW_PERMISSIONS } from './types';

// Components
export { BoardDashboard } from './BoardDashboard';
export { CaseView } from './CaseView';
export { DecisionButton } from './DecisionButton';
export { PostDecisionView } from './PostDecisionView';
export { RealityCheckView } from './RealityCheckView';
