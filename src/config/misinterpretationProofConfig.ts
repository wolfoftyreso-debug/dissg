/**
 * 🔒 MASTER EXECUTION BLOCK 26
 * MISINTERPRETATION-PROOF DATA ARCHITECTURE (MPDA)
 * 
 * Syfte: Göra det strukturellt omöjligt att:
 * - ta ut lös statistik
 * - presentera siffror utan kontext
 * - dra slutsatser som inte stöds av datan
 * - använda systemet för vilseledning
 * 
 * Inte genom policy. Genom design.
 */

// ============================================================
// 1. NO DATA POINT EXISTS ALONE
// ============================================================

export interface DataPointRequirements {
  readonly field: string;
  readonly required: true;
  readonly description: string;
}

export const MANDATORY_DATA_CONTEXT: readonly DataPointRequirements[] = [
  { field: 'what_is_measured', required: true, description: 'Vad mäts' },
  { field: 'how_is_measured', required: true, description: 'Hur det mäts' },
  { field: 'what_it_means', required: true, description: 'Vad det betyder' },
  { field: 'what_it_does_not_mean', required: true, description: 'Vad det INTE betyder' },
  { field: 'covariates', required: true, description: 'Vilka faktorer som samvarierar' },
  { field: 'sources', required: true, description: 'Vilka källor som används' },
  { field: 'uncertainty', required: true, description: 'Vilken osäkerhet som finns' },
] as const;

export const FORBIDDEN_PRESENTATIONS = [
  'Råa värden utan förklaring',
  'Grafer utan text',
  'Export av siffror utan metadata',
] as const;

export const DATA_POINT_RULE = 'Detta är inte UI. Detta är datamodellen.';

// ============================================================
// 2. MEANING FIRST — NOT DATA FIRST
// ============================================================

export interface PresentationOrder {
  readonly step: number;
  readonly content: string;
  readonly required: boolean;
}

export const MANDATORY_PRESENTATION_ORDER: readonly PresentationOrder[] = [
  { step: 1, content: 'Tolkning i klartext', required: true },
  { step: 2, content: 'Förklaring av varför', required: true },
  { step: 3, content: 'Grafisk visualisering', required: true },
  { step: 4, content: 'Exakta värden (sekundärt)', required: true },
] as const;

export const MEANING_FIRST_EXAMPLE = {
  template: `Denna förändring sammanfaller med X och Y.
Det betyder att dessa faktorer rör sig samtidigt under perioden.
Det betyder inte att den ena orsakar den andra.`,
  rule: 'Om användaren inte läser texten → de får inte siffran.',
} as const;

// ============================================================
// 3. AUTOMATIC ROOT CAUSE DISCLOSURE
// ============================================================

export interface RootCausePayload {
  readonly field: string;
  readonly description: string;
}

export const ROOT_CAUSE_REQUIREMENTS: readonly RootCausePayload[] = [
  { field: 'affecting_variables', description: 'Vilka variabler som påverkar' },
  { field: 'effect_strength', description: 'Hur starkt' },
  { field: 'time_period', description: 'Över vilken tid' },
  { field: 'concurrent_changes', description: 'Vad som ändrats i omvärlden samtidigt' },
] as const;

export const ROOT_CAUSE_TRIGGERS = [
  'Skapar en graf',
  'Gör en korrelation',
  'Exporterar data',
] as const;

export const ROOT_CAUSE_PROMPT = 'Varför ser detta ut så här?';
export const ROOT_CAUSE_RULE = 'Ingen analys utan förklaringskedja.';

// ============================================================
// 4. NO EXPORT WITHOUT INTERPRETATION PAYLOAD
// ============================================================

export interface InterpretationBlock {
  readonly field: string;
  readonly type: 'human' | 'machine' | 'both';
  readonly required: true;
}

export const INTERPRETATION_PAYLOAD: readonly InterpretationBlock[] = [
  { field: 'summary_text', type: 'both', required: true },
  { field: 'limitations', type: 'both', required: true },
  { field: 'uncertainty', type: 'both', required: true },
  { field: 'do_not_conclude', type: 'both', required: true },
] as const;

