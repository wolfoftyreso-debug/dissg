/**
 * GLOBAL LAMBDA 1.0 – FORMAL SPECIFICATION
 * 
 * Technical standard-style definition.
 * Could be submitted to ISO, IEC, or used in control systems.
 * 
 * Document ID: GROS-LAMBDA-SPEC-1.0
 */

export const LAMBDA_FORMAL_SPEC = {
  documentId: 'GROS-LAMBDA-SPEC-1.0',
  version: '1.0.0',
  status: 'ACTIVE',
  effectiveDate: '2026-02-03',
  classification: 'Technical Standard',
  
  // ==========================================================================
  // SECTION 1: PURPOSE
  // ==========================================================================
  purpose: {
    sectionNumber: 1,
    title: { en: 'Purpose', sv: 'Syfte' },
    intended: {
      sv: [
        'Beskriva det faktiska tillståndet i ett komplext mänskligt system',
        'Möjliggöra jämförelse över tid, geografi och sektor',
        'Identifiera systemstress, obalanser och stabilitetsrisker',
        'Fungera som neutral referenspunkt för beslutsfattande',
      ],
      en: [
        'Describe the actual state of a complex human system',
        'Enable comparison across time, geography, and sector',
        'Identify system stress, imbalances, and stability risks',
        'Serve as a neutral reference point for decision-making',
      ],
    },
    notIntended: {
      sv: [
        'Föreslå åtgärder',
        'Värdera ideologi',
        'Ersätta demokratiska eller institutionella processer',
      ],
      en: [
        'Recommend actions',
        'Evaluate ideology',
        'Replace democratic or institutional processes',
      ],
    },
  },
  
  // ==========================================================================
  // SECTION 2: DEFINITION
  // ==========================================================================
  definition: {
    sectionNumber: 2,
    title: { en: 'Definition', sv: 'Definition' },
    text: {
      sv: 'Global Lambda (λ) är kvoten mellan ett systems observerade, aggregerade funktionsläge och dess empiriskt härledda optimala funktionsläge, givet kända fysiska, biologiska, ekonomiska och sociala begränsningar.',
      en: 'Global Lambda (λ) is the ratio between a system\'s observed, aggregated functional state and its empirically derived optimal functional state, given known physical, biological, economic, and social constraints.',
    },
    formula: {
      latex: 'λ = S_{observed} / S_{optimal}',
      display: 'λ = Sₒᵦₛₑᵣᵥₑₔ / Sₒₚₜᵢₘₐₗ',
    },
    variables: [
      { symbol: 'Sₒᵦₛₑᵣᵥₑₔ', description: { sv: 'Aktuellt systemläge', en: 'Current system state' } },
      { symbol: 'Sₒₚₜᵢₘₐₗ', description: { sv: 'Långsiktigt stabilt referensläge', en: 'Long-term stable reference state' } },
    ],
  },
  
  // ==========================================================================
  // SECTION 3: INTERPRETATION
  // ==========================================================================
  interpretation: {
    sectionNumber: 3,
    title: { en: 'Interpretation of λ-value', sv: 'Tolkning av λ-värde' },
    ranges: [
      {
        range: 'λ ≈ 1.0',
        state: { sv: 'Stabilt', en: 'Stable' },
        description: { sv: 'Optimal synergi, låg systemstress', en: 'Optimal synergy, low system stress' },
        color: 'primary',
      },
      {
        range: 'λ < 1.0',
        state: { sv: 'Överbelastat', en: 'Overloaded' },
        description: { sv: 'Ineffektivitet, social/ekonomisk friktion', en: 'Inefficiency, social/economic friction' },
        color: 'secondary',
      },
      {
        range: 'λ > 1.0',
        state: { sv: 'Resursstress', en: 'Resource Stress' },
        description: { sv: 'Undermatning, ökande kollapsrisk', en: 'Underfunding, increasing collapse risk' },
        color: 'warning',
      },
      {
        range: 'λ < 0.85',
        state: { sv: 'Kritisk zon', en: 'Critical Zone' },
        description: { sv: 'Ackumulerad systemstress', en: 'Accumulated system stress' },
        color: 'destructive',
      },
      {
        range: 'λ > 1.15',
        state: { sv: 'Kritisk zon', en: 'Critical Zone' },
        description: { sv: 'Ohållbar resursanvändning', en: 'Unsustainable resource use' },
        color: 'destructive',
      },
    ],
    note: {
      sv: 'Lambda är dimensionslös och jämförbar mellan system.',
      en: 'Lambda is dimensionless and comparable between systems.',
    },
  },
  
  // ==========================================================================
  // SECTION 4: SCOPE
  // ==========================================================================
  scope: {
    sectionNumber: 4,
    title: { en: 'System Boundaries (Scope)', sv: 'Systemgränser (Scope)' },
    intro: {
      sv: 'Lambda kan beräknas för valfri systemnivå, förutsatt tillräcklig datatäckning:',
      en: 'Lambda can be calculated for any system level, provided sufficient data coverage:',
    },
    levels: [
      { id: 'global', name: { sv: 'Global nivå', en: 'Global level' }, emoji: '🌍' },
      { id: 'national', name: { sv: 'Nationell nivå', en: 'National level' }, emoji: '🏳️' },
      { id: 'regional', name: { sv: 'Regional nivå', en: 'Regional level' }, emoji: '🗺️' },
      { id: 'municipal', name: { sv: 'Kommunal nivå', en: 'Municipal level' }, emoji: '🏘️' },
      { id: 'sector', name: { sv: 'Sektorsnivå (hälsa, energi, arbetsmarknad etc.)', en: 'Sector level (health, energy, labor market, etc.)' }, emoji: '🧩' },
    ],
    principle: {
      sv: 'Samma metodik gäller oavsett nivå.',
      en: 'The same methodology applies regardless of level.',
    },
  },
  
  // ==========================================================================
  // SECTION 5: SENSOR LAYER
  // ==========================================================================
  sensorLayer: {
    sectionNumber: 5,
    title: { en: 'Sensor Layer (Indicator Principle)', sv: 'Sensorlager (Indikatorprincip)' },
    intro: {
      sv: 'Lambda baseras inte på enskilda indikatorer utan på ett sensorlager bestående av flera normaliserade indikatorer, exempelvis:',
      en: 'Lambda is not based on individual indicators but on a sensor layer consisting of multiple normalized indicators, such as:',
    },
    categories: [
      { id: 'demographics', name: { sv: 'Demografi', en: 'Demographics' } },
      { id: 'health', name: { sv: 'Hälsa', en: 'Health' } },
      { id: 'economy', name: { sv: 'Ekonomi', en: 'Economy' } },
      { id: 'education', name: { sv: 'Utbildning', en: 'Education' } },
      { id: 'energy', name: { sv: 'Energi', en: 'Energy' } },
      { id: 'environment', name: { sv: 'Miljö', en: 'Environment' } },
      { id: 'safety', name: { sv: 'Säkerhet', en: 'Safety' } },
      { id: 'social_stability', name: { sv: 'Social stabilitet', en: 'Social stability' } },
    ],
    principles: [
      { sv: 'Ingen indikator är normativ i sig.', en: 'No indicator is normative in itself.' },
      { sv: 'Indikatorernas relevans avgörs av systempåverkan, inte politisk vikt.', en: 'Indicator relevance is determined by system impact, not political weight.' },
    ],
  },
  
  // ==========================================================================
  // SECTION 6: NORMALIZATION & WEIGHTING
  // ==========================================================================
  normalization: {
    sectionNumber: 6,
    title: { en: 'Normalization and Weighting', sv: 'Normalisering och viktning' },
    requirements: [
      { sv: 'Normaliseras till jämförbar skala', en: 'Normalized to comparable scale' },
      { sv: 'Tidsjusteras', en: 'Time-adjusted' },
      { sv: 'Märks med osäkerhetsintervall', en: 'Tagged with uncertainty intervals' },
      { sv: 'Viktas utifrån empirisk påverkan på systemstabilitet', en: 'Weighted based on empirical impact on system stability' },
    ],
    principle: {
      sv: 'Viktning är transparent, versionshanterad och reproducerbar.',
      en: 'Weighting is transparent, version-controlled, and reproducible.',
    },
  },
  
  // ==========================================================================
  // SECTION 7: OPTIMAL REFERENCE
  // ==========================================================================
  optimalReference: {
    sectionNumber: 7,
    title: { en: 'Optimal Reference (Sₒₚₜᵢₘₐₗ)', sv: 'Optimalreferens (Sₒₚₜᵢₘₐₗ)' },
    definition: {
      sv: 'Det historiskt och tvärsektoriellt observerade tillstånd där långsiktig stabilitet, mänsklig välfärd och resurseffektivitet samtidigt maximerats utan ökande systemstress.',
      en: 'The historically and cross-sectorally observed state where long-term stability, human welfare, and resource efficiency were simultaneously maximized without increasing system stress.',
    },
    properties: [
      { sv: 'Empiriskt härlett', en: 'Empirically derived' },
      { sv: 'Dynamiskt över tid', en: 'Dynamic over time' },
      { sv: 'Justerbart vid ny data', en: 'Adjustable with new data' },
    ],
    clarification: {
      sv: 'Inte ett ideal. Inte ett mål. Utan en referenspunkt.',
      en: 'Not an ideal. Not a goal. But a reference point.',
    },
  },
  
  // ==========================================================================
  // SECTION 8: UNCERTAINTY
  // ==========================================================================
  uncertainty: {
    sectionNumber: 8,
    title: { en: 'Uncertainty', sv: 'Osäkerhet' },
    intro: {
      sv: 'Varje Lambda-värde ska alltid presenteras med:',
      en: 'Every Lambda value shall always be presented with:',
    },
    requirements: [
      { sv: 'Konfidensintervall', en: 'Confidence interval' },
      { sv: 'Datatäckningsgrad', en: 'Data coverage rate' },
      { sv: 'Metodversion', en: 'Method version' },
      { sv: 'Källförteckning', en: 'Source list' },
    ],
    rule: {
      sv: 'Lambda utan osäkerhet är ogiltig.',
      en: 'Lambda without uncertainty is invalid.',
      severity: 'critical',
    },
  },
  
  // ==========================================================================
  // SECTION 9: LIMITATIONS
  // ==========================================================================
  limitations: {
    sectionNumber: 9,
    title: { en: 'Limitations', sv: 'Begränsningar' },
    statements: [
      { sv: 'Kan inte förutsäga framtiden exakt', en: 'Cannot predict the future exactly' },
      { sv: 'Ersätter inte djupanalys', en: 'Does not replace deep analysis' },
      { sv: 'Är inte ett beslutsmandat', en: 'Is not a decision mandate' },
    ],
    conclusion: {
      sv: 'Lambda är en indikator, inte en instruktion.',
      en: 'Lambda is an indicator, not an instruction.',
    },
  },
  
  // ==========================================================================
  // SECTION 10: USAGE PRINCIPLES
  // ==========================================================================
  usage: {
    sectionNumber: 10,
    title: { en: 'Usage Principle', sv: 'Användningsprincip' },
    allowed: {
      intro: { sv: 'Lambda är avsedd att användas som:', en: 'Lambda is intended to be used as:' },
      items: [
        { sv: 'Gemensam referens', en: 'Common reference' },
        { sv: 'Jämförelsemått', en: 'Comparison measure' },
        { sv: 'Varningssignal', en: 'Warning signal' },
        { sv: 'Uppföljningsverktyg', en: 'Follow-up tool' },
      ],
    },
    forbidden: {
      intro: { sv: 'Lambda får inte användas som:', en: 'Lambda must not be used as:' },
      items: [
        { sv: 'Politiskt slagträ', en: 'Political weapon' },
        { sv: 'Förenklat sanningspåstående', en: 'Simplified truth claim' },
        { sv: 'Isolerad beslutsgrund', en: 'Isolated decision basis' },
      ],
    },
  },
  
  // ==========================================================================
  // SECTION 11: CORE PRINCIPLE
  // ==========================================================================
  corePrinciple: {
    sectionNumber: 11,
    title: { en: 'Core Principle (Summary)', sv: 'Kärnprincip (sammanfattning)' },
    statement: {
      sv: 'Global Lambda 1.0 gör verklighet mätbar utan att göra den ideologisk.',
      en: 'Global Lambda 1.0 makes reality measurable without making it ideological.',
    },
  },
} as const;

export type LambdaFormalSpec = typeof LAMBDA_FORMAL_SPEC;
