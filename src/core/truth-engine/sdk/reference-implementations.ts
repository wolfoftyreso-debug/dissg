/**
 * 5 PUBLIC REFERENCE IMPLEMENTATIONS
 * 
 * "This is how you do it — correctly."
 * 
 * Each reference contains:
 * - Decision Graph (JSON)
 * - Validator status (passes)
 * - Diagram spec
 * - Clear limitations
 */

import { DecisionGraph } from './partner-sdk';

/**
 * REFERENCE 1: INVESTMENT (ENERGY)
 */
export const REF_INVESTMENT_ENERGY = {
  id: 'ref_investment_energy_v1',
  title: 'Energy Sector Investment Feasibility',
  domain: 'investment',
  sector: 'energy',
  
  create: () => {
    const dg = new DecisionGraph({
      geography: 'SE',
      population: 'institutional_investors',
      time_horizon: '5y',
    });
    
    dg.add_node({
      question: 'How has energy demand changed over the past 10 years?',
      answer_type: 'TREND_CHANGE',
      answer_packet: 'energy:answer:demand_trend:v1',
    });
    
    dg.add_node({
      question: 'What is the distribution of energy sources in the region?',
      answer_type: 'DISTRIBUTION_STRUCTURE',
      answer_packet: 'energy:answer:source_distribution:v1',
    });
    
    dg.add_node({
      question: 'How does volatility compare to other sectors?',
      answer_type: 'COMPARISON_CONDITIONAL',
      answer_packet: 'energy:answer:volatility_comparison:v1',
      assumptions: ['Comparison uses same time period', 'Adjusted for market cap'],
    });
    
    dg.add_node({
      question: 'What is the projected demand under current policy?',
      answer_type: 'SCENARIO_MODEL',
      answer_packet: 'energy:answer:demand_projection:v1',
      assumptions: ['Current policy continues', 'No major technological disruption'],
      limitations: ['Projection only, not prediction'],
    });
    
    dg.set_limitations([
      'Does not account for geopolitical events',
      'Historical data may not predict future performance',
      'Regional focus limits generalizability',
    ]);
    
    dg.set_confidence(72, 85);
    
    return dg;
  },
  
  diagram_spec: {
    type: 'decision_tree',
    nodes: ['demand_trend', 'source_distribution', 'volatility_comparison', 'demand_projection'],
    layout: 'hierarchical',
  },
};

/**
 * REFERENCE 2: HEALTHCARE CAPACITY PLANNING
 */
export const REF_HEALTHCARE_CAPACITY = {
  id: 'ref_healthcare_capacity_v1',
  title: 'Healthcare Capacity Planning',
  domain: 'healthcare',
  sector: 'public_health',
  
  create: () => {
    const dg = new DecisionGraph({
      geography: 'SE',
      population: 'all_residents',
      time_horizon: '3y',
    });
    
    dg.add_node({
      question: 'What is the current bed occupancy rate across regions?',
      answer_type: 'DESCRIPTIVE_STAT',
      answer_packet: 'healthcare:answer:bed_occupancy:v1',
    });
    
    dg.add_node({
      question: 'How has wait time changed over the past 5 years?',
      answer_type: 'TREND_CHANGE',
      answer_packet: 'healthcare:answer:wait_time_trend:v1',
    });
    
    dg.add_node({
      question: 'What is the distribution of staff per 100k population?',
      answer_type: 'DISTRIBUTION_STRUCTURE',
      answer_packet: 'healthcare:answer:staff_distribution:v1',
    });
    
    dg.add_node({
      question: 'What is the prevalence of capacity strain by region?',
      answer_type: 'RISK_PREVALENCE',
      answer_packet: 'healthcare:answer:capacity_strain:v1',
    });
    
    dg.set_limitations([
      'Data lag of 3-6 months',
      'Regional definitions may vary',
      'Does not capture private sector capacity',
    ]);
    
    dg.set_confidence(68, 78);
    
    return dg;
  },
  
  diagram_spec: {
    type: 'dashboard',
    nodes: ['bed_occupancy', 'wait_time_trend', 'staff_distribution', 'capacity_strain'],
    layout: 'grid',
  },
};

/**
 * REFERENCE 3: POLICY - SCHOOL REFORM
 */
export const REF_POLICY_SCHOOL = {
  id: 'ref_policy_school_v1',
  title: 'School Reform Policy Analysis',
  domain: 'policy',
  sector: 'education',
  
  create: () => {
    const dg = new DecisionGraph({
      geography: 'SE',
      population: 'students_6_18',
      time_horizon: '10y',
    });
    
    dg.add_node({
      question: 'How have PISA scores changed since 2000?',
      answer_type: 'TREND_CHANGE',
      answer_packet: 'education:answer:pisa_trend:v1',
    });
    
    dg.add_node({
      question: 'What is the distribution of outcomes by socioeconomic status?',
      answer_type: 'DISTRIBUTION_STRUCTURE',
      answer_packet: 'education:answer:outcome_distribution:v1',
    });
    
    dg.add_node({
      question: 'How do outcomes compare before and after 2011 reform?',
      answer_type: 'COMPARISON_CONDITIONAL',
      answer_packet: 'education:answer:reform_comparison:v1',
      assumptions: ['Comparison controls for demographic changes'],
      limitations: ['Cannot establish causation from this comparison alone'],
    });
    
    dg.add_node({
      question: 'Is there correlation between class size and outcomes?',
      answer_type: 'CORRELATION_OVERVIEW',
      answer_packet: 'education:answer:class_size_correlation:v1',
      limitations: ['Correlation does not imply causation'],
    });
    
    dg.set_limitations([
      'Policy attribution is inherently difficult',
      'Multiple confounding factors present',
      'International comparisons have methodological limits',
    ]);
    
    dg.set_confidence(55, 82);
    
    return dg;
  },
  
  diagram_spec: {
    type: 'timeline',
    nodes: ['pisa_trend', 'outcome_distribution', 'reform_comparison', 'class_size_correlation'],
    layout: 'sequential',
  },
};

