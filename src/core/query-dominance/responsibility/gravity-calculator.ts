/**
 * GRAVITY CALCULATOR
 * 
 * Calculates decision gravity from four axes.
 * User cannot manually lower gravity.
 */

import type {
  GravityInput,
  GravityResult,
  GateType,
  AffectedPopulation,
  TimeHorizon,
  IrreversibilityLevel,
  UncertaintyLevel,
} from './types';

/**
 * Population weight mapping
 */
const POPULATION_WEIGHTS: Record<AffectedPopulation, number> = {
  '1': 0.05,
  '10': 0.15,
  '100': 0.30,
  '1000': 0.50,
  '10000': 0.75,
  '1M+': 1.0,
};

/**
 * Time horizon weight mapping
 */
const TIME_WEIGHTS: Record<TimeHorizon, number> = {
  minutes: 0.05,
  days: 0.15,
  months: 0.30,
  years: 0.55,
  decades: 0.80,
  generational: 1.0,
};

/**
 * Irreversibility weight mapping
 */
const IRREVERSIBILITY_WEIGHTS: Record<IrreversibilityLevel, number> = {
  low: 0.1,
  medium: 0.4,
  high: 0.7,
  permanent: 1.0,
};

/**
 * Uncertainty weight mapping
 */
const UNCERTAINTY_WEIGHTS: Record<UncertaintyLevel, number> = {
  low: 0.1,
  medium: 0.35,
  high: 0.65,
  extreme: 1.0,
};

/**
 * Calculate decision gravity
 * This is deterministic and cannot be manipulated
 */
export function calculateGravity(input: GravityInput): GravityResult {
  // Calculate weighted components
  const populationScore = POPULATION_WEIGHTS[input.affected_population] * 0.30;
  const timeScore = TIME_WEIGHTS[input.time_horizon] * 0.25;
  const irreversibilityScore = IRREVERSIBILITY_WEIGHTS[input.irreversibility] * 0.30;
  const uncertaintyScore = UNCERTAINTY_WEIGHTS[input.uncertainty] * 0.15;
  
  // Sum to get gravity (0-1)
  const gravity = Math.min(1, populationScore + timeScore + irreversibilityScore + uncertaintyScore);
  
  // Classify
  const gravityClass = classifyGravity(gravity);
  
  // Determine required gates
  const requiredGates = determineRequiredGates(gravity);
  
  // Determine review time
  const reviewTime = calculateMinimumReviewTime(gravity);
  
  // Determine cooling off
  const coolingOff = calculateCoolingOff(gravity);
  
  return {
    decision_gravity: Math.round(gravity * 100) / 100,
    class: gravityClass,
    required_gates: requiredGates,
    minimum_review_time_seconds: reviewTime,
    cooling_off_hours: coolingOff,
  };
}

/**
 * Classify gravity into named levels
 */
function classifyGravity(gravity: number): GravityResult['class'] {
  if (gravity < 0.1) return 'trivial';
  if (gravity < 0.25) return 'low';
  if (gravity < 0.45) return 'medium';
  if (gravity < 0.65) return 'high';
  if (gravity < 0.85) return 'critical';
  return 'extreme';
}

/**
 * Determine which gates must be passed
 */
function determineRequiredGates(gravity: number): GateType[] {
  const gates: GateType[] = [];
  
  // Gate 1: Scope Lock - always required above trivial
  if (gravity >= 0.1) {
    gates.push('scope_lock');
  }
  
  // Gate 2: Alternatives Exposure - required for low and above
  if (gravity >= 0.25) {
    gates.push('alternatives_exposure');
  }
  
  // Gate 3: Uncertainty Acknowledgement - required for medium and above
  if (gravity >= 0.45) {
    gates.push('uncertainty_acknowledgement');
  }
  
  // Gate 4: Consequence Projection - required for high and above
  if (gravity >= 0.65) {
    gates.push('consequence_projection');
  }
  
  return gates;
}

/**
 * Calculate minimum review time based on gravity
 */
function calculateMinimumReviewTime(gravity: number): number {
  if (gravity < 0.1) return 0;
  if (gravity < 0.25) return 15;
  if (gravity < 0.45) return 60;
  if (gravity < 0.65) return 180;
  if (gravity < 0.85) return 600; // 10 minutes
  return 1800; // 30 minutes
}

/**
 * Calculate cooling off period in hours
 */
function calculateCoolingOff(gravity: number): number {
  if (gravity < 0.45) return 0;
  if (gravity < 0.65) return 1;
  if (gravity < 0.85) return 24;
  return 72; // 3 days for extreme decisions
}

/**
 * Detect if this is an attempt to lower gravity
 * ANTI-ESCAPE: Returns true if manipulation detected
 */
export function detectGravityManipulation(
  currentInput: GravityInput,
  previousInput: GravityInput
): { manipulated: boolean; reason: string } {
  // Check if any axis was artificially lowered
  const checks = [
    {
      name: 'population',
      current: POPULATION_WEIGHTS[currentInput.affected_population],
      previous: POPULATION_WEIGHTS[previousInput.affected_population],
    },
    {
      name: 'time_horizon',
      current: TIME_WEIGHTS[currentInput.time_horizon],
      previous: TIME_WEIGHTS[previousInput.time_horizon],
    },
    {
      name: 'irreversibility',
      current: IRREVERSIBILITY_WEIGHTS[currentInput.irreversibility],
      previous: IRREVERSIBILITY_WEIGHTS[previousInput.irreversibility],
    },
    {
      name: 'uncertainty',
      current: UNCERTAINTY_WEIGHTS[currentInput.uncertainty],
      previous: UNCERTAINTY_WEIGHTS[previousInput.uncertainty],
    },
  ];
  
  for (const check of checks) {
    if (check.current < check.previous) {
      return {
        manipulated: true,
        reason: `Attempted to lower ${check.name} without justification`,
      };
    }
  }
  
  return { manipulated: false, reason: '' };
}

/**
 * GRAVITY CALCULATOR MASTERPROMPT
 */
export const GRAVITY_CALCULATOR_MASTERPROMPT = `
You calculate DECISION GRAVITY from four axes.

AXES:
1. Affected Population: 1 | 10 | 100 | 1000 | 10000 | 1M+
2. Time Horizon: minutes | days | months | years | decades | generational
3. Irreversibility: low | medium | high | permanent
4. Uncertainty: low | medium | high | extreme

WEIGHTS:
- Population: 30%
- Time: 25%
- Irreversibility: 30%
- Uncertainty: 15%

GRAVITY CLASSES:
- Trivial: < 0.10
- Low: 0.10 - 0.24
- Medium: 0.25 - 0.44
- High: 0.45 - 0.64
- Critical: 0.65 - 0.84
- Extreme: 0.85 - 1.00

REQUIRED GATES BY GRAVITY:
- Trivial: None
- Low: Scope Lock
- Medium: + Alternatives Exposure
- High: + Uncertainty Acknowledgement
- Critical/Extreme: + Consequence Projection

ANTI-MANIPULATION:
User cannot manually lower gravity.
All changes are logged and audited.
Gravity is calculated, never negotiated.
`;
