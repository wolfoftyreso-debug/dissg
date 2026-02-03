/**
 * OBSERVATION MODE COPY STANDARD
 * 
 * 🧾 "ENGINEERING LANGUAGE ONLY"
 * 
 * All text here is public-ready and immutable.
 * No value words. No conclusions. No causal claims.
 * No future promises. No imperatives.
 * 
 * This is linguistic engineering.
 */

// ============================================
// GLOBAL RULE (LOCKED)
// ============================================

export const FORBIDDEN_PATTERNS = {
  valueWords: [
    'good', 'bad', 'better', 'worse', 'best', 'worst',
    'success', 'failure', 'excellent', 'poor', 'disgrace',
    'bra', 'dålig', 'bättre', 'sämre', 'bäst', 'sämst',
    'framgång', 'misslyckande', 'utmärkt', 'uselt', 'skam',
  ],
  conclusionWords: [
    'proves', 'demonstrates', 'shows that', 'confirms',
    'bevisar', 'visar att', 'bekräftar', 'påvisar',
  ],
  causalWords: [
    'causes', 'caused', 'leads to', 'results in', 'because of',
    'due to', 'therefore', 'consequently', 'hence',
    'orsakar', 'orsakade', 'leder till', 'resulterar i', 'på grund av',
    'därför', 'följaktligen', 'således',
  ],
  imperatives: [
    'should', 'must', 'need to', 'have to', 'ought to',
    'bör', 'måste', 'behöver', 'ska', 'borde',
  ],
  futurePromises: [
    'will improve', 'will decline', 'will lead to', 'is expected to',
    'kommer att förbättras', 'kommer att försämras', 'förväntas',
  ],
} as const;

// ============================================
// 1. PAGE HEADER (ALL TOPICS)
// ============================================

export const HEADER_COPY = {
  title: {
    template: {
      en: 'Observed outcomes related to {TOPIC}',
      sv: 'Observerade utfall relaterade till {TOPIC}',
    },
  },
  subtitle: {
    en: 'This view presents aggregated public data, historical comparisons, and documented uncertainty. No conclusions, recommendations, or value judgments are made.',
    sv: 'Denna vy presenterar aggregerad offentlig data, historiska jämförelser och dokumenterad osäkerhet. Inga slutsatser, rekommendationer eller värdeomdömen görs.',
  },
} as const;

// ============================================
// 2. QUICK FACT BAR (30-SECOND ORIENTATION)
// ============================================

export const QUICK_FACT_COPY = {
  labels: {
    period: { en: 'Time period analyzed', sv: 'Analyserad tidsperiod' },
    coverage: { en: 'Geographic coverage', sv: 'Geografisk täckning' },
    indicators: { en: 'Indicators included', sv: 'Inkluderade indikatorer' },
    dataCoverage: { en: 'Data coverage', sv: 'Datatäckning' },
    gaps: { en: 'Known data gaps', sv: 'Kända datagap' },
  },
  tooltip: {
    en: 'Coverage reflects availability and consistency of public sources. Lower coverage indicates higher uncertainty.',
    sv: 'Täckning återspeglar tillgänglighet och konsekvens hos offentliga källor. Lägre täckning indikerar högre osäkerhet.',
  },
} as const;

// ============================================
// 3. SECTION A — WHAT WAS OBSERVED
// ============================================

export const SECTION_A_COPY = {
  title: {
    en: 'Observed changes over time',
    sv: 'Observerade förändringar över tid',
  },
  graphNote: {
    en: 'Values shown represent aggregated observations relative to historical baselines. No causal interpretation is implied.',
    sv: 'Visade värden representerar aggregerade observationer relativt historiska baslinjer. Ingen kausal tolkning antyds.',
  },
  uncertainDataFallback: {
    en: 'Data availability during this period is limited. Observed patterns should be interpreted with caution.',
    sv: 'Datatillgänglighet under denna period är begränsad. Observerade mönster bör tolkas med försiktighet.',
  },
} as const;