/**
 * REFERENCE 4: MARKET VOLATILITY EXPOSURE
 */
export const REF_MARKET_VOLATILITY = {
  id: 'ref_market_volatility_v1',
  title: 'Market Volatility Exposure Analysis',
  domain: 'market',
  sector: 'finance',
  
  create: () => {
    const dg = new DecisionGraph({
      geography: 'EU',
      population: 'listed_companies',
      time_horizon: '2y',
    });
    
    dg.add_node({
      question: 'What is the current volatility index level?',
      answer_type: 'DESCRIPTIVE_STAT',
      answer_packet: 'market:answer:volatility_index:v1',
    });
    
    dg.add_node({
      question: 'How has sector-specific volatility changed?',
      answer_type: 'TREND_CHANGE',
      answer_packet: 'market:answer:sector_volatility_trend:v1',
    });
    
    dg.add_node({
      question: 'What is the distribution of exposure by company size?',
      answer_type: 'DISTRIBUTION_STRUCTURE',
      answer_packet: 'market:answer:exposure_distribution:v1',
    });
    
    dg.add_node({
      question: 'How does current volatility compare to historical crises?',
      answer_type: 'COMPARISON_CONDITIONAL',
      answer_packet: 'market:answer:historical_comparison:v1',
      assumptions: ['Crisis periods defined by standard methodology'],
    });
    
    dg.set_limitations([
      'Past volatility does not predict future volatility',
      'Market conditions can change rapidly',
      'Sector classifications may overlap',
    ]);
    
    dg.set_confidence(74, 88);
    
    return dg;
  },
  
  diagram_spec: {
    type: 'multi_panel',
    nodes: ['volatility_index', 'sector_volatility_trend', 'exposure_distribution', 'historical_comparison'],
    layout: 'dashboard',
  },
};

/**
 * REFERENCE 5: ENVIRONMENT - REGIONAL VULNERABILITY
 */
export const REF_ENVIRONMENT_VULNERABILITY = {
  id: 'ref_environment_vulnerability_v1',
  title: 'Regional Environmental Vulnerability',
  domain: 'environment',
  sector: 'climate',
  
  create: () => {
    const dg = new DecisionGraph({
      geography: 'SE',
      population: 'all_regions',
      time_horizon: '20y',
    });
    
    dg.add_node({
      question: 'What is the prevalence of flood risk by region?',
      answer_type: 'RISK_PREVALENCE',
      answer_packet: 'environment:answer:flood_risk:v1',
    });
    
    dg.add_node({
      question: 'How has average temperature changed over 50 years?',
      answer_type: 'TREND_CHANGE',
      answer_packet: 'environment:answer:temperature_trend:v1',
    });
    
    dg.add_node({
      question: 'What is the distribution of infrastructure exposure?',
      answer_type: 'DISTRIBUTION_STRUCTURE',
      answer_packet: 'environment:answer:infrastructure_exposure:v1',
    });
    
    dg.add_node({
      question: 'What are projected conditions under IPCC scenarios?',
      answer_type: 'SCENARIO_MODEL',
      answer_packet: 'environment:answer:ipcc_scenarios:v1',
      assumptions: ['Based on IPCC AR6 scenarios', 'Regional downscaling applied'],
      limitations: ['Scenarios are not predictions', 'Local variation significant'],
    });
    
    dg.set_limitations([
      'Climate models have inherent uncertainty',
      'Regional projections less reliable than global',
      'Adaptation measures not included',
      'Scenarios assume specific emission pathways',
    ]);
    
    dg.set_confidence(62, 75);
    
    return dg;
  },
  
  diagram_spec: {
    type: 'geographic',
    nodes: ['flood_risk', 'temperature_trend', 'infrastructure_exposure', 'ipcc_scenarios'],
    layout: 'map_overlay',
  },
};

/**
 * ALL REFERENCES
 */
export const ALL_REFERENCES = [
  REF_INVESTMENT_ENERGY,
  REF_HEALTHCARE_CAPACITY,
  REF_POLICY_SCHOOL,
  REF_MARKET_VOLATILITY,
  REF_ENVIRONMENT_VULNERABILITY,
] as const;

/**
 * GET REFERENCE BY ID
 */
export function getReferenceById(id: string) {
  return ALL_REFERENCES.find(ref => ref.id === id);
}

/**
 * GET REFERENCE BY DOMAIN
 */
export function getReferencesByDomain(domain: string) {
  return ALL_REFERENCES.filter(ref => ref.domain === domain);
}
