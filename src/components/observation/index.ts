/**
 * OBSERVATION MODE COMPONENTS
 * 
 * 🔬 ENGINEERING-GRADE DATA PRESENTATION
 * "What does the data show?"
 * 
 * Used for sensitive/controversial topics:
 * - Pandemic / COVID-19
 * - Diet & Health
 * - Environment & Energy
 * - Immigration
 * - Economy & Debt
 * - Pharmaceuticals
 * - Climate
 */

// Main view
export { SensitiveTopicView } from './SensitiveTopicView';
export type { SensitiveTopicData } from './SensitiveTopicView';

// Core components
export { QuickAnswerBar } from './QuickAnswerBar';
export type { QuickAnswerData } from './QuickAnswerBar';

export { MisinterpretationRisk, MisinterpretationRiskCompact } from './MisinterpretationRisk';

// Sections
export { ObservationSection } from './sections/ObservationSection';
export type { ObservationData, IndicatorData } from './sections/ObservationSection';

export { CoMovementSection } from './sections/CoMovementSection';
export type { CoMovementData, CorrelationPair } from './sections/CoMovementSection';

export { ComparisonSection } from './sections/ComparisonSection';
export type { ComparisonData, ComparisonGroup, PeerData } from './sections/ComparisonSection';

export { LimitationsSection } from './sections/LimitationsSection';
export type { LimitationsData, LimitationItem } from './sections/LimitationsSection';

export { ScenarioMode } from './sections/ScenarioMode';
export type { ScenarioData } from './sections/ScenarioMode';
