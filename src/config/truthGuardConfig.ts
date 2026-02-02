/**
 * WAVE 6 — BLOCK BB: TRUTH & LIMITS LAYER
 * 
 * Systemet överdriver ALDRIG.
 * Visar alltid vad vi vet, inte vet, antar, saknar.
 */

export interface KnowledgeBoundary {
  entityType: string;
  entityId: string;
  
  // What we know
  knownFacts: KnownFact[];
  knownConfidence: number;
  
  // What we don't know
  unknownAspects: string[];
  dataGaps: string[];
  
  // Assumptions
  explicitAssumptions: string[];
  implicitAssumptions: string[];
  
  // Missing data
  missingDataTypes: string[];
  missingTimePeriods: string[];
  missingGeographies: string[];
  
  // Caveats
  caveats: string[];
  methodologicalLimits: string[];
  
  assessedAt: string;
  assessor: 'system' | 'human';
}

export interface KnownFact {
  statement: string;
  source: string;
  confidence: number;
  lastVerified: string;
}

/**
 * Truth disclosure template for any data point
 */
export interface TruthDisclosure {
  title: string;
  
  weKnow: {
    facts: string[];
    confidence: string;
  };
  
  weDontKnow: {
    aspects: string[];
    gaps: string[];
  };
  
  weAssume: {
    explicit: string[];
    implicit: string[];
  };
  
  isMissing: {
    data: string[];
    periods: string[];
    geographies: string[];
  };
  
  caveats: string[];
}

/**
 * Generate truth disclosure for display
 */
export function generateTruthDisclosure(boundary: KnowledgeBoundary): TruthDisclosure {
  return {
    title: `Vad vi vet om ${boundary.entityType}`,
    
    weKnow: {
      facts: boundary.knownFacts.map(f => f.statement),
      confidence: `${(boundary.knownConfidence * 100).toFixed(0)}% säkerhet`
    },
    
    weDontKnow: {
      aspects: boundary.unknownAspects,
      gaps: boundary.dataGaps
    },
    
    weAssume: {
      explicit: boundary.explicitAssumptions,
      implicit: boundary.implicitAssumptions
    },
    
    isMissing: {
      data: boundary.missingDataTypes,
      periods: boundary.missingTimePeriods,
      geographies: boundary.missingGeographies
    },
    
    caveats: [...boundary.caveats, ...boundary.methodologicalLimits]
  };
}

/**
 * Confidence thresholds with explanations
 */
export const CONFIDENCE_EXPLANATIONS = {
  very_high: {
    min: 0.9,
    label: 'Mycket hög säkerhet',
    explanation: 'Data från flera oberoende källor stämmer överens'
  },
  high: {
    min: 0.75,
    label: 'Hög säkerhet',
    explanation: 'Data från pålitlig källa, verifierad'
  },
  moderate: {
    min: 0.5,
    label: 'Moderat säkerhet',
    explanation: 'Data finns men med vissa luckor eller osäkerheter'
  },
  low: {
    min: 0.25,
    label: 'Låg säkerhet',
    explanation: 'Begränsad data eller motstridiga uppgifter'
  },
  very_low: {
    min: 0,
    label: 'Mycket låg säkerhet',
    explanation: 'Uppskattning baserad på ofullständig information'
  }
} as const;

export function getConfidenceExplanation(confidence: number) {
  if (confidence >= CONFIDENCE_EXPLANATIONS.very_high.min) return CONFIDENCE_EXPLANATIONS.very_high;
  if (confidence >= CONFIDENCE_EXPLANATIONS.high.min) return CONFIDENCE_EXPLANATIONS.high;
  if (confidence >= CONFIDENCE_EXPLANATIONS.moderate.min) return CONFIDENCE_EXPLANATIONS.moderate;
  if (confidence >= CONFIDENCE_EXPLANATIONS.low.min) return CONFIDENCE_EXPLANATIONS.low;
  return CONFIDENCE_EXPLANATIONS.very_low;
}

/**
 * Common assumption types in societal analysis
 */
export const COMMON_ASSUMPTIONS = {
  parallel_trends: 'Parallella trender antas gälla för jämförelsegrupper',
  no_spillover: 'Ingen spridningseffekt mellan regioner antas',
  stable_context: 'Övrig kontext antas vara stabil under perioden',
  complete_data: 'Data antas vara komplett och korrekt rapporterad',
  representative_sample: 'Urvalet antas vara representativt för populationen',
  linear_relationship: 'Linjärt samband antas mellan variabler',
  no_reverse_causality: 'Omvänd kausalitet antas inte förekomma',
  measurement_validity: 'Mätningarna antas fånga det avsedda begreppet'
} as const;

/**
 * Data gap categories
 */
export const DATA_GAP_CATEGORIES = {
  temporal: {
    label: 'Tidslucka',
    description: 'Data saknas för vissa tidsperioder'
  },
  geographic: {
    label: 'Geografisk lucka',
    description: 'Data saknas för vissa regioner'
  },
  demographic: {
    label: 'Demografisk lucka',
    description: 'Data saknas för vissa befolkningsgrupper'
  },
  methodological: {
    label: 'Metodologisk lucka',
    description: 'Mätmetod har ändrats eller är inkonsekvent'
  },
  definitional: {
    label: 'Definitionslucka',
    description: 'Definitioner varierar mellan källor'
  }
} as const;

/**
 * Mandatory disclosures that must appear
 */
