/**
 * LAUNCH TRACKER
 * 
 * Real-time tracking of launch progress.
 */

import type { LaunchStatus, TaskStatus, WeekNumber } from './types';
import { WEEK_1, WEEK_1_TASKS } from './week-1';
import { WEEK_2, WEEK_2_TASKS } from './week-2';
import { WEEK_3, WEEK_3_TASKS } from './week-3';
import { WEEK_4, WEEK_4_TASKS } from './week-4';
import { GO_LIVE_CRITERIA } from './go-live';

// ============================================================================
// ALL TASKS
// ============================================================================

export const ALL_TASKS = [
  ...WEEK_1_TASKS,
  ...WEEK_2_TASKS,
  ...WEEK_3_TASKS,
  ...WEEK_4_TASKS,
] as const;

export const ALL_WEEKS = [WEEK_1, WEEK_2, WEEK_3, WEEK_4] as const;

// ============================================================================
// STATUS CALCULATION
// ============================================================================

export function calculateLaunchStatus(
  taskStatuses: Record<string, TaskStatus>
): LaunchStatus {
  const tasksCompleted = ALL_TASKS.filter(
    t => taskStatuses[t.id] === 'completed'
  ).length;
  
  const blockers = ALL_TASKS
    .filter(t => taskStatuses[t.id] === 'blocked')
    .map(t => t.id);
  
  // Determine current day based on completed tasks
  const currentDay = Math.min(30, Math.floor((tasksCompleted / ALL_TASKS.length) * 30) + 1);
  
  // Determine current week
  let currentWeek: WeekNumber = 1;
  if (currentDay > 21) currentWeek = 4;
  else if (currentDay > 14) currentWeek = 3;
  else if (currentDay > 7) currentWeek = 2;
  
  // Check if ready for go-live
  const criticalTasks = ALL_TASKS.filter(t => t.critical);
  const criticalCompleted = criticalTasks.filter(
    t => taskStatuses[t.id] === 'completed'
  ).length;
  
  return {
    current_day: currentDay,
    current_week: currentWeek,
    tasks_completed: tasksCompleted,
    tasks_total: ALL_TASKS.length,
    blockers,
    ready_for_go_live: criticalCompleted === criticalTasks.length,
  };
}

// ============================================================================
// WEEK PROGRESS
// ============================================================================

export function getWeekProgress(
  week: WeekNumber,
  taskStatuses: Record<string, TaskStatus>
): { completed: number; total: number; percentage: number } {
  const weekTasks = 
    week === 1 ? WEEK_1_TASKS :
    week === 2 ? WEEK_2_TASKS :
    week === 3 ? WEEK_3_TASKS :
    WEEK_4_TASKS;
  
  const completed = weekTasks.filter(
    t => taskStatuses[t.id] === 'completed'
  ).length;
  
  return {
    completed,
    total: weekTasks.length,
    percentage: Math.round((completed / weekTasks.length) * 100),
  };
}

// ============================================================================
// GO-LIVE READINESS
// ============================================================================

export function checkGoLiveReadiness(
  criteriaStatuses: Record<string, boolean>
): { ready: boolean; unmet: string[] } {
  const unmet = GO_LIVE_CRITERIA
    .filter(c => !criteriaStatuses[c.id])
    .map(c => c.description);
  
  return {
    ready: unmet.length === 0,
    unmet,
  };
}

// ============================================================================
// BLOCKER DETECTION
// ============================================================================

export function detectBlockers(
  taskStatuses: Record<string, TaskStatus>
): { task_id: string; blocked_by: string[] }[] {
  const blockers: { task_id: string; blocked_by: string[] }[] = [];
  
  for (const task of ALL_TASKS) {
    if (taskStatuses[task.id] === 'pending') {
      const unmetDependencies = task.dependencies.filter(
        dep => taskStatuses[dep] !== 'completed'
      );
      
      if (unmetDependencies.length > 0) {
        blockers.push({
          task_id: task.id,
          blocked_by: unmetDependencies,
        });
      }
    }
  }
  
  return blockers;
}
