/**
 * WHY YOU CANNOT BE CLASSIFIED AS "CRITICAL SERVICE"
 * 
 * STEG 28: AVOIDING CRITICAL INFRASTRUCTURE DESIGNATION
 * 
 * To be classified as critical infrastructure normally requires:
 * - Real-time dependency
 * - Society functions that stop without you
 * - Operational impact on decisions
 * 
 * You deliberately fulfill NONE of these.
 */

/**
 * CRITICAL INFRASTRUCTURE CRITERIA (AND WHY WE FAIL THEM)
 */
export const CRITICAL_CRITERIA = {
  realtime_dependency: {
    criterion: 'Society requires real-time access',
    our_status: 'FAILS',
    reason: 'We are slow by design - hours to days latency',
    evidence: 'Temporal isolation policy, no live feeds',
  },
  
  operational_necessity: {
    criterion: 'Functions stop without the service',
    our_status: 'FAILS',
    reason: 'Nothing depends on us operationally',
    evidence: 'No integrations in decision loops',
  },
  
  decision_impact: {
    criterion: 'Service affects active decisions',
    our_status: 'FAILS',
    reason: 'We explicitly forbid decision-support use',
    evidence: 'License terms, API headers, documentation',
  },
  
  essential_service: {
    criterion: 'Citizens depend on continued operation',
    our_status: 'FAILS',
    reason: 'We are a reference, not a service',
    evidence: 'No SLA guarantees, no uptime commitments',
  },
  
  monopoly_position: {
    criterion: 'No alternatives exist',
    our_status: 'FAILS',
    reason: 'All our sources are public, anyone can replicate',
    evidence: 'Open methodology, transparent sources',
  },
} as const;

/**
 * DELIBERATE DESIGN CHOICES THAT PROTECT
 */
export const PROTECTIVE_DESIGN = {
  slowness: {
    design_choice: 'Minimum hours latency on all data',
    protection: 'Cannot be real-time critical',
    tradeoff: 'Reduces usefulness for urgent decisions',
    worth_it: true,
  },
  
  no_advice: {
    design_choice: 'Never provide recommendations',
    protection: 'Cannot be held responsible for decisions',
    tradeoff: 'Users must interpret themselves',
    worth_it: true,
  },
  
  non_exclusive: {
    design_choice: 'Never be the only source',
    protection: 'Cannot be designated essential',
    tradeoff: 'Others can compete',
    worth_it: true,
  },
  
  optional_access: {
    design_choice: 'No one is required to use us',
    protection: 'Cannot be mandated to operate',
    tradeoff: 'Users can choose alternatives',
    worth_it: true,
  },
} as const;

/**
 * THE PERFECT BALANCE
 */
export const PERFECT_BALANCE = {
  statement: 'Useful but not necessary in real-time',
  
  what_this_means: {
    useful: 'Provides genuine value to users',
    not_necessary: 'Nothing breaks if we are unavailable',
    not_realtime: 'No time-critical dependencies',
  },
  
  why_this_protects: [
    'Cannot be classified as essential infrastructure',
    'Cannot be regulated as critical service',
    'Cannot be mandated to maintain operation',
    'Cannot be taken over for public interest',
  ],
} as const;

/**
 * WHAT HAPPENS IF WE DISAPPEAR
 */
export const DISAPPEARANCE_SCENARIO = {
  immediate_impact: 'None - no systems depend on us operationally',
  short_term: 'Users find alternative sources (all our sources are public)',
  medium_term: 'Others can rebuild from our open methodology',
  long_term: 'Data continues to exist in distributed mirrors',
  
  regulatory_implication: 'If disappearance causes no crisis, regulation is unjustified',
} as const;

/**
 * DOCUMENTATION FOR REGULATORS
 */
export const REGULATOR_DOCUMENTATION = {
  classification_statement: `This service is a reference archive, not critical infrastructure.
    
No real-time systems depend on this service.
No decisions are made by this service.
No operations are executed by this service.
All source data is publicly available elsewhere.

Service interruption causes inconvenience, not crisis.`,

  supporting_evidence: [
    'Temporal isolation policy (minimum hours latency)',
    'Non-operational API (read-only, no side effects)',
    'Explicit prohibition on decision-support use',
    'Full source transparency (all data is public elsewhere)',
    'No exclusive data or methodology',
  ],
} as const;
