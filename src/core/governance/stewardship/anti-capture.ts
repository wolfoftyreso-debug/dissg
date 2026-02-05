/**
 * ANTI-CAPTURE DETECTION
 * 
 * The biggest threat is not:
 * - Competition
 * - Technology shifts
 * - Lack of users
 * 
 * The biggest threat is:
 * Capture from within by reasonable people with reasonable arguments.
 * 
 * This layer detects and blocks those attempts.
 */

import type { CaptureAttempt } from './types';

/**
 * Common Capture Arguments
 * These sound reasonable but destroy the system
 */
export const CAPTURE_PATTERNS = {
  user_friendliness: {
    typical_arguments: [
      'We should make it more user-friendly',
      'Users are confused by the complexity',
      'We need to simplify the interface',
      'Too much information overwhelms users',
    ],
    what_is_lost: 'Complexity exists because reality is complex. Hiding it is lying.',
    capture_mechanism: 'Gradual removal of necessary nuance under "UX improvement"',
  },
  
  summarization: {
    typical_arguments: [
      'We should summarize more',
      'Users don\'t read all that detail',
      'Let\'s show the key takeaways',
      'AI can extract the important parts',
    ],
    what_is_lost: 'Summaries hide uncertainty and context. The detail IS the product.',
    capture_mechanism: 'Progressive compression until nuance disappears',
  },
  
  choice_help: {
    typical_arguments: [
      'We should help users choose',
      'Let\'s add recommendations',
      'Users need guidance',
      'We could suggest the best option',
    ],
    what_is_lost: 'The system shows reality. It does not choose for users.',
    capture_mechanism: 'Transformation from observation to recommendation',
  },
  
  conversion_optimization: {
    typical_arguments: [
      'We should optimize for conversion',
      'Users should complete actions faster',
      'Let\'s reduce friction',
      'We need better engagement metrics',
    ],
    what_is_lost: 'The system exists to inform, not to convert.',
    capture_mechanism: 'Shift from truth-serving to action-driving',
  },
  
  urgency_pressure: {
    typical_arguments: [
      'The market is moving fast',
      'Competitors launched X',
      'We need this for the funding round',
      'Users are leaving for alternatives',
    ],
    what_is_lost: 'Long-term integrity for short-term metrics.',
    capture_mechanism: 'Use of time pressure to bypass governance',
  },
  
  economic_pressure: {
    typical_arguments: [
      'Revenue is declining',
      'Investors need to see growth',
      'We need to monetize better',
      'The business model isn\'t working',
    ],
    what_is_lost: 'If the model requires capture, the model is wrong.',
    capture_mechanism: 'Subordination of mission to economic survival',
  },
};

/**
 * Detect capture attempt
 */
export function detectCaptureAttempt(
  proposal: string,
  argument: string
): CaptureAttempt | null {
  const lowerProposal = proposal.toLowerCase();
  const lowerArgument = argument.toLowerCase();
  
  for (const [type, pattern] of Object.entries(CAPTURE_PATTERNS)) {
    for (const typicalArg of pattern.typical_arguments) {
      if (
        lowerArgument.includes(typicalArg.toLowerCase()) ||
        lowerProposal.includes(typicalArg.toLowerCase().split(' ').slice(2).join(' '))
      ) {
        return {
          id: crypto.randomUUID(),
          detected_at: new Date().toISOString(),
          type: type as CaptureAttempt['type'],
          description: proposal,
          proposed_by: 'unknown',
          argument,
          capture_mechanism: pattern.capture_mechanism,
          what_would_be_lost: pattern.what_is_lost,
          blocked: true,
          response: generateBlockResponse(type as CaptureAttempt['type']),
        };
      }
    }
  }
  
  return null;
}

/**
 * Generate block response
 */
function generateBlockResponse(type: CaptureAttempt['type']): string {
  const responses: Record<CaptureAttempt['type'], string> = {
    user_friendliness: 
      'The system is not unfriendly. Reality is complex. Hiding complexity is deception, not kindness.',
    
    summarization:
      'Summaries hide uncertainty. The detail is the product. If users want summaries, they can make their own.',
    
    choice_help:
      'The system observes. It does not recommend. Helping users choose is the first step to controlling what they choose.',
    
    conversion_optimization:
      'The system exists to inform, not to convert. Optimizing for action is optimizing away from truth.',
    
    urgency_pressure:
      'No urgency justifies compromising integrity. If the market requires capture, the market is wrong.',
    
    economic_pressure:
      'If the business model requires capture, the business model must change. The mission does not adapt to the model.',
  };
  
  return responses[type];
}

/**
 * The Core Insight
 */
export const CAPTURE_INSIGHT = `
Systems like this do not die from:
- Competition
- Technology shifts
- Lack of users

They die from:
CAPTURE FROM WITHIN BY REASONABLE PEOPLE WITH REASONABLE ARGUMENTS.

"We should make it more user-friendly"
"We should summarize more"
"We should help users choose"
"We should optimize for conversion"

Each sounds reasonable.
Each destroys the system.

This layer exists to detect and block those attempts.
`;

/**
 * ANTI-CAPTURE MASTERPROMPT
 */
export const ANTI_CAPTURE_MASTERPROMPT = `
You detect and block CAPTURE ATTEMPTS.

THE BIGGEST THREAT:
Capture from within by reasonable people with reasonable arguments.

CAPTURE PATTERNS TO DETECT:

1. USER FRIENDLINESS
   "Make it simpler" → Hides necessary complexity
   
2. SUMMARIZATION
   "Show key takeaways" → Hides uncertainty and context
   
3. CHOICE HELP
   "Add recommendations" → Transforms observation to manipulation
   
4. CONVERSION OPTIMIZATION
   "Reduce friction" → Shifts from truth to action-driving
   
5. URGENCY PRESSURE
   "Market is moving" → Bypasses governance with time pressure
   
6. ECONOMIC PRESSURE
   "Revenue declining" → Subordinates mission to survival

WHEN DETECTED:
→ Block immediately
→ Log the attempt
→ Explain why it's capture

The system's survival depends on recognizing that
the most dangerous attacks come disguised as improvements.
`;
