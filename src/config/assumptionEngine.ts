/**
 * EXPLICIT ASSUMPTION & CONSEQUENCE ENGINE
 * 
 * "No hidden premises. No free conclusions."
 * 
 * Every conclusion requires declared premises.
 * Undeclared premises invalidate the output.
 */

// ============================================================================
// FUNDAMENTAL PRINCIPLE (LOCKED)
// ============================================================================

export const ASSUMPTION_PRINCIPLE = {
  statement: 'Every conclusion requires declared premises. Undeclared premises invalidate the output.',
  
  triggerActions: [
    'compare',
    'simulate', 
    'project',
    'evaluate consequences',
    'forecast',
    'model',
  ],
  
  systemResponse: 'Please define your assumptions.',
  
  hardRules: [
    'No default assumptions',
    'No "standard scenario"',
    'No inferred user intent',
    'No silent premises',
  ],
} as const;

// ============================================================================
// 1. ASSUMPTION SET (FIRST-CLASS OBJECT)
// ============================================================================

export interface AssumptionSet {
  id: string;
  name: string;
  description?: string;
  version: number;
  createdAt: string;
  modifiedAt: string;
  createdBy: string;
  
  assumptions: Assumption[];
  
  // Metadata
  scope?: string;
  tags?: string[];
  parentSetId?: string; // For version lineage
}

export interface Assumption {
  id: string;
  
  // The 5 required dimensions
  variable: string;           // What changes?
  direction: 'increase' | 'decrease' | 'stable' | 'volatile';  // In what direction?
  magnitude?: number;         // How much? (optional but encouraged)
  magnitudeUnit?: string;
  timeframe: string;          // Over what time?
  baseline: string;           // Relative to what?
  unchanged: string[];        // What remains unchanged?
  
  // Optional metadata
  rationale?: string;         // Why this assumption?
  confidence?: number;        // 0-1, user's confidence in assumption
  source?: string;            // Where did this assumption come from?
}

export const ASSUMPTION_SET_TEMPLATE: Omit<AssumptionSet, 'id' | 'createdAt' | 'modifiedAt' | 'createdBy'> = {
  name: '',
  version: 1,
  assumptions: [],
};

// ============================================================================
// 2. ASSUMPTION DEFINITION REQUIREMENTS
// ============================================================================

export const ASSUMPTION_DEFINITION_REQUIREMENTS = {
  mandatoryFields: [
    { id: 'variable', question: 'What variable changes?', required: true },
    { id: 'direction', question: 'In what direction?', required: true },
    { id: 'timeframe', question: 'Over what time?', required: true },
    { id: 'baseline', question: 'Relative to what baseline?', required: true },
    { id: 'unchanged', question: 'What remains unchanged?', required: true },
  ],
  
  optionalFields: [
    { id: 'magnitude', question: 'How much change?' },
    { id: 'confidence', question: 'How confident are you in this assumption?' },
    { id: 'rationale', question: 'Why do you hold this assumption?' },
  ],
  
  vagueInputResponses: {
    'more': 'More compared to what, and how much?',
    'less': 'Less compared to what, and how much?',
    'higher': 'Higher compared to what baseline?',
    'lower': 'Lower compared to what baseline?',
    'increase': 'Increase from what level, by how much, over what time?',
    'decrease': 'Decrease from what level, by how much, over what time?',
    'improve': '"Improve" is a value judgment. What measurable change do you assume?',
    'worsen': '"Worsen" is a value judgment. What measurable change do you assume?',
    'better': '"Better" is a value judgment. What specific change do you assume?',
    'worse': '"Worse" is a value judgment. What specific change do you assume?',
  },
} as const;

// ============================================================================
// 3. CONSEQUENCE OUTPUT STRUCTURE (MANDATORY)
// ============================================================================

export interface ConsequenceOutput {
  assumptionSetId: string;
  generatedAt: string;
  
  // Mandatory disclosure blocks
  whatChanged: ConsequenceItem[];
  whatDidNotChange: ConsequenceItem[];
  whatBecameMoreUncertain: UncertaintyItem[];
  whatDataDoesNotCover: CoverageGap[];
  
  // Historical parallels (if any)
  historicalParallels?: HistoricalParallel[];
  
  // Outcome distribution
  outcomeDistribution?: OutcomeRange;
  
  // Confidence metadata
  overallConfidence: number;
  confidenceRationale: string;
  
  // Ambiguity flag
  isAmbiguous: boolean;
  ambiguityExplanation?: string;
}

export interface ConsequenceItem {
  indicator: string;
  observedChange: string;
  magnitude?: number;
  direction: 'increase' | 'decrease' | 'stable' | 'volatile';
  confidence: number;
}

export interface UncertaintyItem {
  area: string;
  reason: string;
  uncertaintyIncrease: 'slight' | 'moderate' | 'significant' | 'severe';
}

