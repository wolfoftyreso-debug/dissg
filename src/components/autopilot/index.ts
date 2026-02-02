/**
 * 🔁 MASTER EXECUTION BLOCK 53
 * 
 * CONTINUOUS UX/SEO OPTIMIZATION — AUTOPILOT, NO OPINIONS
 * 
 * Measure → simplify → verify → publish → measure again
 */

// Components
export { AutoRewriteEngine, shortenSummary, splitParagraphs, moveDefinitionsUp, analyzeForSimplification } from './AutoRewriteEngine';
export { DoesNotShowSection, DoesNotShowInline, determinePriority } from './DoesNotShowSection';
export { QualityGateMonitor, QualityGateBadge } from './QualityGateMonitor';
export { WeeklyReviewDashboard } from './WeeklyReviewDashboard';

// Re-export config
export {
  UX_THRESHOLDS,
  SEO_THRESHOLDS,
  AUTO_REWRITE_TRIGGERS,
  REWRITE_RULES,
  AB_TEST_CONFIG,
  DOES_NOT_SHOW_CONFIG,
  AI_FEEDBACK_CONFIG,
  QUALITY_GATES,
  WEEKLY_REVIEW_CONFIG,
  needsAutoRewrite,
  simplifyText,
  checkQualityGates,
  getWorstPerformingPages,
  type RewriteTrigger,
  type PageMetrics,
  type QualityGateCheck,
  type AIAgentSignal,
} from '@/config/autopilotConfig';

// Re-export hooks
export { useAutopilotSignals, analyzeSignals, type AutopilotSignals } from '@/hooks/useAutopilotSignals';
