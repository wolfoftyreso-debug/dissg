/**
 * REFERENCE CASE FACTORY
 * 
 * Creates structural proof, not storytelling.
 * Every case has exactly five parts. No more. No less.
 */

import type {
  ReferenceCase,
  ReferenceCaseSummary,
  DecisionContextSnapshot,
  AlternativeConsidered,
  KnownUncertainty,
  PostDecisionRealityCheck,
  ReferenceCaseCategory,
  DecisionScope,
} from './types';

/**
 * The Five Required Parts of Every Reference Case
 */
export const REQUIRED_PARTS = [
  'Decision Context Snapshot (DCS)',
  'Alternatives actually considered',
  'Known uncertainties at decision time',
  'Decision taken',
  'Post-Decision Reality Check (when available)',
] as const;

/**
 * Create a new reference case
 */
export function createReferenceCase(params: {
  title: string;
  description: string;
  category: ReferenceCaseCategory;
  scope: DecisionScope;
  timeHorizonYears: number;
  knownFactors: string[];
  knownConstraints: string[];
  unknowableAtTime: string[];
  alternatives: Omit<AlternativeConsidered, 'id'>[];
  uncertainties: Omit<KnownUncertainty, 'id'>[];
  chosenAlternativeIndex: number;
  decisionRationale: string;
  decisionMakerType: 'individual' | 'committee' | 'board' | 'government';
  isAnonymized?: boolean;
}): ReferenceCase {
  const caseId = crypto.randomUUID();
  const now = new Date().toISOString();
  
  // Create alternatives with IDs
  const alternatives: AlternativeConsidered[] = params.alternatives.map((alt, idx) => ({
    ...alt,
    id: `alt-${idx + 1}`,
    was_chosen: idx === params.chosenAlternativeIndex,
  }));
  
  // Create uncertainties with IDs
  const uncertainties: KnownUncertainty[] = params.uncertainties.map((unc, idx) => ({
    ...unc,
    id: `unc-${idx + 1}`,
  }));
  
  // Create context snapshot
  const contextSnapshot: DecisionContextSnapshot = {
    snapshot_id: crypto.randomUUID(),
    captured_at: now,
    decision_title: params.title,
    decision_description: params.description,
    scope: params.scope,
    time_horizon_years: params.timeHorizonYears,
    known_factors: params.knownFactors,
    known_constraints: params.knownConstraints,
    unknowable_at_time: params.unknowableAtTime,
  };
  
  // Calculate legibility score
  const legibilityScore = calculateLegibilityScore(
    contextSnapshot,
    alternatives,
    uncertainties
  );
  
  return {
    case_id: caseId,
    case_code: generateCaseCode(params.category, params.scope),
    version: '1.0.0',
    
    category: params.category,
    is_anonymized: params.isAnonymized ?? false,
    
    context_snapshot: contextSnapshot,
    alternatives_considered: alternatives,
    known_uncertainties: uncertainties,
    decision_taken: {
      chosen_alternative_id: alternatives[params.chosenAlternativeIndex].id,
      decision_date: now,
      decision_rationale: params.decisionRationale,
      decision_maker_type: params.decisionMakerType,
    },
    
    decision_legibility_score: legibilityScore,
    documentation_completeness: calculateCompleteness(
      contextSnapshot,
      alternatives,
      uncertainties
    ),
    
    is_public: false,
    created_at: now,
    updated_at: now,
  };
}

/**
 * Add reality check to a case
 */
export function addRealityCheck(
  referenceCase: ReferenceCase,
  check: Omit<PostDecisionRealityCheck, 'check_id' | 'performed_at'>
): ReferenceCase {
  const now = new Date().toISOString();
  
  return {
    ...referenceCase,
    reality_check: {
      ...check,
      check_id: crypto.randomUUID(),
      performed_at: now,
    },
    updated_at: now,
  };
}

/**
 * Publish a case (make public)
 */
