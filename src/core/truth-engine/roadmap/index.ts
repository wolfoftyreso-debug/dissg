/**
 * ROADMAP — PUBLIC API
 * 
 * 16-week build plan for Semantic Truth OS.
 */

export {
  // Phases
  ALL_PHASES,
  PHASE_1_FOUNDATION,
  PHASE_2_SEE,
  PHASE_3_MEMORY,
  PHASE_4_HEALTH,
  PHASE_5_ECONOMY,
  PHASE_6_STABILITY,
  PHASE_7_DEMOGRAPHICS,
  PHASE_8_POLISH,
  PHASE_9_RELEASE,
  
  // Team
  TEAM_COMPOSITION,
  
  // Functions
  getPhaseByWeek,
  getDeliverablesByRole,
  getTotalEffort,
  getBuildPlanSummary,
  
  // Types
  type BuildPhase,
  type Deliverable,
  type TestCriteria,
  type TeamRole,
} from './build-plan';
