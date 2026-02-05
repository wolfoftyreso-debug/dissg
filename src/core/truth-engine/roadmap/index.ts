/**
 * ROADMAP — PUBLIC API
 * 
 * 16-week build plan + Execution order for Semantic Truth OS.
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

export {
  // Execution Order
  EXECUTION_ORDER,
  LOCKED_PRINCIPLES,
  FINAL_RESULT,
  
  // Steps
  STEP_0_PRINCIPLES,
  STEP_1_SKELETON,
  STEP_2_CONTRACTS,
  STEP_3_SEE,
  STEP_4_GRAPH,
  STEP_5_MEMORY,
  STEP_6_HEALTH,
  STEP_7_HEALTHCARE,
  STEP_8_ECONOMY,
  STEP_9_SIGNALS,
  STEP_10_DEMOGRAPHICS,
  STEP_11_EXPLORER,
  STEP_12_SDK,
  STEP_13_LOCK,
  
  // Functions
  getStepById,
  getBlockingSteps,
  getStepProgress,
  validateExecutionOrder,
  
  // Types
  type ExecutionStep,
  type Task,
} from './execution-order';
