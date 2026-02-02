/**
 * GLOBAL EVENT GRAPH
 * Block Z: Everything that happens in the world → event nodes
 * 
 * EVENT = First-class object in the system
 */

// ============================================================================
// EVENT TYPE TAXONOMY (100+ types)
// ============================================================================

export type EventCategory = 
  | 'policy'
  | 'economic'
  | 'political'
  | 'conflict'
  | 'health'
  | 'disaster'
  | 'social'
  | 'legal'
  | 'technology'
  | 'environment'
  | 'market'
  | 'infrastructure';

export interface EventTypeDefinition {
  id: string;
  name: string;
  name_en: string;
  category: EventCategory;
  description: string;
  severity_range: [number, number]; // 1-10
  typical_duration: 'instant' | 'hours' | 'days' | 'weeks' | 'months' | 'years';
  related_kpis: string[];
  indicators: string[]; // What signals this event
}

export const EVENT_TYPES: EventTypeDefinition[] = [
  // POLICY EVENTS
  { id: 'policy.law_passed', name: 'Lag antagen', name_en: 'Law Passed', category: 'policy', description: 'New legislation enacted', severity_range: [3, 8], typical_duration: 'instant', related_kpis: [], indicators: ['parliament_vote', 'royal_assent'] },
  { id: 'policy.law_proposed', name: 'Lagförslag', name_en: 'Law Proposed', category: 'policy', description: 'New legislation proposed', severity_range: [2, 5], typical_duration: 'instant', related_kpis: [], indicators: ['bill_introduced'] },
  { id: 'policy.regulation_issued', name: 'Förordning utfärdad', name_en: 'Regulation Issued', category: 'policy', description: 'New regulation by agency', severity_range: [2, 6], typical_duration: 'instant', related_kpis: [], indicators: ['agency_announcement'] },
  { id: 'policy.budget_passed', name: 'Budget antagen', name_en: 'Budget Passed', category: 'policy', description: 'Government budget approved', severity_range: [5, 9], typical_duration: 'instant', related_kpis: ['government_expenditure_gdp', 'budget_balance_gdp'], indicators: ['parliament_vote'] },
  { id: 'policy.treaty_signed', name: 'Fördrag undertecknat', name_en: 'Treaty Signed', category: 'policy', description: 'International agreement signed', severity_range: [4, 9], typical_duration: 'instant', related_kpis: [], indicators: ['diplomatic_event'] },
  { id: 'policy.sanctions_imposed', name: 'Sanktioner införda', name_en: 'Sanctions Imposed', category: 'policy', description: 'Economic sanctions applied', severity_range: [5, 9], typical_duration: 'instant', related_kpis: ['trade_balance_gdp'], indicators: ['government_announcement'] },
  { id: 'policy.sanctions_lifted', name: 'Sanktioner hävda', name_en: 'Sanctions Lifted', category: 'policy', description: 'Economic sanctions removed', severity_range: [4, 8], typical_duration: 'instant', related_kpis: ['trade_balance_gdp'], indicators: ['government_announcement'] },
  { id: 'policy.emergency_declared', name: 'Undantagstillstånd', name_en: 'State of Emergency Declared', category: 'policy', description: 'Emergency powers activated', severity_range: [7, 10], typical_duration: 'weeks', related_kpis: [], indicators: ['government_announcement'] },
  { id: 'policy.reform_announced', name: 'Reform tillkännagiven', name_en: 'Reform Announced', category: 'policy', description: 'Major policy reform announced', severity_range: [4, 8], typical_duration: 'instant', related_kpis: [], indicators: ['government_announcement'] },
  
  // ECONOMIC EVENTS
  { id: 'economic.rate_decision', name: 'Räntebeslut', name_en: 'Interest Rate Decision', category: 'economic', description: 'Central bank rate change', severity_range: [5, 9], typical_duration: 'instant', related_kpis: ['policy_rate', 'cpi_inflation'], indicators: ['central_bank_announcement'] },
  { id: 'economic.gdp_release', name: 'BNP-publicering', name_en: 'GDP Release', category: 'economic', description: 'Quarterly GDP data released', severity_range: [4, 7], typical_duration: 'instant', related_kpis: ['gdp_growth_real', 'gdp_per_capita'], indicators: ['statistics_release'] },
  { id: 'economic.employment_release', name: 'Arbetsmarknadsdata', name_en: 'Employment Data Release', category: 'economic', description: 'Monthly employment data', severity_range: [4, 7], typical_duration: 'instant', related_kpis: ['unemployment_rate', 'employment_rate'], indicators: ['statistics_release'] },
  { id: 'economic.inflation_release', name: 'Inflationsdata', name_en: 'Inflation Data Release', category: 'economic', description: 'Consumer price data', severity_range: [4, 7], typical_duration: 'instant', related_kpis: ['cpi_inflation', 'core_inflation'], indicators: ['statistics_release'] },
  { id: 'economic.recession_declared', name: 'Recession utropad', name_en: 'Recession Declared', category: 'economic', description: 'Official recession designation', severity_range: [8, 10], typical_duration: 'months', related_kpis: ['gdp_growth_real', 'unemployment_rate'], indicators: ['nber_announcement', 'two_quarter_decline'] },
  { id: 'economic.stimulus_announced', name: 'Stimulanspaket', name_en: 'Stimulus Package Announced', category: 'economic', description: 'Economic stimulus measures', severity_range: [5, 9], typical_duration: 'instant', related_kpis: ['government_debt_gdp'], indicators: ['government_announcement'] },
  { id: 'economic.austerity_announced', name: 'Åtstramning', name_en: 'Austerity Measures Announced', category: 'economic', description: 'Spending cuts announced', severity_range: [5, 8], typical_duration: 'instant', related_kpis: ['government_expenditure_gdp'], indicators: ['government_announcement'] },
  { id: 'economic.trade_deal', name: 'Handelsavtal', name_en: 'Trade Deal Signed', category: 'economic', description: 'Trade agreement concluded', severity_range: [4, 8], typical_duration: 'instant', related_kpis: ['trade_openness', 'exports_gdp'], indicators: ['diplomatic_event'] },
  { id: 'economic.default', name: 'Betalningsinställelse', name_en: 'Sovereign Default', category: 'economic', description: 'Country defaults on debt', severity_range: [9, 10], typical_duration: 'months', related_kpis: ['government_debt_gdp'], indicators: ['bond_market', 'rating_agency'] },
  { id: 'economic.bailout', name: 'Räddningspaket', name_en: 'Bailout', category: 'economic', description: 'Financial rescue package', severity_range: [7, 10], typical_duration: 'instant', related_kpis: ['government_debt_gdp'], indicators: ['government_announcement', 'imf_announcement'] },
  
  // POLITICAL EVENTS
  { id: 'political.election_held', name: 'Val hållet', name_en: 'Election Held', category: 'political', description: 'National or regional election', severity_range: [5, 9], typical_duration: 'instant', related_kpis: ['voter_turnout'], indicators: ['election_calendar'] },
  { id: 'political.election_result', name: 'Valresultat', name_en: 'Election Result', category: 'political', description: 'Election outcome announced', severity_range: [5, 9], typical_duration: 'instant', related_kpis: ['voter_turnout'], indicators: ['election_commission'] },
  { id: 'political.government_formed', name: 'Regering bildad', name_en: 'Government Formed', category: 'political', description: 'New government takes office', severity_range: [5, 8], typical_duration: 'instant', related_kpis: [], indicators: ['official_announcement'] },
  { id: 'political.government_collapsed', name: 'Regeringskris', name_en: 'Government Collapsed', category: 'political', description: 'Government loses confidence', severity_range: [6, 9], typical_duration: 'instant', related_kpis: ['trust_government'], indicators: ['parliament_vote', 'resignation'] },
  { id: 'political.leader_change', name: 'Ledarskifte', name_en: 'Leader Change', category: 'political', description: 'Head of state/government changes', severity_range: [5, 9], typical_duration: 'instant', related_kpis: [], indicators: ['election', 'resignation', 'death'] },
  { id: 'political.resignation', name: 'Avgång', name_en: 'Resignation', category: 'political', description: 'Senior official resigns', severity_range: [3, 8], typical_duration: 'instant', related_kpis: [], indicators: ['official_announcement'] },
  { id: 'political.protest', name: 'Protest', name_en: 'Mass Protest', category: 'political', description: 'Large-scale public protest', severity_range: [3, 8], typical_duration: 'hours', related_kpis: ['trust_government'], indicators: ['news_reports', 'social_media'] },
  { id: 'political.coup', name: 'Statskupp', name_en: 'Coup', category: 'political', description: 'Illegal seizure of power', severity_range: [9, 10], typical_duration: 'instant', related_kpis: [], indicators: ['military_action', 'news_reports'] },
  { id: 'political.referendum', name: 'Folkomröstning', name_en: 'Referendum', category: 'political', description: 'Public vote on issue', severity_range: [5, 9], typical_duration: 'instant', related_kpis: ['voter_turnout'], indicators: ['election_calendar'] },
  { id: 'political.impeachment', name: 'Riksrätt', name_en: 'Impeachment', category: 'political', description: 'Impeachment proceedings', severity_range: [7, 10], typical_duration: 'weeks', related_kpis: [], indicators: ['parliament_action'] },
  
  // CONFLICT EVENTS
  { id: 'conflict.war_declared', name: 'Krigsförklaring', name_en: 'War Declared', category: 'conflict', description: 'Formal war declaration', severity_range: [10, 10], typical_duration: 'instant', related_kpis: ['defense_spending_gdp'], indicators: ['government_announcement'] },
  { id: 'conflict.military_action', name: 'Militär insats', name_en: 'Military Action', category: 'conflict', description: 'Armed military operation', severity_range: [7, 10], typical_duration: 'hours', related_kpis: [], indicators: ['military_reports', 'news'] },
  { id: 'conflict.ceasefire', name: 'Eldupphör', name_en: 'Ceasefire', category: 'conflict', description: 'Cessation of hostilities', severity_range: [5, 8], typical_duration: 'instant', related_kpis: [], indicators: ['diplomatic_announcement'] },
  { id: 'conflict.peace_agreement', name: 'Fredsavtal', name_en: 'Peace Agreement', category: 'conflict', description: 'Formal peace treaty', severity_range: [6, 9], typical_duration: 'instant', related_kpis: [], indicators: ['diplomatic_event'] },
  { id: 'conflict.terrorist_attack', name: 'Terrorattack', name_en: 'Terrorist Attack', category: 'conflict', description: 'Terrorist incident', severity_range: [7, 10], typical_duration: 'instant', related_kpis: ['perceived_safety'], indicators: ['news_reports', 'official_statement'] },
  { id: 'conflict.mass_shooting', name: 'Masskjutning', name_en: 'Mass Shooting', category: 'conflict', description: 'Mass casualty shooting', severity_range: [7, 10], typical_duration: 'instant', related_kpis: ['homicide_rate'], indicators: ['news_reports'] },
  { id: 'conflict.civil_unrest', name: 'Civil orolighet', name_en: 'Civil Unrest', category: 'conflict', description: 'Widespread civil disorder', severity_range: [5, 9], typical_duration: 'days', related_kpis: ['trust_government'], indicators: ['news_reports'] },
  
  // HEALTH EVENTS
  { id: 'health.outbreak_declared', name: 'Utbrott deklarerat', name_en: 'Outbreak Declared', category: 'health', description: 'Disease outbreak announced', severity_range: [5, 10], typical_duration: 'weeks', related_kpis: ['excess_mortality'], indicators: ['who_announcement', 'health_authority'] },
  { id: 'health.pandemic_declared', name: 'Pandemi deklarerad', name_en: 'Pandemic Declared', category: 'health', description: 'Global pandemic status', severity_range: [9, 10], typical_duration: 'months', related_kpis: ['excess_mortality', 'gdp_growth_real'], indicators: ['who_announcement'] },
  { id: 'health.epidemic_end', name: 'Epidemi avslutad', name_en: 'Epidemic Ended', category: 'health', description: 'Outbreak declared over', severity_range: [3, 6], typical_duration: 'instant', related_kpis: [], indicators: ['health_authority'] },
  { id: 'health.vaccine_approved', name: 'Vaccin godkänt', name_en: 'Vaccine Approved', category: 'health', description: 'Vaccine receives approval', severity_range: [5, 8], typical_duration: 'instant', related_kpis: ['vaccination_measles'], indicators: ['regulatory_authority'] },
  { id: 'health.drug_approved', name: 'Läkemedel godkänt', name_en: 'Drug Approved', category: 'health', description: 'New drug receives approval', severity_range: [3, 7], typical_duration: 'instant', related_kpis: [], indicators: ['regulatory_authority'] },
  { id: 'health.hospital_crisis', name: 'Sjukhuskris', name_en: 'Hospital Crisis', category: 'health', description: 'Healthcare system overwhelmed', severity_range: [7, 9], typical_duration: 'weeks', related_kpis: ['hospital_beds_per_capita'], indicators: ['news_reports', 'health_authority'] },
  { id: 'health.mass_vaccination', name: 'Massvaccination', name_en: 'Mass Vaccination Campaign', category: 'health', description: 'Large-scale vaccination', severity_range: [4, 7], typical_duration: 'weeks', related_kpis: ['vaccination_measles'], indicators: ['health_authority'] },
  
  // DISASTER EVENTS
  { id: 'disaster.earthquake', name: 'Jordbävning', name_en: 'Earthquake', category: 'disaster', description: 'Significant earthquake', severity_range: [5, 10], typical_duration: 'instant', related_kpis: [], indicators: ['seismic_monitoring'] },
  { id: 'disaster.tsunami', name: 'Tsunami', name_en: 'Tsunami', category: 'disaster', description: 'Tsunami event', severity_range: [8, 10], typical_duration: 'hours', related_kpis: [], indicators: ['warning_system'] },
  { id: 'disaster.hurricane', name: 'Orkan', name_en: 'Hurricane/Typhoon', category: 'disaster', description: 'Major tropical cyclone', severity_range: [6, 10], typical_duration: 'days', related_kpis: [], indicators: ['weather_service'] },
  { id: 'disaster.flood', name: 'Översvämning', name_en: 'Major Flood', category: 'disaster', description: 'Severe flooding', severity_range: [5, 9], typical_duration: 'days', related_kpis: [], indicators: ['weather_service', 'news'] },
  { id: 'disaster.wildfire', name: 'Skogsbrand', name_en: 'Wildfire', category: 'disaster', description: 'Large-scale wildfire', severity_range: [5, 9], typical_duration: 'days', related_kpis: [], indicators: ['fire_service', 'satellite'] },
  { id: 'disaster.drought', name: 'Torka', name_en: 'Drought', category: 'disaster', description: 'Severe drought conditions', severity_range: [5, 9], typical_duration: 'months', related_kpis: ['water_stress'], indicators: ['weather_monitoring'] },
  { id: 'disaster.volcano', name: 'Vulkanutbrott', name_en: 'Volcanic Eruption', category: 'disaster', description: 'Volcanic eruption', severity_range: [6, 10], typical_duration: 'days', related_kpis: [], indicators: ['geological_monitoring'] },
  { id: 'disaster.industrial', name: 'Industriolycka', name_en: 'Industrial Accident', category: 'disaster', description: 'Major industrial accident', severity_range: [5, 9], typical_duration: 'instant', related_kpis: [], indicators: ['news_reports'] },
  { id: 'disaster.nuclear', name: 'Kärnkraftsolycka', name_en: 'Nuclear Incident', category: 'disaster', description: 'Nuclear facility incident', severity_range: [8, 10], typical_duration: 'days', related_kpis: [], indicators: ['iaea_alert'] },
  { id: 'disaster.famine', name: 'Svält', name_en: 'Famine', category: 'disaster', description: 'Mass food shortage', severity_range: [9, 10], typical_duration: 'months', related_kpis: [], indicators: ['un_declaration'] },
  
  // MARKET EVENTS
  { id: 'market.crash', name: 'Börskrasch', name_en: 'Market Crash', category: 'market', description: 'Severe market decline', severity_range: [7, 10], typical_duration: 'days', related_kpis: ['stock_market_cap_gdp'], indicators: ['market_data'] },
  { id: 'market.rally', name: 'Börsrally', name_en: 'Market Rally', category: 'market', description: 'Significant market rise', severity_range: [3, 6], typical_duration: 'days', related_kpis: ['stock_market_cap_gdp'], indicators: ['market_data'] },
  { id: 'market.currency_crisis', name: 'Valutakris', name_en: 'Currency Crisis', category: 'market', description: 'Currency devaluation', severity_range: [7, 10], typical_duration: 'days', related_kpis: ['exchange_rate_index'], indicators: ['forex_data'] },
  { id: 'market.bank_failure', name: 'Bankfallissemang', name_en: 'Bank Failure', category: 'market', description: 'Major bank fails', severity_range: [7, 10], typical_duration: 'instant', related_kpis: ['credit_to_private_sector'], indicators: ['regulatory_action'] },
  { id: 'market.ipo', name: 'Börsintroduktion', name_en: 'Major IPO', category: 'market', description: 'Significant IPO', severity_range: [2, 5], typical_duration: 'instant', related_kpis: [], indicators: ['market_news'] },
  { id: 'market.merger', name: 'Företagsfusion', name_en: 'Major Merger', category: 'market', description: 'Large corporate merger', severity_range: [3, 6], typical_duration: 'instant', related_kpis: [], indicators: ['corporate_announcement'] },
  { id: 'market.commodity_shock', name: 'Råvaruchock', name_en: 'Commodity Price Shock', category: 'market', description: 'Major commodity price change', severity_range: [5, 8], typical_duration: 'days', related_kpis: ['terms_of_trade'], indicators: ['commodity_markets'] },
  
  // LEGAL EVENTS
  { id: 'legal.court_ruling', name: 'Domstolsbeslut', name_en: 'Major Court Ruling', category: 'legal', description: 'Significant court decision', severity_range: [4, 9], typical_duration: 'instant', related_kpis: [], indicators: ['court_announcement'] },
  { id: 'legal.indictment', name: 'Åtal', name_en: 'Major Indictment', category: 'legal', description: 'High-profile charges filed', severity_range: [4, 8], typical_duration: 'instant', related_kpis: [], indicators: ['prosecutor_announcement'] },
  { id: 'legal.conviction', name: 'Fällande dom', name_en: 'Major Conviction', category: 'legal', description: 'High-profile conviction', severity_range: [4, 8], typical_duration: 'instant', related_kpis: [], indicators: ['court_verdict'] },
  { id: 'legal.pardon', name: 'Benådning', name_en: 'Pardon', category: 'legal', description: 'Official pardon granted', severity_range: [3, 7], typical_duration: 'instant', related_kpis: [], indicators: ['official_announcement'] },
  
  // TECHNOLOGY EVENTS
  { id: 'tech.breakthrough', name: 'Genombrott', name_en: 'Technology Breakthrough', category: 'technology', description: 'Major tech advancement', severity_range: [3, 8], typical_duration: 'instant', related_kpis: ['r_and_d_spending_gdp'], indicators: ['research_publication', 'news'] },
  { id: 'tech.cyberattack', name: 'Cyberattack', name_en: 'Major Cyberattack', category: 'technology', description: 'Significant cyber incident', severity_range: [5, 9], typical_duration: 'hours', related_kpis: [], indicators: ['security_reports'] },
  { id: 'tech.data_breach', name: 'Dataläcka', name_en: 'Major Data Breach', category: 'technology', description: 'Large-scale data breach', severity_range: [5, 8], typical_duration: 'instant', related_kpis: [], indicators: ['company_disclosure', 'news'] },
  { id: 'tech.outage', name: 'Systemnedgång', name_en: 'Major System Outage', category: 'technology', description: 'Critical infrastructure failure', severity_range: [5, 9], typical_duration: 'hours', related_kpis: [], indicators: ['monitoring_systems'] },
  
  // INFRASTRUCTURE EVENTS
  { id: 'infra.power_outage', name: 'Strömavbrott', name_en: 'Power Grid Failure', category: 'infrastructure', description: 'Large-scale power outage', severity_range: [6, 9], typical_duration: 'hours', related_kpis: ['electricity_access'], indicators: ['grid_monitoring'] },
  { id: 'infra.transport_disruption', name: 'Transportstörning', name_en: 'Major Transport Disruption', category: 'infrastructure', description: 'Transport system failure', severity_range: [4, 8], typical_duration: 'hours', related_kpis: [], indicators: ['transport_authorities'] },
  { id: 'infra.bridge_collapse', name: 'Broskollaps', name_en: 'Infrastructure Collapse', category: 'infrastructure', description: 'Major infrastructure failure', severity_range: [7, 10], typical_duration: 'instant', related_kpis: [], indicators: ['news_reports'] },
  
  // ENVIRONMENT EVENTS
  { id: 'env.climate_report', name: 'Klimatrapport', name_en: 'Major Climate Report', category: 'environment', description: 'Significant climate findings', severity_range: [4, 8], typical_duration: 'instant', related_kpis: ['ghg_emissions_gdp'], indicators: ['ipcc_report', 'research'] },
  { id: 'env.pollution_incident', name: 'Föroreningsolycka', name_en: 'Major Pollution Incident', category: 'environment', description: 'Severe pollution event', severity_range: [5, 9], typical_duration: 'days', related_kpis: ['air_pollution_exposure'], indicators: ['monitoring_data', 'news'] },
  { id: 'env.species_extinction', name: 'Artutrotning', name_en: 'Species Extinction', category: 'environment', description: 'Species declared extinct', severity_range: [4, 7], typical_duration: 'instant', related_kpis: [], indicators: ['scientific_declaration'] },
];

