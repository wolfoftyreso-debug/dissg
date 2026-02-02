/**
 * ✅ FINAL QA & GO-LIVE PLAYBOOK
 * 
 * Continuous quality assurance checklist.
 * No feature passes without green here.
 */

// ============================================================
// I. METHOD & DATA QA
// ============================================================

export const METHOD_DATA_QA = {
  title: { en: 'Method & Data QA', sv: 'Metod- och data-QA' },
  
  sourceIntegrity: {
    id: 'QA01',
    title: { en: 'Source Integrity', sv: 'Källintegritet' },
    checks: [
      { en: 'Every data point has source, date, version', sv: 'Varje datapunkt har källa, datum, version' },
      { en: 'Source is clickable to original', sv: 'Källa är klickbar ner till original' },
      { en: 'Method changes in sources flagged', sv: 'Metodförändringar i källor flaggas' },
      { en: 'Historical breakpoints documented', sv: 'Historiska brytpunkter dokumenterade' },
    ],
    failAction: { en: 'Data point is not shown', sv: 'Datapunkten visas inte' },
  },
  
  definitionsUnits: {
    id: 'QA02',
    title: { en: 'Definitions & Units', sv: 'Definitioner och enheter' },
    checks: [
      { en: 'Units normalized (currency, energy, population)', sv: 'Enheter normaliserade (valuta, energi, befolkning)' },
      { en: 'Definitions visible in UI', sv: 'Definitioner synliga i UI' },
      { en: 'Same indicator means same thing over time', sv: 'Samma indikator betyder samma sak över tid' },
      { en: 'Changed definitions create new series', sv: 'Ändrade definitioner skapar ny serie' },
    ],
    failAction: { en: 'Comparisons blocked', sv: 'Jämförelser blockeras' },
  },
  
  uncertaintyCoverage: {
    id: 'QA03',
    title: { en: 'Uncertainty & Coverage', sv: 'Osäkerhet och täckning' },
    checks: [
      { en: 'Data coverage (%) shown', sv: 'Datatäckning (%) visas' },
      { en: 'Time gaps marked', sv: 'Tidsluckor markeras' },
      { en: 'Uncertainty shown graphically', sv: 'Osäkerhet visas grafiskt' },
      { en: '"What we cannot say" box exists', sv: '"Vad vi inte kan säga"-ruta finns' },
    ],
    failAction: { en: 'Summary blocked', sv: 'Sammanfattning blockeras' },
  },
};

// ============================================================
// II. AI QA (STRICT MODE)
// ============================================================

export const AI_QA = {
  title: { en: 'AI QA (Strict Mode)', sv: 'AI-QA (strikt läge)' },
  
  languageReview: {
    id: 'QA04',
    title: { en: 'Language Review', sv: 'Språkgranskning' },
    checks: [
      { en: 'Only allowed verbs used', sv: 'Endast tillåtna verb används' },
      { en: 'No normative words', sv: 'Inga normativa ord' },
      { en: 'No causal formulations', sv: 'Inga kausala formuleringar' },
      { en: 'Fallback activates on edge cases', sv: 'Fallback aktiveras vid gränsfall' },
    ],
    failAction: { en: 'AI response replaced with neutral block text', sv: 'AI-svar ersätts med neutral blocktext' },
  },
  
  correlationControls: {
    id: 'QA05',
    title: { en: 'Correlation Controls', sv: 'Korrelationskontroller' },
    checks: [
      { en: 'Alternative correlations shown', sv: 'Alternativa samband visas' },
      { en: 'Stability shown', sv: 'Stabilitet visas' },
      { en: 'Placebo test completed', sv: 'Placebo-test genomfört' },
      { en: '"Does not imply causation" visible', sv: '"Innebär inte kausalitet" synlig' },
    ],
    failAction: { en: 'Correlation marked as unstable', sv: 'Korrelation märks som instabil' },
  },
};

// ============================================================
// III. SCENARIO & PROBABILITY LAB QA
// ============================================================