export interface MethodFingerprint {
  readonly field: string;
  readonly required: true;
}

export const METHOD_FINGERPRINT: readonly MethodFingerprint[] = [
  { field: 'method_version', required: true },
  { field: 'sources', required: true },
  { field: 'export_date', required: true },
  { field: 'data_period', required: true },
] as const;

export const EXPORT_FORMATS = ['CSV', 'PNG', 'API', 'PDF', 'JSON', 'SVG'] as const;
export const EXPORT_RULE = 'Om någon delar siffran → kontexten följer med.';

// ============================================================
// 5. ANTI-CHERRY-PICKING ENGINE
// ============================================================

export interface CherryPickingTrigger {
  readonly behavior: string;
  readonly detection: string;
  readonly response: string;
}

export const CHERRY_PICKING_TRIGGERS: readonly CherryPickingTrigger[] = [
  { 
    behavior: 'Zoomar in på extrema värden',
    detection: 'Value > 2 std from mean AND zoom level > threshold',
    response: 'Visa distribution och median'
  },
  { 
    behavior: 'Väljer kort period',
    detection: 'Selected period < 20% of available data',
    response: 'Visa långsiktig trend som referens'
  },
  { 
    behavior: 'Tar bort relaterade variabler',
    detection: 'Correlated variable hidden from view',
    response: 'Visa varning om utelämnad kontext'
  },
] as const;

export const CHERRY_PICKING_WARNING = {
  message: 'Denna vy visar endast en del av mönstret. Här är hur helheten ser ut.',
  userCanContinue: true,
  butAwarenessMandatory: true,
} as const;

// ============================================================
// 6. "THIS DEPENDS ON" — ALWAYS VISIBLE
// ============================================================

export interface DependencyDisclosure {
  readonly label: string;
  readonly factors: readonly string[];
  readonly conditionalStatement: string;
}

export const DEPENDENCY_BOX_TEMPLATE = {
  header: 'Detta beror på:',
  factorPrefix: '– ',
  footer: 'Om dessa ändras, ändras också utfallet.',
} as const;

export const DETERMINISM_RULE = 'Inget får se deterministiskt ut.';

// ============================================================
// 7. STATISTICS WITHOUT CAUSE = BLOCKED
// ============================================================

export interface BlockedPresentation {
  readonly type: string;
  readonly reason: string;
  readonly requires: string;
}

export const BLOCKED_PRESENTATIONS: readonly BlockedPresentation[] = [
  { type: 'Ökning/minskning utan samtidiga faktorer', reason: 'Saknar kausal kontext', requires: 'Samvarierande variabler' },
  { type: 'Trend utan tidskontext', reason: 'Kan ge falsk säkerhet', requires: 'Historisk referensperiod' },
  { type: 'Procent utan basvärde', reason: 'Kan förvränga skala', requires: 'Absoluta tal + basvärde' },
] as const;

export const BLOCK_MESSAGE = 'Denna vy saknar nödvändig kontext och kan inte visas utan kompletterande data.';
export const BLOCK_RULE = 'Det här är ryggrad.';

// ============================================================
// 8. EXPLANATION IS NOT OPTIONAL (ETLIH MANDATORY)
// ============================================================

export const ETLIH_CONFIG = {
  status: 'MANDATORY' as const,
  alwaysActive: true,
  alwaysFirst: true,
  canBeDisabled: false,
  
  userCanChoose: 'Level (1-3)',
  userCannotChoose: 'Whether explanation exists',
  
  rule: 'Förståelse är inte en feature – det är ett krav.',
} as const;

// ============================================================
// 9. SHARING WITH PROTECTION
// ============================================================

export interface ShareProtectionPayload {
  readonly field: string;
  readonly alwaysIncluded: true;
}

