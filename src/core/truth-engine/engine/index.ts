/**
 * TRUTH ENGINE — PUBLIC API
 * 
 * Complete execution engine for ST-OS.
 * No AI response may bypass this.
 */

// Semantic Engine
export {
  runSemanticEngine,
  type EngineResult,
  type EngineContext,
  type EngineError,
} from './semantic-engine';

// Intent Resolution
export {
  resolveIntent,
  detectDomain,
  detectDepth,
  normalizeScope,
  mapToAllowedQuestion,
  type UserIntent,
  type ResolvedIntent,
  type Domain,
  type DepthLevel,
  type Scope,
  type QuestionType,
} from './intent-resolver';

// View Selection
export {
  selectSemanticView,
  getViewConfiguration,
  type SemanticView,
  type ViewType,
  type ViewFocus,
  type ViewConfiguration,
} from './view-selector';

// Importance Engine
export {
  calculateImportance,
  rankByImportance,
  filterByImportanceClass,
  getImportanceSummary,
  IMPORTANCE_THRESHOLDS,
  type ImportanceResult,
  type ImportanceSummary,
} from './importance-engine';

// Guardrails
export {
  enforceGuardrails,
  checkGuardrails,
  checkDomainCompliance,
  GuardrailError,
  type GuardrailViolation,
  type GuardrailType,
} from './guardrails';

// Self-Audit
export {
  selfAudit,
  runAuditPipeline,
  type AuditResult,
  type AuditCheck,
  type AuditAction,
} from './self-audit';
