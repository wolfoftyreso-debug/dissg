/**
 * Telia Components Index
 * 
 * Part of Block 54: Self-Learning Core + Telia-Grade Simplicity
 * 
 * These components enforce:
 * - No hardcoding
 * - Data-driven presentation
 * - Automatic simplification
 * - Visual minimalism
 */

export { TeliaContainer, TeliaCard, TeliaButton, TeliaText } from './TeliaContainer';
export { SimplicityScoreIndicator } from './SimplicityScoreIndicator';
export { DynamicMenu, DynamicTabs } from './DynamicMenu';

// Re-export config
export {
  HARDCODE_FORBIDDEN,
  HARDCODE_ALLOWED,
  CORE_LOOP_STAGES,
  LEARNING_THRESHOLDS,
  TELIA_PRINCIPLES,
  TELIA_UI_RULES,
  MENU_CONFIG,
  COPY_RULES,
  VISUAL_CONSTRAINTS,
  SIMPLICITY_THRESHOLDS,
  DONE_CRITERIA,
  calculateLearningOutput,
  rankMenuItems,
  analyzeCopy,
  calculateSimplicityScore,
  checkDoneCriteria,
  type LearningInput,
  type LearningOutput,
  type MenuItemStats,
  type CopyMetrics,
  type SimplicityScore,
  type WeeklyLearningReport,
  type LearningRecommendation,
} from '@/config/selfLearningCoreConfig';

// Re-export hook
export { useSelfLearning, type SelfLearningState } from '@/hooks/useSelfLearning';
