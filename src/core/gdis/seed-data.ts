/**
 * GDIS SEED DATA
 * 
 * World's major problems, interventions, causal links
 */

import type {
  GlobalProblem, Intervention, CausalLink, DataSource, GlobalVariable, KnowledgeClaim,
} from './types';

export const SEED_SOURCES: DataSource[] = [
  { id: 'SRC-WHO', name: 'World Health Organization', category: 'health_data', organization: 'WHO', reliabilityScore: 0.95, updateFrequency: 'annual' },
  { id: 'SRC-WB', name: 'World Bank Open Data', category: 'statistics', organization: 'World Bank', reliabilityScore: 0.93, updateFrequency: 'annual' },
  { id: 'SRC-IPCC', name: 'IPCC Assessment Reports', category: 'environment', organization: 'IPCC', reliabilityScore: 0.96, updateFrequency: '5-7 years' },
  { id: 'SRC-IHME', name: 'Institute for Health Metrics', category: 'health_data', organization: 'IHME', reliabilityScore: 0.92, updateFrequency: 'annual' },
  { id: 'SRC-UN', name: 'UN Statistics Division', category: 'statistics', organization: 'United Nations', reliabilityScore: 0.94, updateFrequency: 'annual' },
  { id: 'SRC-OECD', name: 'OECD Data', category: 'economic', organization: 'OECD', reliabilityScore: 0.93, updateFrequency: 'quarterly' },
];

export const SEED_VARIABLES: GlobalVariable[] = [
  { id: 'VAR-LE', code: 'life_expectancy', name: 'Life Expectancy', domain: 'health', unit: 'years', direction: 'higher_better', globalCoverage: 0.97 },
  { id: 'VAR-CO2', code: 'co2_emissions', name: 'CO₂ Emissions', domain: 'climate', unit: 'tonnes/capita', direction: 'lower_better', globalCoverage: 0.95 },
  { id: 'VAR-GDP', code: 'gdp_per_capita', name: 'GDP per Capita', domain: 'economy', unit: 'USD PPP', direction: 'higher_better', globalCoverage: 0.96 },
  { id: 'VAR-LIT', code: 'literacy_rate', name: 'Literacy Rate', domain: 'education', unit: '%', direction: 'higher_better', globalCoverage: 0.88 },
  { id: 'VAR-PM25', code: 'pm25_exposure', name: 'PM2.5 Exposure', domain: 'environment', unit: 'µg/m³', direction: 'lower_better', globalCoverage: 0.91 },
  { id: 'VAR-IMR', code: 'infant_mortality', name: 'Infant Mortality Rate', domain: 'health', unit: 'per 1000', direction: 'lower_better', globalCoverage: 0.96 },
  { id: 'VAR-UNE', code: 'unemployment', name: 'Unemployment Rate', domain: 'economy', unit: '%', direction: 'lower_better', globalCoverage: 0.93 },
  { id: 'VAR-FOOD', code: 'food_insecurity', name: 'Food Insecurity', domain: 'health', unit: '% population', direction: 'lower_better', globalCoverage: 0.89 },
];

