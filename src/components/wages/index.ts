/**
 * WAGE COMPARISON MODULE
 * 
 * Complete wage comparison system with:
 * - Multi-country, multi-occupation comparison
 * - Time series with political overlay
 * - PPP/Nominal/Relative unit switching
 */

export { WageComparisonEngine } from './WageComparisonEngine';

// Re-export wage registry utilities
export {
  WAGE_DATA,
  OCCUPATION_METADATA,
  getWageData,
  getOccupationName,
  getAvailableOccupations,
  getAvailableCountriesForWages,
  type WageDataPoint,
  type OccupationCategory,
  type WageUnit,
} from '@/lib/wages/wageRegistry';
