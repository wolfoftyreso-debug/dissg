/**
 * EPISTEMIC CORE AS PUBLIC FACT
 * 
 * STEG 31: THE MOST IMPORTANT MEASURE
 * 
 * The core structure must be public.
 * 
 * Not the data.
 * Not the API keys.
 * Not the operations.
 * 
 * But:
 * - Schema
 * - Epistemic rules
 * - Definitions
 * - History logic
 * 
 * This means:
 * - Everyone knows how the oracle should work
 * - Everyone sees when it stops doing so
 * 
 * Deviation = Scandal.
 */

/**
 * WHAT IS PUBLIC
 */
export const PUBLIC_CORE = {
  schema: {
    content: 'Complete data structure definitions',
    format: 'Machine-readable, versioned',
    location: 'Public repository, mirrored globally',
    purpose: 'Anyone can verify data matches schema',
  },
  
  epistemic_rules: {
    content: 'Rules for what counts as valid observation',
    format: 'Formal specification, versioned',
    location: 'Public repository, mirrored globally',
    purpose: 'Anyone can verify rules are followed',
  },
  
  definitions: {
    content: 'Meaning of all terms and categories',
    format: 'Human and machine readable',
    location: 'Public repository, mirrored globally',
    purpose: 'Anyone can verify consistent interpretation',
  },
  
  history_logic: {
    content: 'Rules for how history is maintained',
    format: 'Formal specification, versioned',
    location: 'Public repository, mirrored globally',
    purpose: 'Anyone can verify historical integrity',
  },
} as const;

/**
 * WHAT IS NOT PUBLIC
 */
export const NOT_PUBLIC = {
  raw_data: {
    content: 'Some operational data',
    reason: 'May have licensing or privacy constraints',
    note: 'But must conform to public schema',
  },
  
  api_keys: {
    content: 'Access credentials',
    reason: 'Security requirement',
    note: 'Access patterns may be logged publicly',
  },
  
  infrastructure: {
    content: 'Server details, deployment specifics',
    reason: 'Security requirement',
    note: 'Outputs must match public specification',
  },
} as const;

/**
 * THE EFFECT OF PUBLIC CORE
 */
export const PUBLIC_CORE_EFFECT = {
  everyone_knows: {
    what: 'How the oracle should function',
    implication: 'Cannot claim ignorance',
  },
  
  everyone_sees: {
    what: 'When the oracle deviates from specification',
    implication: 'Cannot hide deviation',
  },
  
  deviation_equals_scandal: {
    what: 'Any deviation from public spec is immediately visible',
    implication: 'Cannot manipulate quietly',
  },
} as const;

/**
 * VERIFICATION BY ANYONE
 */
export const ANYONE_CAN_VERIFY = {
  academic_researchers: {
    can: 'Audit methodology against specification',
    tools: 'Public spec, public outputs, comparison tools',
  },
  
  journalists: {
    can: 'Detect changes from previous behavior',
    tools: 'Historical snapshots, change logs',
  },
  
  competitors: {
    can: 'Monitor for manipulation that might benefit them',
    tools: 'Automated monitoring systems',
  },
  
  ai_systems: {
    can: 'Automatically verify integrity before using data',
    tools: 'Machine-readable spec, integrity endpoints',
  },
  
  regulators: {
    can: 'Audit compliance with stated methodology',
    tools: 'Complete transparency into rules',
  },
  
  public: {
    can: 'Access and verify any claimed output',
    tools: 'Public interface to specification',
  },
} as const;

/**
 * THE PUBLIC FACT STATUS
 */
export const PUBLIC_FACT_STATUS = {
  definition: 'The oracle\'s structure is a public fact in the world',
  
  like: {
    mathematics: 'Mathematical theorems are public; anyone can verify',
    standards: 'Measurement standards are public; anyone can compare',
    protocols: 'Internet protocols are public; anyone can implement',
  },
  
  ownership_irrelevant: 'Whoever "owns" the oracle cannot change what it publicly is',
  
  modification_visible: 'Any attempt to modify creates visible deviation from public record',
} as const;