export const SEED_PROBLEMS: GlobalProblem[] = [
  {
    id: 'PROB-CVD', code: 'cardiovascular_disease', title: 'Cardiovascular Disease',
    description: 'Leading global cause of death, responsible for ~18M deaths annually',
    domain: 'health', severity: 'critical', populationAffected: 523_000_000,
    dalysOrEquivalent: 393_000_000, trendDirection: 'stable',
    relatedVariables: ['VAR-LE', 'VAR-PM25'], relatedClaims: ['CLM-G1'],
    geographicScope: 'Global',
  },
  {
    id: 'PROB-CC', code: 'climate_change', title: 'Climate Change',
    description: 'Global temperature rise threatening ecosystems, food security, and human health',
    domain: 'climate', severity: 'critical', populationAffected: 8_000_000_000,
    dalysOrEquivalent: 250_000_000, trendDirection: 'worsening',
    relatedVariables: ['VAR-CO2'], relatedClaims: ['CLM-G2'],
    geographicScope: 'Global',
  },
  {
    id: 'PROB-FI', code: 'food_insecurity', title: 'Global Food Insecurity',
    description: '~735M people facing hunger, worsened by climate and conflict',
    domain: 'health', severity: 'critical', populationAffected: 735_000_000,
    dalysOrEquivalent: 120_000_000, trendDirection: 'worsening',
    relatedVariables: ['VAR-FOOD', 'VAR-IMR'], relatedClaims: ['CLM-G3'],
    geographicScope: 'Global',
  },
  {
    id: 'PROB-AP', code: 'air_pollution', title: 'Air Pollution',
    description: 'Ambient and household air pollution causes ~7M premature deaths/year',
    domain: 'environment', severity: 'severe', populationAffected: 4_200_000_000,
    dalysOrEquivalent: 213_000_000, trendDirection: 'stable',
    relatedVariables: ['VAR-PM25', 'VAR-LE'], relatedClaims: ['CLM-G4'],
    geographicScope: 'Global',
  },
  {
    id: 'PROB-ED', code: 'education_gap', title: 'Global Education Gap',
    description: '~250M children out of school, learning poverty affects 70% in developing nations',
    domain: 'education', severity: 'severe', populationAffected: 1_500_000_000,
    dalysOrEquivalent: 90_000_000, trendDirection: 'improving',
    relatedVariables: ['VAR-LIT'], relatedClaims: ['CLM-G5'],
    geographicScope: 'Global',
  },
  {
    id: 'PROB-MH', code: 'mental_health', title: 'Mental Health Crisis',
    description: '~1B people affected by mental disorders, massively under-treated globally',
    domain: 'health', severity: 'severe', populationAffected: 970_000_000,
    dalysOrEquivalent: 125_000_000, trendDirection: 'worsening',
    relatedVariables: ['VAR-LE', 'VAR-UNE'], relatedClaims: [],
    geographicScope: 'Global',
  },
  {
    id: 'PROB-POV', code: 'extreme_poverty', title: 'Extreme Poverty',
    description: '~700M people living on less than $2.15/day',
    domain: 'economy', severity: 'severe', populationAffected: 700_000_000,
    dalysOrEquivalent: 180_000_000, trendDirection: 'improving',
    relatedVariables: ['VAR-GDP', 'VAR-UNE', 'VAR-FOOD'], relatedClaims: [],
    geographicScope: 'Global',
  },
  {
    id: 'PROB-AMR', code: 'antimicrobial_resistance', title: 'Antimicrobial Resistance',
    description: 'Drug-resistant infections killed ~1.27M in 2019, projected to rise dramatically',
    domain: 'health', severity: 'critical', populationAffected: 5_000_000_000,
    dalysOrEquivalent: 50_000_000, trendDirection: 'worsening',
    relatedVariables: ['VAR-LE', 'VAR-IMR'], relatedClaims: [],
    geographicScope: 'Global',
  },
];

