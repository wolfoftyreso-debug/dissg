/**
 * SYSTEM PROJECTION TYPES
 * 
 * Year 1-5: How the world changes when decision structure becomes standard.
 * Not vision. Actual behavior.
 */

// ============================================================================
// PHASE STRUCTURE
// ============================================================================

export interface ProjectionPhase {
  readonly year: 1 | 2 | 3 | 4 | 5;
  readonly title: string;
  readonly subtitle: string;
  readonly state: PhaseState;
  readonly reactions: readonly string[];
  readonly effects: readonly PhaseEffect[];
  readonly metrics: readonly PhaseMetric[];
}

export interface PhaseState {
  readonly what_happens: readonly string[];
  readonly friction_points: readonly string[];
  readonly adoption_pattern: string;
}

export interface PhaseEffect {
  readonly description: string;
  readonly domain: 'behavior' | 'perception' | 'structure' | 'power';
  readonly permanence: 'temporary' | 'lasting' | 'irreversible';
}

export interface PhaseMetric {
  readonly name: string;
  readonly trend: 'up' | 'down' | 'stable';
  readonly significance: string;
}

// ============================================================================
// CIVILIZATIONAL STATE
// ============================================================================

export interface CivilizationalState {
  readonly decision_legitimacy_baseline: 'pre-standard' | 'emerging' | 'normalized' | 'invisible';
  readonly institutional_adoption: number; // 0-100
  readonly ai_integration_depth: number; // 0-100
  readonly cultural_shift_markers: readonly string[];
}

// ============================================================================
// SYSTEM BALANCE
// ============================================================================

export interface SystemBalance {
  readonly what_you_have_not: readonly string[];
  readonly what_you_have: string;
  readonly why_it_survives: readonly string[];
}
