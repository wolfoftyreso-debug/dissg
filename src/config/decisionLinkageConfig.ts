/**
 * DECISION-KPI LINKAGE RULES
 * ═══════════════════════════════════════════════════════════════
 * 
 * Regler för hur beslut kopplas till KPI-utfall.
 * Systemet tillskriver aldrig åsikt, intention eller skuld.
 * Det tillskriver endast ansvar för beslut och observerat utfall.
 */

export interface DecisionLinkageRule {
  kpiCategory: string;
  minLagMonths: number;      // Minsta tid innan effekt kan mätas
  maxLagMonths: number;      // Maximal tid för att tillskriva effekt
  observationWindow: number; // Månader för att mäta stabil trend
  confidenceDecay: number;   // Hur snabbt konfidensen minskar med tid (0-1)
}

export interface GoverningPeriod {
  id: string;
  startDate: string;
  endDate: string | null;  // null = pågående
  parties: string[];
  label: string;
  responsibilityLevel: 'government' | 'municipality' | 'region';
}

export interface PolicyDecisionLink {
  decisionId: string;
  kpiId: string;
  decisionDate: string;
  expectedLagMonths: number;
  linkType: 'direct' | 'indirect' | 'contextual';
  confidence: number;
  rationale: string;
}

export interface OutcomeClassification {
  type: 'positive' | 'neutral' | 'negative' | 'unclear';
  label: string;
  description: string;
  criteria: string;
}

/**
 * TIDSFÖRDRÖJNINGSREGLER PER KPI-KATEGORI
 * ═══════════════════════════════════════════════════════════════
 * 
 * Olika policyområden har olika fördröjning innan effekt syns.
 * Detta är baserat på forskning och erfarenhet.
 */
export const CATEGORY_LINKAGE_RULES: Record<string, DecisionLinkageRule> = {
  demografi_halsa: {
    kpiCategory: 'demografi_halsa',
    minLagMonths: 12,        // Hälsoeffekter tar tid
    maxLagMonths: 60,        // 5 år max attribution
    observationWindow: 12,   // 1 år för stabil trend
    confidenceDecay: 0.15,   // Långsam decay
  },
  arbete_produktivitet: {
    kpiCategory: 'arbete_produktivitet',
    minLagMonths: 6,         // Arbetsmarknaden reagerar snabbare
    maxLagMonths: 36,        // 3 år max
    observationWindow: 6,    // Halvår för trend
    confidenceDecay: 0.20,
  },
  ekonomisk_barkraft: {
    kpiCategory: 'ekonomisk_barkraft',
    minLagMonths: 3,         // Ekonomiska indikatorer snabbare
    maxLagMonths: 24,        // 2 år max
    observationWindow: 6,
    confidenceDecay: 0.25,
  },
  social_stabilitet: {
    kpiCategory: 'social_stabilitet',
    minLagMonths: 12,        // Sociala förändringar tar tid
    maxLagMonths: 48,        // 4 år max
    observationWindow: 12,
    confidenceDecay: 0.15,
  },
  karnsystem_funktion: {
    kpiCategory: 'karnsystem_funktion',
    minLagMonths: 6,
    maxLagMonths: 36,
    observationWindow: 6,
    confidenceDecay: 0.20,
  },
  infrastruktur: {
    kpiCategory: 'infrastruktur',
    minLagMonths: 24,        // Infrastruktur tar lång tid
    maxLagMonths: 120,       // 10 år max
    observationWindow: 24,
    confidenceDecay: 0.10,
  },
  systemrisk_styrning: {
    kpiCategory: 'systemrisk_styrning',
    minLagMonths: 6,
    maxLagMonths: 24,
    observationWindow: 6,
    confidenceDecay: 0.25,
  },
};

/**
 * UTFALLSKLASSIFICERING
 * ═══════════════════════════════════════════════════════════════
 */
export const OUTCOME_CLASSIFICATIONS: OutcomeClassification[] = [
  {
    type: 'positive',
    label: 'Positivt utfall',
    description: 'Mätbar förbättring inom rimlig tid',
    criteria: 'Trend vänder positivt och håller i sig under observationsfönstret',
  },
  {
    type: 'neutral',
    label: 'Neutralt utfall',
    description: 'Ingen tydlig effekt',
    criteria: 'Ingen statistiskt signifikant förändring i trend eller nivå',
  },
  {
    type: 'negative',
    label: 'Negativt utfall',
    description: 'Fortsatt eller accelererad försämring',
    criteria: 'Trend försämras eller accelererar negativt efter beslut',
  },
  {
    type: 'unclear',
    label: 'Oklart utfall',
    description: 'För tidigt att bedöma eller otillräckliga data',
    criteria: 'Minsta lag-period har inte passerat eller data saknas',
  },
];

