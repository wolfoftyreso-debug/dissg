/**
 * "GOOD INTENTIONS" FILTER
 * 
 * Phrases that sound reasonable but bypass structure.
 * Not censorship — structure requirement.
 */

import type { GoodIntentionsViolation } from './types';

/**
 * Phrases that require structure
 */
const FLAGGED_PHRASES: Array<{
  pattern: RegExp;
  category: GoodIntentionsViolation['phrase_category'];
  required_structure: string;
}> = [
  // Obviousness claims
  {
    pattern: /\b(this is obvious|obviously|it's clear that|clearly|self-evident)\b/i,
    category: 'obviousness',
    required_structure: 'If obvious, state the explicit reasoning chain.',
  },
  {
    pattern: /\b(everyone knows|we all know|it goes without saying)\b/i,
    category: 'consensus',
    required_structure: 'Specify who knows and what evidence supports this.',
  },
  // Precedent claims
  {
    pattern: /\b(we've done this before|we always do|this is how we|as usual)\b/i,
    category: 'precedent',
    required_structure: 'Reference the specific prior decision and confirm context similarity.',
  },
  {
    pattern: /\b(standard practice|normal procedure|we traditionally)\b/i,
    category: 'precedent',
    required_structure: 'Confirm the practice is documented and applicable here.',
  },
  // No alternatives claims
  {
    pattern: /\b(there('s| is) no (other |real )?alternative|only option|no choice|must do this)\b/i,
    category: 'no_alternatives',
    required_structure: 'Document at least one alternative, even if rejected.',
  },
  {
    pattern: /\b(we have to|we must|no other way|the only way)\b/i,
    category: 'no_alternatives',
    required_structure: 'Explain constraints that eliminate alternatives.',
  },
  // Consensus claims
  {
    pattern: /\b(everyone agrees|unanimous|no one disagrees|we all think)\b/i,
    category: 'consensus',
    required_structure: 'Document the process by which agreement was established.',
  },
];

/**
 * Check text for good intentions violations
 */
export function checkGoodIntentions(
  text: string
): GoodIntentionsViolation[] {
  const violations: GoodIntentionsViolation[] = [];
  
  for (const { pattern, category, required_structure } of FLAGGED_PHRASES) {
    const match = text.match(pattern);
    if (match) {
      violations.push({
        phrase_detected: match[0],
        phrase_category: category,
        required_structure,
        blocked: false, // Never blocked
        structure_provided: false,
      });
    }
  }
  
  return violations;
}

/**
 * Check if structure has been provided for violation
 */
export function validateStructureProvided(
  violation: GoodIntentionsViolation,
  additionalContext: string
): GoodIntentionsViolation {
  // Check if additional context provides the required structure
  const hasStructure = additionalContext.length > 50 && 
    !FLAGGED_PHRASES.some(p => p.pattern.test(additionalContext));
  
  return {
    ...violation,
    structure_provided: hasStructure,
  };
}

/**
 * Generate prompt for structure requirement
 */
export function generateStructurePrompt(
  violation: GoodIntentionsViolation
): string {
  const prompts: Record<GoodIntentionsViolation['phrase_category'], string> = {
    obviousness: `You stated: "${violation.phrase_detected}"

If this is truly obvious, please document the reasoning chain that makes it so.
What would someone need to know to reach the same conclusion?`,
    
    precedent: `You referenced past practice: "${violation.phrase_detected}"

Please specify:
- Which prior decision this references
- Whether the context is similar enough for the precedent to apply`,
    
    consensus: `You claimed consensus: "${violation.phrase_detected}"

Please document:
- How this consensus was established
- Who was part of the discussion
- Whether dissenting views were considered`,
    
    no_alternatives: `You stated there are no alternatives: "${violation.phrase_detected}"

The system requires at least one alternative to be documented.
If truly no alternatives exist, please explain the constraints that eliminate them.`,
  };
  
  return prompts[violation.phrase_category];
}

/**
 * GOOD INTENTIONS FILTER MASTERPROMPT
 */
export const GOOD_INTENTIONS_FILTER_MASTERPROMPT = `
You enforce the Good Intentions Filter.

PRINCIPLE:
Some phrases sound reasonable but bypass structure:
- "This is obvious"
- "We've done this before"
- "Everyone knows"
- "There are no alternatives"

YOUR JOB:
Not to censor — but to require structure behind the claim.

FLAGGED PHRASE CATEGORIES:
1. obviousness - Claims that something is self-evident
2. precedent - Appeals to past practice
3. consensus - Claims of universal agreement
4. no_alternatives - Claims that no other options exist

RESPONSE:
Never block.
Always prompt for structure.

EXAMPLE:
User: "This is obviously the right choice."
System: "If obvious, state the explicit reasoning chain."

WHY THIS MATTERS:
These phrases are how drift begins.
They sound reasonable.
They bypass rigor.
They accumulate.

The filter makes the implicit explicit.
That's all it does.
That's enough.
`;
