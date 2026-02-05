/**
 * BOARD UX — TYPES
 * 
 * Behavioral architecture for decision-making.
 * Friction where consequence lives. Flow where it must.
 */

import type { DecisionPreparationDocument } from '@/core/board-decision/types';
import type { WorkflowState, WorkflowRole } from '@/core/board-decision/workflow';

/**
 * Case status in workflow
 */
export type CaseStatus = 
  | 'preparation'    // Before meeting
  | 'meeting'        // During meeting
  | 'locked'         // Decision made
  | 'follow_up';     // PDRC phase

/**
 * Impact level
 */
export type ImpactLevel = 'low' | 'medium' | 'high' | 'critical';

/**
 * Board case for dashboard
 */
export interface BoardCase {
  case_id: string;
  title: string;
  status: CaseStatus;
  impact_level: ImpactLevel;
  days_until_meeting: number | null;
  irreversibility: 'low' | 'medium' | 'high' | 'permanent';
  population_affected: number;
  workflow: WorkflowState | null;
  dpd: DecisionPreparationDocument | null;
}

/**
 * Friction checkpoint
 */
export interface FrictionCheckpoint {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  required: boolean;
}

/**
 * Decision confirmation state
 */
export interface DecisionConfirmation {
  has_seen_uncertainties: boolean;
  has_seen_assumptions: boolean;
  has_seen_all_alternatives: boolean;
  confirmation_timestamp: string | null;
}

/**
 * Role-based view permissions
 */
export interface RoleViewPermissions {
  can_see_all_cases: boolean;
  can_see_history: boolean;
  can_see_flow: boolean;
  can_initiate: boolean;
  can_lock: boolean;
}

export const ROLE_VIEW_PERMISSIONS: Record<WorkflowRole, RoleViewPermissions> = {
  chair: {
    can_see_all_cases: true,
    can_see_history: true,
    can_see_flow: true,
    can_initiate: true,
    can_lock: true,
  },
  secretary: {
    can_see_all_cases: true,
    can_see_history: false,
    can_see_flow: true,
    can_initiate: true,
    can_lock: false,
  },
  board_member: {
    can_see_all_cases: false, // Only their responsibility
    can_see_history: false,
    can_see_flow: false,
    can_initiate: false,
    can_lock: false,
  },
  system: {
    can_see_all_cases: true,
    can_see_history: true,
    can_see_flow: true,
    can_initiate: false,
    can_lock: true,
  },
  auditor: {
    can_see_all_cases: true,
    can_see_history: true,
    can_see_flow: false,
    can_initiate: false,
    can_lock: false,
  },
};
