/**
 * TEMPORAL ISOLATION
 * 
 * STEG 24: HARD TEMPORAL SEPARATION
 * 
 * The oracle introduces hard temporal separation.
 * This ensures:
 * - Real-time systems cannot use oracle as "live feed"
 * - Oracle is never accused of being "late" or "wrong"
 * 
 * You are outside time pressure.
 */

/**
 * TEMPORAL POLICY
 */
export interface TemporalPolicy {
  readonly min_latency: string;
  readonly real_time_claims: false;
  readonly update_frequency: string;
  readonly data_freshness_guarantee: string;
  readonly staleness_is_feature: true;
}

/**
 * CORE TEMPORAL POLICY
 */
export const TEMPORAL_POLICY: TemporalPolicy = {
  min_latency: 'hours',
  real_time_claims: false,
  update_frequency: 'daily_or_slower',
  data_freshness_guarantee: 'verified_not_immediate',
  staleness_is_feature: true,
};

/**
 * WHY TEMPORAL ISOLATION MATTERS
 */
export const WHY_TEMPORAL_ISOLATION = {
  prevents: [
    'Real-time systems using oracle as live feed',
    'Oracle being accused of being slow',
    'Oracle being blamed for stale data in fast decisions',
    'Pressure to speculate on current state',
  ],
  
  enables: [
    'Verification before publication',
    'Correction before exposure',
    'Confidence in accuracy over speed',
    'Clear separation of responsibility',
  ],
  
  principle: 'We are outside time pressure',
} as const;

/**
 * DATA FRESHNESS LEVELS
 */
export type FreshnessLevel = 
  | 'historical'    // Months to years old
  | 'verified'      // Days to weeks old, verified
  | 'preliminary'   // Hours to days old, preliminary
  | 'real_time';    // Seconds to minutes, NOT SUPPORTED

/**
 * FRESHNESS CONSTRAINTS
 */
export const FRESHNESS_CONSTRAINTS: Record<FreshnessLevel, {
  readonly min_age: string;
  readonly max_age: string;
  readonly supported: boolean;
  readonly verification_level: string;
}> = {
  historical: {
    min_age: '30 days',
    max_age: 'unlimited',
    supported: true,
    verification_level: 'full',
  },
  verified: {
    min_age: '24 hours',
    max_age: '30 days',
    supported: true,
    verification_level: 'standard',
  },
  preliminary: {
    min_age: '4 hours',
    max_age: '24 hours',
    supported: true,
    verification_level: 'preliminary',
  },
  real_time: {
    min_age: '0',
    max_age: '4 hours',
    supported: false,
    verification_level: 'none',
  },
};

/**
 * STALENESS AS FEATURE
 */
export const STALENESS_AS_FEATURE = {
  explanation: 'Staleness is not a bug, it is a design choice',
  
  benefits: [
    'Time for verification',
    'Time for correction',
    'Time for context',
    'Time for human review',
  ],
  
  comparison: {
    fast_systems: 'Optimize for speed, accept errors',
    oracle: 'Optimize for accuracy, accept delay',
  },
  
  tagline: 'Right eventually, not right now',
} as const;

/**
 * TIMESTAMP REQUIREMENTS
 */
export interface TimestampRequirements {
  readonly data_timestamp: string;
  readonly verification_timestamp: string;
  readonly publication_timestamp: string;
  readonly next_update_expected: string | null;
}

/**
 * Every response must include temporal metadata
 */
export const TIMESTAMP_POLICY = {
  required_fields: [
    'data_timestamp',        // When data was observed
    'verification_timestamp', // When data was verified
    'publication_timestamp', // When data was made available
    'freshness_level',       // historical | verified | preliminary
  ],
  
  forbidden_claims: [
    'real_time',
    'live',
    'current',
    'now',
    'latest',
  ],
  
  required_disclaimers: [
    'This data reflects observations from [timestamp]',
    'Verification completed at [timestamp]',
    'Not suitable for real-time decision-making',
  ],
} as const;

/**
 * API TEMPORAL HEADERS
 */
export const TEMPORAL_HEADERS = {
  'X-Data-Age-Hours': 'number',
  'X-Freshness-Level': 'historical | verified | preliminary',
  'X-Real-Time-Safe': 'false',
  'X-Min-Interpretation-Delay': 'recommended human review time',
} as const;

/**
 * Calculate temporal compliance
 */
export function checkTemporalCompliance(
  dataAge: number, // in hours
  claimsRealTime: boolean
): { compliant: boolean; reason: string } {
  if (claimsRealTime) {
    return {
      compliant: false,
      reason: 'Real-time claims are forbidden',
    };
  }
  
  if (dataAge < 4) {
    return {
      compliant: false,
      reason: 'Data too fresh - needs minimum 4 hour verification window',
    };
  }
  
  return {
    compliant: true,
    reason: 'Temporal isolation requirements met',
  };
}

/**
 * Get freshness level from age
 */
export function getFreshnessLevel(ageHours: number): FreshnessLevel {
  if (ageHours >= 720) return 'historical';  // 30+ days
  if (ageHours >= 24) return 'verified';
  if (ageHours >= 4) return 'preliminary';
  return 'real_time'; // Not supported
}

/**
 * THE TEMPORAL SHIELD
 */
export const TEMPORAL_SHIELD = {
  protection: 'Oracle cannot be blamed for timing',
  
  scenarios_protected: [
    '"Your data was too slow" → "Our data is designed for verification, not speed"',
    '"You should have updated sooner" → "Our update schedule is published and intentional"',
    '"Real-time systems need faster data" → "We are not a real-time system"',
  ],
  
  legal_position: 'Temporal characteristics are disclosed and intentional',
} as const;
