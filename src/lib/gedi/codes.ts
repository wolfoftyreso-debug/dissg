/**
 * GEDI Code Definitions
 * 
 * Standardized, regulatory-level diagnostic codes.
 * Few, clear, legally/conventionally relevant.
 */

import type { GEDICodeDefinition, GEDICategory } from './types';

// =============================================================================
// GEDI CATEGORY LABELS
// =============================================================================

export const GEDI_CATEGORY_LABELS: Record<GEDICategory, { sv: string; en: string; icon: string }> = {
  PERFORMANCE: { sv: 'Systemprestation', en: 'System Performance', icon: '📊' },
  SUSTAINABILITY: { sv: 'Hållbar resursbalans', en: 'Sustainable Resource Balance', icon: '♻️' },
  EQUALITY: { sv: 'Jämlikhet', en: 'Equality', icon: '⚖️' },
  HEALTH: { sv: 'Hälsoutfall', en: 'Health Outcomes', icon: '🏥' },
  CLIMATE: { sv: 'Klimatpåverkan', en: 'Climate Impact', icon: '🌡️' },
  DEMOCRACY: { sv: 'Demokratisk funktion', en: 'Democratic Function', icon: '🗳️' },
  INTEGRITY: { sv: 'Systemintegritet', en: 'System Integrity', icon: '🔒' },
};

// =============================================================================
// GEDI CODE DEFINITIONS (v1.0)
// =============================================================================