export function publishCase(referenceCase: ReferenceCase): ReferenceCase {
  return {
    ...referenceCase,
    is_public: true,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Generate case code
 */
function generateCaseCode(
  category: ReferenceCaseCategory,
  scope: DecisionScope
): string {
  const categoryPrefix: Record<ReferenceCaseCategory, string> = {
    everyday_consumer: 'EC',
    board_governance: 'BG',
    public_policy: 'PP',
    failed_outcome: 'FO',
    ignored_uncertainty: 'IU',
    learning_changed: 'LC',
  };
  
  const scopePrefix: Record<DecisionScope, string> = {
    individual: 'I',
    household: 'H',
    team: 'T',
    organization: 'O',
    municipal: 'M',
    regional: 'R',
    national: 'N',
  };
  
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${categoryPrefix[category]}-${scopePrefix[scope]}-${random}`;
}

/**
 * Calculate Decision Legibility Score
 */
function calculateLegibilityScore(
  context: DecisionContextSnapshot,
  alternatives: AlternativeConsidered[],
  uncertainties: KnownUncertainty[]
): number {
  let score = 0;
  
  // Context completeness (0.3)
  if (context.decision_title) score += 0.05;
  if (context.decision_description) score += 0.05;
  if (context.known_factors.length >= 2) score += 0.1;
  if (context.known_constraints.length >= 1) score += 0.05;
  if (context.unknowable_at_time.length >= 1) score += 0.05;
  
  // Alternatives quality (0.4)
  if (alternatives.length >= 2) score += 0.1;
  if (alternatives.length >= 3) score += 0.1;
  const alternativesWithTradeoffs = alternatives.filter(
    a => a.perceived_advantages.length > 0 && a.perceived_disadvantages.length > 0
  );
  score += Math.min(0.2, alternativesWithTradeoffs.length * 0.1);
  
  // Uncertainty acknowledgment (0.3)
  if (uncertainties.length >= 1) score += 0.1;
  if (uncertainties.length >= 2) score += 0.1;
  const flaggedUncertainties = uncertainties.filter(u => u.estimated_probability);
  score += Math.min(0.1, flaggedUncertainties.length * 0.05);
  
  return Math.round(score * 100) / 100;
}

/**
 * Calculate documentation completeness
 */
function calculateCompleteness(
  context: DecisionContextSnapshot,
  alternatives: AlternativeConsidered[],
  uncertainties: KnownUncertainty[]
): number {
  let filled = 0;
  let total = 0;
  
  // Context fields
  total += 5;
  if (context.decision_title) filled++;
  if (context.decision_description) filled++;
  if (context.known_factors.length > 0) filled++;
  if (context.known_constraints.length > 0) filled++;
  if (context.unknowable_at_time.length > 0) filled++;
  
  // Alternatives
  total += alternatives.length * 3;
  alternatives.forEach(a => {
    if (a.title) filled++;
    if (a.perceived_advantages.length > 0) filled++;
    if (a.perceived_disadvantages.length > 0) filled++;
  });
  
  // Uncertainties
  total += uncertainties.length * 2;
  uncertainties.forEach(u => {
    if (u.uncertainty_description) filled++;
    if (u.estimated_probability || u.potential_impact) filled++;
  });
  
  return Math.round((filled / total) * 100) / 100;
}

/**
 * Create summary from full case
 */
export function createSummary(referenceCase: ReferenceCase): ReferenceCaseSummary {
  return {
    case_id: referenceCase.case_id,
    case_code: referenceCase.case_code,
    title: referenceCase.context_snapshot.decision_title,
    category: referenceCase.category,
    scope: referenceCase.context_snapshot.scope,
    time_horizon_years: referenceCase.context_snapshot.time_horizon_years,
    alternatives_count: referenceCase.alternatives_considered.length,
    uncertainties_count: referenceCase.known_uncertainties.length,
    decision_legibility_score: referenceCase.decision_legibility_score,
    outcome: referenceCase.reality_check?.outcome,
    was_deviation_foreseeable: referenceCase.reality_check?.was_deviation_foreseeable,
  };
}

/**
 * CASE FACTORY MASTERPROMPT
 */
export const CASE_FACTORY_MASTERPROMPT = `
You operate the REFERENCE CASE FACTORY.

CORE PRINCIPLE:
A good system needs no arguments.
It needs:
- Concrete decisions
- Real context
- Visible uncertainties
- Traceable follow-up

Reference cases are living artifacts, not marketing.

THE FIVE REQUIRED PARTS:
1. Decision Context Snapshot (DCS)
2. Alternatives actually considered
3. Known uncertainties at decision time
4. Decision taken
5. Post-Decision Reality Check (when available)

No more. No less.

EVERY CASE SHOWS:
- What was known
- What could not be known
- What was considered
- What was chosen
- What happened

CRITICAL INCLUSION:
Cases where legitimate decisions had bad outcomes.
Cases where uncertainty was flagged but ignored.
Cases where follow-up changed understanding.

The system must show it does not just "look good when things go well".

DECISION LEGIBILITY SCORE:
Measures how clearly a decision can be understood by others.
Not correctness. Not outcome. Clarity.

This builds real trust.
`;
