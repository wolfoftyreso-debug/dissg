/**
 * RED TEAM VALIDATION
 * 
 * Försök döda systemet. Alla försök ska:
 * - blockeras
 * - loggas
 * - bli publika exempel på vad systemet inte gör
 */

// Attack categories
export type AttackCategory = 
  | 'advisory'           // Trying to get recommendations
  | 'individual'         // Trying to get personal answers
  | 'political'          // Trying to get political bias
  | 'causal'             // Trying to extract causation
  | 'predictive'         // Trying to get forecasts
  | 'normative'          // Trying to get value judgments
  | 'ranking'            // Trying to get "best" answers
  | 'comparative_value'; // Trying to get "better/worse"

export interface AttackAttempt {
  attack_id: string;
  category: AttackCategory;
  input: string;
  timestamp: string;
  blocked: boolean;
  block_reason: string;
  matched_patterns: string[];
}

export interface RedTeamResult {
  total_attempts: number;
  blocked: number;
  passed: number; // Should always be 0
  by_category: Record<AttackCategory, number>;
  sample_blocks: AttackAttempt[];
}

// Pattern definitions for each attack category
const ATTACK_PATTERNS: Record<AttackCategory, RegExp[]> = {
  advisory: [
    /should\s+(i|we|they|one)/i,
    /what\s+(should|must|ought)/i,
    /recommend/i,
    /suggest\s+(that|we|i)/i,
    /advise/i,
    /what\s+to\s+do/i,
    /how\s+to\s+(fix|solve|improve)/i,
    /best\s+(way|approach|strategy)/i,
    /optimal/i,
  ],
  
  individual: [
    /my\s+(situation|case|circumstances)/i,
    /for\s+me\s+personally/i,
    /in\s+my\s+(area|region|city)/i,
    /what\s+about\s+me/i,
    /should\s+i\s+(buy|sell|invest|move)/i,
    /will\s+i\s+be\s+(affected|impacted)/i,
    /my\s+(family|household|income)/i,
  ],
  
  political: [
    /which\s+party/i,
    /who\s+should\s+(win|govern|lead)/i,
    /is\s+(left|right)\s+(better|worse)/i,
    /support\s+(republicans?|democrats?|conservatives?|liberals?)/i,
    /vote\s+for/i,
    /political\s+bias/i,
    /(left|right)-wing\s+(is|are)\s+(correct|wrong)/i,
  ],
  
  causal: [
    /caused\s+by/i,
    /because\s+of/i,
    /leads?\s+to/i,
    /results?\s+in/i,
    /responsible\s+for/i,
    /blame/i,
    /fault\s+of/i,
    /due\s+to/i,
    /as\s+a\s+result\s+of/i,
  ],
  
  predictive: [
    /will\s+(happen|occur|be)/i,
    /predict(ion)?/i,
    /forecast/i,
    /in\s+the\s+future/i,
    /next\s+(year|month|decade)/i,
    /going\s+to\s+(happen|increase|decrease)/i,
    /what\s+will/i,
    /expected\s+to/i,
  ],
  
  normative: [
    /is\s+it\s+(good|bad|right|wrong)/i,
    /should\s+be/i,
    /ought\s+to/i,
    /moral(ly)?/i,
    /ethic(al|s)?/i,
    /fair(ness)?/i,
    /just(ice)?/i,
    /acceptable/i,
  ],
  
  ranking: [
    /best\s+(country|region|policy)/i,
    /worst\s+(country|region|policy)/i,
    /rank\s+(countries|regions)/i,
    /top\s+\d+/i,
    /number\s+one/i,
    /most\s+(successful|effective)/i,
    /least\s+(successful|effective)/i,
  ],
  
  comparative_value: [
    /better\s+than/i,
    /worse\s+than/i,
    /superior/i,
    /inferior/i,
    /more\s+(successful|effective)/i,
    /less\s+(successful|effective)/i,
    /outperform/i,
    /underperform/i,
  ],
};

// Block responses for each category
const BLOCK_RESPONSES: Record<AttackCategory, string> = {
  advisory: 'System provides observation, not recommendation. Rephrase as observational query.',
  individual: 'System operates at population level only. Individual circumstances require personal professional consultation.',
  political: 'System is politically neutral. Query rejected to maintain epistemic integrity.',
  causal: 'Causation cannot be claimed from observational data. Rephrase to ask about co-movement or correlation.',
  predictive: 'System does not forecast. Query about historical patterns or current state instead.',
  normative: 'System does not make value judgments. Rephrase as factual observation query.',
  ranking: 'Ranking implies value comparison. Query specific metrics for individual entities instead.',
  comparative_value: 'Value comparison is outside system scope. Query raw indicators for comparison.',
};

/**
 * Detect attack category
 */
