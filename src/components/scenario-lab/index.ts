/**
 * Scenario Lab Components Index
 * 
 * 📈 PROBABILISTIC SCENARIO LAB
 * 
 * Advanced user mode — responsibility on the user.
 * The platform provides the engine, not the conclusion.
 */

// Core Components
export { ModeIndicator, ModeSwitcher } from './ModeIndicator';
export { ScenarioDisclaimer, CounterweightWarning, ScenarioMetadata } from './ScenarioDisclaimer';
export { ModelTypeSelector } from './ModelTypeSelector';
export { ScenarioLabOverview } from './ScenarioLabOverview';

// Configuration
export {
  SCENARIO_CORE_PRINCIPLE,
  MODE_DISTINCTION,
  SCENARIO_MODEL_TYPES,
  SCENARIO_INPUTS,
  OUTPUT_RULES,
  TRACEABILITY,
  COUNTERWEIGHT_SYSTEM,
  SAFETY_RATIONALE,
  PHILOSOPHY_ALIGNMENT,
  SCENARIO_COMPLETION_CRITERIA,
  SCENARIO_CONCLUSION,
  type PlatformMode,
  type ScenarioModelType,
  type ModelTypeDefinition,
} from '@/config/scenarioLabConfig';
