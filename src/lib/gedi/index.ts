/**
 * GEDI - Global Equivalent Diagnostic Interface
 * 
 * Regulatory-level diagnostic codes for societal systems.
 * Equivalent to EOBD/OBD-II for vehicles.
 */

// Types
export type {
  GEDIStatus,
  GEDIStatusResult,
  GEDICodeDefinition,
  GEDICategory,
  GuidedStep,
  ProbableCause,
  GEDIAssessment,
  GEDICodeResult,
} from './types';

// Codes
export {
  GEDI_CATEGORY_LABELS,
  GEDI_CODES,
  getGEDICode,
  getGEDICodesByCategory,
  getAllGEDICategories,
} from './codes';

// Assessment
export {
  runGEDIAssessment,
  getGEDIAssessmentSummary,
} from './assessment-engine';
