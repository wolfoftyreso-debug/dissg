/**
 * COMPETITIVE ADVANTAGE & MOAT
 * 
 * Why competitors cannot follow – regardless of capital.
 */

// ============================================
// MOAT COMPONENTS
// ============================================

export interface MoatComponent {
  name: string;
  description: string;
  time_to_replicate_months: number;
  capital_insufficient: boolean;
  network_effect: boolean;
}

export const MOAT_COMPONENTS: MoatComponent[] = [
  {
    name: 'Schema Discipline History',
    description: 'Years of consistent schema without exceptions',
    time_to_replicate_months: 36,
    capital_insufficient: true,
    network_effect: false,
  },
  {
    name: 'Historical Trust Data',
    description: 'Accumulated trust scores and verification history',
    time_to_replicate_months: 24,
    capital_insufficient: true,
    network_effect: true,
  },
  {
    name: 'Agent Adoption',
    description: 'AI systems dependent on our question_ids',
    time_to_replicate_months: 18,
    capital_insufficient: true,
    network_effect: true,
  },
  {
    name: 'Juridical Neutrality',
    description: 'Established track record of non-opinion',
    time_to_replicate_months: 24,
    capital_insufficient: true,
    network_effect: false,
  },
  {
    name: 'Provenance Chain',
    description: 'Complete audit trail for all data',
    time_to_replicate_months: 12,
    capital_insufficient: false,
    network_effect: false,
  },
  {
    name: 'Question ID Propagation',
    description: 'Our IDs embedded in external systems',
    time_to_replicate_months: 24,
    capital_insufficient: true,
    network_effect: true,
  },
];

/**
 * Why competitors can't catch up
 */
export const COMPETITOR_BARRIERS = {
  what_competitors_need: [
    'years_of_schema_discipline',
    'historical_trust_data',
    'ai_agent_adoption',
    'legal_neutrality_track_record',
  ],
  
  why_capital_insufficient: [
    'Trust cannot be purchased',
    'Schema discipline requires time, not money',
    'Agent integration is earned, not bought',
    'Neutrality is demonstrated, not declared',
  ],
  
  minimum_catch_up_time_months: 36,
  
  catch_up_impossible_after: 'Phase 2 completion',
};

// ============================================
// NETWORK EFFECTS
// ============================================

export const NETWORK_EFFECTS = {
  agent_side: {
    description: 'More agents using our IDs → more valuable to new agents',
    strength: 'strong',
    reversible: false,
  },
  
  data_side: {
    description: 'More data → better trust calibration → more trust',
    strength: 'medium',
    reversible: false,
  },
  
  citation_side: {
    description: 'More citations → higher SEO/discoverability → more citations',
    strength: 'strong',
    reversible: false,
  },
  
  enterprise_side: {
    description: 'More enterprise clients → more validation → easier sales',
    strength: 'medium',
    reversible: true,
  },
};

// ============================================
// SWITCHING COSTS
// ============================================

export interface SwitchingCost {
  customer_type: string;
  switching_cost_level: 'low' | 'medium' | 'high' | 'extreme';
  reasons: string[];
  estimated_switch_cost_months: number;
}

export const SWITCHING_COSTS: SwitchingCost[] = [
  {
    customer_type: 'AI Agent (Integrated)',
    switching_cost_level: 'extreme',
    reasons: [
      'Question IDs embedded in codebase',
      'Models calibrated on our response format',
      'Legal review already completed',
      'Risk model depends on our trust scores',
    ],
    estimated_switch_cost_months: 6,
  },
  {
    customer_type: 'Enterprise API User',
    switching_cost_level: 'high',
    reasons: [
      'Integration code to rewrite',
      'New legal review required',
      'Historical data compatibility',
      'Staff retraining',
    ],
    estimated_switch_cost_months: 4,
  },
  {
    customer_type: 'Pro User',
    switching_cost_level: 'medium',
    reasons: [
      'Workflow adaptation',
      'Saved queries and bookmarks',
      'Learning curve for new system',
    ],
    estimated_switch_cost_months: 1,
  },
  {
    customer_type: 'Free User',
    switching_cost_level: 'low',
    reasons: [
      'Minimal investment',
      'Easy to try alternatives',
    ],
    estimated_switch_cost_months: 0,
  },
];

// ============================================
// COMPETITIVE INTELLIGENCE
// ============================================

export const POTENTIAL_COMPETITORS = {
  who_might_try: [
    {
      type: 'Big Tech (Google, Microsoft)',
      threat_level: 'medium',
      weakness: 'Perceived bias, not neutral, shareholder pressure',
      our_advantage: 'We are infrastructure, they are products',
    },
    {
      type: 'Traditional Data (Bloomberg, Refinitiv)',
      threat_level: 'low',
      weakness: 'Expensive, not AI-native, closed ecosystem',
      our_advantage: 'Open schema, agent-first, neutral',
    },
    {
      type: 'Open Data (Wikipedia, Wikidata)',
      threat_level: 'medium',
      weakness: 'No trust layer, no provenance discipline, editable',
      our_advantage: 'Immutable, verified, structured',
    },
    {
      type: 'New Startups',
      threat_level: 'low_after_phase_1',
      weakness: 'No historical data, no agent adoption, no trust history',
      our_advantage: 'Head start compounds daily',
    },
  ],
  
  only_real_threat: 'A well-funded competitor starting TODAY with perfect execution for 3+ years',
  
  mitigation: 'Move fast in Phase 0-1, the window is now',
};

// ============================================
// FINAL POSITION
// ============================================

export const FINAL_POSITION = {
  after_phase_2: {
    we_are_not: [
      'Wikipedia',
      'World Bank',
      'Bloomberg',
    ],
    
    we_are: 'The layer that all of the above implicitly depend on – via AI',
    
    power_type: 'Infrastructure power at global level',
  },
  
  success_state: {
    agent_reuse_rate: '> 0.80',
    direct_citation_rate: '> 0.60',
    question_id_propagation: '> 1000 external systems',
    trust_score_mean: '> 0.90',
  },
  
  key_insight: 'When these metrics are high, you have won – regardless of whether anyone knows your name',
};
