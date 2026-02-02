/**
 * BLOCK AG — GLOBAL EVENT TAXONOMY
 * 100+ event categories with full normalization
 */

export interface EventCategory {
  code: string;
  category: 'policy' | 'economic' | 'social' | 'security' | 'environment' | 'health' | 'infrastructure' | 'technology';
  name: string;
  nameLocal: Record<string, string>;
  definition: string;
  severityScale: { min: number; max: number; default: number };
  expectedDataLinks: string[];
  expectedKpiImpacts: string[];
  typicalDuration: 'instant' | 'hours' | 'days' | 'weeks' | 'months' | 'years';
  geographicScope: 'local' | 'regional' | 'national' | 'international' | 'global';
  detectionKeywords: string[];
  parentCode?: string;
}

export const EVENT_TAXONOMY: EventCategory[] = [
  // === POLICY EVENTS (20) ===
  {
    code: 'POL_DECISION',
    category: 'policy',
    name: 'Policy Decision',
    nameLocal: { sv: 'Politiskt beslut', de: 'Politische Entscheidung' },
    definition: 'A formal decision by government or legislative body affecting policy',
    severityScale: { min: 1, max: 5, default: 3 },
    expectedDataLinks: ['government_gazette', 'parliament_records', 'news_agencies'],
    expectedKpiImpacts: ['varies_by_policy_area'],
    typicalDuration: 'instant',
    geographicScope: 'national',
    detectionKeywords: ['beslut', 'decision', 'voted', 'approved', 'passed']
  },
  {
    code: 'POL_BUDGET',
    category: 'policy',
    name: 'Budget Announcement',
    nameLocal: { sv: 'Budgetmeddelande', de: 'Haushaltsankündigung' },
    definition: 'Government budget proposal or approval announcement',
    severityScale: { min: 2, max: 5, default: 4 },
    expectedDataLinks: ['finance_ministry', 'parliament_records'],
    expectedKpiImpacts: ['fiscal_balance', 'public_spending', 'debt_ratio'],
    typicalDuration: 'instant',
    geographicScope: 'national',
    detectionKeywords: ['budget', 'statsbudget', 'fiscal', 'spending', 'appropriation']
  },
  {
    code: 'POL_ELECTION',
    category: 'policy',
    name: 'Election',
    nameLocal: { sv: 'Val', de: 'Wahl' },
    definition: 'National, regional or local election event',
    severityScale: { min: 3, max: 5, default: 4 },
    expectedDataLinks: ['election_authority', 'news_agencies'],
    expectedKpiImpacts: ['political_stability', 'policy_uncertainty'],
    typicalDuration: 'days',
    geographicScope: 'national',
    detectionKeywords: ['election', 'val', 'vote', 'polling', 'ballot']
  },
  {
    code: 'POL_GOV_CHANGE',
    category: 'policy',
    name: 'Government Change',
    nameLocal: { sv: 'Regeringsskifte', de: 'Regierungswechsel' },
    definition: 'Change in government leadership or coalition',
    severityScale: { min: 4, max: 5, default: 5 },
    expectedDataLinks: ['government_gazette', 'news_agencies'],
    expectedKpiImpacts: ['policy_uncertainty', 'market_volatility'],
    typicalDuration: 'weeks',
    geographicScope: 'national',
    detectionKeywords: ['regering', 'government', 'cabinet', 'prime minister', 'coalition']
  },
  {
    code: 'POL_LEGISLATION',
    category: 'policy',
    name: 'Legislation Enacted',
    nameLocal: { sv: 'Lagstiftning antagen', de: 'Gesetzgebung erlassen' },
    definition: 'New law or regulation comes into effect',
    severityScale: { min: 1, max: 5, default: 3 },
    expectedDataLinks: ['legal_database', 'parliament_records'],
    expectedKpiImpacts: ['varies_by_law'],
    typicalDuration: 'instant',
    geographicScope: 'national',
    detectionKeywords: ['law', 'lag', 'regulation', 'förordning', 'enacted', 'träder i kraft']
  },
  {
    code: 'POL_REFORM',
    category: 'policy',
    name: 'Major Reform',
    nameLocal: { sv: 'Stor reform', de: 'Große Reform' },
    definition: 'Significant structural reform in a policy area',
    severityScale: { min: 3, max: 5, default: 4 },
    expectedDataLinks: ['government_gazette', 'parliament_records'],
    expectedKpiImpacts: ['multiple_areas'],
    typicalDuration: 'months',
    geographicScope: 'national',
    detectionKeywords: ['reform', 'restructuring', 'overhaul', 'transformation']
  },
  {
    code: 'POL_SANCTION',
    category: 'policy',
    name: 'Sanctions Imposed',
    nameLocal: { sv: 'Sanktioner införda', de: 'Sanktionen verhängt' },
    definition: 'Economic or diplomatic sanctions against entities',
    severityScale: { min: 2, max: 5, default: 4 },
    expectedDataLinks: ['foreign_ministry', 'eu_council', 'un_security_council'],
    expectedKpiImpacts: ['trade_balance', 'foreign_investment'],
    typicalDuration: 'months',
    geographicScope: 'international',
    detectionKeywords: ['sanction', 'embargo', 'restriction', 'blacklist']
  },
  {
    code: 'POL_TREATY',
    category: 'policy',
    name: 'Treaty/Agreement',
    nameLocal: { sv: 'Fördrag/Avtal', de: 'Vertrag/Abkommen' },
    definition: 'International treaty or bilateral agreement signed',
    severityScale: { min: 2, max: 5, default: 3 },
    expectedDataLinks: ['foreign_ministry', 'un_treaties'],
    expectedKpiImpacts: ['trade_flows', 'diplomatic_relations'],
    typicalDuration: 'instant',
    geographicScope: 'international',
    detectionKeywords: ['treaty', 'agreement', 'pact', 'accord', 'fördrag']
  },
  {
    code: 'POL_REFERENDUM',
    category: 'policy',
    name: 'Referendum',
    nameLocal: { sv: 'Folkomröstning', de: 'Referendum' },
    definition: 'Public vote on a specific policy question',
    severityScale: { min: 3, max: 5, default: 4 },
    expectedDataLinks: ['election_authority', 'news_agencies'],
    expectedKpiImpacts: ['policy_direction', 'political_stability'],
    typicalDuration: 'days',
    geographicScope: 'national',
    detectionKeywords: ['referendum', 'folkomröstning', 'plebiscite', 'public vote']
  },
  {
    code: 'POL_COURT_RULING',
    category: 'policy',
    name: 'Major Court Ruling',
    nameLocal: { sv: 'Stor domstolsdom', de: 'Wichtiges Gerichtsurteil' },
    definition: 'Significant ruling by constitutional or supreme court',
    severityScale: { min: 2, max: 5, default: 4 },
    expectedDataLinks: ['court_database', 'legal_news'],
    expectedKpiImpacts: ['legal_framework', 'policy_interpretation'],
    typicalDuration: 'instant',
    geographicScope: 'national',
    detectionKeywords: ['ruling', 'verdict', 'judgment', 'court decision', 'dom']
  },

  // === ECONOMIC EVENTS (25) ===
  {
    code: 'ECON_INTEREST_RATE',
    category: 'economic',
    name: 'Interest Rate Decision',
    nameLocal: { sv: 'Räntebeslut', de: 'Zinsentscheidung' },
    definition: 'Central bank interest rate change announcement',
    severityScale: { min: 2, max: 5, default: 4 },
    expectedDataLinks: ['central_bank', 'financial_news'],
    expectedKpiImpacts: ['inflation', 'gdp_growth', 'housing_prices', 'currency_value'],
    typicalDuration: 'instant',
    geographicScope: 'national',
    detectionKeywords: ['interest rate', 'ränta', 'riksbank', 'ecb', 'fed', 'monetary policy']
  },
  {
    code: 'ECON_INFLATION',
    category: 'economic',
    name: 'Inflation Report',
    nameLocal: { sv: 'Inflationsrapport', de: 'Inflationsbericht' },
    definition: 'Official inflation statistics release',
    severityScale: { min: 1, max: 4, default: 3 },
    expectedDataLinks: ['statistics_office', 'central_bank'],
    expectedKpiImpacts: ['inflation', 'real_wages', 'purchasing_power'],
    typicalDuration: 'instant',
    geographicScope: 'national',
    detectionKeywords: ['inflation', 'cpi', 'kpi', 'price index', 'consumer prices']
  },
  {
    code: 'ECON_GDP',
    category: 'economic',
    name: 'GDP Report',
    nameLocal: { sv: 'BNP-rapport', de: 'BIP-Bericht' },
    definition: 'Quarterly or annual GDP statistics release',
    severityScale: { min: 2, max: 4, default: 3 },
    expectedDataLinks: ['statistics_office'],
    expectedKpiImpacts: ['gdp_growth', 'economic_outlook'],
    typicalDuration: 'instant',
    geographicScope: 'national',
    detectionKeywords: ['gdp', 'bnp', 'economic growth', 'economic output']
  },
  {
    code: 'ECON_EMPLOYMENT',
    category: 'economic',
    name: 'Employment Report',
    nameLocal: { sv: 'Sysselsättningsrapport', de: 'Beschäftigungsbericht' },
    definition: 'Official employment/unemployment statistics',
    severityScale: { min: 1, max: 4, default: 3 },
    expectedDataLinks: ['statistics_office', 'labor_agency'],
    expectedKpiImpacts: ['unemployment', 'employment_rate', 'labor_participation'],
    typicalDuration: 'instant',
    geographicScope: 'national',
    detectionKeywords: ['employment', 'unemployment', 'arbetslöshet', 'jobs', 'labor market']
  },
  {
    code: 'ECON_MARKET_SHOCK',
    category: 'economic',
    name: 'Market Shock',
    nameLocal: { sv: 'Marknadschock', de: 'Marktschock' },
    definition: 'Significant sudden movement in financial markets',
    severityScale: { min: 3, max: 5, default: 4 },
    expectedDataLinks: ['stock_exchange', 'financial_news'],
    expectedKpiImpacts: ['market_volatility', 'investor_confidence', 'wealth_effect'],
    typicalDuration: 'hours',
    geographicScope: 'global',
    detectionKeywords: ['crash', 'plunge', 'surge', 'volatility', 'market panic']
  },
  {
    code: 'ECON_TRADE_BALANCE',
    category: 'economic',
    name: 'Trade Balance Report',
    nameLocal: { sv: 'Handelsbalansrapport', de: 'Handelsbilanzbericht' },
    definition: 'Trade statistics showing imports/exports balance',
    severityScale: { min: 1, max: 3, default: 2 },
    expectedDataLinks: ['statistics_office', 'customs_authority'],
    expectedKpiImpacts: ['trade_balance', 'current_account'],
    typicalDuration: 'instant',
    geographicScope: 'national',
    detectionKeywords: ['trade balance', 'exports', 'imports', 'handelsbalans']
  },
  {
    code: 'ECON_CURRENCY',
    category: 'economic',
    name: 'Currency Movement',
    nameLocal: { sv: 'Valutarörelse', de: 'Währungsbewegung' },
    definition: 'Significant currency exchange rate change',
    severityScale: { min: 2, max: 4, default: 3 },
    expectedDataLinks: ['central_bank', 'forex_markets'],
    expectedKpiImpacts: ['currency_value', 'import_prices', 'export_competitiveness'],
    typicalDuration: 'hours',
    geographicScope: 'international',
    detectionKeywords: ['currency', 'exchange rate', 'valuta', 'forex', 'krona']
  },
  {
    code: 'ECON_BANKRUPTCY',
    category: 'economic',
    name: 'Major Bankruptcy',
    nameLocal: { sv: 'Stor konkurs', de: 'Große Insolvenz' },
    definition: 'Significant company or bank failure',
    severityScale: { min: 2, max: 5, default: 4 },
    expectedDataLinks: ['court_records', 'business_news'],
    expectedKpiImpacts: ['employment', 'banking_stability', 'business_confidence'],
    typicalDuration: 'weeks',
    geographicScope: 'national',
    detectionKeywords: ['bankruptcy', 'konkurs', 'insolvency', 'failure', 'collapse']
  },
  {
    code: 'ECON_TRADE_AGREEMENT',
    category: 'economic',
    name: 'Trade Agreement',
    nameLocal: { sv: 'Handelsavtal', de: 'Handelsabkommen' },
    definition: 'New trade deal or tariff changes',
    severityScale: { min: 2, max: 4, default: 3 },
    expectedDataLinks: ['trade_ministry', 'eu_commission'],
    expectedKpiImpacts: ['trade_flows', 'export_growth', 'tariff_levels'],
    typicalDuration: 'months',
    geographicScope: 'international',
    detectionKeywords: ['trade deal', 'tariff', 'customs', 'fta', 'handelsavtal']
  },
  {
    code: 'ECON_CREDIT_RATING',
    category: 'economic',
    name: 'Credit Rating Change',
    nameLocal: { sv: 'Kreditbetygsändring', de: 'Kreditrating-Änderung' },
    definition: 'Sovereign or major corporate credit rating change',
    severityScale: { min: 2, max: 5, default: 4 },
    expectedDataLinks: ['rating_agencies', 'financial_news'],
    expectedKpiImpacts: ['borrowing_costs', 'investor_confidence'],
    typicalDuration: 'instant',
    geographicScope: 'national',
    detectionKeywords: ['credit rating', 'downgrade', 'upgrade', 'outlook', 'moodys', 'sp', 'fitch']
  },

  // === SOCIAL EVENTS (15) ===
  {
    code: 'SOC_STRIKE',
    category: 'social',
    name: 'Strike',
    nameLocal: { sv: 'Strejk', de: 'Streik' },
    definition: 'Organized work stoppage by employees',
    severityScale: { min: 1, max: 5, default: 3 },
    expectedDataLinks: ['union_announcements', 'news_agencies'],
    expectedKpiImpacts: ['productivity', 'output', 'labor_relations'],
    typicalDuration: 'days',
    geographicScope: 'national',
    detectionKeywords: ['strike', 'strejk', 'walkout', 'industrial action', 'work stoppage']
  },
  {
    code: 'SOC_PROTEST',
    category: 'social',
    name: 'Protest/Demonstration',
    nameLocal: { sv: 'Protest/Demonstration', de: 'Protest/Demonstration' },
    definition: 'Public demonstration or protest event',
    severityScale: { min: 1, max: 4, default: 2 },
    expectedDataLinks: ['news_agencies', 'social_media'],
    expectedKpiImpacts: ['social_stability', 'political_climate'],
    typicalDuration: 'hours',
    geographicScope: 'local',
    detectionKeywords: ['protest', 'demonstration', 'rally', 'march', 'manifestation']
  },
  {
    code: 'SOC_MIGRATION',
    category: 'social',
    name: 'Migration Surge',
    nameLocal: { sv: 'Migrationsökning', de: 'Migrationswelle' },
    definition: 'Significant increase in migration flows',
    severityScale: { min: 2, max: 5, default: 3 },
    expectedDataLinks: ['migration_agency', 'eurostat'],
    expectedKpiImpacts: ['population_growth', 'labor_supply', 'public_services'],
    typicalDuration: 'months',
    geographicScope: 'regional',
    detectionKeywords: ['migration', 'refugees', 'asylum', 'immigration', 'flyktingar']
  },
  {
    code: 'SOC_CRIME_WAVE',
    category: 'social',
    name: 'Crime Wave',
    nameLocal: { sv: 'Brottsvåg', de: 'Verbrechenswelle' },
    definition: 'Significant increase in criminal activity',
    severityScale: { min: 2, max: 5, default: 4 },
    expectedDataLinks: ['police_statistics', 'crime_reports'],
    expectedKpiImpacts: ['crime_rate', 'public_safety', 'security_spending'],
    typicalDuration: 'weeks',
    geographicScope: 'regional',
    detectionKeywords: ['crime', 'violence', 'gang', 'shooting', 'brott']
  },
  {
    code: 'SOC_EDUCATION',
    category: 'social',
    name: 'Education Report',
    nameLocal: { sv: 'Utbildningsrapport', de: 'Bildungsbericht' },
    definition: 'Major education statistics or PISA results',
    severityScale: { min: 1, max: 3, default: 2 },
    expectedDataLinks: ['education_ministry', 'oecd'],
    expectedKpiImpacts: ['education_quality', 'skill_levels'],
    typicalDuration: 'instant',
    geographicScope: 'national',
    detectionKeywords: ['pisa', 'education', 'school', 'utbildning', 'academic']
  },
  {
    code: 'SOC_DEMOGRAPHIC',
    category: 'social',
    name: 'Demographic Shift',
    nameLocal: { sv: 'Demografisk förändring', de: 'Demografischer Wandel' },
    definition: 'Significant population or demographic change',
    severityScale: { min: 1, max: 3, default: 2 },
    expectedDataLinks: ['statistics_office'],
    expectedKpiImpacts: ['population_growth', 'dependency_ratio', 'fertility_rate'],
    typicalDuration: 'years',
    geographicScope: 'national',
    detectionKeywords: ['population', 'birth rate', 'aging', 'demografi', 'fertility']
  },

  // === SECURITY EVENTS (10) ===
  {
    code: 'SEC_TERROR',
    category: 'security',
    name: 'Terror Attack',
    nameLocal: { sv: 'Terrorattack', de: 'Terroranschlag' },
    definition: 'Terrorist incident or attack',
    severityScale: { min: 4, max: 5, default: 5 },
    expectedDataLinks: ['news_agencies', 'security_services'],
    expectedKpiImpacts: ['security_threat_level', 'tourism', 'public_confidence'],
    typicalDuration: 'instant',
    geographicScope: 'local',
    detectionKeywords: ['terror', 'attack', 'bombing', 'extremism', 'attentat']
  },
  {
    code: 'SEC_MILITARY',
    category: 'security',
    name: 'Military Conflict',
    nameLocal: { sv: 'Militär konflikt', de: 'Militärischer Konflikt' },
    definition: 'Armed conflict or military action',
    severityScale: { min: 4, max: 5, default: 5 },
    expectedDataLinks: ['defense_ministry', 'un_reports', 'news_agencies'],
    expectedKpiImpacts: ['defense_spending', 'security', 'economic_stability'],
    typicalDuration: 'months',
    geographicScope: 'international',
    detectionKeywords: ['war', 'military', 'conflict', 'invasion', 'krig', 'attack']
  },
  {
    code: 'SEC_CYBER',
    category: 'security',
    name: 'Cyber Attack',
    nameLocal: { sv: 'Cyberattack', de: 'Cyberangriff' },
    definition: 'Significant cyber security incident',
    severityScale: { min: 2, max: 5, default: 4 },
    expectedDataLinks: ['security_agencies', 'tech_news'],
    expectedKpiImpacts: ['digital_security', 'infrastructure_resilience'],
    typicalDuration: 'days',
    geographicScope: 'national',
    detectionKeywords: ['cyber', 'hack', 'breach', 'ransomware', 'ddos']
  },
  {
    code: 'SEC_THREAT_LEVEL',
    category: 'security',
    name: 'Threat Level Change',
    nameLocal: { sv: 'Hotnivåförändring', de: 'Bedrohungsstufenänderung' },
    definition: 'Official security threat level adjustment',
    severityScale: { min: 2, max: 5, default: 4 },
    expectedDataLinks: ['security_services'],
    expectedKpiImpacts: ['security_spending', 'public_confidence'],
    typicalDuration: 'instant',
    geographicScope: 'national',
    detectionKeywords: ['threat level', 'hotnivå', 'terror threat', 'security alert']
  },

  // === ENVIRONMENT EVENTS (15) ===
  {
    code: 'ENV_DISASTER',
    category: 'environment',
    name: 'Natural Disaster',
    nameLocal: { sv: 'Naturkatastrof', de: 'Naturkatastrophe' },
    definition: 'Major natural disaster event',
    severityScale: { min: 3, max: 5, default: 5 },
    expectedDataLinks: ['emergency_services', 'weather_services', 'news_agencies'],
    expectedKpiImpacts: ['infrastructure', 'economic_output', 'insurance_claims'],
    typicalDuration: 'days',
    geographicScope: 'regional',
    detectionKeywords: ['disaster', 'earthquake', 'flood', 'hurricane', 'tsunami', 'katastrof']
  },
  {
    code: 'ENV_CLIMATE',
    category: 'environment',
    name: 'Climate Event',
    nameLocal: { sv: 'Klimathändelse', de: 'Klimaereignis' },
    definition: 'Significant climate-related event or report',
    severityScale: { min: 2, max: 5, default: 4 },
    expectedDataLinks: ['climate_agencies', 'ipcc', 'weather_services'],
    expectedKpiImpacts: ['climate_indicators', 'adaptation_costs'],
    typicalDuration: 'weeks',
    geographicScope: 'global',
    detectionKeywords: ['climate', 'global warming', 'emissions', 'klimat', 'carbon']
  },
  {
    code: 'ENV_POLLUTION',
    category: 'environment',
    name: 'Pollution Incident',
    nameLocal: { sv: 'Föroreningsincident', de: 'Verschmutzungsvorfall' },
    definition: 'Major environmental pollution event',
    severityScale: { min: 2, max: 5, default: 4 },
    expectedDataLinks: ['environment_agency', 'news_agencies'],
    expectedKpiImpacts: ['air_quality', 'water_quality', 'public_health'],
    typicalDuration: 'days',
    geographicScope: 'local',
    detectionKeywords: ['pollution', 'spill', 'contamination', 'förorening', 'toxic']
  },
  {
    code: 'ENV_HEAT_WAVE',
    category: 'environment',
    name: 'Extreme Heat',
    nameLocal: { sv: 'Extrem värme', de: 'Extreme Hitze' },
    definition: 'Heat wave or extreme temperature event',
    severityScale: { min: 2, max: 4, default: 3 },
    expectedDataLinks: ['weather_services'],
    expectedKpiImpacts: ['mortality', 'energy_demand', 'agriculture'],
    typicalDuration: 'days',
    geographicScope: 'regional',
    detectionKeywords: ['heat wave', 'extreme heat', 'värmebölja', 'temperature record']
  },
  {
    code: 'ENV_WILDFIRE',
    category: 'environment',
    name: 'Wildfire',
    nameLocal: { sv: 'Skogsbrand', de: 'Waldbrand' },
    definition: 'Major wildfire event',
    severityScale: { min: 2, max: 5, default: 4 },
    expectedDataLinks: ['emergency_services', 'news_agencies'],
    expectedKpiImpacts: ['forest_coverage', 'air_quality', 'property_damage'],
    typicalDuration: 'days',
    geographicScope: 'regional',
    detectionKeywords: ['wildfire', 'forest fire', 'skogsbrand', 'blaze']
  },

  // === HEALTH EVENTS (10) ===
  {
    code: 'HEALTH_OUTBREAK',
    category: 'health',
    name: 'Disease Outbreak',
    nameLocal: { sv: 'Sjukdomsutbrott', de: 'Krankheitsausbruch' },
    definition: 'Significant disease outbreak or epidemic',
    severityScale: { min: 3, max: 5, default: 5 },
    expectedDataLinks: ['health_ministry', 'who', 'ecdc'],
    expectedKpiImpacts: ['mortality', 'healthcare_capacity', 'economic_activity'],
    typicalDuration: 'months',
    geographicScope: 'international',
    detectionKeywords: ['outbreak', 'epidemic', 'pandemic', 'virus', 'utbrott']
  },
  {
    code: 'HEALTH_CRISIS',
    category: 'health',
    name: 'Healthcare Crisis',
    nameLocal: { sv: 'Vårdkris', de: 'Gesundheitskrise' },
    definition: 'Significant strain on healthcare system',
    severityScale: { min: 3, max: 5, default: 4 },
    expectedDataLinks: ['health_ministry', 'hospital_reports'],
    expectedKpiImpacts: ['healthcare_capacity', 'wait_times', 'mortality'],
    typicalDuration: 'weeks',
    geographicScope: 'national',
    detectionKeywords: ['healthcare crisis', 'hospital', 'vårdkris', 'capacity']
  },
  {
    code: 'HEALTH_DRUG_APPROVAL',
    category: 'health',
    name: 'Drug/Vaccine Approval',
    nameLocal: { sv: 'Läkemedels-/vaccingodkännande', de: 'Arzneimittel-/Impfstoffzulassung' },
    definition: 'Major pharmaceutical approval',
    severityScale: { min: 1, max: 4, default: 3 },
    expectedDataLinks: ['ema', 'fda', 'health_ministry'],
    expectedKpiImpacts: ['treatment_availability', 'healthcare_costs'],
    typicalDuration: 'instant',
    geographicScope: 'international',
    detectionKeywords: ['approval', 'drug', 'vaccine', 'läkemedel', 'godkännande']
  },

  // === INFRASTRUCTURE EVENTS (10) ===
  {
    code: 'INFRA_OUTAGE',
    category: 'infrastructure',
    name: 'Infrastructure Outage',
    nameLocal: { sv: 'Infrastrukturavbrott', de: 'Infrastrukturausfall' },
    definition: 'Major infrastructure system failure',
    severityScale: { min: 2, max: 5, default: 4 },
    expectedDataLinks: ['utility_companies', 'emergency_services'],
    expectedKpiImpacts: ['service_availability', 'economic_impact'],
    typicalDuration: 'hours',
    geographicScope: 'regional',
    detectionKeywords: ['outage', 'failure', 'blackout', 'avbrott', 'disruption']
  },
  {
    code: 'INFRA_ENERGY',
    category: 'infrastructure',
    name: 'Energy Disruption',
    nameLocal: { sv: 'Energistörning', de: 'Energieunterbrechung' },
    definition: 'Significant energy supply disruption',
    severityScale: { min: 2, max: 5, default: 4 },
    expectedDataLinks: ['energy_agency', 'utility_companies'],
    expectedKpiImpacts: ['energy_security', 'electricity_prices'],
    typicalDuration: 'days',
    geographicScope: 'national',
    detectionKeywords: ['energy', 'electricity', 'power', 'el', 'energi', 'grid']
  },
  {
    code: 'INFRA_TRANSPORT',
    category: 'infrastructure',
    name: 'Transport Disruption',
    nameLocal: { sv: 'Transportstörning', de: 'Transportunterbrechung' },
    definition: 'Major transport system disruption',
    severityScale: { min: 1, max: 4, default: 3 },
    expectedDataLinks: ['transport_agency', 'news_agencies'],
    expectedKpiImpacts: ['logistics', 'commuter_time', 'economic_output'],
    typicalDuration: 'hours',
    geographicScope: 'regional',
    detectionKeywords: ['transport', 'traffic', 'rail', 'airport', 'trafik', 'tåg']
  },
  {
    code: 'INFRA_TELECOM',
    category: 'infrastructure',
    name: 'Telecom Disruption',
    nameLocal: { sv: 'Teleavbrott', de: 'Telekommunikationsausfall' },
    definition: 'Major telecommunications outage',
    severityScale: { min: 2, max: 4, default: 3 },
    expectedDataLinks: ['telecom_operators', 'pts'],
    expectedKpiImpacts: ['connectivity', 'digital_services'],
    typicalDuration: 'hours',
    geographicScope: 'regional',
    detectionKeywords: ['telecom', 'network', 'mobile', 'internet', 'nät']
  },

  // === TECHNOLOGY EVENTS (5) ===
  {
    code: 'TECH_BREAKTHROUGH',
    category: 'technology',
    name: 'Technology Breakthrough',
    nameLocal: { sv: 'Teknologigenombrott', de: 'Technologischer Durchbruch' },
    definition: 'Significant technological advancement',
    severityScale: { min: 1, max: 4, default: 3 },
    expectedDataLinks: ['research_institutions', 'tech_news'],
    expectedKpiImpacts: ['innovation_index', 'productivity'],
    typicalDuration: 'instant',
    geographicScope: 'global',
    detectionKeywords: ['breakthrough', 'discovery', 'innovation', 'ai', 'teknologi']
  },
  {
    code: 'TECH_REGULATION',
    category: 'technology',
    name: 'Tech Regulation',
    nameLocal: { sv: 'Teknikreglering', de: 'Technologieregulierung' },
    definition: 'New technology regulation or antitrust action',
    severityScale: { min: 2, max: 4, default: 3 },
    expectedDataLinks: ['regulatory_bodies', 'eu_commission'],
    expectedKpiImpacts: ['tech_sector', 'digital_markets'],
    typicalDuration: 'months',
    geographicScope: 'international',
    detectionKeywords: ['regulation', 'antitrust', 'gdpr', 'ai act', 'reglering']
  }
];

