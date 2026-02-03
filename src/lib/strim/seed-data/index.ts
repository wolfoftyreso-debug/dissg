/**
 * STRIM Seed Data Index
 * 
 * Exports all 10 initial entities for database seeding.
 */

export { SEED_SUBSTANCES } from './substances';
export { SEED_DIAGNOSES } from './diagnoses';
export { SEED_TREATMENTS } from './treatments';
export { SEED_LEGAL } from './legal';
export { SEED_TERMS } from './terms';

// Re-export types
export type {
  ValidatedSubstance,
  ValidatedDiagnosis,
  ValidatedTreatment,
  ValidatedLegal,
  ValidatedTerm,
} from '../validation';