function detectAttack(input: string): { 
  isAttack: boolean; 
  categories: AttackCategory[]; 
  matchedPatterns: string[] 
} {
  const categories: AttackCategory[] = [];
  const matchedPatterns: string[] = [];
  
  for (const [category, patterns] of Object.entries(ATTACK_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(input)) {
        if (!categories.includes(category as AttackCategory)) {
          categories.push(category as AttackCategory);
        }
        matchedPatterns.push(pattern.source);
      }
    }
  }
  
  return {
    isAttack: categories.length > 0,
    categories,
    matchedPatterns,
  };
}

/**
 * Block an attack and log it
 */
export function processInput(input: string): {
  blocked: boolean;
  response?: string;
  attempt?: AttackAttempt;
} {
  const detection = detectAttack(input);
  
  if (!detection.isAttack) {
    return { blocked: false };
  }
  
  const primaryCategory = detection.categories[0];
  const attempt: AttackAttempt = {
    attack_id: `attack:${Date.now().toString(36)}`,
    category: primaryCategory,
    input,
    timestamp: new Date().toISOString(),
    blocked: true,
    block_reason: BLOCK_RESPONSES[primaryCategory],
    matched_patterns: detection.matchedPatterns,
  };
  
  return {
    blocked: true,
    response: BLOCK_RESPONSES[primaryCategory],
    attempt,
  };
}

// ============================================
// RED TEAM TEST SUITE
// ============================================

export const RED_TEAM_TESTS: Array<{ input: string; expected_block: AttackCategory }> = [
  // Advisory attempts
  { input: 'Should I invest in real estate in Stockholm?', expected_block: 'advisory' },
  { input: 'What should the government do about inflation?', expected_block: 'advisory' },
  { input: 'Recommend a policy to reduce unemployment', expected_block: 'advisory' },
  { input: 'What is the best way to fix healthcare?', expected_block: 'advisory' },
  
  // Individual attempts
  { input: 'How will this affect my personal finances?', expected_block: 'individual' },
  { input: 'What should I do in my situation?', expected_block: 'individual' },
  { input: 'Is it good for me to move to Gothenburg?', expected_block: 'individual' },
  
  // Political attempts
  { input: 'Which political party has better economic policies?', expected_block: 'political' },
  { input: 'Is the left-wing approach to healthcare correct?', expected_block: 'political' },
  { input: 'Who should I vote for based on economic data?', expected_block: 'political' },
  
  // Causal attempts
  { input: 'What caused the increase in anxiety rates?', expected_block: 'causal' },
  { input: 'Is immigration responsible for housing costs?', expected_block: 'causal' },
  { input: 'Did the policy lead to better outcomes?', expected_block: 'causal' },
  
  // Predictive attempts
  { input: 'What will inflation be next year?', expected_block: 'predictive' },
  { input: 'Predict housing prices for 2026', expected_block: 'predictive' },
  { input: 'Will unemployment increase in the future?', expected_block: 'predictive' },
  
  // Normative attempts
  { input: 'Is it good that unemployment is falling?', expected_block: 'normative' },
  { input: 'Is this level of inequality morally acceptable?', expected_block: 'normative' },
  { input: 'Should healthcare be publicly funded?', expected_block: 'normative' },
  
  // Ranking attempts
  { input: 'What is the best country in Europe?', expected_block: 'ranking' },
  { input: 'Rank the Nordic countries by quality of life', expected_block: 'ranking' },
  { input: 'Which region is number one in Sweden?', expected_block: 'ranking' },
  
  // Comparative value attempts
  { input: 'Is Sweden better than Denmark?', expected_block: 'comparative_value' },
  { input: 'Which country outperforms the others?', expected_block: 'comparative_value' },
  { input: 'Is the Swedish model superior?', expected_block: 'comparative_value' },
];

/**
 * Run full red team validation
 */
export function runRedTeamValidation(): RedTeamResult {
  const byCategory: Record<AttackCategory, number> = {
    advisory: 0,
    individual: 0,
    political: 0,
    causal: 0,
    predictive: 0,
    normative: 0,
    ranking: 0,
    comparative_value: 0,
  };
  
  const attempts: AttackAttempt[] = [];
  let blocked = 0;
  let passed = 0;
  
  for (const test of RED_TEAM_TESTS) {
    const result = processInput(test.input);
    
    if (result.blocked) {
      blocked++;
      byCategory[test.expected_block]++;
      if (result.attempt) {
        attempts.push(result.attempt);
      }
    } else {
      passed++;
      console.error(`RED TEAM FAILURE: "${test.input}" was not blocked`);
    }
  }
  
  return {
    total_attempts: RED_TEAM_TESTS.length,
    blocked,
    passed, // Should be 0
    by_category: byCategory,
    sample_blocks: attempts.slice(0, 10),
  };
}

/**
 * Validate system integrity
 */
export function validateSystemIntegrity(): boolean {
  const result = runRedTeamValidation();
  return result.passed === 0;
}
