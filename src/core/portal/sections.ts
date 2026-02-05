/**
 * PORTAL SECTIONS CONFIGURATION
 * 
 * Four fixed sections:
 * A. Decisions
 * B. Reference Cases
 * C. Cannot Answer Yet
 * D. Method & Standards
 */

import type { PortalSectionConfig, MethodDocument } from './types';

// ============================================================================
// SECTION A: DECISIONS
// ============================================================================

export const SECTION_DECISIONS: PortalSectionConfig = {
  id: 'decisions',
  name: 'Decisions',
  description: 'Locked decisions that are publishable. Filter by structure, not by "best".',
  path: '/public/decisions',
  allowsInteraction: false,
} as const;

// ============================================================================
// SECTION B: REFERENCE CASES
// ============================================================================

export const SECTION_REFERENCE_CASES: PortalSectionConfig = {
  id: 'reference_cases',
  name: 'Reference Cases',
  description: 'Curated collection of canonical examples. Education without a course.',
  path: '/public/reference-cases',
  allowsInteraction: false,
} as const;

// ============================================================================
// SECTION C: CANNOT ANSWER YET
// ============================================================================

export const SECTION_CANNOT_ANSWER: PortalSectionConfig = {
  id: 'cannot_answer',
  name: 'Cannot Answer Yet',
  description: 'All questions that cannot be answered legitimately. Builds trust extremely fast.',
  path: '/public/cannot-answer',
  allowsInteraction: false,
} as const;

// ============================================================================
// SECTION D: METHOD & STANDARDS
// ============================================================================

export const SECTION_METHOD_STANDARDS: PortalSectionConfig = {
  id: 'method_standards',
  name: 'Method & Standards',
  description: 'The only explanatory section. No marketing. No mission text.',
  path: '/public/method',
  allowsInteraction: false,
} as const;

// ============================================================================
// ALL SECTIONS
// ============================================================================

export const ALL_PORTAL_SECTIONS: readonly PortalSectionConfig[] = [
  SECTION_DECISIONS,
  SECTION_REFERENCE_CASES,
  SECTION_CANNOT_ANSWER,
  SECTION_METHOD_STANDARDS,
] as const;

// ============================================================================
// METHOD DOCUMENTS
// ============================================================================

export const METHOD_DOCUMENTS: readonly MethodDocument[] = [
  {
    id: 'charter',
    title: 'Decision Legitimacy Charter',
    description: 'The foundational principles governing decision structure.',
    content_type: 'charter',
    version: '1.0',
    last_updated: '2025-01-01',
  },
  {
    id: 'ontology',
    title: 'Ontology v1',
    description: 'The formal classification of decision elements.',
    content_type: 'ontology',
    version: '1.0',
    last_updated: '2025-01-01',
  },
  {
    id: 'reading-guide',
    title: 'How to Read a Decision Page',
    description: 'Guide to interpreting decision structure without conclusions.',
    content_type: 'guide',
    version: '1.0',
    last_updated: '2025-01-01',
  },
  {
    id: 'exclusions',
    title: 'What the System Does Not Do',
    description: 'Explicit boundaries of system capability and intent.',
    content_type: 'exclusions',
    version: '1.0',
    last_updated: '2025-01-01',
  },
] as const;

// ============================================================================
// UTILITIES
// ============================================================================

export function getSectionById(id: string): PortalSectionConfig | undefined {
  return ALL_PORTAL_SECTIONS.find(s => s.id === id);
}

export function getSectionPath(id: string): string | undefined {
  return ALL_PORTAL_SECTIONS.find(s => s.id === id)?.path;
}

export function getMethodDocument(id: string): MethodDocument | undefined {
  return METHOD_DOCUMENTS.find(d => d.id === id);
}
