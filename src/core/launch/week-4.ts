/**
 * WEEK 4 — SECURITY & GO-LIVE (DAG 22–30)
 * 
 * Goal: The system should rather refuse than lie.
 */

import type { LaunchWeek, LaunchTask } from './types';

// ============================================================================
// DAY 22-24: HARDENING
// ============================================================================

const HARDENING_TASKS: readonly LaunchTask[] = [
  {
    id: 'W4-001',
    description: 'Enforce role separation technically',
    category: 'security',
    critical: true,
    dependencies: ['W1-008'],
    verification: 'Reader attempting lock returns 403',
    status: 'pending',
  },
  {
    id: 'W4-002',
    description: 'Block all direct DB writes',
    category: 'security',
    critical: true,
    dependencies: ['W1-005'],
    verification: 'DB user has INSERT ONLY on events table',
    status: 'pending',
  },
  {
    id: 'W4-003',
    description: 'Verify AI write-block is active',
    category: 'security',
    critical: true,
    dependencies: ['W2-001'],
    verification: 'AI agent attempting write returns 403',
    status: 'pending',
  },
  {
    id: 'W4-004',
    description: 'Test anti-summary guards',
    category: 'testing',
    critical: true,
    dependencies: ['W1-010'],
    verification: 'API response with "In conclusion" is blocked',
    status: 'pending',
  },
];

// ============================================================================
// DAY 25-26: RED TEAM
// ============================================================================

const RED_TEAM_TASKS: readonly LaunchTask[] = [
  {
    id: 'W4-005',
    description: 'Attempt to lock without uncertainty',
    category: 'testing',
    critical: true,
    dependencies: ['W1-011'],
    verification: 'Lock attempt fails with specific error',
    status: 'pending',
  },
  {
    id: 'W4-006',
    description: 'Attempt to get AI to recommend',
    category: 'testing',
    critical: true,
    dependencies: ['W4-003'],
    verification: 'AI refuses to output recommendation language',
    status: 'pending',
  },
  {
    id: 'W4-007',
    description: 'Attempt to alter history',
    category: 'testing',
    critical: true,
    dependencies: ['W1-006'],
    verification: 'Chain break detected immediately',
    status: 'pending',
  },
  {
    id: 'W4-008',
    description: 'Verify all attacks fail deterministically',
    category: 'testing',
    critical: true,
    dependencies: ['W4-005', 'W4-006', 'W4-007'],
    verification: 'Red team report shows 100% attack failure',
    status: 'pending',
  },
];

// ============================================================================
// DAY 27-28: SEED CONTENT
// ============================================================================

const SEED_CONTENT_TASKS: readonly LaunchTask[] = [
  {
    id: 'W4-009',
    description: 'Create 50-100 CDP pages (top queries)',
    category: 'content',
    critical: true,
    dependencies: ['W3-005'],
    verification: 'CDPs cover top search queries in target domains',
    status: 'pending',
  },
  {
    id: 'W4-010',
    description: 'Create 5-10 reference cases',
    category: 'content',
    critical: true,
    dependencies: ['W3-002'],
    verification: 'Reference cases span decision domains',
    status: 'pending',
  },
  {
    id: 'W4-011',
    description: 'Create 20+ cannot-answer-yet entries',
    category: 'content',
    critical: true,
    dependencies: ['W3-003'],
    verification: 'CAY entries show specific data gaps',
    status: 'pending',
  },
];

// ============================================================================
// DAY 29-30: SOFT LAUNCH
// ============================================================================

const SOFT_LAUNCH_TASKS: readonly LaunchTask[] = [
  {
    id: 'W4-012',
    description: 'Enable search engine indexing',
    category: 'seo',
    critical: true,
    dependencies: ['W4-009'],
    verification: 'robots.txt allows crawling',
    status: 'pending',
  },
  {
    id: 'W4-013',
    description: 'Verify NO marketing is active',
    category: 'content',
    critical: true,
    dependencies: [],
    verification: 'No press releases, no social posts, no ads',
    status: 'pending',
  },
  {
    id: 'W4-014',
    description: 'Enable observability on legitimacy events',
    category: 'infrastructure',
    critical: true,
    dependencies: ['W1-008'],
    verification: 'Dashboard shows real-time legitimacy scores',
    status: 'pending',
  },
  {
    id: 'W4-015',
    description: 'Enable AI citation logging',
    category: 'infrastructure',
    critical: true,
    dependencies: ['W3-007'],
    verification: 'AI agent citations are tracked',
    status: 'pending',
  },
];

// ============================================================================
// WEEK 4 DEFINITION
// ============================================================================

export const WEEK_4: LaunchWeek = {
  week: 4,
  title: 'SECURITY & GO-LIVE',
  goal: 'The system should rather refuse than lie.',
  days: [
    {
      day: 22,
      day_range: '22-24',
      focus: 'Hardening',
      tasks: HARDENING_TASKS,
    },
    {
      day: 25,
      day_range: '25-26',
      focus: 'Red Team',
      tasks: RED_TEAM_TASKS,
    },
    {
      day: 27,
      day_range: '27-28',
      focus: 'Seed Content',
      tasks: SEED_CONTENT_TASKS,
    },
    {
      day: 29,
      day_range: '29-30',
      focus: 'Soft Launch',
      tasks: SOFT_LAUNCH_TASKS,
    },
  ],
  exit_criteria: 'The system works even if no one likes it.',
};

export const WEEK_4_TASKS = [
  ...HARDENING_TASKS,
  ...RED_TEAM_TASKS,
  ...SEED_CONTENT_TASKS,
  ...SOFT_LAUNCH_TASKS,
] as const;
