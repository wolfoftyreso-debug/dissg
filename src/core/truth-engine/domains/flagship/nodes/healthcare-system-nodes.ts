/**
 * HEALTHCARE SYSTEM LOAD & CAPACITY — Truth Nodes
 * 
 * System-level healthcare performance.
 * NO individual treatment. System-level only.
 * 
 * Proves: Decision Substrate + Responsibility Distribution.
 */

import { TruthNode, createTruthNode } from '../../../ontology';

/**
 * HEALTHCARE SYSTEM CATEGORIES
 */
export const HEALTHCARE_CATEGORIES = {
  wait_times: 'Wait Times & Access',
  capacity: 'Capacity & Utilization',
  workforce: 'Workforce & Staffing',
  quality: 'Quality Indicators',
  regional: 'Regional Variation',
} as const;

/**
 * WAIT TIMES NODES
 */
export const WAIT_TIME_NODES: TruthNode[] = [
  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2015-01-01', end: '2024-01-01', granularity: 'month' },
    },
    {
      structural: true,
      acute: true,
      contextual: false,
      importance_score: 0.90,
      importance_rationale: 'Primary care access is fundamental to health system function',
    },
    0.88,
    {
      node_id: 'hcs_wait_primary_care_se',
      label: 'Primary Care Wait Time',
      description: 'Median days to primary care appointment',
      unit: 'days',
      category: 'wait_times',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2015-01-01', end: '2024-01-01', granularity: 'month' },
    },
    {
      structural: true,
      acute: true,
      contextual: false,
      importance_score: 0.92,
      importance_rationale: 'Specialist wait times indicate system bottlenecks',
    },
    0.85,
    {
      node_id: 'hcs_wait_specialist_se',
      label: 'Specialist Wait Time',
      description: 'Median days from referral to specialist appointment',
      unit: 'days',
      category: 'wait_times',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2015-01-01', end: '2024-01-01', granularity: 'month' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.88,
      importance_rationale: 'Surgery wait times affect patient outcomes',
    },
    0.82,
    {
      node_id: 'hcs_wait_surgery_se',
      label: 'Elective Surgery Wait Time',
      description: 'Median days from decision to elective surgery',
      unit: 'days',
      category: 'wait_times',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2018-01-01', end: '2024-01-01', granularity: 'month' },
    },
    {
      structural: true,
      acute: true,
      contextual: false,
      importance_score: 0.85,
      importance_rationale: 'Mental health access is critical given rising demand',
    },
    0.75,
    {
      node_id: 'hcs_wait_mental_health_se',
      label: 'Mental Health Care Wait Time',
      description: 'Median days to first mental health contact',
      unit: 'days',
      category: 'wait_times',
    }
  ),
];

/**
 * CAPACITY NODES
 */
export const CAPACITY_NODES: TruthNode[] = [
  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2010-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.85,
      importance_rationale: 'Bed capacity determines system surge capability',
    },
    0.92,
    {
      node_id: 'hcs_beds_per_capita_se',
      label: 'Hospital Beds per 1,000 Population',
      description: 'Total hospital bed capacity relative to population',
      unit: 'per_1000',
      category: 'capacity',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2015-01-01', end: '2024-01-01', granularity: 'month' },
    },
    {
      structural: true,
      acute: true,
      contextual: false,
      importance_score: 0.88,
      importance_rationale: 'High occupancy indicates system strain',
    },
    0.90,
    {
      node_id: 'hcs_bed_occupancy_se',
      label: 'Bed Occupancy Rate',
      description: 'Average hospital bed occupancy percentage',
      unit: 'percent',
      category: 'capacity',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2015-01-01', end: '2024-01-01', granularity: 'month' },
    },
    {
      structural: true,
      acute: true,
      contextual: false,
      importance_score: 0.90,
      importance_rationale: 'ICU capacity is critical infrastructure',
    },
    0.88,
    {
      node_id: 'hcs_icu_occupancy_se',
      label: 'ICU Occupancy Rate',
      description: 'Intensive care unit occupancy percentage',
      unit: 'percent',
      category: 'capacity',
    }
  ),
];

/**
 * WORKFORCE NODES
 */
export const WORKFORCE_NODES: TruthNode[] = [
  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2010-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.82,
      importance_rationale: 'Physician density determines care capacity',
    },
    0.90,
    {
      node_id: 'hcs_physicians_per_capita_se',
      label: 'Physicians per 1,000 Population',
      description: 'Licensed physicians relative to population',
      unit: 'per_1000',
      category: 'workforce',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2010-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.80,
      importance_rationale: 'Nursing staff is critical for care delivery',
    },
    0.88,
    {
      node_id: 'hcs_nurses_per_capita_se',
      label: 'Nurses per 1,000 Population',
      description: 'Licensed nurses relative to population',
      unit: 'per_1000',
      category: 'workforce',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2015-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: true,
      contextual: false,
      importance_score: 0.85,
      importance_rationale: 'Staff turnover indicates system stress',
    },
    0.75,
    {
      node_id: 'hcs_staff_turnover_se',
      label: 'Healthcare Staff Turnover Rate',
      description: 'Annual staff turnover in healthcare sector',
      unit: 'percent',
      category: 'workforce',
    }
  ),
];

/**
 * ALL HEALTHCARE SYSTEM NODES
 */
export const ALL_HEALTHCARE_SYSTEM_NODES: TruthNode[] = [
  ...WAIT_TIME_NODES,
  ...CAPACITY_NODES,
  ...WORKFORCE_NODES,
];

/**
 * GET NODE BY ID
 */
export function getHealthcareSystemNode(nodeId: string): TruthNode | undefined {
  return ALL_HEALTHCARE_SYSTEM_NODES.find(n => n.node_id === nodeId);
}