export const SHARE_PROTECTION: readonly ShareProtectionPayload[] = [
  { field: 'context', alwaysIncluded: true },
  { field: 'time_period', alwaysIncluded: true },
  { field: 'definition', alwaysIncluded: true },
  { field: 'what_this_does_not_show', alwaysIncluded: true },
] as const;

export const SHARE_TYPES = ['link', 'image', 'export'] as const;
export const SHARE_RULE = 'Det ska vara omöjligt att sprida en siffra utan dess mening.';

// ============================================================
// 10. ULTIMATE TEST
// ============================================================

export const ULTIMATE_TEST = {
  question: 'Kan en intelligent men illvillig aktör använda detta för att vilseleda utan att systemet själv protesterar?',
  ifYes: 'Den vyn får inte existera',
  ifNo: 'Vyn är godkänd',
} as const;

// ============================================================
// SYSTEM PHILOSOPHY
// ============================================================

export const MPDA_PHILOSOPHY = {
  whatWeBuilt: [
    'Ett system som inte litar på användarens goda vilja',
    'Ett system som tvingar fram korrekthet',
    'Ett system där sanningen har företräde framför flexibilitet',
  ],
  
  whyItCanStand: 'Det är därför detta kan stå öppet i decennier.',
  
  result: {
    noWayToMisunderstand: 'utan varning',
    noWayToTwist: 'utan att bli avslöjad',
    noWayToCite: 'utan kontext',
  },
  
  finalStatement: 'Systemet skyddar verkligheten – även från användaren.',
} as const;

// ============================================================
// VALIDATION FUNCTIONS
// ============================================================

export function validateDataPoint(data: Record<string, unknown>): { valid: boolean; missing: readonly string[] } {
  const missing = MANDATORY_DATA_CONTEXT
    .filter(req => !data[req.field])
    .map(req => req.field);
  return { valid: missing.length === 0, missing };
}

export function validateExport(exportData: Record<string, unknown>): { valid: boolean; missing: readonly string[] } {
  const requiredFields = [
    ...INTERPRETATION_PAYLOAD.map(i => i.field),
    ...METHOD_FINGERPRINT.map(m => m.field),
  ];
  const missing = requiredFields.filter(field => !exportData[field]);
  return { valid: missing.length === 0, missing };
}

export function detectCherryPicking(
  selectedPeriod: number, 
  totalPeriod: number, 
  valueStdDev: number
): { detected: boolean; warnings: readonly string[] } {
  const warnings: string[] = [];
  
  if (selectedPeriod / totalPeriod < 0.2) {
    warnings.push('Kort period vald – långsiktig trend visas som referens');
  }
  
  if (valueStdDev > 2) {
    warnings.push('Extremvärde valt – distribution visas för kontext');
  }
  
  return { detected: warnings.length > 0, warnings };
}

export function runUltimateTest(viewConfig: unknown): { passes: boolean; reason: string } {
  // This would integrate with actual view analysis
  // For now, returns the test framework
  return {
    passes: false, // Conservative default
    reason: 'Manuell granskning krävs: ' + ULTIMATE_TEST.question,
  };
}

// ============================================================
// COMPLETE MPDA EXPORT
// ============================================================

export const MPDA_COMPLETE = {
  dataPointRules: MANDATORY_DATA_CONTEXT,
  presentationOrder: MANDATORY_PRESENTATION_ORDER,
  rootCauseRequirements: ROOT_CAUSE_REQUIREMENTS,
  exportPayload: { interpretation: INTERPRETATION_PAYLOAD, fingerprint: METHOD_FINGERPRINT },
  cherryPickingProtection: CHERRY_PICKING_TRIGGERS,
  dependencyDisclosure: DEPENDENCY_BOX_TEMPLATE,
  blockedPresentations: BLOCKED_PRESENTATIONS,
  etlihConfig: ETLIH_CONFIG,
  shareProtection: SHARE_PROTECTION,
  ultimateTest: ULTIMATE_TEST,
  philosophy: MPDA_PHILOSOPHY,
} as const;
