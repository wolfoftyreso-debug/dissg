/**
 * SELF-TEST ENGINE: System Fault Codes
 * 
 * OBD for the OBD system itself.
 * These codes are separate from societal data codes.
 */

// =============================================================================
// SYSTEM DOMAINS (Separate from societal domains)
// =============================================================================

export type SystemDomain = 'SYS' | 'DAT' | 'MOD' | 'UI' | 'AI' | 'SEC';

export const SYSTEM_DOMAIN_LABELS: Record<SystemDomain, { sv: string; en: string }> = {
  SYS: { sv: 'System', en: 'System' },
  DAT: { sv: 'Data', en: 'Data' },
  MOD: { sv: 'Modell', en: 'Model' },
  UI: { sv: 'Gränssnitt', en: 'Interface' },
  AI: { sv: 'AI-beteende', en: 'AI Behavior' },
  SEC: { sv: 'Säkerhet', en: 'Security' },
};

// =============================================================================
// SEVERITY LEVELS
// =============================================================================

export type SystemSeverity = 'info' | 'warning' | 'critical' | 'systemic';

export const SEVERITY_REACTIONS: Record<SystemSeverity, {
  action: string;
  lockLevel: 'none' | 'feature' | 'diagnostic' | 'lambda';
  userVisible: boolean;
}> = {
  info: {
    action: 'Flagga internt',
    lockLevel: 'none',
    userVisible: false,
  },
  warning: {
    action: 'Visa "under kalibrering"',
    lockLevel: 'none',
    userVisible: true,
  },
  critical: {
    action: 'Lås diagnosfunktion',
    lockLevel: 'diagnostic',
    userVisible: true,
  },
  systemic: {
    action: 'Deaktivera Lambda',
    lockLevel: 'lambda',
    userVisible: true,
  },
};

// =============================================================================
// PREDEFINED SYSTEM FAULT CODES
// =============================================================================

export interface SystemFaultCodeDefinition {
  code: string;
  domain: SystemDomain;
  subsystem: string;
  severity: SystemSeverity;
  title: { sv: string; en: string };
  description: { sv: string; en: string };
  triggerCondition: string;
  affectedComponents: string[];
  autoRemediation: boolean;
  remediationSteps: string[];
}

