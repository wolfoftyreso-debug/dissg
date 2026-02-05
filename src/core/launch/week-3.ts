/**
 * WEEK 3 — PUBLIC SURFACE (DAY 15–21)
 * 
 * Goal: Transparency without narrative.
 */

import type { LaunchWeek, LaunchTask } from './types';

// ============================================================================
// DAY 15-16: PUBLIC PORTAL
// ============================================================================

const PORTAL_TASKS: readonly LaunchTask[] = [
  {
    id: 'W3-001',
    description: 'Implement Decisions list with structure filters',
    category: 'core_logic',
    critical: true,
    dependencies: ['W2-008'],
    verification: 'Filter by domain, scope, legitimacy status works',
    status: 'pending',
  },
  {
    id: 'W3-002',
    description: 'Implement Reference Cases section',
    category: 'core_logic',
    critical: true,
    dependencies: ['W2-009'],
    verification: 'Curated cases display with all required fields',
    status: 'pending',
  },
  {
    id: 'W3-003',
    description: 'Implement Cannot Answer Yet section',
    category: 'core_logic',
    critical: true,
    dependencies: ['W2-010'],
    verification: 'Anonymous question hashes with exact data gaps visible',
    status: 'pending',
  },
  {
    id: 'W3-004',
    description: 'Implement Method & Standards section',
    category: 'content',
    critical: true,
    dependencies: ['W1-002', 'W1-003'],
    verification: 'Charter, Ontology, reading guide accessible',
    status: 'pending',
  },
];

// ============================================================================
// DAY 17-18: SEO & SCHEMA
// ============================================================================

const SEO_TASKS: readonly LaunchTask[] = [
  {
    id: 'W3-005',
    description: 'Deploy CDP pages as live HTML',
    category: 'seo',
    critical: true,
    dependencies: ['W3-001'],
    verification: 'Pages render server-side with full content',
    status: 'pending',
  },
  {
    id: 'W3-006',
    description: 'Implement JSON-LD with custom ontology',
    category: 'seo',
    critical: true,
    dependencies: ['W3-005'],
    verification: 'Google Structured Data Testing Tool validates',
    status: 'pending',
  },
  {
    id: 'W3-007',
    description: 'Add machine-JSON endpoint per page',
    category: 'api',
    critical: true,
    dependencies: ['W3-005'],
    verification: '/decisions/{id}.json returns structured data',
    status: 'pending',
  },
  {
    id: 'W3-008',
    description: 'Add neutral FAQ markup',
    category: 'seo',
    critical: false,
    dependencies: ['W3-005'],
    verification: 'FAQ schema contains no recommendations',
    status: 'pending',
  },
];

// ============================================================================
// DAY 19-21: TRUST ANCHORS
// ============================================================================

const TRUST_ANCHOR_TASKS: readonly LaunchTask[] = [
  {
    id: 'W3-009',
    description: 'Generate first Truth Snapshot',
    category: 'core_logic',
    critical: true,
    dependencies: ['W2-011'],
    verification: 'Snapshot contains Merkle root and event count',
    status: 'pending',
  },
  {
    id: 'W3-010',
    description: 'Publish snapshot hash publicly',
    category: 'infrastructure',
    critical: true,
    dependencies: ['W3-009'],
    verification: 'Hash accessible at known public URL',
    status: 'pending',
  },
  {
    id: 'W3-011',
    description: 'Set up external mirror (min 1 location)',
    category: 'infrastructure',
    critical: true,
    dependencies: ['W3-010'],
    verification: 'Mirror independently verifiable',
    status: 'pending',
  },
];

// ============================================================================
// WEEK 3 DEFINITION
// ============================================================================

export const WEEK_3: LaunchWeek = {
  week: 3,
  title: 'PUBLIC SURFACE',
  goal: 'Transparency without narrative.',
  days: [
    {
      day: 15,
      day_range: '15-16',
      focus: 'Public Portal',
      tasks: PORTAL_TASKS,
    },
    {
      day: 17,
      day_range: '17-18',
      focus: 'SEO & Schema',
      tasks: SEO_TASKS,
    },
    {
      day: 19,
      day_range: '19-21',
      focus: 'Trust Anchors',
      tasks: TRUST_ANCHOR_TASKS,
    },
  ],
  exit_criteria: 'An external party can verify a decision without asking you.',
};

export const WEEK_3_TASKS = [
  ...PORTAL_TASKS,
  ...SEO_TASKS,
  ...TRUST_ANCHOR_TASKS,
] as const;
