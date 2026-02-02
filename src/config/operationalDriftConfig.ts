/**
 * 🗓️ OPERATIV DRIFT & BYGGCYKEL
 * 
 * How the system lives, improves, and doesn't derail.
 * The last thing required for an extremely ambitious system
 * to not become destructive.
 */

// ============================================================
// 1. FIXED RHYTHM (SACRED)
// ============================================================

export const WEEKLY_RHYTHM = {
  label: { en: 'Fixed Rhythm', sv: 'Fast rytm' },
  subtitle: { en: 'No hysteria', sv: 'Ingen hysteri' },
  schedule: [
    { day: 'monday', focus: { en: 'Data quality & source status', sv: 'Datakvalitet & källstatus' } },
    { day: 'tuesday', focus: { en: 'Model & method (small adjustments)', sv: 'Modell & metod (små justeringar)' } },
    { day: 'wednesday', focus: { en: 'UI/UX improvements (simplify!)', sv: 'UI/UX-förbättringar (förenkla!)' } },
    { day: 'thursday', focus: { en: 'Performance, logs, QA', sv: 'Prestanda, loggar, QA' } },
    { day: 'friday', focus: { en: 'Summary + freeze', sv: 'Sammanfattning + frys' } },
  ],
  rules: [
    { en: 'No big ideas on Friday', sv: 'Inga stora idéer på fredag' },
    { en: 'No "we should also" features mid-week', sv: 'Inga "vi borde också"-features mitt i veckan' },
  ],
};

// ============================================================
// 2. IMPROVEMENT RULE (MOST IMPORTANT)
// ============================================================

export const IMPROVEMENT_RULE = {
  label: { en: 'Improvement Rule', sv: 'Förbättringsregel' },
  subtitle: { en: 'Most important of all', sv: 'Viktigast av allt' },
  rule: {
    en: 'Each iteration must make at least ONE thing clearer and may not make anything more complex.',
    sv: 'Varje iteration ska göra minst EN sak tydligare och får inte göra något mer komplext.',
  },
  wrongPath: {
    label: { en: 'If something:', sv: 'Om något:' },
    signs: [
      { en: 'requires explanation', sv: 'kräver förklaring' },
      { en: 'requires a meeting', sv: 'kräver möte' },
      { en: 'requires interpretation', sv: 'kräver tolkning' },
    ],
    conclusion: { en: '→ it is the wrong path', sv: '→ det är fel väg' },
  },
};

// ============================================================
// 3. FEATURE GATE (STOPS CHAOS)
// ============================================================

export const FEATURE_GATE = {
  label: { en: 'Feature Gate', sv: 'Feature-gate' },
  subtitle: { en: 'Stops chaos', sv: 'Stoppar kaos' },
  description: {
    en: 'Before anything new is built, the team must answer YES to all:',
    sv: 'Innan något nytt byggs måste teamet kunna svara ja på alla:',
  },
  questions: [
    { en: 'Does this solve an actual user question?', sv: 'Löser detta en faktisk användarfråga?' },
    { en: 'Does data of sufficient quality already exist?', sv: 'Finns redan data av tillräcklig kvalitet?' },
    { en: 'Does this make the system clearer, not more powerful?', sv: 'Gör detta systemet tydligare, inte mäktigare?' },
    { en: 'Can this be misunderstood?', sv: 'Kan detta missförstås?' },
    { en: 'Can this be misused?', sv: 'Kan detta missbrukas?' },
  ],
  rule: {
    en: 'Any "no" → feature dies.',
    sv: 'Minsta "nej" → feature dör.',
  },
};

// ============================================================
// 4. DATA EXPANSION PRIORITY
// ============================================================

export const DATA_EXPANSION_PRIORITY = {
  label: { en: 'Data Expansion', sv: 'Data-expansion' },
  subtitle: { en: 'How to choose right', sv: 'Hur ni väljer rätt' },
  description: {
    en: 'Always prioritize in this order:',
    sv: 'Prioritera alltid i denna ordning:',
  },
  priorities: [
    { order: 1, text: { en: 'Improve existing measures', sv: 'Förbättra befintliga mått' } },
    { order: 2, text: { en: 'Extend time series backwards', sv: 'Förläng tidsserier bakåt' } },
    { order: 3, text: { en: 'Fill geographic gaps', sv: 'Fyll geografiska luckor' } },
    { order: 4, text: { en: 'Only then: new indicators', sv: 'Först därefter: nya indikatorer' } },
  ],
  principle: {
    en: 'Depth beats breadth. Always.',
    sv: 'Djup slår bredd. Alltid.',
  },
};

// ============================================================
// 5. AI USAGE RULES
// ============================================================

export const AI_USAGE_RULES = {
  label: { en: 'AI Usage', sv: 'AI-användning' },
  subtitle: { en: 'How to not lose control', sv: 'Hur ni inte tappa kontrollen' },
  allowedFor: [
    { en: 'Quality control', sv: 'Kvalitetskontroll' },
    { en: 'Pattern discovery', sv: 'Mönsterupptäckt' },
    { en: 'Language simplification', sv: 'Språkförenkling' },
    { en: 'Stability testing', sv: 'Stabilitetstest' },
  ],
  notAllowedFor: [
    { en: 'Conclusions', sv: 'Slutsatser' },
    { en: 'Priorities', sv: 'Prioriteringar' },
    { en: '"What should be done"', sv: '"Vad bör göras"' },
    { en: 'Ranking of people or countries', sv: 'Ranking av människor eller länder' },
  ],
  redirect: {
    en: 'If someone wants that → refer to scenario-lab (user responsibility).',
    sv: 'Om någon vill det → hänvisa till scenario-lab (user responsibility).',
  },
};