// ============================================
// 4. SECTION B — WHAT MOVED TOGETHER
// ============================================

export const SECTION_B_COPY = {
  title: {
    en: 'Observed co-movement between indicators',
    sv: 'Observerad samvariation mellan indikatorer',
  },
  warning: {
    en: 'Correlation does not imply causation. Displayed relationships indicate statistical co-movement only.',
    sv: 'Korrelation innebär inte orsakssamband. Visade samband indikerar endast statistisk samvariation.',
  },
  stabilityNote: {
    en: 'Stability reflects consistency across time windows and model specifications. Lower stability indicates higher sensitivity to assumptions.',
    sv: 'Stabilitet återspeglar konsekvens över tidsfönster och modellspecifikationer. Lägre stabilitet indikerar högre känslighet för antaganden.',
  },
} as const;

// ============================================
// 5. SECTION C — COMPARISON VIEW
// ============================================

export const SECTION_C_COPY = {
  title: {
    en: 'Comparison to historical and peer benchmarks',
    sv: 'Jämförelse med historiska och jämförbara referenspunkter',
  },
  note: {
    en: 'Comparisons are shown against selected reference groups. Differences do not indicate superiority, failure, or intent.',
    sv: 'Jämförelser visas mot utvalda referensgrupper. Skillnader indikerar inte överlägsenhet, misslyckande eller avsikt.',
  },
} as const;

// ============================================
// 6. SECTION D — LIMITATIONS (MANDATORY)
// ============================================

export const SECTION_D_COPY = {
  title: {
    en: 'Limitations and uncertainty',
    sv: 'Begränsningar och osäkerhet',
  },
  required: {
    en: '(Mandatory section)',
    sv: '(Obligatorisk sektion)',
  },
  intro: {
    en: 'The following limitations prevent definitive conclusions from being drawn:',
    sv: 'Följande begränsningar förhindrar att definitiva slutsatser kan dras:',
  },
  exampleItems: {
    en: [
      'Incomplete data coverage for certain regions',
      'Changes in reporting definitions over time',
      'Potential confounding variables not isolated',
      'Limited historical depth for some indicators',
    ],
    sv: [
      'Ofullständig datatäckning för vissa regioner',
      'Förändringar i rapporteringsdefinitioner över tid',
      'Potentiella störvariabler ej isolerade',
      'Begränsat historiskt djup för vissa indikatorer',
    ],
  },
  blockMessage: {
    en: 'This analysis cannot be displayed: mandatory limitations section is empty.',
    sv: 'Denna analys kan inte visas: obligatorisk begränsningssektion är tom.',
  },
} as const;

// ============================================
// 7. SECTION E — MISINTERPRETATION RISK
// ============================================

export const SECTION_E_COPY = {
  title: {
    en: 'Common misinterpretations',
    sv: 'Vanliga feltolkningar',
  },
  fixedList: {
    en: [
      'This view does not assign responsibility or intent',
      'This view does not establish cause-and-effect',
      'This view does not evaluate policy quality',
      'This view does not predict future outcomes',
    ],
    sv: [
      'Denna vy tillskriver inte ansvar eller avsikt',
      'Denna vy fastställer inte orsak-och-verkan',
      'Denna vy utvärderar inte policykvalitet',
      'Denna vy förutspår inte framtida utfall',
    ],
  },
  reinforcement: {
    en: 'If someone claims this data "proves" any of the above, they are misinterpreting.',
    sv: 'Om någon hävdar att dessa data "bevisar" något av ovanstående, tolkar de fel.',
  },
} as const;

// ============================================
// 8. ADVANCED / SCENARIO MODE (PAID)
// ============================================

