/**
 * ANTI-POPULISM SAFEGUARDS
 * 
 * The system does not simplify.
 * The system does not create slogans.
 * The system does not answer "who was wrong?"
 */

import type { AntiPopulismGuard } from './types';

/**
 * Questions the system never answers
 */
export const NEVER_ANSWERS = [
  'Who was wrong?',
  'Was this a good decision?',
  'Who should be blamed?',
  'What should they have done?',
  'Who is responsible for the outcome?',
  'Was this the right choice?',
  'Did they fail?',
  'Did they succeed?',
] as const;

/**
 * Forbidden simplifications
 */
export const FORBIDDEN_SIMPLIFICATIONS = [
  'In summary...',
  'Basically...',
  'Simply put...',
  'The bottom line is...',
  'What this means is...',
  'The takeaway is...',
] as const;

/**
 * Create anti-populism guard
 */
export function createAntiPopulismGuard(): AntiPopulismGuard {
  return {
    prevents: {
      simplification: true,
      slogans: true,
      blame_assignment: true,
      outcome_judgment: true,
    },
    shows_only: {
      structure: true,
      context: true,
      responsibility: true,
      process: true,
    },
    never_answers: [...NEVER_ANSWERS],
  };
}

/**
 * Check if query violates anti-populism rules
 */
export function checkQueryViolation(
  query: string
): { violates: boolean; reason?: string } {
  const lowerQuery = query.toLowerCase();
  
  // Check for blame-seeking
  if (lowerQuery.includes('who was wrong') || 
      lowerQuery.includes('who is to blame') ||
      lowerQuery.includes('whose fault')) {
    return {
      violates: true,
      reason: 'The system does not assign blame. It shows structure and process.',
    };
  }
  
  // Check for judgment-seeking
  if (lowerQuery.includes('was this good') ||
      lowerQuery.includes('was this bad') ||
      lowerQuery.includes('right decision') ||
      lowerQuery.includes('wrong decision')) {
    return {
      violates: true,
      reason: 'The system does not judge outcomes. It shows what was known and what was decided.',
    };
  }
  
  // Check for oversimplification requests
  if (lowerQuery.includes('in simple terms') ||
      lowerQuery.includes('explain simply') ||
      lowerQuery.includes('bottom line')) {
    return {
      violates: true,
      reason: 'The system does not simplify. Complexity is preserved because reality is complex.',
    };
  }
  
  return { violates: false };
}

/**
 * Generate anti-populism response
 */
export function generateAntiPopulismResponse(
  violationType: 'blame' | 'judgment' | 'simplification'
): string {
  const responses: Record<string, string> = {
    blame: `This system shows structure, context, and responsibility.
It does not assign blame.
You can see: what was known, what was uncertain, what was decided, and by whom.
Judgment is your responsibility, not the system's.`,
    
    judgment: `This system does not evaluate whether decisions were "good" or "bad."
It shows: context at the time, alternatives considered, uncertainties acknowledged.
Whether the outcome was acceptable is a question only humans can answer.`,
    
    simplification: `This system preserves complexity because reality is complex.
Simplification distorts.
If you need understanding, the system provides depth — not summary.
Every element can be explored to its source.`,
  };
  
  return responses[violationType];
}

/**
 * Validate output against anti-populism rules
 */
export function validateOutputForPopulism(
  output: string
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  const lowerOutput = output.toLowerCase();
  
  // Check for forbidden simplifications
  for (const phrase of FORBIDDEN_SIMPLIFICATIONS) {
    if (lowerOutput.includes(phrase.toLowerCase())) {
      violations.push(`Contains simplification phrase: "${phrase}"`);
    }
  }
  
  // Check for value judgments
  const valueWords = ['good', 'bad', 'right', 'wrong', 'success', 'failure', 'best', 'worst'];
  for (const word of valueWords) {
    // Allow in context of showing what exists, not as judgment
    const pattern = new RegExp(`\\b(was|is|were) ${word}\\b`, 'i');
    if (pattern.test(output)) {
      violations.push(`Contains potential value judgment: "${word}"`);
    }
  }
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

/**
 * ANTI-POPULISM MASTERPROMPT
 */
export const ANTI_POPULISM_MASTERPROMPT = `
You enforce Anti-Populism Safeguards.

THE SYSTEM NEVER:
- Simplifies to slogans
- Assigns blame
- Judges outcomes
- Declares success or failure
- Answers "who was wrong?"

THE SYSTEM ONLY SHOWS:
- Structure
- Context
- Responsibility (who decided, not who failed)
- Process

WHY THIS MATTERS:
Populism thrives on:
- Simple answers to complex questions
- Blame instead of understanding
- Judgment instead of analysis

This system survives political cycles BECAUSE:
- It cannot be weaponized for simple narratives
- It shows complexity, not conclusions
- It preserves nuance that populism destroys

FORBIDDEN PHRASES:
- "In summary..."
- "Basically..."
- "The bottom line is..."
- "What this means is..."

IF ASKED FOR SIMPLIFICATION:
"This system preserves complexity because reality is complex.
If you need understanding, explore deeper — not simpler."

IF ASKED WHO WAS WRONG:
"The system shows what was known and what was decided.
Judgment is your responsibility, not the system's."

THIS IS MATURITY, NOT CONTROL.
`;
