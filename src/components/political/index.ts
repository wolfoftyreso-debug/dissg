/**
 * POLITICAL OVERLAY MODULE
 * 
 * Reusable political context visualization for ANY time-series data.
 * Shows government periods, leaders, and coalition information.
 */

export { PoliticalOverlay } from './PoliticalOverlay';
export { LeadershipPanel } from './LeadershipPanel';

// Re-export registry utilities
export {
  GOVERNMENT_REGISTRY,
  BLOC_COLORS,
  getGovernmentAtDate,
  getGovernmentsInRange,
  getAvailableCountries,
  type GovernmentPeriod,
  type PoliticalBloc,
  type Leader,
} from '@/lib/political/politicalRegistry';
