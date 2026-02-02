/**
 * ETHICS ENFORCER
 * 
 * Hard-coded ethical constraints that cannot be overridden.
 * Ethics through architecture, not policy.
 * 
 * Constraints:
 * - No individual data
 * - Minimum group sizes
 * - No predictive profiles
 * - No real-time surveillance
 * - Context always required
 */

import type { EthicsConstraint } from '@/types/compliance';

// Hard-coded ethics constraints (cannot be changed at runtime)
const ETHICS_CONSTRAINTS: EthicsConstraint[] = [
  {
    id: 'eth-001',
    constraint_code: 'NO_INDIVIDUAL',
    constraint_name: 'No Individual Data',
    constraint_description: 'System never displays or processes individual-level data',
    prevents: [
      'individual identification',
      'personal health records',
      'named individuals',
      'individual tracking'
    ],
    enforcement_type: 'block',
    rationale: 'Individual data would enable harm, identification, and misuse. Population aggregates serve the platform purpose.',
    is_active: true
  },
  {
    id: 'eth-002',
    constraint_code: 'MIN_GROUP_SIZE',
    constraint_name: 'Minimum Group Size',
    constraint_description: 'Aggregated data requires minimum group size to prevent identification',
    prevents: [
      'small group identification',
      'rare condition exposure',
      'geographic re-identification',
      'temporal re-identification'
    ],
    enforcement_type: 'aggregate',
    minimum_group_size: 100,
    rationale: 'Small groups can be identified through cross-referencing. Minimum size prevents statistical disclosure.',
    is_active: true
  },
  {
    id: 'eth-003',
    constraint_code: 'NO_PREDICTIVE_PROFILES',
    constraint_name: 'No Predictive Profiles',
    constraint_description: 'System does not create or display predictive profiles for individuals or groups',
    prevents: [
      'risk scores for individuals',
      'future behavior prediction',
      'propensity modeling',
      'predictive segmentation'
    ],
    enforcement_type: 'block',
    rationale: 'Predictive profiles enable discrimination and manipulation. Historical observation is the limit.',
    is_active: true
  },
  {
    id: 'eth-004',
    constraint_code: 'NO_REAL_TIME',
    constraint_name: 'No Real-Time Surveillance',
    constraint_description: 'System does not process or display real-time individual tracking',
    prevents: [
      'real-time location tracking',
      'live behavior monitoring',
      'immediate alerts on individuals',
      'real-time health monitoring'
    ],
    enforcement_type: 'block',
    rationale: 'Real-time tracking enables surveillance and control. Historical aggregates serve transparency.',
    is_active: true
  },
  {
    id: 'eth-005',
    constraint_code: 'CONTEXT_REQUIRED',
    constraint_name: 'Context Always Required',
    constraint_description: 'No data point displayed without accompanying context',
    prevents: [
      'context-free statistics',
      'isolated numbers',
      'unexplained comparisons',
      'decontextualized trends'
    ],
    enforcement_type: 'warn',
    rationale: 'Context-free data enables misinterpretation and cherry-picking. Mandatory context prevents misuse.',
    is_active: true
  },
  {
    id: 'eth-006',
    constraint_code: 'NO_DOSAGE',
    constraint_name: 'No Dosage Information',
    constraint_description: 'System never provides dosage, administration, or usage guidance for substances',
    prevents: [
      'dosage recommendations',
      'administration guidance',
      'usage instructions',
      'harm reduction dosing'
    ],
    enforcement_type: 'block',
    rationale: 'Dosage information requires clinical context and individual assessment. Platform is epidemiological, not clinical.',
    is_active: true
  },
  {
    id: 'eth-007',
    constraint_code: 'NO_TREATMENT_RANKING',
    constraint_name: 'No Treatment Ranking',
    constraint_description: 'System never ranks or compares treatment effectiveness',
    prevents: [
      'treatment effectiveness rankings',
      'medication comparisons',
      'therapy recommendations',
      'intervention prioritization'
    ],
    enforcement_type: 'block',
    rationale: 'Treatment decisions require individual clinical assessment. Population data cannot guide individual treatment.',
    is_active: true
  }
];

// Minimum group size for different data types
const MINIMUM_GROUP_SIZES: Record<string, number> = {
  'health': 100,
  'substance': 100,
  'disease': 50,
  'geographic': 1000,
  'demographic': 100,
  'default': 100
};

export interface EthicsCheckResult {
  passed: boolean;
  violated_constraints: EthicsConstraint[];
  warnings: string[];
  required_aggregation?: number;
}

/**
 * Check data against all ethics constraints
 */