// ============================================================
// 6. TEAM PSYCHOLOGY
// ============================================================

export const TEAM_PSYCHOLOGY = {
  label: { en: 'Team Psychology', sv: 'Teampsykologi' },
  subtitle: { en: 'This is important', sv: 'Detta är viktigt' },
  context: {
    en: 'You are building something that is big, loaded, and touches the world.',
    sv: 'Ni bygger något som är stort, laddat och berör världen.',
  },
  avoid: [
    { en: 'No internal political discussions', sv: 'Inga interna politiska diskussioner' },
    { en: 'No "what should society do"', sv: 'Inga "vad borde samhället göra"' },
    { en: 'No "what if people misunderstand"', sv: 'Inget "tänk om folk missförstår"' },
  ],
  alwaysAnswer: [
    { en: '"What does the data show?"', sv: '"Vad visar datan?"' },
    { en: '"What can we not say?"', sv: '"Vad kan vi inte säga?"' },
  ],
};

// ============================================================
// 7. PAUSE SIGNALS
// ============================================================

export const PAUSE_SIGNALS = {
  label: { en: 'When to Pause', sv: 'När ni ska pausa' },
  signals: [
    { en: 'You start arguing about conclusions', sv: 'Ni börjar argumentera om slutsatser' },
    { en: 'You start defending yourselves publicly', sv: 'Ni börjar försvara er offentligt' },
    { en: 'You start feeling responsible for how data is used', sv: 'Ni börjar känna er ansvariga för hur data används' },
    { en: 'You start wanting to "steer narrative"', sv: 'Ni börjar vilja "styra narrativ"' },
  ],
  principles: [
    { en: 'Pause is not failure', sv: 'Paus är inte misslyckande' },
    { en: 'Pause is integrity', sv: 'Paus är integritet' },
  ],
};

// ============================================================
// 8. PERSONAL STANCE
// ============================================================

export const PERSONAL_OPERATIONS = {
  label: { en: 'The Personal', sv: 'Det personliga' },
  subtitle: { en: 'Important for you', sv: 'Viktigt för dig' },
  notNeeded: [
    { en: 'Convince the world', sv: 'Övertyga världen' },
    { en: 'Win debates', sv: 'Vinna debatter' },
    { en: 'Become the public face', sv: 'Bli ansikte utåt' },
    { en: 'Get invited to forums', sv: 'Bli inbjuden till forum' },
  ],
  truth: {
    en: 'If the system is right: the world will come to it out of self-interest.',
    sv: 'Om systemet är rätt: kommer världen till det av egenintresse.',
  },
};

// ============================================================
// 9. SOBER CONCLUSION
// ============================================================

export const SOBER_CONCLUSION = {
  label: { en: 'Conclusion', sv: 'Slutsats' },
  subtitle: { en: 'Sober', sv: 'Nykter' },
  whatItIs: {
    en: 'This is not humanity\'s reference. It is a shared measurement table.',
    sv: 'Det här är inte mänsklighetens facit. Det är ett gemensamt mätbord.',
  },
  sufficiency: {
    en: 'And that goes a long way.',
    sv: 'Och det räcker långt.',
  },
  beyondIt: {
    label: { en: 'Everything beyond that:', sv: 'Allt över det:' },
    items: [
      { en: 'is politics', sv: 'är politik' },
      { en: 'is valuation', sv: 'är värdering' },
      { en: 'is human', sv: 'är mänskligt' },
    ],
  },
  acceptance: {
    en: 'That is okay. But that is not the system\'s task.',
    sv: 'Det är okej. Men det är inte systemets uppgift.',
  },
};

// ============================================================
// COMPLETE OPERATIONS CONFIGURATION
// ============================================================

export const OPERATIONAL_DRIFT_CONFIG = {
  version: '1.0.0',
  locked: true,
  weeklyRhythm: WEEKLY_RHYTHM,
  improvementRule: IMPROVEMENT_RULE,
  featureGate: FEATURE_GATE,
  dataExpansionPriority: DATA_EXPANSION_PRIORITY,
  aiUsageRules: AI_USAGE_RULES,
  teamPsychology: TEAM_PSYCHOLOGY,
  pauseSignals: PAUSE_SIGNALS,
  personalOperations: PERSONAL_OPERATIONS,
  soberConclusion: SOBER_CONCLUSION,
};

// ============================================================
// VALIDATION
// ============================================================

export function validateOperationsCompleteness(): { complete: boolean; sections: number } {
  const sections = [
    WEEKLY_RHYTHM,
    IMPROVEMENT_RULE,
    FEATURE_GATE,
    DATA_EXPANSION_PRIORITY,
    AI_USAGE_RULES,
    TEAM_PSYCHOLOGY,
    PAUSE_SIGNALS,
    PERSONAL_OPERATIONS,
    SOBER_CONCLUSION,
  ];
  return { complete: sections.length === 9, sections: sections.length };
}