export const SEED_INTERVENTIONS: Intervention[] = [
  {
    id: 'INT-G01', name: 'Universal Childhood Vaccination', description: 'Complete childhood immunization programs',
    domain: 'health', targetProblems: ['PROB-CVD', 'PROB-FI', 'PROB-AMR'], status: 'proven',
    costLevel: 'low', scalability: 'global', timeToEffect: '1–5 years', evidenceGrade: 'meta_analysis',
    effectSize: '85–95% disease reduction', population: 'Children 0–5',
    sideEffects: ['Minor adverse events (<1%)'], implementationBarriers: ['Cold chain logistics', 'Vaccine hesitancy'],
  },
  {
    id: 'INT-G02', name: 'Clean Energy Transition', description: 'Shift from fossil fuels to renewable energy',
    domain: 'climate', targetProblems: ['PROB-CC', 'PROB-AP'], status: 'proven',
    costLevel: 'high', scalability: 'global', timeToEffect: '5–20 years', evidenceGrade: 'systematic_review',
    effectSize: '40–80% emission reduction', population: 'Global',
    sideEffects: ['Short-term economic disruption'], implementationBarriers: ['Infrastructure investment', 'Political resistance'],
  },
  {
    id: 'INT-G03', name: 'Universal Primary Education', description: 'Ensure access to quality primary education for all',
    domain: 'education', targetProblems: ['PROB-ED', 'PROB-POV'], status: 'proven',
    costLevel: 'medium', scalability: 'global', timeToEffect: '5–15 years', evidenceGrade: 'systematic_review',
    effectSize: '10–15% income increase per year of schooling', population: 'Children 6–12',
    sideEffects: [], implementationBarriers: ['Teacher shortages', 'Funding gaps'],
  },
  {
    id: 'INT-G04', name: 'Air Quality Regulation', description: 'Strict PM2.5 and emissions standards',
    domain: 'environment', targetProblems: ['PROB-AP', 'PROB-CVD'], status: 'proven',
    costLevel: 'medium', scalability: 'national', timeToEffect: '2–10 years', evidenceGrade: 'rct',
    effectSize: '15–30% reduction in respiratory mortality', population: 'Urban populations',
    sideEffects: ['Industry compliance costs'], implementationBarriers: ['Political will', 'Enforcement capacity'],
  },
  {
    id: 'INT-G05', name: 'School Feeding Programs', description: 'Provide nutritious meals in schools',
    domain: 'health', targetProblems: ['PROB-FI', 'PROB-ED'], status: 'proven',
    costLevel: 'low', scalability: 'national', timeToEffect: '6–12 months', evidenceGrade: 'rct',
    effectSize: '10% attendance increase, reduced stunting', population: 'Children 5–15',
    sideEffects: [], implementationBarriers: ['Supply chains', 'Local food systems'],
  },
  {
    id: 'INT-G06', name: 'Community Mental Health Services', description: 'Task-shifting mental health to primary care',
    domain: 'health', targetProblems: ['PROB-MH', 'PROB-POV'], status: 'promising',
    costLevel: 'low', scalability: 'national', timeToEffect: '1–3 years', evidenceGrade: 'rct',
    effectSize: '30–50% improvement in depression scores', population: 'Adults',
    sideEffects: [], implementationBarriers: ['Stigma', 'Training requirements'],
  },
  {
    id: 'INT-G07', name: 'Antibiotic Stewardship Programs', description: 'Reduce unnecessary antibiotic use',
    domain: 'health', targetProblems: ['PROB-AMR'], status: 'proven',
    costLevel: 'low', scalability: 'global', timeToEffect: '1–5 years', evidenceGrade: 'systematic_review',
    effectSize: '20–30% reduction in resistance emergence', population: 'Global',
    sideEffects: [], implementationBarriers: ['Agricultural sector resistance', 'Monitoring infrastructure'],
  },
  {
    id: 'INT-G08', name: 'Cash Transfer Programs', description: 'Direct cash to extreme poor households',
    domain: 'economy', targetProblems: ['PROB-POV', 'PROB-FI'], status: 'proven',
    costLevel: 'medium', scalability: 'national', timeToEffect: '3–12 months', evidenceGrade: 'meta_analysis',
    effectSize: '25–40% poverty reduction among recipients', population: 'Extreme poor',
    sideEffects: ['Dependency concerns (debated)'], implementationBarriers: ['Targeting accuracy', 'Digital infrastructure'],
  },
  {
    id: 'INT-G09', name: 'Urban Green Infrastructure', description: 'Parks, green corridors, urban forests',
    domain: 'environment', targetProblems: ['PROB-AP', 'PROB-MH', 'PROB-CC'], status: 'promising',
    costLevel: 'medium', scalability: 'local', timeToEffect: '2–10 years', evidenceGrade: 'observational',
    effectSize: '10–20% stress reduction, air quality improvement', population: 'Urban residents',
    sideEffects: ['Gentrification risk'], implementationBarriers: ['Land availability', 'Maintenance costs'],
  },
  {
    id: 'INT-G10', name: 'Sustainable Agriculture', description: 'Climate-resilient farming practices',
    domain: 'environment', targetProblems: ['PROB-FI', 'PROB-CC'], status: 'promising',
    costLevel: 'low', scalability: 'global', timeToEffect: '1–5 years', evidenceGrade: 'cohort',
    effectSize: '20–30% yield resilience in drought conditions', population: 'Smallholder farmers',
    sideEffects: ['Transition period productivity dip'], implementationBarriers: ['Knowledge transfer', 'Access to inputs'],
  },
];

