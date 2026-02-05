/**
 * LEGITIMACY CHECKER
 * 
 * Binary check: Did reality pass correctly?
 * Not moral. Not political. Structural.
 */

import type {
  LegitimacyCheck,
  LegitimacyCriterion,
  LegitimacyStatus,
  CriterionDefinition,
} from './types';
import type { ResponsibilitySession } from '../responsibility/types';

/**
 * All Legitimacy Criteria
 */
export const LEGITIMACY_CRITERIA: CriterionDefinition[] = [
  {
    id: 'context_explicit',
    name: 'Context Explicit',
    description: 'The decision context was clearly defined',
    requirement: 'Scope, timing, and boundaries were explicit before decision',
    validation_method: 'structural',
  },
  {
    id: 'alternatives_exposed',
    name: 'Alternatives Exposed',
    description: 'Realistic alternatives were visible',
    requirement: 'At least 2 alternatives with trade-offs were presented',
    validation_method: 'content',
  },
  {
    id: 'uncertainty_acknowledged',
    name: 'Uncertainty Acknowledged',
    description: 'Unknown factors were explicitly stated',
    requirement: 'Uncertainties were listed and acknowledged by actor',
    validation_method: 'content',
  },
  {
    id: 'responsibility_scaled',
    name: 'Responsibility Scaled',
    description: 'Responsibility matched consequence',
    requirement: 'Decision weight corresponded to impact gravity',
    validation_method: 'structural',
  },
  {
    id: 'scope_defined',
    name: 'Scope Defined',
    description: 'Who is affected was explicit',
    requirement: 'Affected parties were identified and bounded',
    validation_method: 'structural',
  },
  {
    id: 'consequences_projected',
    name: 'Consequences Projected',
    description: 'Outcome ranges were reviewed',
    requirement: 'Best, expected, and worst cases were visible',
    validation_method: 'content',
  },
  {
    id: 'actor_traceable',
    name: 'Actor Traceable',
    description: 'Decision-maker is identifiable',
    requirement: 'Human or AI actor is logged and traceable',
    validation_method: 'actor',
  },
  {
    id: 'time_appropriate',
    name: 'Time Appropriate',
    description: 'Adequate time was spent',
    requirement: 'Minimum review time for gravity level was met',
    validation_method: 'temporal',
  },
];

/**
 * Check decision legitimacy from responsibility session
 */
export function checkLegitimacy(
  session: ResponsibilitySession
): LegitimacyCheck {
  const criteriaResults = LEGITIMACY_CRITERIA.map(criterion => ({
    criterion: criterion.id,
    met: evaluateCriterion(criterion, session),
  }));
  
  const criteriaMet = criteriaResults
    .filter(r => r.met === true)
    .map(r => r.criterion);
  
  const criteriaFailed = criteriaResults
    .filter(r => r.met === false)
    .map(r => r.criterion);
  
  const criteriaUnknown = criteriaResults
    .filter(r => r.met === null)
    .map(r => r.criterion);
  
  const legitimacyScore = criteriaMet.length / LEGITIMACY_CRITERIA.length;
  
  const status = determineStatus(legitimacyScore, criteriaFailed);
  const isLegitimate = status === 'legitimate';
  
  const statement = generateLegitimacyStatement(
    isLegitimate,
    criteriaMet,
    criteriaFailed
  );
  
  return {
    decision_id: session.decision_id,
    decision_legitimate: isLegitimate,
    status,
    criteria_met: criteriaMet,
    criteria_failed: criteriaFailed,
    criteria_unknown: criteriaUnknown,
    legitimacy_score: Math.round(legitimacyScore * 100) / 100,
    legitimacy_statement: statement,
    checked_at: new Date().toISOString(),
    checker_version: '1.0.0',
  };
}

/**
 * Evaluate single criterion
 */
function evaluateCriterion(
  criterion: CriterionDefinition,
  session: ResponsibilitySession
): boolean | null {
  switch (criterion.id) {
    case 'context_explicit':
      return session.gate_statuses.some(
        g => g.gate === 'scope_lock' && g.passed
      );
    
    case 'alternatives_exposed':
      return session.gate_statuses.some(
        g => g.gate === 'alternatives_exposure' && g.passed
      );
    
    case 'uncertainty_acknowledged':
      return session.gate_statuses.some(
        g => g.gate === 'uncertainty_acknowledgement' && g.passed
      );
    
    case 'responsibility_scaled':
      // Check if gates matched gravity
      const requiredGates = session.gravity_result.required_gates.length;
      const passedGates = session.gate_statuses.filter(g => g.passed).length;
      return passedGates >= requiredGates;
    
    case 'scope_defined':
      const scopeGate = session.gate_statuses.find(g => g.gate === 'scope_lock');
      return scopeGate?.passed === true && scopeGate.data !== undefined;
    
    case 'consequences_projected':
      return session.gate_statuses.some(
        g => g.gate === 'consequence_projection' && g.passed
      );
    
    case 'actor_traceable':
      return Boolean(session.actor_id && session.actor_type);
    
    case 'time_appropriate':
      return session.time_on_gates_seconds >= 
             session.gravity_result.minimum_review_time_seconds;
    
    default:
      return null;
  }
}