// ============================================================================
// EVENT STRUCTURE
// ============================================================================

export interface GlobalEvent {
  id: string;
  event_type_id: string;
  
  // Temporal
  occurred_at: string;
  detected_at: string;
  duration_estimate?: string;
  ongoing: boolean;
  
  // Spatial
  geo_codes: string[];
  primary_location?: {
    country: string;
    region?: string;
    city?: string;
    coordinates?: [number, number];
  };
  
  // Content
  title: string;
  description: string;
  summary?: string;
  
  // Severity & Impact
  severity: number; // 1-10
  estimated_impact: {
    affected_population?: number;
    economic_impact_usd?: number;
    casualties?: number;
  };
  
  // Connections
  related_kpis: string[];
  related_index_ids: string[];
  related_event_ids: string[];
  
  // News intensity
  news_volume: {
    last_24h: number;
    last_7d: number;
    sources: number;
  };
  
  // Sources
  source_ids: string[];
  primary_sources: {
    url: string;
    title: string;
    source_name: string;
  }[];
  
  // Confidence
  confidence: number; // 0-1
  verification_status: 'unverified' | 'partially_verified' | 'verified';
  
  // Meta
  created_at: string;
  updated_at: string;
  version: number;
}

// ============================================================================
// EVENT → KPI LINKAGE
// ============================================================================