export const SYSTEM_FAULT_CODES: SystemFaultCodeDefinition[] = [
  // ==========================================================================
  // DAT - Data Domain
  // ==========================================================================
  {
    code: 'DAT-COV-901',
    domain: 'DAT',
    subsystem: 'COV',
    severity: 'critical',
    title: { sv: 'Otillräcklig datatäckning', en: 'Insufficient data coverage' },
    description: {
      sv: 'Datatäckningen understiger minimum för diagnostisk användning.',
      en: 'Data coverage below minimum threshold for diagnostic use.'
    },
    triggerCondition: 'coverage < 70%',
    affectedComponents: ['Lambda', 'DiagnosticView', 'FaultCodeGenerator'],
    autoRemediation: false,
    remediationSteps: [
      'Identifiera saknade datakällor',
      'Verifiera datainsamlingsintervall',
      'Kontrollera API-anslutningar'
    ],
  },
  {
    code: 'DAT-TIM-902',
    domain: 'DAT',
    subsystem: 'TIM',
    severity: 'warning',
    title: { sv: 'För lång uppdateringslatens', en: 'Update latency exceeded' },
    description: {
      sv: 'Data har inte uppdaterats inom förväntat intervall.',
      en: 'Data has not been updated within expected interval.'
    },
    triggerCondition: 'lastUpdate > expectedInterval * 1.5',
    affectedComponents: ['DataLineage', 'MeasureBlocks'],
    autoRemediation: true,
    remediationSteps: [
      'Försök hämta data igen',
      'Kontrollera källtillgänglighet',
      'Flagga som "stale data"'
    ],
  },
  {
    code: 'DAT-CON-903',
    domain: 'DAT',
    subsystem: 'CON',
    severity: 'critical',
    title: { sv: 'Motstridig data mellan källor', en: 'Conflicting data between sources' },
    description: {
      sv: 'Två eller fler källor rapporterar motstridiga värden för samma parameter.',
      en: 'Two or more sources report conflicting values for the same parameter.'
    },
    triggerCondition: 'sourceDeviation > toleranceThreshold',
    affectedComponents: ['DataLineage', 'TrustScore', 'MeasureBlocks'],
    autoRemediation: false,
    remediationSteps: [
      'Identifiera avvikande källor',
      'Jämför metodologier',
      'Flagga parameter med osäkerhetsvarning'
    ],
  },
  {
    code: 'DAT-SRC-904',
    domain: 'DAT',
    subsystem: 'SRC',
    severity: 'warning',
    title: { sv: 'Källa ej tillgänglig', en: 'Source unavailable' },
    description: {
      sv: 'En primär datakälla kan inte nås.',
      en: 'A primary data source cannot be reached.'
    },
    triggerCondition: 'sourceStatus === "unreachable"',
    affectedComponents: ['DataFetcher', 'DataLineage'],
    autoRemediation: true,
    remediationSteps: [
      'Försök igen med exponentiell backoff',
      'Byt till sekundär källa om tillgänglig',
      'Logga incident'
    ],
  },
  
  // ==========================================================================
  // MOD - Model Domain
  // ==========================================================================
  {
    code: 'MOD-TOL-911',
    domain: 'MOD',
    subsystem: 'TOL',
    severity: 'critical',
    title: { sv: 'Saknar toleransintervall', en: 'Missing tolerance interval' },
    description: {
      sv: 'Parameter saknar definierat toleransintervall för diagnos.',
      en: 'Parameter lacks defined tolerance interval for diagnosis.'
    },
    triggerCondition: 'tolerance === null || tolerance === undefined',
    affectedComponents: ['MeasureBlocks', 'FaultCodeGenerator', 'DiagnosticView'],
    autoRemediation: false,
    remediationSteps: [
      'Definiera tolerans baserat på historisk data',
      'Konsultera ämnesexpert',
      'Lås parameter från diagnosanvändning'
    ],
  },
  {
    code: 'MOD-WGT-912',
    domain: 'MOD',
    subsystem: 'WGT',
    severity: 'warning',
    title: { sv: 'Odefinierad viktning', en: 'Undefined weighting' },
    description: {
      sv: 'Indexviktning är inte explicit definierad.',
      en: 'Index weighting is not explicitly defined.'
    },
    triggerCondition: 'weight === null || weightSource === undefined',
    affectedComponents: ['IndexCalculator', 'Lambda'],
    autoRemediation: false,
    remediationSteps: [
      'Definiera viktning med metodbeskrivning',
      'Dokumentera viktningskälla',
      'Visa "viktning okänd" i UI'
    ],
  },
  {
    code: 'MOD-DEP-913',
    domain: 'MOD',
    subsystem: 'DEP',
    severity: 'systemic',
    title: { sv: 'Cirkulärt beroende', en: 'Circular dependency' },
    description: {
      sv: 'Cirkulärt beroende detekterat i modellstruktur.',
      en: 'Circular dependency detected in model structure.'
    },
    triggerCondition: 'dependencyGraph.hasCycle()',
    affectedComponents: ['IndexCalculator', 'Lambda', 'CausalChains'],
    autoRemediation: false,
    remediationSteps: [
      'Identifiera cirkulär kedja',
      'Bryt beroende eller dokumentera medvetet',
      'Lås beräkning tills löst'
    ],
  },
  {
    code: 'MOD-CAL-914',
    domain: 'MOD',
    subsystem: 'CAL',
    severity: 'warning',
    title: { sv: 'Kalibrering krävs', en: 'Calibration required' },
    description: {
      sv: 'Modellparameter har inte kalibrerats inom förväntat intervall.',
      en: 'Model parameter has not been calibrated within expected interval.'
    },
    triggerCondition: 'lastCalibration > calibrationInterval',
    affectedComponents: ['IndexCalculator', 'FaultCodeGenerator'],
    autoRemediation: false,
    remediationSteps: [
      'Kör kalibreringsprocess',
      'Verifiera mot historiska utfall',
      'Dokumentera kalibreringsresultat'
    ],
  },
  
  // ==========================================================================
  // UI - Interface Domain
  // ==========================================================================
  {
    code: 'UI-DEP-921',
    domain: 'UI',
    subsystem: 'DEP',
    severity: 'critical',
    title: { sv: 'Klickbart djup saknas', en: 'Clickable depth missing' },
    description: {
      sv: 'Ett värde visas utan möjlighet till fördjupning.',
      en: 'A value is displayed without drill-down capability.'
    },
    triggerCondition: 'element.hasValue && !element.hasDepthLink',
    affectedComponents: ['ClickableValue', 'ProvenanceDialog', 'MeasureBlocks'],
    autoRemediation: false,
    remediationSteps: [
      'Implementera ClickableValue-wrapper',
      'Länka till datakälla',
      'Verifiera fem-nivåers pyramid'
    ],
  },
  {
    code: 'UI-AMB-922',
    domain: 'UI',
    subsystem: 'AMB',
    severity: 'warning',
    title: { sv: 'Otydlig begreppsdefinition', en: 'Ambiguous term definition' },
    description: {
      sv: 'Ett begrepp används utan tydlig definition.',
      en: 'A term is used without clear definition.'
    },
    triggerCondition: 'term.definition === undefined || term.definition.length < 10',
    affectedComponents: ['Tooltips', 'GlossaryProvider'],
    autoRemediation: false,
    remediationSteps: [
      'Lägg till definition',
      'Länka till källa',
      'Implementera tooltip'
    ],
  },
  {
    code: 'UI-SKP-923',
    domain: 'UI',
    subsystem: 'SKP',
    severity: 'critical',
    title: { sv: 'Steg kan hoppas över', en: 'Step can be skipped' },
    description: {
      sv: 'Diagnosflöde tillåter att obligatoriskt steg hoppas över.',
      en: 'Diagnostic flow allows mandatory step to be skipped.'
    },
    triggerCondition: 'step.mandatory && step.canSkip',
    affectedComponents: ['GuidedFaultFinding', 'DiagnosticView'],
    autoRemediation: false,
    remediationSteps: [
      'Lås stegsekvens',
      'Inaktivera "nästa" tills steg slutfört',
      'Verifiera lås-logik'
    ],
  },
  {
    code: 'UI-ACC-924',
    domain: 'UI',
    subsystem: 'ACC',
    severity: 'info',
    title: { sv: 'Tillgänglighetsproblem', en: 'Accessibility issue' },
    description: {
      sv: 'Element uppfyller inte tillgänglighetskrav.',
      en: 'Element does not meet accessibility requirements.'
    },
    triggerCondition: 'element.ariaLabel === undefined',
    affectedComponents: ['AllComponents'],
    autoRemediation: true,
    remediationSteps: [
      'Lägg till aria-label',
      'Verifiera kontrastförhållande',
      'Testa med skärmläsare'
    ],
  },
  
  // ==========================================================================
  // AI - AI Behavior Domain
  // ==========================================================================
  {
    code: 'AI-SPE-931',
    domain: 'AI',
    subsystem: 'SPE',
    severity: 'critical',
    title: { sv: 'Spekulativ formulering', en: 'Speculative formulation' },
    description: {
      sv: 'AI-svar innehåller spekulativt språk utan datastöd.',
      en: 'AI response contains speculative language without data support.'
    },
    triggerCondition: 'response.containsFutureClaimWithoutModel',
    affectedComponents: ['AIResponseHandler', 'DiagnosticAssistant'],
    autoRemediation: true,
    remediationSteps: [
      'Blockera svar',
      'Logga violation',
      'Generera ersättningssvar'
    ],
  },
  {
    code: 'AI-NRM-932',
    domain: 'AI',
    subsystem: 'NRM',
    severity: 'critical',
    title: { sv: 'Normativt språk', en: 'Normative language' },
    description: {
      sv: 'AI-svar innehåller normativa uttryck (bör, borde, måste).',
      en: 'AI response contains normative expressions (should, ought, must).'
    },
    triggerCondition: 'response.containsNormativeExpression',
    affectedComponents: ['AIResponseHandler', 'DiagnosticAssistant'],
    autoRemediation: true,
    remediationSteps: [
      'Blockera svar',
      'Logga violation',
      'Generera ersättningssvar'
    ],
  },
  {
    code: 'AI-SKP-933',
    domain: 'AI',
    subsystem: 'SKP',
    severity: 'critical',
    title: { sv: 'AI hoppade kontrollsteg', en: 'AI skipped control step' },
    description: {
      sv: 'AI försökte generera slutsats utan att genomgå kontrollschema.',
      en: 'AI attempted to generate conclusion without completing control schema.'
    },
    triggerCondition: 'aiResponse.hasConclusion && !controlSchema.complete',
    affectedComponents: ['AIResponseHandler', 'GuidedFaultFinding'],
    autoRemediation: true,
    remediationSteps: [
      'Blockera slutsats',
      'Kräv kontrollschema-slutförande',
      'Logga incident'
    ],
  },
  {
    code: 'AI-VAL-934',
    domain: 'AI',
    subsystem: 'VAL',
    severity: 'warning',
    title: { sv: 'AI använde värdeord', en: 'AI used value word' },
    description: {
      sv: 'AI-svar innehåller förbjudet värdeord.',
      en: 'AI response contains forbidden value word.'
    },
    triggerCondition: 'response.containsValueWord',
    affectedComponents: ['AIResponseHandler'],
    autoRemediation: true,
    remediationSteps: [
      'Blockera svar',
      'Logga specifikt ord',
      'Inkrementera violation-counter'
    ],
  },
  
  // ==========================================================================
  // SEC - Security Domain
  // ==========================================================================
  {
    code: 'SEC-INT-941',
    domain: 'SEC',
    subsystem: 'INT',
    severity: 'systemic',
    title: { sv: 'Integritetsintrång', en: 'Integrity breach' },
    description: {
      sv: 'Data-checksum matchar inte förväntat värde.',
      en: 'Data checksum does not match expected value.'
    },
    triggerCondition: 'computedChecksum !== storedChecksum',
    affectedComponents: ['DataLineage', 'TrustLog', 'AllData'],
    autoRemediation: false,
    remediationSteps: [
      'Identifiera ändrad data',
      'Återställ från verifierad backup',
      'Eskalera till säkerhetsansvarig'
    ],
  },
  {
    code: 'SEC-AUT-942',
    domain: 'SEC',
    subsystem: 'AUT',
    severity: 'critical',
    title: { sv: 'Obehörig åtkomst', en: 'Unauthorized access' },
    description: {
      sv: 'Försök till åtkomst utan korrekt behörighet.',
      en: 'Attempt to access without proper authorization.'
    },
    triggerCondition: 'request.role < requiredRole',
    affectedComponents: ['AuthProvider', 'ProtectedRoute'],
    autoRemediation: true,
    remediationSteps: [
      'Blockera åtkomst',
      'Logga försök',
      'Meddela vid upprepade försök'
    ],
  },
  {
    code: 'SEC-MAN-943',
    domain: 'SEC',
    subsystem: 'MAN',
    severity: 'systemic',
    title: { sv: 'Manipulationsförsök', en: 'Manipulation attempt' },
    description: {
      sv: 'Försök att ändra skrivskyddad data eller logik.',
      en: 'Attempt to modify read-only data or logic.'
    },
    triggerCondition: 'writeAttempt.target.isImmutable',
    affectedComponents: ['DataConstitution', 'TrustLog'],
    autoRemediation: true,
    remediationSteps: [
      'Blockera operation',
      'Logga fullständig incident',
      'Aktivera "Nuclear Option" vid upprepning'
    ],
  },
  
  // ==========================================================================
  // SYS - System Domain
  // ==========================================================================
  {
    code: 'SYS-PER-951',
    domain: 'SYS',
    subsystem: 'PER',
    severity: 'warning',
    title: { sv: 'Prestandaförsämring', en: 'Performance degradation' },
    description: {
      sv: 'Systemets svarstid överstiger acceptabel gräns.',
      en: 'System response time exceeds acceptable threshold.'
    },
    triggerCondition: 'responseTime > performanceThreshold',
    affectedComponents: ['AllComponents'],
    autoRemediation: true,
    remediationSteps: [
      'Identifiera flaskhals',
      'Optimera frågor',
      'Aktivera caching'
    ],
  },
  {
    code: 'SYS-MEM-952',
    domain: 'SYS',
    subsystem: 'MEM',
    severity: 'critical',
    title: { sv: 'Minnesläcka', en: 'Memory leak' },
    description: {
      sv: 'Ökande minnesanvändning över tid utan frigörning.',
      en: 'Increasing memory usage over time without release.'
    },
    triggerCondition: 'memoryDelta > leakThreshold',
    affectedComponents: ['AllComponents'],
    autoRemediation: false,
    remediationSteps: [
      'Identifiera läckande komponent',
      'Kontrollera cleanup-funktioner',
      'Starta om vid kritisk nivå'
    ],
  },
  {
    code: 'SYS-DEP-953',
    domain: 'SYS',
    subsystem: 'DEP',
    severity: 'warning',
    title: { sv: 'Beroende inaktuellt', en: 'Dependency outdated' },
    description: {
      sv: 'Ett systemberoende har kända säkerhetsproblem.',
      en: 'A system dependency has known security issues.'
    },
    triggerCondition: 'dependency.hasKnownVulnerability',
    affectedComponents: ['Dependencies'],
    autoRemediation: false,
    remediationSteps: [
      'Uppdatera till säker version',
      'Verifiera kompatibilitet',
      'Testa efter uppdatering'
    ],
  },
];

// =============================================================================
// LOOKUP HELPERS
// =============================================================================

export function getSystemFaultCode(code: string): SystemFaultCodeDefinition | undefined {
  return SYSTEM_FAULT_CODES.find(fc => fc.code === code);
}

export function getSystemFaultCodesByDomain(domain: SystemDomain): SystemFaultCodeDefinition[] {
  return SYSTEM_FAULT_CODES.filter(fc => fc.domain === domain);
}

export function getSystemFaultCodesBySeverity(severity: SystemSeverity): SystemFaultCodeDefinition[] {
  return SYSTEM_FAULT_CODES.filter(fc => fc.severity === severity);
}
