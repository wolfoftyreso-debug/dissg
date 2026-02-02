/**
 * ⚖️ MASTER EXECUTION BLOCK 38
 * 
 * GLOBAL CONFLICT & INSTABILITY — RISK INDICATORS (SAFE-BY-DESIGN)
 * 
 * SYFTE:
 * Att göra orsaker och risker till konflikt och instabilitet mätbara och jämförbara
 * – utan att skapa operativa eller taktiska modeller.
 * 
 * Detta är risk för instabilitet, INTE krigssimulering.
 */

// ============================================================
// LOCKED PRINCIPLES (CANNOT BE OVERRIDDEN)
// ============================================================

export const RISK_PRINCIPLES = {
  allowed: [
    'structural_indicators_only',
    'aggregated_public_data_only',
    'historical_correlations',
    'concurrent_stressors',
  ],
  forbidden: [
    'actor_vs_actor',
    'winner_loser',
    'date_predictions',
    'tactical_analysis',
    'operational_planning',
  ],
  mandatory_statement: {
    sv: 'När flera stressfaktorer sammanfaller över tid, har historiskt risken för instabilitet ökat.',
    en: 'When multiple stressors coincide over time, the risk of instability has historically increased.',
  },
} as const;

// ============================================================
// RISK DOMAIN TYPES
// ============================================================

export interface RiskIndicator {
  id: string;
  name: { sv: string; en: string };
  description: { sv: string; en: string };
  unit: string;
  sources: string[];
  update_frequency: 'monthly' | 'quarterly' | 'annual';
  reliability: 'high' | 'medium' | 'low';
}

export interface RiskDomain {
  id: string;
  name: { sv: string; en: string };
  description: { sv: string; en: string };
  interpretation: { sv: string; en: string };
  what_this_does_not_mean: { sv: string; en: string };
  indicators: RiskIndicator[];
  weight_range: [number, number]; // Default weight range 0-100
  default_weight: number;
}

// ============================================================
// THE 8 STRUCTURAL RISK DOMAINS
// ============================================================

