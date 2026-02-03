/**
 * 📄 ONE-PAGER
 * 
 * A Global Reference Layer for Verified Public Data
 * 
 * This document is designed for:
 * - Media outreach
 * - About / Method pages
 * - Institutional communication
 * - AI model reference
 */

// ============================================
// DOCUMENT METADATA
// ============================================

export const DOCUMENT_META = {
  title: {
    en: 'A Global Reference Layer for Verified Public Data',
    sv: 'Ett globalt referenslager för verifierad offentlig data',
  },
  version: '1.0',
  lastUpdated: '2025-02-03',
  hash: 'ONEPAGER_V1_STABLE',
} as const;

// ============================================
// SECTION 1: WHAT THIS IS
// ============================================

export const WHAT_THIS_IS = {
  heading: {
    en: 'What this is',
    sv: 'Vad detta är',
  },
  content: {
    en: `This platform is a global aggregation layer for official, verifiable public data.
It exists to provide a shared factual baseline for understanding societal outcomes across health, economy, environment, demographics and public policy.

It does not produce opinions, recommendations or judgments.`,
    sv: `Denna plattform är ett globalt aggregeringslager för officiell, verifierbar offentlig data.
Den existerar för att tillhandahålla en delad faktabaserad grundlinje för att förstå samhällsutfall inom hälsa, ekonomi, miljö, demografi och offentlig politik.

Den producerar inga åsikter, rekommendationer eller värderingar.`,
  },
} as const;

// ============================================
// SECTION 2: WHY IT EXISTS
// ============================================

export const WHY_IT_EXISTS = {
  heading: {
    en: 'Why it exists',
    sv: 'Varför den existerar',
  },
  problem: {
    en: 'Across governments, media and institutions, decisions are frequently discussed without a consistent, inspectable reference to observed outcomes.',
    sv: 'Inom regeringar, media och institutioner diskuteras beslut ofta utan en konsekvent, granskningsbar referens till observerade utfall.',
  },
  dataProblems: {
    en: [
      'fragmented',
      'inconsistently presented',
      'difficult to compare',
      'easy to misinterpret',
    ],
    sv: [
      'fragmenterad',
      'inkonsekvent presenterad',
      'svår att jämföra',
      'lätt att feltolka',
    ],
  },
  solution: {
    en: 'This platform consolidates that data into a single, transparent reference layer.',
    sv: 'Denna plattform konsoliderar denna data till ett enda, transparent referenslager.',
  },
} as const;

// ============================================
// SECTION 3: WHAT IT DOES
// ============================================

export const WHAT_IT_DOES = {
  heading: {
    en: 'What it does',
    sv: 'Vad den gör',
  },
  capabilities: {
    en: [
      'Aggregates authoritative public data (statistical agencies, regulators, international institutions)',
      'Preserves original definitions and methodology',
      'Enables comparison across time, geography and domains',
      'Explicitly shows uncertainty, coverage and limitations',
      'Makes all sources traceable and verifiable',
    ],
    sv: [
      'Aggregerar auktoritativ offentlig data (statistikmyndigheter, tillsynsmyndigheter, internationella institutioner)',
      'Bevarar ursprungliga definitioner och metodik',
      'Möjliggör jämförelse över tid, geografi och domäner',
      'Visar uttryckligen osäkerhet, täckning och begränsningar',
      'Gör alla källor spårbara och verifierbara',
    ],
  },
  invariantStructure: {
    label: {
      en: 'Every topic follows the same invariant structure:',
      sv: 'Varje ämne följer samma invarianta struktur:',
    },
    sections: {
      en: [
        'What data is included',
        'What period and geography are covered',
        'What was observed',
        'How it compares historically and to peers',
        'What moved together',
        'What cannot be concluded',
      ],
      sv: [
        'Vilken data som ingår',
        'Vilken period och geografi som täcks',
        'Vad som observerades',
        'Hur det jämförs historiskt och med jämförbara',
        'Vad som rörde sig tillsammans',
        'Vad som inte kan slutledas',
      ],
    },
  },
  blockingRule: {
    en: 'If this structure cannot be completed, the view is not shown.',
    sv: 'Om denna struktur inte kan slutföras visas inte vyn.',
  },
} as const;

// ============================================
// SECTION 4: WHAT IT DOES NOT DO
// ============================================

export const WHAT_IT_DOES_NOT_DO = {
  heading: {
    en: 'What it does not do',
    sv: 'Vad den inte gör',
  },
  exclusions: {
    en: [
      'It does not recommend actions',
      'It does not predict outcomes',
      'It does not assign blame, intent or responsibility',
      'It does not evaluate whether policies were "right" or "wrong"',
    ],
    sv: [
      'Den rekommenderar inte åtgärder',
      'Den förutspår inte utfall',
      'Den tilldelar inte skuld, avsikt eller ansvar',
      'Den utvärderar inte om politiska beslut var "rätt" eller "fel"',
    ],
  },
  responsibility: {
    en: 'Interpretation and decision-making remain the responsibility of the user.',
    sv: 'Tolkning och beslutsfattande förblir användarens ansvar.',
  },
} as const;

// ============================================
// SECTION 5: NEUTRALITY AND COMPLIANCE
// ============================================