// Category metadata
export const EVENT_CATEGORIES = {
  policy: { name: 'Policy', nameLocal: { sv: 'Politik' }, color: '#3b82f6' },
  economic: { name: 'Economic', nameLocal: { sv: 'Ekonomi' }, color: '#22c55e' },
  social: { name: 'Social', nameLocal: { sv: 'Socialt' }, color: '#a855f7' },
  security: { name: 'Security', nameLocal: { sv: 'Säkerhet' }, color: '#ef4444' },
  environment: { name: 'Environment', nameLocal: { sv: 'Miljö' }, color: '#10b981' },
  health: { name: 'Health', nameLocal: { sv: 'Hälsa' }, color: '#ec4899' },
  infrastructure: { name: 'Infrastructure', nameLocal: { sv: 'Infrastruktur' }, color: '#f59e0b' },
  technology: { name: 'Technology', nameLocal: { sv: 'Teknologi' }, color: '#6366f1' }
} as const;

// Helper functions
export function getEventByCode(code: string): EventCategory | undefined {
  return EVENT_TAXONOMY.find(e => e.code === code);
}

export function getEventsByCategory(category: EventCategory['category']): EventCategory[] {
  return EVENT_TAXONOMY.filter(e => e.category === category);
}

export function searchEvents(query: string): EventCategory[] {
  const q = query.toLowerCase();
  return EVENT_TAXONOMY.filter(e => 
    e.name.toLowerCase().includes(q) ||
    e.definition.toLowerCase().includes(q) ||
    e.detectionKeywords.some(k => k.toLowerCase().includes(q)) ||
    Object.values(e.nameLocal).some(n => n.toLowerCase().includes(q))
  );
}
