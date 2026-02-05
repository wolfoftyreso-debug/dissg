 /**
  * DOMAIN REGISTRY
  * 
  * All domains have IDENTICAL structure.
  * This is why AI agents can generalize.
  */
 
 export interface DomainConfig {
   readonly code: string;
   readonly name: string;
   readonly description: string;
   readonly subdirectories: readonly string[];
   readonly api_tier_requirement: 1 | 2 | 3;
   readonly safety_level: 'standard' | 'elevated' | 'critical';
   readonly special_restrictions: readonly string[];
 }
 
 /**
  * DOMAIN REGISTRY (LOCKED STRUCTURE)
  */
 export const DOMAIN_REGISTRY: Record<string, DomainConfig> = {
   youth: {
     code: 'youth',
     name: 'Youth & Adolescence',
     description: 'Statistics on young people (12-25)',
     subdirectories: ['ontology', 'measures', 'sources', 'answer_packets', 'safety_rules'],
     api_tier_requirement: 1,
     safety_level: 'critical',
     special_restrictions: ['crisis_detection_required', 'no_individual_advice'],
   },
   mental_health: {
     code: 'mental_health',
     name: 'Mental Health',
     description: 'Population-level mental health statistics',
     subdirectories: ['ontology', 'measures', 'sources', 'answer_packets', 'safety_rules'],
     api_tier_requirement: 1,
     safety_level: 'critical',
     special_restrictions: ['no_diagnosis', 'crisis_detection_required', 'care_pathway_always'],
   },
   substance_use: {
     code: 'substance_use',
     name: 'Substance Use & Addiction',
     description: 'Epidemiological data on substance use',
     subdirectories: ['ontology', 'measures', 'sources', 'answer_packets', 'safety_rules'],
     api_tier_requirement: 1,
     safety_level: 'critical',
     special_restrictions: ['no_dosage', 'no_instructions', 'no_sources', 'care_pathway_always'],
   },
   healthcare: {
     code: 'healthcare',
     name: 'Healthcare Systems',
     description: 'Healthcare infrastructure and access statistics',
     subdirectories: ['ontology', 'measures', 'sources', 'answer_packets', 'safety_rules'],
     api_tier_requirement: 1,
     safety_level: 'elevated',
     special_restrictions: ['no_individual_treatment', 'no_diagnosis'],
   },
   medicine: {
     code: 'medicine',
     name: 'Medical Statistics',
     description: 'Population-level medical data and guidelines',
     subdirectories: ['ontology', 'measures', 'sources', 'answer_packets', 'safety_rules'],
     api_tier_requirement: 1,
     safety_level: 'critical',
     special_restrictions: ['no_dosing', 'no_prescription', 'no_diagnosis', 'guideline_only'],
   },
   economy: {
     code: 'economy',
     name: 'Economy & Macroeconomics',
     description: 'Economic indicators and statistics',
     subdirectories: ['ontology', 'measures', 'sources', 'answer_packets', 'safety_rules'],
     api_tier_requirement: 2,
     safety_level: 'standard',
     special_restrictions: [],
   },
   markets: {
     code: 'markets',
     name: 'Financial Markets',
     description: 'Stock, bond, and commodity market data',
     subdirectories: ['ontology', 'measures', 'sources', 'answer_packets', 'safety_rules'],
     api_tier_requirement: 2,
     safety_level: 'elevated',
     special_restrictions: ['no_buy_sell', 'no_prediction', 'scenario_only'],
   },
   society: {
     code: 'society',
     name: 'Society & Demographics',
     description: 'Social indicators and demographic data',
     subdirectories: ['ontology', 'measures', 'sources', 'answer_packets', 'safety_rules'],
     api_tier_requirement: 2,
     safety_level: 'standard',
     special_restrictions: [],
   },
   environment: {
     code: 'environment',
     name: 'Environment & Climate',
     description: 'Environmental and climate statistics',
     subdirectories: ['ontology', 'measures', 'sources', 'answer_packets', 'safety_rules'],
     api_tier_requirement: 2,
     safety_level: 'standard',
     special_restrictions: ['model_disclosure_required'],
   },
 } as const;
 
 export type DomainCode = keyof typeof DOMAIN_REGISTRY;
 
 /**
  * GET DOMAIN CONFIG
  */
 export function getDomainConfig(code: string): DomainConfig | null {
   return DOMAIN_REGISTRY[code] || null;
 }
 
 /**
  * VALIDATE DOMAIN EXISTS
  */
 export function validateDomainExists(code: string): code is DomainCode {
   return code in DOMAIN_REGISTRY;
 }