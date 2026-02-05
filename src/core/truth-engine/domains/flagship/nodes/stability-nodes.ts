/**
 * SOCIETAL STABILITY & SIGNALS — Truth Nodes
 * 
 * Change detection and stability indicators.
 * Signal not truth. Narrative detection active.
 * 
 * Proves: Index-first Thinking + Anti-propaganda.
 */

import { TruthNode, createTruthNode } from '../../../ontology';

/**
 * STABILITY CATEGORIES
 */
export const STABILITY_CATEGORIES = {
  media_signals: 'Media & Attention Signals',
  policy_change: 'Policy Change Frequency',
  social_cohesion: 'Social Cohesion Indicators',
  trust: 'Institutional Trust',
  volatility: 'System Volatility',
} as const;

/**
 * MEDIA SIGNAL NODES
 */
export const MEDIA_SIGNAL_NODES: TruthNode[] = [
  createTruthNode(
    'signal',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2020-01-01', end: '2024-01-01', granularity: 'week' },
    },
    {
      structural: false,
      acute: true,
      contextual: true,
      importance_score: 0.65,
      importance_rationale: 'Media volatility indicates attention shifts, not reality',
    },
    0.55,
    {
      node_id: 'stab_media_volatility_index_se',
      label: 'Media Volatility Index',
      description: 'Rate of topic change in major media outlets',
      unit: 'index',
      category: 'media_signals',
      signal_disclaimer: 'This measures media attention, not underlying reality',
    }
  ),

  createTruthNode(
    'signal',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2020-01-01', end: '2024-01-01', granularity: 'week' },
    },
    {
      structural: false,
      acute: true,
      contextual: true,
      importance_score: 0.60,
      importance_rationale: 'Narrative concentration can indicate coordinated messaging',
    },
    0.50,
    {
      node_id: 'stab_narrative_concentration_se',
      label: 'Narrative Concentration Index',
      description: 'Degree of topic uniformity across outlets',
      unit: 'index',
      category: 'media_signals',
      signal_disclaimer: 'High concentration may indicate coordinated or emergent narratives',
    }
  ),
];

/**
 * POLICY CHANGE NODES
 */
export const POLICY_CHANGE_NODES: TruthNode[] = [
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
      importance_score: 0.72,
      importance_rationale: 'Regulatory change rate affects business planning',
    },
    0.78,
    {
      node_id: 'stab_regulatory_change_rate_se',
      label: 'Regulatory Change Rate',
      description: 'Number of significant regulatory changes per year',
      unit: 'count',
      category: 'policy_change',
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
      importance_score: 0.68,
      importance_rationale: 'Policy reversals indicate governance instability',
    },
    0.72,
    {
      node_id: 'stab_policy_reversal_count_se',
      label: 'Policy Reversal Count',
      description: 'Policies reversed within 2 years of implementation',
      unit: 'count',
      category: 'policy_change',
    }
  ),
];

/**
 * TRUST NODES
 */
export const TRUST_NODES: TruthNode[] = [
  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2000-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.85,
      importance_rationale: 'Government trust affects policy effectiveness',
    },
    0.75,
    {
      node_id: 'stab_trust_government_se',
      label: 'Trust in Government',
      description: 'Proportion expressing trust in national government',
      unit: 'percent',
      category: 'trust',
    }
  ),

  createTruthNode(
    'indicator',
    {
      geo: { level: 'country', code: 'SE', name: 'Sweden' },
      population: { type: 'total' },
      time: { type: 'trend', start: '2005-01-01', end: '2024-01-01', granularity: 'year' },
    },
    {
      structural: true,
      acute: false,
      contextual: false,
      importance_score: 0.78,
      importance_rationale: 'Interpersonal trust is foundation of social capital',
    },
    0.72,
    {
      node_id: 'stab_trust_interpersonal_se',
      label: 'Interpersonal Trust',
      description: 'Proportion agreeing most people can be trusted',
      unit: 'percent',
      category: 'trust',
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
      importance_score: 0.75,
      importance_rationale: 'Media trust affects information ecosystem health',
    },
    0.70,
    {
      node_id: 'stab_trust_media_se',
      label: 'Trust in Media',
      description: 'Proportion expressing trust in news media',
      unit: 'percent',
      category: 'trust',
    }
  ),
];

/**
 * SOCIAL COHESION NODES
 */
export const COHESION_NODES: TruthNode[] = [
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
      importance_score: 0.72,
      importance_rationale: 'Political polarization affects governance capacity',
    },
    0.68,
    {
      node_id: 'stab_political_polarization_se',
      label: 'Political Polarization Index',
      description: 'Distance between party supporter positions',
      unit: 'index',
      category: 'social_cohesion',
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
      structural: false,
      acute: false,
      contextual: true,
      importance_score: 0.65,
      importance_rationale: 'Civic participation indicates engagement levels',
    },
    0.70,
    {
      node_id: 'stab_civic_participation_se',
      label: 'Civic Participation Rate',
      description: 'Proportion engaged in civic activities',
      unit: 'percent',
      category: 'social_cohesion',
    }
  ),
];

/**
 * ALL STABILITY NODES
 */
export const ALL_STABILITY_NODES: TruthNode[] = [
  ...MEDIA_SIGNAL_NODES,
  ...POLICY_CHANGE_NODES,
  ...TRUST_NODES,
  ...COHESION_NODES,
];

/**
 * GET NODE BY ID
 */
export function getStabilityNode(nodeId: string): TruthNode | undefined {
  return ALL_STABILITY_NODES.find(n => n.node_id === nodeId);
}