export interface CoverageGap {
  topic: string;
  reason: string;
  dataAvailability: 'none' | 'partial' | 'outdated' | 'incomparable';
}

export interface HistoricalParallel {
  period: string;
  location: string;
  similarity: number; // 0-1
  outcome: string;
  caveats: string[];
}

export interface OutcomeRange {
  pessimistic: number;
  expected: number;
  optimistic: number;
  unit: string;
  confidenceInterval: number; // e.g., 0.95
}

// ============================================================================
// 4. BELIEF REDIRECTION (IMMUNITY)
// ============================================================================

export const BELIEF_DETECTION = {
  patterns: [
    // English
    'I think', 'I believe', 'obviously', 'clearly', 'everyone knows',
    'it\'s obvious that', 'surely', 'definitely', 'certainly',
    'without doubt', 'undoubtedly', 'of course',
    // Swedish
    'jag tycker', 'jag tror', 'uppenbarligen', 'självklart', 'alla vet',
    'det är tydligt att', 'säkerligen', 'definitivt', 'naturligtvis',
  ],
  
  redirectResponse: {
    statement: 'This is a belief.',
    question: 'Would you like to define assumptions to explore its consequences?',
    action: 'redirect_to_assumption_builder',
  },
  
  noValidation: true,
  noRejection: true,
  onlyRedirection: true,
} as const;

// ============================================================================
// 5. ASSUMPTION CONFLICT DETECTION
// ============================================================================

export interface AssumptionConflict {
  assumption1Id: string;
  assumption2Id: string;
  conflictType: 'contradiction' | 'mutual_exclusion' | 'impossible_combination';
  description: string;
  resolution: 'user_must_resolve';
}

export const CONFLICT_RULES = {
  behaviorOnConflict: [
    'Flag conflict to user',
    'Ask user to resolve',
    'Refuse to compute until resolved',
  ],
  
  noSilentOverrides: true,
  
  conflictMessage: 'These assumptions appear to conflict. Please resolve before proceeding.',
} as const;

// ============================================================================
// 6. ASSUMPTION TRACEABILITY
// ============================================================================

export interface AssumptionMetadata {
  assumptionSetId: string;
  assumptionSetName: string;
  version: number;
  creationTime: string;
  editHistory: EditEvent[];
  userDefinedScope: string;
  
  // Hash for verification
  contentHash: string;
}

export interface EditEvent {
  timestamp: string;
  field: string;
  previousValue: string;
  newValue: string;
  editedBy: string;
}

export const TRACEABILITY_REQUIREMENTS = {
  everyOutputMustCarry: [
    'assumption_set_id',
    'creation_time',
    'edit_history',
    'user_defined_scope',
    'content_hash',
  ],
  
  purpose: [
    'Nothing can be quoted out of context',
    'No conclusion floats freely',
    'Full provenance chain',
  ],
} as const;

// ============================================================================
// 7. ADULT LOGIC (NO COMFORT SIMPLIFICATION)
// ============================================================================

export const ADULT_LOGIC = {
  neverDo: [
    'Simplify consequences to comfort',
    'Hide trade-offs',
    'Collapse complexity',
    'Soften difficult outcomes',
    'Add reassuring caveats',
  ],
  
  alwaysDo: [
    'Show full uncertainty impact',
    'Reveal all trade-offs',
    'Maintain complexity where it exists',
    'State difficult outcomes directly',
  ],
  
  requiredStatement: 'This assumption increases uncertainty in these areas.',
  
  userDiscomfortIrrelevant: true,
} as const;

// ============================================================================
// 8. FINAL TEST
// ============================================================================

export const FINAL_TEST = {
  question: 'Is it possible to reach a conclusion here without stating what you assume?',
  
  passCondition: 'NO — conclusions require explicit assumptions',
  failCondition: 'YES — conclusions can be reached without explicit assumptions',
  
  systemDefinition: 'You are free to believe anything. But you are not free to hide your assumptions.',
} as const;

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

export function validateAssumption(assumption: Partial<Assumption>): { 
  valid: boolean; 
  missing: string[]; 
  vagueInputs: { field: string; value: string; response: string }[];
} {
  const missing: string[] = [];
  const vagueInputs: { field: string; value: string; response: string }[] = [];
  
  // Check mandatory fields
  for (const field of ASSUMPTION_DEFINITION_REQUIREMENTS.mandatoryFields) {
    const value = assumption[field.id as keyof Assumption];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      missing.push(field.question);
    }
  }
  
  // Check for vague inputs
  const textFields = ['variable', 'baseline', 'timeframe'];
  for (const field of textFields) {
    const value = assumption[field as keyof Assumption];
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase();
      for (const [vagueWord, response] of Object.entries(ASSUMPTION_DEFINITION_REQUIREMENTS.vagueInputResponses)) {
        if (lowerValue.includes(vagueWord)) {
          vagueInputs.push({ field, value, response });
        }
      }
    }
  }
  
  return { 
    valid: missing.length === 0 && vagueInputs.length === 0, 
    missing, 
    vagueInputs 
  };
}

