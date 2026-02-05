 /**
  * PUBLIC AI AGENT SPECIFICATION
  * 
  * This is the document that makes:
  *   - AI agents choose you
  *   - Other systems adapt to you
  * 
  * RELEASE THIS PUBLICLY.
  */
 
 // Agent Contract (core guarantees and constraints)
 export * from './agent-contract';
 
 // API Reference (endpoints, authentication, errors)
 export * from './api-reference';
 
 // Integration Guide (how to implement)
 export * from './integration-guide';
 
 // Onboarding Spec (machine-readable, public)
 export * from './onboarding.yaml';
 
 /**
  * PUBLIC SPEC VERSION
  */
 export const PUBLIC_SPEC_VERSION = {
   version: '1.0.0',
   status: 'stable',
   last_updated: '2025-01-01',
   breaking_changes_locked: true,
 } as const;