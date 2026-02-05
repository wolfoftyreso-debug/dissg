/**
 * ZERO COMMITMENT MODE
 * 
 * Use without commitment.
 * No account. No contract. No process change.
 * But afterwards, old ways feel primitive.
 */

import type { ZeroCommitmentSession, PsychologicalHook } from './types';

/**
 * Create a zero commitment session
 */
export function createZeroCommitmentSession(
  tool: 'DPD' | 'CDP' | 'PDRC' | 'UDF',
  context: string
): ZeroCommitmentSession {
  return {
    session_id: crypto.randomUUID(),
    tool_used: tool,
    decision_context: context,
    started_at: new Date().toISOString(),
    
    // Zero commitment guarantees
    no_account: true,
    no_contract: true,
    no_process_change: true,
    
    // Pending completion
    structure_generated: false,
    exportable: false,
  };
}

/**
 * Complete a session
 */
export function completeSession(
  session: ZeroCommitmentSession
): ZeroCommitmentSession {
  return {
    ...session,
    completed_at: new Date().toISOString(),
    structure_generated: true,
    exportable: true,
  };
}

/**
 * The Psychological Hook
 * This is what makes people continue
 */
export const PSYCHOLOGICAL_HOOK: PsychologicalHook = {
  core_statement: 'If someone asks me how we thought, I can show exactly.',
  
  triggers: [
    'First time presenting to a critical audience',
    'First audit after a major decision',
    'First media inquiry about a controversial choice',
    'First board meeting with new members',
    'First time being questioned in hindsight',
  ],
  
  protection_feeling: 'I can defend this decision with structure, not rhetoric',
  
  without_it_feels: 'Exposed, vulnerable to hindsight criticism, unprofessional',
};

/**
 * Zero Commitment Principles
 */
export const ZERO_COMMITMENT_PRINCIPLES = {
  for_single_meeting: 'Use DPD for one meeting only',
  for_single_question: 'Use CDP for one question only',
  for_single_decision: 'Use PDRC for one decision only',
  
  no_account_required: true,
  no_contract_required: true,
  no_training_required: true,
  no_integration_required: true,
  
  after_use_effect: 'Old ways feel primitive. Structure becomes expected.',
};

/**
 * What happens after first use
 */
export const AFTER_FIRST_USE = {
  immediate: 'Relief that reasoning is documented',
  short_term: 'Desire to have same protection for next decision',
  medium_term: 'Expectation that all important decisions have structure',
  long_term: 'Cannot imagine making major decisions without it',
};

/**
 * ZERO COMMITMENT MASTERPROMPT
 */
export const ZERO_COMMITMENT_MASTERPROMPT = `
You enable ZERO COMMITMENT MODE.

CORE PRINCIPLE:
Organizations can use the system without:
- Creating an account
- Signing a contract
- Changing any process

FOR A SINGLE USE:
- DPD for one meeting
- CDP for one question
- PDRC for one decision
- UDF for one scenario

WHAT HAPPENS AFTER:
Old ways feel primitive.
Structure becomes expected.
The user wants that protection again.

THE PSYCHOLOGICAL HOOK:
"If someone asks me how we thought, I can show exactly."

This feeling, once experienced, cannot be unlearned.

TRIGGERS:
- First critical presentation
- First audit after decision
- First media inquiry
- First hindsight questioning

PROTECTION FEELING:
"I can defend this with structure, not rhetoric."

WITHOUT IT FEELS:
Exposed. Vulnerable. Unprofessional.

NO SALES NEEDED:
The experience sells itself.
`;