export const SCENARIO_COPY = {
  banner: {
    en: 'User-generated scenario. Results depend entirely on selected assumptions and inputs.',
    sv: 'Användargenererat scenario. Resultat beror helt på valda antaganden och indata.',
  },
  responsibility: {
    en: 'Scenarios created using this tool are the sole responsibility of the user. The platform does not validate conclusions derived from scenarios.',
    sv: 'Scenarier skapade med detta verktyg är helt användarens ansvar. Plattformen validerar inte slutsatser härledda från scenarier.',
  },
} as const;

// ============================================
// 9. EXPORT / REPORT (PDF, HTML)
// ============================================

export const EXPORT_COPY = {
  coverPage: {
    en: 'This document contains user-generated analysis based on aggregated public data. No conclusions or recommendations are provided by the platform.',
    sv: 'Detta dokument innehåller användargenererad analys baserad på aggregerad offentlig data. Inga slutsatser eller rekommendationer tillhandahålls av plattformen.',
  },
  pageFooter: {
    en: 'Source references, methodology, and uncertainty are provided for transparency.',
    sv: 'Källreferenser, metodologi och osäkerhet tillhandahålls för transparens.',
  },
} as const;

// ============================================
// 10. ERROR MESSAGES
// ============================================

export const ERROR_COPY = {
  dataUnavailable: {
    en: 'This view is unavailable due to insufficient or inconsistent data.',
    sv: 'Denna vy är otillgänglig på grund av otillräcklig eller inkonsekvent data.',
  },
  interpretationBlocked: {
    en: 'This interpretation exceeds what can be supported by the available data.',
    sv: 'Denna tolkning överskrider vad som kan stödjas av tillgänglig data.',
  },
  analysisHidden: {
    en: 'Analysis hidden: required context or limitations not available.',
    sv: 'Analys dold: nödvändig kontext eller begränsningar saknas.',
  },
} as const;

// ============================================
// 11. PLATFORM DISCLAIMERS
// ============================================

export const PLATFORM_DISCLAIMERS = {
  footer: {
    en: 'This platform does not assign cause, intent, or recommendation.',
    sv: 'Denna plattform tillskriver ingen orsak, avsikt eller rekommendation.',
  },
  dataStatement: {
    en: 'All data is sourced from public institutions. The platform does not create or modify source data.',
    sv: 'All data härstammar från offentliga institutioner. Plattformen skapar eller modifierar inte källdata.',
  },
  methodStatement: {
    en: 'Methodology and source documentation are available for all displayed values.',
    sv: 'Metodologi och källdokumentation finns tillgänglig för alla visade värden.',
  },
} as const;

// ============================================
// HELPER: GET COPY BY LANGUAGE
// ============================================

export type SupportedLanguage = 'en' | 'sv';

export function getCopy<T extends Record<SupportedLanguage, string>>(
  copyObject: T,
  language: SupportedLanguage
): string {
  return copyObject[language];
}

export function getCopyList<T extends Record<SupportedLanguage, string[]>>(
  copyObject: T,
  language: SupportedLanguage
): string[] {
  return copyObject[language];
}

// ============================================
// VALIDATION: CHECK TEXT FOR VIOLATIONS
// ============================================

export function validateText(text: string): {
  isValid: boolean;
  violations: Array<{ type: string; word: string }>;
} {
  const violations: Array<{ type: string; word: string }> = [];
  const lowerText = text.toLowerCase();

  Object.entries(FORBIDDEN_PATTERNS).forEach(([type, words]) => {
    words.forEach(word => {
      if (lowerText.includes(word.toLowerCase())) {
        violations.push({ type, word });
      }
    });
  });

  return {
    isValid: violations.length === 0,
    violations,
  };
}

export default {
  HEADER_COPY,
  QUICK_FACT_COPY,
  SECTION_A_COPY,
  SECTION_B_COPY,
  SECTION_C_COPY,
  SECTION_D_COPY,
  SECTION_E_COPY,
  SCENARIO_COPY,
  EXPORT_COPY,
  ERROR_COPY,
  PLATFORM_DISCLAIMERS,
  FORBIDDEN_PATTERNS,
  getCopy,
  getCopyList,
  validateText,
};
