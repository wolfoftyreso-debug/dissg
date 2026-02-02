/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SPOTLESS PROTOCOL COMPONENTS
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Complete quality assurance infrastructure for institutional-grade data.
 */

// Core components
export { SourceCard } from './SourceCard';
export { ShowsDoesNotShow } from './ShowsDoesNotShow';
export { MisinterpretationGuard, validateComparison, validateDataSufficiency, validateConfidence } from './MisinterpretationGuard';
export { SpotlessDashboard } from './SpotlessDashboard';
export { AggregationInspector } from './AggregationInspector';
export { ClickableWrapper } from './ClickableWrapper';

// Types are exported from context
export type { GuardReason } from './MisinterpretationGuard';
