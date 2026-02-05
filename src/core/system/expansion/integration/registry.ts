 /**
  * INTEGRATION REGISTRY
  * 
  * Data In (API-bank) & System Out (Integrations)
  */
 
 /**
  * 3.1 DATA IN - Integration Sources
  */
 export interface IntegrationSource {
   readonly source_id: string;
   readonly source_name: string;
   readonly source_type: 'api' | 'dataset' | 'feed' | 'manual';
   readonly update_frequency: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
   readonly coverage: {
     readonly geographic: readonly string[];
     readonly temporal: { start: string; end: string | 'ongoing' };
     readonly domains: readonly string[];
   };
   readonly known_biases: readonly string[];
   readonly limitations: readonly string[];
   readonly reliability_score: number; // 0-100
   readonly last_validated: string;
   readonly documentation_url: string;
 }
 
 /**
  * 3.2 SYSTEM OUT - Integration Targets
  */
 export interface IntegrationTarget {
   readonly target_id: string;
   readonly target_name: string;
   readonly target_type: 'bi_analytics' | 'ai_platform' | 'enterprise_system';
   readonly access_level: 'read_only';
   readonly allowed_data: readonly string[];
   readonly forbidden_data: readonly string[];
   readonly requires_query_compiler: boolean;
   readonly direct_answer_access: false; // Always false
 }
 
 /**
  * INITIAL INTEGRATION SOURCES
  */
 export const INTEGRATION_SOURCES: readonly IntegrationSource[] = [
   {
     source_id: 'SRC-EUROSTAT',
     source_name: 'Eurostat',
     source_type: 'api',
     update_frequency: 'monthly',
     coverage: {
       geographic: ['EU27', 'EEA'],
       temporal: { start: '1990-01-01', end: 'ongoing' },
       domains: ['economy', 'population', 'health', 'environment'],
     },
     known_biases: ['EU-centric methodology', 'Harmonization delays'],
     limitations: ['2-3 month reporting lag', 'Member state variation'],
     reliability_score: 92,
     last_validated: '2024-01-15',
     documentation_url: 'https://ec.europa.eu/eurostat/web/main/data/database',
   },
   {
     source_id: 'SRC-WORLDBANK',
     source_name: 'World Bank Open Data',
     source_type: 'api',
     update_frequency: 'annual',
     coverage: {
       geographic: ['GLOBAL'],
       temporal: { start: '1960-01-01', end: 'ongoing' },
       domains: ['economy', 'development', 'poverty', 'health'],
     },
     known_biases: ['Development-focused framing', 'Income classification system'],
     limitations: ['Annual data only', 'Country self-reporting'],
     reliability_score: 88,
     last_validated: '2024-01-10',
     documentation_url: 'https://data.worldbank.org/',
   },
   {
     source_id: 'SRC-OECD',
     source_name: 'OECD Statistics',
     source_type: 'api',
     update_frequency: 'quarterly',
     coverage: {
       geographic: ['OECD38'],
       temporal: { start: '1970-01-01', end: 'ongoing' },
       domains: ['economy', 'education', 'health', 'governance'],
     },
     known_biases: ['OECD member focus', 'High-income country methodology'],
     limitations: ['Limited non-OECD coverage', 'Methodology changes over time'],
     reliability_score: 90,
     last_validated: '2024-01-12',
     documentation_url: 'https://stats.oecd.org/',
   },
   {
     source_id: 'SRC-UN',
     source_name: 'UN Data',
     source_type: 'api',
     update_frequency: 'annual',
     coverage: {
       geographic: ['GLOBAL'],
       temporal: { start: '1945-01-01', end: 'ongoing' },
       domains: ['development', 'population', 'health', 'environment'],
     },
     known_biases: ['SDG framing', 'Country self-reporting'],
     limitations: ['Variable data quality by country', 'Political considerations'],
     reliability_score: 85,
     last_validated: '2024-01-08',
     documentation_url: 'https://data.un.org/',
   },
 ] as const;
 
 /**
  * INTEGRATION TARGETS
  */
 export const INTEGRATION_TARGETS: readonly IntegrationTarget[] = [
   {
     target_id: 'TGT-BI',
     target_name: 'BI / Analytics Platforms',
     target_type: 'bi_analytics',
     access_level: 'read_only',
     allowed_data: ['read_models', 'aggregations', 'structural_fields'],
     forbidden_data: ['recommendations', 'rankings', 'conclusions'],
     requires_query_compiler: false,
     direct_answer_access: false,
   },
   {
     target_id: 'TGT-AI',
     target_name: 'AI Platforms',
     target_type: 'ai_platform',
     access_level: 'read_only',
     allowed_data: ['structured_queries', 'decision_objects', 'uncertainty_data'],
     forbidden_data: ['direct_answers', 'recommendations', 'summaries'],
     requires_query_compiler: true,
     direct_answer_access: false,
   },
   {
     target_id: 'TGT-ENTERPRISE',
     target_name: 'Enterprise Systems',
     target_type: 'enterprise_system',
     access_level: 'read_only',
     allowed_data: ['board_reports', 'document_references', 'audit_trails'],
     forbidden_data: ['recommendations', 'rankings', 'simplified_summaries'],
     requires_query_compiler: false,
     direct_answer_access: false,
   },
 ] as const;
 
 /**
  * Integration Registry Class
  */
 export interface IntegrationRegistry {
   readonly sources: Map<string, IntegrationSource>;
   readonly targets: Map<string, IntegrationTarget>;
 }
 
 export function createIntegrationRegistry(): IntegrationRegistry {
   const sources = new Map<string, IntegrationSource>();
   const targets = new Map<string, IntegrationTarget>();
   
   for (const source of INTEGRATION_SOURCES) {
     sources.set(source.source_id, source);
   }
   
   for (const target of INTEGRATION_TARGETS) {
     targets.set(target.target_id, target);
   }
   
   return { sources, targets };
 }