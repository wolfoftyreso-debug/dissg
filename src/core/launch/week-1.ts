/**
 * WEEK 1 — THE CORE IS LOCKED (DAY 1–7)
 * 
 * Goal: It should be impossible to build wrong.
 */

import type { LaunchWeek, LaunchTask } from './types';

// ============================================================================
// DAY 1-2: REPO & RULES
// ============================================================================

const REPO_TASKS: readonly LaunchTask[] = [
  {
    id: 'W1-001',
    description: 'Create monorepo structure (core / api / read-model / portal)',
    category: 'infrastructure',
    critical: true,
    dependencies: [],
    verification: 'All packages exist and build independently',
    status: 'pending',
  },
  {
    id: 'W1-002',
    description: 'Lock Ontology v1 as read-only package',
    category: 'core_logic',
    critical: true,
    dependencies: ['W1-001'],
    verification: 'npm install cannot modify ontology package',
    status: 'pending',
  },
  {
    id: 'W1-003',
    description: 'Lock Charter as immutable artifact',
    category: 'core_logic',
    critical: true,
    dependencies: ['W1-001'],
    verification: 'File hash matches committed hash',
    status: 'pending',
  },
  {
    id: 'W1-004',
    description: 'CI rule: ontology change → fail build',
    category: 'infrastructure',
    critical: true,
    dependencies: ['W1-002'],
    verification: 'PR that modifies ontology is blocked',
    status: 'pending',
  },
];

// ============================================================================
// DAY 3-4: EVENT STORE
// ============================================================================

const EVENT_STORE_TASKS: readonly LaunchTask[] = [
  {
    id: 'W1-005',
    description: 'Implement append-only event store (Postgres / EventStoreDB)',
    category: 'infrastructure',
    critical: true,
    dependencies: ['W1-001'],
    verification: 'UPDATE/DELETE operations fail',
    status: 'pending',
  },
  {
    id: 'W1-006',
    description: 'Implement hash chaining for events',
    category: 'core_logic',
    critical: true,
    dependencies: ['W1-005'],
    verification: 'Each event contains prev_hash and hash',
    status: 'pending',
  },
  {
    id: 'W1-007',
    description: 'Replay test: full state rebuild from events',
    category: 'testing',
    critical: true,
    dependencies: ['W1-006'],
    verification: 'State rebuilt from empty matches current state',
    status: 'pending',
  },
];

// ============================================================================
// DAY 5-7: CORE WRITE MODEL
// ============================================================================

const WRITE_MODEL_TASKS: readonly LaunchTask[] = [
  {
    id: 'W1-008',
    description: 'Implement command handlers (create, attach, lock, review)',
    category: 'core_logic',
    critical: true,
    dependencies: ['W1-005'],
    verification: 'All commands produce correct events',
    status: 'pending',
  },
  {
    id: 'W1-009',
    description: 'Isolate Legitimacy Engine as pure function',
    category: 'core_logic',
    critical: true,
    dependencies: ['W1-008'],
    verification: 'Engine has no side effects, returns LegitimacyScore',
    status: 'pending',
  },
  {
    id: 'W1-010',
    description: 'Activate forbidden-field scanner',
    category: 'security',
    critical: true,
    dependencies: ['W1-008'],
    verification: 'Payload with "recommendation" field is rejected',
    status: 'pending',
  },
  {
    id: 'W1-011',
    description: 'Lock = hard freeze (409 on any change attempt)',
    category: 'core_logic',
    critical: true,
    dependencies: ['W1-008'],
    verification: 'Locked decision returns 409 Conflict on modification',
    status: 'pending',
  },
];

// ============================================================================
// WEEK 1 DEFINITION
// ============================================================================

export const WEEK_1: LaunchWeek = {
  week: 1,
  title: 'THE CORE IS LOCKED',
  goal: 'It should be impossible to build wrong.',
  days: [
    {
      day: 1,
      day_range: '1-2',
      focus: 'Repo & Rules',
      tasks: REPO_TASKS,
    },
    {
      day: 3,
      day_range: '3-4',
      focus: 'Event Store',
      tasks: EVENT_STORE_TASKS,
    },
    {
      day: 5,
      day_range: '5-7',
      focus: 'Core Write Model',
      tasks: WRITE_MODEL_TASKS,
    },
  ],
  exit_criteria: 'A decision can be created, validated, locked – and cannot be destroyed.',
};

export const WEEK_1_TASKS = [
  ...REPO_TASKS,
  ...EVENT_STORE_TASKS,
  ...WRITE_MODEL_TASKS,
] as const;
