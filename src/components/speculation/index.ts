/**
 * 🛑 MASTER EXECUTION BLOCK 51
 * 
 * ZERO-SPECULATION MODE — Component Exports
 * 
 * Anti-bullshit system components:
 * - DataStatusBar: Shows data quality at a glance
 * - MandatoryDisclaimer: Required disclaimers by topic
 * - InterpretationWarning: Anti-misuse flagging
 * - ShowDataButton: Reveal underlying data
 */

export { DataStatusBar } from './DataStatusBar';
export { MandatoryDisclaimer, StandardDisclaimer } from './MandatoryDisclaimer';
export { 
  InterpretationWarning, 
  createWarning,
  CherryPickingWarning,
  IncompleteContextBanner,
} from './InterpretationWarning';
export { ShowDataButton, ShowDataLink } from './ShowDataButton';

// Re-export config types and helpers
export {
  type DataStatus,
  type DataStatusLevel,
  type UncertaintyLevel,
  type CausalityStatus,
  type SourceStatus,
  type InterpretationWarning as InterpretationWarningType,
  type WarningType,
  FORBIDDEN_PHRASES,
  MANDATORY_DISCLAIMERS,
  AI_STRICT_MODE_RESPONSES,
  containsForbiddenPhrase,
  sanitizeText,
  getRequiredDisclaimers,
  getStrictModeResponse,
  createDataStatus,
} from '@/config/zeroSpeculationConfig';