export const GEDI_CODES: GEDICodeDefinition[] = [
  // =========================================================================
  // GEDI-001: Systemic Underperformance
  // =========================================================================
  {
    code: 'GEDI-001',
    category: 'PERFORMANCE',
    title: {
      sv: 'Systemisk underprestation mot vetenskaplig konsensus',
      en: 'Systemic underperformance against scientific consensus'
    },
    description: {
      sv: 'Observerade utfall understiger signifikant vad som är möjligt enligt etablerad vetenskaplig konsensus, givet tillgängliga resurser.',
      en: 'Observed outcomes significantly below what is possible according to established scientific consensus, given available resources.'
    },
    triggerCondition: 'outcome < (consensus_potential * 0.7)',
    toleranceDefinition: '70-100% av vetenskapligt möjlig prestation',
    internationalBasis: 'WHO, OECD, peer-reviewed meta-analyses',
    requiredDataCoverage: 80,
    affectedSystems: ['ECO', 'HEA', 'EDU', 'INF'],
    guidedAnalysisSteps: [
      {
        order: 1,
        title: { sv: 'Granska resursallokering', en: 'Review resource allocation' },
        instruction: { sv: 'Jämför faktisk resursfördelning med effektiva system.', en: 'Compare actual resource distribution with effective systems.' },
        requiredIndicators: ['gov_spending', 'sector_efficiency'],
        expectedDuration: '15 min',
        isComplete: false
      },
      {
        order: 2,
        title: { sv: 'Analysera systemiska flaskhalsar', en: 'Analyze systemic bottlenecks' },
        instruction: { sv: 'Identifiera var resurser blockeras eller absorberas utan utfall.', en: 'Identify where resources are blocked or absorbed without outcomes.' },
        requiredIndicators: ['process_efficiency', 'outcome_per_input'],
        expectedDuration: '20 min',
        isComplete: false
      },
      {
        order: 3,
        title: { sv: 'Jämför peer-länder', en: 'Compare peer countries' },
        instruction: { sv: 'Visa hur jämförbara länder presterar med liknande resurser.', en: 'Show how comparable countries perform with similar resources.' },
        requiredIndicators: ['peer_outcomes', 'peer_resources'],
        expectedDuration: '10 min',
        isComplete: false
      }
    ]
  },

  // =========================================================================
  // GEDI-002: Unsustainable Resource Balance
  // =========================================================================
  {
    code: 'GEDI-002',
    category: 'SUSTAINABILITY',
    title: {
      sv: 'Avvikelse från hållbar resursbalans',
      en: 'Deviation from sustainable resource balance'
    },
    description: {
      sv: 'Resursförbrukning överstiger regenerativ kapacitet eller uttömmer icke-förnybara resurser snabbare än ersättning utvecklas.',
      en: 'Resource consumption exceeds regenerative capacity or depletes non-renewable resources faster than replacement develops.'
    },
    triggerCondition: 'consumption > (regeneration_rate * 1.0)',
    toleranceDefinition: '≤100% av regenerativ kapacitet',
    internationalBasis: 'IPCC, Stockholm Resilience Centre, Planetary Boundaries',
    requiredDataCoverage: 75,
    affectedSystems: ['ENV', 'ENE', 'ECO'],
    guidedAnalysisSteps: [
      {
        order: 1,
        title: { sv: 'Kvantifiera förbrukningsökning', en: 'Quantify consumption increase' },
        instruction: { sv: 'Visa trendlinje för resursförbrukning över tid.', en: 'Show trendline for resource consumption over time.' },
        requiredIndicators: ['resource_consumption', 'consumption_trend'],
        expectedDuration: '10 min',
        isComplete: false
      },
      {
        order: 2,
        title: { sv: 'Identifiera huvudsakliga drivare', en: 'Identify primary drivers' },
        instruction: { sv: 'Bryt ner förbrukning per sektor och användningsområde.', en: 'Break down consumption by sector and use area.' },
        requiredIndicators: ['sector_consumption', 'use_breakdown'],
        expectedDuration: '15 min',
        isComplete: false
      }
    ]
  },

  // =========================================================================
  // GEDI-003: Unacceptable Inequality
  // =========================================================================
  {
    code: 'GEDI-003',
    category: 'EQUALITY',
    title: {
      sv: 'Oacceptabel ojämlikhet enligt internationella normer',
      en: 'Unacceptable inequality according to international norms'
    },
    description: {
      sv: 'Fördelning av resurser, möjligheter eller utfall överskrider gränsvärden som definierats i internationella konventioner.',
      en: 'Distribution of resources, opportunities, or outcomes exceeds thresholds defined in international conventions.'
    },
    triggerCondition: 'gini > 0.40 OR palma_ratio > 2.0',
    toleranceDefinition: 'Gini ≤0.40, Palma ratio ≤2.0',
    internationalBasis: 'UN SDG 10, ILO, Human Development Reports',
    requiredDataCoverage: 85,
    affectedSystems: ['SOC', 'ECO', 'HEA', 'EDU'],
    guidedAnalysisSteps: [
      {
        order: 1,
        title: { sv: 'Analysera inkomstfördelning', en: 'Analyze income distribution' },
        instruction: { sv: 'Visa Lorenz-kurva och Gini-koefficient över tid.', en: 'Show Lorenz curve and Gini coefficient over time.' },
        requiredIndicators: ['gini', 'income_deciles'],
        expectedDuration: '10 min',
        isComplete: false
      },
      {
        order: 2,
        title: { sv: 'Identifiera strukturella orsaker', en: 'Identify structural causes' },
        instruction: { sv: 'Visa korrelation med utbildning, arbetsmarknad, skattesystem.', en: 'Show correlation with education, labor market, tax system.' },
        requiredIndicators: ['education_access', 'employment_rate', 'tax_progressivity'],
        expectedDuration: '20 min',
        isComplete: false
      }
    ]
  },

  // =========================================================================
  // GEDI-004: Health Decline Despite Resources
  // =========================================================================
  {
    code: 'GEDI-004',
    category: 'HEALTH',
    title: {
      sv: 'Hälsoutfall försämras trots ökade resurser',
      en: 'Health outcomes declining despite increased resources'
    },
    description: {
      sv: 'Hälsoindikatorer försämras eller stagnerar samtidigt som resurser till hälsosystemet ökar.',
      en: 'Health indicators deteriorating or stagnating while resources to health system increase.'
    },
    triggerCondition: '(health_spending_growth > 0) AND (health_outcome_growth <= 0)',
    toleranceDefinition: 'Positiv korrelation mellan resurs och utfall',
    internationalBasis: 'WHO, OECD Health Statistics',
    requiredDataCoverage: 80,
    affectedSystems: ['HEA'],
    guidedAnalysisSteps: [
      {
        order: 1,
        title: { sv: 'Jämför resurs vs utfall', en: 'Compare resource vs outcome' },
        instruction: { sv: 'Visa parallella tidsserier för utgifter och hälsoutfall.', en: 'Show parallel time series for spending and health outcomes.' },
        requiredIndicators: ['health_spending', 'life_expectancy', 'qaly'],
        expectedDuration: '10 min',
        isComplete: false
      },
      {
        order: 2,
        title: { sv: 'Analysera resurslläckage', en: 'Analyze resource leakage' },
        instruction: { sv: 'Identifiera var resurser absorberas utan patientutfall.', en: 'Identify where resources are absorbed without patient outcomes.' },
        requiredIndicators: ['admin_cost_ratio', 'treatment_efficiency'],
        expectedDuration: '15 min',
        isComplete: false
      }
    ]
  },

  // =========================================================================
  // GEDI-005: Climate Impact Exceeds Agreements
  // =========================================================================
  {
    code: 'GEDI-005',
    category: 'CLIMATE',
    title: {
      sv: 'Klimatpåverkan över avtalade gränsvärden',
      en: 'Climate impact exceeds agreed thresholds'
    },
    description: {
      sv: 'Utsläpp eller klimatpåverkan överstiger åtaganden i internationella avtal.',
      en: 'Emissions or climate impact exceed commitments in international agreements.'
    },
    triggerCondition: 'emissions > committed_target',
    toleranceDefinition: '≤100% av åtagande enligt Paris-avtalet',
    internationalBasis: 'UNFCCC, Paris Agreement, IPCC AR6',
    requiredDataCoverage: 90,
    affectedSystems: ['ENV', 'ENE'],
    guidedAnalysisSteps: [
      {
        order: 1,
        title: { sv: 'Kvantifiera avvikelse', en: 'Quantify deviation' },
        instruction: { sv: 'Visa faktiska utsläpp jämfört med åtagande.', en: 'Show actual emissions compared to commitment.' },
        requiredIndicators: ['co2_emissions', 'paris_target'],
        expectedDuration: '10 min',
        isComplete: false
      },
      {
        order: 2,
        title: { sv: 'Identifiera huvudkällor', en: 'Identify main sources' },
        instruction: { sv: 'Bryt ner utsläpp per sektor.', en: 'Break down emissions by sector.' },
        requiredIndicators: ['sector_emissions', 'transport_emissions', 'industry_emissions'],
        expectedDuration: '15 min',
        isComplete: false
      }
    ]
  },

  // =========================================================================
  // GEDI-006: Democratic Function Declining
  // =========================================================================
  {
    code: 'GEDI-006',
    category: 'DEMOCRACY',
    title: {
      sv: 'Demokratisk funktion försämras',
      en: 'Democratic function declining'
    },
    description: {
      sv: 'Indikatorer för demokratisk kvalitet, deltagande eller institutionell styrka visar signifikant negativ trend.',
      en: 'Indicators for democratic quality, participation, or institutional strength show significant negative trend.'
    },
    triggerCondition: 'democracy_index_delta < -0.5 over 5 years',
    toleranceDefinition: 'Stabil eller förbättrad demokratisk funktion',
    internationalBasis: 'V-Dem, Freedom House, EIU Democracy Index',
    requiredDataCoverage: 75,
    affectedSystems: ['DEM', 'GOV'],
    guidedAnalysisSteps: [
      {
        order: 1,
        title: { sv: 'Analysera deltagandetrender', en: 'Analyze participation trends' },
        instruction: { sv: 'Visa valdeltagande, föreningsdeltagande, mediefrihet.', en: 'Show voter turnout, civil engagement, media freedom.' },
        requiredIndicators: ['voter_turnout', 'press_freedom', 'civil_liberties'],
        expectedDuration: '15 min',
        isComplete: false
      },
      {
        order: 2,
        title: { sv: 'Granska institutionell styrka', en: 'Review institutional strength' },
        instruction: { sv: 'Visa oberoende för domstolar, revision, ombudsmän.', en: 'Show independence of courts, audit, ombudsmen.' },
        requiredIndicators: ['judicial_independence', 'oversight_effectiveness'],
        expectedDuration: '15 min',
        isComplete: false
      }
    ]
  },

  // =========================================================================
  // GEDI-007: Corruption Risk Above Tolerance
  // =========================================================================
  {
    code: 'GEDI-007',
    category: 'INTEGRITY',
    title: {
      sv: 'Korruptionsrisk över tolerans',
      en: 'Corruption risk above tolerance'
    },
    description: {
      sv: 'Korruptionsindikatorer eller integritetsmått understiger acceptabla nivåer.',
      en: 'Corruption indicators or integrity measures fall below acceptable levels.'
    },
    triggerCondition: 'cpi < 50 OR integrity_score < 0.6',
    toleranceDefinition: 'CPI ≥50, Integrity score ≥0.6',
    internationalBasis: 'Transparency International, OECD Anti-Bribery Convention',
    requiredDataCoverage: 70,
    affectedSystems: ['GOV', 'ECO'],
    guidedAnalysisSteps: [
      {
        order: 1,
        title: { sv: 'Granska korruptionsindex', en: 'Review corruption index' },
        instruction: { sv: 'Visa CPI och relaterade mått över tid.', en: 'Show CPI and related measures over time.' },
        requiredIndicators: ['cpi', 'bribery_rate'],
        expectedDuration: '10 min',
        isComplete: false
      },
      {
        order: 2,
        title: { sv: 'Identifiera riskområden', en: 'Identify risk areas' },
        instruction: { sv: 'Visa korruptionsrisk per sektor och nivå.', en: 'Show corruption risk by sector and level.' },
        requiredIndicators: ['sector_integrity', 'procurement_risk'],
        expectedDuration: '15 min',
        isComplete: false
      }
    ]
  }
];

// =============================================================================
// LOOKUP HELPERS
// =============================================================================

export function getGEDICode(code: string): GEDICodeDefinition | undefined {
  return GEDI_CODES.find(c => c.code === code);
}

export function getGEDICodesByCategory(category: GEDICategory): GEDICodeDefinition[] {
  return GEDI_CODES.filter(c => c.category === category);
}

export function getAllGEDICategories(): GEDICategory[] {
  return Object.keys(GEDI_CATEGORY_LABELS) as GEDICategory[];
}