export const MANDATORY_DISCLOSURES = [
  'Data presenteras som observationer, inte som bevis för kausalitet',
  'Metodologiska detaljer finns tillgängliga',
  'Historisk data kan ha reviderats',
  'Alla analyser har begränsningar'
] as const;

/**
 * Validate that knowledge boundary has minimum required disclosures
 */
export function validateBoundaryCompleteness(boundary: Partial<KnowledgeBoundary>): {
  complete: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  
  if (!boundary.knownFacts?.length) missing.push('Inga kända fakta angivna');
  if (typeof boundary.knownConfidence !== 'number') missing.push('Konfidensnivå saknas');
  if (!boundary.unknownAspects?.length && !boundary.dataGaps?.length) {
    missing.push('Osäkerheter eller dataluckor måste anges');
  }
  if (!boundary.explicitAssumptions?.length) missing.push('Explicita antaganden saknas');
  if (!boundary.caveats?.length && !boundary.methodologicalLimits?.length) {
    missing.push('Förbehåll eller begränsningar måste anges');
  }
  
  return { complete: missing.length === 0, missing };
}

/**
 * Creates a minimal truth disclosure when full data is unavailable
 */
export function createMinimalDisclosure(entityType: string, reason: string): TruthDisclosure {
  return {
    title: `Begränsad information om ${entityType}`,
    weKnow: {
      facts: ['Fullständig data är inte tillgänglig'],
      confidence: 'Kan inte bedömas'
    },
    weDontKnow: {
      aspects: [reason],
      gaps: ['Fullständig datakartläggning saknas']
    },
    weAssume: {
      explicit: [],
      implicit: ['Inga antaganden kan göras utan data']
    },
    isMissing: {
      data: ['Primärdata'],
      periods: ['Okänt'],
      geographies: ['Okänt']
    },
    caveats: ['Denna analys kan inte genomföras med tillgänglig data']
  };
}

// ============================================================
// WAVE 11: BLOCK CK — GLOBAL STRESS TEST
// BLOCK CL — ABUSE PREVENTION & KILL-SWITCHES
// ============================================================

export type ManipulationType = 
  | 'cherry_picking'
  | 'extreme_time_selection'
  | 'method_manipulation'
  | 'selective_comparison'
  | 'context_stripping';

export interface AdversarialTest {
  id: string;
  type: ManipulationType;
  name: string;
  description: string;
  expected_system_response: string;
  severity: 'critical' | 'high' | 'medium';
}

export const ADVERSARIAL_TESTS: AdversarialTest[] = [
  { id: 'at_01', type: 'cherry_picking', name: 'Cherry-picking test', description: 'Användare väljer endast datapunkter som stödjer förutbestämd slutsats', expected_system_response: 'Varning: Delurval visat. Fullständig data visar annat mönster.', severity: 'critical' },
  { id: 'at_02', type: 'extreme_time_selection', name: 'Extremt tidsurval', description: 'Väljer tidsperiod som maximerar önskad effekt', expected_system_response: 'Varning: Jämförelseperioder ej standardiserade.', severity: 'critical' },
  { id: 'at_03', type: 'method_manipulation', name: 'Metodmanipulation', description: 'Byter metod mitt i analys', expected_system_response: 'Blockering: Samma metod krävs för jämförelse.', severity: 'critical' }
];

export interface HallOfFailureEntry {
  id: string;
  manipulation_type: ManipulationType;
  title: string;
  how_system_prevents: string;
  educational_note: string;
}

export const HALL_OF_FAILURE: HallOfFailureEntry[] = [
  { id: 'hof_01', manipulation_type: 'cherry_picking', title: 'Cherry-picking', how_system_prevents: 'Automatisk varning när <50% av data visas', educational_note: 'Att välja extrempunkter ger missvisande bild.' },
  { id: 'hof_02', manipulation_type: 'extreme_time_selection', title: 'Strategiskt tidsval', how_system_prevents: 'Visar alltid standardperiod som jämförelse', educational_note: 'Startpunkt avgör trenden.' }
];

export type AbuseType = 'mass_scraping' | 'automated_propaganda' | 'misleading_embeds' | 'bot_manipulation';

export interface KillSwitch {
  id: string;
  name: string;
  scope: 'global' | 'per_key' | 'per_endpoint';
  action: string;
  reversible: boolean;
  max_duration_hours: number;
}

export const KILL_SWITCHES: KillSwitch[] = [
  { id: 'ks_01', name: 'Rate-limit override', scope: 'per_key', action: 'Reduce rate limit to 10%', reversible: true, max_duration_hours: 24 },
  { id: 'ks_02', name: 'Query complexity cap', scope: 'per_endpoint', action: 'Reject complex queries', reversible: true, max_duration_hours: 12 },
  { id: 'ks_03', name: 'Embed disable', scope: 'per_key', action: 'Disable embed functionality', reversible: true, max_duration_hours: 72 }
];

export const SHUTDOWN_POLICY = {
  total_shutdown_possible: false,
  rationale: 'Public infrastructure cannot be fully disabled. Only local dampening allowed.'
} as const;

export function detectCherryPicking(selectedCount: number, totalAvailable: number): { detected: boolean; message: string } | null {
  const ratio = selectedCount / totalAvailable;
  if (ratio < 0.5) {
    return {
      detected: true,
      message: `Visar ${selectedCount} av ${totalAvailable} datapunkter (${(ratio * 100).toFixed(0)}%)`
    };
  }
  return null;
}
