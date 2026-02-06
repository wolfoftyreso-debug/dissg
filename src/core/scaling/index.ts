/**
 * SCALING PLAN INDEX
 * 
 * 0 → 100K → 1M → 10M Questions
 * 
 * "Detta är operativ verklighet, inte pitchdeck."
 */

// Scaling Plan & Phases
export {
  SCALING_PRINCIPLES,
  PHASE_0_FOUNDATION,
  PHASE_1_ACCELERATION,
  PHASE_2_INFRASTRUCTURE,
  SCALING_PHASES,
  PARAMETERIZATION_EXAMPLE,
  SCALING_TO_10M,
  getPhaseByQuestionCount,
  getTotalCostRange,
  getTotalTimelineRange,
  type ScalingPhase,
  type TeamStructure,
  type TeamRole,
} from './scalingPlan';

// Competitive Advantage
export {
  MOAT_COMPONENTS,
  COMPETITOR_BARRIERS,
  NETWORK_EFFECTS,
  SWITCHING_COSTS,
  POTENTIAL_COMPETITORS,
  FINAL_POSITION,
  type MoatComponent,
  type SwitchingCost,
} from './competitiveAdvantage';

// Metrics
export {
  VANITY_METRICS,
  CORE_METRICS,
  evaluateMetric,
  calculateDashboardHealth,
  SUCCESS_DEFINITION,
  type CoreMetric,
  type MetricSnapshot,
  type ScalingDashboard,
} from './scalingMetrics';

// ============================================
// QUICK ACCESS
// ============================================

import { SCALING_PHASES, getTotalCostRange, getTotalTimelineRange } from './scalingPlan';
import { FINAL_POSITION } from './competitiveAdvantage';
import { SUCCESS_DEFINITION } from './scalingMetrics';

/**
 * Get complete scaling overview
 */
export function getScalingOverview() {
  const costs = getTotalCostRange();
  const timeline = getTotalTimelineRange();
  
  return {
    phases: SCALING_PHASES.length,
    total_cost_sek: costs,
    total_timeline_months: timeline,
    target_questions: 10_000_000,
    final_position: FINAL_POSITION.after_phase_2.we_are,
    success_when: SUCCESS_DEFINITION.then,
  };
}

/**
 * Summary for quick reference
 */
export const SCALING_SUMMARY = {
  phase_0: {
    questions: '0 → 100K',
    team: '8-12',
    cost: '6-10 MSEK',
    time: '4-6 months',
  },
  phase_1: {
    questions: '100K → 1M',
    team: '20-30',
    cost: '20-35 MSEK',
    time: '12-18 months',
  },
  phase_2: {
    questions: '1M → 10M',
    team: '40-60',
    cost: '50-80 MSEK',
    time: '24-36 months',
  },
  total: {
    cost: '76-125 MSEK',
    time: '40-60 months',
    result: 'Global infrastructure dominance',
  },
} as const;

export const SCALING_VERSION = '1.0.0' as const;
