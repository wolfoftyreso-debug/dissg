/**
 * "NO HERO MODE"
 * 
 * The system never allows:
 * - Genius attributions
 * - Person-centered decisions
 * - "We trusted X"
 * 
 * Everything reduces to: context + alternatives + uncertainty + choice
 */

import type { HeroModeViolation } from './types';

/**
 * Hero mode patterns
 */
const HERO_PATTERNS: Array<{
  pattern: RegExp;
  type: HeroModeViolation['hero_pattern'];
}> = [
  // Genius attribution
  {
    pattern: /\b(brilliant|genius|visionary|exceptional judgment|extraordinary insight)\b/i,
    type: 'genius_attribution',
  },
  {
    pattern: /\b(only .+ could|.+ saw what others|.+ knew better)\b/i,
    type: 'genius_attribution',
  },
  // Person-centered
  {
    pattern: /\b(because .+ said|.+ decided that|.+ determined|.+ concluded)\b/i,
    type: 'person_centered',
  },
  {
    pattern: /\b(according to .+'s judgment|in .+'s view|.+ believed)\b/i,
    type: 'person_centered',
  },
  // Trust-based
  {
    pattern: /\b(we trusted|we relied on .+'s|.+ was trusted|faith in)\b/i,
    type: 'trust_based',
  },
  {
    pattern: /\b(based on .+'s expertise|.+ has experience|.+ knows best)\b/i,
    type: 'trust_based',
  },
];

/**
 * Check for hero mode violations
 */
export function checkHeroMode(text: string): HeroModeViolation[] {
  const violations: HeroModeViolation[] = [];
  
  for (const { pattern, type } of HERO_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      violations.push({
        violation_id: `hero_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        detected_at: new Date().toISOString(),
        hero_pattern: type,
        problematic_text: match[0],
        required_structure: {
          context: true,
          alternatives: true,
          uncertainty: true,
          choice: true,
        },
      });
    }
  }
  
  return violations;
}

/**
 * Reduce hero statement to structure
 */
export function reduceToStructure(
  heroStatement: string,
  providedStructure: {
    context?: string;
    alternatives?: string[];
    uncertainty?: string[];
    choice?: string;
  }
): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!providedStructure.context || providedStructure.context.length < 20) {
    missing.push('context');
  }
  if (!providedStructure.alternatives || providedStructure.alternatives.length < 2) {
    missing.push('alternatives (minimum 2)');
  }
  if (!providedStructure.uncertainty || providedStructure.uncertainty.length === 0) {
    missing.push('uncertainty (at least 1)');
  }
  if (!providedStructure.choice || providedStructure.choice.length < 10) {
    missing.push('choice');
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Generate reduction prompt
 */
export function generateReductionPrompt(violation: HeroModeViolation): string {
  const prompts: Record<HeroModeViolation['hero_pattern'], string> = {
    genius_attribution: `The statement "${violation.problematic_text}" attributes the decision to individual insight.

Please provide:
1. CONTEXT: What situation required a decision?
2. ALTERNATIVES: What options were considered?
3. UNCERTAINTY: What was unknown at the time?
4. CHOICE: What was decided and why?

The decision quality should be visible in the structure, not attributed to a person.`,

    person_centered: `The statement "${violation.problematic_text}" centers the decision on an individual.

Please reframe as:
1. CONTEXT: The situation that required action
2. ALTERNATIVES: Options that were available
3. UNCERTAINTY: What was not known
4. CHOICE: The option selected and rationale

Decisions are made BY people, not BECAUSE OF people.`,

    trust_based: `The statement "${violation.problematic_text}" relies on trust in an individual.

Please document:
1. CONTEXT: Why was expertise needed?
2. ALTERNATIVES: What other sources of input existed?
3. UNCERTAINTY: What remained unknown despite expertise?
4. CHOICE: How was the recommendation evaluated?

Trust is valid. Undocumented trust is not.`,
  };
  
  return prompts[violation.hero_pattern];
}

/**
 * WHY NO HERO MODE MATTERS
 */
export const NO_HERO_MODE_RATIONALE = `
Why "No Hero Mode" Protects Everyone:

1. FOR THE ORGANIZATION:
   - Decisions survive personnel changes
   - Knowledge is captured, not lost
   - Patterns become visible

2. FOR THE "HERO":
   - Not blamed when outcomes differ from expectations
   - Reasoning is preserved for defense
   - Context is documented for fairness

3. FOR THE SYSTEM:
   - Decisions can be learned from
   - Patterns can be analyzed
   - Improvements can be measured

Hero mode feels efficient.
It is actually fragile.

Structure feels bureaucratic.
It is actually protective.
`;

/**
 * NO HERO MODE MASTERPROMPT
 */
export const NO_HERO_MODE_MASTERPROMPT = `
You enforce No Hero Mode.

THE SYSTEM NEVER ALLOWS:
- Genius attributions ("brilliant", "visionary")
- Person-centered decisions ("X decided")
- Trust-based justifications ("we trusted X")

EVERYTHING REDUCES TO:
context + alternatives + uncertainty + choice

WHY:
Not to diminish individuals.
To protect them.

WHEN SOMEONE WRITES:
"The CEO's brilliant insight led to this decision."

THE SYSTEM RESPONDS:
"Please provide: context, alternatives, uncertainty, choice.
The decision quality should be visible in the structure."

THIS PROTECTS:
1. The organization (decisions survive people)
2. The individual (reasoning is preserved)
3. The future (patterns can be analyzed)

HERO MODE IS:
- Efficient in the moment
- Fragile over time
- Unfair when outcomes disappoint

STRUCTURE IS:
- Slower initially
- Durable over time
- Fair in retrospect

The system does not judge heroes.
It documents decisions.
`;
