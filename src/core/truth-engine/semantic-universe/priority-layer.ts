/**
 * SEMANTIC PRIORITY LAYER
 * 
 * All domains get a priority layer that answers:
 * - What is most relevant right now?
 * - What is structurally important vs noise?
 * - What is acute, long-term, secondary?
 * 
 * This is not opinion. It is semantic weighting based on data, variation, and impact.
 */

import type { DomainCode } from '../usae/mao/unified-body';

/**
 * PRIORITY CLASSIFICATION
 */
export type PriorityClass = 'structural' | 'acute' | 'background' | 'emerging';

/**
 * PRIORITY ITEM
 */
export interface PriorityItem {
  readonly code: string;
  readonly label: string;
  readonly class: PriorityClass;
  readonly weight: number;  // 0-1, derived from data
  readonly rationale: string;
  readonly data_basis: {
    readonly metric: string;
    readonly deviation_from_baseline: number;
    readonly trend_direction: 'increasing' | 'decreasing' | 'stable';
    readonly affected_population_percent: number;
  };
}

/**
 * DOMAIN PRIORITY MAP
 */
export interface DomainPriorityMap {
  readonly domain: DomainCode;
  readonly generated_at: string;
  readonly valid_until: string;
  readonly structural: readonly PriorityItem[];
  readonly acute: readonly PriorityItem[];
  readonly emerging: readonly PriorityItem[];
  readonly background: readonly PriorityItem[];
  readonly methodology_note: string;
}

/**
 * PRIORITY CALCULATION RULES (LOCKED)
 */
export const PRIORITY_CALCULATION_RULES = {
  structural: {
    description: 'Long-term systemic factors',
    criteria: [
      'Persistent over 3+ years',
      'Affects 20%+ of population',
      'Influences multiple downstream metrics',
      'Cannot be resolved by short-term action',
    ],
    weight_range: [0.7, 1.0],
  },
  acute: {
    description: 'Immediate attention signals',
    criteria: [
      'Deviation exceeds 2 standard deviations',
      'Rate of change exceeds historical norms',
      'Time-sensitive impact window',
      'Requires monitoring, not structural change',
    ],
    weight_range: [0.5, 0.9],
  },
  emerging: {
    description: 'Signals that may become important',
    criteria: [
      'New pattern detected',
      'Insufficient data for full classification',
      'Trend direction unclear but notable',
      'Warrants observation, not conclusion',
    ],
    weight_range: [0.3, 0.6],
  },
  background: {
    description: 'Normal variation and seasonal patterns',
    criteria: [
      'Within expected range',
      'Seasonal or cyclical',
      'No trend acceleration',
      'Context, not signal',
    ],
    weight_range: [0.0, 0.3],
  },
} as const;

/**
 * EXAMPLE: HEALTHCARE PRIORITY MAP
 */
export const HEALTHCARE_PRIORITY_EXAMPLE: DomainPriorityMap = {
  domain: 'healthcare',
  generated_at: '2025-01-01T00:00:00Z',
  valid_until: '2025-02-01T00:00:00Z',
  structural: [
    {
      code: 'capacity_constraints',
      label: 'Capacity constraints',
      class: 'structural',
      weight: 0.85,
      rationale: 'Persistent gap between demand and supply across regions',
      data_basis: {
        metric: 'bed_occupancy_rate',
        deviation_from_baseline: 0.15,
        trend_direction: 'increasing',
        affected_population_percent: 45,
      },
    },
    {
      code: 'staff_shortages',
      label: 'Staff shortages',
      class: 'structural',
      weight: 0.82,
      rationale: 'Vacancy rates above threshold in multiple specialties',
      data_basis: {
        metric: 'healthcare_vacancy_rate',
        deviation_from_baseline: 0.23,
        trend_direction: 'stable',
        affected_population_percent: 60,
      },
    },
  ],
  acute: [
    {
      code: 'waiting_time_spikes',
      label: 'Waiting time spikes',
      class: 'acute',
      weight: 0.71,
      rationale: 'Recent acceleration in specific regions',
      data_basis: {
        metric: 'median_waiting_days',
        deviation_from_baseline: 2.1,
        trend_direction: 'increasing',
        affected_population_percent: 15,
      },
    },
  ],
  emerging: [],
  background: [
    {
      code: 'seasonal_variation',
      label: 'Seasonal variation',
      class: 'background',
      weight: 0.15,
      rationale: 'Normal winter increase in respiratory cases',
      data_basis: {
        metric: 'respiratory_admissions',
        deviation_from_baseline: 0.3,
        trend_direction: 'increasing',
        affected_population_percent: 5,
      },
    },
  ],
  methodology_note: 'Priority weights derived from deviation magnitude, trend persistence, and population impact. Not recommendations.',
};

/**
 * PRIORITY MAP REGISTRY
 */
export const DOMAIN_PRIORITY_MAPS: Partial<Record<DomainCode, DomainPriorityMap>> = {
  healthcare: HEALTHCARE_PRIORITY_EXAMPLE,
};

/**
 * GET PRIORITY MAP
 */
export function getPriorityMap(domain: DomainCode): DomainPriorityMap | null {
  return DOMAIN_PRIORITY_MAPS[domain] ?? null;
}

/**
 * GET TOP PRIORITIES ACROSS DOMAINS
 */
export function getTopPriorities(limit: number = 10): PriorityItem[] {
  const all: PriorityItem[] = [];
  
  for (const map of Object.values(DOMAIN_PRIORITY_MAPS)) {
    if (map) {
      all.push(...map.structural, ...map.acute);
    }
  }
  
  return all
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit);
}