export function checkEthicsCompliance(
  dataType: string,
  groupSize?: number,
  flags: string[] = []
): EthicsCheckResult {
  const violations: EthicsConstraint[] = [];
  const warnings: string[] = [];
  
  // Check each constraint
  for (const constraint of ETHICS_CONSTRAINTS) {
    if (!constraint.is_active) continue;
    
    // Check for flag-based violations
    for (const prevented of constraint.prevents) {
      if (flags.some(f => f.toLowerCase().includes(prevented.toLowerCase()))) {
        if (constraint.enforcement_type === 'block') {
          violations.push(constraint);
        } else if (constraint.enforcement_type === 'warn') {
          warnings.push(`Warning: ${constraint.constraint_name} - ${constraint.rationale}`);
        }
      }
    }
    
    // Check minimum group size
    if (constraint.constraint_code === 'MIN_GROUP_SIZE' && groupSize !== undefined) {
      const requiredSize = MINIMUM_GROUP_SIZES[dataType] || MINIMUM_GROUP_SIZES['default'];
      if (groupSize < requiredSize) {
        violations.push(constraint);
      }
    }
  }
  
  const requiredAggregation = MINIMUM_GROUP_SIZES[dataType] || MINIMUM_GROUP_SIZES['default'];
  
  return {
    passed: violations.length === 0,
    violated_constraints: violations,
    warnings,
    required_aggregation: requiredAggregation
  };
}

/**
 * Check if individual-level data is being requested
 */
export function isIndividualDataRequest(query: string): boolean {
  const individualPatterns = [
    /\b(my|mine|me|i)\b/i,
    /\bindividual\b/i,
    /\bperson(al)?\b/i,
    /\bspecific (person|patient|user)\b/i,
    /\bnamed\b/i,
    /\bidentif(y|ied|ication)\b/i
  ];
  
  return individualPatterns.some(pattern => pattern.test(query));
}

/**
 * Check if predictive profiling is being requested
 */
export function isPredictiveRequest(query: string): boolean {
  const predictivePatterns = [
    /\b(will|would|going to) (happen|occur|result)\b/i,
    /\bpredict(ion|ive|ed)?\b/i,
    /\brisk (score|level|assessment)\b/i,
    /\bpropensity\b/i,
    /\blikelihood\b/i,
    /\bprobability\b/i,
    /\bfuture\b/i,
    /\bforecast\b/i
  ];
  
  return predictivePatterns.some(pattern => pattern.test(query));
}

/**
 * Check if dosage information is being requested
 */
export function isDosageRequest(query: string): boolean {
  const dosagePatterns = [
    /\b(dose|dosage|dosing)\b/i,
    /\bhow (much|many) (to|should)\b/i,
    /\b(mg|ml|gram|pill|tablet|capsule)\b/i,
    /\badminist(er|ration)\b/i,
    /\b(take|use|consume) (how|amount)\b/i
  ];
  
  return dosagePatterns.some(pattern => pattern.test(query));
}

/**
 * Check if treatment comparison is being requested
 */
export function isTreatmentComparisonRequest(query: string): boolean {
  const treatmentPatterns = [
    /\bwhich (treatment|medication|drug|therapy) (is|works)\b/i,
    /\b(better|best|more effective) (treatment|medication|drug)\b/i,
    /\bcompare (treatments|medications|drugs|therapies)\b/i,
    /\b(effective|efficacy|effectiveness) (of|between)\b/i
  ];
  
  return treatmentPatterns.some(pattern => pattern.test(query));
}

/**
 * Get all active ethics constraints
 */
export function getActiveConstraints(): EthicsConstraint[] {
  return ETHICS_CONSTRAINTS.filter(c => c.is_active);
}

/**
 * Get constraint by code
 */
export function getConstraint(code: string): EthicsConstraint | undefined {
  return ETHICS_CONSTRAINTS.find(c => c.constraint_code === code);
}

/**
 * Format ethics violation message
 */
export function formatEthicsViolation(constraint: EthicsConstraint): string {
  return `Ethics constraint violated: ${constraint.constraint_name}. ${constraint.constraint_description}. Rationale: ${constraint.rationale}`;
}

/**
 * Check data before display and return safe version
 */
export function enforceEthicsOnData<T>(
  data: T,
  dataType: string,
  groupSize?: number
): { safe: boolean; data: T | null; reason?: string } {
  const check = checkEthicsCompliance(dataType, groupSize);
  
  if (!check.passed) {
    const violation = check.violated_constraints[0];
    return {
      safe: false,
      data: null,
      reason: formatEthicsViolation(violation)
    };
  }
  
  return {
    safe: true,
    data
  };
}
