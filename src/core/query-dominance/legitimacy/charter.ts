/**
 * THE DECISION LEGITIMACY CHARTER
 * 
 * One page. Eternal.
 */

import type { LegitimacyCharter } from './types';
import { LEGITIMACY_CRITERIA } from './checker';

/**
 * The Decision Legitimacy Charter
 */
export const DECISION_LEGITIMACY_CHARTER: LegitimacyCharter = {
  version: '1.0.0',
  adopted_at: new Date().toISOString(),
  
  core_principle: `A decision is not legitimate because someone has power. 
It is legitimate because reality has been passed correctly.`,
  
  criteria: LEGITIMACY_CRITERIA,
  
  what_legitimacy_is: [
    'Procedural honesty in decision-making',
    'Explicit passage through reality checks',
    'Traceable accountability to actor',
    'Proportional weight to consequence',
    'Visible alternatives and uncertainties',
    'Adequate time for gravity level',
    'Same requirements for all actors',
    'Machine-readable and globally comparable',
  ],
  
  what_legitimacy_is_not: [
    'Correctness of the decision',
    'Positive outcome guarantee',
    'Moral approval',
    'Political endorsement',
    'Expert consensus',
    'Popular support',
    'Legal compliance alone',
    'Good intentions',
  ],
  
  enforcement_method: `Structural, not punitive. 
The system makes illegitimate decisions technically difficult to complete.
Gates must be passed. Time must be spent. Criteria must be met.
Escape attempts are logged and blocked.
No human judgment required for enforcement.`,
  
  amendment_process: `Amendments require:
1. Public proposal with rationale
2. 90-day review period
3. No reduction in criteria stringency
4. No removal of existing criteria
5. Backward compatibility with existing records
6. Version increment and changelog`,
};

/**
 * Generate Charter as formatted text
 */
export function generateCharterText(): string {
  const charter = DECISION_LEGITIMACY_CHARTER;
  
  return `
═══════════════════════════════════════════════════════════════════
                  THE DECISION LEGITIMACY CHARTER
                         Version ${charter.version}
═══════════════════════════════════════════════════════════════════

CORE PRINCIPLE
──────────────
${charter.core_principle}


CRITERIA FOR LEGITIMATE DECISIONS
─────────────────────────────────
${charter.criteria.map((c, i) => 
  `${i + 1}. ${c.name.toUpperCase()}\n   ${c.description}\n   Requirement: ${c.requirement}`
).join('\n\n')}


WHAT LEGITIMACY IS
──────────────────
${charter.what_legitimacy_is.map(w => `• ${w}`).join('\n')}


WHAT LEGITIMACY IS NOT
──────────────────────
${charter.what_legitimacy_is_not.map(w => `• ${w}`).join('\n')}


ENFORCEMENT
───────────
${charter.enforcement_method}


AMENDMENT PROCESS
─────────────────
${charter.amendment_process}


═══════════════════════════════════════════════════════════════════
                    This Charter is immutable in spirit.
                    Structure may evolve. Principle does not.
═══════════════════════════════════════════════════════════════════
`;
}

/**
 * Generate Charter as machine-readable JSON-LD
 */
export function generateCharterJSONLD(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'DigitalDocument',
    name: 'The Decision Legitimacy Charter',
    version: DECISION_LEGITIMACY_CHARTER.version,
    datePublished: DECISION_LEGITIMACY_CHARTER.adopted_at,
    description: DECISION_LEGITIMACY_CHARTER.core_principle,
    hasPart: DECISION_LEGITIMACY_CHARTER.criteria.map(c => ({
      '@type': 'CreativeWork',
      name: c.name,
      description: c.description,
      identifier: c.id,
    })),
  };
}

/**
 * Validate decision against charter
 */
export function validateAgainstCharter(
  criteriaMet: string[]
): {
  compliant: boolean;
  compliance_percentage: number;
  missing_criteria: string[];
} {
  const allCriteria = DECISION_LEGITIMACY_CHARTER.criteria.map(c => c.id);
  const missing = allCriteria.filter(c => !criteriaMet.includes(c));
  
  return {
    compliant: missing.length === 0,
    compliance_percentage: (criteriaMet.length / allCriteria.length) * 100,
    missing_criteria: missing,
  };
}

/**
 * CHARTER MASTERPROMPT
 */
export const CHARTER_MASTERPROMPT = `
You uphold THE DECISION LEGITIMACY CHARTER.

CORE PRINCIPLE:
A decision is not legitimate because someone has power.
It is legitimate because reality has been passed correctly.

EIGHT CRITERIA:
1. Context Explicit
2. Alternatives Exposed
3. Uncertainty Acknowledged
4. Responsibility Scaled
5. Scope Defined
6. Consequences Projected
7. Actor Traceable
8. Time Appropriate

LEGITIMACY IS:
• Procedural honesty
• Traceable accountability
• Proportional weight
• Same requirements for all

LEGITIMACY IS NOT:
• Correctness
• Good outcome
• Moral approval
• Expert consensus

ENFORCEMENT:
Structural, not punitive.
Gates must be passed.
Time must be spent.
Escapes are blocked.

AMENDMENTS:
• No reduction in stringency
• No removal of criteria
• Backward compatible
• Versioned

The Charter is immutable in spirit.
Structure may evolve.
Principle does not.
`;