export interface EventKPILink {
  event_id: string;
  kpi_code: string;
  
  linkage_type: 'direct_cause' | 'direct_effect' | 'correlation' | 'leading_indicator' | 'lagging_indicator';
  
  expected_direction: 'increase' | 'decrease' | 'volatile' | 'unknown';
  expected_magnitude: 'minor' | 'moderate' | 'major' | 'extreme';
  expected_lag_days: number;
  
  confidence: number;
  evidence: string;
}

// ============================================================================
// EVENT DETECTION
// ============================================================================

export interface EventDetectionConfig {
  min_confidence: number;
  min_source_count: number;
  max_age_hours: number;
  severity_threshold: number;
}

export const DEFAULT_DETECTION_CONFIG: EventDetectionConfig = {
  min_confidence: 0.6,
  min_source_count: 2,
  max_age_hours: 72,
  severity_threshold: 3,
};

export interface EventDetectionResult {
  events: GlobalEvent[];
  stats: {
    total_detected: number;
    by_category: Record<EventCategory, number>;
    by_severity: Record<string, number>;
    avg_confidence: number;
  };
  detection_time_ms: number;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getEventTypeById(id: string): EventTypeDefinition | undefined {
  return EVENT_TYPES.find(e => e.id === id);
}

export function getEventTypesByCategory(category: EventCategory): EventTypeDefinition[] {
  return EVENT_TYPES.filter(e => e.category === category);
}

export function getHighSeverityEventTypes(): EventTypeDefinition[] {
  return EVENT_TYPES.filter(e => e.severity_range[1] >= 8);
}

export function getEventStats(): {
  total: number;
  byCategory: Record<EventCategory, number>;
  highSeverity: number;
} {
  const byCategory: Partial<Record<EventCategory, number>> = {};
  
  for (const event of EVENT_TYPES) {
    byCategory[event.category] = (byCategory[event.category] || 0) + 1;
  }
  
  return {
    total: EVENT_TYPES.length,
    byCategory: byCategory as Record<EventCategory, number>,
    highSeverity: getHighSeverityEventTypes().length,
  };
}

// ============================================================================
// EVENT GRAPH QUERIES
// ============================================================================

export interface EventGraphQuery {
  event_types?: string[];
  categories?: EventCategory[];
  geo_codes?: string[];
  date_from?: string;
  date_to?: string;
  min_severity?: number;
  min_confidence?: number;
  related_kpis?: string[];
  ongoing_only?: boolean;
  limit?: number;
  offset?: number;
}

export interface EventGraphResult {
  events: GlobalEvent[];
  total: number;
  query_time_ms: number;
}

console.log('[Event Graph] Loaded:', getEventStats());
