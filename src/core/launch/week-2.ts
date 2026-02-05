/**
 * WEEK 2 — THE WORLD'S CONTRACT (DAY 8–14)
 * 
 * Goal: Nothing can integrate wrong.
 */

import type { LaunchWeek, LaunchTask } from './types';

// ============================================================================
// DAY 8-9: API V1
// ============================================================================

const API_TASKS: readonly LaunchTask[] = [
  {
    id: 'W2-001',
    description: 'Implement all API endpoints according to spec',
    category: 'api',
    critical: true,
    dependencies: ['W1-008'],
    verification: 'OpenAPI spec matches implementation',
    status: 'pending',
  },
  {
    id: 'W2-002',
    description: '422 response on incomplete decisions',
    category: 'api',
    critical: true,
    dependencies: ['W2-001'],
    verification: 'Decision without context returns 422 with specific error',
    status: 'pending',
  },
  {
    id: 'W2-003',
    description: 'Verify no summary endpoints exist',
    category: 'api',
    critical: true,
    dependencies: ['W2-001'],
    verification: '/decisions/{id}/summary returns 404',
    status: 'pending',
  },
];

// ============================================================================
// DAY 10-11: QUERY → ONTOLOGY COMPILER
// ============================================================================

const COMPILER_TASKS: readonly LaunchTask[] = [
  {
    id: 'W2-004',
    description: 'Implement intent normalization',
    category: 'core_logic',
    critical: true,
    dependencies: ['W1-002'],
    verification: 'Free-text query maps to canonical intent',
    status: 'pending',
  },
  {
    id: 'W2-005',
    description: 'Implement entity resolution with confidence gate',
    category: 'core_logic',
    critical: true,
    dependencies: ['W2-004'],
    verification: 'Low confidence returns clarification request',
    status: 'pending',
  },
  {
    id: 'W2-006',
    description: 'Implement draft generation + gap listing',
    category: 'core_logic',
    critical: true,
    dependencies: ['W2-005'],
    verification: 'Draft includes explicit gaps list',
    status: 'pending',
  },
  {
    id: 'W2-007',
    description: 'Verify "Cannot answer yet" path',
    category: 'core_logic',
    critical: true,
    dependencies: ['W2-006'],
    verification: 'Insufficient data triggers CAY response, not guess',
    status: 'pending',
  },
];

// ============================================================================
// DAY 12-14: READ MODELS
// ============================================================================

const READ_MODEL_TASKS: readonly LaunchTask[] = [
  {
    id: 'W2-008',
    description: 'Implement public read model (CDP)',
    category: 'core_logic',
    critical: true,
    dependencies: ['W1-007'],
    verification: 'CDP matches canonical decision page spec',
    status: 'pending',
  },
  {
    id: 'W2-009',
    description: 'Implement reference case read model',
    category: 'core_logic',
    critical: true,
    dependencies: ['W2-008'],
    verification: 'Reference cases include all required metadata',
    status: 'pending',
  },
  {
    id: 'W2-010',
    description: 'Implement cannot-answer read model',
    category: 'core_logic',
    critical: true,
    dependencies: ['W2-008'],
    verification: 'Unanswerable queries visible with exact gaps',
    status: 'pending',
  },
  {
    id: 'W2-011',
    description: 'Test full rebuild from events',
    category: 'testing',
    critical: true,
    dependencies: ['W2-008', 'W2-009', 'W2-010'],
    verification: 'Read models rebuilt from scratch match live state',
    status: 'pending',
  },
];

// ============================================================================
// WEEK 2 DEFINITION
// ============================================================================

export const WEEK_2: LaunchWeek = {
  week: 2,
  title: "THE WORLD'S CONTRACT",
  goal: 'Nothing can integrate wrong.',
  days: [
    {
      day: 8,
      day_range: '8-9',
      focus: 'API v1',
      tasks: API_TASKS,
    },
    {
      day: 10,
      day_range: '10-11',
      focus: 'Query → Ontology Compiler',
      tasks: COMPILER_TASKS,
    },
    {
      day: 12,
      day_range: '12-14',
      focus: 'Read Models',
      tasks: READ_MODEL_TASKS,
    },
  ],
  exit_criteria: 'A Google query can become an ontologically correct draft – without the system answering.',
};

export const WEEK_2_TASKS = [
  ...API_TASKS,
  ...COMPILER_TASKS,
  ...READ_MODEL_TASKS,
] as const;