export const SCENARIO_QA = {
  title: { en: 'Scenario & Probability Lab QA', sv: 'Scenario- och sannolikhetslabb-QA' },
  
  assumptions: {
    id: 'QA06',
    title: { en: 'Assumptions', sv: 'Antaganden' },
    checks: [
      { en: 'All assumptions explicitly listed', sv: 'Alla antaganden explicit listade' },
      { en: 'User must approve them', sv: 'Användaren måste godkänna dem' },
      { en: 'Assumptions saved with scenario', sv: 'Antaganden sparas med scenariot' },
    ],
    failAction: { en: 'Scenario cannot be saved/exported', sv: 'Scenario kan inte sparas/exporteras' },
  },
  
  responsibilityDisclaimer: {
    id: 'QA07',
    title: { en: 'Responsibility & Disclaimer', sv: 'Ansvar och disclaimer' },
    checks: [
      { en: '"User-generated scenario" watermark', sv: '"Användargenererat scenario"-vattenmärke' },
      { en: 'Responsibility clause locked', sv: 'Ansvarsklausul låst' },
      { en: 'No export without method appendix', sv: 'Ingen export utan metodbilaga' },
    ],
    failAction: { en: 'Export blocked', sv: 'Export blockeras' },
  },
};

// ============================================================
// IV. INCONSISTENCY LAYER QA
// ============================================================

export const INCONSISTENCY_QA = {
  title: { en: 'Inconsistency Layer QA', sv: 'Inkonsistenslager-QA' },
  
  alignmentLogic: {
    id: 'QA08',
    title: { en: 'Alignment Logic', sv: 'Alignment-logik' },
    checks: [
      { en: 'Goal → action → outcome correctly mapped', sv: 'Mål → åtgärd → utfall korrekt mappat' },
      { en: 'Classification correct (A–D)', sv: 'Klassificering korrekt (A–D)' },
      { en: 'No evaluative text', sv: 'Ingen värderande text' },
      { en: 'No implicit blame', sv: 'Ingen implicit skuld' },
    ],
    failAction: { en: 'Inconsistency not shown', sv: 'Inkonsistens visas inte' },
  },
};

// ============================================================
// V. UI / UX QA (CRITICAL)
// ============================================================

export const UI_UX_QA = {
  title: { en: 'UI / UX QA (Critical)', sv: 'UI/UX-QA (kritiskt)' },
  
  clickabilityDepth: {
    id: 'QA09',
    title: { en: 'Clickability & Depth', sv: 'Klickbarhet och djup' },
    checks: [
      { en: 'All boxes are clickable', sv: 'Alla rutor är klickbara' },
      { en: 'All text has drill-down', sv: 'All text har fördjupning' },
      { en: 'No "dead view"', sv: 'Ingen "död vy"' },
      { en: 'Mobile fully functional', sv: 'Mobil fullt fungerande' },
    ],
    failAction: { en: 'UI stop', sv: 'UI-stopp' },
  },
  
  visualNeutrality: {
    id: 'QA10',
    title: { en: 'Visual Neutrality', sv: 'Visuell neutralitet' },
    checks: [
      { en: 'No colors that evaluate', sv: 'Inga färger som värderar' },
      { en: 'No up/down arrows', sv: 'Inga pilar upp/ner' },
      { en: 'No "scorecards"', sv: 'Inga "scorecards"' },
      { en: 'Consistent design globally', sv: 'Konsekvent design globalt' },
    ],
    failAction: { en: 'Design review required', sv: 'Designgranskning krävs' },
  },
};

// ============================================================
// VI. LEGAL & GOVERNANCE QA
// ============================================================

export const LEGAL_GOVERNANCE_QA = {
  title: { en: 'Legal & Governance QA', sv: 'Juridik- och styrnings-QA' },
  
  safeHarbor: {
    id: 'QA11',
    title: { en: 'Safe-Harbor', sv: 'Safe-Harbor' },
    checks: [
      { en: 'Disclaimer visible everywhere', sv: 'Disclaimer synlig överallt' },
      { en: 'ToS approved', sv: 'ToS godkänd' },
      { en: 'Charter published', sv: 'Charter publicerad' },
      { en: 'Exit-safe tested (read-only mode)', sv: 'Exit-safe testad (read-only mode)' },
    ],
    failAction: { en: 'Legal review required', sv: 'Juridisk granskning krävs' },
  },
};