/**
 * Determine overall status
 */
function determineStatus(
  score: number,
  failed: LegitimacyCriterion[]
): LegitimacyStatus {
  // Critical failures that make decision illegitimate
  const criticalCriteria: LegitimacyCriterion[] = [
    'actor_traceable',
    'responsibility_scaled',
  ];
  
  const hasCriticalFailure = failed.some(f => criticalCriteria.includes(f));
  
  if (hasCriticalFailure) {
    return 'illegitimate';
  }
  
  if (score >= 0.875) {
    return 'legitimate';
  }
  
  if (score >= 0.5) {
    return 'partially_legitimate';
  }
  
  return 'illegitimate';
}

/**
 * Generate legitimacy statement
 */
function generateLegitimacyStatement(
  legitimate: boolean,
  met: LegitimacyCriterion[],
  failed: LegitimacyCriterion[]
): string {
  if (legitimate) {
    const reasons = met.map(c => criterionToReason(c)).join('; ');
    return `This decision meets legitimacy requirements: ${reasons}.`;
  }
  
  const failures = failed.map(c => criterionToFailure(c)).join('; ');
  return `This decision does not meet legitimacy requirements: ${failures}.`;
}

function criterionToReason(criterion: LegitimacyCriterion): string {
  const map: Record<LegitimacyCriterion, string> = {
    context_explicit: 'context was explicitly defined',
    alternatives_exposed: 'realistic alternatives were visible',
    uncertainty_acknowledged: 'uncertainties were acknowledged',
    responsibility_scaled: 'responsibility matched consequence',
    scope_defined: 'affected parties were identified',
    consequences_projected: 'outcome scenarios were reviewed',
    actor_traceable: 'decision-maker is traceable',
    time_appropriate: 'adequate review time was taken',
  };
  return map[criterion];
}

function criterionToFailure(criterion: LegitimacyCriterion): string {
  const map: Record<LegitimacyCriterion, string> = {
    context_explicit: 'context was not explicitly defined',
    alternatives_exposed: 'alternatives were not visible',
    uncertainty_acknowledged: 'uncertainties were not acknowledged',
    responsibility_scaled: 'responsibility did not match consequence',
    scope_defined: 'affected parties were not identified',
    consequences_projected: 'outcome scenarios were not reviewed',
    actor_traceable: 'decision-maker is not traceable',
    time_appropriate: 'review time was insufficient',
  };
  return map[criterion];
}

/**
 * LEGITIMACY CHECKER MASTERPROMPT
 */
export const LEGITIMACY_CHECKER_MASTERPROMPT = `
You check DECISION LEGITIMACY.

CORE PRINCIPLE:
A decision is not legitimate because someone has power.
It is legitimate because reality has been passed correctly.

CRITERIA (binary, not moral):

1. CONTEXT EXPLICIT
   - Scope was defined
   - Timing was stated
   - Boundaries were clear

2. ALTERNATIVES EXPOSED
   - At least 2 alternatives shown
   - Trade-offs visible
   - All reviewed

3. UNCERTAINTY ACKNOWLEDGED
   - Unknowns listed
   - Actor acknowledged
   - Not hidden

4. RESPONSIBILITY SCALED
   - Weight matched gravity
   - Gates matched impact
   - Proportional process

5. SCOPE DEFINED
   - Affected parties identified
   - Boundaries stated
   - Duration known

6. CONSEQUENCES PROJECTED
   - Best case shown
   - Expected case shown
   - Worst case shown

7. ACTOR TRACEABLE
   - Human or AI identified
   - Logged permanently
   - No anonymity

8. TIME APPROPRIATE
   - Minimum time met
   - Cooling off completed
   - Not rushed

LEGITIMACY ≠ CORRECTNESS
LEGITIMACY ≠ OUTCOME
LEGITIMACY = PROCEDURAL HONESTY

A legitimate decision can still be wrong.
An illegitimate decision cannot be defended.
`;
