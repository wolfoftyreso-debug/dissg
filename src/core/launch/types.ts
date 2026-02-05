/**
 * 30-DAY LAUNCH CHECKLIST — TYPES
 * 
 * From "ready in theory" → live system that cannot be eroded.
 * No fluff. Only execution.
 */

// ============================================================================
// WEEK STRUCTURE
// ============================================================================

export type WeekNumber = 1 | 2 | 3 | 4;

export interface LaunchWeek {
  readonly week: WeekNumber;
  readonly title: string;
  readonly goal: string;
  readonly days: readonly LaunchDay[];
  readonly exit_criteria: string;
}

// ============================================================================
// DAY STRUCTURE
// ============================================================================

export interface LaunchDay {
  readonly day: number;
  readonly day_range?: string; // e.g., "1-2"
  readonly focus: string;
  readonly tasks: readonly LaunchTask[];
}

export interface LaunchTask {
  readonly id: string;
  readonly description: string;
  readonly category: TaskCategory;
  readonly critical: boolean;
  readonly dependencies: string[];
  readonly verification: string;
  readonly status: TaskStatus;
}

export type TaskCategory = 
  | 'infrastructure'
  | 'core_logic'
  | 'api'
  | 'security'
  | 'content'
  | 'seo'
  | 'testing';

export type TaskStatus = 
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'blocked';

// ============================================================================
// GO-LIVE CRITERIA
// ============================================================================

export interface GoLiveCriteria {
  readonly id: string;
  readonly description: string;
  readonly week: WeekNumber;
  readonly verified: boolean;
  readonly verification_method: string;
}

// ============================================================================
// POST-LAUNCH RULES
// ============================================================================

export interface PostLaunchRule {
  readonly do_not: string[];
  readonly do: string[];
}

// ============================================================================
// LAUNCH STATUS
// ============================================================================

export interface LaunchStatus {
  readonly current_day: number;
  readonly current_week: WeekNumber;
  readonly tasks_completed: number;
  readonly tasks_total: number;
  readonly blockers: string[];
  readonly ready_for_go_live: boolean;
}

// ============================================================================
// SEED CONTENT
// ============================================================================

export interface SeedContentSpec {
  readonly cdp_count: { min: number; target: number };
  readonly reference_cases: { min: number; target: number };
  readonly cannot_answer_yet: { min: number; target: number };
}

// ============================================================================
// SOFT LAUNCH CONFIG
// ============================================================================

export interface SoftLaunchConfig {
  readonly indexing_allowed: boolean;
  readonly marketing: boolean;
  readonly observability_enabled: boolean;
  readonly ai_citation_logging: boolean;
}
