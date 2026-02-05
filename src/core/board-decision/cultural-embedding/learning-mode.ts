/**
 * READ-ONLY LEARNING MODE
 * 
 * For new board members, executives, politicians.
 * Practice without power.
 */

import type { LearningModeSession } from './types';

/**
 * Create learning mode session
 */
export function createLearningSession(
  sessionId: string,
  learnerId: string
): LearningModeSession {
  return {
    session_id: sessionId,
    learner_id: learnerId,
    started_at: new Date().toISOString(),
    permissions: {
      can_read_dpd: true,
      can_read_agenda: true,
      can_read_protocol: true,
      can_read_dcs: true,
      can_read_pdrc: true,
      can_make_decisions: false,
      can_modify_anything: false,
    },
    materials_reviewed: [],
    mode: 'observation_only',
  };
}

/**
 * Record material review
 */
export function recordMaterialReview(
  session: LearningModeSession,
  material: {
    type: 'dpd' | 'agenda' | 'protocol' | 'dcs' | 'pdrc';
    document_id: string;
    time_spent_minutes: number;
  }
): LearningModeSession {
  return {
    ...session,
    materials_reviewed: [
      ...session.materials_reviewed,
      {
        ...material,
        reviewed_at: new Date().toISOString(),
      },
    ],
  };
}

/**
 * Get learning progress
 */
export function getLearningProgress(session: LearningModeSession): {
  total_documents_reviewed: number;
  total_time_spent_minutes: number;
  coverage: {
    dpd: number;
    agenda: number;
    protocol: number;
    dcs: number;
    pdrc: number;
  };
  ready_for_participation: boolean;
} {
  const materials = session.materials_reviewed;
  
  const coverage = {
    dpd: materials.filter(m => m.type === 'dpd').length,
    agenda: materials.filter(m => m.type === 'agenda').length,
    protocol: materials.filter(m => m.type === 'protocol').length,
    dcs: materials.filter(m => m.type === 'dcs').length,
    pdrc: materials.filter(m => m.type === 'pdrc').length,
  };
  
  const totalTime = materials.reduce((sum, m) => sum + m.time_spent_minutes, 0);
  
  // Ready when has seen at least 3 of each type
  const readyForParticipation = 
    coverage.dpd >= 3 &&
    coverage.protocol >= 3 &&
    coverage.pdrc >= 1;
  
  return {
    total_documents_reviewed: materials.length,
    total_time_spent_minutes: totalTime,
    coverage,
    ready_for_participation: readyForParticipation,
  };
}

/**
 * Validate action against learning mode permissions
 */
export function validateLearningModeAction(
  session: LearningModeSession,
  action: 'read' | 'decide' | 'modify'
): { allowed: boolean; reason?: string } {
  if (action === 'read') {
    return { allowed: true };
  }
  
  if (action === 'decide') {
    return {
      allowed: false,
      reason: 'Learning mode: Decisions require full membership',
    };
  }
  
  if (action === 'modify') {
    return {
      allowed: false,
      reason: 'Learning mode: Modifications not permitted',
    };
  }
  
  return { allowed: false, reason: 'Unknown action' };
}

/**
 * LEARNING MODE MASTERPROMPT
 */
export const LEARNING_MODE_MASTERPROMPT = `
You manage Read-Only Learning Mode.

WHO USES THIS:
- New board members
- New executives
- New politicians
- Anyone entering decision-making roles

WHAT THEY CAN DO:
- Read DPD
- Read Agenda
- Read Protocol
- Read DCS
- Read PDRC

WHAT THEY CANNOT DO:
- Make decisions
- Modify anything
- Vote
- Sign

THIS IS:
Practice without power.

WHY IT WORKS:
- They see how decisions are actually made
- They learn the structure by observation
- They understand what's expected
- They enter with competence, not just authority

READINESS:
After reviewing sufficient historical decisions,
they understand the culture before having power.

NO ONE SHOULD:
- Make their first decision without observation
- Enter a board without seeing how it works
- Have power before understanding process

THIS PREVENTS:
- "I didn't know that's how we do it"
- Newcomers disrupting established discipline
- Authority without competence
`;