/**
 * Beräkna om ett beslut kan kopplas till ett KPI-utfall
 */
export function canLinkDecisionToOutcome(
  decisionDate: Date,
  kpiCategory: string,
  currentDate: Date = new Date()
): { canLink: boolean; reason: string; confidence: number } {
  const rule = CATEGORY_LINKAGE_RULES[kpiCategory];
  if (!rule) {
    return { canLink: false, reason: 'Okänd kategori', confidence: 0 };
  }

  const monthsSinceDecision = Math.floor(
    (currentDate.getTime() - decisionDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );

  if (monthsSinceDecision < rule.minLagMonths) {
    return {
      canLink: false,
      reason: `För tidigt att bedöma. Minsta tid: ${rule.minLagMonths} månader. Passerat: ${monthsSinceDecision} månader.`,
      confidence: 0,
    };
  }

  if (monthsSinceDecision > rule.maxLagMonths) {
    return {
      canLink: false,
      reason: `Tidsperioden har passerat. Max attribution: ${rule.maxLagMonths} månader.`,
      confidence: 0,
    };
  }

  // Beräkna konfidens baserat på tid
  const timeInWindow = monthsSinceDecision - rule.minLagMonths;
  const windowSize = rule.maxLagMonths - rule.minLagMonths;
  const decayFactor = 1 - (rule.confidenceDecay * (timeInWindow / windowSize));
  const confidence = Math.max(0.3, Math.min(1, decayFactor));

  return {
    canLink: true,
    reason: `Inom giltigt tidsfönster (${rule.minLagMonths}-${rule.maxLagMonths} månader)`,
    confidence,
  };
}

/**
 * Klassificera utfall baserat på trendförändring
 */
export function classifyOutcome(
  beforeTrend: number,      // Lutning före beslut
  afterTrend: number,       // Lutning efter beslut
  isInverted: boolean,      // Om lägre är bättre
  significanceThreshold: number = 0.05
): OutcomeClassification {
  const improvement = isInverted ? beforeTrend - afterTrend : afterTrend - beforeTrend;
  
  if (Math.abs(improvement) < significanceThreshold) {
    return OUTCOME_CLASSIFICATIONS.find(o => o.type === 'neutral')!;
  }
  
  if (improvement > 0) {
    return OUTCOME_CLASSIFICATIONS.find(o => o.type === 'positive')!;
  }
  
  return OUTCOME_CLASSIFICATIONS.find(o => o.type === 'negative')!;
}

/**
 * HISTORISKA STYRPERIODER (SVERIGE)
 * ═══════════════════════════════════════════════════════════════
 */
export const SWEDISH_GOVERNING_PERIODS: GoverningPeriod[] = [
  {
    id: 'gov_2022_present',
    startDate: '2022-10-18',
    endDate: null,
    parties: ['M', 'KD', 'L'],
    label: 'Regeringen Kristersson',
    responsibilityLevel: 'government',
  },
  {
    id: 'gov_2021_2022',
    startDate: '2021-11-30',
    endDate: '2022-10-17',
    parties: ['S'],
    label: 'Regeringen Andersson',
    responsibilityLevel: 'government',
  },
  {
    id: 'gov_2019_2021',
    startDate: '2019-01-21',
    endDate: '2021-11-29',
    parties: ['S', 'MP'],
    label: 'Regeringen Löfven II–III',
    responsibilityLevel: 'government',
  },
  {
    id: 'gov_2014_2018',
    startDate: '2014-10-03',
    endDate: '2019-01-20',
    parties: ['S', 'MP'],
    label: 'Regeringen Löfven I',
    responsibilityLevel: 'government',
  },
  {
    id: 'gov_2010_2014',
    startDate: '2010-10-05',
    endDate: '2014-10-02',
    parties: ['M', 'C', 'FP', 'KD'],
    label: 'Regeringen Reinfeldt II',
    responsibilityLevel: 'government',
  },
  {
    id: 'gov_2006_2010',
    startDate: '2006-10-06',
    endDate: '2010-10-04',
    parties: ['M', 'C', 'FP', 'KD'],
    label: 'Regeringen Reinfeldt I',
    responsibilityLevel: 'government',
  },
];

/**
 * Hitta styrperiod för ett datum
 */
export function getGoverningPeriodForDate(date: Date): GoverningPeriod | null {
  return SWEDISH_GOVERNING_PERIODS.find(period => {
    const start = new Date(period.startDate);
    const end = period.endDate ? new Date(period.endDate) : new Date();
    return date >= start && date <= end;
  }) || null;
}
