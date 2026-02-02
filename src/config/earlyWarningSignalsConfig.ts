/**
 * MODULE — EARLY WARNING SIGNALS (EWS)
 * "Vad börjar röra sig nu – som historiskt föregår större förändringar?"
 * 
 * Förvarningslagret. Inte prognoser. Inte scenarier.
 * Utan svaga, tidiga mönster som ofta ignoreras tills det är för sent.
 * 
 * SYSTEMFRÅGA:
 * "Vilka mätbara signaler visar tidiga avvikelser som historiskt 
 * ofta föregått systemstress, trendbrott eller strukturella skiften?"
 * 
 * FOKUS: tidighet, låg synlighet, hög konsekvens.
 */

import type { StressDomain } from './decisionStressIndexConfig';

// ═══════════════════════════════════════════════════════════════
// KÄRNPRINCIP (ALDRIG BRYT)
// ═══════════════════════════════════════════════════════════════

export const EWS_CORE_PRINCIPLE = {
  statement: 'Tidiga signaler är inte problem. De är information om riktning.',
  statementEn: 'Early signals are not problems. They are information about direction.',
  enforced: true,
  
  system_question: {
    sv: 'Vilka mätbara signaler visar tidiga avvikelser som historiskt ofta föregått systemstress, trendbrott eller strukturella skiften?',
    en: 'Which measurable signals show early deviations that have historically often preceded system stress, trend breaks, or structural shifts?',
  },
  
  focus: ['timeliness', 'low_visibility', 'high_consequence'],
  
  never_say: [
    'will happen',
    'kommer hända',
    'is predicted',
    'förutses',
    'expect',
    'förväntas',
  ],
  
  always_say: [
    'has historically preceded',
    'har historiskt föregått',
    'is associated with',
    'är associerat med',
    'patterns similar to',
    'mönster liknande',
  ],
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK NA — SIGNAL INGEST (BRETT MEN RENT)
// ═══════════════════════════════════════════════════════════════

export type SignalDomain = 
  | 'health_micro'
  | 'labor_market'
  | 'education'
  | 'energy'
  | 'institutions'
  | 'economy'
  | 'environment';

export interface SignalSource {
  domain: SignalDomain;
  name: string;
  nameSv: string;
  rationale: string;
  rationaleSv: string;
  indicators: EarlyIndicator[];
  sensitivity: 'high' | 'medium' | 'low';
}

export interface EarlyIndicator {
  id: string;
  name: string;
  nameSv: string;
  description: string;
  descriptionSv: string;
  
  // Why this is an early signal
  early_because: string;
  early_becauseSv: string;
  
  // What it typically precedes
  historically_precedes: string[];
  typical_lead_time_months: [number, number]; // range
  
  unit: string;
  detection_method: 'trend_break' | 'acceleration' | 'variance' | 'clustering' | 'asymmetry';
}

export const SIGNAL_SOURCES: SignalSource[] = [
  {
    domain: 'health_micro',
    name: 'Health Microtrends',
    nameSv: 'Hälsomikrotrender',
    rationale: 'Sick leave types and care load changes precede broader health crises',
    rationaleSv: 'Sjukskrivningstyper och vårdbelastning föregår bredare hälsokriser',
    sensitivity: 'high',
    indicators: [
      {
        id: 'sick_leave_type_shift',
        name: 'Sick Leave Type Shift',
        nameSv: 'Sjukskrivningstypförändring',
        description: 'Changes in distribution of sick leave diagnoses',
        descriptionSv: 'Förändringar i fördelning av sjukskrivningsdiagnoser',
        early_because: 'Diagnosis mix changes before volume increases',
        early_becauseSv: 'Diagnosmix ändras innan volym ökar',
        historically_precedes: ['mental health crisis', 'workforce strain', 'productivity decline'],
        typical_lead_time_months: [6, 18],
        unit: 'distribution %',
        detection_method: 'clustering',
      },
      {
        id: 'er_visit_composition',
        name: 'ER Visit Composition',
        nameSv: 'Akutbesökssammansättning',
        description: 'Changes in emergency room visit types',
        descriptionSv: 'Förändringar i akutbesökstyper',
        early_because: 'ER composition shifts before capacity strain appears',
        early_becauseSv: 'Akutbesökssammansättning skiftar innan kapacitetsbrist syns',
        historically_precedes: ['healthcare capacity crisis', 'chronic disease surge'],
        typical_lead_time_months: [3, 12],
        unit: 'distribution %',
        detection_method: 'trend_break',
      },
      {
        id: 'prescription_pattern',
        name: 'Prescription Pattern Change',
        nameSv: 'Förskrivningsmönsterförändring',
        description: 'Shifts in medication prescription patterns',
        descriptionSv: 'Skift i läkemedelsförskrivningsmönster',
        early_because: 'Prescription changes reflect emerging health issues',
        early_becauseSv: 'Förskrivningsförändringar speglar framväxande hälsoproblem',
        historically_precedes: ['chronic disease trends', 'mental health changes'],
        typical_lead_time_months: [6, 24],
        unit: 'index',
        detection_method: 'acceleration',
      },
    ],
  },
  {
    domain: 'labor_market',
    name: 'Labor Market',
    nameSv: 'Arbetsmarknad',
    rationale: 'Part-time shifts, matching issues, and absence patterns precede employment crises',
    rationaleSv: 'Deltidsförändringar, matchningsproblem och frånvaromönster föregår sysselsättningskriser',
    sensitivity: 'high',
    indicators: [
      {
        id: 'involuntary_parttime',
        name: 'Involuntary Part-time Rate',
        nameSv: 'Ofrivillig deltidsgrad',
        description: 'Share of part-time workers who want full-time',
        descriptionSv: 'Andel deltidsarbetande som vill ha heltid',
        early_because: 'Involuntary part-time rises before unemployment',
        early_becauseSv: 'Ofrivillig deltid stiger före arbetslöshet',
        historically_precedes: ['unemployment increase', 'income decline'],
        typical_lead_time_months: [6, 12],
        unit: '%',
        detection_method: 'acceleration',
      },
      {
        id: 'matching_efficiency',
        name: 'Matching Efficiency',
        nameSv: 'Matchningseffektivitet',
        description: 'Time to fill vacancies vs available workers',
        descriptionSv: 'Tid att fylla vakanser vs tillgängliga arbetare',
        early_because: 'Matching problems precede structural unemployment',
        early_becauseSv: 'Matchningsproblem föregår strukturell arbetslöshet',
        historically_precedes: ['skills mismatch crisis', 'long-term unemployment'],
        typical_lead_time_months: [12, 36],
        unit: 'ratio',
        detection_method: 'trend_break',
      },
      {
        id: 'short_sick_leave',
        name: 'Short-term Sick Leave Frequency',
        nameSv: 'Korttidssjukfrånvarofrekvens',
        description: 'Frequency of 1-3 day sick leaves',
        descriptionSv: 'Frekvens av 1-3 dagars sjukfrånvaro',
        early_because: 'Short absences often precede burnout waves',
        early_becauseSv: 'Kort frånvaro föregår ofta utmattningsvågor',
        historically_precedes: ['burnout epidemic', 'workforce attrition'],
        typical_lead_time_months: [3, 9],
        unit: 'events per 100 workers',
        detection_method: 'variance',
      },
    ],
  },
  {
    domain: 'education',
    name: 'Education',
    nameSv: 'Utbildning',
    rationale: 'Dropouts and grade drifts precede skills and employability issues',
    rationaleSv: 'Avhopp och betygsglidning föregår kompetens- och anställbarhetsproblem',
    sensitivity: 'medium',
    indicators: [
      {
        id: 'dropout_acceleration',
        name: 'Dropout Rate Acceleration',
        nameSv: 'Avhoppsratsacceleration',
        description: 'Rate of change in school dropout rates',
        descriptionSv: 'Förändringstakt i skolavhoppsfrekvens',
        early_because: 'Dropout acceleration precedes workforce quality issues',
        early_becauseSv: 'Avhoppsacceleration föregår kvalitetsproblem i arbetskraft',
        historically_precedes: ['youth unemployment', 'skills shortage'],
        typical_lead_time_months: [24, 60],
        unit: '%/year',
        detection_method: 'acceleration',
      },
      {
        id: 'grade_distribution_shift',
        name: 'Grade Distribution Shift',
        nameSv: 'Betygsfördelningsskift',
        description: 'Changes in grade distribution patterns',
        descriptionSv: 'Förändringar i betygsfördelning',
        early_because: 'Grade shifts often precede visible quality changes',
        early_becauseSv: 'Betygsskift föregår ofta synliga kvalitetsförändringar',
        historically_precedes: ['educational quality decline', 'international ranking drops'],
        typical_lead_time_months: [12, 36],
        unit: 'distribution index',
        detection_method: 'clustering',
      },
      {
        id: 'teacher_turnover',
        name: 'Teacher Turnover Pattern',
        nameSv: 'Läráromsättningsmönster',
        description: 'Changes in teacher turnover by region/subject',
        descriptionSv: 'Förändringar i läráromsättning per region/ämne',
        early_because: 'Teacher attrition patterns precede quality issues',
        early_becauseSv: 'Läraravgångsmönster föregår kvalitetsproblem',
        historically_precedes: ['teacher shortage crisis', 'educational inequality'],
        typical_lead_time_months: [12, 24],
        unit: '%/year',
        detection_method: 'asymmetry',
      },
    ],
  },
  {
    domain: 'energy',
    name: 'Energy System',
    nameSv: 'Energisystem',
    rationale: 'Volatility and grid disturbances precede capacity crises',
    rationaleSv: 'Volatilitet och nätstörningar föregår kapacitetskriser',
    sensitivity: 'high',
    indicators: [
      {
        id: 'price_volatility_pattern',
        name: 'Price Volatility Pattern',
        nameSv: 'Prisvolatilitetsmönster',
        description: 'Changes in energy price volatility structure',
        descriptionSv: 'Förändringar i energiprisvolatilitetsstruktur',
        early_because: 'Volatility structure changes before price spikes',
        early_becauseSv: 'Volatilitetsstruktur ändras före prishopp',
        historically_precedes: ['energy price crisis', 'supply disruption'],
        typical_lead_time_months: [1, 6],
        unit: 'volatility index',
        detection_method: 'variance',
      },
      {
        id: 'grid_disturbance_frequency',
        name: 'Grid Disturbance Frequency',
        nameSv: 'Nätstörningsfrekvens',
        description: 'Frequency of minor grid disturbances',
        descriptionSv: 'Frekvens av mindre nätstörningar',
        early_because: 'Minor disturbances cluster before major outages',
        early_becauseSv: 'Mindre störningar klustrar före större avbrott',
        historically_precedes: ['grid failure', 'capacity emergency'],
        typical_lead_time_months: [1, 3],
        unit: 'events/month',
        detection_method: 'clustering',
      },
      {
        id: 'reserve_margin_trend',
        name: 'Reserve Margin Trend',
        nameSv: 'Reservmarginaltrend',
        description: 'Direction and speed of reserve margin changes',
        descriptionSv: 'Riktning och hastighet för reservmarginalförändringar',
        early_because: 'Reserve margin erosion precedes capacity crunch',
        early_becauseSv: 'Reservmarginalerosion föregår kapacitetsbrist',
        historically_precedes: ['capacity shortage', 'rolling blackouts'],
        typical_lead_time_months: [6, 18],
        unit: '%/year',
        detection_method: 'trend_break',
      },
    ],
  },
  {
    domain: 'institutions',
    name: 'Institutional Function',
    nameSv: 'Institutionell funktion',
    rationale: 'Processing times and turnover precede implementation failures',
    rationaleSv: 'Handläggningstider och omsättning föregår implementeringssvikt',
    sensitivity: 'medium',
    indicators: [
      {
        id: 'processing_time_variance',
        name: 'Processing Time Variance',
        nameSv: 'Handläggningstidsvarians',
        description: 'Variability in case processing times',
        descriptionSv: 'Variabilitet i ärendehandläggningstider',
        early_because: 'Variance increases before average times rise',
        early_becauseSv: 'Varians ökar innan genomsnittstider stiger',
        historically_precedes: ['service backlog', 'institutional capacity crisis'],
        typical_lead_time_months: [3, 12],
        unit: 'coefficient of variation',
        detection_method: 'variance',
      },
      {
        id: 'staff_turnover_pattern',
        name: 'Staff Turnover Pattern',
        nameSv: 'Personalomsättningsmönster',
        description: 'Changes in staff turnover by role/department',
        descriptionSv: 'Förändringar i personalomsättning per roll/avdelning',
        early_because: 'Key position turnover precedes capability loss',
        early_becauseSv: 'Nyckelpositionsomsättning föregår kapabilitetsförlust',
        historically_precedes: ['competence loss', 'institutional dysfunction'],
        typical_lead_time_months: [6, 18],
        unit: '%/year',
        detection_method: 'asymmetry',
      },
      {
        id: 'appeals_rate',
        name: 'Appeals Rate Change',
        nameSv: 'Överklagandefrekvensförändring',
        description: 'Rate of appeals against decisions',
        descriptionSv: 'Frekvens av överklaganden mot beslut',
        early_because: 'Rising appeals precede trust erosion',
        early_becauseSv: 'Ökande överklaganden föregår tillitserosion',
        historically_precedes: ['legitimacy crisis', 'reform pressure'],
        typical_lead_time_months: [6, 24],
        unit: '%',
        detection_method: 'acceleration',
      },
    ],
  },
  {
    domain: 'economy',
    name: 'Economic Dispersion',
    nameSv: 'Ekonomisk spridning',
    rationale: 'Dispersion patterns, not averages, precede instability',
    rationaleSv: 'Spridningsmönster, inte snitt, föregår instabilitet',
    sensitivity: 'high',
    indicators: [
      {
        id: 'income_dispersion_change',
        name: 'Income Dispersion Change',
        nameSv: 'Inkomstspridningsförändring',
        description: 'Rate of change in income distribution spread',
        descriptionSv: 'Förändringstakt i inkomstfördelningsspridning',
        early_because: 'Dispersion widens before visible inequality',
        early_becauseSv: 'Spridning ökar innan synlig ojämlikhet',
        historically_precedes: ['social tension', 'consumption decline'],
        typical_lead_time_months: [12, 36],
        unit: 'Gini change/year',
        detection_method: 'acceleration',
      },
      {
        id: 'business_mortality_pattern',
        name: 'Business Mortality Pattern',
        nameSv: 'Företagsdödlighetsmönster',
        description: 'Changes in business closure patterns by size/sector',
        descriptionSv: 'Förändringar i nedläggningsmönster per storlek/sektor',
        early_because: 'Closure pattern shifts before aggregate data moves',
        early_becauseSv: 'Nedläggningsmönster skiftar före aggregerade data rör sig',
        historically_precedes: ['recession', 'sector restructuring'],
        typical_lead_time_months: [3, 12],
        unit: 'pattern index',
        detection_method: 'clustering',
      },
      {
        id: 'credit_access_dispersion',
        name: 'Credit Access Dispersion',
        nameSv: 'Kreditåtkomstspridning',
        description: 'Variance in credit conditions across groups',
        descriptionSv: 'Varians i kreditvillkor mellan grupper',
        early_because: 'Credit tightening is uneven before aggregate contraction',
        early_becauseSv: 'Kreditåtstramning är ojämn före aggregerad kontraktion',
        historically_precedes: ['credit crunch', 'investment decline'],
        typical_lead_time_months: [3, 9],
        unit: 'dispersion index',
        detection_method: 'asymmetry',
      },
    ],
  },
  {
    domain: 'environment',
    name: 'Environmental Frequency',
    nameSv: 'Miljöfrekvens',
    rationale: 'Event frequency changes, not averages, precede thresholds',
    rationaleSv: 'Händelsefrekvensförändringar, inte snitt, föregår trösklar',
    sensitivity: 'medium',
    indicators: [
      {
        id: 'extreme_event_clustering',
        name: 'Extreme Event Clustering',
        nameSv: 'Extremhändelseklustring',
        description: 'Temporal and spatial clustering of extreme events',
        descriptionSv: 'Temporal och rumslig klustring av extremhändelser',
        early_because: 'Clustering patterns change before frequency increases',
        early_becauseSv: 'Klustringsmönster ändras innan frekvens ökar',
        historically_precedes: ['extreme event surge', 'threshold crossing'],
        typical_lead_time_months: [6, 24],
        unit: 'clustering index',
        detection_method: 'clustering',
      },
      {
        id: 'seasonal_pattern_deviation',
        name: 'Seasonal Pattern Deviation',
        nameSv: 'Säsongsmönsteravvikelse',
        description: 'Deviation from historical seasonal patterns',
        descriptionSv: 'Avvikelse från historiska säsongsmönster',
        early_because: 'Seasonal shifts precede visible climate impacts',
        early_becauseSv: 'Säsongsskift föregår synliga klimateffekter',
        historically_precedes: ['agricultural disruption', 'ecosystem stress'],
        typical_lead_time_months: [12, 48],
        unit: 'deviation index',
        detection_method: 'trend_break',
      },
      {
        id: 'species_indicator_shift',
        name: 'Species Indicator Shift',
        nameSv: 'Artindikatorskift',
        description: 'Changes in indicator species presence/behavior',
        descriptionSv: 'Förändringar i indikatorarters närvaro/beteende',
        early_because: 'Indicator species react before system-wide changes',
        early_becauseSv: 'Indikatorarter reagerar före systemomfattande förändringar',
        historically_precedes: ['ecosystem transition', 'biodiversity crisis'],
        typical_lead_time_months: [12, 60],
        unit: 'presence index',
        detection_method: 'trend_break',
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// BLOCK NB — SIGNAL DETECTION ENGINE
// ═══════════════════════════════════════════════════════════════

export type DetectionMethod = 
  | 'trend_break'      // First derivative analysis
  | 'acceleration'     // Second derivative analysis
  | 'variance'         // Increased variability
  | 'clustering'       // Pattern formation
  | 'asymmetry';       // Who is affected first?

export interface DetectionResult {
  indicator_id: string;
  method: DetectionMethod;
  
  detected_at: string;
  detection_strength: number; // 0-1
  
  values: {
    baseline: number;
    current: number;
    change: number;
    change_type: 'increase' | 'decrease' | 'shift';
  };
  
  statistical: {
    z_score: number;
    p_value: number;
    confidence_interval: [number, number];
  };
  
  is_candidate_signal: boolean;
  candidate_reason?: string;
}

export const DETECTION_METHODS: Record<DetectionMethod, { 
  name: string; 
  nameSv: string; 
  description: string;
  sensitivity_threshold: number;
}> = {
  trend_break: {
    name: 'Trend Break',
    nameSv: 'Trendbrott',
    description: 'Detects changes in direction or slope of trend',
    sensitivity_threshold: 2.0, // z-score
  },
  acceleration: {
    name: 'Acceleration',
    nameSv: 'Acceleration',
    description: 'Detects changes in rate of change',
    sensitivity_threshold: 1.5,
  },
  variance: {
    name: 'Increased Variance',
    nameSv: 'Ökad varians',
    description: 'Detects increased variability or instability',
    sensitivity_threshold: 1.8,
  },
  clustering: {
    name: 'Clustering',
    nameSv: 'Klustring',
    description: 'Detects pattern formation or grouping',
    sensitivity_threshold: 1.5,
  },
  asymmetry: {
    name: 'Asymmetry',
    nameSv: 'Asymmetri',
    description: 'Detects uneven distribution of effects',
    sensitivity_threshold: 1.5,
  },
};

// ═══════════════════════════════════════════════════════════════
// BLOCK NC — HISTORICAL PRECEDENT MATCHING
// ═══════════════════════════════════════════════════════════════

export interface HistoricalPrecedent {
  id: string;
  period: string;
  period_start: string;
  period_end: string;
  
  location: 'global' | string; // country code or 'global'
  
  signal_pattern: {
    domain: SignalDomain;
    indicator_id: string;
    pattern_type: DetectionMethod;
    magnitude: number;
  };
  
  what_followed: {
    outcome: string;
    outcomeSv: string;
    severity: 'minor' | 'moderate' | 'major' | 'severe';
    time_to_manifest_months: number;
  };
  
  similarity_factors: string[];
  key_differences: string[];
}

export interface PrecedentMatch {
  current_signal: DetectionResult;
  matched_precedent: HistoricalPrecedent;
  
  similarity_score: number; // 0-1
  
  match_factors: Array<{
    factor: string;
    match_strength: number;
  }>;
  
  difference_factors: Array<{
    factor: string;
    current_value: string;
    historical_value: string;
    impact_on_match: 'weakens' | 'neutral' | 'strengthens';
  }>;
  
  interpretation: {
    sv: string;
    en: string;
  };
}

// Standard framing for precedent matches
export const PRECEDENT_FRAMING = {
  standard_sv: 'Detta har ofta föregått',
  standard_en: 'This has often preceded',
  
  weak_sv: 'Liknande mönster har ibland associerats med',
  weak_en: 'Similar patterns have sometimes been associated with',
  
  strong_sv: 'Historiskt har detta mönster ofta föregått',
  strong_en: 'Historically, this pattern has often preceded',
  
  disclaimer_sv: 'Historiska mönster garanterar inte framtida utfall.',
  disclaimer_en: 'Historical patterns do not guarantee future outcomes.',
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK ND — SIGNAL CLASSIFICATION
// ═══════════════════════════════════════════════════════════════

export type SignalClass = 
  | 'structural_precursor'  // Precedes systemic shifts
  | 'stress_amplifier'      // Worsens other issues
  | 'transient_noise'       // Short-lived, not meaningful
  | 'context_dependent';    // Depends on environment

export interface ClassifiedSignal {
  indicator_id: string;
  detection: DetectionResult;
  precedent_matches: PrecedentMatch[];
  
  classification: SignalClass;
  classification_confidence: number;
  classification_rationale: string;
  classification_rationaleSv: string;
  
  metrics: {
    signal_strength: number;      // 0-1
    confidence: number;           // 0-1
    observed_scope: 'local' | 'regional' | 'national' | 'global';
    time_to_effect_range: [number, number]; // months
  };
  
  context_requirements?: string[]; // For context-dependent signals
}

export const SIGNAL_CLASS_DEFINITIONS: Record<SignalClass, {
  name: string;
  nameSv: string;
  description: string;
  descriptionSv: string;
  typical_action_relevance: 'high' | 'medium' | 'low';
}> = {
  structural_precursor: {
    name: 'Structural Precursor',
    nameSv: 'Strukturell föregångare',
    description: 'Often precedes fundamental system changes',
    descriptionSv: 'Föregår ofta fundamentala systemförändringar',
    typical_action_relevance: 'high',
  },
  stress_amplifier: {
    name: 'Stress Amplifier',
    nameSv: 'Stressförstärkare',
    description: 'May worsen existing stress in other domains',
    descriptionSv: 'Kan förvärra befintlig stress i andra domäner',
    typical_action_relevance: 'medium',
  },
  transient_noise: {
    name: 'Transient Noise',
    nameSv: 'Övergående brus',
    description: 'Likely short-lived, not indicative of larger change',
    descriptionSv: 'Troligen kortlivad, inte indikation på större förändring',
    typical_action_relevance: 'low',
  },
  context_dependent: {
    name: 'Context-Dependent',
    nameSv: 'Kontextberoende',
    description: 'Significance depends on other conditions',
    descriptionSv: 'Betydelse beror på andra förhållanden',
    typical_action_relevance: 'medium',
  },
};

// ═══════════════════════════════════════════════════════════════
// BLOCK NE — EARLY WARNING INDEX (EWI)
// ═══════════════════════════════════════════════════════════════

export type EWILevel = 'low' | 'moderate' | 'elevated' | 'high';

export interface EarlyWarningIndex {
  overall_ewi: number; // 0-1
  level: EWILevel;
  
  components: {
    active_signal_count: number;
    weighted_signal_strength: number;
    domain_spread: number; // How many domains have signals
    dsi_covariance: number; // Correlation with Decision Stress Index
  };
  
  active_signals: Array<{
    signal: ClassifiedSignal;
    contribution_to_ewi: number;
  }>;
  
  domain_breakdown: Record<SignalDomain, {
    signal_count: number;
    max_strength: number;
    primary_signal?: string;
  }>;
  
  trend: 'decreasing' | 'stable' | 'increasing';
  
  as_of: string;
}

export const EWI_LEVEL_THRESHOLDS: Record<EWILevel, { min: number; max: number; color: string }> = {
  low: { min: 0, max: 0.25, color: 'hsl(var(--muted-foreground))' },
  moderate: { min: 0.25, max: 0.5, color: 'hsl(var(--info))' },
  elevated: { min: 0.5, max: 0.75, color: 'hsl(var(--warning))' },
  high: { min: 0.75, max: 1.0, color: 'hsl(var(--destructive) / 0.7)' },
};

// ═══════════════════════════════════════════════════════════════
// BLOCK NF — "WHAT'S STARTING TO MOVE?"
// ═══════════════════════════════════════════════════════════════

export interface WhatsMovingItem {
  signal: ClassifiedSignal;
  
  what: string;
  whatSv: string;
  
  where: string;
  whereSv: string;
  
  who_affected_first: string;
  who_affected_firstSv: string;
  
  why_interesting: string;
  why_interestingSv: string;
  
  historical_association: string;
  historical_associationSv: string;
}

export interface WhatsMovingView {
  title: string;
  titleSv: string;
  
  items: WhatsMovingItem[];
  
  summary: {
    sv: string;
    en: string;
  };
  
  as_of: string;
  update_frequency: string;
}

// Standard formulation (ALWAYS use this pattern)
export const WHATS_MOVING_TEMPLATE = {
  pattern_sv: 'Observerad avvikelse – historiskt associerad med {outcome}',
  pattern_en: 'Observed deviation – historically associated with {outcome}',
  
  uncertainty_qualifier_sv: 'Detta är en svag signal. Sambandet är historiskt, inte kausalt.',
  uncertainty_qualifier_en: 'This is a weak signal. The association is historical, not causal.',
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK NG — FALSE POSITIVE GUARD
// ═══════════════════════════════════════════════════════════════

export interface FalsePositiveGuard {
  rules: FalsePositiveRule[];
  alarm_history: AlarmHistoryEntry[];
  credibility_score: number;
}

export interface FalsePositiveRule {
  id: string;
  name: string;
  nameSv: string;
  description: string;
  enforcement: 'require' | 'recommend';
}

export interface AlarmHistoryEntry {
  signal_id: string;
  raised_at: string;
  outcome: 'confirmed' | 'false_positive' | 'pending' | 'inconclusive';
  notes?: string;
}

export const FALSE_POSITIVE_RULES: FalsePositiveRule[] = [
  {
    id: 'multiple_independent',
    name: 'Multiple Independent Signals',
    nameSv: 'Flera oberoende signaler',
    description: 'Require at least 2 independent signals before elevated alert',
    enforcement: 'require',
  },
  {
    id: 'normalization_downgrade',
    name: 'Normalization Downgrade',
    nameSv: 'Normaliseringsnedgradering',
    description: 'Downgrade signal if values return to normal range',
    enforcement: 'require',
  },
  {
    id: 'false_alarm_history',
    name: 'False Alarm History Display',
    nameSv: 'Visa falsklarmshistorik',
    description: 'Always show historical accuracy of similar signals',
    enforcement: 'require',
  },
  {
    id: 'confidence_decay',
    name: 'Confidence Decay',
    nameSv: 'Konfidensavtagande',
    description: 'Reduce confidence for prolonged unconfirmed signals',
    enforcement: 'recommend',
  },
];

export const CREDIBILITY_PRINCIPLE = {
  statement_sv: 'Trovärdighet > snabbhet',
  statement_en: 'Credibility > speed',
  enforced: true,
} as const;

// ═══════════════════════════════════════════════════════════════
// BLOCK NH — EWS × BLIND SPOTS × DSI (CROSSING)
// ═══════════════════════════════════════════════════════════════

export type SensitivityZone = 'normal' | 'watch' | 'elevated' | 'high_sensitivity';

export interface CrossingAnalysis {
  signal: ClassifiedSignal;
  
  in_blind_spot: boolean;
  blind_spot_score?: number;
  
  in_high_stress_environment: boolean;
  stress_domain?: StressDomain;
  stress_level?: number;
  
  sensitivity_zone: SensitivityZone;
  
  reasoning: {
    sv: string;
    en: string;
  };
}

export function determineSensitivityZone(
  signal_strength: number,
  in_blind_spot: boolean,
  stress_level: number
): SensitivityZone {
  // High Sensitivity Zone: early signal + blind spot + high stress
  if (signal_strength >= 0.4 && in_blind_spot && stress_level >= 0.6) {
    return 'high_sensitivity';
  }
  
  // Elevated: Two of three conditions
  const conditions = [
    signal_strength >= 0.4,
    in_blind_spot,
    stress_level >= 0.5,
  ].filter(Boolean).length;
  
  if (conditions >= 2) return 'elevated';
  if (conditions >= 1) return 'watch';
  return 'normal';
}

export const SENSITIVITY_ZONE_DEFINITIONS: Record<SensitivityZone, {
  name: string;
  nameSv: string;
  description: string;
  descriptionSv: string;
  display_priority: number;
}> = {
  high_sensitivity: {
    name: 'High Sensitivity Zone',
    nameSv: 'Hög känslighetszon',
    description: 'Early signal in blind spot within high stress environment',
    descriptionSv: 'Tidig signal i blind fläck inom högstressmiljö',
    display_priority: 1,
  },
  elevated: {
    name: 'Elevated Attention',
    nameSv: 'Förhöjd uppmärksamhet',
    description: 'Multiple risk factors present',
    descriptionSv: 'Flera riskfaktorer närvarande',
    display_priority: 2,
  },
  watch: {
    name: 'Watch',
    nameSv: 'Bevaka',
    description: 'Single risk factor, monitoring recommended',
    descriptionSv: 'Enskild riskfaktor, bevakning rekommenderas',
    display_priority: 3,
  },
  normal: {
    name: 'Normal',
    nameSv: 'Normal',
    description: 'Within expected parameters',
    descriptionSv: 'Inom förväntade parametrar',
    display_priority: 4,
  },
};

// ═══════════════════════════════════════════════════════════════
// BLOCK NI — UI & LANGUAGE (VERY IMPORTANT)
// ═══════════════════════════════════════════════════════════════

export const EWS_LANGUAGE_RULES = {
  tone: 'low-key, measured, uncertain',
  
  forbidden_patterns: [
    { pattern: /will\s+(happen|occur|result)/i, reason: 'Implies certainty' },
    { pattern: /kommer\s+(att\s+)?(hända|ske|resultera)/i, reason: 'Implies certainty' },
    { pattern: /urgent|akut|brådskande/i, reason: 'Creates alarm' },
    { pattern: /deadline|deadline|tidsfrist/i, reason: 'Implies time pressure' },
    { pattern: /crisis\s+coming|kris\s+kommer/i, reason: 'Predictive language' },
    { pattern: /must\s+act|måste\s+agera/i, reason: 'Prescriptive' },
  ],
  
  required_qualifiers: [
    'historically',
    'often',
    'sometimes',
    'may',
    'could',
    'associated with',
    'historiskt',
    'ofta',
    'ibland',
    'kan',
    'skulle kunna',
    'associerat med',
  ],
  
  standard_signal_text: {
    sv: 'Denna signal är svag men återkommande. Historiskt har liknande mönster ibland föregått större förändringar.',
    en: 'This signal is weak but recurring. Historically, similar patterns have sometimes preceded larger changes.',
  },
  
  colors: {
    rule: 'Use muted colors only. No alarming reds/yellows for weak signals.',
    palette: ['muted', 'muted-foreground', 'info', 'warning/50'],
    never_use: ['destructive (except for high_sensitivity)', 'bright_red', 'urgent_orange'],
  },
  
  uncertainty_display: 'always_visible',
} as const;

export function validateEWSLanguage(text: string): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  
  for (const rule of EWS_LANGUAGE_RULES.forbidden_patterns) {
    if (rule.pattern.test(text)) {
      violations.push(`${rule.reason}: matches forbidden pattern`);
    }
  }
  
  return { valid: violations.length === 0, violations };
}

// ═══════════════════════════════════════════════════════════════
// CALCULATION HELPERS
// ═══════════════════════════════════════════════════════════════

export function calculateEWI(signals: ClassifiedSignal[], dsi_correlation: number): EarlyWarningIndex {
  const activeSignals = signals.filter(s => 
    s.classification !== 'transient_noise' && s.metrics.signal_strength >= 0.3
  );
  
  const signalCount = activeSignals.length;
  const avgStrength = activeSignals.length > 0
    ? activeSignals.reduce((sum, s) => sum + s.metrics.signal_strength, 0) / activeSignals.length
    : 0;
  
  const domains = new Set(activeSignals.map(s => {
    const source = SIGNAL_SOURCES.find(src => 
      src.indicators.some(ind => ind.id === s.indicator_id)
    );
    return source?.domain;
  }));
  const domainSpread = domains.size / SIGNAL_SOURCES.length;
  
  // Weighted combination
  const overall = (
    Math.min(signalCount / 10, 1) * 0.3 +
    avgStrength * 0.35 +
    domainSpread * 0.2 +
    dsi_correlation * 0.15
  );
  
  const ewi = Math.min(1, Math.max(0, overall));
  
  const level: EWILevel = 
    ewi >= 0.75 ? 'high' :
    ewi >= 0.5 ? 'elevated' :
    ewi >= 0.25 ? 'moderate' : 'low';
  
  return {
    overall_ewi: ewi,
    level,
    components: {
      active_signal_count: signalCount,
      weighted_signal_strength: avgStrength,
      domain_spread: domainSpread,
      dsi_covariance: dsi_correlation,
    },
    active_signals: activeSignals.map(s => ({
      signal: s,
      contribution_to_ewi: s.metrics.signal_strength / signalCount,
    })),
    domain_breakdown: {} as any, // Would be computed from actual signals
    trend: 'stable',
    as_of: new Date().toISOString(),
  };
}

export function matchHistoricalPrecedents(
  signal: DetectionResult,
  precedents: HistoricalPrecedent[]
): PrecedentMatch[] {
  return precedents
    .filter(p => p.signal_pattern.indicator_id === signal.indicator_id)
    .map(p => ({
      current_signal: signal,
      matched_precedent: p,
      similarity_score: 0.7, // Would be calculated
      match_factors: [],
      difference_factors: [],
      interpretation: {
        sv: `${PRECEDENT_FRAMING.standard_sv} ${p.what_followed.outcomeSv}`,
        en: `${PRECEDENT_FRAMING.standard_en} ${p.what_followed.outcome}`,
      },
    }))
    .sort((a, b) => b.similarity_score - a.similarity_score);
}

// ═══════════════════════════════════════════════════════════════
// SYSTEM STATUS
// ═══════════════════════════════════════════════════════════════

export const EARLY_WARNING_SIGNALS_SYSTEM = {
  name: 'Early Warning Signals',
  acronym: 'EWS',
  version: '1.0',
  
  system_question: EWS_CORE_PRINCIPLE.system_question,
  core_principle: EWS_CORE_PRINCIPLE,
  
  blocks: {
    NA: 'Signal Ingest (7 domains, micro-level)',
    NB: 'Signal Detection Engine (5 methods)',
    NC: 'Historical Precedent Matching',
    ND: 'Signal Classification (4 types)',
    NE: 'Early Warning Index (EWI)',
    NF: '"What\'s Starting to Move?" View',
    NG: 'False Positive Guard',
    NH: 'EWS × Blind Spots × DSI Crossing',
    NI: 'UI & Language Rules',
  },
  
  signal_domains: SIGNAL_SOURCES.length,
  detection_methods: Object.keys(DETECTION_METHODS).length,
  signal_classes: Object.keys(SIGNAL_CLASS_DEFINITIONS).length,
  
  key_outputs: {
    ewi_level: ['low', 'moderate', 'elevated', 'high'],
    sensitivity_zones: ['normal', 'watch', 'elevated', 'high_sensitivity'],
    signal_classes: ['structural_precursor', 'stress_amplifier', 'transient_noise', 'context_dependent'],
  },
  
  integration: {
    complements: ['Global Priority Synthesis', 'Global Blind Spot Detector', 'Decision Stress Index'],
    crossing_analysis: 'EWS × Blind Spots × DSI → High Sensitivity Zone detection',
  },
  
  safety_mechanisms: {
    false_positive_guard: true,
    credibility_over_speed: true,
    language_validation: true,
    mandatory_uncertainty_display: true,
  },
  
  next_modules: [
    { name: 'Trade-off Visualizer', description: 'Vad stärks/försvagas när fokus skiftar' },
    { name: 'Resilience Capacity Map', description: 'Var finns buffertar och elasticitet' },
    { name: 'Collective Learning Tracker', description: 'Vad världen faktiskt lär sig (eller inte)' },
  ],
  
  description: 'Förvarningslagret som ser saker innan de blir uppenbara.',
} as const;