export const SEED_CAUSAL_LINKS: CausalLink[] = [
  { id: 'CL-01', fromVariable: 'Air pollution', toVariable: 'Inflammation', mechanism: 'Particulate matter triggers systemic inflammatory response', strength: 0.82, confidence: 0.91, lagMonths: 1, bidirectional: false, domains: ['environment', 'health'] },
  { id: 'CL-02', fromVariable: 'Inflammation', toVariable: 'Cardiovascular disease', mechanism: 'Chronic inflammation accelerates atherosclerosis', strength: 0.78, confidence: 0.88, lagMonths: 60, bidirectional: false, domains: ['health'] },
  { id: 'CL-03', fromVariable: 'Education level', toVariable: 'Income', mechanism: 'Human capital increases productivity', strength: 0.71, confidence: 0.85, lagMonths: 120, bidirectional: false, domains: ['education', 'economy'] },
  { id: 'CL-04', fromVariable: 'Income', toVariable: 'Health outcomes', mechanism: 'Better nutrition, healthcare access, living conditions', strength: 0.65, confidence: 0.82, lagMonths: 36, bidirectional: false, domains: ['economy', 'health'] },
  { id: 'CL-05', fromVariable: 'CO₂ emissions', toVariable: 'Global temperature', mechanism: 'Greenhouse effect', strength: 0.95, confidence: 0.97, lagMonths: 120, bidirectional: false, domains: ['climate'] },
  { id: 'CL-06', fromVariable: 'Global temperature', toVariable: 'Food production', mechanism: 'Extreme weather, water stress, crop failure', strength: 0.72, confidence: 0.85, lagMonths: 60, bidirectional: false, domains: ['climate', 'health'] },
  { id: 'CL-07', fromVariable: 'Poverty', toVariable: 'Mental health', mechanism: 'Chronic stress, lack of agency, insecurity', strength: 0.68, confidence: 0.79, lagMonths: 12, bidirectional: true, domains: ['economy', 'health'] },
  { id: 'CL-08', fromVariable: 'Mental health', toVariable: 'Productivity', mechanism: 'Cognitive impairment, absenteeism', strength: 0.61, confidence: 0.76, lagMonths: 6, bidirectional: false, domains: ['health', 'economy'] },
  { id: 'CL-09', fromVariable: 'Antibiotic overuse', toVariable: 'Resistance emergence', mechanism: 'Selective pressure on bacterial populations', strength: 0.88, confidence: 0.93, lagMonths: 24, bidirectional: false, domains: ['health'] },
  { id: 'CL-10', fromVariable: 'Vaccination coverage', toVariable: 'Disease burden', mechanism: 'Herd immunity threshold reduction', strength: 0.92, confidence: 0.96, lagMonths: 12, bidirectional: false, domains: ['health'] },
];

export const SEED_CLAIMS: KnowledgeClaim[] = [
  { id: 'CLM-G1', statement: 'Cardiovascular disease is the leading global cause of death', domain: 'health', evidenceGrade: 'meta_analysis', confidence: 0.97, replicationCount: 500, biasRisk: 'low', sourceCount: 120 },
  { id: 'CLM-G2', statement: 'Anthropogenic CO₂ emissions are the primary driver of global warming', domain: 'climate', evidenceGrade: 'meta_analysis', confidence: 0.97, replicationCount: 1000, biasRisk: 'low', sourceCount: 300 },
  { id: 'CLM-G3', statement: 'Food insecurity affects ~735M people globally (2024)', domain: 'health', evidenceGrade: 'systematic_review', confidence: 0.91, replicationCount: 50, biasRisk: 'low', sourceCount: 30 },
  { id: 'CLM-G4', statement: 'Air pollution causes ~7M premature deaths annually', domain: 'environment', evidenceGrade: 'meta_analysis', confidence: 0.93, replicationCount: 200, biasRisk: 'low', sourceCount: 80 },
  { id: 'CLM-G5', statement: 'Each year of schooling increases income by 8–13%', domain: 'education', evidenceGrade: 'meta_analysis', confidence: 0.88, replicationCount: 300, biasRisk: 'medium', sourceCount: 100 },
];
