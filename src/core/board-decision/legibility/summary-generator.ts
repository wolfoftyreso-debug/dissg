/**
 * ANTI-NARRATIVE SUMMARY GENERATOR
 * 
 * Max 6 lines. No adjectives. No retrospective explanations.
 * This is the ONLY summary field allowed.
 */

import type { DecisionPreparationDocument } from '../types';
import type { DecisionSummary } from './types';


/**
 * Forbidden words in summaries (adjectives, value judgments, retrospective wisdom)
 */
const FORBIDDEN_WORDS = [
  // Adjectives
  'good', 'bad', 'excellent', 'poor', 'best', 'worst', 'great', 'terrible',
  'bra', 'dålig', 'utmärkt', 'bäst', 'sämst', 'fantastisk',
  
  // Value judgments
  'success', 'failure', 'mistake', 'correct', 'wrong', 'right',
  'framgång', 'misslyckande', 'misstag', 'rätt', 'fel',
  
  // Retrospective wisdom
  'obviously', 'clearly', 'should have', 'could have', 'in hindsight',
  'uppenbarligen', 'tydligt', 'borde ha', 'kunde ha', 'i efterhand',
  
  // Hero/blame language
  'brave', 'courageous', 'reckless', 'foolish', 'visionary',
  'modig', 'dåraktig', 'visionär', 'ansvarslös',
];

/**
 * Generate anti-narrative decision summary
 */
export function generateDecisionSummary(
  dpd: DecisionPreparationDocument,
  decisionTaken: string,
  lockedBy: string
): DecisionSummary {
  const alternatives = dpd.alternatives.map(a => `${a.id}: ${a.label}`);
  const knownRisks = extractKnownRisks(dpd);
  const uncertainties = dpd.knowledge_status.uncertain.slice(0, 3);
  
  // Generate neutral summary text
  const summaryText = generateNeutralSummary(
    dpd,
    decisionTaken,
    alternatives,
    knownRisks,
    uncertainties
  );
  
  return {
    decision_id: dpd.dpd_id,
    context: dpd.overview.decision_subject,
    alternatives_considered: alternatives,
    known_risks: knownRisks,
    flagged_uncertainties: uncertainties,
    decision_taken: decisionTaken,
    summary_text: summaryText,
    locked_at: new Date().toISOString(),
    locked_by: lockedBy,
    is_immutable: true,
  };
}

/**
 * Extract known risks from consequence surfaces
 */
function extractKnownRisks(dpd: DecisionPreparationDocument): string[] {
  const risks: string[] = [];
  
  for (const altId of Object.keys(dpd.consequence_surfaces)) {
    const surfaces = dpd.consequence_surfaces[altId];
    for (const surface of surfaces) {
      if (surface.uncertainty === 'high' || surface.uncertainty === 'unknown') {
        risks.push(`${surface.dimension} (${altId})`);
      }
    }
  }
  
  return risks.slice(0, 5);
}

/**
 * Generate neutral summary (max 6 lines, no adjectives)
 */
function generateNeutralSummary(
  dpd: DecisionPreparationDocument,
  decisionTaken: string,
  alternatives: string[],
  knownRisks: string[],
  uncertainties: string[]
): string {
  const lines: string[] = [];
  
  // Line 1: Decision taken
  lines.push(`Decision ${dpd.dpd_id} was taken on ${new Date().toISOString().split('T')[0]}.`);
  
  // Line 2: Context
  lines.push(`Context: ${dpd.overview.decision_subject}.`);
  
  // Line 3: Alternatives
  lines.push(`Alternatives considered: ${alternatives.join(', ')}.`);
  
  // Line 4: Decision
  lines.push(`Alternative ${decisionTaken} was selected.`);
  
  // Line 5: Risks (if any)
  if (knownRisks.length > 0) {
    lines.push(`Known risks: ${knownRisks.join(', ')}.`);
  }
  
  // Line 6: Uncertainties (if any)
  if (uncertainties.length > 0) {
    lines.push(`Flagged uncertainties: ${uncertainties.join(', ')}.`);
  }
  
  // Validate and sanitize
  const summary = lines.slice(0, 6).join('\n');
  return sanitizeSummary(summary);
}

/**
 * Sanitize summary - remove forbidden words
 */
function sanitizeSummary(text: string): string {
  let sanitized = text;
  
  for (const word of FORBIDDEN_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    sanitized = sanitized.replace(regex, '[REDACTED]');
  }
  
  return sanitized;
}

/**
 * Validate that summary is immutable
 * Returns true if modification is blocked
 */
export function validateSummaryImmutability(
  existingSummary: DecisionSummary,
  outcomeObserved: boolean
): { blocked: boolean; reason: string } {
  if (!existingSummary.is_immutable) {
    return { blocked: false, reason: '' };
  }
  
  if (outcomeObserved) {
    return {
      blocked: true,
      reason: 'FORBIDDEN RETROSPECTION RULE: Summary cannot be modified after outcome observed',
    };
  }
  
  return {
    blocked: true,
    reason: 'Summary is locked and immutable',
  };
}

/**
 * SUMMARY GENERATOR MASTERPROMPT
 */
export const SUMMARY_GENERATOR_MASTERPROMPT = `
You generate decision summaries.

RULES (ABSOLUTE):
1. Maximum 6 lines
2. No adjectives
3. No value judgments
4. No retrospective explanations
5. No hero or blame language

FORBIDDEN:
- "good/bad decision"
- "should have"
- "in hindsight"
- "brave/foolish"
- "success/failure"

STRUCTURE:
Line 1: Decision ID and date
Line 2: Context
Line 3: Alternatives considered
Line 4: Alternative selected
Line 5: Known risks (if any)
Line 6: Flagged uncertainties (if any)

AFTER OUTCOME OBSERVED:
The summary CANNOT be modified.
The Post-Decision Reality Check is added BESIDE it.
Never merge then and now.
`;