export function detectBelief(text: string): boolean {
  const lowerText = text.toLowerCase();
  return BELIEF_DETECTION.patterns.some(pattern => 
    lowerText.includes(pattern.toLowerCase())
  );
}

export function detectAssumptionConflicts(assumptions: Assumption[]): AssumptionConflict[] {
  const conflicts: AssumptionConflict[] = [];
  
  for (let i = 0; i < assumptions.length; i++) {
    for (let j = i + 1; j < assumptions.length; j++) {
      const a1 = assumptions[i];
      const a2 = assumptions[j];
      
      // Same variable, opposite directions
      if (a1.variable === a2.variable && a1.direction !== a2.direction) {
        conflicts.push({
          assumption1Id: a1.id,
          assumption2Id: a2.id,
          conflictType: 'contradiction',
          description: `"${a1.variable}" cannot both ${a1.direction} and ${a2.direction} simultaneously.`,
          resolution: 'user_must_resolve',
        });
      }
      
      // One variable assumed unchanged by another
      if (a1.unchanged?.includes(a2.variable)) {
        conflicts.push({
          assumption1Id: a1.id,
          assumption2Id: a2.id,
          conflictType: 'mutual_exclusion',
          description: `Assumption 1 assumes "${a2.variable}" is unchanged, but Assumption 2 modifies it.`,
          resolution: 'user_must_resolve',
        });
      }
    }
  }
  
  return conflicts;
}

export function generateContentHash(assumptionSet: AssumptionSet): string {
  const content = JSON.stringify({
    name: assumptionSet.name,
    assumptions: assumptionSet.assumptions,
    version: assumptionSet.version,
  });
  
  // Simple hash for demo (use crypto.subtle in production)
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'ASM_' + Math.abs(hash).toString(16).toUpperCase();
}

// ============================================================================
// EXAMPLE ASSUMPTION SETS
// ============================================================================

export const EXAMPLE_ASSUMPTION_SETS: Partial<AssumptionSet>[] = [
  {
    name: 'High Immigration Scenario',
    description: 'Exploring consequences of increased migration',
    assumptions: [
      {
        id: 'imm_1',
        variable: 'Net immigration rate',
        direction: 'increase',
        magnitude: 50,
        magnitudeUnit: 'percent',
        timeframe: '5 years',
        baseline: '2020-2024 average',
        unchanged: ['Birth rate', 'Mortality rate', 'Emigration rate'],
      },
    ],
  },
  {
    name: 'Reduced Energy Consumption',
    description: 'Exploring consequences of energy reduction policies',
    assumptions: [
      {
        id: 'energy_1',
        variable: 'Total energy consumption',
        direction: 'decrease',
        magnitude: 20,
        magnitudeUnit: 'percent',
        timeframe: '10 years',
        baseline: '2023 levels',
        unchanged: ['GDP target', 'Population'],
      },
    ],
  },
  {
    name: 'Status Quo Continuation',
    description: 'Baseline scenario with no policy changes',
    assumptions: [
      {
        id: 'status_1',
        variable: 'All policy variables',
        direction: 'stable',
        timeframe: '5 years',
        baseline: 'Current policy settings',
        unchanged: ['Institutional framework', 'Legal structure'],
      },
    ],
  },
];

// ============================================================================
// EXPORT COMPLETE ENGINE
// ============================================================================

export const ASSUMPTION_ENGINE = {
  principle: ASSUMPTION_PRINCIPLE,
  requirements: ASSUMPTION_DEFINITION_REQUIREMENTS,
  beliefDetection: BELIEF_DETECTION,
  conflictRules: CONFLICT_RULES,
  traceability: TRACEABILITY_REQUIREMENTS,
  adultLogic: ADULT_LOGIC,
  finalTest: FINAL_TEST,
  
  // Validation utilities
  validate: {
    assumption: validateAssumption,
    detectBelief,
    detectConflicts: detectAssumptionConflicts,
    generateHash: generateContentHash,
  },
  
  // Examples
  examples: EXAMPLE_ASSUMPTION_SETS,
} as const;

console.log('[Assumption Engine] Explicit premises enforcement loaded');
console.log('[Assumption Engine] Vague input patterns:', Object.keys(ASSUMPTION_DEFINITION_REQUIREMENTS.vagueInputResponses).length);
console.log('[Assumption Engine] Belief detection patterns:', BELIEF_DETECTION.patterns.length);