export const RISK_DOMAINS: RiskDomain[] = [
  // ─────────────────────────────────────────────────────────
  // 2.1 ECONOMIC STRESS
  // ─────────────────────────────────────────────────────────
  {
    id: 'economic_stress',
    name: {
      sv: 'Ekonomisk stress',
      en: 'Economic stress',
    },
    description: {
      sv: 'Indikatorer på ekonomisk kapacitet och stabilitet.',
      en: 'Indicators of economic capacity and stability.',
    },
    interpretation: {
      sv: 'Ekonomisk nedgång kan minska staters handlingsutrymme och social stabilitet.',
      en: 'Economic decline can reduce state capacity and social stability.',
    },
    what_this_does_not_mean: {
      sv: 'Ekonomisk stress leder inte automatiskt till konflikt. Kontexten avgör.',
      en: 'Economic stress does not automatically lead to conflict. Context matters.',
    },
    indicators: [
      {
        id: 'gdp_per_capita_trend',
        name: { sv: 'BNP per capita (trend)', en: 'GDP per capita (trend)' },
        description: { sv: '5-årig förändring i real BNP per capita.', en: '5-year change in real GDP per capita.' },
        unit: '%',
        sources: ['World Bank', 'IMF'],
        update_frequency: 'annual',
        reliability: 'high',
      },
      {
        id: 'inflation_real_income',
        name: { sv: 'Inflation & realinkomster', en: 'Inflation & real income' },
        description: { sv: 'Köpkraftsförändring justerad för inflation.', en: 'Purchasing power change adjusted for inflation.' },
        unit: '%',
        sources: ['IMF', 'National statistics'],
        update_frequency: 'quarterly',
        reliability: 'medium',
      },
      {
        id: 'debt_to_gdp',
        name: { sv: 'Statsskuld / BNP', en: 'Government debt / GDP' },
        description: { sv: 'Total offentlig skuld som andel av BNP.', en: 'Total public debt as share of GDP.' },
        unit: '%',
        sources: ['IMF', 'World Bank'],
        update_frequency: 'annual',
        reliability: 'high',
      },
      {
        id: 'youth_unemployment',
        name: { sv: 'Ungdomsarbetslöshet', en: 'Youth unemployment' },
        description: { sv: 'Arbetslöshet bland 15-24 år.', en: 'Unemployment among ages 15-24.' },
        unit: '%',
        sources: ['ILO', 'Eurostat'],
        update_frequency: 'quarterly',
        reliability: 'medium',
      },
    ],
    weight_range: [0, 100],
    default_weight: 15,
  },

  // ─────────────────────────────────────────────────────────
  // 2.2 INSTITUTIONAL CAPACITY
  // ─────────────────────────────────────────────────────────
  {
    id: 'institutional_capacity',
    name: {
      sv: 'Institutionell kapacitet',
      en: 'Institutional capacity',
    },
    description: {
      sv: 'Styrningsförmåga och offentlig service.',
      en: 'Governance capacity and public service delivery.',
    },
    interpretation: {
      sv: 'Svag institutionell kapacitet sammanfaller ofta med lägre krishanteringsförmåga.',
      en: 'Weak institutional capacity often coincides with lower crisis management ability.',
    },
    what_this_does_not_mean: {
      sv: 'Låga poäng innebär inte att staten kommer att kollapsa.',
      en: 'Low scores do not mean the state will collapse.',
    },
    indicators: [
      {
        id: 'tax_revenue_gdp',
        name: { sv: 'Skatteintäkter / BNP', en: 'Tax revenue / GDP' },
        description: { sv: 'Statens förmåga att mobilisera resurser.', en: 'State ability to mobilize resources.' },
        unit: '%',
        sources: ['World Bank', 'OECD'],
        update_frequency: 'annual',
        reliability: 'high',
      },
      {
        id: 'public_service_coverage',
        name: { sv: 'Offentlig service-täckning', en: 'Public service coverage' },
        description: { sv: 'Tillgång till grundläggande offentliga tjänster.', en: 'Access to basic public services.' },
        unit: 'index',
        sources: ['UN', 'World Bank'],
        update_frequency: 'annual',
        reliability: 'medium',
      },
      {
        id: 'corruption_index',
        name: { sv: 'Korruptionsindex', en: 'Corruption index' },
        description: { sv: 'Aggregerat mått på upplevd korruption.', en: 'Aggregated measure of perceived corruption.' },
        unit: 'index',
        sources: ['Transparency International', 'World Bank'],
        update_frequency: 'annual',
        reliability: 'medium',
      },
      {
        id: 'administrative_continuity',
        name: { sv: 'Administrativ kontinuitet', en: 'Administrative continuity' },
        description: { sv: 'Stabilitet i offentlig förvaltning.', en: 'Stability in public administration.' },
        unit: 'index',
        sources: ['V-Dem', 'Polity'],
        update_frequency: 'annual',
        reliability: 'medium',
      },
    ],
    weight_range: [0, 100],
    default_weight: 15,
  },

  // ─────────────────────────────────────────────────────────
  // 2.3 DEMOGRAPHIC IMBALANCES
  // ─────────────────────────────────────────────────────────
  {
    id: 'demographic_imbalance',
    name: {
      sv: 'Demografiska obalanser',
      en: 'Demographic imbalances',
    },
    description: {
      sv: 'Befolkningsstruktur och förändringstakt.',
      en: 'Population structure and rate of change.',
    },
    interpretation: {
      sv: 'Snabba demografiska skiften kan skapa tryck på arbetsmarknad och service.',
      en: 'Rapid demographic shifts can create pressure on labor markets and services.',
    },
    what_this_does_not_mean: {
      sv: 'Unga befolkningar är inte per definition instabila.',
      en: 'Young populations are not inherently unstable.',
    },
    indicators: [
      {
        id: 'youth_bulge',
        name: { sv: 'Andel unga vuxna', en: 'Youth bulge ratio' },
        description: { sv: 'Andel befolkning 15-29 år.', en: 'Share of population aged 15-29.' },
        unit: '%',
        sources: ['UN Population Division'],
        update_frequency: 'annual',
        reliability: 'high',
      },
      {
        id: 'dependency_ratio',
        name: { sv: 'Försörjningskvot', en: 'Dependency ratio' },
        description: { sv: 'Förhållande mellan arbetande och icke-arbetande befolkning.', en: 'Ratio of working to non-working population.' },
        unit: 'ratio',
        sources: ['World Bank', 'UN'],
        update_frequency: 'annual',
        reliability: 'high',
      },
      {
        id: 'urbanization_rate',
        name: { sv: 'Urbaniseringstakt', en: 'Urbanization rate' },
        description: { sv: 'Årlig förändring i stadsbefolkning.', en: 'Annual change in urban population.' },
        unit: '%',
        sources: ['UN-Habitat', 'World Bank'],
        update_frequency: 'annual',
        reliability: 'high',
      },
      {
        id: 'internal_migration',
        name: { sv: 'Intern migration', en: 'Internal migration' },
        description: { sv: 'Inrikes flyttmönster.', en: 'Domestic migration patterns.' },
        unit: 'index',
        sources: ['National statistics', 'IOM'],
        update_frequency: 'annual',
        reliability: 'low',
      },
    ],
    weight_range: [0, 100],
    default_weight: 10,
  },

  // ─────────────────────────────────────────────────────────
  // 2.4 RESOURCE & ENERGY DEPENDENCY
  // ─────────────────────────────────────────────────────────
  {
    id: 'resource_dependency',
    name: {
      sv: 'Resurs- och energiberoende',
      en: 'Resource & energy dependency',
    },
    description: {
      sv: 'Beroende av externa resurser och försörjningskedjor.',
      en: 'Dependency on external resources and supply chains.',
    },
    interpretation: {
      sv: 'Hög koncentration i försörjning ökar sårbarhet vid störningar.',
      en: 'High concentration in supply increases vulnerability to disruptions.',
    },
    what_this_does_not_mean: {
      sv: 'Importberoende är inte i sig negativt – det handlar om diversifiering.',
      en: 'Import dependency is not inherently negative – it\'s about diversification.',
    },
    indicators: [
      {
        id: 'energy_import_dependency',
        name: { sv: 'Energi-importberoende', en: 'Energy import dependency' },
        description: { sv: 'Andel energi som importeras.', en: 'Share of energy that is imported.' },
        unit: '%',
        sources: ['IEA', 'EIA'],
        update_frequency: 'annual',
        reliability: 'high',
      },
      {
        id: 'food_import_dependency',
        name: { sv: 'Mat-importberoende', en: 'Food import dependency' },
        description: { sv: 'Andel livsmedel som importeras.', en: 'Share of food that is imported.' },
        unit: '%',
        sources: ['FAO', 'World Bank'],
        update_frequency: 'annual',
        reliability: 'medium',
      },
      {
        id: 'price_volatility',
        name: { sv: 'Prisvolatilitet', en: 'Price volatility' },
        description: { sv: 'Variation i importpriser.', en: 'Variation in import prices.' },
        unit: 'index',
        sources: ['World Bank Commodity Markets'],
        update_frequency: 'monthly',
        reliability: 'high',
      },
      {
        id: 'infrastructure_diversification',
        name: { sv: 'Infrastrukturdiversifiering', en: 'Infrastructure diversification' },
        description: { sv: 'Antal alternativa försörjningsvägar.', en: 'Number of alternative supply routes.' },
        unit: 'index',
        sources: ['IEA', 'National statistics'],
        update_frequency: 'annual',
        reliability: 'medium',
      },
    ],
    weight_range: [0, 100],
    default_weight: 10,
  },

  // ─────────────────────────────────────────────────────────
  // 2.5 SOCIAL FRAGMENTATION
  // ─────────────────────────────────────────────────────────
  {
    id: 'social_fragmentation',
    name: {
      sv: 'Social fragmentering',
      en: 'Social fragmentation',
    },
    description: {
      sv: 'Samhällelig sammanhållning och tillit.',
      en: 'Societal cohesion and trust.',
    },
    interpretation: {
      sv: 'Låg tillit och hög ojämlikhet sammanfaller historiskt med högre spänningar.',
      en: 'Low trust and high inequality historically coincide with higher tensions.',
    },
    what_this_does_not_mean: {
      sv: 'Diversitet är inte fragmentation. Det handlar om integration och tillit.',
      en: 'Diversity is not fragmentation. It\'s about integration and trust.',
    },
    indicators: [
      {
        id: 'income_inequality',
        name: { sv: 'Inkomstspridning', en: 'Income inequality' },
        description: { sv: 'Gini-koefficient eller liknande mått.', en: 'Gini coefficient or similar measure.' },
        unit: 'index',
        sources: ['World Bank', 'OECD'],
        update_frequency: 'annual',
        reliability: 'high',
      },
      {
        id: 'segregation_proxy',
        name: { sv: 'Segregationsproxy', en: 'Segregation proxy' },
        description: { sv: 'Geografisk separation av grupper.', en: 'Geographic separation of groups.' },
        unit: 'index',
        sources: ['National statistics', 'Academic research'],
        update_frequency: 'annual',
        reliability: 'low',
      },
      {
        id: 'social_trust',
        name: { sv: 'Tillit (surveyaggregat)', en: 'Trust (survey aggregate)' },
        description: { sv: 'Generaliserad tillit enligt undersökningar.', en: 'Generalized trust according to surveys.' },
        unit: 'index',
        sources: ['World Values Survey', 'European Social Survey'],
        update_frequency: 'annual',
        reliability: 'medium',
      },
      {
        id: 'political_participation',
        name: { sv: 'Politiskt deltagande', en: 'Political participation' },
        description: { sv: 'Valdeltagande och medborgarengagemang.', en: 'Voter turnout and civic engagement.' },
        unit: '%',
        sources: ['IDEA', 'National statistics'],
        update_frequency: 'annual',
        reliability: 'high',
      },
    ],
    weight_range: [0, 100],
    default_weight: 15,
  },

  // ─────────────────────────────────────────────────────────
  // 2.6 SECURITY DYNAMICS (NON-OPERATIVE)
  // ─────────────────────────────────────────────────────────
  {
    id: 'security_dynamics',
    name: {
      sv: 'Säkerhetsdynamik (icke-operativ)',
      en: 'Security dynamics (non-operative)',
    },
    description: {
      sv: 'Försvarsutgifter och säkerhetsmönster utan operativa detaljer.',
      en: 'Defense spending and security patterns without operational details.',
    },
    interpretation: {
      sv: 'Snabba förändringar i säkerhetsutgifter kan spegla upplevda hot, inte nödvändigtvis avsikter.',
      en: 'Rapid changes in security spending may reflect perceived threats, not necessarily intentions.',
    },
    what_this_does_not_mean: {
      sv: 'Högre försvarsutgifter betyder inte aggression. Kontext är avgörande.',
      en: 'Higher defense spending does not mean aggression. Context is crucial.',
    },
    indicators: [
      {
        id: 'defense_spending_trend',
        name: { sv: 'Försvarsutgifter / BNP (trend)', en: 'Defense spending / GDP (trend)' },
        description: { sv: '5-årig förändring i försvarsandel.', en: '5-year change in defense share.' },
        unit: '%',
        sources: ['SIPRI', 'NATO'],
        update_frequency: 'annual',
        reliability: 'high',
      },
      {
        id: 'regional_arms_index',
        name: { sv: 'Regional upprustningstakt', en: 'Regional arms buildup rate' },
        description: { sv: 'Index över regional vapenimport.', en: 'Index of regional arms imports.' },
        unit: 'index',
        sources: ['SIPRI Arms Transfers Database'],
        update_frequency: 'annual',
        reliability: 'high',
      },
      {
        id: 'alliance_dependency',
        name: { sv: 'Alliansberoende', en: 'Alliance dependency' },
        description: { sv: 'Grad av säkerhetsberoende av allianser.', en: 'Degree of security dependency on alliances.' },
        unit: 'index',
        sources: ['Academic research', 'Policy institutes'],
        update_frequency: 'annual',
        reliability: 'medium',
      },
    ],
    weight_range: [0, 100],
    default_weight: 10,
  },

  // ─────────────────────────────────────────────────────────
  // 2.7 EXTERNAL SHOCKS
  // ─────────────────────────────────────────────────────────
  {
    id: 'external_shocks',
    name: {
      sv: 'Externa chocker',
      en: 'External shocks',
    },
    description: {
      sv: 'Exponering för klimat-, hälso- och handelsstörningar.',
      en: 'Exposure to climate, health, and trade disruptions.',
    },
    interpretation: {
      sv: 'Externa chocker förstärker befintliga svagheter snarare än skapar nya.',
      en: 'External shocks amplify existing weaknesses rather than create new ones.',
    },
    what_this_does_not_mean: {
      sv: 'Chocker leder inte automatiskt till konflikt – det beror på resiliens.',
      en: 'Shocks do not automatically lead to conflict – it depends on resilience.',
    },
    indicators: [
      {
        id: 'climate_events',
        name: { sv: 'Klimatrelaterade händelser', en: 'Climate-related events' },
        description: { sv: 'Frekvens av extremväder och naturkatastrofer.', en: 'Frequency of extreme weather and natural disasters.' },
        unit: 'events/year',
        sources: ['EM-DAT', 'NOAA'],
        update_frequency: 'annual',
        reliability: 'high',
      },
      {
        id: 'pandemic_impact',
        name: { sv: 'Pandemipåverkan', en: 'Pandemic impact' },
        description: { sv: 'Historisk påverkan av hälsokriser.', en: 'Historical impact of health crises.' },
        unit: 'index',
        sources: ['WHO', 'Johns Hopkins'],
        update_frequency: 'annual',
        reliability: 'high',
      },
      {
        id: 'trade_disruptions',
        name: { sv: 'Handelsstörningar', en: 'Trade disruptions' },
        description: { sv: 'Frekvens och allvarlighet av handelsavbrott.', en: 'Frequency and severity of trade interruptions.' },
        unit: 'index',
        sources: ['WTO', 'World Bank'],
        update_frequency: 'quarterly',
        reliability: 'medium',
      },
    ],
    weight_range: [0, 100],
    default_weight: 10,
  },

  // ─────────────────────────────────────────────────────────
  // 2.8 INFORMATION & LEGITIMACY STRESS
  // ─────────────────────────────────────────────────────────
  {
    id: 'legitimacy_stress',
    name: {
      sv: 'Informations- & legitimitetsstress',
      en: 'Information & legitimacy stress',
    },
    description: {
      sv: 'Mediefrihet, politiskt deltagande och policy-kontinuitet.',
      en: 'Media freedom, political participation, and policy continuity.',
    },
    interpretation: {
      sv: 'När legitimitet ifrågasätts ökar risken för politisk instabilitet.',
      en: 'When legitimacy is questioned, the risk of political instability increases.',
    },
    what_this_does_not_mean: {
      sv: 'Kritik av makten är inte instabilitet – det är en del av fungerande demokrati.',
      en: 'Criticism of power is not instability – it\'s part of functioning democracy.',
    },
    indicators: [
      {
        id: 'press_freedom',
        name: { sv: 'Mediefrihetsindex', en: 'Press freedom index' },
        description: { sv: 'Aggregerat mått på mediefrihet.', en: 'Aggregated measure of media freedom.' },
        unit: 'index',
        sources: ['Reporters Without Borders', 'Freedom House'],
        update_frequency: 'annual',
        reliability: 'medium',
      },
      {
        id: 'voter_turnout_trend',
        name: { sv: 'Valdeltagande (trend)', en: 'Voter turnout (trend)' },
        description: { sv: 'Förändring i valdeltagande över tid.', en: 'Change in voter turnout over time.' },
        unit: '%',
        sources: ['IDEA', 'National statistics'],
        update_frequency: 'annual',
        reliability: 'high',
      },
      {
        id: 'policy_continuity',
        name: { sv: 'Policy-kontinuitet', en: 'Policy continuity' },
        description: { sv: 'Stabilitet i centrala policybeslut.', en: 'Stability in central policy decisions.' },
        unit: 'index',
        sources: ['V-Dem', 'Academic research'],
        update_frequency: 'annual',
        reliability: 'low',
      },
    ],
    weight_range: [0, 100],
    default_weight: 15,
  },
];

