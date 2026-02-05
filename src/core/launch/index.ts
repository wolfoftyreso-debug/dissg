/**
 * 30-DAY LAUNCH CHECKLIST
 * 
 * Decision Legitimacy System — production go-live
 * 
 * From "ready in theory" → live system that cannot be eroded.
 * No fluff. Only execution.
 */

// Types
export type {
  WeekNumber,
  LaunchWeek,
  LaunchDay,
  LaunchTask,
  TaskCategory,
  TaskStatus,
  GoLiveCriteria,
  PostLaunchRule,
  LaunchStatus,
  SeedContentSpec,
  SoftLaunchConfig,
} from './types';

// Weeks
export { WEEK_1, WEEK_1_TASKS } from './week-1';
export { WEEK_2, WEEK_2_TASKS } from './week-2';
export { WEEK_3, WEEK_3_TASKS } from './week-3';
export { WEEK_4, WEEK_4_TASKS } from './week-4';

// Go-Live
export {
  GO_LIVE_CRITERIA,
  FINAL_GO_LIVE_CRITERION,
  POST_LAUNCH_RULES,
  SEED_CONTENT_SPEC,
  SOFT_LAUNCH_CONFIG,
  DAY_30_STATUS,
} from './go-live';

// Tracker
export {
  ALL_TASKS,
  ALL_WEEKS,
  calculateLaunchStatus,
  getWeekProgress,
  checkGoLiveReadiness,
  detectBlockers,
} from './tracker';

// ============================================================================
// LAUNCH SUMMARY
// ============================================================================

export const LAUNCH_SUMMARY = {
  total_days: 30,
  total_weeks: 4,
  
  week_goals: {
    1: 'The core is locked – impossible to build wrong',
    2: "The world's contract – impossible to integrate wrong",
    3: 'Public surface – transparency without narrative',
    4: 'Security & go-live – rather refuse than lie',
  },
  
  exit_criteria: {
    week_1: 'Decision can be created, validated, locked – cannot be destroyed',
    week_2: 'Google query becomes ontological draft – without answering',
    week_3: 'External party can verify without asking',
    week_4: 'System works even if no one likes it',
  },
  
  final_criterion: 'The system works even if no one likes it.',
  
  after_day_30: {
    do_not: ['Add features', 'Optimize UX', 'Explain more'],
    do: ['Let system be used', 'Let structure speak', 'Let adoption happen through necessity'],
  },
  
  what_you_have_at_day_30: [
    'A decision operating system',
    'Global SEO dominance without content',
    'AI-compatible truth',
    'Legal protection',
    'Historical memory',
    'Zero dependency on narrative',
  ],
  
  not_a_product: true,
  what_it_is: 'Infrastructure for human decision-making',
} as const;
