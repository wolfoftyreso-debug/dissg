/**
 * BOARD DECISION PREP ENGINE (BDPE)
 * 
 * Decision preparation that makes ignorance visible.
 * System EXPOSES reality, never RECOMMENDS.
 * 
 * For: BRF, Investment Boards, Corporate Boards, 
 *      Foundations, Public Committees, Municipal Boards
 */

// Types
export type {
  OrganizationType,
  DecisionInput,
  DecisionAlternative,
  ConsequenceDimension,
  RelevantDataPoint,
  KnowledgeStatus,
  IrreversibilityLevel,
  DecisionPreparationDocument,
  PostDecisionLock,
} from './types';

// DPD Generator
export { dpdGenerator } from './dpd-generator';

// Post-Decision Lock
export { postDecisionLock } from './post-decision-lock';

// Masterprompt
export {
  BOARD_DECISION_MASTERPROMPT,
  ORGANIZATION_PROMPTS,
  FORBIDDEN_PHRASES,
  REQUIRED_PHRASES,
} from './masterprompt';

/**
 * BDPE SUMMARY
 */
export const BDPE_SUMMARY = {
  purpose: 'Make ignorance visible before decisions',
  never: [
    'Recommend actions',
    'Rank alternatives',
    'Choose for the board',
    'Optimize outcomes',
  ],
  always: [
    'Show alternatives neutrally',
    'Expose known/uncertain/unknown',
    'Map consequence surfaces',
    'Preserve accountability',
  ],
} as const;

/**
 * QUICK START
 */
export function prepareDecision(input: {
  organization_type: 'housing_association' | 'investment_board' | 'corporate_board' | 'foundation' | 'public_committee' | 'municipal_board';
  decision_context: string;
  geo: string;
  population_affected: number;
  time_horizon: string;
  constraints: string[];
}): import('./types').DecisionPreparationDocument {
  const { dpdGenerator } = require('./dpd-generator');
  
  return dpdGenerator.generateDPD({
    organization_type: input.organization_type,
    decision_context: input.decision_context,
    scope: {
      geo: input.geo,
      population_affected: input.population_affected,
      time_horizon: input.time_horizon,
    },
    constraints: input.constraints,
  });
}

/**
 * LOCK DECISION
 */
export function lockDecisionForAccountability(params: {
  dpd_id: string;
  decision_taken: string;
  decision_date: string;
  locked_by: string;
}): import('./types').PostDecisionLock | null {
  const { postDecisionLock } = require('./post-decision-lock');
  return postDecisionLock.lockDecision(params);
}