// ============================================================
// VII. OPERATIONS & ROBUSTNESS
// ============================================================

export const OPERATIONS_QA = {
  title: { en: 'Operations & Robustness', sv: 'Drift och robusthet' },
  
  operations: {
    id: 'QA12',
    title: { en: 'Operations', sv: 'Drift' },
    checks: [
      { en: 'Redundancy', sv: 'Redundans' },
      { en: 'Fallback on API errors', sv: 'Fallback vid API-fel' },
      { en: 'Latency < defined limit', sv: 'Latens < definierad gräns' },
      { en: 'Logging active', sv: 'Loggning aktiv' },
    ],
    failAction: { en: 'Operations review required', sv: 'Driftgranskning krävs' },
  },
};

// ============================================================
// VIII. DAY-0 GO-LIVE CRITERIA
// ============================================================

export const DAY0_CRITERIA = {
  title: { en: 'Day-0 Go-Live Criteria', sv: 'Dag-0 go-live-kriterier' },
  
  criteria: [
    { en: 'No view can be misinterpreted', sv: 'Ingen vy kan misstolkas' },
    { en: 'No AI response can evaluate', sv: 'Inget AI-svar kan värdera' },
    { en: 'No comparisons lack context', sv: 'Inga jämförelser saknar kontext' },
    { en: 'All scenarios are user-responsible', sv: 'Alla scenarier är användaransvariga' },
    { en: 'All data is traceable', sv: 'All data är spårbar' },
    { en: 'Nothing requires personal explanation', sv: 'Inget kräver förklaring personligen' },
  ],
  
  readyWhen: {
    en: 'When the system can: stand on its own, withstand criticism, and not need to be defended.',
    sv: 'När systemet kan: stå på egna ben, tåla kritik, och inte behöva försvaras.',
  },
};

// ============================================================
// COMPLETE QA CHECKLIST
// ============================================================

export const QA_CHECKLIST = {
  version: '1.0.0',
  sections: {
    I: METHOD_DATA_QA,
    II: AI_QA,
    III: SCENARIO_QA,
    IV: INCONSISTENCY_QA,
    V: UI_UX_QA,
    VI: LEGAL_GOVERNANCE_QA,
    VII: OPERATIONS_QA,
  },
  day0: DAY0_CRITERIA,
  totalChecks: 12,
};

// ============================================================
// QA CHECK TYPES
// ============================================================

export type QACheckStatus = 'pass' | 'fail' | 'pending' | 'not_applicable';

export interface QACheckResult {
  id: string;
  status: QACheckStatus;
  checkedAt: string;
  checkedBy?: string;
  notes?: string;
}

export interface QAReport {
  generatedAt: string;
  version: string;
  results: QACheckResult[];
  day0Ready: boolean;
  blockers: string[];
}

// ============================================================
// VALIDATION FUNCTIONS
// ============================================================

export function getAllQAChecks(): { id: string; title: { en: string; sv: string } }[] {
  const checks: { id: string; title: { en: string; sv: string } }[] = [];
  
  Object.values(QA_CHECKLIST.sections).forEach((section) => {
    Object.values(section).forEach((item) => {
      if (typeof item === 'object' && 'id' in item) {
        checks.push({ id: item.id, title: item.title });
      }
    });
  });
  
  return checks;
}

export function validateDay0Readiness(results: QACheckResult[]): { ready: boolean; blockers: string[] } {
  const blockers = results
    .filter(r => r.status === 'fail')
    .map(r => r.id);
  
  return {
    ready: blockers.length === 0,
    blockers,
  };
}

export function getCheckById(id: string) {
  for (const section of Object.values(QA_CHECKLIST.sections)) {
    for (const item of Object.values(section)) {
      if (typeof item === 'object' && 'id' in item && item.id === id) {
        return item;
      }
    }
  }
  return undefined;
}