// ============================================================
// RISK INDEX CONSTRAINTS (SAFE CONSTRUCTION)
// ============================================================

export const RISK_INDEX_CONFIG = {
  normalization_range: [0, 100] as [number, number],
  mandatory_disclaimer: {
    sv: 'Detta index reflekterar strukturell stress. Det förutsäger inte konflikt eller utfall.',
    en: 'This index reflects structural stress. It does not predict conflict or outcomes.',
  },
  visualization_rules: {
    allowed: [
      'soft_color_scales',      // Mjuka färgskalor
      'long_time_horizons',     // 10-30 år
      'similar_country_comparisons', // Endast liknande länder
    ],
    blocked: [
      'short_time_windows',     // Korta tidsfönster
      'dramatic_labels',        // Dramatiska etiketter
      'threat_level_language',  // "Hotnivå"-språk
    ],
  },
  color_scale: {
    low: 'hsl(var(--success))',      // Green-ish
    medium: 'hsl(var(--warning))',   // Amber-ish
    high: 'hsl(var(--muted))',       // Muted, not alarming red
  },
};

// ============================================================
// REPORT CONSTRAINTS (STRICT)
// ============================================================

export const REPORT_CONSTRAINTS = {
  allowed: [
    'structural_risk_profile',
    'driving_factors',
    'historical_context',
    'uncertainties',
  ],
  forbidden: [
    'conflict_scenarios',
    'actor_specific_outcomes',
    'time_dated_events',
  ],
};

// ============================================================
// ETHICS & LEGAL CHECK (AUTOMATIC)
// ============================================================

export const MISUSE_CHECKS = {
  language_filters: [
    'will_attack',
    'will_win',
    'must_strike',
    'optimal_target',
    'enemy_weakness',
  ],
  threshold_for_context: 0.7, // If risk > 70, require more context
  export_sanitizer: true,
};

// ============================================================
// UI LABELS & TEXT
// ============================================================

export const RISK_UI_TEXT = {
  section_title: {
    sv: 'Strukturella riskindikatorer',
    en: 'Structural risk indicators',
  },
  sensitivity_label: {
    sv: 'Känslighet',
    en: 'Sensitivity',
  },
  uncertainty_label: {
    sv: 'Osäkerhet',
    en: 'Uncertainty',
  },
  sources_label: {
    sv: 'Datakällor',
    en: 'Data sources',
  },
  what_drives_label: {
    sv: 'Vad driver indexet',
    en: 'What drives the index',
  },
  historical_response: {
    sv: 'Historiskt har denna domän bidragit mer till samlad stress än andra i liknande kontexter.',
    en: 'Historically, this domain has contributed more to overall stress than others in similar contexts.',
  },
};