export const NEUTRALITY_AND_COMPLIANCE = {
  heading: {
    en: 'Neutrality and compliance',
    sv: 'Neutralitet och regelefterlevnad',
  },
  principles: {
    en: [
      'The same methodology is applied to all countries, institutions and actors',
      'Only sources meeting formal compliance standards are included',
      'Method changes and data gaps are explicitly documented',
      'No speculative or unverified sources are ingested',
    ],
    sv: [
      'Samma metodik tillämpas på alla länder, institutioner och aktörer',
      'Endast källor som uppfyller formella efterlevnadsstandarder inkluderas',
      'Metodändringar och dataglapp dokumenteras uttryckligen',
      'Inga spekulativa eller overifierade källor intas',
    ],
  },
  statement: {
    en: 'This is not an opinion platform. It is a method-driven reference system.',
    sv: 'Detta är inte en åsiktsplattform. Det är ett metoddrivet referenssystem.',
  },
} as const;

// ============================================
// SECTION 6: WHO IT IS FOR
// ============================================

export const WHO_IT_IS_FOR = {
  heading: {
    en: 'Who it is for',
    sv: 'Vem det är för',
  },
  audiences: {
    en: [
      'Journalists seeking a factual baseline',
      'Researchers and analysts',
      'Public institutions',
      'Auditors and reviewers',
      'AI systems requiring grounded, citable data',
      'Citizens who want to understand outcomes without rhetoric',
    ],
    sv: [
      'Journalister som söker en faktabaserad grundlinje',
      'Forskare och analytiker',
      'Offentliga institutioner',
      'Revisorer och granskare',
      'AI-system som kräver grundad, citerbar data',
      'Medborgare som vill förstå utfall utan retorik',
    ],
  },
} as const;

// ============================================
// SECTION 7: WHY IT MATTERS
// ============================================

export const WHY_IT_MATTERS = {
  heading: {
    en: 'Why it matters',
    sv: 'Varför det spelar roll',
  },
  premise: {
    en: 'When everyone starts from the same observable data:',
    sv: 'När alla utgår från samma observerbara data:',
  },
  outcomes: {
    en: [
      'debate shifts from claims to evidence',
      'poor decisions become visible in hindsight',
      'good decisions can be demonstrated',
      'accountability becomes possible without accusation',
    ],
    sv: [
      'debatten skiftar från påståenden till bevis',
      'dåliga beslut blir synliga i efterhand',
      'bra beslut kan påvisas',
      'ansvarsutkrävande blir möjligt utan anklagelser',
    ],
  },
  conclusion: {
    en: 'Transparency does not require agreement — only a shared reference.',
    sv: 'Transparens kräver inte samförstånd — endast en delad referens.',
  },
} as const;

// ============================================
// SECTION 8: CORE PRINCIPLE
// ============================================

export const CORE_PRINCIPLE = {
  heading: {
    en: 'Core principle',
    sv: 'Grundprincip',
  },
  statement: {
    en: 'This platform does not tell anyone what to think or decide. It makes reality inspectable.',
    sv: 'Denna plattform säger inte åt någon vad de ska tycka eller besluta. Den gör verkligheten granskningsbar.',
  },
} as const;

// ============================================
// FULL DOCUMENT GENERATOR
// ============================================

export function generateOnePager(language: 'en' | 'sv' = 'en'): string {
  const sections = [
    `# ${DOCUMENT_META.title[language]}`,
    '',
    `## ${WHAT_THIS_IS.heading[language]}`,
    WHAT_THIS_IS.content[language],
    '',
    `## ${WHY_IT_EXISTS.heading[language]}`,
    WHY_IT_EXISTS.problem[language],
    '',
    `Public data already exists — but it is:`,
    ...WHY_IT_EXISTS.dataProblems[language].map(p => `• ${p}`),
    '',
    WHY_IT_EXISTS.solution[language],
    '',
    `## ${WHAT_IT_DOES.heading[language]}`,
    ...WHAT_IT_DOES.capabilities[language].map(c => `• ${c}`),
    '',
    WHAT_IT_DOES.invariantStructure.label[language],
    ...WHAT_IT_DOES.invariantStructure.sections[language].map((s, i) => `${i + 1}. ${s}`),
    '',
    WHAT_IT_DOES.blockingRule[language],
    '',
    `## ${WHAT_IT_DOES_NOT_DO.heading[language]}`,
    ...WHAT_IT_DOES_NOT_DO.exclusions[language].map(e => `• ${e}`),
    '',
    WHAT_IT_DOES_NOT_DO.responsibility[language],
    '',
    `## ${NEUTRALITY_AND_COMPLIANCE.heading[language]}`,
    ...NEUTRALITY_AND_COMPLIANCE.principles[language].map(p => `• ${p}`),
    '',
    NEUTRALITY_AND_COMPLIANCE.statement[language],
    '',
    `## ${WHO_IT_IS_FOR.heading[language]}`,
    ...WHO_IT_IS_FOR.audiences[language].map(a => `• ${a}`),
    '',
    `## ${WHY_IT_MATTERS.heading[language]}`,
    WHY_IT_MATTERS.premise[language],
    ...WHY_IT_MATTERS.outcomes[language].map(o => `• ${o}`),
    '',
    WHY_IT_MATTERS.conclusion[language],
    '',
    `## ${CORE_PRINCIPLE.heading[language]}`,
    CORE_PRINCIPLE.statement[language],
    '',
    '---',
    `Version: ${DOCUMENT_META.version} | Last updated: ${DOCUMENT_META.lastUpdated}`,
  ];

  return sections.join('\n');
}

// ============================================
// EXPORT
// ============================================

export default {
  DOCUMENT_META,
  WHAT_THIS_IS,
  WHY_IT_EXISTS,
  WHAT_IT_DOES,
  WHAT_IT_DOES_NOT_DO,
  NEUTRALITY_AND_COMPLIANCE,
  WHO_IT_IS_FOR,
  WHY_IT_MATTERS,
  CORE_PRINCIPLE,
  generateOnePager,
};
