/**
 * 🧠 MASTER EXECUTION BLOCK 52
 * 
 * DESIGN, UX, PERFORMANCE & LEARNING LOOP
 * 
 * Review mode components and utilities.
 */

// Components
export { QualityGateChecklist, QualityBadge } from './QualityGateChecklist';
export { TextQualityAnalyzer, TextQualityBadge, cleanupText } from './TextQualityAnalyzer';
export { SEOAuditChecklist, runSEOChecks } from './SEOAuditChecklist';

// Re-export config
export {
  DESIGN_PHILOSOPHY,
  TTI_TARGETS,
  CLICK_TARGETS,
  CRITICAL_FLOWS,
  PERFORMANCE_REQUIREMENTS,
  SEO_CHECKLIST,
  TEXT_REPLACEMENTS,
  QUALITY_GATES,
  WEEKLY_REVIEW_CHECKLIST,
  analyzeTextQuality,
  checkPerformance,
  createBehaviorLog,
  type UXFlow,
  type QualityGate,
  type SEOCheckItem,
  type BehaviorLog,
  type UserBehaviorEvent,
} from '@/config/qualityReviewConfig';
